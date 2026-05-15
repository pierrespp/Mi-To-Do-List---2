import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { PetStore, PetMood, ThemeMode, PetId, ReactionType, CelebrationType, PetReaction, CompanionIntensity } from "../types/petTypes";
import { MAX_HAPPINESS, MAX_ENERGY, XP_PER_LEVEL, MAX_REACTION_QUEUE } from "../types/petTypes";
import { clamp, getMoodFromState } from "../utils/petUtils";
import { loadState, saveState } from "../persistence/petPersistence";

const _persisted = loadState();
const VALID_PET_IDS: PetId[] = ["mi", "kuro", "mochi", "hoshi", "yuki"];
const persisted = {
  ..._persisted,
  petId: VALID_PET_IDS.includes(_persisted.petId as PetId) ? (_persisted.petId as PetId) : "mi" as PetId,
};

const DEFAULT_STATE = {
  enabled: true,
  petId: "mi" as PetId,
  mood: "happy" as PetMood,
  happiness: 80,
  energy: 100,
  sleep: false,
  level: 1,
  xp: 0,
  idle: false,
  lastInteraction: Date.now(),
  lastSeen: Date.now(),
  streakDays: 0,
  tasksCompleted: 0,
  themeMode: "kawaii" as ThemeMode,
  minimized: false,
  isCompact: true,
  reactionQueue: [] as PetReaction[],
  celebration: null as CelebrationType,
  settings: {
    intensity: "balanced" as CompanionIntensity,
    quietMode: false,
    reducedPresence: false,
    compactDefault: false,
  },
};

const initial = {
  ...DEFAULT_STATE,
  ...persisted,
  settings: {
    ...DEFAULT_STATE.settings,
    ...(persisted.settings || {}),
  },
  reactionQueue: [] as PetReaction[],
  celebration: null as CelebrationType,
};

let _reactionIdCounter = 0;

export const usePetStore = create<PetStore>()(
  subscribeWithSelector((set, get) => ({
    ...initial,
    mood: getMoodFromState(initial),

    actions: {
      setEnabled: (enabled) => set({ enabled }),

      setPetId: (petId: PetId) => {
        set({ petId, happiness: clamp(get().happiness, 0, MAX_HAPPINESS), energy: Math.max(get().energy, 70) });
      },

      setMood: (mood: PetMood) => set({ mood }),

      addHappiness: (amount: number) =>
        set((s) => {
          const happiness = clamp(s.happiness + amount, 0, MAX_HAPPINESS);
          return { happiness, mood: getMoodFromState({ ...s, happiness }) };
        }),

      addEnergy: (amount: number) =>
        set((s) => {
          const energy = clamp(s.energy + amount, 0, MAX_ENERGY);
          return { energy };
        }),

      addXp: (amount: number) =>
        set((s) => {
          let xp = s.xp + amount;
          let level = s.level;
          const needed = level * XP_PER_LEVEL;
          if (xp >= needed) {
            xp = xp - needed;
            level += 1;
          }
          return { xp, level };
        }),

      setIdle: (idle: boolean) =>
        set((s) => ({ idle, mood: getMoodFromState({ ...s, idle }) })),

      setSleep: (sleep: boolean) =>
        set((s) => ({ sleep, mood: getMoodFromState({ ...s, sleep }) })),

      setThemeMode: (themeMode: ThemeMode) => set({ themeMode }),

      setMinimized: (minimized: boolean) => set({ minimized }),

      setIsCompact: (isCompact: boolean) => set({ isCompact }),

      setLastInteraction: (time: number) => set({ lastInteraction: time }),

      enqueueReaction: (message: string, type: ReactionType, duration = 3500) => {
        set((s) => {
          if (s.reactionQueue.length >= MAX_REACTION_QUEUE) return {};
          const reaction: PetReaction = {
            id: `r-${++_reactionIdCounter}`,
            message,
            type,
            duration,
          };
          return { reactionQueue: [...s.reactionQueue, reaction] };
        });
      },

      consumeReaction: () => {
        set((s) => ({
          reactionQueue: s.reactionQueue.slice(1),
        }));
      },

      setCelebration: (celebration: CelebrationType) => {
        set({ celebration });
        if (celebration !== null) {
          const dur = celebration === "mega" ? 5200 : 1800;
          setTimeout(() => {
            const current = get().celebration;
            if (current === celebration) set({ celebration: null });
          }, dur);
        }
      },

      updateSettings: (newSettings) => {
        set((s) => ({
          settings: { ...s.settings, ...newSettings },
        }));
      },

      tick: () => {
        const s = get();
        if (!s.enabled || s.minimized) return;
        const now = Date.now();
        const idleMs = now - s.lastInteraction;
        const idle = idleMs > 5 * 60 * 1000;
        // 9.3: Softer decay — -1 instead of -2 so mood transitions are gradual
        const happiness = idle
          ? clamp(s.happiness - 1, 0, MAX_HAPPINESS)
          : s.happiness;
        const energy = idle
          ? clamp(s.energy - 1, 0, MAX_ENERGY)
          : s.energy;
        set({ idle, happiness, energy, mood: getMoodFromState({ ...s, idle, happiness, energy }) });
      },

      reset: () => {
        set({
          ...DEFAULT_STATE,
          mood: getMoodFromState(DEFAULT_STATE),
          lastInteraction: Date.now(),
          lastSeen: Date.now(),
          reactionQueue: [],
          celebration: null,
        });
      },
    },
  }))
);

usePetStore.subscribe(
  (state) => state,
  (state) => {
    saveState(state);
  }
);
