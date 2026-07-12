"use client";
/**
 * Floating light particles — pollen/mist drifting slowly through the air.
 * GPU points, count driven by quality tier, gently animated on the CPU with a
 * cheap per-point sine drift (no per-frame allocation).
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/state/useExperienceStore";
import { TIERS, type QualityTier } from "@/config/quality";
import { COLORS } from "@/constants/tokens";

const AREA = 60;
const HEIGHT = 26;

function countFor(q: QualityTier): number {
  return q === "none" ? 0 : TIERS[q].particles;
}

export function Particles() {
  const quality = useExperienceStore((s) => s.quality);
  const count = countFor(quality);
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * AREA;
      positions[i * 3 + 1] = Math.random() * HEIGHT;
      positions[i * 3 + 2] = (Math.random() - 0.5) * AREA;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    return { positions, seeds };
  }, [count]);

  useFrame((state) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    const attr = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const s = seeds[i]!;
      // Gentle upward drift + lateral sway; wrap at the top.
      let y = arr[i * 3 + 1]! + 0.0035 + Math.sin(t * 0.3 + s) * 0.0012;
      if (y > HEIGHT) y = 0;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 0] = arr[i * 3 + 0]! + Math.sin(t * 0.18 + s) * 0.002;
    }
    attr.needsUpdate = true;
  });

  if (count === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={COLORS.crystalCyan}
        size={0.09}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
