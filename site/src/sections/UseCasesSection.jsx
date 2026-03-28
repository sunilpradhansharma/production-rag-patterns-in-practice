import { motion } from 'framer-motion'
import { Shield, CreditCard, FileText, AlertTriangle, Eye, UserCheck } from 'lucide-react'
import { USE_CASES } from '../data/useCases.js'
import SectionLabel from '../components/SectionLabel.jsx'
import { UseCasesOrb } from '../components/BackgroundEffects.jsx'

const ICON_MAP = { Shield, CreditCard, FileText, AlertTriangle, Eye, UserCheck }

export default function UseCasesSection() {
  return (
    <section id="usecases" style={{ padding: '80px 24px', position: 'relative' }}>
      <UseCasesOrb />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <SectionLabel centered mb={12}>Real-World Applications</SectionLabel>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800, letterSpacing: '-0.025em',
            color: '#1a1a18', marginBottom: 14,
          }}>
            Fintech Use Cases
          </h2>
          <p style={{ color: '#6a6860', maxWidth: 520, margin: '0 auto', fontSize: 15, lineHeight: 1.6 }}>
            Every pattern maps to concrete fintech problems. See which patterns apply to your domain.
          </p>
        </motion.div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
          {USE_CASES.map((uc, i) => {
            const IconComp = ICON_MAP[uc.icon] || Shield
            return (
              <motion.div
                key={uc.domain}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="glass-card-hover"
                style={{ padding: '22px', position: 'relative', overflow: 'hidden' }}
              >
                {/* Domain header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 8,
                    background: uc.colorDim, border: `1px solid ${uc.color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <IconComp size={17} style={{ color: uc.color }} />
                  </div>
                  <div>
                    <h3 style={{ color: '#1a1a18', fontWeight: 700, fontSize: 14, marginBottom: 3, letterSpacing: '-0.01em' }}>
                      {uc.domain}
                    </h3>
                    <p style={{ color: '#6a6860', fontSize: 12, lineHeight: 1.5 }}>{uc.description}</p>
                  </div>
                </div>

                {/* Examples */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#9a9890', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                    Examples
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {uc.examples.map((ex, j) => (
                      <div key={j} style={{
                        padding: '7px 9px', borderRadius: 6,
                        background: '#f5f3ee',
                        border: '1px solid #e4e0d8',
                      }}>
                        <div style={{ fontSize: 11.5, color: '#1a1a18', marginBottom: 3, lineHeight: 1.4 }}>
                          {ex.problem}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: uc.color, fontFamily: 'JetBrains Mono, monospace' }}>
                            {ex.pattern}
                          </span>
                          <span style={{ fontSize: 10, color: '#9a9890' }}>—</span>
                          <span style={{ fontSize: 10, color: '#6a6860', lineHeight: 1.4 }}>{ex.why}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pattern tags */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#9a9890', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                    Key Patterns
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {uc.patterns.map(p => (
                      <a key={p} href="#patterns" style={{
                        fontSize: 10, fontWeight: 500,
                        padding: '3px 9px', borderRadius: 12,
                        background: `${uc.color}10`, border: `1px solid ${uc.color}28`,
                        color: uc.color, textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = `${uc.color}20`
                          e.currentTarget.style.borderColor = `${uc.color}45`
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = `${uc.color}10`
                          e.currentTarget.style.borderColor = `${uc.color}28`
                        }}
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
