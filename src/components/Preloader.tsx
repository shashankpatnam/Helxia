import { useEffect, useRef, useState } from 'react'

export function Preloader() {
  const [pct, setPct] = useState(0)
  const [hidden, setHidden] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    const t = setInterval(() => {
      setPct((p) => {
        if (doneRef.current) return p
        const next = Math.min(100, p + 6 + Math.random() * 16)
        if (next >= 100) {
          doneRef.current = true
          clearInterval(t)
          setTimeout(() => setHidden(true), 260)
        }
        return next
      })
    }, 110)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-[22px] bg-base transition-[opacity,visibility] duration-[800ms] ease-out"
      style={{ opacity: hidden ? 0 : 1, visibility: hidden ? 'hidden' : 'visible' }}
    >
      <div className="font-display text-[clamp(30px,6vw,52px)] tracking-[-0.02em] text-text">
        helixa<span className="text-accent">.</span>
      </div>
      <div className="h-px w-[min(240px,55vw)] overflow-hidden bg-white/14">
        <div
          className="h-full bg-accent transition-[width] duration-300 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="font-mono text-[11px] tracking-[.18em] text-muted">
        SEQUENCING {String(Math.round(pct)).padStart(3, '0')}
      </div>
    </div>
  )
}
