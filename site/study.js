import { studyData } from './study-data.js';
import { corpus } from './corpus.js';
import { tr } from './locale.js';
import { setupMethodDiagram } from './method-diagram.js';

const SCENE_METRICS = [
  { idx: 1, key: 'READY', max: 100, dir: 'up', label: ['任务就绪度', 'Task readiness'] },
  { idx: 3, key: 'PHYS', max: 100, dir: 'up', label: ['物理稳定性', 'Physical stability'] },
  { idx: 0, key: 'MATCH', max: 100, dir: 'up', label: ['需求匹配', 'Request match'] },
  { idx: 2, key: 'GEO', max: 100, dir: 'up', label: ['几何有效性', 'Geometric validity'] },
  { idx: 4, key: 'VIS', max: 5, dir: 'up', label: ['视觉质量', 'Visual quality'] }
];

const RUBRIC_METRICS = [
  { idx: 1, key: 'Expr.', max: 100, dir: 'up', label: ['条件表达正确度', 'Correct expression'] },
  { idx: 2, key: 'BA', max: 100, dir: 'up', label: ['平衡准确率', 'Balanced accuracy'] },
  { idx: 3, key: 'Acc.', max: 100, dir: 'up', label: ['准确率', 'Accuracy'] },
  { idx: 6, key: 'LBC', max: 100, dir: 'up', label: ['布局泛化', 'Layout probe LBC'] },
  { idx: 0, key: 'Cov.', max: 100, dir: 'up', label: ['条件覆盖', 'Coverage'] },
  { idx: 4, key: 'FPR', max: 100, dir: 'down', label: ['误报率', 'False-positive rate'] },
  { idx: 5, key: 'FNR', max: 100, dir: 'down', label: ['漏判率', 'False-negative rate'] }
];

const sceneColumns = ['MATCH', 'READY', 'GEO', 'PHYS', 'VIS'];
const rubricColumns = ['Cov.', 'Expr.', 'BA', 'Acc.', 'FPR', 'FNR', 'LBC'];
const svgNS = 'http://www.w3.org/2000/svg';

const labels = {
  tabletop: ['桌面', 'Tabletop'],
  room: ['单房间', 'Single room'],
  multi: ['多房间', 'Multi-room'],
  initial: ['初态', 'Initial'],
  opened: ['打开抽屉', 'Drawer opened'],
  inserted: ['笔已放入', 'Pen inserted'],
  closed: ['关上抽屉', 'Drawer closed'],
  success: ['成功', 'Success'],
  complete: ['完成', 'Complete'],
  completed: ['完成', 'Complete']
};

const abstractZh = '跨任务训练和评估机器人，需要能满足不同任务要求的仿真环境。已有场景和任务生成器可以扩大环境供给，但交付可用环境仍面临两个问题：视觉上合理的场景往往无法支持预期交互，或无法在仿真中保持物理稳定；生成的评分程序也经常尝试覆盖任务条件，却未能忠实实现这些条件。我们提出 EmbodiedStudio，一个由任务驱动的仿真生成平台，在闭环仿真反馈与独立审核下联合编写场景、任务、机器人行为与评分程序。编码代理在仿真中反复调试这些程序与有状态评分规则，过程中自然留下两类记录：用于学习搭建环境的正向构建经验，以及用于策略学习的物理执行经验。两类记录均绑定到冻结的环境版本，便于重复评测。实验表明，EmbodiedStudio 显著提高了任务就绪度、评分忠实度与物理稳定性，并为布局设计与策略微调提供了有效监督信号。';

const $ = id => document.getElementById(id);
const local = pair => tr(...pair);
const label = key => (labels[key] ? local(labels[key]) : key);
const omittedModels = new Set((document.documentElement.dataset.offlineOmitted || '').split(','));

function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function methodName(name) {
  if (name === 'w/o simulation-feedback revision') return tr('去掉仿真反馈修订', name);
  if (name === 'w/o independent review') return tr('去掉独立审核', name);
  return name;
}

function extractCoreTask(request) {
  if (!request) return '';
  const match = request.match(/Task:\s*([^\n]+)/i);
  if (match) return match[1].trim();
  return request.split('\n')[0].trim();
}

function setupLightbox() {
  const modal = $('figure-lightbox');
  const img = $('lightbox-img');
  const caption = $('lightbox-caption');
  const download = $('lightbox-download');
  const closeBtn = $('lightbox-close');
  if (!modal || !img) return { open() {}, close() {} };

  function close() {
    modal.hidden = true;
    document.body.classList.remove('lightbox-open');
  }
  function open(src, cap = '', filename = '') {
    img.src = src;
    img.alt = cap;
    if (caption) caption.textContent = cap;
    if (download) {
      download.href = src;
      download.download = filename || src.split('/').pop() || 'EmbodiedStudio-figure.webp';
      download.textContent = tr('下载原图', 'Download');
    }
    modal.hidden = false;
    document.body.classList.add('lightbox-open');
    closeBtn?.focus({ preventScroll: true });
  }
  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', e => {
    if (e.target === modal) close();
  });
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
  for (const trigger of document.querySelectorAll('[data-zoom-src]')) {
    trigger.addEventListener('click', () => {
      const cap = tr(trigger.dataset.zoomZh || '', trigger.dataset.zoomEn || '');
      open(trigger.dataset.zoomSrc, cap, trigger.dataset.zoomDownload || '');
    });
  }
  return { open, close };
}

