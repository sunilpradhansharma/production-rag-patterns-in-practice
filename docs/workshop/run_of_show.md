# Workshop Run of Show — 90 Minutes

> Minute-by-minute timing for instructors. All times are cumulative from session start.
> Live demo modules are marked **[DEMO]**. Slides-only modules are marked **[SLIDES]**.

---

## Pre-Session Checklist (T-15 minutes)

- [ ] Open all 5 demo notebooks: `01`, `03`, `13`, `17`, `22`
- [ ] Run Cell 1 in each notebook (installs + env vars loaded — verify no errors)
- [ ] Load corpus in each notebook through Cell 2 (so demo starts at Cell 3)
- [ ] Verify `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` are set in `.env`
- [ ] Test one query end-to-end in `01_naive_rag` to confirm API access
- [ ] Have `docs/architecture/pattern_selection.md` open in a second window
- [ ] Set screen resolution so notebook output is readable from the back of the room
- [ ] Disable notifications

---

## Segment 1 — Foundations (0:00–0:10)

### 0:00 — Opening

> "RAG stands for Retrieval-Augmented Generation. Before we define it, let me show you what it looks like when it goes wrong."

Show a raw LLM call (no retrieval) answering a regulatory question. Point out the hallucinated figure. "This is the problem we're solving today."

---

### 0:02 — Naive RAG **[DEMO]** `01_naive_rag`

**Slides**: Title → The Problem → Architecture → Key Insight (3 slides, ~90 seconds)

**Demo** (start at Cell 3, corpus already loaded):
- Run Cell 3: show embed + store. "Every sentence in the document is now a vector."
- Run Cell 4: show query → retrieve → generate. Print the retrieved chunks with scores.
- Point to the score: "0.82. That's how similar the query is to this chunk in embedding space."
- Print the answer. "Grounded. The citation is right there."
- **30-second contrast**: run the same query on `gpt-4o` without context. "Hallucination. Same model, no context."

**Transition** (0:07):
> "Naive RAG works. But it has a ceiling. The chunks it retrieves are whatever happened to be semantically closest. There's no re-ranking, no query expansion, no consideration of the vocabulary in your documents. Module 02 fixes that systematically."

---

### 0:07 — Advanced RAG **[SLIDES]** `02_advanced_rag`

**Slides**: Architecture (semantic chunking + re-ranking) → Key Insight → Tradeoffs (2 slides, ~2 minutes)

> "Think of Advanced RAG as a checklist of everything Naive RAG was missing: better chunking, a re-ranker to re-score the top-k results, and metadata filtering. These are not new ideas — they're the standard upgrades every production system needs. Modules 04 through 09 each go deeper on one specific piece of this."

**Transition** (0:10):
> "Foundations done. Let's talk about indexing — how you structure documents before you ever run a query."

---

## Segment 2 — Indexing (0:10–0:25)

### 0:10 — Parent Document RAG **[SLIDES]** `10_parent_document`

**Slides**: Problem (chunk too small = no context; chunk too large = low precision) → Architecture → Key Insight (2 slides, ~2 minutes)

> "The key insight: index small chunks for precision, but retrieve the parent document for context. You get both. The child chunk finds the needle; the parent document gives you the haystack it came from."

**Transition** (0:13):
> "Parent Document solves the context problem for standard text. But what if the document's context doesn't survive chunking at all — because the chunk was stripped of the surrounding section heading and document title? That's what Contextual RAG fixes."

---

### 0:13 — Contextual RAG **[DEMO]** `13_contextual_rag`

**Slides**: Title → The Problem → Architecture → Key Insight (3 slides, ~90 seconds)

**Demo** (start at Cell 3):
- Show Cell 3: the contextualisation call. Print one chunk before and after prepending. "Before: 'The minimum ratio is 4.5 percent.' After: 'Basel III CET1 requirement, Section 4.2: The minimum ratio is 4.5 percent.' Same fact. Completely different embedding."
- Run Cell 4: show the retrieval improvement. Print top-3 results with and without contextualisation.
- **The moment to land**: "Anthropic showed a 49% reduction in retrieval failures on their internal benchmark. This is the simplest improvement in this workshop — one extra LLM call per chunk at index time."

**Transition** (0:20):
> "Indexing done. Now the documents are structured well and each chunk has context. The question is: how do you find the right ones? Module 03 — Hybrid RAG — is the most impactful single retrieval improvement."

