"""Ray-trace room occlusion, multiple sun-shadow phases, desk-lamp visibility, and reflection probes.

Serve site/ over HTTP and run with the existing Embree/Playwright environment:
    python tools/bake-study.py http://127.0.0.1:8934/
"""

import argparse
import base64
import io
from pathlib import Path

import numpy as np
from embreex.mesh_construction import TriangleMesh
from embreex.rtcore_scene import EmbreeScene
from PIL import Image, ImageFilter
from playwright.sync_api import sync_playwright


SITE = Path(__file__).resolve().parent.parent / 'site'

CAPTURE = '''async includeReflections => {
  const T = await import(new URL('./vendor/three.module.js', location.href));
  const { buildHome } = await import(new URL('./room.js', location.href));
  let ready, fail;
  const pending = new Promise((resolve, reject) => { ready = resolve; fail = reject; });
  const home = buildHome('./media/paper-screen.webp', () => {}, {
    ready, error: url => fail(new Error(`Room asset unavailable: ${url}`)), skipBakedLighting: true
  });
  await pending;
  home.scene.updateMatrixWorld(true);

  const defaultReceivers = {
    'desk-wall':[1,0,0,288,264,1.15], floor:[0,1,0,320,384,1.40],
    ceiling:[0,-1,0,256,320,1.55], 'back-wall':[0,0,1,384,192,1.30],
    worktop:[0,1,0,384,192,.43], rug:[0,1,0,256,224,.95], 'desk-felt':[0,1,0,256,128,.18]
  };
  const receivers = home.scene.userData.bakeReceivers ?? defaultReceivers;
  const windReceivers = new Set(home.scene.userData.sunWindReceivers);
  const canopy = home.scene.getObjectByName('wind-shadow-canopy');
  if (!canopy) throw new Error('Missing wind-shadow canopy');
  const canopyMeshes = new Set();
  canopy.traverse(node=>{ if (node.isMesh) canopyMeshes.add(node); });
  const triangles = [], surfaces = {};
  const local = new T.Matrix4(), world = new T.Matrix4(), normalMatrix = new T.Matrix3();
  const normal = new T.Vector3(), point = new T.Vector3();
  function captureMesh(mesh, target, face) {
    if (!mesh.isMesh || !mesh.visible || mesh.userData.skipBake) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    if (materials.every(material => material.transparent || material.isMeshBasicMaterial)) return;
    const geometry = mesh.geometry, positions = geometry.attributes.position;
    const indexed = geometry.index;
    const direction = face && new T.Vector3(...face.slice(0,3));
    const uv = geometry.attributes.uv1 ?? geometry.attributes.uv;
    const corners = new Map();
    for (let index = 0; index < (mesh.isInstancedMesh ? mesh.count : 1); index++) {
      world.copy(mesh.matrixWorld);
      if (mesh.isInstancedMesh) { mesh.getMatrixAt(index, local); world.multiply(local); }
      if (face) normalMatrix.getNormalMatrix(world);
      const transformed = [];
      for (let i = 0; i < positions.count; i++) {
        const position = point.fromBufferAttribute(positions,i).applyMatrix4(world).toArray();
        transformed.push(position);
        if (!face || normal.fromBufferAttribute(geometry.attributes.normal,i).applyNormalMatrix(normalMatrix).dot(direction)<.999) continue;
        const u = uv.getX(i), v = uv.getY(i);
        if ((u===0 || u===1) && (v===0 || v===1)) corners.set(`${u},${v}`,position);
      }
      for (let i = 0; i < (indexed?.count ?? positions.count); i++) {
        target.push(...transformed[indexed ? indexed.getX(i) : i]);
      }
    }
    if (face) {
      const basis = mesh.userData.bakeCorners?.map(corner => point.fromArray(corner).applyMatrix4(mesh.matrixWorld).toArray())
        ?? ['0,0','1,0','0,1'].map(corner => corners.get(corner));
      if (!basis.every(Boolean)) throw new Error(`Missing planar UV corners for ${mesh.name}`);
      surfaces[mesh.name] = { basis, direction: direction.toArray(), size: face.slice(3,5), radius: face[5],
        wind: windReceivers.has(mesh.name) };
    }
  }
  home.scene.traverse(mesh => {
    if (!canopyMeshes.has(mesh)) captureMesh(mesh,triangles,receivers[mesh.name]);
  });
  for (const name of Object.keys(receivers)) if (!surfaces[name]) throw new Error(`Missing occlusion receiver: ${name}`);
  const sun = home.scene.getObjectByName('windowSun');
  const sunDirection = sun?.getWorldPosition(point).sub(sun.target.getWorldPosition(normal)).normalize().toArray();
  const lampPosition=home.scene.getObjectByName('deskLampBounce').getWorldPosition(point).toArray();
  function pack(vertices) {
    const bytes = new Uint8Array(Float32Array.from(vertices).buffer);
    let packed = '';
    for (let i = 0; i < bytes.length; i += 16384) packed += String.fromCharCode(...bytes.subarray(i,i+16384));
    return btoa(packed);
  }
  const foliage = [-1,0,1].map(bend=>{
    home.setCanopyBend(bend);
    home.scene.updateMatrixWorld(true);
    const vertices=[];
    for (const mesh of canopyMeshes) captureMesh(mesh,vertices);
    return pack(vertices);
  });
  home.setCanopyBend(0);
  home.scene.updateMatrixWorld(true);
  const geometry={ triangles:pack(triangles), foliage, surfaces, sunDirection, lampPosition };
  if (!includeReflections) return { ...geometry, reflections: [] };

  home.monitorSurface.visible = false;
  const renderer = new T.WebGLRenderer({ antialias:false, preserveDrawingBuffer:true });
  renderer.setSize(1024,512,false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  const cube = new T.WebGLCubeRenderTarget(256,{type:T.HalfFloatType});
  const capture = new T.CubeCamera(.04,16,cube);
  capture.position.copy(home.center).addScaledVector(home.normal,.38);
  const output = new T.Scene(), camera = new T.OrthographicCamera(-1,1,1,-1,-1,1);
  const material = new T.ShaderMaterial({uniforms:{source:{value:cube.texture}},
    vertexShader:'varying vec2 tex; void main(){tex=uv;gl_Position=vec4(position.xy,0.,1.);}',
    fragmentShader:`varying vec2 tex; uniform samplerCube source;
      void main(){
        float a=(tex.x-.5)*6.2831853, b=(tex.y-.5)*3.14159265;
        vec3 d=vec3(cos(b)*cos(a),sin(b),cos(b)*sin(a));
        vec3 light=textureCube(source,d).rgb;
        gl_FragColor=vec4(light/(1.+light*.32),1.);
        #include <colorspace_fragment>
      }`});
  output.add(new T.Mesh(new T.PlaneGeometry(2,2),material));
  const reflections = [];
  for (const night of [false,true]) {
    home.setNight(night);
    home.scene.environment = null;
    capture.update(renderer,home.scene);
    renderer.setRenderTarget(null);
    renderer.render(output,camera);
    reflections.push(renderer.domElement.toDataURL('image/png').split(',')[1]);
  }
  cube.dispose();
  renderer.dispose();
  return { ...geometry, reflections };
}'''


