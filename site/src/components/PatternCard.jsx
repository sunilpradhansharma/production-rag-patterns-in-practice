import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, GitBranch } from 'lucide-react'
import { CATEGORY_COLORS } from '../data/patterns.js'
import { REPO_BASE } from '../lib/constants.js'

function ComplexityBar({ value, max = 5, color }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i < value ? 14 : 8,
            height: 3,
            borderRadius: 2,
            background: i < value
              ? `linear-gradient(90deg, ${color}cc, ${color})`
              : '#e4e0d8',
            transition: 'all 0.2s ease',
          }}
        />
      ))}
    </div>
  )
}

const COMPLEXITY_LABELS = { 1: 'Minimal', 2: 'Low', 3: 'Medium', 4: 'High', 5: 'Expert' }

const TIER_CONFIG = {
  1: { label: 'Tier 1', bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  2: { label: 'Tier 2', bg: '#fff7ed', border: '#fed7aa', text: '#b45309' },
  3: { label: 'Tier 3', bg: '#fef2f2', border: '#fecaca', text: '#b91c1c' },
}

export default function PatternCard({ pattern, index, onClick }) {
  const [hovered, setHovered] = useState(false)
  const cat = CATEGORY_COLORS[pattern.category] || CATEGORY_COLORS.foundational
  const tier = TIER_CONFIG[pattern.tier] || TIER_CONFIG[1]

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.38, delay: Math.min(index % 6, 5) * 0.065 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#ffffff',
        border: hovered
          ? `1px solid ${cat.border}`
          : '1px solid #e4e0d8',
        borderTopColor: hovered ? cat.border : '#e4e0d8',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: hovered
          ? `0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08), 0 0 40px ${cat.bg}`
          : '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.22s ease',
        cursor: 'pointer',
      }}
    >
      {/* Category color accent line at top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, ${cat.text}00 0%, ${cat.text} 40%, ${cat.text} 60%, ${cat.text}00 100%)`,
        opacity: hovered ? 0.7 : 0,
        transition: 'opacity 0.22s ease',
        borderRadius: '14px 14px 0 0',
      }} />

      <div style={{ padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', gap: 13, flex: 1 }}>

        {/* Top row: pattern number + diagram badge + tier */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10.5,
            fontWeight: 700,
            color: hovered ? cat.text : '#9a9890',
            background: hovered ? cat.bg : '#f5f3ee',
            border: `1px solid ${hovered ? cat.border : '#e4e0d8'}`,
            padding: '3px 8px',
            borderRadius: 5,
            letterSpacing: '0.1em',
            transition: 'all 0.2s ease',
          }}>
            #{String(pattern.id).padStart(2, '0')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {/* Diagram available indicator */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              fontSize: 9.5, fontWeight: 600, letterSpacing: '0.05em',
              padding: '2px 7px', borderRadius: 6,
              background: hovered ? `${cat.text}18` : '#f5f3ee',
              border: `1px solid ${hovered ? cat.text + '55' : '#e4e0d8'}`,
              color: hovered ? cat.text : '#9a9890',
              transition: 'all 0.2s ease',
            }}>
              <GitBranch size={8} />
              Diagram
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '2px 9px',
              borderRadius: 10,
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
            color: '#1a1a18',
            fontWeight: 700,
            fontSize: 14.5,
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
          color: '#6a6860',
          fontSize: 12.5,
          lineHeight: 1.65,
          flex: 1,
        }}>
          {pattern.coreConcept}
        </p>

        {/* Fintech use cases */}
        {pattern.fintechUseCases.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {pattern.fintechUseCases.slice(0, 2).map(uc => (
              <span key={uc} className="tag-dim">{uc}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 12,
          borderTop: `1px solid ${hovered ? '#d4d0c8' : '#e4e0d8'}`,
          transition: 'border-color 0.2s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <ComplexityBar value={pattern.complexity} color={cat.text} />
            <span style={{ fontSize: 10, color: '#9a9890', fontWeight: 500 }}>
              {COMPLEXITY_LABELS[pattern.complexity]}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {/* View diagram — triggers modal via card click */}
            <span style={{
              display: 'flex', alignItems: 'center', gap: 3,
              fontSize: 10.5, fontWeight: 600, letterSpacing: '-0.01em',
              color: hovered ? cat.text : '#2563b0',
              padding: '4px 9px', borderRadius: 6,
              background: hovered ? cat.bg : '#eff6ff',
              border: `1px solid ${hovered ? cat.border : '#bfdbfe'}`,
              transition: 'all 0.18s ease',
              pointerEvents: 'none',
            }}>
              View details
            </span>
            {/* Notebook — direct external link */}
            <a
              href={`${REPO_BASE}${pattern.notebookPath}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: 'flex', alignItems: 'center', gap: 3,
                fontSize: 10.5, fontWeight: 500,
                color: '#9a9890',
                textDecoration: 'none',
                padding: '4px 8px', borderRadius: 6,
                background: '#f5f3ee',
                border: '1px solid #e4e0d8',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#1a1a18'
                e.currentTarget.style.borderColor = '#ccc9c0'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#9a9890'
                e.currentTarget.style.borderColor = '#e4e0d8'
              }}
            >
              <ExternalLink size={9} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
