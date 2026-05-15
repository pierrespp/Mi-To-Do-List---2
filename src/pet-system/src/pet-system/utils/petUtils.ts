import type { PetMood, PetState } from "../types/petTypes";
import { XP_PER_LEVEL } from "../types/petTypes";

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function getMoodFromState(
  state: Pick<PetState, "happiness" | "energy" | "sleep" | "idle">
): PetMood {
  if (state.sleep) return "sleepy";
  if (state.idle && state.happiness < 40) return "sad";
  if (state.energy < 20) return "sleepy";
  if (state.happiness >= 90) return "ecstatic";
  if (state.happiness >= 65) return "happy";
  if (state.happiness >= 40) return "neutral";
  if (state.happiness >= 20) return "worried";
  return "sad";
}

export function getXpProgress(xp: number, level: number): number {
  return Math.min((xp / (level * XP_PER_LEVEL)) * 100, 100);
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return ((...args: unknown[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}
