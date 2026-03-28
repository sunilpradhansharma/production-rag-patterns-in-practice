# Module 04: RAG Fusion — Speaker Notes

## Timing

**6–7 minutes** (Tier 2 — reference pattern, optional live demo)

| Segment | Time | Notes |
|---------|------|-------|
| Problem slide | 1 min | Read the synonym table — make the vocabulary gap concrete |
| Solution + RRF | 1.5 min | Explain RRF formula; "additive boost for docs in multiple lists" |
| Architecture | 1 min | Walk the diagram; note the parallel retrieval paths |
| Fintech + tradeoffs | 2 min | Market sentiment example; hit latency caveat |
| Transition | 0.5 min | Deliver transition line |

---

## Framing

> "Advanced RAG rewrote the query once. RAG Fusion asks: why pick one phrasing? Generate several, retrieve for all of them, and merge the results. Different phrasings retrieve different relevant chunks — fuse them for completeness."

Position as a practical fix for corpora where the same concept appears under many terminologies.

---

## Live Demo (optional)

Run `demo.ipynb` Cell 4. Walk through each step:

1. **Show the original query** — one phrasing, one retrieval angle.
2. **Show LLM-generated variants** — point out how each covers different vocabulary for the same concept.
3. **Show retrieval results from each variant** — different chunks surface for different phrasings.
4. **Show fused results vs single-query baseline** — highlight any chunks the baseline missed that fusion caught.

The market sentiment demo works well here: each variant targets a different terminology cluster (yield forecasts, risk appetite, sovereign debt) that analyst reports use inconsistently.

---

## Anticipated Questions

**"How many query variants should you generate?"**
Typically 3–5. Below three, coverage gains are marginal. Above five, variants drift from the original intent and latency grows proportionally. The variants are LLM-generated using a simple prompt asking for rephrasings that preserve the information need but vary vocabulary.

**"Is this actually better than just running one good query?"**
Yes, for open-ended or exploratory queries where you don't know which terminology the corpus uses. A single query retrieves one semantic neighbourhood. Variants expand coverage to adjacent neighbourhoods. RRF then surfaces documents that appear across multiple lists — the highest-confidence results.

---

## Transition to Module 05

> "RAG Fusion generates multiple phrasings of the same question. Multi-Query RAG does something similar but different — instead of rephrasing, it decomposes the query into distinct sub-questions, each targeting a different aspect. Let's look at that."
