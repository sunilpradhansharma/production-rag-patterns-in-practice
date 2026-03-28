# Production RAG Design Layers

> Eight decisions every production RAG system must make, in the order they are made.

Each layer is a set of architectural choices that constrain the layers beneath it. A poor choice at layer 2 (chunking) cannot be fully compensated by a better choice at layer 5 (retrieval strategy). Read this guide top-to-bottom when designing a new system; read it bottom-to-top when diagnosing a quality problem.

---

## Layer 1 — Data Ingestion

**The question**: What documents enter the system, in what form, and how are they kept current?

### Decisions

| Decision | Options | Fintech default |
|----------|---------|-----------------|
| Source format | PDF, HTML, plain text, JSON, database rows | PDF (regulatory), JSON (market data), plain text (internal policy) |
| Extraction quality | Native text extraction, OCR, vision LLM | Native for digitally-created PDFs; AWS Textract for scanned; vision LLM for image-heavy |
| Update strategy | Full re-index, incremental, real-time streaming | Incremental for regulatory corpus; real-time for market data |
| Timestamp tracking | File metadata, document header, manual | Document header + file metadata fallback (see Module 26) |

### Common mistakes

- **Treating all PDFs as equal.** Scanned PDFs need OCR; native PDFs do not. Mixing them in the same pipeline without detection produces inconsistent chunk quality.
- **Ignoring update cadence.** A regulatory corpus updated quarterly needs a different ingestion strategy than a daily pricing sheet. Design for the fastest-changing source in the corpus.
- **Discarding metadata.** Document title, author, effective date, and section heading are retrieval signals. Extract and store them at ingestion time; they cannot be recovered later.

---

## Layer 2 — Chunking Strategy

**The question**: How do you divide documents into retrievable units?

### Strategies and when to use them

| Strategy | Module | When to use |
|----------|--------|-------------|
| Fixed-size with overlap | 01 Naive RAG | Uniform prose; no structural boundaries |
| Recursive character splitting | 02 Advanced RAG | Mixed content; respects paragraphs and sentences |
| Parent-child chunking | 10 Parent Document | Long documents where retrieval precision and context breadth both matter |
| Sentence window | 11 Sentence Window | Dense technical text where surrounding sentences provide essential context |
| Semantic chunking | 02 Advanced RAG | Variable-length sections; split at topic boundaries not character boundaries |
| Contextual prepending | 13 Contextual RAG | Any chunking strategy; adds document-level context to each chunk before embedding |
| No chunking | 15 Long-Context RAG | Document fits in context window; cross-section references are frequent |
| Tree/hierarchical | 12 RAPTOR | Need both detail retrieval and thematic retrieval from the same index |

### The chunking quality rule

> The chunk that should answer a query must contain enough information to answer it without the surrounding text. If it does not, the chunk boundary is wrong.

Test this by sampling 20 retrieved chunks and asking: "Could I answer the query from this chunk alone, without reading adjacent chunks?" If the answer is frequently no, your chunks are too small.

### Fintech chunking guidance

- **Regulatory documents**: Chunk at section boundaries (§ markers, numbered clauses). A section is the natural unit of regulatory retrieval — "what does §4.2 say?" is answerable from a section-level chunk; a fixed-size chunk may split mid-section.
- **Earnings reports**: Separate narrative prose from tables and charts. Embed prose as text; embed tables as structured markdown; describe charts with vision LLM (Module 25).
- **Loan policies**: Chunk at rule level. Each chunk should contain exactly one rule with its condition and consequence. Cross-rule lookups are handled by the retrieval layer, not the chunk.

---

## Layer 3 — Embedding Model

**The question**: Which model maps text (and other modalities) to vectors?

### Model comparison

