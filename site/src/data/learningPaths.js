/**
 * Source of truth: README.md › "Learning paths"
 *
 * All three paths — names, module lists, durations, and outcome
 * statements — are taken verbatim from the README.
 *
 * Path module IDs correspond to rag_patterns.json › patterns[].module_order.
 */

const REPO = 'https://github.com/sunilpradhansharma/production-rag-patterns-in-practice'

export const LEARNING_PATHS = [
  {
    id: 'beginner',
    label: 'Beginner',
    title: 'Foundation Path',
    // README: "Beginner — understand the foundations (3 modules, ~2 hours)"
    duration: '~2 hours · 3 modules',
    description: 'Understand the foundations. Build a production-grade RAG system for most fintech Q&A use cases.',
    outcome: 'After this path you can build a production-grade RAG system for most fintech Q&A use cases.',
    // README: "01_naive_rag → 02_advanced_rag → 03_hybrid_rag"
    steps: [
      {
        id: 1,
        name: 'Naive RAG',
        modulePath: 'modules/01_naive_rag',
        notebookPath: 'modules/01_naive_rag/demo.ipynb',
        what: 'How RAG works end-to-end; chunk → embed → retrieve → generate',
      },
      {
        id: 2,
        name: 'Advanced RAG',
        modulePath: 'modules/02_advanced_rag',
        notebookPath: 'modules/02_advanced_rag/demo.ipynb',
        what: 'Query rewriting, cross-encoder reranking, context compression',
      },
      {
        id: 3,
        name: 'Hybrid RAG',
        modulePath: 'modules/03_hybrid_rag',
        notebookPath: 'modules/03_hybrid_rag/demo.ipynb',
        what: 'BM25 + dense fusion via RRF; the single best retrieval upgrade',
      },
    ],
    color: '#3730A3',
    colorDim: 'rgba(55,48,163,0.10)',
    startNotebook: `${REPO}/blob/main/modules/01_naive_rag/demo.ipynb`,
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    title: 'Production Path',
    // README: "Intermediate — improve indexing and self-correction (7 modules, ~4 hours)"
    // Modules: Beginner (01–03) + 10 + 13 + 16 + 17
    duration: '~4 hours · 7 modules',
    description: 'Improve indexing and self-correction. Handle long regulatory documents and self-checking compliance answers.',
    outcome: 'After this path you can handle long regulatory documents and self-checking compliance answers.',
    // README path: 01 → 02 → 03  +  10 → 13 → 16 → 17
    steps: [
      {
        id: 1,
        name: 'Naive RAG',
        modulePath: 'modules/01_naive_rag',
        notebookPath: 'modules/01_naive_rag/demo.ipynb',
        what: 'Baseline retrieve-then-generate pipeline',
      },
      {
        id: 2,
        name: 'Advanced RAG',
        modulePath: 'modules/02_advanced_rag',
        notebookPath: 'modules/02_advanced_rag/demo.ipynb',
        what: 'Pre + post retrieval processing',
      },
      {
        id: 3,
        name: 'Hybrid RAG',
        modulePath: 'modules/03_hybrid_rag',
        notebookPath: 'modules/03_hybrid_rag/demo.ipynb',
        what: 'BM25 + dense fusion',
      },
      {
        id: 10,
        name: 'Parent Document Retrieval',
        modulePath: 'modules/10_parent_document',
        notebookPath: 'modules/10_parent_document/demo.ipynb',
        what: 'Index small chunks; return large parents — best of both precision and context',
      },
      {
        id: 13,
        name: 'Contextual RAG',
        modulePath: 'modules/13_contextual_rag',
        notebookPath: 'modules/13_contextual_rag/demo.ipynb',
        what: 'Prepend document context to each chunk; 49% fewer retrieval failures',
      },
      {
        id: 16,
        name: 'Self-RAG',
        modulePath: 'modules/16_self_rag',
        notebookPath: 'modules/16_self_rag/demo.ipynb',
        what: 'Model critiques its own retrieval and generation quality',
      },
      {
        id: 17,
        name: 'Corrective RAG (CRAG)',
        modulePath: 'modules/17_corrective_rag',
        notebookPath: 'modules/17_corrective_rag/demo.ipynb',
        what: 'Automatic web fallback when the corpus cannot answer the query',
      },
    ],
    color: '#a78bfa',
    colorDim: 'rgba(167,139,250,0.10)',
    startNotebook: `${REPO}/blob/main/modules/10_parent_document/demo.ipynb`,
  },
  {
    id: 'advanced',
    label: 'Advanced',
    title: 'Full Tier 1 Path',
    // README: "Advanced — the full Tier 1 path (10 modules, ~8 hours)"
    // Modules: Beginner + Intermediate + 06 + 20 + 22
    duration: '~8 hours · 10 modules',
    description: 'The complete Tier 1 path. Understand the full design space and select and compose patterns for any use case.',
    outcome: 'After this path you understand the full design space and can select and compose patterns for any use case.',
    // README: "Beginner + Intermediate + 06_hyde → 20_adaptive_rag → 22_agentic_rag"
    steps: [
      {
        id: 1,
        name: '01–03 Foundation Path',
        modulePath: 'modules/01_naive_rag',
        notebookPath: 'modules/01_naive_rag/demo.ipynb',
        what: 'Complete Beginner path first',
      },
      {
        id: 10,
        name: '10, 13, 16, 17 Production Path',
        modulePath: 'modules/10_parent_document',
        notebookPath: 'modules/10_parent_document/demo.ipynb',
        what: 'Complete Intermediate path second',
      },
      {
        id: 6,
        name: 'HyDE (Hypothetical Document Embeddings)',
        modulePath: 'modules/06_hyde',
        notebookPath: 'modules/06_hyde/demo.ipynb',
        what: 'Embed a hypothetical answer instead of the query — bridges vocabulary gap',
      },
      {
        id: 20,
        name: 'Adaptive RAG',
        modulePath: 'modules/20_adaptive_rag',
        notebookPath: 'modules/20_adaptive_rag/demo.ipynb',
        what: 'Classify queries and route to the cheapest pattern that can answer them',
      },
      {
        id: 22,
        name: 'Agentic RAG',
        modulePath: 'modules/22_agentic_rag',
        notebookPath: 'modules/22_agentic_rag/demo.ipynb',
        what: 'LLM agent with retrieve / web search / calculate tools — the capstone pattern',
      },
    ],
    color: '#fb923c',
    colorDim: 'rgba(251,146,60,0.10)',
    startNotebook: `${REPO}/blob/main/modules/06_hyde/demo.ipynb`,
  },
]

