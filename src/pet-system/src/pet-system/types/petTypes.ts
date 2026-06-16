export type PetId = "mi" | "kuro" | "mochi" | "hoshi" | "yuki";
export type PetMood = "ecstatic" | "happy" | "neutral" | "sad" | "sleepy" | "worried";
export type ThemeMode = "kawaii" | "clean";
export type ReactionType = "excited" | "happy" | "celebration" | "sad" | "worried";
export type CelebrationType = "micro" | "mega" | null;

export interface PetReaction {
  id: string;
  message: string;
  type: ReactionType;
  duration: number;
}

export type CompanionIntensity = "minimal" | "balanced" | "expressive";

export interface PetSettings {
  intensity: CompanionIntensity;
  quietMode: boolean;
  reducedPresence: boolean;
  compactDefault: boolean;
}

export interface PetState {
  enabled: boolean;
  petId: PetId;
  mood: PetMood;
  happiness: number;
  energy: number;
  level: number;
  xp: number;
  idle: boolean;
  sleep: boolean;
  lastInteraction: number;
  lastSeen: number;
  streakDays: number;
  tasksCompleted: number;
  themeMode: ThemeMode;
  minimized: boolean;
  isCompact: boolean;
  reactionQueue: PetReaction[];
  celebration: CelebrationType;
  settings: PetSettings;
}

export interface PetActions {
  setEnabled: (v: boolean) => void;
  setPetId: (id: PetId) => void;
  setMood: (mood: PetMood) => void;
  addHappiness: (amount: number) => void;
  addEnergy: (amount: number) => void;
  addXp: (amount: number) => void;
  setIdle: (idle: boolean) => void;
  setSleep: (sleep: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setMinimized: (v: boolean) => void;
  setIsCompact: (v: boolean) => void;
  setLastInteraction: (time: number) => void;
  enqueueReaction: (message: string, type: ReactionType, duration?: number) => void;
  consumeReaction: () => void;
  setCelebration: (type: CelebrationType) => void;
  updateSettings: (settings: Partial<PetSettings>) => void;
  tick: () => void;
  reset: () => void;
}

export type PetStore = PetState & { actions: PetActions };

export const XP_PER_LEVEL = 100;
export const MAX_HAPPINESS = 100;
export const MAX_ENERGY = 100;
export const TICK_RATE_MS = 10_000;
export const MAX_REACTION_QUEUE = 3;
