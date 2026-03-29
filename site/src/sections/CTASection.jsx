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
    <section style={{ borderTop: '1px solid #F0E8D8' }}>
      {/* 3-column footer grid */}
      <div className="site-footer">
        {FOOTER_COLS.map(col => (
          <div key={col.title}>
            <div className="footer-col-title">{col.title}</div>
            {col.links.map(link => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="footer-link"
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom-wrap">
        <div className="footer-bottom">
          <div className="footer-logo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2C12 2 12 10 4 12C12 14 12 22 12 22C12 22 12 14 20 12C12 10 12 2 12 2Z" fill="#3730A3"/>
            </svg>
            RAG Patterns in Practice
          </div>
          <div className="footer-legal">
            <a href={`${GITHUB_URL}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer">License</a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </div>
    </section>
  )
}
