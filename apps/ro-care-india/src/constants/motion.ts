/**
 * Motion tokens — single source of truth for all timing/easing.
 * PRD Part 7 (Motion Bible) is authoritative; every timeline reads from here.
 */

/** Cubic-bezier easings as GSAP-compatible arrays and CSS strings. */
export const EASE = {
  primary: [0.22, 0.61, 0.36, 1],
  secondary: [0.16, 1, 0.3, 1],
  bounce: [0.34, 1.56, 0.64, 1],
} as const;

export const EASE_CSS = {
  primary: "cubic-bezier(0.22,0.61,0.36,1)",
  secondary: "cubic-bezier(0.16,1,0.3,1)",
  bounce: "cubic-bezier(0.34,1.56,0.64,1)",
} as const;

/** Durations in seconds (GSAP) — PRD Part 7 timing scale. */
export const DUR = {
  tiny: 0.15,
  buttonHover: 0.22,
  cardHover: 0.35,
  sectionReveal: 0.8,
  cameraMove: 1.8,
  envTransition: 2.5,
  heroIntro: 4.5,
} as const;

/** Staggered hero page-load timeline (seconds from load). PRD Part 7. */
export const LOAD_TIMELINE = {
  ambience: 0.2,
  sky: 0.5,
  ocean: 0.9,
  palms: 1.4,
  sunlight: 1.8,
  particles: 2.2,
  pedestal: 2.6,
  cameraDolly: 3.2,
  headline: 3.6,
  subheadline: 3.9,
  icons: 4.2,
  button: 4.5,
} as const;

export const STAGGER = {
  headlineWord: 0.09,
} as const;

/** Mouse-parallax depth factors (fraction of pointer delta). PRD Part 7. */
export const PARALLAX = {
  background: 0.02,
  midground: 0.05,
  foreground: 0.1,
  hero3d: 0.08,
  text: 0.01,
} as const;
