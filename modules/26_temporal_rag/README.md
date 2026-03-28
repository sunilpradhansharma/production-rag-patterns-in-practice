# Module 26: Temporal RAG -- Speaker Notes

## Timing

**Total: 6--7 minutes**

| Segment | Time | Notes |
|---------|------|-------|
| Problem framing | 1 min | The Basel CET1 example is crisp — three versions, same query, wrong answer from standard RAG |
| Three modes + architecture | 1.5 min | Hard filter, decay, version-aware: name all three, explain the tradeoffs in 30 seconds each |
| Live demo | 3 min | Show before/after query returning different document versions; print effective dates |
| Tradeoffs + final positioning | 1 min | Simplest pattern in the workshop; deliver it as such — "this is the lowest bar to raise your RAG system's temporal accuracy" |

---

## Live Demo Talking Points

**Setup**: Have the notebook at Cell 3 (Basel III corpus indexed with timestamps, supersession chain registered). Print the corpus summary: document IDs, effective dates, superseded status. This grounds the demo — participants need to see the temporal structure of the index before they see it queried.

1. Show the corpus summary from Cell 3. Point to the supersession chain: "doc_2013 superseded by doc_2019, doc_2019 superseded by doc_2023. At any point in time, exactly one document is the active version."
2. Run the version-aware query first: "What is the current CET1 minimum?" Show that only doc_2023 is retrieved. "The 2013 and 2019 circulars are in the index — they scored well semantically — but the version-aware filter suppressed them because they're marked superseded."
3. Run the historical query: "What was the requirement before 2020?" Show that only pre-2020 documents are returned. "Same index, same embeddings, different time filter."
4. Run the comparative query: "How did the requirement change between 2015 and 2023?" Show the two-pass retrieval — before-2015 pass and after-2023 pass. Print both results side by side. "Standard RAG cannot answer this question reliably — it would retrieve whichever version happened to score highest and miss the before/after structure entirely."
5. Show the decay scoring output from Cell 5. Print the `final_score = semantic_score × decay` for two documents: the 2013 and 2023 circulars. "Same semantic similarity. Different decay penalty. The 2023 document wins not because it's more relevant — they're about the same topic — but because it's more recent."

**The moment to land**: "This is the lowest-complexity pattern in this workshop. There is no new retrieval architecture. There is no new LLM call. It's timestamps and a scoring function. If your corpus changes over time and you're not doing this, every answer your system gives is potentially out of date and you have no way to know."

---

## Anticipated Q&A

**Q: How much recency bias does the decay function introduce? Can I tune it?**
Completely tunable via the λ parameter. λ = 0 is no decay at all — identical to standard RAG. λ = 0.001 gives a half-life of about 693 days — a document written two years ago retains about half its effective score. λ = 0.05 gives a 14-day half-life — appropriate for daily rate sheets where last week's prices are nearly irrelevant. λ = 0.005 gives a 140-day half-life — appropriate for internal policy documents that update quarterly. The right approach: start with λ = 0.001 for regulatory text and measure answer quality on a validation set; tune upward if stale documents are still surfacing, downward if important foundational documents are being penalised too heavily.

**Q: What if my documents don't have timestamps?**
Build a timestamp extraction hierarchy and be honest about confidence levels: (1) structured metadata field (highest confidence), (2) date pattern in the document header or first paragraph, (3) filename date pattern, (4) file system modification date (low confidence — may reflect file copy, not content creation), (5) human curation for critical documents. Never silently assign the current date to an undated document — that makes every undated document appear current. Flag documents with low-confidence timestamps and exclude them from version-aware or hard-filter modes; use only semantic similarity for those documents.

**Q: How do you handle a regulation that has never been amended — it's from 2010 but is still current?**
Use `effective_from` and `effective_until` rather than a single creation timestamp. A 2010 regulation that was never amended has `effective_from=2010-01-01`, `effective_until=NULL` (still active). The version-aware filter selects documents where `effective_from <= query_date AND (effective_until IS NULL OR effective_until >= query_date)`. This correctly returns the 2010 document for a current query — its age doesn't make it stale, its `effective_until` being null makes it current. The notebook demonstrates this distinction in Cell 3.

**Q: What happens when a document partially supersedes another?**
Partial supersession (only certain sections of a regulation are amended) is the hard case. There are two practical approaches: (1) chunk at the section level and track supersession per chunk, not per document — more precise but more complex to maintain; (2) keep the full document and add a note in the superseded document's text that "sections 3.2 and 4.1 were amended by [new doc]" — less precise but simpler. For production fintech compliance systems, chunk-level supersession is worth the overhead. For most RAG use cases, document-level supersession is sufficient.

**Q: Is this compatible with the other patterns in the workshop?**
Yes — this is the most composable pattern in the workshop. Temporal filtering is a metadata operation that sits on top of any retrieval strategy. Hybrid RAG + temporal filter, Contextual RAG + version-aware supersession, Adaptive RAG + temporal query routing — all are natural combinations. The temporal metadata fields (`timestamp`, `superseded`, `effective_from`) are just additional ChromaDB metadata keys alongside whatever other metadata your pipeline already uses.

---

## Transition to Next Module

> "That's the final pattern — number 26. You now have the complete toolkit: 26 RAG patterns from the simplest (Naive RAG, one retrieval call) to the most specialised (Graph RAG, Multimodal RAG, Temporal RAG). The question is no longer 'what patterns exist' — it's 'which pattern do I use for my problem?' The next section is the synthesis: a decision framework for choosing the right pattern, and a map of how these patterns compose in production systems."

*Advance to the Pattern Selection Guide and Workshop Synthesis.*

---

## Common Delivery Mistakes

- **Don't frame this as complex.** Temporal RAG is the lowest-complexity pattern in the workshop. Framing it as advanced will make participants think they need a major engineering effort to adopt it. The correct framing: "This is timestamps and a scoring function. You can add it to any existing RAG pipeline in an afternoon."
- **Do show the before/after query explicitly.** The most powerful demonstration is two queries — "what is the current rule?" and "what was the rule before 2020?" — returning different documents from the same index. If you only show one query, the pattern looks like standard RAG with a date filter.
- **Do print the effective dates in the answer.** The synthesis prompt requires the LLM to cite effective dates. If those citations appear in the output, it demonstrates that the temporal provenance has flowed all the way through to the answer — not just the retrieval.
- **Don't skip the decay scoring printout.** The `final_score = semantic_score × decay` table in Cell 5 makes the decay function concrete. Without it, "time-decay scoring" sounds abstract. With it, participants can see exactly how a 10-year-old document with the same semantic similarity as a 1-year-old document scores differently.
- **Frame this as the minimum bar.** Close with the framing from the demo: "If your corpus changes over time and you're not doing temporal RAG, every answer your system gives is potentially out of date and you have no way to know." This is the call to action for the pattern that requires the least effort to implement.
