import { tr } from './locale.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

const STAGES = [
  {
    id: 'input',
    num: '01',
    label: ['任务与资产', 'Task & Assets'],
    title: ['自然语言任务与分层资产输入', 'Natural-language request & tiered asset sourcing'],
    formula: 'x, A  →  Task & Asset Context',
    detail: [
      '从自然语言需求 x 解析任务目标、约束与空间关系；资产检索按仿真就绪库（ArtVIP / RoboDojo / RoboCasa365 / SimReady）→ 通用 3D 库 → 在线检索 / 程序化脚本分层补齐。',
      'Parses goals, constraints, and spatial relations from request x, sourcing assets in priority tiers from simulation-ready articulated libraries down to general 3D repositories and procedural scripts.'
    ]
  },
  {
    id: 'author',
    num: '02',
    label: ['程序编写', 'Program Authoring'],
    title: ['(a) 四类耦合程序联合编写', '(a) Joint authoring of four coupled programs'],
    formula: 'P = (S, T, B, R)  →  W_v = Build(S, T, R; A)',
    detail: [
      '原生编码代理同步编写场景 S、任务绑定 T、行为 B 与评分程序 R。空间归属、坐标系、物理支撑与任务绑定相互解耦，因此布局随机种子改变时无需重写评分逻辑。',
      'The native coding agent jointly authors Scene S, Task bindings T, Behavior B, and Rubric R. Spatial ownership, frames, physical support, and task bindings are factorized separately so layout seeds vary without rewriting rubrics.'
    ]
  },
  {
    id: 'refine',
    num: '03',
    label: ['构建与修订闭环', 'Construct & Refine'],
    title: ['(b) 仿真反馈与独立审核驱动闭环修订', '(b) Closed-loop build, visual/physical inspection & independent review'],
    formula: 'u_k = G_θ(x, P_k, E_k)  →  (v_k, ΔP_k)',
    detail: [
      '编译构建后基于真实渲染与物理测量开展检查；只读隔离的独立审核者对照原始需求核验（例如检出“柜体饰条遮挡置物罐区域”），触发代码修订并重建，同时完整沉淀正向构建经验 H_x。',
      'After building, simulator renders and physics checks feed an isolated read-only reviewer (e.g., flagging cabinet trim obstructing the jar area), driving code edits and rebuilds while recording leak-free construction history H_x.'
    ]
  },
  {
    id: 'interact',
    num: '04',
    label: ['交互与评分', 'Interact & Score'],
    title: ['(c) 隔离边界机器人执行与有状态评分', '(c) Isolated physical rollout & finite-state rubric scoring'],
    formula: 'τ_{v,b} = Run(W_v, B_b)   ·   (z_{t+1}, y_t) = R(T, f_t, z_t)',
    detail: [
      '行为程序 B 仅通过任务无关的运动规划与控制原语、依据观测 o_t 驱动物理仿真；评分程序 R 在只读独立进程中读取仿真事实 f_t 并维护有限状态 z_t，输出可复算的过程奖励与反馈 v_k。',
      'Behavior B executes via task-agnostic motion planning using only declared observations o_t, while read-only Rubric R reads committed simulator facts f_t and maintains finite state z_t to produce auditable scores and feedback v_k.'
    ]
  },
  {
    id: 'deliver',
    num: '05',
    label: ['冻结交付', 'Frozen Delivery'],
    title: ['不可变环境版本 W_v 与三类可复用经验产物', 'Immutable frozen revision W_v & three linked experience artifacts'],
    formula: 'W_v  →  ( H_x ,  E_x ,  D_x )',
    detail: [
      '仅当独立下游消费者在全新进程中完成重载、回放与重算核验后，才冻结交付不可变环境 W_v，并绑定构建经验 H_x、任务评分环境 E_x 与物理执行经验 D_x，支持策略微调与可重复评测。',
      'Only after fresh-process downstream consumers reload, replay, and recompute records is W_v frozen—linking construction experience H_x, evaluable rubric package E_x, and physical execution experience D_x.'
    ]
  }
];

