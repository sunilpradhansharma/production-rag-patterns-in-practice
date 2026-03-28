# RAG Patterns in Practice — Project Brain

> **Read this file first in every Claude Code session.**
> It defines what this project is, how it's structured, and how to build it.

---

## 1. What this project is

A **hands-on workshop repository** covering all 26 RAG (Retrieval-Augmented Generation) patterns — from Naive RAG to Agentic RAG — with:

- Runnable Jupyter notebooks for each pattern (fintech domain)
- Clear architecture diagrams (Mermaid)
- Practical explanations: what each pattern solves, when to use it, what it trades off
- Speaker notes and slides for workshop delivery

**Target audience:** Engineers and ML practitioners building RAG systems in production, particularly in fintech/financial services (3+ years experience).

### Repository vs Workshop — a critical distinction

This repository serves **two purposes** that must not be conflated:

| Concern | Repository | Workshop (90 min) |
|---------|-----------|-------------------|
| **Scope** | All 26 patterns, fully documented | Curated 8–10 patterns, live demos |
| **Depth** | Full SKILL.md + notebook + tests per pattern | Architecture walkthrough + 1 live demo per segment |
| **Audience mode** | Self-paced reference | Instructor-led, time-boxed |
| **Completion** | Every pattern must work standalone | Only Tier 1 patterns must be demo-ready |

The **repository is the primary deliverable.** The workshop is a curated path through it.

---

## 2. Absolute rules

1. **One module at a time.** Complete a module fully (SKILL.md → notebook → slides → speaker notes) before starting the next.
2. **Pause after each module.** Print a summary and wait for explicit user confirmation before proceeding.
3. **All notebooks must be cell-executable.** Every cell must run independently with no hidden state. Cell 1 is always environment setup.
4. **Fintech context is mandatory.** Every pattern must include at least one fintech use case (compliance, fraud, risk, document intelligence, market data).
5. **Python 3.11+.** Use async where natural. Prefer LangChain for orchestration, LlamaIndex where it has clear advantage (Sentence Window, RAPTOR).
6. **No placeholder code.** Every function must be real, runnable logic — no `# TODO` stubs in deliverables.
7. **Cite the source.** Every SKILL.md must reference the originating paper or technical blog with year and URL.
8. **API key safety.** Never hardcode keys. Always read from environment. Provide mock/offline fallback where feasible.
9. **No GoF framing.** Do not introduce Gang of Four design pattern terminology, mapping tables, or GoF-oriented explanations. This repository teaches RAG patterns, not software design patterns. Explain patterns through what they do, what problem they solve, and when to use them.

---

## 3. Directory layout

