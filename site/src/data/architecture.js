/**
 * Source of truth: docs/architecture/design_layers.md
 *
 * Layer names, numbers, questions, options, and descriptions are taken
 * verbatim from that file.
 *
 * Workshop flow sourced from README.md › "Workshop flow (90 minutes)"
 */

// ─── 8 Design Layers ─────────────────────────────────────────────────────────

export const DESIGN_LAYERS = [
  {
    num: '01',
    name: 'Data Ingestion',
    icon: 'Database',
    question: 'What documents enter the system, in what form, and how are they kept current?',
    description: 'Source format, extraction quality, update strategy, and timestamp tracking. Metadata discarded here cannot be recovered later.',
    options: ['PDF / HTML / JSON', 'Native text · OCR · Vision LLM', 'Full re-index · Incremental · Streaming', 'Timestamp tracking'],
    fintechNote: 'PDF (regulatory), JSON (market data), plain text (internal policy)',
  },
  {
    num: '02',
    name: 'Chunking Strategy',
    icon: 'Scissors',
    question: 'How do you divide documents into retrievable units?',
    description: 'How you split documents controls retrieval precision more than any other single decision. The chunk that should answer a query must contain enough information to answer it without the surrounding text.',
    options: ['Fixed-size + overlap', 'Recursive character split', 'Parent-child (Module 10)', 'Sentence window (Module 11)', 'Contextual prepending (Module 13)', 'Hierarchical / RAPTOR (Module 12)', 'No chunking (Module 15)'],
    fintechNote: 'Chunk regulatory docs at §-markers; earnings at prose/table boundary',
  },
  {
    num: '03',
    name: 'Embedding Model',
    icon: 'Cpu',
    question: 'Which model maps text (and other modalities) to vectors?',
    description: 'The model that converts text to vectors determines your retrieval ceiling. When you change it the entire index must be rebuilt — store the model version as metadata alongside each chunk.',
    options: ['text-embedding-3-small (default)', 'text-embedding-3-large (precision-critical)', 'BAAI/bge-large-en (self-hosted)', 'Cohere embed-v3 (multilingual)'],
    fintechNote: 'text-embedding-3-small for most fintech RAG; -large for compliance-critical retrieval',
  },
  {
    num: '04',
    name: 'Vector Store',
    icon: 'Server',
    question: 'Where do vectors live, and how are they queried?',
    description: 'Persistence, scale, metadata filtering, and hybrid search capability. Every filter you will ever apply at retrieval time must be stored as metadata at index time.',
    options: ['ChromaDB (dev / medium scale)', 'Pinecone (managed, SOC2)', 'Weaviate (hybrid BM25+dense)', 'pgvector (Postgres, ACID)', 'Qdrant (compliance workloads)', 'FAISS (batch processing only)'],
    fintechNote: 'Metadata schema must include: doc_id, timestamp, superseded flag, doc_family, modality',
  },
  {
    num: '05',
    name: 'Retrieval Strategy',
    icon: 'Search',
    question: 'How do you find the most relevant chunks for a given query?',
    description: 'This is where the 26 patterns in this repository live. The retrieval strategy has the most variation and the most direct impact on answer quality.',
    options: ['Dense cosine similarity', 'Sparse BM25 (exact terms)', 'Hybrid + RRF fusion', 'Graph traversal (Module 24)', 'Time-filtered (Module 26)', 'Re-ranking with cross-encoder'],
    fintechNote: 'Default: Hybrid RAG (Module 03). Use Adaptive RAG (Module 20) for mixed-complexity traffic.',
  },
  {
    num: '06',
    name: 'Context Processing',
    icon: 'Layers',
    question: 'How do you transform raw retrieved chunks into a synthesis-ready context?',
    description: 'Dedup, order, compress, and inject citations before passing context to the LLM. The LLM attends non-uniformly — place most relevant chunks at start and end ("lost in the middle", Module 15).',
    options: ['Deduplication (cosine > 0.95)', 'Relevance ordering (start + end)', 'Context compression (Haiku)', 'Citation injection [Source: §4.2]', 'Token budget enforcement'],
    fintechNote: 'Citation injection mandatory for compliance: anchor every claim to source + effective date',
  },
  {
    num: '07',
    name: 'LLM Generation',
    icon: 'Zap',
    question: 'Which model generates the answer, and how is the generation prompt structured?',
    description: 'System prompt must include grounding instruction. Without "use ONLY the provided context" LLMs blend retrieval with parametric knowledge, producing partly-hallucinated answers with no signal to the user.',
    options: ['Claude Haiku (per-step reasoning, HyDE)', 'Claude Sonnet (final answer synthesis)', 'temperature=0 for compliance/audit', 'System prompt with grounding rule'],
    fintechNote: 'temperature=0 for compliance Q&A — deterministic generation required for audit integrity',
  },
  {
    num: '08',
    name: 'Evaluation & Monitoring',
    icon: 'BarChart2',
    question: 'How do you know if the system is working?',
    description: "You cannot improve what you don't measure. Query distributions shift over time. A system that was 90% accurate at launch may degrade to 70% six months later.",
    options: ['Recall@k · MRR · NDCG', 'RAGAS: Faithfulness · Relevance · Context recall', 'Latency p50/p95/p99', 'Cost per query tracking', 'Retrieval null rate', 'Hallucination sampling (1–5%)'],
    fintechNote: 'For compliance: any unfaithful answer (claim not grounded in context) is a critical failure',
  },
]