function renderDataTable(target, columns, data, bestDirections) {
  const tbl = el('table');
  const header = tbl.createTHead().insertRow();
  for (const name of [tr('方法', 'Method'), ...columns]) {
    const cell = el('th', name);
    cell.scope = 'col';
    header.append(cell);
  }
  const bestPerCol = columns.map((_, c) => {
    const vals = data.map(row => row[c + 1]);
    return bestDirections[c] === 'down' ? Math.min(...vals) : Math.max(...vals);
  });
  const body = tbl.createTBody();
  for (const [name, ...values] of data) {
    const row = body.insertRow();
    if (name.startsWith('EmbodiedStudio')) row.className = 'row-primary';
    else if (name.startsWith('w/o ')) row.className = 'row-ablation';
    const th = el('th', methodName(name));
    th.scope = 'row';
    row.append(th);
    values.forEach((val, c) => {
      const td = row.insertCell();
      td.textContent = val.toFixed(2);
      if (Math.abs(val - bestPerCol[c]) < 1e-6) td.className = 'cell-best';
    });
  }
  const scroll = el('div', undefined, 'table-scroll');
  scroll.append(tbl);
  target.replaceChildren(scroll);
}

function makeCard(id, name, image, detail, selected, click, badgeText = '') {
  const button = el('button', undefined, 'case-card');
  button.type = 'button';
  button.dataset.case = id;
  button.setAttribute('aria-pressed', String(selected));
  const thumbWrap = el('div', undefined, 'case-thumb');
  const poster = el('img');
  poster.src = image;
  poster.alt = '';
  poster.loading = 'lazy';
  poster.decoding = 'async';
  thumbWrap.append(poster);
  if (badgeText) thumbWrap.append(el('span', badgeText, 'case-badge'));
  const meta = el('div', undefined, 'case-meta');
  meta.append(el('strong', name), el('small', detail));
  button.append(thumbWrap, meta);
  button.addEventListener('click', click);
  return button;
}

function setupSceneResults() {
  const pillRoot = $('scene-metric-pills');
  const scopeRoot = $('scene-scope-tabs');
  const chartRoot = $('scene-chart');
  const insightRoot = $('scene-insight');
  let metricIdx = 0; // READY
  let scope = 'baselines';

  const scopes = [
    { id: 'baselines', label: ['基线对比', 'Baselines'] },
    { id: 'ablations', label: ['机制消融', 'Ablations'] },
    { id: 'all', label: ['全部', 'All'] }
  ];

  function getRows() {
    if (scope === 'baselines') return studyData.scene.slice(0, 6);
    if (scope === 'ablations') return studyData.scene.slice(5);
    return studyData.scene;
  }

  function render() {
    const meta = SCENE_METRICS[metricIdx];
    const rows = getRows();

    pillRoot.replaceChildren(
      ...SCENE_METRICS.map((m, i) => {
        const b = el('button', undefined, `metric-pill${i === metricIdx ? ' is-active' : ''}`);
        b.type = 'button';
        b.dataset.sceneMetric = m.key;
        b.setAttribute('aria-pressed', String(i === metricIdx));
        b.append(el('span', m.key, 'pill-code'), el('small', local(m.label)));
        b.addEventListener('click', () => {
          metricIdx = i;
          render();
        });
        return b;
      })
    );

    scopeRoot.replaceChildren(
      ...scopes.map(s => {
        const b = el('button', local(s.label), `scope-pill${s.id === scope ? ' is-active' : ''}`);
        b.type = 'button';
        b.dataset.sceneScope = s.id;
        b.setAttribute('aria-pressed', String(s.id === scope));
        b.addEventListener('click', () => {
          scope = s.id;
          render();
        });
        return b;
      })
    );

    chartRoot.setAttribute('aria-label', `${meta.key} · ${local(meta.label)}`);
    const axis = el('div', undefined, 'metric-axis');
    const marks = el('span');
    const ticks = meta.max === 5 ? [0, 1.25, 2.5, 3.75, 5] : [0, 25, 50, 75, 100];
    for (const tick of ticks) marks.append(el('b', String(tick)));
    axis.append(el('span', `${local(meta.label)} · ${meta.key} ↑`), marks, el('span'));

    const bars = rows.map(([name, ...values]) => {
      const val = values[meta.idx];
      const pct = Math.min(100, (val / meta.max) * 100);
      const isPrimary = name.startsWith('EmbodiedStudio');
      const isAblation = name.startsWith('w/o ');
      const row = el('div', undefined, `metric-row${isPrimary ? ' is-primary' : isAblation ? ' is-ablation' : ''}`);
      const track = el('div', undefined, 'metric-track');
      track.setAttribute('aria-hidden', 'true');
      const bar = el('span', undefined, 'metric-bar');
      bar.style.width = `${pct.toFixed(2)}%`;
      track.append(bar);
      const displayName = isPrimary ? 'EmbodiedStudio' : methodName(name);
      row.append(el('span', displayName, 'metric-name'), track, el('b', val.toFixed(2)));
      return row;
    });
    chartRoot.replaceChildren(axis, ...bars);

    const fullVal = studyData.scene[5][meta.idx + 1];
    const otherRows = scope === 'ablations' ? studyData.scene.slice(6) : studyData.scene.slice(0, 5);
    const best = otherRows.reduce((a, b) => a[meta.idx + 1] >= b[meta.idx + 1] ? a : b);
    const difference = fullVal - best[meta.idx + 1];
    const distance = Math.abs(difference).toFixed(2);
    insightRoot.replaceChildren(
      el('span', `EmbodiedStudio · ${meta.key}`, 'insight-eyebrow'),
      el('strong', fullVal.toFixed(2), 'result-value'),
      el('span', tr(`满分 ${meta.max}`, `Out of ${meta.max}`), 'result-unit'),
      el('p', tr(`较 ${methodName(best[0])} ${difference < 0 ? '低' : '高'} ${distance} 分。`,
        `${distance} points ${difference < 0 ? 'below' : 'above'} ${methodName(best[0])}.`))
    );
  }

  render();
  return render;
}