// ─── Quick-Start Steps ────────────────────────────────────────────────────────
// Source: README.md + docs/workshop/setup_guide.md

export const QUICKSTART = {
  repo: 'https://github.com/sunilpradhansharma/production-rag-patterns-in-practice',
  firstNotebook: 'modules/01_naive_rag/demo.ipynb',
  setupGuide: 'docs/workshop/setup_guide.md',
  envExample: '.env.example',
  requirements: 'requirements.txt',
  // From README.md quick-start block
  commands: [
    'git clone https://github.com/sunilpradhansharma/production-rag-patterns-in-practice.git',
    'cd production-rag-patterns-in-practice',
    'pip install -r requirements.txt',
    'jupyter lab modules/01_naive_rag/demo.ipynb',
  ],
  // From docs/workshop/setup_guide.md › "API Keys"
  apiKeys: [
    {
      name: 'ANTHROPIC_API_KEY',
      required: true,
      usage: 'LLM generation (all modules), vision descriptions (Module 25)',
      prefix: 'sk-ant-...',
      costNote: 'Full workshop costs ~$1–2',
      url: 'https://console.anthropic.com',
    },
    {
      name: 'OPENAI_API_KEY',
      required: true,
      usage: 'text embeddings (text-embedding-3-small) in all modules',
      prefix: 'sk-...',
      costNote: 'Full workshop costs < $0.50 in embeddings',
      url: 'https://platform.openai.com',
    },
    {
      name: 'TAVILY_API_KEY',
      required: false,
      usage: 'Web search fallback in Corrective RAG (Module 17) and Agentic RAG (Module 22)',
      prefix: 'tvly-...',
      costNote: 'Free tier available. Without it, Modules 17 and 22 fall back to corpus-only retrieval.',
      url: 'https://tavily.com',
    },
  ],
  // From docs/workshop/setup_guide.md › "Estimated API Costs"
  costEstimate: {
    workshopTier1: '~$0.35',
    allNotebooks: '~$2–5',
    perModule: [
      { module: '01 Naive RAG', cost: '$0.02' },
      { module: '03 Hybrid RAG', cost: '$0.03' },
      { module: '13 Contextual RAG', cost: '$0.15' },
      { module: '17 Corrective RAG', cost: '$0.05' },
      { module: '22 Agentic RAG', cost: '$0.10' },
    ],
  },
}
