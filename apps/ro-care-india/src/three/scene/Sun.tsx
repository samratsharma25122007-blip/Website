"use client";
/**
 * The sun disc — a bright, tone-mapping-exempt sphere at the sun position.
 * Doubles as the source mesh for the god-ray effect and feeds bloom.
 */
import { forwardRef } from "react";
import * as THREE from "three";
import { SUN_COLOR, SUN_POSITION } from "@/three/scene/sceneConfig";

export const Sun = forwardRef<THREE.Mesh>(function Sun(_props, ref) {
  return (
    <mesh ref={ref} position={SUN_POSITION} frustumCulled={false}>
      <sphereGeometry args={[16, 24, 24]} />
      <meshBasicMaterial color={SUN_COLOR} toneMapped={false} />
    </mesh>
  );
});
