# Helixa — animation-driven biotech landing page

React implementation of the Helixa design prototype (`../Helixa Biotech Landing.dc.html`, spec in `../README.md`).

Two load-bearing pieces:

1. **Scroll-scrubbed WebGL scale flythrough** in the hero — one continuous camera dolly from organism → organ → tissue → cell → gene circuit, with captions and a scale ruler that track the descent.
2. **Interactive circuit sandbox** — pick a sensor, logic gate and effector; a live model scores the construct.

Everything else (thesis, platform stepper, pipeline, evidence, contact, footer) is scroll-reveal editorial layout in service of those two moments.

## Stack

| Concern | Choice |
| --- | --- |
| Build | Vite 8 + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`), design tokens in `@theme` |
| 3D | `three` (ESM, tree-shaken) |
| Fonts | `@fontsource` — self-hosted Instrument Serif / Space Grotesk / JetBrains Mono |
| Scroll | one shared rAF loop (`src/lib/scrollEngine.ts`) — no GSAP, no Lenis |
| Lint | oxlint |

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview
npm run lint
```

## Layout

```
src/
  components/       one file per section (see table below)
  hooks/
    useCountUp.ts       rAF count-up, cubic ease-out
    useReducedMotion.ts prefers-reduced-motion matcher
  lib/
    flightScene.ts      the five-shell three.js flythrough
    labModel.ts         circuit sandbox data + scoring
    scrollEngine.ts     single rAF-coalesced scroll loop
  index.css         tokens, keyframes, resets
```

| Component | Responsibility |
| --- | --- |
| `Preloader` | "SEQUENCING 000–100" counter, self-dismisses |
| `Nav` | Fixed header, blur-on-scroll, mobile overlay menu |
| `ScrollProgress` | 2px accent bar, fixed top |
| `Cursor` | Dot + lagging ring, magnetic and tilt handlers; disabled on `(hover: none)` |
| `HeroFlight` | 460svh sticky WebGL section |
| `Marquee` | Infinite ticker strip |
| `Thesis` | Word-by-word scroll-scrubbed paragraph + 3 tilt cards |
| `ParallaxQuote` | Full-bleed image band with parallax |
| `Platform` | Sticky image panel + 3-step scroll-driven list |
| `CircuitLab` | The interactive sandbox |
| `Pipeline` | 4 expanding accordion rows |
| `Evidence` | Two-column publication list |
| `Contact` | Email capture, fake success state |
| `Footer` | 4-column links |
| `Reveal` | Shared IntersectionObserver reveal wrapper |

## The scroll engine

`scrollEngine` is a module-level singleton started once in `App`. Components `subscribe()` instead of attaching their own listeners, so the whole page renders off one `requestAnimationFrame` behind a single `ticking` flag. Scroll-derived values (flight progress, parallax offset, thesis word scrub, stepper index) are written straight to the DOM and deliberately kept **out of React state** — they change every frame.

It listens on `window` both bubbling and capturing, matching the prototype; the capture pass is harmless in a normal app and covers hosts where the scroller is not `window`.

If GSAP ScrollTrigger or Lenis is introduced later, drive everything from that instead — do not run two scroll systems side by side.

## The WebGL flythrough

All geometry is generated procedurally; **there are no 3D assets**. Every shell is `THREE.Points` with `AdditiveBlending` and `depthWrite: false`, plus one `LineSegments` for the helix rungs.

| # | Scale | Z | Construction |
| --- | --- | --- | --- |
| 1 | Organism · 1 m | `0` | ~3400 points rejection-sampled inside 7 ellipsoids |
| 2 | Organ · 10 cm | `-70` | ~3200 points on a lobed sphere |
| 3 | Tissue · 100 µm | `-140` | 9 × 13 hex-offset grid of cell rings, 26% flagged "sick" |
| 4 | Cell · 10 µm | `-210` | Membrane shell, nucleus, 26 organelle clusters |
| 5 | Circuit · 2 nm | `-282` | Double helix, 190 segments, rungs every 4th node |

Camera dolly is `camera.z = 26 - p * 282`, where `p` is flight progress lerped toward its target at `0.075`/frame. Shell opacity by camera distance (`rel = camZ - shellZ`):

```
o = clamp01((95 - rel) / 42) * clamp01((rel + 14) / 24)
```

Performance: point budget halves below 760px width and scales with the `density` prop; an `IntersectionObserver` skips the whole render when the canvas is off-screen.

### Props

`HeroFlight` takes three, all optional:

| Prop | Default | Notes |
| --- | --- | --- |
| `accentColor` | `#6EF3C0` | Accent used for the point clouds |
| `enableWebgl` | `true` | Perf escape hatch — skips scene creation entirely |
| `density` | `1` | `0.4`–`1.6`, scales the point budget |

### Reduced motion

Under `prefers-reduced-motion: reduce`, flight progress snaps rather than lerping, shells stop rotating, camera parallax is off, and the custom cursor drops its magnetic/tilt handlers. The flythrough still tracks scroll — it carries content — it simply stops moving on its own.

## Circuit sandbox

Data and scoring live in `src/lib/labModel.ts`. Final values are the sensor's base plus gate and effector deltas, then clamped: `spec = clamp(38..99)`, `off = max(1, …)`, `win = max(6, …)`.

Verdict thresholds: ≥90 "Clinic-grade selectivity" · ≥78 "Workable — we would run this in organoids" · below that "Too leaky to advance", and the status chip flips to `REJECTED`.

## Design tokens

Defined as CSS variables in the `@theme` block of `src/index.css`, so they are available both as Tailwind utilities (`text-accent`, `bg-surface`) and raw `var(--color-*)`.

Base `#05070A` · Surface `#070B0E` · Accent `#6EF3C0` · Accent tint `#7FD6BC` · Pale `#BFE8DA` · Warn `#FFB86B` · Text `#E6EFEA` → `#93A8A1` · Muted `#5E7C74` · Dim `#223129`.

Type: Instrument Serif (display), Space Grotesk (body/UI), JetBrains Mono (eyebrows, labels). Motion: `cubic-bezier(.16,1,.3,1)` for anything spatial, `ease` for opacity. Radii are 3px on panels, 100px on pills, 50% on dots — nothing in between.

## Known gaps

Carried over from the prototype and **not yet addressed**:

- **Images are hotlinked from Unsplash.** Replace with real, self-hosted photography (AVIF/WebP + `srcset`). Keep the `grayscale(.55–1) brightness(.62–.7) contrast(1.1)` treatment or the page loses cohesion.
- **The contact form has no backend.** It clears the field and fades in a confirmation. Wire to a real endpoint and add validation and error states.
- **Accessibility pass outstanding.** `prefers-reduced-motion` and `(hover: none)` are handled; still needed are focus-visible rings, `aria-expanded` on pipeline rows, real form labels and error messaging, and a skip link.
- **Bundle is ~760 kB** (three.js dominates). Code-split the hero if first paint matters.

## Fidelity notes

Maths, timings, easings, copy, palette and the sandbox scoring table are ported literally from the prototype and should not be "improved" without a design decision. Two places where the React version deliberately differs:

- Breakpoints are CSS media queries rather than the prototype's JS-on-resize branching. Note that the hero's short-viewport rules are **height** queries (`max-height: 660px` hides the stat row, `600px` the scroll cue) — a width query there causes the hero block to overflow its `100svh` stage.
- Animated elements set their initial `opacity`/`transform` inline alongside the keyframe animation rather than through a static utility class, so the class and the animation never compete for the same property.
