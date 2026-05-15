/**
 * Throttle gate — prevents rapid-fire invocations of expensive effects.
 * Each channel has an independent cooldown timer.
 */

const _lastFired: Record<string, number> = {};

/**
 * Returns true if the action should proceed (cooldown has elapsed).
 * Returns false if the action should be suppressed (still cooling down).
 */
export function throttleGate(channel: string, cooldownMs: number): boolean {
  const now = Date.now();
  const last = _lastFired[channel] ?? 0;
  if (now - last < cooldownMs) return false;
  _lastFired[channel] = now;
  return true;
}

/**
 * Resets a specific throttle channel (e.g. when presence level changes).
 */
export function resetThrottle(channel: string): void {
  delete _lastFired[channel];
}

/* ── Pre-defined channels ─────────────────────────────────────────── */

export const THROTTLE = {
  /** Min ms between micro-celebrations (star emoji) */
  MICRO_CELEBRATION: "micro_celebration",
  /** Min ms between mega-celebrations (particle spread) */
  MEGA_CELEBRATION: "mega_celebration",
  /** Min ms between consecutive reaction bubbles */
  REACTION_BUBBLE: "reaction_bubble",
  /** Min ms between idle hint messages */
  IDLE_HINT: "idle_hint",
} as const;

export const THROTTLE_DEFAULTS = {
  [THROTTLE.MICRO_CELEBRATION]: 2000,
  [THROTTLE.MEGA_CELEBRATION]: 8000,
  [THROTTLE.REACTION_BUBBLE]: 1500,
  [THROTTLE.IDLE_HINT]: 60_000,
} as const;
