import type { PetId, PetMood, CelebrationType, PetSettings } from "../types/petTypes";
import type { PresenceLevel } from "./presenceLevel";
import { getDayPhase, type DayPhase } from "../memory/emotionalMemory";
import { getPersonality } from "../personality/petPersonality";

/* ── Emotional Visual Parameters ──────────────────────────────────────
 *  Pure functions that compute visual properties from pet state.
 *  Used by PetWidget and PetAvatar to apply posture, pacing, and aura.
 *
 *  All values are CSS-friendly (px, deg, multipliers, ms).
 *  No side effects, no timers, no state mutations.
 * ──────────────────────────────────────────────────────────────────── */

export interface PostureParams {
  /** Vertical offset in px (negative = higher) */
  offsetY: number;
  /** Scale multiplier (0.9–1.05) */
  scale: number;
  /** Rotation in degrees (-3 to 3) */
  tilt: number;
  /** Overall opacity (0.5–1) */
  opacity: number;
}

export interface PacingParams {
  /** Breathing animation duration in seconds */
  breatheDuration: number;
  /** Float animation duration in seconds */
  floatDuration: number;
  /** Blink interval range [min, max] in ms */
  blinkInterval: [number, number];
  /** Blink close duration in ms */
  blinkDuration: number;
}

export interface AuraParams {
  /** Glow opacity multiplier (0–1) */
  glowIntensity: number;
  /** Glow blur radius in px */
  glowBlur: number;
  /** Breathing opacity animation: [min, max] */
  breatheOpacity: [number, number];
  /** Orb animation speed multiplier (higher = slower) */
  orbSpeedMultiplier: number;
}

/* ── 8.2: Posture ─────────────────────────────────────────────────── */

export function getPosture(opts: {
  mood: PetMood;
  energy: number;
  sleeping: boolean;
  idle: boolean;
  presenceLevel: PresenceLevel;
  settings: PetSettings;
}): PostureParams {
  const { mood, energy, sleeping, idle, presenceLevel, settings } = opts;

  // 10.1: Reduced presence dims the pet further when idle
  const presenceOpacityMult = settings.reducedPresence && (idle || presenceLevel === "ambient") ? 0.8 : 1.0;
  // 10.1: Reduced presence also limits the amplitude of micro-tilts and shifts
  const ampMult = settings.reducedPresence ? 0.5 : 1.0;

  // Dormant: collapsed, nearly invisible breathing
  if (presenceLevel === "dormant" || sleeping) {
    return { offsetY: 4 * ampMult, scale: 0.96, tilt: -2 * ampMult, opacity: 0.55 * presenceOpacityMult };
  }

  // Ambient (idle): slightly sunk, dimmed
  if (presenceLevel === "ambient" || idle) {
    return { offsetY: 2 * ampMult, scale: 0.98, tilt: 0, opacity: 0.75 * presenceOpacityMult };
  }

  // Energy-based posture shifts
  const energyFactor = energy / 100;

  // Celebratory: perky, lifted
  if (presenceLevel === "celebratory") {
    return {
      offsetY: -3 * ampMult,
      scale: 1.02 + energyFactor * 0.02,
      tilt: 0,
      opacity: 1,
    };
  }

  // Reactive: mood-based nuance
  switch (mood) {
    case "ecstatic":
      return { offsetY: -3 * ampMult, scale: 1.03, tilt: 1 * ampMult, opacity: 1 };
    case "happy":
      return { offsetY: -1 * ampMult, scale: 1.01, tilt: 0, opacity: 1 };
    case "neutral":
      return { offsetY: 0, scale: 1, tilt: 0, opacity: 0.95 };
    case "worried":
      return { offsetY: 1 * ampMult, scale: 0.99, tilt: -1 * ampMult, opacity: 0.9 };
    case "sad":
      return { offsetY: 3 * ampMult, scale: 0.97, tilt: -2 * ampMult, opacity: 0.85 };
    case "sleepy":
      return { offsetY: 3 * ampMult, scale: 0.97, tilt: -1.5 * ampMult, opacity: 0.7 };
    default:
      return { offsetY: 0, scale: 1, tilt: 0, opacity: 1 };
  }
}

/* ── 8.3: Emotional Pacing ────────────────────────────────────────── */

