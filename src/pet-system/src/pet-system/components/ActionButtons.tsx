import React from "react";
import { motion } from "framer-motion";

interface ActionButtonsProps {
  onFeed: () => void;
  onRest: () => void;
  onPet: () => void;
  isSleeping: boolean;
  isKawaii: boolean;
}

interface IconBtnProps {
  emoji: string;
  label: string;
  onClick: () => void;
  isKawaii: boolean;
}

function IconBtn({ emoji, label, onClick, isKawaii }: IconBtnProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
      title={label}
      className="flex flex-col items-center gap-0.5 cursor-pointer select-none"
      style={{ background: "none", border: "none", outline: "none", padding: 0 }}
    >
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-colors"
        style={{
          background: isKawaii ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.08)",
          border: `1px solid ${isKawaii ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.12)"}`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: isKawaii ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
        }}
      >
        {emoji}
      </div>
      <span
        className="text-xs font-medium"
        style={{ color: isKawaii ? "rgba(109,40,217,0.7)" : "rgba(203,213,225,0.5)" }}
      >
        {label}
      </span>
    </motion.button>
  );
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onFeed, onRest, onPet, isSleeping, isKawaii }) => {
  return (
    <div className="flex gap-3 justify-center">
      <IconBtn emoji="🍡" label="Alimentar" onClick={onFeed} isKawaii={isKawaii} />
      <IconBtn emoji={isSleeping ? "☀️" : "🌙"} label={isSleeping ? "Acordar" : "Descansar"} onClick={onRest} isKawaii={isKawaii} />
      <IconBtn emoji="🫶" label="Mimar" onClick={onPet} isKawaii={isKawaii} />
    </div>
  );
};
