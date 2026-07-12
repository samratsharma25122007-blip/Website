/**
 * Shared scene constants for the hero water world.
 * Keeps the sun direction and palette identical across ocean, sky, sun mesh,
 * lighting and post-fx — one source of truth so nothing drifts.
 */
import * as THREE from "three";
import { COLORS } from "@/constants/tokens";

/** Morning sun, front-left, lifted clear of the frame corner. */
export const SUN_DIR = new THREE.Vector3(-0.42, 0.4, -1.0).normalize();

/** World-space sun position for the sun disc + god-ray source. */
export const SUN_DISTANCE = 320;
export const SUN_POSITION = SUN_DIR.clone().multiplyScalar(SUN_DISTANCE);

/** Warm morning light — the one intentional warmth against the cool palette. */
export const SUN_COLOR = new THREE.Color("#FFF1D8");

export const OCEAN = {
  deep: new THREE.Color(COLORS.deepOcean),
  shallow: new THREE.Color(COLORS.lightWater),
  skyTint: new THREE.Color(COLORS.crystalCyan),
  fogNear: 70,
  fogFar: 280,
} as const;

export const SKY = {
  zenith: new THREE.Color(COLORS.lightWater),
  horizon: new THREE.Color(COLORS.crystalCyan),
} as const;

/** Camera resting pose + gentle idle breathing amounts. */
export const CAMERA = {
  base: new THREE.Vector3(0, 2.6, 15),
  target: new THREE.Vector3(0, 1.4, 0),
  breathePos: 0.35,
  breatheSpeed: 0.22,
} as const;
