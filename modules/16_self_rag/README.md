# Module 16: Self-RAG — Speaker Notes

## Timing

**7–8 minutes total**

| Segment | Time | Notes |
|---------|------|-------|
| Problem slide | 1.5 min | Read the three failures; pause after "full confidence" |
| Four tokens table | 1.5 min | Walk row by row; say "no fine-tuning required" |
| Architecture | 1 min | Point to FLAG node — abstain path is mandatory |
| Live demo | 2 min | Show ISREL rejection; read an ISSUP verdict aloud |
| Tradeoffs + transition | 1 min | Deliver latency rating honestly; close with transition |

---

## Framing: Introduce the Reflection Paradigm

> "Every pattern so far improved what goes into generation. Self-RAG changes the question: how does the model know if what it retrieved is any good? That's not a retrieval improvement. That's the model thinking before it speaks."

Pause after "thinking before it speaks." This framing carries through modules 17, 20, and 22.

---

## Live Demo

**Query:** *"Is this transaction pattern consistent with known money laundering typologies?"*

Run `demo.ipynb` from Cell 3. Three moments to call out:

1. **ISREL rejection** — "This doc scored well on cosine similarity but addresses credit risk, not typologies. Without this filter, it contaminates the answer."
2. **ISSUP flag** — "The model couldn't back this claim up. Instead of delivering it silently, it flags it."
3. **ReflectionTrace** — "In regulated environments, this trace goes into the compliance log alongside the answer."

---

## Anticipated Questions

**"How many extra LLM calls does this add?"**
Typically 2–3× baseline. A full pass (five docs, three claims) runs seven to ten calls total. Use Haiku for `Retrieve?` and `ISUSE`; Sonnet for `ISREL` and `ISSUP`. Cost: ~$0.002–0.005 per query.

**"What if the abstain path fires too often?"**
Either the corpus has gaps or ISREL is miscalibrated. Rejection rate above 60% means the critic prompt is too strict — fix retrieval first, then re-tune.

**"Can this work without fine-tuning?"**
Yes — prompted LLM calls approximate the fine-tuned tokens with more latency but no training infrastructure needed.

---

## Transition to Module 17

> "Self-RAG reflects — it knows when retrieval wasn't good enough. But its response is to filter and flag. It doesn't go find better information. Corrective RAG does.
> Self-RAG reflects. Corrective RAG acts on that reflection."

Deliver the last two sentences slowly. The contrast lands the module.
