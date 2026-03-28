import { motion } from 'framer-motion'
import { Github, BookOpen, ArrowRight, Star } from 'lucide-react'

const GITHUB_URL = 'https://github.com/sunilpradhansharma/production-rag-patterns-in-practice'
const FIRST_NOTEBOOK = `${GITHUB_URL}/blob/main/modules/01_naive_rag/demo.ipynb`

export default function CTA() {
  return (
    <section style={{ padding: '80px 24px 100px', position: 'relative' }}>
      {/* Glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: 300,
        background: 'radial-gradient(ellipse, rgba(14,165,233,0.09) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Label */}
          <div className="section-label" style={{ marginBottom: 16 }}>Get Started</div>

          {/* Headline */}
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: 18,
            color: '#f1f5f9',
          }}>
            Start building{' '}
            <span className="gradient-text-blue">production RAG</span>
            {' '}today
          </h2>

          <p style={{
            color: '#64748b',
            fontSize: 16,
            lineHeight: 1.65,
            marginBottom: 36,
            maxWidth: 520,
            margin: '0 auto 36px',
          }}>
            All 26 patterns. 26 runnable notebooks. Real fintech data. Production-grade architecture.
            Everything you need to ship reliable RAG systems.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
            <a href={FIRST_NOTEBOOK} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none', fontSize: 14 }}>
              <BookOpen size={15} />
              Start with Naive RAG
              <ArrowRight size={14} />
            </a>
            <a href="#patterns" className="btn-secondary" style={{ textDecoration: 'none', fontSize: 14 }}>
              Browse All Patterns
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ textDecoration: 'none', fontSize: 14 }}
            >
              <Star size={14} />
              Star on GitHub
            </a>
          </div>

          {/* Footer stat row */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 32,
            flexWrap: 'wrap',
          }}>
            {[
              { value: '26', label: 'Patterns' },
              { value: '26', label: 'Notebooks' },
              { value: '8', label: 'Design Layers' },
              { value: '3', label: 'Learning Paths' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#38bdf8',
                  lineHeight: 1,
                  marginBottom: 4,
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11, color: '#475569', fontWeight: 500, letterSpacing: '0.04em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        style={{
          textAlign: 'center',
          marginTop: 64,
          paddingTop: 28,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          color: '#334155',
          fontSize: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span>RAG Patterns in Practice</span>
          <span>·</span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#38bdf8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
          >
            <Github size={12} />
            GitHub
          </a>
          <span>·</span>
          <span>MIT License</span>
        </div>
      </motion.div>
    </section>
  )
}
