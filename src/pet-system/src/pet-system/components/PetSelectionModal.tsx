import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PET_DEFINITIONS } from "../pets/petDefinitions";
import { usePetStore } from "../store/petStore";
import { usePetId, usePetTheme } from "../hooks/usePetState";
import type { PetId } from "../types/petTypes";

interface PetSelectionModalProps {
  open: boolean;
  onClose: () => void;
}

export const PetSelectionModal: React.FC<PetSelectionModalProps> = ({ open, onClose }) => {
  const currentPetId = usePetId();
  const themeMode = usePetTheme();
  const isKawaii = themeMode === "kawaii";
  const setPetId = usePetStore((s) => s.actions.setPetId);
  const enqueueReaction = usePetStore((s) => s.actions.enqueueReaction);

  const [hovered, setHovered] = useState<PetId>(currentPetId);
  const hoveredDef = PET_DEFINITIONS[hovered];

  const handleAdopt = (id: PetId) => {
    if (id !== currentPetId) {
      const prev = PET_DEFINITIONS[currentPetId];
      enqueueReaction(`Tchau, ${prev.name}! Olá, ${PET_DEFINITIONS[id].name}! 🌸`, "happy", 3500);
      setPetId(id);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{
            background: isKawaii
              ? "rgba(88,28,135,0.25)"
              : "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
          onClick={onClose}
        >
          <motion.div
            key="modal-panel"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full max-w-sm rounded-t-3xl p-6 pb-8"
            style={{
              background: isKawaii
                ? "rgba(255,255,255,0.88)"
                : "rgba(30,27,75,0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${isKawaii ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.1)"}`,
              boxShadow: "0 -8px 48px rgba(0,0,0,0.12)",
            }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-sm transition-colors"
              style={{
                background: isKawaii ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)",
                color: isKawaii ? "#6b21a8" : "#a5b4fc",
              }}
            >
              ✕
            </button>

            {/* Title */}
            <h2
              className="text-base font-bold text-center mb-1"
              style={{ color: isKawaii ? "#6b21a8" : "#e0e7ff" }}
            >
              Escolha seu companheiro 🌸
            </h2>
            <p
              className="text-xs text-center mb-4"
              style={{ color: isKawaii ? "rgba(109,40,217,0.55)" : "rgba(165,180,252,0.55)" }}
            >
              XP e nível são mantidos ao trocar
            </p>

            {/* Pet grid */}
            <div className="flex justify-center gap-2 flex-wrap mb-4">
              {Object.values(PET_DEFINITIONS).map((pet) => {
                const selected = hovered === pet.id;
                const isCurrent = currentPetId === pet.id;
                return (
                  <motion.button
                    key={pet.id}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                    onMouseEnter={() => setHovered(pet.id)}
                    onFocus={() => setHovered(pet.id)}
                    onClick={() => handleAdopt(pet.id)}
                    className="flex flex-col items-center gap-1 p-2 rounded-2xl cursor-pointer transition-all"
                    style={{
                      background: selected
                        ? (isKawaii ? "rgba(192,132,252,0.15)" : "rgba(129,140,248,0.15)")
                        : "transparent",
                      border: isCurrent
                        ? `2px solid ${pet.primaryColor}`
                        : "2px solid transparent",
                      "--glow-color": pet.glowColor,
                    } as React.CSSProperties}
                  >
                    <div className={`relative ${isCurrent ? "glow-selected" : ""}`} style={{ width: 56, height: 56, borderRadius: 9999 }}>
                      <div className="pet-float w-full h-full">
                        <pet.SVG mood="happy" size={56} />
                      </div>
                    </div>
                    <span
                      className="text-xs font-bold"
                      style={{ color: isKawaii ? "#6b21a8" : "#e0e7ff" }}
                    >
                      {pet.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Description of hovered */}
            <AnimatePresence mode="wait">
              <motion.p
                key={hovered}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-center mb-4 min-h-[20px]"
                style={{ color: isKawaii ? "rgba(109,40,217,0.65)" : "rgba(165,180,252,0.65)" }}
              >
                {hoveredDef.description}
              </motion.p>
            </AnimatePresence>

            {/* Adopt button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => handleAdopt(hovered)}
              className="w-full py-3 rounded-2xl text-sm font-bold cursor-pointer transition-all"
              style={{
                background: isKawaii
                  ? `linear-gradient(135deg, ${hoveredDef.primaryColor}, ${hoveredDef.primaryColor}cc)`
                  : "rgba(129,140,248,0.25)",
                color: isKawaii ? "white" : "#e0e7ff",
                border: isKawaii ? "none" : "1px solid rgba(129,140,248,0.4)",
              }}
            >
              Adotar {hoveredDef.name} 🐾
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
