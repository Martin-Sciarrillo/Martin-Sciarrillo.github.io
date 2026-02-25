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

const bootLines = [
  '> SYSTEM INIT v2.6.0',
  '> LOADING PROFILE: Martín Sciarrillo',
  '> MODULES: AI · DATA · CLOUD · STRATEGY',
  '> EXPERIENCE: 20+ YEARS  ·  LATAM + GLOBAL',
  '> STATUS: [████████████████] ONLINE',
  '> TIP: Press Ctrl+` to open terminal',
  '> LAUNCHING INTERFACE...',
]

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

function runBoot() {
  const screen = document.getElementById('boot-screen')
  const linesEl = document.getElementById('boot-lines')

  if (!screen || reducedMotion || sessionStorage.getItem('booted')) {
    screen?.remove()
    document.documentElement.classList.remove('is-booting')
    initTagline()
    return
  }

  let li = 0
  function nextLine() {
    if (li >= bootLines.length) {
      setTimeout(() => {
        screen.classList.add('boot--out')
        setTimeout(() => {
          screen.remove()
          document.documentElement.classList.remove('is-booting')
          sessionStorage.setItem('booted', '1')
          initTagline()
        }, 500)
      }, 350)
      return
    }
    const div = document.createElement('div')
    div.className = 'boot-line'
    if (li === 0) div.classList.add('boot-line--sys')
    if (li === bootLines.length - 1) div.classList.add('boot-line--launch')
    linesEl.appendChild(div)
    let ci = 0
    const typeChar = () => {
      div.textContent = bootLines[li].slice(0, ci++)
      if (ci <= bootLines[li].length) setTimeout(typeChar, 16)
      else { li++; setTimeout(nextLine, li < bootLines.length ? 60 : 350) }
    }
    typeChar()
  }
  nextLine()
}

runBoot()

// ============================================================
// TERMINAL EASTER EGG  (Ctrl+`)
// ============================================================
const term = document.createElement('div')
term.id = 'terminal'
term.innerHTML = `
  <div class="term-header">
    <span class="term-title">// MARTÍN SCIARRILLO OS v2.6.0</span>
    <button class="term-close" aria-label="Close terminal">✕</button>
  </div>
  <div class="term-output" id="term-output"></div>
  <div class="term-input-row">
    <span class="term-prompt">root@martin:~$&nbsp;</span>
    <input class="term-input" id="term-input" type="text" autocomplete="off" spellcheck="false" />
  </div>
`
document.body.appendChild(term)

const termOut   = document.getElementById('term-output')
const termInput = document.getElementById('term-input')

const termCmds = {
  help:    () => ['available commands:', '  whoami   · who is this?', '  ls       · list sections', '  skills   · tech stack', '  contact  · book a coffee', '  clear    · clear screen', '  exit     · close terminal'],
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
  termWrite([`root@martin:~$ ${cmd}`], 'term-cmd')
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
      if (!termOut.children.length) termWrite(['Martín Sciarrillo OS v2.6.0', 'type "help" for available commands', '─'.repeat(40)])
    }
  }
})
