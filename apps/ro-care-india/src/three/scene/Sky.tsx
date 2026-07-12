"use client";
/**
 * Gradient sky dome. Rendered on the inside of a large sphere, unlit, written
 * without depth so it always sits behind the world.
 */
import { useMemo } from "react";
import * as THREE from "three";
import vertexShader from "@/three/shaders/sky.vert.glsl";
import fragmentShader from "@/three/shaders/sky.frag.glsl";
import { SKY, SUN_COLOR, SUN_DIR } from "@/three/scene/sceneConfig";

export function Sky() {
  const uniforms = useMemo(
    () => ({
      uZenith: { value: SKY.zenith },
      uHorizon: { value: SKY.horizon },
      uSunColor: { value: SUN_COLOR },
      uSunDir: { value: SUN_DIR },
    }),
    [],
  );

  return (
    <mesh frustumCulled={false}>
      <sphereGeometry args={[500, 32, 16]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