// ─── Workshop Flow ────────────────────────────────────────────────────────────
// Source: README.md › "Workshop flow (90 minutes)"

export const WORKSHOP_SEGMENTS = [
  { time: '0:00–0:10', segment: 'Foundations',   patterns: ['Naive RAG', 'Advanced RAG'],     mode: 'Slides + live demo' },
  { time: '0:10–0:25', segment: 'Indexing',       patterns: ['Parent Document', 'Contextual RAG'], mode: 'Slides + live demo' },
  { time: '0:25–0:40', segment: 'Retrieval',      patterns: ['Hybrid RAG', 'HyDE'],            mode: 'Slides + live demo' },
  { time: '0:40–0:55', segment: 'Reasoning',      patterns: ['Self-RAG', 'Corrective RAG'],    mode: 'Slides + live demo' },
  { time: '0:55–1:10', segment: 'Architecture',   patterns: ['Adaptive RAG', 'Agentic RAG'],   mode: 'Slides + live demo' },
  { time: '1:10–1:20', segment: 'Synthesis',      patterns: ['Pattern selection', 'Design layers'], mode: 'Slides' },
  { time: '1:20–1:30', segment: 'Q&A',            patterns: ['Resources', 'Next steps'],       mode: 'Discussion' },
]

// ─── Pattern Selection Quick Guide ───────────────────────────────────────────
// Source: README.md › "Pattern selection guide"

export const SELECTION_GUIDE = [
  { condition: 'Query is simple and keyword-heavy',          recommendation: 'Hybrid RAG (Module 03)' },
  { condition: 'Long documents (contracts, reports)',        recommendation: 'Parent Document (10) or Sentence Window (11)' },
  { condition: 'Retrieval quality poor despite good docs',  recommendation: 'Corrective RAG (17) or Self-RAG (16)' },
  { condition: 'Multi-step reasoning across sources',       recommendation: 'IRCoT (18) or Agentic RAG (22)' },
  { condition: 'Entity relationships are central',          recommendation: 'Graph RAG (24)' },
  { condition: 'Documents change frequently',               recommendation: 'Temporal RAG (26)' },
  { condition: 'Charts, tables, or images in PDFs',         recommendation: 'Multi-Modal RAG (25)' },
  { condition: 'Want zero infrastructure to start',         recommendation: 'Long-Context RAG (15) — stuff into 200k window' },
  { condition: 'Mixed-complexity traffic to optimize cost', recommendation: 'Adaptive RAG (20) — route by query complexity' },
]
