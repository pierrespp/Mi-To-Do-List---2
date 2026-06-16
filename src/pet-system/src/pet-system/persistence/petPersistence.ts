import type { PetState } from "../types/petTypes";
import { debounce } from "../utils/petUtils";

const KEY = "mi-pet-system-v2";

type Saveable = Omit<PetState, "idle" | "reactionQueue" | "celebration" | "isCompact">;

export function loadState(): Partial<Saveable> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<Saveable>;
  } catch {
    return {};
  }
}

function _save(state: PetState): void {
  try {
    const { idle: _i, reactionQueue: _r, celebration: _c, isCompact: _ic, ...rest } = state;
    localStorage.setItem(KEY, JSON.stringify({ ...rest, lastSeen: Date.now() }));
  } catch {
    // ignore
  }
}

export const saveState = debounce(_save as (...args: unknown[]) => void, 2000) as (s: PetState) => void;

export function clearState(): void {
  localStorage.removeItem(KEY);
}

export async function saveRemote(_state: PetState): Promise<void> {}
export async function syncRemote(): Promise<Partial<Saveable>> { return {}; }
