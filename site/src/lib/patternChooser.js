/**
 * Pattern chooser logic — pure functions, no React imports.
 *
 * Each SIGNAL maps to a set of pattern IDs with relevance weights (1–6).
 * scorePatterns() tallies weights across all active signals, ranks the
 * results, and attaches contextual reasons drawn from SIGNAL_REASONS.
 */

// ─── Signals ─────────────────────────────────────────────────────────────────

export const SIGNALS = [
  {
    id: 'long_docs',
    icon: 'FileText',
    label: 'Long or complex documents',
    hint: 'Contracts, policies, annual reports, multi-section PDFs',
    // Patterns: Parent Doc(10), RAPTOR(12), Contextual(13), Sentence Window(11), Long-Context(15)
    weights: { 10: 4, 12: 4, 13: 3, 11: 3, 15: 2 },
  },
  {
    id: 'keyword_match',
    icon: 'Hash',
    label: 'Exact keyword terms matter',
    hint: "Precise terms like 'Basel III §4.2' or 'ISDA 2002' must match reliably",
    // Patterns: Hybrid(3), RAG Fusion(4), Ensemble(9)
    weights: { 3: 5, 4: 3, 9: 2 },
  },
  {
    id: 'ranking_quality',
    icon: 'BarChart2',
    label: 'Retrieval quality is poor',
    hint: 'Wrong docs retrieved, relevant ones ranked too low, or passages missed',
    // Patterns: HyDE(6), Advanced(2), Multi-Query(5), Step-Back(7)
    weights: { 6: 5, 2: 4, 5: 3, 7: 2 },
  },
  {
    id: 'multi_step',
    icon: 'GitBranch',
    label: 'Multi-step reasoning required',
    hint: 'Answering requires chaining several retrieval or inference steps',
    // Patterns: IRCoT(18), Multi-Hop(23), Agentic(22), Adaptive(20)
    weights: { 18: 5, 23: 4, 22: 3, 20: 2 },
  },
  {
    id: 'entities',
    icon: 'Share2',
    label: 'Entities and relationships are key',
    hint: 'Counterparty networks, ownership chains, regulatory obligation graphs',
    // Patterns: Graph RAG(24), Multi-Hop(23), Multi-Vector(14)
    weights: { 24: 6, 23: 3, 14: 1 },
  },
  {
    id: 'multimodal',
    icon: 'Layers',
    label: 'Tables, charts, or figures in PDFs',
    hint: 'Answers live in charts, structured tables, or images — not prose',
    // Patterns: Multi-Modal(25), Parent Doc(10), RAPTOR(12)
    weights: { 25: 6, 10: 2, 12: 1 },
  },
  {
    id: 'latency_cost',
    icon: 'Zap',
    label: 'Latency or cost must be optimised',
    hint: 'High query volume, strict SLA, or tight per-query token budgets',
    // Patterns: Adaptive(20), Speculative(19), Modular(21), Long-Context(15)
    weights: { 20: 5, 19: 4, 21: 2, 15: 1 },
  },
  {
    id: 'agentic',
    icon: 'Bot',
    label: 'Need tool use or agent loops',
    hint: 'Queries need web search, calculators, or multi-source orchestration',
    // Patterns: Agentic(22), Corrective(17), Adaptive(20), IRCoT(18)
    weights: { 22: 6, 17: 3, 20: 2, 18: 2 },
  },
]

// ─── Contextual reasons ──────────────────────────────────────────────────────
// Key format: `${patternId}_${signalId}`
// Used to generate explanation sentences for each recommended pattern.

