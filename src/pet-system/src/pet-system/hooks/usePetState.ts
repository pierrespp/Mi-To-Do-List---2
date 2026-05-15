import { usePetStore } from "../store/petStore";
import { getXpProgress } from "../utils/petUtils";
import type { PetMood, ThemeMode, PetId, PetReaction, CelebrationType } from "../types/petTypes";

export const usePetMood = (): PetMood => usePetStore((s) => s.mood);
export const usePetHappiness = (): number => usePetStore((s) => s.happiness);
export const usePetEnergy = (): number => usePetStore((s) => s.energy);
export const usePetLevel = (): number => usePetStore((s) => s.level);
export const usePetXp = (): number => usePetStore((s) => s.xp);
export const usePetXpProgress = (): number => {
  const xp = usePetStore((s) => s.xp);
  const level = usePetStore((s) => s.level);
  return getXpProgress(xp, level);
};
export const usePetSleep = (): boolean => usePetStore((s) => s.sleep);
export const usePetIdle = (): boolean => usePetStore((s) => s.idle);
export const usePetTheme = (): ThemeMode => usePetStore((s) => s.themeMode);
export const usePetMinimized = (): boolean => usePetStore((s) => s.minimized);
export const usePetId = (): PetId => usePetStore((s) => s.petId);
export const usePetReactionQueue = (): PetReaction[] => usePetStore((s) => s.reactionQueue);
export const usePetCelebration = (): CelebrationType => usePetStore((s) => s.celebration);
export const usePetStreakDays = (): number => usePetStore((s) => s.streakDays);
export const usePetTasksCompleted = (): number => usePetStore((s) => s.tasksCompleted);
export const usePetIsCompact = (): boolean => usePetStore((s) => s.isCompact);
export const usePetSettings = () => usePetStore((s) => s.settings);