def unpack_triangles(data):
    return np.frombuffer(base64.b64decode(data), dtype=np.float32).reshape(-1, 3, 3)


def sun_visibility(origin, direction, sun_tangent, sun_bitangent, scene, samples, canopy_phases=()):
    opening = np.zeros(len(origin))
    transmitted = np.zeros((len(canopy_phases), len(origin)))
    for i in range(samples):
        radius = .009 * np.sqrt((i + .5) / samples)
        angle = i * 2.39996323
        ray = direction + radius * (np.cos(angle) * sun_tangent + np.sin(angle) * sun_bitangent)
        rays = np.broadcast_to(ray.astype('f4'), origin.shape).copy()
        open_indices = np.flatnonzero(scene.run(origin, rays, query='DISTANCE') > 80)
        opening[open_indices] += 1
        if open_indices.size and canopy_phases:
            open_origins, open_rays = origin[open_indices], rays[open_indices]
            for phase, canopy in enumerate(canopy_phases):
                transmitted[phase, open_indices] += canopy.run(open_origins, open_rays, query='DISTANCE') > 80
    return opening / samples, transmitted / samples


def sun_image(visibility, width, height):
    pixels = (255 * visibility.reshape(height, width)).astype('uint8')
    return Image.fromarray(pixels).filter(ImageFilter.GaussianBlur(.46))


