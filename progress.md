# Workshop Progress Tracker

Last updated: 2026-03-28
Session count: 30

---

## Overall status

| Category | Patterns | Done | In progress | Not started |
|----------|----------|------|-------------|-------------|
| Foundational | 2 | 2 | 0 | 0 |
| Retrieval Enhancement | 7 | 7 | 0 | 0 |
| Indexing & Chunking | 6 | 6 | 0 | 0 |
| Reasoning & Self-Correction | 5 | 5 | 0 | 0 |
| Architectural | 3 | 3 | 0 | 0 |
| Specialized | 3 | 3 | 0 | 0 |
| **TOTAL** | **26** | **26** | **0** | **0** |

---

## Module checklist

> Each module: SKILL.md | demo.ipynb | slides.md | README.md (speaker notes)
> Tier 1 = core workshop path (build first). Tier 2 = extended reference. Tier 3 = specialized.

### Foundational
- [x] `01_naive_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes | tests
- [x] `02_advanced_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes | tests

### Retrieval enhancement
- [x] `03_hybrid_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes | tests
- [x] `04_rag_fusion` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [x] `05_multi_query_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [x] `06_hyde` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes | tests
- [x] `07_step_back_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [x] `08_flare` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes
- [x] `09_ensemble_rag` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes

### Indexing & chunking
- [x] `10_parent_document` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes | tests
- [x] `11_sentence_window` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [x] `12_raptor` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [x] `13_contextual_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes | tests
- [x] `14_multi_vector_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [x] `15_long_context_rag` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes

### Reasoning & self-correction
- [x] `16_self_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes | tests
- [x] `17_corrective_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes | tests
- [x] `18_ircot` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes
- [x] `19_speculative_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [x] `20_adaptive_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes | tests

### Architectural
- [x] `21_modular_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes
- [x] `22_agentic_rag` *(Tier 1)* — SKILL.md | notebook | slides | speaker notes | tests
- [x] `23_multi_hop_rag` *(Tier 2)* — SKILL.md | notebook | slides | speaker notes

### Specialized
- [x] `24_graph_rag` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes
- [x] `25_multimodal_rag` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes
- [x] `26_temporal_rag` *(Tier 3)* — SKILL.md | notebook | slides | speaker notes

---

## Session log

### Session 30 — 2026-03-28 — Tests, CI, and documentation complete
- Tier 1 unit tests: created test_*.py for modules 02, 03, 06, 10, 13, 16, 17, 20, 22 (234 tests total across all 10 Tier 1 modules, 0 failures)
  - Each test file: TestNotebookStructure + pattern-specific unit tests + @pytest.mark.integration stubs
  - Fixed pyproject.toml: added `--import-mode=importlib` for multi-package test layout
  - Fixed langchain.schema → langchain_core.documents import across all test files
  - Logic tested without API calls: RRF arithmetic, MD5 deduplication, cosine similarity, CritiqueResult schema, relevance filtering, threshold routing, query type dispatch, MAX_STEPS cap, safe eval
- CI workflow: rewrote .github/workflows/ci.yml — 4 jobs (unit-tests → notebook-structure → notebook-execution → integration-tests); notebook execution fails PR if any cell errors; secrets-absent graceful skip; failed notebook artifact upload
- README: added CI/Python/license/pattern-count shields; 4-command quick start; 26-row pattern catalog table; updated learning paths (Beginner 01→02→03, Intermediate +10/13/16/17, Advanced full Tier 1); fintech use cases section (4 domains × 4 patterns); MIT license; Contributing expanded
- LICENSE: added MIT license file
- docs/workshop/cheatsheet.md: created one-page pattern reference card
- Full validation: 10/10 checks pass (see validation report in commit)
- Status: 26/26 modules complete. All Tier 1 tests passing. CI configured. Documentation complete.

