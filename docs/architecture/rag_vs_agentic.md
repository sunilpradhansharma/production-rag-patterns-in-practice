# RAG vs Agentic AI — Decision Guide

> When to retrieve, when to reason, and when to let the model act.

---

## The Core Distinction

**RAG** augments a single LLM generation call with retrieved context. The retrieval is deterministic, the action space is fixed (retrieve → generate), and the output is a grounded text response. The system does not make decisions about what to do next.

**Agentic AI** gives an LLM a set of tools and lets it decide which tools to invoke, in what order, and when to stop. The action space is open. The system makes multi-step decisions to accomplish a goal that may not be fully specified upfront.

The distinction matters because they have fundamentally different cost profiles, failure modes, and appropriate use cases.

---

## Decision Flowchart

```
Is the task answering a question from a document corpus?
    │
    ├── YES → Is the answer in the corpus (not requiring external actions)?
    │             │
    │             ├── YES → Use RAG
    │             │         (choose pattern from pattern_selection.md)
    │             │
    │             └── NO  → Does the task require web search, APIs,
    │                        or writing/executing code?
    │                             │
    │                             ├── YES → Use Agentic RAG (Module 22)
    │                             └── NO  → Extend the corpus first,
    │                                        then use RAG
    │
    └── NO  → Is the task a multi-step workflow with branching decisions?
                  │
                  ├── YES → Does each step depend on the result
                  │          of the previous step?
                  │             │
                  │             ├── YES → Use Agentic AI
                  │             └── NO  → Use RAG pipeline or batch processing
                  │
                  └── NO  → Is it a single-turn generation task?
                                │
                                ├── YES → Use LLM without RAG
                                └── NO  → Clarify the task requirements
```

---

## Comparison Table

| Dimension | RAG | Agentic AI |
|-----------|-----|------------|
| **Action space** | Fixed: retrieve → generate | Open: any configured tool |
| **Determinism** | High: same query, same retrieval path | Low: loop structure can vary run-to-run |
| **Latency** | Low–medium (1–3 LLM calls) | High and variable (N tool calls) |
| **Cost** | Predictable per query | Unpredictable; grows with task complexity |
| **Failure mode** | Silent: wrong retrieval, wrong answer | Loud: tool errors, infinite loops, runaway costs |
| **Auditability** | High: retrieved sources are explicit | Medium: tool call traces are inspectable but harder to audit |
| **Best for** | Knowledge retrieval, Q&A, summarisation | Research, automation, tasks requiring actions |
| **Worst for** | Tasks requiring actions or external data | Simple Q&A with a known corpus |

---

## Cost and Complexity at Scale

### RAG cost model

```
cost_per_query = embedding_call + (top_k × chunk_tokens × embed_cost)
                + LLM_call(context_tokens + query_tokens + answer_tokens)

Typical range: $0.001 – $0.01 per query
Scaling: linear with query volume, predictable
```

### Agentic cost model

```
cost_per_task = Σ(tool_calls × tool_cost)
               + Σ(LLM_reasoning_calls × tokens_per_call)

Typical range: $0.01 – $1.00+ per task
Scaling: super-linear with task complexity, unpredictable
```

**Practical implication for fintech**: A compliance Q&A system serving 10,000 queries/day at $0.005 each costs ~$50/day with RAG. The same volume with an agentic system that averages 5 tool calls per task at $0.02 each costs ~$1,000/day. For well-defined, repetitive queries, RAG is almost always the right cost-performance choice.

---

## Fintech Decision Examples

### Use RAG when...

**Regulatory Q&A**
> "What does Basel III say about the leverage ratio requirement?"

The answer is in the corpus. A single retrieval + generation cycle is sufficient. Agentic reasoning adds cost and latency for no quality gain.
→ Pattern: Hybrid RAG + Temporal RAG (for version currency)

**Loan application compliance check**
> "Does this application meet all underwriting requirements?"

Multi-step, but each step retrieves from a known policy corpus. The sub-questions are predictable and the retrieval targets are fixed.
→ Pattern: IRCoT (Module 18) or Multi-Hop RAG (Module 23)

**Earnings report analysis**
> "What was the Q3 revenue trend and how does it compare to guidance?"

The answer is in a fixed set of documents. Cross-document reasoning over a known corpus.
→ Pattern: Long-Context RAG (Module 15) or Multimodal RAG (Module 25)

**Counterparty risk assessment**
> "Which entities are exposed to Lehman Brothers and through what instruments?"

Relational query over a known corpus. The graph structure is pre-built from a fixed document set.
→ Pattern: Graph RAG (Module 24)

---

### Use Agentic AI when...

**Real-time market intelligence**
> "Research the current credit outlook for [company] across all available sources and flag any material changes since last quarter."

Requires: web search for current news, SEC EDGAR lookup, internal database query, synthesis. Action sequence is unknown upfront; intermediate results determine next steps.
→ Pattern: Agentic RAG (Module 22) with web search + internal RAG tools

**Automated regulatory monitoring**
> "Monitor all new regulatory publications, classify each by relevance to our product lines, and create a Jira ticket for any that require a policy update."

Requires: periodic external fetch, classification, conditional action (create ticket or not). The system must decide what to do based on what it finds.
→ Pattern: Agentic AI with scheduled trigger + RAG classification tool

**Complex derivatives structuring**
> "Design a hedging strategy for this portfolio that satisfies our internal risk limits and the applicable regulatory constraints."

Requires: computation, constraint satisfaction, iterative refinement. Not a retrieval problem — it is a reasoning + optimisation problem that requires calling calculation tools.
→ Pattern: Agentic AI with calculation tools + RAG for regulatory constraints

**KYC investigation workflow**
> "Investigate whether this counterparty has any sanctions exposure, beneficial ownership red flags, or adverse media. Produce a risk rating."

Requires: multiple external lookups (sanctions databases, company registries, news APIs), conditional branching (if sanctions hit found → escalate immediately), and synthesis across heterogeneous sources.
→ Pattern: Agentic AI with structured tool chain + Temporal RAG for sanctions database currency

---

## The Hybrid Zone: Agentic RAG

Module 22 (Agentic RAG) occupies the middle ground: it uses an LLM agent loop with a constrained tool set that includes RAG retrieval alongside web search, calculation, and database access. Use it when:

- The primary task is knowledge retrieval, but the corpus does not contain everything needed
- Some queries require external data (current prices, live regulatory feeds) and some do not
- The same system needs to handle both simple Q&A and complex multi-step research

The key constraint: keep the tool set small and well-defined. An agentic system with 20 tools is harder to audit and debug than one with 5. For fintech compliance contexts, prefer a constrained agentic system (known tools, logged actions) over a fully open agent.

---

## Summary Heuristic

| If you can describe the retrieval path upfront... | Use RAG |
|---|---|
| If the retrieval path depends on intermediate results... | Use Agentic RAG |
| If the task requires actions beyond retrieval and generation... | Use Agentic AI |
| If latency and cost must be predictable... | Use RAG |
| If an audit trail of reasoning steps is required... | Use IRCoT or CRAG, not a full agent |
