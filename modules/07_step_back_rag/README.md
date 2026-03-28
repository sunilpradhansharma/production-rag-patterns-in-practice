# Module 07: Step-Back RAG — Speaker Notes

## Timing

**5–6 minutes** (Tier 2, optional live demo)

| Segment | Time | Notes |
|---------|------|-------|
| Problem slide | 1 min | Barrier option example is vivid — use it verbatim |
| Solution + diagram | 1.5 min | "One level up, not maximally general"; show ASCII pipeline |
| Architecture | 1 min | Two parallel retrieval paths converging at the combiner |
| Fintech + tradeoffs | 1.5 min | Tier 2 compliance example; hit the "when to skip" row |
| Transition | 0.5 min | Deliver transition line |

---

## Framing

> "Multi-Query decomposed a question into sub-questions. Step-Back does the opposite: it abstracts a specific question up to the general principle. Retrieve that principle. Retrieve on the original too. The generator sees the rule and the case — and reasons much better."

Position this as the pattern for edge cases where a specific question needs a framework to be answerable.

---

## Live Demo (optional)

Run `demo.ipynb` Cell 4. Walk through:

1. **Specific query** — Basel III Pillar 1 capital ratio minimum.
2. **Step-back query** — "What is the general purpose of Basel III capital adequacy?" — one level up, still meaningful.
3. **Per-path retrieval** — abstract query retrieves framework chunks; original retrieves ratio-specific chunks.
4. **Combined context** — labelled "General principle:" and "Specific case:" sections.
5. **Answer** — framework reasoning applied to the specific ratio.

---

## Anticipated Questions

**"When does this fail?"**
When specifics matter more than principles. Queries about named counterparties, transaction IDs, or precise regulatory deadlines should not be abstracted — the specific detail is the answer. The failure mode is a fluent but non-specific response that misses the actual detail needed.

**"How is the step-back query generated?"**
A single Haiku call: identify the general concept or framework this question is an instance of, rephrase as a broader question. One level up — not maximally general. Few-shot examples showing good vs too-vague abstractions improve consistency.

**"Can you combine this with Multi-Query?"**
Yes. For a query that is both specific *and* multi-faceted: use Step-Back for principle context, Multi-Query for targeted sub-questions. Each addresses a different failure mode.

---

## Transition

> "We've optimised retrieval — rewriting, fusing, decomposing, abstracting. Now the other side: how documents are chunked and indexed. Better indexing means retrieval doesn't need to work as hard."
