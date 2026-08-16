import * as THREE from 'three'

export interface FlightSceneOptions {
  canvas: HTMLCanvasElement
  accent: string
  density: number
  reduced: boolean
}

export interface FlightScene {
  setProgress: (p: number) => void
  dispose: () => void
}

/**
 * Procedural five-shell scale flythrough — organism -> organ -> tissue -> cell -> gene circuit.
 * Geometry/opacity/camera math ported literally from the design prototype (see README).
 */
export function createFlightScene({ canvas, accent, density, reduced }: FlightSceneOptions): FlightScene {
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x05070a, 0.0075)
  const cam = new THREE.PerspectiveCamera(56, 1, 0.1, 600)
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setClearColor(0x000000, 0)

  const small = window.innerWidth < 760
  const k = (n: number) => Math.max(120, Math.round(n * density * (small ? 0.5 : 1)))
  const cA = new THREE.Color(accent)
  const cB = new THREE.Color('#3F7BFF')
  const cC = new THREE.Color('#BFE8DA')

  const cloud = (pts: number[], cols: number[], size: number, op: number) => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3))
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(cols), 3))
    return new THREE.Points(
      g,
      new THREE.PointsMaterial({
        size,
        vertexColors: true,
        transparent: true,
        opacity: op,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
      })
    )
  }
  const push = (p: number[], c: number[], x: number, y: number, z: number, col: THREE.Color, jit: number) => {
    p.push(x + (Math.random() - 0.5) * jit, y + (Math.random() - 0.5) * jit, z + (Math.random() - 0.5) * jit)
    c.push(col.r, col.g, col.b)
  }

  const shells: THREE.Group[] = []
  const add = (obj: THREE.Group, z: number) => {
    obj.position.z = z
    scene.add(obj)
    shells.push(obj)
    return obj
  }

  // 01 ORGANISM — point-cloud figure
  ;(() => {
    const g = new THREE.Group()
    const parts = [
      [0, 10.4, 0, 1.5, 1.8, 1.5],
      [0, 6.4, 0, 2.9, 3.1, 1.5],
      [0, 2.4, 0, 2.5, 1.6, 1.4],
      [-3.6, 6.2, 0, 0.9, 3.4, 0.9],
      [3.6, 6.2, 0, 0.9, 3.4, 0.9],
      [-1.4, -2.6, 0, 1.0, 4.2, 1.0],
      [1.4, -2.6, 0, 1.0, 4.2, 1.0],
    ]
    const p: number[] = []
    const c: number[] = []
    for (let i = 0; i < k(3400); i++) {
      const q = parts[(Math.random() * parts.length) | 0]
      let x = 0, y = 0, z = 0, d = 0
      do {
        x = Math.random() * 2 - 1
        y = Math.random() * 2 - 1
        z = Math.random() * 2 - 1
        d = x * x + y * y + z * z
      } while (d > 1)
      push(p, c, q[0] + x * q[3], q[1] + y * q[4], q[2] + z * q[5], Math.random() > 0.82 ? cA : cC, 0.06)
    }
    g.add(cloud(p, c, 0.085, 0.9))
    add(g, 0)
  })()

  // 02 ORGAN — lobed mass
  ;(() => {
    const g = new THREE.Group()
    const p: number[] = []
    const c: number[] = []
    for (let i = 0; i < k(3200); i++) {
      const u = Math.random() * Math.PI * 2
      const v = Math.acos(2 * Math.random() - 1)
      const rr = 8 + Math.sin(v * 3) * 1.3 + Math.cos(u * 2) * 1.9 + Math.sin(u * 5 + v * 3) * 0.6
      push(p, c, Math.sin(v) * Math.cos(u) * rr * 1.15, Math.cos(v) * rr * 0.82, Math.sin(v) * Math.sin(u) * rr * 0.8, Math.random() > 0.78 ? cB : cA, 0.5)
    }
    g.add(cloud(p, c, 0.11, 0.85))
    add(g, -70)
  })()

  // 03 TISSUE — packed cells
  ;(() => {
    const g = new THREE.Group()
    const p: number[] = []
    const c: number[] = []
    const R = 3.4
    for (let row = -4; row <= 4; row++) {
      for (let col = -6; col <= 6; col++) {
        const cx = col * R * 1.75 + (row % 2 ? R * 0.88 : 0)
        const cy = row * R * 1.5
        const cz = (Math.random() - 0.5) * 6
        const sick = Math.random() > 0.74
        const ring = k(28)
        for (let a = 0; a < ring; a++) {
          const t = (a / ring) * Math.PI * 2
          const rr = R * (0.86 + Math.random() * 0.18)
          push(p, c, cx + Math.cos(t) * rr, cy + Math.sin(t) * rr * 0.92, cz, sick ? cA : cC, 0.22)
        }
        const nucleus = k(9)
        for (let a = 0; a < nucleus; a++) push(p, c, cx, cy, cz, sick ? cA : cB, 1.5)
      }
    }
    g.add(cloud(p, c, 0.1, 0.8))
    add(g, -140)
  })()

  // 04 CELL — membrane, nucleus, organelles
  ;(() => {
    const g = new THREE.Group()
    const p: number[] = []
    const c: number[] = []
    for (let i = 0; i < k(2600); i++) {
      const u = Math.random() * Math.PI * 2
      const v = Math.acos(2 * Math.random() - 1)
      const rr = 13 + Math.sin(u * 7) * 0.5
      push(p, c, Math.sin(v) * Math.cos(u) * rr, Math.cos(v) * rr, Math.sin(v) * Math.sin(u) * rr, cC, 0.35)
    }
    for (let i = 0; i < k(1200); i++) {
      const u = Math.random() * Math.PI * 2
      const v = Math.acos(2 * Math.random() - 1)
      const rr = 4.6 * Math.cbrt(Math.random())
      push(p, c, Math.sin(v) * Math.cos(u) * rr, Math.cos(v) * rr, Math.sin(v) * Math.sin(u) * rr, cA, 0.2)
    }
    for (let o = 0; o < 26; o++) {
      const u = Math.random() * Math.PI * 2
      const v = Math.acos(2 * Math.random() - 1)
      const rr = 6 + Math.random() * 5.5
      const ox = Math.sin(v) * Math.cos(u) * rr
      const oy = Math.cos(v) * rr
      const oz = Math.sin(v) * Math.sin(u) * rr
      const n = k(26)
      for (let i = 0; i < n; i++) push(p, c, ox, oy, oz, cB, 1.5)
    }
    g.add(cloud(p, c, 0.1, 0.9))
    add(g, -210)
  })()

  // 05 CIRCUIT — double helix + rungs
  ;(() => {
    const g = new THREE.Group()
    const p: number[] = []
    const c: number[] = []
    const lp: number[] = []
    const lc: number[] = []
    const N = 190
    const L = 46
    for (let i = 0; i < N; i++) {
      const t = i / N
      const a = t * Math.PI * 7
      const x = (t - 0.5) * L
      const y1 = Math.cos(a) * 4.4
      const z1 = Math.sin(a) * 4.4
      const y2 = -y1
      const z2 = -z1
      const strand = k(7)
      for (let s = 0; s < strand; s++) {
        push(p, c, x, y1, z1, cA, 0.34)
        push(p, c, x, y2, z2, cB, 0.34)
      }
      if (i % 4 === 0) {
        lp.push(x, y1, z1, x, y2, z2)
        const f2 = 0.35 + Math.abs(Math.cos(a)) * 0.65
        for (let s = 0; s < 2; s++) lc.push(cC.r * f2, cC.g * f2, cC.b * f2)
      }
    }
    g.add(cloud(p, c, 0.12, 0.95))
    const lg = new THREE.BufferGeometry()
    lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lp), 3))
    lg.setAttribute('color', new THREE.BufferAttribute(new Float32Array(lc), 3))
    g.add(
      new THREE.LineSegments(
        lg,
        new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending })
      )
    )
    g.rotation.z = 0.12
    add(g, -282)
  })()

  const Z = [0, -70, -140, -210, -282]
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
  const onMouseMove = (e: MouseEvent) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1
    mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1)
  }
  window.addEventListener('mousemove', onMouseMove)

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth
    const h = canvas.clientHeight || window.innerHeight
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.85))
    renderer.setSize(w, h, false)
    cam.aspect = w / h
    cam.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize)

  let visible = true
  const io = new IntersectionObserver((es) => {
    visible = es[0].isIntersecting
  }, { threshold: 0.01 })
  io.observe(canvas)

  const cl = (v: number) => Math.max(0, Math.min(1, v))
  let flightProgress = 0
  let p = 0
  let t0 = performance.now()
  let rafId = 0

  const tick = (now: number) => {
    rafId = requestAnimationFrame(tick)
    if (!visible) return
    const dt = Math.min(0.05, (now - t0) / 1000)
    t0 = now
    p += (flightProgress - p) * (reduced ? 1 : 0.075)
    const camZ = 26 - p * 282
    cam.position.z = camZ
    if (!reduced) {
      mouse.x += (mouse.tx - mouse.x) * 0.045
      mouse.y += (mouse.ty - mouse.y) * 0.045
      cam.position.x += (mouse.x * 3.2 - cam.position.x) * 0.05
      cam.position.y += (mouse.y * 2.2 - cam.position.y) * 0.05
    }
    cam.lookAt(0, 0, camZ - 40)
    for (let i = 0; i < shells.length; i++) {
      const rel = camZ - Z[i]
      const o = cl((95 - rel) / 42) * cl((rel + 14) / 24)
      const g = shells[i]
      g.visible = o > 0.004
      if (!g.visible) continue
      g.children.forEach((ch) => {
        const mat = (ch as THREE.Points | THREE.LineSegments).material as THREE.Material & { opacity: number }
        mat.opacity = o * (ch.type === 'LineSegments' ? 0.55 : 0.92)
      })
      if (!reduced) {
        g.rotation.y += dt * (0.05 - i * 0.006)
        g.rotation.x = Math.sin(now / 5200 + i) * 0.05
      }
    }
    renderer.render(scene, cam)
  }
  rafId = requestAnimationFrame(tick)

  return {
    setProgress: (v: number) => {
      flightProgress = v
    },
    dispose: () => {
      cancelAnimationFrame(rafId)
      io.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resize)
      renderer.dispose()
    },
  }
}
