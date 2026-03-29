/**
 * Source of truth: README.md › "Fintech use cases"
 *
 * The four primary domain sections (Regulatory compliance, Credit and lending,
 * Document intelligence, Risk and counterparty) are taken verbatim from the
 * README, including the specific problem ↔ pattern ↔ reason mapping.
 *
 * Two additional domains (KYC/AML, Fraud Investigation) are present in the
 * README under the "RAG vs Agentic AI" section. Conservative inference was
 * used only for their icon and color assignments — all problem/pattern/reason
 * entries are from the repo.
 */

export const USE_CASES = [
  {
    domain: 'Regulatory Compliance',
    icon: 'Shield',
    color: '#3730A3',
    colorDim: 'rgba(55,48,163,0.08)',
    // README: "Every module uses the same synthetic fintech corpus — Basel III
    // regulatory text, ISDA contract excerpts, earnings reports..."
    description: 'Basel III, ISDA agreements, MiFID II, Dodd-Frank. The shared sample corpus ships with the repo.',
    // From README › "Regulatory compliance" table
    examples: [
      { problem: '"What does Basel III say about CET1 minimums?"',            pattern: 'Hybrid RAG (03)',    why: '"CET1" is an exact term; BM25 finds it reliably' },
      { problem: '"What was the leverage ratio before the 2019 amendment?"',   pattern: 'Temporal RAG (26)', why: 'Point-in-time query across version chain' },
      { problem: '"Is this loan application compliant with all rules?"',       pattern: 'IRCoT (18)',        why: 'Each rule requires a separate retrieval step' },
      { problem: '"Map all obligations that apply to this counterparty"',      pattern: 'Graph RAG (24)',    why: 'Obligation chains are relational, not keyword-searchable' },
    ],
    patterns: ['Hybrid RAG', 'Temporal RAG', 'IRCoT', 'Graph RAG'],
  },
  {
    domain: 'Credit & Lending',
    icon: 'CreditCard',
    color: '#34d399',
    colorDim: 'rgba(52,211,153,0.08)',
    // README corpus: "internal loan policy documents"
    description: 'Loan eligibility, underwriting rules, covenant extraction, and policy audit trails.',
    // From README › "Credit and lending" table
    examples: [
      { problem: '"What FICO score do I need for a personal loan?"',           pattern: 'Naive RAG (01) or Hybrid RAG (03)', why: 'Simple factual lookup' },
      { problem: '"Does this HELOC application meet all eligibility criteria?"', pattern: 'Corrective RAG (17)', why: 'Self-verifies before returning an answer' },
      { problem: '"What was the underwriting policy on the date this loan was approved?"', pattern: 'Temporal RAG (26)', why: 'Audit requires point-in-time accuracy' },
      { problem: '"Extract all covenants from this loan agreement"',           pattern: 'Contextual RAG (13)', why: 'Dense legal text; each clause needs document context' },
    ],
    patterns: ['Naive RAG', 'Corrective RAG', 'Temporal RAG', 'Contextual RAG'],
  },
  {
    domain: 'Document Intelligence',
    icon: 'FileText',
    color: '#a78bfa',
    colorDim: 'rgba(167,139,250,0.08)',
    // README corpus: "earnings reports"
    description: 'Earnings reports, fund prospectuses, 10-K filings, and charts that live in PDFs.',
    // From README › "Document intelligence" table
    examples: [
      { problem: '"What does Figure 3 in the earnings report show?"',          pattern: 'Multi-Modal RAG (25)', why: 'Answer is in a chart, not prose' },
      { problem: '"Compare Meridian Bank\'s Q3 guidance vs actual revenue"',   pattern: 'Long-Context RAG (15)', why: 'Entire report fits in 200k-token window' },
      { problem: '"What did the prospectus say about management fees?"',       pattern: 'Parent Document (10)', why: 'Dense PDF; return full section for context' },
      { problem: '"Summarise all risk factors across these 10-K filings"',     pattern: 'RAPTOR (12)',          why: 'Hierarchical synthesis across multiple long docs' },
    ],
    patterns: ['Multi-Modal RAG', 'Long-Context RAG', 'Parent Document', 'RAPTOR'],
  },
  {
    domain: 'Risk & Counterparty',
    icon: 'AlertTriangle',
    color: '#fbbf24',
    colorDim: 'rgba(251,191,36,0.08)',
    description: 'Entity exposure, counterparty networks, mixed query traffic across all risk domains.',
    // From README › "Risk and counterparty" table
    examples: [
      { problem: '"Which entities have exposure to Lehman Brothers?"',         pattern: 'Graph RAG (24)',     why: 'Entity relationship query' },
      { problem: '"Trace UBO from counterparty to jurisdiction to sanctions"', pattern: 'Multi-Hop RAG (23)', why: 'Fixed chain: entity → parent → jurisdiction → obligations' },
      { problem: '"What is the current credit outlook for this issuer?"',      pattern: 'Agentic RAG (22)',   why: 'Requires live web data not in the static corpus' },
      { problem: '"Mixed query traffic across all of the above"',              pattern: 'Adaptive RAG (20)',  why: 'Routes each query to the cheapest capable pattern' },
    ],
    patterns: ['Graph RAG', 'Multi-Hop RAG', 'Agentic RAG', 'Adaptive RAG'],
  },
  {
    domain: 'Fraud Investigation',
    icon: 'Eye',
    color: '#f87171',
    colorDim: 'rgba(248,113,113,0.08)',
    // Source: README "RAG vs Agentic AI" fintech table — "Fraud investigation
    // across data sources → Agentic RAG: Multi-step: pull transactions → check
    // patterns → cross-reference watchlists"
    description: 'Multi-step investigation pulling transactions, checking typologies, and cross-referencing watchlists.',
    examples: [
      { problem: 'Fraud investigation across multiple data sources',           pattern: 'Agentic RAG (22)',  why: 'Multi-step: pull transactions → check patterns → cross-reference watchlists' },
      { problem: 'AML pattern detection across varied terminology',            pattern: 'RAG Fusion (04)',   why: 'Synonym coverage: exposure, liability, suspicious activity' },
      { problem: 'Transaction pattern vs known typologies',                    pattern: 'Self-RAG (16)',     why: 'Compliance answers must cite specific AML regulations' },
      { problem: 'Sanctions screening for correspondent banking',              pattern: 'Ensemble RAG (09)', why: 'Multi-source: FINRA + SEC + CFTC simultaneously' },
    ],
    patterns: ['Agentic RAG', 'RAG Fusion', 'Self-RAG', 'Ensemble RAG'],
  },
  {
    domain: 'KYC / AML',
    icon: 'UserCheck',
    color: '#fb923c',
    colorDim: 'rgba(251,146,60,0.08)',
    // Source: README "RAG vs Agentic AI" table — "KYC/AML due diligence →
    // Agentic RAG: Entity resolution across multiple databases; variable path"
    description: 'Customer due diligence, beneficial ownership tracing, and sanctions compliance with variable reasoning paths.',
    examples: [
      { problem: 'KYC/AML due diligence across multiple databases',           pattern: 'Agentic RAG (22)',   why: 'Entity resolution across multiple databases; variable path' },
      { problem: 'Trace UBO: individual → company → UBO → sanctions list',    pattern: 'Multi-Hop RAG (23)', why: 'KYC chain requires fixed multi-hop retrieval' },
      { problem: 'Regulatory Q&A needing verified current sanctions rules',   pattern: 'Corrective RAG (17)', why: 'Falls back to web search if internal docs are outdated' },
      { problem: '"What sanctions screening requirements apply to correspondent banking?"', pattern: 'Ensemble RAG (09)', why: 'Multi-regulator: demo query from Module 09' },
    ],
    patterns: ['Agentic RAG', 'Multi-Hop RAG', 'Corrective RAG', 'Ensemble RAG'],
  },
]
