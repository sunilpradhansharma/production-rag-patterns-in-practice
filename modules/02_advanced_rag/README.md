# Module 02: Advanced RAG — Speaker Notes

## Timing

| Segment | Time |
|---------|------|
| Slides 1–2: problem framing + architecture | 2 min |
| Slide 3: key insight | 30 sec |
| Slide 4: Basel III walkthrough (live demo) | 2 min |
| Slide 5: tradeoffs discussion | 1 min |
| Q&A buffer | 1 min |
| **Total** | **~7 min** |

---

## Framing coming out of Module 01

You ended Naive RAG by noting that top-5 cosine retrieval fails when query vocabulary
diverges from document phrasing. This module picks that thread up immediately:
"We just saw where Naive RAG breaks. Advanced RAG adds two targeted fixes — one before
the vector store, one after it. Nothing else changes."

Keep the frame on **targeted fixes to known failure modes**, not on "making RAG better
in general." Each stage has a specific job.

---

## Live demo: Basel III capital requirements

Run `demo.ipynb` against `shared/sample_data/basel_iii_excerpt.txt`.

**Demo query:** `"What capital requirements apply to Tier 1 banks under Basel III?"`

**What to show and say:**

1. **Before (Naive RAG output):** Run Cell 4 with reranking disabled — show the raw
   top-5 cosine results. Point out that rank 1 is likely a passage about the
   countercyclical buffer, not the minimum CET1 ratio. "The model retrieved a related
   topic, not the answer."

2. **After (Advanced RAG output):** Re-enable reranking, run Cell 4 again. Show the
   reranked top-3. The minimum CET1 clause (4.5% plus 2.5% conservation buffer) should
   be rank 1. "The cross-encoder knows query + chunk jointly — it's a much better
   relevance judge than cosine alone."

3. **Compression:** Show Cell 5's before/after compression output. A 400-token chunk
   compresses to ~80–100 tokens. "This is what the LLM actually sees. Less noise,
   lower cost, more precise answer."

4. **Final answer:** Read the generated answer aloud. It should cite the 4.5% minimum
   and the 2.5% conservation buffer as separate figures. Compare to the Naive RAG
   answer from step 1.

**If the live demo fails:** Fall back to the printed before/after comparison in Cell 5.
The rank-change table is self-explanatory and makes the point without live API calls.

---

## Anticipated Q&A

**Q: When does reranking not help?**

When Naive RAG's retrieval is already high-quality — simple, unambiguous queries
against a knowledge base with consistent vocabulary. If a support agent is searching
runbooks written for the same audience, cosine similarity is usually sufficient and
reranking adds latency for no gain. Use an eval set to measure before adding the
reranker: if top-1 accuracy is already above 85%, the ROI on reranking is low.

**Q: Can I use a local reranker instead of Cohere?**

Yes — `FlashrankRerank` with `ms-marco-MiniLM-L-12-v2` runs locally, adds zero API
cost, and reaches about 90% of Cohere's reranking quality on English regulatory text.
The notebook's Cell 1 shows how to swap between the two with a single environment flag.
Use local for cost-constrained or air-gapped environments; use Cohere when maximising
accuracy matters more than API dependency.

**Q: What if the compressor removes something important?**

This is the most important production pitfall — especially in legal and regulatory
text where conditional qualifiers ("unless", "subject to", "provided that") carry
critical meaning. In the notebook's Cell 5 we flag compressed outputs that have lost
conditional language. In production, add a post-compression check or skip compression
entirely for structured legal documents and rely on reranking alone to control context
size.

**Q: Why rerank against the original query and not a rewritten variant?**

The rewriter's job is to cast a wider retrieval net. The reranker's job is to score
relevance to *what the user actually asked*. Using a rewritten variant as the reranker's
query introduces a subtle but real accuracy loss — you end up optimising for the
rewriter's interpretation, not the user's intent. Always pass the original query to the
reranker.

---

## Transition to Module 03: Hybrid RAG

"Advanced RAG improves *how we rank and compress* what we retrieve. Module 03 improves
*what we retrieve in the first place.* Hybrid RAG adds BM25 sparse keyword search
alongside dense vector retrieval — and for regulatory text where users query by exact
clause references, that turns out to be the single most impactful retrieval improvement
available. Let's look at why."
