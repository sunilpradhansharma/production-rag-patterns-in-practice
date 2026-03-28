import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import { PATTERNS, CATEGORIES, CATEGORY_COLORS } from '../data/patterns.js'
import PatternCard from './PatternCard.jsx'

export default function PatternExplorer() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

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
    <section
      id="patterns"
      style={{ padding: '80px 24px', position: 'relative' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <div className="section-label" style={{ marginBottom: 12 }}>Pattern Catalog</div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#f1f5f9',
            marginBottom: 14,
            lineHeight: 1.15,
          }}>
            All 26 RAG Patterns
          </h2>
          <p style={{ color: '#64748b', maxWidth: 500, margin: '0 auto', fontSize: 15, lineHeight: 1.6 }}>
            From foundational baselines to agentic systems — every pattern with runnable notebooks and fintech examples.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ marginBottom: 32 }}
        >
          {/* Search */}
          <div style={{
            position: 'relative',
            maxWidth: 380,
            margin: '0 auto 20px',
          }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#475569',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search patterns, categories, use cases…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 34px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 8,
                color: '#f1f5f9',
                fontSize: 13,
                outline: 'none',
                transition: 'border-color 0.2s ease',
                fontFamily: 'Inter, sans-serif',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(56,189,248,0.35)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
            />
          </div>

          {/* Category filters */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            justifyContent: 'center',
          }}>
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id
              const colors = cat.id !== 'all' ? CATEGORY_COLORS[cat.id] : null
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: isActive
                      ? `1px solid ${colors ? colors.border : 'rgba(56,189,248,0.4)'}`
                      : '1px solid rgba(255,255,255,0.08)',
                    background: isActive
                      ? (colors ? colors.bg : 'rgba(56,189,248,0.12)')
                      : 'rgba(255,255,255,0.03)',
                    color: isActive
                      ? (colors ? colors.text : '#38bdf8')
                      : '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                      e.currentTarget.style.color = '#94a3b8'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                      e.currentTarget.style.color = '#64748b'
                    }
                  }}
                >
                  {cat.label}
                  <span style={{
                    fontSize: 10,
                    background: 'rgba(255,255,255,0.08)',
                    padding: '1px 5px',
                    borderRadius: 8,
                  }}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Results count */}
        <div style={{
          textAlign: 'center',
          marginBottom: 24,
          fontSize: 12,
          color: '#475569',
        }}>
          {filtered.length === PATTERNS.length
            ? `Showing all ${PATTERNS.length} patterns`
            : `${filtered.length} pattern${filtered.length !== 1 ? 's' : ''} found`}
        </div>

        {/* Pattern grid */}
        <AnimatePresence mode="sync">
          {filtered.length > 0 ? (
            <motion.div
              key={`${activeCategory}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
              }}
            >
              {filtered.map((pattern, i) => (
                <PatternCard key={pattern.id} pattern={pattern} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '60px 24px',
                color: '#475569',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <p style={{ fontWeight: 600, color: '#64748b' }}>No patterns found</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>Try a different search term or category</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
