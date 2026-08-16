import { Reveal } from './Reveal'

const PAPERS = [
  { title: 'Conditional base editing in primate liver', meta: 'NATURE · 2026' },
  { title: 'A 12M-cell atlas of autoimmune tissue', meta: 'CELL · 2025' },
  { title: 'Logic-gated circuits reduce off-tissue expression 400×', meta: 'SCIENCE · 2025' },
  { title: 'Reversible payloads without integration', meta: 'NEJM · 2024' },
]

export function Evidence() {
  return (
    <section id="evidence" className="relative z-[3] bg-base px-[clamp(20px,4vw,56px)] py-[clamp(90px,13vw,180px)]">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid items-center gap-[clamp(40px,6vw,90px)]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))' }}>
          <Reveal translateY={28}>
            <div className="mb-6 flex items-center gap-3.5 font-mono text-[10.5px] tracking-[.18em] text-muted">
              <span className="h-px w-[30px] bg-accent" />
              05 — EVIDENCE
            </div>
            <h2 className="m-0 mb-[26px] font-display text-[clamp(32px,4.4vw,72px)] leading-[1.06] font-normal tracking-[-0.03em]">
              Peer-reviewed, not press-released
            </h2>
            <p className="m-0 mb-9 max-w-[46ch] text-[15px] leading-[1.68] text-text-4" style={{ textWrap: 'pretty' }}>
              Every claim on this page traces to a published dataset. We release raw screen data with each paper.
            </p>
            <a href="#contact" data-magnet className="inline-flex items-center gap-3 border-b border-accent/40 pb-2 font-mono text-[11px] tracking-[.16em] text-accent">
              BROWSE PUBLICATIONS →
            </a>
          </Reveal>

          <div className="flex flex-col gap-px">
            {PAPERS.map((p, i) => (
              <Reveal
                key={p.title}
                delayMs={i * 60}
                translateY={20}
                durationMs={900}
                className={`flex items-baseline justify-between gap-5 border-t border-white/10 py-[clamp(18px,2vw,26px)] ${i === PAPERS.length - 1 ? 'border-b' : ''}`}
              >
                <span className="max-w-[30ch] text-[15px] text-text-2">{p.title}</span>
                <span className="font-mono text-[10.5px] tracking-[.14em] whitespace-nowrap text-muted">{p.meta}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
