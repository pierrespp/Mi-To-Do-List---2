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

/* ─── Mochi (Cream bear) ───────────────────────────────────────────── */
const MochiSVG: React.FC<PetSVGProps> = ({ mood }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="mochiBody" cx="38%" cy="30%" r="68%">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="55%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#fde68a" />
      </radialGradient>
    </defs>
    {/* Ears */}
    <circle cx="28" cy="36" r="15" fill="url(#mochiBody)" />
    <circle cx="92" cy="36" r="15" fill="url(#mochiBody)" />
    <circle cx="28" cy="36" r="9" fill="#fde68a" opacity="0.5" />
    <circle cx="92" cy="36" r="9" fill="#fde68a" opacity="0.5" />
    {/* Very round body */}
    <circle cx="60" cy="70" r="42" fill="url(#mochiBody)" />
    {/* Belly patch */}
    <ellipse cx="60" cy="76" rx="26" ry="22" fill="white" opacity="0.38" />
    {/* Cheeks */}
    <ellipse cx="26" cy="70" rx="9" ry="6" fill="#fca5a5" opacity={0.35} />
    <ellipse cx="94" cy="70" rx="9" ry="6" fill="#fca5a5" opacity={0.35} />
    {/* Nose */}
    <ellipse cx="60" cy="66" rx="3" ry="2" fill="#d97706" opacity={0.6} />
    {/* Eyes */}
    <EyeSet mood={mood} cx1={43} cx2={77} cy={58} r={6} eyeColor="#78350f" />
    {/* Mouth */}
    <path d={MOUTHS[mood]} stroke="#d97706" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity={0.8} />
    {/* Sleepy zzs */}
    {mood === "sleepy" && <><text x="90" y="30" fontSize="11" fill="#d97706" opacity="0.5">z</text><text x="99" y="20" fontSize="15" fill="#d97706" opacity="0.3">z</text></>}
  </svg>
);

/* ─── Hoshi (Golden star) ──────────────────────────────────────────── */
const HoshiSVG: React.FC<PetSVGProps> = ({ mood }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="hoshiBody" cx="40%" cy="30%" r="68%">
        <stop offset="0%" stopColor="#fef9c3" />
        <stop offset="55%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#d97706" />
      </radialGradient>
      <radialGradient id="hoshiGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Glow aura */}
    <circle cx="60" cy="62" r="52" fill="url(#hoshiGlow)" />
    {/* Star body */}
    <path d="M60,20 L72,46 L100,49 L79,68 L85,96 L60,82 L35,96 L41,68 L20,49 L48,46 Z" fill="url(#hoshiBody)" />
    {/* Inner highlight */}
    <path d="M60,32 L68,50 L87,52 L73,64 L77,83 L60,74 L43,83 L47,64 L33,52 L52,50 Z" fill="#fef9c3" opacity="0.3" />
    {/* Cheeks */}
    <ellipse cx="36" cy="65" rx="7" ry="5" fill="#fca5a5" opacity={mood === "ecstatic" ? 0.7 : 0.4} />
    <ellipse cx="84" cy="65" rx="7" ry="5" fill="#fca5a5" opacity={mood === "ecstatic" ? 0.7 : 0.4} />
    {/* Nose */}
    <ellipse cx="60" cy="63" rx="2.5" ry="1.8" fill="#d97706" opacity={0.6} />
    {/* Eyes */}
    <EyeSet mood={mood} cx1={45} cx2={75} cy={55} r={6} eyeColor="#78350f" />
    {/* Mouth */}
    <path d={MOUTHS[mood]} stroke="#d97706" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    {/* Sparkles for ecstatic */}
    {mood === "ecstatic" && <><text x="4" y="24" fontSize="13" fill="#fbbf24">✦</text><text x="100" y="20" fontSize="10" fill="#fef08a">★</text></>}
  </svg>
);

/* ─── Yuki (Blue bunny) ────────────────────────────────────────────── */
const YukiSVG: React.FC<PetSVGProps> = ({ mood }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="yukiBody" cx="38%" cy="30%" r="68%">
        <stop offset="0%" stopColor="#f0f9ff" />
        <stop offset="55%" stopColor="#bae6fd" />
        <stop offset="100%" stopColor="#7dd3fc" />
      </radialGradient>
    </defs>
    {/* Tall floppy ears */}
    <ellipse cx="38" cy="28" rx="12" ry="26" fill="url(#yukiBody)" />
    <ellipse cx="82" cy="28" rx="12" ry="26" fill="url(#yukiBody)" />
    {/* Pink inner ears */}
    <ellipse cx="38" cy="30" rx="6" ry="19" fill="#fce7f3" opacity="0.7" />
    <ellipse cx="82" cy="30" rx="6" ry="19" fill="#fce7f3" opacity="0.7" />
    {/* Body */}
    <ellipse cx="60" cy="74" rx="36" ry="34" fill="url(#yukiBody)" />
    {/* Belly */}
    <ellipse cx="60" cy="78" rx="20" ry="18" fill="white" opacity="0.35" />
    {/* Cheeks */}
    <ellipse cx="28" cy="72" rx="8" ry="5" fill="#f9a8d4" opacity={0.38} />
    <ellipse cx="92" cy="72" rx="8" ry="5" fill="#f9a8d4" opacity={0.38} />
    {/* Nose */}
    <ellipse cx="60" cy="68" rx="3" ry="2" fill="#93c5fd" opacity={0.7} />
    {/* Eyes — shy and small */}
    <EyeSet mood={mood} cx1={46} cx2={74} cy={60} r={5.5} eyeColor="#0369a1" />
    {/* Mouth */}
    <path d={MOUTHS[mood]} stroke="#7dd3fc" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Hiding paws for sad/worried */}
    {(mood === "worried" || mood === "sad") && (
      <>
        <ellipse cx="28" cy="90" rx="12" ry="8" fill="url(#yukiBody)" opacity="0.8" />
        <ellipse cx="92" cy="90" rx="12" ry="8" fill="url(#yukiBody)" opacity="0.8" />
      </>
    )}
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
    id: "mochi", name: "Mochi",
    description: "Sonolento mas leal — reage às suas pausas ☁️",
    primaryColor: "#fef3c7", glowColor: "rgba(253,230,138,0.35)",
    SVG: MochiSVG,
  },
  hoshi: {
    id: "hoshi", name: "Hoshi",
    description: "Energética e motivadora — celebra sequências! 🌟",
    primaryColor: "#fbbf24", glowColor: "rgba(251,191,36,0.5)",
    SVG: HoshiSVG,
  },
  yuki: {
    id: "yuki", name: "Yuki",
    description: "Tímida e gentil — aparece quando você termina tudo 💙",
    primaryColor: "#7dd3fc", glowColor: "rgba(125,211,252,0.4)",
    SVG: YukiSVG,
  },
};
