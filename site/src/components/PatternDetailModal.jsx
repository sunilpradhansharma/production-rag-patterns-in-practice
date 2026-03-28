import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, BookOpen, FolderOpen, FileText } from 'lucide-react'
import { CATEGORY_COLORS, CATEGORY_META } from '../data/patterns.js'
import { DIAGRAMS } from '../data/diagrams.js'
import { REPO_BASE, GITHUB_URL } from '../lib/constants.js'
import MermaidDiagram from './MermaidDiagram.jsx'

const TIER_CONFIG = {
  1: { label: 'Tier 1', color: '#38bdf8', bg: 'rgba(56,189,248,0.09)', border: 'rgba(56,189,248,0.22)' },
  2: { label: 'Tier 2', color: '#a78bfa', bg: 'rgba(167,139,250,0.09)', border: 'rgba(167,139,250,0.22)' },
  3: { label: 'Tier 3', color: '#fb923c', bg: 'rgba(251,146,60,0.09)',  border: 'rgba(251,146,60,0.22)'  },
}

const COMPLEXITY_LABELS = { 1: 'Minimal', 2: 'Low', 3: 'Medium', 4: 'High', 5: 'Expert' }

export default function PatternDetailModal({ pattern, onClose }) {
  const cat   = CATEGORY_COLORS[pattern.category] || CATEGORY_COLORS.foundational
  const catLabel = CATEGORY_META[pattern.category]?.label || pattern.category
  const tier  = TIER_CONFIG[pattern.tier] || TIER_CONFIG[1]
  const moduleNum = String(pattern.id).padStart(2, '0')
  const diagram   = DIAGRAMS[pattern.id]

  // Escape key + body scroll lock
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <AnimatePresence>
      {/* ── Backdrop ─────────────────────────────────────────────────── */}
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(2,6,14,0.82)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
          overflowY: 'auto',
        }}
      >
        {/* ── Panel ────────────────────────────────────────────────────── */}
        <motion.div
          key="modal-panel"
          initial={{ opacity: 0, y: 28, scale: 0.965 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.975 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '100%', maxWidth: 900,
            borderRadius: 18,
            background: 'linear-gradient(160deg, rgba(11,19,31,0.99) 0%, rgba(7,13,22,1) 100%)',
            border: `1px solid ${cat.border}`,
            borderTopColor: cat.text + '55',
            boxShadow: `
              0 2px 0 rgba(255,255,255,0.05) inset,
              0 -1px 0 rgba(0,0,0,0.4) inset,
              0 32px 80px rgba(0,0,0,0.65),
              0 0 100px ${cat.bg}
            `,
            overflow: 'hidden',
          }}
        >
          {/* Top accent bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${cat.text} 30%, ${cat.text} 70%, transparent 100%)`,
          }} />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: 16, right: 16, zIndex: 10,
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#4a6070',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#f1f5f9'
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#4a6070'
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'
            }}
          >
            <X size={14} />
          </button>

          {/* ── Scrollable content ─────────────────────────────────────── */}
          <div style={{
            overflowY: 'auto', maxHeight: '90vh',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(56,189,248,0.2) transparent',
          }}>
            <div style={{ padding: '28px 30px 32px' }}>

              {/* ── Header ─────────────────────────────────────────────── */}
              <div style={{ marginBottom: 22, paddingRight: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.11em',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#38bdf8', background: 'rgba(56,189,248,0.08)',
                    border: '1px solid rgba(56,189,248,0.2)', padding: '3px 9px', borderRadius: 5,
                  }}>
                    Module {moduleNum}
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
                    padding: '3px 9px', borderRadius: 10,
                    background: cat.bg, border: `1px solid ${cat.border}`, color: cat.text,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: cat.text, flexShrink: 0 }} />
                    {catLabel}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 10,
                    background: tier.bg, border: `1px solid ${tier.border}`, color: tier.color,
                  }}>
                    {tier.label}
                  </span>
                  {pattern.sourcePaper && (
                    <a
                      href={pattern.sourceUrl}
                      target="_blank" rel="noopener noreferrer"
                      style={{
                        fontSize: 10, color: '#3d5568', textDecoration: 'none',
                        fontFamily: 'JetBrains Mono, monospace',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#64748b' }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#3d5568' }}
                    >
                      {pattern.sourcePaper}
                    </a>
                  )}
                </div>

                <h2 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800,
                  color: '#f1f5f9', letterSpacing: '-0.025em', lineHeight: 1.1,
                  marginBottom: 10,
                }}>
                  {pattern.name}
                </h2>

                <p style={{ color: '#5a7080', fontSize: 13.5, lineHeight: 1.65, maxWidth: 680 }}>
                  {pattern.coreConcept}
                </p>
              </div>

              {/* ── Architecture diagram ────────────────────────────────── */}
              {diagram && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
                  }}>
                    <div style={{ width: 18, height: 1.5, background: `linear-gradient(90deg, ${cat.text}, transparent)`, borderRadius: 1 }} />
                    <span style={{
                      fontSize: 9.5, fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase',
                      color: cat.text, fontFamily: 'JetBrains Mono, monospace',
                    }}>
                      Architecture Diagram
                    </span>
                  </div>

                  <div style={{
                    borderRadius: 12, overflow: 'hidden',
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.032) 0%, rgba(255,255,255,0.014) 100%)',
                    border: `1px solid ${cat.border}`,
                    borderTopColor: cat.text + '35',
                    padding: '20px 16px',
                    boxShadow: `0 1px 0 rgba(255,255,255,0.04) inset, 0 6px 28px rgba(0,0,0,0.32), 0 0 48px ${cat.bg}`,
                  }}>
                    <MermaidDiagram chart={diagram} />
                  </div>
                </div>
              )}

              {/* ── Info cards ──────────────────────────────────────────── */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 12, marginBottom: 20,
              }}>
                {/* Key innovation */}
                <div style={{
                  padding: '14px 16px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.026)',
                  border: '1px solid rgba(255,255,255,0.068)',
                  borderTopColor: 'rgba(255,255,255,0.09)',
                }}>
                  <div style={{
                    fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#2a3f52', marginBottom: 8, fontFamily: 'JetBrains Mono, monospace',
                  }}>
                    Key Innovation
                  </div>
                  <p style={{ fontSize: 12.5, color: '#7a8fa0', lineHeight: 1.62 }}>
                    {pattern.keyInnovation}
                  </p>
                </div>

                {/* Demo query */}
                {pattern.demoQuery && (
                  <div style={{
                    padding: '14px 16px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.026)',
                    border: '1px solid rgba(255,255,255,0.068)',
                    borderLeft: `2px solid ${cat.text}45`,
                  }}>
                    <div style={{
                      fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: '#2a3f52', marginBottom: 8, fontFamily: 'JetBrains Mono, monospace',
                    }}>
                      Example Query
                    </div>
                    <p style={{ fontSize: 12, color: '#56697a', lineHeight: 1.58, fontStyle: 'italic' }}>
                      "{pattern.demoQuery}"
                    </p>
                  </div>
                )}
              </div>

              {/* ── Fintech use cases ───────────────────────────────────── */}
              {pattern.fintechUseCases?.length > 0 && (
                <div style={{ marginBottom: 22 }}>
                  <div style={{
                    fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#2a3f52', marginBottom: 9, fontFamily: 'JetBrains Mono, monospace',
                  }}>
                    Fintech Use Cases
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {pattern.fintechUseCases.map(uc => (
                      <span key={uc} style={{
                        fontSize: 11, fontWeight: 500,
                        padding: '3px 10px', borderRadius: 7,
                        background: `${cat.text}0e`, border: `1px solid ${cat.text}28`,
                        color: cat.text,
                      }}>
                        {uc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Footer: complexity + actions ────────────────────────── */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 14,
                paddingTop: 18,
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                {/* Complexity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ fontSize: 10.5, color: '#3d5068', fontWeight: 500 }}>Complexity</span>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} style={{
                        width: i < pattern.complexity ? 16 : 9, height: 3, borderRadius: 2,
                        background: i < pattern.complexity
                          ? `linear-gradient(90deg, ${cat.text}bb, ${cat.text})`
                          : 'rgba(255,255,255,0.08)',
                        transition: 'all 0.2s ease',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 10.5, color: '#3d5068' }}>{COMPLEXITY_LABELS[pattern.complexity]}</span>
                </div>

                {/* Action links */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <a
                    href={`${REPO_BASE}${pattern.notebookPath}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontSize: 12, fontWeight: 600, color: cat.text,
                      padding: '8px 14px', borderRadius: 8,
                      background: cat.bg, border: `1px solid ${cat.border}`,
                      textDecoration: 'none', transition: 'filter 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.2)' }}
                    onMouseLeave={e => { e.currentTarget.style.filter = '' }}
                  >
                    <BookOpen size={12} />
                    Notebook
                    <ExternalLink size={10} />
                  </a>

                  <a
                    href={`${REPO_BASE}${pattern.skillPath}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontSize: 12, fontWeight: 500, color: '#64748b',
                      padding: '8px 14px', borderRadius: 8,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.085)',
                      textDecoration: 'none', transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#cbd5e1'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#64748b'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.085)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    }}
                  >
                    <FileText size={12} />
                    SKILL.md
                    <ExternalLink size={10} />
                  </a>

                  <a
                    href={`${GITHUB_URL}/tree/main/modules/${pattern.jsonId}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontSize: 12, fontWeight: 500, color: '#64748b',
                      padding: '8px 14px', borderRadius: 8,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.085)',
                      textDecoration: 'none', transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#cbd5e1'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#64748b'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.085)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    }}
                  >
                    <FolderOpen size={12} />
                    Module
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
