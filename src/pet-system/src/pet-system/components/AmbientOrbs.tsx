import React from "react";
import type { PetMood } from "../types/petTypes";

import { useReducedMotion } from "framer-motion";

interface AmbientOrbsProps {
  mood: PetMood;
  petColor: string;
  isKawaii: boolean;
  idle?: boolean;
}

const MOOD_COLORS: Record<PetMood, [string, string]> = {
  ecstatic: ["rgba(251,191,36,0.22)", "rgba(244,114,182,0.18)"],
  happy:    ["rgba(192,132,252,0.18)", "rgba(244,114,182,0.14)"],
  neutral:  ["rgba(167,139,250,0.12)", "rgba(147,197,253,0.1)"],
  worried:  ["rgba(147,197,253,0.14)", "rgba(167,139,250,0.1)"],
  sad:      ["rgba(147,197,253,0.12)", "rgba(167,139,250,0.08)"],
  sleepy:   ["rgba(196,181,253,0.12)", "rgba(147,197,253,0.08)"],
};

export const AmbientOrbs: React.FC<AmbientOrbsProps> = ({ mood, petColor, isKawaii, idle }) => {
  const reducedMotion = useReducedMotion();

  const [c1, c2] = isKawaii
    ? MOOD_COLORS[mood]
    : ["rgba(148,163,184,0.06)", "rgba(100,116,139,0.04)"];

  const petGlow = `${petColor.slice(0, -1)}, 0.15)`.replace("rgba(", "rgba(");
  const opacity = idle ? 0.4 : 1;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl transition-opacity duration-1000" style={{ opacity }} aria-hidden>
      <div
        className={reducedMotion ? "absolute rounded-full" : "orb-a absolute rounded-full"}
        style={{
          width: 200, height: 200,
          top: -40, left: -40,
          background: `radial-gradient(circle, ${c1} 0%, transparent 70%)`,
          filter: "blur(24px)",
        }}
      />
      <div
        className={reducedMotion ? "absolute rounded-full" : "orb-b absolute rounded-full"}
        style={{
          width: 160, height: 160,
          bottom: -30, right: -30,
          background: `radial-gradient(circle, ${c2} 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
      {isKawaii && (
        <div
          className="absolute rounded-full"
          style={{
            width: 120, height: 120,
            top: "30%", left: "50%",
            transform: "translateX(-50%)",
            background: `radial-gradient(circle, ${petGlow} 0%, transparent 70%)`,
            filter: "blur(30px)",
          }}
        />
      )}
    </div>
  );
};
