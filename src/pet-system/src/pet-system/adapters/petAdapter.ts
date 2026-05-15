import { usePetStore } from "../store/petStore";
import type { ThemeMode } from "../types/petTypes";
import { throttleGate, THROTTLE, THROTTLE_DEFAULTS } from "../utils/throttle";
import { getPersonality } from "../personality/petPersonality";
import { pickFresh, pickFreshMaybe } from "../utils/phraseHistory";
import {
  loadMemory, saveMemory, recordTaskCompletion,
  isFirstTaskOfDay, isRapidCompletion, isReturnAfterLongAbsence,
  isLongSession, getDayPhase, isQuietHours,
  type EmotionalMemory,
} from "../memory/emotionalMemory";

function store() { return usePetStore.getState(); }
function act() { return store().actions; }
function personality() { return getPersonality(store().petId); }

/* ── 9.4: Simple interaction priority ─────────────────────────────── */
function isCelebrationActive(): boolean {
  return store().celebration !== null;
}

/* ── Emotional memory (loaded once, persisted on changes) ──────────── */

let _mem: EmotionalMemory = loadMemory();
function persist() { saveMemory(_mem); }

/* ── Speech cooldowns ─────────────────────────────────────────────── */

const COOLDOWN_KEY = "mi-pet-cooldowns-v1";
const COOLDOWNS: Record<string, number> = {
  morning_greeting:  8 * 60 * 60 * 1000,
  night_greeting:    8 * 60 * 60 * 1000,
  idle_message:      3 * 60 * 60 * 1000,   // 9.1: 2h → 3h
  streak_message:   24 * 60 * 60 * 1000,
  task_overdue:     60 * 60 * 1000,         // 9.1: 30min → 1h
  contextual:       10 * 60 * 1000,         // 9.1: 5min → 10min
  long_session:      2 * 60 * 60 * 1000,   // 9.1: 1h → 2h
  return_greeting:   4 * 60 * 60 * 1000,
  task_reaction:     8 * 1000,              // 9.1: min 8s between task reactions
  task_added:        30 * 1000,
  task_deleted:      30 * 1000,
};

function isOnCooldown(type: string): boolean {
  try {
    const data = JSON.parse(localStorage.getItem(COOLDOWN_KEY) ?? "{}") as Record<string, number>;
    return Date.now() - (data[type] ?? 0) < (COOLDOWNS[type] ?? 0);
  } catch { return false; }
}

function setCooldown(type: string): void {
  try {
    const data = JSON.parse(localStorage.getItem(COOLDOWN_KEY) ?? "{}") as Record<string, number>;
    data[type] = Date.now();
    localStorage.setItem(COOLDOWN_KEY, JSON.stringify(data));
  } catch {}
}

/* ── Auto-expand for high-impact events (then auto-collapse) ──────── */

let _autoCollapseTimer: ReturnType<typeof setTimeout> | null = null;

function autoExpand(durationMs = 5000): void {
  act().setIsCompact(false);
  if (_autoCollapseTimer) clearTimeout(_autoCollapseTimer);
  _autoCollapseTimer = setTimeout(() => {
    act().setIsCompact(true);
    _autoCollapseTimer = null;
  }, durationMs);
}

/* ── Silent companionship: should the pet just "be there"? ────────── */

function shouldBeSilent(): boolean {
  const s = store();
  const p = personality();
  const settings = s.settings;

  // 10.1: Quiet mode suppresses almost everything
  if (settings.quietMode) return true;

  // 10.1: Intensity multipliers
  let silentMultiplier = 1;
  if (settings.intensity === "minimal") silentMultiplier = 1.8;
  if (settings.intensity === "expressive") silentMultiplier = 0.6;

  // 9.6: Increased silence — pets talk less overall
  if (Math.random() < p.silentCompanionship * 0.65 * silentMultiplier) return true;
  // 9.6: Quiet hours make everyone much more silent
  if (isQuietHours() && Math.random() < 0.55 * silentMultiplier) return true;
  return false;
}

