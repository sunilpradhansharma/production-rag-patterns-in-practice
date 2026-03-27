# Module 10: Parent Document Retrieval — Speaker Notes

## Timing

**6–7 minutes total**

| Segment | Time | Notes |
|---------|------|-------|
| The dilemma table | 1 min | Let the table land — audience has felt this pain already |
| Architecture walkthrough | 2 min | Walk the diagram top to bottom; emphasise the child never reaches the LLM |
| Live demo | 2 min | Basel query; show flat chunk vs parent return side by side |
| Tradeoffs + wrap | 1 min | Hit the dual storage cost, transition to Module 13 |

---

## Live Demo: Basel Capital Requirement

**Demo query:** *"What are the minimum CET1 capital requirements and when do buffer requirements apply?"*

Run Cell 4 of `demo.ipynb`. The cell prints two answers side by side:
1. Flat chunking (500 chars) — retrieves a fragment of Article 92
2. Parent Document — retrieves the full Article 92 section including buffer conditions

**What to point out during the demo:**
1. Show the child chunk in Cell 5 — note how compact and high-signal it is (~128 tokens).
2. Show the parent that gets returned — the full section the child came from.
3. Point to the `doc_id` in the child metadata — this is the entire mechanism. One field, one dict lookup.
4. The flat answer may cite the 4.5% threshold correctly but miss the conservation buffer trigger. The parent answer includes both.

**If the demo output looks similar for both**, zoom into the chunk boundary inspection in Cell 5 — it shows exactly where the flat splitter cut the section mid-clause.

---

## Anticipated Questions

**"How is this different from just using bigger chunks?"**
Bigger chunks hurt retrieval — the embedding vector tries to represent too much, and the similarity score gets diluted by irrelevant sentences. A 512-token chunk embedding a full regulatory article will score lower against a specific clause query than a 128-token child chunk that contains only that clause. Parent Document gives you a 128-token embedding score (precision) and a 512-token context block (completeness). You get both by paying for the lookup.

**"What's the right parent and child size?"**
There is no universal answer — it depends on document structure. A good starting heuristic: child = one paragraph or 100–200 characters; parent = one section or 400–800 characters. For ISDA and Basel documents specifically, aligning parents to section boundaries (e.g., `\n===\n` or `SECTION N`) rather than character counts produces far better results than blind splitting.

**"What happens if two queries match children from the same parent?"**
They return the same parent once — deduplication on `doc_id` ensures no parent appears twice in the context. The LangChain `ParentDocumentRetriever` handles this automatically; if you are rolling your own, you need an explicit dedup step before context assembly.

**"Can I combine this with Hybrid RAG?"**
Yes — and it is a strong production combination. Use BM25 + dense as the child retriever (exact keyword + semantic), then return parents. This gets you all three benefits: exact-term precision from BM25, semantic recall from dense, and full-context generation from parent return. Module 03 showed you the hybrid retriever; wiring it as the child retriever inside this pattern is a straightforward composition.

---

## Transition to Module 13

> "Parent Document Retrieval solves the context problem at retrieval time — you return more text
> to the LLM. But what if the embedding itself is the problem? What if the child chunk's vector
> doesn't represent its meaning well because it lacks surrounding context at index time?
> That's what Contextual RAG solves — it fixes the embedding, not the retrieval step."

Pause for questions here before moving on. This transition is a good natural break.
