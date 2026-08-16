import { useRef, useState } from 'react'
import { Reveal } from './Reveal'

const ROWS = [
  { code: 'HLX-201', title: 'Refractory lupus nephritis', phase: 'PHASE II', body: 'An IL-2 responsive circuit that silences autoreactive B cells in renal tissue only. 62-patient readout expected H1 2027; interim data showed a 71% reduction in proteinuria at 24 weeks.' },
  { code: 'HLX-118', title: 'Glioblastoma, recurrent', phase: 'PHASE I', body: 'A hypoxia-gated payload that stays inert in healthy brain and activates inside the tumour core. First-in-human dosing began March 2026 across four sites.' },
  { code: 'HLX-044', title: 'Duchenne muscular dystrophy', phase: 'IND-ENABLING', body: 'Muscle-tropic LNPs carrying a single-base correction for exon 51 mutations. Non-human primate durability now exceeds 14 months on one dose.' },
  { code: 'HLX-009', title: 'Type 1 diabetes, early onset', phase: 'DISCOVERY', body: 'Restoring beta-cell tolerance by rewriting the antigen-presentation program in pancreatic lymph nodes. Candidate selection expected late 2026.' },
]

function Row({ row, isLast }: { row: (typeof ROWS)[number]; isLast: boolean }) {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  return (
    <div
      data-row
      onClick={() => setOpen((v) => !v)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative cursor-pointer border-t border-white/10 transition-colors duration-500 ${isLast ? 'border-b' : ''}`}
      style={{ background: hover ? 'rgba(255,255,255,.025)' : 'transparent' }}
    >
      <div className="grid grid-cols-[1fr_auto] items-center gap-4 px-0 py-[clamp(20px,2.4vw,30px)] min-[1000px]:px-[clamp(0px,1.4vw,20px)]">
        <div className="flex flex-wrap items-baseline gap-x-[22px] gap-y-2">
          <span className="min-w-[82px] font-mono text-[11px] tracking-[.12em] text-accent">{row.code}</span>
          <span
            className="inline-block font-display text-[clamp(21px,2.2vw,35px)] tracking-[-0.02em] transition-[transform,color] duration-500"
            style={{
              transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)',
              transform: hover ? 'translateX(10px)' : 'none',
              color: hover ? 'var(--color-accent)' : undefined,
            }}
          >
            {row.title}
          </span>
        </div>
        <div className="flex items-center gap-[clamp(14px,2vw,32px)]">
          <span className="font-mono text-[10.5px] tracking-[.14em] whitespace-nowrap text-text-4">{row.phase}</span>
          <span
            className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full border text-[15px] text-accent transition-[transform,background,border-color] duration-500"
            style={{
              transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)',
              transform: open ? 'rotate(135deg)' : 'none',
              background: open ? 'rgba(110,243,192,.14)' : 'transparent',
              borderColor: open ? 'rgba(110,243,192,.5)' : 'rgba(255,255,255,.16)',
            }}
          >
            +
          </span>
        </div>
      </div>
      <div
        ref={bodyRef}
        className="overflow-hidden transition-[max-height] duration-700"
        style={{ transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)', maxHeight: open ? (bodyRef.current?.scrollHeight ?? 400) + 40 : 0 }}
      >
        <p className="m-0 mb-[clamp(20px,2.4vw,30px)] max-w-[62ch] px-0 text-[14.5px] leading-[1.68] text-text-4 min-[1000px]:px-[clamp(0px,1.4vw,20px)]" style={{ textWrap: 'pretty' }}>
          {row.body}
        </p>
      </div>
    </div>
  )
}

export function Pipeline() {
  return (
    <section id="pipeline" className="relative z-[3] border-t border-white/7 bg-surface px-[clamp(20px,4vw,56px)] py-[clamp(90px,13vw,180px)]">
      <div className="mx-auto max-w-[1600px]">
        <Reveal className="mb-[clamp(40px,5vw,70px)] flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-[22px] flex items-center gap-3.5 font-mono text-[10.5px] tracking-[.18em] text-muted">
              <span className="h-px w-[30px] bg-accent" />
              04 — PIPELINE
            </div>
            <h2 className="m-0 font-display text-[clamp(34px,5.4vw,86px)] leading-[1.04] font-normal tracking-[-0.032em]">
              Fourteen programs, three in clinic
            </h2>
          </div>
          <div className="font-mono text-[10.5px] tracking-[.16em] text-muted">UPDATED Q3 2026</div>
        </Reveal>

        <div>
          {ROWS.map((row, i) => (
            <Row key={row.code} row={row} isLast={i === ROWS.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