### Session 29 — 2026-03-28 — ALL PATTERNS COMPLETE
- Completed module 26_temporal_rag — all phases (A/B/C/D):
  - SKILL.md: Dhingra et al. TACL 2022 arXiv:2106.15110; three retrieval modes (hard time filter, time-decay re-scoring, version-aware supersession); `decay_score = semantic_score * exp(-λ * age_in_days)`; λ=0.001 → 693-day half-life (regulatory); λ=0.05 → 14-day half-life (market data); 4-intent query parser (current/historical/range/comparative); fintech use cases (Basel III→IV change tracking, lending policy audit trail, market data time-bounded context, MiFID II/Dodd-Frank evolution); recency signal ★★★★★, complexity ★★☆☆☆ — lowest-complexity addition in repo; 6 pitfalls (timestamp absence, hard filter excluding valid old docs, recency bias per-domain λ, supersession chain validation, comparative dual-retrieval, LLM cutoff interaction); relates 17 CRAG + 21 Modular RAG + 20 Adaptive RAG
  - slides.md: "Time-Aware Retrieval"; Basel CET1 three-version stale-data problem; all three retrieval modes in ASCII diagram; 5-row query type table (version-aware/historical/comparative/range/decay); "lowest-complexity addition in this workshop" positioning
  - README.md: 6-7 min; supersession chain printout as anchor; 5 Q&As (λ tuning table, missing timestamps extraction hierarchy, never-amended docs with effective_from/effective_until, partial supersession chunk-level vs doc-level, composability with all patterns); closing framing: "if your corpus changes and you're not doing this, every answer is potentially out of date"; transition to Pattern Selection Guide
  - demo.ipynb: 12 cells; 8-document Basel III/IV corpus 2013-2024 (4 CET1 versions + 3 leverage versions + LCR + NSFR); `to_epoch()` (date→int for ChromaDB); `time_decay()` (exp decay); `build_temporal_index` (timestamp+superseded int metadata); `retrieve_before`/`retrieve_after` ($lt/$gte filters); `retrieve_with_decay` (2k candidates → re-score → top-k); `retrieve_active` (superseded=$eq:0); `detect_temporal_intent` (4-mode classifier); Cell 4: comparative "before vs after 2023" two-pass; Cell 5: decay score table + version-aware + flat baseline STALE labels + supersession chain validation; Cell 6: `temporal_qa()` helper, 3 fintech queries (Q1 2016 audit / current requirements / 2019→2023 evolution), mode summary table
- Validation: 60/60 checks passed; all 4 files present; all 6 code cells parse cleanly
- Status: 26/26 modules complete. ALL PATTERNS DONE. Repository ready for documentation phase.

### Session 28 — 2026-03-28
- Completed module 25_multimodal_rag — all phases (A/B/C/D):
  - SKILL.md: Chen et al. arXiv:2407.01004 (MMRet 2024); 7-component architecture (multimodal extractor, vision descriptor, text/image embedder, unified index, cross-modal retriever, context builder, vision LLM synthesiser); key insight: images embedded via text descriptions not raw bytes; fintech use cases (earnings chart Q&A, prospectus table extraction, trading dashboard screenshots, Basel III Pillar 3 tables); visual query quality ★★★★☆ vs vision LLM cost ★★☆☆☆; 6 pitfalls (PDF extraction variance, structured description prompts, table parsing hardness, index-time cost, MAX_IMAGES=3 context budget, modality diversity enforcement); relates 15 Long-Context + 13 Contextual RAG + 14 Multi-Vector RAG
  - slides.md: "Images, Tables, and Text"; "see Figure 1" as the opening problem; three-stream ASCII extraction diagram; 5-row earnings use case table with modality labels; "without multimodal RAG" failure mode stated explicitly; use/avoid conditions
  - README.md: 8-10 min; vision description printout as mandatory demo anchor ("read it aloud"); 5 Q&As (scanned PDFs + OCR, why description not raw bytes + CLIP alternative, large table splitting, PowerPoint support, MAX_IMAGES=3 token budget); demo contrast "text says only 'see Figure 1'; values came from the chart"; transition "Multimodal handles visuals -- Temporal handles time" → Module 26; 5 delivery anti-patterns
  - demo.ipynb: 12 cells; synthetic Meridian Financial Corp. Q4 2024 earnings (4 text sections, 3 markdown tables, 3 pre-written chart descriptions); `VISION_DESCRIPTION_PROMPT` (structured: axes/values/trend); `parse_markdown_table` (headers/rows preserved from markdown); `build_multimodal_index` (unified Chroma with modality metadata); `multimodal_retrieve` (per-modality top-k with filter= for diversity); `build_context_and_synthesise` (text/table/image sections); Cell 4: Q3 revenue query (table + chart); Cell 5: parsed table rows + modality score comparison + vision API call code pattern + text-only baseline; Cell 6: capital adequacy (table-heavy) + NPL trend (chart-heavy) + modality routing comparison table
- Validation: 53/53 checks passed; all 4 files present; all 6 code cells parse cleanly
- Status: 25/26 modules complete. Specialized: 2/3. One module remaining: 26_temporal_rag.

