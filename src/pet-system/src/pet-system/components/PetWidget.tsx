import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePetEngine } from "../hooks/usePetEngine";
import { usePetReactions } from "../hooks/usePetReactions";
import {
  usePetMood, usePetHappiness, usePetEnergy,
  usePetLevel, usePetXpProgress, usePetSleep, usePetIdle,
  usePetTheme, usePetMinimized, usePetId, usePetCelebration,
  usePetIsCompact, usePetSettings,
} from "../hooks/usePetState";
import { usePetStore } from "../store/petStore";
import { petAdapter } from "../adapters/petAdapter";
import { PET_DEFINITIONS } from "../pets/petDefinitions";
import { AmbientOrbs } from "./AmbientOrbs";
import { CelebrationFX } from "./CelebrationFX";
import { PetAvatar } from "./PetAvatar";
import { PetBubble } from "./PetBubble";
import { StatusPills } from "./StatusPills";
import { ActionButtons } from "./ActionButtons";
import { PetSelectionModal } from "./PetSelectionModal";
import { PetSettingsPanel } from "./PetSettingsPanel";
import { derivePresenceLevel, getPresenceConfig } from "../utils/presenceLevel";
import { getPosture, getPacing, getAura } from "../utils/emotionalVisuals";
import type { PetMood, ReactionType } from "../types/petTypes";

/* ── Compact-mode helpers ─────────────────────────────────────────── */

const COMPACT_MOOD_DOT: Record<PetMood, string> = {
  ecstatic: "#f472b6",
  happy:    "#c084fc",
  neutral:  "#94a3b8",
  worried:  "#fbbf24",
  sad:      "#7dd3fc",
  sleepy:   "#a78bfa",
};

const COMPACT_REACTION_EMOJI: Record<ReactionType, string> = {
  excited:     "🎉",
  happy:       "✨",
  celebration: "🌟",
  sad:         "🥺",
  worried:     "😟",
};

/* ── Component ────────────────────────────────────────────────────── */

