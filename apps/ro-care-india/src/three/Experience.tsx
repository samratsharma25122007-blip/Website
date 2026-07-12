"use client";
/**
 * The single persistent WebGL world.
 *
 * There is exactly ONE <Canvas> for the entire experience — "sections" are
 * camera + scene states inside it, never route changes (PRD Parts 3–6).
 *
 * Milestone 0: an empty, correctly-configured stage. The world (ocean, sky,
 * lighting, RO) is added in subsequent milestones. `frameloop="demand"` keeps
 * it idle-cheap until animation drives invalidation.
 */
import { Canvas } from "@react-three/fiber";
import { useExperienceStore } from "@/state/useExperienceStore";
import { TIERS, type QualityTier } from "@/config/quality";
import { COLORS } from "@/constants/tokens";

function dprFor(quality: QualityTier): [number, number] {
  if (quality === "none") return [1, 1];
  return [1, TIERS[quality].dprCap];
}

export default function Experience() {
  const quality = useExperienceStore((s) => s.quality);

  return (
    <Canvas
      dpr={dprFor(quality)}
      frameloop="demand"
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      }}
      camera={{ fov: 35, near: 0.1, far: 1000, position: [0, 1.2, 6] }}
    >
      {/* Base atmosphere colour — the real sky/ocean arrive in Milestone 1. */}
      <color attach="background" args={[COLORS.skyGradient]} />
      <ambientLight intensity={0.6} />
    </Canvas>
  );
}
