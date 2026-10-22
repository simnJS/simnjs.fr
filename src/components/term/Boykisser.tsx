import { useEffect, useRef } from 'react'
import { BOYKISSER, BOYKISSER_COLS, BOYKISSER_ROWS } from '../../term/boykisser'

// Le logo fastfetch, point par point : chaque point du braille est une
// particule rappelée vers sa place par un ressort. Elles se condensent au
// chargement, fuient le curseur et rougissent quand on les bouscule.

// Diffusé par le shell : `boykisser` le fait rougir, `fastfetch` le redessine.
export const BOYKISSER_EVENT = 'simnjs:boykisser'
export type BoykisserAction = 'kiss'

const CELL_W = 8.4
const CELL_H = 18
const WIDTH = BOYKISSER_COLS * CELL_W
const HEIGHT = BOYKISSER_ROWS * CELL_H
const RADIUS = 1.35

// Bit n du caractère braille → position (colonne, rangée) du point dans la cellule.
const DOT_OFFSETS = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 0],
  [1, 1],
  [1, 2],
  [0, 3],
  [1, 3],
]

const SPRING = 0.045
const DAMPING = 0.86
const REPEL_RADIUS = 36
const REPEL_FORCE = 2.4
const SHOCK_RADIUS = 110
const SHOCK_FORCE = 10

const COLORS = ['#ececf4', '#f2c4d9', '#f5a3c7']

function buildTargets(): Float32Array {
  const pts: number[] = []
  BOYKISSER.forEach((line, row) => {
    Array.from(line).forEach((ch, col) => {
      const bits = ch.codePointAt(0)! - 0x2800
      if (bits <= 0 || bits > 0xff) return
      DOT_OFFSETS.forEach(([dc, dr], bit) => {
        if (!((bits >> bit) & 1)) return
        pts.push(
          col * CELL_W + CELL_W * (0.25 + 0.5 * dc),
          row * CELL_H + CELL_H * (0.125 + 0.25 * dr),
        )
      })
    })
  })
  return Float32Array.from(pts)
}

const TARGETS = buildTargets()
export const BOYKISSER_DOTS = TARGETS.length / 2

