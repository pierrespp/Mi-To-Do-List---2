import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

// ­ƒìí Trans Pride Dango (Azul Beb├¬, Rosa, Branco)
export const DangoPrideIcon: React.FC<IconProps> = ({ size = 32, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Skewer Stick */}
    <rect x="30" y="8" width="4" height="48" rx="2" fill="#d7ccc8" />
    <rect x="30" y="52" width="4" height="8" fill="#8d6e63" />

    {/* Top Ball - Baby Blue */}
    <circle cx="32" cy="18" r="10" fill="#bae6fd" stroke="#7dd3fc" strokeWidth="1.5" />
    <path d="M 28 17 Q 30 15 32 17" stroke="#0369a1" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 32 17 Q 34 15 36 17" stroke="#0369a1" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="27" cy="20" r="2" fill="#f43f5e" opacity="0.65" filter="blur(0.5px)" />
    <circle cx="37" cy="20" r="2" fill="#f43f5e" opacity="0.65" filter="blur(0.5px)" />

    {/* Middle Ball - Pink */}
    <circle cx="32" cy="32" r="10" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" />
    <circle cx="28" cy="31" r="1.5" fill="#9d174d" />
    <circle cx="36" cy="31" r="1.5" fill="#9d174d" />
    <path d="M 31 34 Q 32 36 33 34" stroke="#9d174d" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="26" cy="33" r="2.5" fill="#ec4899" opacity="0.75" filter="blur(0.5px)" />
    <circle cx="38" cy="33" r="2.5" fill="#ec4899" opacity="0.75" filter="blur(0.5px)" />

    {/* Bottom Ball - Pure White */}
    <circle cx="32" cy="46" r="10" fill="#ffffff" stroke="#f472b6" strokeWidth="1.5" />
    <path d="M 27 46 Q 30 43 31 46" stroke="#db2777" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 33 46 Q 34 43 37 46" stroke="#db2777" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 31 49 Q 32 50 33 49" stroke="#db2777" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="26" cy="47" r="2" fill="#f472b6" opacity="0.8" filter="blur(0.5px)" />
    <circle cx="38" cy="47" r="2" fill="#f472b6" opacity="0.8" filter="blur(0.5px)" />
  </svg>
);

// ­ƒîÖ Sleeping Moon with Rainbow Nightcap
export const MoonPrideIcon: React.FC<IconProps> = ({ size = 32, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Golden Moon */}
    <path d="M 24 12 A 20 20 0 1 0 52 40 A 16 16 0 1 1 24 12 Z" fill="url(#moonGrad)" filter="drop-shadow(0 2px 8px rgba(251,191,36,0.3))" />
    
    {/* Rainbow Sleeping Cap */}
    <path d="M 24 12 C 26 8, 36 2, 44 8 C 42 12, 32 14, 24 12 Z" fill="url(#capRainbow)" />
    {/* Cap Pompon */}
    <circle cx="45" cy="8" r="4.5" fill="#ffffff" stroke="#a78bfa" strokeWidth="1" />

    {/* Sleeping Face */}
    <path d="M 18 36 Q 21 39 24 36" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
    <path d="M 29 34 Q 32 37 35 34" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="38" r="3" fill="#f43f5e" opacity="0.7" filter="blur(0.5px)" />
    <circle cx="34" cy="36" r="3" fill="#f43f5e" opacity="0.7" filter="blur(0.5px)" />

    <defs>
      <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#fde047" />
      </linearGradient>
      <linearGradient id="capRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="25%" stopColor="#fb923c" />
        <stop offset="50%" stopColor="#fde047" />
        <stop offset="75%" stopColor="#4ade80" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
    </defs>
  </svg>
);

// ÔÿÇ´©Å Radiant Pride Sun with Rainbow Rays
export const SunPrideIcon: React.FC<IconProps> = ({ size = 32, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Rainbow Rays Outer Conic */}
    <circle cx="32" cy="32" r="22" fill="url(#sunRaysGrad)" />
    <circle cx="32" cy="32" r="16" fill="#fde047" stroke="#eab308" strokeWidth="1.5" />

    {/* Sun Cute Face */}
    <circle cx="26" cy="30" r="2" fill="#713f12" />
    {/* Wink */}
    <path d="M 35 29 Q 38 31 40 29" stroke="#713f12" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M 29 34 Q 32 37 35 34" stroke="#713f12" strokeWidth="1.5" strokeLinecap="round" />
    
    <circle cx="23" cy="32" r="3" fill="#f43f5e" opacity="0.8" filter="blur(0.5px)" />
    <circle cx="41" cy="32" r="3" fill="#f43f5e" opacity="0.8" filter="blur(0.5px)" />

    <defs>
      <radialGradient id="sunRaysGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="20%" stopColor="#f97316" />
        <stop offset="40%" stopColor="#eab308" />
        <stop offset="60%" stopColor="#22c55e" />
        <stop offset="80%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#ec4899" />
      </radialGradient>
    </defs>
  </svg>
);