function setupRubricResults() {
  const pillRoot = $('rubric-metric-pills');
  const chartRoot = $('rubric-chart');
  const insightRoot = $('rubric-insight');
  let metricIdx = 0;

  function render() {
    const meta = RUBRIC_METRICS[metricIdx];
    const dirArrow = meta.dir === 'down' ? '↓' : '↑';

    pillRoot.replaceChildren(
      ...RUBRIC_METRICS.map((m, i) => {
        const b = el('button', undefined, `metric-pill${i === metricIdx ? ' is-active' : ''}`);
        b.type = 'button';
        b.dataset.rubricMetric = m.key;
        b.setAttribute('aria-pressed', String(i === metricIdx));
        b.append(el('span', `${m.key} ${m.dir === 'down' ? '↓' : '↑'}`, 'pill-code'), el('small', local(m.label)));
        b.addEventListener('click', () => {
          metricIdx = i;
          render();
        });
        return b;
      })
    );

    chartRoot.setAttribute('aria-label', `${meta.key} · ${local(meta.label)}`);
    const axis = el('div', undefined, 'metric-axis');
    const marks = el('span');
    for (const tick of [0, 25, 50, 75, 100]) marks.append(el('b', `${tick}%`));
    axis.append(
      el('span', `${local(meta.label)} · ${meta.key} ${dirArrow}`),
      marks,
      el('span')
    );

    const bars = studyData.rubric.map(([name, ...values]) => {
      const val = values[meta.idx];
      const isPrimary = name.startsWith('EmbodiedStudio');
      const row = el('div', undefined, `metric-row${isPrimary ? ' is-primary' : ''}${meta.dir === 'down' ? ' is-lower-better' : ''}`);
      const track = el('div', undefined, 'metric-track');
      track.setAttribute('aria-hidden', 'true');
      const bar = el('span', undefined, 'metric-bar');
      bar.style.width = `${val}%`;
      track.append(bar);
      row.append(el('span', name, 'metric-name'), track, el('b', `${val.toFixed(2)}%`));
      return row;
    });
    chartRoot.replaceChildren(axis, ...bars);

    const esVal = studyData.rubric[3][meta.idx + 1];
    const bases = studyData.rubric.slice(0, 3);
    const bestBase = bases.reduce((best, r) => (
      meta.dir === 'down' ? (r[meta.idx + 1] < best[meta.idx + 1] ? r : best) : (r[meta.idx + 1] > best[meta.idx + 1] ? r : best)
    ), bases[0]);
    const diff = esVal - bestBase[meta.idx + 1];
    const comparison = diff >= 0
      ? tr(`比 ${bestBase[0]} 高 ${diff.toFixed(2)} 个百分点。`, `${diff.toFixed(2)} percentage points above ${bestBase[0]}.`)
      : tr(`比 ${bestBase[0]} 低 ${Math.abs(diff).toFixed(2)} 个百分点。`, `${Math.abs(diff).toFixed(2)} percentage points below ${bestBase[0]}.`);
    insightRoot.replaceChildren(
      el('span', `EmbodiedStudio · ${meta.key}`, 'insight-eyebrow'),
      el('strong', `${esVal.toFixed(2)}%`, 'result-value'),
      el('span', meta.dir === 'up' ? tr('越高越好 ↑', 'Higher is better ↑') : tr('越低越好 ↓', 'Lower is better ↓'), 'result-unit'),
      el('p', diff === 0 ? tr(`与 ${bestBase[0]} 持平。`, `Level with ${bestBase[0]}.`) : comparison)
    );
  }

  render();
  return render;
}