| Model | Dimensions | Context | Strength | Fintech note |
|-------|-----------|---------|----------|--------------|
| `text-embedding-3-small` | 1536 | 8191 tokens | Cost-efficient general purpose | Default for most fintech RAG |
| `text-embedding-3-large` | 3072 | 8191 tokens | Higher accuracy, 5× cost | Use for compliance-critical retrieval where precision matters |
| `text-embedding-ada-002` | 1536 | 8191 tokens | Legacy; prefer 3-small | Avoid for new systems |
| BAAI/bge-large-en | 1024 | 512 tokens | Strong on technical text | Good for regulatory text if self-hosting |
| Cohere embed-v3 | 1024 | 512 tokens | Multilingual, finance-tuned | Strong for multi-jurisdiction regulatory corpora |

### Key decisions

**Domain fine-tuning**: General-purpose embeddings are adequate for most fintech RAG. Domain-specific embeddings matter when the vocabulary is highly specialised (e.g., ISDA master agreements, Basel technical standards) and retrieval precision is critical. The cost of fine-tuning is high; validate general-purpose embeddings first.

**Dimensionality vs cost**: Higher-dimensional embeddings improve retrieval quality but increase vector storage and similarity computation cost. For most corpora under 1M chunks, the quality difference between 1536d and 3072d is marginal. The exception: dense technical corpora where many semantically similar chunks must be distinguished.

**Embedding stability**: When you change the embedding model, the entire index must be rebuilt. Design the pipeline so the embedding model version is stored as metadata alongside each chunk. This makes model migrations auditable and rollbacks possible.

---

## Layer 4 — Vector Store

**The question**: Where do vectors live, and how are they queried?

### Options

| Store | Type | Scale | Fintech suitability |
|-------|------|-------|---------------------|
| ChromaDB | Embedded / client-server | Small–medium (< 5M vectors) | Development and medium-scale production; good metadata filtering |
| Pinecone | Managed cloud | Large (100M+ vectors) | Production SaaS; strong metadata filtering; SOC2 compliant |
| Weaviate | Self-hosted / cloud | Large | Good hybrid BM25+dense; strong governance features |
| pgvector | PostgreSQL extension | Medium | Excellent for fintech teams already on Postgres; ACID guarantees |
| Qdrant | Self-hosted / cloud | Large | Strong filtering; good for compliance workloads with complex metadata |
| FAISS | Library (no persistence) | Any (in-memory) | Research and batch processing; not suitable for production serving |

### Metadata design

Every chunk stored in the vector index should carry at minimum:

```python
{
    "doc_id":         str,   # unique document identifier
    "chunk_id":       str,   # unique chunk identifier within document
    "source":         str,   # filename or URL
    "section":        str,   # section heading or title
    "timestamp":      int,   # Unix epoch of effective date (Layer 1)
    "superseded":     int,   # 0=active, 1=superseded (Layer 1)
    "doc_family":     str,   # version group identifier (Layer 1)
    "modality":       str,   # text / table / image
    "chunk_index":    int,   # position within document (for Parent Doc retrieval)
}
```

Metadata fields enable filtering without semantic search. A query for "current Basel III requirements" should filter `superseded=0` before computing similarity — not after.

### The metadata design rule

> Any filter you will ever apply at retrieval time must be stored as metadata at index time. You cannot add metadata retroactively to an existing index without re-indexing.

Enumerate your query types before building the index. Every filter condition in those queries is a required metadata field.

---

## Layer 5 — Retrieval Strategy

**The question**: How do you find the most relevant chunks for a given query?

This is where the 26 patterns in this repository live. The retrieval strategy layer has the most variation and the most direct impact on answer quality.

### Retrieval mechanisms

| Mechanism | What it measures | Best for |
|-----------|-----------------|----------|
| Dense (cosine similarity) | Semantic meaning | General Q&A; conceptual queries |
| Sparse (BM25) | Exact term overlap | Regulatory references; specific clause lookups; named entities |
| Hybrid (RRF fusion) | Both | Most fintech use cases; default when unsure |
| Graph traversal | Entity relationships | Counterparty networks; regulatory obligation chains |
| Time-filtered | Recency + semantic | Regulatory change tracking; versioned policy corpora |

