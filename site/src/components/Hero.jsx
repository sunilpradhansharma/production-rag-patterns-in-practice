import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Star, GitBranch, Layers } from 'lucide-react'

const STATS = [
  { value: '26', label: 'RAG Patterns', icon: Layers },
  { value: '6', label: 'Categories', icon: GitBranch },
  { value: '26', label: 'Notebooks', icon: BookOpen },
  { value: '90min', label: 'Workshop', icon: Star },
]

const TIER_BADGES = [
  { label: 'Naive → Agentic', color: '#38bdf8' },
  { label: 'Fintech Examples', color: '#a78bfa' },
  { label: 'Production Ready', color: '#34d399' },
]

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
      }}
    >
      {/* Focal glow behind hero */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 400,
          background: 'radial-gradient(ellipse, rgba(14,165,233,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 860, width: '100%', textAlign: 'center', position: 'relative' }}>
        {/* Tier badges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}
        >
          {TIER_BADGES.map(badge => (
            <span
              key={badge.label}
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: badge.color,
                background: `${badge.color}18`,
                border: `1px solid ${badge.color}33`,
                padding: '4px 12px',
                borderRadius: 20,
              }}
            >
              {badge.label}
            </span>
          ))}
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: 20,
          }}
        >
          <span className="gradient-text">RAG Patterns</span>
          <br />
          <span style={{ color: '#f1f5f9' }}>in Practice</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#94a3b8',
            lineHeight: 1.65,
            maxWidth: 620,
            margin: '0 auto 36px',
          }}
        >
          A hands-on workshop covering all{' '}
          <span style={{ color: '#38bdf8', fontWeight: 600 }}>26 production RAG patterns</span>
          {' '}— from Naive to Agentic — with runnable notebooks, architecture diagrams, and real-world fintech examples.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 60 }}
        >
          <a href="#patterns" className="btn-primary" style={{ textDecoration: 'none' }}>
            Explore Patterns
            <ArrowRight size={16} />
          </a>
          <a
            href="https://github.com/sunilpradhansharma/production-rag-patterns-in-practice"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            View on GitHub
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            maxWidth: 700,
            margin: '0 auto',
          }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.07 }}
              className="glass-card"
              style={{ padding: '18px 12px', textAlign: 'center' }}
            >
              <div
                style={{
                  fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#38bdf8',
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500, letterSpacing: '0.03em' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{ marginTop: 56, display: 'flex', justifyContent: 'center' }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ color: '#334155', cursor: 'pointer' }}
            onClick={() => document.getElementById('recommender')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
              <rect x="1" y="1" width="18" height="26" rx="9" stroke="currentColor" strokeWidth="1.5"/>
              <motion.rect
                x="9" y="6" width="2" height="6" rx="1" fill="currentColor"
                animate={{ y: [0, 4, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
