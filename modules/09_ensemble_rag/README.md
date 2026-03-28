# Module 09: Ensemble RAG — Speaker Notes

## Timing

**Total: 6–7 minutes**

| Segment | Time | Notes |
|---------|------|-------|
| Concept + motivation | 1.5 min | Lead with the compliance miss scenario — one retriever, one missed regulator |
| Architecture walkthrough | 1.5 min | Walk the diagram; emphasize RRF doesn't need score calibration |
| Live demo | 2.5 min | Run naive + hybrid + ensemble side by side; let the diff speak |
| Tradeoffs + when to use | 1 min | Be honest about cost — this is not a default-on pattern |

---

## Live Demo Talking Points

**Setup**: Have the notebook pre-run through Cell 3 (all three retrievers initialized). Demo starts at Cell 4.

1. Run the naive RAG retriever on the compliance query. Print the top-5 chunks. Point out what's missing.
2. Run the hybrid (BM25 + dense) retriever. Show the improvement — more relevant chunks, but still gaps.
3. Run the full ensemble (BM25 + dense + keyword). Show the merged result set. Point to a chunk that only appeared because two strategies agreed it was relevant despite neither ranking it #1.
4. Generate the answer from ensemble context. Show the citation output — multiple regulatory sources cited.

**The moment to land**: "This chunk was ranked 11th by BM25 and 9th by dense. Neither would have included it in a top-5 retrieval. The ensemble surfaced it at position 4 because two strategies agreed it mattered."

---

## Anticipated Q&A

**Q: How many strategies should I include in an ensemble?**
Typically 2–4. Two is Hybrid RAG. Three is the sweet spot — meaningful diversity without runaway cost. After four, each additional retriever adds operational burden (another index to maintain, another weight to tune) while contributing diminishing recall gains. Run an ablation on your eval set: if removing a retriever doesn't drop recall by more than 2–3%, drop it.

**Q: How do you tune the weights?**
Start with equal weights across retrievers, then run ablations on a held-out eval set. In practice, BM25 and dense usually carry the load (`[0.4, 0.4]`), with a third sparse retriever at lower weight (`[0.2]`). Domain matters: in exact-terminology-heavy regulatory text, BM25 often deserves a higher weight than in open-domain Q&A.

**Q: Why RRF instead of score normalization?**
Score normalization across heterogeneous retrievers is brittle — BM25 scores and cosine similarities live on different scales and shift with corpus size. RRF only uses rank positions, which are stable and comparable across retriever types. The RRF formula `1 / (k + rank)` rewards consensus across retrievers without requiring score calibration.

**Q: Can I ensemble at the answer level instead of the chunk level?**
Yes, but don't. Running three full RAG pipelines end-to-end and voting on final answers multiplies cost by 3× and makes disagreement resolution hard. Chunk-level ensemble with a single LLM generation is almost always the right trade-off.

**Q: Does this replace Hybrid RAG?**
No — it generalizes it. Hybrid RAG is a two-retriever ensemble (BM25 + dense) with RRF. Start with Hybrid RAG. Graduate to Ensemble RAG only when a third retriever demonstrably improves your eval metrics.

---

## Transition to Next Module

> "Ensemble RAG solves the recall problem by multiplying retrieval strategies. But all of these patterns share one assumption: the answer lives in a retrievable chunk. What if the document is so large that chunking loses the connections between ideas? Module 15 — Long Context RAG — takes the opposite approach: skip retrieval entirely and hand the whole document to the model."

*Advance to Module 15: Long Context RAG.*

---

## Common Delivery Mistakes

- **Don't oversell.** Ensemble RAG is expensive and operationally heavy. Participants should leave understanding it as a targeted tool for high-stakes retrieval, not a universal upgrade.
- **Don't skip the cost slide.** The ★★☆☆☆ cost rating needs a concrete number: "three retrievers means three times the embedding compute and often a 30–50% larger context window per query."
- **Do show the ablation.** The most compelling demo moment is removing one retriever and showing a specific chunk drop out of the top-k. This makes the "why" concrete.