### Retrieval strategy selection

See `pattern_selection.md` for the full decision tree. The one-line summary:

- **Simple semantic query** → Dense retrieval (Module 01/02)
- **Exact term + semantic** → Hybrid RAG (Module 03)
- **Multiple query variants** → Multi-Query or RAG Fusion (Module 04/05)
- **Complex multi-step question** → IRCoT or Multi-Hop (Module 18/23)
- **Entity relationship query** → Graph RAG (Module 24)
- **Time-sensitive** → Temporal RAG (Module 26)
- **Visual content** → Multimodal RAG (Module 25)
- **Unknown query type** → Adaptive RAG (Module 20)

### Re-ranking

After retrieval, re-ranking re-scores the top-k results using a cross-encoder model that considers the query and document together (not independently, as in embedding similarity). Re-ranking improves precision at the cost of latency (~100–300ms for a cross-encoder pass over top-20 results).

Use re-ranking when:
- The corpus is large and semantic retrieval alone has low precision
- The query is complex and the top-1 result is frequently wrong
- Cohere Rerank or a cross-encoder is available in the stack

---

## Layer 6 — Context Processing

**The question**: How do you transform raw retrieved chunks into a synthesis-ready context?

### Processing steps

**Deduplication**: Remove duplicate chunks before passing to the LLM. Duplicates consume tokens without adding information and can cause the model to over-weight repeated content. Deduplicate on exact chunk text or on high-similarity embeddings (cosine > 0.95).

**Ordering**: The LLM attends to context non-uniformly — beginning and end receive more attention than the middle ("lost in the middle", Liu et al. 2024, Module 15). Place the most relevant chunks at the start and end; put lower-relevance filler in the middle.

**Context compression**: For long-context windows where you must include many chunks, compress individual chunks to their most relevant sentences before assembly. A compressor LLM call (Haiku) that reduces a 500-token chunk to its 3 most relevant sentences can double the effective number of chunks in a fixed token budget.

**Citation injection**: For compliance and audit use cases, prepend each chunk with its source reference: `[Source: Basel III §4.2, effective 2019-01-01]`. This anchors the LLM's answer to a citable source and prevents blending from multiple sources without attribution.

**Token budget enforcement**: Calculate the total tokens in the assembled context before the synthesis call. If it exceeds the budget, truncate by dropping lowest-scoring chunks (not by truncating individual chunks — partial chunks are worse than absent chunks).

```python
MAX_CONTEXT_TOKENS = 8000  # leave room for system prompt and answer
context_tokens = sum(count_tokens(chunk) for chunk in selected_chunks)
while context_tokens > MAX_CONTEXT_TOKENS and selected_chunks:
    selected_chunks.pop()  # drop lowest-scoring chunk (assumed sorted)
    context_tokens = sum(count_tokens(chunk) for chunk in selected_chunks)
```

---

## Layer 7 — LLM Generation

**The question**: Which model generates the answer, and how is the generation prompt structured?

### Model selection by task

| Task | Model | Rationale |
|------|-------|-----------|
| Per-step reasoning (IRCoT, CRAG) | Claude Haiku | Low cost, low latency; adequate for classification and short generation |
| Hypothesis generation (HyDE) | Claude Haiku | Cheap generation; quality matters less than cost here |
| Final answer synthesis | Claude Sonnet | Best quality for the response the user sees |
| Complex multi-document reasoning | Claude Sonnet | Long context, high reasoning quality |
| Vision synthesis (Multimodal RAG) | Claude Sonnet (vision) | Required for image input |

### System prompt structure for fintech RAG