const PROGRAMS = {
  S: {
    name: ['场景程序', 'Scene'],
    code: 'S: entities, poses, physics, support_relations',
    detail: [
      '场景程序 S 定义层次化物体树、材质物理属性、可动关节与独立表达的支撑/包含关系，并支持参数化布局种子编译为不同冻结版本。',
      'Scene S defines hierarchical entities, physical properties, articulated joints, and factorized support/containment relations—compiling parameterized layout seeds into separate frozen revisions.'
    ]
  },
  T: {
    name: ['任务绑定', 'Task'],
    code: 'T: bind(food="can_01", fridge="fridge_01", aisle="left")',
    detail: [
      '任务程序 T 将抽象角色（如 food、fridge）显式绑定到场景稳定实体 ID 与目标区域参数，使同一评分逻辑可跨布局变体泛化。',
      'Task T explicitly binds semantic roles (e.g., food, fridge) to stable entity IDs and region parameters so the same rubric transfers across layout variants.'
    ]
  },
  B: {
    name: ['行为程序', 'Behavior'],
    code: 'B: stages(pickup → carry_left_aisle → insert → close_door)',
    detail: [
      '行为程序 B 表达操作阶段、空间目标、运动约束与恢复策略，在固定 W_v 上独立演化，不依赖脚本瞬移或特权状态覆写。',
      'Behavior B specifies manipulation stages, spatial goals, constraints, and recovery strategies—evolving independently on frozen W_v without scripted teleportation.'
    ]
  },
  R: {
    name: ['评分程序', 'Rubric'],
    code: 'R: (z_{t+1}, y_t) = transition(T, facts_t, z_t)',
    detail: [
      '评分程序 R 在只读隔离进程中运行有限状态机，逐阶段验证食物入柜、冰箱关门等有序条件，杜绝策略与评测共用特权句柄。',
      'Rubric R runs a finite-state machine in an isolated read-only process, tracking ordered conditions like food placement and door closure from committed simulator facts.'
    ]
  }
};

const ROLLOUT_FRAMES = [
  {
    id: 'pickup',
    label: ['岛台抓取', 'Island pickup'],
    src: './media/method/island-pickup.webp',
    step: ['阶段 1/3 · 从岛台抓取目标罐头', 'Stage 1/3 · Grasp target food can from island']
  },
  {
    id: 'carry',
    label: ['通道搬运', 'Carry'],
    src: './media/method/left-aisle.webp',
    step: ['阶段 2/3 · 沿左侧畅通通道搬运至冰箱前', 'Stage 2/3 · Carry along clear left aisle to fridge']
  },
  {
    id: 'insert',
    label: ['放入冰箱', 'Into fridge'],
    src: './media/method/into-fridge.webp',
    step: ['阶段 3/3 · 置入冷藏层并触发关门评分条件', 'Stage 3/3 · Place on fridge shelf and close door']
  }
];

const DELIVERABLES = {
  H: {
    symbol: 'H_x',
    title: ['构建经验', 'Construction experience'],
    formula: 'H_x = (x, {(u_k, v_k, ΔP_k)})',
    detail: [
      '无未来信息泄露的正向构建轨迹：完整关联每次编辑前的视觉渲染、审核意见与代码 diff，可直接监督 Qwen 27B 等布局生成模型微调。',
      'Leak-free forward construction trace linking pre-edit visuals, review feedback, and code diffs—directly supervising layout-authoring models such as Qwen 27B.'
    ]
  },
  E: {
    symbol: 'E_x',
    title: ['任务评分环境', 'Task rubrics'],
    formula: 'E_x = (W_v, T, R)  ·  read-only isolated scorer',
    detail: [
      '冻结的环境包 E_x 封装仿真场景、任务绑定与可确定性重算的有状态评分器（如食物入柜 + 冰箱门角），可直接用于跨策略公平评测。',
      'Frozen evaluable package E_x bundles the scene, task bindings, and deterministic stateful rubric (e.g., food inside + door angle) for repeatable policy evaluation.'
    ]
  },
  D: {
    symbol: 'D_x',
    title: ['执行经验', 'Execution experience'],
    formula: 'D_x = {(o_t, a_t, f_t, y_t)}  ·  verified rollouts',
    detail: [
      '按步骤记录真实物理执行中的观测 o_t、动作 a_t、物理测量与评分输出 y_t，保留失败记录并筛出通过评分验证的示范用于 π₀.₅ 等策略适配。',
      'Records step-wise observations o_t, executed actions a_t, physics measurements, and rubric outputs y_t—retaining failures while yielding verified demos for π₀.₅ adaptation.'
    ]
  }
};

function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'className') el.className = v;
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  for (const child of children.flat()) {
    if (child === undefined || child === null || child === false) continue;
    el.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return el;
}

