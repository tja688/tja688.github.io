const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

export async function loadTheme(
  url = new URL('./theme.json', import.meta.url),
) {
  const response = await fetch(url)
  if (!response.ok)
    throw new Error(`Theme could not load (${response.status}): ${url}`)
  const theme = await response.json()
  if (
    theme.schemaVersion !== 1 ||
    !theme.palette ||
    !theme.motion ||
    !theme.world ||
    !theme.audio
  )
    throw new Error('Expected a pixel-ink theme with schemaVersion 1')
  for (const [name, color] of Object.entries(theme.palette)) {
    if (typeof color !== 'string' || !/^#[a-f\d]{6}$/i.test(color))
      throw new Error(`Invalid palette color: ${name}`)
  }
  for (const [name, role] of Object.entries(theme.roles)) {
    if (!(role in theme.palette))
      throw new Error(`Unknown palette role: ${name}=${role}`)
  }
  return theme
}

export function installTheme(theme, root = document.documentElement) {
  for (const [name, color] of Object.entries(theme.palette))
    root.style.setProperty(`--ink-${name}`, color)
  for (const [name, role] of Object.entries(theme.roles))
    root.style.setProperty(`--ink-${name}`, theme.palette[role])
  root.style.setProperty('--ink-body-size', `${theme.typography.bodyPx}px`)
  root.style.setProperty('--ink-label-size', `${theme.typography.labelPx}px`)
  root.style.setProperty(
    '--ink-caption-size',
    `${theme.typography.captionPx}px`,
  )
  root.style.setProperty('--ink-title-size', `${theme.typography.titlePx}px`)
  root.style.setProperty('--ink-line-height', theme.typography.bodyLineHeight)
}

export async function loadFonts() {
  const faces = await Promise.all([
    document.fonts.load('16px "Ink CJK"', '探索资源设置确认，。？！'),
    document.fonts.load('16px "Ink Pixel"', 'A-Z 0123456789'),
    document.fonts.load('700 16px "Ink Pixel"', 'START SCORE'),
  ])
  if (
    faces.some((family) => family.length === 0) ||
    !document.fonts.check('16px "Ink CJK"') ||
    !document.fonts.check('16px "Ink Pixel"')
  )
    throw new Error(
      'Pixel-ink fonts did not load; import art/style.css before calling loadFonts',
    )
}

export function noise(x, y, seed = 17) {
  let n =
    Math.imul(Math.round(x) + seed, 374761393) ^
    Math.imul(Math.round(y) + 7, 668265263)
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296
}

export function pixelLine(ctx, ax, ay, bx, by, color) {
  let x = Math.round(ax),
    y = Math.round(ay)
  const endX = Math.round(bx),
    endY = Math.round(by)
  const dx = Math.abs(endX - x),
    dy = -Math.abs(endY - y)
  const sx = x < endX ? 1 : -1,
    sy = y < endY ? 1 : -1
  let error = dx + dy
  ctx.fillStyle = color
  for (;;) {
    ctx.fillRect(x, y, 1, 1)
    if (x === endX && y === endY) break
    const next = error * 2
    if (next >= dy) {
      error += dy
      x += sx
    }
    if (next <= dx) {
      error += dx
      y += sy
    }
  }
}

export function pixelRing(
  ctx,
  cx,
  cy,
  radius,
  color,
  { sides = 64, rotation = 0 } = {},
) {
  for (let i = 0; i < sides; i++) {
    const a = rotation + (i / sides) * Math.PI * 2,
      b = rotation + ((i + 1) / sides) * Math.PI * 2
    pixelLine(
      ctx,
      cx + Math.cos(a) * radius,
      cy + Math.sin(a) * radius,
      cx + Math.cos(b) * radius,
      cy + Math.sin(b) * radius,
      color,
    )
  }
}

export function pixelPolygon(ctx, points, color) {
  if (points.length < 3) return
  const vertices = points.map(([x, y]) => [Math.round(x), Math.round(y)])
  const top = Math.min(...vertices.map((p) => p[1])),
    bottom = Math.max(...vertices.map((p) => p[1]))
  ctx.fillStyle = color
  for (let y = top; y <= bottom; y++) {
    const crossings = []
    for (let i = 0; i < vertices.length; i++) {
      const a = vertices[i],
        b = vertices[(i + 1) % vertices.length]
      if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y))
        crossings.push(a[0] + ((y - a[1]) / (b[1] - a[1])) * (b[0] - a[0]))
    }
    crossings.sort((a, b) => a - b)
    for (let i = 0; i + 1 < crossings.length; i += 2)
      ctx.fillRect(
        Math.ceil(crossings[i]),
        y,
        Math.floor(crossings[i + 1]) - Math.ceil(crossings[i]) + 1,
        1,
      )
  }
}

