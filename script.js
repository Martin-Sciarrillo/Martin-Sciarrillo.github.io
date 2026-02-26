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

  function openModal(videoId, title) {
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    if (titleEl) titleEl.textContent = title || ''
    modal.classList.add('is-open')
    modal.setAttribute('aria-hidden', 'false')
    closeBtn?.focus()
  }

  function closeModal() {
    modal.classList.remove('is-open')
    modal.setAttribute('aria-hidden', 'true')
    iframe.src = ''
  }

  document.querySelectorAll('.media-card').forEach(card => {
    const open = () => openModal(card.dataset.vid, card.dataset.title)
    card.addEventListener('click', open)
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

document.querySelectorAll('.photo-grid__item').forEach(item => {
  item.style.cursor = 'pointer'
  item.addEventListener('click', () => {
    const img = item.querySelector('.photo-grid__img')
    const caption = item.querySelector('.photo-grid__caption')
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

function runBoot() {
  const screen  = document.getElementById('boot-screen')
  const linesEl = document.getElementById('boot-lines')

  if (!screen || reducedMotion || sessionStorage.getItem('booted')) {
    screen?.remove()
    document.documentElement.classList.remove('is-booting')
    initTagline()
    return
  }

  const ASCII = [
    '▄▀█ █▀▀ ▄▀█ ▀█▀ █ █▄░█ █▀▀ █░█ █▀█',
    '█▀█ █▄▄ █▀█ ░█░ █ █░▀█ █▄▄ █▀█ █▄█',
  ]

  const HEADER = [
    '> SYSTEM INIT v2.6.0',
    '> LOADING PROFILE: Martín Sciarrillo',
    '> EXPERIENCE: 20+ YEARS · LATAM + GLOBAL',
  ]

  const MODULES = [
    'AI/ML',
    'CLOUD',
    'STRATEGY',
    'PEOPLE MANAGEMENT',
    'NEGRONI TASTING',
  ]

  const FOOTER = [
    '> STATUS: ALL MODULES ONLINE',
    '> TIP: Press Ctrl+` to open terminal',
    '> LAUNCHING INTERFACE...',
  ]

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

  function animateBar(label, onDone) {
    const div = document.createElement('div')
    div.className = 'boot-line boot-line--bar'
    linesEl.appendChild(div)
    const BLOCKS = 16, PAD = 20
    let filled = 0
    const tick = () => {
      const bar = '█'.repeat(filled) + '░'.repeat(BLOCKS - filled)
      const pct = String(Math.round((filled / BLOCKS) * 100)).padStart(3)
      div.textContent = `> ${label.padEnd(PAD)} [${bar}]${pct}%`
      if (filled < BLOCKS) { filled++; setTimeout(tick, 28 + Math.random() * 38) }
      else onDone?.()
    }
    tick()
  }

  function showASCII(done) {
    let i = 0
    const next = () => {
      if (i >= ASCII.length) { setTimeout(done, 180); return }
      addLine(ASCII[i++], 'boot-line--ascii')
      setTimeout(next, 90)
    }
    next()
  }

  function showHeader(done) {
    let i = 0
    const next = () => {
      if (i >= HEADER.length) { setTimeout(done, 80); return }
      typeLine(HEADER[i++], 'boot-line--sys', () => setTimeout(next, 55))
    }
    next()
  }

  function showBars(done) {
    let completed = 0
    MODULES.forEach((mod, idx) => {
      setTimeout(() => animateBar(mod, () => {
        if (++completed === MODULES.length) setTimeout(done, 180)
      }), idx * 90)
    })
  }

  function showFooter(done) {
    let i = 0
    const next = () => {
      if (i >= FOOTER.length) { done(); return }
      typeLine(FOOTER[i], i === FOOTER.length - 1 ? 'boot-line--launch' : '', () => setTimeout(next, 55))
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

  showASCII(() => showHeader(() => showBars(() => showFooter(finish))))
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

const termOut   = document.getElementById('term-output')
const termInput = document.getElementById('term-input')

const termCmds = {
  help:    () => ['available commands:', '  whoami   · who is this?', '  ls       · list sections', '  skills   · tech stack', '  contact  · book a coffee', '  noise    · toggle CRT noise overlay', '  trail    · toggle neon cursor trail', '  clear    · clear screen', '  exit     · close terminal'],
  whoami:  () => ['Martín Sciarrillo', 'Executive Technology Strategist · Microsoft Argentina', 'CTO · AI & Data · Cloud · LATAM + Global', '20+ years making technology serve strategy.'],
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

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && term.classList.contains('is-open')) { term.classList.remove('is-open'); return }
  if ((e.ctrlKey || e.metaKey) && e.key === '`') {
    e.preventDefault()
    term.classList.toggle('is-open')
    if (term.classList.contains('is-open')) {
      termInput.focus()
      if (!termOut.children.length) termWrite(['Acatincho OS v2.6.0~', 'type "help" for available commands', '─'.repeat(40)])
    }
  }
})
