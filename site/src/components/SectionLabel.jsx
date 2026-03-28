/**
 * Section eyebrow label — the small uppercase "—— Label" line above headings.
 * Uses the .section-label CSS class from globals.css.
 */
export default function SectionLabel({ children, centered = false, mb = 14 }) {
  return (
    <div
      className="section-label"
      style={{ marginBottom: mb, ...(centered && { justifyContent: 'center' }) }}
    >
      {children}
    </div>
  )
}
