"use client";
/**
 * Scene lighting. A warm directional key from the sun direction plus soft cool
 * ambient/hemisphere fill. Intensity "breathes" almost imperceptibly so the
 * world never feels static (PRD Part 7: nothing is perfectly still).
 */
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SUN_COLOR, SUN_POSITION } from "@/three/scene/sceneConfig";
import { COLORS } from "@/constants/tokens";

export function Lighting() {
  const keyRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (keyRef.current) {
      const t = state.clock.elapsedTime;
      keyRef.current.intensity = 2.1 + Math.sin(t * 0.15) * 0.12;
    }
  });

  return (
    <>
      <directionalLight
        ref={keyRef}
        position={SUN_POSITION}
        intensity={2.1}
        color={SUN_COLOR}
      />
      <hemisphereLight
        args={[COLORS.crystalCyan, COLORS.deepOcean, 0.6]}
      />
      <ambientLight intensity={0.25} color={COLORS.lightWater} />
    </>
  );
}
