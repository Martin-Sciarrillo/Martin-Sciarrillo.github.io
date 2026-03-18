// Accordion
document.querySelectorAll('.accordion__trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true'
    const panel = document.getElementById(trigger.getAttribute('aria-controls'))

    // Close all panels
    document.querySelectorAll('.accordion__trigger').forEach(t => {
      t.setAttribute('aria-expanded', 'false')
      const p = document.getElementById(t.getAttribute('aria-controls'))
      if (p) p.hidden = true
    })

    // Open clicked if it was closed
    if (!isOpen) {
      trigger.setAttribute('aria-expanded', 'true')
      panel.hidden = false
    }
  })
})

// Mobile nav toggle
const toggle = document.querySelector('.nav__toggle')
const menu = document.querySelector('.nav__menu')

toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true'
  toggle.setAttribute('aria-expanded', String(!expanded))
  menu.classList.toggle('is-open')
})

// Close mobile nav on link click
menu?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menu.classList.remove('is-open')
    toggle?.setAttribute('aria-expanded', 'false')
  })
})

// Dynamic copyright year
const yearEl = document.getElementById('year')
if (yearEl) yearEl.textContent = new Date().getFullYear()

// Footer Φ → open terminal
const footerTrigger = document.getElementById('footer-terminal-trigger')
if (footerTrigger) {
  footerTrigger.addEventListener('click', e => {
    e.preventDefault()
    const term = document.getElementById('terminal')
    if (term && !term.classList.contains('is-open')) {
      term.classList.add('is-open')
      document.getElementById('term-input')?.focus()
    }
  })
}

// Profile photo glitch video on hover
const heroWrap = document.getElementById('hero-photo-wrap')
const glitchVideo = document.getElementById('hero-glitch-video')
if (heroWrap && glitchVideo) {
  heroWrap.addEventListener('mouseenter', () => { glitchVideo.currentTime = 0; glitchVideo.play() })
  heroWrap.addEventListener('mouseleave', () => { glitchVideo.pause(); glitchVideo.currentTime = 0 })
}

// BACKGROUND GRID — disabled
// GLITCH-IN ON SCROLL — disabled

// ============================================================
// HIDDEN VISUAL EFFECTS (toggle via terminal)
// ============================================================
let _noiseActive = false
function toggleNoise() {
  if (_noiseActive) {
    _noiseActive = false
    document.getElementById('crt-noise')?.remove()
    return ['[CRT NOISE] disabled']
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return ['[CRT NOISE] blocked by prefers-reduced-motion']
  _noiseActive = true
  const canvas = document.createElement('canvas')
  canvas.id = 'crt-noise'
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  const W = 256, H = 256
  canvas.width = W; canvas.height = H
  let tick = 0
  ;(function draw() {
    if (!_noiseActive) return
    requestAnimationFrame(draw)
    if (++tick % 3 !== 0) return
    const img = ctx.createImageData(W, H)
    const d = img.data
    for (let i = 0; i < d.length; i += 4) {
      d[i] = d[i + 1] = d[i + 2] = 255
      d[i + 3] = Math.random() < 0.3 ? Math.floor(Math.random() * 22) : 0
    }
    ctx.putImageData(img, 0, 0)
  })()
  return ['[CRT NOISE] enabled']
}

let _trailActive = false
let _trailMoveHandler = null
function toggleTrail() {
  if (_trailActive) {
    _trailActive = false
    document.getElementById('cursor-trail')?.remove()
    if (_trailMoveHandler) { window.removeEventListener('mousemove', _trailMoveHandler); _trailMoveHandler = null }
    return ['[CURSOR TRAIL] disabled']
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return ['[CURSOR TRAIL] blocked by prefers-reduced-motion']
  if ('ontouchstart' in window) return ['[CURSOR TRAIL] not available on touch devices']
  _trailActive = true
  const canvas = document.createElement('canvas')
  canvas.id = 'cursor-trail'
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
  resize()
  window.addEventListener('resize', resize, { passive: true })
  const COLORS = ['#00e5ff', '#ff00c8', '#00ff9d']
  const particles = []
  _trailMoveHandler = e => {
    for (let i = 0; i < 4; i++) {
      particles.push({
        x: e.clientX, y: e.clientY,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5 - 0.5,
        life: 1,
        decay: 0.035 + Math.random() * 0.04,
        size: 1.5 + Math.random() * 2.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      })
    }
  }
  window.addEventListener('mousemove', _trailMoveHandler, { passive: true })
  ;(function draw() {
    if (!_trailActive) return
    requestAnimationFrame(draw)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx; p.y += p.vy
      p.life -= p.decay
      if (p.life <= 0) { particles.splice(i, 1); continue }
      ctx.globalAlpha = p.life * 0.75
      ctx.fillStyle = p.color
      ctx.shadowColor = p.color
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
  })()
  return ['[CURSOR TRAIL] enabled']
}

// ============================================================
// MEDIA SECTION — video modal
// ============================================================
;(function initMediaModal() {
  const modal    = document.getElementById('video-modal')
  const iframe   = document.getElementById('video-iframe')
  const titleEl  = document.getElementById('video-modal-title')
  const closeBtn = modal?.querySelector('.video-modal__close')
  const backdrop = modal?.querySelector('.video-modal__backdrop')
  if (!modal) return

  function openModal(videoId, title, start, isShort) {
    const startParam = start ? `&start=${start}` : ''
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0${startParam}`
    if (titleEl) titleEl.textContent = title || ''
    modal.classList.toggle('is-short', !!isShort)
    modal.classList.add('is-open')
    modal.setAttribute('aria-hidden', 'false')
    closeBtn?.focus()
  }

  function closeModal() {
    modal.classList.remove('is-open')
    modal.setAttribute('aria-hidden', 'true')
    iframe.src = ''
  }

  let prewarmed = false
  function prewarm(videoId) {
    if (prewarmed) return
    prewarmed = true
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`
  }

  document.querySelectorAll('.media-card').forEach(card => {
    if (card.dataset.href) {
      const open = () => window.open(card.dataset.href, '_blank', 'noopener')
      card.addEventListener('click', open)
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() } })
      return
    }
    const open = () => openModal(card.dataset.vid, card.dataset.title, card.dataset.start, card.dataset.short === 'true')
    card.addEventListener('click', open)
    card.addEventListener('mouseenter', () => prewarm(card.dataset.vid), { once: true })
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() }
    })
  })

  closeBtn?.addEventListener('click', closeModal)
  backdrop?.addEventListener('click', closeModal)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal()
  })
})()

