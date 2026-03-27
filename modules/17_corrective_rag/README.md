# Module 17: Corrective RAG — Speaker Notes

## Timing

**8–10 minutes total** — live demo recommended; the fallback firing is the key moment

| Segment | Time | Notes |
|---------|------|-------|
| Problem slide | 1.5 min | Both failure modes — irrelevant and stale — read explicitly |
| Solution + architecture | 2 min | Walk three branches; say "deterministic routing on the grade" |
| Live demo | 3 min | Show grader failing on internal docs, then web result coming back |
| Tradeoffs | 1 min | Emphasise: most practical self-correction pattern in production |
| Transition | 0.5 min | Deliver transition line; set up Module 20 |

---

## Framing

Open with the contrast from Module 16:

> "Self-RAG tells us when retrieval fails. CRAG acts on it — go get better information. That's why it's the most practical self-correction pattern: it fixes the most common production failure mode."

---

## Live Demo

**Query:** *"What is the current Dodd-Frank reporting threshold for swap dealers?"*

Run `demo.ipynb` from Cell 3:

1. **Grader** — point to Incorrect: "This doc predates the CFTC amendment. The grader can't answer from it."
2. **Fallback fires** — "Instead of generating from a stale doc, it goes to the source."
3. **Refinement** — show raw vs refined: "Refinement strips nav menus and boilerplate."
4. **Answer** — read the cited threshold; contrast with what the stale doc would have said.

If Tavily key is absent, notebook uses a mock result — "In air-gapped environments, CRAG degrades to abstain."

---

## Anticipated Questions

**"What if web search also fails?"**
Return "no confident answer" — fallback chain is corpus → web → abstain. Rare for factual regulatory queries in practice.

**"Isn't this just routing to a search engine?"**
Two differences: grading means web only fires when needed; refinement cleans results before generation. Raw snippets produce worse answers than internal docs.

**"How do you stop the grader from always triggering fallback?"**
Above 25–30% fallback rate on a well-maintained corpus means the grader is too strict. Log rates — a spike signals the index needs updating.

---

## Transition to Module 20

> "CRAG and Self-RAG both react after retrieval. What if we chose the right strategy before — route simple queries to the corpus, complex ones to multi-step retrieval, skip retrieval when the model already knows? Let's tie it together with adaptive routing."