```
rag-patterns-in-practice/
│
├── CLAUDE.md                          # This file — read first every session
├── README.md                          # Repository public face — patterns, diagrams, quick start
├── RAG_WORKSHOP_PLAN.md               # Full build plan — phases, sequencing, standards
├── RAG_WORKSHOP_VISUALS_ADDENDUM.md   # Diagram style guide and per-pattern diagram catalog
├── CONTRIBUTING.md                    # How to add new pattern modules
├── .gitignore
├── .env.example                       # Required API keys (never committed)
├── requirements.txt                   # Pinned production deps
├── requirements-dev.txt               # Dev deps: pytest, nbconvert, ruff, mypy
├── pyproject.toml                     # Tool config: ruff, mypy
├── Makefile                           # make install / make test / make eval / make lint
│
├── modules/
│   ├── README.md                      # Module index with timing guide
│   ├── 01_naive_rag/
│   │   ├── SKILL.md                   # Pattern knowledge base (what, why, how, tradeoffs)
│   │   ├── README.md                  # Speaker notes + timing + anticipated Q&A
│   │   ├── demo.ipynb                 # 6-cell runnable notebook
│   │   ├── slides.md                  # Workshop slide content
│   │   └── tests/
│   │       └── test_naive_rag.py
│   ├── 02_advanced_rag/
│   │   └── ... (same structure)
│   └── ... (26 total, 01 through 26)
│
├── shared/
│   ├── __init__.py
│   ├── base.py                        # Abstract base classes for RAG pipelines
│   ├── strategies.py                  # Retrieval and rerank strategy interfaces
│   ├── factories.py                   # RetrieverFactory
│   ├── builders.py                    # RAGPipelineBuilder
│   ├── decorators.py                  # CachedRetriever, RerankedRetriever, LoggedRetriever
│   ├── proxy.py                       # SemanticCacheProxy
│   ├── adapters.py                    # LlamaIndex↔LangChain adapters
│   ├── observers.py                   # EvalObserver, LatencyObserver
│   ├── registry.py                    # EmbeddingModelRegistry
│   ├── pipeline.py                    # RAGPipeline facade
│   ├── visitors.py                    # PIIRedactor, MetadataEnricher
│   ├── types.py                       # Shared TypedDict / dataclass definitions
│   ├── config.py                      # Pydantic settings model
│   ├── utils.py                       # Timing, logging, token counting helpers
│   └── sample_data/
│       ├── README.md                  # Describes each sample document and its purpose
│       ├── fintech_policy.txt         # Synthetic loan policy document
│       ├── basel_iii_excerpt.txt      # Regulatory text excerpt
│       ├── isda_excerpt.txt           # Derivatives agreement excerpt
│       └── earnings_report.txt        # Earnings report with tables
│
├── docs/
│   ├── architecture/
│   │   ├── rag_vs_agentic.md          # Full RAG vs Agentic AI decision guide
│   │   ├── design_layers.md           # All 8 production design layers
│   │   └── pattern_selection.md       # Decision flowchart for choosing a pattern
│   └── workshop/
│       ├── run_of_show.md             # Minute-by-minute 90-min timing
│       ├── setup_guide.md             # Attendee environment setup
│       └── cheatsheet.md              # One-page pattern reference card
│
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Run all notebooks on PR
│       └── eval.yml                   # Weekly eval pipeline
│
└── progress.md                        # Module completion tracker
```

**Key design decision — SKILL.md lives inside each module directory**, not in a separate `skills/` tree. This keeps all pattern-related files co-located and eliminates cross-directory references. Each module is self-contained.

---

## 4. SKILL.md template

Every `modules/<pattern>/SKILL.md` must follow this structure:

```markdown
# <Pattern Name>

## What it is
One paragraph. Plain English first sentence, technical detail from the second.

## Source
Paper/blog title, authors, year, URL.

## When to use it
- 3–5 conditions where this pattern outperforms alternatives
- At least one fintech-specific trigger condition

## When NOT to use it
- 2–3 cases where this pattern adds cost/complexity without benefit

## Architecture
Mermaid flowchart showing: query → ... → answer
(Use the diagram from RAG_WORKSHOP_VISUALS_ADDENDUM.md)

## Key components
| Component | Purpose | Default implementation |
|-----------|---------|----------------------|

## Step-by-step
Numbered steps matching notebook cells 3–5.

## Fintech use cases
- **Compliance Q&A:** ...
- **Fraud detection:** ...
- **Risk analysis:** ...

## Tradeoffs
| Dimension | Rating | Notes |
|-----------|--------|-------|
| Retrieval quality | ★★★★☆ | ... |
| Latency | ★★★☆☆ | ... |
| Cost | ★★★☆☆ | ... |
| Complexity | ★★☆☆☆ | ... |

## Common pitfalls
- ...

## Related patterns
Which other patterns this combines well with, and why.
```

---

## 5. Notebook cell standard

Every `demo.ipynb` has exactly 6 cells in this order:

