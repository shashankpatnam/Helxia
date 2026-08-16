import { useEffect, useRef } from 'react'
import { Reveal } from './Reveal'
import { scrollEngine } from '../lib/scrollEngine'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function ParallaxQuote() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    return scrollEngine.subscribe(() => {
      const wrap = wrapRef.current
      const layer = layerRef.current
      if (!wrap || !layer) return
      const b = wrap.getBoundingClientRect()
      if (b.bottom < -200 || b.top > window.innerHeight + 200) return
      const offset = (b.top + b.height / 2 - window.innerHeight / 2) * -0.11
      layer.style.transform = `translate3d(0,${offset}px,0)`
    })
  }, [reduced])

  return (
    <section ref={wrapRef} className="relative z-[3] overflow-hidden" style={{ height: '72vh', minHeight: 380 }}>
      <div ref={layerRef} className="absolute left-0 w-full will-change-transform" style={{ top: '-14%', height: '128%' }}>
        <img
          src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=2000&q=70"
          alt="Research laboratory"
          className="h-full w-full object-cover"
          style={{ filter: 'grayscale(1) contrast(1.12) brightness(.62)' }}
          loading="lazy"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,7,10,.92), rgba(5,7,10,.42) 45%, rgba(5,7,10,.95)), radial-gradient(60% 60% at 50% 50%, rgba(110,243,192,.16), transparent 70%)',
        }}
      />
      <div className="relative flex h-full items-center justify-center px-[clamp(20px,4vw,56px)]">
        <Reveal
          as="p"
          durationMs={1200}
          translateY={30}
          className="m-0 max-w-[20ch] text-center font-display text-[clamp(28px,4.6vw,76px)] leading-[1.12] tracking-[-0.03em]"
        >
          Eleven years of wet lab, compressed into <em className="text-accent italic">one</em> platform.
        </Reveal>
      </div>
    </section>
  )
}
