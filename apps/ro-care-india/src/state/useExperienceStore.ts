/**
 * Global experience store (Zustand).
 * Holds orchestration state for the single persistent WebGL world.
 *
 * Loop-critical values (pointer) are written here but MUST be read inside
 * `useFrame` via `useExperienceStore.getState()` — never via the hook — so the
 * render loop never triggers React re-renders.
 */
import { create } from "zustand";
import type { QualityTier } from "@/config/quality";

export type Phase =
  | "loading"
  | "hero"
  | "twin"
  | "transition"
  | "booking"
  | "success";

/** Legal forward/back transitions — enforces the "one continuous world" invariant. */
const TRANSITIONS: Record<Phase, Phase[]> = {
  loading: ["hero"],
  hero: ["twin"],
  twin: ["hero", "transition"],
  transition: ["booking"],
  booking: ["twin", "success"],
  success: ["booking"],
};

interface ExperienceState {
  phase: Phase;
  isReady: boolean;
  quality: QualityTier;
  reducedMotion: boolean;
  audioEnabled: boolean;
  /** Normalised pointer, range [-1, 1]. Updated imperatively every frame. */
  pointer: { x: number; y: number };

  setPhase: (next: Phase) => void;
  setReady: (ready: boolean) => void;
  setQuality: (q: QualityTier) => void;
  setReducedMotion: (v: boolean) => void;
  setAudioEnabled: (v: boolean) => void;
  setPointer: (x: number, y: number) => void;
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  phase: "loading",
  isReady: false,
  quality: "balanced",
  reducedMotion: false,
  audioEnabled: false,
  pointer: { x: 0, y: 0 },

  setPhase: (next) => {
    const current = get().phase;
    if (current === next) return;
    if (!TRANSITIONS[current].includes(next)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[experience] illegal phase transition ${current} → ${next}`);
      }
      return;
    }
    set({ phase: next });
  },
  setReady: (isReady) => set({ isReady }),
  setQuality: (quality) => set({ quality }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setAudioEnabled: (audioEnabled) => set({ audioEnabled }),
  // Mutate in place to avoid per-frame allocations; still notify subscribers.
  setPointer: (x, y) => {
    const p = get().pointer;
    p.x = x;
    p.y = y;
    set({ pointer: p });
  },
}));
