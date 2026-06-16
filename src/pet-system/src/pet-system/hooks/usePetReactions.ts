import { useState, useEffect } from "react";
import { usePetStore } from "../store/petStore";
import type { PetReaction } from "../types/petTypes";

export function usePetReactions(): { currentReaction: PetReaction | null } {
  const queue = usePetStore((s) => s.reactionQueue);
  const consumeReaction = usePetStore((s) => s.actions.consumeReaction);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (queue.length === 0 || isPlaying) return;
    setIsPlaying(true);
    const reaction = queue[0];
    const timer = setTimeout(() => {
      consumeReaction();
      setIsPlaying(false);
    }, reaction.duration);
    return () => clearTimeout(timer);
  }, [queue, isPlaying, consumeReaction]);

  return { currentReaction: queue[0] ?? null };
}
