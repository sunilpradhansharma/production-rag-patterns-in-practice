import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { GITHUB_URL } from '../lib/constants.js'
import { HeroOrbs } from '../components/BackgroundEffects.jsx'

const STATS = [
  { value: '26',  label: 'RAG Patterns' },
  { value: '6',   label: 'Categories' },
  { value: '26',  label: 'Notebooks' },
  { value: '90m', label: 'Workshop' },
]

const BADGES = [
  { label: 'Naive → Agentic',  color: '#38bdf8', dim: 'rgba(56,189,248,0.1)' },
  { label: 'Fintech-First',    color: '#a78bfa', dim: 'rgba(167,139,250,0.1)' },
  { label: 'Production Ready', color: '#34d399', dim: 'rgba(52,211,153,0.1)' },
]

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '128px 24px 96px',
        position: 'relative',
      }}
    >
      <HeroOrbs />

      <div style={{ maxWidth: 800, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        {/* Badge row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}
        >
          {BADGES.map(b => (
            <span key={b.label} style={{
              fontSize: 11, fontWeight: 600,
              letterSpacing: '0.09em', textTransform: 'uppercase',
              color: b.color, background: b.dim,
              border: `1px solid ${b.color}28`,
              padding: '5px 14px', borderRadius: 20,
            }}>
              {b.label}
            </span>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.16 }}
          style={{
            fontSize: 'clamp(2.8rem, 7vw, 4.6rem)',
            fontWeight: 800, lineHeight: 1.06,
            letterSpacing: '-0.035em',
            marginBottom: 24,
          }}
        >
          <span style={{
            background: 'linear-gradient(150deg, #f8fafc 0%, #e2e8f0 45%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            RAG Patterns
          </span>
          <br />
          <span style={{
            background: 'linear-gradient(130deg, #38bdf8 0%, #7dd3fc 50%, #bae6fd 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            in Practice
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.26 }}
          style={{
            fontSize: 'clamp(1rem, 2.4vw, 1.18rem)',
            color: '#64748b', lineHeight: 1.7,
            maxWidth: 580, margin: '0 auto 42px', fontWeight: 400,
          }}
        >
          A hands-on workshop covering all{' '}
          <span style={{ color: '#94a3b8', fontWeight: 500 }}>26 production RAG patterns</span>
          {' '}— from Naive to Agentic — with runnable notebooks and real-world fintech examples.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 72 }}
        >
          <a href="#patterns" className="btn-primary" style={{ textDecoration: 'none', fontSize: 14 }}>
            Explore All Patterns
            <ArrowRight size={15} strokeWidth={2.5} />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank" rel="noopener noreferrer"
            className="btn-secondary"
            style={{ textDecoration: 'none', fontSize: 14 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            View on GitHub
          </a>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.44 }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12, maxWidth: 640, margin: '0 auto',
          }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.48 + i * 0.06 }}
              style={{
                padding: '20px 12px 16px', textAlign: 'center',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.028) 100%)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderTop: '1px solid rgba(255,255,255,0.13)',
                borderRadius: 12,
                boxShadow: '0 1px 0 rgba(255,255,255,0.055) inset, 0 4px 20px rgba(0,0,0,0.22)',
              }}
            >
              <div style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
                fontWeight: 800, letterSpacing: '-0.025em',
                background: 'linear-gradient(135deg, #38bdf8, #7dd3fc)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                lineHeight: 1, marginBottom: 7,
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: '#475569', fontWeight: 500, letterSpacing: '0.04em' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          style={{ marginTop: 64, display: 'flex', justifyContent: 'center' }}
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ cursor: 'pointer' }}
            onClick={() => document.getElementById('recommender')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <svg width="18" height="26" viewBox="0 0 18 26" fill="none">
              <rect x="1" y="1" width="16" height="24" rx="8" stroke="rgba(148,163,184,0.25)" strokeWidth="1.2"/>
              <motion.rect
                x="8" y="5.5" width="2" height="5" rx="1" fill="rgba(148,163,184,0.3)"
                animate={{ y: [0, 4, 0], opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
