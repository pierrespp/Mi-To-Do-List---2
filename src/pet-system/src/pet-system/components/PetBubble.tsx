import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PetMood, PetReaction } from "../types/petTypes";

const IDLE_MSGS: Record<PetMood, string> = {
  ecstatic: "Woooo!! 🎉",
  happy:    "Bora lá! ✨",
  neutral:  "Ei~ 👋",
  worried:  "Olha essa tarefa... 🥺",
  sad:      "Tô com saudade... 🥺",
  sleepy:   "*bocejo* 😴",
};

interface PetBubbleProps {
  currentReaction: PetReaction | null;
  mood: PetMood;
  isKawaii: boolean;
}

export const PetBubble: React.FC<PetBubbleProps> = ({ currentReaction, mood, isKawaii }) => {
  const [showIdle, setShowIdle] = React.useState(false);
  const [idleKey, setIdleKey] = React.useState(0);

  // Show idle message after a longer delay — avoids constant chatter
  React.useEffect(() => {
    if (currentReaction) { setShowIdle(false); return; }
    // Wait 8s before showing idle mood text (was 800ms — too spammy)
    const t1 = setTimeout(() => { setShowIdle(true); setIdleKey((k) => k + 1); }, 8000);
    // Auto-hide after 6s
    const t2 = setTimeout(() => setShowIdle(false), 14000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [currentReaction, mood]);

  const message = currentReaction?.message ?? (showIdle ? IDLE_MSGS[mood] : null);
  const key = currentReaction?.id ?? `idle-${idleKey}`;
  const visible = !!message;

  if (!isKawaii) {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="text-xs text-center pointer-events-none"
            style={{ color: "rgba(203,213,225,0.6)" }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={key}
          className="bubble-appear relative pointer-events-none"
          initial={{ opacity: 0, scale: 0.7, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -6 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
        >
          <div
            className="px-4 py-2 rounded-2xl text-xs font-semibold text-center max-w-[190px]"
            style={{
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.9)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              color: "#6d28d9",
            }}
          >
            {message}
          </div>
          {/* Tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 overflow-hidden">
            <div
              className="w-0 h-0"
              style={{
                borderLeft: "7px solid transparent",
                borderRight: "7px solid transparent",
                borderTop: "9px solid rgba(255,255,255,0.72)",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