// Active nav link on scroll
const sections = document.querySelectorAll('section[id], footer[id]')
const navLinks = document.querySelectorAll('.nav__menu a')

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`)
      })
    }
  })
}, { rootMargin: '-40% 0px -55% 0px' })

sections.forEach(s => observer.observe(s))

// Lightbox
const lightbox = document.createElement('div')
lightbox.className = 'lightbox'
lightbox.innerHTML = `
  <button class="lightbox__close" aria-label="Close">✕</button>
  <div class="lightbox__backdrop"></div>
  <div class="lightbox__content">
    <img class="lightbox__img" src="" alt="" />
    <p class="lightbox__caption"></p>
  </div>
`
document.body.appendChild(lightbox)

const lbImg     = lightbox.querySelector('.lightbox__img')
const lbCaption = lightbox.querySelector('.lightbox__caption')

function openLightbox(src, alt) {
  lbImg.src = src
  lbImg.alt = alt
  lbCaption.textContent = alt
  lightbox.classList.add('is-open')
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightbox.classList.remove('is-open')
  document.body.style.overflow = ''
  setTimeout(() => { lbImg.src = '' }, 300)
}

document.querySelectorAll('.polaroid-d').forEach(item => {
  item.style.cursor = 'pointer'
  item.addEventListener('click', () => {
    const img = item.querySelector('img')
    const caption = item.querySelector('figcaption')
    openLightbox(img.src, caption?.textContent || img.alt)
  })
})

lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox)
lightbox.querySelector('.lightbox__backdrop').addEventListener('click', closeLightbox)
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox() })

// ============================================================
// READING PROGRESS BAR
// ============================================================
const progressBar = document.getElementById('read-progress')
if (progressBar) {
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
    progressBar.style.width = `${Math.min(pct * 100, 100)}%`
  }, { passive: true })
}

// ============================================================
// BOOT SEQUENCE + TYPEWRITER TAGLINE
// ============================================================
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function initTagline() {
  const tagline = document.querySelector('.hero__tagline')
  if (!tagline || reducedMotion) return
  const text = tagline.textContent.trim()
  tagline.textContent = ''
  tagline.classList.add('typing')
  let i = 0
  const tick = () => {
    tagline.textContent = text.slice(0, i++)
    if (i <= text.length) setTimeout(tick, 38)
    else { tagline.classList.remove('typing'); tagline.classList.add('typed') }
  }
  setTimeout(tick, 300)
}

function playBootSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const notes = [
      { freq: 523.25, start: 0,    dur: 0.12 },
      { freq: 659.25, start: 0.13, dur: 0.12 },
      { freq: 783.99, start: 0.26, dur: 0.12 },
      { freq: 1046.5, start: 0.39, dur: 0.45 },
    ]
    notes.forEach(({ freq, start, dur }) => {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'; osc.frequency.value = freq
      gain.gain.setValueAtTime(0, ctx.currentTime + start)
      gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + dur + 0.05)
    })
  } catch (e) {}
}

// ============================================================
// ASCII GLITCH — randomises chars through ░▒▓█ then restores
// ============================================================
function glitchAsciiText(el) {
  if (reducedMotion) return
  const CHARS = '░▒▓█▄▀'
  const orig   = el.textContent

  function glitch() {
    if (!el.isConnected) return          // stop if element removed from DOM
    const arr = orig.split('')
    const n   = Math.floor(Math.random() * 5) + 1
    for (let i = 0; i < n; i++) {
      const pos = Math.floor(Math.random() * arr.length)
      if (arr[pos] !== ' ') arr[pos] = CHARS[Math.floor(Math.random() * CHARS.length)]
    }
    el.textContent = arr.join('')
    setTimeout(() => {
      if (!el.isConnected) return
      el.textContent = orig
      setTimeout(glitch, 80 + Math.random() * 350)
    }, 55 + Math.random() * 110)
  }

  setTimeout(glitch, 80 + Math.random() * 200)  // short initial delay
}

function runBoot() {
  const screen   = document.getElementById('boot-screen')
  const linesEl  = document.getElementById('boot-lines')
  const avatarEl = document.getElementById('boot-avatar')

  if (!screen || reducedMotion || sessionStorage.getItem('booted')) {
    screen?.remove()
    document.documentElement.classList.remove('is-booting')
    initTagline()
    return
  }

  // ── Background digital rain ───────────────────────────────
  ;(function startBootRain() {
    const canvas = document.createElement('canvas')
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0.18;'
    screen.insertBefore(canvas, screen.firstChild)
    linesEl.style.position = 'relative'
    linesEl.style.zIndex   = '1'

    canvas.width  = screen.offsetWidth  || window.innerWidth
    canvas.height = screen.offsetHeight || window.innerHeight
    const W = canvas.width, H = canvas.height
    const ctx = canvas.getContext('2d')
    const FS = 14
    const COLS = Math.floor(W / FS)
    const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF>_#@!'
    const drops = Array.from({ length: COLS }, () => Math.random() * -(H / FS))
    let raf
    function draw() {
      if (!screen.isConnected) { cancelAnimationFrame(raf); return }
      ctx.fillStyle = 'rgba(4,4,10,0.15)'
      ctx.fillRect(0, 0, W, H)
      ctx.font = `bold ${FS}px monospace`
      for (let i = 0; i < COLS; i++) {
        const y = drops[i] * FS
        if (y > 0 && y < H) {
          ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 10
          ctx.fillStyle = '#ffffff'
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * FS, y)
          ctx.shadowBlur = 0
        }
        if (y - FS > 0 && y - FS < H) {
          ctx.fillStyle = `rgba(0,229,255,${0.4 + Math.random() * 0.5})`
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * FS, y - FS)
        }
        drops[i]++
        if (drops[i] * FS > H && Math.random() > 0.975) drops[i] = Math.random() * -20
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
  })()

  // ── Content ──────────────────────────────────────────────
  const LOGO = [
    '████████████████████████████████████████████████████████',
    '                                                        ',
    '   M A R T I N   S C I A R R I L L O                  ',
    '                                                        ',
    '████████████████████████████████████████████████████████',
  ]

  const HEADER_ROWS = LOGO.map((line, i) => {
    const isLast = i === LOGO.length - 1
    const cls = 'boot-line--ascii boot-line--ascii-block' + (isLast ? ' boot-line--ascii-end' : '')
    return [line, cls]
  })

  const MODULES = [
    ['CLOUD',      '#4ecdc4'],
    ['AI',         '#4ecdc4'],
    ['STRATEGY',   '#4ecdc4'],
    ['MANAGEMENT', '#4ecdc4'],
    ['FOODIE',     '#4ecdc4'],
  ]

  const FOOTER = [
    '  ✓  ALL SYSTEMS NOMINAL',
    '  ✓  Press Ctrl+M to access terminal',
    '  ▶  LAUNCHING INTERFACE...',
  ]


  // ── Helpers ──────────────────────────────────────────────
  function addLine(text, cls) {
    const div = document.createElement('div')
    div.className = 'boot-line' + (cls ? ' ' + cls : '')
    div.textContent = text
    linesEl.appendChild(div)
    return div
  }

  function typeLine(text, cls, cb) {
    const div = document.createElement('div')
    div.className = 'boot-line' + (cls ? ' ' + cls : '')
    linesEl.appendChild(div)
    let ci = 0
    const tick = () => {
      div.textContent = text.slice(0, ci++)
      if (ci <= text.length) setTimeout(tick, 14)
      else cb?.()
    }
    tick()
  }

  function animateBar(label, color, onDone) {
    const div = document.createElement('div')
    div.className = 'boot-line boot-line--bar'
    linesEl.appendChild(div)
    const BLOCKS = 16
    let filled = 0
    const tick = () => {
      const filledStr = filled > 0
        ? `<span style="color:${color};text-shadow:0 0 7px ${color}99">${'█'.repeat(filled)}</span>`
        : ''
      const emptyStr = (BLOCKS - filled) > 0
        ? `<span style="color:${color}26">${'░'.repeat(BLOCKS - filled)}</span>`
        : ''
      const pct = String(Math.round((filled / BLOCKS) * 100)).padStart(3)
      div.innerHTML = `  <span style="color:${color}99">▸</span> <span style="color:#fff;display:inline-block;width:11ch">${label}</span><span style="color:#fff">[</span>${filledStr}${emptyStr}<span style="color:#fff">]</span>${pct}%`
      if (filled < BLOCKS) { filled++; setTimeout(tick, 28 + Math.random() * 38) }
      else onDone?.()
    }
    tick()
  }

  // ── Phases ───────────────────────────────────────────────
  function showBox(done) {
    let i = 0
    const next = () => {
      if (i >= HEADER_ROWS.length) {
        setTimeout(done, 80)
        return
      }
      const [text, cls] = HEADER_ROWS[i++]
      addLine(text, cls)
      setTimeout(next, 38)
    }
    next()
  }

  function showBars(done) {
    addLine('')
    addLine('  ── COMPETENCY STACK ─────────────────', 'boot-line--sys')
    addLine('')
    addLine('')
    addLine('')
    addLine('')
    addLine('')
    addLine('')
    let completed = 0
    MODULES.forEach(([mod, color], idx) => {
      setTimeout(() => animateBar(mod, color, () => {
        if (++completed === MODULES.length) setTimeout(done, 180)
      }), idx * 90)
    })
  }

  function showFooter(done) {
    const spacer = document.createElement('div')
    spacer.style.height = '3rem'
    linesEl.appendChild(spacer)
    let i = 0
    const next = () => {
      if (i >= FOOTER.length) { done(); return }
      if (i === 1) {
        const spacerMid = document.createElement('div')
        spacerMid.style.height = '0.6rem'
        linesEl.appendChild(spacerMid)
      }
      if (i === FOOTER.length - 1) {
        const spacer2 = document.createElement('div')
        spacer2.style.height = '3.5rem'
        linesEl.appendChild(spacer2)
      }
      typeLine(FOOTER[i], i === FOOTER.length - 1 ? 'boot-line--launch' : 'boot-line--ok', () => setTimeout(next, 55))
      i++
    }
    setTimeout(next, 100)
  }

  function finish() {
    playBootSound()
    setTimeout(() => {
      screen.classList.add('boot--out')
      setTimeout(() => {
        screen.remove()
        document.documentElement.classList.remove('is-booting')
        sessionStorage.setItem('booted', '1')
        initTagline()
      }, 500)
    }, 400)
  }

  showBox(() => showBars(() => showFooter(finish)))
}

runBoot()

// ============================================================
// TERMINAL EASTER EGG  (Ctrl+`)
// ============================================================
const term = document.createElement('div')
term.id = 'terminal'
term.innerHTML = `
  <div class="term-header">
    <span class="term-title">// Acatincho OS v2.6.0~</span>
    <button class="term-close" aria-label="Close terminal">✕</button>
  </div>
  <div class="term-output" id="term-output"></div>
  <div class="term-input-row">
    <span class="term-prompt">root@tincho:~$&nbsp;</span>
    <input class="term-input" id="term-input" type="text" autocomplete="off" spellcheck="false" />
  </div>
`
document.body.appendChild(term)
glitchAsciiText(term.querySelector('.term-title'))

