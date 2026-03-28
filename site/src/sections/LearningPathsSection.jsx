import { motion } from 'framer-motion'
import { Clock, ChevronRight, ArrowRight } from 'lucide-react'
import { LEARNING_PATHS } from '../data/learningPaths.js'
import SectionLabel from '../components/SectionLabel.jsx'

export default function LearningPathsSection() {
  return (
    <section id="learning" style={{ padding: '80px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <SectionLabel centered mb={12}>Learning Paths</SectionLabel>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800, letterSpacing: '-0.025em',
            color: '#1a1a18', marginBottom: 14,
          }}>
            Choose your path
          </h2>
          <p style={{ color: '#6a6860', maxWidth: 480, margin: '0 auto', fontSize: 15, lineHeight: 1.6 }}>
            Structured paths from zero to production. Each path builds on the previous.
          </p>
        </motion.div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {LEARNING_PATHS.map((path, i) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card-hover"
              style={{ padding: '24px', position: 'relative', overflow: 'hidden', borderTop: `2px solid ${path.color}` }}
            >
              {/* Top glow */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 60,
                background: `linear-gradient(180deg, ${path.color}0f 0%, transparent 100%)`,
                pointerEvents: 'none',
              }} />

              {/* Badge + title */}
              <div style={{ marginBottom: 16, position: 'relative' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 20,
                  background: path.colorDim, border: `1px solid ${path.color}33`,
                  marginBottom: 12,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: path.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {path.label}
                  </span>
                </div>

                <h3 style={{ color: '#1a1a18', fontWeight: 700, fontSize: 18, letterSpacing: '-0.015em', marginBottom: 6 }}>
                  {path.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Clock size={12} style={{ color: '#9a9890' }} />
                  <span style={{ fontSize: 12, color: '#9a9890' }}>{path.duration}</span>
                </div>

                <p style={{ color: '#6a6860', fontSize: 13, lineHeight: 1.6 }}>{path.description}</p>
              </div>

              {/* Step list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                {path.steps.map((step, j) => (
                  <div key={step.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '7px 10px', borderRadius: 6,
                    background: '#f5f3ee',
                    border: '1px solid #e4e0d8',
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 4,
                      background: `${path.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 700, color: path.color,
                      flexShrink: 0, marginTop: 1,
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>
                      {j + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#1a1a18', fontSize: 12.5, fontWeight: 600, marginBottom: 1 }}>
                        {step.name}
                      </div>
                      <div style={{ color: '#6a6860', fontSize: 11, lineHeight: 1.4 }}>{step.what}</div>
                    </div>
                    {j < path.steps.length - 1 && (
                      <ChevronRight size={10} style={{ color: '#9a9890', flexShrink: 0, marginTop: 4 }} />
                    )}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href={path.startNotebook}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '9px 16px', borderRadius: 7,
                  background: `${path.color}12`, border: `1px solid ${path.color}2a`,
                  color: path.color, fontSize: 12, fontWeight: 600,
                  textDecoration: 'none', transition: 'all 0.15s ease', width: '100%',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${path.color}20`
                  e.currentTarget.style.borderColor = `${path.color}45`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = `${path.color}12`
                  e.currentTarget.style.borderColor = `${path.color}2a`
                }}
              >
                Start with {path.steps[0].name}
                <ArrowRight size={13} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
