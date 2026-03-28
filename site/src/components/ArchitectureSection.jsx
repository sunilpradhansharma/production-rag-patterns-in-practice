import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Database, Scissors, Cpu, Server, HardDrive,
  Search, Zap, BarChart2
} from 'lucide-react'
import { DESIGN_LAYERS } from '../data/patterns.js'

const ICON_MAP = { Database, Scissors, Cpu, Server, HardDrive, Search, Zap, BarChart2 }

// Color progression along the pipeline: input → retrieval → output → eval
const LAYER_COLORS = [
  { accent: '#38bdf8', dim: 'rgba(56,189,248,0.08)' },   // Data Ingestion
  { accent: '#7dd3fc', dim: 'rgba(125,211,252,0.07)' },  // Chunking
  { accent: '#a78bfa', dim: 'rgba(167,139,250,0.07)' },  // Embedding
  { accent: '#8b5cf6', dim: 'rgba(139,92,246,0.07)' },   // Vector Store
  { accent: '#6366f1', dim: 'rgba(99,102,241,0.07)' },   // Index & Storage
  { accent: '#34d399', dim: 'rgba(52,211,153,0.07)' },   // Retrieval
  { accent: '#fbbf24', dim: 'rgba(251,191,36,0.07)' },   // Generation
  { accent: '#f87171', dim: 'rgba(248,113,113,0.07)' },  // Evaluation
]

export default function ArchitectureSection() {
  const [activeLayer, setActiveLayer] = useState(null)

  return (
    <section
      id="architecture"
      style={{ padding: '80px 24px', position: 'relative' }}
    >
      {/* Section glow */}
      <div style={{
        position: 'absolute',
        right: '-5%',
        top: '30%',
        width: 500,
        height: 500,
        background: 'radial-gradient(ellipse, rgba(14,165,233,0.055) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div className="section-label" style={{ marginBottom: 14 }}>Production Architecture</div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#f1f5f9',
            marginBottom: 14,
            lineHeight: 1.1,
          }}>
            8 Design Layers
          </h2>
          <p style={{ color: '#4e6070', maxWidth: 480, margin: '0 auto', fontSize: 15, lineHeight: 1.65 }}>
            Every production RAG system is assembled from these layers — in order.
            Each is a decision point that shapes quality, latency, and cost.
          </p>
        </motion.div>

        {/* Stack layout */}
        <div style={{ position: 'relative' }}>

          {/* Vertical connecting line */}
          <div style={{
            position: 'absolute',
            left: 31,
            top: 24,
            bottom: 24,
            width: 1,
            background: 'linear-gradient(180deg, rgba(56,189,248,0.35) 0%, rgba(248,113,113,0.2) 100%)',
            zIndex: 0,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DESIGN_LAYERS.map((layer, i) => {
              const IconComp = ICON_MAP[layer.icon] || Database
              const color = LAYER_COLORS[i]
              const isActive = activeLayer === i

              return (
                <motion.div
                  key={layer.num}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.4, delay: i * 0.055 }}
                  onMouseEnter={() => setActiveLayer(i)}
                  onMouseLeave={() => setActiveLayer(null)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '64px 1fr auto',
                    gap: 0,
                    alignItems: 'center',
                    background: isActive
                      ? `linear-gradient(145deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.032) 100%)`
                      : 'linear-gradient(145deg, rgba(255,255,255,0.046) 0%, rgba(255,255,255,0.022) 100%)',
                    border: `1px solid ${isActive ? color.accent + '2a' : 'rgba(255,255,255,0.078)'}`,
                    borderTopColor: isActive ? color.accent + '3a' : 'rgba(255,255,255,0.10)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: isActive
                      ? `0 1px 0 rgba(255,255,255,0.055) inset, 0 6px 28px rgba(0,0,0,0.28), 0 0 40px ${color.dim}`
                      : '0 1px 0 rgba(255,255,255,0.04) inset, 0 2px 12px rgba(0,0,0,0.18)',
                    transition: 'all 0.2s ease',
                    cursor: 'default',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {/* Left: layer number + icon */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px 0',
                    gap: 6,
                    borderRight: `1px solid ${isActive ? color.accent + '20' : 'rgba(255,255,255,0.06)'}`,
                    background: isActive ? color.dim : 'rgba(255,255,255,0.015)',
                    transition: 'all 0.2s ease',
                    minHeight: 80,
                    position: 'relative',
                  }}>
                    {/* Active left accent bar */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: '20%',
                      bottom: '20%',
                      width: 2,
                      borderRadius: '0 2px 2px 0',
                      background: color.accent,
                      opacity: isActive ? 1 : 0,
                      transition: 'opacity 0.2s ease',
                    }} />

                    <div style={{
                      width: 30,
                      height: 30,
                      borderRadius: 7,
                      background: isActive ? color.dim : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? color.accent + '40' : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}>
                      <IconComp size={14} style={{ color: isActive ? color.accent : '#3a5068', transition: 'color 0.2s ease' }} />
                    </div>

                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: isActive ? color.accent : '#2a3f52',
                      transition: 'color 0.2s ease',
                    }}>
                      {layer.num}
                    </span>
                  </div>

                  {/* Center: name + description */}
                  <div style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                      <h3 style={{
                        color: isActive ? '#f1f5f9' : '#cbd5e1',
                        fontWeight: 700,
                        fontSize: 14,
                        letterSpacing: '-0.01em',
                        transition: 'color 0.2s ease',
                      }}>
                        {layer.name}
                      </h3>
                    </div>
                    <p style={{
                      color: '#4a6070',
                      fontSize: 12,
                      lineHeight: 1.55,
                      transition: 'color 0.2s ease',
                    }}>
                      {layer.description}
                    </p>
                  </div>

                  {/* Right: option tags */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                    padding: '18px 16px 18px 0',
                    maxWidth: 240,
                    justifyContent: 'flex-end',
                  }}>
                    {layer.options.map(opt => (
                      <span
                        key={opt}
                        style={{
                          fontSize: 10,
                          color: isActive ? '#647d8f' : '#374455',
                          background: isActive ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isActive ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.055)'}`,
                          padding: '2px 7px',
                          borderRadius: 5,
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s ease',
                          fontFamily: 'JetBrains Mono, monospace',
                          letterSpacing: '0.01em',
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
        </div>

        {/* Pipeline summary strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            marginTop: 28,
            padding: '14px 20px',
            borderRadius: 10,
            background: 'rgba(56,189,248,0.04)',
            border: '1px solid rgba(56,189,248,0.1)',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 6,
            justifyContent: 'center',
          }}
        >
          <span className="mono" style={{ fontSize: 10, color: '#38bdf8', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginRight: 4 }}>
            Pipeline
          </span>
          {DESIGN_LAYERS.map((layer, i) => (
            <span key={layer.num} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                fontSize: 11,
                color: '#4a6070',
                fontWeight: 500,
                padding: '2px 9px',
                borderRadius: 5,
                background: 'rgba(255,255,255,0.035)',
                border: '1px solid rgba(255,255,255,0.065)',
                letterSpacing: '-0.01em',
              }}>
                {layer.name}
              </span>
              {i < DESIGN_LAYERS.length - 1 && (
                <span style={{ color: '#1e3347', fontSize: 12, fontWeight: 700 }}>›</span>
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
