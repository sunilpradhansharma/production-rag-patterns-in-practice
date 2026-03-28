# 01: Naive RAG — The Baseline

---

## What it is

Naive RAG is the simplest complete RAG pipeline: chunk your documents, embed each chunk,
store the embeddings, then at query time retrieve the most similar chunks and pass them
to an LLM to generate a grounded answer. It is the baseline every other pattern in this
workshop improves upon. If you have never built a RAG system before, you will have one
running by the end of this demo.

---

## Architecture

![Architecture](architecture.png)

**Indexing (offline):** Documents → chunk → embed → vector store

**Query (online):** Question → embed → similarity search → top-k chunks → LLM → answer

---

## Key insight

> Naive RAG **combines parametric knowledge** (what the LLM learned during training)
> with **non-parametric knowledge** (your documents, retrieved at inference time).
>
> The LLM handles language. The retriever handles facts. Neither has to do both.

---

## Fintech use case — Policy FAQ

**Scenario:** A junior underwriter asks: *"What is the minimum FICO score for a personal loan?"*

The system:
1. Embeds the question
2. Retrieves the eligibility table from the loan policy document
3. Generates a cited answer in < 2 seconds

No fine-tuning. No retraining. Policy updates take effect the moment you re-index.

---

## Tradeoffs

| Dimension | Rating | Why it matters |
|-----------|--------|----------------|
| Retrieval quality | ★★☆☆☆ | No reranking; vocabulary drift hurts |
| Latency | ★★★★☆ | One embed call + one LLM call |
| Cost | ★★★☆☆ | Cheap to run; indexing is a one-time cost |
| Complexity | ★★☆☆☆ | Four components, well-documented defaults |

**Bottom line:** Use Naive RAG to prove the concept. The next five patterns fix its weaknesses.