### Session 27 — 2026-03-28
- Completed module 24_graph_rag — all phases (A/B/C/D):
  - SKILL.md: Edge et al. Microsoft Research 2024 arXiv:2404.16130; 6-component architecture (entity extractor, graph builder, graph traversal, vector retriever, context merger, LLM synthesiser); NetworkX DiGraph with deduplicating edge merge and provenance (source_docs per edge); BFS up to MAX_HOPS=2, MAX_GRAPH_NODES=20; fintech use cases (counterparty network risk, regulatory obligation mapping, financial statement consolidation hierarchy, derivatives eligibility network); relational quality ★★★★★ vs construction cost ★☆☆☆☆ vs complexity ★★★★★; 6 pitfalls (extraction quality, entity disambiguation, schema as product decision, graph staleness invalidation, over-traversal cap, synthesis prompt requiring graph citation); relates 23 Multi-Hop RAG + 12 RAPTOR + 22 Agentic RAG
  - slides.md: "Knowledge Graphs Meet Vector Search"; counterparty exposure problem (Delta Fund CDS → Sigma Corp repo → Gamma Holdings consolidation); 5-row use case table distinguishing graph-only vs vector-only steps; two parallel retrieval paths diagram; construction cost ★☆☆☆☆ prominent; use/avoid conditions
  - README.md: 8-10 min; entity triple printout as mandatory demo anchor; 5 Q&As (networkx vs Neo4j, entity disambiguation levels, construction cost with async tip, Edge et al. community summaries, incremental re-extraction strategy); demo contrast "vector-only answers about policies; graph-augmented answers about networks"; transition "Graph RAG handles entities -- Multimodal handles images" → Module 25; 5 delivery anti-patterns
  - demo.ipynb: 12 cells; 8 synthetic financial news docs (Lehman bankruptcy, AIG CDS, Basel III, Barclays acquisition, Goldman TARP, Dodd-Frank); `extract_entities_and_triples` (Haiku, JSON triples with predicate vocabulary); `normalise` (legal suffix stripping for deduplication); `build_graph` (deduplicating edge merger with source_docs provenance); `traverse_graph` (bidirectional BFS, both in/out edges); `detect_communities` (weakly connected components); `build_vector_index` (Chroma, title prepended); `extract_query_entities` (Haiku); `graph_rag_retrieve` (hybrid, graph summary first); Cell 4: Lehman network query; Cell 5: degree table + BFS hop layers + predicate distribution + vector-only baseline; Cell 6: AIG counterparty exposure with 5-section RISK_SYSTEM + "Why Graph RAG is essential" section
- Validation: 58/58 checks passed; all 4 files present; all 6 code cells parse cleanly
- Status: 25/26 modules complete. Specialized: 1/3. One module remaining: 25_multimodal_rag.

### Session 26 — 2026-03-28
- Completed module 18_ircot — all phases (A/B/C/D):
  - SKILL.md: Trivedi et al. ACL 2023 arXiv:2212.10509; 5-component architecture (CoT step generator, retrieval trigger detector, retrieval query formulator, context manager, loop controller); Haiku for steps / Sonnet for synthesis; MAX_STEPS=8 hard ceiling; fintech use cases (multi-step credit risk assessment, suitability assessment, Basel III sequential compliance, OTC derivatives eligibility); reasoning transparency ★★★★★ as key differentiator; 6 pitfalls (over-retrieval, poor query formulation, reasoning drift, infinite loops, context window overflow, cost opacity); relates 08 FLARE + 23 Multi-Hop RAG + 22 Agentic RAG
  - slides.md: "Reason, Then Retrieve, Then Reason Again"; 4-step suitability query showing why one-shot fails; ASCII loop diagram with Continue/Retrieve/Done outcomes; loan compliance table (4 steps, 3 retrievals); tradeoffs table with latency/cost ★★☆☆☆; use/avoid conditions
  - README.md: 7-8 min; contrast with Module 03 as demo anchor ("retrieve before knowing what you need" vs "reasoning tells you what's missing"); 5 Q&As (trigger decision, MAX_STEPS, vs FLARE, vs Multi-Hop, misfire modes); transition "IRCoT reasons linearly -- Graph RAG maps relationships" → Module 24; 3 delivery anti-patterns
  - demo.ipynb: 12 cells; `ReasoningStep` dataclass (step_num, text, action, search_query, chunks_retrieved); `generate_reasoning_step` (Haiku, one CoT sentence); `detect_and_formulate` (3-path: ANSWER: prefix fast → 12-phrase linguistic signal list fast → LLM slow); `ircot_retrieve` (dense cosine, plain dicts); `ircot_loop` (seen_chunk_texts dedup, MAX_CTX_CHUNKS=6 eviction, hit_max_steps flag, total_llm_calls + total_ret_calls tracking); `synthesize_answer` (Sonnet on full trace + context); Cell 4 query: $500K loan default -- Basel III capital implications + recovery procedures; Cell 5 step breakdown table + context accumulation timeline + single-shot RAG baseline comparison; Cell 6 HELOC eligibility (640 FICO / $75K income / $2.5K monthly debt / $250K requested) with APPROVED/DECLINED determination
