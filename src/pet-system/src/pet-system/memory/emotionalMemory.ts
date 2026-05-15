/* ── Soft Emotional Memory ─────────────────────────────────────────────
 *  Lightweight, ephemeral, localStorage-only memory that gives the pet
 *  a sense of continuity between sessions.
 *
 *  Rules:
 *  - No backend, no analytics, no profiling
 *  - Small footprint (< 1KB in localStorage)
 *  - Contextual and acolhedor (warm), never punitive
 *  - Supports daily rhythms and return-after-absence greetings
 * ──────────────────────────────────────────────────────────────────── */

const MEMORY_KEY = "mi-pet-memory-v1";

export interface EmotionalMemory {
  /** Timestamp of last session end */
  lastSessionEnd: number;
  /** Timestamp of first interaction today (resets daily) */
  firstInteractionToday: number;
  /** Total tasks completed in current day */
  tasksCompletedToday: number;
  /** Timestamp of last task completion (for rapid-fire detection) */
  lastTaskCompletedAt: number;
  /** Number of tasks completed in the last 60s (rapid detection) */
  recentRapidCount: number;
  /** Session start time */
  sessionStart: number;
  /** Day key (YYYY-MM-DD) for daily reset */
  dayKey: string;
  /** Consecutive days with at least 1 task completed */
  streak: number;
  /** Last day that counted toward streak */
  lastStreakDay: string;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultMemory(): EmotionalMemory {
  return {
    lastSessionEnd: 0,
    firstInteractionToday: 0,
    tasksCompletedToday: 0,
    lastTaskCompletedAt: 0,
    recentRapidCount: 0,
    sessionStart: Date.now(),
    dayKey: todayKey(),
    streak: 0,
    lastStreakDay: "",
  };
}

/** Load emotional memory from localStorage */
export function loadMemory(): EmotionalMemory {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (!raw) return defaultMemory();
    const parsed = JSON.parse(raw) as Partial<EmotionalMemory>;

    const mem: EmotionalMemory = { ...defaultMemory(), ...parsed };

    // Daily reset: if day changed, reset daily counters
    const today = todayKey();
    if (mem.dayKey !== today) {
      mem.tasksCompletedToday = 0;
      mem.firstInteractionToday = 0;
      mem.recentRapidCount = 0;
      mem.dayKey = today;
    }

    // Reset session start for this new session
    mem.sessionStart = Date.now();

    return mem;
  } catch {
    return defaultMemory();
  }
}

/** Save emotional memory to localStorage (debounce externally if needed) */
export function saveMemory(mem: EmotionalMemory): void {
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(mem));
  } catch {
    // ignore quota errors
  }
}

/* ── Context Queries ─────────────────────────────────────────────── */

/** How long (ms) since the user was last here */
export function getAbsenceDuration(mem: EmotionalMemory): number {
  if (mem.lastSessionEnd === 0) return 0;
  return Date.now() - mem.lastSessionEnd;
}

/** Is this the very first task of the day? */
export function isFirstTaskOfDay(mem: EmotionalMemory): boolean {
  return mem.tasksCompletedToday === 0;
}

/** Was the user away for more than 4 hours? */
export function isReturnAfterLongAbsence(mem: EmotionalMemory): boolean {
  return getAbsenceDuration(mem) > 4 * 60 * 60 * 1000;
}

/** Has the user been working for more than 2 hours this session? */
export function isLongSession(mem: EmotionalMemory): boolean {
  return Date.now() - mem.sessionStart > 2 * 60 * 60 * 1000;
}

/** Is the user completing tasks rapidly? (3+ in 60s) */
export function isRapidCompletion(mem: EmotionalMemory): boolean {
  return mem.recentRapidCount >= 3;
}

/** Record a task completion and return updated memory */
export function recordTaskCompletion(mem: EmotionalMemory): EmotionalMemory {
  const now = Date.now();
  const today = todayKey();

  // Reset daily if needed
  if (mem.dayKey !== today) {
    mem.tasksCompletedToday = 0;
    mem.firstInteractionToday = 0;
    mem.recentRapidCount = 0;
    mem.dayKey = today;
  }

  // Track first interaction
  if (mem.firstInteractionToday === 0) {
    mem.firstInteractionToday = now;
  }

  // Rapid completion detection (tasks within 60s)
  if (now - mem.lastTaskCompletedAt < 60_000) {
    mem.recentRapidCount += 1;
  } else {
    mem.recentRapidCount = 1;
  }

  mem.tasksCompletedToday += 1;
  mem.lastTaskCompletedAt = now;

  // Streak tracking
  if (mem.lastStreakDay !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);

    if (mem.lastStreakDay === yesterdayKey) {
      mem.streak += 1;
    } else if (mem.lastStreakDay !== today) {
      mem.streak = 1;
    }
    mem.lastStreakDay = today;
  }

  return { ...mem };
}

/** Record session end */
export function recordSessionEnd(mem: EmotionalMemory): EmotionalMemory {
  return { ...mem, lastSessionEnd: Date.now() };
}

/* ── Time-of-day context ─────────────────────────────────────────── */

export type DayPhase = "morning" | "afternoon" | "evening" | "night" | "lateNight";

export function getDayPhase(): DayPhase {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 22) return "evening";
  if (hour >= 22 || hour < 2) return "night";
  return "lateNight"; // 2–6
}

/** Should the pet be quieter right now? */
export function isQuietHours(): boolean {
  const phase = getDayPhase();
  return phase === "lateNight" || phase === "night";
}
