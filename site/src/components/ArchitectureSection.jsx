import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Database, Scissors, Cpu, Server, Layers,
  Search, Zap, BarChart2
} from 'lucide-react'
import { DESIGN_LAYERS, WORKSHOP_SEGMENTS } from '../data/architecture.js'

const ICON_MAP = { Database, Scissors, Cpu, Server, Layers, Search, Zap, BarChart2 }

const LAYER_COLORS = [
  { accent: '#38bdf8', dim: 'rgba(56,189,248,0.08)' },
  { accent: '#7dd3fc', dim: 'rgba(125,211,252,0.07)' },
  { accent: '#a78bfa', dim: 'rgba(167,139,250,0.07)' },
  { accent: '#8b5cf6', dim: 'rgba(139,92,246,0.07)' },
  { accent: '#34d399', dim: 'rgba(52,211,153,0.07)' },
  { accent: '#60a5fa', dim: 'rgba(96,165,250,0.07)' },
  { accent: '#fbbf24', dim: 'rgba(251,191,36,0.07)' },
  { accent: '#f87171', dim: 'rgba(248,113,113,0.07)' },
]

export default function ArchitectureSection() {
  const [activeLayer, setActiveLayer] = useState(null)

  return (
    <section
      id="architecture"
      style={{ padding: '80px 24px', position: 'relative' }}
    >
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
          <div className="section-label" style={{ marginBottom: 14, justifyContent: 'center' }}>Production Architecture</div>
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
          <p style={{ color: '#4e6070', maxWidth: 540, margin: '0 auto', fontSize: 15, lineHeight: 1.65 }}>
            Every production RAG system is assembled from these layers — in order. A poor choice at Layer 2 (chunking) cannot be fully compensated by a better choice at Layer 5 (retrieval).
          </p>
        </motion.div>

        {/* Stack */}
        <div style={{ position: 'relative' }}>
          {/* Connecting line */}
          <div style={{
            position: 'absolute',
            left: 31,
            top: 24,
            bottom: 24,
            width: 1,
            background: 'linear-gradient(180deg, rgba(56,189,248,0.35) 0%, rgba(251,191,36,0.2) 60%, rgba(248,113,113,0.2) 100%)',
            zIndex: 0,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                      ? 'linear-gradient(145deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.032) 100%)'
                      : 'linear-gradient(145deg, rgba(255,255,255,0.046) 0%, rgba(255,255,255,0.022) 100%)',
                    border: `1px solid ${isActive ? color.accent + '2a' : 'rgba(255,255,255,0.078)'}`,
                    borderTopColor: isActive ? color.accent + '3a' : 'rgba(255,255,255,0.10)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: isActive
                      ? `0 1px 0 rgba(255,255,255,0.055) inset, 0 6px 28px rgba(0,0,0,0.28), 0 0 40px ${color.dim}`
                      : '0 1px 0 rgba(255,255,255,0.04) inset, 0 2px 12px rgba(0,0,0,0.18)',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {/* Left: number + icon */}
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
                    <div style={{
                      position: 'absolute',
                      left: 0, top: '20%', bottom: '20%',
                      width: 2,
                      borderRadius: '0 2px 2px 0',
                      background: color.accent,
                      opacity: isActive ? 1 : 0,
                      transition: 'opacity 0.2s ease',
                    }} />
                    <div style={{
                      width: 30, height: 30,
                      borderRadius: 7,
                      background: isActive ? color.dim : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? color.accent + '40' : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}>
                      <IconComp size={14} style={{ color: isActive ? color.accent : '#3a5068', transition: 'color 0.2s ease' }} />
                    </div>
                    <span className="mono" style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                      color: isActive ? color.accent : '#2a3f52',
                      transition: 'color 0.2s ease',
                    }}>
                      {layer.num}
                    </span>
                  </div>

                  {/* Center: name + description + fintech note */}
                  <div style={{ padding: '16px 20px' }}>
                    <h3 style={{
                      color: isActive ? '#f1f5f9' : '#cbd5e1',
                      fontWeight: 700,
                      fontSize: 13.5,
                      letterSpacing: '-0.01em',
                      marginBottom: 4,
                      transition: 'color 0.2s ease',
                    }}>
                      {layer.name}
                    </h3>
                    <p style={{
                      color: '#4a6070',
                      fontSize: 11.5,
                      lineHeight: 1.55,
                      marginBottom: isActive && layer.fintechNote ? 6 : 0,
                    }}>
                      {layer.description}
                    </p>
                    {isActive && layer.fintechNote && (
                      <p style={{
                        fontSize: 11,
                        color: color.accent,
                        fontFamily: 'JetBrains Mono, monospace',
                        opacity: 0.8,
                        lineHeight: 1.5,
                      }}>
                        ↳ {layer.fintechNote}
                      </p>
                    )}
                  </div>

                  {/* Right: options */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                    padding: '16px 16px 16px 0',
                    maxWidth: 240,
                    justifyContent: 'flex-end',
                  }}>
                    {layer.options.map(opt => (
                      <span
                        key={opt}
                        className="mono"
                        style={{
                          fontSize: 10,
                          color: isActive ? '#647d8f' : '#374455',
                          background: isActive ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isActive ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.055)'}`,
                          padding: '2px 7px',
                          borderRadius: 5,
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s ease',
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

        {/* Workshop flow strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ marginTop: 40 }}
        >
          <div style={{
            padding: '20px 24px',
            borderRadius: 12,
            background: 'rgba(56,189,248,0.04)',
            border: '1px solid rgba(56,189,248,0.1)',
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#38bdf8',
              marginBottom: 14,
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              90-Minute Workshop Flow
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 8,
            }}>
              {WORKSHOP_SEGMENTS.map((seg, i) => (
                <div
                  key={seg.segment}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.065)',
                  }}
                >
                  <div style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: '#2a3f52',
                    fontFamily: 'JetBrains Mono, monospace',
                    marginBottom: 4,
                  }}>
                    {seg.time}
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 3 }}>
                    {seg.segment}
                  </div>
                  <div style={{ fontSize: 10.5, color: '#3d5068', lineHeight: 1.4 }}>
                    {seg.patterns.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