- Validation: 72/72 checks passed; all 4 files present; all 6 code cells parse cleanly
- Status: 24/26 modules complete. Reasoning & Self-Correction: 5/5 (complete). Tier 3: 4/7.

### Session 25 — 2026-03-28
- Completed module 15_long_context_rag -- all phases (A/B/C/D):
  - SKILL.md: Liu et al. ACL 2024 arXiv:2307.03172 (lost in the middle) as primary source; Claude 200K / GPT-4 Turbo 128K / Gemini 1M as enabling context; no-retrieval architecture (query + full doc → LLM → answer); `estimate_tokens` + context assembler + long-context LLM components; full 10-K analysis / complete ISDA contract review / multi-document deal analysis fintech use cases; quality ★★★★★ + simplicity ★★★★★ vs cost ★☆☆☆☆ + scalability ★☆☆☆☆; pitfalls (lost in the middle quantified, cost scales per query not per index, token headroom mandatory, not a corpus-scale solution); relates RAPTOR + Contextual RAG + Multimodal RAG
  - slides.md: "Skip Retrieval, Use Full Context"; three concrete fintech chunking failures (10-K cross-ref, ISDA Schedule override, Basel III definitional dependency); context window table (Claude 200K, GPT-4 Turbo 128K, Gemini 1M); Mermaid with no retriever node; cost made concrete (~$1.50/10-K); use/avoid table
  - README.md: 5-6 min; token count as demo anchor; 5 Q&As (when better than RAG, lost-in-middle, Gemini 1M caveats, whether replaces other patterns, what when doc too long); transition "Long Context loads everything -- IRCoT reasons step by step"; 3 delivery anti-patterns
  - demo.ipynb: 12 cells; anthropic + python-dotenv only (no chromadb/rank-bm25/langchain-openai); `estimate_tokens` (4 chars/token); `assemble_context` (XML tags, query appended last for recency); `format_cost` (USD estimate); `long_context_query` (assert budget, one API call, retrieval_calls=0 explicit); Cell 4 cross-doc Basel III + lending policy query; Cell 5 token budget bar + cost comparison table (long-context vs 5-chunk retrieval with multiplier) + lost-in-the-middle position experiment (Order A vs Order B); Cell 6 three-doc deal analysis (Basel III + ISDA + earnings) with attribution signal detection and "when breaks down" section
- Validation: 58/63 checks passed; 5 failures confirmed as false positives (chromadb/rank-bm25/langchain-openai appear in comments only; MODEL constant uses aligned spacing); all substantive checks pass; all 4 files present
- Status: 23/26 modules complete. Tier 3: 3/7. Indexing & Chunking: 6/6 (complete).

### Session 24 — 2026-03-28
- Completed module 09_ensemble_rag — all phases (A/B/C/D):
  - SKILL.md: LangChain EnsembleRetriever docs 2023–2024 + Manning et al. IR textbook; 3-retriever parallel architecture (BM25, dense, keyword); weighted RRF combiner with `[0.4, 0.4, 0.2]` default; multi-regulator compliance fintech use cases (FINRA/SEC/CFTC vocabulary diversity); quality ★★★★★, latency ★★☆☆☆, cost ★★☆☆☆, complexity ★★★★☆; pitfalls (RRF k tuning, index staleness skew, document ID deduplication, diminishing returns after 3 retrievers, answer-level ensemble warning); relates 03 Hybrid + 04 RAG Fusion + 21 Modular RAG
  - slides.md: "Majority Vote for Quality"; regulatory vocabulary mismatch problem; 3-retriever → RRF combiner → LLM ASCII + Mermaid diagram; key insight "consensus beats dominance"; margin call FINRA/SEC/CFTC fintech table; tradeoffs; explicit "don't use it when" guidance
  - README.md: 6–7 min; naive → hybrid → ensemble side-by-side demo script with the specific "chunk ranked 11th by BM25 and 9th by dense surfaced at #4" moment; 5 Q&As (strategy count, weight tuning, RRF vs score normalization, answer-level ensemble, relationship to Hybrid RAG); transition to Module 15 (Long Context RAG)
  - demo.ipynb: 12 cells; all 4 sample docs as shared flat corpus; `naive_retrieve` (pure cosine); `hybrid_retrieve` (BM25 + dense 2-way RRF); `hyde_retrieve` (Haiku hypothesis → embed → search); `weighted_rrf_ensemble` (3-way weighted RRF, `found_in` provenance tracking); `ensemble_retrieve` (ThreadPoolExecutor max_workers=3, parallel execution); ENSEMBLE_WEIGHTS=[0.35, 0.40, 0.25]; Cell 4 capital requirements query with consensus badges (***/**/*); Cell 5 3 individual answers in parallel + coverage matrix (Y/- per strategy) + ensemble comparison; Cell 6 compliance briefing query top_k=7, multi-source attribution, verification summary
