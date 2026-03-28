# Module 18: IRCoT -- Speaker Notes

## Timing

**Total: 7--8 minutes**

| Segment | Time | Notes |
|---------|------|-------|
| Problem framing | 1.5 min | The Tier-3 suitability example lands well -- it's a real workflow participants recognise |
| Architecture walkthrough | 1.5 min | Walk the loop diagram slowly; the two decision diamonds are the key insight |
| Live demo | 3 min | Show 2-3 reasoning+retrieval cycles; print the reasoning trace after each step |
| Tradeoffs + positioning | 1 min | Emphasise transparency as the differentiating value for compliance workflows |

---

## Live Demo Talking Points

**Setup**: Have the notebook at Cell 3 (corpus loaded, retrieval function ready). The demo runs the IRCoT loop live -- it is one of the few modules where watching the loop execute step-by-step is the demonstration.

1. Show Cell 4 executing. Print each reasoning step as it completes. Pause after step 1: "The model has written its first inference. Now it decides: do I need more information?"
2. Show the retrieval trigger firing. Print the retrieval query that was formulated. "The model extracted this search query from its own reasoning. It didn't search for the original question -- it searched for the specific gap the reasoning identified."
3. Show the retrieved document. Show the next reasoning step incorporating it. "The reasoning continues, now informed by what was just retrieved. The context is richer but targeted -- not a dump of everything that might be relevant."
4. Show the second retrieval cycle (if it fires). "Different document, different section. The reasoning decided what it needed next."
5. Show the final answer and the complete reasoning trace. "This trace is the audit log. Every retrieved document is justified by a specific step in the reasoning chain."

**The moment to land**: "Compare this to Module 03 (Hybrid RAG). There, we retrieved before we knew what we needed. Here, the reasoning tells us what to retrieve at each step. The retrieval is smarter because the reasoning has already narrowed the question."

---

## Anticipated Q&A

**Q: How does the model decide when to retrieve?**
The trigger detector is a separate LLM call that classifies each reasoning step. The prompt asks: does this step assert something it cannot know from the query and prior context alone? If yes, formulate a retrieval query. In practice, the model signals this naturally -- reasoning steps that say "I need to check...", "The policy states... (need to verify)", or "This depends on..." are reliable retrieval triggers. You can also use a rule-based classifier on these linguistic signals as a cheaper alternative to a full LLM classification call.

**Q: What is the maximum number of steps?**
In practice, 4--6 steps covers the vast majority of fintech multi-step queries. The notebook enforces `MAX_STEPS = 8` as a hard ceiling. Beyond that, either the query is genuinely unanswerable from the corpus, or the trigger detector is misfiring and over-retrieving. Both cases should be caught in evaluation, not at runtime.

**Q: How is this different from FLARE (Module 08)?**
FLARE triggers retrieval based on token-level generation uncertainty -- the model is uncertain about what comes next. IRCoT triggers retrieval based on explicit reasoning content -- the model has reasoned its way to a knowledge gap. FLARE is implicit and works at the sentence level; IRCoT is explicit and works at the reasoning-step level. For compliance use cases where the audit trail matters, IRCoT's explicit trace is strongly preferred.

**Q: How is this different from Multi-Hop RAG (Module 23)?**
Multi-Hop RAG follows a predetermined retrieval chain: retrieve document A, extract a bridge entity, retrieve document B. The chain structure is fixed. IRCoT's chain is dynamic -- each step decides whether to retrieve and what to retrieve, based on the reasoning so far. Multi-Hop is faster and more predictable for known query patterns; IRCoT handles open-ended reasoning where the sub-questions are not known in advance.

**Q: What happens when the trigger detector misfires?**
Two failure modes. Over-triggering: the detector retrieves on every step, inflating cost and eventually filling the context window with redundant documents. Under-triggering: the detector skips necessary retrievals, leaving reasoning steps to hallucinate facts. Both are detected in evaluation by checking retrieval counts against expected ranges. Calibrate with 10--20 representative queries from your domain before deploying.

---

## Transition to Next Module

> "IRCoT reasons through a question step by step, retrieving as it goes. But some questions aren't just sequential -- they're relational. 'Which counterparties are connected to this entity through three degrees of ownership?' can't be answered by chaining reasoning steps linearly. It needs a map of relationships, not a chain. Module 24 -- Graph RAG -- builds that map."

*Advance to Module 24: Graph RAG.*

---

## Common Delivery Mistakes

- **Don't skip the trace printout.** The reasoning trace is the most distinctive output of this pattern. If you only show the final answer, IRCoT looks identical to standard RAG. The trace is what participants take away.
- **Don't demo with a simple query.** IRCoT looks expensive and over-engineered for a single-step question. Use the compliance analysis query in Cell 4 -- it genuinely requires 3+ steps and makes the pattern's value obvious.
- **Do contrast with Module 03 explicitly.** The sharpest insight is the comparison: Hybrid RAG retrieves before it knows what it needs; IRCoT retrieves because the reasoning told it what was missing. This distinction takes 30 seconds to state and immediately clarifies why the pattern exists.
- **Don't over-promise on latency.** Be upfront: IRCoT is slower than standard RAG for simple queries and about the same for complex ones where standard RAG would need multiple queries anyway. The win is reasoning quality and transparency, not speed.
