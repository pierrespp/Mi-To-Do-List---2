import React from "react";
import type { PetId, PetMood } from "../types/petTypes";

export interface PetDef {
  id: PetId;
  name: string;
  description: string;
  primaryColor: string;
  glowColor: string;
  SVG: React.FC<PetSVGProps>;
}

export interface PetSVGProps {
  mood: PetMood;
  size?: number;
}

/* ─── Shared expression helpers ─────────────────────────────────────── */

const MOUTHS: Record<PetMood, string> = {
  ecstatic: "M48 70 Q60 84 72 70",
  happy:    "M50 72 Q60 80 70 72",
  neutral:  "M52 73 Q60 76 68 73",
  worried:  "M52 75 Q60 70 68 75",
  sad:      "M50 76 Q60 70 70 76",
  sleepy:   "M53 74 L67 74",
};

function EyeSet({ mood, cx1, cx2, cy, r = 6.5, eyeColor, highlightColor = "white" }: {
  mood: PetMood; cx1: number; cx2: number; cy: number; r?: number;
  eyeColor: string; highlightColor?: string;
}) {
  const ry = mood === "sleepy" ? r * 0.45 : mood === "worried" ? r * 0.8 : r;
  return (
    <>
      <ellipse cx={cx1} cy={cy} rx={r} ry={ry} fill={eyeColor} />
      <ellipse cx={cx2} cy={cy} rx={r} ry={ry} fill={eyeColor} />
      {mood !== "sleepy" && (
        <>
          <ellipse cx={cx1 - 2} cy={cy - 2} rx={r * 0.28} ry={r * 0.28} fill={highlightColor} opacity={0.9} />
          <ellipse cx={cx2 - 2} cy={cy - 2} rx={r * 0.28} ry={r * 0.28} fill={highlightColor} opacity={0.9} />
        </>
      )}
      {mood === "sleepy" && (
        <>
          <rect x={cx1 - r - 1} y={cy - ry - 2} width={r * 2 + 2} height={ry + 1} rx={2} fill={eyeColor} opacity={0.4} />
          <rect x={cx2 - r - 1} y={cy - ry - 2} width={r * 2 + 2} height={ry + 1} rx={2} fill={eyeColor} opacity={0.4} />
        </>
      )}
      {mood === "ecstatic" && (
        <>
          <ellipse cx={cx1 + r * 0.5} cy={cy + r * 0.5} rx={r * 0.2} ry={r * 0.2} fill={highlightColor} opacity={0.5} />
          <ellipse cx={cx2 + r * 0.5} cy={cy + r * 0.5} rx={r * 0.2} ry={r * 0.2} fill={highlightColor} opacity={0.5} />
        </>
      )}
    </>
  );
}

/* ─── Mi (Green frog) ──────────────────────────────────────────────── */
const MiSVG: React.FC<PetSVGProps> = ({ mood }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="miBody" cx="38%" cy="30%" r="68%">
        <stop offset="0%" stopColor="#d1fae5" />
        <stop offset="55%" stopColor="#4ade80" />
        <stop offset="100%" stopColor="#16a34a" />
      </radialGradient>
      <radialGradient id="miBelly" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#f0fdf4" />
        <stop offset="100%" stopColor="#bbf7d0" />
      </radialGradient>
      <radialGradient id="miGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#4ade80" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Ambient glow */}
    <ellipse cx="60" cy="70" rx="52" ry="52" fill="url(#miGlow)" />
    {/* Eye bumps — frog protruding eyes */}
    <ellipse cx="36" cy="46" rx="16" ry="15" fill="url(#miBody)" />
    <ellipse cx="84" cy="46" rx="16" ry="15" fill="url(#miBody)" />
    <ellipse cx="36" cy="44" rx="9" ry="8" fill="#86efac" opacity="0.45" />
    <ellipse cx="84" cy="44" rx="9" ry="8" fill="#86efac" opacity="0.45" />
    {/* Body */}
    <path d="M60 54 C84 50,108 64,108 82 C108 99,93 112,70 115 C54 117,36 114,22 104 C9 94,11 76,15 64 C19 51,40 56,60 54Z" fill="url(#miBody)" />
    {/* Belly */}
    <ellipse cx="60" cy="90" rx="30" ry="22" fill="url(#miBelly)" opacity="0.6" />
    {/* Cheeks */}
    <ellipse cx="18" cy="84" rx="10" ry="7" fill="#fda4af" opacity={mood === "ecstatic" ? 0.72 : 0.38} />
    <ellipse cx="102" cy="84" rx="10" ry="7" fill="#fda4af" opacity={mood === "ecstatic" ? 0.72 : 0.38} />
    {/* Nostrils */}
    <ellipse cx="55" cy="67" rx="2.2" ry="1.6" fill="#15803d" opacity={0.55} />
    <ellipse cx="65" cy="67" rx="2.2" ry="1.6" fill="#15803d" opacity={0.55} />
    {/* Eyes on bumps */}
    <EyeSet mood={mood} cx1={36} cx2={84} cy={44} r={6.5} eyeColor="#15803d" />
    {/* Mouth */}
    <path d={MOUTHS[mood]} stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Little webbed hands */}
    <ellipse cx="16" cy="104" rx="10" ry="6" fill="url(#miBody)" opacity="0.85" />
    <ellipse cx="104" cy="104" rx="10" ry="6" fill="url(#miBody)" opacity="0.85" />
    {/* Ecstatic stars */}
    {mood === "ecstatic" && <><text x="97" y="26" fontSize="12" fill="#86efac">★</text><text x="7" y="30" fontSize="9" fill="#4ade80">✦</text></>}
  </svg>
);