- Validation: demo.ipynb 65/65 checks passed; all 4 files present
- Status: 22/26 modules complete. Tier 1: 10/10. Tier 2: 9/9. Retrieval Enhancement: 7/7 (complete). Tier 3: 2/7.

### Session 23 — 2026-03-27
- Completed module 08_flare — all phases (A/B/C/D):
  - SKILL.md: Jiang et al. EMNLP 2023 arXiv:2305.06983; sentence-by-sentence generation with uncertainty detection; log-prob caveat (Anthropic API does not expose token probabilities — hedge word proxy used); `SentenceResult` dataclass; `detect_hedges`/`generate_next_sentence`/`flare_generate` components; output quality ★★★★☆, latency ★☆☆☆☆, cost ★★☆☆☆, complexity ★★★★★; pitfalls (calibration-dependent uncertainty, excessive retrieval on weak domains, sentence boundary fragility, context accumulation overflow, retrieval query quality); relates 16 Self-RAG + 18 IRCoT + 22 Agentic
  - slides.md: "Retrieve Only When Uncertain"; upfront retrieval waste problem table; ASCII confident/uncertain/grounded sequence; Mermaid loop diagram; 4-row compliance report table; key insight callout; tradeoffs; transition to Module 09 (143 prose words ✓)
  - README.md: 6–7 min; framing script; simplified demo (prompt-based, log-probs unavailable); Q&As (uncertainty detection with 3 approaches + hedging heuristic, when to use vs standard RAG, production-readiness + lighter version); transition "sequential and conditional vs. parallel and additive" (400 words ✓)
  - demo.ipynb: 12 cells; `HEDGE_WORDS` list (12 words); `SentenceResult` dataclass; `detect_hedges` (whole-word regex); `generate_next_sentence` (Haiku, max_tokens=120, first-sentence regex extraction, grounded regeneration with "do not hedge" instruction); `flare_generate` loop (tentative → detect → retrieve if hedged → `injected_context[:800]` bounded window → regenerate); returns `total_sentences` + `retrieval_count`; Cell 4 Basel III long-form explanation; Cell 5 per-sentence detail + figure diff (numbers added by retrieval) + summary table; Cell 6 compliance report + retrieval efficiency comparison
- Fix applied during Phase D: `flare_generate` return dict was missing `total_sentences` key — added before validation
- Validation: demo.ipynb 20/20 checks; all 4 files present
- Status: 21/26 modules complete. Tier 1: 10/10. Tier 2: 9/9. Tier 3: 1/7.

### Session 22 — 2026-03-28
- Completed module 23_multi_hop_rag — all phases (A/B/C/D):
  - SKILL.md: Khattab et al. DSP 2022 arXiv:2212.14024 (primary) + Yang et al. HotpotQA EMNLP 2018 (benchmark); bridge entity extraction per hop; `HopResult` path tracker; `MAX_HOPS=3` hard ceiling; entity extractor/hop controller/path tracker/synthesiser components; KYC UBO + counterparty exposure + regulatory cross-reference + supply chain fintech use cases; answer quality ★★★★☆, latency ★★☆☆☆, complexity ★★★★☆, robustness ★★★☆☆; infinite loop / bridge accuracy / entity naming / context overflow pitfalls; relates 24 Graph RAG + 22 Agentic + 05 Multi-Query
  - slides.md: "Connect the Dots Across Documents"; 3-row problem table; 3-hop ASCII UBO chain; Mermaid loop diagram; KYC 4-row hop table; key insight callout; transition "signs vs map" (129 prose words ✓)
  - README.md: 8–10 min; framing script; 5-step demo (TechCorp → Nexus Holdings → Viktor Sorin → OFAC); Q&As (2-4 hops + MAX_HOPS, extraction failure fallback, agent vs multi-hop); transition (400 words ✓)
  - demo.ipynb: 12 cells; `ExtractionResult` + `HopResult` dataclasses; `extract_bridge_entity` (Haiku, JSON with bridge_entity/terminal/reasoning, regex + fallback); `synthesise_answer` (Sonnet, full chain); `multi_hop_rag` loop (hard ceiling, terminal break, bridge becomes next query); 5-doc synthetic corpus (TechCorp → Nexus Holdings → Viktor Sorin → OFAC SDN → BVI obligations → screening policy); Cell 4 sanctions connectivity query; Cell 5 chain visualisation + latency table + standard RAG baseline; Cell 6 two KYC queries
