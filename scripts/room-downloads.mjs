import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';

// Package only URLs used by the entrance. Each immutable archive includes its own offset directory.
export async function roomDownloads() {
  const sources = await Promise.all(['room','lab'].map(name=>readFile(`site/${name}.js`,'utf8')));
  const urls = new Set(sources.flatMap(source=>[...source.matchAll(/['"](\.\/media\/[\w./-]+\.(?:webp|glb))['"]/g)].map(match=>match[1])));
  const entries = await Promise.all([...urls].map(async url=>({url,bytes:await readFile('_site/'+url)})));
  const groups = Array.from({length:3},()=>({length:0,entries:[]}));
  for (const entry of entries.sort((a,b)=>b.bytes.length-a.bytes.length || a.url.localeCompare(b.url))) {
    const group=groups.reduce((a,b)=>a.length<=b.length?a:b);
    group.entries.push(entry);
    group.length+=entry.bytes.length;
  }
  return Promise.all(groups.map(async group=>{
    const directory=Buffer.from(JSON.stringify(group.entries.map(({url,bytes})=>[url,bytes.length])));
    const prefix=Buffer.alloc(4);
    prefix.writeUInt32LE(directory.length);
    const data=gzipSync(Buffer.concat([prefix,directory,...group.entries.map(e=>e.bytes)]),{level:9});
    const id=createHash('sha256').update(data).digest('hex').slice(0,20);
    const url=`./assets/study-${id}.gz`;
    await writeFile('_site/'+url,data);
    return {url,bytes:data.length};
  }));
}
