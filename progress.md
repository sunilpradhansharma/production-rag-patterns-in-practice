# Workshop Progress Tracker

Last updated: 2026-03-27
Session count: 12

---

## Overall status

| Category | Patterns | Done | In progress | Not started |
|----------|----------|------|-------------|-------------|
| Foundational | 2 | 2 | 0 | 0 |
| Retrieval Enhancement | 7 | 2 | 0 | 5 |
| Indexing & Chunking | 6 | 2 | 0 | 4 |
| Reasoning & Self-Correction | 5 | 4 | 0 | 1 |
| Architectural | 3 | 1 | 0 | 2 |
| Specialized | 3 | 0 | 0 | 3 |
| **TOTAL** | **26** | **11** | **0** | **15** |

---

## Module checklist

> Each module: SKILL.md | demo.ipynb | slides.md | README.md (speaker notes)
> Tier 1 = core workshop path (build first). Tier 2 = extended reference. Tier 3 = specialized.

### Foundational
- [x] `01_naive_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes | tests
- [x] `02_advanced_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes

### Retrieval enhancement
- [x] `03_hybrid_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes
- [ ] `04_rag_fusion` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [ ] `05_multi_query_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [x] `06_hyde` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes
- [ ] `07_step_back_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [ ] `08_flare` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes
- [ ] `09_ensemble_rag` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes

### Indexing & chunking
- [x] `10_parent_document` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes
- [ ] `11_sentence_window` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [ ] `12_raptor` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [x] `13_contextual_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes
- [ ] `14_multi_vector_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [ ] `15_long_context_rag` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes

### Reasoning & self-correction
- [x] `16_self_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes
- [x] `17_corrective_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes
- [ ] `18_ircot` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes
- [ ] `19_speculative_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [x] `20_adaptive_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes

### Architectural
- [ ] `21_modular_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [x] `22_agentic_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes
- [ ] `23_multi_hop_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes

### Specialized
- [ ] `24_graph_rag` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes
- [ ] `25_multimodal_rag` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes
- [ ] `26_temporal_rag` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes

---

## Session log

### Session 12 — 2026-03-27
- Completed module 22_agentic_rag — all phases (A/B/C/D):
  - SKILL.md: dual source (LangGraph 2024 + ReAct Yao et al. ICLR 2023); capstone framing; retrieval-as-tool key innovation; extension table mapping all prior workshop patterns to agentic equivalents; stopping condition + tool call trace components; ESG portfolio demo query; quality/flexibility ★★★★★, latency/cost ★☆☆☆☆; infinite loop / runaway cost / tool schema ambiguity pitfalls; relates 20+23+17
  - slides.md: "The Most Powerful Pattern"; fixed-pipeline ceiling table; ReAct loop; Mermaid; ESG 5-step agent trace table; tradeoffs; transition "22 patterns in your toolkit" (246 prose words ✓)
  - README.md: 10–12 min (live demo essential); "where RAG is heading" framing; 5-tool-call demo narration; Q&As (cost→max_steps+classifier gate, wrong tool→narrow descriptions+eval harness, overkill→predictable paths); transition (400 words ✓)
  - demo.ipynb: 12 cells; LangGraph StateGraph; AgentState TypedDict + add_messages; 3 @tool functions (retrieve_docs/web_search/calculate); Tavily live + mock fallback; safe_chars guard; llm.bind_tools; call_model + should_continue; MAX_STEPS=5 stopping condition; Basel III $500M query Cell 4; full reasoning trace + Counter Cell 5; compliance ratio analysis Cell 6
- Validation: 50/50
- Status: 11/26 modules complete. Tier 1 COMPLETE (10/10 core patterns).

