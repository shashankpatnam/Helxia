import { useEffect, useRef } from 'react'
import { createFlightScene, type FlightScene } from '../lib/flightScene'
import { scrollEngine } from '../lib/scrollEngine'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useCountUp } from '../hooks/useCountUp'

const STAGES = [
  {
    eyebrow: 'SCALE 01 — ORGANISM · 1 m',
    title: 'A whole body absorbs the dose.',
    body: 'Systemic therapy reaches 30 trillion cells to correct a few million. Everything else is side effect.',
  },
  {
    eyebrow: 'SCALE 02 — ORGAN · 10 cm',
    title: 'Delivery narrows the field.',
    body: 'Tropic lipid nanoparticles concentrate the payload in one tissue — necessary, but nowhere near sufficient.',
  },
  {
    eyebrow: 'SCALE 03 — TISSUE · 100 µm',
    title: 'Sick and healthy sit side by side.',
    body: 'Within a single millimetre, two neighbouring cells differ only in what they are transcribing right now.',
  },
  {
    eyebrow: 'SCALE 04 — CELL · 10 µm',
    title: 'So we ask the cell first.',
    body: 'The circuit enters every cell it meets and stays silent in all but the ones whose state matches the condition.',
  },
  {
    eyebrow: 'SCALE 05 — CIRCUIT · 2 nm',
    title: 'Sense. Compute. Correct.',
    body: 'Eight kilobases of synthetic DNA, running the smallest program in medicine.',
  },
]

const TICKS = ['1 m', '10 cm', '100 µm', '10 µm', '2 nm']

interface HeroFlightProps {
  accentColor?: string
  enableWebgl?: boolean
  density?: number
}

