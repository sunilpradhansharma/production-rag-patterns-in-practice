# Module 06: HyDE — Speaker Notes

## Timing

**5–6 minutes total** — tight and punchy; the idea lands fast

| Segment | Time | Notes |
|---------|------|-------|
| Problem + insight slides | 2 min | Pause after the embedding gap — let it register |
| Architecture walkthrough | 1 min | Move quickly; the diagram is simple |
| Live demo | 1.5 min | Show hypothesis text, then retrieval improvement |
| Tradeoffs + transition | 1 min | One crisp warning, then move on |

---

## Framing

Open with contrast to heavier patterns:

> "Every pattern so far improved the index or retrieval signal. HyDE asks: what if we never embed the query? We generate what the answer looks like and search for that instead. Remarkably effective — about 15 lines of code."

---

## Live Demo

**Query:** *"What factors increase credit default risk?"* — Run Cell 3.

1. Read 2–3 sentences of the hypothesis aloud. Ask: "Does this sound like a loan policy document?" That's the entire mechanism.
2. Compare top-1 plain vs HyDE. HyDE should be more specific to risk factors.
3. Point to the discard step — the hypothetical never appears in the final answer.

If results look identical, shift to Cell 5's cosine distance table — the hypothetical vector's similarity score will be higher than the query vector's.

---

## Anticipated Questions

**"What if the hypothetical is factually wrong?"**
Fine — it only needs to be stylistically similar to the corpus. A hallucinated figure still produces a useful embedding if the surrounding vocabulary is correct. Hallucination hurts only if the LLM generates text in the wrong register entirely.

**"Doesn't this add latency on every query?"**
Yes — one LLM call before retrieval (~300–500ms with Haiku). Acceptable for compliance and research; too slow for real-time interfaces. Route queries to bypass HyDE on hard latency budgets.

**"Why not just rewrite the query?"**
Query rewriting (Module 02) produces better query variants — still short, still question-form. HyDE generates a full document-length passage in the corpus's style. The difference shows most on long-form regulatory documents.

---

## Transition to Module 16

> "HyDE improves what we search for. But what if the retrieved documents aren't relevant — and the system doesn't know that? Self-RAG adds reflection: the model evaluates whether what it retrieved is good enough, and decides what to do if it isn't."
