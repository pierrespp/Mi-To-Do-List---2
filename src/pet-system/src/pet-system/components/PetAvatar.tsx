import React, { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { PET_DEFINITIONS } from "../pets/petDefinitions";
import type { PetId, PetMood } from "../types/petTypes";
import type { PostureParams, PacingParams, AuraParams } from "../utils/emotionalVisuals";

interface PetAvatarProps {
  petId: PetId;
  mood: PetMood;
  size?: number;
  isKawaii: boolean;
  onClick?: () => void;
  /** 8.2: Posture parameters from emotionalVisuals */
  posture?: PostureParams;
  /** 8.3: Pacing parameters from emotionalVisuals */
  pacing?: PacingParams;
  /** 8.4: Aura parameters from emotionalVisuals */
  aura?: AuraParams;
  /** Is the pet sleeping? */
  sleeping?: boolean;
}

export const PetAvatar: React.FC<PetAvatarProps> = ({
  petId, mood, size = 120, isKawaii, onClick,
  posture, pacing, aura, sleeping,
}) => {
  const def = PET_DEFINITIONS[petId] ?? PET_DEFINITIONS["mi"];
  const SVG = def.SVG;
  const reducedMotion = useReducedMotion();

  // 8.1: Random blink — pacing-aware intervals
  const [blinking, setBlinking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const blinkMin = pacing?.blinkInterval[0] ?? 2000;
  const blinkMax = pacing?.blinkInterval[1] ?? 5000;
  const blinkDur = pacing?.blinkDuration ?? 180;

  useEffect(() => {
    if (reducedMotion) return; // no blink animation in reduced motion
    function scheduleNextBlink() {
      const wait = blinkMin + Math.random() * (blinkMax - blinkMin);
      timerRef.current = setTimeout(() => {
        if (mood === "sleepy") { scheduleNextBlink(); return; }
        setBlinking(true);
        setTimeout(() => {
          setBlinking(false);
          scheduleNextBlink();
        }, blinkDur);
      }, wait);
    }
    scheduleNextBlink();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [mood, blinkMin, blinkMax, blinkDur, reducedMotion]);

  const effectiveMood: PetMood = blinking ? "sleepy" : mood;

  // 8.2: Posture CSS custom properties
  const postureStyle: React.CSSProperties = posture ? {
    "--posture-y": `${posture.offsetY}px`,
    "--posture-scale": `${posture.scale}`,
    "--posture-tilt": `${posture.tilt}deg`,
    "--posture-opacity": `${posture.opacity}`,
  } as React.CSSProperties : {};

  // 8.3: Pacing CSS custom properties
  const pacingStyle: React.CSSProperties = pacing ? {
    "--breathe-duration": `${pacing.breatheDuration}s`,
  } as React.CSSProperties : {};

  // 8.4: Aura CSS custom properties
  const auraStyle: React.CSSProperties = aura ? {
    "--aura-min-opacity": `${aura.breatheOpacity[0]}`,
    "--aura-max-opacity": `${aura.breatheOpacity[1]}`,
    "--aura-breathe-duration": `${pacing ? pacing.breatheDuration * 1.2 : 4}s`,
  } as React.CSSProperties : {};

  // Choose the body animation class based on state
  const bodyAnimClass = reducedMotion
    ? ""
    : sleeping
      ? "pet-sleep-drift"
      : posture
        ? "pet-posture-breathe"
        : "pet-breathe";

  return (
    <div
      className={`relative select-none cursor-pointer pet-emotional-transition`}
      style={{
        width: size, height: size,
        ...postureStyle,
        ...pacingStyle,
      }}
      onClick={onClick}
    >
      {/* 8.4: Glow aura with breathing (kawaii only) */}
      {isKawaii && (
        <div
          className={`absolute inset-0 rounded-full pointer-events-none ${!reducedMotion ? "aura-breathe" : ""}`}
          style={{
            background: `radial-gradient(circle, ${def.glowColor} 20%, transparent 72%)`,
            filter: `blur(${aura?.glowBlur ?? 12}px)`,
            transform: "scale(1.25)",
            opacity: aura?.glowIntensity ?? 0.35,
            ...auraStyle,
          }}
        />
      )}
      {/* SVG pet with posture-aware body animation */}
      <div className={`relative z-10 ${bodyAnimClass} w-full h-full`} style={pacingStyle}>
        <SVG mood={effectiveMood} size={size} />
      </div>
    </div>
  );
};
