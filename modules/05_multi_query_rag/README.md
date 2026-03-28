# Module 05: Multi-Query RAG — Speaker Notes

## Timing

**5–6 minutes** (Tier 2 — optional live demo)

| Segment | Time | Notes |
|---------|------|-------|
| Problem slide | 1 min | The centroid problem — draw it if you have a whiteboard |
| Solution + diagram | 1.5 min | Walk the three sub-questions; stress "tighter embedding region" |
| Architecture | 1 min | Note the union step; contrast with RRF from Module 04 |
| Fintech + tradeoffs | 1.5 min | Basel III + FATF example is self-contained; hit the latency caveat |
| Transition | 0.5 min | Deliver transition line |

---

## Framing

> "RAG Fusion rephrased the same question. Multi-Query breaks a complex question into simpler sub-questions. Each maps to a tighter region of embedding space. Retrieve for each part, union the results, pass the full context to the generator."

Position this as the right tool when a query has multiple separable parts — regulatory frameworks, product comparisons, multi-timeframe analysis.

---

## Live Demo (optional)

Run `demo.ipynb` Cell 4. Walk through:

1. **Original query** — complex, multi-framework question.
2. **3 sub-questions** — each isolates one framework or obligation type.
3. **Per-sub-question retrieval** — different sections surface for each.
4. **Union** — unique chunk count vs single-query baseline.
5. **Answer** — coverage across both frameworks.

The compliance demo is most compelling: single-query retrieves from one framework; the union catches both.

---

## Anticipated Questions

**"How is this different from RAG Fusion?"**
RAG Fusion generates rephrasings of the same question — different vocabulary, same information need. Multi-Query decomposes into distinct sub-questions, each targeting a different *part* of the information need. RAG Fusion for vocabulary mismatch; Multi-Query for query complexity.

**"How many sub-questions should you generate?"**
Three to five. Below three, coverage gains are marginal. Above five, sub-questions overlap and retrieval cost rises without gain. Three is a good default; increase to five for highly multi-faceted queries.

**"What if the sub-questions aren't diverse enough?"**
Print them and check. Tighten the decomposition prompt: instruct the model to target different aspects or frameworks. Few-shot examples of good decompositions are the most reliable fix.

---

## Transition to Module 07

> "We've covered query-side improvements — rewriting, fusion, decomposition. Now Step-Back RAG takes the opposite approach: instead of breaking a question down, it abstracts up to retrieve the foundational context the specific answer depends on."
