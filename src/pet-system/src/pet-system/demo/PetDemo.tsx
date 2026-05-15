import React from "react";
import { motion } from "framer-motion";
import { PetWidget } from "../components/PetWidget";
import { petAdapter } from "../adapters/petAdapter";
import { usePetStore } from "../store/petStore";
import { usePetTheme, usePetLevel, usePetHappiness, usePetEnergy, usePetSleep, usePetId } from "../hooks/usePetState";
import { PET_DEFINITIONS } from "../pets/petDefinitions";
import { clearState } from "../persistence/petPersistence";

const TRIGGERS = [
  { id: "task",    emoji: "✅", label: "Complete Task",    desc: "+15 joy, +20 XP",      action: () => petAdapter.onTaskCompleted() },
  { id: "all",     emoji: "🎊", label: "All Tasks Done",   desc: "+50 joy, +100 XP",     action: () => petAdapter.onAllTasksCompleted() },
  { id: "restart", emoji: "🔄", label: "Restart Turn",     desc: "+10 joy, +50 energy",  action: () => petAdapter.onTurnRestart() },
  { id: "add",     emoji: "➕", label: "Add Task",         desc: "reaction only",        action: () => petAdapter.onTaskAdded("Tarefa") },
  { id: "overdue", emoji: "⚠️", label: "Task Overdue",     desc: "-10 joy",              action: () => petAdapter.onTaskOverdue("Tarefa") },
  { id: "feed",    emoji: "🍡", label: "Feed Pet",         desc: "+20 joy, +30 energy",  action: () => petAdapter.onFeedPet() },
  { id: "sleep",   emoji: "💤", label: "Toggle Sleep",     desc: "rest mode",            action: () => {
    const s = usePetStore.getState();
    if (s.sleep) petAdapter.onWakeUp(); else petAdapter.onSleep();
  }},
  { id: "idle",    emoji: "⏳", label: "Simulate Idle",    desc: "pet gets lonely",      action: () => petAdapter.onWorkspaceIdle() },
  { id: "morning", emoji: "☀️", label: "Morning Open",     desc: "time-based greeting",  action: () => petAdapter.onAppOpen() },
  { id: "streak",  emoji: "🔥", label: "Daily Streak",     desc: "3 day streak",         action: () => petAdapter.onDailyStreak(3) },
  { id: "theme",   emoji: "🎨", label: "Toggle Theme",     desc: "Kawaii ↔ Clean",       action: () => {
    const t = usePetStore.getState().themeMode;
    petAdapter.onThemeChanged(t === "kawaii" ? "clean" : "kawaii");
  }},
];