function gallery(lightbox) {
  const image = $('gallery-poster'), canvas = $('gallery-model');
  const show = $('show-model'), viewButton = $('change-view'), cutawayButton = $('cutaway');
  const status = $('gallery-status'), grid = $('scene-cards');
  const format = $('filter-3d-only'), scale = $('gallery-scale');
  const angles = [...document.querySelectorAll('[data-angle]')];
  const angleName = {
    overview: ['全景俯视', 'Overview'], interior: ['室内机位', 'Interior'], detail: ['桌面近景', 'Close-up']
  };
  let angle = 'overview', selected = corpus.scenes[0], currentView = 0;
  let viewer = null, request = null, showing = false, cutaway = true;
  const has3D = item => Boolean(item.model) && !omittedModels.has(item.id);
  const formatName = item => has3D(item) ? tr('可交互 3D', 'Interactive 3D') : tr('仅渲染图', 'Images only');
  function views(item, viewpoint = angle) {
    return item.views.filter(view => viewpoint === 'all' || view.angle === viewpoint);
  }
  function filteredScenes(viewpoint = angle, size = scale.value, mode = format.value) {
    return corpus.scenes.filter(row => views(row, viewpoint).length &&
      (size === 'all' || row.scale === size) && (mode === 'all' || has3D(row) === (mode === 'model')));
  }

  function cancelModel() {
    request?.abort();
    request = null;
    showing = false;
    viewer?.clear();
  }
  function choose(item) {
    cancelModel();
    selected = item;
    currentView = 0;
    cutaway = true;
    status.textContent = '';
    redraw();
  }
  function paintCards() {
    const source = filteredScenes();
    $('next-scene').disabled = $('previous-scene').disabled = source.length < 2;
    for (const tab of angles) {
      tab.setAttribute('aria-pressed', String(tab.dataset.angle === angle));
      tab.disabled = !filteredScenes(tab.dataset.angle).length;
    }
    for (const option of scale.options) option.disabled = !filteredScenes(angle, option.value).length;
    for (const option of format.options) option.disabled = !filteredScenes(angle, scale.value, option.value).length;
    grid.replaceChildren(
      ...source.map(row =>
        makeCard(
          row.id,
          local(row.name),
          views(row)[row === selected ? currentView : 0].src,
          `${label(row.scale)} · ${local(angleName[views(row)[row === selected ? currentView : 0].angle])}`,
          row === selected,
          () => {
            choose(row);
            const rect = $('scene-detail').getBoundingClientRect();
            if (rect.top < 64 || rect.top > window.innerHeight * .7) {
              $('scene-detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          },
          formatName(row)
        )
      )
    );
    const thumb = grid.querySelector('[aria-pressed="true"]');
    if (thumb) grid.scrollLeft += thumb.getBoundingClientRect().left - grid.getBoundingClientRect().left - (grid.clientWidth - thumb.clientWidth) / 2;
  }
  function redraw() {
    paintCards();
    const name = local(selected.name);
    const available = views(selected);
    const view = available[currentView];
    $('gallery-view-info').textContent = showing ? tr('自由视角 · 可拖动旋转', 'Free view · Drag to orbit') : `${local(angleName[view.angle])} · ${formatName(selected)}`;
    const coreTask = extractCoreTask(selected.request);
    $('gallery-name').textContent = name;
    $('gallery-caption').textContent = coreTask || label(selected.scale);
    image.src = view?.src || corpus.figures.method;
    image.alt = name;
    show.hidden = !has3D(selected);
    show.disabled = !!request;
    show.textContent = showing ? tr('返回渲染图', 'Show render') : tr('查看 3D 模型', 'Open 3D model');
    show.setAttribute('aria-pressed', String(showing));
    viewButton.hidden = available.length < 2 || showing;
    cutawayButton.hidden = !showing || !selected.enclosure?.length;
    cutawayButton.textContent = cutaway ? tr('显示外壳', 'Show exterior') : tr('剖视内部', 'Cutaway');
    cutawayButton.setAttribute('aria-pressed', String(cutaway));
    const next = available[(currentView + 1) % available.length];
    viewButton.textContent = tr(`切到${local(angleName[next.angle])}`, `Show ${local(angleName[next.angle]).toLowerCase()}`);
    image.hidden = showing;
    canvas.hidden = !showing;
    if (showing) viewer?.draw();
  }

  async function openModel() {
    if (!has3D(selected)) return;
    if (showing) {
      cancelModel();
      status.textContent = '';
      redraw();
      return;
    }
    const task = new AbortController();
    request = task;
    show.disabled = true;
    status.textContent = tr('正在载入 3D 场景…', 'Loading 3D scene…');
    try {
      const [THREE, { GLTFLoader }, response] = await Promise.all([
        import('./vendor/three.module.js'),
        import('./vendor/GLTFLoader.js'),
        fetch(selected.model, { signal: task.signal })
      ]);
      if (task.signal.aborted) return;
      if (!response.ok) throw new Error('Model unavailable');
      viewer ??= createViewer(canvas, THREE);
      const bytes = await response.arrayBuffer();
      const representation = await new GLTFLoader().parseAsync(bytes, '');
      if (task.signal.aborted) {
        disposeModel(representation.scene);
        return;
      }
      viewer.setModel(representation.scene, selected.enclosure);
      viewer.setCutaway(cutaway);
      showing = true;
      status.textContent = tr('拖拽旋转视角，滚轮缩放。', 'Drag to orbit · Scroll to zoom.');
    } catch {
      if (!task.signal.aborted) {
        status.textContent = tr('模型暂时无法加载，可继续浏览渲染图。', 'The 3D model could not load; the render remains available.');
      }
    } finally {
      if (request === task) {
        request = null;
        redraw();
      }
    }
  }

  function browse(direction) {
    const rows = filteredScenes();
    if (rows.length > 1) choose(rows[(rows.indexOf(selected) + direction + rows.length) % rows.length]);
  }
  $('previous-scene').addEventListener('click', () => browse(-1));
  $('next-scene').addEventListener('click', () => browse(1));
  image.parentElement.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    browse(e.key === 'ArrowRight' ? 1 : -1);
  });
  let start = null;
  image.addEventListener('touchstart', e => { start = e.touches.length === 1 ? e.touches[0] : null; }, { passive: true });
  image.addEventListener('touchcancel', () => { start = null; });
  image.addEventListener('touchend', e => {
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.clientX;
    const dy = e.changedTouches[0].clientY - start.clientY;
    start = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (e.cancelable) e.preventDefault();
      browse(dx < 0 ? 1 : -1);
    }
  }, { passive: false });
  image.addEventListener('click', () => {
    if (!showing && image.src) lightbox.open(image.src, $('gallery-name').textContent);
  });

  function applyFilters() {
    const rows = filteredScenes();
    choose(rows.includes(selected) ? selected : rows[0]);
  }
  for (const tab of angles) tab.addEventListener('click', () => {
    angle = tab.dataset.angle;
    applyFilters();
  });
  scale.addEventListener('change', applyFilters);
  format.addEventListener('change', applyFilters);
  viewButton.addEventListener('click', () => {
    currentView = (currentView + 1) % views(selected).length;
    redraw();
  });
  cutawayButton.addEventListener('click', () => {
    cutaway = !cutaway;
    viewer.setCutaway(cutaway);
    redraw();
  });
  show.addEventListener('click', openModel);

  return {
    redraw,
    selectById(id, launch3D = false) {
      const target = corpus.scenes.find(s => s.id === id);
      if (!target) return;
      angle = target.views[0].angle;
      scale.value = format.value = 'all';
      choose(target);
      $('scene-detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (launch3D && has3D(target)) openModel();
    }
  };
}

function disposeModel(model) {
  const textures = new Set(), materials = new Set(), geometries = new Set();
  model.traverse(object => {
    if (object.geometry) geometries.add(object.geometry);
    for (const surface of Array.isArray(object.material) ? object.material : [object.material]) {
      if (!surface) continue;
      materials.add(surface);
      for (const prop of Object.values(surface)) if (prop?.isTexture) textures.add(prop);
    }
  });
  const decoded = new Set();
  for (const texture of textures) {
    texture.dispose();
    if (typeof texture.source?.data?.close === 'function') decoded.add(texture.source.data);
  }
  for (const image of decoded) image.close();
  for (const geometry of geometries) geometry.dispose();
  for (const surface of materials) surface.dispose();
}

function createViewer(canvas, THREE) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeede6);
  const direct = new THREE.DirectionalLight(0xfff9ed, 2.7);
  direct.position.set(2, 5, 4);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x576960, 2.04), direct);
  const camera = new THREE.PerspectiveCamera(42, 1, .03, 500);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.7));
  const center = new THREE.Vector3();
  const extent = new THREE.Vector3();
  let model = null, enclosures = [], cutaway = true, radius = 0, angle = .82, tilt = .51, zoom = .84, drag = null;

  function draw() {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h || !model) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const distance = radius * zoom / Math.min(1, camera.aspect);
    camera.position.set(
      center.x + distance * Math.sin(angle) * Math.cos(tilt),
      center.y + distance * Math.sin(tilt),
      center.z + distance * Math.cos(angle) * Math.cos(tilt)
    );
    camera.lookAt(center);
    for (const part of enclosures) {
      const near = part.axis && (camera.position[part.axis] - center[part.axis]) * part.offset > 0;
      part.object.visible = part.visible && !(cutaway && (part.ceiling || near));
    }
    renderer.render(scene, camera);
  }
  canvas.addEventListener('pointerdown', event => {
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;
    angle -= (event.clientX - drag.x) * .009;
    tilt = Math.max(.2, Math.min(1.45, tilt + (event.clientY - drag.y) * .009));
    drag.x = event.clientX;
    drag.y = event.clientY;
    draw();
  });
  canvas.addEventListener('lostpointercapture', () => { drag = null; });
  canvas.addEventListener('wheel', event => {
    event.preventDefault();
    zoom = Math.max(.39, Math.min(1.9, zoom * Math.exp(event.deltaY * .0015)));
    draw();
  }, { passive: false });
  new ResizeObserver(draw).observe(canvas);
  function clear() {
    if (model) {
      scene.remove(model);
      disposeModel(model);
      model = null;
      enclosures = [];
    }
  }
  return {
    clear,
    draw,
    setCutaway(enabled) { cutaway = enabled; },
    setModel(next, enclosureIds = []) {
      clear();
      model = next;
      scene.add(model);
      const box = new THREE.Box3().setFromObject(model);
      box.getCenter(center);
      box.getSize(extent);
      radius = extent.length() * 1.3;
      const ids = new Set(enclosureIds);
      model.traverse(object => {
        if (!object.isMesh || !ids.has(object.userData.objectId)) return;
        const bounds = new THREE.Box3().setFromObject(object), size = bounds.getSize(new THREE.Vector3());
        const position = bounds.getCenter(new THREE.Vector3());
        const ceiling = size.y < Math.min(size.x, size.z) * .4 && position.y > center.y;
        let axis = null, offset = 0;
        if (size.y >= Math.min(size.x, size.z) * .8) {
          const normal = size.x < size.z ? 'x' : 'z';
          offset = position[normal] - center[normal];
          if (Math.abs(offset) > extent[normal] * .25) axis = normal;
        }
        enclosures.push({ object, visible: object.visible, axis, ceiling, offset });
      });
      camera.far = Math.max(500, radius * 20);
      angle = .82;
      tilt = .51;
      zoom = .84;
    }
  };
}

