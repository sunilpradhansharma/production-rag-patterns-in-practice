import { motion } from 'framer-motion'

function ScrollCue() {
  return (
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
  )
}

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        background: '#FFFBF5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Animated blobs */}
      <div className="hero-blob b1" />
      <div className="hero-blob b2" />
      <div className="hero-blob b3" />

      <div style={{ maxWidth: 800, width: '100%', position: 'relative', zIndex: 1 }}>

        {/* Headline — words revealed by initHeroReveal() */}
        <h1
          style={{
            fontSize: 54,
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: '-0.03em',
            marginBottom: 22,
          }}
        >
          <span style={{ color: '#3730A3' }}>RAG Patterns in Practice</span>
          <br />
          <span style={{ color: '#1C1917' }}>is here.</span>
        </h1>

        {/* Sub-headline — faded in by initHeroReveal() */}
        <p
          style={{
            fontSize: 16,
            color: '#57534E',
            lineHeight: 1.78,
            maxWidth: 500,
            margin: '0 auto 36px',
            fontWeight: 400,
            opacity: 0,
            transform: 'translateY(14px)',
          }}
        >
          A hands-on workshop covering all{' '}
          <strong style={{ color: '#1C1917' }}>26 production RAG patterns</strong>
          {' '}— from Naive to Agentic — with runnable notebooks and real-world fintech examples.
        </p>

        {/* Single CTA — revealed by initHeroReveal() */}
        <div
          className="hero-cta-wrapper"
          style={{ marginBottom: 56, opacity: 0, transform: 'translateY(12px)' }}
        >
          <a href="#patterns" className="btn-primary" style={{ textDecoration: 'none', fontSize: 15 }}>
            Explore All Patterns →
          </a>
        </div>

        {/* Stats row — count-up by initStatCountUp() */}
        <div
          className="stats-row"
          style={{
            borderTop: '1px solid #F0E8D8',
            background: 'rgba(55, 48, 163, 0.025)',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            maxWidth: 600,
            margin: '0 auto',
            borderRadius: '0 0 12px 12px',
          }}
        >
          {[
            { value: 26,   suffix: '',  label: 'RAG Patterns', duration: 900 },
            { value: 6,    suffix: '',  label: 'Categories',   duration: 700 },
            { value: 26,   suffix: '',  label: 'Notebooks',    duration: 900 },
            { value: 90,   suffix: 'm', label: 'Workshop',     duration: 800 },
          ].map((stat, i, arr) => (
            <div
              key={stat.label}
              style={{
                padding: '24px 12px',
                textAlign: 'center',
                borderRight: i < arr.length - 1 ? '1px solid #F0E8D8' : 'none',
              }}
            >
              <div
                className="stat-number"
                data-target={stat.value}
                data-suffix={stat.suffix}
                data-duration={stat.duration}
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: '#3730A3',
                  lineHeight: 1,
                  marginBottom: 5,
                }}
              >
                {stat.suffix ? `0${stat.suffix}` : '0'}
              </div>
              <div style={{
                fontSize: 11,
                color: '#A8A29E',
                marginTop: 5,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll cue — Framer Motion used only for infinite bounce/fade (not an entrance animation) */}
        <ScrollCue />

      </div>
    </section>
  )
}
