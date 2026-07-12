/**
 * Design tokens — single source of truth for the visual system.
 * Values transcribed verbatim from PRD Part 2 (Design Language).
 * Never hardcode a colour/space/radius anywhere else; import from here.
 */

export const COLORS = {
  bgPrimary: "#F8FCFF",
  bgSecondary: "#F3FAFD",
  glassBg: "rgba(255,255,255,0.18)",
  glassBorder: "rgba(255,255,255,0.25)",
  oceanBlue: "#1597FF",
  lightWater: "#77D7FF",
  crystalCyan: "#DFF8FF",
  skyGradient: "#DDF7FF",
  deepOcean: "#0057C8",
  accent: "#00AEEF",
  success: "#39C97C",
  danger: "#FF6464",
  textPrimary: "#0A1B2B",
  textSecondary: "#4F6778",
  textMuted: "#93A6B5",
} as const;

export const GRADIENTS = {
  sky: [COLORS.crystalCyan, COLORS.bgPrimary],
  water: [COLORS.lightWater, COLORS.oceanBlue],
  glass: ["rgba(255,255,255,0)", "rgba(255,255,255,0.7)"],
} as const;

/** 8-based spacing scale (px). PRD Part 2. */
export const SPACE = [8, 16, 24, 32, 48, 64, 96, 128, 160, 192] as const;

export const RADIUS = {
  sm: 12,
  md: 20,
  lg: 32,
  card: 40,
} as const;

export const SHADOW = {
  sm: "0 10px 30px rgba(0,0,0,0.05)",
  md: "0 20px 60px rgba(0,0,0,0.08)",
  lg: "0 40px 100px rgba(0,0,0,0.12)",
} as const;

export const GLASS = {
  blur: 30,
  opacity: 0.18,
  borderWidth: 1,
} as const;

export const LAYOUT = {
  maxWidth: 1440,
  contentWidth: 1280,
  columns: 12,
  sectionPadDesktop: 160,
  sectionPadMobile: 96,
} as const;

export type ColorToken = keyof typeof COLORS;