export const PetWidget: React.FC = () => {
  usePetEngine();
  const { currentReaction } = usePetReactions();
  const reducedMotion = useReducedMotion();

  const petId      = usePetId();
  const mood       = usePetMood();
  const happiness  = usePetHappiness();
  const energy     = usePetEnergy();
  const level      = usePetLevel();
  const xpProgress = usePetXpProgress();
  const sleeping   = usePetSleep();
  const idle       = usePetIdle();
  const themeMode  = usePetTheme();
  const minimized  = usePetMinimized();
  const celebration= usePetCelebration();
  const isCompact  = usePetIsCompact();

  const settings   = usePetSettings();
  const { setMinimized, setIsCompact, enqueueReaction, addHappiness, setLastInteraction } =
    usePetStore((s) => s.actions);

  const isKawaii = themeMode === "kawaii";
  const def = PET_DEFINITIONS[petId] ?? PET_DEFINITIONS["mi"];

  const [selectorOpen, setSelectorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  /* ── 10.1: Compact default ───────────────────────────────────────── */
  React.useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
    if (settings.compactDefault || isMobile) {
      // Force compact on mount if setting is on OR if on mobile
      // Respecting user preference: if they explicitly want full mode, 
      // they can toggle it, but it will default to compact on next mobile mount.
      setIsCompact(true);
    }
  }, []); // Only on mount

  /* ── Presence level ─────────────────────────────────────────────── */
  const presenceLevel = useMemo(
    () => derivePresenceLevel({ sleeping, minimized, idle, celebration, mood }),
    [sleeping, minimized, idle, celebration, mood]
  );
  const presence = useMemo(() => getPresenceConfig(presenceLevel), [presenceLevel]);

  /* ── 8.2/8.3/8.4: Emotional visuals ─────────────────────────────── */
  const posture = useMemo(
    () => getPosture({ mood, energy, sleeping, idle, presenceLevel, settings }),
    [mood, energy, sleeping, idle, presenceLevel, settings]
  );
  const pacing = useMemo(
    () => getPacing({ petId, presenceLevel, mood, settings }),
    [petId, presenceLevel, mood, settings]
  );
  const aura = useMemo(
    () => getAura({ mood, presenceLevel, isKawaii, settings }),
    [mood, presenceLevel, isKawaii, settings]
  );

  /* ── Handlers ───────────────────────────────────────────────────── */
  const handleFeed = () => petAdapter.onFeedPet();
  const handleRest = () => (sleeping ? petAdapter.onWakeUp() : petAdapter.onSleep());
  const handlePet  = () => {
    addHappiness(10);
    setLastInteraction(Date.now());
    enqueueReaction("Carinho! 🥰", "happy", 2500);
  };

  /* ── Reduced motion helpers ─────────────────────────────────────── */
  const springTransition = reducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 320, damping: 24 };

  const avatarClass = reducedMotion
    ? ""
    : presenceLevel === "celebratory"
      ? "pet-bounce"
      : presenceLevel === "ambient"
        ? "pet-float-slow"
        : "pet-float";

  /* ── 1. Minimized pill ──────────────────────────────────────────── */
  if (minimized) {
    return (
      <motion.button
        initial={reducedMotion ? false : { scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={reducedMotion ? undefined : { scale: 0.5, opacity: 0 }}
        whileHover={reducedMotion ? undefined : { scale: 1.1 }}
        whileTap={reducedMotion ? undefined : { scale: 0.9 }}
        onClick={() => setMinimized(false)}
        className="w-14 h-14 rounded-full cursor-pointer flex items-center justify-center"
        style={{
          background: isKawaii ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: `1px solid ${isKawaii ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.12)"}`,
          boxShadow: isKawaii ? `0 0 20px ${def.glowColor}` : "0 2px 12px rgba(0,0,0,0.15)",
        }}
      >
        <div className={reducedMotion ? "w-10 h-10" : "pet-float w-10 h-10"}>
          <def.SVG mood={mood} size={40} />
        </div>
      </motion.button>
    );
  }

  /* ── 2. Compact mode (default) ──────────────────────────────────── */
  if (isCompact) {
    return (
      <motion.div
        key="compact"
        initial={reducedMotion ? false : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: idle ? 0.65 : 1 }}
        exit={reducedMotion ? undefined : { scale: 0.8, opacity: 0 }}
        transition={springTransition}
        className="relative flex flex-col items-center gap-1"
        style={{ pointerEvents: "none" }}
      >
        {/* Floating reaction emoji (no bubble — just emoji rises) */}
        {presence.showBubbles && (
          <AnimatePresence>
            {currentReaction && (
              <motion.span
                key={currentReaction.id}
                className="absolute select-none pointer-events-none"
                style={{ top: -22, left: "50%", transform: "translateX(-50%)", zIndex: 10, fontSize: 15 }}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
                animate={reducedMotion ? { opacity: [1, 0] } : { opacity: [0, 1, 0.8, 0], y: -32 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0.8 : 1.4, ease: "easeOut" }}
              >
                {COMPACT_REACTION_EMOJI[currentReaction.type]}
              </motion.span>
            )}
          </AnimatePresence>
        )}

        {/* Pet avatar — only interactive element */}
        <div
          className={currentReaction && !reducedMotion ? "pet-bounce" : avatarClass}
          style={{
            width: 64, height: 64,
            pointerEvents: "auto", cursor: "pointer",
            transition: "opacity 1.2s ease",
          }}
          onClick={() => setIsCompact(false)}
          title={`${def.name} · ${mood}`}
        >
          <PetAvatar petId={petId} mood={mood} size={64} isKawaii={isKawaii}
            posture={posture} pacing={pacing} aura={aura} sleeping={sleeping} />
        </div>

        {/* Mood dot (4px) — dims when idle */}
        <div
          className="rounded-full transition-opacity duration-700"
          style={{
            width: 4,
            height: 4,
            background: COMPACT_MOOD_DOT[mood],
            opacity: idle ? 0.3 : 0.65,
            pointerEvents: "none",
          }}
        />
      </motion.div>
    );
  }

  /* ── 3. Full floating companion ─────────────────────────────────── */
  return (
    <>
      <motion.div
        key="full"
        initial={reducedMotion ? false : { opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 22 }}
        className="relative flex flex-col items-center"
        style={{ width: 'min(220px, calc(100vw - 32px))', gap: 10 }}
      >
        {/* Ambient orbs — respects presence level + reduced motion */}
        <div className="absolute pointer-events-none" style={{ inset: -50, zIndex: 0 }}>
          <AmbientOrbs
            mood={mood}
            petColor={def.glowColor}
            isKawaii={isKawaii}
            idle={presenceLevel === "ambient" || presenceLevel === "dormant"}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center w-full" style={{ gap: 8 }}>

          {/* Top controls */}
          <div className="flex justify-between items-center w-full px-1" style={{ height: 24 }}>
            <motion.button
              whileHover={reducedMotion ? undefined : { scale: 1.08 }}
              whileTap={reducedMotion ? undefined : { scale: 0.9 }}
              onClick={() => setSelectorOpen(true)}
              className="text-xs cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded-full"
              style={{
                background: isKawaii ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.07)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${isKawaii ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.1)"}`,
                color: isKawaii ? "#7c3aed" : "rgba(148,163,184,0.7)",
                fontSize: 10,
              }}
            >
              {def.name} ▾
            </motion.button>
            <div className="flex gap-1">
              {/* Compact button */}
              <motion.button
                whileHover={reducedMotion ? undefined : { scale: 1.08 }}
                whileTap={reducedMotion ? undefined : { scale: 0.9 }}
                onClick={() => setIsCompact(true)}
                title="Modo compacto"
                className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 outline-none"
                style={{
                  background: isKawaii ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${isKawaii ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.12)"}`,
                  color: isKawaii ? "#6d28d9" : "rgba(148,163,184,0.6)",
                  fontSize: 11,
                }}
              >
                ◎
              </motion.button>
              {/* Minimize button */}
              <motion.button
                whileHover={reducedMotion ? undefined : { scale: 1.08 }}
                whileTap={reducedMotion ? undefined : { scale: 0.9 }}
                onClick={() => setMinimized(true)}
                className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 outline-none"
                style={{
                  background: isKawaii ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${isKawaii ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.12)"}`,
                  color: isKawaii ? "#6d28d9" : "rgba(148,163,184,0.6)",
                  fontSize: 11,
                }}
              >
                −
              </motion.button>
              {/* Settings button */}
              <motion.button
                whileHover={reducedMotion ? undefined : { scale: 1.08 }}
                whileTap={reducedMotion ? undefined : { scale: 0.9 }}
                onClick={() => setSettingsOpen(true)}
                title="Configurações"
                className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 outline-none"
                style={{
                  background: isKawaii ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${isKawaii ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.12)"}`,
                  color: isKawaii ? "#6d28d9" : "rgba(148,163,184,0.6)",
                  fontSize: 11,
                }}
              >
                ⚙
              </motion.button>
            </div>
          </div>

          {/* Speech bubble — only in reactive/celebratory presence */}
          {presence.showBubbles && (
            <div className="flex items-end justify-center" style={{ minHeight: 44 }}>
              <PetBubble currentReaction={currentReaction} mood={mood} isKawaii={isKawaii} />
            </div>
          )}

          {/* Pet avatar — celebration animation drives CSS class */}
          <div
            className={`relative ${
              celebration === "mega" && !reducedMotion
                ? "pet-celebrate"
                : celebration === "micro" && !reducedMotion
                  ? "pet-bounce"
                  : avatarClass
            }`}
            style={{ width: 130, height: 130 }}
          >
            <PetAvatar
              petId={petId}
              mood={mood}
              size={130}
              isKawaii={isKawaii}
              onClick={handlePet}
              posture={posture}
              pacing={pacing}
              aura={aura}
              sleeping={sleeping}
            />
            {/* Celebration FX — only when presence allows and no reduced motion */}
            {presence.showCelebrationFX && !reducedMotion && (
              <CelebrationFX celebration={celebration} />
            )}
          </div>

          {/* Idle note — only in reactive presence and not sleeping */}
          {presence.showIdleHint && (
            <AnimatePresence>
              {idle && !sleeping && (
                <motion.div
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs pointer-events-none"
                  style={{ color: isKawaii ? "rgba(244,114,182,0.7)" : "rgba(148,163,184,0.5)" }}
                >
                  {isKawaii ? "🥺 está com saudade..." : "idle"}
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Status pills */}
          <StatusPills happiness={happiness} energy={energy} isKawaii={isKawaii} />

          {/* Action buttons */}
          <ActionButtons
            onFeed={handleFeed}
            onRest={handleRest}
            onPet={handlePet}
            isSleeping={sleeping}
            isKawaii={isKawaii}
          />

          {/* Level indicator */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full w-full"
            style={{
              background: isKawaii ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.05)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${isKawaii ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            <span
              className="text-xs font-bold whitespace-nowrap"
              style={{ color: isKawaii ? "#7c3aed" : "rgba(165,180,252,0.6)" }}
            >
              nv.{level}
            </span>
            <div
              className="flex-1 rounded-full overflow-hidden"
              style={{ height: 4, background: isKawaii ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: isKawaii
                    ? `linear-gradient(90deg, ${def.primaryColor}, #e879f9)`
                    : "rgba(165,180,252,0.4)",
                }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeOut" }}
              />
            </div>
            <span
              className="text-xs whitespace-nowrap"
              style={{ color: isKawaii ? "rgba(109,40,217,0.45)" : "rgba(148,163,184,0.35)", fontSize: 9 }}
            >
              {Math.round(xpProgress)}xp
            </span>
          </div>

        </div>
      </motion.div>

      <PetSelectionModal open={selectorOpen} onClose={() => setSelectorOpen(false)} />
      <PetSettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};
