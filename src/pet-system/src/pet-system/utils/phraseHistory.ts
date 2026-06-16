/* ── Phrase History — Bounded Ring Buffer ──────────────────────────────
 *  Prevents the pet from repeating the same phrase consecutively.
 *  Keeps only the last N phrases — no infinite growth.
 * ──────────────────────────────────────────────────────────────────── */

const MAX_HISTORY = 4;
const _history: string[] = [];

/**
 * Pick a random phrase from a pool, avoiding recent repeats.
 * Falls back to any phrase if all options were recently used.
 */
export function pickFresh(pool: string[]): string {
  if (pool.length <= 1) return pool[0] ?? "";

  // Filter out recently used phrases
  const fresh = pool.filter((p) => !_history.includes(p));

  // If all phrases are "stale", allow any (reset avoidance)
  const candidates = fresh.length > 0 ? fresh : pool;
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];

  // Record in ring buffer
  _history.push(chosen);
  if (_history.length > MAX_HISTORY) _history.shift();

  return chosen;
}

/**
 * Like pickFresh but with a chattiness gate.
 * Returns null if the chattiness check fails.
 */
export function pickFreshMaybe(pool: string[], chattiness: number): string | null {
  if (Math.random() > chattiness) return null;
  return pickFresh(pool);
}