const SIGNAL_REASONS = {
  // Hybrid RAG (3)
  '3_keyword_match':     'BM25 catches exact regulatory terms that dense search misses; RRF fuses both signals',
  '3_long_docs':         'Sparse + dense fusion handles large regulatory corpora where both exact terms and context matter',
  // Advanced RAG (2)
  '2_ranking_quality':   'Cross-encoder re-ranking re-scores candidates with full query-document context',
  '2_long_docs':         'Query expansion + context compression handles lengthy source documents',
  // HyDE (6)
  '6_ranking_quality':   'Embedding a hypothetical answer aligns the query vector with document embedding space',
  // Multi-Query RAG (5)
  '5_ranking_quality':   'Multiple phrasings union recall — surfaces documents a single phrasing would miss',
  // RAG Fusion (4)
  '4_keyword_match':     'Multi-query variants with RRF cover exact terms and synonyms simultaneously',
  // Parent Document (10)
  '10_long_docs':        'Small chunks index precisely; full parent sections give the LLM rich generation context',
  '10_multimodal':       'Parent retrieval can target image-bearing sections and return full-page context',
  // RAPTOR (12)
  '12_long_docs':        'Hierarchical clustering enables querying at both specific clause and high-level theme',
  '12_multimodal':       'Tree structure supports summary queries that span visual and textual content',
  // Contextual RAG (13)
  '13_long_docs':        'LLM-prepended context makes each chunk self-contained — 49% fewer retrieval failures',
  // Sentence Window (11)
  '11_long_docs':        'Sentence-level embedding for precision; ±k-sentence window provides LLM generation context',
  // IRCoT (18)
  '18_multi_step':       'Each chain-of-thought sentence can trigger a new retrieval — evidence guides the next reasoning step',
  '18_agentic':          'Structured reasoning chains with interleaved retrieval — a controlled form of agentic RAG',
  // Multi-Hop RAG (23)
  '23_multi_step':       'Bridge-entity chaining: each retrieved document provides the key for the next hop',
  '23_entities':         'Structured hop sequence follows ownership or obligation chains with precision',
  // Agentic RAG (22)
  '22_agentic':          'LLM agent calls retrieve, search, and calculate tools in whatever order the task requires',
  '22_multi_step':       'Agent decides retrieval order dynamically based on intermediate results — not a fixed chain',
  // Adaptive RAG (20)
  '20_latency_cost':     'Query classifier routes simple queries to cheap no-retrieval paths; complex ones to full RAG',
  '20_agentic':          'Adaptive routing can invoke agentic paths only when query complexity justifies the cost',
  '20_multi_step':       'Routes multi-step queries to iterative RAG while keeping straightforward ones cheap',
  // Graph RAG (24)
  '24_entities':         'Knowledge-graph traversal captures entity relationships that pure vector search cannot represent',
  // Multi-Modal RAG (25)
  '25_multimodal':       'Vision-LM describes charts and tables so retrieval can match visual content semantically',
  // Speculative RAG (19)
  '19_latency_cost':     'Small LLM drafts speculatively first; large LLM only validates — reduces median latency',
  // Corrective RAG (17)
  '17_agentic':          'Corrective loop detects bad retrieval and falls back to web search automatically',
  // Long-Context RAG (15)
  '15_latency_cost':     'Eliminates retrieval pipeline complexity — stuff all context into a 200k-token window',
  '15_long_docs':        'Full-document stuffing removes chunk-boundary failures for long regulatory texts',
  // Modular RAG (21)
  '21_latency_cost':     'Modular design enables swapping expensive components for cheaper ones without pipeline rewrites',
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

/**
 * Scores all patterns against the active signals and returns the top 3.
 *
 * @param {string[]} activeSignalIds   - IDs of currently active signals
 * @param {object[]} allPatterns       - PATTERNS array from data/patterns.js
 * @returns {Array<{ pattern, score, reasons }>}
 */
export function scorePatterns(activeSignalIds, allPatterns) {
  if (activeSignalIds.length === 0) return []

  // Accumulate weighted scores across all active signals
  const scores = {}
  for (const signalId of activeSignalIds) {
    const signal = SIGNALS.find(s => s.id === signalId)
    if (!signal) continue
    for (const [idStr, weight] of Object.entries(signal.weights)) {
      const pid = Number(idStr)
      scores[pid] = (scores[pid] || 0) + weight
    }
  }

  // Sort by score descending; break ties by lower pattern ID (lower = more foundational)
  const ranked = Object.entries(scores)
    .map(([idStr, score]) => ({ id: Number(idStr), score }))
    .sort((a, b) => b.score - a.score || a.id - b.id)
    .slice(0, 3)

  return ranked.map(({ id, score }) => {
    const pattern = allPatterns.find(p => p.id === id)

    // Collect up to 2 signal-specific reasons for this pattern
    const reasons = activeSignalIds
      .filter(sid => (SIGNALS.find(s => s.id === sid)?.weights[id] ?? 0) > 0)
      .map(sid => SIGNAL_REASONS[`${id}_${sid}`])
      .filter(Boolean)
      .slice(0, 2)

    // Count how many active signals contributed to this pattern's score
    const matchedCount = activeSignalIds.filter(
      sid => (SIGNALS.find(s => s.id === sid)?.weights[id] ?? 0) > 0
    ).length

    return { pattern, score, reasons, matchedCount }
  })
}
