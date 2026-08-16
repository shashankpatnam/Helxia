import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = 0, my = 0, rx = 0, ry = 0, on = false, raf = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`
      if (!on) {
        on = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
        rx = mx
        ry = my
      }
    }
    window.addEventListener('mousemove', onMove)

    const loop = () => {
      rx += (mx - rx) * 0.16
      ry += (my - ry) * 0.16
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`
      raf = requestAnimationFrame(loop)
    }
    loop()

    const interactive = Array.from(
      document.querySelectorAll('a, button, [data-row], [data-step], input')
    )
    const onEnter = () => {
      ring.style.width = '64px'
      ring.style.height = '64px'
      ring.style.background = 'rgba(110,243,192,.1)'
    }
    const onLeave = () => {
      ring.style.width = '40px'
      ring.style.height = '40px'
      ring.style.background = 'transparent'
    }
    interactive.forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    let magnetCleanups: Array<() => void> = []
    if (!reduced) {
      const magnets = Array.from(document.querySelectorAll<HTMLElement>('[data-magnet]'))
      magnets.forEach((el) => {
        el.style.transition =
          'transform .5s cubic-bezier(.16,1,.3,1), color .3s ease, background .4s ease, border-color .4s ease, box-shadow .4s ease'
        const onMagMove = (e: MouseEvent) => {
          const b = el.getBoundingClientRect()
          el.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * 0.28}px,${(e.clientY - b.top - b.height / 2) * 0.34}px)`
        }
        const onMagLeave = () => {
          el.style.transform = 'translate(0,0)'
        }
        el.addEventListener('mousemove', onMagMove)
        el.addEventListener('mouseleave', onMagLeave)
        magnetCleanups.push(() => {
          el.removeEventListener('mousemove', onMagMove)
          el.removeEventListener('mouseleave', onMagLeave)
        })
      })

      const tilts = Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'))
      tilts.forEach((el) => {
        const onTiltMove = (e: MouseEvent) => {
          const b = el.getBoundingClientRect()
          const px = (e.clientX - b.left) / b.width - 0.5
          const py = (e.clientY - b.top) / b.height - 0.5
          el.style.transform = `perspective(900px) rotateX(${-py * 5}deg) rotateY(${px * 5}deg) translateY(-4px)`
          el.style.borderColor = 'rgba(110,243,192,.32)'
        }
        const onTiltLeave = () => {
          el.style.transform = 'none'
          el.style.borderColor = 'rgba(255,255,255,.09)'
        }
        el.addEventListener('mousemove', onTiltMove)
        el.addEventListener('mouseleave', onTiltLeave)
        magnetCleanups.push(() => {
          el.removeEventListener('mousemove', onTiltMove)
          el.removeEventListener('mouseleave', onTiltLeave)
        })
      })
    }

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      interactive.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
      magnetCleanups.forEach((f) => f())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[200] h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-0"
        style={{ mixBlendMode: 'screen' }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[199] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/55 opacity-0 transition-[width,height,background,border-color] duration-350"
        style={{ transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }}
      />
    </>
  )
}
