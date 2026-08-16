import { useEffect, useRef } from 'react'
import { Reveal } from './Reveal'
import { scrollEngine } from '../lib/scrollEngine'

const THESIS = 'Most medicines shout at the whole body. Ours whisper to a single cell, and only when it asks.'

const CARDS = [
  { n: '01', title: 'Sense', body: 'Synthetic receptors read transcriptional signatures that mark a diseased cell, not a healthy neighbour.' },
  { n: '02', title: 'Compute', body: 'A logic gate weighs four inputs before firing — the same AND/NOT rules that make silicon reliable.' },
  { n: '03', title: 'Correct', body: 'A single base edit restores the protein — then the circuit degrades, leaving no permanent payload.' },
]

export function Thesis() {
  const pRef = useRef<HTMLParagraphElement>(null)
  const wordRefs = useRef<HTMLSpanElement[]>([])
  const words = THESIS.split(/\s+/)

  useEffect(() => scrollEngine.subscribe(() => {
    const el = pRef.current
    if (!el) return
    const b = el.getBoundingClientRect()
    const p = Math.max(0, Math.min(1, (window.innerHeight * 0.86 - b.top) / (b.height + window.innerHeight * 0.28)))
    const n = wordRefs.current.length
    wordRefs.current.forEach((span, i) => {
      span.style.color = i / n < p * 1.05 ? 'var(--color-text)' : 'var(--color-dim)'
    })
  }), [])

  return (
    <section id="science" className="relative z-[3] bg-base px-[clamp(20px,4vw,56px)] py-[clamp(90px,13vw,190px)]">
      <div className="mx-auto max-w-[1600px]">
        <Reveal className="mb-[clamp(30px,4vw,54px)] flex items-center gap-3.5 font-mono text-[10.5px] tracking-[.18em] text-muted">
          <span className="h-px w-[30px] bg-accent" />
          01 — THE THESIS
        </Reveal>

        <p
          ref={pRef}
          className="m-0 max-w-[22ch] font-display text-[clamp(27px,4.1vw,68px)] leading-[1.18] tracking-[-0.025em]"
          style={{ textWrap: 'pretty' }}
        >
          {words.map((w, i) => (
            <span
              key={i}
              ref={(el) => { if (el) wordRefs.current[i] = el }}
              className="inline-block transition-colors duration-500 ease-in-out"
              style={{ color: 'var(--color-dim)' }}
            >
              {w}{' '}
            </span>
          ))}
        </p>

        <div className="mt-[clamp(56px,8vw,110px)] grid grid-cols-1 gap-[clamp(20px,2vw,30px)]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))' }}>
          {CARDS.map((c, i) => (
            <Reveal
              key={c.title}
              as="div"
              delayMs={i * 100}
              translateY={28}
              data-tilt
              className="relative overflow-hidden rounded-[3px] border border-white/9 p-[clamp(26px,2.6vw,40px)] transition-[border-color] duration-500"
              style={{ background: 'linear-gradient(160deg, rgba(255,255,255,.045), rgba(255,255,255,.008))' }}
            >
              <div className="mb-[26px] font-mono text-[10.5px] tracking-[.16em] text-accent">{c.n}</div>
              <h3 className="m-0 mb-3.5 font-display text-[clamp(22px,1.9vw,30px)] font-normal tracking-[-0.02em]">{c.title}</h3>
              <p className="m-0 text-[14.5px] leading-[1.66] text-text-4" style={{ textWrap: 'pretty' }}>{c.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
