import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
        background: '#ffffff',
        borderBottom: '1px solid #e8e8e8',
        transition: 'box-shadow 0.3s ease',
        boxShadow: scrolled ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
        height: 60,
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>

          {/* Logo */}
          <a href="#hero" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C12 2 12 10 4 12C12 14 12 22 12 22C12 22 12 14 20 12C12 10 12 2 12 2Z" fill="#4285F4"/>
            </svg>
            <div style={{ color: '#202124', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', lineHeight: 1 }}>
              RAG Patterns
            </div>
          </a>

          {/* Nav links */}
          <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  color: '#5f6368',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 400,
                  padding: '6px 13px',
                  borderRadius: 7,
                  transition: 'all 0.15s ease',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={e => {
                  e.target.style.color = '#202124'
                  e.target.style.background = 'rgba(0,0,0,0.04)'
                }}
                onMouseLeave={e => {
                  e.target.style.color = '#5f6368'
                  e.target.style.background = 'transparent'
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA button */}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: 14, fontWeight: 600,
              padding: '8px 22px',
              borderRadius: 99,
              border: 'none',
              background: '#4285F4',
              transition: 'background 0.18s ease',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1a73e8' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#4285F4' }}
          >
            View on GitHub
          </a>
        </div>
      </div>
    </motion.nav>
  )
}
