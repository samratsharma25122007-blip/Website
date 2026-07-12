"use client";
/**
 * Procedural Gerstner ocean. A single large plane subdivided for vertex-wave
 * displacement; all colour/lighting in the fragment shader. Segment count is
 * driven by the quality tier to protect the frame budget.
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import vertexShader from "@/three/shaders/ocean.vert.glsl";
import fragmentShader from "@/three/shaders/ocean.frag.glsl";
import { OCEAN, SUN_COLOR, SUN_DIR } from "@/three/scene/sceneConfig";
import { useExperienceStore } from "@/state/useExperienceStore";
import { type QualityTier } from "@/config/quality";

const SIZE = 600;

function segmentsFor(q: QualityTier): number {
  switch (q) {
    case "cinematic": return 320;
    case "high": return 240;
    case "balanced": return 180;
    default: return 120;
  }
}

export function Ocean() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const quality = useExperienceStore((s) => s.quality);
  const segments = segmentsFor(quality);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 1.0 },
      uChoppiness: { value: 1.0 },
      uDeep: { value: OCEAN.deep },
      uShallow: { value: OCEAN.shallow },
      uSky: { value: OCEAN.skyTint },
      uSunColor: { value: SUN_COLOR },
      uSunDir: { value: SUN_DIR },
      uFogNear: { value: OCEAN.fogNear },
      uFogFar: { value: OCEAN.fogFar },
    }),
    [],
  );

  useFrame((_, delta) => {
    const u = materialRef.current?.uniforms.uTime;
    if (u) u.value += delta;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[SIZE, SIZE, segments, segments]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
