import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Layers, Zap, Files, RefreshCw, GitBranch, Star } from 'lucide-react'
import { PATTERNS, CATEGORIES, CATEGORY_META, CATEGORY_COLORS } from '../data/patterns.js'
import PatternCard from '../components/PatternCard.jsx'
import PatternDetailModal from '../components/PatternDetailModal.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import { PatternExplorerOrb } from '../components/BackgroundEffects.jsx'

const CAT_ICONS = {
  foundational:             Layers,
  retrieval_enhancement:    Zap,
  indexing_chunking:        Files,
  reasoning_self_correction: RefreshCw,
  architectural:            GitBranch,
  specialized:              Star,
}

// All categories except 'all'
const CAT_KEYS = Object.keys(CATEGORY_META)

export default function PatternExplorerSection() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPattern, setSelectedPattern] = useState(null)
  const prevCategoryRef = useRef('all')

  // Count chip bounce when active filter changes
  useEffect(() => {
    if (prevCategoryRef.current === activeCategory) return
    prevCategoryRef.current = activeCategory
    const chip = document.querySelector('.filter-pill.active .pill-count')
    if (!chip) return
    chip.style.transition = 'transform .15s ease-out'
    chip.style.transform = 'scale(1.3)'
    setTimeout(() => {
      chip.style.transition = 'transform .15s ease-in'
      chip.style.transform = 'scale(1)'
    }, 150)
  }, [activeCategory])

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
        p.categoryLabel?.toLowerCase().includes(q) ||
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
        <div data-section-header="" style={{ textAlign: 'center', marginBottom: 48 }}>
          <SectionLabel centered>Pattern Catalog</SectionLabel>
          <h2 style={{
            fontSize: 42,
            fontWeight: 700, letterSpacing: '-0.02em',
            color: '#1C1917', marginBottom: 16, lineHeight: 1.12, textAlign: 'center',
          }}>
            All 26 <span style={{ color: '#3730A3' }}>RAG Patterns</span>
          </h2>
          <p style={{ color: '#57534E', maxWidth: 460, margin: '0 auto', fontSize: 15, lineHeight: 1.65 }}>
            From foundational baselines to agentic systems — every pattern with notebooks and fintech examples.
          </p>
        </div>

        {/* Category cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: 12,
          marginBottom: 40,
        }}>
          {CAT_KEYS.map(key => {
            const meta   = CATEGORY_META[key]
            const colors = CATEGORY_COLORS[key]
            const Icon   = CAT_ICONS[key] || Star
            const count  = CATEGORIES.find(c => c.id === key)?.count || 0
            const isActive = activeCategory === key

            return (
              <button
                key={key}
                className="cat-card"
                onClick={() => setActiveCategory(isActive ? 'all' : key)}
                style={{
                  textAlign: 'left',
                  background: isActive ? '#EEF2FF' : '#fff',
                  borderColor: isActive ? '#3730A3' : '#F0E8D8',
                }}
              >
                <div className="cat-icon" style={isActive ? { background: '#3730A3' } : {}}>
                  <Icon
                    size={16}
                    style={{ color: isActive ? '#fff' : '#3730A3' }}
                    strokeWidth={2}
                  />
                </div>
                <div style={{
                  fontSize: 12, fontWeight: 600, color: isActive ? '#3730A3' : '#1C1917',
                  marginBottom: 4, lineHeight: 1.3,
                }}>
                  {meta.label}
                </div>
                <div style={{ fontSize: 11, color: '#A8A29E', lineHeight: 1.4, marginBottom: 6 }}>
                  {meta.description}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  background: colors.bg, border: `1px solid ${colors.border}`,
                  color: colors.text, padding: '2px 7px', borderRadius: 5,
                }}>
                  {count} patterns
                </span>
              </button>
            )
          })}
        </div>

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
              color: '#A8A29E', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search patterns, categories, use cases…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 36px 10px 36px',
                background: '#FFFFFF',
                border: '1px solid #F0E8D8',
                borderTopColor: '#F0E8D8',
                borderRadius: 9,
                color: '#1C1917', fontSize: 13,
                outline: 'none',
                transition: 'all 0.2s ease',
                fontFamily: "'Google Sans', 'Product Sans', sans-serif",
                letterSpacing: '-0.01em',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#C7D2FE'
                e.target.style.borderTopColor = '#A5B4FC'
                e.target.style.background = '#FFFFFF'
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 0 0 3px rgba(55,48,163,0.08)'
              }}
              onBlur={e => {
                e.target.style.borderColor = '#F0E8D8'
                e.target.style.borderTopColor = '#F0E8D8'
                e.target.style.background = '#FFFFFF'
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
                  cursor: 'pointer', color: '#A8A29E',
                  display: 'flex', alignItems: 'center', padding: 2,
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`filter-pill${activeCategory === cat.id ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
                <span className="pill-count">{cat.count}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Result count */}
        <div style={{ textAlign: 'center', marginBottom: 24, fontSize: 11.5, color: '#A8A29E', letterSpacing: '0.02em' }}>
          {filtered.length === PATTERNS.length
            ? `Showing all ${PATTERNS.length} patterns`
            : `${filtered.length} pattern${filtered.length !== 1 ? 's' : ''} found`}
          {activeCategory !== 'all' && (
            <button
              onClick={() => setActiveCategory('all')}
              style={{ marginLeft: 10, color: '#3730A3', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11.5, textDecoration: 'underline' }}
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
              style={{ textAlign: 'center', padding: '64px 24px', color: '#1C1917' }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>◎</div>
              <p style={{ fontWeight: 600, color: '#57534E', marginBottom: 6 }}>No patterns found</p>
              <p style={{ fontSize: 13 }}>Try a different search term or category</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pattern detail modal */}
      {selectedPattern && (
        <PatternDetailModal
          pattern={selectedPattern}
          onClose={() => setSelectedPattern(null)}
        />
      )}
    </section>
  )
}
