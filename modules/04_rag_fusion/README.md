# Module 04: RAG Fusion — Speaker Notes

## Timing

**5–6 minutes** (Tier 2 — reference pattern, no live demo required)

| Segment | Time | Notes |
|---------|------|-------|
| Problem slide | 1 min | Read the synonym table — make the vocabulary gap concrete |
| Solution + RRF | 1.5 min | Explain RRF formula; say "additive boost for docs in multiple lists" |
| Architecture | 1 min | Walk the diagram; note dedup step |
| Fintech + tradeoffs | 1.5 min | AML variants table is self-explanatory; hit latency caveat |
| Transition | 0.5 min | Deliver transition line |

---

## Framing

> "Advanced RAG rewrote the query once to improve it. RAG Fusion asks: why pick one phrasing? Generate several, retrieve for all of them, and merge the results. It's a simple idea that solves a real problem — vocabulary mismatch between users and documents."

Position this as a low-complexity retrieval enhancement for teams where the corpus uses inconsistent terminology.

---

## Live Demo (optional — self-paced)

Run `demo.ipynb` Cell 4. Point out:

1. **Four variants printed** — show they cover different terminology for the same concept.
2. **Per-variant retrieval** — each variant surfaces different chunks from the AML policy corpus.
3. **RRF scores in Cell 5** — chunks appearing in multiple lists score higher; point to any duplicates caught by dedup.

The AML demo is most compelling: show the single-query baseline missing at least one SAR-relevant chunk that fusion catches.

---

## Anticipated Questions

**"How many variants should you generate?"**
Three to five. Below three, coverage gains are marginal. Above five, query drift increases and latency grows proportionally. Start at four, evaluate on a held-out query set before tuning.

**"Doesn't this just retrieve more noise?"**
RRF suppresses noise naturally — a chunk low-ranked in only one list scores poorly in the fused ranking. The dedup step prevents the same chunk from accumulating false score boosts.

**"How is this different from Multi-Query RAG?"**
RAG Fusion generates rephrasings — each variant asks the same question differently. Multi-Query decomposes into distinct sub-questions targeting different aspects. Use RAG Fusion for vocabulary mismatch; use Multi-Query when the query has multiple separable parts.

---

## Transition to Module 05

> "RAG Fusion rephrase the same question. Multi-Query asks different questions. Let's look at what happens when you decompose a complex query into targeted sub-questions."
