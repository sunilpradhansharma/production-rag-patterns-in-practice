import { motion } from 'framer-motion'
import { HeroOrbs } from '../components/BackgroundEffects.jsx'

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        background: '#ffffff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '72px 24px 52px',
        position: 'relative',
        textAlign: 'center',
      }}
    >
      <HeroOrbs />

      <div style={{ maxWidth: 800, width: '100%', position: 'relative', zIndex: 1 }}>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          style={{
            fontSize: 54,
            fontWeight: 700, lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: 20,
          }}
        >
          <span style={{ color: '#4285F4' }}>RAG Patterns in Practice</span>
          <br />
          <span style={{ color: '#202124' }}>is here.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          style={{
            fontSize: 16, color: '#5f6368', lineHeight: 1.75,
            maxWidth: 500, margin: '0 auto 32px', fontWeight: 400,
          }}
        >
          A hands-on workshop covering all{' '}
          <strong style={{ color: '#202124' }}>26 production RAG patterns</strong>
          {' '}— from Naive to Agentic — with runnable notebooks and real-world fintech examples.
        </motion.p>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          style={{ marginBottom: 48 }}
        >
          <a href="#patterns" className="btn-primary" style={{ textDecoration: 'none', fontSize: 15 }}>
            Explore All Patterns →
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.44 }}
          style={{
            borderTop: '1px solid #e8e8e8',
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            maxWidth: 600, margin: '48px auto 0',
          }}
        >
          {[
            { value: '26', label: 'RAG Patterns', accent: true },
            { value: '6',  label: 'Categories',   accent: false },
            { value: '26', label: 'Notebooks',    accent: false },
            { value: '90m',label: 'Workshop',     accent: false },
          ].map((stat, i, arr) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.48 + i * 0.06 }}
              style={{
                padding: '24px 12px', textAlign: 'center',
                borderRight: i < arr.length - 1 ? '1px solid #e8e8e8' : 'none',
              }}
            >
              <div style={{
                fontSize: 38, fontWeight: 700, letterSpacing: '-0.03em',
                color: stat.accent ? '#4285F4' : '#202124',
                lineHeight: 1, marginBottom: 5,
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: '#9aa0a6', marginTop: 5 }}>
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
          style={{ marginTop: 48, display: 'flex', justifyContent: 'center' }}
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ cursor: 'pointer' }}
            onClick={() => document.getElementById('recommender')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <svg width="18" height="26" viewBox="0 0 18 26" fill="none">
              <rect x="1" y="1" width="16" height="24" rx="8" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2"/>
              <motion.rect
                x="8" y="5.5" width="2" height="5" rx="1" fill="rgba(0,0,0,0.15)"
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
