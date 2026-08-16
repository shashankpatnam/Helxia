import { useState, type FormEvent } from 'react'
import { Reveal } from './Reveal'

export function Contact() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section id="contact" className="relative z-[3] overflow-hidden border-t border-white/7 bg-surface px-[clamp(20px,4vw,56px)] py-[clamp(90px,14vw,200px)]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(70% 90% at 50% 110%, rgba(110,243,192,.16), transparent 65%)' }}
      />
      <div className="relative mx-auto max-w-[1100px] text-center">
        <Reveal translateY={20} durationMs={1000} className="mb-[30px] font-mono text-[10.5px] tracking-[.18em] text-muted">
          06 — PARTNER WITH US
        </Reveal>
        <Reveal
          as="h2"
          delayMs={100}
          durationMs={1100}
          translateY={30}
          className="m-0 mb-[clamp(34px,4vw,54px)] font-display text-[clamp(38px,7.2vw,118px)] leading-none font-normal tracking-[-0.035em]"
        >
          Let&apos;s build the <em className="text-accent italic">next</em> one together
        </Reveal>

        <form onSubmit={onSubmit} className="mx-auto flex max-w-[620px] flex-wrap justify-center gap-2.5">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@institute.org"
            className="min-w-0 flex-1 basis-[260px] rounded-full border border-white/12 bg-white/4.5 px-[22px] py-[17px] text-[14.5px] outline-none transition-[border-color,background] duration-400 focus:border-accent"
            style={{ background: 'rgba(255,255,255,.045)' }}
            onFocus={(e) => { e.currentTarget.style.background = 'rgba(110,243,192,.06)' }}
            onBlur={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.045)' }}
          />
         <button
          data-magnet
          type="submit"
          className="cursor-pointer rounded-full border border-accent/55 bg-[#10241f] px-[30px] py-[17px] text-[14.5px] font-bold text-accent transition-[transform,background,box-shadow] duration-400 hover:bg-[#15352d] hover:shadow-[0_0_40px_rgba(110,243,192,.28)]"
        >
          Start a conversation
        </button>
        </form>
        <div
          className="mt-[18px] h-5 font-mono text-[11px] tracking-[.14em] text-accent transition-opacity duration-500"
          style={{ opacity: submitted ? 1 : 0 }}
        >
          RECEIVED — WE REPLY WITHIN TWO DAYS
        </div>
      </div>
    </section>
  )
}
