# Module 14: Multi-Vector RAG — Speaker Notes

## Timing

**7–8 minutes** (Tier 2, optional live demo)

| Segment | Time | Notes |
|---------|------|-------|
| Problem table | 1.5 min | Read the three query styles — analysts will recognise all three |
| Solution + ASCII pipeline | 1.5 min | Stress: retrieval hits any representation; generation uses the original |
| Architecture diagram | 1 min | Point out the two storage layers: vector store (reps) and document store (originals) |
| Fintech table | 1.5 min | Each row returns the same chunk — that's the point |
| Tradeoffs | 1 min | Storage ★★☆☆☆ is the key caveat; one-time indexing cost |
| Transition | 0.5 min | Deliver transition line |

---

## Framing

> "Instead of one embedding per chunk, generate multiple representations and index them all. A summary query matches the summary embedding; a lookup query matches raw text — and the generator gets the original."

Position this for corpora with multiple user types: analysts, product teams, and executives all query the same document differently.

---

## Live Demo (optional)

Run `demo.ipynb` Cell 4:

1. **Regulatory document** — Basel III excerpt with figures, principles, structure.
2. **Three representations** — summary and hypothetical questions alongside the raw chunk.
3. **Same chunk, three queries** — lookup, thematic, and question-style in sequence.
4. **Matched representation** — which representation each query hit.
5. **Original chunk returned** — generator receives the original in all cases.

---

## Anticipated Questions

**"How many representations?"**
Typically 2–4. Start with summary + hypothetical questions. Add raw text if exact-term lookups matter. Keywords as a fourth are rarely worth the cost.

**"Isn't this just storage overhead?"**
Yes — storage grows N×. The tradeoff: 3 representations gives 3× retrieval surface for high-value stable documents.

**"How is this different from Contextual RAG?"**
Contextual RAG adds a context prefix — one enriched embedding per chunk. Multi-Vector creates multiple distinct embeddings. They compose: enrich the raw chunk first, then generate summaries and questions.

**"How does this relate to HyDE?"**
HyDE generates a hypothetical document from the query at query time. Multi-Vector pre-generates hypothetical questions from documents at index time. Same intuition — opposite directions.

---

## Transition to Module 19

> "We've now covered the core indexing patterns. The next patterns focus on query-time reasoning: when to retrieve, what to retrieve, and when to stop."
