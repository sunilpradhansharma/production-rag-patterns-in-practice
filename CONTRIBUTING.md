# Contributing a New Pattern Module

This guide explains how to add a new RAG pattern to the repository. Each module is self-contained and follows a strict 4-phase build process.

---

## Before you start

1. Check `progress.md` to confirm the pattern is not already in progress.
2. Read the relevant entry in `rag_patterns.json` — it contains the pattern name, source paper, and workshop tier.
3. Read `RAG_WORKSHOP_VISUALS_ADDENDUM.md` to find the pre-designed architecture diagram for your pattern.
4. Read `CLAUDE.md` Section 4 (SKILL.md template) and Section 5 (notebook standard) before writing anything.

---

## Directory structure

Every module lives at `modules/<id>_<slug>/` and must contain exactly these files:

```
modules/13_contextual_rag/
├── SKILL.md          # Pattern knowledge base
├── README.md         # Speaker notes + timing + Q&A
├── demo.ipynb        # 6-cell runnable notebook
├── slides.md         # Workshop slide content (≤ 300 words)
└── tests/
    └── test_contextual_rag.py
```

No other files should be added to a module directory unless they are sample fixtures for offline/mock mode (e.g., `fixtures/cached_response.json`).

---

## Phase A — SKILL.md

Write `SKILL.md` following the template in `CLAUDE.md` Section 4. Required sections:

- **What it is** — plain English first, technical detail second
- **Source** — paper/blog title, authors, year, URL
- **When to use it** — 3–5 conditions, at least one fintech trigger
- **When NOT to use it** — 2–3 cases where this pattern adds cost without benefit
- **Architecture** — Mermaid flowchart from the visuals addendum
- **Key components** — table of component / purpose / default implementation
- **Step-by-step** — numbered steps matching notebook cells 3–5
- **Fintech use cases** — compliance, fraud, risk sections
- **Tradeoffs** — star-rated table (retrieval quality, latency, cost, complexity)
- **Common pitfalls** — 2–4 bullets
- **Related patterns** — which patterns combine well and why

---

## Phase B — slides.md + README.md

**`slides.md`** — Workshop slide content:
- Title slide with pattern name and one-line summary
- Concept overview (what problem it solves)
- Architecture diagram (copy from SKILL.md)
- Key insight (the "aha" moment in one sentence)
- Fintech use case with concrete example
- Tradeoffs summary
- Pointer to demo notebook
- Total word count: ≤ 300 words

**`README.md`** (speaker notes):
- Timing guidance (how many minutes to spend on this pattern)
- Anticipated audience questions with suggested answers
- Live demo talking points (what to highlight in the notebook)
- Transition language to the next module
- Total word count: 200–400 words

---

## Phase C — demo.ipynb

The notebook has exactly **6 cells**, each preceded by a markdown cell with:

```markdown
## Cell N: <purpose>
**What this demonstrates**: <one sentence>
**Expected output**: <what the participant should see>
```

| Cell | Content |
|------|---------|
| 1 — Setup | `pip install`, env vars, imports. Must be self-contained. |
| 2 — Data | Load fintech sample from `shared/sample_data/`. Explain why this doc was chosen. |
| 3 — Core | Pattern implementation, ≤ 60 lines, every non-obvious line commented. |
| 4 — Run | End-to-end execution with a sample query. Print chunks + scores + answer. |
| 5 — Inspect | Observability: chunk boundaries, score distributions, timing. |
| 6 — Fintech | Same pattern on a compliance/risk/fraud scenario. Show citation output. |

**Conventions:**
- Cell 1 must call `load_dotenv()` and read all API keys from environment
- LLM default: `Anthropic` client, `claude-sonnet-4-6` or latest Sonnet model
- Embeddings default: `OpenAIEmbeddings(model="text-embedding-3-small")`
- Vector store default: `Chroma` (local, no infra needed)
- All functions must be type-hinted
- No `# TODO` stubs — every function must be real, runnable logic

---

## Phase D — Validation

Before marking a module complete:

- [ ] Notebook has exactly 6 code cells in the correct order
- [ ] Every code cell has a preceding markdown cell with the standard header
- [ ] All imports resolve with `requirements.txt`
- [ ] No API keys hardcoded — all read from environment
- [ ] `shared/sample_data/` files are used (no inline data blobs)
- [ ] Test file exists at `tests/test_<slug>.py` with at least 3 test functions
- [ ] `progress.md` updated to mark the module complete

---

## Tests

Each `tests/test_<slug>.py` must:

- Use `pytest` with `@pytest.mark.integration` for tests that require live API keys
- Include at least one unit test that runs without any API keys (mock or fixture-based)
- Test the core retrieval function directly (not just the notebook cell)
- Follow the naming convention: `test_<what_it_does>`

Example:

```python
import pytest
from modules.13_contextual_rag.demo import build_contextual_retriever

def test_contextual_retriever_returns_chunks():
    """Retriever returns non-empty list for a known query."""
    ...

@pytest.mark.integration
def test_contextual_retriever_with_live_llm():
    """Retriever context matches expected pattern with real API call."""
    ...
```

---

## Absolute rules (from CLAUDE.md)

- **No GoF framing.** Do not use Gang of Four terminology.
- **No placeholder code.** No `# TODO` in deliverables.
- **Fintech context is mandatory.** Every pattern needs at least one fintech use case.
- **API key safety.** Never hardcode. Always read from environment.
- **Cite the source.** Every SKILL.md must reference the originating paper/blog with year and URL.
- **Python 3.11+.** Use async where natural.

---

## Updating progress.md

When a module is complete, update `progress.md`:

1. Check off all four artifacts: `SKILL.md | notebook | slides | speaker notes`
2. Update the overall status table counts
3. Add a session log entry with what was completed

---

## Questions?

Open an issue with the label `module-question`. Reference the pattern by its module ID (e.g., `13_contextual_rag`).
