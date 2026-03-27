# Module 03: Hybrid RAG — Speaker Notes

## Timing

**7–8 minutes total** (this is a highlight demo segment — keep it tight)

| Segment | Time | Notes |
|---------|------|-------|
| Problem setup | 1 min | Lead with the failure — show dense-only missing the exact clause |
| Architecture walkthrough | 2 min | BM25 / dense / RRF — one slide, move fast |
| Live demo | 3 min | Run the ISDA query; show the three-way comparison output |
| Tradeoffs + wrap | 1 min | Hit complexity cost, transition to Module 10 |

---

## Live Demo: ISDA Margin Call Query

**Demo query:** *"Find all references to 'margin call' triggers in the ISDA agreement"*

Run Cell 4 of `demo.ipynb`. The cell prints three result sets side-by-side:
- BM25-only top-5
- Dense-only top-5
- Hybrid (RRF fused) top-5

**What to point out during the demo:**
1. BM25 returns the chunk with the literal phrase "margin call" at rank 1 — dense pushes it to rank 3 or misses it entirely.
2. Dense returns the Credit Support Annex section as rank 1 — BM25 ranks it lower because it doesn't repeat the phrase.
3. Hybrid gets both in the top-3. That's the claim. The output proves it.

**If the demo output doesn't show a clear separation**, zoom into the RRF score column in Cell 5 — the score differential between modalities tells the story even when final rankings look similar.

---

## Anticipated Questions

**"Why not just use dense vectors with a better embedding model?"**
Even state-of-the-art embeddings (text-embedding-3-large, Cohere v3) exhibit token-frequency blindness for rare identifiers. An ISIN number like "US0231351067" has no semantic neighborhood — BM25 is the only retriever that handles it correctly. The answer is not a better model; it's a different retrieval signal.

**"What's the right value of k in RRF?"**
The original Ma et al. paper used `k=60` calibrated on web-scale corpora. For legal/financial documents with short corpora (< 50k chunks), `k=10–30` often performs better because rank spreads are tighter. Tune on a held-out query set — even 30 labeled query-document pairs is enough to compare `k` values.

**"Doesn't this double my infrastructure costs?"**
BM25 runs in-memory on the application server — it's CPU-only and has no cloud cost. The vector DB is the same instance as a dense-only deployment. The marginal infrastructure cost is effectively zero; the main cost is operational: two indexes must stay in sync when documents update.

**"Can I use this with re-ranking?"**
Yes — and you should in high-stakes workloads. Run Hybrid RAG first for broad recall, then apply a cross-encoder reranker (Cohere Rerank, BGE reranker) on the fused top-20 to get precision. Module 02 covers this reranker stage in detail.

---

## Transition to Module 10

> "We've just improved *how* we retrieve. BM25 plus vectors gives us better recall over the corpus we have.
> But what if the chunks themselves are the problem — too small to carry enough context, too large to score precisely?
> That's the indexing problem, and it's where Parent Document Retrieval comes in."

Move directly to Module 10 slides without pausing on questions — take them at the segment break.
