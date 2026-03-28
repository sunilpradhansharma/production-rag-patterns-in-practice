import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { PATTERNS, CATEGORIES, CATEGORY_COLORS } from '../data/patterns.js'
import PatternCard from '../components/PatternCard.jsx'
import PatternDetailModal from '../components/PatternDetailModal.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import { PatternExplorerOrb } from '../components/BackgroundEffects.jsx'

export default function PatternExplorerSection() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPattern, setSelectedPattern] = useState(null)

  const filtered = useMemo(() => {
    let result = PATTERNS
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.coreConcept.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.fintechUseCases.some(uc => uc.toLowerCase().includes(q))
      )
    }
    return result
  }, [activeCategory, searchQuery])

  return (
    <section id="patterns" style={{ padding: '80px 24px', position: 'relative' }}>
      <PatternExplorerOrb />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <SectionLabel centered>Pattern Catalog</SectionLabel>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800, letterSpacing: '-0.03em',
            color: '#1a1a18', marginBottom: 14, lineHeight: 1.1,
          }}>
            All 26 RAG Patterns
          </h2>
          <p style={{ color: '#6a6860', maxWidth: 460, margin: '0 auto', fontSize: 15, lineHeight: 1.65 }}>
            From foundational baselines to agentic systems — every pattern with notebooks and fintech examples.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ marginBottom: 36 }}
        >
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 400, margin: '0 auto 22px' }}>
            <Search size={13} style={{
              position: 'absolute', left: 13, top: '50%',
              transform: 'translateY(-50%)',
              color: '#9a9890', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search patterns, categories, use cases…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 36px 10px 36px',
                background: '#ffffff',
                border: '1px solid #e4e0d8',
                borderTopColor: '#e4e0d8',
                borderRadius: 9,
                color: '#1a1a18', fontSize: 13,
                outline: 'none',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.01em',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#bfdbfe'
                e.target.style.borderTopColor = '#93c5fd'
                e.target.style.background = '#ffffff'
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 0 0 3px rgba(37,99,176,0.08)'
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e4e0d8'
                e.target.style.borderTopColor = '#e4e0d8'
                e.target.style.background = '#ffffff'
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: 10, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: '#9a9890',
                  display: 'flex', alignItems: 'center', padding: 2,
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id
              const colors = cat.id !== 'all' ? CATEGORY_COLORS[cat.id] : null
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    fontSize: 12, fontWeight: isActive ? 600 : 500,
                    padding: '6px 14px', borderRadius: 20,
                    border: isActive
                      ? `1px solid ${colors ? colors.border : '#bfdbfe'}`
                      : '1px solid #e4e0d8',
                    borderTopColor: isActive
                      ? (colors ? colors.border : '#93c5fd')
                      : '#e4e0d8',
                    background: isActive
                      ? (colors ? colors.bg : '#eff6ff')
                      : 'transparent',
                    color: isActive ? (colors ? colors.text : '#2563b0') : '#9a9890',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                    display: 'flex', alignItems: 'center', gap: 5,
                    boxShadow: isActive ? '0 1px 0 rgba(255,255,255,0.055) inset, 0 2px 8px rgba(0,0,0,0.15)' : 'none',
                    letterSpacing: '-0.01em',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(0,0,0,0.04)'
                      e.currentTarget.style.color = '#1a1a18'
                      e.currentTarget.style.borderColor = '#d4d0c8'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#9a9890'
                      e.currentTarget.style.borderColor = '#e4e0d8'
                    }
                  }}
                >
                  {isActive && colors && (
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: colors.text, flexShrink: 0 }} />
                  )}
                  {cat.label}
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    background: isActive ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.04)',
                    color: isActive ? (colors ? colors.text : '#2563b0') : '#9a9890',
                    padding: '0 5px', borderRadius: 6,
                    lineHeight: '16px', display: 'inline-block',
                    minWidth: 18, textAlign: 'center',
                    transition: 'all 0.15s ease',
                  }}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Result count */}
        <div style={{ textAlign: 'center', marginBottom: 24, fontSize: 11.5, color: '#9a9890', letterSpacing: '0.02em' }}>
          {filtered.length === PATTERNS.length
            ? `Showing all ${PATTERNS.length} patterns`
            : `${filtered.length} pattern${filtered.length !== 1 ? 's' : ''} found`}
          {activeCategory !== 'all' && (
            <button
              onClick={() => setActiveCategory('all')}
              style={{ marginLeft: 10, color: '#2563b0', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11.5, textDecoration: 'underline' }}
            >
              clear filter
            </button>
          )}
        </div>

        {/* Grid */}
        <AnimatePresence mode="sync">
          {filtered.length > 0 ? (
            <motion.div
              key={`${activeCategory}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(288px, 1fr))', gap: 14 }}
            >
              {filtered.map((pattern, i) => (
                <PatternCard
                  key={pattern.id}
                  pattern={pattern}
                  index={i}
                  onClick={() => setSelectedPattern(pattern)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '64px 24px', color: '#2a3f52' }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>◎</div>
              <p style={{ fontWeight: 600, color: '#3d5068', marginBottom: 6 }}>No patterns found</p>
              <p style={{ fontSize: 13 }}>Try a different search term or category</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pattern detail modal */}
      <AnimatePresence>
        {selectedPattern && (
          <PatternDetailModal
            key={selectedPattern.id}
            pattern={selectedPattern}
            onClose={() => setSelectedPattern(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
