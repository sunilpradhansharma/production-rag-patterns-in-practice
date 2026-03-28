# Module 24: Graph RAG -- Speaker Notes

## Timing

**Total: 8--10 minutes**

| Segment | Time | Notes |
|---------|------|-------|
| Problem framing | 2 min | The counterparty exposure problem lands well -- participants feel the limitation of "find similar chunks" immediately |
| Concept + architecture | 2 min | Emphasise the two parallel paths; the graph traversal path is the new thing |
| Live demo | 4 min | Show graph construction (entity extraction output), then traversal result, then the comparison with vector-only answer |
| Tradeoffs + positioning | 1 min | Be honest about cost: this is the most expensive pattern to build in the repository |

---

## Live Demo Talking Points

**Setup**: Have the notebook at Cell 3 (graph already built from corpus). Print the graph summary: number of nodes, number of edges, a sample of 5--10 entity triples. This anchors the demo -- participants need to see what the graph contains before they see it being queried.

1. Show the entity extraction output from Cell 3. Pick one interesting triple: "Delta Fund --[HOLDS_CDS_REFERENCING]--> Acme Bank". Read it aloud. "This relationship was assembled from two separate sentence fragments in different chunks. Vector search would never surface it as a single fact."
2. Show the graph traversal in Cell 4. Print the query entity ("Acme Bank"), the traversal path, and the list of related entities with their edge labels. "The graph answered 'who is connected' before we ever ran a vector search."
3. Show the vector search result alongside. Show what it retrieved. Then show the merged context. "The merger combines both: the structural map from the graph and the passage detail from vector search."
4. Show the final answer. Contrast with the vector-only baseline from Cell 5. "The vector-only answer can tell you about Acme Bank's policies. The graph-augmented answer can tell you about Acme Bank's network."

**The moment to land**: "Standard RAG asks 'what chunks are relevant?' Graph RAG asks two questions: 'what chunks are relevant?' and 'what entities are related and how?' That second question is structurally unanswerable by embeddings alone. The graph makes it answerable."

---

## Anticipated Q&A

**Q: Do I need a graph database like Neo4j for this?**
For demos and small corpora (under 10,000 entities), `networkx` in Python is sufficient. It runs in-memory, requires no infrastructure, and is easy to inspect. For production use with large corpora or concurrent users, Neo4j is the right choice: it supports persistent storage, Cypher query language, index optimisation, and distributed operation. The notebook uses `networkx` specifically to keep the demo self-contained. The transition to Neo4j is a storage swap -- the entity extraction and traversal logic is identical.

**Q: How do I handle the same entity named differently across documents?**
Entity disambiguation is the hardest part of graph construction. The minimum viable approach: lowercase normalisation and removal of legal suffixes ("Inc.", "Ltd.", "plc"). The next level: build an alias dictionary for your domain (e.g., "GS" → "Goldman Sachs") and apply it during extraction. The production approach: use a dedicated entity resolution model or a canonical entity database (LEI codes for legal entities, CUSIP/ISIN for instruments). The notebook shows the minimum viable approach with an alias dictionary.

**Q: How expensive is graph construction?**
At Claude Haiku pricing (~$0.25/M input tokens), a 1,000-chunk corpus with average 500 tokens per chunk costs roughly $0.13 for entity extraction. The latency is the bigger concern: 1,000 sequential Haiku calls. Use `asyncio` with a concurrency limit of 10--20 to parallelize extraction and bring build time from minutes to seconds. The notebook demonstrates the async extraction pattern in Cell 3.

**Q: What is a "community" in the Microsoft Graph RAG paper?**
Edge et al. partition the graph into communities using the Leiden algorithm (a community detection algorithm that finds densely connected subgraphs). Each community is then summarised with an LLM call, and these community summaries become an additional retrieval layer for global, thematic questions. The notebook implements the local traversal path (neighbours + paths); the community summary layer is the "global query" extension from the paper and is noted as a stretch goal. For most fintech use cases, local traversal is sufficient.

**Q: How do I keep the graph current as documents change?**
Graph staleness is a real operational problem. The recommended approach: store the source chunk ID on every edge. When a chunk is updated or deleted, invalidate all edges sourced from that chunk and re-run extraction on the updated chunk. This is incremental re-extraction rather than a full rebuild. For documents that change frequently, consider whether the graph construction cost is justified or whether a simpler pattern (Hybrid RAG, Multi-Hop RAG) would serve better.

---

## Transition to Next Module

> "Graph RAG excels at entity relationships -- the who-is-connected-to-whom questions that live in the structure of your documents. But some documents aren't text at all. They're charts, diagrams, tables, floor plans. The question 'what does this chart show?' can't be answered by any text-based retrieval pattern. Module 25 -- Multimodal RAG -- handles images and visual content alongside text, so you can query the full document, not just the words."

*Advance to Module 25: Multimodal RAG.*

---

## Common Delivery Mistakes

- **Don't skip the entity triple printout.** Participants need to see what the graph contains before they can appreciate what graph traversal adds. Print 5--10 sample triples from the built graph before running any queries. A graph is abstract until you show the edges.
- **Don't demo with a simple entity query.** "Tell me about Acme Bank" is not a graph query -- it's a lookup that vector search handles equally well. Use the counterparty exposure query in Cell 4, which genuinely requires traversing two hops and aggregating relationships across multiple edges.
- **Do contrast with vector-only explicitly.** Show the vector-only baseline answer alongside the graph-augmented answer in Cell 5. The gap is the demonstration. Without the comparison, the pattern looks like expensive standard RAG.
- **Be honest about build cost.** This is the most expensive pattern to build in the repository. Don't undersell the construction overhead. The appropriate framing: "You build this once for a corpus that changes slowly, not for a streaming document pipeline."
- **Don't over-promise on Neo4j.** The demo uses `networkx`. If a participant asks about production deployment, explain the Neo4j path clearly -- but don't imply that the demo is production-ready as written. The algorithmic patterns transfer; the infrastructure does not.
