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
