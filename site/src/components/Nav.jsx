import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Patterns', href: '#patterns' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Learning Paths', href: '#learning' },
  { label: 'Use Cases', href: '#usecases' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        background: scrolled
          ? 'rgba(6,11,20,0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.07)'
          : '1px solid transparent',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          {/* Logo */}
          <a href="#hero" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="4" fill="none" stroke="#060B14" strokeWidth="1.5"/>
                <circle cx="8" cy="8" r="1.5" fill="#060B14"/>
                <line x1="8" y1="2" x2="8" y2="5" stroke="#060B14" strokeWidth="1.2"/>
                <line x1="8" y1="11" x2="8" y2="14" stroke="#060B14" strokeWidth="1.2"/>
                <line x1="2" y1="8" x2="5" y2="8" stroke="#060B14" strokeWidth="1.2"/>
                <line x1="11" y1="8" x2="14" y2="8" stroke="#060B14" strokeWidth="1.2"/>
              </svg>
            </div>
            <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>
              RAG Patterns
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  padding: '6px 14px',
                  borderRadius: 6,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.target.style.color = '#f1f5f9'
                  e.target.style.background = 'rgba(255,255,255,0.06)'
                }}
                onMouseLeave={e => {
                  e.target.style.color = '#94a3b8'
                  e.target.style.background = 'transparent'
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a
              href="https://github.com/sunilpradhansharma/production-rag-patterns-in-practice"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: '#94a3b8',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 500,
                padding: '6px 14px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.10)',
                background: 'rgba(255,255,255,0.03)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#f1f5f9'
                e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)'
                e.currentTarget.style.background = 'rgba(56,189,248,0.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#94a3b8'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              }}
            >
              <Github size={14} />
              <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>Star on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
