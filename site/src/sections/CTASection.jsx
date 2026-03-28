import { motion } from 'framer-motion'
import { GITHUB_URL } from '../lib/constants.js'

const FOOTER_COLS = [
  {
    title: 'Workshop',
    links: [
      { label: 'All 26 Patterns',       href: '#patterns' },
      { label: 'Architecture Diagrams', href: '#architecture' },
      { label: 'Learning Paths',        href: '#learning' },
      { label: 'Fintech Use Cases',     href: '#usecases' },
      { label: '90-Minute Workshop',    href: '#recommender' },
    ],
  },
  {
    title: 'Patterns',
    links: [
      { label: 'Foundational',          href: '#patterns' },
      { label: 'Retrieval Enhancement', href: '#patterns' },
      { label: 'Indexing & Chunking',   href: '#patterns' },
      { label: 'Reasoning',             href: '#patterns' },
      { label: 'Specialized',           href: '#patterns' },
    ],
  },
  {
    title: 'Links',
    links: [
      { label: 'GitHub Repository',  href: GITHUB_URL, external: true },
      { label: 'Contributing',       href: `${GITHUB_URL}/blob/main/CONTRIBUTING.md`, external: true },
      { label: 'License',            href: `${GITHUB_URL}/blob/main/LICENSE`, external: true },
      { label: 'LinkedIn',           href: 'https://www.linkedin.com/in/sunil-p-sharma/', external: true },
    ],
  },
]

export default function CTASection() {
  return (
    <section style={{ borderTop: '1px solid #e8e8e8' }}>
      {/* 3-column footer grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24,
          padding: '40px 32px', maxWidth: 960, margin: '0 auto',
        }}
      >
        {FOOTER_COLS.map(col => (
          <div key={col.title}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#202124', marginBottom: 12 }}>
              {col.title}
            </div>
            {col.links.map(link => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                style={{
                  fontSize: 12, color: '#5f6368', display: 'block',
                  marginBottom: 8, textDecoration: 'none', transition: 'color 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#202124' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#5f6368' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </motion.div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid #e8e8e8',
        padding: '16px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: 960, margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C12 2 12 10 4 12C12 14 12 22 12 22C12 22 12 14 20 12C12 10 12 2 12 2Z" fill="#4285F4"/>
          </svg>
          <span style={{ fontSize: 12, color: '#9aa0a6' }}>RAG Patterns in Practice</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'License', href: `${GITHUB_URL}/blob/main/LICENSE` },
            { label: 'GitHub',  href: GITHUB_URL },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12, color: '#5f6368', textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#202124' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#5f6368' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
