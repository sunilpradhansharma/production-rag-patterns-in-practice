# Module 23: Multi-Hop RAG — Speaker Notes

## Timing

**8–10 minutes** (Tier 2, optional live demo)

| Segment | Time | Notes |
|---------|------|-------|
| Problem table | 1.5 min | Third row (Basel IV) resonates with regulatory audience |
| Solution + ASCII | 2 min | Walk each hop — chain structure is the core idea |
| Architecture | 1 min | Loop back to E1 — same extractor, new docs |
| KYC fintech table | 2 min | Each row = one ownership layer revealed |
| Tradeoffs | 1 min | Latency ★★☆☆☆ — not a fast pattern |
| Transition | 0.5 min | Deliver transition line |

---

## Framing

> "Standard RAG answers questions where the answer is in a document. Multi-Hop RAG answers questions where the answer requires connecting documents — A tells you what to look for in B, B tells you what to look for in C. The bridge isn't in the query. It's in what you retrieve."

Position for compliance contexts where ownership chains and citation references are the norm.

---

## Live Demo (optional)

Run `demo.ipynb` Cell 4:

1. Query: *"What sanctions rules apply to the UBO of TechCorp?"*
2. **Hop 1** — retrieve "TechCorp" → bridge: parent company name.
3. **Hop 2** — retrieve parent → bridge: UBO individual.
4. **Hop 3** — retrieve UBO + sanctions data → designation confirmed.
5. **Synthesiser** — answer citing each hop. Show `path_tracker` chain.

---

## Anticipated Questions

**"How many hops is typical?"**
Two to four. KYC chains run two to three (entity → parent → UBO). Regulatory citation chains reach four. Beyond that, latency and reliability degrade. Set `MAX_HOPS` as a hard ceiling.

**"What if bridge extraction fails mid-chain?"**
Synthesise from accumulated context and flag uncertainty. Rising per-hop failure rates signal entity normalisation issues.

**"How is this different from an agent doing multiple searches?"**
An agent decides when to hop and what to search — flexible but unpredictable. Multi-Hop RAG has a fixed loop, explicit path tracking, and a hard limit — preferable for auditable compliance work.

---

## Transition to Module 24

> "Multi-Hop RAG follows linear paths — each hop extracts one bridge entity and moves to the next document. Graph RAG maps the full entity network at index time, so query-time traversal needs no bridge extraction. Following signs vs. navigating with a map."
