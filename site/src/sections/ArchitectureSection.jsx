import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Database, Scissors, Cpu, Server, Layers,
  Search, Zap, BarChart2,
} from 'lucide-react'
import { DESIGN_LAYERS, WORKSHOP_SEGMENTS } from '../data/architecture.js'
import SectionLabel from '../components/SectionLabel.jsx'
import { ArchitectureOrb } from '../components/BackgroundEffects.jsx'

const ICON_MAP = { Database, Scissors, Cpu, Server, Layers, Search, Zap, BarChart2 }

const LAYER_COLORS = [
  { accent: '#4F46E5', dim: 'rgba(55,48,163,0.06)' },
  { accent: '#4F46E5', dim: 'rgba(55,48,163,0.06)' },
  { accent: '#7c3aed', dim: 'rgba(124,58,237,0.06)' },
  { accent: '#6d28d9', dim: 'rgba(109,40,217,0.06)' },
  { accent: '#059669', dim: 'rgba(5,150,105,0.06)' },
  { accent: '#4F46E5', dim: 'rgba(55,48,163,0.06)' },
  { accent: '#b45309', dim: 'rgba(180,83,9,0.06)' },
  { accent: '#be123c', dim: 'rgba(190,18,60,0.06)' },
]

export default function ArchitectureSection() {
  const [activeLayer, setActiveLayer] = useState(null)

  return (
    <section id="architecture" style={{ padding: '80px 24px', position: 'relative' }}>
      <ArchitectureOrb />

      <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative' }}>

        {/* Header */}
        <div data-section-header="" style={{ textAlign: 'center', marginBottom: 56 }}>
          <SectionLabel centered>Production Architecture</SectionLabel>
          <h2 style={{
            fontSize: 42,
            fontWeight: 700, letterSpacing: '-0.02em',
            color: '#1C1917', marginBottom: 16, lineHeight: 1.12, textAlign: 'center',
          }}>
            8 <span style={{ color: '#3730A3' }}>Design Layers</span>
          </h2>
          <p style={{ color: '#57534E', maxWidth: 540, margin: '0 auto', fontSize: 15, lineHeight: 1.65 }}>
            Every production RAG system is assembled from these layers — in order. A poor choice at Layer 2
            (chunking) cannot be fully compensated by a better choice at Layer 5 (retrieval).
          </p>
        </div>

        {/* Layer stack */}
        <div style={{ position: 'relative' }}>
          {/* Connecting spine */}
          <div style={{
            position: 'absolute', left: 31, top: 24, bottom: 24, width: 1,
            background: 'linear-gradient(180deg, rgba(55,48,163,0.25) 0%, rgba(180,83,9,0.15) 60%, rgba(190,18,60,0.15) 100%)',
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
                    gap: 0, alignItems: 'center',
                    background: '#FFFFFF',
                    border: `1px solid ${isActive ? color.accent + '55' : '#F0E8D8'}`,
                    borderTopColor: isActive ? color.accent + '88' : '#F0E8D8',
                    borderRadius: 12, overflow: 'hidden',
                    boxShadow: isActive
                      ? `0 1px 3px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.08), 0 0 40px ${color.dim}`
                      : '0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease',
                    position: 'relative', zIndex: 1,
                  }}
                >
                  {/* Icon column */}
                  <div style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '20px 0', gap: 6,
                    borderRight: `1px solid ${isActive ? color.accent + '40' : '#F0E8D8'}`,
                    background: isActive ? color.dim : '#FFF8ED',
                    transition: 'all 0.2s ease',
                    minHeight: 80, position: 'relative',
                  }}>
                    <div style={{
                      position: 'absolute', left: 0, top: '20%', bottom: '20%',
                      width: 2, borderRadius: '0 2px 2px 0',
                      background: color.accent,
                      opacity: isActive ? 1 : 0,
                      transition: 'opacity 0.2s ease',
                    }} />
                    <div style={{
                      width: 30, height: 30, borderRadius: 7,
                      background: isActive ? color.dim : '#FFF8ED',
                      border: `1px solid ${isActive ? color.accent + '55' : '#F0E8D8'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}>
                      <IconComp size={14} style={{ color: isActive ? color.accent : '#57534E', transition: 'color 0.2s ease' }} />
                    </div>
                    <span className="mono" style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                      color: isActive ? color.accent : '#A8A29E',
                      transition: 'color 0.2s ease',
                    }}>
                      {layer.num}
                    </span>
                  </div>

                  {/* Content column */}
                  <div style={{ padding: '16px 20px' }}>
                    <h3 style={{
                      color: '#1C1917',
                      fontWeight: 700, fontSize: 13.5,
                      letterSpacing: '-0.01em', marginBottom: 4,
                      transition: 'color 0.2s ease',
                    }}>
                      {layer.name}
                    </h3>
                    <p style={{
                      color: '#57534E', fontSize: 11.5, lineHeight: 1.55,
                      marginBottom: isActive && layer.fintechNote ? 6 : 0,
                    }}>
                      {layer.description}
                    </p>
                    {isActive && layer.fintechNote && (
                      <p style={{
                        fontSize: 11, color: color.accent,
                        fontFamily: 'JetBrains Mono, monospace',
                        opacity: 0.8, lineHeight: 1.5,
                      }}>
                        ↳ {layer.fintechNote}
                      </p>
                    )}
                  </div>

                  {/* Options column */}
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: 4,
                    padding: '16px 16px 16px 0',
                    maxWidth: 240, justifyContent: 'flex-end',
                  }}>
                    {layer.options.map(opt => (
                      <span key={opt} className="mono" style={{
                        fontSize: 10,
                        color: isActive ? '#57534E' : '#A8A29E',
                        background: isActive ? '#FFF8ED' : '#FFF8ED',
                        border: `1px solid ${isActive ? '#E8DBC8' : '#F0E8D8'}`,
                        padding: '2px 7px', borderRadius: 5,
                        whiteSpace: 'nowrap', transition: 'all 0.2s ease',
                        letterSpacing: '0.01em',
                      }}>
                        {opt}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Workshop flow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ marginTop: 40 }}
        >
          <div style={{
            padding: '20px 24px', borderRadius: 12,
            background: '#EEF2FF',
            border: '1px solid #C7D2FE',
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#3730A3', marginBottom: 14,
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              90-Minute Workshop Flow
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
              {WORKSHOP_SEGMENTS.map(seg => (
                <div key={seg.segment} style={{
                  padding: '10px 12px', borderRadius: 8,
                  background: '#FFFFFF',
                  border: '1px solid #F0E8D8',
                }}>
                  <div style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                    color: '#A8A29E', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4,
                  }}>
                    {seg.time}
                  </div>
                  <div style={{ fontSize: 12, color: '#1C1917', fontWeight: 600, marginBottom: 3 }}>
                    {seg.segment}
                  </div>
                  <div style={{ fontSize: 10.5, color: '#57534E', lineHeight: 1.4 }}>
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