export function setupMethodDiagram(container, { onInspect3D, onOpenOriginal } = {}) {
  if (!container) return () => {};

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let activeStage = STAGES[0].id;
  let activeProgram = 'S';
  let activeDeliverable = null;
  let trimFixed = false;
  let activeRollout = 2; // "Into fridge" hero default
  let autoPlay = false;
  let timer = 0;

  function stopAutoPlay() {
    if (!autoPlay) return;
    autoPlay = false;
    clearInterval(timer);
    timer = 0;
  }

  function startAutoPlay() {
    if (reducedMotion.matches) return;
    stopAutoPlay();
    autoPlay = true;
    timer = window.setInterval(() => {
      const idx = STAGES.findIndex(s => s.id === activeStage);
      const next = STAGES[(idx + 1) % STAGES.length];
      activeStage = next.id;
      activeDeliverable = null;
      if (activeStage === 'refine') trimFixed = !trimFixed;
      if (activeStage === 'interact') activeRollout = (activeRollout + 1) % ROLLOUT_FRAMES.length;
      render();
    }, 4200);
    render();
  }

  function selectStage(id, userTriggered = true) {
    if (userTriggered) stopAutoPlay();
    activeStage = id;
    activeDeliverable = null;
    render();
  }

  function drawWires(board, svg) {
    if (!board || !svg) return;
    const rect = board.getBoundingClientRect();
    if (rect.width < 680) {
      svg.replaceChildren();
      return;
    }
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    svg.setAttribute('width', String(rect.width));
    svg.setAttribute('height', String(rect.height));

    const pt = (id, side, ratio = 0.5) => {
      const node = board.querySelector(`[data-node="${id}"]`);
      if (!node) return null;
      const r = node.getBoundingClientRect();
      const x0 = r.left - rect.left;
      const y0 = r.top - rect.top;
      if (side === 'right') return { x: x0 + r.width, y: y0 + r.height * ratio };
      if (side === 'left') return { x: x0, y: y0 + r.height * ratio };
      if (side === 'top') return { x: x0 + r.width * ratio, y: y0 };
      if (side === 'bottom') return { x: x0 + r.width * ratio, y: y0 + r.height };
      return { x: x0 + r.width / 2, y: y0 + r.height / 2 };
    };

    const defs = document.createElementNS(SVG_NS, 'defs');
    const makeMarker = (id, color) => {
      const marker = document.createElementNS(SVG_NS, 'marker');
      marker.setAttribute('id', id);
      marker.setAttribute('viewBox', '0 0 10 10');
      marker.setAttribute('refX', '8');
      marker.setAttribute('refY', '5');
      marker.setAttribute('markerWidth', '6');
      marker.setAttribute('markerHeight', '6');
      marker.setAttribute('orient', 'auto-start-reverse');
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', 'M 1 1.5 L 8.5 5 L 1 8.5 z');
      path.setAttribute('fill', color);
      marker.append(path);
      return marker;
    };
    defs.append(
      makeMarker('mw-arrow-idle', 'var(--wire-idle)'),
      makeMarker('mw-arrow-accent', 'var(--accent)'),
      makeMarker('mw-arrow-primary', 'var(--primary)')
    );

    const wires = [];
    const addCurve = (from, to, opts = {}) => {
      if (!from || !to) return;
      const dx = Math.abs(to.x - from.x);
      const dy = Math.abs(to.y - from.y);
      let d;
      if (opts.vertical) {
        const cy = (from.y + to.y) / 2;
        d = `M ${from.x} ${from.y} C ${from.x} ${cy}, ${to.x} ${cy}, ${to.x} ${to.y}`;
      } else if (opts.feedback) {
        const pull = Math.min(dx * 0.45, 13);
        const dip = Math.min(18, Math.max(8, dy * 0.16));
        d = `M ${from.x} ${from.y} C ${from.x - pull} ${from.y + dip}, ${to.x + pull} ${to.y + dip}, ${to.x} ${to.y}`;
      } else {
        const pull = Math.min(dx * 0.46, 13);
        d = `M ${from.x} ${from.y} C ${from.x + pull} ${from.y}, ${to.x - pull} ${to.y}, ${to.x} ${to.y}`;
      }
      wires.push({ d, ...opts });
    };

    // Main left-to-right & top-to-bottom architecture pathways
    addCurve(pt('input', 'right', 0.32), pt('author', 'left', 0.5), {
      active: activeStage === 'input' || activeStage === 'author',
      tone: 'accent'
    });
    addCurve(pt('author', 'bottom', 0.5), pt('refine', 'top', 0.5), {
      vertical: true,
      active: activeStage === 'author' || activeStage === 'refine',
      tone: 'accent'
    });
    addCurve(pt('author', 'right', 0.55), pt('interact', 'left', 0.38), {
      active: activeStage === 'author' || activeStage === 'interact',
      tone: 'accent'
    });
    addCurve(pt('refine', 'right', 0.42), pt('interact', 'left', 0.72), {
      active: activeStage === 'refine' || activeStage === 'interact',
      tone: 'accent'
    });
    addCurve(pt('interact', 'bottom', 0.5), pt('score', 'top', 0.5), {
      vertical: true,
      active: activeStage === 'interact',
      tone: 'accent'
    });
    // Closed-loop feedback wire: Measure & Score -> Construct & Refine
    addCurve(pt('score', 'left', 0.62), pt('refine', 'right', 0.80), {
      feedback: true,
      active: activeStage === 'refine' || activeStage === 'interact',
      tone: 'primary'
    });
    // Forward delivery: Interact & Score -> Frozen Simulation Scene & Deliverables
    addCurve(pt('interact', 'right', 0.48), pt('deliver', 'left', 0.36), {
      active: activeStage === 'interact' || activeStage === 'deliver',
      tone: 'accent'
    });
    addCurve(pt('score', 'right', 0.52), pt('deliver', 'left', 0.78), {
      active: activeStage === 'interact' || activeStage === 'deliver',
      tone: 'accent'
    });

    const frag = document.createDocumentFragment();
    frag.append(defs);
    for (const w of wires) {
      const base = document.createElementNS(SVG_NS, 'path');
      base.setAttribute('d', w.d);
      base.setAttribute('class', `mw-track${w.feedback ? ' is-feedback' : ''}${w.active ? ' is-active' : ''}`);
      const markerId = w.active
        ? (w.tone === 'primary' ? 'url(#mw-arrow-primary)' : 'url(#mw-arrow-accent)')
        : 'url(#mw-arrow-idle)';
      base.setAttribute('marker-end', markerId);
      frag.append(base);

      if (w.active && !reducedMotion.matches) {
        const pulse = document.createElementNS(SVG_NS, 'path');
        pulse.setAttribute('d', w.d);
        pulse.setAttribute('class', `mw-pulse is-${w.tone}${w.feedback ? ' is-feedback' : ''}`);
        frag.append(pulse);
      }
    }
    svg.replaceChildren(frag);
  }

  let resizeObserver = null;

  // Hit regions use the publication SVG's original 2000 × 860 coordinates.
  const regions = [
    ['input', 12, 15, 215, 810],
    ['author', 264, 15, 560, 362],
    ['refine', 264, 405, 560, 422],
    ['interact', 860, 15, 266, 812],
    ['deliver', 1172, 15, 808, 540],
    ...['S', 'T', 'B', 'R'].map((key, i) => [key, 286, 153 + 51 * i, 237, 49]),
    ['H', 1172, 577, 300, 250], ['E', 1474, 577, 204, 250], ['D', 1680, 577, 300, 250]
  ];
  const plate = h('div', { className: 'publication-scroll' });
  const sheet = h('div', { className: 'publication-sheet' });
  plate.append(sheet);
  const overlay = h('div', { className: 'publication-hotspots' });
  const buttons = new Map();
  for (const [key, x, y, width, height] of regions) {
    const button = h('button', {
      type: 'button',
      style: `left:${x / 20}%;top:${y / 8.6}%;width:${width / 20}%;height:${height / 8.6}%`,
      onClick: () => {
        stopAutoPlay();
        if (PROGRAMS[key]) {
          activeProgram = key;
          selectStage('author');
        } else if (DELIVERABLES[key]) {
          activeStage = 'deliver';
          activeDeliverable = key;
          render();
        } else selectStage(key);
        button.focus({ preventScroll: true });
      }
    });
    buttons.set(key, button);
    overlay.append(button);
  }
  const details = h('details', { className: 'publication-details' });
  const summary = h('summary');
  details.addEventListener('toggle', () => {
    if (details.open) {
      const board = details.querySelector('.method-board');
      if (board) drawWires(board, board.querySelector('.method-wires'));
    }
  });
  const fallback = h('img', { src: './media/corpus/method.webp', alt: '' });
  sheet.append(fallback, overlay);
  fetch('./media/method/publication.svg')
    .then(response => {
      if (!response.ok) throw new Error('Method figure unavailable');
      return response.text();
    })
    .then(source => {
      const svg = new DOMParser().parseFromString(source, 'image/svg+xml').documentElement;
      if (svg.localName === 'svg') fallback.replaceWith(document.importNode(svg, true));
    })
    .catch(() => { /* The manuscript preview and interactive controls remain available. */ });

  function render() {
    const stageMeta = STAGES.find(s => s.id === activeStage) || STAGES[0];
    const currentFrame = ROLLOUT_FRAMES[activeRollout];

    // Inspector content reflects either a selected deliverable, selected program (in author stage), or active stage
    let inspectorEyebrow = `${stageMeta.num} · ${tr(...stageMeta.label)}`;
    let inspectorTitle = tr(...stageMeta.title);
    let inspectorFormula = stageMeta.formula;
    let inspectorDetail = tr(...stageMeta.detail);

    if (activeDeliverable && DELIVERABLES[activeDeliverable]) {
      const d = DELIVERABLES[activeDeliverable];
      inspectorEyebrow = `${tr('交付产物', 'Artifact')} · ${d.symbol}`;
      inspectorTitle = tr(...d.title);
      inspectorFormula = d.formula;
      inspectorDetail = tr(...d.detail);
    } else if (activeStage === 'author' && PROGRAMS[activeProgram]) {
      const p = PROGRAMS[activeProgram];
      inspectorEyebrow = `02 · ${tr('程序源', 'Program Source')} · ${activeProgram}`;
      inspectorTitle = `${tr(...p.name)} (${activeProgram})`;
      inspectorFormula = p.code;
      inspectorDetail = tr(...p.detail);
    }

    const toolbar = h(
      'div',
      { className: 'method-toolbar' },
      h(
        'div',
        { className: 'method-step-pills', role: 'tablist', 'aria-label': tr('方法阶段', 'Method stages') },
        STAGES.map(stage =>
          h(
            'button',
            {
              type: 'button',
              className: `method-step-pill${stage.id === activeStage ? ' is-active' : ''}`,
              role: 'tab',
              'aria-selected': String(stage.id === activeStage),
              dataset: { methodStage: stage.id },
              onClick: () => selectStage(stage.id, true)
            },
            h('span', { className: 'method-step-num' }, stage.num),
            h('span', {}, tr(...stage.label))
          )
        )
      ),
      h(
        'div',
        { className: 'method-toolbar-actions' },
        h(
          'button',
          {
            type: 'button',
            className: `method-play-btn${autoPlay ? ' is-playing' : ''}`,
            'aria-pressed': String(autoPlay),
            onClick: () => (autoPlay ? (stopAutoPlay(), render()) : startAutoPlay())
          },
          h('span', { className: 'play-dot', 'aria-hidden': 'true' }),
          autoPlay ? tr('暂停演示', 'Pause tour') : tr('自动演示', 'Auto-play')
        ),
        onOpenOriginal
          ? h(
              'button',
              {
                type: 'button',
                className: 'method-ghost-btn',
                onClick: () =>
                  onOpenOriginal(
                    './media/corpus/method.webp',
                    tr('论文正文方法原图', 'Original manuscript method figure'),
                    'EmbodiedStudio-method.webp'
                  )
              },
              tr('论文原图', 'Paper figure')
            )
          : null
      )
    );

    const colInput = h(
      'div',
      { className: 'method-col method-col-input' },
      h(
        'article',
        {
          className: `method-node${activeStage === 'input' ? ' is-focused' : ''}`,
          dataset: { node: 'input' },
          onClick: () => selectStage('input', true)
        },
        h(
          'header',
          { className: 'method-node-head' },
          h('span', { className: 'method-node-tag' }, '01'),
          h('h3', {}, tr('任务与资产', 'Task & assets'))
        ),
        h(
          'blockquote',
          { className: 'method-prompt-quote' },
          h('p', { lang: 'en' }, 'Pick from island. Carry via left aisle. Place in fridge. Close the door.'),
          tr('从岛台取食物 → 经左侧通道搬运 → 放入冰箱并关门', null)
            ? h('small', {}, '从岛台取食物 · 经左侧通道搬运 · 放入冰箱并关门')
            : null
        ),
        h(
          'div',
          { className: 'method-tier-box' },
          h('span', { className: 'method-sublabel' }, tr('分层资产来源 A', 'Tiered asset sourcing A')),
          h('span', {}, tr('1. SimReady · ArtVIP · RoboCasa', '1. SimReady · ArtVIP · RoboCasa')),
          h('span', {}, tr('2. Objaverse · YCB · 材质库', '2. Objaverse · YCB · ambientCG')),
          h('span', {}, tr('3. 在线检索 / 程序化资产脚本', '3. Online retrieval / Procedural'))
        ),
        h(
          'div',
          { className: 'method-asset-list' },
          [
            ['./media/method/food.webp', tr('目标食物', 'Food'), 'food'],
            ['./media/method/fridge.webp', tr('可开合冰箱', 'Refrigerator'), 'fridge'],
            ['./media/method/coffee.webp', tr('厨房场景资产', 'Scene assets'), 'assets']
          ].map(([src, label]) =>
            h(
              'figure',
              { className: 'method-asset-chip' },
              h('img', { src, alt: label, loading: 'lazy' }),
              h('figcaption', {}, label)
            )
          )
        )
      )
    );

    const colAuthorRefine = h(
      'div',
      { className: 'method-col method-col-core' },
      // (a) Program authoring
      h(
        'article',
        {
          className: `method-node${activeStage === 'author' ? ' is-focused' : ''}`,
          dataset: { node: 'author' },
          onClick: () => selectStage('author', true)
        },
        h(
          'header',
          { className: 'method-node-head' },
          h('span', { className: 'method-node-tag' }, '(a)'),
          h('h3', {}, tr('程序编写', 'Program authoring')),
          h('code', { className: 'method-formula-pill' }, 'P = (S, T, B, R)')
        ),
        h(
          'div',
          { className: 'method-author-grid' },
          h(
            'div',
            { className: 'method-program-stack', role: 'group', 'aria-label': tr('四类程序源', 'Four program sources') },
            ['S', 'T', 'B', 'R'].map(key =>
              h(
                'button',
                {
                  type: 'button',
                  className: `method-prog-btn${activeProgram === key && activeStage === 'author' ? ' is-selected' : ''}`,
                  'aria-pressed': String(activeProgram === key),
                  onClick: e => {
                    e.stopPropagation();
                    stopAutoPlay();
                    activeStage = 'author';
                    activeDeliverable = null;
                    activeProgram = key;
                    render();
                  }
                },
                h('span', { className: 'method-prog-letter' }, key),
                h('span', { className: 'method-prog-name' }, tr(...PROGRAMS[key].name))
              )
            )
          ),
          h(
            'div',
            { className: 'method-bindings-box' },
            h('span', { className: 'method-sublabel' }, tr('任务语义绑定', 'Task bindings')),
            h(
              'div',
              { className: 'method-binding-thumbs' },
              h('figure', {}, h('img', { src: './media/method/food.webp', alt: 'food', loading: 'lazy' }), h('figcaption', {}, 'food')),
              h('figure', {}, h('img', { src: './media/method/fridge.webp', alt: 'fridge', loading: 'lazy' }), h('figcaption', {}, 'fridge'))
            ),
            h(
              'div',
              { className: 'method-binding-tags' },
              h('span', {}, 'food inside fridge'),
              h('span', {}, 'robot closes door')
            )
          )
        )
      ),
      // (b) Construct & refine closed loop
      h(
        'article',
        {
          className: `method-node${activeStage === 'refine' ? ' is-focused' : ''}`,
          dataset: { node: 'refine' },
          onClick: () => selectStage('refine', true)
        },
        h(
          'header',
          { className: 'method-node-head' },
          h('span', { className: 'method-node-tag' }, '(b)'),
          h('h3', {}, tr('构建与修订闭环', 'Construct & refine')),
          h(
            'span',
            { className: `method-loop-badge${trimFixed ? ' is-verified' : ' is-alert'}` },
            trimFixed ? tr('已修订验证', 'Verified fix') : tr('审核检出缺陷', 'Review flagged')
          )
        ),
        h(
          'div',
          { className: 'method-refine-grid' },
          h(
            'figure',
            { className: 'method-photo-card' },
            h('img', { src: './media/method/kitchen-build.webp', alt: tr('场景编译构建', 'Build scene'), loading: 'lazy' }),
            h('figcaption', {}, tr('构建场景 · Build', 'Build scene'))
          ),
          h(
            'figure',
            { className: `method-photo-card method-inspect-card${trimFixed ? ' is-fixed' : ' is-flagged'}` },
            h('img', {
              src: trimFixed ? './media/method/trim-after.webp' : './media/method/trim-before.webp',
              alt: trimFixed ? tr('缩短饰条后验证', 'After shortening cabinet trim') : tr('饰条遮挡置物罐区域', 'Trim obstructs jar area'),
              loading: 'lazy'
            }),
            h(
              'figcaption',
              {},
              trimFixed ? tr('重建复核 · 遮挡消除', 'Rebuild verified · Clear') : tr('视觉物理检查 · 发现穿插', 'Inspect · Trim collision')
            )
          )
        ),
        h(
          'div',
          { className: 'method-trim-toggle', role: 'group', 'aria-label': tr('切换修订前后状态', 'Toggle before and after revision') },
          h(
            'button',
            {
              type: 'button',
              className: `method-toggle-chip${!trimFixed ? ' is-active-alert' : ''}`,
              'aria-pressed': String(!trimFixed),
              onClick: e => {
                e.stopPropagation();
                stopAutoPlay();
                activeStage = 'refine';
                activeDeliverable = null;
                trimFixed = false;
                render();
              }
            },
            h('strong', {}, tr('审核反馈', 'Review feedback')),
            h('span', {}, tr('饰条遮挡罐区', 'Trim obstructs jar area'))
          ),
          h(
            'button',
            {
              type: 'button',
              className: `method-toggle-chip${trimFixed ? ' is-active-ok' : ''}`,
              'aria-pressed': String(trimFixed),
              onClick: e => {
                e.stopPropagation();
                stopAutoPlay();
                activeStage = 'refine';
                activeDeliverable = null;
                trimFixed = true;
                render();
              }
            },
            h('strong', {}, tr('编辑并重建', 'Edit & rebuild')),
            h('span', {}, tr('缩短柜体饰条', 'Shorten cabinet trim'))
          )
        )
      )
    );

    const colInteract = h(
      'div',
      { className: 'method-col method-col-interact' },
      // (c) Interact
      h(
        'article',
        {
          className: `method-node${activeStage === 'interact' ? ' is-focused' : ''}`,
          dataset: { node: 'interact' },
          onClick: () => selectStage('interact', true)
        },
        h(
          'header',
          { className: 'method-node-head' },
          h('span', { className: 'method-node-tag' }, '(c)'),
          h('h3', {}, tr('机器人交互执行', 'Interact & control'))
        ),
        h(
          'div',
          { className: 'method-mini-chain' },
          h('span', {}, tr('行为程序 B', 'Behavior B')),
          h('i', { 'aria-hidden': 'true' }, '→'),
          h('span', {}, tr('规划与控制', 'Plan & control'))
        ),
        h(
          'figure',
          { className: 'method-rollout-stage' },
          h('img', { src: currentFrame.src, alt: tr(...currentFrame.label), loading: 'lazy' }),
          h('figcaption', {}, tr(...currentFrame.step))
        ),
        h(
          'div',
          { className: 'method-phase-tabs' },
          ROLLOUT_FRAMES.map((frame, index) =>
            h(
              'button',
              {
                type: 'button',
                className: index === activeRollout ? 'is-active' : '',
                'aria-pressed': String(index === activeRollout),
                onClick: e => {
                  e.stopPropagation();
                  stopAutoPlay();
                  activeStage = 'interact';
                  activeDeliverable = null;
                  activeRollout = index;
                  render();
                }
              },
              tr(...frame.label)
            )
          )
        )
      ),
      // Measure & score
      h(
        'article',
        {
          className: `method-node method-score-node${activeStage === 'interact' ? ' is-focused' : ''}`,
          dataset: { node: 'score' },
          onClick: () => selectStage('interact', true)
        },
        h(
          'header',
          { className: 'method-node-head' },
          h('span', { className: 'method-node-tag is-sage' }, 'R'),
          h('h3', {}, tr('测量与有状态评分', 'Measure & score'))
        ),
        h(
          'figure',
          { className: 'method-photo-card method-measure-card' },
          h('img', { src: './media/method/measure-roi.webp', alt: tr('冰箱内部测量区', 'Refrigerator interior measurement region'), loading: 'lazy' }),
          h('figcaption', {}, 'Facts f_t → Rubric R → Feedback v_k')
        ),
        h('code', { className: 'method-score-eq' }, '(z_{t+1}, y_t) = R(T, f_t, z_t)')
      )
    );

    const colDeliver = h(
      'div',
      { className: 'method-col method-col-deliver' },
      h(
        'article',
        {
          className: `method-node method-deliver-node${activeStage === 'deliver' ? ' is-focused' : ''}`,
          dataset: { node: 'deliver' },
          onClick: () => selectStage('deliver', true)
        },
        h(
          'header',
          { className: 'method-node-head' },
          h('span', { className: 'method-node-tag is-sage' }, 'W_v'),
          h('h3', {}, tr('冻结仿真场景与三类经验', 'Frozen scene & experience artifacts'))
        ),
        h(
          'figure',
          { className: 'method-hero-scene' },
          h('img', { src: './media/method/kitchen-hero.webp', alt: tr('冻结厨房仿真场景', 'Frozen kitchen simulation scene'), loading: 'lazy' }),
          h('span', { className: 'method-rev-badge' }, tr('冻结仿真场景', 'Frozen scene')),
          onInspect3D
            ? h(
                'button',
                {
                  type: 'button',
                  className: 'method-3d-jump',
                  onClick: e => {
                    e.stopPropagation();
                    stopAutoPlay();
                    onInspect3D('method-kitchen');
                  }
                },
                tr('查看 3D 模型 ↓', 'Inspect 3D ↓')
              )
            : null
        ),
        h(
          'div',
          { className: 'method-deliv-wrap' },
          h('span', { className: 'method-sublabel' }, tr('三类可复用经验产物（点击查看详情）', 'Linked experience artifacts (click to inspect)')),
          h(
            'div',
            { className: 'method-deliverables' },
          [
            {
              key: 'H',
              thumb: './media/method/trim-after.webp',
              title: tr('构建经验', 'Construction'),
              meta: 'H_x · Image + Diff'
            },
            {
              key: 'E',
              thumb: './media/method/rubric-inside.webp',
              title: tr('任务评分', 'Task rubrics'),
              meta: 'E_x · Inside & Door'
            },
            {
              key: 'D',
              thumb: './media/method/into-fridge.webp',
              title: tr('执行经验', 'Execution'),
              meta: 'D_x · o_t, a_t, y_t'
            }
          ].map(item =>
            h(
              'button',
              {
                type: 'button',
                className: `method-deliv-card${activeDeliverable === item.key ? ' is-selected' : ''}`,
                'aria-pressed': String(activeDeliverable === item.key),
                onClick: e => {
                  e.stopPropagation();
                  stopAutoPlay();
                  activeStage = 'deliver';
                  activeDeliverable = activeDeliverable === item.key ? null : item.key;
                  render();
                }
              },
              h('img', { src: item.thumb, alt: item.title, loading: 'lazy' }),
              h('strong', {}, item.title),
              h('small', {}, item.meta)
            )
          )
          )
        )
      )
    );

    const svgLayer = document.createElementNS(SVG_NS, 'svg');
    svgLayer.setAttribute('class', 'method-wires');
    svgLayer.setAttribute('aria-hidden', 'true');

    const board = h(
      'div',
      { className: 'method-board' },
      svgLayer,
      colInput,
      colAuthorRefine,
      colInteract,
      colDeliver
    );

    const inspector = h(
      'div',
      { className: 'method-inspector', 'aria-live': 'polite' },
      h(
        'div',
        { className: 'method-inspector-head' },
        h('span', { className: 'method-inspector-eyebrow' }, inspectorEyebrow),
        h('code', { className: 'method-inspector-formula' }, inspectorFormula)
      ),
      h('h4', { className: 'method-inspector-title' }, inspectorTitle),
      h('p', { className: 'method-inspector-copy' }, inspectorDetail)
    );

    const focusedRegion = activeDeliverable || activeStage;
    const stageChanged = plate.dataset.region !== focusedRegion;
    plate.dataset.region = focusedRegion;
    for (const [key, button] of buttons) {
      const stage = STAGES.find(item => item.id === key);
      const name = tr(...(stage?.label || PROGRAMS[key]?.name || DELIVERABLES[key].title));
      button.setAttribute('aria-label', name);
      button.title = name;
      button.setAttribute('aria-pressed', String(key === focusedRegion || (activeStage === 'author' && key === activeProgram)));
    }
    summary.textContent = tr('展开交互细节与修订前后对照', 'Explore program details and before/after comparisons');
    details.replaceChildren(summary, board);
    container.replaceChildren(toolbar, plate, inspector, details);

    requestAnimationFrame(() => {
      drawWires(board, svgLayer);
      if (stageChanged && plate.scrollWidth > plate.clientWidth) {
        const region = buttons.get(focusedRegion);
        plate.scrollTo({ left: region.offsetLeft - (plate.clientWidth - region.offsetWidth) / 2,
          behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      }
    });
    resizeObserver?.disconnect();
    resizeObserver = new ResizeObserver(() => drawWires(board, svgLayer));
    resizeObserver.observe(board);
  }

  render();
  return render;
}
