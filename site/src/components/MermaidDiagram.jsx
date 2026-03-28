import { useEffect, useState, useRef } from 'react'

// Dynamic import — mermaid is only loaded the first time a modal opens,
// keeping the initial page bundle at its original size.
let mermaidPromise = null
function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then(mod => {
      const m = mod.default
      m.initialize({
        startOnLoad: false,
        theme: 'dark',
        darkMode: true,
        securityLevel: 'loose',
        themeVariables: {
          background: 'transparent',
          mainBkg: '#0f172a',
          lineColor: '#475569',
          primaryTextColor: '#94a3b8',
          edgeLabelBackground: 'rgba(8,14,24,0.85)',
          fontSize: '13px',
        },
        flowchart: { curve: 'basis', padding: 16, useMaxWidth: true },
      })
      return m
    })
  }
  return mermaidPromise
}

let uid = 0

export default function MermaidDiagram({ chart }) {
  const [svg, setSvg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    if (!chart) return
    setSvg(null)
    setLoading(true)
    setError(null)

    const id = `mermaid-d-${++uid}`

    getMermaid()
      .then(m => m.render(id, chart))
      .then(({ svg: svgContent }) => {
        if (mountedRef.current) {
          setSvg(svgContent)
          setLoading(false)
        }
      })
      .catch(err => {
        console.error('Mermaid render error:', err)
        if (mountedRef.current) {
          setError(true)
          setLoading(false)
        }
      })
  }, [chart])

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px', gap: 10,
      }}>
        <div className="diagram-spinner" />
        <span style={{ color: '#3d5068', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>
          rendering…
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '32px 24px', textAlign: 'center', color: '#3d5068', fontSize: 13 }}>
        Diagram unavailable
      </div>
    )
  }

  return (
    <div
      className="mermaid-output"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
