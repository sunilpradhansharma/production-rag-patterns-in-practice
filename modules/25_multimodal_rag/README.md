# Module 25: Multi-Modal RAG -- Speaker Notes

## Timing

**Total: 8--10 minutes**

| Segment | Time | Notes |
|---------|------|-------|
| Problem framing | 1.5 min | The "see Figure 1" example lands immediately — everyone has seen a document that does this |
| Architecture walkthrough | 2 min | Walk the three extraction streams slowly; the vision description step is the key innovation |
| Live demo | 4 min | Show chart extraction output, vision description, retrieval result, then the final answer with chart values |
| Tradeoffs + positioning | 1 min | Honest about cost; frame as "essential for financial document Q&A, not for every RAG system" |

---

## Live Demo Talking Points

**Setup**: Have the notebook at Cell 3 (documents already extracted and indexed). Print the extraction summary: N text chunks, N images, N tables. This anchors the demo — participants need to see what was extracted before they see it being retrieved.

1. Show Cell 3's extraction output. Point to the image list: "We extracted 3 charts from this earnings document. Each chart is now described in text form — watch what that description looks like." Print one vision description in full.
2. Read the description aloud: "Bar chart. X-axis: Q1 through Q4 2024. Y-axis: revenue in billions. Values: Q1 $1.2B, Q2 $1.4B, Q3 $1.6B, Q4 $1.8B. Upward trend." "This text description is what gets embedded. When you query 'Q3 revenue', this description is retrievable because it contains '$1.6B' and 'Q3'."
3. Show Cell 4 executing. Print the retrieval results: which text chunks were retrieved, which image was retrieved (by description), which table row. "The retrieval result is mixed modality: two text chunks and one chart."
4. Show the synthesis call. Emphasise that the API call contains both text blocks and an image block (base64). "Claude receives the text and the actual chart image in the same call. It can read the chart directly and cite specific values."
5. Print the answer. Point to the chart citations: "Q4 revenue of $1.8B..." "Those values came from the chart, not the prose. The text said only 'revenue was strong — see Figure 1.'"

**The moment to land**: "For 24 other patterns in this workshop, if the answer is in a chart, the system fails silently. It retrieves prose around the chart and either guesses or says 'not found.' This is the only pattern where the chart is a first-class retrievable element."

---

## Anticipated Q&A

**Q: What about scanned PDFs? Does this work on scanned documents?**
Scanned PDFs contain no extractable text — every page is a rasterised image. The extraction pipeline needs OCR (Optical Character Recognition) to recover text before chunking. For scanned financial documents, AWS Textract or Google Document AI are the production-grade options — they handle tables, forms, and mixed layouts significantly better than open-source OCR (Tesseract). The vision description approach still works for charts in scanned documents: extract the page image, crop the chart region, run the vision description prompt. Quality depends on scan resolution — 300 DPI minimum for reliable text and chart extraction. The notebook uses a native PDF to avoid the OCR dependency; for production use with scanned documents, add the OCR step before the extraction pipeline.

**Q: Why embed the vision description instead of the raw image bytes?**
Standard vector databases (ChromaDB, Pinecone, Weaviate) store float vectors, not image bytes. To retrieve an image in response to a text query, the image must be represented as a vector in the same embedding space as text. Embedding the raw image bytes directly requires a multimodal embedding model (CLIP, ImageBind) that maps both text and images into the same space. Embedding the vision description is simpler and produces good results: the description is text, so it uses the same embedding model as everything else, and it maps naturally to text queries. The trade-off is that description quality becomes the ceiling for retrieval quality.

**Q: How do you handle very large tables — like a 50-row capital adequacy table?**
Two approaches. First, split large tables into logical sections — if the table has multiple topic blocks (CET1 components, AT1 instruments, Tier 2 instruments), split at topic boundaries and embed each section separately. Second, for tables that need to be queried as a whole, use the full table markdown as a single document — the embedding captures the overall topic even if individual rows aren't independently retrievable. For maximum precision on structured financial tables, consider pairing Multimodal RAG with a structured data query layer (SQL or pandas) for tabular data extracted at index time.

**Q: Can this handle PowerPoint decks and not just PDFs?**
Yes. PowerPoint slides are often the best case for Multimodal RAG: each slide is a discrete unit (natural chunking boundary), slides frequently contain charts without supporting text, and the slide title provides document-level context for the vision description. The `unstructured` library supports `.pptx` extraction. The demo uses PDF, but the extraction pipeline generalises — swap the input format and the rest of the pipeline is identical.

**Q: How many images should you include in the synthesis call?**
Cap at 3 images. Each high-resolution chart can consume 1,000–2,000 tokens in Claude's vision API (billed by image tile). Three images at 1,500 tokens each = 4,500 tokens of image context before any text. With a 1,000-token query, 2,000-token text context, and 800-token answer budget, that fits comfortably inside 8K tokens. Beyond 3 images, synthesis quality starts to decline (the model distributes attention across too many visual elements) and cost climbs sharply. Resize images to 800×600 or smaller before encoding — financial charts remain fully readable at lower resolution.

---

## Transition to Next Module

> "Multi-Modal RAG handles questions whose answers live in charts, tables, and figures — the visual layer of financial documents. But there's one more dimension that all other patterns in this workshop ignore: time. A question like 'How has the regulatory capital requirement changed over the last three years?' isn't just about retrieving the right document — it's about understanding which version of a document was current at which point in time. Module 26 -- Temporal RAG -- builds the time dimension into retrieval so you can query document history, track policy changes, and answer questions about what was true when."

*Advance to Module 26: Temporal RAG.*

---

## Common Delivery Mistakes

- **Don't show only the final answer.** The answer looks identical to a standard RAG answer unless you show the retrieval result that included the chart. Always print the retrieval breakdown: "2 text chunks, 1 chart, 1 table." The mixed modality of the retrieval result is the demonstration.
- **Don't skip the vision description printout.** The vision description is the technical innovation participants take away. If you only show the answer, the pattern looks like "RAG with PDFs." Show the raw description text — especially the numerical values — and explain that this is what gets embedded and retrieved.
- **Do use a query that genuinely requires the chart.** "Summarise the earnings release" can be answered from prose. "What was the Q3 revenue?" requires the chart if the text only says "see Figure 1." Use the chart-dependent query in Cell 4 — it makes the value of the pattern concrete.
- **Be honest about extraction fragility.** PDF extraction is not a solved problem. Native PDFs work well; scanned PDFs require OCR; some PDFs with embedded fonts produce garbled text. Frame the extraction pipeline as "works well for native PDFs, requires additional tooling for scanned documents."
- **Don't over-promise on table parsing.** Off-the-shelf table parsers handle simple tables well and complex tables poorly. Merged cells, multi-row headers, and footnote references are common in regulatory filings and commonly cause parsing errors. Acknowledge this limitation and point to the dedicated table extraction tools mentioned in the SKILL.md.
