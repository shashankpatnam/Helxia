import { useEffect, useRef } from 'react'
import { scrollEngine } from '../lib/scrollEngine'

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => scrollEngine.subscribe((s) => {
    if (ref.current) ref.current.style.width = `${s.progress}%`
  }), [])

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 z-[150] h-[2px] w-0 bg-accent"
      style={{ boxShadow: '0 0 20px rgba(110,243,192,.9)' }}
    />
  )
}
