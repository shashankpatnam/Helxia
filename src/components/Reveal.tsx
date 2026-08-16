import { useEffect, useRef, useState } from 'react'
import type { ElementType, ReactNode } from 'react'

interface RevealProps {
  as?: ElementType
  className?: string
  delayMs?: number
  translateY?: number
  durationMs?: number
  children: ReactNode
  style?: React.CSSProperties
  [key: `data-${string}`]: unknown
}

/** IntersectionObserver reveal, fires once. Mirrors the prototype's `[data-reveal]` behavior. */
export function Reveal({ as: Tag = 'div', className = '', delayMs = 0, translateY = 24, durationMs = 1000, children, style, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          setShown(true)
          io.unobserve(el)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={className}
      {...rest}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${translateY}px)`,
        transition: `opacity ${durationMs}ms cubic-bezier(.16,1,.3,1) ${delayMs}ms, transform ${durationMs}ms cubic-bezier(.16,1,.3,1) ${delayMs}ms`,
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}
