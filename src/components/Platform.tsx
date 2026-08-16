import { useEffect, useRef, useState } from 'react'
import { Reveal } from './Reveal'
import { scrollEngine } from '../lib/scrollEngine'

const STEPS = [
  {
    idx: '01',
    title: 'Design in silico',
    body: 'A generative model proposes 40,000 promoter–effector pairs and ranks them against our single-cell atlas of 12M annotated cells.',
    cap: 'DESIGN — IN SILICO',
    img: 'Sequencing',
    src: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1400&q=70',
  },
  {
    idx: '02',
    title: 'Build & assay',
    body: 'Robotic cell factories synthesise the top 500 circuits and run them through pooled functional screens in patient-derived organoids.',
    cap: 'BUILD — WET LAB',
    img: 'Assay',
    src: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1400&q=70',
  },
  {
    idx: '03',
    title: 'Learn & iterate',
    body: 'Every screen returns to the model. Prediction accuracy has climbed from 34% to 91% across nine cycles — and keeps climbing.',
    cap: 'LEARN — MODEL UPDATE',
    img: 'Microscopy',
    src: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?auto=format&fit=crop&w=1400&q=70',
  },
]

export function Platform() {
  const [active, setActive] = useState(0)
  const stepRefs = useRef<Array<HTMLDivElement | null>>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => scrollEngine.subscribe(() => {
    if (window.innerWidth < 1000) return
    const section = sectionRef.current
    if (!section) return
    const sec = section.getBoundingClientRect()
    if (!(sec.top < window.innerHeight * 0.6 && sec.bottom > 0)) return
    const mid = window.innerHeight * 0.5
    let best = 0
    let bd = Infinity
    stepRefs.current.forEach((el, i) => {
      if (!el) return
      const b = el.getBoundingClientRect()
      const d = Math.abs(b.top + b.height / 2 - mid)
      if (d < bd) {
        bd = d
        best = i
      }
    })
    setActive(best)
  }), [])

  return (
    <section id="platform" ref={sectionRef} className="relative z-[3] bg-base px-[clamp(20px,4vw,56px)] py-[clamp(90px,13vw,180px)]">
      <div className="mx-auto max-w-[1600px]">
        <Reveal className="flex items-center gap-3.5 font-mono text-[10.5px] tracking-[.18em] text-muted">
          <span className="h-px w-[30px] bg-accent" />
          02 — THE PLATFORM
        </Reveal>
        <Reveal
          as="h2"
          delayMs={80}
          translateY={28}
          className="m-0 my-[clamp(24px,3vw,40px)] mb-[clamp(48px,7vw,96px)] max-w-[15ch] font-display text-[clamp(34px,5.4vw,92px)] leading-[1.04] font-normal tracking-[-0.032em]"
        >
          CIRCUIT<span className="text-accent">/</span>OS — from hypothesis to candidate in 9 weeks
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-[clamp(34px,5vw,72px)] min-[1000px]:grid-cols-2">
          <div className="relative overflow-hidden rounded-[3px] border border-white/9 bg-surface min-[1000px]:sticky min-[1000px]:top-[116px]" style={{ aspectRatio: '16 / 11' }}>
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className="absolute inset-0 transition-[opacity,transform] duration-1000"
                style={{
                  transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)',
                  transitionDuration: '1s, 1.6s',
                  opacity: active === i ? 1 : 0,
                  transform: active === i ? 'scale(1.04)' : 'scale(1.12)',
                }}
              >
                <img
                  src={s.src}
                  alt={s.img}
                  className="h-full w-full object-cover"
                  style={{ filter: 'grayscale(.55) brightness(.7) contrast(1.1)' }}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(5,7,10,.15), rgba(5,7,10,.8))' }}
            />
            <div className="pointer-events-none absolute right-5 bottom-[18px] left-5 flex items-end justify-between font-mono text-[10.5px] tracking-[.16em] text-text-3">
              <span>{STEPS[active].cap}</span>
              <span className="text-accent">0{active + 1}/03</span>
            </div>
            <div className="pointer-events-none absolute top-[18px] right-5 h-[26px] w-[26px] animate-[spin_3.4s_linear_infinite] rounded-full border border-t-transparent border-accent/50" />
          </div>

          <div className="flex flex-col gap-0.5">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                ref={(el) => { stepRefs.current[i] = el }}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`cursor-pointer border-t border-white/10 py-[clamp(22px,2.6vw,34px)] transition-opacity duration-500 ${i === STEPS.length - 1 ? 'border-b' : ''}`}
                style={{ opacity: active === i ? 1 : 0.42 }}
              >
                <div className="flex items-baseline gap-[18px]">
                  <span className="font-mono text-[10.5px] tracking-[.16em] text-accent">{s.idx}</span>
                  <h3 className="m-0 font-display text-[clamp(24px,2.6vw,42px)] font-normal tracking-[-0.025em]">{s.title}</h3>
                </div>
                <p className="m-0 mt-3.5 ml-0 max-w-[46ch] text-[14.5px] leading-[1.66] text-text-4 min-[1000px]:ml-[clamp(0px,2.4vw,38px)]" style={{ textWrap: 'pretty' }}>
                  {s.body}
                </p>
                <div
                  className="mt-[22px] h-px bg-accent transition-[width] duration-400"
                  style={{ width: active === i ? '100%' : '0%' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
