import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { MeshoptEncoder } from 'meshoptimizer/encoder';
import { MeshoptDecoder } from 'meshoptimizer/decoder';

// Room furnishings only. Keep all source accessors, texture data and triangle order.
export async function packRoomModels(directory) {
  await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
  for (const name of await fs.readdir(directory)) {
    if (!name.endsWith('.glb')) continue;
    const file = path.join(directory,name);
    const source = await fs.readFile(file);
    const jsonLength = source.readUInt32LE(12);
    const scene = JSON.parse(source.subarray(20,20+jsonLength));
    const binary = source.subarray(28+jsonLength);
    if (scene.buffers.length !== 1) throw new Error('Expected a self-contained GLB: '+name);
    const indexAccessors = new Set(scene.meshes.flatMap(mesh => mesh.primitives.map(p => p.indices)));
    const sizes = {5120:1,5121:1,5122:2,5123:2,5125:4,5126:4};
    const dimensions = {SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16};
    const segments = [];
    let size = 0, fallbackSize = 0;
    for (const [i, view] of scene.bufferViews.entries()) {
      const start = view.byteOffset || 0;
      const bytes = binary.subarray(start,start+view.byteLength);
      const index = scene.accessors.findIndex(accessor => accessor.bufferView === i);
      const accessor = scene.accessors[index];
      let stored = bytes;
      view.byteOffset = size;
      if (accessor) {
        const mode = indexAccessors.has(index) ? 'INDICES' : 'ATTRIBUTES';
        const stride = view.byteStride || sizes[accessor.componentType]*dimensions[accessor.type];
        const count = bytes.length/stride;
        if (Number.isInteger(count) && (mode==='INDICES' ? [2,4].includes(stride) : stride%4===0 && stride<=256)) {
          const encoded = Buffer.from(MeshoptEncoder.encodeGltfBuffer(bytes,count,stride,mode));
          if (gzipSync(encoded).length < gzipSync(bytes).length) {
            const check = new Uint8Array(bytes.length);
            MeshoptDecoder.decodeGltfBuffer(check,count,stride,encoded,mode);
            if (!bytes.equals(check)) throw new Error('Non-identical decoded bytes in '+name);
            const ext = {buffer:0,byteOffset:size,byteLength:encoded.length,byteStride:stride,count,mode};
            view.extensions = {...view.extensions,EXT_meshopt_compression:ext};
            view.buffer = 1;
            view.byteOffset = fallbackSize;
            fallbackSize += (bytes.length+3)&~3;
            stored = encoded;
          }
        }
      }
      segments.push(stored);
      const padding = (4-stored.length%4)%4;
      if (padding) segments.push(Buffer.alloc(padding));
      size += stored.length+padding;
    }
    if (!fallbackSize) continue;
    scene.buffers = [{byteLength:size},{byteLength:fallbackSize,extensions:{EXT_meshopt_compression:{fallback:true}}}];
    for(const key of ['extensionsUsed','extensionsRequired']) {
      scene[key] = [...new Set([...(scene[key]||[]),'EXT_meshopt_compression'])];
    }
    const json = Buffer.from(JSON.stringify(scene));
    const jsonSize = (json.length+3)&~3;
    const head = Buffer.alloc(20);
    head.write('glTF'); head.writeUInt32LE(2,4); head.writeUInt32LE(28+jsonSize+size,8);
    head.writeUInt32LE(jsonSize,12); head.write('JSON',16);
    const bin = Buffer.alloc(8);bin.writeUInt32LE(size);bin.write('BIN\0',4);
    await fs.writeFile(file,Buffer.concat([head,json,Buffer.alloc(jsonSize-json.length,32),bin,...segments]));
    console.log(name,source.length,'->',28+jsonSize+size);
  }
}