function getIntensityMultiplier(): number {
  const intensity = store().settings.intensity;
  if (intensity === "minimal") return 0.4;
  if (intensity === "expressive") return 1.5;
  return 1.0;
}

/* ── 7.4: Daily rhythm adjustments ────────────────────────────────── */

function applyDayPhaseAdjustments(): void {
  const phase = getDayPhase();
  const a = act();

  switch (phase) {
    case "lateNight":
      // Pet gets sleepy in late night — subtle mood shift
      if (!store().sleep && store().energy > 20) {
        a.addEnergy(-5);
      }
      break;
    case "morning":
      // Slight energy boost in the morning
      if (store().energy < 80) {
        a.addEnergy(2);
      }
      break;
    // afternoon, evening, night: no automatic adjustments
  }
}

/* ── Adapter ─────────────────────────────────────────────────────── */

export const petAdapter = {

  onTaskCompleted(): void {
    const a = act();
    const p = personality();

    // Update emotional memory
    const wasFirst = isFirstTaskOfDay(_mem);
    _mem = recordTaskCompletion(_mem);
    persist();

    // Core state updates (always happen)
    a.addHappiness(15);
    a.addXp(20);
    a.addEnergy(5);
    a.setIdle(false);
    a.setLastInteraction(Date.now());

    // 9.6: Silent companionship — often just react silently
    if (shouldBeSilent()) {
      if (throttleGate(THROTTLE.MICRO_CELEBRATION, THROTTLE_DEFAULTS[THROTTLE.MICRO_CELEBRATION])) {
        a.setCelebration("micro");
      }
      return;
    }

    // 9.1: Throttle task reactions to avoid rapid-fire bubbles
    if (isOnCooldown("task_reaction")) {
      if (throttleGate(THROTTLE.MICRO_CELEBRATION, THROTTLE_DEFAULTS[THROTTLE.MICRO_CELEBRATION])) {
        a.setCelebration("micro");
      }
      return;
    }
    setCooldown("task_reaction");

    // 7.1: Contextual reaction — first task of day
    if (wasFirst && !isOnCooldown("contextual")) {
      setCooldown("contextual");
      a.enqueueReaction(pickFresh(p.firstTaskOfDay), "excited", 3000);
      // Interaction 1: Always trigger micro-celebration for first task of day
      a.setCelebration("micro");
      return;
    }

    // 7.1: Contextual reaction — rapid completion
    if (isRapidCompletion(_mem) && !isOnCooldown("contextual")) {
      setCooldown("contextual");
      a.enqueueReaction(pickFresh(p.rapidCompletion), "excited", 2500);
      if (throttleGate(THROTTLE.MICRO_CELEBRATION, THROTTLE_DEFAULTS[THROTTLE.MICRO_CELEBRATION])) {
        a.setCelebration("micro");
      }
      return;
    }

    // Default task completed reaction (9.2: deduped)
    a.enqueueReaction(pickFresh(p.taskCompleted), "happy", 2500);
    if (throttleGate(THROTTLE.MICRO_CELEBRATION, THROTTLE_DEFAULTS[THROTTLE.MICRO_CELEBRATION])) {
      a.setCelebration("micro");
    }
  },

  onAllTasksCompleted(): void {
    const a = act();
    const p = personality();

    a.addHappiness(50);
    a.addXp(100);
    a.addEnergy(20);
    a.setIdle(false);
    a.setLastInteraction(Date.now());
    a.enqueueReaction(pickFresh(p.allTasksCompleted), "celebration", 5000);

    // Throttled mega-celebration — scaled by personality intensity
    if (throttleGate(THROTTLE.MEGA_CELEBRATION, THROTTLE_DEFAULTS[THROTTLE.MEGA_CELEBRATION])) {
      a.setCelebration("mega");
      autoExpand(p.celebrationIntensity >= 0.8 ? 6000 : 4000);
    }
  },

  onTurnRestart(): void {
    const a = act();
    const p = personality();

    a.setSleep(false);
    a.addHappiness(10);
    a.addEnergy(50);
    a.setIdle(false);
    a.setLastInteraction(Date.now());
    a.enqueueReaction(pickFresh(p.turnRestart), "excited", 2800);
  },

  onTaskOverdue(_taskName?: string): void {
    const a = act();
    const settings = store().settings;
    a.addHappiness(-10);
    if (!isOnCooldown("task_overdue")) {
      setCooldown("task_overdue");
      // 9.4: Don't interrupt active celebrations; 10.1: Quiet mode
      if (isCelebrationActive() || settings.quietMode) return;
      const p = personality();
      const msg = pickFreshMaybe(p.idle, p.chattiness * 0.5 * getIntensityMultiplier());
      if (msg) a.enqueueReaction(msg, "worried", 3500);
    }
  },

  onTaskAdded(_taskName?: string): void {
    // 9.4: Don't interrupt celebrations; 9.6: increased silence
    if (isCelebrationActive() || shouldBeSilent()) return;

    if (!isOnCooldown("task_added")) {
      setCooldown("task_added");
      const p = personality();
      act().enqueueReaction(pickFresh(p.taskAdded), "happy", 2000);
    }
  },

  onTaskDeleted(): void {
    // 9.4: Don't interrupt celebrations; 9.6: mostly silent
    if (isCelebrationActive() || shouldBeSilent()) return;

    if (!isOnCooldown("task_deleted")) {
      setCooldown("task_deleted");
      const p = personality();
      act().enqueueReaction(pickFresh(p.taskDeleted), "happy", 2000);
    }
  },

  onThemeChanged(mode: ThemeMode): void {
    act().setThemeMode(mode);
  },

  onWorkspaceIdle(): void {
    const s = store();
    const p = personality();
    const settings = s.settings;
    act().setIdle(true);

    // 9.4: Don't interrupt celebrations; 9.6/10.1: Quietness & Intensity
    if (isCelebrationActive() || settings.quietMode) return;
    if (p.silentCompanionship > 0.5) return;

    if (!isOnCooldown("idle_message")) {
      setCooldown("idle_message");
      const msg = pickFreshMaybe(p.idle, p.idleSensitivity * 0.6 * getIntensityMultiplier());
      if (msg) act().enqueueReaction(msg, "sad", 3000);
    }
  },

  onFeedPet(): void {
    const a = act();
    a.addHappiness(20);
    a.addEnergy(30);
    a.setSleep(false);
    a.setIdle(false);
    a.setLastInteraction(Date.now());
    a.enqueueReaction("Que delícia! 🍡", "happy", 2500);
  },

  onSleep(): void {
    const a = act();
    a.setSleep(true);
    a.addEnergy(50);
    a.setLastInteraction(Date.now());
  },

  onWakeUp(): void {
    const a = act();
    a.setSleep(false);
    a.setLastInteraction(Date.now());
    a.enqueueReaction("Descansamos bem! ☀️", "happy", 2500);
  },

  onAppOpen(pendingTaskCount?: number): void {
    const a = act();
    const p = personality();

    a.setLastInteraction(Date.now());

    // 7.4: Apply day-phase adjustments
    applyDayPhaseAdjustments();

    // Session already greeted?
    const alreadyGreetedThisSession = sessionStorage.getItem("pet_greeted");
    if (alreadyGreetedThisSession) return;
    sessionStorage.setItem("pet_greeted", "true");

    // Interaction 3: Time since last open
    const absenceHours = (Date.now() - _mem.lastSessionEnd) / (1000 * 60 * 60);
    if (_mem.lastSessionEnd > 0) {
      if (absenceHours >= 48) {
        a.enqueueReaction(pickFresh(p.absenceLong), "excited", 4000);
        persist();
        return;
      } else if (absenceHours >= 24) {
        a.enqueueReaction(pickFresh(p.absenceShort), "excited", 3500);
        persist();
        return;
      }
    }

    // Interaction 2: Tasks pending (Logic added, but requires bridge support to receive count)
    if (pendingTaskCount !== undefined) {
      if (pendingTaskCount >= 5) {
        a.enqueueReaction(pickFresh(p.manyTasksPending), "worried", 3500);
        persist();
        return;
      } else if (pendingTaskCount <= 2 && pendingTaskCount > 0) {
        a.enqueueReaction(pickFresh(p.fewTasksPending), "happy", 3000);
        persist();
        return;
      }
    }

    // Interaction 6: Streak or Return Today
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);
    const isReturningToday = _mem.dayKey === new Date().toISOString().slice(0, 10) && _mem.lastSessionEnd > 0;

    if (_mem.lastStreakDay === yesterdayKey && _mem.streak > 0) {
      a.enqueueReaction(pickFresh(p.streakGreeting), "happy", 3500);
      persist();
      return;
    } else if (isReturningToday && !isOnCooldown("return_greeting")) {
      a.enqueueReaction(pickFresh(p.returnTodayGreeting), "happy", 3000);
      persist();
      return;
    }

    // 7.3: Return after long absence (> 4h fallback)
    if (isReturnAfterLongAbsence(_mem) && !isOnCooldown("return_greeting")) {
      setCooldown("return_greeting");
      const msg = pickFresh(p.returnGreeting);
      a.enqueueReaction(msg, "excited", 3500);
      persist();
      return;
    }

    // 7.4: Time-of-day greetings
    const phase = getDayPhase();

    if ((phase === "morning") && !isOnCooldown("morning_greeting")) {
      setCooldown("morning_greeting");
      const msg = pickFreshMaybe(p.morningGreeting, p.chattiness);
      if (msg) a.enqueueReaction(msg, "excited", 3000);
    } else if ((phase === "night" || phase === "lateNight") && !isOnCooldown("night_greeting")) {
      setCooldown("night_greeting");
      const msg = pickFresh(p.nightGreeting);
      a.enqueueReaction(msg, "worried", 3000);

      // 7.1: Late night contextual reaction
      if (phase === "lateNight" && !isOnCooldown("contextual")) {
        setCooldown("contextual");
        const lateMsg = pickFreshMaybe(p.lateNight, 0.5);  // 9.1: reduced from 0.7
        if (lateMsg) {
          setTimeout(() => {
            a.enqueueReaction(lateMsg, "worried", 3500);
          }, 8000);
        }
      }
    }

    persist();
  },

  onDailyStreak(days: number): void {
    const p = personality();
    act().addHappiness(20);
    act().addXp(50);
    if (!isOnCooldown("streak_message")) {
      setCooldown("streak_message");
      act().enqueueReaction(`${days} dias seguidos!! Uau! 🔥`, "excited", 3500);
      if (p.celebrationIntensity >= 0.7) {
        autoExpand(5000);
      }
    }
  },

  /**
   * 7.1: Called by the engine tick to check for session-length contextual reactions.
   * Only triggers rarely — respects all throttling.
   */
  onEngineTick(): void {
    const p = personality();

    // 7.1: Long session reminder (only once per hour)
    if (isLongSession(_mem) && !isOnCooldown("long_session")) {
      setCooldown("long_session");
      const msg = pickFreshMaybe(p.longSession, p.chattiness * 0.35); // 9.1: reduced
      if (msg) act().enqueueReaction(msg, "happy", 4000);
    }

    // 7.4: Day phase energy adjustments (very subtle)
    applyDayPhaseAdjustments();
  },
};

/* ── Session end tracking ─────────────────────────────────────────── */

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    _mem.lastSessionEnd = Date.now();
    persist();
  });
}
