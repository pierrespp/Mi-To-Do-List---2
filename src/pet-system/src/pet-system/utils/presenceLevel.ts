import type { PetMood, CelebrationType } from "../types/petTypes";

/* ── Presence Levels ──────────────────────────────────────────────────
 *  dormant      → pet sleeping or minimized. No animations, no particles.
 *  ambient      → idle state. Very subtle float, dimmed orbs, no bubbles.
 *  reactive     → user is interacting. Normal animations + speech bubbles.
 *  celebratory  → task completed / all done. Full FX, particles, bounce.
 * ──────────────────────────────────────────────────────────────────── */

export type PresenceLevel = "dormant" | "ambient" | "reactive" | "celebratory";

export interface PresenceConfig {
  level: PresenceLevel;
  /** Orb opacity multiplier (0–1) */
  orbOpacity: number;
  /** Whether speech bubbles should show */
  showBubbles: boolean;
  /** Whether idle text like "está com saudade" should show */
  showIdleHint: boolean;
  /** CSS animation class for the pet avatar */
  avatarAnimation: string;
  /** Whether celebration FX should render */
  showCelebrationFX: boolean;
  /** Whether ambient orb CSS animations should play */
  animateOrbs: boolean;
  /** Particle throttle — minimum ms between celebrations */
  celebrationCooldownMs: number;
}

const PRESENCE_CONFIGS: Record<PresenceLevel, PresenceConfig> = {
  dormant: {
    level: "dormant",
    orbOpacity: 0,
    showBubbles: false,
    showIdleHint: false,
    avatarAnimation: "", // no animation
    showCelebrationFX: false,
    animateOrbs: false,
    celebrationCooldownMs: 0,
  },
  ambient: {
    level: "ambient",
    orbOpacity: 0.35,
    showBubbles: false,
    showIdleHint: false,
    avatarAnimation: "pet-float-slow",
    showCelebrationFX: false,
    animateOrbs: false,
    celebrationCooldownMs: 0,
  },
  reactive: {
    level: "reactive",
    orbOpacity: 1,
    showBubbles: true,
    showIdleHint: true,
    avatarAnimation: "pet-float",
    showCelebrationFX: true,
    animateOrbs: true,
    celebrationCooldownMs: 3000,
  },
  celebratory: {
    level: "celebratory",
    orbOpacity: 1,
    showBubbles: true,
    showIdleHint: false,
    avatarAnimation: "pet-bounce",
    showCelebrationFX: true,
    animateOrbs: true,
    celebrationCooldownMs: 5000,
  },
};

/**
 * Derives the current presence level from pet state.
 * Pure function — no side effects.
 */
export function derivePresenceLevel(opts: {
  sleeping: boolean;
  minimized: boolean;
  idle: boolean;
  celebration: CelebrationType;
  mood: PetMood;
}): PresenceLevel {
  const { sleeping, minimized, idle, celebration } = opts;

  // Dormant: pet is sleeping or user minimized the widget
  if (sleeping || minimized) return "dormant";

  // Celebratory: an active celebration is playing
  if (celebration !== null) return "celebratory";

  // Ambient: user has been idle (no interaction for 5+ min)
  if (idle) return "ambient";

  // Default: reactive — normal interactive state
  return "reactive";
}

export function getPresenceConfig(level: PresenceLevel): PresenceConfig {
  return PRESENCE_CONFIGS[level];
}
