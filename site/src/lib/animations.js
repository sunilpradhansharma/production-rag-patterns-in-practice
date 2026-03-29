/**
 * Entrance animations — JS only, no CSS @keyframes.
 * Called once from App.jsx on mount.
 */

// ─── Hero word-by-word reveal ────────────────────────────────────────────────

function initHeroReveal() {
  const h1 = document.querySelector('#hero h1')
  if (!h1) return

  // Wrap each word in a span
  h1.querySelectorAll('span').forEach(span => {
    const words = span.textContent.split(/(\s+)/)
    span.innerHTML = words
      .map(w => w.trim()
        ? `<span class="hero-word" style="display:inline-block;opacity:0;transform:translateY(18px)">${w}</span>`
        : w)
      .join('')
  })

  const words = h1.querySelectorAll('.hero-word')
  words.forEach((w, i) => {
    setTimeout(() => {
      w.style.transition = 'opacity 0.55s cubic-bezier(.22,1,.36,1), transform 0.55s cubic-bezier(.22,1,.36,1)'
      w.style.opacity = '1'
      w.style.transform = 'translateY(0)'
    }, i * 80)
  })

  // Subtext at 480ms
  const sub = document.querySelector('#hero p')
  if (sub) {
    setTimeout(() => {
      sub.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
      sub.style.opacity = '1'
      sub.style.transform = 'translateY(0)'
    }, 480)
  }

  // CTA at 660ms
  const cta = document.querySelector('.hero-cta-wrapper')
  if (cta) {
    setTimeout(() => {
      cta.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
      cta.style.opacity = '1'
      cta.style.transform = 'translateY(0)'
    }, 660)
  }
}

// ─── Stat count-up ───────────────────────────────────────────────────────────

function countUp(el, target, suffix, duration) {
  const start = performance.now()
  const easeOut = t => 1 - (1 - t) * (1 - t)

  function frame(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const value = Math.round(easeOut(progress) * target)
    el.textContent = value + suffix
    if (progress < 1) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

function initStatCountUp() {
  const row = document.querySelector('.stats-row')
  if (!row) return

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const statEls = row.querySelectorAll('.stat-number')
        statEls.forEach((el, i) => {
          const target = parseInt(el.dataset.target, 10)
          const suffix = el.dataset.suffix || ''
          const duration = parseInt(el.dataset.duration, 10) || 800

          setTimeout(() => countUp(el, target, suffix, duration), i * 120)
        })
      })
    },
    { threshold: 0.3 }
  )
  observer.observe(row)
}

// ─── Section heading reveal ───────────────────────────────────────────────────

function initSectionReveal() {
  const headers = document.querySelectorAll('[data-section-header]')
  if (!headers.length) return

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)

        const el = entry.target
        const h2 = el.querySelector('h2')
        const p = el.querySelector('p')

        if (h2) {
          // Clip-path wipe in
          h2.style.clipPath = 'inset(0 100% 0 0)'
          h2.style.transition = 'clip-path 0.75s cubic-bezier(.77,0,.18,1)'
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              h2.style.clipPath = 'inset(0 0% 0 0)'
            })
          })

          // Inject indigo underline
          setTimeout(() => {
            let underline = h2.querySelector('.h2-underline')
            if (!underline) {
              underline = document.createElement('span')
              underline.className = 'h2-underline'
              Object.assign(underline.style, {
                display: 'block',
                height: '2px',
                background: 'linear-gradient(90deg, #3730A3, transparent)',
                borderRadius: '1px',
                width: '0px',
                marginTop: '6px',
                transition: 'width 0.5s cubic-bezier(.22,1,.36,1)',
              })
              h2.appendChild(underline)
            }
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                underline.style.width = '80px'
              })
            })
          }, 700)
        }

        if (p) {
          p.style.opacity = '0'
          setTimeout(() => {
            p.style.transition = 'opacity 0.6s ease'
            p.style.opacity = '1'
          }, 950)
        }
      })
    },
    { threshold: 0.15 }
  )

  headers.forEach(el => observer.observe(el))
}

// ─── Entry point ─────────────────────────────────────────────────────────────

export function initAnimations() {
  // Hero fires immediately (elements are already in DOM)
  initHeroReveal()
  initStatCountUp()
  initSectionReveal()
}

// ─── SVG diagram animation engine ────────────────────────────────────────────

export async function runDiagramAnimation(steps) {
  function showNode(el, delay) {
    return new Promise(resolve => {
      setTimeout(() => {
        el.style.opacity = '1'
        const start = performance.now()
        function spring(now) {
          const t = Math.min((now - start) / 400, 1)
          const bounce = 1 - Math.pow(1 - t, 3) * Math.cos(t * Math.PI * 3.5)
          el.style.transform = `scale(${bounce})`
          if (t < 1) requestAnimationFrame(spring)
          else { el.style.transform = 'scale(1)'; resolve() }
        }
        requestAnimationFrame(spring)
      }, delay)
    })
  }

  function drawArrow(el, delay) {
    return new Promise(resolve => {
      setTimeout(() => {
        el.style.opacity = '1'
        const len = el.getTotalLength ? el.getTotalLength() : 100
        el.style.strokeDasharray = len
        el.style.strokeDashoffset = len
        const start = performance.now()
        function draw(now) {
          const t = Math.min((now - start) / 350, 1)
          const ease = 1 - Math.pow(1 - t, 2)
          el.style.strokeDashoffset = len * (1 - ease)
          if (t < 1) requestAnimationFrame(draw)
          else resolve()
        }
        requestAnimationFrame(draw)
      }, delay)
    })
  }

  function sendPacket(pktEl, pathEl, dur) {
    return new Promise(resolve => {
      if (!pathEl || !pktEl) { resolve(); return }
      pktEl.style.opacity = '1'
      const len = pathEl.getTotalLength()
      const start = performance.now()
      function move(now) {
        const t = Math.min((now - start) / dur, 1)
        const pt = pathEl.getPointAtLength(t * len)
        pktEl.setAttribute('cx', pt.x)
        pktEl.setAttribute('cy', pt.y)
        if (t < 1) requestAnimationFrame(move)
        else { pktEl.style.opacity = '0'; resolve() }
      }
      requestAnimationFrame(move)
    })
  }

  function glowNode(el, times) {
    let count = 0
    function pulse() {
      if (count >= times) return
      el.style.transition = 'filter .25s ease'
      el.style.filter = 'drop-shadow(0 0 6px rgba(55,48,163,.7))'
      setTimeout(() => {
        el.style.filter = ''
        count++
        setTimeout(pulse, 350)
      }, 250)
    }
    pulse()
  }

  for (const step of steps) {
    const el = document.getElementById(step.id)
    if (!el) continue

    if (step.type === 'node') {
      await showNode(el, step.delay || 0)
      if (step.glow) glowNode(el, step.glowTimes || 2)
    } else if (step.type === 'arrow') {
      await drawArrow(el, step.delay || 0)
      if (step.packet) {
        const pktEl = document.getElementById(step.id + '-pkt')
        await sendPacket(pktEl, el, step.packetDur || 600)
      }
    }
  }
}
