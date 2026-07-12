"use client";
/**
 * Composition root for the hero water world. Owns the sun mesh ref so the
 * post-processing god-rays can target it once it has mounted.
 */
import { useState } from "react";
import type { Mesh } from "three";
import { Sky } from "@/three/scene/Sky";
import { Ocean } from "@/three/scene/Ocean";
import { Sun } from "@/three/scene/Sun";
import { Particles } from "@/three/scene/Particles";
import { Lighting } from "@/three/scene/Lighting";
import { CameraRig } from "@/three/camera/CameraRig";
import { PostFX } from "@/three/postprocessing/PostFX";

export function World() {
  const [sun, setSun] = useState<Mesh | null>(null);

  return (
    <>
      <CameraRig />
      <Lighting />
      <Sky />
      <Sun ref={setSun} />
      <Ocean />
      <Particles />
      <PostFX sun={sun} />
    </>
  );
}