// ­ƒ½Â Cute Heart-Hands with glowing pride gradient
export const HeartHandsPrideIcon: React.FC<IconProps> = ({ size = 32, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Inner Glowing Pride Heart */}
    <path d="M 32 40 C 32 40, 20 28, 20 22 C 20 17, 25 14, 30 18 C 32 20, 32 20, 32 20 C 32 20, 32 20, 34 18 C 39 14, 44 17, 44 22 C 44 28, 32 40, 32 40 Z" fill="url(#handsPrideGrad)" filter="drop-shadow(0 0 6px rgba(236,72,153,0.4))" />

    {/* Hands Overlay */}
    <path d="M 12 40 C 14 36, 18 30, 24 30 C 28 30, 30 33, 31 35 C 31.5 36, 32 36, 32.5 35 C 33.5 33, 35.5 30, 39.5 30 C 45.5 30, 49.5 36, 51.5 40 C 53.5 44, 49.5 48, 44.5 48 C 39.5 48, 37.5 44, 35.5 44 C 33.5 44, 32 46, 32 46 C 32 46, 30.5 44, 28.5 44 C 26.5 44, 24.5 48, 19.5 48 C 14.5 48, 10.5 44, 12 40 Z" fill="#ffedd5" stroke="#f97316" strokeWidth="1.5" />
    
    {/* Cute Finger details & cheeks */}
    <circle cx="22" cy="38" r="1.5" fill="#f43f5e" opacity="0.6" filter="blur(0.5px)" />
    <circle cx="42" cy="38" r="1.5" fill="#f43f5e" opacity="0.6" filter="blur(0.5px)" />

    <defs>
      <linearGradient id="handsPrideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="50%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
  </svg>
);

// ÔÜí Kawaii Pride Lightning Bolt (Winking and shiny)
export const LightningPrideIcon: React.FC<IconProps> = ({ size = 32, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Shadow & Glow */}
    <path d="M 38 4 L 14 36 L 28 36 L 22 60 L 50 24 L 32 24 Z" fill="url(#boltGrad)" filter="drop-shadow(0 2px 10px rgba(251,191,36,0.5))" />
    
    {/* Winking Face */}
    <circle cx="28" cy="28" r="2.5" fill="#713f12" />
    <path d="M 35 26 C 37 28, 39 28, 41 26" stroke="#713f12" strokeWidth="2" strokeLinecap="round" />
    <path d="M 29 33 C 31 35, 33 35, 35 33" stroke="#713f12" strokeWidth="1.8" strokeLinecap="round" />
    
    <circle cx="24" cy="31" r="3" fill="#f43f5e" opacity="0.75" filter="blur(0.5px)" />
    <circle cx="40" cy="30" r="3" fill="#f43f5e" opacity="0.75" filter="blur(0.5px)" />

    <defs>
      <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#fb923c" />
      </linearGradient>
    </defs>
  </svg>
);

