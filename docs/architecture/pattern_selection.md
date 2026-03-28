# Pattern Selection Guide

> Which of the 26 RAG patterns should you use? Start here.

---

## Primary Decision Tree

Answer the questions in order. Stop at the first match.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. Do you know what kind of query you're handling?                       │
│                                                                          │
│    NO  → Use Adaptive RAG (Module 20) to classify and route queries      │
│    YES → Continue to question 2                                          │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. Does the query involve a specific time period or document version?    │
│                                                                          │
│    YES → Use Temporal RAG (Module 26)                                    │
│          Combine with the appropriate retrieval pattern below            │
│    NO  → Continue to question 3                                          │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. Does the query require understanding relationships between entities?  │
│    ("connected to", "exposed through", "owned by", "regulated by")      │
│                                                                          │
│    YES → Use Graph RAG (Module 24)                                       │
│    NO  → Continue to question 4                                          │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 4. Does the answer exist in an image, chart, table, or visual element?  │
│                                                                          │
│    YES → Use Multimodal RAG (Module 25)                                  │
│    NO  → Continue to question 5                                          │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 5. Does the query require 3+ sequential reasoning steps, each of which  │
│    may need a different document?                                        │
│                                                                          │
│    YES, and chain is dynamic → Use IRCoT (Module 18)                    │
│    YES, and chain is fixed   → Use Multi-Hop RAG (Module 23)            │
│    NO                        → Continue to question 6                   │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 6. Does answering require retrieving from external sources (web, APIs)  │
│    or taking actions beyond retrieval?                                   │
│                                                                          │
│    YES → Use Agentic RAG (Module 22)                                     │
│    NO  → Continue to question 7                                          │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 7. Does the retrieved answer need self-verification or correction?       │
│                                                                          │
│    YES, verify then correct → Use Corrective RAG (Module 17)            │
│    YES, verify only         → Use Self-RAG (Module 16)                  │
│    NO                       → Continue to question 8                    │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 8. Would the entire relevant content fit in the model's context window? │
│                                                                          │
│    YES → Use Long-Context RAG (Module 15) — skip retrieval entirely     │
│    NO  → Continue to question 9                                          │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 9. What is the dominant retrieval challenge?                             │
│                                                                          │
│    Vocabulary mismatch (exact terms not in query) → Hybrid RAG (03)     │
│    Ambiguous or under-specified query             → Multi-Query (05)    │
│         or                                          or HyDE (06)        │
│    Query too abstract, needs step-back             → Step-Back RAG (07) │
│    Multiple independent retrieval strategies       → Ensemble RAG (09)  │
│    Chunks lack document context                    → Contextual RAG (13)│
│    Long documents, context lost in chunks          → Parent Doc (10)    │
│                                                      or Sentence Win (11│
│    None of the above, start simple                 → Advanced RAG (02)  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Query Type → Pattern Map

### By query complexity

| Query type | Example | Recommended pattern(s) |
|------------|---------|------------------------|
| Simple factual lookup | "What is the CET1 minimum?" | Advanced RAG (02) or Hybrid RAG (03) |
| Terminology-heavy lookup | "What does the Basel III LCR require?" | Hybrid RAG (03) — BM25 catches exact terms |
| Ambiguous / broad | "Tell me about capital requirements" | Multi-Query (05) or HyDE (06) |
| Abstract / high-level | "What drives bank solvency risk?" | Step-Back RAG (07) |
| Multi-document synthesis | "Compare the leverage ratio rules across 2015, 2019, 2023" | Temporal RAG (26) + Long-Context (15) |
| Multi-step sequential | "Is this loan application compliant with all underwriting rules?" | IRCoT (18) |
| Bridge entity chain | "What regulations apply to the UBO of this counterparty?" | Multi-Hop RAG (23) |
| Relationship network | "Who is exposed to Lehman Brothers and through what?" | Graph RAG (24) |
| Visual content | "What does the revenue chart show for Q3?" | Multimodal RAG (25) |
| Time-scoped | "What was the rule before the 2023 amendment?" | Temporal RAG (26) |
| Real-time / external | "What is the current credit rating for [entity]?" | Agentic RAG (22) |
| Self-checking | "What does the policy say? Am I sure?" | Self-RAG (16) or Corrective RAG (17) |
| Unknown type | Mixed production traffic | Adaptive RAG (20) |

### By answer location

| Where the answer lives | Pattern |
|------------------------|---------|
| Single chunk, semantically close to query | Advanced RAG (02) |
| Single chunk, vocabulary mismatch | Hybrid RAG (03) |
| Requires surrounding context | Sentence Window (11) or Parent Document (10) |
| Spread across sections of one long document | Long-Context RAG (15) |
| Spread across multiple documents | Multi-Query (05), RAG Fusion (04), or IRCoT (18) |
| In a chart or table | Multimodal RAG (25) |
| In an older document version | Temporal RAG (26) with historical filter |
| In entity relationships | Graph RAG (24) |
| Not in the corpus (requires external retrieval) | Agentic RAG (22) |

---

## Fintech Domain → Pattern Fit

### Regulatory compliance

| Use case | Best pattern | Why |
|----------|-------------|-----|
| Current rule lookup | Hybrid RAG (03) + Temporal RAG (26) | Exact term matching for clause references; version-aware for currency |
| Amendment history | Temporal RAG (26) comparative mode | Before/after queries across document versions |
| Multi-rule compliance check | IRCoT (18) | Sequential sub-questions; each rule check may need different document |
| Obligation mapping | Graph RAG (24) | Rules → entities → obligations are relational, not just text |
| Regulatory monitoring (live) | Agentic RAG (22) | Requires external feed polling + classification |

### Credit and lending

| Use case | Best pattern | Why |
|----------|-------------|-----|
| Underwriting policy lookup | Hybrid RAG (03) | Policy uses specific terminology; BM25 catches exact rule references |
| Multi-criterion eligibility check | IRCoT (18) | Each criterion check may need different policy section |
| Historical policy audit | Temporal RAG (26) | Point-in-time policy for credit decision date |
| Credit risk assessment (multi-document) | RAPTOR (12) or Long-Context (15) | Need both detail (specific covenants) and themes (overall risk profile) |
| Loan application data extraction | Contextual RAG (13) | Prepend document context to each clause for precise retrieval |

### Risk and counterparty

| Use case | Best pattern | Why |
|----------|-------------|-----|
| Counterparty exposure mapping | Graph RAG (24) | Entity relationships are the data; vector search cannot assemble them |
| KYC / UBO resolution | Multi-Hop RAG (23) | Fixed chain: entity → parent → jurisdiction → obligations |
| Systemic risk analysis | Graph RAG (24) + IRCoT (18) | Graph for network; IRCoT for sequential risk reasoning |
| Stress test document Q&A | Long-Context RAG (15) or Hybrid RAG (03) | Depends on whether scenarios fit in context window |
| Real-time risk monitoring | Agentic RAG (22) | Requires live data; not a static corpus problem |

### Document intelligence

| Use case | Best pattern | Why |
|----------|-------------|-----|
| Earnings report Q&A | Multimodal RAG (25) | Revenue trend answers are in charts, not prose |
| 10-K analysis | Long-Context RAG (15) or RAPTOR (12) | Full document context vs hierarchical themes |
| ISDA / derivatives contracts | Parent Document (10) or Hybrid RAG (03) | Long, dense; exact clause retrieval + surrounding context |
| Prospectus fee table lookup | Multimodal RAG (25) | Fee tables need row/column structure preservation |
| Cross-document comparison | RAG Fusion (04) or Multi-Query (05) | Multiple documents, same topic; diverse retrieval improves coverage |
| Policy version comparison | Temporal RAG (26) | Before/after a change date across version chain |

### Market data and pricing

| Use case | Best pattern | Why |
|----------|-------------|-----|
| Current rate context | Temporal RAG (26) with high λ (fast decay) | Rates go stale quickly; yesterday's rate is wrong |
| Pricing model documentation | Contextual RAG (13) | Dense technical docs; each chunk needs document context |
| Trade data Q&A | Hybrid RAG (03) | Exact instrument identifiers (CUSIP, ISIN) need BM25 |
| Market commentary synthesis | Multi-Query (05) or HyDE (06) | Ambiguous queries benefit from query expansion |

---

## Pattern Combinations That Work Well

Some use cases require composing two patterns. These combinations are validated and appear in the modules:

| Combination | Use case | Notes |
|-------------|----------|-------|
| Hybrid RAG (03) + Temporal RAG (26) | Current regulatory Q&A | Hybrid for precision; temporal for version currency |
| Contextual RAG (13) + Hybrid RAG (03) | Dense technical documents | Contextual prepending improves embedding quality; BM25 catches exact terms |
| IRCoT (18) + Hybrid RAG (03) | Multi-step compliance with exact rule references | IRCoT controls the reasoning loop; Hybrid is the retrieval function within each step |
| RAPTOR (12) + Long-Context RAG (15) | Large corpora where both themes and details matter | RAPTOR for indexed retrieval; Long-Context for small subsets that fit the window |
| Graph RAG (24) + Temporal RAG (26) | Counterparty exposure at a point in time | Graph for relationships; temporal for filtering to the relevant date |
| Adaptive RAG (20) + any | Mixed production traffic | Adaptive routes each query to the appropriate pattern |
| Self-RAG (16) + Hybrid RAG (03) | High-stakes compliance answers | Hybrid for retrieval quality; Self-RAG for generation self-checking |

---

## Anti-Patterns: Common Wrong Choices

| Mistake | Why it's wrong | Correct choice |
|---------|---------------|----------------|
| Using IRCoT for a simple lookup | Loop overhead for no quality gain; 5× the cost | Advanced RAG or Hybrid RAG |
| Using Long-Context for a large corpus | Context window overflow; $50+ per query | RAPTOR or Hybrid RAG with good chunking |
| Using Graph RAG when documents have no named entities | Graph construction cost with no graph benefit | Advanced RAG |
| Using HyDE for exact term queries | Hypothesis may introduce wrong terminology | Hybrid RAG (BM25 for exact terms) |
| Using Multimodal RAG for text-only documents | Extraction overhead for no retrieval benefit | Standard text RAG |
| Using Agentic RAG for a fixed corpus | Loop overhead and cost unpredictability | Standard RAG with Multi-Hop or IRCoT |
| Not using Temporal RAG on a versioned corpus | Stale documents surface without warning | Add Temporal RAG — it requires only metadata |
| Using Naive RAG in production | No re-ranking, no hybrid, no context management | At minimum: Advanced RAG with hybrid retrieval |

---

## Quick Reference Card

```
QUERY TYPE                    PATTERN
────────────────────────────────────────────────────────────
Unknown query type          → Adaptive RAG (20)
Simple semantic             → Advanced RAG (02)
Exact terms matter          → Hybrid RAG (03)
Multiple queries needed     → Multi-Query (05) / RAG Fusion (04)
Abstract query              → Step-Back RAG (07) / HyDE (06)
Chunks need more context    → Parent Doc (10) / Sentence Window (11)
Chunks lack doc context     → Contextual RAG (13)
Full doc in window          → Long-Context RAG (15)
Self-verification needed    → Self-RAG (16) / Corrective RAG (17)
Multi-step sequential       → IRCoT (18) [dynamic] / Multi-Hop (23) [fixed]
Routing by query type       → Adaptive RAG (20)
Needs external data         → Agentic RAG (22)
Entity relationships        → Graph RAG (24)
Visual content              → Multimodal RAG (25)
Time-sensitive / versioned  → Temporal RAG (26)
Multiple strategies         → Ensemble RAG (09)
────────────────────────────────────────────────────────────
When in doubt: Hybrid RAG (03) + Temporal RAG (26)
is the best default for most fintech RAG systems.
```
