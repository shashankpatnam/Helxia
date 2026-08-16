const COLUMNS = [
  { heading: 'COMPANY', links: [{ label: 'Science', href: '#science' }, { label: 'Platform', href: '#platform' }, { label: 'Pipeline', href: '#pipeline' }] },
  { heading: 'RESOURCES', links: [{ label: 'Publications', href: '#evidence' }, { label: 'Data releases', href: '#evidence' }, { label: 'Media kit', href: '#contact' }] },
  { heading: 'CONNECT', links: [{ label: 'careers@helixa.bio', href: '#contact' }, { label: 'LinkedIn', href: '#contact' }, { label: 'bioRxiv', href: '#contact' }] },
]

export function Footer() {
  return (
    <footer className="relative z-[3] bg-base px-[clamp(20px,4vw,56px)] pt-[clamp(50px,6vw,80px)] pb-[34px]">
      <div className="mx-auto max-w-[1600px]">
        <div
          className="grid gap-[clamp(30px,4vw,60px)] border-b border-white/8 pb-[clamp(40px,5vw,66px)]"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))' }}
        >
          <div>
            <div className="mb-4 font-display text-[30px] tracking-[-0.02em]">
              helixa<span className="text-accent">.</span>
            </div>
            <p className="m-0 max-w-[30ch] text-[13.5px] leading-[1.6]" style={{ color: '#6D8781' }}>
              Cambridge, MA · Basel, CH
              <br />
              Founded 2015
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3 text-[13.5px] text-text-4">
              <span className="mb-1.5 font-mono text-[10px] tracking-[.16em] text-muted-2">{col.heading}</span>
              {col.links.map((l) => (
                <a key={l.label} href={l.href}>{l.label}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-3.5 pt-[26px] font-mono text-[10px] tracking-[.14em] text-muted-2">
          <span>© 2026 HELIXA BIOSCIENCES</span>
          <span>FORWARD-LOOKING STATEMENTS APPLY</span>
        </div>
      </div>
    </footer>
  )
}