function replay(video) {
  let data = studyData.replay;
  const input = $('replay-seek'), time = $('replay-time'), cells = $('replay-state');
  const x0 = 40, x1 = 454, y0 = 112, y1 = 18;
  const x = t => x0 + (x1 - x0) * t / data.seconds;
  const y = s => y0 - (y0 - y1) * s;
  const chartNode = $('score-timeline'), events = $('score-events');
  let cursor, positioned = 0, pendingSeek = null;
  let milestoneButtons = [];

  function read(value) {
    positioned = Math.max(0, Math.min(data.seconds, value));
    const current = data.events.findLast(([offset]) => offset <= positioned + .0001) || data.events[0];
    const [evtTime, score, success, phase, penInside, drawerClosed] = current;
    input.value = positioned;
    time.textContent = `${positioned.toFixed(1)} s`;
    if (cursor) {
      cursor.setAttribute('x1', x(positioned));
      cursor.setAttribute('x2', x(positioned));
    }
    for (const { btn, t } of milestoneButtons) {
      btn.classList.toggle('is-active', Math.abs(t - evtTime) < 0.01);
    }

    const wrap = el('div', undefined, 'telemetry-grid');
    const addPill = (name, val, state) => {
      const tile = el('div', undefined, `telemetry-tile${state ? ` is-${state}` : ''}`);
      tile.append(el('span', name), el('strong', val));
      wrap.append(tile);
    };
    addPill(tr('实时得分', 'Reward'), score.toFixed(2), score >= 1 ? 'ok' : score > 0 ? 'mid' : '');
    addPill(tr('任务状态', 'Task status'), success ? tr('已完成', 'Complete') : tr('执行中', 'In progress'), success ? 'ok' : '');
    if (phase) addPill(tr('当前阶段', 'Phase'), label(phase), success ? 'ok' : '');
    if (typeof penInside === 'boolean') addPill(tr('笔在抽屉内', 'Pen inside'), penInside ? tr('是', 'Yes') : tr('否', 'No'), penInside ? 'ok' : '');
    if (typeof drawerClosed === 'boolean') addPill(tr('抽屉已关闭', 'Drawer closed'), drawerClosed ? tr('是', 'Yes') : tr('否', 'No'), drawerClosed ? 'ok' : '');
    cells.replaceChildren(wrap);
  }

  // The final encoded frame can round the recorded duration to a video frame boundary.
  function mediaTime(t) {
    return t >= data.seconds ? video.duration : Math.min(t, video.duration);
  }
  function seek(value) {
    read(value);
    if (Number.isFinite(video.duration)) video.currentTime = mediaTime(value);
    else {
      const waiting = pendingSeek !== null;
      pendingSeek = value;
      if (!waiting) {
        video.preload = 'metadata';
        video.load();
      }
    }
  }
  input.addEventListener('input', () => seek(Number(input.value)));
  
  video.addEventListener('loadedmetadata', () => {
    if (pendingSeek !== null) {
      video.currentTime = mediaTime(pendingSeek);
      pendingSeek = null;
    }
  });
  video.addEventListener('timeupdate', () => {
    if (pendingSeek === null) read(video.ended || video.currentTime >= video.duration ? data.seconds : video.currentTime);
  });

  function render() {
    input.max = data.seconds;
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 470 152');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', tr('奖励阶梯曲线', 'Reward timeline'));

    const defs = document.createElementNS(svgNS, 'defs');
    const grad = document.createElementNS(svgNS, 'linearGradient');
    grad.setAttribute('id', 'reward-fill-grad');
    grad.setAttribute('x1', '0');
    grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '0');
    grad.setAttribute('y2', '1');
    const s1 = document.createElementNS(svgNS, 'stop');
    s1.setAttribute('offset', '0%');
    s1.setAttribute('stop-color', 'var(--accent)');
    s1.setAttribute('stop-opacity', '0.22');
    const s2 = document.createElementNS(svgNS, 'stop');
    s2.setAttribute('offset', '100%');
    s2.setAttribute('stop-color', 'var(--accent)');
    s2.setAttribute('stop-opacity', '0.02');
    grad.append(s1, s2);
    defs.append(grad);
    svg.append(defs);

    function vector(type, attributes, text) {
      const e = document.createElementNS(svgNS, type);
      for (const [key, value] of Object.entries(attributes)) e.setAttribute(key, value);
      if (text !== undefined) e.textContent = text;
      svg.append(e);
      return e;
    }
    vector('text', { x: x0, y: 12, 'font-size': 10.5, fill: 'var(--muted)' }, tr('奖励', 'Reward'));
    for (const tick of [0, data.seconds / 3, data.seconds * 2 / 3, data.seconds]) {
      vector('line', { x1: x(tick), x2: x(tick), y1, y2: y0, stroke: 'var(--line)' });
      vector('text', { x: x(tick), y: 129, 'font-size': 10.5, 'text-anchor': 'middle', fill: 'var(--muted)' }, `${Number(tick.toFixed(1))}s`);
    }
    for (const score of [0, 0.5, 1]) {
      vector('line', { x1: x0, x2: x1, y1: y(score), y2: y(score), stroke: 'var(--line)', 'stroke-dasharray': score === 0.5 ? '3 3' : '' });
      vector('text', { x: 28, y: y(score) + 4, 'font-size': 10.5, 'text-anchor': 'end', fill: 'var(--muted)' }, score);
    }
    vector('text', { x: (x0 + x1) / 2, y: 147, 'font-size': 10.5, 'text-anchor': 'middle', fill: 'var(--muted)' }, tr('仿真时间（秒）', 'Simulation time (s)'));

    let line = `M${x(0)} ${y(data.events[0][1])}`;
    for (const [t, score] of data.events.slice(1)) line += ` H${x(t)} V${y(score)}`;
    const fullLine = `${line} H${x1}`;
    vector('path', { d: `${fullLine} V${y0} H${x0} Z`, fill: 'url(#reward-fill-grad)' });
    vector('path', { d: fullLine, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.5, 'stroke-linejoin': 'round' });
    cursor = vector('line', { x1: x0, x2: x0, y1, y2: y0, stroke: 'var(--primary)', 'stroke-width': 2 });

    chartNode.replaceChildren(svg);
    events.replaceChildren();
    milestoneButtons = [];
    for (const [i, [t, score, , phase]] of data.events.entries()) {
      if (!i || (score === data.events[i - 1][1] && data.events[i][2] === data.events[i - 1][2])) continue;
      const description = phase ? label(phase) : data.events[i][2] ? tr('完成', 'Complete') : '';
      const button = el('button', [`${Number(t.toFixed(3))} s`, description, score.toFixed(2)].filter(Boolean).join(' · '), 'event-chip');
      button.type = 'button';
      button.addEventListener('click', () => seek(t));
      events.append(button);
      milestoneButtons.push({ btn: button, t });
    }
    read(positioned);
  }
  return { render, select(clip) {
    data = clip.id === 'T07' ? studyData.replay : { ...clip.scoring, seconds: clip.seconds };
    pendingSeek = null;
    positioned = 0;
  } };
}

