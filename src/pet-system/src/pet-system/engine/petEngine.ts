import { usePetStore } from "../store/petStore";
import { TICK_RATE_MS } from "../types/petTypes";
import { petAdapter } from "../adapters/petAdapter";

/** Slow tick rate when idle — reduces CPU from every 10s to every 30s */
const IDLE_TICK_RATE_MS = 30_000;

let _timerId: ReturnType<typeof setInterval> | null = null;
let _currentRate: number = TICK_RATE_MS;
let _visibilitySetup = false;

function getCurrentDesiredRate(): number {
  const s = usePetStore.getState();
  return s.idle ? IDLE_TICK_RATE_MS : TICK_RATE_MS;
}

function restartWithRate(rate: number): void {
  if (_timerId !== null) clearInterval(_timerId);
  _currentRate = rate;
  _timerId = setInterval(() => {
    usePetStore.getState().actions.tick();
    // Contextual reactions (long session, daily rhythms) — heavily throttled
    petAdapter.onEngineTick();
    // Adapt tick rate if idle state changed
    const desired = getCurrentDesiredRate();
    if (desired !== _currentRate) {
      restartWithRate(desired);
    }
  }, _currentRate);
}

function setupVisibilityHandler(): void {
  if (_visibilitySetup || typeof document === "undefined") return;
  _visibilitySetup = true;
  document.addEventListener("visibilitychange", () => {
    const root = document.getElementById("pet-root");
    if (document.hidden) {
      if (_timerId !== null) {
        clearInterval(_timerId);
        _timerId = null;
      }
      root?.classList.add("pet-paused");
    } else {
      root?.classList.remove("pet-paused");
      const state = usePetStore.getState();
      if (state.enabled && !state.minimized && _timerId === null) {
        restartWithRate(getCurrentDesiredRate());
      }
    }
  });
}

export function startEngine(): void {
  if (_timerId !== null) return;
  restartWithRate(getCurrentDesiredRate());
  setupVisibilityHandler();
}

export function stopEngine(): void {
  if (_timerId === null) return;
  clearInterval(_timerId);
  _timerId = null;
}

export function isEngineRunning(): boolean {
  return _timerId !== null;
}