const termOut   = document.getElementById('term-output')
const termInput = document.getElementById('term-input')

// ── Terminal interference canvas (effect 11) ─────────────────
;(function initTermInterference() {
  if (reducedMotion) return
  const canvas = document.createElement('canvas')
  canvas.id = 'term-interference'
  termOut.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  function resize() {
    canvas.width  = termOut.clientWidth  || 480
    canvas.height = termOut.clientHeight || 268
  }
  resize()
  window.addEventListener('resize', resize)

  let frame = 0
  ;(function draw() {
    requestAnimationFrame(draw)
    if (!term.classList.contains('is-open')) return   // only animate when open
    if (++frame % 2 !== 0) return                     // ~30fps

    const W = canvas.width, H = canvas.height

    ctx.fillStyle = 'rgba(6,6,6,0.42)'
    ctx.fillRect(0, 0, W, H)

    // random horizontal interference lines
    if (Math.random() > 0.55) {
      const n = Math.floor(Math.random() * 3) + 1
      for (let i = 0; i < n; i++) {
        const y  = Math.floor(Math.random() * H)
        const h  = 1 + Math.floor(Math.random() * 3)
        const a  = 0.2 + Math.random() * 0.45
        ctx.fillStyle = Math.random() > 0.5
          ? `rgba(0,229,255,${a})`
          : `rgba(255,0,222,${a})`
        ctx.fillRect(0, y, W, h)

        // horizontal slice-shift glitch
        if (Math.random() > 0.45) {
          const sx = Math.floor(Math.random() * W * 0.25)
          const sw = Math.floor(Math.random() * W * 0.55) + 30
          const dx = (Math.random() - 0.5) * 22
          try {
            const d = ctx.getImageData(sx, y, sw, h)
            ctx.putImageData(d, sx + dx, y)
          } catch (e) {}
        }
      }
    }
  })()
})()