function rollouts() {
  const video = $('rollout-video'), cards = $('clip-cards'), caption = $('video-caption');
  const linkedClip = new URLSearchParams(location.search).get('clip');
  let selected = corpus.videos.find(row => row.id === linkedClip) || corpus.videos.find(row => row.id === 'T07');
  const score = replay(video);

  let request = null;
  let objectUrl = '';
  async function load() {
    request?.abort();
    const current = new AbortController();
    request = current;
    video.pause();
    video.removeAttribute('src');
    video.load();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = '';
    video.poster = selected.poster;
    score.select(selected);
    const src = selected.video;
    if (src.startsWith('data:')) {
      video.src = src;
      return;
    }
    // These short clips fit in memory. A blob also supports seeking on static hosts
    // that serve the whole file without HTTP byte ranges.
    try {
      const response = await fetch(src, { signal: current.signal });
      if (!response.ok) throw new Error(String(response.status));
      const file = await response.blob();
      if (current.signal.aborted) return;
      objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;
    } catch {
      if (!current.signal.aborted) video.src = src;
    }
  }

  function render() {
    $('replay-robot').textContent = selected.robot || tr('机械臂', 'Manipulator');
    caption.textContent = [
      local(selected.name),
      selected.robot,
      `${selected.seconds.toFixed(1)} s`,
      tr(`得分 ${selected.reward.toFixed(1)}`, `Reward ${selected.reward.toFixed(1)}`)
    ].filter(Boolean).join(' · ');

    cards.replaceChildren(
      ...corpus.videos.map(row =>
        makeCard(
          row.id,
          local(row.name),
          row.poster,
          [row.robot, `${row.seconds.toFixed(1)} s`].filter(Boolean).join(' · '),
          row === selected,
          () => {
            if (row !== selected) {
              selected = row;
              load();
              render();
            }
          }
        )
      )
    );
    score.render();
  }
  load();
  return render;
}

