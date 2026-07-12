/**
 * Quality tiers + runtime capability probe.
 * The whole scene reads `quality` from the experience store; every heavy
 * feature (ocean model, reflections, post-fx, clouds, shadows) keys off it.
 */

export type QualityTier = "cinematic" | "high" | "balanced" | "lite" | "none";

export interface TierConfig {
  dprCap: number;
  ocean: "fft" | "gerstner" | "flat";
  reflections: "probe" | "probe-half" | "cubemap" | "none";
  postfx: "full" | "bloom-dof" | "bloom" | "none";
  clouds: "volumetric" | "billboard" | "flat" | "none";
  shadows: "csm" | "pcf" | "basic" | "none";
  particles: number;
}

export const TIERS: Record<Exclude<QualityTier, "none">, TierConfig> = {
  cinematic: { dprCap: 2, ocean: "fft", reflections: "probe", postfx: "full", clouds: "volumetric", shadows: "csm", particles: 400 },
  high: { dprCap: 1.75, ocean: "gerstner", reflections: "probe-half", postfx: "bloom-dof", clouds: "billboard", shadows: "pcf", particles: 250 },
  balanced: { dprCap: 1.5, ocean: "gerstner", reflections: "cubemap", postfx: "bloom", clouds: "flat", shadows: "basic", particles: 150 },
  lite: { dprCap: 1, ocean: "flat", reflections: "none", postfx: "none", clouds: "none", shadows: "none", particles: 60 },
};

interface ProbeInput {
  reducedMotion: boolean;
  saveData: boolean;
  deviceMemory: number | undefined;
  cores: number;
  isMobile: boolean;
}

/**
 * Choose a tier from device signals. Conservative by design: we would rather
 * ship a smooth `balanced` than a stuttering `cinematic`. `none` means the 3D
 * layer is skipped entirely and the DOM/poster baseline is shown.
 */
export function detectTier(input: ProbeInput): QualityTier {
  if (input.reducedMotion || input.saveData) return "none";
  const mem = input.deviceMemory ?? 4;
  if (input.isMobile) {
    if (mem >= 6 && input.cores >= 6) return "balanced";
    return "lite";
  }
  if (mem >= 8 && input.cores >= 8) return "cinematic";
  if (mem >= 6 && input.cores >= 4) return "high";
  return "balanced";
}

export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGL2RenderingContext && canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}
