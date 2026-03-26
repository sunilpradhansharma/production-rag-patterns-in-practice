# RAG Patterns Workshop — Master Build Plan

> **Mode: PLAN.** Read this fully before executing a single command.
> This document tells Claude Code (or a human developer) exactly how to build the entire repository.
> Each phase ends with a PAUSE — confirm before proceeding.

---

## Section 1 — What We Are Building

A **hands-on workshop repository** titled **`rag-patterns-in-practice`** that serves as both:

1. **A self-contained learning lab** — clone → install → run any pattern's notebook
2. **A workshop teaching artifact** — instructor walks through a curated subset in 90 minutes

### The three foundational documents

| Document | Purpose | Must exist before any code |
|----------|---------|---------------------------|
| `CLAUDE.md` | Project brain — structure, standards, build process | Yes |
| `README.md` | Public face — patterns, diagrams, learning paths, quick start | Yes |
| `rag_patterns.json` | 26-pattern metadata registry (status, sources, eval criteria) | Yes |

### Scope boundaries

| In scope | Out of scope |
|----------|-------------|
| 26 RAG patterns with runnable notebooks | Production deployment infrastructure |
| Architecture diagrams for every pattern | Forcing software design patterns onto the code |
| Synthetic fintech sample data (text files) | Real financial documents (licensing/PII) |
| Local vector DB (Chroma) for all demos | Cloud vector DB setup (Pinecone, Weaviate) |
| CI that validates notebooks execute | Full RAGAS evaluation pipeline (stretch goal) |
| 90-minute curated workshop path | Full-day curriculum design |

---

## Section 2 — Workshop Goals

### Primary goals

1. **Teach pattern thinking** — participants can name, explain, and compare the 26 RAG patterns
2. **Build intuition for tradeoffs** — participants know when to use each pattern and what it costs
3. **Enable immediate application** — participants leave with working code they can adapt
4. **Provide a reference** — the repository serves as a lasting resource after the workshop

### What makes a good RAG pattern module

- Clear explanation of the problem the pattern solves (not just what it does)
- Architecture diagram that someone can understand in 30 seconds
- A working notebook they can run and modify
- At least one fintech example with realistic queries
- Honest tradeoff analysis — latency, cost, complexity, quality

### Pattern teaching lens

For every pattern, explain through:
1. **What problem does it solve?** — what fails in a simpler approach
2. **How does it work?** — the flow, step by step
3. **When should you use it?** — 3–5 specific conditions
4. **What does it cost?** — latency, complexity, index size, API calls
5. **How does it compare?** — to adjacent patterns in the same category

---

## Section 3 — Pattern Taxonomy

### Categories

| Category | Patterns | Focus |
|----------|---------|-------|
| Foundational | 01–02 | Baseline and first-level improvements |
| Retrieval Enhancement | 03–09 | Better results from the retrieve step |
| Indexing & Chunking | 10–15 | Better document representation before retrieval |
| Reasoning & Self-Correction | 16–20 | Patterns that reflect, verify, and adapt |
| Architectural | 21–23 | How to structure the full pipeline |
| Specialized | 24–26 | Domain-specific or modality-specific |

### Priority tiers

**Tier 1 — Core workshop path (10 patterns, demo-ready)**

| # | Pattern | Workshop role |
|---|---------|--------------|
| 01 | Naive RAG | Baseline — the "before" state |
| 02 | Advanced RAG | Natural first upgrade |
| 03 | Hybrid RAG | Most impactful retrieval improvement |
| 10 | Parent Document | Best indexing improvement for long docs |
| 13 | Contextual RAG | Indexing breakthrough — high interest |
| 06 | HyDE | Elegant query-side trick |
| 16 | Self-RAG | Introduces reflection paradigm |
| 17 | Corrective RAG | Most practical self-correction pattern |
| 20 | Adaptive RAG | Ties everything together |
| 22 | Agentic RAG | Capstone — the most powerful pattern |

**Tier 2 — Extended reference:** `04, 05, 07, 11, 12, 14, 19, 21, 23`

**Tier 3 — Specialized:** `08, 09, 15, 18, 24, 25, 26`

---

## Section 4 — Module Standards

### SKILL.md structure

Every `modules/<pattern>/SKILL.md` must contain:

