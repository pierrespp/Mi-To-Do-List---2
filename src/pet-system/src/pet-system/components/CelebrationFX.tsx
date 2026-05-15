import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CelebrationType } from "../types/petTypes";

interface CelebrationFXProps {
  celebration: CelebrationType;
}

const MEGA_EMOJIS = ["✨", "🌸", "⭐"];

function makeMegaParticles() {
  return Array.from({ length: 8 }, (_, i) => {
    // Arc upward: spread from -145° to -35° (top half)
    const angle = -145 + (i / 7) * 110;
    const dist = 32 + Math.random() * 24;
    const rad = (angle * Math.PI) / 180;
    return {
      id: i,
      tx: Math.round(Math.cos(rad) * dist),
      ty: Math.round(Math.sin(rad) * dist),
      emoji: MEGA_EMOJIS[i % MEGA_EMOJIS.length],
      size: 10 + Math.floor(Math.random() * 5),
      delay: (i / 8) * 0.18,
    };
  });
}

const MEGA_PARTICLES = makeMegaParticles();

export const CelebrationFX: React.FC<CelebrationFXProps> = ({ celebration }) => {
  return (
    <AnimatePresence>
      {celebration === "mega" && (
        <div
          key="mega"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          {MEGA_PARTICLES.map((p) => (
            <motion.span
              key={p.id}
              className="absolute select-none"
              style={{ fontSize: p.size }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.8, 0.6, 0],
                x: p.tx,
                y: p.ty,
                scale: [0, 1.1, 0.9, 0],
              }}
              transition={{ duration: 1.2, delay: p.delay, ease: "easeOut" }}
            >
              {p.emoji}
            </motion.span>
          ))}
        </div>
      )}

      {celebration === "micro" && (
        <motion.span
          key="micro"
          className="pointer-events-none absolute select-none text-sm"
          style={{ top: "8%", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.9, 0], y: -36, scale: [0.5, 1.1, 0.8] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          aria-hidden
        >
          ⭐
        </motion.span>
      )}
    </AnimatePresence>
  );
};
