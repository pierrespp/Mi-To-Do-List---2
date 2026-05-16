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
  ecstatic: "M54 72 Q60 80 66 72",
  happy:    "M55 74 Q60 78 65 74",
  neutral:  "M54 74 L66 74",
  worried:  "M54 74 Q60 70 66 74",
  sad:      "M53 76 Q60 70 67 76",
  sleepy:   "M55 75 L65 75",
};

function EyeSet({ mood, cx1, cx2, cy, r = 5.5, eyeColor, highlightColor = "white" }: {
  mood: PetMood; cx1: number; cx2: number; cy: number; r?: number;
  eyeColor: string; highlightColor?: string;
}) {
  const isKawaii = true; // Forcing Kawaii style in the helpers

  if (mood === "ecstatic") {
    return (
      <>
        <path d={`M${cx1 - r} ${cy} L${cx1} ${cy - r} L${cx1 + r} ${cy}`} stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M${cx2 - r} ${cy} L${cx2} ${cy - r} L${cx2 + r} ${cy}`} stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  }

  if (mood === "sleepy") {
    return (
      <>
        <path d={`M${cx1 - r} ${cy} Q${cx1} ${cy + r * 0.5} ${cx1 + r} ${cy}`} stroke={eyeColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d={`M${cx2 - r} ${cy} Q${cx2} ${cy + r * 0.5} ${cx2 + r} ${cy}`} stroke={eyeColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </>
    );
  }

  return (
    <>
      <circle cx={cx1} cy={cy} r={r} fill={eyeColor} className="eye-left" />
      <circle cx={cx2} cy={cy} r={r} fill={eyeColor} className="eye-right" />
      {mood !== "sad" && mood !== "worried" && (
        <>
          <circle cx={cx1 - r * 0.3} cy={cy - r * 0.3} r={r * 0.25} fill={highlightColor} opacity={0.9} />
          <circle cx={cx2 - r * 0.3} cy={cy - r * 0.3} r={r * 0.25} fill={highlightColor} opacity={0.9} />
        </>
      )}
    </>
  );
}

/* ─── Mi (Green frog) ──────────────────────────────────────────────── */

/** Wide frog-characteristic mouths — much broader than the generic MOUTHS */
const FROG_MOUTHS: Record<PetMood, string> = {
  ecstatic: "M38 78 Q60 98 82 78",
  happy:    "M40 78 Q60 92 80 78",
  neutral:  "M40 78 L80 78",
  worried:  "M40 78 Q60 69 80 78",
  sad:      "M38 82 Q60 70 82 82",
  sleepy:   "M42 78 L78 78",
};

const MiSVG: React.FC<PetSVGProps> = ({ mood }) => {
  /** Frog-specific eyes: protruding bump mounds on top of head */
  const renderFrogEyes = () => {
    const bumpL = { cx: 38, cy: 38, r: 13 };
    const bumpR = { cx: 82, cy: 38, r: 13 };

    // Shared bump mounds (always rendered)
    const bumps = (
      <>
        <circle cx={bumpL.cx} cy={bumpL.cy} r={bumpL.r} fill="url(#miEyeBump)" />
        {/* Light highlight on left bump */}
        <circle cx={35} cy={30} r={5.5} fill="white" opacity={0.6} />
        
        <circle cx={bumpR.cx} cy={bumpR.cy} r={bumpR.r} fill="url(#miEyeBump)" />
        {/* Light highlight on right bump */}
        <circle cx={85} cy={30} r={5.5} fill="white" opacity={0.6} />
      </>
    );

    if (mood === "ecstatic") {
      return (
        <>
          {bumps}
          {/* ^ happy V-eyes */}
          <path d="M31 38 L38 30 L45 38" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M75 38 L82 30 L89 38" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    }

    if (mood === "sleepy") {
      return (
        <>
          {bumps}
          {/* Half-closed droopy lids */}
          <path d="M31 37 Q38 43 45 37" stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M75 37 Q82 43 89 37" stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      );
    }

    return (
      <>
        {bumps}
        {/* Pupils — elevated inside the bump */}
        <circle cx={38} cy={35} r={8} fill="#15803d" />
        <circle cx={82} cy={35} r={8} fill="#15803d" />
        {mood !== "sad" && mood !== "worried" && (
          <>
            {/* Shine/sparkle in pupils — small white circle displaced upward */}
            <circle cx={37} cy={27} r={3.5} fill="white" opacity={0.9} />
            <circle cx={81} cy={27} r={3.5} fill="white" opacity={0.9} />
          </>
        )}
      </>
    );
  };

  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="miBody" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#d1fae5" />
          <stop offset="100%" stopColor="#4ade80" />
        </radialGradient>
        {/* Slightly richer green for the raised eye dome */}
        <radialGradient id="miEyeBump" cx="38%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#bbf7d0" />
          <stop offset="100%" stopColor="#22c55e" />
        </radialGradient>
        {/* Belly gradient for smooth integration */}
        <radialGradient id="miBelly" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fffde7" />
          <stop offset="100%" stopColor="#d4e09c" />
        </radialGradient>
        <radialGradient id="miGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient glow */}
      <ellipse cx="60" cy="70" rx="55" ry="55" fill="url(#miGlow)" />

      {/* Body */}
      <circle cx="60" cy="92" r="24" fill="url(#miBody)" className="pet-body" />
      {/* Integrated belly with smooth gradient transition */}
      <ellipse cx="60" cy="100" rx="16" ry="10" fill="url(#miBelly)" className="pet-belly" opacity="0.85" />
      {/* Light highlight on body */}
      <ellipse cx="54" cy="82" rx={10} ry={8} fill="white" opacity={0.6} />

      {/* Head — large kawaii frog head, shifted slightly lower to frame eye bumps */}
      <ellipse cx="60" cy="65" rx="44" ry="36" fill="url(#miBody)" className="pet-head" />
      {/* Light highlight on head for volume */}
      <ellipse cx="54" cy="42" rx={16} ry={12} fill="white" opacity={0.6} />

      {/* Frog protruding eye bumps + pupils — THE frog identity marker */}
      {renderFrogEyes()}

      {/* Cheeks — subtle and soft */}
      <ellipse cx="22" cy="74" rx={7.5} ry={5} fill="#fda4af" opacity={mood === "ecstatic" ? 0.55 : 0.38} className="cheek-left" />
      <ellipse cx="98" cy="74" rx={7.5} ry={5} fill="#fda4af" opacity={mood === "ecstatic" ? 0.55 : 0.38} className="cheek-right" />

      {/* Frog nostrils — small rounded bumps on snout */}
      <ellipse cx="54" cy="71" rx="2.2" ry="2.8" fill="#16a34a" opacity={0.55} />
      <ellipse cx="66" cy="71" rx="2.2" ry="2.8" fill="#16a34a" opacity={0.55} />

      {/* Wide characteristic frog mouth */}
      <path d={FROG_MOUTHS[mood]} stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round" className="pet-mouth" />

      {/* Paws — small chubby ellipses instead of circles */}
      <ellipse cx="42" cy="110" rx={4.5} ry={5.5} fill="#16a34a" />
      <ellipse cx="78" cy="110" rx={4.5} ry={5.5} fill="#16a34a" />

      {/* Ecstatic stars */}
      {mood === "ecstatic" && (
        <g className="celebration-fx">
          <text x="95" y="28" fontSize="14" fill="#fbbf24">★</text>
          <text x="10" y="30" fontSize="11" fill="#4ade80">✦</text>
        </g>
      )}
    </svg>
  );
};

/* ─── Kuro (Black cat) ─────────────────────────────────────────────── */
const KuroSVG: React.FC<PetSVGProps> = ({ mood }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="kuroBody" cx="38%" cy="30%" r="68%">
        <stop offset="0%" stopColor="#312e81" />
        <stop offset="60%" stopColor="#1e1b4b" />
        <stop offset="100%" stopColor="#0f0e26" />
      </radialGradient>
      {/* Belly gradient with contrast */}
      <radialGradient id="kuroBelly" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#4c1d95" />
        <stop offset="100%" stopColor="#1e1b4b" />
      </radialGradient>
      <radialGradient id="kuroGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Ambient glow */}
    <ellipse cx="60" cy="70" rx="55" ry="55" fill="url(#kuroGlow)" />
    {/* Pointed ears */}
    <path d="M28 46 L16 16 L46 40Z" fill="url(#kuroBody)" />
    <path d="M92 46 L104 16 L74 40Z" fill="url(#kuroBody)" />
    <path d="M28 43 L20 20 L42 38Z" fill="#4c1d95" opacity="0.6" />
    <path d="M92 43 L100 20 L78 38Z" fill="#4c1d95" opacity="0.6" />
    {/* Body */}
    <ellipse cx="60" cy="70" rx="40" ry="38" fill="url(#kuroBody)" className="pet-body" />
    {/* Belly with gradient */}
    <ellipse cx="60" cy="80" rx="22" ry="18" fill="url(#kuroBelly)" className="pet-belly" opacity="0.9" />
    {/* Purple-tinted highlight on head for dark cat */}
    <ellipse cx="54" cy="50" rx={12} ry={10} fill="#C9B8E8" opacity={0.25} />
    {/* Eyes */}
    <EyeSet mood={mood} cx1={44} cx2={76} cy={58} r={5.5} eyeColor="#e0e7ff" highlightColor="#c7d2fe" />
    {/* Eyes shine */}
    {mood !== "sad" && mood !== "worried" && (
      <>
        <circle cx={42} cy={51} r={3.5} fill="white" opacity={0.9} className="eye-left" />
        <circle cx={78} cy={51} r={3.5} fill="white" opacity={0.9} className="eye-right" />
      </>
    )}
    {/* Whiskers */}
    <line x1="22" y1="66" x2="50" y2="68" stroke="#4c1d95" strokeWidth="1.2" opacity="0.7" />
    <line x1="22" y1="71" x2="50" y2="70" stroke="#4c1d95" strokeWidth="1.2" opacity="0.7" />
    <line x1="98" y1="66" x2="70" y2="68" stroke="#4c1d95" strokeWidth="1.2" opacity="0.7" />
    <line x1="98" y1="71" x2="70" y2="70" stroke="#4c1d95" strokeWidth="1.2" opacity="0.7" />
    {/* Cheeks — smaller */}
    <ellipse cx="25" cy="72" rx={6} ry={4} fill="#818cf8" opacity={0.35} />
    <ellipse cx="95" cy="72" rx={6} ry={4} fill="#818cf8" opacity={0.35} />
    {/* Nose */}
    <ellipse cx="60" cy="65" rx="2.5" ry="1.8" fill="#818cf8" opacity={0.8} />
    {/* Mouth */}
    <path d={MOUTHS[mood]} stroke="#818cf8" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity={0.9} className="pet-mouth" />
  </svg>
);

/* ─── Pi (Pinguim Rechonchudo) ────────────────────────────────────── */
const PiSVG: React.FC<PetSVGProps> = ({ mood }) => {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="piBody" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#2D3748" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
        <radialGradient id="piBellyGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </radialGradient>
        <radialGradient id="piGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow de base */}
      <ellipse cx="60" cy="100" rx="55" ry="25" fill="url(#piGlow)" />

      {/* Patinhas Laranja (cx=42/78, cy=112, rx=7, ry=5) */}
      <ellipse cx="42" cy="110" rx="8" ry="5" fill="#FF8C42" />
      <ellipse cx="78" cy="110" rx="8" ry="5" fill="#FF8C42" />

      {/* Nadadeiras (Atrás do corpo) */}
      <ellipse cx="22" cy="85" rx="9" ry="16" fill="url(#piBody)" transform="rotate(15 22 85)" />
      <ellipse cx="98" cy="85" rx="9" ry="16" fill="url(#piBody)" transform="rotate(-15 98 85)" />

      {/* Corpo Circular (XL Style) */}
      <circle cx="60" cy="88" r="32" fill="url(#piBody)" className="pet-body" />
      
      {/* Barriga Branca Arredondada (Centro do corpinho) */}
      <ellipse cx="60" cy="94" rx="24" ry="18" fill="url(#piBellyGrad)" className="pet-belly" opacity="0.95" />

      {/* Cabeça Larga (Kawaii Big Head) */}
      <ellipse cx="60" cy="48" rx="46" ry="40" fill="url(#piBody)" className="pet-head" />
      
      {/* Área Branca do Rosto (Conectada à barriga para o look clássico de pinguim) */}
      <ellipse cx="60" cy="58" rx="34" ry="28" fill="url(#piBellyGrad)" opacity="0.95" />
      
      {/* Highlights de Volume (Cinza claro, sem branco puro) */}
      <ellipse cx="45" cy="32" rx="14" ry="10" fill="#C8C8C8" opacity="0.3" />

      {/* Bico (Mantido) */}
      <path d="M54 62 L60 70 L66 62 Z" fill="#FF8C42" />

      {/* Olhos (Acompanham a cabeça larga) */}
      <g className="pet-eyes">
        <circle cx="42" cy="50" r="7.5" fill="#0F172A" className="eye-left" />
        <circle cx="78" cy="50" r="7.5" fill="#0F172A" className="eye-right" />
        {(mood !== 'sad' && mood !== 'worried') && (
          <>
            <circle cx="40" cy="46" r="3.5" fill="white" opacity="0.9" />
            <circle cx="76" cy="46" r="3.5" fill="white" opacity="0.9" />
          </>
        )}
      </g>

      {/* Boca (Sob o bico) */}
      <path 
        d={MOUTHS[mood] || MOUTHS.neutral} 
        stroke="#FF8C42" 
        strokeWidth="1.5" 
        fill="none" 
        strokeLinecap="round" 
        opacity="0.6" 
        className="pet-mouth" 
      />

      {/* Efeito de neve (mood ecstatic) */}
      {mood === 'ecstatic' && (
        <g className="fx-snow" opacity="0.7">
          <text x="100" y="30" fontSize="14" fill="#E2E8F0">❄</text>
          <text x="10" y="35" fontSize="12" fill="#E2E8F0">❄</text>
        </g>
      )}
    </svg>
  );
};

/* ─── Mila (Raposa Branca) ─────────────────────────────────────────── */
const MilaSVG: React.FC<PetSVGProps> = ({ mood }) => {
  const isHappy = mood === 'happy' || mood === 'ecstatic' || mood === 'excited';
  
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        {/* Gradiente do corpo - Branco perolado para volume */}
        <radialGradient id="milaBody" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F8F3F0" />
        </radialGradient>
        
        {/* Detalhes bege (focinho e barriga) */}
        <radialGradient id="milaDetail" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFF2E2" />
          <stop offset="100%" stopColor="#E8C9A0" />
        </radialGradient>

        <radialGradient id="milaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8C9A0" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#E8C9A0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow de base */}
      <ellipse cx="60" cy="75" rx="50" ry="40" fill="url(#milaGlow)" />

      {/* Cauda volumosa (sugerida atrás do corpo) */}
      <path 
        d="M85 95 C115 95 125 65 105 45 C95 35 80 45 80 65" 
        fill="url(#milaBody)" 
        stroke="#E8C9A0" 
        strokeWidth="1.5" 
        opacity="0.9"
      />
      <path d="M105 45 C110 40 115 45 105 55" fill="#E8C9A0" opacity="0.6" /> {/* Ponta da cauda */}

      {/* Orelhas Pontudas (Fox style) */}
      <g className="pet-ears">
        {/* Orelha Esquerda */}
        <path d="M25 45 L12 5 L48 32 Z" fill="url(#milaBody)" />
        <path d="M28 38 L19 18 L40 30 Z" fill="#FFB7C5" opacity="0.7" />
        {/* Orelha Direita */}
        <path d="M95 45 L108 5 L72 32 Z" fill="url(#milaBody)" />
        <path d="M92 38 L101 18 L80 30 Z" fill="#FFB7C5" opacity="0.7" />
      </g>

      {/* Corpo */}
      <circle cx="60" cy="90" r="30" fill="url(#milaBody)" className="pet-body" />
      <ellipse cx="60" cy="100" rx="16" ry="12" fill="url(#milaDetail)" className="pet-belly" opacity="0.9" />

      {/* Cabeça */}
      <ellipse cx="60" cy="62" rx="42" ry="34" fill="url(#milaBody)" className="pet-head" />
      
      {/* Highlights de volume (Off-white para não estourar no corpo branco) */}
      <ellipse cx="45" cy="45" rx="12" ry="8" fill="#FFFDFB" opacity="0.7" />
      
      {/* Detalhe do Focinho (Bege) */}
      <ellipse cx="60" cy="74" rx="18" ry="14" fill="url(#milaDetail)" opacity="0.85" />

      {/* Olhos - Técnica Kawaii com Eye Shine deslocado */}
      <g className="pet-eyes">
        {mood === 'sleepy' || mood === 'tired' ? (
          <>
            <path d="M40 60 Q45 65 50 60" stroke="#431407" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M70 60 Q75 65 80 60" stroke="#431407" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="45" cy="62" r="7" fill="#431407" className="eye-left" />
            <circle cx="75" cy="62" r="7" fill="#431407" className="eye-right" />
            {(mood !== 'sad' && mood !== 'worried') && (
              <>
                <circle cx="43" cy="58" r="3.2" fill="white" opacity="0.95" />
                <circle cx="73" cy="58" r="3.2" fill="white" opacity="0.95" />
              </>
            )}
          </>
        )}
      </g>

      {/* Bochechas sutis */}
      <circle cx="28" cy="74" r="6" fill="#FFB7C5" opacity="0.3" className="cheek-left" />
      <circle cx="92" cy="74" r="6" fill="#FFB7C5" opacity="0.3" className="cheek-right" />

      {/* Nariz de raposa */}
      <path d="M57 72 L60 75 L63 72 Q60 70 57 72" fill="#3D2B1F" />

      {/* Boca */}
      <path 
        d={MOUTHS[mood] || MOUTHS.neutral} 
        stroke="#431407" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        className="pet-mouth" 
        opacity="0.8" 
      />

      {/* Efeitos de humor */}
      {mood === 'ecstatic' && (
        <g className="fx-stars" opacity="0.8">
          <text x="100" y="30" fontSize="14" fill="#FFB7C5">✿</text>
          <text x="10" y="35" fontSize="12" fill="#E8C9A0">✦</text>
        </g>
      )}
    </svg>
  );
};

/* ─── Gabiru (Gato) ───────────────────────────────────────────────── */
/* ─── Gabiru (Gato Cinza - Versão Final Rechonchuda) ─────────────── */
const GabiruSVG: React.FC<PetSVGProps> = ({ mood }) => {
  const isSleepy = mood === 'sleepy' || mood === 'tired' || mood === 'neutral';
  
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="gabiruBody" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#BCC6CC" />
          <stop offset="100%" stopColor="#9BA8AF" />
        </radialGradient>
        
        <radialGradient id="gabiruBellyGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#F1F4F6" />
          <stop offset="100%" stopColor="#DFE6E9" />
        </radialGradient>

        <radialGradient id="gabiruGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9BA8AF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#9BA8AF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow de base */}
      <ellipse cx="60" cy="100" rx="55" ry="25" fill="url(#gabiruGlow)" />

      {/* Patas Laterais (Atrás do corpo) */}
      <ellipse cx="32" cy="105" rx="7" ry="5" fill="#9BA8AF" transform="rotate(-15 32 105)" />
      <ellipse cx="88" cy="105" rx="7" ry="5" fill="#9BA8AF" transform="rotate(15 88 105)" />

      {/* Corpo Rechonchudo (cx=60, cy=95, rx=30, ry=22) */}
      <ellipse cx="60" cy="95" rx="30" ry="22" fill="url(#gabiruBody)" className="pet-body" />
      
      {/* Barriga (cx=60, cy=98, rx=18, ry=13) */}
      <ellipse cx="60" cy="98" rx="18" ry="13" fill="url(#gabiruBellyGrad)" className="pet-belly" opacity="0.95" />

      {/* Orelhas Arredondadas (Ajustadas para a cabeça em cy=47) */}
      <g className="pet-ears">
        <path d="M32 30 Q18 0 45 15 L55 40 Z" fill="url(#gabiruBody)" />
        <path d="M88 30 Q102 0 75 15 L65 40 Z" fill="url(#gabiruBody)" />
        <path d="M35 25 Q30 12 40 18 Z" fill="#5C6970" opacity="0.3" />
        <path d="M85 25 Q90 12 80 18 Z" fill="#5C6970" opacity="0.3" />
      </g>

      {/* Cabeça Larga (Subida para cy=47) */}
      <ellipse cx="60" cy="47" rx="48" ry="42" fill="url(#gabiruBody)" className="pet-head" />
      
      {/* Highlights de volume */}
      <ellipse cx="45" cy="30" rx="16" ry="12" fill="#E8ECEE" opacity="0.4" />
      
      {/* Detalhes de volume na testa */}
      <path d="M52 15 Q60 25 68 15" stroke="#5C6970" strokeWidth="3" opacity="0.2" strokeLinecap="round" />
      
      {/* Olhos (Acompanham a subida da cabeça) */}
      <g className="pet-eyes">
        {isSleepy ? (
          <>
            <path d="M32 50 Q42 57 52 50" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" className="eye-left" />
            <path d="M68 50 Q78 57 88 50" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" className="eye-right" />
          </>
        ) : (
          <>
            <circle cx="42" cy="50" r="7.5" fill="#1E293B" className="eye-left" />
            <circle cx="78" cy="50" r="7.5" fill="#1E293B" className="eye-right" />
            {(mood !== 'sad' && mood !== 'worried') && (
              <>
                <circle cx="40" cy="46" r="3.5" fill="#E8ECEE" opacity="0.9" />
                <circle cx="76" cy="46" r="3.5" fill="#E8ECEE" opacity="0.9" />
              </>
            )}
          </>
        )}
      </g>

      {/* Bochechas */}
      <circle cx="22" cy="60" r="6" fill="#94A3B8" opacity="0.2" />
      <circle cx="98" cy="60" r="6" fill="#94A3B8" opacity="0.2" />

      {/* Nariz */}
      <circle cx="60" cy="59" r="2.5" fill="#5C6970" />

      {/* Bigodes */}
      <g opacity="0.4" stroke="#5C6970" strokeWidth="1.2">
        <line x1="15" y1="53" x2="35" y2="57" />
        <line x1="15" y1="61" x2="35" y2="60" />
        <line x1="105" y1="53" x2="85" y2="57" />
        <line x1="105" y1="61" x2="85" y2="60" />
      </g>

      {/* Boca */}
      <path 
        d="M52 67 Q60 73 68 67" 
        stroke="#1E293B" 
        strokeWidth="2.2" 
        fill="none" 
        strokeLinecap="round" 
        className="pet-mouth" 
        opacity="0.8" 
      />
    </svg>
  );
};

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
