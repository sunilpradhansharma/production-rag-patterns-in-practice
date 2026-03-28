# Module Index

All 26 RAG patterns, their workshop tier, and timing guidance for the 90-minute workshop.

---

## Quick navigation

| # | Module | Pattern | Tier | Status |
|---|--------|---------|------|--------|
| 01 | [01_naive_rag](01_naive_rag/) | Naive RAG | Tier 1 | — |
| 02 | [02_advanced_rag](02_advanced_rag/) | Advanced RAG | Tier 1 | — |
| 03 | [03_hybrid_rag](03_hybrid_rag/) | Hybrid RAG | Tier 1 | — |
| 04 | [04_rag_fusion](04_rag_fusion/) | RAG Fusion | Tier 2 | — |
| 05 | [05_multi_query_rag](05_multi_query_rag/) | Multi-Query RAG | Tier 2 | — |
| 06 | [06_hyde](06_hyde/) | HyDE | Tier 1 | — |
| 07 | [07_step_back_rag](07_step_back_rag/) | Step-Back RAG | Tier 2 | — |
| 08 | [08_flare](08_flare/) | FLARE | Tier 3 | — |
| 09 | [09_ensemble_rag](09_ensemble_rag/) | Ensemble RAG | Tier 3 | — |
| 10 | [10_parent_document](10_parent_document/) | Parent Document Retrieval | Tier 1 | — |
| 11 | [11_sentence_window](11_sentence_window/) | Sentence Window Retrieval | Tier 2 | — |
| 12 | [12_raptor](12_raptor/) | RAPTOR | Tier 2 | — |
| 13 | [13_contextual_rag](13_contextual_rag/) | Contextual RAG | Tier 1 | — |
| 14 | [14_multi_vector_rag](14_multi_vector_rag/) | Multi-Vector RAG | Tier 2 | — |
| 15 | [15_long_context_rag](15_long_context_rag/) | Long-Context RAG | Tier 3 | — |
| 16 | [16_self_rag](16_self_rag/) | Self-RAG | Tier 1 | — |
| 17 | [17_corrective_rag](17_corrective_rag/) | Corrective RAG (CRAG) | Tier 1 | — |
| 18 | [18_ircot](18_ircot/) | IRCoT | Tier 3 | — |
| 19 | [19_speculative_rag](19_speculative_rag/) | Speculative RAG | Tier 2 | — |
| 20 | [20_adaptive_rag](20_adaptive_rag/) | Adaptive RAG | Tier 1 | — |
| 21 | [21_modular_rag](21_modular_rag/) | Modular RAG | Tier 2 | — |
| 22 | [22_agentic_rag](22_agentic_rag/) | Agentic RAG | Tier 1 | — |
| 23 | [23_multi_hop_rag](23_multi_hop_rag/) | Multi-Hop RAG | Tier 2 | — |
| 24 | [24_graph_rag](24_graph_rag/) | Graph RAG | Tier 3 | — |
| 25 | [25_multimodal_rag](25_multimodal_rag/) | Multi-Modal RAG | Tier 3 | — |
| 26 | [26_temporal_rag](26_temporal_rag/) | Temporal RAG | Tier 3 | — |

---

## 90-minute workshop path (Tier 1 only)

The workshop covers 10 Tier 1 patterns across 5 segments. Each segment has a
slides block and one live notebook demo.

### Segment 1 — Foundations (0:00–0:10)
**Patterns:** Naive RAG → Advanced RAG
**Live demo:** Naive RAG notebook (Cell 1–4)
**Key message:** Establish the baseline pipeline and show where it breaks.

- **[01_naive_rag](01_naive_rag/)** — 4 min slides + 6 min demo
  - The simplest possible pipeline: embed → store → retrieve → generate
  - Show the chunking problem on the fintech policy document
- **[02_advanced_rag](02_advanced_rag/)** — 3 min slides (no live demo)
  - Query rewriting, reranking, and metadata filtering as first-order improvements

**Timing note:** Spend no more than 3 min on Naive RAG slides — the audience
already knows retrieval basics. Use the time you save for the live demo.

---

### Segment 2 — Indexing (0:10–0:25)
**Patterns:** Parent Document → Contextual RAG
**Live demo:** Contextual RAG notebook (Cells 3–5)
**Key message:** How you index is as important as how you retrieve.

- **[10_parent_document](10_parent_document/)** — 5 min slides (no live demo)
  - Index small, retrieve small, expand to parent for generation context
  - Show the ISDA excerpt — why paragraph-level chunks lose section context
- **[13_contextual_rag](13_contextual_rag/)** — 5 min slides + 10 min demo
  - Anthropic's technique: prepend LLM-generated context to every chunk at index time
  - Demo: show the chunk before and after contextualisation on the Basel III excerpt
  - Highlight the ~20× retrieval improvement from the paper