export function ditherRect(
  ctx,
  { x, y, width, height, density, color, originX = 0, originY = 0 },
) {
  x = Math.round(x)
  y = Math.round(y)
  const threshold = Math.max(0, Math.min(1, density)) * 16
  ctx.fillStyle = color
  for (let py = 0; py < height; py++)
    for (let px = 0; px < width; px++) {
      if (
        threshold >
        BAYER[((y + py + originY) & 3) * 4 + ((x + px + originX) & 3)]
      )
        ctx.fillRect(x + px, y + py, 1, 1)
    }
}

export function makeDitherGlow(radius, color, density = 0.8) {
  radius = Math.max(1, Math.round(radius))
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = radius * 2
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = color
  for (let y = 0; y < canvas.height; y++)
    for (let x = 0; x < canvas.width; x++) {
      const d = Math.hypot(x - radius + 0.5, y - radius + 0.5) / radius
      if (
        d < 1 &&
        Math.pow(1 - d, 2.4) * 16 * density > BAYER[(y & 3) * 4 + (x & 3)]
      )
        ctx.fillRect(x, y, 1, 1)
    }
  return canvas
}

export function drawBlueprint(
  ctx,
  blueprint,
  { x, y, scale = 1, colors = blueprint.colors },
) {
  const pivot = blueprint.pivot ?? [
    Math.floor(blueprint.rows[0].length / 2),
    blueprint.rows.length - 1,
  ]
  x = Math.round(x - pivot[0] * scale)
  y = Math.round(y - pivot[1] * scale)
  blueprint.rows.forEach((row, py) =>
    [...row].forEach((token, px) => {
      if (token === '.' || token === ' ') return
      const color = colors[token]
      if (!color) throw new Error(`Blueprint color missing for token ${token}`)
      ctx.fillStyle = color
      ctx.fillRect(x + px * scale, y + py * scale, scale, scale)
    }),
  )
}

export function makeFloor(width, height, { palette, tile = 16, seed = 17 }) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = palette.ground
  ctx.fillRect(0, 0, width, height)
  for (let y = 0; y < height; y += tile)
    for (let x = 0; x < width; x += tile) {
      ctx.fillStyle = palette.plane
      ctx.fillRect(x, y, 1, 1)
      for (let i = 0; i < 3; i++)
        ctx.fillRect(
          x + Math.floor(noise(x + i * 13, y, seed) * tile),
          y + Math.floor(noise(x, y + i * 11, seed) * tile),
          i === 2 ? 2 : 1,
          1,
        )
      if (noise(x, y, seed) > 0.93) {
        ctx.fillStyle = palette.void
        for (let i = 0; i < 5; i++)
          ctx.fillRect(x + 4 + Math.round(Math.sin(i * 2)), y + i + 3, 1, 1)
      }
    }
  return canvas
}

export function createPixelSurface(
  canvas,
  {
    logicalHeight = 270,
    minWidth = 160,
    maxWidth = 640,
    onResize = () => {},
  } = {},
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('A Canvas 2D context is required')
  const parent = canvas.parentElement
  if (!parent)
    throw new Error(
      'Attach the world canvas to a sized container before creating a surface',
    )
  const resize = () => {
    const width = Math.max(1, parent.clientWidth),
      height = Math.max(1, parent.clientHeight)
    canvas.width = Math.max(
      minWidth,
      Math.min(maxWidth, Math.round((logicalHeight * width) / height / 2) * 2),
    )
    canvas.height = logicalHeight
    const scale = Math.min(width / canvas.width, height / canvas.height)
    canvas.style.width = `${Math.floor(canvas.width * scale)}px`
    canvas.style.height = `${Math.floor(canvas.height * scale)}px`
    ctx.imageSmoothingEnabled = false
    onResize(canvas.width, canvas.height)
  }
  const observer = new ResizeObserver(resize)
  observer.observe(parent)
  resize()
  return {
    ctx,
    get width() {
      return canvas.width
    },
    get height() {
      return canvas.height
    },
    resize,
    fromClient(clientX, clientY) {
      const box = canvas.getBoundingClientRect()
      return {
        x: ((clientX - box.left) / box.width) * canvas.width,
        y: ((clientY - box.top) / box.height) * canvas.height,
      }
    },
    dispose() {
      observer.disconnect()
    },
  }
}

