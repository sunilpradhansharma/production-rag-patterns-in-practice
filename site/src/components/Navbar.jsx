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
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [navScrolled, setNavScrolled] = useState(false)

  // Scroll progress bar + scroll shadow
  useEffect(() => {
    const onScroll = () => {
      const p = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      setScrollProgress(Math.min(p, 100))
      setNavScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section tracking
  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.slice(1))
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <motion.nav
        className={`site-nav${navScrolled ? ' nav-scrolled' : ''}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        {/* Logo */}
        <a href="#hero" className="nav-logo" style={{ textDecoration: 'none' }}>
          <svg
            className="nav-star"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 2C12 2 12 10 4 12C12 14 12 22 12 22C12 22 12 14 20 12C12 10 12 2 12 2Z"
              fill="#3730A3"
            />
          </svg>
          RAG Patterns
        </a>

        {/* Nav links */}
        <nav className="nav-links" aria-label="Site sections">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={activeSection === link.href.slice(1) ? 'active' : ''}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-cta"
        >
          View on GitHub
        </a>
      </motion.nav>

      {/* Scroll progress bar */}
      <div className="scroll-progress" aria-hidden="true">
        <div className="scroll-fill" style={{ width: `${scrollProgress}%` }} />
      </div>
    </>
  )
}