---

## Segment 3 — Retrieval (0:25–0:40)

### 0:25 — Hybrid RAG **[DEMO]** `03_hybrid_rag`

**Slides**: Title → The Problem (vocabulary mismatch) → Architecture → Key Insight (3 slides, ~90 seconds)

**Demo** (start at Cell 3):
- Show Cell 3: BM25 index + dense index, both built. "Two retrieval paths. Same documents. Different similarity functions."
- Run Cell 4: fire the query. Print BM25 results, dense results, RRF fusion results side-by-side.
- Point to a chunk that ranked 11th in BM25 and 9th in dense but emerged at #3 in the fusion. "Neither retriever thought this was the best match. Together they found it."
- **The moment to land**: "BM25 finds the exact term 'LCR'. Dense finds documents about liquidity. Hybrid finds both. You almost always want both."

**Transition** (0:32):
> "Hybrid RAG is the retrieval foundation. HyDE is the trick you use when the query itself is underspecified — when you don't have the right vocabulary to find what you're looking for."

---

### 0:32 — HyDE **[SLIDES]** `06_hyde`

**Slides**: Title → The Concept → Architecture → Key Insight → Tradeoffs (3 slides, ~3 minutes)

> "HyDE: Hypothetical Document Embeddings. Instead of embedding the query, embed a hypothetical document that would answer the query. The intuition: a document about a topic is closer in embedding space to other documents about that topic than a question about it is."

Show the one-liner: `hypothesis = llm.generate("Write a short document that answers: {query}")`. "That's the core of it. One Haiku call. The rest is standard retrieval."

**Transition** (0:37):
> "Retrieval segment done. We've gone from a simple cosine lookup to a hybrid search with query expansion. The next segment is where retrieval gets smart — where the model doesn't just find documents, it reasons about what it needs."

---

## Segment 4 — Reasoning (0:40–0:55)

### 0:40 — Self-RAG **[SLIDES]** `16_self_rag`

**Slides**: Title → The Problem (retrieval without verification) → Architecture → Key Insight (2 slides, ~2 minutes)

> "Self-RAG teaches the model to ask itself three questions: Do I need to retrieve? Is what I retrieved relevant? Is my answer supported by what I retrieved? Each is a classifier token in the original paper. We implement them as lightweight LLM calls. The model becomes a critic of its own retrieval."

**Transition** (0:43):
> "Self-RAG is passive — it checks, but it doesn't fix. Corrective RAG acts on the check. When the retrieved documents fail the relevance test, CRAG replaces them."

---

### 0:43 — Corrective RAG **[DEMO]** `17_corrective_rag`

**Slides**: Title → The Concept → Architecture → Key Insight (3 slides, ~90 seconds)

**Demo** (start at Cell 3):
- Run Cell 4 with a query where the corpus retrieval is ambiguous. Watch the relevance evaluator fire. Print the score: "0.38 — below threshold. Corrective action triggered."
- Show the web search fallback. Print the web-sourced result. "Different source. Richer context. Same query, better answer."
- Run Cell 4 again with a query the corpus handles well. "0.91 — threshold passed. No web search. Cheaper and faster."
- **The moment to land**: "Two queries, two different paths, one system. The model decided which path to take."

**Transition** (0:50):
> "Self-RAG and Corrective RAG make individual retrievals smarter. Adaptive RAG zooms out — it looks at the query before any retrieval and picks the right strategy from the start."

---

### 0:50 — Adaptive RAG **[SLIDES]** `20_adaptive_rag`

**Slides**: Title → Architecture (query classifier → route) → Tradeoffs (2 slides, ~3 minutes)

> "Adaptive RAG is the orchestration layer. It answers the question: which RAG strategy should I use for this particular query? Simple factual → standard retrieval. Multi-document synthesis → RAPTOR. Needs external data → Agentic. The classifier costs one Haiku call. The routing can save 10× in cost and latency."

**Transition** (0:55):
> "Architecture segment. We've covered the core patterns. Now the two that pull everything together."

---

## Segment 5 — Architecture (0:55–1:10)

### 0:55 — Modular RAG **[SLIDES]** `21_modular_rag`

**Slides**: Title → Architecture (composable pipeline) → Key Insight (2 slides, ~2 minutes)

