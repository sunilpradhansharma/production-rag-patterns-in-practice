import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Patterns', href: '#patterns' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Learning Paths', href: '#learning' },
  { label: 'Use Cases', href: '#usecases' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled
          ? 'rgba(5,10,18,0.88)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(22px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(22px) saturate(180%)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.065)'
          : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 0 rgba(56,189,248,0.04)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Subtle top edge glow when scrolled */}
      {scrolled && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.18), transparent)',
          pointerEvents: 'none',
        }} />
      )}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 58 }}>

          {/* Logo */}
          <a href="#hero" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #0ea5e9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(14,165,233,0.35), 0 0 0 1px rgba(56,189,248,0.2)',
            }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="4" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5"/>
                <circle cx="8" cy="8" r="1.5" fill="white"/>
                <line x1="8" y1="2" x2="8" y2="5.2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2"/>
                <line x1="8" y1="10.8" x2="8" y2="14" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2"/>
                <line x1="2" y1="8" x2="5.2" y2="8" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2"/>
                <line x1="10.8" y1="8" x2="14" y2="8" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2"/>
              </svg>
            </div>
            <div>
              <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                RAG Patterns
              </div>
              <div style={{ color: '#3d5068', fontSize: 10, fontWeight: 500, letterSpacing: '0.04em' }}>
                in Practice
              </div>
            </div>
          </a>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  color: '#4a6070',
                  textDecoration: 'none',
                  fontSize: 13.5,
                  fontWeight: 500,
                  padding: '6px 13px',
                  borderRadius: 7,
                  transition: 'all 0.15s ease',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={e => {
                  e.target.style.color = '#cbd5e1'
                  e.target.style.background = 'rgba(255,255,255,0.055)'
                }}
                onMouseLeave={e => {
                  e.target.style.color = '#4a6070'
                  e.target.style.background = 'transparent'
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* GitHub button */}
          <a
            href="https://github.com/sunilpradhansharma/production-rag-patterns-in-practice"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#64748b',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 500,
              padding: '7px 14px',
              borderRadius: 7,
              border: '1px solid rgba(255,255,255,0.09)',
              borderTopColor: 'rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)',
              transition: 'all 0.18s ease',
              letterSpacing: '-0.01em',
              boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#94a3b8'
              e.currentTarget.style.borderColor = 'rgba(56,189,248,0.25)'
              e.currentTarget.style.borderTopColor = 'rgba(56,189,248,0.32)'
              e.currentTarget.style.background = 'rgba(56,189,248,0.07)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#64748b'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'
              e.currentTarget.style.borderTopColor = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            }}
          >
            <Github size={13} strokeWidth={2} />
            GitHub
          </a>
        </div>
      </div>
    </motion.nav>
  )
}
