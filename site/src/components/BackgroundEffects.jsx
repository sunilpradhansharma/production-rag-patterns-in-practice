/**
 * Named ambient-glow orbs for each page section.
 * Keeps decorative absolute-positioned blobs out of section logic.
 * All orbs are aria-hidden and pointer-events: none.
 */

const base = {
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: 0,
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export function HeroOrbs() {
  return (
    <>
      {/* Large centered focal glow */}
      <div style={{
        ...base,
        top: '38%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 900,
        height: 600,
        background:
          'radial-gradient(ellipse at center, rgba(37,99,176,0.04) 0%, rgba(37,99,176,0.015) 40%, transparent 70%)',
      }} aria-hidden="true" />
      {/* Secondary offset glow */}
      <div style={{
        ...base,
        top: '20%',
        left: '30%',
        width: 500,
        height: 400,
        background: 'radial-gradient(ellipse, rgba(37,99,176,0.025) 0%, transparent 65%)',
      }} aria-hidden="true" />
    </>
  )
}

// ─── Pattern Explorer ─────────────────────────────────────────────────────────

export function PatternExplorerOrb() {
  return (
    <div style={{
      ...base,
      left: '50%',
      top: '10%',
      transform: 'translateX(-50%)',
      width: 700,
      height: 300,
      background: 'radial-gradient(ellipse, rgba(37,99,176,0.025) 0%, transparent 65%)',
    }} aria-hidden="true" />
  )
}

// ─── Architecture ─────────────────────────────────────────────────────────────

export function ArchitectureOrb() {
  return (
    <div style={{
      ...base,
      right: '-5%',
      top: '30%',
      width: 500,
      height: 500,
      background: 'radial-gradient(ellipse, rgba(37,99,176,0.03) 0%, transparent 65%)',
    }} aria-hidden="true" />
  )
}

// ─── Use Cases ────────────────────────────────────────────────────────────────

export function UseCasesOrb() {
  return (
    <div style={{
      ...base,
      left: '-10%',
      bottom: '20%',
      width: 400,
      height: 400,
      background: 'radial-gradient(ellipse, rgba(37,99,176,0.025) 0%, transparent 70%)',
    }} aria-hidden="true" />
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

export function CTAOrb() {
  return (
    <div style={{
      ...base,
      top: '30%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      height: 300,
      background: 'radial-gradient(ellipse, rgba(37,99,176,0.04) 0%, transparent 70%)',
    }} aria-hidden="true" />
  )
}
