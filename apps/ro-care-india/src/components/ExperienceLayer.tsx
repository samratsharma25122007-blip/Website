"use client";
/**
 * Mounts the WebGL world as a fixed, full-viewport enhancement BEHIND the DOM
 * baseline. Decoupled from content so the site is complete without it:
 *   - reduced-motion / no-WebGL / detected `none` tier  → poster fallback only
 *   - otherwise                                         → lazy-load the Canvas
 *
 * `aria-hidden` because the DOM baseline carries all semantics.
 */
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useExperienceStore } from "@/state/useExperienceStore";
import { hasWebGL } from "@/config/quality";
import { COLORS } from "@/constants/tokens";

const Experience = dynamic(() => import("@/three/Experience"), { ssr: false });

export function ExperienceLayer() {
  const quality = useExperienceStore((s) => s.quality);
  const reducedMotion = useExperienceStore((s) => s.reducedMotion);
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    setWebglReady(hasWebGL());
  }, []);

  const enabled = webglReady && !reducedMotion && quality !== "none";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background: `linear-gradient(180deg, ${COLORS.crystalCyan} 0%, ${COLORS.bgPrimary} 100%)`,
      }}
    >
      {enabled ? <Experience /> : null}
    </div>
  );
}