```markdown
# <Pattern Name>

## What it is
## Source
## When to use it
## When NOT to use it
## Architecture (Mermaid diagram)
## Key components (table)
## Step-by-step
## Fintech use cases
## Tradeoffs (rated table)
## Common pitfalls
## Related patterns
```

Full template in CLAUDE.md Section 4.

### slides.md structure

- Title slide with pattern name and one-line description
- Architecture diagram (same as SKILL.md)
- Key insight (what makes this pattern clever)
- Fintech use case (one concrete example)
- Tradeoff summary (3 rows max)
- Transition to next pattern

Target: ≤ 300 words total.

### README.md (speaker notes) structure

- Timing: how many minutes to spend on this pattern
- Key points to hit in the demo
- Anticipated audience questions + answers
- Common confusion points
- Transition framing to the next module

Target: 200–400 words.

---

## Section 5 — Notebook Standards

### The 6-cell standard

| Cell | Purpose | Rules |
|------|---------|-------|
| 1 — Setup | pip installs, env, imports | Must be self-contained; no global state from prior cells |
| 2 — Data | Load fintech sample data | Use `shared/sample_data/`; explain why this document was chosen |
| 3 — Core | Pattern implementation | < 60 lines; comment every non-obvious line |
| 4 — Run | End-to-end execution | Print retrieved chunks + scores + generated answer |
| 5 — Inspect | Observability | Timing, score distributions, chunk boundaries, reasoning traces |
| 6 — Fintech | Domain application | Compliance/risk/fraud scenario with citation output |

Each code cell is preceded by a markdown cell that states:
- What this cell demonstrates
- Expected output

### Notebook quality checklist

- [ ] Cell 1 is completely self-contained (re-runnable from scratch)
- [ ] No hidden state or shared mutable objects across cells
- [ ] No hardcoded API keys
- [ ] Real sample data from `shared/sample_data/`
- [ ] Retrieved chunks are printed with scores, not just the final answer
- [ ] Timing is measured and reported

---

## Section 6 — README Standards

The README is the repository's public face. Every reader lands here first.

### Required sections (in order)

1. **Title + badges** — short subtitle, Python version, license, pattern count
2. **What this workshop is** — 2–3 sentences on the value proposition
3. **Who it's for** — table of 4 audience profiles
4. **When to use RAG vs Agentic AI** — quadrant diagram + decision table
5. **Learning paths** — beginner / intermediate / advanced
6. **Workshop flow** — 90-minute timing table
7. **Pattern selection guide** — decision tree prose
8. **All 26 patterns** — organized by category, one section per pattern
9. **Production design layers** — summary table
10. **Quick start** — 5-command setup
11. **Repository structure** — annotated tree
12. **Contributing** — link to CONTRIBUTING.md
13. **References** — source papers

### Per-pattern section format (in the patterns chapter)

```markdown
#### NN — Pattern Name

Short description: what problem it solves and how (2 sentences).

[Mermaid diagram]

**When to use:** ...

**Tradeoffs:** ...

[→ Module](modules/NN_pattern_name/)
```

### Architecture diagram requirements

- One Mermaid `flowchart` per pattern
- Consistent node color scheme (from RAG_WORKSHOP_VISUALS_ADDENDUM.md)
- Maximum 8–10 nodes — keep it readable
- Edge labels explain what flows between nodes
- Input nodes: blue (`#E6F1FB`)
- Processing nodes: purple (`#EEEDFE`)
- Decision nodes: orange (`#FAEEDA`)
- Output nodes: green (`#EAF3DE`)

---

## Section 7 — Diagram Standards

All diagrams in this repository use GitHub-native Mermaid. See `RAG_WORKSHOP_VISUALS_ADDENDUM.md` for the full style guide and per-pattern diagram catalog.

### Core rules

1. Use `flowchart` type (not `graph` — same syntax, clearer intent)
2. Apply the standard color scheme consistently across all diagrams
3. Keep diagrams to 8–10 nodes maximum
4. Use edge labels to name what passes between steps
5. One diagram per pattern — do not combine patterns

### Where diagrams go

