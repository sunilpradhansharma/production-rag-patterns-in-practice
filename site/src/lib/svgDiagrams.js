/**
 * Animated SVG architecture diagrams for all 26 RAG patterns.
 * Each diagram is built from helper functions and returns { svgHTML, steps }.
 * The steps array drives runDiagramAnimation() in animations.js.
 */

// ─── Color palette (mapped from Mermaid fill/stroke styles) ─────────────────

const C = {
  query:   { fill: '#EEF2FF', stroke: '#3730A3', sw: 2,   text: '#1e40af' },
  blue:    { fill: '#EEF2FF', stroke: '#C7D2FE', sw: 1.5, text: '#3730A3' },
  tealDB:  { fill: '#CCFBF1', stroke: '#2DD4BF', sw: 1.5, text: '#0F766E' },
  teal:    { fill: '#DCFCE7', stroke: '#86EFAC', sw: 1.5, text: '#166534' },
  white:   { fill: '#FFFFFF', stroke: '#D1D5DB', sw: 1,   text: '#374151' },
  orange:  { fill: '#FEF3C7', stroke: '#F59E0B', sw: 1.5, text: '#92400E' },
  answer:  { fill: '#F0FDF4', stroke: '#86EFAC', sw: 2,   text: '#166534' },
  diamond: { fill: '#FEF9C3', stroke: '#EAB308', sw: 1.5, text: '#713F12' },
  purple:  { fill: '#F5F3FF', stroke: '#DDD6FE', sw: 1.5, text: '#5B21B6' },
  gray:    { fill: '#F9FAFB', stroke: '#D1D5DB', sw: 1,   text: '#6B7280' },
  red:     { fill: '#FEF2F2', stroke: '#FCA5A5', sw: 1.5, text: '#991B1B' },
}

// ─── SVG element builders ────────────────────────────────────────────────────

const F = `font-family="Google Sans,Product Sans,system-ui,sans-serif"`

function ff(id, x, y, w, h, c, lines) {
  const mx = x + w / 2
  const my = y + h / 2
  const n = lines.length
  const dy0 = n === 1 ? 4 : n === 2 ? -4 : -10
  const ts = lines.map((l, i) =>
    `<text x="${mx}" y="${my + dy0 + i * 14}" text-anchor="middle" ${F}
      font-size="${i === 0 ? 12 : 10}" font-weight="${i === 0 ? 600 : 400}"
      fill="${c.text}">${l}</text>`
  ).join('')
  return `<g id="${id}" opacity="0" style="transform-box:fill-box;transform-origin:center">
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8"
    fill="${c.fill}" stroke="${c.stroke}" stroke-width="${c.sw}"/>
  ${ts}</g>`
}

// rect node centered at (cx, cy)
function rn(id, cx, cy, w, h, c, lines) {
  return ff(id, cx - w / 2, cy - h / 2, w, h, c, lines)
}

// standard 130×44 node
function sn(id, cx, cy, c, lines) { return rn(id, cx, cy, 130, 44, c, lines) }

// wide 156×52 node
function wn(id, cx, cy, c, lines) { return rn(id, cx, cy, 156, 52, c, lines) }

// narrow 90×40 node
function nn(id, cx, cy, c, lines) { return rn(id, cx, cy, 90, 40, c, lines) }

// cylinder node
function fc(id, cx, ct, rx, ry, bh, c, label) {
  const cb = ct + bh
  return `<g id="${id}" opacity="0" style="transform-box:fill-box;transform-origin:center">
  <rect x="${cx - rx}" y="${ct}" width="${rx * 2}" height="${bh}" fill="${c.fill}" stroke="none"/>
  <ellipse cx="${cx}" cy="${cb}" rx="${rx}" ry="${ry}" fill="${c.fill}"
    stroke="${c.stroke}" stroke-width="${c.sw}"/>
  <ellipse cx="${cx}" cy="${ct}" rx="${rx}" ry="${ry}" fill="${c.fill}"
    stroke="${c.stroke}" stroke-width="${c.sw}"/>
  <line x1="${cx - rx}" y1="${ct}" x2="${cx - rx}" y2="${cb}"
    stroke="${c.stroke}" stroke-width="${c.sw}"/>
  <line x1="${cx + rx}" y1="${ct}" x2="${cx + rx}" y2="${cb}"
    stroke="${c.stroke}" stroke-width="${c.sw}"/>
  <text x="${cx}" y="${ct + bh / 2 + 5}" text-anchor="middle" ${F}
    font-size="12" font-weight="600" fill="${c.text}">${label}</text>
  </g>`
}

// diamond node centered at (cx, cy)
function fd(id, cx, cy, w, h, c, lines) {
  const hw = w / 2, hh = h / 2
  const pts = `${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`
  const n = lines.length
  const ts = lines.map((l, i) =>
    `<text x="${cx}" y="${cy + (n === 1 ? 4 : -4 + i * 13)}" text-anchor="middle" ${F}
      font-size="10" font-weight="500" fill="${c.text}">${l}</text>`
  ).join('')
  return `<g id="${id}" opacity="0" style="transform-box:fill-box;transform-origin:center">
  <polygon points="${pts}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="${c.sw}"/>
  ${ts}</g>`
}

// arrow path — marker auto-selected by color hint
function fa(id, d, mk) {
  return `<path id="${id}" d="${d}" fill="none" stroke="#94a3b8" stroke-width="1.5"
    marker-end="url(#${mk || 'arr'})" opacity="0"/>`
}

// defs block (markers + packet group)
function defs() {
  const m = (id, fill) =>
    `<marker id="${id}" markerWidth="8" markerHeight="8" refX="7" refY="3.5"
      orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L7,3.5 L0,7 Z" fill="${fill}"/>
    </marker>`
  return `<defs>
    ${m('arr', '#94a3b8')}${m('arr-b', '#3730A3')}
    ${m('arr-g', '#15803d')}${m('arr-t', '#0F766E')}
    ${m('arr-o', '#F59E0B')}
  </defs>
  <g id="pkt-group"></g>`
}