const termCmds = {
  help:    () => ['available commands:', '  whoami   · who is this?', '  ls       · list sections', '  skills   · tech stack', '  contact  · book a coffee', '  noise    · toggle CRT noise overlay', '  trail    · toggle neon cursor trail', '  clear    · clear screen', '  exit     · close terminal'],
  whoami:  () => ['Martín Sciarrillo', 'Executive Technology Strategist · Microsoft Argentina', 'AI · Data · Cloud'],
  ls:      () => ['drwxr-xr-x  about/', 'drwxr-xr-x  speaking/', 'drwxr-xr-x  news/', 'drwxr-xr-x  contact/'],
  skills:  () => ['AI/ML · Azure · AWS · GCP', 'Data Strategy · Cloud Architecture', 'Executive Advisory · Product Leadership', 'Linux · Unix · Hybrid Cloud'],
  contact: () => { setTimeout(() => window.open('https://aka.ms/MeetingWithMartin', '_blank'), 400); return ['opening → https://aka.ms/MeetingWithMartin'] },
  clear:   () => { termOut.innerHTML = ''; return [] },
  exit:    () => { setTimeout(() => term.classList.remove('is-open'), 150); return ['closing terminal...'] },
  // hidden
  noise:   () => toggleNoise(),
  trail:   () => toggleTrail(),
}

