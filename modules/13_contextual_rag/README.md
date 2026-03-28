# Module 13: Contextual RAG — Speaker Notes

## Timing

**8–10 minutes total** — this is a key demo segment, allow extra time

| Segment | Time | Notes |
|---------|------|-------|
| Problem slide — orphaned chunks | 1.5 min | Read the fragment aloud; let the audience feel the ambiguity |
| Solution + architecture | 2 min | Show the before/after context prefix; walk the diagram |
| The numbers slide | 1 min | State 49% clearly and let it land — this is Anthropic's own measurement |
| Live demo | 3–4 min | Multi-policy query; show raw vs contextual side by side |
| Tradeoffs + transition | 1 min | Token cost question usually comes here — answer it, then move on |

---

## Anthropic Attribution — Say This Explicitly

Open this module by naming the source:

> "This pattern was published by Anthropic in November 2024. It came out of internal work on what was causing retrieval to fail even when the documents contained the right information. The root cause was that chunks were being embedded without any knowledge of where they sat in the document. The fix is applied at index time."

The audience will be paying close attention. Many will have heard of this blog post. Framing it as Anthropic's own contribution rather than a third-party technique builds credibility and signals that this is production-validated, not experimental.

---

## Live Demo: Ambiguous Query Across Multiple Policies

**Demo query:** *"What are the consequences of missing a scheduled payment?"*

Run Cell 4 of `demo.ipynb`. The cell prints two result sets:
1. **Plain chunks** — raw 500-char fragments, no document attribution
2. **Contextual chunks** — same fragments with context prepended before embedding

**What to point out:**
1. In the plain results, show that multiple chunks from different documents all score similarly — the embedding cannot tell them apart because they all contain the word "payment".
2. In the contextual results, point to the context header that was prepended before embedding — show the section number, document name, and cross-reference in the header.
3. The answer from contextual retrieval names the document and section. The plain answer likely conflates clauses from different policies.

**If the demo output looks similar for both**, zoom into Cell 5 — it runs the comparison on an intentionally ambiguous query where the gap is larger: *"What rate applies to the obligation?"* This has no document-specific terms at all, making it the strongest demonstration of context disambiguation.

---

## Anticipated Questions

**"Doesn't this waste tokens? You're embedding more text per chunk."**
Yes, deliberately. The enriched chunk is typically 150–200 tokens longer than the raw chunk — embedding cost is proportionally higher. But embedding is cheap (fractions of a cent per 1k tokens). The expensive part is context generation, and prompt caching reduces that by ~85–90%. The precision gain at retrieval time is worth the overhead. The alternative is lower recall, which is far more expensive in a compliance context where a missed clause is a regulatory risk.

**"Why use Claude Haiku for context generation rather than a more powerful model?"**
Context generation is not a reasoning task — Claude is just being asked to describe where a chunk sits in a document, which it can do accurately with Haiku. Using Sonnet or Opus for this would increase cost 5–20× with no measurable quality improvement on the context generation step. Save the powerful model for the generation step where reasoning about the answer actually matters.

**"Can I do this without an LLM? Just use the section header as context?"**
Yes, for simple documents with clean headers. If your splitter already preserves `H1/H2` headings in metadata, prepending those to the chunk text achieves a simpler version of this pattern. The LLM adds value when: (a) the document has implicit structure without clear headers, (b) cross-references need to be resolved, or (c) the same phrase means different things in different sections. For Basel III or ISDA agreements, the LLM is necessary. For FAQ documents, metadata prepending is sufficient.

**"What should the context template include?"**
At minimum: (1) document title and type, (2) section/article number, (3) the main concept or definition being elaborated. Optionally: (4) cross-references resolved — what "the aforementioned obligation" refers to. Do not include a summary of the chunk itself — that's the chunk's job. The context describes *position*, not *content*.

---

## Transition to Module 06

> "We've now improved both what we index — with contextual embeddings — and what we retrieve — with parent sections and hybrid search.
> The improvements so far have all been on the document side. What about the query side?
> What if the user's query itself is the weak link?
> HyDE flips the approach: instead of embedding the query and searching for similar chunks,
> it generates a hypothetical answer first and uses *that* as the search vector."

This transition works well here because the audience has now seen three indexing improvements in a row (Advanced, Parent Document, Contextual) and is ready for a different category of improvement.

---

## Workshop Notes

- If running short on time, skip Cell 5 (comparison) and go straight from Cell 4 to Cell 6.
- The prompt caching setup in Cell 3 is worth pointing at explicitly — it is a concrete production technique many attendees will not have used.
- If anyone asks about the 49% figure, note it is from Anthropic's internal evaluation, not a peer-reviewed benchmark — but it is directionally consistent with what practitioners report in the field.