| Diagram | Target file |
|---------|------------|
| RAG vs Agentic quadrant | `README.md` |
| Per-pattern architecture (all 26) | `README.md` AND `modules/XX/SKILL.md` |
| Design layer flowcharts (layers 1–8) | `docs/architecture/design_layers.md` |

**Change from original spec:** Per-pattern diagrams now appear in BOTH the README (for discovery) and SKILL.md (for deep reference). The README is the primary learning surface.

---

## Section 8 — Build Execution Plan

### Phase 1 — Scaffold

**Actions:**
1. Create the complete directory tree per CLAUDE.md Section 3
2. Create `.gitignore`: `.env`, `__pycache__`, `*.pyc`, `.ipynb_checkpoints`, `*.egg-info`, `dist/`, `build/`, `.DS_Store`, `chroma_db/`, `*.faiss`, `.venv/`
3. Create `pyproject.toml` with ruff + mypy config
4. Create `requirements.txt` with pinned versions
5. Create `requirements-dev.txt`: `pytest`, `nbconvert`, `ruff`, `mypy`, `interrogate`
6. Create `Makefile` with targets: `install`, `test`, `eval`, `lint`, `clean`
7. Create `.env.example` with all required/optional keys documented
8. Initial git commit: `chore: scaffold repository structure`

**PAUSE — report what was created, wait for confirmation.**

### Phase 2 — Foundation documents

**Actions:**
1. Verify `README.md` is current (26 patterns, all diagrams, correct structure)
2. Verify `CLAUDE.md` is current
3. Verify `rag_patterns.json` is current
4. Verify `progress.md` is current
5. Write `docs/architecture/rag_vs_agentic.md` — full standalone doc
6. Write `docs/architecture/design_layers.md` — all 8 layers with diagrams
7. Write `docs/architecture/pattern_selection.md` — decision flowchart
8. Write `modules/README.md` — module index with timing guide
9. Write `shared/sample_data/README.md` — describes each sample file
10. Write synthetic sample data files in `shared/sample_data/`

**PAUSE — report, wait for confirmation.**

### Phase 3 — Shared library

Write every file in `shared/` per the coding standards. The shared library provides reusable utilities — retrievers, pipeline components, type definitions. Keep it practical: only add code that multiple modules genuinely share.

| Order | File | Purpose |
|-------|------|---------|
| 1 | `types.py` | `RetrievedChunk`, `PipelineConfig`, `EvalResult` dataclasses |
| 2 | `config.py` | Pydantic Settings model for env vars |
| 3 | `base.py` | `BaseRetriever` Protocol, `BaseRAGPipeline` |
| 4 | `strategies.py` | `RetrievalStrategy`, `RerankStrategy` interfaces + implementations |
| 5 | `factories.py` | `RetrieverFactory` |
| 6 | `builders.py` | `RAGPipelineBuilder` with fluent API |
| 7 | `decorators.py` | `CachedRetriever`, `RerankedRetriever`, `LoggedRetriever` |
| 8 | `proxy.py` | `SemanticCacheProxy` |
| 9 | `adapters.py` | `LlamaIndexRetrieverAdapter` |
| 10 | `observers.py` | `EvalObserver`, `LatencyObserver` |
| 11 | `visitors.py` | `PIIRedactor`, `MetadataEnricher` |
| 12 | `registry.py` | `get_embedding_model()` |
| 13 | `pipeline.py` | `RAGPipeline` |
| 14 | `utils.py` | Timing decorator, token counter, `chunk_text()` |

**PAUSE — report, wait for confirmation.**

### Phase 4 — Tier 1 modules (core workshop path)

For each of the 10 Tier 1 modules, execute the 4-phase build:
1. **Phase A** — Write SKILL.md
2. **Phase B** — Write slides.md + README.md
3. **Phase C** — Write demo.ipynb
4. **Phase D** — Validate + update progress.md

**Build order**: 01 → 02 → 03 → 10 → 13 → 06 → 16 → 17 → 20 → 22

**PAUSE after every 3 modules — report status, wait for confirmation.**

### Phase 5 — Tier 2 modules

Same process for the 9 Tier 2 modules: 04, 05, 07, 11, 12, 14, 19, 21, 23.

**PAUSE after every 3 modules.**

### Phase 6 — Tier 3 modules

Same process for the 7 Tier 3 modules: 08, 09, 15, 18, 24, 25, 26.

