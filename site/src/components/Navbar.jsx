import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Github } from 'lucide-react'
import { GITHUB_URL } from '../lib/constants.js'

const NAV_LINKS = [
  { label: 'Recommender',    href: '#recommender' },
  { label: 'Patterns',       href: '#patterns' },
  { label: 'Architecture',   href: '#architecture' },
  { label: 'Learning Paths', href: '#learning' },
  { label: 'Use Cases',      href: '#usecases' },
]

export default function Navbar() {
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
        top: 0, left: 0, right: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(250,249,246,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(22px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(22px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid #e4e0d8' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {scrolled && (
        <div style={{
          position: 'absolute',
          top: 0, left: '20%', right: '20%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(37,99,176,0.15), transparent)',
          pointerEvents: 'none',
        }} />
      )}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 58 }}>

          {/* Logo */}
          <a href="#hero" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30,
              borderRadius: 7,
              background: 'linear-gradient(135deg, #1d4ed8 0%, #2563b0 50%, #3b82f6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(37,99,176,0.3), 0 0 0 1px rgba(37,99,176,0.15)',
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
              <div style={{ color: '#1a1a18', fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                RAG Patterns
              </div>
              <div style={{ color: '#9a9890', fontSize: 10, fontWeight: 500, letterSpacing: '0.04em' }}>
                in Practice
              </div>
            </div>
          </a>

          {/* Nav links */}
          <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  color: '#9a9890',
                  textDecoration: 'none',
                  fontSize: 13.5,
                  fontWeight: 500,
                  padding: '6px 13px',
                  borderRadius: 7,
                  transition: 'all 0.15s ease',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={e => {
                  e.target.style.color = '#1a1a18'
                  e.target.style.background = 'rgba(0,0,0,0.04)'
                }}
                onMouseLeave={e => {
                  e.target.style.color = '#9a9890'
                  e.target.style.background = 'transparent'
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* GitHub button */}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: '#6a6860',
              textDecoration: 'none',
              fontSize: 13, fontWeight: 500,
              padding: '7px 14px',
              borderRadius: 7,
              border: '1px solid #e4e0d8',
              borderTopColor: '#e4e0d8',
              background: '#ffffff',
              transition: 'all 0.18s ease',
              letterSpacing: '-0.01em',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#1a1a18'
              e.currentTarget.style.borderColor = '#bfdbfe'
              e.currentTarget.style.borderTopColor = '#93c5fd'
              e.currentTarget.style.background = '#eff6ff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#6a6860'
              e.currentTarget.style.borderColor = '#e4e0d8'
              e.currentTarget.style.borderTopColor = '#e4e0d8'
              e.currentTarget.style.background = '#ffffff'
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