- Validation: demo.ipynb 44/44 checks; all 4 files present
- Status: 20/26 modules complete. Tier 1: 10/10 (complete). Tier 2: 9/9 (complete). Architectural: 3/3 (complete).

### Session 21 — 2026-03-28
- Completed module 21_modular_rag — all phases (A/B/C/D):
  - SKILL.md: Gao et al. 2024 arXiv:2407.21059; `RetrieverModule`/`RerankerModule`/`GeneratorModule` as `typing.Protocol`; `RetrievedChunk` TypedDict + `PipelineResult` dataclass as shared contracts; `RAGPipeline` dependency injection; A/B testing + multi-team ownership + compliance substitutability use cases; flexibility ★★★★★, maintainability ★★★★★, initial complexity ★★★★☆; interface design / protocol drift / cross-boundary debugging pitfalls; relates 20 Adaptive + 22 Agentic + 03 Hybrid + 17 Corrective
  - slides.md: "Composable Architecture"; monolith vs modular problem table; ASCII pipeline with swap arrows; Mermaid; Basel III 4-config benchmark table (Config D selected); key insight callout; transition to Module 22 (84 prose words ✓)
  - README.md: 7–8 min; framing script; 5-step swap demo; Q&As (overkill, interface design, LCEL); transition "Modular fixes structure, Agentic removes it" (400 words ✓)
  - demo.ipynb: 12 cells; `RetrievedChunk` TypedDict + `PipelineResult` dataclass; `@runtime_checkable` Protocol interfaces; `BM25Retriever` (BM25Okapi, normalised scores) + `VectorRetriever` (Chroma, L2→similarity) + `LLMReranker` (single Haiku call, JSON rank list) + `ClaudeGenerator` (Sonnet, source citations); `RAGPipeline` dataclass; Cell 4 BM25 pipeline Basel III query; Cell 5 one-line swap to VectorRetriever + side-by-side comparison (chunk overlap, source distribution, latency table); Cell 6 three domain pipelines (regulatory/contract/earnings) with domain-specific module selection
- Validation: demo.ipynb 44/44 checks passed; all 4 files present
- Status: 19/26 modules complete. Tier 1: 10/10. Tier 2: 9/9 (COMPLETE). Architectural: 2/3.

### Session 20 — 2026-03-27
- Completed module 19_speculative_rag — Phase D (validation + progress update):
  - demo.ipynb validated: 6 markdown + 6 code cells ✓; API key safety (`os.environ.get` + `assert`) ✓; `DRAFT_MODEL = 'claude-haiku-4-5-20251001'`, `VERIFY_MODEL = 'claude-sonnet-4-6'` ✓; `ALIGNMENT_THRESHOLD = 3` ✓; all four core functions with type hints (`speculative_answer`, `retrieve_docs`, `verify_alignment`, `speculative_rag`) ✓; Cell 4 two queries (common + novel) ✓; Cell 5 timing breakdown + parallel estimate + draft-vs-final diff ✓; Cell 6 FAQ system + aggregate stats + business case ✓; no `# TODO` stubs ✓
- Validation: demo.ipynb structure/safety/core functions — all checks pass
- Status: 18/26 modules complete. Tier 1: 10/10. Tier 2: 8/9. Reasoning & Self-Correction: 5/5 (complete).

### Session 19 — 2026-03-27
- Completed module 14_multi_vector_rag — all phases (A/B/C/D):
  - SKILL.md: LangChain MultiVectorRetriever 2023; multiple representations per chunk (summary + questions + keywords); two-layer architecture (Chroma vectorstore for reps + InMemoryStore for originals); doc_id link; 9-step walkthrough; Basel III + earnings report + product brochure + lending policy fintech use cases; quality ★★★★☆, indexing cost/storage ★★☆☆☆, complexity ★★★★☆; storage multiplier pitfall; rep quality ceiling; de-duplication semantics; relates 13/12/06
  - slides.md: "Multiple Representations, One Chunk"; 3-query-style problem table; ASCII pipeline + Mermaid; Basel III 3-way query fintech table; key insight callout; tradeoffs; transition to Module 19 (152 prose words ✓)
  - README.md: 7–8 min; framing script; 5-step demo; Q&As (2–4 reps, storage tradeoff, vs Contextual, vs HyDE); transition (400 words ✓)
  - demo.ipynb: 12 cells; generate_summary/generate_questions/extract_keywords (Haiku); build_multi_vector_index (doc_ids, 3 reps per chunk, Chroma + InMemoryStore + MultiVectorRetriever); multi_vector_rag (direct vectorstore search for rep inspection + retriever.invoke for originals); 3 query styles Cell 4; storage breakdown + per-query rep match table Cell 5; 3 analyst personas Cell 6
