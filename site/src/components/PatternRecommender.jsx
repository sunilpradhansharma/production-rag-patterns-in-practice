import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronRight } from 'lucide-react'

const QUESTIONS = [
  {
    id: 'experience',
    text: 'What is your experience level with RAG?',
    options: [
      { value: 'new', label: 'New to RAG', emoji: '🌱' },
      { value: 'some', label: 'Built a basic system', emoji: '⚡' },
      { value: 'experienced', label: 'Running in production', emoji: '🚀' },
    ],
  },
  {
    id: 'problem',
    text: 'What is your primary challenge?',
    options: [
      { value: 'precision', label: 'Improve retrieval precision', emoji: '🎯' },
      { value: 'coverage', label: 'Better answer coverage', emoji: '📚' },
      { value: 'complex', label: 'Handle complex queries', emoji: '🧠' },
      { value: 'cost', label: 'Reduce latency / cost', emoji: '⚡' },
    ],
  },
  {
    id: 'domain',
    text: 'What is your primary use case?',
    options: [
      { value: 'compliance', label: 'Regulatory / Compliance', emoji: '🏛️' },
      { value: 'docs', label: 'Document Q&A', emoji: '📄' },
      { value: 'risk', label: 'Risk / Due Diligence', emoji: '🔍' },
      { value: 'general', label: 'General enterprise search', emoji: '🔎' },
    ],
  },
]

const RECOMMENDATIONS = {
  'new-precision-compliance': ['Naive RAG', 'Contextual RAG', 'Hybrid RAG'],
  'new-coverage-docs': ['Naive RAG', 'Advanced RAG', 'Parent Document'],
  'new-complex-compliance': ['Naive RAG', 'Advanced RAG', 'Self-RAG'],
  'some-precision-compliance': ['Contextual RAG', 'Hybrid RAG', 'Corrective RAG'],
  'some-coverage-docs': ['Parent Document', 'Multi-Query RAG', 'HyDE'],
  'some-complex-risk': ['Multi-Hop RAG', 'Agentic RAG', 'Graph RAG'],
  'experienced-cost-general': ['Adaptive RAG', 'Speculative RAG', 'Modular RAG'],
  default: ['Naive RAG', 'Advanced RAG', 'Hybrid RAG'],
}

function getRecommendations(answers) {
  const key = `${answers.experience}-${answers.problem}-${answers.domain}`
  return (
    RECOMMENDATIONS[key] ||
    RECOMMENDATIONS[`${answers.experience}-${answers.problem}-compliance`] ||
    RECOMMENDATIONS[`${answers.experience}-coverage-docs`] ||
    RECOMMENDATIONS.default
  )
}

export default function PatternRecommender() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)

  const handleAnswer = (questionId, value) => {
    const next = { ...answers, [questionId]: value }
    setAnswers(next)
    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(s => s + 1), 180)
    } else {
      setTimeout(() => setDone(true), 180)
    }
  }

  const reset = () => {
    setStep(0)
    setAnswers({})
    setDone(false)
  }

  const recs = done ? getRecommendations(answers) : []

  return (
    <section
      id="recommender"
      style={{ padding: '80px 24px', position: 'relative' }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
          alignItems: 'start',
        }}>
          {/* Left: info panel */}
          <div>
            <div className="section-label" style={{ marginBottom: 12 }}>Pattern Recommender</div>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#f1f5f9',
              marginBottom: 14,
              lineHeight: 1.2,
            }}>
              Find your starting pattern
            </h2>
            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.65, marginBottom: 24 }}>
              Answer 3 quick questions to get a personalized recommendation for which RAG patterns to explore first.
            </p>

            {/* Tier quick reference */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { tier: 'Tier 1', label: 'Workshop essentials', count: 12, color: '#38bdf8' },
                { tier: 'Tier 2', label: 'Extended reference', count: 8, color: '#a78bfa' },
                { tier: 'Tier 3', label: 'Specialized advanced', count: 6, color: '#fb923c' },
              ].map(t => (
                <div
                  key={t.tier}
                  className="glass-card"
                  style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: `${t.color}18`,
                    border: `1px solid ${t.color}33`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: t.color,
                    fontFamily: 'JetBrains Mono, monospace',
                  }}>
                    {t.count}
                  </div>
                  <div>
                    <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 13 }}>{t.tier}</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>{t.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: quiz panel */}
          <div className="glass-card" style={{ padding: 28, minHeight: 260 }}>
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Progress dots */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                    {QUESTIONS.map((_, i) => (
                      <div
                        key={i}
                        style={{
                          height: 3,
                          flex: 1,
                          borderRadius: 2,
                          background: i <= step
                            ? 'linear-gradient(90deg, #0ea5e9, #38bdf8)'
                            : 'rgba(255,255,255,0.08)',
                          transition: 'background 0.3s ease',
                        }}
                      />
                    ))}
                  </div>

                  <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                    Question {step + 1} of {QUESTIONS.length}
                  </div>
                  <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 15, marginBottom: 18, lineHeight: 1.4 }}>
                    {QUESTIONS[step].text}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {QUESTIONS[step].options.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(QUESTIONS[step].id, opt.value)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 14px',
                          borderRadius: 8,
                          border: '1px solid rgba(255,255,255,0.08)',
                          background: 'rgba(255,255,255,0.03)',
                          color: '#cbd5e1',
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                          width: '100%',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(56,189,248,0.08)'
                          e.currentTarget.style.borderColor = 'rgba(56,189,248,0.25)'
                          e.currentTarget.style.color = '#f1f5f9'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                          e.currentTarget.style.color = '#cbd5e1'
                        }}
                      >
                        <span style={{ fontSize: 16 }}>{opt.emoji}</span>
                        {opt.label}
                        <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ marginBottom: 16 }}>
                    <div className="section-label" style={{ marginBottom: 8 }}>Recommended Starting Points</div>
                    <p style={{ color: '#64748b', fontSize: 13 }}>Based on your answers, start here:</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                    {recs.map((name, i) => (
                      <motion.a
                        key={name}
                        href="#patterns"
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '12px 14px',
                          borderRadius: 8,
                          border: '1px solid rgba(56,189,248,0.2)',
                          background: 'rgba(56,189,248,0.06)',
                          textDecoration: 'none',
                          color: '#f1f5f9',
                          fontSize: 13,
                          fontWeight: 600,
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(56,189,248,0.12)'
                          e.currentTarget.style.borderColor = 'rgba(56,189,248,0.35)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(56,189,248,0.06)'
                          e.currentTarget.style.borderColor = 'rgba(56,189,248,0.2)'
                        }}
                      >
                        <div style={{
                          width: 22,
                          height: 22,
                          borderRadius: 4,
                          background: 'rgba(56,189,248,0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#38bdf8',
                        }}>
                          {i + 1}
                        </div>
                        {name}
                        <ArrowRight size={13} style={{ marginLeft: 'auto', color: '#38bdf8' }} />
                      </motion.a>
                    ))}
                  </div>

                  <button
                    onClick={reset}
                    style={{
                      fontSize: 12,
                      color: '#475569',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0,
                    }}
                  >
                    Start over
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
