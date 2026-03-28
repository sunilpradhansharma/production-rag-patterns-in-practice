import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Hash, BarChart2, GitBranch,
  Share2, Layers, Zap, Bot,
  ExternalLink, ArrowRight, RotateCcw,
} from 'lucide-react'
import { PATTERNS, CATEGORY_COLORS, CATEGORY_META } from '../data/patterns.js'
import { SIGNALS, scorePatterns } from '../lib/patternChooser.js'
import SectionLabel from '../components/SectionLabel.jsx'
import { REPO_BASE } from '../lib/constants.js'

const ICON_MAP = { FileText, Hash, BarChart2, GitBranch, Share2, Layers, Zap, Bot }

// ─── Signal card ─────────────────────────────────────────────────────────────

function SignalCard({ signal, active, onClick }) {
  const IconComp = ICON_MAP[signal.icon] || FileText
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        padding: '13px 13px 11px',
        borderRadius: 10,
        border: `1px solid ${active ? '#c5d8ff' : '#e8e8e8'}`,
        borderTopColor: active ? '#a8c7ff' : '#e8e8e8',
        background: active
          ? '#f0f6ff'
          : '#ffffff',
        boxShadow: active
          ? '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(66,133,244,0.08)'
          : '0 1px 3px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.17s ease',
        width: '100%',
        userSelect: 'none',
      }}
    >
      {/* Active top accent line */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 2,
        borderRadius: '10px 10px 0 0',
        background: 'linear-gradient(90deg, transparent, #4285F4, transparent)',
        opacity: active ? 0.7 : 0,
        transition: 'opacity 0.17s ease',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {/* Icon */}
        <div style={{
          width: 28, height: 28, borderRadius: 6, flexShrink: 0,
          background: active ? '#f0f6ff' : '#f8f9fa',
          border: `1px solid ${active ? '#c5d8ff' : '#e8e8e8'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.17s ease',
        }}>
          <IconComp
            size={13}
            style={{ color: active ? '#4285F4' : '#5f6368', transition: 'color 0.17s ease' }}
          />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 12, fontWeight: active ? 600 : 500,
            color: active ? '#202124' : '#5f6368',
            lineHeight: 1.3, marginBottom: 3,
            transition: 'color 0.17s ease',
          }}>
            {signal.label}
          </div>
          <div style={{
            fontSize: 10.5,
            color: active ? '#5f6368' : '#9aa0a6',
            lineHeight: 1.4,
            transition: 'color 0.17s ease',
          }}>
            {signal.hint}
          </div>
        </div>

        {/* Checkbox indicator */}
        <div style={{
          width: 14, height: 14, flexShrink: 0, marginTop: 1,
          borderRadius: 4,
          border: `1.5px solid ${active ? '#4285F4' : '#e8e8e8'}`,
          background: active ? 'rgba(66,133,244,0.15)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.17s ease',
        }}>
          {active && (
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <path d="M1 3l2 2 4-4" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}

// ─── Empty result state ───────────────────────────────────────────────────────

function EmptyResults() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        padding: '52px 32px',
        textAlign: 'center',
        borderRadius: 14,
        background: '#f8f9fa',
        border: '1px solid #e8e8e8',
        borderTopColor: '#e8e8e8',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{
        width: 48, height: 48,
        margin: '0 auto 18px',
        borderRadius: 12,
        background: '#f0f6ff',
        border: '1px solid #c5d8ff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 22, opacity: 0.35 }}>◎</span>
      </div>
      <p style={{
        color: '#202124', fontWeight: 600, fontSize: 14,
        marginBottom: 9, letterSpacing: '-0.01em',
      }}>
        Select signals to see your recommendation
      </p>
      <p style={{
        color: '#5f6368', fontSize: 12,
        lineHeight: 1.6, maxWidth: 230, margin: '0 auto',
      }}>
        Check every challenge that applies. More signals produce a more targeted result.
      </p>
    </motion.div>
  )
}

// ─── Primary result card ──────────────────────────────────────────────────────

function PrimaryResultCard({ result, activeSignals }) {
  const { pattern, reasons, matchedCount } = result
  const cat = CATEGORY_COLORS[pattern.category] || CATEGORY_COLORS.foundational
  const catLabel = CATEGORY_META[pattern.category]?.label || pattern.category
  const moduleNum = String(pattern.id).padStart(2, '0')

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 14,
        background: '#ffffff',
        border: `1px solid ${cat.border}`,
        borderTopColor: cat.border,
        boxShadow: `0 1px 3px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.06), 0 0 48px ${cat.bg}`,
        padding: '22px',
        marginBottom: 10,
      }}
    >
      {/* Category-colored top accent */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent 0%, ${cat.text} 25%, ${cat.text} 75%, transparent 100%)`,
      }} />

      {/* Row: label + module */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{
          fontSize: 9.5, fontWeight: 700, color: cat.text,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          Primary Recommendation
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700,
          color: '#4285F4', fontFamily: 'JetBrains Mono, monospace',
          background: '#f0f6ff', border: '1px solid #c5d8ff',
          padding: '2px 8px', borderRadius: 5,
        }}>
          Module {moduleNum}
        </span>
      </div>

      {/* Pattern name */}
      <h3 style={{
        color: '#202124', fontWeight: 800, fontSize: 19,
        letterSpacing: '-0.02em', marginBottom: 10, lineHeight: 1.2,
      }}>
        {pattern.name}
      </h3>

      {/* Category + tier badges */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
          padding: '3px 9px', borderRadius: 10,
          background: cat.bg, border: `1px solid ${cat.border}`, color: cat.text,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: cat.text, flexShrink: 0 }} />
          {catLabel}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
          padding: '3px 9px', borderRadius: 10,
          background: '#f0f6ff', border: '1px solid #c5d8ff',
          color: '#4285F4',
        }}>
          Tier {pattern.tier}
        </span>
      </div>

      {/* Key innovation */}
      <p style={{ color: '#5f6368', fontSize: 12.5, lineHeight: 1.65, marginBottom: 12 }}>
        {pattern.keyInnovation}
      </p>

      {/* Signal reasons */}
      {reasons.length > 0 && (
        <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {reasons.map((reason, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 11.5, color: '#5f6368', lineHeight: 1.5 }}>
              <span style={{ color: cat.text, flexShrink: 0, marginTop: 1, opacity: 0.9 }}>↳</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}

      {/* Signal match strip */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
        padding: '7px 10px', borderRadius: 7,
        background: '#f8f9fa',
        border: '1px solid #e8e8e8',
      }}>
        <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          {activeSignals.map(sid => {
            const signal = SIGNALS.find(s => s.id === sid)
            const matched = (signal?.weights[pattern.id] ?? 0) > 0
            return (
              <div key={sid} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: matched ? cat.text : '#e8e8e8',
                transition: 'background 0.2s ease',
              }} />
            )
          })}
        </div>
        <span style={{ fontSize: 10.5, color: '#5f6368', fontFamily: 'JetBrains Mono, monospace' }}>
          {matchedCount} / {activeSignals.length} signals matched
        </span>
      </div>

      {/* Demo query */}
      {pattern.demoQuery && (
        <div style={{
          padding: '9px 12px', marginBottom: 16,
          borderRadius: 7,
          background: '#f8f9fa',
          border: '1px solid #e8e8e8',
          borderLeft: `2px solid ${cat.text}80`,
        }}>
          <div style={{
            fontSize: 9.5, color: '#9aa0a6', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            marginBottom: 5, fontFamily: 'JetBrains Mono, monospace',
          }}>
            Example query
          </div>
          <div style={{ fontSize: 11.5, color: '#5f6368', lineHeight: 1.55, fontStyle: 'italic' }}>
            "{pattern.demoQuery}"
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <a
          href={`${REPO_BASE}${pattern.notebookPath}`}
          target="_blank" rel="noopener noreferrer"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '9px 12px', borderRadius: 8,
            background: cat.bg, border: `1px solid ${cat.border}`,
            color: cat.text, fontSize: 12, fontWeight: 600,
            textDecoration: 'none', transition: 'filter 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.18)' }}
          onMouseLeave={e => { e.currentTarget.style.filter = '' }}
        >
          <ExternalLink size={12} />
          Open Notebook
        </a>
        <a
          href="#patterns"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '9px 12px', borderRadius: 8,
            background: '#f8f9fa', border: '1px solid #e8e8e8',
            color: '#5f6368', fontSize: 12, fontWeight: 500,
            textDecoration: 'none', transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#e8e5e0'
            e.currentTarget.style.color = '#202124'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#f8f9fa'
            e.currentTarget.style.color = '#5f6368'
          }}
        >
          Browse Catalog
          <ArrowRight size={12} />
        </a>
      </div>
    </motion.div>
  )
}

