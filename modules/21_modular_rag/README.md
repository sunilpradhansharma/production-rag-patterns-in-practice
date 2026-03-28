# Module 21: Modular RAG — Speaker Notes

## Timing

**7–8 minutes** (Tier 2, optional live demo)

| Segment | Time | Notes |
|---------|------|-------|
| Problem table | 1 min | Interface references, not implementations |
| Solution + ASCII | 1.5 min | Dashed arrows = injected, not hardcoded |
| Architecture diagram | 1 min | Same harness, four configs |
| Fintech config table | 1.5 min | Production selection in action |
| Tradeoffs | 1 min | Initial complexity ★★★★☆ is the honest cost |
| Transition | 0.5 min | Deliver transition line |

---

## Framing

> "Every RAG system today is a monolith: retrieve, rerank, generate — one function chain. Fine for a prototype. In production, you need to upgrade the retriever without touching the generator, A/B test a new reranker, and hand each stage to a different team. Modular RAG defines that: protocol interfaces, dependency injection, and a pipeline holding interface references — not concrete classes."

---

## Live Demo (optional)

Run `demo.ipynb` Cell 4–5:

1. Assemble pipeline A: `ChromaRetriever + LLMReranker + HaikuGenerator`.
2. Query: *"What are the Basel III capital adequacy requirements?"*
3. Print `PipelineResult`: chunks retrieved, reranked, answer, per-stage latency.
4. **Swap retriever**: replace `ChromaRetriever` with `BM25Retriever` — one line change.
5. Rerun. Compare: same reranker, same generator, different retrieval.

---

## Anticipated Questions

**"Isn't this overkill for a simple RAG system?"**
Yes — for a prototype. Three functions in a notebook is right. Modular RAG earns its cost in production systems that run for months and are owned by more than one team. The overhead pays off the first time you swap a component without a coordinated deployment.

**"How do you define the interface without leaking implementation details?"**
Design shared types first: `RetrievedChunk` must carry everything downstream needs — `text`, `score`, `metadata`. If a module needs a field not in the type, the type is wrong. Fix the contract before writing any implementation.

**"How does this relate to LangChain's LCEL?"**
LCEL is one implementation — runnables with a common interface. The concept is not framework-specific; plain Python `Protocol` classes work equally well.

---

## Transition to Module 22

> "Modular RAG fixes the pipeline structure and makes every stage swappable. Agentic RAG removes the fixed structure entirely — the agent decides which tools to call, in what order, based on what the query needs. That's next."
