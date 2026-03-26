# 01: Naive RAG — Speaker Notes

## Timing

**5–7 minutes total.** Live demo recommended for this module — seeing the pipeline run
end-to-end in under 2 seconds is the most effective way to establish the baseline before
showing where it breaks. If you are running behind, the demo can be skipped; the
architecture diagram carries the concept on its own.

| Phase | Time |
|-------|------|
| Slides (concept + architecture) | 2 min |
| Live demo (Cells 1–4) | 3–4 min |
| Transition to Module 02 | 30 sec |

---

## Live demo talking points

Open `demo.ipynb` and run Cells 1–4 in sequence. Narrate as you go.

**Cell 1 (Setup):** "We're using Claude for generation and OpenAI embeddings for retrieval —
the same stack you'd use in production. Everything reads from environment variables; no
keys are hardcoded."

**Cell 2 (Data):** Load `fintech_policy.txt`. Point out that this is a structured internal
policy document — the kind of thing compliance teams actually query daily. Show the word
count. "1,700 words — too long to paste into a prompt reliably. That's why we chunk it."

**Cell 3 (Core):** Run the splitter. Print the first 3 chunks side by side. **Show a
chunk boundary** — find one that cuts mid-sentence or mid-table-row and point it out
explicitly. "This is the thing that will hurt us. We'll fix it in Module 10."

**Cell 4 (Run):** Run the demo query: *"What are the eligibility requirements for a
personal loan?"* Print retrieved chunks with scores. Generate the answer. Highlight two
things: (1) the answer is correct and cited; (2) no reranking happened — we trusted the
raw cosine scores. "It works. But we got lucky with this query."

---

## Anticipated questions

**"Why not just use a larger context window? GPT-4 takes 128k tokens."**

> Three reasons: cost (128k tokens per query is expensive at scale), focus (more context
> dilutes the signal — the model attends to everything equally), and precision (a
> well-retrieved 3-chunk context outperforms a noisy 200-chunk dump). We retrieve to
> *select*, not just to *include*.

**"How do you prevent the model from making things up?"**

> Short answer: Naive RAG doesn't, reliably. The system prompt tells it to cite context
> only, but LLMs still hallucinate when context is thin. The next patterns in this
> workshop address this directly — Corrective RAG (Module 17) grades each retrieved chunk
> before generating, and Self-RAG (Module 16) learns to say "I don't know." Hold that
> thought.

**"What embedding model should I use?"**

> `text-embedding-3-small` is the right default — low cost, 1536 dimensions, strong
> multilingual coverage. For highly domain-specific text (dense regulatory language,
> proprietary product names), consider fine-tuning or swapping to a domain-specific
> encoder. We revisit this in Module 14 (Multi-Vector RAG).

---

## Transition to Module 02

> "Naive RAG works. You just saw it answer a compliance question correctly in under
> two seconds with four components and about 40 lines of code. But look at what we
> didn't do: we didn't rewrite the query, we didn't rerank the results, and we didn't
> check whether any chunk actually contained a good answer. Advanced RAG adds all three.
> Let's see what that buys us."