function svg(vb, inner) {
  return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg"
    style="overflow:visible;width:100%;height:auto">${defs()}${inner}</svg>`
}

// step helpers
function ns(id, delay, glow, glowTimes) {
  return { type: 'node', id, delay: delay || 0, ...(glow ? { glow, glowTimes: glowTimes || 2 } : {}) }
}
function as(id, delay, packet, packetSize, dur) {
  return { type: 'arrow', id, delay: delay || 0, ...(packet ? { packet, packetSize: packetSize || 5 } : {}), ...(dur ? { dur } : {}) }
}

// ─── Pattern 1 — Naive RAG (LR) ─────────────────────────────────────────────
function p1() {
  const inner = [
    ff('n-docs', 248, 16, 140, 40, C.blue, ['Documents']),
    ff('n-query', 8, 73, 114, 40, C.query, ['User Query']),
    ff('n-qv', 248, 73, 140, 40, C.white, ['Query vector']),
    fc('n-vdb', 461, 68, 41, 13, 36, C.tealDB, 'Vector DB'),
    ff('n-pa', 556, 73, 164, 40, C.white, ['Prompt assembly']),
    ff('n-llm', 734, 73, 60, 40, C.white, ['LLM']),
    ff('n-ans', 808, 73, 74, 40, C.answer, ['Answer']),
    fa('a-dv',   'M 388,36 C 435,36 422,58 420,83', 'arr-t'),
    fa('a-qqv',  'M 122,93 L 248,93', 'arr-b'),
    fa('a-qvv',  'M 388,93 L 420,93', 'arr-b'),
    fa('a-vpa',  'M 502,87 L 556,93', 'arr'),
    fa('a-qpa',  'M 65,73 C 65,28 620,28 620,73', 'arr'),
    fa('a-pal',  'M 720,93 L 734,93', 'arr'),
    fa('a-la',   'M 794,93 L 808,93', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 900 175', inner),
    steps: [
      ns('n-docs', 0),
      as('a-dv', 150, '#0F766E'),
      ns('n-vdb', 0, 'teal'),
      ns('n-query', 300),
      as('a-qqv', 80, '#3730A3'),
      ns('n-qv', 0),
      as('a-qvv', 100, '#3730A3'),
      as('a-vpa', 120, '#0F766E'),
      as('a-qpa', 0),
      ns('n-pa', 0, 'indigo'),
      as('a-pal', 200, '#3730A3'),
      ns('n-llm', 0, 'indigo'),
      as('a-la', 200, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 2 — Advanced RAG (LR) ──────────────────────────────────────────
function p2() {
  const inner = [
    ff('n-q',   5,  83, 100, 40, C.query, ['User Query']),
    ff('n-rw',  130, 40, 148, 52, C.blue,  ['Query Rewriter', 'LLM generates N variants']),
    fc('n-vdb', 200, 148, 44, 13, 40, C.tealDB, 'Vector DB'),
    ff('n-ret', 310, 72, 138, 52, C.white, ['Retrieve', 'top-K per variant']),
    ff('n-rr',  474, 55, 148, 78, C.blue,  ['Reranker', 'Cross-encoder scores', 'all candidates']),
    ff('n-cc',  648, 44, 145, 100, C.blue, ['Context', 'Compressor', 'Extract relevant']),
    ff('n-llm', 812, 79, 50, 36, C.white, ['LLM']),
    ff('n-ans', 872, 79, 60, 36, C.answer, ['Answer']),
    fa('a-qrw',  'M 105,83 C 115,60 122,66 130,66', 'arr-b'),
    fa('a-qvdb', 'M 55,103 C 55,135 110,162 156,168', 'arr-t'),
    fa('a-rwret','M 278,66 C 294,66 300,98 310,98', 'arr-b'),
    fa('a-vret', 'M 244,163 C 280,163 296,110 310,110', 'arr-t'),
    fa('a-rrr',  'M 448,98 L 474,94', 'arr'),
    fa('a-rrcc', 'M 622,94 L 648,94', 'arr'),
    fa('a-ccl',  'M 793,94 L 812,97', 'arr'),
    fa('a-la',   'M 862,97 L 872,97', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 940 210', inner),
    steps: [
      ns('n-q', 0),
      as('a-qrw', 100, '#3730A3'),
      as('a-qvdb', 100),
      ns('n-rw', 0, 'indigo'),
      ns('n-vdb', 0, 'teal'),
      as('a-rwret', 150, '#3730A3'),
      as('a-vret', 0, '#0F766E'),
      ns('n-ret', 0, 'indigo'),
      as('a-rrr', 150, '#3730A3'),
      ns('n-rr', 0, 'indigo'),
      as('a-rrcc', 150, '#3730A3'),
      ns('n-cc', 0, 'indigo'),
      as('a-ccl', 150, '#3730A3'),
      ns('n-llm', 0),
      as('a-la', 150, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 3 — Hybrid RAG (TD) ────────────────────────────────────────────
function p3() {
  // Q at center top; D1 (BM25 idx) and D2 (VDB) feed into S1, S2 from left/right
  const inner = [
    sn('n-q',   320, 52,  C.query,  ['User Query']),
    fc('n-d1',  120, 108, 44, 12, 34, C.orange, 'BM25 idx'),
    sn('n-s1',  120, 200, C.blue,   ['Sparse BM25']),
    fc('n-d2',  520, 108, 44, 12, 34, C.tealDB, 'Vector DB'),
    sn('n-s2',  520, 200, C.blue,   ['Dense Vector']),
    sn('n-f',   320, 290, C.orange, ['RRF Fusion', 'k = 60']),
    sn('n-p',   320, 374, C.white,  ['Prompt']),
    nn('n-llm', 240, 450, C.white,  ['LLM']),
    nn('n-ans', 400, 450, C.answer, ['Answer']),
    fa('a-qs1',  'M 280,74 C 200,74 140,156 120,178', 'arr-b'),
    fa('a-qs2',  'M 360,74 C 440,74 500,156 520,178', 'arr-b'),
    fa('a-d1s1', 'M 120,154 L 120,178', 'arr-t'),
    fa('a-d2s2', 'M 520,154 L 520,178', 'arr-t'),
    fa('a-s1f',  'M 168,222 C 240,222 274,268 290,268', 'arr'),
    fa('a-s2f',  'M 472,222 C 400,222 352,268 350,268', 'arr'),
    fa('a-fp',   'M 320,312 L 320,352', 'arr'),
    fa('a-pl',   'M 280,374 L 255,430', 'arr'),
    fa('a-la',   'M 285,450 L 355,450', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 480', inner),
    steps: [
      ns('n-q', 0),
      as('a-qs1', 100), as('a-qs2', 100),
      ns('n-d1', 0), ns('n-d2', 0),
      as('a-d1s1', 100, '#F59E0B'), as('a-d2s2', 100, '#0F766E'),
      ns('n-s1', 0), ns('n-s2', 0),
      as('a-s1f', 150), as('a-s2f', 150),
      ns('n-f', 0, 'indigo'),
      as('a-fp', 150, '#3730A3'),
      ns('n-p', 0),
      as('a-pl', 120), as('a-la', 0, '#15803d'),
      ns('n-llm', 0), ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 4 — RAG Fusion (TD) ────────────────────────────────────────────
function p4() {
  const inner = [
    sn('n-q',   320, 52,  C.query,  ['User Query']),
    sn('n-vg',  320, 142, C.orange, ['Generate', 'N Variants']),
    sn('n-r1',  140, 232, C.teal,   ['Retrieve', 'variant 1']),
    sn('n-r2',  320, 232, C.teal,   ['Retrieve', 'variant 2']),
    sn('n-rn',  500, 232, C.teal,   ['Retrieve', 'variant N']),
    sn('n-rrf', 320, 322, C.orange, ['RRF Fusion', 'merge ranked']),
    sn('n-dd',  320, 402, C.blue,   ['Deduplicate']),
    sn('n-gen', 320, 482, C.teal,   ['Generate', 'final answer']),
    nn('n-ans', 320, 556, C.answer, ['Answer']),
    fa('a-qvg',  'M 320,74 L 320,120', 'arr-b'),
    fa('a-vgr1', 'M 274,164 C 210,164 162,210 140,210', 'arr'),
    fa('a-vgr2', 'M 320,164 L 320,210', 'arr'),
    fa('a-vgrn', 'M 366,164 C 430,164 478,210 500,210', 'arr'),
    fa('a-r1rrf','M 168,254 C 230,254 280,300 300,300', 'arr'),
    fa('a-r2rrf','M 320,254 L 320,300', 'arr'),
    fa('a-rnrrf','M 472,254 C 410,254 356,300 340,300', 'arr'),
    fa('a-rdd',  'M 320,344 L 320,380', 'arr'),
    fa('a-ddg',  'M 320,424 L 320,460', 'arr'),
    fa('a-ga',   'M 320,504 L 320,536', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 580', inner),
    steps: [
      ns('n-q', 0),
      as('a-qvg', 100, '#3730A3'),
      ns('n-vg', 0, 'orange'),
      as('a-vgr1', 150), as('a-vgr2', 150), as('a-vgrn', 150),
      ns('n-r1', 0), ns('n-r2', 0), ns('n-rn', 0),
      as('a-r1rrf', 150), as('a-r2rrf', 150), as('a-rnrrf', 150),
      ns('n-rrf', 0, 'indigo'),
      as('a-rdd', 150, '#3730A3'),
      ns('n-dd', 0),
      as('a-ddg', 120, '#3730A3'),
      ns('n-gen', 0),
      as('a-ga', 120, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 5 — MultiQuery RAG (TD) ────────────────────────────────────────
function p5() {
  const inner = [
    sn('n-q',   320, 52,  C.query,  ['Complex Query']),
    sn('n-qg',  320, 142, C.orange, ['Generate', '3–5 perspectives']),
    sn('n-r1',  140, 232, C.teal,   ['Retrieve', 'perspective 1']),
    sn('n-r2',  320, 232, C.teal,   ['Retrieve', 'perspective 2']),
    sn('n-rn',  500, 232, C.teal,   ['Retrieve', 'perspective N']),
    sn('n-u',   320, 322, C.blue,   ['Union +', 'Deduplicate']),
    sn('n-gen', 320, 406, C.teal,   ['Generate', 'final answer']),
    nn('n-ans', 320, 480, C.answer, ['Answer']),
    fa('a-qqg',  'M 320,74 L 320,120', 'arr-b'),
    fa('a-qgr1', 'M 274,164 C 200,164 162,210 140,210', 'arr'),
    fa('a-qgr2', 'M 320,164 L 320,210', 'arr'),
    fa('a-qgrn', 'M 366,164 C 440,164 478,210 500,210', 'arr'),
    fa('a-r1u',  'M 168,254 C 230,254 280,300 300,300', 'arr'),
    fa('a-r2u',  'M 320,254 L 320,300', 'arr'),
    fa('a-rnu',  'M 472,254 C 410,254 350,300 340,300', 'arr'),
    fa('a-ug',   'M 320,344 L 320,384', 'arr'),
    fa('a-ga',   'M 320,428 L 320,460', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 510', inner),
    steps: [
      ns('n-q', 0),
      as('a-qqg', 100, '#3730A3'),
      ns('n-qg', 0, 'orange'),
      as('a-qgr1', 150), as('a-qgr2', 150), as('a-qgrn', 150),
      ns('n-r1', 0), ns('n-r2', 0), ns('n-rn', 0),
      as('a-r1u', 150), as('a-r2u', 150), as('a-rnu', 150),
      ns('n-u', 0, 'indigo'),
      as('a-ug', 150, '#3730A3'),
      ns('n-gen', 0),
      as('a-ga', 120, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 6 — HyDE (TD) ──────────────────────────────────────────────────
function p6() {
  const inner = [
    sn('n-q',    320, 52,  C.query,  ['User Query']),
    sn('n-llm1', 320, 142, C.blue,   ['LLM', 'generates hyp. answer']),
    sn('n-he',   320, 232, C.orange, ['Embed hypothetical', '→ answer space']),
    fc('n-vdb',  320, 302, 48, 13, 44, C.tealDB, 'Vector DB'),
    sn('n-p',    320, 410, C.white,  ['Prompt assembly']),
    sn('n-llm2', 320, 494, C.white,  ['LLM']),
    nn('n-ans',  320, 570, C.answer, ['Answer']),
    fa('a-ql1',  'M 320,74 L 320,120', 'arr-b'),
    fa('a-l1he', 'M 320,164 L 320,210', 'arr'),
    fa('a-hevdb','M 320,254 L 320,302', 'arr-t'),
    fa('a-vdbp', 'M 320,358 L 320,388', 'arr'),
    fa('a-qp',   'M 345,74 C 450,74 450,410 385,410', 'arr'),
    fa('a-pl2',  'M 320,432 L 320,472', 'arr'),
    fa('a-l2a',  'M 320,516 L 320,550', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 600', inner),
    steps: [
      ns('n-q', 0),
      as('a-ql1', 100, '#3730A3'),
      ns('n-llm1', 0, 'indigo'),
      as('a-l1he', 150, '#3730A3'),
      ns('n-he', 0),
      as('a-hevdb', 150, '#F59E0B'),
      ns('n-vdb', 0, 'teal'),
      as('a-vdbp', 150, '#0F766E'),
      as('a-qp', 0),
      ns('n-p', 0, 'indigo'),
      as('a-pl2', 150, '#3730A3'),
      ns('n-llm2', 0),
      as('a-l2a', 150, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 7 — Step-Back RAG (TD) ─────────────────────────────────────────
function p7() {
  const inner = [
    sn('n-q',   320, 52,  C.query,  ['Specific Query']),
    sn('n-ag',  160, 152, C.orange, ['Generate', 'step-back query']),
    sn('n-r2',  480, 152, C.teal,   ['Retrieve', 'original query']),
    sn('n-r1',  160, 242, C.teal,   ['Retrieve', 'abstract query']),
    sn('n-c',   320, 332, C.blue,   ['Combine contexts', 'principle + specific']),
    sn('n-gen', 320, 416, C.teal,   ['Generate', 'final answer']),
    nn('n-ans', 320, 492, C.answer, ['Answer']),
    fa('a-qag',  'M 280,74 C 220,74 182,130 160,130', 'arr'),
    fa('a-qr2',  'M 360,74 C 420,74 458,130 480,130', 'arr-b'),
    fa('a-agr1', 'M 160,174 L 160,220', 'arr'),
    fa('a-r1c',  'M 202,264 C 240,264 278,310 298,310', 'arr'),
    fa('a-r2c',  'M 452,174 C 400,270 376,310 350,310', 'arr'),
    fa('a-cg',   'M 320,354 L 320,394', 'arr'),
    fa('a-ga',   'M 320,438 L 320,472', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 520', inner),
    steps: [
      ns('n-q', 0),
      as('a-qag', 100), as('a-qr2', 100, '#3730A3'),
      ns('n-ag', 0, 'orange'), ns('n-r2', 0),
      as('a-agr1', 150), as('a-r2c', 150),
      ns('n-r1', 0),
      as('a-r1c', 150),
      ns('n-c', 0, 'indigo'),
      as('a-cg', 150, '#3730A3'),
      ns('n-gen', 0),
      as('a-ga', 120, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 8 — FLARE (TD) ─────────────────────────────────────────────────
function p8() {
  const inner = [
    sn('n-q',     320, 52,  C.query,   ['Query + Context']),
    sn('n-gen1',  320, 142, C.orange,  ['Generate sentence', 'current context']),
    fd('n-ud',    320, 232, 140, 56, C.diamond, ['Uncertain', 'spans?']),
    sn('n-acc',   160, 320, C.teal,    ['Accept sentence', 'append to output']),
    sn('n-ret',   480, 320, C.orange,  ['Retrieve on', 'uncertain span']),
    fd('n-done',  160, 410, 130, 50, C.diamond, ['Generation', 'complete?']),
    sn('n-inj',   480, 410, C.blue,    ['Inject retrieved', 'docs into context']),
    sn('n-out',   160, 490, C.answer,  ['Final output', 'fully grounded']),
    sn('n-regen', 480, 490, C.orange,  ['Regenerate sentence', 'with new context']),
    fa('a-qg',    'M 320,74 L 320,120', 'arr-b'),
    fa('a-gud',   'M 320,164 L 320,204', 'arr'),
    fa('a-uacc',  'M 264,232 C 204,232 160,298 160,298', 'arr'),
    fa('a-uret',  'M 376,232 C 436,232 480,298 480,298', 'arr'),
    fa('a-accdone','M 160,342 L 160,385', 'arr'),
    fa('a-retinj','M 480,342 L 480,388', 'arr'),
    fa('a-doneout','M 160,435 L 160,468', 'arr-g'),
    fa('a-injreg','M 480,432 L 480,468', 'arr'),
    fa('a-regacc','M 434,512 C 300,540 160,380 160,342', 'arr'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 530', inner),
    steps: [
      ns('n-q', 0),
      as('a-qg', 100, '#3730A3'),
      ns('n-gen1', 0, 'orange'),
      as('a-gud', 150),
      ns('n-ud', 0),
      as('a-uacc', 100), as('a-uret', 100),
      ns('n-acc', 0), ns('n-ret', 0),
      as('a-accdone', 100), as('a-retinj', 100),
      ns('n-done', 0), ns('n-inj', 0),
      as('a-doneout', 100), as('a-injreg', 100),
      ns('n-out', 0, 'green', 2), ns('n-regen', 0),
      as('a-regacc', 100),
    ],
  }
}

// ─── Pattern 9 — Ensemble RAG (TD) ──────────────────────────────────────────
function p9() {
  const inner = [
    sn('n-q',   320, 52,  C.query,  ['User Query']),
    sn('n-r1',  120, 152, C.blue,   ['BM25', 'Retriever']),
    sn('n-r2',  320, 152, C.blue,   ['Dense Vector', 'Retriever']),
    sn('n-r3',  520, 152, C.blue,   ['Keyword', 'Retriever']),
    sn('n-c',   320, 252, C.orange, ['Ensemble Combiner', 'RRF + weights']),
    sn('n-llm', 320, 336, C.white,  ['LLM']),
    nn('n-ans', 320, 412, C.answer, ['Answer']),
    fa('a-qr1', 'M 280,74 C 200,74 142,130 120,130', 'arr-b'),
    fa('a-qr2', 'M 320,74 L 320,130', 'arr-b'),
    fa('a-qr3', 'M 360,74 C 440,74 498,130 520,130', 'arr-b'),
    fa('a-r1c', 'M 168,174 C 224,230 270,230 300,230', 'arr'),
    fa('a-r2c', 'M 320,174 L 320,230', 'arr'),
    fa('a-r3c', 'M 472,174 C 416,230 366,230 340,230', 'arr'),
    fa('a-cl',  'M 320,274 L 320,314', 'arr'),
    fa('a-la',  'M 320,358 L 320,392', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 440', inner),
    steps: [
      ns('n-q', 0),
      as('a-qr1', 80), as('a-qr2', 80), as('a-qr3', 80),
      ns('n-r1', 0), ns('n-r2', 0), ns('n-r3', 0),
      as('a-r1c', 150), as('a-r2c', 150), as('a-r3c', 150),
      ns('n-c', 0, 'indigo'),
      as('a-cl', 150, '#3730A3'),
      ns('n-llm', 0),
      as('a-la', 150, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 10 — Parent Document (TD) ──────────────────────────────────────
function p10() {
  const inner = [
    sn('n-d',  160, 52,  C.blue,   ['Document']),
    sn('n-q',  480, 52,  C.query,  ['Query']),
    sn('n-par',160, 142, C.teal,   ['Parent chunks', '512 tokens']),
    sn('n-ch', 160, 232, C.blue,   ['Child chunks', '128 tokens']),
    sn('n-e',  480, 142, C.blue,   ['Embed query']),
    fc('n-vdb',320, 302, 48, 13, 44, C.tealDB, 'Vector DB'),
    sn('n-lk', 320, 410, C.blue,   ['Look up', 'parent ID']),
    sn('n-ctx',320, 494, C.teal,   ['Rich context', '512 tokens']),
    sn('n-gen',320, 572, C.teal,   ['Generate']),
    nn('n-ans',320, 644, C.answer, ['Answer']),
    fa('a-dp',  'M 160,74 L 160,120', 'arr'),
    fa('a-pch', 'M 160,164 L 160,210', 'arr'),
    fa('a-chv', 'M 202,254 C 260,280 294,302 272,324', 'arr'),
    fa('a-qe',  'M 480,74 L 480,120', 'arr-b'),
    fa('a-ev',  'M 452,164 C 400,220 368,302 368,302', 'arr-b'),
    fa('a-vlk', 'M 320,358 L 320,388', 'arr-t'),
    fa('a-lkc', 'M 320,432 L 320,472', 'arr'),
    fa('a-cg',  'M 320,516 L 320,550', 'arr'),
    fa('a-ga',  'M 320,594 L 320,624', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 674', inner),
    steps: [
      ns('n-d', 0), ns('n-q', 0),
      as('a-dp', 100), as('a-qe', 100, '#3730A3'),
      ns('n-par', 0), ns('n-e', 0),
      as('a-pch', 100),
      ns('n-ch', 0),
      as('a-chv', 120), as('a-ev', 120),
      ns('n-vdb', 0, 'teal'),
      as('a-vlk', 150, '#0F766E'),
      ns('n-lk', 0),
      as('a-lkc', 120),
      ns('n-ctx', 0, 'indigo'),
      as('a-cg', 120, '#3730A3'),
      ns('n-gen', 0),
      as('a-ga', 120, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 11 — Sentence Window (TD) ──────────────────────────────────────
function p11() {
  const inner = [
    sn('n-d',  160, 52,  C.blue,   ['Document']),
    sn('n-q',  480, 52,  C.query,  ['Query']),
    sn('n-sp', 160, 142, C.orange, ['Sentence parser']),
    sn('n-sn', 160, 232, C.teal,   ['Sentence nodes', '+ window metadata']),
    sn('n-idx',320, 322, C.orange, ['Sentence-level', 'vector index']),
    sn('n-ms', 320, 412, C.teal,   ['Matched sentence', '± k window']),
    sn('n-we', 320, 496, C.blue,   ['Window expansion', 'MetadataReplacement']),
    sn('n-gen',320, 574, C.teal,   ['Generate answer']),
    nn('n-ans',320, 648, C.answer, ['Answer']),
    fa('a-dsp', 'M 160,74 L 160,120', 'arr'),
    fa('a-spn', 'M 160,164 L 160,210', 'arr'),
    fa('a-ni',  'M 202,254 C 260,270 294,300 300,300', 'arr'),
    fa('a-qi',  'M 452,74 C 400,200 366,300 340,300', 'arr-b'),
    fa('a-im',  'M 320,344 L 320,390', 'arr'),
    fa('a-mw',  'M 320,434 L 320,474', 'arr'),
    fa('a-wg',  'M 320,518 L 320,552', 'arr'),
    fa('a-ga',  'M 320,596 L 320,628', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 678', inner),
    steps: [
      ns('n-d', 0), ns('n-q', 0),
      as('a-dsp', 80),
      ns('n-sp', 0, 'orange'),
      as('a-spn', 120),
      ns('n-sn', 0),
      as('a-ni', 150), as('a-qi', 150, '#3730A3'),
      ns('n-idx', 0, 'indigo'),
      as('a-im', 150),
      ns('n-ms', 0),
      as('a-mw', 120),
      ns('n-we', 0, 'indigo'),
      as('a-wg', 120),
      ns('n-gen', 0),
      as('a-ga', 120, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 12 — RAPTOR (TD) ───────────────────────────────────────────────
function p12() {
  const inner = [
    sn('n-d',   320, 52,  C.blue,   ['Documents']),
    sn('n-lc',  320, 142, C.orange, ['Leaf chunking', '400-char chunks']),
    sn('n-eu',  320, 232, C.orange, ['Embed + UMAP', '+ GMM cluster']),
    sn('n-s1',  160, 322, C.teal,   ['Summarise', 'Level 1 clusters']),
    sn('n-s2',  480, 322, C.teal,   ['Summarise', 'Level 2 clusters']),
    sn('n-root',320, 412, C.teal,   ['Root summary', 'entire corpus']),
    fc('n-idx', 320, 472, 48, 13, 44, C.orange, 'Unified Index'),
    sn('n-q',   520, 480, C.query,  ['Query']),
    sn('n-r',   320, 578, C.teal,   ['Retrieve any', 'tree level']),
    sn('n-gen', 320, 656, C.teal,   ['Generate answer']),
    nn('n-ans', 320, 728, C.answer, ['Answer']),
    fa('a-dlc', 'M 320,74 L 320,120', 'arr'),
    fa('a-lce', 'M 320,164 L 320,210', 'arr'),
    fa('a-es1', 'M 278,254 C 218,280 180,300 160,300', 'arr'),
    fa('a-es2', 'M 362,254 C 422,280 460,300 480,300', 'arr'),
    fa('a-s1r', 'M 202,344 C 260,370 294,390 300,390', 'arr'),
    fa('a-s2r', 'M 438,344 C 380,370 346,390 340,390', 'arr'),
    fa('a-ri',  'M 320,434 L 320,472', 'arr'),
    fa('a-qi',  'M 485,502 C 430,502 368,510 368,510', 'arr-b'),
    fa('a-ir',  'M 320,528 L 320,556', 'arr-t'),
    fa('a-rg',  'M 320,600 L 320,634', 'arr'),
    fa('a-ga',  'M 320,678 L 320,708', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 758', inner),
    steps: [
      ns('n-d', 0),
      as('a-dlc', 100),
      ns('n-lc', 0),
      as('a-lce', 120),
      ns('n-eu', 0, 'orange'),
      as('a-es1', 150), as('a-es2', 150),
      ns('n-s1', 0), ns('n-s2', 0),
      as('a-s1r', 150), as('a-s2r', 150),
      ns('n-root', 0),
      as('a-ri', 120),
      ns('n-idx', 0, 'indigo'),
      ns('n-q', 0),
      as('a-qi', 100, '#3730A3'),
      as('a-ir', 120, '#F59E0B'),
      ns('n-r', 0),
      as('a-rg', 120, '#3730A3'),
      ns('n-gen', 0),
      as('a-ga', 120, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 13 — Contextual RAG (TD) ───────────────────────────────────────
function p13() {
  const inner = [
    sn('n-d',   320, 52,  C.blue,   ['Document']),
    sn('n-ch',  320, 142, C.orange, ['Raw chunks']),
    sn('n-cg',  320, 232, C.teal,   ['Claude generates', 'context per chunk']),
    sn('n-en',  320, 322, C.orange, ['Prepend context', 'to chunk']),
    fc('n-vdb', 320, 392, 48, 13, 44, C.tealDB, 'Vector DB'),
    sn('n-q',   520, 400, C.query,  ['Query']),
    sn('n-g',   320, 498, C.teal,   ['Generate']),
    sn('n-ans', 320, 576, C.answer, ['Answer with', 'doc awareness']),
    fa('a-dc',  'M 320,74 L 320,120', 'arr'),
    fa('a-ccg', 'M 320,164 L 320,210', 'arr'),
    fa('a-cge', 'M 320,254 L 320,300', 'arr'),
    fa('a-ev',  'M 320,344 L 320,392', 'arr-t'),
    fa('a-qv',  'M 490,422 C 440,422 368,422 368,430', 'arr-b'),
    fa('a-vg',  'M 320,448 L 320,476', 'arr'),
    fa('a-ga',  'M 320,520 L 320,554', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 610', inner),
    steps: [
      ns('n-d', 0),
      as('a-dc', 100),
      ns('n-ch', 0),
      as('a-ccg', 120),
      ns('n-cg', 0, 'indigo'),
      as('a-cge', 150, '#3730A3'),
      ns('n-en', 0),
      as('a-ev', 150),
      ns('n-vdb', 0, 'teal'),
      ns('n-q', 0),
      as('a-qv', 100, '#3730A3'),
      as('a-vg', 100, '#0F766E'),
      ns('n-g', 0),
      as('a-ga', 120, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 14 — Propositions RAG (TD) ─────────────────────────────────────
function p14() {
  const inner = [
    sn('n-d',   160, 52,  C.blue,   ['Document']),
    sn('n-q',   480, 52,  C.query,  ['Query']),
    sn('n-c',   160, 142, C.orange, ['Chunk', '400-char splits']),
    sn('n-sg',  80,  242, C.orange, ['Generate', 'summary']),
    sn('n-qg',  240, 242, C.orange, ['Generate', 'questions']),
    sn('n-rt',  400, 242, C.orange, ['Raw text', 'chunk']),
    fc('n-vs',  240, 360, 56, 14, 44, C.orange, 'Vector Store'),
    sn('n-ds',  400, 370, C.teal,   ['Document', 'Store']),
    sn('n-eq',  480, 142, C.blue,   ['Embed query']),
    sn('n-gen', 300, 480, C.teal,   ['Generate answer']),
    nn('n-ans', 300, 556, C.answer, ['Answer']),
    fa('a-dc',  'M 160,74 L 160,120', 'arr'),
    fa('a-csg', 'M 118,164 C  96,190  80,220  80,220', 'arr'),
    fa('a-cqg', 'M 160,164 L 200,220', 'arr'),
    fa('a-crt', 'M 200,164 C 300,164 390,220 400,220', 'arr'),
    fa('a-cds', 'M 200,164 C 330,164 390,348 390,348', 'arr'),
    fa('a-sgv', 'M  80,264 C  80,310 184,360 184,360', 'arr'),
    fa('a-qgv', 'M 240,264 L 240,360', 'arr'),
    fa('a-rtv', 'M 400,264 C 380,300 296,360 296,360', 'arr'),
    fa('a-qe',  'M 480,74 L 480,120', 'arr-b'),
    fa('a-evs', 'M 452,164 C 380,260 296,360 296,360', 'arr-b'),
    fa('a-vsg', 'M 280,416 C 286,448 294,458 294,458', 'arr-t'),
    fa('a-dsg', 'M 370,392 C 340,430 314,456 310,458', 'arr'),
    fa('a-ga',  'M 300,502 L 300,534', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 580 586', inner),
    steps: [
      ns('n-d', 0), ns('n-q', 0),
      as('a-dc', 100), as('a-qe', 100, '#3730A3'),
      ns('n-c', 0), ns('n-eq', 0),
      as('a-csg', 100), as('a-cqg', 100), as('a-crt', 100),
      as('a-cds', 100),
      ns('n-sg', 0), ns('n-qg', 0), ns('n-rt', 0),
      as('a-sgv', 150), as('a-qgv', 150), as('a-rtv', 150),
      as('a-evs', 100, '#3730A3'),
      ns('n-vs', 0, 'indigo'), ns('n-ds', 0),
      as('a-vsg', 150, '#F59E0B'), as('a-dsg', 0),
      ns('n-gen', 0),
      as('a-ga', 120, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 15 — Long-Context RAG (TD) ─────────────────────────────────────
function p15() {
  const inner = [
    sn('n-q',   160, 52,  C.query, ['User Query']),
    sn('n-d',   480, 52,  C.blue,  ['Full Document', 'or document set']),
    sn('n-ctx', 320, 152, C.blue,  ['Context assembler', 'query + full text']),
    sn('n-llm', 320, 252, C.teal,  ['Long-context LLM', 'Claude 200K']),
    sn('n-ans', 320, 342, C.answer,['Answer']),
    fa('a-qc',  'M 202,74 C 255,100 284,130 300,130', 'arr-b'),
    fa('a-dc',  'M 438,74 C 390,100 356,130 340,130', 'arr'),
    fa('a-cl',  'M 320,174 L 320,230', 'arr'),
    fa('a-la',  'M 320,274 L 320,320', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 374', inner),
    steps: [
      ns('n-q', 0), ns('n-d', 0),
      as('a-qc', 100, '#3730A3'), as('a-dc', 100),
      ns('n-ctx', 0, 'indigo'),
      as('a-cl', 150, '#3730A3'),
      ns('n-llm', 0, 'indigo'),
      as('a-la', 150, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 16 — Self-RAG (TD) ─────────────────────────────────────────────
function p16() {
  const inner = [
    sn('n-q',    320, 52,  C.query,   ['User Query']),
    fd('n-r',    320, 148, 130, 54, C.diamond, ['Retrieve?']),
    fc('n-vdb',  320, 232, 46, 13, 42, C.tealDB, 'Vector DB'),
    fd('n-rel',  320, 336, 130, 54, C.diamond, ['ISREL', 'per doc']),
    sn('n-gen',  320, 430, C.teal,    ['Generate', 'with context']),
    fd('n-sup',  320, 520, 130, 54, C.diamond, ['ISSUP', 'per claim']),
    fd('n-use',  160, 614, 120, 50, C.diamond, ['ISUSE', 'utility']),
    sn('n-ans',  320, 614, C.answer,  ['Grounded answer', 'with citations']),
    sn('n-flag', 480, 614, C.red,     ['Abstain with', 'explanation']),
    fa('a-qr',   'M 320,74 L 320,121', 'arr-b'),
    fa('a-rv',   'M 320,175 L 320,232', 'arr'),
    fa('a-vr',   'M 320,286 L 320,309', 'arr-t'),
    fa('a-rg',   'M 320,363 L 320,408', 'arr'),
    fa('a-gs',   'M 320,452 L 320,493', 'arr'),
    fa('a-su',   'M 280,547 C 220,570 196,591 196,591', 'arr'),
    fa('a-sa',   'M 356,547 C 356,580 350,591 350,591', 'arr'),
    fa('a-sf',   'M 364,547 C 430,570 450,591 450,591', 'arr'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 650', inner),
    steps: [
      ns('n-q', 0),
      as('a-qr', 100, '#3730A3'),
      ns('n-r', 0),
      as('a-rv', 120),
      ns('n-vdb', 0, 'teal'),
      as('a-vr', 150, '#0F766E'),
      ns('n-rel', 0),
      as('a-rg', 120),
      ns('n-gen', 0, 'indigo'),
      as('a-gs', 150),
      ns('n-sup', 0),
      as('a-su', 120), as('a-sa', 120), as('a-sf', 120),
      ns('n-use', 0), ns('n-ans', 0, 'green', 3), ns('n-flag', 0),
    ],
  }
}

// ─── Pattern 17 — Corrective RAG (TD) ───────────────────────────────────────
function p17() {
  const inner = [
    sn('n-q',    320, 52,  C.query,   ['User Query']),
    fc('n-vdb',  320, 112, 48, 13, 44, C.tealDB, 'Vector DB'),
    fd('n-grd',  320, 222, 140, 56, C.diamond, ['Grade', 'relevance']),
    sn('n-ref1', 120, 322, C.blue,    ['Strip irrelevant', 'passages']),
    sn('n-web',  320, 322, C.blue,    ['Web search', 'Tavily']),
    sn('n-ref2', 520, 322, C.blue,    ['Use relevant', '+ web search']),
    sn('n-kr',   420, 412, C.blue,    ['Knowledge', 'refinement']),
    sn('n-gen',  320, 502, C.teal,    ['Generate']),
    sn('n-ans',  320, 580, C.answer,  ['Grounded answer']),
    fa('a-qv',   'M 320,74 L 320,112', 'arr-b'),
    fa('a-vg',   'M 320,168 L 320,194', 'arr-t'),
    fa('a-g1',   'M 264,250 C 188,272 140,300 120,300', 'arr'),
    fa('a-g2',   'M 320,250 L 320,300', 'arr'),
    fa('a-g3',   'M 376,250 C 450,272 500,300 520,300', 'arr'),
    fa('a-wkr',  'M 320,344 C 360,370 390,390 390,390', 'arr'),
    fa('a-r2kr', 'M 476,344 C 456,374 436,390 436,390', 'arr'),
    fa('a-r1g',  'M 162,344 C 200,450 290,480 300,480', 'arr'),
    fa('a-krg',  'M 412,434 C 370,464 338,480 330,480', 'arr'),
    fa('a-gen',  'M 320,524 L 320,558', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 612', inner),
    steps: [
      ns('n-q', 0),
      as('a-qv', 100, '#3730A3'),
      ns('n-vdb', 0, 'teal'),
      as('a-vg', 150, '#0F766E'),
      ns('n-grd', 0),
      as('a-g1', 100), as('a-g2', 100), as('a-g3', 100),
      ns('n-ref1', 0), ns('n-web', 0), ns('n-ref2', 0),
      as('a-wkr', 100), as('a-r2kr', 100), as('a-r1g', 100),
      ns('n-kr', 0, 'indigo'),
      as('a-krg', 120),
      ns('n-gen', 0),
      as('a-gen', 120, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 18 — IRCoT (TD) ────────────────────────────────────────────────
function p18() {
  const inner = [
    sn('n-q',    320, 52,  C.query,   ['User Query']),
    sn('n-r1',   320, 142, C.blue,    ['Reason step 1', 'write CoT sentence']),
    fd('n-d1',   320, 234, 120, 50, C.diamond, ['Retrieve?']),
    sn('n-rt1',  520, 320, C.teal,    ['Retrieve', 'relevant docs']),
    sn('n-r2',   320, 320, C.blue,    ['Reason step 2', 'next CoT sentence']),
    fd('n-d2',   320, 412, 120, 50, C.diamond, ['Retrieve?']),
    sn('n-rt2',  520, 498, C.teal,    ['Retrieve', 'new query']),
    sn('n-r3',   320, 498, C.blue,    ['Reason step N', '...']),
    fd('n-d3',   320, 588, 120, 50, C.diamond, ['Complete?']),
    sn('n-ans',  320, 668, C.answer,  ['Final answer', '+ reasoning trace']),
    fa('a-qr1',  'M 320,74 L 320,120', 'arr-b'),
    fa('a-r1d1', 'M 320,164 L 320,209', 'arr'),
    fa('a-d1rt', 'M 376,234 C 440,234 500,298 500,298', 'arr'),
    fa('a-d1r2', 'M 320,259 L 320,298', 'arr'),
    fa('a-rt1r2','M 480,342 C 440,342 380,342 380,342', 'arr'),
    fa('a-r2d2', 'M 320,342 L 320,387', 'arr'),
    fa('a-d2rt2','M 376,412 C 440,412 500,476 500,476', 'arr'),
    fa('a-d2r3', 'M 320,437 L 320,476', 'arr'),
    fa('a-rt2r3','M 480,520 C 440,520 380,520 380,520', 'arr'),
    fa('a-r3d3', 'M 320,520 L 320,563', 'arr'),
    fa('a-d3a',  'M 320,613 L 320,646', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 700', inner),
    steps: [
      ns('n-q', 0),
      as('a-qr1', 100, '#3730A3'),
      ns('n-r1', 0, 'indigo'),
      as('a-r1d1', 150),
      ns('n-d1', 0),
      as('a-d1rt', 80), as('a-d1r2', 80),
      ns('n-rt1', 0), ns('n-r2', 0),
      as('a-rt1r2', 100), as('a-r2d2', 150),
      ns('n-d2', 0),
      as('a-d2rt2', 80), as('a-d2r3', 80),
      ns('n-rt2', 0), ns('n-r3', 0),
      as('a-rt2r3', 100), as('a-r3d3', 150),
      ns('n-d3', 0),
      as('a-d3a', 150, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 19 — Speculative RAG (TD) ──────────────────────────────────────
function p19() {
  const inner = [
    sn('n-q',   320, 52,  C.query,  ['Query']),
    sn('n-sd',  160, 152, C.orange, ['Speculative draft', 'Haiku — fast']),
    sn('n-ret', 480, 152, C.orange, ['Retrieve top-k docs']),
    sn('n-ver', 320, 262, C.teal,   ['Verify + refine', 'Sonnet: draft + docs']),
    sn('n-fa',  320, 352, C.answer, ['Final answer', 'grounded + corrected']),
    fa('a-qsd', 'M 275,74 C 220,100 180,130 160,130', 'arr-b'),
    fa('a-qrt', 'M 365,74 C 420,100 460,130 480,130', 'arr-b'),
    fa('a-sdv', 'M 202,174 C 255,200 290,240 300,240', 'arr'),
    fa('a-rtv', 'M 438,174 C 386,200 350,240 340,240', 'arr'),
    fa('a-vf',  'M 320,284 L 320,330', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 384', inner),
    steps: [
      ns('n-q', 0),
      as('a-qsd', 100, '#3730A3'), as('a-qrt', 100, '#3730A3'),
      ns('n-sd', 0, 'orange'), ns('n-ret', 0),
      as('a-sdv', 150), as('a-rtv', 150),
      ns('n-ver', 0, 'indigo'),
      as('a-vf', 150, '#15803d'),
      ns('n-fa', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 20 — Adaptive RAG (TD) ─────────────────────────────────────────
function p20() {
  const inner = [
    sn('n-q',   320, 52,  C.query,   ['User Query']),
    sn('n-cls', 320, 152, C.orange,  ['Complexity', 'classifier']),
    sn('n-d',   100, 262, C.blue,    ['Direct LLM', 'no retrieval']),
    sn('n-r1',  320, 262, C.teal,    ['Single-step RAG', 'retrieve + generate']),
    sn('n-r2',  540, 262, C.blue,    ['Multi-step RAG', 'iterative retrieval']),
    nn('n-ans', 320, 362, C.answer,  ['Answer']),
    fa('a-qc',  'M 320,74 L 320,130', 'arr-b'),
    fa('a-cd',  'M 274,174 C 194,200 122,240 100,240', 'arr'),
    fa('a-cr1', 'M 320,174 L 320,240', 'arr'),
    fa('a-cr2', 'M 366,174 C 446,200 518,240 540,240', 'arr'),
    fa('a-da',  'M 142,284 C 200,330 268,340 300,340', 'arr-g'),
    fa('a-r1a', 'M 320,284 L 320,342', 'arr-g'),
    fa('a-r2a', 'M 498,284 C 440,330 368,340 340,340', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 394', inner),
    steps: [
      ns('n-q', 0),
      as('a-qc', 100, '#3730A3'),
      ns('n-cls', 0, 'orange'),
      as('a-cd', 150), as('a-cr1', 150), as('a-cr2', 150),
      ns('n-d', 0), ns('n-r1', 0), ns('n-r2', 0),
      as('a-da', 150, '#15803d'), as('a-r1a', 150, '#15803d'), as('a-r2a', 150, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 21 — Modular RAG (TD) ──────────────────────────────────────────
function p21() {
  const inner = [
    sn('n-q',    320, 52,  C.query,   ['Query']),
    sn('n-pip',  320, 152, C.purple,  ['RAGPipeline', 'assemble from modules']),
    sn('n-r',    320, 252, C.orange,  ['RetrieverModule', 'protocol interface']),
    sn('n-rr',   320, 352, C.orange,  ['RerankerModule', 'protocol interface']),
    sn('n-g',    320, 452, C.orange,  ['GeneratorModule', 'protocol interface']),
    nn('n-ans',  320, 536, C.answer,  ['Answer']),
    sn('n-r1',   100, 252, C.gray,    ['BM25', 'Retriever']),
    sn('n-r2',   540, 252, C.gray,    ['Chroma', 'Retriever']),
    sn('n-rr1',  100, 352, C.gray,    ['Cohere', 'Reranker']),
    sn('n-rr2',  540, 352, C.gray,    ['CrossEncoder', 'Reranker']),
    sn('n-g1',   100, 452, C.gray,    ['Haiku', 'Generator']),
    sn('n-g2',   540, 452, C.gray,    ['Sonnet', 'Generator']),
    fa('a-qp',   'M 320,74 L 320,130', 'arr-b'),
    fa('a-pr',   'M 320,174 L 320,230', 'arr'),
    fa('a-rrr',  'M 320,274 L 320,330', 'arr'),
    fa('a-rg',   'M 320,374 L 320,430', 'arr'),
    fa('a-ga',   'M 320,474 L 320,516', 'arr-g'),
    fa('a-r1r',  'M 165,264 C 240,264 290,264 255,264', 'arr'),
    fa('a-r2r',  'M 475,264 C 400,264 360,264 385,264', 'arr'),
    fa('a-rr1r', 'M 165,364 C 240,364 290,364 255,364', 'arr'),
    fa('a-rr2r', 'M 475,364 C 400,364 360,364 385,364', 'arr'),
    fa('a-g1g',  'M 165,464 C 240,464 290,464 255,464', 'arr'),
    fa('a-g2g',  'M 475,464 C 400,464 360,464 385,464', 'arr'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 570', inner),
    steps: [
      ns('n-q', 0),
      as('a-qp', 100, '#3730A3'),
      ns('n-pip', 0, 'indigo'),
      as('a-pr', 150),
      ns('n-r', 0), ns('n-r1', 0), ns('n-r2', 0),
      as('a-r1r', 80), as('a-r2r', 80),
      as('a-rrr', 150),
      ns('n-rr', 0), ns('n-rr1', 0), ns('n-rr2', 0),
      as('a-rr1r', 80), as('a-rr2r', 80),
      as('a-rg', 150),
      ns('n-g', 0), ns('n-g1', 0), ns('n-g2', 0),
      as('a-g1g', 80), as('a-g2g', 80),
      as('a-ga', 150, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 22 — Agentic RAG (TD) ──────────────────────────────────────────
function p22() {
  const inner = [
    sn('n-q',   320, 52,  C.query,  ['User Query']),
    sn('n-ag',  320, 152, C.orange, ['Agent', 'reasoning step']),
    sn('n-tr',  120, 262, C.teal,   ['Retrieve tool', 'vector store']),
    sn('n-ws',  320, 262, C.blue,   ['Web search', 'tool']),
    sn('n-cl',  520, 262, C.blue,   ['Calculator', 'tool']),
    sn('n-ob',  320, 362, C.orange, ['Observe result']),
    sn('n-gen', 320, 462, C.teal,   ['Generate', 'final answer']),
    sn('n-ans', 320, 546, C.answer, ['Grounded answer', '+ tool trace']),
    fa('a-qa',   'M 320,74 L 320,130', 'arr-b'),
    fa('a-atr',  'M 270,174 C 200,200 142,240 120,240', 'arr'),
    fa('a-aws',  'M 320,174 L 320,240', 'arr'),
    fa('a-acl',  'M 370,174 C 440,200 498,240 520,240', 'arr'),
    fa('a-tro',  'M 162,284 C 224,322 280,340 300,340', 'arr'),
    fa('a-wso',  'M 320,284 L 320,340', 'arr'),
    fa('a-clo',  'M 478,284 C 416,322 360,340 340,340', 'arr'),
    fa('a-oba',  'M 284,384 C 180,384 120,280 120,262 C 120,220 230,174 290,174', 'arr'),
    fa('a-og',   'M 320,384 L 320,440', 'arr'),
    fa('a-ga',   'M 320,484 L 320,524', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 578', inner),
    steps: [
      ns('n-q', 0),
      as('a-qa', 100, '#3730A3'),
      ns('n-ag', 0, 'orange'),
      as('a-atr', 150), as('a-aws', 150), as('a-acl', 150),
      ns('n-tr', 0), ns('n-ws', 0), ns('n-cl', 0),
      as('a-tro', 150), as('a-wso', 150), as('a-clo', 150),
      ns('n-ob', 0, 'indigo'),
      as('a-oba', 120),
      as('a-og', 120, '#3730A3'),
      ns('n-gen', 0),
      as('a-ga', 150, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 23 — Multi-Hop RAG (TD) ────────────────────────────────────────
function p23() {
  const inner = [
    sn('n-q',    320, 52,  C.query,   ['Initial Query']),
    sn('n-h1',   320, 152, C.orange,  ['Hop 1', 'retrieve top-k']),
    sn('n-e1',   320, 252, C.purple,  ['Extract bridge entity', 'from hop 1 docs']),
    fd('n-tc1',  320, 344, 130, 50, C.diamond, ['Terminal?', 'or hop limit?']),
    sn('n-h2',   320, 440, C.orange,  ['Hop 2', 'retrieve on entity']),
    sn('n-e2',   320, 530, C.purple,  ['Extract bridge entity', 'from hop 2 docs']),
    fd('n-tc2',  320, 622, 130, 50, C.diamond, ['Terminal?', 'or hop limit?']),
    sn('n-syn',  160, 720, C.teal,    ['Synthesize answer', 'full chain context']),
    sn('n-h3',   480, 720, C.orange,  ['Hop 3 (if needed)', 'retrieve on entity']),
    nn('n-ans',  160, 800, C.answer,  ['Answer']),
    fa('a-qh1',  'M 320,74 L 320,130', 'arr-b'),
    fa('a-h1e1', 'M 320,174 L 320,230', 'arr'),
    fa('a-e1t1', 'M 320,274 L 320,319', 'arr'),
    fa('a-t1h2', 'M 320,369 L 320,418', 'arr'),
    fa('a-h2e2', 'M 320,462 L 320,508', 'arr'),
    fa('a-e2t2', 'M 320,552 L 320,597', 'arr'),
    fa('a-t2s',  'M 264,647 C 218,668 180,698 180,698', 'arr'),
    fa('a-t2h3', 'M 376,647 C 430,668 458,698 480,698', 'arr'),
    fa('a-h3s',  'M 448,742 C 360,760 222,760 222,760', 'arr'),
    fa('a-t1s',  'M 258,344 C 184,380 162,560 160,698', 'arr'),
    fa('a-sa',   'M 160,742 L 160,780', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 832', inner),
    steps: [
      ns('n-q', 0),
      as('a-qh1', 100, '#3730A3'),
      ns('n-h1', 0, 'orange'),
      as('a-h1e1', 150),
      ns('n-e1', 0, 'indigo'),
      as('a-e1t1', 150),
      ns('n-tc1', 0),
      as('a-t1h2', 120),
      ns('n-h2', 0, 'orange'),
      as('a-h2e2', 150),
      ns('n-e2', 0, 'indigo'),
      as('a-e2t2', 150),
      ns('n-tc2', 0),
      as('a-t2s', 100), as('a-t2h3', 100), as('a-t1s', 100),
      ns('n-syn', 0, 'indigo'), ns('n-h3', 0),
      as('a-h3s', 120),
      as('a-sa', 150, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 24 — Graph RAG (TD) ────────────────────────────────────────────
function p24() {
  const inner = [
    sn('n-d',   160, 52,  C.blue,   ['Documents']),
    sn('n-q',   480, 52,  C.query,  ['User Query']),
    sn('n-ee',  160, 152, C.blue,   ['Entity extractor', 'NER + relations']),
    sn('n-qe',  480, 152, C.blue,   ['Query entity', 'extraction']),
    sn('n-gb',  160, 252, C.blue,   ['Graph builder', 'nodes + edges']),
    fc('n-kg',  160, 322, 50, 13, 44, C.orange, 'Knowledge Graph'),
    sn('n-gt',  320, 390, C.teal,   ['Graph traversal', 'neighbors + paths']),
    sn('n-vs',  480, 390, C.teal,   ['Vector search', 'semantic']),
    sn('n-cm',  320, 490, C.orange, ['Context merger', 'dedup + rank']),
    sn('n-llm', 320, 574, C.blue,   ['LLM synthesis']),
    sn('n-ans', 320, 658, C.answer, ['Answer', '+ entity provenance']),
    fa('a-dee', 'M 160,74 L 160,130', 'arr'),
    fa('a-eegb','M 160,174 L 160,230', 'arr'),
    fa('a-gbkg','M 160,274 L 160,322', 'arr'),
    fa('a-qqe', 'M 480,74 L 480,130', 'arr-b'),
    fa('a-qevs','M 480,174 C 480,300 480,368 480,368', 'arr'),
    fa('a-qegt','M 430,174 C 380,260 352,368 352,368', 'arr'),
    fa('a-kggt','M 206,366 C 258,384 294,384 294,384', 'arr-o'),
    fa('a-gtcm','M 320,412 L 320,468', 'arr'),
    fa('a-vscm','M 452,412 C 410,440 366,466 350,468', 'arr'),
    fa('a-cml', 'M 320,512 L 320,552', 'arr'),
    fa('a-la',  'M 320,596 L 320,636', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 640 692', inner),
    steps: [
      ns('n-d', 0), ns('n-q', 0),
      as('a-dee', 100), as('a-qqe', 100, '#3730A3'),
      ns('n-ee', 0), ns('n-qe', 0),
      as('a-eegb', 120), as('a-qevs', 120), as('a-qegt', 120),
      ns('n-gb', 0),
      as('a-gbkg', 120),
      ns('n-kg', 0, 'orange'),
      as('a-kggt', 120, '#F59E0B'),
      ns('n-gt', 0), ns('n-vs', 0),
      as('a-gtcm', 150), as('a-vscm', 150),
      ns('n-cm', 0, 'indigo'),
      as('a-cml', 150, '#3730A3'),
      ns('n-llm', 0),
      as('a-la', 150, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 25 — Multi-Modal RAG (TD) ──────────────────────────────────────
function p25() {
  const inner = [
    sn('n-pdf',  160, 52,  C.blue,   ['PDF / Document']),
    sn('n-q',    480, 52,  C.query,  ['User Query']),
    sn('n-ex',   160, 152, C.blue,   ['Multimodal extractor', 'text + images + tables']),
    sn('n-tx',    80, 262, C.teal,   ['Text chunks']),
    sn('n-im',   200, 262, C.teal,   ['Images / charts']),
    sn('n-tb',   320, 262, C.teal,   ['Tables']),
    sn('n-te',    80, 362, C.teal,   ['Text embeddings']),
    sn('n-vd',   200, 362, C.blue,   ['Vision descriptions', 'Claude vision']),
    sn('n-tb2',  320, 362, C.teal,   ['Table embeddings']),
    fc('n-idx',  200, 432, 60, 13, 44, C.orange, 'Unified Index'),
    sn('n-qe',   480, 152, C.blue,   ['Query embedding']),
    sn('n-ret',  480, 262, C.teal,   ['Cross-modal retrieval']),
    sn('n-ctx',  380, 540, C.orange, ['Context builder', 'text + images + tables']),
    sn('n-vlm',  380, 634, C.blue,   ['Vision LLM', 'Claude Sonnet vision']),
    sn('n-ans',  380, 718, C.answer, ['Answer', '+ modality citations']),
    fa('a-pe',   'M 160,74 L 160,130', 'arr'),
    fa('a-etx',  'M 120,174 C  96,220  80,240  80,240', 'arr'),
    fa('a-eim',  'M 168,174 C 192,220 200,240 200,240', 'arr'),
    fa('a-etb',  'M 214,174 C 264,220 316,240 316,240', 'arr'),
    fa('a-txte', 'M  80,284 L  80,340', 'arr'),
    fa('a-imvd', 'M 200,284 L 200,340', 'arr'),
    fa('a-tbtb2','M 320,284 L 320,340', 'arr'),
    fa('a-tei',  'M  80,384 C 100,420 140,432 140,432', 'arr'),
    fa('a-vdi',  'M 200,384 L 200,432', 'arr'),
    fa('a-tb2i', 'M 320,384 C 300,420 260,432 260,432', 'arr'),
    fa('a-qqe',  'M 480,74 L 480,130', 'arr-b'),
    fa('a-qer',  'M 480,174 L 480,240', 'arr-b'),
    fa('a-ir',   'M 260,476 C 340,490 400,520 398,520', 'arr-o'),
    fa('a-retr', 'M 452,284 C 440,380 418,510 410,518', 'arr'),
    fa('a-imc',  'M 248,284 C 310,380 358,506 366,518', 'arr'),
    fa('a-cv',   'M 380,562 L 380,612', 'arr'),
    fa('a-va',   'M 380,656 L 380,696', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 600 752', inner),
    steps: [
      ns('n-pdf', 0), ns('n-q', 0),
      as('a-pe', 100), as('a-qqe', 100, '#3730A3'),
      ns('n-ex', 0), ns('n-qe', 0),
      as('a-etx', 100), as('a-eim', 100), as('a-etb', 100),
      as('a-qer', 100, '#3730A3'),
      ns('n-tx', 0), ns('n-im', 0), ns('n-tb', 0),
      ns('n-ret', 0),
      as('a-txte', 100), as('a-imvd', 100), as('a-tbtb2', 100),
      ns('n-te', 0), ns('n-vd', 0), ns('n-tb2', 0),
      as('a-tei', 100), as('a-vdi', 100), as('a-tb2i', 100),
      ns('n-idx', 0, 'indigo'),
      as('a-ir', 100, '#F59E0B'), as('a-retr', 100), as('a-imc', 100),
      ns('n-ctx', 0, 'indigo'),
      as('a-cv', 150, '#3730A3'),
      ns('n-vlm', 0, 'indigo'),
      as('a-va', 150, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Pattern 26 — Temporal RAG (TD) ─────────────────────────────────────────
function p26() {
  const inner = [
    sn('n-d',   160, 52,  C.blue,   ['Documents', '+ timestamps']),
    sn('n-q',   480, 52,  C.query,  ['User Query', '+ time scope']),
    sn('n-ts',  160, 152, C.blue,   ['Timestamp extractor', 'parse date metadata']),
    fc('n-idx', 160, 222, 56, 13, 44, C.orange, 'Vector Index'),
    sn('n-qp',  480, 152, C.blue,   ['Query parser', 'extract time intent']),
    fd('n-m1',  480, 284, 120, 50, C.diamond, ['Mode?']),
    sn('n-hf',  280, 384, C.teal,   ['Date range filter']),
    sn('n-rd',  480, 384, C.teal,   ['Retrieve + re-score', 'decay function']),
    sn('n-va',  680, 384, C.teal,   ['Retrieve active', 'versions only']),
    sn('n-cm',  480, 484, C.orange, ['Context merger', '+ temporal provenance']),
    sn('n-llm', 480, 568, C.blue,   ['LLM synthesis']),
    sn('n-ans', 480, 652, C.answer, ['Answer', '+ effective date']),
    fa('a-dts', 'M 160,74 L 160,130', 'arr'),
    fa('a-tsi', 'M 160,174 L 160,222', 'arr'),
    fa('a-qqp', 'M 480,74 L 480,130', 'arr-b'),
    fa('a-qpm', 'M 480,174 L 480,259', 'arr'),
    fa('a-mhf', 'M 422,284 C 380,320 320,362 320,362', 'arr'),
    fa('a-mrd', 'M 480,309 L 480,362', 'arr'),
    fa('a-mva', 'M 538,284 C 590,320 660,362 680,362', 'arr'),
    fa('a-ihf', 'M 212,266 C 280,330 298,360 300,362', 'arr-o'),
    fa('a-ird', 'M 214,266 C 350,330 470,362 470,362', 'arr-o'),
    fa('a-iva', 'M 216,266 C 400,280 650,360 660,362', 'arr-o'),
    fa('a-hfc', 'M 360,406 C 400,440 458,462 462,462', 'arr'),
    fa('a-rdc', 'M 480,406 L 480,462', 'arr'),
    fa('a-vac', 'M 600,406 C 552,440 502,462 498,462', 'arr'),
    fa('a-cl',  'M 480,506 L 480,546', 'arr'),
    fa('a-la',  'M 480,590 L 480,630', 'arr-g'),
  ].join('\n')
  return {
    svgHTML: svg('0 0 780 686', inner),
    steps: [
      ns('n-d', 0), ns('n-q', 0),
      as('a-dts', 100), as('a-qqp', 100, '#3730A3'),
      ns('n-ts', 0), ns('n-qp', 0),
      as('a-tsi', 120),
      ns('n-idx', 0, 'orange'),
      as('a-qpm', 150),
      ns('n-m1', 0),
      as('a-mhf', 100), as('a-mrd', 100), as('a-mva', 100),
      as('a-ihf', 80, '#F59E0B'), as('a-ird', 80, '#F59E0B'), as('a-iva', 80, '#F59E0B'),
      ns('n-hf', 0), ns('n-rd', 0), ns('n-va', 0),
      as('a-hfc', 150), as('a-rdc', 150), as('a-vac', 150),
      ns('n-cm', 0, 'indigo'),
      as('a-cl', 150, '#3730A3'),
      ns('n-llm', 0),
      as('a-la', 150, '#15803d'),
      ns('n-ans', 0, 'green', 3),
    ],
  }
}

// ─── Export ──────────────────────────────────────────────────────────────────

const BUILDERS = {
  1: p1, 2: p2, 3: p3, 4: p4, 5: p5, 6: p6, 7: p7,
  8: p8, 9: p9, 10: p10, 11: p11, 12: p12, 13: p13,
  14: p14, 15: p15, 16: p16, 17: p17, 18: p18, 19: p19,
  20: p20, 21: p21, 22: p22, 23: p23, 24: p24, 25: p25, 26: p26,
}

export function buildDiagram(patternId) {
  const b = BUILDERS[patternId]
  return b ? b() : null
}