function termWrite(lines, cls = 'term-res') {
  lines.forEach(t => {
    const el = document.createElement('div')
    el.className = cls
    el.textContent = t
    termOut.appendChild(el)
  })
  termOut.scrollTop = termOut.scrollHeight
}

termInput.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return
  const cmd = termInput.value.trim().toLowerCase()
  termInput.value = ''
  if (!cmd) return
  termWrite([`root@tincho:~$ ${cmd}`], 'term-cmd')
  const fn = termCmds[cmd]
  if (fn) { const out = fn(); if (out.length) termWrite(out) }
  else termWrite([`command not found: ${cmd}`, 'type "help" for available commands'])
})

term.querySelector('.term-close').addEventListener('click', () => term.classList.remove('is-open'))

// ============================================================
// PARTICLE CANVAS (full page, fixed)
// ============================================================
;(function initHeroParticles() {
  const canvas = document.getElementById('hero-particles')
  if (!canvas || reducedMotion) return
  const ctx = canvas.getContext('2d')
  const N = 80, CONNECT = 130, REPEL = 110
  let mouse = { x: -9999, y: -9999 }

  function resize() {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
  }
  window.addEventListener('resize', resize, { passive: true })
  resize()

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  }, { passive: true })

  // Spawn randomly across full viewport
  const particles = Array.from({ length: N }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
  }))

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const d  = Math.hypot(dx, dy)
        if (d < CONNECT) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(0,229,255,${(1 - d / CONNECT) * 0.22})`
          ctx.lineWidth = 0.7
          ctx.stroke()
        }
      }
    }

    for (const p of particles) {
      const mdx = p.x - mouse.x
      const mdy = p.y - mouse.y
      const md  = Math.hypot(mdx, mdy)
      if (md < REPEL && md > 0) {
        const f = (REPEL - md) / REPEL * 0.9
        p.vx += (mdx / md) * f
        p.vy += (mdy / md) * f
      }
      p.vx *= 0.98; p.vy *= 0.98
      const spd = Math.hypot(p.vx, p.vy)
      if (spd < 0.08) { p.vx += (Math.random() - 0.5) * 0.06; p.vy += (Math.random() - 0.5) * 0.06 }
      p.x += p.vx; p.y += p.vy
      if (p.x < 0)             { p.x = 0;             p.vx = Math.abs(p.vx) }
      if (p.x > canvas.width)  { p.x = canvas.width;  p.vx = -Math.abs(p.vx) }
      if (p.y < 0)             { p.y = 0;             p.vy = Math.abs(p.vy) }
      if (p.y > canvas.height) { p.y = canvas.height; p.vy = -Math.abs(p.vy) }

      ctx.beginPath()
      ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,229,255,0.55)'
      ctx.fill()
    }

    requestAnimationFrame(frame)
  }
  frame()
})()

// ============================================================
// NAV — interference lines effect
// ============================================================
;(function initNavInterference() {
  const nav = document.querySelector('.site-header')
  if (!nav || reducedMotion) return
  const canvas = document.createElement('canvas')
  canvas.id = 'nav-interference'
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.6;image-rendering:pixelated;'
  nav.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  function resize() {
    canvas.width  = nav.offsetWidth  || 1280
    canvas.height = nav.offsetHeight || 56
  }
  resize()
  window.addEventListener('resize', resize)

  let frame = 0
  ;(function draw() {
    requestAnimationFrame(draw)
    if (++frame % 2 !== 0) return
    const W = canvas.width, H = canvas.height
    ctx.fillStyle = 'rgba(13,13,13,0.45)'
    ctx.fillRect(0, 0, W, H)

    if (Math.random() > 0.62) {
      const n = Math.floor(Math.random() * 2) + 1
      for (let i = 0; i < n; i++) {
        const y = Math.floor(Math.random() * H)
        const h = 1 + Math.floor(Math.random() * 2)
        const a = 0.18 + Math.random() * 0.38
        ctx.fillStyle = Math.random() > 0.5
          ? `rgba(0,229,255,${a})`
          : `rgba(255,0,222,${a})`
        ctx.fillRect(0, y, W, h)
        if (Math.random() > 0.5) {
          const sx = Math.floor(Math.random() * W * 0.2)
          const sw = Math.floor(Math.random() * W * 0.4) + 40
          const dx = (Math.random() - 0.5) * 18
          try {
            const d = ctx.getImageData(sx, y, sw, h)
            ctx.putImageData(d, sx + dx, y)
          } catch (e) {}
        }
      }
    }
  })()
})()

// ── Nav grain (same as footer, layered on top of interference) ───────────
;(function initNavNoise() {
  const nav = document.querySelector('.site-header')
  if (!nav || reducedMotion) return
  const canvas = document.createElement('canvas')
  canvas.id = 'nav-noise'
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.35;mix-blend-mode:screen;image-rendering:pixelated;'
  nav.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  const W = 256, H = 64
  canvas.width = W; canvas.height = H
  let tick = 0
  ;(function draw() {
    requestAnimationFrame(draw)
    if (++tick % 4 !== 0) return
    const img = ctx.createImageData(W, H)
    const d = img.data
    for (let i = 0; i < d.length; i += 4) {
      d[i] = d[i + 1] = d[i + 2] = 255
      d[i + 3] = Math.random() < 0.18 ? Math.floor(Math.random() * 28) : 0
    }
    ctx.putImageData(img, 0, 0)
  })()
})()

// ============================================================
// ABOUT SECTION — permanent CRT pixel noise (same as terminal `noise`)
// ============================================================
;(function initAboutNoise() {
  const section = document.getElementById('about-screen-wrap')
  if (!section || reducedMotion) return
  const canvas = document.createElement('canvas')
  canvas.id = 'about-noise'
  section.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  const W = 256, H = 256
  canvas.width = W; canvas.height = H
  let tick = 0
  ;(function draw() {
    requestAnimationFrame(draw)
    if (++tick % 3 !== 0) return
    const img = ctx.createImageData(W, H)
    const d = img.data
    for (let i = 0; i < d.length; i += 4) {
      d[i] = d[i + 1] = d[i + 2] = 255
      d[i + 3] = Math.random() < 0.3 ? Math.floor(Math.random() * 22) : 0
    }
    ctx.putImageData(img, 0, 0)
  })()
})()

// FOOTER — subtle CRT grain
// ============================================================
;(function initFooterNoise() {
  const footer = document.querySelector('.footer')
  if (!footer || reducedMotion) return
  const canvas = document.createElement('canvas')
  canvas.id = 'footer-noise'
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.35;mix-blend-mode:screen;image-rendering:pixelated;'
  footer.insertBefore(canvas, footer.firstChild)
  const ctx = canvas.getContext('2d')
  const W = 256, H = 256
  canvas.width = W; canvas.height = H
  let tick = 0
  ;(function draw() {
    requestAnimationFrame(draw)
    if (++tick % 4 !== 0) return          // slower = more subtle
    const img = ctx.createImageData(W, H)
    const d = img.data
    for (let i = 0; i < d.length; i += 4) {
      d[i] = d[i + 1] = d[i + 2] = 255
      d[i + 3] = Math.random() < 0.18 ? Math.floor(Math.random() * 28) : 0
    }
    ctx.putImageData(img, 0, 0)
  })()
})()

// SPEAKING SECTION — starfield warp background
// ============================================================
;(function initSpeakingStars() {
  if (reducedMotion) return
  const canvas = document.createElement('canvas')
  canvas.id = 'speaking-stars'
  document.body.appendChild(canvas)

  function resize() {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const ctx = canvas.getContext('2d')
  const NUM = 200

  function makeStars(W, H) {
    return Array.from({ length: NUM }, () => ({
      x: (Math.random() - 0.5) * W,
      y: (Math.random() - 0.5) * H,
      z: Math.random() * W,
      pz: W
    }))
  }

  let stars = makeStars(canvas.width, canvas.height)
  window.addEventListener('resize', () => { stars = makeStars(canvas.width, canvas.height) })

  let tick = 0
  ;(function draw() {
    requestAnimationFrame(draw)
    if (++tick % 2 !== 0) return
    const W = canvas.width, H = canvas.height
    const CX = W / 2, CY = H / 2
    ctx.fillStyle = 'rgba(13,13,13,0.22)'
    ctx.fillRect(0, 0, W, H)
    stars.forEach(s => {
      s.pz = s.z
      s.z -= 2.8
      if (s.z <= 0) {
        s.x = (Math.random() - 0.5) * W
        s.y = (Math.random() - 0.5) * H
        s.z = W; s.pz = W
      }
      const sx = s.x / s.z * W + CX
      const sy = s.y / s.z * H + CY
      const px = s.x / s.pz * W + CX
      const py = s.y / s.pz * H + CY
      const brightness = 1 - s.z / W
      ctx.beginPath()
      ctx.strokeStyle = `rgba(0,229,255,${0.35 + brightness * 0.65})`
      ctx.lineWidth = Math.max(0.3, brightness * 2)
      ctx.moveTo(px, py)
      ctx.lineTo(sx, sy)
      ctx.stroke()
    })
  })()
})()

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && term.classList.contains('is-open')) { term.classList.remove('is-open'); return }
  if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
    e.preventDefault()
    term.classList.toggle('is-open')
    if (term.classList.contains('is-open')) {
      termInput.focus()
      if (!termOut.children.length) termWrite(['Acatincho OS v2.6.0~', 'type "help" for available commands', '─'.repeat(40)])
    }
  }
})

function initLang() {
  const enCache = {}

  document.querySelectorAll('[data-i18n]').forEach(el => {
    enCache[el.dataset.i18n] = el.textContent
  })
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    enCache[el.dataset.i18nHtml] = el.innerHTML
  })

  const es = {
    nav_about: 'Sobre mí',
    nav_speaking: 'Charlas',
    nav_news: 'En los medios',
    nav_media: 'En cámara',
    nav_contact: 'Contacto',
    about_heading: 'Sobre mí',
    speaking_heading: 'Charlas & Eventos',
    speaking_subtitle: 'Apariciones seleccionadas en conferencias, cumbres y eventos mediáticos.',
    news_heading: 'En los medios',
    news_subtitle: 'Cobertura de prensa y apariciones en medios a lo largo de los años.',
    media_heading: 'En cámara',
    media_sub: 'Entrevistas · Podcasts · Charlas',
    podcast_heading: 'Podcast',
    podcast_sub: 'Episodios donde fui invitado o speaker.',
    contact_heading: 'Conectemos',
    contact_subtitle: 'Encontrame en la web o agendá una reunión directamente.',
    coffee_title: 'Café virtual con Martín',
    coffee_sub: 'Agendá un 1:1 — hablemos de IA, datos, cloud o lo que sea.',
    social_title: 'Encontrame en',
    about_bio: `<p>Construyo cosas con tecnología desde que tengo memoria.</p>