// ­ƒî┐ Magical Herb with Rainbow sparkles
export const LeafPrideIcon: React.FC<IconProps> = ({ size = 32, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M 12 52 C 22 52, 42 46, 48 30 C 54 14, 52 10, 48 10 C 38 10, 22 22, 16 38 C 12 48, 12 52, 12 52 Z" fill="url(#leafGrad)" stroke="#16a34a" strokeWidth="1.5" />
    <path d="M 12 52 C 20 46, 32 38, 48 30" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />

    {/* Sparkles */}
    <circle cx="48" cy="22" r="3" fill="#e879f9" filter="drop-shadow(0 0 4px #e879f9)" />
    <circle cx="38" cy="14" r="2" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
    <circle cx="22" cy="26" r="2.5" fill="#fde047" filter="drop-shadow(0 0 4px #fde047)" />

    {/* Face */}
    <circle cx="28" cy="38" r="1.5" fill="#14532d" />
    <circle cx="34" cy="35" r="1.5" fill="#14532d" />
    <circle cx="26" cy="40" r="2" fill="#f472b6" opacity="0.7" filter="blur(0.5px)" />
    <circle cx="36" cy="37" r="2" fill="#f472b6" opacity="0.7" filter="blur(0.5px)" />

    <defs>
      <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="100%" stopColor="#4ade80" />
      </linearGradient>
    </defs>
  </svg>
);

// ­ƒÿ┤/­ƒÆñ Sleeping Pride Bubbles
export const SleepingPrideIcon: React.FC<IconProps> = ({ size = 32, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Big Bubble */}
    <circle cx="24" cy="40" r="14" fill="url(#bubbleGrad1)" stroke="#f472b6" strokeWidth="1" opacity="0.8" />
    <path d="M 18 36 Q 20 38 22 36" stroke="#9d174d" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 26 36 Q 28 38 30 36" stroke="#9d174d" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Mid Bubble */}
    <circle cx="44" cy="24" r="10" fill="url(#bubbleGrad2)" stroke="#a78bfa" strokeWidth="1" opacity="0.75" />
    <path d="M 40 22 Q 42 24 44 22" stroke="#6d28d9" strokeWidth="1.2" strokeLinecap="round" />
    
    {/* Small Zz Bubble */}
    <circle cx="32" cy="10" r="6" fill="url(#bubbleGrad3)" stroke="#38bdf8" strokeWidth="1" opacity="0.7" />

    <defs>
      <linearGradient id="bubbleGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(251,207,232,0.6)" />
        <stop offset="100%" stopColor="rgba(244,114,182,0.15)" />
      </linearGradient>
      <linearGradient id="bubbleGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(233,213,255,0.6)" />
        <stop offset="100%" stopColor="rgba(167,139,250,0.15)" />
      </linearGradient>
      <linearGradient id="bubbleGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(224,242,254,0.6)" />
        <stop offset="100%" stopColor="rgba(56,189,248,0.15)" />
      </linearGradient>
    </defs>
  </svg>
);

// ­ƒî© Sakura Blossom with Pride Core
export const SakuraPrideIcon: React.FC<IconProps> = ({ size = 32, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Five Petals */}
    <g filter="drop-shadow(0 2px 6px rgba(244,114,182,0.3))">
      <path d="M 32 32 C 32 18, 20 8, 32 8 C 44 8, 32 18, 32 32 Z" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1" />
      <path d="M 32 32 C 46 32, 56 20, 56 32 C 56 44, 46 32, 32 32 Z" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1" />
      <path d="M 32 32 C 32 46, 44 56, 32 56 C 20 56, 32 46, 32 32 Z" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1" />
      <path d="M 32 32 C 18 32, 8 44, 8 32 C 8 20, 18 32, 32 32 Z" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1" />
    </g>

    {/* Center Pride Core */}
    <circle cx="32" cy="32" r="10" fill="url(#sakuraPrideCore)" stroke="#ec4899" strokeWidth="1.5" />
    
    {/* Smiling Face */}
    <circle cx="29" cy="30" r="1" fill="#9d174d" />
    <circle cx="35" cy="30" r="1" fill="#9d174d" />
    <path d="M 30 33 Q 32 35 34 33" stroke="#9d174d" strokeWidth="1" strokeLinecap="round" />

    <defs>
      <linearGradient id="sakuraPrideCore" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="50%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#fde047" />
      </linearGradient>
    </defs>
  </svg>
);

// ­ƒÑ║ Crying Heart with Rainbow Band-aid
export const SadPrideIcon: React.FC<IconProps> = ({ size = 32, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Heart Body */}
    <path d="M 32 54 C 32 54, 8 36, 8 22 C 8 13, 16 8, 24 14 C 28 17, 32 20, 32 20 C 32 20, 36 17, 40 14 C 48 8, 56 13, 56 22 C 56 36, 32 54, 32 54 Z" fill="#fecdd3" stroke="#f43f5e" strokeWidth="1.5" />

    {/* Shiny Big Crying Eyes */}
    <circle cx="22" cy="24" r="4.5" fill="#4c0519" />
    <circle cx="21" cy="22.5" r="1.5" fill="#ffffff" />
    <circle cx="42" cy="24" r="4.5" fill="#4c0519" />
    <circle cx="41" cy="22.5" r="1.5" fill="#ffffff" />

    {/* Tears */}
    <path d="M 23 28 C 23 32, 21 34, 20 34" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
    <path d="M 43 28 C 43 32, 41 34, 40 34" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

    {/* Rainbow Band-aid */}
    <rect x="20" y="36" width="24" height="8" rx="2" transform="rotate(-15 32 40)" fill="url(#bandaidRainbow)" stroke="#f43f5e" strokeWidth="1" />
    <rect x="29" y="36.5" width="6" height="7" fill="#ffffff" opacity="0.9" />

    <defs>
      <linearGradient id="bandaidRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(236,72,153,0.85)" />
        <stop offset="50%" stopColor="rgba(251,191,36,0.85)" />
        <stop offset="100%" stopColor="rgba(56,189,248,0.85)" />
      </linearGradient>
    </defs>
  </svg>
);

// ­ƒîê Pastel Rainbow with Blushing Clouds
export const RainbowPrideIcon: React.FC<IconProps> = ({ size = 32, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Rainbow Arches */}
    <path d="M 12 44 A 20 20 0 0 1 52 44" stroke="#f472b6" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    <path d="M 17 44 A 15 15 0 0 1 47 44" stroke="#fbbf24" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    <path d="M 22 44 A 10 10 0 0 1 42 44" stroke="#38bdf8" strokeWidth="4.5" fill="none" strokeLinecap="round" />

    {/* Blushing Clouds at ends */}
    <path d="M 6 42 C 6 38, 12 36, 15 39 C 17 37, 21 39, 21 42 C 21 45, 6 45, 6 42 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
    <circle cx="10" cy="42" r="1.5" fill="#f43f5e" opacity="0.75" />
    <circle cx="17" cy="42" r="1.5" fill="#f43f5e" opacity="0.75" />

    <path d="M 43 42 C 43 39, 47 37, 49 39 C 52 36, 58 38, 58 42 C 58 45, 43 45, 43 42 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
    <circle cx="47" cy="42" r="1.5" fill="#f43f5e" opacity="0.75" />
    <circle cx="54" cy="42" r="1.5" fill="#f43f5e" opacity="0.75" />
  </svg>
);

// Ô¡É Cute Blushing Star
export const StarPrideIcon: React.FC<IconProps> = ({ size = 32, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Star Body */}
    <path d="M 32 4 L 40 22 L 58 24 L 44 38 L 48 58 L 32 48 L 16 58 L 20 38 L 6 24 L 24 22 Z" fill="url(#starGrad)" stroke="#eab308" strokeWidth="1.5" filter="drop-shadow(0 2px 6px rgba(251,191,36,0.4))" />

    {/* Big Anime Eyes */}
    <circle cx="25" cy="30" r="2.5" fill="#713f12" />
    <circle cx="24.2" cy="29" r="0.8" fill="#ffffff" />
    <circle cx="39" cy="30" r="2.5" fill="#713f12" />
    <circle cx="38.2" cy="29" r="0.8" fill="#ffffff" />

    {/* Blushing cheeks & smile */}
    <path d="M 30 34 Q 32 36 34 34" stroke="#713f12" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="20" cy="33" r="3" fill="#f43f5e" opacity="0.8" filter="blur(0.5px)" />
    <circle cx="44" cy="33" r="3" fill="#f43f5e" opacity="0.8" filter="blur(0.5px)" />

    <defs>
      <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#fde047" />
      </linearGradient>
    </defs>
  </svg>
);

// ­ƒÄÇ Ribbon with Pride Heart Pin
export const RibbonPrideIcon: React.FC<IconProps> = ({ size = 32, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Ribbon Loops */}
    <path d="M 32 26 C 26 14, 12 14, 18 28 C 22 36, 32 28, 32 26 Z" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" />
    <path d="M 32 26 C 38 14, 52 14, 46 28 C 42 36, 32 28, 32 26 Z" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" />
    
    {/* Ribbon Tails */}
    <path d="M 28 28 L 14 52 L 24 48 L 30 32 Z" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.2" />
    <path d="M 36 28 L 50 52 L 40 48 L 34 32 Z" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.2" />

    {/* Center Heart Pride Pin */}
    <path d="M 32 30 C 32 30, 26 24, 26 21 C 26 18, 29 16, 32 19 C 35 16, 38 18, 38 21 C 38 24, 32 30, 32 30 Z" fill="url(#ribbonPinGrad)" stroke="#ec4899" strokeWidth="1.5" />

    <defs>
      <linearGradient id="ribbonPinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
    </defs>
  </svg>
);

// Ôÿü´©Å Cute Smiling Cloud
export const CloudPrideIcon: React.FC<IconProps> = ({ size = 32, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Cloud body */}
    <path d="M 18 44 C 12 44, 8 40, 8 34 C 8 28, 14 26, 18 28 C 20 22, 28 18, 36 20 C 44 18, 52 24, 52 32 C 56 32, 58 36, 58 40 C 58 44, 54 46, 50 46 C 46 46, 18 44, 18 44 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" filter="drop-shadow(0 2px 6px rgba(167,139,250,0.2))" />

    {/* Eyes and Mouth */}
    <circle cx="26" cy="33" r="2" fill="#475569" />
    <circle cx="38" cy="33" r="2" fill="#475569" />
    <path d="M 30 36 Q 32 38 34 36" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
    
    <circle cx="21" cy="35" r="2.5" fill="#f472b6" opacity="0.75" filter="blur(0.5px)" />
    <circle cx="43" cy="35" r="2.5" fill="#f472b6" opacity="0.75" filter="blur(0.5px)" />
  </svg>
);