| Cell | Purpose | Content |
|------|---------|---------|
| 1 — Setup | Environment | pip installs, env vars, imports. Must be self-contained. |
| 2 — Data | Sample document | Load or generate fintech sample data. Explain why this doc was chosen. |
| 3 — Core | Pattern implementation | Minimal implementation of the pattern (< 60 lines). Comment every non-obvious line. |
| 4 — Run | End-to-end execution | Execute with a sample query. Print retrieved chunks with scores + generated answer. |
| 5 — Inspect | Observability | Print chunk boundaries, score distributions, timing breakdown, reasoning traces. |
| 6 — Fintech | Domain application | Same pattern applied to a compliance/risk/fraud scenario. Show citation output. |

Each code cell is preceded by a markdown cell:
```markdown
## Cell N: <purpose>
**What this demonstrates**: <one sentence>
**Expected output**: <what the participant should see>
```

### Notebook conventions
```python
# Always in Cell 1
import os
from dotenv import load_dotenv
load_dotenv()

# LLM — default to Claude
from anthropic import Anthropic
client = Anthropic()  # reads ANTHROPIC_API_KEY from env

# Embeddings — default to OpenAI
from langchain_openai import OpenAIEmbeddings
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Vector store — local, no infra needed
from langchain_community.vectorstores import Chroma

# All functions must be type-hinted
def retrieve(query: str, k: int = 5) -> list[dict]:
    ...
```

---

## 6. Build phases

Building each module follows a 4-phase sequence. These are **workflow phases**, not autonomous agents.

### Phase A — Knowledge (write SKILL.md)
- Research the pattern: read the source paper, understand the core innovation
- Write the SKILL.md following the template in Section 4
- Include the Mermaid architecture diagram from the visuals addendum
- Explain what problem this pattern solves and what it trades off

### Phase B — Content (write slides.md + README.md)
- `slides.md`: title slide, concept overview, architecture diagram, key insight, fintech use case, tradeoffs. ≤ 300 words.
- `README.md` (speaker notes): timing guidance, anticipated questions, live demo talking points, transition to next module. 200–400 words.

### Phase C — Code (write demo.ipynb)
- Build the 6-cell notebook per the standard in Section 5
- Use sample data from `shared/sample_data/`
- Every non-obvious line gets a comment explaining WHY

### Phase D — Validation
- Verify notebook structure (6 cells, correct order, markdown headers)
- Check that all imports resolve
- Check that API key usage follows the safety rules
- Update `progress.md` to mark the module complete

---

## 7. Module build priority

Not all 26 patterns are equally important. Build in this order:

### Tier 1 — Core workshop path (build first, demo-ready)
These 10 patterns form the 90-minute workshop narrative arc:

| Order | Module | Why it's Tier 1 |
|-------|--------|----------------|
| 1 | `01_naive_rag` | Baseline — everything builds on this |
| 2 | `02_advanced_rag` | Shows the natural first upgrade |
| 3 | `03_hybrid_rag` | Most impactful single retrieval improvement |
| 4 | `10_parent_document` | Best indexing pattern for long docs |
| 5 | `13_contextual_rag` | Anthropic's own breakthrough — high audience interest |
| 6 | `06_hyde` | Elegant idea, easy to demo, great "aha" moment |
| 7 | `16_self_rag` | Introduces the reasoning/reflection paradigm |
| 8 | `17_corrective_rag` | Most practical self-correction pattern |
| 9 | `20_adaptive_rag` | Ties patterns together — "use the right tool for the query" |
| 10 | `22_agentic_rag` | Capstone — the most powerful pattern |

### Tier 2 — Extended reference (build next)
`04, 05, 07, 11, 12, 14, 19, 21, 23`

### Tier 3 — Specialized (build last)
`08, 09, 15, 18, 24, 25, 26`

---

## 8. Workshop timing (90-minute format)

