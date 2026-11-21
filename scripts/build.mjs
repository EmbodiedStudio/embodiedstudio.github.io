import { packRoomModels } from './pack-room-models.mjs';
import { build } from 'esbuild';
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
const html = (await readFile('site/index.html', 'utf8'))
  .replace(/  <link rel="modulepreload"[^>]*>\n/g, '')
  .replace('  <link rel="stylesheet"', preload + '\n  <link rel="stylesheet"')
  .replace('type="module" src="./lab.js"', `type="module" src="${publicPath(output)}"`);
await writeFile('_site/index.html', html);
