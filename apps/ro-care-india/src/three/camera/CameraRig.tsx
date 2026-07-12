"use client";
/**
 * Camera choreography for the hero: a slow "handheld" breathing idle plus a
 * very subtle mouse parallax (PRD Part 7). Reads the pointer from the store via
 * getState() so it never triggers React re-renders. All motion is damped toward
 * targets — nothing snaps.
 */
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CAMERA } from "@/three/scene/sceneConfig";
import { PARALLAX } from "@/constants/motion";
import { useExperienceStore } from "@/state/useExperienceStore";

export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const target = useRef(new THREE.Vector3().copy(CAMERA.target));
  const desired = useRef(new THREE.Vector3());

  // Normalised pointer → store (imperative, no re-render).
  useEffect(() => {
    const setPointer = useExperienceStore.getState().setPointer;
    const onMove = (e: PointerEvent) => {
      setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const { pointer } = useExperienceStore.getState();

    const breatheX = Math.sin(t * CAMERA.breatheSpeed) * CAMERA.breathePos;
    const breatheY = Math.cos(t * CAMERA.breatheSpeed * 0.8) * CAMERA.breathePos * 0.5;

    desired.current.set(
      CAMERA.base.x + breatheX + pointer.x * PARALLAX.hero3d * 6,
      CAMERA.base.y + breatheY + pointer.y * PARALLAX.hero3d * 3,
      CAMERA.base.z,
    );

    // Frame-rate-independent damping toward the target — smooth, interruptible.
    const damp = 1 - Math.pow(0.0001, Math.min(delta, 0.05));
    camera.position.lerp(desired.current, damp);
    camera.lookAt(target.current);
  });

  return null;
}