/* ─── Kuro (Black cat) ─────────────────────────────────────────────── */
const KuroSVG: React.FC<PetSVGProps> = ({ mood }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="kuroBody" cx="38%" cy="30%" r="68%">
        <stop offset="0%" stopColor="#312e81" />
        <stop offset="60%" stopColor="#1e1b4b" />
        <stop offset="100%" stopColor="#0f0e26" />
      </radialGradient>
    </defs>
    {/* Pointed ears */}
    <path d="M28 46 L16 16 L46 40Z" fill="url(#kuroBody)" />
    <path d="M92 46 L104 16 L74 40Z" fill="url(#kuroBody)" />
    <path d="M28 43 L20 20 L42 38Z" fill="#4c1d95" opacity="0.6" />
    <path d="M92 43 L100 20 L78 38Z" fill="#4c1d95" opacity="0.6" />
    {/* Body */}
    <ellipse cx="60" cy="70" rx="40" ry="38" fill="url(#kuroBody)" />
    {/* Subtle belly */}
    <ellipse cx="60" cy="76" rx="22" ry="18" fill="#312e81" opacity="0.45" />
    {/* Eyes */}
    <EyeSet mood={mood} cx1={44} cx2={76} cy={58} r={5.5} eyeColor="#e0e7ff" highlightColor="#c7d2fe" />
    {/* Whiskers */}
    <line x1="22" y1="66" x2="50" y2="68" stroke="#4c1d95" strokeWidth="1.2" opacity="0.7" />
    <line x1="22" y1="71" x2="50" y2="70" stroke="#4c1d95" strokeWidth="1.2" opacity="0.7" />
    <line x1="98" y1="66" x2="70" y2="68" stroke="#4c1d95" strokeWidth="1.2" opacity="0.7" />
    <line x1="98" y1="71" x2="70" y2="70" stroke="#4c1d95" strokeWidth="1.2" opacity="0.7" />
    {/* Nose */}
    <ellipse cx="60" cy="65" rx="2.5" ry="1.8" fill="#818cf8" opacity={0.8} />
    {/* Mouth */}
    <path d={MOUTHS[mood]} stroke="#818cf8" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity={0.9} />
  </svg>
);

/* ─── Pi (Pinguim) ────────────────────────────────────────────────── */
const PiSVG: React.FC<PetSVGProps> = ({ mood }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="piBody" cx="38%" cy="30%" r="68%">
        <stop offset="0%" stopColor="#2e2e4a" />
        <stop offset="60%" stopColor="#1a1a2e" />
        <stop offset="100%" stopColor="#0f0f1d" />
      </radialGradient>
      <radialGradient id="piBelly" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e8f4f8" />
      </radialGradient>
    </defs>
    {/* Body */}
    <ellipse cx="60" cy="70" rx="42" ry="45" fill="url(#piBody)" />
    {/* White belly */}
    <ellipse cx="60" cy="80" rx="28" ry="32" fill="url(#piBelly)" />
    {/* Beak */}
    <path d="M54 68 L60 76 L66 68 Z" fill="#f97316" />
    {/* Eyes */}
    <EyeSet mood={mood} cx1={43} cx2={77} cy={56} r={6} eyeColor="#0f0f1d" />
    {/* Mouth (under beak) */}
    <path d={MOUTHS[mood]} stroke="#f97316" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity={0.6} />
    {/* Fins */}
    <ellipse cx="20" cy="80" rx="10" ry="18" fill="url(#piBody)" transform="rotate(15 20 80)" />
    <ellipse cx="100" cy="80" rx="10" ry="18" fill="url(#piBody)" transform="rotate(-15 100 80)" />
    {/* Ecstatic snow */}
    {mood === "ecstatic" && <><text x="95" y="30" fontSize="12" fill="#bae6fd">❄</text><text x="15" y="35" fontSize="10" fill="#bae6fd">❄</text></>}
  </svg>
);

