import { motion } from 'framer-motion'
import {
  Database, Scissors, Cpu, Server, HardDrive,
  Search, Zap, BarChart2
} from 'lucide-react'
import { DESIGN_LAYERS } from '../data/patterns.js'

const ICON_MAP = { Database, Scissors, Cpu, Server, HardDrive, Search, Zap, BarChart2 }

export default function ArchitectureSection() {
  return (
    <section
      id="architecture"
      style={{ padding: '80px 24px', position: 'relative' }}
    >
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        right: '-10%',
        top: '20%',
        width: 400,
        height: 400,
        background: 'radial-gradient(ellipse, rgba(14,165,233,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div className="section-label" style={{ marginBottom: 12 }}>Production Architecture</div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#f1f5f9',
            marginBottom: 14,
            lineHeight: 1.15,
          }}>
            8 Design Layers
          </h2>
          <p style={{ color: '#64748b', maxWidth: 520, margin: '0 auto', fontSize: 15, lineHeight: 1.6 }}>
            Every production RAG system is composed of these eight layers. Master each layer to ship reliable, high-quality retrieval.
          </p>
        </motion.div>

        {/* Layers layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {DESIGN_LAYERS.map((layer, i) => {
            const IconComp = ICON_MAP[layer.icon] || Database
            const isHighlighted = [0, 1, 5, 7].includes(i) // Data, Chunking, Retrieval, Eval

            return (
              <motion.div
                key={layer.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="glass-card-hover"
                style={{
                  padding: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Layer number watermark */}
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 14,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 28,
                  fontWeight: 800,
                  color: 'rgba(255,255,255,0.025)',
                  lineHeight: 1,
                  userSelect: 'none',
                }}>
                  {layer.num}
                </div>

                {/* Icon */}
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: isHighlighted
                    ? 'rgba(56,189,248,0.12)'
                    : 'rgba(255,255,255,0.05)',
                  border: isHighlighted
                    ? '1px solid rgba(56,189,248,0.25)'
                    : '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                }}>
                  <IconComp
                    size={16}
                    style={{ color: isHighlighted ? '#38bdf8' : '#475569' }}
                  />
                </div>

                {/* Layer label */}
                <div style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#334155',
                  marginBottom: 6,
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  Layer {layer.num}
                </div>

                {/* Name */}
                <h3 style={{
                  color: '#f1f5f9',
                  fontWeight: 700,
                  fontSize: 14,
                  marginBottom: 8,
                  letterSpacing: '-0.01em',
                }}>
                  {layer.name}
                </h3>

                {/* Description */}
                <p style={{
                  color: '#64748b',
                  fontSize: 12,
                  lineHeight: 1.6,
                  marginBottom: 14,
                }}>
                  {layer.description}
                </p>

                {/* Option tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {layer.options.map(opt => (
                    <span
                      key={opt}
                      style={{
                        fontSize: 10,
                        color: '#475569',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        padding: '2px 7px',
                        borderRadius: 4,
                      }}
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Pipeline visual connector */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            marginTop: 40,
            padding: '20px 28px',
            borderRadius: 12,
            background: 'rgba(56,189,248,0.04)',
            border: '1px solid rgba(56,189,248,0.12)',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Pipeline
          </span>
          {DESIGN_LAYERS.map((layer, i) => (
            <>
              <span
                key={layer.num}
                style={{
                  fontSize: 12,
                  color: '#94a3b8',
                  fontWeight: 500,
                  padding: '3px 10px',
                  borderRadius: 5,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {layer.name}
              </span>
              {i < DESIGN_LAYERS.length - 1 && (
                <span key={`arrow-${i}`} style={{ color: '#1e3a5f', fontSize: 14 }}>→</span>
              )}
            </>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
