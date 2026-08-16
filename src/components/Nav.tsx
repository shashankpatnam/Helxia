import { useEffect, useRef, useState } from 'react'
import { scrollEngine } from '../lib/scrollEngine'

const LINKS = [
  { href: '#science', label: 'Science' },
  { href: '#platform', label: 'Platform' },
  { href: '#lab', label: 'Sandbox' },
  { href: '#pipeline', label: 'Pipeline' },
  { href: '#evidence', label: 'Evidence' },
]

export function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => scrollEngine.subscribe((s) => setSolid(s.navSolid)), [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[120] border-b transition-[background,border-color,backdrop-filter,padding] duration-550 ease-out"
        style={{
          background: solid ? 'rgba(5,7,10,.72)' : 'transparent',
          backdropFilter: solid ? 'blur(18px)' : 'none',
          borderBottomColor: solid ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,0)',
        }}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-7 px-[clamp(20px,4vw,56px)] py-[clamp(16px,2.2vw,28px)]">
          <a href="#top" data-magnet className="flex flex-shrink-0 items-center gap-2.5">
            <span className="relative inline-block h-5 w-5">
              <span className="absolute inset-0 animate-[breathe_3.6s_ease-in-out_infinite] rounded-full border border-accent" />
              <span className="absolute inset-[6px] rounded-full bg-accent" />
            </span>
            <span className="font-display text-[25px] leading-none tracking-[-0.02em]">helixa</span>
          </a>

          <nav className="hidden items-center gap-[clamp(18px,2.4vw,38px)] text-[13.5px] font-medium text-text-3 min-[900px]:flex">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} data-magnet className="relative py-1.5">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3.5">
            <a
              href="#contact"
              data-magnet
              data-cta
              className="hidden items-center gap-2.5 rounded-full border px-5 py-[11px] text-[13px] font-medium text-accent transition-[background,border-color,color] duration-400 min-[1040px]:flex hover:bg-accent hover:text-base hover:border-accent"
              style={{ borderColor: 'rgba(110,243,192,.42)', background: 'rgba(110,243,192,.06)' }}
            >
              <span>Partner with us</span>
              <span className="h-[5px] w-[5px] animate-[blip_2s_ease-in-out_infinite] rounded-full bg-current" />
            </a>
            <button
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-[42px] w-[42px] flex-col items-center justify-center gap-[5px] rounded-full border border-white/14 bg-transparent p-0 min-[900px]:hidden"
            >
              <span
                className="block h-[1.5px] w-[15px] bg-text transition-transform duration-400"
                style={{ transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)', transform: open ? 'translateY(3.2px) rotate(45deg)' : 'none' }}
              />
              <span
                className="block h-[1.5px] w-[15px] bg-text transition-transform duration-400"
                style={{ transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)', transform: open ? 'translateY(-3.2px) rotate(-45deg)' : 'none' }}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        className="fixed inset-0 z-[110] flex flex-col justify-center gap-2 bg-surface px-[clamp(24px,7vw,72px)] transition-[opacity,visibility] duration-500"
        style={{ opacity: open ? 1 : 0, visibility: open ? 'visible' : 'hidden' }}
      >
        {LINKS.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="border-b border-white/8 py-3.5 font-display text-[clamp(38px,11vw,74px)] leading-[1.12] transition-[opacity,transform,color] duration-600"
            style={{
              transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)',
              transitionDelay: `${0.08 + i * 0.06}s`,
              opacity: open ? 1 : 0,
              transform: open ? 'none' : 'translateY(24px)',
            }}
          >
            {l.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className="py-3.5 font-display text-[clamp(38px,11vw,74px)] leading-[1.12] text-accent transition-[opacity,transform] duration-600"
          style={{
            transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)',
            transitionDelay: `${0.08 + LINKS.length * 0.06}s`,
            opacity: open ? 1 : 0,
            transform: open ? 'none' : 'translateY(24px)',
          }}
        >
          Contact
        </a>
      </div>
    </>
  )
}