export function PetDemo() {
  const themeMode = usePetTheme();
  const level     = usePetLevel();
  const happiness = usePetHappiness();
  const energy    = usePetEnergy();
  const sleeping  = usePetSleep();
  const petId     = usePetId();
  const isKawaii  = themeMode === "kawaii";
  const def       = PET_DEFINITIONS[petId];

  const [log, setLog] = React.useState<string[]>([]);

  const addLog = (msg: string) =>
    setLog((p) => [`${new Date().toLocaleTimeString()} ${msg}`, ...p].slice(0, 10));

  const handle = (id: string, action: () => void) => {
    action();
    const t = TRIGGERS.find((x) => x.id === id);
    if (t) addLog(`petAdapter.on${t.label.replace(/\s/g, "")}()`);
  };

  const reset = () => {
    clearState();
    usePetStore.getState().actions.reset();
    setLog([]);
    addLog("State reset");
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row"
      style={{ background: isKawaii ? "#1a0533" : "#0c0c0e" }}
    >
      {/* ── LEFT: App stage ────────────────────────────────────────── */}
      <div
        className="flex-1 relative flex items-center justify-center overflow-hidden min-h-[60vh] lg:min-h-screen"
        style={{
          background: isKawaii
            ? "radial-gradient(ellipse at 40% 40%, #2d0a5e 0%, #0f0020 70%)"
            : "radial-gradient(ellipse at 40% 40%, #111827 0%, #030712 70%)",
        }}
      >
        {/* Ambient canvas glow */}
        {isKawaii && (
          <div
            className="absolute pointer-events-none"
            style={{
              inset: 0,
              background: `radial-gradient(ellipse at 60% 55%, ${def.glowColor} 0%, transparent 55%)`,
            }}
          />
        )}

        {/* Simulated to-do app skeleton */}
        <div
          className="absolute inset-6 rounded-3xl pointer-events-none opacity-[0.07]"
          style={{ border: `1px solid ${isKawaii ? "#a78bfa" : "#334155"}` }}
        >
          <div className="p-6 flex flex-col gap-3.5">
            {[75, 55, 65, 45, 60].map((w, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ borderColor: isKawaii ? "#a78bfa" : "#475569" }}
                />
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${w}%`,
                    background: isKawaii ? "#a78bfa" : "#475569",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Stage label */}
        <div
          className="absolute top-5 left-6 text-xs font-mono tracking-widest uppercase"
          style={{ color: isKawaii ? "rgba(167,139,250,0.35)" : "rgba(100,116,139,0.4)" }}
        >
          App Preview
        </div>

        {/* THE PET — floating freely */}
        <div className="relative z-10">
          <PetWidget />
        </div>

        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => handle("theme", TRIGGERS.find(t => t.id === "theme")!.action)}
          className="absolute bottom-5 right-5 text-xs px-3 py-1.5 rounded-full cursor-pointer"
          style={{
            background: isKawaii ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${isKawaii ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.1)"}`,
            color: isKawaii ? "#c4b5fd" : "rgba(148,163,184,0.6)",
            backdropFilter: "blur(8px)",
          }}
        >
          {isKawaii ? "Switch to Clean →" : "Switch to Kawaii →"}
        </motion.button>
      </div>

      {/* ── RIGHT: Dev tools ────────────────────────────────────────── */}
      <div
        className="w-full lg:w-80 flex flex-col"
        style={{
          background: isKawaii ? "#100020" : "#0a0a0c",
          borderLeft: `1px solid ${isKawaii ? "rgba(109,40,217,0.2)" : "rgba(255,255,255,0.05)"}`,
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-4"
          style={{ borderBottom: `1px solid ${isKawaii ? "rgba(109,40,217,0.15)" : "rgba(255,255,255,0.05)"}` }}
        >
          <p
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: isKawaii ? "rgba(167,139,250,0.5)" : "rgba(100,116,139,0.6)" }}
          >
            Developer Tools
          </p>
          <h2
            className="text-sm font-bold mt-0.5"
            style={{ color: isKawaii ? "#e0d7ff" : "#94a3b8" }}
          >
            Mi Pet System
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Adapter triggers */}
          <div
            className="px-5 py-4"
            style={{ borderBottom: `1px solid ${isKawaii ? "rgba(109,40,217,0.12)" : "rgba(255,255,255,0.04)"}` }}
          >
            <p
              className="text-xs font-mono mb-3"
              style={{ color: isKawaii ? "rgba(167,139,250,0.45)" : "rgba(100,116,139,0.5)" }}
            >
              — Adapter Triggers
            </p>
            <div className="grid grid-cols-2 gap-2">
              {TRIGGERS.filter(t => t.id !== "theme").map((t) => (
                <motion.button
                  key={t.id}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => handle(t.id, t.action)}
                  className="flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-xl cursor-pointer text-left transition-all"
                  style={{
                    background: isKawaii ? "rgba(109,40,217,0.12)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isKawaii ? "rgba(109,40,217,0.2)" : "rgba(255,255,255,0.06)"}`,
                    color: isKawaii ? "#c4b5fd" : "#94a3b8",
                  }}
                >
                  <span className="text-base leading-none">{t.emoji}</span>
                  <span className="text-xs font-semibold leading-tight mt-1">{t.label}</span>
                  <span
                    className="text-xs leading-tight"
                    style={{ color: isKawaii ? "rgba(167,139,250,0.45)" : "rgba(100,116,139,0.6)" }}
                  >
                    {t.desc}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Live state */}
          <div
            className="px-5 py-4"
            style={{ borderBottom: `1px solid ${isKawaii ? "rgba(109,40,217,0.12)" : "rgba(255,255,255,0.04)"}` }}
          >
            <p
              className="text-xs font-mono mb-3"
              style={{ color: isKawaii ? "rgba(167,139,250,0.45)" : "rgba(100,116,139,0.5)" }}
            >
              — Live State
            </p>
            <div className="font-mono text-xs space-y-1.5">
              {[
                ["pet", petId],
                ["level", String(level)],
                ["joy", `${Math.round(happiness)}/100`],
                ["energy", `${Math.round(energy)}/100`],
                ["sleep", String(sleeping)],
                ["theme", `"${themeMode}"`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span style={{ color: isKawaii ? "rgba(244,114,182,0.5)" : "rgba(96,165,250,0.4)" }}>{k}</span>
                  <span style={{ color: isKawaii ? "rgba(196,181,253,0.7)" : "rgba(148,163,184,0.7)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Event log */}
          <div className="px-5 py-4 flex-1">
            <p
              className="text-xs font-mono mb-3"
              style={{ color: isKawaii ? "rgba(167,139,250,0.45)" : "rgba(100,116,139,0.5)" }}
            >
              — Event Log
            </p>
            <div className="font-mono text-xs space-y-1 min-h-[60px]">
              {log.length === 0 ? (
                <span style={{ color: isKawaii ? "rgba(109,40,217,0.35)" : "rgba(71,85,105,0.6)" }}>
                  No events yet...
                </span>
              ) : (
                log.map((entry, i) => (
                  <motion.div
                    key={entry + i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ color: isKawaii ? "rgba(167,139,250,0.55)" : "rgba(100,116,139,0.65)" }}
                  >
                    {entry}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 flex justify-between items-center"
          style={{ borderTop: `1px solid ${isKawaii ? "rgba(109,40,217,0.12)" : "rgba(255,255,255,0.04)"}` }}
        >
          <span
            className="text-xs"
            style={{ color: isKawaii ? "rgba(109,40,217,0.35)" : "rgba(71,85,105,0.6)" }}
          >
            localStorage · 2s debounce
          </span>
          <button
            onClick={reset}
            className="text-xs cursor-pointer transition-colors"
            style={{ color: isKawaii ? "rgba(167,139,250,0.45)" : "rgba(100,116,139,0.55)" }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
