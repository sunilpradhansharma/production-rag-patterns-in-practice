# Module 20: Adaptive RAG — Speaker Notes

## Timing

**8–10 minutes total**

| Segment | Time | Notes |
|---------|------|-------|
| Problem slide | 1.5 min | Read the three-query table aloud — make the contrast visceral |
| Solution + architecture | 2 min | "The classifier outputs a tier. The router does the rest." |
| Live demo | 3 min | Run all three query types; point to routing decisions as they print |
| Tradeoffs | 1 min | Emphasise classifier calibration as the hidden maintenance cost |
| Transition | 0.5 min | Deliver transition line; set up Module 22 |

---

## Framing

> "Self-RAG reflected. CRAG acted. Now we ask a different question: what if the system chose the right strategy before doing anything? That's Adaptive RAG — the orchestration layer for everything we've built."

This is the capstone of the reasoning arc. Participants who've followed modules 16 and 17 should feel the pieces clicking together.

---

## Live Demo

Run `demo.ipynb` from Cell 4 — three queries in sequence:

1. **simple_lookup** — "Haiku classified this as simple. No vector store call."
2. **semantic_search** — "Standard hybrid retrieval fires. BM25 + dense, fused with RRF."
3. **multi_step** — "Two passes. The first answer generates a sub-question for the second."

Show the routing log in Cell 5. "In production, this log is how you catch classifier drift."

---

## Anticipated Questions

**"How do you classify queries?"**
Start with a few-shot prompted LLM call. For high-volume production, fine-tune a small classifier on labelled query logs — the prompted approach generates the training labels. Require a held-out eval set before deploying: a 20% misclassification rate means 1 in 5 queries gets the wrong strategy, silently.

**"What happens at tier boundaries?"**
Route up when uncertain. A tier-2 answer to a tier-1 query costs more but is correct. A tier-1 answer to a tier-2 query may be incomplete.

**"Do you need all three tiers?"**
No. Start with two (simple vs. retrieval). Add multi-step only when you have queries that clearly require it.

---

## Transition to Module 22

> "Adaptive RAG routes to strategies we've pre-defined. Agentic RAG doesn't choose between pipelines — it builds the pipeline dynamically. That's where we're going."