function renderLearning(lightbox) {
  const policyRoot = $('policy-metrics');
  if (policyRoot && studyData.policyAdaptation) {
    policyRoot.replaceChildren(
      ...studyData.policyAdaptation.rows.map(row => {
        const card = el('div', undefined, `policy-card${row.id === 'mean' ? ' is-mean' : ''}`);
        const head = el('div', undefined, 'policy-card-head');
        head.append(el('span', local(row.name)), el('strong', `${row.before.toFixed(2)} → ${row.after.toFixed(2)}`));
        const track = el('div', undefined, 'policy-bar-track');
        const fill = el('span', undefined, 'policy-bar-fill');
        fill.style.width = `${Math.min(100, row.after)}%`;
        track.append(fill);
        card.append(head, track, el('small', tr('留出布局 5 次执行均分 [0, 100]', 'Mean over 5 held-out rollouts [0, 100]')));
        return card;
      })
    );
  }

  $('learning-cases').replaceChildren(
    ...corpus.learning.map(row => {
      const meta = studyData.learningMeta?.[row.id];
      const card = el('div', undefined, 'learning-pair');
      const head = el('div', undefined, 'learning-pair-head');
      const cleanTitle = meta ? local(meta.title).replace(/^\([a-d]\)\s*/i, '') : row.id;
      head.append(
        el('strong', cleanTitle),
        meta ? el('span', local(meta.note), 'source-note') : el('span')
      );
      const grid = el('div', undefined, 'learning-images');
      row.images.forEach((source, index) => {
        const f = el('figure');
        const img = el('img');
        const tag = index ? tr('微调后', 'Fine-tuned') : tr('基础模型', 'Base model');
        img.src = source;
        img.alt = `${cleanTitle} · ${tag}`;
        img.loading = 'lazy';
        img.addEventListener('click', () => lightbox.open(source, `${cleanTitle} · ${tag}`));
        f.append(img, el('figcaption', tag, index ? 'cap-after' : 'cap-before'));
        grid.append(f);
      });
      card.append(head, grid);
      return card;
    })
  );
}

