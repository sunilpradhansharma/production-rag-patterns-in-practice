import { useState } from 'react'

const FAQS = [
  {
    q: 'Which RAG pattern should I start with?',
    a: 'Start with Naive RAG (Pattern #01) — it establishes the baseline pipeline every other pattern builds on. Once comfortable, follow the Tier 1 patterns before advancing to Tier 2 and 3.',
  },
  {
    q: 'How do I choose between Hybrid RAG and Naive RAG?',
    a: 'Use Hybrid RAG when keyword precision matters — ticker symbols, regulation codes, product IDs. Naive RAG is sufficient for general semantic queries over unstructured text.',
  },
  {
    q: 'Do I need all 26 patterns for a production fintech system?',
    a: 'No. Most production systems use 3–5 patterns. The Pattern Recommender section helps you pick the right subset for your specific use case, latency budget, and complexity tolerance.',
  },
  {
    q: 'What API keys are required to run the notebooks?',
    a: 'An Anthropic Claude API key is required. Some notebooks optionally support OpenAI. Vector DBs (ChromaDB, Pinecone) have free tiers fully sufficient for the demos.',
  },
  {
    q: 'How is this workshop structured for a 90-minute session?',
    a: 'Tier 1 (30 min): foundational patterns. Tier 2 (40 min): retrieval and reasoning enhancements. Tier 3 (20 min): agentic and specialized patterns. Each tier has a hands-on notebook.',
  },
  {
    q: 'Can these patterns be combined or composed?',
    a: 'Yes — composition is encouraged. HyDE + Hybrid RAG + CRAG is a common production stack for regulated-data fintech applications. The architecture section shows common combinations.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  function toggle(i) {
    setOpenIndex(prev => (prev === i ? null : i))
  }

  return (
    <section id="faq" className="faq-section">
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', gap: 0, width: '100%' }}>

        {/* Left column */}
        <div className="faq-left">
          <div className="faq-heading">
            Frequently<br />asked<br />questions
          </div>
        </div>

        {/* Right column */}
        <div className="faq-right">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`faq-item${openIndex === i ? ' open' : ''}`}
              onClick={() => toggle(i)}
            >
              <div className="faq-row">
                <span className="faq-question">{faq.q}</span>
                <span className="faq-arrow">›</span>
              </div>
              <div className="faq-answer">{faq.a}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