def bake(capture, output):
    triangles = unpack_triangles(capture['triangles'])
    foliage = [unpack_triangles(phase) for phase in capture['foliage']]
    scene = EmbreeScene()
    fixed_scene = EmbreeScene()
    canopy_phases = [EmbreeScene() for _ in foliage]
    meshes = [TriangleMesh(scene, triangles), TriangleMesh(scene, foliage[1]), TriangleMesh(fixed_scene, triangles)]
    meshes += [TriangleMesh(phase, vertices) for phase, vertices in zip(canopy_phases, foliage)]
    rng = np.random.default_rng(34)
    lamp_center = np.asarray(capture['lampPosition'], np.float32)
    sun_dir = np.asarray(capture.get('sunDirection', [0, 1, 0]), np.float32)
    sun_tangent = np.cross(sun_dir, np.asarray([0, 0, 1], np.float32))
    sun_tangent /= np.linalg.norm(sun_tangent)
    sun_bitangent = np.cross(sun_dir, sun_tangent)
    for name, surface in capture['surfaces'].items():
        a, b, c = np.asarray(surface['basis'], np.float32)
        normal = np.asarray(surface['direction'], np.float32)
        width, height = surface['size']
        radius = surface['radius']
        v, u = np.mgrid[:height, :width]
        origin = (a + (u[..., None] + .5) / width * (b - a)
                  + (1 - (v[..., None] + .5) / height) * (c - a)
                  + .0015 * normal).reshape(-1, 3).astype('f4')
        tangent = (b - a) / np.linalg.norm(b - a)
        bitangent = np.cross(normal, tangent)
        phase = rng.uniform(0, 2 * np.pi, len(origin)).astype('f4')
        occlusion = np.zeros(len(origin))
        samples = 72
        for i in range(samples):
            distance = np.sqrt((i + .5) / samples)
            angle = phase + i * 2.39996323
            direction = ((np.cos(angle)[:, None] * tangent + np.sin(angle)[:, None] * bitangent)
                         * distance + normal * np.sqrt(1 - distance * distance)).astype('f4')
            hit = scene.run(origin, direction, query='DISTANCE')
            occlusion += np.where((hit >= 0) & (hit < radius * 8), np.exp(-np.maximum(hit, 0) / radius), 0)
        light = np.clip(1 - .93 * occlusion.reshape(height, width) / samples, .15, 1)
        opening = np.zeros(len(origin))
        phases = canopy_phases if surface['wind'] else ()
        transmitted = np.zeros((len(phases), len(origin)))
        if np.dot(normal, sun_dir) > 0:
            opening, transmitted = sun_visibility(
                origin, sun_dir, sun_tangent, sun_bitangent, fixed_scene if phases else scene, samples, phases
            )
        ao_image = Image.fromarray((255 * light).astype('uint8')).filter(ImageFilter.GaussianBlur(.68))
        direct_image = sun_image(opening, width, height)
        if phases:
            # Each wind channel describes foliage only, conditioned on sun rays that clear fixed geometry.
            # Fixed shade remains identically zero before, during and after every crossfade.
            fixed = np.asarray(direct_image, dtype=np.float32)
            channels = []
            for transmitted_phase in transmitted:
                visible = np.asarray(sun_image(transmitted_phase, width, height), dtype=np.float32)
                conditional = np.divide(255 * visible, fixed, out=np.full_like(fixed, 255), where=fixed > 0)
                channels.append(Image.fromarray(np.clip(np.rint(conditional), 0, 255).astype('uint8')))
            Image.merge('RGB', tuple(channels)).save(output / f'sun-wind-{name}.webp', lossless=True, method=6)
        lamp = np.zeros(len(origin))
        lamp_samples = 36
        for i in range(lamp_samples):
            rho = .042 * np.sqrt((i + .5) / lamp_samples)
            angle = i * 2.39996323
            offset = rho * np.array([np.cos(angle), np.sin(angle) * .45, np.sin(angle)], np.float32)
            rays = lamp_center + offset - origin
            distances = np.maximum(.001, np.linalg.norm(rays, axis=1))
            directions = (rays / distances[:, None]).astype('f4')
            hit = scene.run(origin, directions, query='DISTANCE')
            lamp += (hit > distances - .001) & ((directions @ normal) > 0)
        lamp_mask = (lamp.reshape(height, width) * 255 / lamp_samples).astype('uint8')
        lamp_image = Image.fromarray(lamp_mask).filter(ImageFilter.GaussianBlur(.49))
        Image.merge('RGB', (ao_image, direct_image, lamp_image)).save(
            output / f'ao-{name}.webp', lossless=True, method=6
        )
        light_fraction = transmitted[1].mean() if phases else opening.mean()
        print(f'{name}: mean indirect visibility {light.mean():.3f}, open sun fraction {light_fraction:.3f}, mean lamp visibility {lamp.mean()/lamp_samples:.3f}', flush=True)
    for mode, data in zip(('day', 'night'), capture['reflections']):
        with Image.open(io.BytesIO(base64.b64decode(data))) as image:
            image.convert('RGB').save(output / f'reflection-{mode}.webp', quality=88, method=6)
        print(f'{mode}: captured room reflection', flush=True)
    del meshes


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('url', help='HTTP address of the served study root')
    parser.add_argument('--output', type=Path, default=SITE / 'media/study')
    parser.add_argument('--ao-only', action='store_true')
    args = parser.parse_args()
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(args=['--enable-gpu', '--use-gl=angle', '--use-angle=metal'])
        page = browser.new_page()
        page.goto(args.url.rstrip('/') + '/?view=paper', wait_until='domcontentloaded')
        data = page.evaluate(CAPTURE, not args.ao_only)
        browser.close()
    args.output.mkdir(parents=True, exist_ok=True)
    bake(data, args.output)


if __name__ == '__main__':
    main()
