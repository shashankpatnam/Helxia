/**
 * Imperative rAF count-up, cubic ease-out. Mirrors the prototype's `count`/`num` helpers.
 * Each `run()` call drives its own independent rAF chain, so concurrent counters
 * (e.g. three hero stats animating at once) don't cancel one another.
 */
export function useCountUp() {
  function run(from: number, to: number, duration: number, onTick: (v: number) => void) {
    const t0 = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      const e = 1 - Math.pow(1 - p, 3)
      onTick(Math.round(from + (to - from) * e))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  return run
}