// ─── Alternative result card ──────────────────────────────────────────────────

function AltResultCard({ result, rank }) {
  const { pattern, reasons } = result
  const cat = CATEGORY_COLORS[pattern.category] || CATEGORY_COLORS.foundational
  const catLabel = CATEGORY_META[pattern.category]?.label || pattern.category
  const moduleNum = String(pattern.id).padStart(2, '0')

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: (rank - 1) * 0.08 }}
      style={{
        padding: '14px',
        borderRadius: 12,
        background: '#ffffff',
        border: '1px solid #e8e8e8',
        borderTopColor: '#e8e8e8',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 9.5, fontWeight: 700, color: '#9aa0a6',
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em',
        }}>
          Module {moduleNum}
        </span>
        <span style={{
          fontSize: 9.5, fontWeight: 600, color: '#9aa0a6',
          padding: '1px 6px', borderRadius: 4,
          background: '#f8f9fa', border: '1px solid #e8e8e8',
        }}>
          Alt {rank - 1}
        </span>
      </div>

      {/* Name */}
      <div style={{
        color: '#202124', fontWeight: 700, fontSize: 13,
        letterSpacing: '-0.01em', lineHeight: 1.3,
      }}>
        {pattern.name}
      </div>

      {/* Category badge */}
      <span style={{
        alignSelf: 'flex-start',
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontSize: 9.5, fontWeight: 600, letterSpacing: '0.04em',
        padding: '2px 7px', borderRadius: 8,
        background: cat.bg, border: `1px solid ${cat.border}`, color: cat.text,
      }}>
        {catLabel}
      </span>

      {/* Reason or key innovation */}
      <p style={{ fontSize: 11, color: '#5f6368', lineHeight: 1.5, flex: 1 }}>
        {reasons[0] || pattern.keyInnovation}
      </p>

      {/* Notebook link */}
      <a
        href={`${REPO_BASE}${pattern.notebookPath}`}
        target="_blank" rel="noopener noreferrer"
        style={{
          alignSelf: 'flex-start',
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 11, fontWeight: 600, color: cat.text,
          textDecoration: 'none', padding: '4px 8px', borderRadius: 6,
          background: cat.bg, border: `1px solid ${cat.border}`,
          transition: 'filter 0.15s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.18)' }}
        onMouseLeave={e => { e.currentTarget.style.filter = '' }}
      >
        Notebook <ExternalLink size={9} />
      </a>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function PatternChooserSection() {
  const [activeSignals, setActiveSignals] = useState([])

  const toggle = (id) =>
    setActiveSignals(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )

  const results = useMemo(
    () => scorePatterns(activeSignals, PATTERNS),
    [activeSignals]
  )

  const primary   = results[0] ?? null
  const alts      = results.slice(1)
  const anyActive = activeSignals.length > 0

  return (
    <section id="recommender" style={{ padding: '80px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 44 }}
        >
          <SectionLabel centered>Pattern Chooser</SectionLabel>
          <h2 style={{
            fontSize: 42,
            fontWeight: 700, letterSpacing: '-0.02em',
            color: '#202124', marginBottom: 16, lineHeight: 1.12, textAlign: 'center',
          }}>
            Choose Your <span style={{ color: '#4285F4' }}>RAG Pattern</span>
          </h2>
          <p style={{ color: '#5f6368', maxWidth: 500, margin: '0 auto', fontSize: 15, lineHeight: 1.65 }}>
            Signal the challenges in your use case. The recommender scores all 26 patterns
            in real time and surfaces the best match.
          </p>
        </motion.div>

        {/* Body: 2-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 28,
          alignItems: 'start',
        }}>

          {/* Left: signals */}
          <div>
            {/* Signal count row */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="mono" style={{ fontSize: 11, color: '#4285F4', fontWeight: 700 }}>
                  {activeSignals.length}
                </span>
                <span style={{ fontSize: 11.5, color: '#9aa0a6' }}>
                  of {SIGNALS.length} signals selected
                </span>
              </div>
              {anyActive && (
                <button
                  onClick={() => setActiveSignals([])}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    fontSize: 11, color: '#5f6368',
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '3px 8px', borderRadius: 5,
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#9aa0a6' }}
                >
                  <RotateCcw size={10} />
                  Clear
                </button>
              )}
            </div>

            {/* Signal grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 8,
            }}>
              {SIGNALS.map((signal, i) => (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <SignalCard
                    signal={signal}
                    active={activeSignals.includes(signal.id)}
                    onClick={() => toggle(signal.id)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Signal legend */}
            <div style={{
              marginTop: 16, padding: '10px 14px',
              borderRadius: 8, fontSize: 11.5, color: '#5f6368', lineHeight: 1.55,
              background: '#f0f6ff', border: '1px solid #c5d8ff',
            }}>
              <span style={{ color: '#4285F4', fontWeight: 600 }}>Tip:</span>{' '}
              Signals stack — selecting multiple narrows the recommendation to patterns that address the most constraints simultaneously.
            </div>
          </div>

          {/* Right: results */}
          <div>
            <AnimatePresence mode="wait">
              {!anyActive || !primary ? (
                <EmptyResults key="empty" />
              ) : (
                <motion.div
                  key={activeSignals.join('-')}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <PrimaryResultCard result={primary} activeSignals={activeSignals} />

                  {alts.length > 0 && (
                    <>
                      <div style={{
                        fontSize: 10.5, fontWeight: 600, color: '#9aa0a6',
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        marginBottom: 8, fontFamily: 'JetBrains Mono, monospace',
                      }}>
                        Alternatives
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: 8,
                      }}>
                        {alts.map((r, i) => (
                          <AltResultCard key={r.pattern.id} result={r} rank={i + 2} />
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
