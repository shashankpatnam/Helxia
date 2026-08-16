export interface LabOption {
  n: string
  spec: number
  off: number
  win: number
  note?: string
}

export const SENSE: LabOption[] = [
  { n: 'IL-2 receptor', spec: 84, off: 16, win: 36 },
  { n: 'Hypoxia · HIF-1α', spec: 76, off: 24, win: 54 },
  { n: 'Tissue promoter', spec: 92, off: 7, win: 72 },
  { n: 'miR-122 signature', spec: 88, off: 11, win: 28 },
]

export const LOGIC: LabOption[] = [
  { n: 'AND', spec: 7, off: -6, win: -6, note: 'fires only where both inputs overlap — the tightest control we ship, at the cost of a narrower window.' },
  { n: 'OR', spec: -9, off: 12, win: 14, note: 'catches heterogeneous disease states, but tolerates far more off-tissue firing.' },
  { n: 'NOT', spec: 3, off: -2, win: 4, note: 'inverts the sensor: active everywhere the healthy signature is absent.' },
  { n: 'NAND', spec: 5, off: -4, win: 2, note: 'a fail-safe gate — silent unless both guard signals drop away.' },
]

export const EFFECTOR: LabOption[] = [
  { n: 'Base editor', spec: 3, off: -3, win: -10, note: 'A single permanent base correction; the circuit then degrades.' },
  { n: 'CRISPRi silencer', spec: 1, off: 0, win: 8, note: 'Reversible knock-down — dosing can be stopped at any point.' },
  { n: 'Cytokine payload', spec: -7, off: 9, win: 20, note: 'Potent and fast, but bystander exposure rises sharply.' },
  { n: 'Transcription factor', spec: 0, off: 2, win: 6, note: 'Rewrites cell state without touching the genome.' },
]

export interface LabResult {
  spec: number
  off: number
  win: number
  specBar: number
  offBar: number
  winBar: number
  verdict: string
  viable: boolean
  note: string
}

export function computeLab(senseI: number, logicI: number, effectorI: number): LabResult {
  const s = SENSE[senseI]
  const l = LOGIC[logicI]
  const e = EFFECTOR[effectorI]
  const spec = Math.max(38, Math.min(99, s.spec + l.spec + e.spec))
  const off = Math.max(1, s.off + l.off + e.off)
  const win = Math.max(6, s.win + l.win + e.win)
  const viable = spec >= 78
  const verdict = spec >= 90 ? 'Clinic-grade selectivity.' : spec >= 78 ? 'Workable — we would run this in organoids.' : 'Too leaky to advance.'
  const note = `Sensor: ${s.n}. Gate: ${l.n}. Effector: ${e.n}. The ${l.n} gate ${l.note} ${e.note} ${verdict}`
  return {
    spec,
    off,
    win,
    specBar: spec,
    offBar: Math.min(100, off * 2.6),
    winBar: Math.min(100, win * 0.9),
    verdict,
    viable,
    note,
  }
}