> "Every pattern we've seen today is a module. Modular RAG is the insight that you can swap them in and out. Temporal filtering is a module. Re-ranking is a module. Self-checking is a module. Your production system is the composition of the modules that fit your use case."

**Transition** (0:58):
> "Agentic RAG is Modular RAG taken to its limit — the model itself decides which modules to invoke."

---

### 0:58 — Agentic RAG **[DEMO]** `22_agentic_rag`

**Slides**: Title → The Concept → Architecture → Key Insight (3 slides, ~90 seconds)

**Demo** (start at Cell 3):
- Show Cell 3: the tool definitions. "Three tools: retrieve from corpus, search the web, run a calculation. The model chooses."
- Run Cell 4: a complex query that requires all three tools. Watch the tool call sequence print.
- Print each tool call: "Corpus retrieval first. Then web search for current data. Then a calculation."
- Show the final answer. Show the tool call trace. "The model assembled the answer. The trace is the audit log."
- **The moment to land**: "This is the most powerful pattern. It is also the most expensive and the hardest to control. Use the patterns earlier in this workshop first. Reach for Agentic RAG when the simpler patterns genuinely cannot do the job."

**Transition** (1:07):
> "Ten patterns, five segments. The remaining 16 patterns are in your repository — each with a full notebook, SKILL.md, and speaker notes. Let's spend the last segment on how to choose between all 26."

---

## Segment 6 — Synthesis (1:10–1:20)

### 1:10 — Pattern Selection **[SLIDES]**

Reference: `docs/architecture/pattern_selection.md`

Walk the decision tree once with a live audience question:
1. Ask for a volunteer to name a real use case they're working on.
2. Walk through the 9-question tree with that use case.
3. Land on the recommended pattern(s).
4. Show the "quick reference card" at the bottom of `pattern_selection.md`.

> "The heuristic I always give: if you're not sure, start with Hybrid RAG and add Temporal RAG if your corpus changes over time. That covers 80% of fintech RAG use cases."

---

### 1:15 — Design Layers **[SLIDES]**

Reference: `docs/architecture/design_layers.md`

Five-minute walk through the 8 layers:
- "Layer 2 (chunking) is where most production failures start."
- "Layer 5 (retrieval strategy) is where these 26 patterns live."
- "Layer 8 (evaluation) is the one teams skip and then regret."

---

## Segment 7 — Q&A (1:20–1:30)

### 1:20 — Open Q&A

Anticipated questions and suggested responses:

| Question | Direction |
|----------|-----------|
| "Which pattern should I use for [specific use case]?" | Walk the decision tree in `pattern_selection.md` live |
| "How much does this cost to run?" | Point to Layer 7 cost models in `design_layers.md`; typical $0.001–$0.01 per query for RAG |
| "What about fine-tuning instead of RAG?" | RAG for grounding; fine-tuning for style/format. They compose. RAG first, fine-tune only if needed. |
| "How do I evaluate quality?" | Layer 8 in `design_layers.md`; RAGAS framework |
| "What if my documents are PDFs?" | Module 25 (Multimodal RAG) for visual content; native text extraction for text-only |
| "Which patterns work with LangChain / LlamaIndex?" | All of them. Each notebook shows the library. |

---

### 1:28 — Close

> "Every pattern in this repository solves a real problem. Start with the simplest pattern that solves your problem. Add complexity only when you have evidence that the simpler pattern is insufficient. The repository is yours — every notebook runs, every SKILL.md explains the tradeoffs. The pattern selection guide will tell you where to start."

Point to the repository URL. Point to `docs/architecture/pattern_selection.md`. Done.

---

## Fallback Plans

**Running 5 minutes behind**: Cut HyDE (06) from slides to summary sentence. Cut Self-RAG (16) entirely — transition directly from Hybrid RAG to Corrective RAG.

**Demo fails (API error)**: Switch to the pre-cached output screenshots in each notebook's Cell 5. Narrate what the output shows rather than running live.

**Audience question runs long**: Offer to continue in the post-workshop Q&A. Keep the main flow moving — the decision tree walkthrough in Segment 6 is the most practically useful content and must not be cut.

**Running 10 minutes ahead**: Add a live walk of Module 18 (IRCoT) — the reasoning trace is visually compelling and takes 3 minutes to demo. Or extend Segment 7 Q&A.