<p>Mi primer encuentro con una computadora fue en mi escuela pública a principios de los 90, frente a una <strong>Commodore 64</strong>. Ahí descubrí <strong>LOGO</strong> — y ahí nació mi primer "amor" digital: una tortuga que se movía por la pantalla dibujando formas, un comando a la vez.</p>
<p>Un año después tuve mi primera PC en casa — tenía 10 años. El lugar donde mi papá la compró también me enseñó <strong>MS BASIC</strong>. En ese momento no lo sabía, pero eso era <strong>programación</strong> — en una época en que las computadoras casi no tenían abstracción y había que escribir código para hacer cualquier cosa.</p>
<p>Cuando empecé el secundario, descubrí el <strong>internet</strong> — y de repente el mundo no tenía fronteras. Email, IRC, gente conectándose desde todos lados… parecía <strong>magia</strong>. Pasé gran parte de mi adolescencia experimentando y construyendo con <strong>HTML</strong>, <strong>CSS</strong>, y <strong>JavaScript</strong>, y eventualmente convertí esa curiosidad en ingresos en los primeros años de la web.</p>
<p>Después empezó el capítulo corporativo. Me fui sumando a empresas cada vez más grandes y, desde el primer día, me incliné por el <strong>global delivery</strong> — mucho antes de que se volviera lo habitual.</p>
<p>Vi evolucionar el stack: desde redes <strong>Novell</strong> hasta <strong>Windows</strong>, <strong>Unix</strong> y <strong>Linux</strong> en <strong>datacenters on-premise</strong> tradicionales, hasta mover cargas de trabajo a la nube. De deployments clásicos a infraestructura como código.</p>
<p>Y ahora estamos entrando en la <strong>era de la IA</strong> — donde la infraestructura no solo ejecuta sistemas, sino que <strong>potencia inteligencia</strong>.</p>
<p>Operé en la intersección entre construir soluciones y operarlas — mientras construía equipos que hacen ambas cosas, en distintos países, regiones y zonas horarias.</p>
<p>Tuve el privilegio de trabajar dentro de algunas de las <strong>empresas tecnológicas más grandes del mundo</strong>, colaborando con organizaciones globales en distintas industrias y mercados. Esa exposición moldeó mi visión de la tecnología: no como teoría, sino como algo que se comporta diferente según el contexto, la <strong>cultura</strong>, los incentivos y la ejecución.</p>
<p>Actualmente soy <strong>Executive Technology Strategist</strong> en <span class="hl-grad">Microsoft</span>, trabajando con líderes senior de negocio para traducir datos, IA, nube y seguridad en resultados medibles. Anteriormente, lideré la organización de <strong>Customer Success Data &amp; AI</strong> en <strong>Spanish South America (SSA)</strong> — Argentina, Chile, Bolivia, Colombia, Ecuador, Paraguay, Perú y Uruguay — y fui <strong>CTO</strong> y miembro del <strong>Leadership Team</strong> de la subsidiaria en <span class="hl-grad">Argentina</span>, siempre enfocado en alinear la estrategia tecnológica con el impacto en el negocio.</p>
<p>Antes de Microsoft, fui <strong>Global Leader of Multicloud Platforms</strong> en <span class="hl-grad">EY</span>, construyendo productos y servicios en entornos híbridos y cloud en EE.UU., Europa y Asia. Antes de eso, lideré el <strong>Global Unix &amp; Linux team</strong> de la firma.</p>
<p>Y antes de eso, armé y escalé equipos tecnológicos en <span class="hl-grad">IBM</span> durante la expansión del Global Delivery Center, dando soporte a clientes en EE.UU. — siempre desde <span class="hl-grad">Argentina</span> al mundo.</p>
<p>Soy Licenciado en Análisis de Sistemas por <strong>ORT Argentina</strong>, complementado con programas ejecutivos en la <strong>Universidad Torcuato Di Tella</strong> &amp; <strong>Universidad de San Andrés</strong>, donde también fui asesor de tesis del Máster en Negocios Digitales. Además, actualmente soy <strong>board member</strong>, <strong>asesor técnico</strong> y <strong>fractional CTO</strong> de varias startups.</p>
<p>Soy un <strong>defensor de la IA</strong> — no desde el hype, sino con convicción. Creo que la IA es una fuerza transformadora que va a redefinir fundamentalmente la manera en que trabajamos, decidimos y construimos. Por eso hablo frecuentemente sobre su impacto en los negocios y en la sociedad, participando en eventos y medios tanto en Argentina como a nivel internacional — incluyendo Forbes, La Nación, Clarín, Ámbito Financiero, Apertura, Information Technology, IDEA Management, Nerdearla, Campus Party, entre otros.</p>
<p>Fuera de la oficina, tengo la suerte de estar casado con <strong>Vicky</strong> y de ser el papá de <strong>Miranda</strong> 🧡</p>
<p>Somos <strong>foodies</strong> por naturaleza y <strong>viajeros</strong> por elección. Nos encanta recibir gente en casa y hacer asados, y adoramos descubrir lugares y sabores nuevos. Cuando viajamos somos tercos en una sola cosa: seguir siendo viajeros, nunca turistas. Así es como nos mantenemos curiosos. No solo visitamos lugares — los probamos. La <strong>cultura</strong> puede ser sutil, multicapa, difícil de descifrar. Pero ponés gente alrededor de una mesa y se vuelve real rápido — platos compartidos, mercados locales, conversaciones de verdad, acá o del otro lado del mundo.</p>
<p>Como dijo <strong>Anthony Bourdain</strong>, la comida es una de las formas más honestas de entender a las personas.</p>
<p>Esa misma mentalidad se mete en el resto de mi vida. Soy <strong>corredor</strong> habitual — sin maratón completo todavía, pero llegando de a sprints. Juego al <strong>fútbol</strong> a un nivel muy amateur (mucho entusiasmo, poco talento). Soy un nerd del <strong>café</strong>. Y soy un devoto irredento de un <strong>Negroni</strong> bien preparado — sin atajos, nunca.</p>
<p>Porque ya sea en tecnología, viajes, deporte, café o cócteles, me atraen las cosas que recompensan la paciencia, el oficio y la consistencia.</p>`,
  }

  function applyLang(lang) {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
    document.querySelectorAll('.lang-toggle__btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang)
    })
    const dict = lang === 'es' ? es : enCache
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = dict[el.dataset.i18n]
      if (v != null) el.textContent = v
    })
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const v = dict[el.dataset.i18nHtml]
      if (v != null) el.innerHTML = v
    })
  }

  document.querySelectorAll('.lang-toggle__btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang))
  })

  const saved = localStorage.getItem('lang')
  if (saved === 'es') applyLang('es')
}

initLang()
