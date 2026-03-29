import { useRef, useEffect } from 'react'
import { ExternalLink, GitBranch } from 'lucide-react'
import { CATEGORY_COLORS } from '../data/patterns.js'
import { REPO_BASE } from '../lib/constants.js'

function ComplexityBar({ value, max = 5 }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 20,
            height: 3,
            borderRadius: 99,
            background: i < value ? '#3730A3' : '#F0E8D8',
          }}
        />
      ))}
    </div>
  )
}

const COMPLEXITY_LABELS = { 1: 'Minimal', 2: 'Low', 3: 'Medium', 4: 'High', 5: 'Expert' }

const TIER_CONFIG = {
  1: { label: 'Tier 1', bg: '#EEF2FF', border: '#C5D8FF', text: '#1967D2' },
  2: { label: 'Tier 2', bg: '#FFF8F0', border: '#FDD9B5', text: '#B06000' },
  3: { label: 'Tier 3', bg: '#FDF3F3', border: '#FAC5C5', text: '#C5221F' },
}

export default function PatternCard({ pattern, index, onClick }) {
  const cardRef = useRef(null)
  const cat = CATEGORY_COLORS[pattern.category] || CATEGORY_COLORS.foundational
  const tier = TIER_CONFIG[pattern.tier] || TIER_CONFIG[1]

  // Scroll entrance: IO reveals card with stagger
  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.unobserve(el)
        const delay = index * 80
        setTimeout(() => {
          el.style.transition =
            'opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1)'
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          // Remove inline transform after entrance so CSS :hover can take over
          setTimeout(() => { el.style.transform = '' }, 650)
        }, delay)
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  function handleClick(e) {
    const el = cardRef.current
    if (!el) { onClick(); return }

    // Ripple at click position
    const rect = el.getBoundingClientRect()
    const ripple = document.createElement('div')
    ripple.className = 'card-ripple'
    ripple.style.left = `${e.clientX - rect.left - 20}px`
    ripple.style.top  = `${e.clientY - rect.top  - 20}px`
    el.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)

    // Border + scale flash
    el.style.borderColor = '#3730A3'
    el.style.transform   = 'scale(1.05)'
    setTimeout(() => {
      el.style.borderColor = ''
      el.style.transform   = ''
    }, 350)

    onClick()
  }

  return (
    <div
      ref={cardRef}
      className="pattern-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 20,
        // Initial entrance state — revealed by IO
        opacity: 0,
        transform: 'translateY(32px)',
        transition: 'none',
      }}
      onClick={handleClick}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13, flex: 1 }}>

        {/* Top row: pattern number + diagram badge + tier */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            fontWeight: 700,
            color: '#A8A29E',
            background: '#FFF8ED',
            border: '1px solid #F0E8D8',
            padding: '3px 8px',
            borderRadius: 5,
            letterSpacing: '0.1em',
          }}>
            #{String(pattern.id).padStart(2, '0')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              fontSize: 10, fontWeight: 600, letterSpacing: '0.05em',
              padding: '3px 9px', borderRadius: 99,
              background: '#FFF8ED',
              border: '1px solid #F0E8D8',
              color: '#A8A29E',
            }}>
              <GitBranch size={8} />
              Diagram
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '3px 9px',
              borderRadius: 99,
              background: tier.bg,
              border: `1px solid ${tier.border}`,
              color: tier.text,
              letterSpacing: '0.04em',
            }}>
              {tier.label}
            </span>
          </div>
        </div>

        {/* Name + category */}
        <div>
          <h3 style={{
            color: '#1C1917',
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: '-0.015em',
            lineHeight: 1.3,
            marginBottom: 8,
          }}>
            {pattern.name}
          </h3>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 10,
            fontWeight: 600,
            padding: '3px 9px',
            borderRadius: 10,
            background: cat.bg,
            border: `1px solid ${cat.border}`,
            color: cat.text,
            letterSpacing: '0.04em',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: cat.text, opacity: 0.8, flexShrink: 0 }} />
            {pattern.categoryLabel}
          </span>
        </div>

        {/* Core concept */}
        <p style={{
          color: '#57534E',
          fontSize: 12,
          lineHeight: 1.65,
          flex: 1,
        }}>
          {pattern.coreConcept}
        </p>

        {/* Fintech use cases */}
        {pattern.fintechUseCases.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {pattern.fintechUseCases.slice(0, 2).map(uc => (
              <span key={uc} style={{
                background: '#FFF8ED', border: '1px solid #F0E8D8',
                color: '#A8A29E', fontSize: 11, borderRadius: 6, padding: '5px 10px',
              }}>{uc}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 12,
          borderTop: '1px solid #F0E8D8',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <ComplexityBar value={pattern.complexity} />
            <span style={{ fontSize: 10, color: '#A8A29E', fontWeight: 500 }}>
              {COMPLEXITY_LABELS[pattern.complexity]}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            <span className="view-details-btn">View details</span>
            <a
              href={`${REPO_BASE}${pattern.notebookPath}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: 'flex', alignItems: 'center', gap: 3,
                fontSize: 10.5, fontWeight: 500,
                color: '#A8A29E',
                textDecoration: 'none',
                padding: '4px 8px', borderRadius: 6,
                background: '#FFF8ED',
                border: '1px solid #F0E8D8',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#1C1917'
                e.currentTarget.style.borderColor = '#E8DBC8'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#A8A29E'
                e.currentTarget.style.borderColor = '#F0E8D8'
              }}
            >
              <ExternalLink size={9} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