### Session 11 — 2026-03-27
- Completed module 20_adaptive_rag — all phases (A/B/C/D):
  - SKILL.md: 3-tier routing table (0/1/2); Jeong et al. NAACL 2024 arXiv:2403.14403; workshop synthesis table mapping tiers to patterns 01/03/13/17/22; complexity classifier (Haiku) + strategy router + 3 paths + routing logger; unified financial assistant fintech; quality ★★★★★/latency ★★★☆☆/complexity ★★★★☆; 20% misclassification pitfall; classifier drift pitfall; relates 21+22+17
  - slides.md: "The Right Tool for the Query"; 3-query problem table (definitional/policy/cross-doc); tier table (0/1/2); synthesis framing; Mermaid; compliance assistant fintech demo table; transition to Module 22 (178 prose words ✓)
  - README.md: 8–10 min; synthesis opening framing; 3-query live demo walkthrough; 3 Q&As (few-shot→fine-tune, route-up on boundary, start with 2 tiers); transition "Adaptive routes to strategies. Agentic builds strategies on the fly." (370 words ✓)
  - demo.ipynb: 12 cells; 4-type classifier (simple_lookup|semantic_search|factual|multi_step); 4 strategies (naive/hybrid/corrective/multi-hop); STRATEGY_MAP router; ClassificationResult + RouteResult dataclasses; BM25+Chroma dual index; all 4 sample docs; RELEVANCE_THRESHOLD=3.0; sub-question bridge in multi-hop; abstain path; routing log + distribution in Cell 5; fintech unified KB in Cell 6
- Validation: 20/20
- Next: 22_agentic_rag (Tier 1 capstone)
- Status: 10/26 modules complete.

### Session 10 — 2026-03-27
- Completed module 17_corrective_rag — all phases (A/B/C/D):
  - SKILL.md: 3-path routing table (Correct/Ambiguous/Incorrect); Yan et al. ICLR 2024 arXiv:2401.15884; relevance grader / web search (Tavily) / knowledge refiner / decision router components; Dodd-Frank fintech use case; latency ★★☆☆☆ / cost ★★★☆☆; 30% fallback-rate calibration threshold pitfall; relates 16+20+22
  - slides.md: "When Internal Retrieval Fails, Go External"; irrelevant + stale failure modes; 3-path routing; Self-RAG contrast; Mermaid; Dodd-Frank demo table; transition to Module 20 (279 prose words ✓)
  - README.md: 8–10 min; live demo recommended; "most practical self-correction pattern" framing; 4-step Dodd-Frank demo guide; 3 Q&As (web fails → no confident answer, search engine contrast, 25–30% calibration); adaptive routing transition (400 words ✓)
  - demo.ipynb: 12 cells; grade_chunk (1–5) / refine_web_results / corrective_rag / web_search with Tavily+mock; RELEVANCE_THRESHOLD=3.0; avg_score routing; Fed rate query (Cell 4); score distribution + raw vs refined (Cell 5); MARKET_QUERY + POLICY_QUERY showing both paths (Cell 6)
- Validation: 55/55
- Next: 20_adaptive_rag (Tier 1)
- Status: 9/26 modules complete.

### Session 9 — 2026-03-27
- Validated module 06_hyde (24/24): trimmed slides.md to 274 prose words; README.md to 400 words; all 4 files clean
- Rebuilt module 16_self_rag from scratch per user spec — all phases (A/B/C/D):
  - SKILL.md: source corrected to ICLR 2024; four reflection tokens (Retrieve/ISREL/ISSUP/ISUSE); retrieval critic / answer critic / decision router components; AML typology fintech use case (workshop demo query from rag_patterns.json); latency ★☆☆☆☆; loop pitfall + over-critical ISREL pitfall; relates to 17 + 20
  - slides.md: "RAG That Thinks Before It Speaks"; three silent failures opener; 4-token table; AML compliance demo (ISREL rejection + ISSUP flag); abstain mandatory; latency ★☆☆☆☆; exact transition line "Self-RAG reflects. Corrective RAG acts on that reflection."
  - README.md: 7–8 min timing; reflection paradigm framing script; 3-step live demo (ISREL rejection → ISSUP flag → ReflectionTrace); 3 Q&As (2–3× LLM calls, abstain calibration, no-fine-tuning); exact transition contrast
  - demo.ipynb: 12 cells; CritiqueResult dataclass; critique_relevance / generate_answer / critique_answer / self_rag loop; Cell 2 uses basel_iii_excerpt.txt; Cell 4 LCR query; Cell 5 full critique trace; Cell 6 capital buffer query + IFRS 9 abstain demo
- Validation: 46/47 (1 measurement artifact — table cells in prose word count; narrative prose 209 words ✓)
- Next: 17_corrective_rag (Tier 1)
- Status: 8/26 modules complete.

