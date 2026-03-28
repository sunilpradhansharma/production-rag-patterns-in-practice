# RAG Patterns — Quick Reference Card

> 26 patterns. One page. Print double-sided.

---

## Retrieval Patterns

| # | Pattern | Core Idea | Use When |
|---|---------|-----------|----------|
| 01 | **Naive RAG** | Embed query → cosine search → generate | Learning, prototyping, baseline benchmarks |
| 02 | **Advanced RAG** | Semantic chunking + re-ranking over top-k | First production upgrade from naive; most use cases |
| 03 | **Hybrid RAG** | BM25 (exact) + dense (semantic) fused via RRF | Regulatory terms, instrument IDs, named entities |
| 04 | **RAG Fusion** | N queries → N ranked lists → RRF merge | Ambiguous queries; need diverse retrieval coverage |
| 05 | **Multi-Query RAG** | LLM rewrites query N ways → retrieve each | Broad or multi-faceted questions |
| 06 | **HyDE** | Generate hypothetical answer → embed that | Query vocabulary doesn't match document vocabulary |
| 07 | **Step-Back RAG** | Rephrase to abstract principle → retrieve | "Why" questions; conceptual / strategic queries |
| 08 | **FLARE** | Generate tentatively → retrieve when uncertain | Long-form generation requiring many retrieval steps |
| 09 | **Ensemble RAG** | Combine multiple retriever strategies with weights | Mixed corpus types (structured + unstructured) |

---

## Indexing Patterns

| # | Pattern | Core Idea | Use When |
|---|---------|-----------|----------|
| 10 | **Parent Document** | Index small child chunks; return parent for context | Long docs where precision + context both matter |
| 11 | **Sentence Window** | Index sentences; retrieve with surrounding window | Dense technical text; context lost across boundaries |
| 12 | **RAPTOR** | Recursive summary tree; retrieve at multiple levels | Large corpora needing both themes and details |
| 13 | **Contextual RAG** | Prepend doc-level context to each chunk at index time | Any corpus where chunks lose meaning in isolation |
| 14 | **Multi-Vector RAG** | Store multiple embeddings per doc (text + summary + Q) | Documents with mixed retrieval signal types |

---

## Reasoning Patterns

| # | Pattern | Core Idea | Use When |
|---|---------|-----------|----------|
| 15 | **Long-Context RAG** | Skip chunking; put full doc in context window | Entire relevant content fits in 200K+ token window |
| 16 | **Self-RAG** | Model critiques its own retrieval and generation | High-stakes answers; need internal confidence signal |
| 17 | **Corrective RAG** | Relevance check → web fallback if corpus fails | Corpus may not contain the answer; needs external data |
| 18 | **IRCoT** | Interleave retrieval and chain-of-thought steps | Dynamic multi-step reasoning; each step needs new docs |
| 19 | **Speculative RAG** | Draft answer speculatively → verify with retrieval | High-throughput; answer structure predictable |

---

## Orchestration Patterns

| # | Pattern | Core Idea | Use When |
|---|---------|-----------|----------|
| 20 | **Adaptive RAG** | Classify query → route to appropriate pattern | Mixed production traffic; query types vary at runtime |
| 21 | **Modular RAG** | Swap retrieval, re-rank, and generation modules | System must serve multiple product lines or policies |
| 22 | **Agentic RAG** | LLM chooses tools: retrieve, search web, calculate | Answer requires external data or multi-step actions |

---

## Specialised Patterns

| # | Pattern | Core Idea | Use When |
|---|---------|-----------|----------|
| 23 | **Multi-Hop RAG** | Chain fixed retrieval steps: A → B → C | Known reasoning chains (KYC: entity → owner → jurisdiction) |
| 24 | **Graph RAG** | Build entity graph → BFS traversal + vector search | Relationship queries (counterparty exposure, ownership) |
| 25 | **Multimodal RAG** | Extract text + tables + chart descriptions → unified index | Earnings reports, prospectuses, any doc with visuals |
| 26 | **Temporal RAG** | Time-decay scoring + version filtering on timestamps | Regulatory corpora that change; "rule before 2023" queries |

---

## Decision Rules — 60-Second Version

```
Unknown query type?          → Adaptive RAG (20)
Has exact regulatory terms?  → Hybrid RAG (03)
Query vocabulary mismatch?   → HyDE (06)
Chunks lose document context?→ Contextual RAG (13)
Long document, need context? → Parent Document (10) or Sentence Window (11)
Multi-step reasoning?        → IRCoT (18) [dynamic] / Multi-Hop (23) [fixed]
Entity relationships?        → Graph RAG (24)
Images or tables?            → Multimodal RAG (25)
Versioned / time-scoped?     → Temporal RAG (26)
Needs external data?         → Agentic RAG (22)
Self-verification needed?    → Corrective RAG (17) or Self-RAG (16)
None of the above?           → Advanced RAG (02) + Hybrid (03)
```

**Default for fintech**: `Hybrid RAG (03) + Temporal RAG (26)`

---

## Validated Combinations

| Combination | Use Case |
|-------------|----------|
| Hybrid (03) + Temporal (26) | Current regulatory Q&A |
| Contextual (13) + Hybrid (03) | Dense technical docs (ISDA, Basel) |
| IRCoT (18) + Hybrid (03) | Multi-step compliance with exact clause references |
| Graph (24) + Temporal (26) | Counterparty exposure at a point in time |
| Adaptive (20) + any | Mixed production traffic |
| Self-RAG (16) + Hybrid (03) | High-stakes compliance answers |

---

## Anti-Patterns to Avoid

| Don't do this | Do this instead |
|---------------|-----------------|
| Naive RAG in production | Advanced RAG minimum |
| IRCoT for a simple lookup | Advanced RAG or Hybrid |
| Long-Context for large corpus | RAPTOR or Hybrid |
| HyDE for exact-term queries | Hybrid RAG (BM25) |
| Agentic RAG for a fixed corpus | Multi-Hop or IRCoT |
| No temporal filtering on versioned corpus | Add Temporal RAG (metadata only) |

---

## Cost Reference

| Pattern | Relative cost per query | Notes |
|---------|------------------------|-------|
| Advanced RAG (02) | $ | 1 embed + 1 LLM call |
| Hybrid RAG (03) | $ | BM25 is free; 1 embed + 1 LLM |
| Contextual RAG (13) | $$ at index time | Extra LLM call per chunk during indexing |
| Self-RAG (16) | $$ | 2–3 LLM calls per query |
| Corrective RAG (17) | $$ | Relevance check + possible web search |
| IRCoT (18) | $$$ | N retrieve + N reason steps |
| Graph RAG (24) | $$$ | Graph construction + BFS + vector |
| Agentic RAG (22) | $$$$ | Unbounded tool calls |

Typical range: **$0.001–$0.01 per query** for RAG; **$0.01–$1.00+ per task** for agentic.

---

## Repository Structure

```
modules/
  01_naive_rag/ through 26_temporal_rag/
    SKILL.md      — pattern reference (what, why, tradeoffs)
    demo.ipynb    — 6-cell runnable notebook
    slides.md     — workshop slide content
    README.md     — speaker notes + Q&A
shared/sample_data/
  fintech_policy.txt   basel_iii_excerpt.txt
  isda_excerpt.txt     earnings_report.txt
docs/architecture/
  pattern_selection.md  design_layers.md  rag_vs_agentic.md
```

---

*Production RAG Patterns in Practice — github.com/sunilpradhansharma/production-rag-patterns-in-practice*
