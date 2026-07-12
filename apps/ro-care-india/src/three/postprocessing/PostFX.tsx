"use client";
/**
 * Post-processing "lens" — treated as a cohesive colour grade, not effects soup
 * (PRD Part 2). God rays from the sun mesh, bloom for sun/water sparkle, a soft
 * vignette and fine film grain. Effect set scales with the quality tier.
 */
import {
  EffectComposer,
  Bloom,
  GodRays,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import type { Mesh } from "three";
import type { ReactElement } from "react";
import { useExperienceStore } from "@/state/useExperienceStore";

export function PostFX({ sun }: { sun: Mesh | null }) {
  const quality = useExperienceStore((s) => s.quality);
  const full = quality === "cinematic" || quality === "high";

  // Build the effect list explicitly — EffectComposer children must be elements
  // (no null), so we compose an array rather than inline conditionals.
  const effects: ReactElement[] = [];

  if (sun) {
    effects.push(
      <GodRays
        key="godrays"
        sun={sun}
        blendFunction={BlendFunction.SCREEN}
        samples={full ? 60 : 30}
        density={0.94}
        decay={0.92}
        weight={0.5}
        exposure={0.5}
        clampMax={1}
        kernelSize={KernelSize.SMALL}
        blur
      />,
    );
  }

  effects.push(
    <Bloom
      key="bloom"
      intensity={full ? 0.85 : 0.6}
      luminanceThreshold={0.62}
      luminanceSmoothing={0.9}
      mipmapBlur
      kernelSize={KernelSize.LARGE}
    />,
    <Vignette key="vignette" eskil={false} offset={0.34} darkness={0.3} />,
  );

  if (full) {
    effects.push(
      <Noise
        key="noise"
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={0.32}
      />,
    );
  }

  return (
    <EffectComposer multisampling={quality === "cinematic" ? 4 : 0}>
      {effects}
    </EffectComposer>
  );
}
