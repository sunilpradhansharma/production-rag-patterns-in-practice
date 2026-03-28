# Module 19: Speculative RAG — Speaker Notes

## Timing

**6–7 minutes** (Tier 2, optional live demo)

| Segment | Time | Notes |
|---------|------|-------|
| Problem table | 1 min | Third row is the contrast — novel query needs retrieval |
| Solution + ASCII pipeline | 1.5 min | Stress: draft is never returned directly; only verified answer ships |
| Architecture diagram | 1 min | Point out parallel arrows — both paths start simultaneously |
| Fintech latency table | 1 min | 80/20 split is the business case: most queries are stable |
| Tradeoffs | 1 min | Risk ★★☆☆☆ — manageable with good verification prompts |
| Transition | 0.5 min | Deliver transition line |

---

## Framing

> "Standard RAG waits for retrieval before generating. For common queries — the T+2 rule asked a hundred times today — that wait is unnecessary. Speculative RAG generates immediately, retrieves in parallel, then verifies. Draft correct → answer in retrieval time. Draft wrong → verifier catches it."

Position this for systems with predictable, high-volume query distributions.

---

## Live Demo (optional)

Run `demo.ipynb` Cell 4:

1. **Common query** — "What are the T+2 settlement rules?" — prior is correct.
2. **Speculative draft** — Haiku's answer with no documents.
3. **Retrieval + verification** — verifier confirms the draft.
4. **Novel query** — a recent rule the model doesn't know.
5. **Correction in action** — verifier rejects draft, produces grounded answer.
6. **Latency comparison** — speculative vs standard RAG.

---

## Anticipated Questions

**"What if the speculation is totally wrong?"**
Verification detects it. The verifier prompt instructs: check every figure and threshold against the documents; override conflicting content. Test on known-wrong drafts before deploying.

**"Isn't this two LLM calls — more expensive?"**
Yes, but total latency is lower because draft and retrieval run in parallel. Haiku is cheap; the cost tradeoff is usually favourable for high-volume stable query patterns.

**"How do you choose speculative vs standard?"**
Pair with Adaptive RAG: classify novelty first. Common → speculative. Novel or high-stakes → standard RAG. The correction rate is itself a novelty signal.

---

## Transition to Module 21

> "Speculative RAG optimises latency within a fixed pipeline — draft, retrieve, verify. Modular RAG asks a different question: what if the pipeline itself shouldn't be fixed? It decomposes RAG into interchangeable components reconfigured per query type."