export class InkFX {
  constructor(theme, { reducedMotion = false } = {}) {
    this.theme = theme
    this.reducedMotion = reducedMotion
    this.particles = []
    this.labels = []
    this.rings = []
    this.seen = new Set()
  }
  claim(channel, eventId) {
    if (eventId == null) return true
    const key = `${channel}:${eventId}`
    if (this.seen.has(key)) return false
    this.seen.add(key)
    if (this.seen.size > 256) this.seen.delete(this.seen.values().next().value)
    return true
  }
  burst({
    x,
    y,
    color,
    count = this.theme.motion.burstCount,
    eventId,
    seed = 1,
  }) {
    if (!this.claim('burst', eventId) || this.reducedMotion) return
    const life = this.theme.motion.burstMs / 1000
    const max = this.theme.world.maxTransientParticles
    for (let i = 0; i < count && this.particles.length < max; i++) {
      const angle = i * 2.39996 + seed * 0.13,
        speed =
          (this.theme.motion.burstDistancePx / life) *
          (0.6 + noise(i, seed) * 0.8)
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        age: 0,
        life,
        color: i % 3 === 0 ? this.theme.palette.ink : color,
        size: i % 4 === 0 ? 2 : 1,
      })
    }
  }
  pulse({ x, y, color, radius = 6, eventId }) {
    if (
      !this.claim('pulse', eventId) ||
      this.reducedMotion ||
      this.rings.length >= this.theme.motion.maxConcurrentBursts
    )
      return
    this.rings.push({
      x,
      y,
      color,
      radius,
      age: 0,
      life: this.theme.motion.impactMs / 1000,
    })
  }
  float({ x, y, text, color, eventId }) {
    if (!this.claim('float', eventId)) return
    this.labels.push({
      x,
      y,
      text: String(text),
      color,
      age: 0,
      life: this.theme.motion.floatMs / 1000,
    })
    if (this.labels.length > 12) this.labels.shift()
  }
  update(dt) {
    dt = Math.max(0, Math.min(dt, 0.05))
    for (const p of this.particles) {
      p.age += dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.vy += 20 * dt
    }
    for (const item of [...this.labels, ...this.rings]) item.age += dt
    this.particles = this.particles.filter((p) => p.age < p.life)
    this.labels = this.labels.filter((p) => p.age < p.life)
    this.rings = this.rings.filter((p) => p.age < p.life)
  }
  draw(ctx) {
    ctx.save()
    for (const p of this.rings) {
      ctx.globalAlpha = 1 - p.age / p.life
      pixelRing(ctx, p.x, p.y, p.radius + (p.age / p.life) * 10, p.color)
    }
    for (const p of this.particles) {
      ctx.globalAlpha = 1 - p.age / p.life
      ctx.fillStyle = p.color
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)
    }
    ctx.font = '8px "Ink Pixel", monospace'
    ctx.textAlign = 'center'
    for (const p of this.labels) {
      ctx.globalAlpha = p.age / p.life < 0.7 ? 1 : (1 - p.age / p.life) / 0.3
      const y = Math.round(
        p.y - (this.reducedMotion ? 0 : (p.age / p.life) * 12),
      )
      ctx.fillStyle = this.theme.palette.void
      ctx.fillText(p.text, Math.round(p.x) + 1, y + 1)
      ctx.fillStyle = p.color
      ctx.fillText(p.text, Math.round(p.x), y)
    }
    ctx.restore()
  }
  clear() {
    this.particles.length = 0
    this.labels.length = 0
    this.rings.length = 0
    this.seen.clear()
  }
}
