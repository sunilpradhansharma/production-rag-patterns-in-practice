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
            width: 20,
            height: 3,
            borderRadius: 99,
            background: i < value ? '#4285F4' : '#e8e8e8',
            transition: 'all 0.2s ease',
          }}
        />
      ))}
    </div>
  )
}

const COMPLEXITY_LABELS = { 1: 'Minimal', 2: 'Low', 3: 'Medium', 4: 'High', 5: 'Expert' }

const TIER_CONFIG = {
  1: { label: 'Tier 1', bg: '#eef3ff', border: '#c5d8ff', text: '#1967d2' },
  2: { label: 'Tier 2', bg: '#fff8f0', border: '#fdd9b5', text: '#b06000' },
  3: { label: 'Tier 3', bg: '#fdf3f3', border: '#fac5c5', text: '#c5221f' },
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
        border: hovered ? '1px solid #4285F4' : '1px solid #e8e8e8',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: 'none',
        transition: 'border-color 0.18s ease',
        cursor: 'pointer',
        padding: 20,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13, flex: 1 }}>

        {/* Top row: pattern number + diagram badge + tier */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            fontWeight: 700,
            color: '#9aa0a6',
            background: '#f8f9fa',
            border: '1px solid #f1f3f4',
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
              background: '#fafafa',
              border: '1px solid #e0e0e0',
              color: '#9aa0a6',
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
            color: '#202124',
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
          color: '#5f6368',
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
                background: '#f8f9fa', border: '1px solid #f1f3f4',
                color: '#80868b', fontSize: 11, borderRadius: 6, padding: '5px 10px',
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
          borderTop: '1px solid #e8e8e8',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <ComplexityBar value={pattern.complexity} color="#4285F4" />
            <span style={{ fontSize: 10, color: '#9aa0a6', fontWeight: 500 }}>
              {COMPLEXITY_LABELS[pattern.complexity]}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            <span
              style={{
                display: 'flex', alignItems: 'center', gap: 3,
                fontSize: 12, fontWeight: 600,
                color: hovered ? '#4285F4' : '#202124',
                padding: '6px 18px', borderRadius: 99,
                border: `1px solid ${hovered ? '#4285F4' : '#dadce0'}`,
                background: '#ffffff',
                transition: 'all 0.18s ease',
                pointerEvents: 'none',
              }}
            >
              View details
            </span>
            <a
              href={`${REPO_BASE}${pattern.notebookPath}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: 'flex', alignItems: 'center', gap: 3,
                fontSize: 10.5, fontWeight: 500,
                color: '#9aa0a6',
                textDecoration: 'none',
                padding: '4px 8px', borderRadius: 6,
                background: '#f8f9fa',
                border: '1px solid #f1f3f4',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#202124'
                e.currentTarget.style.borderColor = '#e8e8e8'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#9aa0a6'
                e.currentTarget.style.borderColor = '#f1f3f4'
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