**Timing note:** The contextual RAG demo is the most impressive in the workshop.
Budget 10 full minutes — including running Cell 5 (Inspect) so attendees see
the context prepended to raw chunks.

---

### Segment 3 — Retrieval (0:25–0:40)
**Patterns:** Hybrid RAG → HyDE
**Live demo:** Hybrid RAG notebook (Cells 3–4)
**Key message:** Keyword search isn't dead — combining it with vectors is the
single biggest free win in production RAG.

- **[03_hybrid_rag](03_hybrid_rag/)** — 7 min slides + 8 min demo
  - Dense (embedding) + sparse (BM25) with Reciprocal Rank Fusion
  - Show on the Basel III excerpt: "Tier 1 capital ratio" — semantic vs. keyword hits
- **[06_hyde](06_hyde/)** — 5 min slides (no live demo)
  - Generate a hypothetical answer first, embed it, use that embedding for retrieval
  - Great "aha" moment: show how HyDE shifts the embedding distribution

**Timing note:** Run the hybrid demo first (Cells 3–4 only — skip 5 and 6 to
save time). Then pivot immediately to the HyDE slides with the embedding
space diagram. The two patterns contrast well: one improves recall from both
ends; the other improves precision by bridging the query–document gap.

---

### Segment 4 — Reasoning (0:40–0:55)
**Patterns:** Self-RAG → Corrective RAG
**Live demo:** Corrective RAG notebook (Cells 3–5)
**Key message:** The pipeline can judge its own output and course-correct.

- **[16_self_rag](16_self_rag/)** — 5 min slides (no live demo)
  - Introduces IsREL, IsSUP, IsUSE tokens — teach the model when to retrieve
  - Contrast with vanilla RAG: retrieval happens every turn regardless of need
- **[17_corrective_rag](17_corrective_rag/)** — 5 min slides + 10 min demo
  - If retrieved docs score below threshold, trigger web search fallback
  - Demo: ask a question that the local corpus can't answer — watch it escalate

**Timing note:** The CRAG demo requires a Tavily API key. If attendees don't
have one, use the offline fixture mode (set `RAG_OFFLINE_MODE=true` in .env).
The pre-cached fixture shows the same fallback flow without a live API call.

---

### Segment 5 — Architecture (0:55–1:10)
**Patterns:** Adaptive RAG → Agentic RAG
**Live demo:** Agentic RAG notebook (Cells 3–4)
**Key message:** Route queries to the right strategy; use agents when a single
retrieval pass isn't enough.

- **[20_adaptive_rag](20_adaptive_rag/)** — 5 min slides (no live demo)
  - Query classifier routes to: no retrieval / single-step / iterative
  - Show the decision tree for the fintech domain
- **[22_agentic_rag](22_agentic_rag/)** — 5 min slides + 10 min demo
  - LangGraph agent with retrieve → grade → rewrite → retrieve loop
  - Demo: multi-step compliance question that requires two retrieval rounds

**Timing note:** The Agentic RAG demo is the most complex. Focus Cells 3–4
only. Skip the inspection cell unless the audience is clearly engaged and
ahead of schedule.

---

### Segments 6–7 — Synthesis and Q&A (1:10–1:30)
**No live demos.** Refer attendees to the remaining 16 patterns in this repo.

The 16 non-workshop patterns are:

| Tier 2 (go deeper) | Tier 3 (specialist) |
|---------------------|---------------------|
| 04 RAG Fusion       | 08 FLARE            |
| 05 Multi-Query RAG  | 09 Ensemble RAG     |
| 07 Step-Back RAG    | 15 Long-Context RAG |
| 11 Sentence Window  | 18 IRCoT            |
| 12 RAPTOR           | 24 Graph RAG        |
| 14 Multi-Vector RAG | 25 Multi-Modal RAG  |
| 19 Speculative RAG  | 26 Temporal RAG     |
| 21 Modular RAG      |                     |
| 23 Multi-Hop RAG    |                     |

Point attendees to `docs/workshop/cheatsheet.md` for the one-page reference card
and `docs/architecture/pattern_selection.md` for the decision flowchart.

---

## Each module contains

```
<module_id>/
├── SKILL.md        — Pattern knowledge base (what, why, how, tradeoffs, fintech uses)
├── README.md       — Speaker notes, timing, anticipated Q&A, transition notes
├── demo.ipynb      — 6-cell runnable notebook
├── slides.md       — Workshop slide content (≤ 300 words)
└── tests/
    └── test_<slug>.py
```

See `CONTRIBUTING.md` for the full guide on adding a new module.
