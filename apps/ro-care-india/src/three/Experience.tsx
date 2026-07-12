"use client";
/**
 * The single persistent WebGL world.
 *
 * There is exactly ONE <Canvas> for the entire experience — "sections" are
 * camera + scene states inside it, never route changes (PRD Parts 3–6).
 *
 * Milestone 1: the living abstract water world (ocean, sky, sun, god rays,
 * bloom, fog, particles, breathing camera). The RO and UI arrive later.
 * `frameloop="always"` because the world is continuously alive.
 */
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/state/useExperienceStore";
import { TIERS, type QualityTier } from "@/config/quality";
import { COLORS } from "@/constants/tokens";
import { CAMERA } from "@/three/scene/sceneConfig";
import { World } from "@/three/scene/World";

function dprFor(quality: QualityTier): [number, number] {
  if (quality === "none") return [1, 1];
  return [1, TIERS[quality].dprCap];
}

export default function Experience() {
  const quality = useExperienceStore((s) => s.quality);

  return (
    <Canvas
      dpr={dprFor(quality)}
      frameloop="always"
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      }}
      camera={{
        fov: 35,
        near: 0.1,
        far: 1000,
        position: [CAMERA.base.x, CAMERA.base.y, CAMERA.base.z],
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      {/* Fallback fill for the first frame before the sky dome renders. */}
      <color attach="background" args={[COLORS.crystalCyan]} />
      <World />
    </Canvas>
  );
}