- Validation: SKILL.md 26/26 | slides.md 15/15 | demo.ipynb 20/20
- Status: 17/26 modules complete. Tier 1: 10/10. Tier 2: 7/9. Indexing & Chunking: 5/6.

### Session 18 — 2026-03-27
- Completed module 12_raptor — Phase C (demo.ipynb) and Phase D (validation):
  - demo.ipynb: 12 cells; chunk_document (RecursiveCharacterTextSplitter 400/60); optimal_k (KMeans, silhouette score, MAX_K=6); summarize_cluster (Haiku, level-aware instruction); build_raptor_tree (recursive: embed → cluster → summarise → recurse, stops at MIN_NODES=3 with root collapse); build_unified_index (Chroma, all nodes tagged with level+node_id metadata); raptor_rag (collapsed-tree retrieval, context ordered highest-level first); earnings_report.txt Cell 4 "What is the overall business outlook?"; Cell 5 tree structure visualisation + level match comparison (thematic vs specific); Cell 6 inline prospectus + "What are the main risk themes?" thematic query
  - Phase B also completed this session: slides.md (193 prose words ✓) + README.md (399 words ✓)
- Validation: demo.ipynb 12/12 checks
- Status: 16/26 modules complete. Tier 1: 10/10. Tier 2: 6/9. Indexing & Chunking: 4/6.

### Session 17 — 2026-03-27
- Completed module 11_sentence_window — all phases (A/B/C/D):
  - SKILL.md: LlamaIndex SentenceWindowNodeParser Jerry Liu 2023; decouples embedding unit (sentence) from generation unit (window); MetadataReplacementPostProcessor mechanics; Mermaid with sentence parse → index → matched sentence → window expansion → generate; term sheet/ISDA/earnings/KYC fintech use cases; precision ★★★★★, answer quality ★★★★☆, complexity ★★★☆☆; pitfalls (window boundary cuts, segmentation errors, postprocessor chain ordering, index size); relates Parent Document + RAPTOR + Multi-Vector
  - slides.md: "Precision Retrieval, Contextual Generation"; chunk-averaging problem table; ASCII pipeline + Mermaid; key insight callout; ISDA early termination fintech table; tradeoffs + window tuning note; transition to RAPTOR horizontal vs vertical (165 prose words ✓)
  - README.md: 6–7 min; framing script; 5-step live demo (ISDA excerpt → matched sentence → window → baseline comparison → answer); Q&As (±2–5 sizing, vs Parent Document, segmentation); transition (398 words ✓)
  - demo.ipynb: 12 cells; LlamaIndex + OpenAI embeddings + Anthropic SDK; build_sentence_index() (SentenceWindowNodeParser.from_defaults window_size=3, VectorStoreIndex, MetadataReplacementPostProcessor); sentence_window_rag(); margin call query Cell 4; per-node sentence vs window expansion + citation trail + LangChain baseline comparison Cell 5; early termination clause query with expansion metrics Cell 6
- Validation: SKILL.md 22/22 | slides.md 13/13 | README.md 13/13 | demo.ipynb 36/36
- Status: 15/26 modules complete. Tier 1: 10/10. Tier 2: 5/9. Indexing & Chunking: 3/6.

### Session 16 — 2026-03-27
- Completed module 07_step_back_rag — all phases (A/B/C/D):
  - SKILL.md: Zheng et al. ICLR 2024 arXiv:2310.06117; dual parallel retrieval (abstract k=5 + specific k=3); labelled combined context; abstraction generator + abstract retriever + specific retriever + combiner + generator components; barrier option and CRR Tier 2 fintech use cases; quality/answer ★★★★☆, latency ★★★☆☆, complexity ★★☆☆☆; pitfalls (too vague, lose specifics, overhead on simple queries, weak model); relates HyDE+Multi-Query+Adaptive RAG
  - slides.md: "Abstract Then Answer"; barrier option specificity problem; ASCII dual-path pipeline + Mermaid; key insight callout; Tier 2 CRR compliance table (step-back vs original paths); tradeoffs; transition to chunking (196 prose words ✓)
  - README.md: 5–6 min; framing script (vs Multi-Query: down vs up); 5-step live demo (Basel III Pillar 1); Q&As (when fails, how generated, combining with Multi-Query); transition (399 words ✓)
  - demo.ipynb: 12 cells; generate_step_back_question() (Haiku, one-level-up prompt); step_back_rag() (abstract → dual retrieve → dedup → labelled context → generate); CET1/G-SIB query Cell 4; overlap analysis + baseline comparison Cell 5; capital conservation buffer fintech Cell 6