export function Boykisser({
  delay = 0,
  max = WIDTH,
  className = '',
}: {
  delay?: number
  // Largeur maximale en pixels : au-delà de la taille native, le dessin grossit.
  max?: number
  className?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current!
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const n = BOYKISSER_DOTS
    const x = new Float32Array(n)
    const y = new Float32Array(n)
    const vx = new Float32Array(n)
    const vy = new Float32Array(n)
    const heat = new Float32Array(n)
    const release = new Float32Array(n)

    // Départ : chaque point naît dans un nuage autour de sa place, et les
    // colonnes sont libérées de gauche à droite, comme une ligne qui s'imprime.
    const start = performance.now() + delay
    for (let i = 0; i < n; i++) {
      const tx = TARGETS[2 * i]
      const ty = TARGETS[2 * i + 1]
      if (reduced) {
        x[i] = tx
        y[i] = ty
        continue
      }
      const angle = Math.random() * Math.PI * 2
      const dist = 30 + Math.random() * 110
      x[i] = tx + Math.cos(angle) * dist
      y[i] = ty + Math.sin(angle) * dist * 0.6
      release[i] = start + (tx / WIDTH) * 520 + Math.random() * 180
      heat[i] = 0.6
    }

    let scale = 1
    let dpr = 1
    function resize() {
      const w = Math.min(wrap.clientWidth, max)
      scale = w / WIDTH
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(HEIGHT * scale * dpr)
      draw(performance.now())
    }

    let pointer: { x: number; y: number } | null = null
    let raf = 0
    let visible = true

    function step(now: number): boolean {
      let moving = false
      for (let i = 0; i < n; i++) {
        if (now < release[i]) {
          moving = true
          continue
        }
        let ax = (TARGETS[2 * i] - x[i]) * SPRING
        let ay = (TARGETS[2 * i + 1] - y[i]) * SPRING
        if (pointer && !reduced) {
          const dx = x[i] - pointer.x
          const dy = y[i] - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < REPEL_RADIUS * REPEL_RADIUS && d2 > 0.01) {
            const d = Math.sqrt(d2)
            const f = (1 - d / REPEL_RADIUS) ** 2 * REPEL_FORCE
            ax += (dx / d) * f
            ay += (dy / d) * f
          }
        }
        vx[i] = (vx[i] + ax) * DAMPING
        vy[i] = (vy[i] + ay) * DAMPING
        x[i] += vx[i]
        y[i] += vy[i]
        const speed = Math.abs(vx[i]) + Math.abs(vy[i])
        heat[i] = Math.max(heat[i] * 0.965, Math.min(1, speed / 2.2))
        if (speed > 0.01 || heat[i] > 0.02 || Math.abs(TARGETS[2 * i] - x[i]) > 0.05) moving = true
      }
      return moving
    }

    function draw(now: number) {
      ctx!.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0)
      ctx!.clearRect(0, 0, WIDTH, HEIGHT)
      for (let bucket = 0; bucket < COLORS.length; bucket++) {
        ctx!.beginPath()
        for (let i = 0; i < n; i++) {
          if (now < release[i]) continue
          const b = heat[i] > 0.5 ? 2 : heat[i] > 0.12 ? 1 : 0
          if (b !== bucket) continue
          ctx!.moveTo(x[i] + RADIUS, y[i])
          ctx!.arc(x[i], y[i], RADIUS, 0, Math.PI * 2)
        }
        ctx!.fillStyle = COLORS[bucket]
        ctx!.fill()
      }
    }

    // La boucle ne tourne que tant qu'il y a quelque chose à animer.
    function frame(now: number) {
      const moving = step(now)
      draw(now)
      raf = moving || pointer ? requestAnimationFrame(frame) : 0
    }
    function wake() {
      if (!raf && visible) raf = requestAnimationFrame(frame)
    }

    function local(e: PointerEvent) {
      const r = canvas.getBoundingClientRect()
      return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale }
    }
    function onMove(e: PointerEvent) {
      pointer = local(e)
      wake()
    }
    function onLeave() {
      pointer = null
    }
    function shock(cx: number, cy: number, radius: number, force: number) {
      for (let i = 0; i < n; i++) {
        const dx = x[i] - cx
        const dy = y[i] - cy
        const d = Math.hypot(dx, dy)
        if (d > radius || d < 0.01) continue
        const f = (1 - d / radius) * force
        vx[i] += (dx / d) * f
        vy[i] += (dy / d) * f
      }
      wake()
    }
    function onDown(e: PointerEvent) {
      if (reduced) return
      const p = local(e)
      shock(p.x, p.y, SHOCK_RADIUS, SHOCK_FORCE)
    }
    function onAction(e: Event) {
      if ((e as CustomEvent<BoykisserAction>).detail !== 'kiss') return
      for (let i = 0; i < n; i++) heat[i] = 1
      if (!reduced) shock(WIDTH * 0.45, HEIGHT * 0.55, WIDTH, 7)
      else draw(performance.now())
      wake()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) wake()
      else if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    })
    io.observe(canvas)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerleave', onLeave)
    window.addEventListener(BOYKISSER_EVENT, onAction)
    resize()
    wake()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointerleave', onLeave)
      window.removeEventListener(BOYKISSER_EVENT, onAction)
    }
  }, [delay, max])

  return (
    <div ref={wrapRef} className={`w-full ${className}`} style={{ maxWidth: max }}>
      <canvas
        ref={canvasRef}
        width={Math.round(WIDTH)}
        height={HEIGHT}
        className="block h-auto w-full touch-pan-y"
        style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
        aria-hidden
      />
      <span className="sr-only">boykisser, drawn in braille dots</span>
    </div>
  )
}
