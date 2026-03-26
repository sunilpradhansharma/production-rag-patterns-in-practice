# Workshop Progress Tracker

Last updated: 2026-03-26
Session count: 4

---

## Overall status

| Category | Patterns | Done | In progress | Not started |
|----------|----------|------|-------------|-------------|
| Foundational | 2 | 2 | 0 | 0 |
| Retrieval Enhancement | 7 | 0 | 0 | 7 |
| Indexing & Chunking | 6 | 0 | 0 | 6 |
| Reasoning & Self-Correction | 5 | 0 | 0 | 5 |
| Architectural | 3 | 0 | 0 | 3 |
| Specialized | 3 | 0 | 0 | 3 |
| **TOTAL** | **26** | **2** | **0** | **24** |

---

## Module checklist

> Each module: SKILL.md | demo.ipynb | slides.md | README.md (speaker notes)
> Tier 1 = core workshop path (build first). Tier 2 = extended reference. Tier 3 = specialized.

### Foundational
- [x] `01_naive_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes | tests
- [x] `02_advanced_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes

### Retrieval enhancement
- [ ] `03_hybrid_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes
- [ ] `04_rag_fusion` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [ ] `05_multi_query_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [ ] `06_hyde` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes
- [ ] `07_step_back_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [ ] `08_flare` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes
- [ ] `09_ensemble_rag` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes

### Indexing & chunking
- [ ] `10_parent_document` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes
- [ ] `11_sentence_window` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [ ] `12_raptor` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [ ] `13_contextual_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes
- [ ] `14_multi_vector_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [ ] `15_long_context_rag` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes

### Reasoning & self-correction
- [ ] `16_self_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes
- [ ] `17_corrective_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes
- [ ] `18_ircot` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes
- [ ] `19_speculative_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [ ] `20_adaptive_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes

### Architectural
- [ ] `21_modular_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [ ] `22_agentic_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes
- [ ] `23_multi_hop_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes

### Specialized
- [ ] `24_graph_rag` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes
- [ ] `25_multimodal_rag` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes
- [ ] `26_temporal_rag` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes

---

## Session log

### Session 1 — 2026-03-25
- Generated: CLAUDE.md, rag_patterns.json, progress.md
- Status: Scaffold complete. Ready to begin module 01_naive_rag.
- Next action: `claude` → read CLAUDE.md → start module 01

### Session 2 — 2026-03-26
- Repositioned repository as a pure RAG workshop (removed GoF framing throughout)
- Rewrote: README.md, CLAUDE.md, RAG_WORKSHOP_PLAN.md, RAG_WORKSHOP_VISUALS_ADDENDUM.md
- Updated: rag_patterns.json (fixed skill_path references, added workshop_tier + difficulty fields)
- Updated: progress.md (tier labels added to all modules)
- Status: Foundation documents complete. No GoF references remain. Ready to build modules.

### Session 4 — 2026-03-26
- Completed module 02_advanced_rag — all phases (A/B/C/D):
  - SKILL.md (11 sections, Gao et al. arXiv:2312.10997 source, 4-stage pipeline)
  - slides.md (5 slides, Basel III walkthrough table, tradeoffs table)
  - README.md (speaker notes, 7-min timing, 4 Q&As, before/after demo steps, transition)
  - demo.ipynb (12 cells: 6 MD headers + 6 code; rewrite_query, retrieve_multi_query, rerank, compress_chunk; Cohere + LLM fallback; citation grounding audit)
- Validation pass: 17/17 checks — cell count, alternating structure, headers, no hardcoded keys, env loading, all 4 functions typed, Cohere fallback, Basel III data, demo query, citation regex, all 3 Phase A/B files present
- Status: 2/26 modules complete. Next: 03_hybrid_rag.

### Session 3 — 2026-03-26
- Built shared/ Python package (types.py, config.py, utils.py, pipeline.py, builders.py, + 9 supporting files)
- Created all 4 synthetic sample data documents (fintech_policy.txt, basel_iii_excerpt.txt, isda_excerpt.txt, earnings_report.txt)
- Completed module 01_naive_rag — all phases (A/B/C/D):
  - SKILL.md (11 sections, Lewis et al. NeurIPS 2020 source)
  - slides.md (289 words, 5 slides)
  - README.md (speaker notes, timing, 3 Q&A, transition)
  - demo.ipynb (6-cell standard: setup, data, core, run, inspect, fintech)
  - tests/test_naive_rag.py (notebook structure, chunking, scoring, prompt, integration)
- Validation pass: all 11 SKILL.md sections present, Mermaid diagram confirmed, slides 289/300 words, README timing/Q&A/transition confirmed, notebook 12 cells alternating MD/code, all imports resolve, no hardcoded keys, deprecated `langchain.text_splitter` import fixed to `langchain_text_splitters`, notebook source serialization repaired (char-per-element → line-per-element).
- Status: 1/26 modules complete. Next: 02_advanced_rag.

---

## Eval log

_No modules evaluated yet._

---

## Notes for presenter

_Add pacing notes, audience questions, and live feedback here during rehearsal._