export function HeroFlight({ accentColor = '#6EF3C0', enableWebgl = true, density = 1 }: HeroFlightProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const stagesBoxRef = useRef<HTMLDivElement>(null)
  const stageRefs = useRef<Array<HTMLDivElement | null>>([])
  const scalelineRef = useRef<HTMLDivElement>(null)
  const tickRefs = useRef<Array<HTMLDivElement | null>>([])
  const countRefs = useRef<Array<HTMLDivElement | null>>([])
  const reduced = useReducedMotion()
  const countUp = useCountUp()
  const countedRef = useRef(false)

  const flightSceneRef = useRef<FlightScene | null>(null)
  useEffect(() => {
    if (!enableWebgl || !canvasRef.current) return
    flightSceneRef.current = createFlightScene({ canvas: canvasRef.current, accent: accentColor, density, reduced })
    return () => {
      flightSceneRef.current?.dispose()
      flightSceneRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const cl01 = (v: number) => Math.max(0, Math.min(1, v))

    const unsub = scrollEngine.subscribe(() => {
      const section = sectionRef.current
      const heroContent = heroContentRef.current
      const stagesBox = stagesBoxRef.current
      const scaleline = scalelineRef.current
      if (!section || !heroContent) return

      const b = section.getBoundingClientRect()
      const span = section.offsetHeight - window.innerHeight
      const raw = cl01(-b.top / (span || 1))
      const heroP = cl01(raw / 0.13)
      heroContent.style.opacity = String(1 - heroP)
      heroContent.style.transform = `translateY(${-70 * heroP}px)`
      heroContent.style.pointerEvents = heroP > 0.6 ? 'none' : 'auto'

      const flightP = cl01((raw - 0.1) / 0.88)
      flightSceneRef.current?.setProgress(flightP)

      if (stagesBox) stagesBox.style.opacity = String(heroP)
      if (scaleline) scaleline.style.opacity = String(heroP)

      const n = STAGES.length
      const act = Math.min(n - 1, Math.floor(flightP * n))
      const loc = flightP * n - act

      stageRefs.current.forEach((el, i) => {
        if (!el) return
        const o = i === act ? cl01(Math.min(loc, 1 - loc) / 0.2) : 0
        el.style.opacity = String(o * heroP)
        el.style.transform = `translateY(${26 - 26 * o}px)`
      })

      tickRefs.current.forEach((el, i) => {
        if (!el) return
        const on = i === act
        el.style.color = on ? 'var(--color-accent)' : 'var(--color-muted-2)'
        const bar = el.querySelector<HTMLElement>('[data-tickbar]')
        if (bar) bar.style.width = on ? '46px' : '16px'
      })
    })

    return unsub
  }, [])

  useEffect(() => {
    const el = heroContentRef.current
    if (!el || countedRef.current) return
    const io = new IntersectionObserver((es) => {
      if (es[0].isIntersecting) {
        countedRef.current = true
        const targets = [14, 3, 91]
        const suffixes = ['', '', '%']
        countRefs.current.forEach((node, i) => {
          if (!node) return
          countUp(0, targets[i], 1600, (v) => {
            node.textContent = v + suffixes[i]
          })
        })
        io.disconnect()
      }
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section ref={sectionRef} className="relative" style={{ height: '460svh' }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-end overflow-hidden px-[clamp(20px,4vw,56px)] pb-[clamp(28px,4vw,52px)]">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 block h-full w-full" />

        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(120% 85% at 78% 22%, rgba(110,243,192,.14), transparent 55%), radial-gradient(90% 70% at 12% 88%, rgba(58,120,255,.13), transparent 60%), linear-gradient(180deg, rgba(5,7,10,.86) 0%, rgba(5,7,10,.35) 38%, rgba(5,7,10,.94) 92%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-[.16]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: 'clamp(60px,8vw,116px) clamp(60px,8vw,116px)',
            maskImage: 'radial-gradient(70% 60% at 50% 45%, #000 0%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(70% 60% at 50% 45%, #000 0%, transparent 78%)',
          }}
        />

        <div
          ref={heroContentRef}
          className="relative z-[2] mx-auto w-full max-w-[1600px] pt-[clamp(92px,15svh,150px)]"
          style={{ willChange: 'transform, opacity' }}
        >
          <div
            className="mb-[clamp(22px,3vw,38px)] inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/3 py-2 pr-4 pl-2.5 font-mono text-[11px] tracking-[.14em] text-text-3 backdrop-blur-sm"
            style={{ opacity: 0, transform: 'translateY(20px)', animation: 'fadeUp .9s cubic-bezier(.16,1,.3,1) 1.5s forwards' }}
          >
            <span className="h-1.5 w-1.5 animate-[blip_2.2s_ease-in-out_infinite] rounded-full bg-accent" style={{ boxShadow: '0 0 12px #6EF3C0' }} />
            SERIES C — $240M TO ADVANCE HLX-201 INTO PHASE II
          </div>

          <h1 className="m-0 max-w-[16ch] font-display text-[clamp(38px,min(9.4vw,13.5svh),172px)] leading-[.92] font-normal tracking-[-0.035em]">
            <span className="block overflow-hidden pb-[.04em]">
              <span className="block" style={{ transform: 'translateY(110%) rotate(3deg)', animation: 'rise 1.15s cubic-bezier(.16,1,.3,1) .95s forwards' }}>
                Programmable
              </span>
            </span>
            <span className="block overflow-hidden pb-[.04em]">
              <span className="block" style={{ transform: 'translateY(110%) rotate(3deg)', animation: 'rise 1.15s cubic-bezier(.16,1,.3,1) 1.06s forwards' }}>
                biology for the<span className="text-accent">.</span>
              </span>
            </span>
            <span className="block overflow-hidden pb-[.04em]">
              <span className="block" style={{ transform: 'translateY(110%) rotate(3deg)', animation: 'rise 1.15s cubic-bezier(.16,1,.3,1) 1.17s forwards' }}>
                <em className="text-accent-tint italic">un</em>treatable
              </span>
            </span>
          </h1>

          <div className="mt-[clamp(20px,4svh,70px)] grid grid-cols-1 items-end gap-[clamp(28px,4vw,56px)] border-t border-white/9 pt-[clamp(16px,2.6svh,34px)] min-[1100px]:grid-cols-[1.1fr_1fr]">
            <p
              className="m-0 max-w-[44ch] text-[clamp(15px,1.15vw,18.5px)] leading-[1.62] text-text-3"
              style={{ textWrap: 'pretty', opacity: 0, transform: 'translateY(20px)', animation: 'fadeUp 1s cubic-bezier(.16,1,.3,1) 1.62s forwards' }}
            >
              We design synthetic gene circuits that read a cell&apos;s state and write a corrective response — in vivo,
              reversibly, and with single-cell resolution.
            </p>
            <div
              className="flex flex-wrap gap-[clamp(22px,4vw,64px)] [@media(max-height:660px)]:hidden"
              style={{ opacity: 0, transform: 'translateY(20px)', animation: 'fadeUp 1s cubic-bezier(.16,1,.3,1) 1.78s forwards' }}
            >
              {[
                { label: 'PROGRAMS' },
                { label: 'IN CLINIC' },
                { label: 'ON-TARGET EDIT' },
              ].map((s, i) => (
                <div key={s.label}>
                  <div
                    ref={(el) => { countRefs.current[i] = el }}
                    className="font-display text-[clamp(28px,min(3.6vw,6svh),54px)] leading-none tracking-[-0.03em]"
                  >
                    0
                  </div>
                  <div className="mt-2.5 font-mono text-[10.5px] tracking-[.16em] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="mt-[clamp(18px,3.4svh,52px)] flex items-center gap-3 font-mono text-[10.5px] tracking-[.16em] text-muted [@media(max-height:600px)]:hidden"
            style={{ opacity: 0, transform: 'translateY(20px)', animation: 'fadeUp 1s ease 2s forwards' }}
          >
            <span className="relative block h-11 w-px overflow-hidden bg-white/14">
              <span className="absolute inset-0 animate-[cue_2.4s_ease-in-out_infinite] bg-accent" />
            </span>
            SCROLL — DESCEND THROUGH THE SCALES
          </div>
        </div>

        <div
          ref={stagesBoxRef}
          className="pointer-events-none absolute inset-0 z-[2] flex items-center px-[clamp(20px,4vw,56px)] opacity-0"
        >
          <div className="relative mx-auto w-full max-w-[1600px]">
            {STAGES.map((s, i) => (
              <div
                key={s.eyebrow}
                ref={(el) => { stageRefs.current[i] = el }}
                className="absolute top-[-96px] max-w-[30ch] opacity-0 transition-[opacity,transform] duration-800"
                style={{ transitionTimingFunction: 'ease, cubic-bezier(.16,1,.3,1)' }}
              >
                <div className="mb-[18px] font-mono text-[10.5px] tracking-[.2em] text-accent">{s.eyebrow}</div>
                <h2 className="m-0 mb-4 font-display text-[clamp(28px,3.8vw,58px)] leading-[1.06] font-normal tracking-[-0.03em]">
                  {s.title}
                </h2>
                <p className="m-0 text-[14.5px] leading-[1.66] text-text-3" style={{ textWrap: 'pretty' }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={scalelineRef}
          className="absolute top-1/2 right-[clamp(20px,4vw,56px)] z-[2] hidden -translate-y-1/2 flex-col items-end gap-3.5 font-mono text-[9.5px] tracking-[.16em] opacity-0 transition-opacity duration-600 min-[820px]:flex"
        >
          {TICKS.map((label, i) => (
            <div
              key={label}
              ref={(el) => { tickRefs.current[i] = el }}
              className="flex items-center gap-2.5 text-muted-2 transition-colors duration-400"
            >
              <span>{label}</span>
              <span data-tickbar className="block h-px w-4 bg-current transition-[width] duration-500" style={{ transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
