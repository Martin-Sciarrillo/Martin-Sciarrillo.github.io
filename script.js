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
