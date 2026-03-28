# Module 15: Long-Context RAG -- Speaker Notes

## Timing

**Total: 5--6 minutes**

| Segment | Time | Notes |
|---------|------|-------|
| Problem framing | 1 min | One concrete chunking failure -- pick the 10-K cross-reference example |
| Concept + context window table | 1 min | Keep it fast; participants understand this intuitively |
| Live demo | 2.5 min | Basel III full text in context; show token count before calling |
| Tradeoffs + when to use | 1 min | The cost number ($1.50/10-K) lands well; make it concrete |

---

## Live Demo Talking Points

**Setup**: Have the notebook at Cell 3 (document loaded, token count printed). Do not skip the token count display -- it makes the "we put 10,000 tokens in context" claim concrete.

1. Show the Basel III excerpt loaded in full. Print the token count. "This is ~8,000 tokens. The entire text. Nothing chunked."
2. Show Cell 4: one API call, full text in context, query appended. Point to the absence of a retriever. "There is no `vectorstore.similarity_search` here. There is no BM25 index."
3. Show the answer. Point to a specific citation that spans two sections of the document -- a definition in Part 1 referenced in Part 3. "A chunked retriever would have had to get lucky to surface both chunks. The long-context model just read both."
4. Cell 5: show the token count breakdown and cost estimate. This is the moment to be honest about the cost tradeoff.

**The moment to land**: "The Basel III excerpt is 8,000 tokens. A real Basel III framework document is 50,000 tokens. A 10-K is 70,000 tokens. All of these fit in Claude's 200K window. The engineering question is whether the cost is justified for your query volume."

---

## Anticipated Q&A

**Q: When is this better than retrieval-based RAG?**
When the document is under ~100K tokens and the query requires reasoning that crosses section boundaries. Good tests: does the answer require understanding how Part 1 of the document affects Part 4? Does the answer require reading a definition and its application in the same response? If yes, long-context wins. If the query is narrow ("what is the CET1 minimum?"), retrieval is cheaper and just as accurate.

**Q: What about the "lost in the middle" problem?**
It is real. Liu et al. (ACL 2024) measured it empirically: GPT-3.5 and GPT-4 performance drops for information in the middle of long contexts. Claude shows the same effect at reduced magnitude. The practical mitigation is to place the most relevant sections at the top of the document block, not buried in the middle. For the demo, the Basel III excerpt is short enough that it does not matter -- but for a real 10-K, the risk factors section (usually in Part I) should be moved to the front if it is the primary target.

**Q: Why not just always use Gemini 1.5 with its 1M token window?**
Context window size and answer quality are different things. A 1M token context window does not mean the model attends equally to all 1M tokens -- the lost-in-the-middle effect is worse at extreme context lengths. Also, pricing: Gemini 1.5 Pro at 1M input tokens per query is expensive. Use the smallest context window that fits the document.

**Q: Does this replace all the other patterns?**
No -- it only works for documents that fit in a single context. As soon as you have a corpus (a library of contracts, a knowledge base, a regulatory archive), you need retrieval to filter down to the relevant documents before putting them in context. Long-Context RAG and retrieval-based RAG are complementary: retrieve the right documents, then read them in full.

**Q: What happens if the document is too long?**
You have two options. First, use RAPTOR to recursively summarise the document into a compressed tree that fits. Second, use Contextual RAG to chunk with rich per-chunk context so that retrieval is more accurate. Both are in this repository.

---

## Transition to Next Module

> "Long-Context RAG solves the chunking problem by loading everything. But what if reasoning itself is the bottleneck -- not retrieval? Some questions can't be answered in one step, no matter how much context you have. Module 18 -- IRCoT -- interleaves retrieval and reasoning step by step, building the answer chain one inference at a time."

*Advance to Module 18: IRCoT (Interleaved Retrieval and Chain-of-Thought).*

---

## Common Delivery Mistakes

- **Don't undersell the cost.** The cost slide is the most important slide in this module. Participants need a concrete number. "$1.50 per 10-K query, 1,000 analyst queries per month = $1,500/month just for input tokens on one document type" makes the tradeoff tangible.
- **Don't skip the token count.** Printing the token count before the API call is the demo's anchor. It makes "the whole document is in context" real rather than abstract.
- **Do show what chunking would have missed.** The strongest demo moment is pointing to a specific answer claim and saying "that came from Section 4, cross-referencing a definition in Section 1 -- a chunked retriever would have had to surface both chunks independently, and might not have." This is the concrete case for the pattern.
- **Don't present this as a general solution.** Be explicit that it is a single-document tool. Participants building knowledge bases should leave knowing that this pattern is not for them.
