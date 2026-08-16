import { useEffect, useRef, useState } from 'react'
import { Reveal } from './Reveal'
import { SENSE, LOGIC, EFFECTOR, computeLab } from '../lib/labModel'
import { useCountUp } from '../hooks/useCountUp'

type Group = 'sense' | 'logic' | 'effector'

export function CircuitLab() {
  const [sel, setSel] = useState({ sense: 0, logic: 0, effector: 0 })
  const sectionRef = useRef<HTMLElement>(null)
  const specRef = useRef<HTMLDivElement>(null)
  const offRef = useRef<HTMLDivElement>(null)
  const winRef = useRef<HTMLDivElement>(null)
  const rectRefs = useRef<Array<SVGRectElement | null>>([])
  const countUp = useCountUp()
  const paintedOnceRef = useRef(false)

  const result = computeLab(sel.sense, sel.logic, sel.effector)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          paint(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    io.observe(section)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function paint(first: boolean) {
    const from = paintedOnceRef.current
      ? {
          spec: parseInt(specRef.current?.textContent ?? '0', 10) || 0,
          off: parseInt(offRef.current?.textContent ?? '0', 10) || 0,
          win: parseInt(winRef.current?.textContent ?? '0', 10) || 0,
        }
      : { spec: 0, off: 0, win: 0 }

    if (specRef.current) countUp(first ? 0 : from.spec, result.spec, 620, (v) => { if (specRef.current) specRef.current.textContent = v + '%' })
    if (offRef.current) countUp(first ? 0 : from.off, result.off, 620, (v) => { if (offRef.current) offRef.current.textContent = String(v) })
    if (winRef.current) countUp(first ? 0 : from.win, result.win, 620, (v) => { if (winRef.current) winRef.current.textContent = v + 'h' })

    rectRefs.current.forEach((rect) => {
      if (!rect) return
      rect.style.animation = 'none'
      // force reflow so the animation restarts
      void rect.getBoundingClientRect()
      rect.style.animation = 'pop .5s cubic-bezier(.16,1,.3,1)'
    })
    paintedOnceRef.current = true
  }

  useEffect(() => {
    if (paintedOnceRef.current) paint(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel])

  const select = (group: Group, i: number) => setSel((s) => ({ ...s, [group]: i }))

  const groups: Array<{ key: Group; label: string; options: string[]; mono?: boolean }> = [
    { key: 'sense', label: '01 — SENSE', options: SENSE.map((s) => s.n) },
    { key: 'logic', label: '02 — COMPUTE', options: LOGIC.map((s) => s.n), mono: true },
    { key: 'effector', label: '03 — CORRECT', options: EFFECTOR.map((s) => s.n) },
  ]

  return (
    <section id="lab" ref={sectionRef} className="relative z-[3] overflow-hidden border-t border-white/7 bg-base px-[clamp(20px,4vw,56px)] py-[clamp(90px,13vw,180px)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'radial-gradient(rgba(110,243,192,.11) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(80% 60% at 50% 40%, #000, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(80% 60% at 50% 40%, #000, transparent 75%)',
        }}
      />
      <div className="relative mx-auto max-w-[1600px]">
        <Reveal className="mb-[clamp(38px,5vw,64px)] flex flex-wrap items-end justify-between gap-[22px]">
          <div>
            <div className="mb-[22px] flex items-center gap-3.5 font-mono text-[10.5px] tracking-[.18em] text-muted">
              <span className="h-px w-[30px] bg-accent" />
              03 — CIRCUIT SANDBOX
            </div>
            <h2 className="m-0 max-w-[16ch] font-display text-[clamp(34px,5.4vw,86px)] leading-[1.04] font-normal tracking-[-0.032em]">
              Build one yourself
            </h2>
          </div>
          <p className="m-0 max-w-[40ch] text-[14.5px] leading-[1.66] text-text-4" style={{ textWrap: 'pretty' }}>
            A stripped-down version of the design step our team runs. Pick a sensor, a gate and an effector — the
            model scores the construct live.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 items-stretch gap-[clamp(20px,2vw,30px)] min-[1000px]:grid-cols-[.85fr_1.15fr]">
          <div className="flex flex-col gap-[18px]">
            {groups.map((g) => (
              <div
                key={g.key}
                className="rounded-[3px] border border-white/9 p-[clamp(18px,1.8vw,26px)]"
                style={{ background: 'linear-gradient(160deg, rgba(255,255,255,.04), rgba(255,255,255,.008))' }}
              >
                <div className="mb-4 font-mono text-[10px] tracking-[.18em] text-muted">{g.label}</div>
                <div className="flex flex-wrap gap-2">
                  {g.options.map((opt, i) => {
                    const on = sel[g.key] === i
                    return (
                      <button
                        key={opt}
                        onClick={() => select(g.key, i)}
                        className={`cursor-pointer rounded-full border px-[15px] py-2.5 text-[12.5px] transition-[background,border-color,color,transform] duration-350 hover:-translate-y-0.5 ${g.mono ? 'px-[18px] font-mono text-xs tracking-[.1em]' : ''}`}
                        style={{
                          background: on ? 'var(--color-accent)' : 'transparent',
                          color: on ? 'var(--color-base)' : 'var(--color-text-2)',
                          borderColor: on ? 'var(--color-accent)' : 'rgba(255,255,255,.14)',
                        }}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col overflow-hidden rounded-[3px] border border-white/9 bg-surface">
            <div className="flex items-center justify-between border-b border-white/8 px-[clamp(18px,1.8vw,26px)] py-4 font-mono text-[10px] tracking-[.18em] text-muted">
              <span>CONSTRUCT PREVIEW</span>
              <span className="flex items-center gap-2" style={{ color: result.viable ? 'var(--color-accent)' : 'var(--color-warn)' }}>
                <span className="h-[5px] w-[5px] animate-[blip_2s_ease-in-out_infinite] rounded-full bg-current" />
                {result.viable ? 'VIABLE' : 'REJECTED'}
              </span>
            </div>

            <div className="flex-1 px-[clamp(18px,1.8vw,26px)] py-[clamp(20px,2.4vw,34px)]">
              <svg viewBox="0 0 620 150" className="block w-full h-auto overflow-visible">
                <path d="M120 75 H250" stroke="#6EF3C0" strokeWidth="1" opacity=".35" fill="none" />
                <path
                  d="M120 75 H250"
                  stroke="#6EF3C0"
                  strokeWidth="1.6"
                  fill="none"
                  strokeDasharray="14 226"
                  style={{ animation: 'dash 2.6s linear infinite' }}
                />
                <path d="M370 75 H500" stroke="#6EF3C0" strokeWidth="1" opacity=".35" fill="none" />
                <path
                  d="M370 75 H500"
                  stroke="#6EF3C0"
                  strokeWidth="1.6"
                  fill="none"
                  strokeDasharray="14 226"
                  style={{ animation: 'dash 2.6s linear infinite .5s' }}
                />

                <g>
                  <rect ref={(el) => { rectRefs.current[0] = el }} x="6" y="36" width="114" height="78" rx="2" fill="rgba(110,243,192,.06)" stroke="rgba(110,243,192,.4)" />
                  <text x="20" y="62" fill="#5E7C74" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="1.6">SENSE</text>
                  <text x="20" y="86" fill="#E6EFEA" fontFamily="Space Grotesk, sans-serif" fontSize="13">{SENSE[sel.sense].n}</text>
                </g>
                <g>
                  <rect ref={(el) => { rectRefs.current[1] = el }} x="250" y="30" width="120" height="90" rx="2" fill="rgba(110,243,192,.06)" stroke="rgba(110,243,192,.4)" />
                  <text x="266" y="58" fill="#5E7C74" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="1.6">GATE</text>
                  <text x="266" y="92" fill="#6EF3C0" fontFamily="Instrument Serif, serif" fontSize="30">{LOGIC[sel.logic].n}</text>
                </g>
                <g>
                  <rect ref={(el) => { rectRefs.current[2] = el }} x="500" y="36" width="114" height="78" rx="2" fill="rgba(110,243,192,.06)" stroke="rgba(110,243,192,.4)" />
                  <text x="514" y="62" fill="#5E7C74" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="1.6">EFFECT</text>
                  <text x="514" y="86" fill="#E6EFEA" fontFamily="Space Grotesk, sans-serif" fontSize="13">{EFFECTOR[sel.effector].n}</text>
                </g>
              </svg>
            </div>

            <div className="grid grid-cols-3 border-t border-white/8">
              <div className="border-r border-white/8 px-[clamp(16px,1.6vw,24px)] py-[clamp(18px,2vw,26px)]">
                <div ref={specRef} className="font-display text-[clamp(26px,2.8vw,42px)] leading-none tracking-[-0.03em]">0%</div>
                <div className="mt-2.5 font-mono text-[9.5px] tracking-[.16em] text-muted">ON-TARGET</div>
                <div className="mt-3.5 h-px bg-white/12">
                  <div className="h-px bg-accent transition-[width] duration-800" style={{ width: `${result.specBar}%`, transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }} />
                </div>
              </div>
              <div className="border-r border-white/8 px-[clamp(16px,1.6vw,24px)] py-[clamp(18px,2vw,26px)]">
                <div ref={offRef} className="font-display text-[clamp(26px,2.8vw,42px)] leading-none tracking-[-0.03em]">0</div>
                <div className="mt-2.5 font-mono text-[9.5px] tracking-[.16em] text-muted">OFF-TARGET / 10⁶</div>
                <div className="mt-3.5 h-px bg-white/12">
                  <div className="h-px bg-accent transition-[width] duration-800" style={{ width: `${result.offBar}%`, transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }} />
                </div>
              </div>
              <div className="px-[clamp(16px,1.6vw,24px)] py-[clamp(18px,2vw,26px)]">
                <div ref={winRef} className="font-display text-[clamp(26px,2.8vw,42px)] leading-none tracking-[-0.03em]">0h</div>
                <div className="mt-2.5 font-mono text-[9.5px] tracking-[.16em] text-muted">ACTIVE WINDOW</div>
                <div className="mt-3.5 h-px bg-white/12">
                  <div className="h-px bg-accent transition-[width] duration-800" style={{ width: `${result.winBar}%`, transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }} />
                </div>
              </div>
            </div>

            <div className="min-h-[62px] border-t border-white/8 px-[clamp(18px,1.8vw,26px)] py-4 text-[13px] leading-[1.6] text-text-4">
              {result.note}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
