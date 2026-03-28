# Module 08: FLARE — Speaker Notes

## Timing

**6–7 minutes** (Tier 3, slides + simplified demo)

| Segment | Time | Notes |
|---------|------|-------|
| Problem table | 1 min | Upfront retrieval waste is the hook |
| Solution + ASCII | 2 min | Walk confident/uncertain/grounded line by line |
| Architecture diagram | 1 min | Loop runs per sentence, not per query |
| Fintech table | 1 min | Two triggers in four sentences = concrete payoff |
| Tradeoffs | 0.5 min | Complexity ★★★★★ — research-grade |
| Transition | 0.5 min | Deliver transition line |

---

## Framing

> “Every pattern so far retrieves before generating. FLARE inverts this: generate first, retrieve only when uncertain. For long-form outputs where most sentences are confident, this is more precise and less wasteful. The cost: complexity and significant latency.”



---

## Live Demo (simplified)

Run `demo.ipynb` Cell 4 — a simplified FLARE loop:

1. Query: *"Write a 3-paragraph risk summary for our Q3 credit portfolio."*
2. Generate sentence 1 — confident → accepted.
3. Generate sentence 2 — uncertain span flagged (specific ratio or threshold).
4. Retrieve on uncertain span → show retrieved chunk.
5. Regenerate sentence 2 with context → grounded figure.
6. Show generation log: which sentences triggered retrieval.

Note: the notebook uses prompt-based uncertainty detection (log-probabilities unavailable in the Anthropic API).

---

## Anticipated Questions

**"How do you detect uncertainty without token probabilities?"**
Three approaches: (1) a prompt asking the model to list uncertain facts — used in the notebook; (2) hedging language (“approximately”, “I believe”) as a heuristic; (3) model rates confidence 1–5 per sentence. None matches log-probabilities, but approach (1) is reliable for factual claims.

**"When would you use this over standard RAG?"**
When long outputs need retrieval for only a fraction of sentences — regulatory summaries, risk narratives. For short answers, standard RAG is faster.

**"Is this production-ready?"**
Not in full form. The loop, uncertainty detection, and context management are complex. Most teams use a lighter version: generate a full draft, identify weak sentences, retrieve for those, revise. 80% of the benefit at a fraction of the complexity.

---

## Transition to Module 09

> “FLARE adapts when to retrieve — firing during generation when the model is uncertain. Ensemble RAG adapts how to combine — parallel strategies, merged results. Sequential and conditional vs. parallel and additive.”
