const TERMS = [
  'CRISPR-CAS12 BASE EDITING',
  'SYNTHETIC PROMOTERS',
  'LIPID NANOPARTICLE DELIVERY',
  'SINGLE-CELL ATLAS',
  'AUTOIMMUNE · ONCOLOGY · RARE DISEASE',
]

function Row({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden}
      className="flex items-center gap-11 pr-11 font-mono text-[11.5px] tracking-[.18em] whitespace-nowrap text-text-4"
    >
      {TERMS.map((t) => (
        <span key={t} className="flex items-center gap-11">
          <span>{t}</span>
          <span className="text-accent">✳</span>
        </span>
      ))}
    </div>
  )
}

export function Marquee() {
  return (
    <div className="relative z-[3] overflow-hidden border-t border-b border-white/8 bg-surface py-4">
      <div className="flex w-max animate-[mq_34s_linear_infinite] will-change-transform">
        <Row />
        <Row ariaHidden />
      </div>
    </div>
  )
}
