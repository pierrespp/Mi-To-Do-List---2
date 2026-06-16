import { useEffect } from "react";
import { startEngine, stopEngine } from "../engine/petEngine";
import { usePetStore } from "../store/petStore";

export function usePetEngine(): void {
  const minimized = usePetStore((s) => s.minimized);
  const enabled = usePetStore((s) => s.enabled);

  useEffect(() => {
    if (!enabled || minimized) {
      stopEngine();
      return;
    }
    startEngine();
    return () => stopEngine();
  }, [enabled, minimized]);
}