```
You are a [role] at a financial institution.
Answer the question using ONLY the provided context.
Do not use knowledge not present in the retrieved documents.

Rules:
- Cite the source document and effective date for every factual claim.
- If the context does not contain sufficient information to answer, say so explicitly.
- Do not extrapolate or infer beyond what is stated.
- If context contains conflicting information from different document versions,
  use the most recent effective date and note the conflict.

Context:
{assembled_context}
```

**The grounding instruction is mandatory.** Without "use ONLY the provided context," LLMs blend retrieved content with parametric knowledge, producing answers that are partly grounded and partly hallucinated, with no signal to the user about which parts are which.

### Temperature

Use `temperature=0` for compliance and regulatory Q&A. Deterministic generation means repeated queries produce consistent answers — critical for audit trail integrity. Use `temperature=0.3–0.7` only for creative generation tasks (summaries, reports) where stylistic variation is acceptable.

---

## Layer 8 — Evaluation and Monitoring

**The question**: How do you know if the system is working?

### Retrieval metrics

| Metric | What it measures | Target |
|--------|-----------------|--------|
| Recall@k | Fraction of relevant docs in top-k | > 0.8 for k=5 |
| MRR (Mean Reciprocal Rank) | How high the first relevant doc ranks | > 0.7 |
| NDCG | Graded relevance of the ranked list | > 0.75 |
| Context precision | Fraction of retrieved chunks that are relevant | > 0.7 |

### Generation metrics (RAGAS framework)

| Metric | What it measures |
|--------|-----------------|
| Faithfulness | Is the answer grounded in the retrieved context? (0–1) |
| Answer relevance | Does the answer address the query? (0–1) |
| Context recall | Does the context contain the information needed to answer? (0–1) |
| Answer correctness | Does the answer match the reference answer? (0–1) |

### Production monitoring

**Latency percentiles**: Track p50, p95, p99 query latency. Spikes at p95/p99 often indicate retrieval timeouts or context window overflow. Set alerts at 2× the baseline p95.

**Cost per query**: Track embedding cost + LLM cost per query. Budget overruns are almost always caused by context length creep (retrieved chunks growing larger over time as the corpus expands) or by agentic loops not converging.

**Retrieval null rate**: Track the fraction of queries where no documents pass the relevance threshold. Rising null rate indicates corpus staleness (documents being superseded without re-indexing) or query drift (user queries moving outside the corpus domain).

**Hallucination detection**: Sample 1–5% of queries for human review or automated faithfulness scoring. For compliance use cases, any unfaithful answer (claim not grounded in retrieved context) is a critical failure.

### The evaluation flywheel

```
Production queries
       │
       ▼
Sample + human label (relevant / not relevant / correct / incorrect)
       │
       ▼
Identify failure modes:
  - Low retrieval recall → fix chunking or retrieval strategy (Layers 2/5)
  - Low faithfulness → fix system prompt (Layer 7)
  - High latency → reduce context tokens (Layer 6)
  - Stale answers → fix temporal filtering (Layer 5) or update cadence (Layer 1)
       │
       ▼
Update the pipeline → re-evaluate → repeat
```

The most common mistake: evaluating only at launch, not in production. Query distributions shift over time. A system that was 90% accurate at launch may degrade to 70% accuracy six months later as the corpus and query patterns change.

---

## Layer Interaction Summary

```
Layer 1 (Ingestion)    → determines what knowledge is available
Layer 2 (Chunking)     → determines the granularity of retrieval
Layer 3 (Embedding)    → determines the semantic space
Layer 4 (Vector store) → determines filtering and scale
Layer 5 (Retrieval)    → determines what reaches the LLM
Layer 6 (Context)      → determines how retrieved content is presented
Layer 7 (Generation)   → determines how content is transformed to answer
Layer 8 (Evaluation)   → determines whether the system should be trusted
```

Problems diagnosed at layer 7 (bad answers) are often caused by failures at layer 2 (bad chunks) or layer 5 (wrong retrieval). When debugging a RAG quality issue, start at layer 1 and work down — do not start by tuning the LLM prompt.