/* ─── Mila (Raposa) ───────────────────────────────────────────────── */
const MilaSVG: React.FC<PetSVGProps> = ({ mood }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="milaBody" cx="38%" cy="30%" r="68%">
        <stop offset="0%" stopColor="#f48e6a" />
        <stop offset="60%" stopColor="#e8744a" />
        <stop offset="100%" stopColor="#c25a34" />
      </radialGradient>
    </defs>
    {/* Ears */}
    <path d="M25 45 L15 15 L50 35 Z" fill="url(#milaBody)" />
    <path d="M95 45 L105 15 L70 35 Z" fill="url(#milaBody)" />
    <path d="M28 42 L22 25 L42 35 Z" fill="#f5d5a0" opacity="0.6" />
    <path d="M92 42 L98 25 L78 35 Z" fill="#f5d5a0" opacity="0.6" />
    {/* Body */}
    <ellipse cx="60" cy="72" rx="42" ry="38" fill="url(#milaBody)" />
    {/* White snout area */}
    <ellipse cx="60" cy="82" rx="25" ry="18" fill="#f5d5a0" opacity="0.8" />
    {/* Cheeks */}
    <ellipse cx="30" cy="78" rx="8" ry="5" fill="#fca5a5" opacity={0.4} />
    <ellipse cx="90" cy="78" rx="8" ry="5" fill="#fca5a5" opacity={0.4} />
    {/* Nose */}
    <ellipse cx="60" cy="75" rx="3" ry="2" fill="#c25a34" />
    {/* Eyes */}
    <EyeSet mood={mood} cx1={44} cx2={76} cy={62} r={6} eyeColor="#431407" />
    {/* Mouth */}
    <path d={MOUTHS[mood]} stroke="#431407" strokeWidth="2" fill="none" strokeLinecap="round" opacity={0.7} />
    {/* Ecstatic leaves */}
    {mood === "ecstatic" && <><text x="100" y="25" fontSize="12" fill="#fbbf24">✦</text><text x="10" y="30" fontSize="10" fill="#fde68a">★</text></>}
  </svg>
);

/* ─── Gabiru (Gato) ───────────────────────────────────────────────── */
const GabiruSVG: React.FC<PetSVGProps> = ({ mood }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="gabiruBody" cx="38%" cy="30%" r="68%">
        <stop offset="0%" stopColor="#8a9ab0" />
        <stop offset="60%" stopColor="#6b7c93" />
        <stop offset="100%" stopColor="#4f5b6d" />
      </radialGradient>
    </defs>
    {/* Ears */}
    <path d="M30 45 L20 20 L50 40 Z" fill="url(#gabiruBody)" />
    <path d="M90 45 L100 20 L70 40 Z" fill="url(#gabiruBody)" />
    {/* Body */}
    <ellipse cx="60" cy="70" rx="40" ry="38" fill="url(#gabiruBody)" />
    {/* Belly */}
    <ellipse cx="60" cy="80" rx="22" ry="18" fill="#f0f4f8" opacity="0.25" />
    {/* Eyes */}
    <EyeSet mood={mood} cx1={44} cx2={76} cy={58} r={5.5} eyeColor="#1e293b" highlightColor="#cbd5e1" />
    {/* Nose */}
    <ellipse cx="60" cy="68" rx="2.5" ry="1.8" fill="#4f5b6d" opacity={0.8} />
    {/* Mouth */}
    <path d={MOUTHS[mood]} stroke="#1e293b" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity={0.8} />
    {/* Ecstatic paws */}
    {mood === "ecstatic" && <><text x="98" y="28" fontSize="12" fill="#94a3b8">🐾</text><text x="10" y="32" fontSize="10" fill="#94a3b8">🐾</text></>}
  </svg>
);

/* ─── Registry ─────────────────────────────────────────────────────── */
export const PET_DEFINITIONS: Record<PetId, PetDef> = {
  mi: {
    id: "mi", name: "Mi",
    description: "Animada e carinhosa — celebra cada tarefa! 🐸",
    primaryColor: "#4ade80", glowColor: "rgba(74,222,128,0.45)",
    SVG: MiSVG,
  },
  kuro: {
    id: "kuro", name: "Kuro",
    description: "Calmo, misterioso. Adora noites produtivas 🌙",
    primaryColor: "#1e1b4b", glowColor: "rgba(99,102,241,0.3)",
    SVG: KuroSVG,
  },
  mochi: {
    id: "mochi", name: "Pi",
    description: "Elegante e focado — um pinguim de muita classe 🐧",
    primaryColor: "#1a1a2e", glowColor: "rgba(74,158,190,0.35)",
    SVG: PiSVG,
  },
  hoshi: {
    id: "hoshi", name: "Mila",
    description: "Esperta e curiosa — adora descobrir novas tarefas 🦊",
    primaryColor: "#e8744a", glowColor: "rgba(232,116,74,0.4)",
    SVG: MilaSVG,
  },
  yuki: {
    id: "yuki", name: "Gabiru",
    description: "Indiferente... até você terminar tudo! 🐈‍⬛",
    primaryColor: "#6b7c93", glowColor: "rgba(107,124,147,0.35)",
    SVG: GabiruSVG,
  },
};
