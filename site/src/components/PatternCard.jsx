import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { CATEGORY_COLORS } from '../data/patterns.js'

const REPO_BASE = 'https://github.com/sunilpradhansharma/production-rag-patterns-in-practice/blob/main/'

function ComplexityDots({ value, max = 5 }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: i < value
              ? 'linear-gradient(135deg, #0ea5e9, #38bdf8)'
              : 'rgba(255,255,255,0.1)',
            transition: 'background 0.2s ease',
          }}
        />
      ))}
    </div>
  )
}

const COMPLEXITY_LABELS = { 1: 'Minimal', 2: 'Low', 3: 'Medium', 4: 'High', 5: 'Expert' }
const TIER_COLORS = {
  1: { bg: 'rgba(56,189,248,0.1)', text: '#38bdf8' },
  2: { bg: 'rgba(167,139,250,0.1)', text: '#a78bfa' },
  3: { bg: 'rgba(251,146,60,0.1)', text: '#fb923c' },
}

export default function PatternCard({ pattern, index }) {
  const catColors = CATEGORY_COLORS[pattern.category] || CATEGORY_COLORS.foundational
  const tierColor = TIER_COLORS[pattern.tier] || TIER_COLORS[1]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index % 6, 5) * 0.06 }}
      className="glass-card-hover"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        height: '100%',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
          fontWeight: 700,
          color: '#334155',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '3px 8px',
          borderRadius: 5,
          letterSpacing: '0.08em',
          flexShrink: 0,
        }}>
          #{String(pattern.id).padStart(2, '0')}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 12,
              background: tierColor.bg,
              color: tierColor.text,
              letterSpacing: '0.05em',
            }}
          >
            T{pattern.tier}
          </span>
        </div>
      </div>

      {/* Pattern name */}
      <div>
        <h3 style={{
          color: '#f1f5f9',
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: '-0.01em',
          marginBottom: 6,
          lineHeight: 1.3,
        }}>
          {pattern.name}
        </h3>
        <span
          style={{
            display: 'inline-flex',
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 12,
            background: catColors.bg,
            border: `1px solid ${catColors.border}`,
            color: catColors.text,
            letterSpacing: '0.04em',
          }}
        >
          {pattern.categoryLabel}
        </span>
      </div>

      {/* Core concept */}
      <p style={{
        color: '#64748b',
        fontSize: 12.5,
        lineHeight: 1.6,
        flex: 1,
      }}>
        {pattern.coreConcept}
      </p>

      {/* Fintech use cases */}
      {pattern.fintechUseCases.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {pattern.fintechUseCases.slice(0, 2).map(uc => (
            <span
              key={uc}
              style={{
                fontSize: 10,
                color: '#475569',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                padding: '2px 7px',
                borderRadius: 4,
              }}
            >
              {uc}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ComplexityDots value={pattern.complexity} />
          <span style={{ fontSize: 10, color: '#475569', fontWeight: 500 }}>
            {COMPLEXITY_LABELS[pattern.complexity]}
          </span>
        </div>
        <a
          href={`${REPO_BASE}${pattern.notebookPath}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            color: '#38bdf8',
            fontWeight: 600,
            textDecoration: 'none',
            padding: '4px 8px',
            borderRadius: 5,
            background: 'rgba(56,189,248,0.08)',
            border: '1px solid rgba(56,189,248,0.15)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(56,189,248,0.15)'
            e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(56,189,248,0.08)'
            e.currentTarget.style.borderColor = 'rgba(56,189,248,0.15)'
          }}
        >
          Notebook
          <ExternalLink size={10} />
        </a>
      </div>
    </motion.div>
  )
}