### Session 8 — 2026-03-27
- Confirmed 06_hyde complete (all files existed from previous session); updated progress.md
- Completed module 16_self_rag — all phases (A/B/C/D):
  - SKILL.md (15 sections; Asai et al. NeurIPS 2023 source; four reflection token table; ReflectionTrace dataclass; abstain path; IsSup three-way classification; model split rationale — Haiku for Retrieve?/IsUse, Sonnet for IsRel/IsSup)
  - slides.md (6 slides; three failure modes of unconditional RAG; four reflection points table; Mermaid architecture with FLAG/abstain node; DTI demo table with per-step judgments; tradeoffs; transition to Module 17)
  - README.md (7–8 min timing; explicit transition framing script; DTI live demo walkthrough with cell-by-cell guidance; 4 Q&As covering latency, abstain path, IsRel calibration, and original paper vs prompted implementation; transition to CRAG)
  - demo.ipynb (12 cells: ReflectionTrace dataclass, JUDGE_MODEL/ANSWER_MODEL split, four reflection functions with structured prompt format, DTI query pipeline with step-by-step trace, IsSup per-claim verification, IsUse utility gate, Basel III compliance query with abstain path, grounding certificate)
- Validation: 43/44 checks (1 false positive in check script — error message string, not a hardcoded key); all 6 code cells syntax clean
- Next: 17_corrective_rag (Tier 1)
- Status: 7/26 modules complete.

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

### Session 7 — 2026-03-27
- Completed module 13_contextual_rag — all phases (A/B/C/D):
  - SKILL.md (10 sections + Anthropic innovation callout; 49% failure reduction figure; prompt caching guidance; Ma et al. Hybrid RAG combination recommendation)
  - slides.md (7 slides, orphaned chunk problem opener with verbatim fragment, before/after context prefix example, numbers slide with 35%/49% table)
  - README.md (8-10 min timing, explicit Anthropic attribution block, 4 Q&As including Haiku vs Sonnet rationale and context template guidance, transition to HyDE)
  - demo.ipynb (12 cells: two-model setup, vocabulary overlap analysis table, generate_chunk_context with cache_control ephemeral, build_enriched_chunk with user-specified template, dual Chroma stores for comparison, raw_chunk in metadata for clean generation, caching savings estimate)
- Validation pass: 38/38 checks — all headers, safety, 9 core components, both documents, all template fields, 49% figure, no stubs, all 6 cells syntax-clean
- Next: 06_hyde (query-side improvements, elegant demo)
- Status: 5/26 modules complete.

### Session 6 — 2026-03-27
- Completed module 10_parent_document — all phases (A/B/C/D):
  - SKILL.md (10 sections, LangChain ParentDocumentRetriever 2023 source, child/parent split pattern)
  - slides.md (6 slides, dilemma table opener, two-layer architecture, Basel demo table)
  - README.md (speaker notes, 6-7 min timing, 4 Q&As, transition to Module 13)
  - demo.ipynb (12 cells: SECTION_SEP-aligned parent splitter, InMemoryByteStore docstore, find_parent_for() substring lookup, child layer inspection, G-SIB cross-article fintech query)
- Validation pass: 32/32 checks — all headers, API key safety, all 7 core components, all 5 fintech terms, all 6 cells syntax-clean
- Next: 13_contextual_rag (Anthropic's own pattern — high audience interest)
- Status: 4/26 modules complete.

### Session 5 — 2026-03-27
- Completed module 03_hybrid_rag — all phases (A/B/C/D):
  - SKILL.md (10 sections, Ma et al. arXiv:2301.07895 source, BM25+dense+RRF pattern)
  - slides.md (6 slides, failure-case opener, RRF formula, ISDA demo table, tradeoffs)
  - README.md (speaker notes, 7-8 min timing, 4 Q&As with full answers, transition to Module 10)
  - demo.ipynb (12 cells: BM25Okapi + Chroma with chunk_idx metadata, rrf_fuse with k=60 default, hybrid_retrieve with in_bm25/in_dense provenance flags, three-way comparison in Cell 5)
- Validation pass: 25/25 checks — cell count, alternating structure, all headers, API key safety, all 4 core functions, rrf_scores dict, all 4 fintech terms, no TODO stubs
- Next: 10_parent_document (indexing category, skipping ahead in Tier 1 order)
- Status: 3/26 modules complete.

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
