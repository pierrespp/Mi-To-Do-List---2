import React from "react";

interface StatusPillsProps {
  happiness: number;
  energy: number;
  isKawaii: boolean;
}

function getJoyPill(v: number): { emoji: string; label: string; bg: string; text: string } {
  if (v >= 80) return { emoji: "🌸", label: "Radiante",  bg: "rgba(253,164,175,0.25)", text: "#f43f5e" };
  if (v >= 60) return { emoji: "☀️", label: "Feliz",     bg: "rgba(253,224,71,0.22)",  text: "#ca8a04" };
  if (v >= 40) return { emoji: "🌤", label: "Tranquila", bg: "rgba(147,197,253,0.22)", text: "#2563eb" };
  if (v >= 20) return { emoji: "😴", label: "Cansada",   bg: "rgba(203,213,225,0.22)", text: "#64748b" };
  return             { emoji: "🥺", label: "Tristinha",  bg: "rgba(167,139,250,0.2)",  text: "#7c3aed" };
}

function getEnergyPill(v: number): { emoji: string; label: string; bg: string; text: string } {
  if (v >= 80) return { emoji: "⚡", label: "Energizada", bg: "rgba(253,224,71,0.22)", text: "#ca8a04" };
  if (v >= 50) return { emoji: "🌿", label: "Descansada", bg: "rgba(134,239,172,0.2)", text: "#16a34a" };
  if (v >= 20) return { emoji: "😮‍💨", label: "Cansada",   bg: "rgba(203,213,225,0.2)", text: "#64748b" };
  return             { emoji: "💤", label: "Exausta",    bg: "rgba(148,163,184,0.15)", text: "#94a3b8" };
}

interface PillProps {
  emoji: string;
  label: string;
  bg: string;
  text: string;
  isKawaii: boolean;
}

function Pill({ emoji, label, bg, text, isKawaii }: PillProps) {
  return (
    <div
      className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{
        background: isKawaii ? bg : "rgba(255,255,255,0.06)",
        color: isKawaii ? text : "rgba(203,213,225,0.7)",
        border: `1px solid ${isKawaii ? bg.replace("0.2", "0.4") : "rgba(255,255,255,0.1)"}`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </div>
  );
}

export const StatusPills: React.FC<StatusPillsProps> = ({ happiness, energy, isKawaii }) => {
  const joy = getJoyPill(happiness);
  const eng = getEnergyPill(energy);

  return (
    <div className="flex gap-2 justify-center flex-wrap">
      <Pill {...joy} isKawaii={isKawaii} />
      <Pill {...eng} isKawaii={isKawaii} />
    </div>
  );
};