| Time | Segment | Patterns | Mode |
|------|---------|----------|------|
| 0:00–0:10 | Foundations | Naive RAG, Advanced RAG | Slides + live demo (Naive) |
| 0:10–0:25 | Indexing | Parent Document, Contextual RAG | Slides + live demo (Contextual) |
| 0:25–0:40 | Retrieval | Hybrid RAG, HyDE | Slides + live demo (Hybrid) |
| 0:40–0:55 | Reasoning | Self-RAG, Corrective RAG | Slides + live demo (CRAG) |
| 0:55–1:10 | Architecture | Adaptive RAG, Agentic RAG | Slides + live demo (Agentic) |
| 1:10–1:20 | Synthesis | Pattern selection guide, design layers | Slides only |
| 1:20–1:30 | Q&A + wrap | Resources, next steps | Discussion |

**Remaining 16 patterns** are referenced in slides as "in your repo" with pointers to the module directories. Attendees explore them post-workshop.

---

## 9. Practical concerns

### API costs
Each notebook makes 1–5 API calls (embedding + LLM). Estimated cost per full run of all 26 notebooks: **~$2–5 USD** at current pricing. The workshop demo path (Tier 1) costs ~$1.

### Required API keys
```
ANTHROPIC_API_KEY    — Required (LLM generation)
OPENAI_API_KEY       — Required (embeddings via text-embedding-3-small)
COHERE_API_KEY       — Optional (reranking in Advanced RAG, Modular RAG)
TAVILY_API_KEY       — Optional (web search in Corrective RAG)
```

### Offline/mock mode
For environments without API access, notebooks should detect missing keys and fall back to pre-cached outputs stored as JSON fixtures in each module directory. This is a stretch goal — implement after Tier 1 is complete.

### Sample data strategy
All sample data is **synthetic text** stored in `shared/sample_data/`. No real PDFs (they bloat the repo and have licensing issues). Text files simulate the relevant document structures.

### Dependency pinning
Use exact versions in `requirements.txt` (e.g., `langchain==0.3.14`), not wildcards. Wildcards break reproducibility.

---

## 10. How to start a session

```
1. Read this file (CLAUDE.md)
2. Read progress.md → identify the next incomplete module
3. Read rag_patterns.json → load metadata for that pattern
4. If SKILL.md exists for the module, read it. Otherwise, create it first (Phase A).
5. Execute Phases B → C → D in order
6. Update progress.md
7. Pause and report to user
```

---

## 11. Coding standards

### File header (every .py file in shared/)
```python
"""
Module: <module_name>
RAG Layer: <which of the 8 design layers this addresses>

<2-3 sentence description of what this module does and why it exists.>
"""
```

### Import organization
```python
# ── Standard library ─────────────────────────────────────
from __future__ import annotations
import asyncio
import logging
from dataclasses import dataclass, field
from typing import Protocol, runtime_checkable

# ── Third-party ──────────────────────────────────────────
from anthropic import Anthropic
from langchain_core.retrievers import BaseRetriever
from pydantic import BaseModel, Field

# ── Local ────────────────────────────────────────────────
from shared.base import BaseRAGPipeline
from shared.types import RetrievedChunk, PipelineConfig
```

### Function docstrings
Use Google-style docstrings. Include Args, Returns, Raises. Add a fintech note where relevant. Keep it proportional — a 3-line helper doesn't need a 20-line docstring.

---

## 12. Environment requirements

```
python >= 3.11
langchain >= 0.3
langchain-community >= 0.3
langchain-openai >= 0.2
langchain-anthropic >= 0.3
langgraph >= 0.2
llama-index >= 0.11
chromadb >= 0.5
anthropic >= 0.40
openai >= 1.50
sentence-transformers >= 3.0
rank-bm25 >= 0.2
cohere >= 5.0
ragas >= 0.2
nbconvert >= 7.0
jupyter >= 1.0
python-dotenv >= 1.0
pydantic >= 2.0
networkx >= 3.0
scikit-learn >= 1.5
```

Pin exact versions in `requirements.txt` after initial resolution.
