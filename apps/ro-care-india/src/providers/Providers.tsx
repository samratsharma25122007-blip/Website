"use client";
/**
 * Client provider composition root.
 * Order matters: reduced-motion + quality detection must resolve before the
 * scroll/animation layers initialise.
 */
import { useEffect, type ReactNode } from "react";
import { LenisProvider } from "@/providers/LenisProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useExperienceStore } from "@/state/useExperienceStore";
import { detectTier } from "@/config/quality";

export function Providers({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const setReducedMotion = useExperienceStore((s) => s.setReducedMotion);
  const setQuality = useExperienceStore((s) => s.setQuality);

  useEffect(() => {
    setReducedMotion(reducedMotion);

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const isMobile = window.matchMedia("(pointer: coarse)").matches;

    setQuality(
      detectTier({
        reducedMotion,
        saveData: nav.connection?.saveData ?? false,
        deviceMemory: nav.deviceMemory,
        cores: navigator.hardwareConcurrency || 4,
        isMobile,
      }),
    );
  }, [reducedMotion, setReducedMotion, setQuality]);

  return <LenisProvider>{children}</LenisProvider>;
}
