import { motion } from 'framer-motion'

const FAQS = [
  { q: 'Which RAG pattern should I start with?' },
  { q: 'How do I choose between Hybrid RAG and Naive RAG?' },
  { q: 'Do I need all 26 patterns for a production fintech system?' },
  { q: 'What API keys are required to run the notebooks?' },
  { q: 'How is this workshop structured for a 90-minute session?' },
  { q: 'Can these patterns be combined or composed?' },
]

export default function FAQSection() {
  return (
    <section id="faq" style={{ borderTop: '1px solid #f1f3f4', padding: '56px 32px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', gap: 0 }}>

        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          style={{ flex: '0 0 220px', paddingRight: 32 }}
        >
          <div style={{ fontSize: 26, fontWeight: 700, color: '#202124', lineHeight: 1.25 }}>
            Frequently<br />asked<br />questions
          </div>
        </motion.div>

        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
          style={{ flex: 1 }}
        >
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid #f1f3f4',
                padding: '16px 0',
                cursor: 'default',
              }}
            >
              <span style={{ fontSize: 14, color: '#202124', fontWeight: 400 }}>{faq.q}</span>
              <span style={{ fontSize: 18, color: '#9aa0a6', marginLeft: 16, flexShrink: 0 }}>›</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