**PAUSE after every 3 modules.**

### Phase 7 — Finalization

1. Write `docs/workshop/run_of_show.md` — minute-by-minute 90-min timing
2. Write `docs/workshop/setup_guide.md` — attendee environment setup
3. Write `docs/workshop/cheatsheet.md` — one-page pattern reference card
4. Write `CONTRIBUTING.md` — how to add a new pattern module
5. Write `.github/workflows/ci.yml` — run all notebooks on PR
6. Write `.github/workflows/eval.yml` — weekly eval pipeline
7. Final quality checks (see Section 9)
8. Final git commit: `feat: complete 26 RAG patterns workshop`

**PAUSE — final report, repo is ready.**

---

## Section 9 — Quality Checklist

Verify each of these before the final commit:

**Repository structure:**
- [ ] All 26 module directories exist with at minimum SKILL.md and slides.md
- [ ] `shared/` library has all 14 files with proper headers
- [ ] `docs/architecture/` has all 3 standalone docs
- [ ] `.env.example` documents all required and optional keys

**Code quality:**
- [ ] All Python files pass `ruff check` with zero errors
- [ ] All `.py` files in `shared/` have docstrings
- [ ] No API keys or credentials committed
- [ ] All imports in shared/ resolve correctly

**Notebooks:**
- [ ] Tier 1 (10) notebooks all have 6 cells in correct order
- [ ] Each notebook's Cell 1 is self-contained (installs + imports + env)
- [ ] No hardcoded API keys in any notebook

**Content:**
- [ ] README.md renders correctly (headers, tables, code blocks, Mermaid diagrams, links)
- [ ] All 26 patterns have Mermaid diagrams in README.md
- [ ] `progress.md` reflects accurate completion state
- [ ] Every SKILL.md has a valid source citation
- [ ] No GoF / Gang of Four references anywhere in the repository

**Workshop:**
- [ ] `docs/workshop/run_of_show.md` accounts for full 90 minutes
- [ ] Tier 1 module demos can run in sequence without restarts

---

## Section 10 — Assumptions and Constraints

### Assumptions
1. The builder has `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` set in their environment
2. Python 3.11+ is available
3. The target audience understands basic RAG concepts (what embeddings are, what a vector DB does)
4. Internet access is available during the build process
5. The workshop venue will have internet access for live API calls

### Constraints
1. **No real financial data.** All sample data must be synthetic. No PII, no licensed content.
2. **No cloud infrastructure dependencies.** Every demo must run on a laptop with local Chroma.
3. **API cost budget.** A full build run (all 26 notebooks) should cost < $5 USD in API calls.
4. **Notebook execution time.** Each notebook should complete in < 60 seconds on a modern laptop.
5. **Repository size.** Keep under 50MB total (no large binaries, no real PDFs).

### Decisions that need human input
1. **Exact dependency versions** — Pin after resolving on a clean venv.
2. **Workshop delivery date** — Affects which Tier 2/3 modules are worth building now vs later.
3. **License choice** — MIT is assumed but should be confirmed.
4. **Cohere/Tavily API keys** — If not available, Advanced RAG reranker and CRAG web fallback need alternative implementations.
5. **LlamaIndex vs LangChain default** — Use whichever framework fits the pattern best.

---

## Section 11 — Kickoff Prompt

Copy this into Claude Code after `cd rag-patterns-in-practice`:

```
Read CLAUDE.md fully. Then read RAG_WORKSHOP_PLAN.md Section 8.
Execute Phase 1 (Scaffold). Stop after the commit and report what was created.
Do not proceed to Phase 2 until I confirm.
```

---

## Section 12 — Maintenance and Evolution

### Near-term additions (next iteration)
- `modules/27_colbert_rag/` — ColBERT late-interaction retrieval
- `modules/28_cache_augmented_generation/` — Anthropic prompt caching as retrieval substitute
- `modules/29_routing_rag/` — Query classifier routes to specialized sub-indexes

### Stretch goals
- Offline/mock mode with pre-cached API responses for all notebooks
- Full RAGAS evaluation pipeline with golden dataset
- Interactive pattern selection tool (`docs/pattern_selector.html`)
- Full-day workshop curriculum (all 26 patterns with hands-on labs)