export function getPacing(opts: {
  petId: PetId;
  presenceLevel: PresenceLevel;
  mood: PetMood;
  settings: PetSettings;
}): PacingParams {
  const { petId, presenceLevel, mood, settings } = opts;
  const personality = getPersonality(petId);
  const phase = getDayPhase();

  // 10.1: Intensity affects overall pacing speed
  let intensityMult = 1.0;
  if (settings.intensity === "minimal") intensityMult = 1.4; // slower
  if (settings.intensity === "expressive") intensityMult = 0.85; // faster

  // Base speeds influenced by personality chattiness (more chatty = faster animations)
  const personalitySpeed = 1 - personality.chattiness * 0.3; // 0.7–1.0
  const phaseMultiplier = getPhaseSpeedMultiplier(phase) * intensityMult;

  // Dormant: very slow, barely alive
  if (presenceLevel === "dormant") {
    return {
      breatheDuration: 6 * intensityMult,
      floatDuration: 10 * intensityMult,
      blinkInterval: [8000 * intensityMult, 15000 * intensityMult],
      blinkDuration: 300,
    };
  }

  // Ambient: slow, peaceful
  if (presenceLevel === "ambient") {
    return {
      breatheDuration: 5 * phaseMultiplier,
      floatDuration: 8 * phaseMultiplier,
      blinkInterval: [5000 * phaseMultiplier, 10000 * phaseMultiplier],
      blinkDuration: 220,
    };
  }

  // Celebratory: fast, excited
  if (presenceLevel === "celebratory") {
    return {
      breatheDuration: 2 * personalitySpeed * intensityMult,
      floatDuration: 3 * personalitySpeed * intensityMult,
      blinkInterval: [1500 * intensityMult, 3000 * intensityMult],
      blinkDuration: 120,
    };
  }

  // Reactive: mood-influenced
  const moodSpeed = getMoodSpeedFactor(mood);
  return {
    breatheDuration: (3 * personalitySpeed * phaseMultiplier) / moodSpeed,
    floatDuration: (4 * personalitySpeed * phaseMultiplier) / moodSpeed,
    blinkInterval: [
      Math.round((2500 * intensityMult) / moodSpeed),
      Math.round((5500 * intensityMult) / moodSpeed),
    ],
    blinkDuration: Math.round(180 / moodSpeed),
  };
}

function getPhaseSpeedMultiplier(phase: DayPhase): number {
  switch (phase) {
    case "lateNight": return 1.5;  // slower
    case "night":     return 1.3;
    case "morning":   return 0.95;
    case "afternoon": return 1.0;
    case "evening":   return 1.1;
  }
}

function getMoodSpeedFactor(mood: PetMood): number {
  switch (mood) {
    case "ecstatic": return 1.3;
    case "happy":    return 1.1;
    case "neutral":  return 1.0;
    case "worried":  return 0.85;
    case "sad":      return 0.75;
    case "sleepy":   return 0.6;
  }
}

/* ── 8.4: Aura Parameters ─────────────────────────────────────────── */

export function getAura(opts: {
  mood: PetMood;
  presenceLevel: PresenceLevel;
  isKawaii: boolean;
  settings: PetSettings;
}): AuraParams {
  const { mood, presenceLevel, isKawaii, settings } = opts;
  const phase = getDayPhase();

  // 10.1: Reduced presence & Intensity multipliers for aura
  let auraMult = 1.0;
  if (settings.reducedPresence) auraMult *= 0.4;
  if (settings.intensity === "minimal") auraMult *= 0.6;

  // Non-kawaii: minimal aura
  if (!isKawaii) {
    return {
      glowIntensity: 0.15 * auraMult,
      glowBlur: 8 * auraMult,
      breatheOpacity: [0.1 * auraMult, 0.15 * auraMult],
      orbSpeedMultiplier: 1.5,
    };
  }

  // Dormant: barely visible
  if (presenceLevel === "dormant") {
    return {
      glowIntensity: 0.1 * auraMult,
      glowBlur: 6 * auraMult,
      breatheOpacity: [0.05 * auraMult, 0.1 * auraMult],
      orbSpeedMultiplier: 2.5,
    };
  }

  // Night phases: cooler, calmer aura
  const nightDimming = (phase === "lateNight" || phase === "night") ? 0.6 : 1;

  // Ambient: soft breathing glow
  if (presenceLevel === "ambient") {
    return {
      glowIntensity: 0.25 * nightDimming * auraMult,
      glowBlur: 10 * auraMult,
      breatheOpacity: [0.15 * auraMult, 0.25 * auraMult],
      orbSpeedMultiplier: 2.0,
    };
  }

  // Celebratory: warm, radiant
  if (presenceLevel === "celebratory") {
    return {
      glowIntensity: 0.6 * auraMult,
      glowBlur: 18 * auraMult,
      breatheOpacity: [0.35 * auraMult, 0.55 * auraMult],
      orbSpeedMultiplier: 0.8,
    };
  }

  // Reactive: mood-dependent warmth
  const moodGlow = getMoodGlowFactor(mood);
  return {
    glowIntensity: moodGlow * nightDimming * auraMult,
    glowBlur: (12 + moodGlow * 6) * auraMult,
    breatheOpacity: [0.2 * nightDimming * auraMult, 0.35 * nightDimming * auraMult],
    orbSpeedMultiplier: 1.0,
  };
}

function getMoodGlowFactor(mood: PetMood): number {
  switch (mood) {
    case "ecstatic": return 0.55;
    case "happy":    return 0.45;
    case "neutral":  return 0.35;
    case "worried":  return 0.3;
    case "sad":      return 0.2;
    case "sleepy":   return 0.15;
  }
}
