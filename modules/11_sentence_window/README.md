# Module 11: Sentence Window — Speaker Notes

## Timing

**6–7 minutes** (Tier 2, optional live demo)

| Segment | Time | Notes |
|---------|------|-------|
| Problem slide | 1 min | The three-row table is self-explanatory — read it aloud |
| Solution + diagram | 2 min | ASCII pipeline: stress "retrieval score earned by sentence, generation uses the window" |
| Architecture | 1 min | Point out MetadataReplacementPostProcessor — it's the non-obvious step |
| Fintech + tradeoffs | 1.5 min | ISDA termination example; hit the window size tuning note |
| Transition | 0.5 min | Deliver transition line |

---

## Framing

> "Standard chunking embeds paragraphs — averaging across every sentence, including irrelevant ones. Sentence Window flips this: embed each sentence for precision, expand to the surrounding window for generation. Precision of sentence retrieval, richness of paragraph context."

Position this for when sentence-level citation is required — contracts, regulatory text, audit trails.

---

## Live Demo (optional)

Run `demo.ipynb` Cell 4. Walk through:

1. **ISDA excerpt** — dense agreement where every sentence is a retrieval target.
2. **Matched sentence** — exact clause retrieved with its retrieval score.
3. **Expanded window** — ±3 surrounding sentences giving full conditional context.
4. **Baseline comparison** — chunk retrieval returns a paragraph with unrelated clauses mixed in; sentence retrieval surfaces only the relevant sentence.
5. **Generated answer** — cites the exact sentence, grounded by the window.

---

## Anticipated Questions

**"What window size should I use?"**
Typically ±2 to ±5. Start at ±3 for prose. Reduce to ±2 for structured lists where adjacent sentences are independent. Increase to ±5 for dense regulatory text. Evaluate on held-out queries before committing.

**"How is this different from Parent Document Retrieval?"**
Parent Document indexes child chunks and returns the parent chunk. Sentence Window indexes sentences and returns the sentence window. Use Sentence Window for sentence-level citation; Parent Document when paragraph-level context is sufficient.

**"Does sentence segmentation matter?"**
Yes. Abbreviations, decimal numbers, and numbered lists break sentence splitters, creating malformed nodes. Validate parsed nodes on a corpus sample and swap in a domain-aware tokeniser for legal text.

---

## Transition to Module 12

> "Sentence Window is horizontal expansion — retrieve a sentence, expand left and right to neighbours. RAPTOR is vertical: it builds a hierarchy of summaries from sentences up to document level, so queries match at any granularity."