- Validation: SKILL.md 21/21 | slides.md 10/10 | README.md 12/12 | demo.ipynb 29/29
- Status: 14/26 modules complete. Tier 1: 10/10. Tier 2: 4/9.

### Session 15 — 2026-03-27
- Completed module 05_multi_query_rag — all phases (A/B/C/D):
  - SKILL.md: LangChain MultiQueryRetriever source; centroid problem framing; union+dedup (no RRF); Mermaid; 4 fintech use cases (cross-framework compliance, cross-product comparison, multi-timeframe, portfolio risk); quality/answer ★★★★☆, latency ★★☆☆☆, cost ★★★☆☆, complexity ★★★☆☆; pitfalls (similar perspectives, lossy union, context overflow, token cost); relates 04+23+02
  - slides.md: "Decompose Complex Questions"; centroid problem; ASCII pipeline + Mermaid; key insight callout; Basel III + FATF compliance fintech example; tradeoffs; transition to 07 Step-Back (172 prose words ✓)
  - README.md: 5–6 min; framing script; 5-step live demo (original→sub-questions→per-sub retrieval→union→answer); Q&As (vs RAG Fusion, 3–5 sub-queries, diversity fix via prompt); transition to 07 (399 words ✓)
  - demo.ipynb: 12 cells; decompose_query()/retrieve_for_subquery()/multi_query_rag(); basel_iii + fintech_policy corpus; capital+lending query Cell 4; incremental unique contribution table + baseline comparison Cell 5; Basel III + AML multi-framework compliance Cell 6
- Validation: SKILL.md 16/16 | slides.md 10/10 | README.md 13/13 | demo.ipynb 31/31
- Status: 13/26 modules complete. Tier 1: 10/10. Tier 2: 3/9.

### Session 14 — 2026-03-27
- Revised module 04_rag_fusion — Phase B + C rewritten to new spec:
  - slides.md: "Query Perspective Diversity"; synonym mismatch table; `![Architecture](architecture.png)` reference; key insight callout; market sentiment fintech example (EM bonds, 3 variants); tradeoffs table; transition to 05 (136 prose words ✓)
  - README.md: 6–7 min (Tier 2); framing script; live demo 4-step walkthrough (original→variants→per-variant retrieval→fused vs baseline); Q&As (3–5 LLM-generated variants, why better than one query via semantic neighbourhood expansion + RRF); transition (399 words ✓)
  - demo.ipynb: rewritten to use earnings_report.txt; generate_query_variants()/rrf_fuse()/rag_fusion() pipeline; Cell 4 query "What were the key financial highlights in Q3?"; Cell 5 RRF score distribution + per-variant provenance + baseline comparison + timing breakdown; Cell 6 "What are the market risks mentioned?" with coverage gain count
- Validation: SKILL.md 18/18 | slides.md 10/10 | README.md 13/13 | demo.ipynb 35/35 | API safety 4/4
- Status: 12/26 modules complete. Tier 1 complete (10/10). Tier 2: 2/9.

### Session 13 — 2026-03-27
- Completed module 04_rag_fusion — all phases (A/B/C/D):
  - SKILL.md: dual source (Rackauckas TDS 2023 + Shi et al. arXiv:2402.03367); RRF formula score=Σ1/(60+rank_i); 5 components (variant generator/per-variant retriever/RRF merger/deduplicator/generator); AML synonym coverage + market research + multi-jurisdiction fintech use cases; quality/answer quality ★★★★☆, latency ★★☆☆☆, complexity ★★☆☆☆; query drift + duplicate inflation + N×retrieval pitfalls; relates 05+03+02
  - slides.md: "More Angles, Better Coverage"; synonym mismatch table (SAR/unusual activity/AML disclosure); RRF formula; Mermaid; AML 5-variant table; tradeoffs; transition to 05 (190 prose words ✓)
  - README.md: 5–6 min (Tier 2); framing script; optional live demo Cell 4; Q&As (3–5 variants, RRF noise suppression, vs Multi-Query); transition (398 words ✓)
  - demo.ipynb: 12 cells; generate_variants (Haiku); retrieve_for_variant (Chroma); rrf_fuse (score=1/(k+rank+1)); rag_fusion pipeline (generate→retrieve×N→fuse→dedup→generate); AML reporting query Cell 4; per-variant preview + RRF ranked table + baseline comparison Cell 5; credit risk market research Cell 6
- Validation: 30/31 (1 false positive — ANTHROPIC_API_KEY in assert message, not hardcoded)
- Status: 12/26 modules complete. Tier 1 complete (10/10). Tier 2: 2/9.

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
