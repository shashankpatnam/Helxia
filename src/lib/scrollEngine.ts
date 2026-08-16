export type ScrollListener = (state: ScrollState) => void

export interface ScrollState {
  scrollY: number
  progress: number
  navSolid: boolean
}

/**
 * Single shared rAF-coalesced scroll loop. Components subscribe instead of
 * attaching their own listeners, so the whole page drives off one tick —
 * mirrors the prototype's single `ticking` flag but keeps it out of React state.
 */
class ScrollEngine {
  private listeners = new Set<ScrollListener>()
  private ticking = false
  private started = false

  private computeState(): ScrollState {
    const y = window.scrollY
    const h = document.documentElement.scrollHeight - window.innerHeight
    return {
      scrollY: y,
      progress: h > 0 ? (y / h) * 100 : 0,
      navSolid: y > 40,
    }
  }

  private run = () => {
    const state = this.computeState()
    this.listeners.forEach((l) => l(state))
    this.ticking = false
  }

  private onScroll = () => {
    if (!this.ticking) {
      this.ticking = true
      requestAnimationFrame(this.run)
    }
  }

  start() {
    if (this.started) return
    this.started = true
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('scroll', this.onScroll, { passive: true, capture: true })
    window.addEventListener('resize', this.onScroll)
    this.onScroll()
  }

  subscribe(listener: ScrollListener) {
    this.listeners.add(listener)
    listener(this.computeState())
    return () => {
      this.listeners.delete(listener)
    }
  }
}

export const scrollEngine = new ScrollEngine()
