# RO Care India — Cinematic Homepage

A frontend-only, Awwwards-quality homepage for RO Care India — *"Water Gives Life."*
A single persistent WebGL world (an abstract water world) with a semantic,
accessible DOM baseline underneath.

Built with **Next.js 15 · React 19 · TypeScript · React Three Fiber · Drei ·
GSAP · Lenis · Zustand · @react-three/postprocessing · GLSL**.

## Status

- **Milestone 0** — verified project foundation (tokens, providers, quality
  tiers, state machine, persistent `<Canvas>`, DOM/a11y baseline).
- **Milestone 1** — living abstract water world: procedural Gerstner ocean
  (custom GLSL), gradient sky + morning sun, god rays, bloom, vignette, film
  grain, drifting particles, breathing camera. Continuously alive.

Next: the stylized procedural RO, then the droplet transition and beyond.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
```

## Architecture (short)

- `src/three/` — the entire WebGL layer (scene, shaders, camera, post-fx).
  Never imported by DOM components (ESLint-enforced boundary); mounted lazily
  via `components/ExperienceLayer` behind a WebGL + reduced-motion capability
  check, so the site is complete without the 3D.
- `src/state/` — Zustand stores; loop-critical values read via `getState()`
  inside `useFrame` (zero re-renders).
- `src/constants/` — design tokens (PRD Part 2) + motion tokens (PRD Part 7),
  single sources of truth.
- `src/config/quality.ts` — device-capability tiers gating ocean detail,
  reflections, post-fx, particle counts and DPR.

## Notes

- Everything degrades gracefully: no-WebGL / reduced-motion / low-end devices
  fall back to the DOM baseline (poster route to follow).
- FPS is engineered for (tiered DPR/segments/effects, no per-frame allocation)
  and should be validated on real GPU hardware.
