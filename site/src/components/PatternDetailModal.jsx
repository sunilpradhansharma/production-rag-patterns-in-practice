import { useEffect, useRef } from 'react'
import { X, ExternalLink, BookOpen, FolderOpen, FileText } from 'lucide-react'
import { CATEGORY_COLORS, CATEGORY_META } from '../data/patterns.js'
import { REPO_BASE, GITHUB_URL } from '../lib/constants.js'
import { buildDiagram } from '../lib/svgDiagrams.js'
import { runDiagramAnimation } from '../lib/animations.js'

const TIER_CONFIG = {
  1: { label: 'Tier 1', color: '#1967d2', bg: '#EEF2FF', border: '#C5D8FF' },
  2: { label: 'Tier 2', color: '#b06000', bg: '#fff8f0', border: '#fdd9b5' },
  3: { label: 'Tier 3', color: '#c5221f', bg: '#fdf3f3', border: '#fac5c5' },
}

const COMPLEXITY_LABELS = { 1: 'Minimal', 2: 'Low', 3: 'Medium', 4: 'High', 5: 'Expert' }

export default function PatternDetailModal({ pattern, onClose }) {
  const overlayRef = useRef(null)
  const panelRef   = useRef(null)
  const diagRef    = useRef(null)

  const cat      = CATEGORY_COLORS[pattern.category] || CATEGORY_COLORS.foundational
  const catLabel = CATEGORY_META[pattern.category]?.label || pattern.category
  const tier     = TIER_CONFIG[pattern.tier] || TIER_CONFIG[1]
  const moduleNum = String(pattern.id).padStart(2, '0')

  // Animated close — remove .open, wait for transition, then notify parent
  function animateClose() {
    const overlay = overlayRef.current
    const panel   = panelRef.current
    if (overlay) overlay.classList.remove('open')
    if (panel)   panel.classList.remove('open')
    setTimeout(onClose, 380)
  }

  useEffect(() => {
    // Open animation on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlayRef.current?.classList.add('open')
        panelRef.current?.classList.add('open')
      })
    })

    // Body scroll lock
    document.body.style.overflow = 'hidden'

    // Escape key
    const onKey = e => { if (e.key === 'Escape') animateClose() }
    window.addEventListener('keydown', onKey)

    // Inject SVG + run animation
    const diagram = buildDiagram(pattern.id)
    if (diagram && diagRef.current) {
      diagRef.current.innerHTML = diagram.svgHTML
      // Small delay lets SVG paint before animating
      setTimeout(() => runDiagramAnimation(diagram.steps), 80)
    }

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="modal-overlay"
        onClick={animateClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="modal-panel"
        onClick={e => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${cat.text} 30%, ${cat.text} 70%, transparent 100%)`,
          borderRadius: '20px 20px 0 0',
        }} />

        {/* Close button */}
        <button className="modal-close" onClick={animateClose} aria-label="Close">
          <X size={14} />
        </button>

        <div style={{ padding: '28px 30px 32px' }}>

          {/* Header */}
          <div style={{ marginBottom: 22, paddingRight: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.11em',
                fontFamily: 'JetBrains Mono, monospace',
                color: '#3730A3', background: '#EEF2FF',
                border: '1px solid #C7D2FE', padding: '3px 9px', borderRadius: 5,
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
                    fontSize: 10, color: '#A8A29E', textDecoration: 'none',
                    fontFamily: 'JetBrains Mono, monospace',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#57534E' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#A8A29E' }}
                >
                  {pattern.sourcePaper}
                </a>
              )}
            </div>

            <h2 style={{
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 700,
              color: '#1C1917', letterSpacing: '-0.025em', lineHeight: 1.1,
              marginBottom: 10,
            }}>
              {pattern.name}
            </h2>

            <p style={{ color: '#57534E', fontSize: 13.5, lineHeight: 1.65, maxWidth: 680 }}>
              {pattern.coreConcept}
            </p>
          </div>

          {/* Architecture diagram */}
          <div
            ref={diagRef}
            className="diag-stage"
          />

          {/* Diagram label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, marginTop: -16 }}>
            <div style={{ width: 18, height: 1.5, background: `linear-gradient(90deg, ${cat.text}, transparent)`, borderRadius: 1 }} />
            <span style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase',
              color: cat.text, fontFamily: 'JetBrains Mono, monospace',
            }}>
              Architecture Diagram
            </span>
          </div>

          {/* Info cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 12, marginBottom: 20,
          }}>
            <div className="info-card">
              <div className="info-card-label">Key Innovation</div>
              <p className="info-card-body">{pattern.keyInnovation}</p>
            </div>
            {pattern.demoQuery && (
              <div
                className="info-card accent"
                style={{ borderLeftColor: `${cat.text}80` }}
              >
                <div className="info-card-label">Example Query</div>
                <p className="info-card-body" style={{ fontStyle: 'italic' }}>
                  "{pattern.demoQuery}"
                </p>
              </div>
            )}
          </div>

          {/* Fintech use cases */}
          {pattern.fintechUseCases?.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div className="info-card-label" style={{ marginBottom: 9 }}>Fintech Use Cases</div>
              <div className="uses-chips">
                {pattern.fintechUseCases.map(uc => (
                  <span
                    key={uc}
                    className="use-chip"
                    style={{ background: cat.bg, border: `1px solid ${cat.border}`, color: cat.text }}
                  >
                    {uc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer: complexity + actions */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 14,
            paddingTop: 18, borderTop: '1px solid #F0E8D8',
          }}>
            {/* Complexity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ fontSize: 10.5, color: '#A8A29E', fontWeight: 500 }}>Complexity</span>
              <div style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{
                    width: i < pattern.complexity ? 16 : 9, height: 3, borderRadius: 99,
                    background: i < pattern.complexity ? '#4F46E5' : '#F0E8D8',
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 10.5, color: '#A8A29E' }}>{COMPLEXITY_LABELS[pattern.complexity]}</span>
            </div>

            {/* Action links */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a
                href={`${REPO_BASE}${pattern.notebookPath}`}
                target="_blank" rel="noopener noreferrer"
                className="fbtn primary"
                style={{ color: cat.text, background: cat.bg, borderColor: cat.border }}
                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.08)' }}
                onMouseLeave={e => { e.currentTarget.style.filter = '' }}
              >
                <BookOpen size={12} />
                Notebook
                <ExternalLink size={10} />
              </a>
              <a
                href={`${REPO_BASE}${pattern.skillPath}`}
                target="_blank" rel="noopener noreferrer"
                className="fbtn"
              >
                <FileText size={12} />
                SKILL.md
                <ExternalLink size={10} />
              </a>
              <a
                href={`${GITHUB_URL}/tree/main/modules/${pattern.jsonId}`}
                target="_blank" rel="noopener noreferrer"
                className="fbtn"
              >
                <FolderOpen size={12} />
                Module
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
