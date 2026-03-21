const sharp = require('sharp')
const path  = require('path')

const W = 1200
const H = 630

// Grid lines
const gridH = []
for (let y = 50; y < H; y += 40) {
  gridH.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#00e5ff" stroke-width="0.5" opacity="0.04"/>`)
}
const gridV = []
for (let x = 60; x < W; x += 60) {
  gridV.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#00e5ff" stroke-width="0.5" opacity="0.04"/>`)
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="glow-sm">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-lg">
      <feGaussianBlur stdDeviation="10" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#0a0a0f"/>

  <!-- Grid -->
  ${gridH.join('\n  ')}
  ${gridV.join('\n  ')}

  <!-- Top cyan border -->
  <rect x="0" y="0" width="${W}" height="3" fill="#00e5ff" opacity="0.9"/>

  <!-- Bottom cyan border -->
  <rect x="0" y="${H - 3}" width="${W}" height="3" fill="#00e5ff" opacity="0.35"/>

  <!-- Left magenta accent -->
  <rect x="0" y="80" width="4" height="${H - 160}" fill="#ff00de" opacity="0.75"/>

  <!-- Corner brackets — top left -->
  <polyline points="80,55 55,55 55,80" stroke="#00e5ff" stroke-width="2" fill="none" opacity="0.7"/>
  <!-- Corner brackets — top right -->
  <polyline points="${W - 80},55 ${W - 55},55 ${W - 55},80" stroke="#00e5ff" stroke-width="2" fill="none" opacity="0.7"/>
  <!-- Corner brackets — bottom left -->
  <polyline points="80,${H - 55} 55,${H - 55} 55,${H - 80}" stroke="#00e5ff" stroke-width="2" fill="none" opacity="0.7"/>
  <!-- Corner brackets — bottom right -->
  <polyline points="${W - 80},${H - 55} ${W - 55},${H - 55} ${W - 55},${H - 80}" stroke="#00e5ff" stroke-width="2" fill="none" opacity="0.7"/>

  <!-- MS_ logo — top left -->
  <text x="80" y="108" font-family="'Courier New',Courier,monospace" font-size="26" font-weight="bold"
        fill="#00e5ff" filter="url(#glow-sm)">MS_</text>

  <!-- URL — top right -->
  <text x="${W - 78}" y="108" font-family="'Courier New',Courier,monospace" font-size="15"
        fill="#00e5ff" text-anchor="end" opacity="0.45">martin-sciarrillo.github.io</text>

  <!-- Name glow layer -->
  <text x="80" y="320" font-family="Arial,Helvetica,sans-serif" font-size="104" font-weight="bold"
        fill="#00e5ff" opacity="0.12" filter="url(#glow-lg)">Mart&#237;n Sciarrillo</text>

  <!-- Name main -->
  <text x="80" y="320" font-family="Arial,Helvetica,sans-serif" font-size="104" font-weight="bold"
        fill="white">Mart&#237;n Sciarrillo</text>

  <!-- Roles -->
  <text x="82" y="372" font-family="'Courier New',Courier,monospace" font-size="19"
        fill="#00e5ff" letter-spacing="2" filter="url(#glow-sm)">CTO  &#xB7;  TECH EXECUTIVE  &#xB7;  ADVISOR  &#xB7;  SPEAKER</text>

  <!-- Divider -->
  <line x1="80" y1="398" x2="700" y2="398" stroke="#00e5ff" stroke-width="1" opacity="0.2"/>

  <!-- Tagline left bar -->
  <rect x="80" y="420" width="3" height="42" fill="#ff00de" opacity="0.85"/>

  <!-- Tagline text -->
  <text x="100" y="449" font-family="'Courier New',Courier,monospace" font-size="21"
        fill="rgba(255,255,255,0.6)">Turning AI, data &amp; cloud into real outcomes</text>

  <!-- Bottom label -->
  <text x="${W / 2}" y="${H - 48}" font-family="'Courier New',Courier,monospace" font-size="13"
        fill="#00e5ff" text-anchor="middle" opacity="0.35">// TECH PORTFOLIO</text>
</svg>`

sharp(Buffer.from(svg, 'utf8'))
  .png({ compressionLevel: 9 })
  .toFile(path.join(__dirname, 'og-image.png'))
  .then(info => console.log('✓ og-image.png generada:', info.width, 'x', info.height, `(${(info.size / 1024).toFixed(1)} KB)`))
  .catch(err => { console.error('Error:', err.message); process.exit(1) })
