# Helixa

Helixa is an animation-driven biotech landing page built with React, TypeScript, Vite, Tailwind CSS, and Three.js.

Live site: https://helxia.vercel.app/

## Setup

Install dependencies:

```bash
cd app
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Design And Animation Approach

The design uses a dark editorial biotech aesthetic with high-contrast typography, restrained borders, local lab imagery, and a mint accent color for key states and motion cues.

The hero is driven by a scroll-scrubbed Three.js canvas that moves through procedural biological scales, from organism-level forms down to a gene-circuit view. Supporting sections use lightweight reveal animations, parallax imagery, hover states, accordions, counters, and an interactive circuit sandbox to keep the page exploratory without adding heavy external dependencies.

Images and fonts are loaded locally through the Vite build pipeline where possible, so the deployed app is not dependent on remote image URLs.
