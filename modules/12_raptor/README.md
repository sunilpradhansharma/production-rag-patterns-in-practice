# Module 12: RAPTOR — Speaker Notes

## Timing

**8–10 minutes** (Tier 2, optional live demo)

| Segment | Time | Notes |
|---------|------|-------|
| Problem slide | 1.5 min | Flat-retrieval table anchors the one-granularity problem |
| Solution + ASCII tree | 2 min | Leaf → cluster summary → root; all nodes land in one index |
| Architecture diagram | 1.5 min | Point out UMAP before GMM — high-dimensional clustering fails |
| Fintech table | 1.5 min | Each row maps to a different query type |
| Tradeoffs | 1 min | Indexing cost ★☆☆☆☆ — batch job, not real-time |
| Transition | 0.5 min | Deliver transition line |

---

## Framing

> "Flat retrieval gives you one granularity. Ask a specific question, get a specific chunk. Ask a thematic question — what are the main risk themes here? — and the index has nothing. RAPTOR builds a tree of summaries at index time, so the same index answers both."

Position this for large, stable corpora: annual reports, regulatory handbooks, fund prospectuses. Indexing cost is paid once and amortised across many queries.

---

## Live Demo (optional)

Run `demo.ipynb` Cell 4. Walk through:

1. **10-K excerpt** — annual report with risk factors, financials, forward guidance.
2. **Tree construction** — leaf chunks, UMAP, GMM clustering, cluster summaries, recursion to root.
3. **Specific query** — hits a leaf node with exact figure.
4. **Thematic query** — hits a Level 2 summary node.
5. **Unified index** — both results from the same Chroma collection.

---

## Anticipated Questions

**"Is the indexing cost worth it?"**
Yes for large, stable document sets. A 100-page handbook is indexed once and queried thousands of times. Reindex only on revision.

**"How many tree levels?"**
Typically 2–3. The loop terminates when cluster count falls below a threshold (e.g., 3). Set a maximum level cap on very large corpora.

**"Why UMAP before GMM?"**
GMM degrades in high-dimensional space. UMAP reduces to 2D preserving semantic neighbourhood structure; without it, BIC-optimal K is unreliable.

**"Can RAPTOR span multiple documents?"**
Yes — indexing several fund prospectuses together produces cross-document summary nodes. A common-risk-themes query then matches a corpus-level root node.

---

## Transition to Module 14

> "RAPTOR builds vertical structure — leaf, section, document, corpus. Multi-Vector adds horizontal: instead of one embedding per chunk, you index multiple representations of the same chunk."
