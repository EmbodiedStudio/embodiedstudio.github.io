import { packRoomModels } from './pack-room-models.mjs';
import { build, transform } from 'esbuild';
import { roomDownloads } from './room-downloads.mjs';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

await mkdir('_site', { recursive: true });
await cp('site', '_site', { recursive: true });
await packRoomModels('_site/media/study');
await rm('_site/assets', { recursive: true, force: true });
const result = await build({
  entryPoints: ['site/lab.js'],
  outdir: '_site/assets',
  entryNames: '[name]-[hash]',
  chunkNames: '[name]-[hash]',
  format: 'esm',
  splitting: true,
  bundle: true,
  minify: true,
  target: 'es2022',
  metafile: true
});
const [output, entry] = Object.entries(result.metafile.outputs)
  .find(([, file]) => file.entryPoint === 'site/lab.js');
const publicPath = file => './' + path.relative('_site', file).split(path.sep).join('/');
const preload = [output, ...entry.imports.filter(item => item.kind === 'import-statement').map(item => item.path)]
  .map(file => `  <link rel="modulepreload" href="${publicPath(file)}">`).join('\n');
const nativeFiles=new Set();
function collect(file) {
  if(nativeFiles.has(file)) return;
  nativeFiles.add(file);
  for(const dep of result.metafile.outputs[file].imports) if(dep.kind==='import-statement') collect(dep.path);
}
for(const [file,info] of Object.entries(result.metafile.outputs)) {
  if(['site/room.js','site/vendor/three.module.js'].includes(info.entryPoint)) collect(file);
}
for(const dep of entry.imports) nativeFiles.delete(dep.path);
const packs=await roomDownloads();
const boot=`<script>
window.studyPacks=${JSON.stringify(packs)};
if(!location.hash && new URLSearchParams(location.search).get('view')!=='paper'){
  for(const url of ${JSON.stringify([...nativeFiles].map(publicPath))}){
    const link=document.createElement('link');link.rel='modulepreload';link.href=url;document.head.append(link);
  }
  if('DecompressionStream' in window){
    window.studyDownloads=window.studyPacks.map(pack=>({...pack,
      response:fetch(pack.url,{cache:'force-cache'}).catch(()=>null)
    }));
  }
}
</script>`;
const css=await transform(await readFile('site/site.css','utf8'),{loader:'css',minify:true});
const html=(await readFile('site/index.html','utf8'))
  .replace(/  <link rel="modulepreload"[^>]*>\n/g,'')
  .replace('  <link rel="stylesheet" href="./site.css">',()=>preload+'\n'+boot+'\n<style>'+css.code+'</style>')
  .replace('type="module" src="./lab.js"',`type="module" src="${publicPath(output)}"`);
await writeFile('_site/index.html',html);