export function setupStudy() {
  const lightbox = setupLightbox();

  const results = [...document.querySelectorAll('[data-result]')];
  for (const button of results) {
    button.addEventListener('click', () => {
      for (const tab of results) tab.setAttribute('aria-pressed', String(tab === button));
      for (const panel of document.querySelectorAll('[data-result-panel]')) {
        panel.hidden = panel.dataset.resultPanel !== button.dataset.result;
      }
    });
  }

  for (const kpi of document.querySelectorAll('[data-jump-result]')) {
    kpi.addEventListener('click', () => {
      const targetTab = document.querySelector(`[data-result="${kpi.dataset.jumpResult}"]`);
      targetTab?.click();
      $('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const drawScenes = setupSceneResults();
  const drawRubrics = setupRubricResults();
  const gal = gallery(lightbox);
  const drawRollouts = rollouts();
  const drawMethod = setupMethodDiagram($('method-architecture'), {
    onInspect3D: id => gal.selectById(id, true)
  });

  function render() {
    $('manuscript-abstract').textContent = tr(abstractZh, studyData.abstract);
    $('manuscript-abstract').lang = tr('zh-CN', 'en');
    renderDataTable($('scene-table'), sceneColumns, studyData.scene, ['up', 'up', 'up', 'up', 'up']);
    renderDataTable($('rubric-table'), rubricColumns, studyData.rubric, ['up', 'up', 'up', 'up', 'down', 'down', 'up']);
    drawMethod();
    drawScenes();
    drawRubrics();
    gal.redraw();
    drawRollouts();
    renderLearning(lightbox);
  }

  window.addEventListener('paper-language-change', render);
  render();
}
