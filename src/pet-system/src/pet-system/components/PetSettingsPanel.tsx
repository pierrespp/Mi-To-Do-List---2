import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePetStore } from "../store/petStore";
import { usePetSettings, usePetTheme } from "../hooks/usePetState";
import type { CompanionIntensity } from "../types/petTypes";

interface PetSettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export const PetSettingsPanel: React.FC<PetSettingsPanelProps> = ({ open, onClose }) => {
  const settings = usePetSettings();
  const themeMode = usePetTheme();
  const reducedMotion = useReducedMotion();
  const { updateSettings, reset } = usePetStore((s) => s.actions);

  const isKawaii = themeMode === "kawaii";

  const handleIntensity = (intensity: CompanionIntensity) => {
    updateSettings({ intensity });
  };

  const toggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleReset = () => {
    if (confirm("Deseja resetar todo o progresso do seu Pet? Esta ação não pode ser desfeita.")) {
      reset();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
            className="relative w-full max-w-[320px] rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: isKawaii ? "rgba(255, 255, 255, 0.92)" : "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${isKawaii ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.1)"}`,
              color: isKawaii ? "#1e293b" : "#f8fafc",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="text-xl">⚙️</span> Configurações
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
              
              {/* 1. Intensity */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-60 flex items-center gap-2">
                  <span>⚡</span> Intensidade do Companion
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["minimal", "balanced", "expressive"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => handleIntensity(lvl)}
                      className={`text-[10px] py-2 rounded-xl border transition-all ${
                        settings.intensity === lvl
                          ? isKawaii 
                            ? "bg-purple-100 border-purple-300 text-purple-700 shadow-sm"
                            : "bg-blue-500/20 border-blue-500/50 text-blue-400"
                          : isKawaii
                            ? "bg-white/50 border-black/5 text-slate-500 hover:bg-white"
                            : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      {lvl === "minimal" ? "Mínima" : lvl === "balanced" ? "Normal" : "Ativa"}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Toggles */}
              <div className="space-y-1">
                <SettingsToggle
                  icon="🔇"
                  label="Modo Silencioso"
                  description="Reduz drasticamente as mensagens"
                  active={settings.quietMode}
                  onClick={() => toggle("quietMode")}
                  isKawaii={isKawaii}
                />
                <SettingsToggle
                  icon="✨"
                  label="Presença Reduzida"
                  description="Aura mais leve e menos movimento"
                  active={settings.reducedPresence}
                  onClick={() => toggle("reducedPresence")}
                  isKawaii={isKawaii}
                />
                <SettingsToggle
                  icon="🗂️"
                  label="Modo Compacto por Padrão"
                  description="Inicia sempre minimizado"
                  active={settings.compactDefault}
                  onClick={() => toggle("compactDefault")}
                  isKawaii={isKawaii}
                />
              </div>

              {/* 3. Dangerous Zone */}
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-medium transition-all ${
                    isKawaii
                      ? "bg-red-50 text-red-500 hover:bg-red-100"
                      : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  }`}
                >
                  <span>🔄</span> Resetar Pet
                </button>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-black/5 text-center">
              <p className="text-[9px] opacity-40 uppercase tracking-widest">
                Mi Pet Companion · v1.0 Stable
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface SettingsToggleProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
  isKawaii: boolean;
}

const SettingsToggle: React.FC<SettingsToggleProps> = ({ icon, label, description, active, onClick, isKawaii }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all hover:bg-black/5 text-left group"
  >
    <div className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm ${
      active 
        ? isKawaii ? "bg-purple-100 text-purple-600" : "bg-blue-500/20 text-blue-400"
        : isKawaii ? "bg-slate-100 text-slate-400" : "bg-white/5 text-slate-500"
    }`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs font-bold">{label}</div>
      <div className="text-[10px] opacity-50 truncate">{description}</div>
    </div>
    <div className={`w-8 h-4 rounded-full relative transition-colors ${
      active 
        ? isKawaii ? "bg-purple-400" : "bg-blue-500"
        : isKawaii ? "bg-slate-300" : "bg-white/10"
    }`}>
      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
        active ? "left-4.5" : "left-0.5"
      }`} />
    </div>
  </button>
);

