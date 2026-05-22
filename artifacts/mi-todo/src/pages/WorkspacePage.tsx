import { useParams } from "wouter";
import {
  useGetWorkspace,
  useListSections,
  useListTasks,
  useGetWorkspaceStats,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useCreateSection,
  useRestartShift,
  useReorderTasks,
  getListTasksQueryKey,
  getGetWorkspaceStatsQueryKey,
  getListSectionsQueryKey,
  useListDailyHistory,
} from "@/lib/api-supabase";
import React, { useState, KeyboardEvent, useEffect, useRef, forwardRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Plus, Trash2, Heart, Star, Sparkles, Loader2, Pin, Calendar, AlertCircle, RefreshCw, Menu, X, GripVertical, Clipboard, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useTheme } from "@/components/ThemeToggle";
import MusicPlayer from "@/components/MusicPlayer";
import { petBridge } from "../../../../src/integrations/petBridge";
import {
  DangoPrideIcon,
  MoonPrideIcon,
  SunPrideIcon,
  HeartHandsPrideIcon,
  LightningPrideIcon,
  LeafPrideIcon,
  SleepingPrideIcon,
  SakuraPrideIcon,
  SadPrideIcon,
  RainbowPrideIcon,
  StarPrideIcon,
  RibbonPrideIcon,
  CloudPrideIcon
} from "../../../../src/pet-system/src/pet-system/components/KawaiiPrideIcons";

function renderStickerIcon(emoji: string, size: number = 24) {
  switch (emoji) {
    case "🍡": return <DangoPrideIcon size={size} />;
    case "🌙": return <MoonPrideIcon size={size} />;
    case "☀️": return <SunPrideIcon size={size} />;
    case "🫶": return <HeartHandsPrideIcon size={size} />;
    case "⚡": return <LightningPrideIcon size={size} />;
    case "🌿": return <LeafPrideIcon size={size} />;
    case "😴":
    case "💤":
    case "😮‍💨": return <SleepingPrideIcon size={size} />;
    case "🌸": return <SakuraPrideIcon size={size} />;
    case "🥺": return <SadPrideIcon size={size} />;
    case "🌈": return <RainbowPrideIcon size={size} />;
    case "⭐":
    case "🌟": return <StarPrideIcon size={size} />;
    case "🎀": return <RibbonPrideIcon size={size} />;
    case "☁️": return <CloudPrideIcon size={size} />;
    case "💖":
    case "💝": return <HeartHandsPrideIcon size={size} />;
    default: return <span>{emoji}</span>;
  }
}

function renderSectionSticker(emoji: string, isSelected: boolean) {
  const filter = isSelected ? "brightness(0) invert(1)" : "none";
  let src = "";
  switch (emoji) {
    case "☀️":
      src = `${import.meta.env.BASE_URL}kawaii_sun_icon.png`;
      break;
    case "✨":
      src = `${import.meta.env.BASE_URL}kawaii_weekly_icon.png`;
      break;
    case "⭐":
      src = `${import.meta.env.BASE_URL}kawaii_important_icon.png`;
      break;
    case "🌙":
      src = `${import.meta.env.BASE_URL}kawaii_moon_icon.png`;
      break;
    case "🎵":
    case "🎶":
    case "🎧":
    case "📻":
    case "🎼":
      src = `${import.meta.env.BASE_URL}kawaii_music_icon.png`;
      break;
    default:
      return <span className="flex-shrink-0">{emoji}</span>;
  }
  return (
    <img
      src={src}
      alt={emoji}
      className="w-10 h-10 object-contain flex-shrink-0"
      style={{ filter, transition: "filter 0.2s ease" }}
    />
  );
}

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ─── Section colour palette ─────────────────────────────────── */
const PALETTES = [
  { bg: "rgba(252,165,165,0.22)", border: "rgba(252,165,165,0.5)", text: "#dc2626", glow: "rgba(252,165,165,0.45)" },
  { bg: "rgba(253,224,71,0.22)", border: "rgba(253,224,71,0.55)", text: "#b45309", glow: "rgba(253,224,71,0.45)" },
  { bg: "rgba(196,181,253,0.25)", border: "rgba(196,181,253,0.5)", text: "#7c3aed", glow: "rgba(196,181,253,0.45)" },
  { bg: "rgba(103,232,249,0.2)", border: "rgba(103,232,249,0.5)", text: "#0891b2", glow: "rgba(103,232,249,0.4)" },
  { bg: "rgba(134,239,172,0.2)", border: "rgba(134,239,172,0.5)", text: "#15803d", glow: "rgba(134,239,172,0.4)" },
  { bg: "rgba(249,168,212,0.22)", border: "rgba(249,168,212,0.5)", text: "#be185d", glow: "rgba(249,168,212,0.45)" },
];

/* ─── Main frog mascot ────────────────────────────────────────── */
function KawaiiMascot({ size = 96, mood = "happy" }: { size?: number; mood?: "happy" | "idle" | "cheer" }) {
  const src = `${import.meta.env.BASE_URL}${mood === "cheer" ? "mascote_cheer.png" : "mascote_idle.png"}`;
  return (
    <img
      src={src}
      alt="Mascote Sapo Kawaii"
      width={size}
      height={size}
      style={{
        objectFit: "contain",
        filter: "drop-shadow(0 4px 16px rgba(100,200,100,0.3))",
        transition: "transform 0.3s ease",
      }}
    />
  );
}

/* ─── Mini kawaii star character ──────────────────────────────── */
function StarKawaii({ size = 44 }: { size?: number }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}kawaii_star.png`}
      alt="Estrela Kawaii"
      width={size}
      height={size}
      style={{ objectFit: "contain" }}
    />
  );
}

/* ─── Mini kawaii cloud character ─────────────────────────────── */
function CloudKawaii({ size = 52 }: { size?: number }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}kawaii_cloud.png`}
      alt="Nuvem Kawaii"
      width={size}
      height={size}
      style={{ objectFit: "contain" }}
    />
  );
}

/* ─── Mini kawaii heart character ─────────────────────────────── */
function HeartKawaii({ size = 44 }: { size?: number }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}kawaii_heart.png`}
      alt="Coração Kawaii"
      width={size}
      height={size}
      style={{ objectFit: "contain" }}
    />
  );
}

/* ─── Particle burst on task completion ──────────────────────── */
const PARTICLES = [
  { anim: "ps0", color: "#ec4899" }, { anim: "ps1", color: "#fbbf24" },
  { anim: "ps2", color: "#a78bfa" }, { anim: "ps3", color: "#06b6d4" },
  { anim: "ps4", color: "#f9a8d4" }, { anim: "ps5", color: "#fde68a" },
  { anim: "ps6", color: "#c4b5fd" }, { anim: "ps7", color: "#67e8f9" },
];

function SparkBurst() {
  return (
    <div style={{
      position: "absolute", left: "50%", top: "50%",
      width: 0, height: 0,
      pointerEvents: "none", zIndex: 50,
    }}>
      {PARTICLES.filter((_, i) => (typeof window !== 'undefined' && window.innerWidth < 1024) ? i % 2 === 0 : true).map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          width: i % 2 === 0 ? 7 : 5,
          height: i % 2 === 0 ? 7 : 5,
          borderRadius: "50%",
          background: p.color,
          marginLeft: i % 2 === 0 ? -3.5 : -2.5,
          marginTop: i % 2 === 0 ? -3.5 : -2.5,
          animation: `${p.anim} 0.55s cubic-bezier(0.22,1,0.36,1) forwards`,
          animationDelay: `${i * 0.018}s`,
          boxShadow: `0 0 5px ${p.color}`,
          opacity: 1,
        }} />
      ))}
      {/* Central sparkle emoji */}
      <span style={{
        position: "absolute",
        fontSize: 14,
        marginLeft: -7, marginTop: -7,
        animation: "sparkle 0.55s ease-out forwards",
        pointerEvents: "none",
      }}>✨</span>
    </div>
  );
}

/* ─── Progress Ring ───────────────────────────────────────────── */
function ProgressRing({ value, total, size = 72 }: { value: number; total: number; size?: number }) {
  const pct = total > 0 ? value / total : 0;
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(236,72,153,0.12)" strokeWidth={8} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.34,1.56,0.64,1)" }} />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 15, fontWeight: 900, color: "#ec4899", lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#a78bfa", lineHeight: 1.2 }}>/{total}</span>
      </div>
    </div>
  );
}

/* ─── Enhanced Blob + Sticker Background ─────────────────────── */
const STICKER_ASSETS = [
  // Todos os 5 mascotes "Mi Pets" grandes, charmosos e distribuídos harmonicamente
  { src: "kawaii_pet_mi.png", top: "70%", left: "22%", size: 105, opacity: 0.32, anim: "floatUp 9s ease-in-out infinite", delay: "0.5s" }, // Sapinho Mi (Verde)
  { src: "kawaii_pet_kuro.png", top: "12%", right: "16%", size: 100, opacity: 0.30, anim: "sway 8s ease-in-out infinite", delay: "1.5s" }, // Gatinho Kuro (Indigo)
  { src: "kawaii_pet_pi.png", top: "14%", left: "14%", size: 100, opacity: 0.32, anim: "drift 10s ease-in-out infinite", delay: "2.0s" }, // Pinguim Pi (Chubby)
  { src: "kawaii_pet_mila.png", top: "78%", right: "14%", size: 100, opacity: 0.32, anim: "sway 9s ease-in-out infinite", delay: "0.8s" }, // Raposinha Mila (Branca)
  { src: "kawaii_pet_gabiru.png", top: "46%", right: "8%", size: 105, opacity: 0.30, anim: "floatUp 11s ease-in-out infinite", delay: "1.8s" }, // Gato cinza Gabiru (Lazy)

  // Stickers originais reajustados para serem maiores e preencherem os espaços vazios
  { src: "kawaii_cloud.png", top: "32%", left: "2%", size: 85, opacity: 0.28, anim: "floatUp 10s ease-in-out infinite", delay: "1.2s" },
  { src: "kawaii_moon.png", top: "54%", left: "1.5%", size: 70, opacity: 0.30, anim: "drift 11s ease-in-out infinite", delay: "0.8s" },
  { src: "kawaii_star.png", top: "8%", left: "34%", size: 65, opacity: 0.32, anim: "twinkle 6s ease-in-out infinite", delay: "2.5s" },
  { src: "kawaii_cupcake.png", top: "30%", right: "2%", size: 75, opacity: 0.28, anim: "drift 12s ease-in-out infinite", delay: "4s" },
  { src: "kawaii_cat.png", top: "88%", left: "1.5%", size: 75, opacity: 0.30, anim: "sway 9s ease-in-out infinite", delay: "2s" },

  // Micro decorações de equilíbrio
  { src: "kawaii_mini_flower.png", top: "6%", right: "4%", size: 34, opacity: 0.35, anim: "drift 7s ease-in-out infinite", delay: "0s" },
  { src: "kawaii_heart.png", top: "45%", right: "3%", size: 38, opacity: 0.35, anim: "sway 5s ease-in-out infinite", delay: "0.5s" },
  { src: "kawaii_mini_butterfly.png", top: "55%", left: "4%", size: 32, opacity: 0.32, anim: "sway 7s ease-in-out infinite", delay: "1.0s" },
  { src: "kawaii_mini_rainbow.png", top: "88%", right: "12%", size: 55, opacity: 0.28, anim: "floatUp 12s ease-in-out infinite", delay: "3s" },
  { src: "kawaii_mini_star.png", top: "78%", right: "5%", size: 30, opacity: 0.40, anim: "twinkle 4s ease-in-out infinite", delay: "1.5s" },
];

function BlobBackground() {
  const { theme } = useTheme();
  const isRainbow = theme === "rainbow";

  return (
    <div className="blob-bg" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* Primary blobs */}
      <div style={{
        position: "absolute", top: "-12%", left: "-6%",
        width: 480, height: 480, borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
        background: "radial-gradient(circle at 40% 40%, rgba(249,168,212,0.5), rgba(196,181,253,0.25) 55%, transparent 75%)",
        animation: "blobFloat1 16s ease-in-out infinite", filter: "blur(3px)",
      }} />
      <div style={{
        position: "absolute", bottom: "3%", right: "-10%",
        width: 440, height: 440, borderRadius: "40% 60% 30% 70% / 60% 40% 50% 50%",
        background: "radial-gradient(circle at 60% 60%, rgba(103,232,249,0.35), rgba(167,139,250,0.25) 55%, transparent 75%)",
        animation: "blobFloat2 20s ease-in-out infinite", filter: "blur(3px)",
      }} />
      <div style={{
        position: "absolute", top: "38%", left: "28%",
        width: 320, height: 320, borderRadius: "50% 50% 30% 70% / 40% 60% 40% 60%",
        background: "radial-gradient(circle at 50% 50%, rgba(253,224,71,0.2), rgba(249,168,212,0.12) 55%, transparent 75%)",
        animation: "blobFloat3 24s ease-in-out infinite", filter: "blur(4px)",
      }} />
      {/* Extra accent blobs */}
      <div style={{
        position: "absolute", top: "20%", right: "15%",
        width: 220, height: 220, borderRadius: "70% 30% 50% 50% / 30% 70% 30% 70%",
        background: "radial-gradient(circle, rgba(167,243,208,0.3), rgba(103,232,249,0.15) 60%, transparent 80%)",
        animation: "blobFloat2 18s ease-in-out infinite", animationDelay: "5s", filter: "blur(2px)",
      }} />
      <div style={{
        position: "absolute", bottom: "25%", left: "18%",
        width: 180, height: 180, borderRadius: "40% 60% 60% 40% / 70% 30% 70% 30%",
        background: "radial-gradient(circle, rgba(253,186,116,0.22), rgba(249,168,212,0.15) 60%, transparent 80%)",
        animation: "blobFloat1 22s ease-in-out infinite", animationDelay: "8s", filter: "blur(2px)",
      }} />

      {/* Floating stickers */}
      {isRainbow && STICKER_ASSETS.map((s, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            right: s.right,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animation: s.anim,
            animationDelay: s.delay,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={import.meta.env.BASE_URL + s.src}
            alt="sticker"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      ))}

      {/* Soft glow behind main content */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 400,
        background: "radial-gradient(ellipse, rgba(236,72,153,0.06) 0%, rgba(167,139,250,0.04) 50%, transparent 70%)",
        filter: "blur(40px)",
        pointerEvents: "none",
      }} />
    </div>
  );
}

/* ─── Fixed kawaii corner characters ─────────────────────────── */
function KawaiiCornerDecos() {
  return (
    <div className="blob-bg" style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}>
      {/* Top-right: star */}
      <div style={{
        position: "absolute", top: 12, right: 70,
        opacity: 0.55,
        animation: "sway 4s ease-in-out infinite",
        filter: "drop-shadow(0 2px 6px rgba(251,191,36,0.4))",
      }}>
        <StarKawaii size={38} />
      </div>
      {/* Bottom-left: cloud */}
      <div style={{
        position: "absolute", bottom: 80, left: 280,
        opacity: 0.45,
        animation: "floatUp 6s ease-in-out infinite",
        animationDelay: "1s",
        filter: "drop-shadow(0 2px 8px rgba(167,139,250,0.35))",
      }}>
        <CloudKawaii size={56} />
      </div>
      {/* Mid-right: heart */}
      <div style={{
        position: "absolute", top: "48%", right: 8,
        opacity: 0.5,
        animation: "drift 7s ease-in-out infinite",
        animationDelay: "2s",
        filter: "drop-shadow(0 2px 6px rgba(236,72,153,0.4))",
      }}>
        <HeartKawaii size={38} />
      </div>
      {/* Upper-left near sidebar: tiny star */}
      <div style={{
        position: "absolute", top: "22%", left: 258,
        opacity: 0.4,
        animation: "twinkle 5s ease-in-out infinite",
        animationDelay: "0.5s",
      }}>
        <StarKawaii size={28} />
      </div>
    </div>
  );
}

/* ─── Sidebar accent stickers ────────────────────────────────── */
function SidebarStickers() {
  const items = [
    { src: "kawaii_mini_flower.png", top: 10, right: 10, size: 22, anim: "twinkle 4s ease-in-out infinite", delay: "0s" },
    { src: "kawaii_mini_star.png", top: 38, right: 16, size: 16, anim: "sparkBurst 3s ease-in-out infinite", delay: "0.5s" },
    { src: "kawaii_mini_butterfly.png", top: 60, right: 8, size: 18, anim: "floatUp 5s ease-in-out infinite", delay: "1s" },
  ];
  return (
    <div className="blob-bg" style={{ position: "absolute", top: 0, right: 0, width: 40, height: 90, pointerEvents: "none" }}>
      {items.map((it, i) => (
        <img
          key={i}
          src={import.meta.env.BASE_URL + it.src}
          alt="Sidebar Deco"
          style={{
            position: "absolute",
            top: it.top,
            right: it.right,
            width: it.size,
            height: it.size,
            opacity: 0.5,
            animation: it.anim,
            animationDelay: it.delay,
            objectFit: "contain",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Rainbow arc for empty state ────────────────────────────── */
function RainbowArc() {
  return (
    <svg viewBox="0 0 300 160" width="260" style={{ opacity: 0.35, position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", zIndex: 0 }}>
      <path d="M 15 148 Q 150 -15 285 148" stroke="#ec4899" strokeWidth="11" fill="none" strokeLinecap="round" />
      <path d="M 32 148 Q 150 8 268 148" stroke="#f97316" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M 50 148 Q 150 30 250 148" stroke="#fbbf24" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M 68 148 Q 150 50 232 148" stroke="#22c55e" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 86 148 Q 150 68 214 148" stroke="#06b6d4" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M 104 148 Q 150 84 196 148" stroke="#a78bfa" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Daily quotes ────────────────────────────────────────────── */
const QUOTES = [
  "You're doing amazing ✨",
  "One task at a time 💖",
  "Progress, not perfection 🌸",
  "Bom trabalho, amor!! 🌟",
  "Arrasou! ✦",
  "Jubileu teria orgulho de você🌈",
  "Proud of you today 💜",
];

interface TaskCardVisualProps {
  task: any;
  sectionMap: Map<number, any>;
  isRainbow: boolean;
  completingId?: number | null;
  handleToggleTask?: (id: number, completed: boolean) => void;
  onDeleteRequest?: (id: number, title: string) => void;
  style?: React.CSSProperties;
  className?: string;
  dragHandleProps?: any;
  isOverlay?: boolean;
}

const TaskCardVisual = forwardRef<HTMLDivElement, TaskCardVisualProps>(({
  task,
  sectionMap,
  isRainbow,
  completingId = null,
  handleToggleTask,
  onDeleteRequest,
  style,
  className = "",
  dragHandleProps,
  isOverlay = false,
}, ref) => {
  if (!task) return null;
  const sectionInfo = task.sectionId != null ? sectionMap.get(task.sectionId) : null;
  const pal = sectionInfo?.palette;
  const isCompleting = completingId === task.id;
  const isImportant = sectionInfo?.name?.toLowerCase().includes("import");

  const baseStyle: React.CSSProperties = {
    ...style,
    background: isOverlay
      ? (task.completed ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.85)")
      : style?.background || (task.completed ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.72)"),
    boxShadow: isOverlay 
      ? "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04), 0 0 0 1px rgba(236,72,153,0.15)"
      : undefined,
    transform: isOverlay ? "scale(1.03)" : style?.transform,
    transition: isOverlay ? "transform 0.15s ease" : style?.transition,
  };

  return (
    <div
      ref={ref}
      style={baseStyle}
      className={`flex items-center gap-4 p-5 rounded-3xl glass-card transition-all duration-300 ${
        isImportant && isRainbow ? "important-section-card" : ""
      } ${isOverlay ? "cursor-grabbing border-primary/20 shadow-2xl" : ""} ${className}`}
    >
      {/* Alça de Arrasto Visual (Grip) */}
      <div
        {...dragHandleProps}
        className={`p-1 text-muted-foreground/40 hover:text-primary transition-colors flex-shrink-0 ${
          isOverlay ? "cursor-grabbing text-primary" : "cursor-grab active:cursor-grabbing"
        }`}
        aria-label="Arrastar para reordenar"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Botão de Concluir */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => handleToggleTask?.(task.id, task.completed)}
          disabled={isOverlay}
          className="w-8 h-8 rounded-full border-2 border-primary/30 flex items-center justify-center relative hover:scale-105 active:scale-95 transition-all overflow-hidden"
          style={isRainbow && pal ? { borderColor: pal.border, background: task.completed ? pal.bg : undefined } : undefined}
        >
          {task.completed ? (
            <Check className="w-4 h-4 text-white fill-white animate-bounce-in" />
          ) : isCompleting ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : null}
          {isCompleting && (
            <span style={{
              position: "absolute", inset: -5,
              borderRadius: "50%",
              border: "2.5px solid #ec4899",
              animation: "rippleExpand 0.55s ease-out forwards",
              pointerEvents: "none",
            }} />
          )}
          {isCompleting && (
            <span style={{
              position: "absolute", inset: -10,
              borderRadius: "50%",
              border: "1.5px solid rgba(167,139,250,0.6)",
              animation: "rippleExpand 0.7s ease-out 0.1s forwards",
              pointerEvents: "none",
            }} />
          )}
        </button>
        {isCompleting && isRainbow && <SparkBurst />}
      </div>

      {/* Título + badge de seção */}
      <div className="flex-1 min-w-0">
        <span className={`text-lg font-bold block truncate ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {task.title}
        </span>
        {sectionInfo && !task.completed && (
          <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold"
            style={{
              background: pal?.bg ?? "rgba(236,72,153,0.12)",
              border: `1px solid ${pal?.border ?? "rgba(236,72,153,0.25)"}`,
              color: pal?.text ?? "#ec4899",
              backdropFilter: "blur(6px)",
            }}>
            {sectionInfo.emoji} {sectionInfo.name}
          </span>
        )}
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {task.priority === "high" && (
          <Badge className="border-0 rounded-full px-2.5 py-0.5 font-bold text-xs"
            style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>
            <AlertCircle className="w-3 h-3 mr-1 inline" /> Alta
          </Badge>
        )}
        {task.pinned && (
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(236,72,153,0.1)" }}>
            <Pin className="w-3.5 h-3.5 text-primary" />
          </div>
        )}
        {task.recurring && (
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(103,232,249,0.15)" }}>
            <Calendar className="w-3.5 h-3.5 text-cyan-600" />
          </div>
        )}
        {isCompleting && isRainbow && (
          <>
            <span className="sparkle-animation text-base">✨</span>
            <span className="sparkle-animation text-sm" style={{ animationDelay: "0.1s" }}>⭐</span>
          </>
        )}
        <button
          onClick={() => onDeleteRequest?.(task.id, task.title)}
          disabled={isOverlay}
          className="w-11 h-11 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-muted-foreground transition-all ml-1"
          style={{ transition: "all 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; (e.currentTarget as HTMLElement).style.color = "#dc2626"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = ""; }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});
TaskCardVisual.displayName = "TaskCardVisual";

interface SortableTaskCardProps {
  task: any;
  idx: number;
  sectionMap: Map<number, any>;
  isRainbow: boolean;
  completingId: number | null;
  handleToggleTask: (id: number, completed: boolean) => void;
  onDeleteRequest: (id: number, title: string) => void;
  slug: string;
  queryClient: any;
}

function SortableTaskCard({
  task,
  idx,
  sectionMap,
  isRainbow,
  completingId,
  handleToggleTask,
  onDeleteRequest,
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    animationDelay: `${idx * 0.04}s`,
    transitionProperty: "transform, opacity, background-color, border-color, box-shadow",
  };

  return (
    <TaskCardVisual
      ref={setNodeRef}
      task={task}
      sectionMap={sectionMap}
      isRainbow={isRainbow}
      completingId={completingId}
      handleToggleTask={handleToggleTask}
      onDeleteRequest={onDeleteRequest}
      style={style}
      className="task-card-enter"
      dragHandleProps={{ ...attributes, ...listeners }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Main Component                                                  */
/* ─────────────────────────────────────────────────────────────── */
export default function WorkspacePage() {
  const params = useParams();
  const slug = params.slug!;
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const isRainbow = theme === "rainbow";

  const { data: workspace, isLoading: wsLoading } = useGetWorkspace(slug, { query: { enabled: !!slug, queryKey: [slug, "workspace"] } });
  const { data: sections, isLoading: sectionsLoading } = useListSections(slug, { query: { enabled: !!slug, queryKey: getListSectionsQueryKey(slug) } });
  const { data: tasks, isLoading: tasksLoading } = useListTasks(slug, { query: { enabled: !!slug, queryKey: getListTasksQueryKey(slug) } });
  const { data: stats } = useGetWorkspaceStats(slug, { query: { enabled: !!slug, queryKey: getGetWorkspaceStatsQueryKey(slug) } });
  
  const { data: dailyHistory, isLoading: historyLoading } = useListDailyHistory(slug);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [copiedDayId, setCopiedDayId] = useState<number | null>(null);

  const [customResetDate, setCustomResetDate] = useState<string>(new Date().toLocaleDateString("sv-SE"));
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedHistoryDay, setSelectedHistoryDay] = useState<any>(null);

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const historyMap = new Map((dailyHistory ?? []).map(day => [day.date, day]));

  const handlePrevMonth = () => {
    setCalendarDate(new Date(year, month - 1, 1));
    setSelectedHistoryDay(null);
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(year, month + 1, 1));
    setSelectedHistoryDay(null);
  };

  const handleDayClick = (dateString: string) => {
    const dayRecord = historyMap.get(dateString);
    if (dayRecord) {
      setSelectedHistoryDay(dayRecord);
    } else {
      setSelectedHistoryDay(null);
    }
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const displayedMonthYear = `${monthNames[month]} de ${year}`;

  const handleCopyHistoryReport = (day: any) => {
    const formattedDate = new Date(day.date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC"
    });

    const header = `📅 Relatório de Tarefas Concluídas - ${formattedDate}\n`;
    const separator = `-`.repeat(header.length - 1) + `\n`;
    const count = `✨ Concluídas hoje: ${day.tasks.length} tarefa(s)\n`;
    const taskList = day.tasks.map((t: any) => `✓ ${t.title}`).join(`\n`);

    const fullText = `${header}${separator}${count}\n${taskList}`;

    navigator.clipboard.writeText(fullText);
    setCopiedDayId(day.id);
    setTimeout(() => setCopiedDayId(null), 2000);
  };

  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"tasks" | "music">("tasks");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [mascotMood, setMascotMood] = useState<"idle" | "cheer">("idle");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const createSection = useCreateSection();
  const restartShift = useRestartShift();
  const reorderTasks = useReorderTasks();

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [targetResetSection, setTargetResetSection] = useState<{ id: number | null; name: string } | null>(null);

  const handleOpenResetConfirmModal = (sectionId: number | null, sectionName: string) => {
    setTargetResetSection({ id: sectionId, name: sectionName });
    if (sectionId === null) {
      setCustomResetDate(new Date().toLocaleDateString("sv-SE"));
    }
    setResetModalOpen(true);
  };

  const handleConfirmReset = () => {
    if (!targetResetSection) return;

    const isWeekly = targetResetSection.id === -999;
    restartShift.mutate(
      {
        slug,
        sectionId: isWeekly || targetResetSection.id === null ? undefined : targetResetSection.id,
        customDate: targetResetSection.id === null ? customResetDate : undefined,
        resetWeeklyOnly: isWeekly ? true : undefined,
      },
      {
        onSuccess: () => {
          if (isWeekly || targetResetSection.id) {
            petBridge.sectionReset();
          } else {
            petBridge.turnRestart();
          }
          setResetModalOpen(false);
        }
      }
    );
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTask.mutate(
      { slug, taskId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTasksQueryKey(slug) });
          queryClient.invalidateQueries({ queryKey: getGetWorkspaceStatsQueryKey(slug) });
        }
      }
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id as number);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTask = tasks?.find(t => t.id === active.id);
    if (!activeTask) return;

    const targetSectionId = activeTask.sectionId;

    const sectionTasks = tasks?.filter(t => t.sectionId === targetSectionId) || [];
    sectionTasks.sort((a, b) => a.position - b.position);

    const oldIndex = sectionTasks.findIndex(t => t.id === active.id);
    const newIndex = sectionTasks.findIndex(t => t.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const movedTasks = arrayMove(sectionTasks, oldIndex, newIndex);

      const reorderedTasksPayload = movedTasks.map((t, idx) => ({
        ...t,
        position: idx,
      }));

      reorderTasks.mutate({
        slug,
        sectionId: targetSectionId,
        reorderedTasks: reorderedTasksPayload,
      });
    }
  };

  const hasGreeted = useRef(false);
  useEffect(() => {
    if (!hasGreeted.current) {
      const pendingTaskCount = stats ? stats.total - stats.completed : undefined;
      petBridge.appOpen({ pendingTaskCount });
      hasGreeted.current = true;
    }
  }, []); // Mount only

  const quote = QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length];
  const sectionMap = new Map((sections ?? []).map((s, i) => [s.id, { ...s, palette: PALETTES[i % PALETTES.length] }]));

  const handleCreateTask = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTaskTitle.trim()) {
      createTask.mutate(
        { slug, data: { title: newTaskTitle.trim(), sectionId: selectedSectionId, priority: "medium" } },
        {
          onSuccess: () => {
            setNewTaskTitle("");
            queryClient.invalidateQueries({ queryKey: getListTasksQueryKey(slug) });
            queryClient.invalidateQueries({ queryKey: getGetWorkspaceStatsQueryKey(slug) });
          }
        }
      );
    }
  };

  const handleCreateSection = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSectionName.trim()) {
      createSection.mutate(
        { slug, data: { name: newSectionName.trim(), emoji: "✨" } },
        {
          onSuccess: () => {
            setNewSectionName("");
            setIsAddingSection(false);
            queryClient.invalidateQueries({ queryKey: getListSectionsQueryKey(slug) });
          }
        }
      );
    }
  };

  const handleToggleTask = (taskId: number, completed: boolean) => {
    if (!completed) {
      setCompletingId(taskId);
      setTimeout(() => setCompletingId(null), 750);
      setMascotMood("cheer");
      setTimeout(() => setMascotMood("idle"), 2200);
    }
    updateTask.mutate({ slug, taskId, data: { completed: !completed } }, {
      onSuccess: () => {
        if (!completed) {
          petBridge.taskCompleted();
          if (stats && stats.completed + 1 >= stats.total) {
            petBridge.allTasksCompleted();
          }
        }
        queryClient.invalidateQueries({ queryKey: getListTasksQueryKey(slug) });
        queryClient.invalidateQueries({ queryKey: getGetWorkspaceStatsQueryKey(slug) });
      }
    });
  };

  const filteredTasks = tasks?.filter(t => selectedSectionId ? t.sectionId === selectedSectionId : true) || [];
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.position !== b.position) {
      return a.position - b.position;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const completionPct = stats && stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const isImportantsSection = sections?.find(s => s.id === selectedSectionId)?.name?.toLowerCase().includes("import");

  if (wsLoading || sectionsLoading || tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ position: "relative", zIndex: 1 }}>
        <BlobBackground />
        <div className="flex flex-col items-center gap-4">
          <KawaiiMascot size={80} mood="idle" />
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full" style={{ position: "relative" }}>
      <BlobBackground />
      <KawaiiCornerDecos />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100/50"
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6 text-primary" />
        </button>
        <span className="font-semibold text-sm truncate max-w-[200px]">
          {selectedSectionId ? sections?.find(s => s.id === selectedSectionId)?.name : workspace?.name}
        </span>
        <div className="w-10" />
      </div>

      {/* Overlay escuro — só no mobile quando drawer aberto */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ═══════════════ SIDEBAR ═══════════════════════════════ */}
      <div className={`
        w-72 flex flex-col p-6 glass-sidebar border-r z-50 relative
        lg:relative lg:translate-x-0 lg:!transform-none fixed inset-y-0 left-0 transition-transform duration-300 ease-in-out
        ${drawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `} style={{ minHeight: "100vh" }}>
        <SidebarStickers />

        {/* Close button - Mobile only */}
        <button
          className="lg:hidden absolute top-3 right-3 p-2 text-muted-foreground hover:text-primary"
          onClick={() => setDrawerOpen(false)}
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sidebar mascot — reacts when a task is completed */}
        {(() => {
          const isFinished = stats && stats.completed === stats.total && stats.total > 0;
          const currentMascotMood = isFinished || isInputFocused ? "cheer" : mascotMood;
          return (
            <div className="flex flex-col items-center gap-2 mb-4 mt-2">
              <div
                className="float-animation"
                style={{
                  opacity: 0.85,
                  transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  transform: currentMascotMood === "cheer" ? "scale(1.18) translateY(-4px)" : "scale(1)",
                }}
              >
                <KawaiiMascot size={64} mood={currentMascotMood} />
              </div>
              {isRainbow && (
                <div className="flex gap-1 text-base" style={{ opacity: 0.45 }}>
                  {["💜", "🌸", "💜"].map((s, i) => (
                    <span key={i} style={{ animation: `twinkle ${3 + i}s ease-in-out infinite`, animationDelay: `${i * 0.4}s`, display: "inline-block" }}>
                      {s === "🌸" ? renderStickerIcon(s, 16) : s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Workspace name */}
        <div className="mb-6">
          {/* Sleepy Moon decoration for Turno Noite */}
          {workspace?.name?.toLowerCase().includes("noite") && (
            <div className="flex pl-7 mb-2">
              <img
                src={`${import.meta.env.BASE_URL}kawaii_moon.png`}
                alt="Lua de Orgulho"
                className="w-12 h-12 object-contain"
                style={{
                  filter: "drop-shadow(0 2px 6px rgba(167,139,250,0.35))",
                  animation: "sway 5s ease-in-out infinite",
                }}
              />
            </div>
          )}
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 fill-primary text-primary flex-shrink-0"
              style={{ filter: isRainbow ? "drop-shadow(0 0 6px rgba(236,72,153,0.5))" : undefined }} />
            <h1 className="text-xl font-black gradient-text truncate">{workspace?.name}</h1>
          </div>
          <p className="text-xs font-semibold text-muted-foreground/70 pl-7">{quote}</p>
          {/* Kawaii deco strip */}
          {isRainbow && (
            <div className="flex gap-1 mt-2 pl-7 text-sm" style={{ opacity: 0.5 }}>
              {["🌸", "💖", "⭐", "✨", "🎀"].map((s, i) => (
                <span key={i} style={{
                  animation: `floatUp ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.25}s`,
                  display: "inline-block",
                }}>{renderStickerIcon(s, 16)}</span>
              ))}
            </div>
          )}
        </div>

        {/* Progress ring */}
        {stats && (
          <div className="mb-6 flex items-center gap-4 p-4 rounded-2xl relative overflow-hidden" style={{
            background: isRainbow ? "rgba(255,255,255,0.5)" : "rgba(236,72,153,0.06)",
            border: "1px solid rgba(236,72,153,0.15)",
            boxShadow: isRainbow ? "0 4px 20px rgba(236,72,153,0.1)" : undefined,
          }}>
            {isRainbow && (
              <div style={{
                position: "absolute", top: -20, right: -20, width: 80, height: 80,
                background: "radial-gradient(circle, rgba(167,139,250,0.25), transparent 70%)",
                pointerEvents: "none",
              }} />
            )}
            <ProgressRing value={stats.completed} total={stats.total} size={68} />
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className="text-sm font-black text-foreground">{stats.completed} de {stats.total} feitas</div>
              <div className="w-full rounded-full overflow-hidden progress-shimmer" style={{ height: 7, background: "rgba(236,72,153,0.1)" }}>
                <div className="h-full rounded-full" style={{
                  width: `${completionPct}%`,
                  background: "linear-gradient(90deg, #ec4899, #a78bfa, #06b6d4)",
                  transition: "width 0.7s cubic-bezier(0.34,1.56,0.64,1)",
                  boxShadow: isRainbow ? "0 0 8px 2px rgba(236,72,153,0.4)" : undefined,
                }} />
              </div>
              <div className="text-xs font-bold" style={{ color: "#a78bfa" }}>{completionPct}% completo ✦</div>
              {stats.pinned > 0 && (
                <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                  <Pin className="w-3 h-3 text-primary" /> {stats.pinned} fixadas
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section nav */}
        <div className="flex-1 overflow-y-auto space-y-1.5">
          <button
            onClick={() => { setSelectedSectionId(null); setActiveTab("tasks"); setDrawerOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold transition-all duration-200"
            style={activeTab === "tasks" && selectedSectionId === null ? {
              background: "linear-gradient(135deg, #ec4899, #a78bfa)",
              color: "white",
              boxShadow: isRainbow ? "0 4px 16px rgba(236,72,153,0.35)" : "0 2px 10px rgba(236,72,153,0.2)",
              transform: "scale(1.03)",
            } : { color: "var(--color-muted-foreground)" }}
            onMouseEnter={e => { if (activeTab !== "tasks" || selectedSectionId !== null) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.6)"; }}
            onMouseLeave={e => { if (activeTab !== "tasks" || selectedSectionId !== null) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <img
              src={`${import.meta.env.BASE_URL}kawaii_all_tasks.png`}
              alt="Todas as Tarefas"
              className="w-10 h-10 object-contain flex-shrink-0"
              style={{
                filter: selectedSectionId === null ? "brightness(0) invert(1)" : "none",
                transition: "filter 0.2s ease"
              }}
            />
            Todas as Tarefas
          </button>

          {sections?.map((section, i) => {
            const pal = PALETTES[i % PALETTES.length];
            const isSelected = activeTab === "tasks" && selectedSectionId === section.id;
            const isImportant = section.name.toLowerCase().includes("import");
            return (
              <div key={section.id} className="group/section relative w-full flex items-center justify-between">
                <button
                  onClick={() => { setSelectedSectionId(section.id); setActiveTab("tasks"); setDrawerOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold transition-all duration-200 pr-10"
                  style={isSelected ? {
                    background: "linear-gradient(135deg, #ec4899, #a78bfa)",
                    color: "white",
                    boxShadow: isRainbow ? `0 4px 16px ${pal.glow}` : "0 2px 10px rgba(236,72,153,0.2)",
                    transform: "scale(1.03)",
                  } : {
                    color: "var(--color-muted-foreground)",
                    ...(isImportant && isRainbow ? { border: "1px solid rgba(251,191,36,0.35)" } : {}),
                  }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.6)"; }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {renderSectionSticker(section.emoji, isSelected)}
                  <span className="truncate">{section.name}</span>
                  {isImportant && <span className="ml-auto text-xs opacity-70">⭐</span>}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenResetConfirmModal(section.id, section.name);
                  }}
                  className="absolute right-3 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-white/40 opacity-0 group-hover/section:opacity-100 transition-opacity duration-200 hidden md:flex"
                  aria-label={`Resetar seção ${section.name}`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {isAddingSection ? (
            <Input autoFocus value={newSectionName}
              onChange={e => setNewSectionName(e.target.value)}
              onKeyDown={handleCreateSection}
              onBlur={() => setIsAddingSection(false)}
              placeholder="Nome da seção..."
              className="mt-2 rounded-2xl bg-white/60 border-primary/20 text-base lg:text-sm" />
          ) : (
            <button onClick={() => setIsAddingSection(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold text-muted-foreground hover:text-primary transition-all mt-1"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <img
                src={`${import.meta.env.BASE_URL}kawaii_new_section.png`}
                alt="Nova Seção"
                className="w-10 h-10 object-contain flex-shrink-0"
              />
              Nova Seção
            </button>
          )}

          <button onClick={() => { setHistoryModalOpen(true); setDrawerOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold text-muted-foreground hover:text-primary transition-all mt-1"
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.5)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <img
              src={`${import.meta.env.BASE_URL}kawaii_all_tasks.png`}
              alt="Histórico"
              className="w-10 h-10 object-contain flex-shrink-0"
            />
            Histórico
          </button>

          <button onClick={() => { setActiveTab("music"); setDrawerOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold transition-all mt-1"
            style={activeTab === "music" ? {
              background: "linear-gradient(135deg, #ec4899, #a78bfa)",
              color: "white",
              boxShadow: isRainbow ? "0 4px 16px rgba(236,72,153,0.35)" : "0 2px 10px rgba(236,72,153,0.2)",
              transform: "scale(1.03)",
            } : { color: "var(--color-muted-foreground)" }}
            onMouseEnter={e => { if (activeTab !== "music") (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.5)"; }}
            onMouseLeave={e => { if (activeTab !== "music") (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <img
              src={`${import.meta.env.BASE_URL}kawaii_music_icon.png`}
              alt="Música"
              className="w-10 h-10 object-contain flex-shrink-0"
              style={{
                filter: activeTab === "music" ? "brightness(0) invert(1)" : "none",
                transition: "filter 0.2s ease"
              }}
            />
            Música
          </button>

          {/* Botões de Ações de Reiniciar Integrados */}
          <div className="pt-2 border-t border-primary/10 mt-2 space-y-1">
            <button
              onClick={() => handleOpenResetConfirmModal(null, "Turno Completo")}
              disabled={restartShift.isPending}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold text-muted-foreground hover:text-primary transition-all"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {restartShift.isPending ? (
                <Loader2 className="w-10 h-10 animate-spin text-primary flex-shrink-0 p-1.5" />
              ) : (
                <img
                  src={`${import.meta.env.BASE_URL}kawaii_reset_shift_icon.png`}
                  alt="Reiniciar Turno"
                  className="w-10 h-10 object-contain flex-shrink-0 animate-bounce-slow"
                  style={{ filter: "drop-shadow(0 2px 4px rgba(236,72,153,0.3))" }}
                />
              )}
              <span>Reiniciar Turno</span>
            </button>

            <button
              onClick={() => handleOpenResetConfirmModal(-999, "Tarefas Semanais")}
              disabled={restartShift.isPending}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold text-muted-foreground hover:text-primary transition-all"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {restartShift.isPending ? (
                <Loader2 className="w-10 h-10 animate-spin text-primary flex-shrink-0 p-1.5" />
              ) : (
                <img
                  src={`${import.meta.env.BASE_URL}kawaii_reset_weekly_icon.png`}
                  alt="Reiniciar Semanais"
                  className="w-10 h-10 object-contain flex-shrink-0 animate-bounce-slow"
                  style={{ filter: "drop-shadow(0 2px 4px rgba(34,197,94,0.3))" }}
                />
              )}
              <span>Reiniciar Semanais</span>
            </button>
          </div>
        </div>



        <div className="mt-auto" />
      </div>

      {/* ═══════════════ MAIN AREA ════════════════════════════ */}
      <div className="flex-1 flex flex-col p-4 md:p-8 lg:p-12 pt-20 lg:pt-12 overflow-y-auto" style={{ position: "relative", zIndex: 1 }}>
        <div className="max-w-3xl w-full mx-auto">
          {/* Aba de Tarefas (Keep-Alive via CSS hiding) */}
          <div className={activeTab === "tasks" ? "space-y-8 animate-fade-in" : "hidden"}>

          {/* Header */}
          <header className="flex items-center gap-3">
            <h2 className="text-4xl font-black gradient-text" style={
              isImportantsSection && isRainbow ? {
                background: "linear-gradient(135deg, #f59e0b, #fbbf24, #f97316)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                filter: "drop-shadow(0 0 8px rgba(251,191,36,0.4))",
              } : {}}>
              {selectedSectionId ? sections?.find(s => s.id === selectedSectionId)?.name : "Todas as Tarefas"}
            </h2>
            <Sparkles className="w-7 h-7" style={{
              color: isImportantsSection ? "#f59e0b" : "hsl(var(--secondary))",
              filter: isRainbow ? "drop-shadow(0 0 6px rgba(236,72,153,0.5))" : undefined,
              animation: isRainbow ? "sparkBurst 2.5s ease-in-out infinite" : undefined,
            }} />
            {isImportantsSection && isRainbow && (
              <span style={{ fontSize: 22, animation: "starSpin 4s linear infinite", display: "inline-block" }}>⭐</span>
            )}
          </header>

          {/* Task input */}
          <div className="relative">
            <Input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={handleCreateTask}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="O que vamos fazer hoje? ✨"
              className="h-16 pl-6 pr-12 text-xl rounded-full glass-card border-primary/20 shadow-md focus-visible:ring-primary focus-visible:ring-2 font-semibold placeholder:text-muted-foreground/60"
              style={isRainbow ? { boxShadow: "0 4px 20px rgba(236,72,153,0.15), 0 2px 8px rgba(167,139,250,0.1)" } : undefined}
            />
            {createTask.isPending && <Loader2 className="w-6 h-6 absolute right-4 top-5 animate-spin text-primary" />}
          </div>

          {/* Task list / Empty state */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              /* ── KAWAII EMPTY STATE ── */
              <div className="text-center py-12 flex flex-col items-center gap-4">

                {/* Rainbow arc + mascot */}
                <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "flex-end", height: 160, width: "100%" }}>
                  {isRainbow && <RainbowArc />}
                  <div className="bounce-in" style={{ position: "relative", zIndex: 2 }}>
                    <KawaiiMascot size={130} mood={stats && stats.completed === stats.total && stats.total > 0 ? "cheer" : "idle"} />
                  </div>
                  {/* Orbiting stars */}
                  {isRainbow && (
                    <>
                      {[0, 120, 240].map((deg, i) => (
                        <div key={i} style={{
                          position: "absolute", bottom: "35%", left: "50%",
                          fontSize: 16, opacity: 0.6,
                          animation: `orbit ${5 + i}s linear infinite`,
                          animationDelay: `${i * -1.5}s`,
                          marginLeft: -8, marginBottom: -8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          {renderStickerIcon(["⭐", "✨", "💖"][i], 18)}
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-black gradient-text mb-2">Sua lista mágica está esperando! ✨</h3>
                  <p className="text-muted-foreground font-semibold">Adicione sua primeira tarefa e vamos nessa 🌟</p>
                  <p className="text-sm text-muted-foreground/70 mt-1 font-medium">Digite acima e pressione Enter</p>
                </div>

                {/* Sticker row */}
                {isRainbow && (
                  <div className="flex gap-3 text-2xl" style={{ opacity: 0.55 }}>
                    {["✦", "🌸", "🌈", "💖", "🎀", "✦"].map((s, i) => (
                      <span key={i} style={{
                        animation: `floatUp ${2.5 + i * 0.35}s ease-in-out infinite`,
                        animationDelay: `${i * 0.28}s`,
                        display: "inline-block",
                      }}>{renderStickerIcon(s, 24)}</span>
                    ))}
                  </div>
                )}
              </div>

            ) : selectedSectionId !== null ? (
              /* ── SINGLE SECTION SORTABLE TASK LIST ── */
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragCancel={handleDragCancel}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortedTasks.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {sortedTasks.map((task, idx) => (
                      <SortableTaskCard
                        key={task.id}
                        task={task}
                        idx={idx}
                        sectionMap={sectionMap}
                        isRainbow={isRainbow}
                        completingId={completingId}
                        handleToggleTask={handleToggleTask}
                        onDeleteRequest={handleDeleteTask}
                        slug={slug}
                        queryClient={queryClient}
                      />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeId ? (
                    <TaskCardVisual
                      task={tasks?.find(t => t.id === activeId)}
                      sectionMap={sectionMap}
                      isRainbow={isRainbow}
                      isOverlay
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            ) : (
              /* ── ALL TASKS VIEW - MULTIPLE INDEPENDENT SORTABLE CONTEXTS ── */
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragCancel={handleDragCancel}
                onDragEnd={handleDragEnd}
              >
                <div className="space-y-8">
                  {sections?.map((section) => {
                    const sectionTasks = sortedTasks.filter(t => t.sectionId === section.id);
                    if (sectionTasks.length === 0) return null;

                    sectionTasks.sort((a, b) => a.position - b.position);

                    return (
                      <div key={section.id} className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                          <span className="text-lg">{section.emoji}</span>
                          <h4 className="text-lg font-black text-foreground/80">{section.name}</h4>
                          <span className="text-xs font-bold text-muted-foreground/60">({sectionTasks.length})</span>
                        </div>
                        <SortableContext
                          items={sectionTasks.map(t => t.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-3">
                            {sectionTasks.map((task, idx) => (
                              <SortableTaskCard
                                key={task.id}
                                task={task}
                                idx={idx}
                                sectionMap={sectionMap}
                                isRainbow={isRainbow}
                                completingId={completingId}
                                handleToggleTask={handleToggleTask}
                                onDeleteRequest={handleDeleteTask}
                                slug={slug}
                                queryClient={queryClient}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </div>
                    );
                  })}

                  {/* Tarefas órfãs (sem seção associada, se houver) */}
                  {sortedTasks.filter(t => t.sectionId === null).length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-black text-foreground/80 px-1">Geral</h4>
                      <SortableContext
                        items={sortedTasks.filter(t => t.sectionId === null).map(t => t.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {sortedTasks.filter(t => t.sectionId === null).map((task, idx) => (
                            <SortableTaskCard
                              key={task.id}
                              task={task}
                              idx={idx}
                              sectionMap={sectionMap}
                              isRainbow={isRainbow}
                              completingId={completingId}
                              handleToggleTask={handleToggleTask}
                              onDeleteRequest={handleDeleteTask}
                              slug={slug}
                              queryClient={queryClient}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </div>
                  )}
                </div>
                <DragOverlay>
                  {activeId ? (
                    <TaskCardVisual
                      task={tasks?.find(t => t.id === activeId)}
                      sectionMap={sectionMap}
                      isRainbow={isRainbow}
                      isOverlay
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
          </div>

          {/* Aba de Música (Keep-Alive via CSS hiding para evitar parar música no background) */}
          <div className={activeTab === "music" ? "animate-fade-in" : "hidden"}>
            <MusicPlayer />
          </div>
        </div>
      </div>

      {/* Modal de Confirmação Acessível (Radix Dialog) */}
      <Dialog open={resetModalOpen} onOpenChange={setResetModalOpen}>
        <DialogContent className="max-w-md rounded-3xl glass-card border-primary/20 p-6">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-black gradient-text flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-primary animate-spin-slow" />
              {targetResetSection?.id === -999 ? "Reiniciar Semanais?" : targetResetSection?.id === null ? "Reiniciar Turno? ✨" : "Resetar Seção?"}
            </DialogTitle>
            <DialogDescription className="text-base font-semibold text-muted-foreground/80">
              {targetResetSection?.id === -999 ? (
                <>
                  Deseja reiniciar exclusivamente as tarefas das seções{" "}
                  <span className="font-extrabold text-[#ec4899]">Semanais</span>? 
                  As tarefas concluídas dessas seções serão limpas para uma nova semana.
                </>
              ) : targetResetSection?.id === null ? (
                <>
                  Deseja reiniciar seu turno diário? As tarefas das seções normais concluídas serão salvas no histórico.
                </>
              ) : (
                <>
                  Tem certeza que deseja resetar a lista de{" "}
                  <span className="font-extrabold text-[#ec4899]">
                    {targetResetSection?.name}
                  </span>
                  ? As tarefas ativas serão arquivadas e as recorrentes redefinidas do zero.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {targetResetSection?.id === null && (
            <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col gap-2">
              <label className="text-sm font-bold text-muted-foreground/80 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" /> Data do Turno:
              </label>
              <Input
                type="date"
                value={customResetDate}
                onChange={(e) => setCustomResetDate(e.target.value)}
                className="rounded-xl border-primary/20 bg-white/80 dark:bg-gray-800/80 font-bold text-center text-lg h-12"
              />
            </div>
          )}

          <DialogFooter className="mt-6 flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setResetModalOpen(false)}
              className="rounded-2xl font-bold h-12 px-6"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmReset}
              disabled={restartShift.isPending}
              className="rounded-2xl font-black h-12 px-6 text-white"
              style={{
                background: "linear-gradient(135deg, #ec4899 0%, #a78bfa 100%)",
                boxShadow: "0 4px 14px rgba(236,72,153,0.25)",
              }}
            >
              {restartShift.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Histórico dos Últimos 7 Dias */}
      <Dialog open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
        <DialogContent className="max-w-2xl rounded-3xl glass-card border-primary/20 p-6 max-h-[85vh] flex flex-col">
          <DialogHeader className="space-y-2 flex-shrink-0">
            <DialogTitle className="text-2xl font-black gradient-text flex items-center gap-2">
              <img
                src={`${import.meta.env.BASE_URL}kawaii_history_icon.png`}
                alt="Histórico"
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              Histórico de Turnos ✦
            </DialogTitle>
            <DialogDescription className="text-base font-semibold text-muted-foreground/80">
              Veja as tarefas concluídas a cada reinicialização de turno no calendário.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-6 my-2 pr-1" style={{ maxHeight: "calc(85vh - 180px)" }}>
            {historyLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-sm font-semibold text-muted-foreground">Carregando histórico mágico...</span>
              </div>
            ) : !dailyHistory || dailyHistory.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center gap-3">
                <span className="text-4xl">✨</span>
                <h4 className="text-lg font-black text-foreground/80">Nenhum turno arquivado ainda!</h4>
                <p className="text-sm font-semibold text-muted-foreground max-w-xs">
                  Quando você clicar em "Reiniciar Turno", as tarefas que concluiu hoje aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Calendário Grid */}
                <div className="p-4 rounded-3xl bg-white/40 dark:bg-gray-900/40 border border-primary/10 shadow-sm space-y-4">
                  {/* Cabeçalho do Calendário com navegação */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handlePrevMonth}
                      className="p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all font-bold text-lg"
                      aria-label="Mês anterior"
                    >
                      &lt;
                    </button>
                    <h4 className="text-lg font-black gradient-text capitalize">
                      {displayedMonthYear}
                    </h4>
                    <button
                      onClick={handleNextMonth}
                      className="p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all font-bold text-lg"
                      aria-label="Próximo mês"
                    >
                      &gt;
                    </button>
                  </div>

                  {/* Dias da semana */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-black text-muted-foreground/60 uppercase">
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => (
                      <div key={d} className="py-1">{d}</div>
                    ))}
                  </div>

                  {/* Grid de dias do mês */}
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: firstDayIndex }).map((_, i) => (
                      <div key={`blank-${i}`} className="aspect-square" />
                    ))}
                    {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const dayDate = new Date(year, month, dayNum);
                      const dateString = dayDate.toLocaleDateString("sv-SE");
                      const hasHistory = historyMap.has(dateString);
                      const isSelected = selectedHistoryDay?.date === dateString;

                      return (
                        <button
                          key={dayNum}
                          disabled={!hasHistory}
                          onClick={() => handleDayClick(dateString)}
                          className={`
                            aspect-square rounded-2xl flex flex-col items-center justify-center font-bold text-base transition-all relative
                            ${hasHistory 
                              ? "cursor-pointer hover:scale-105 active:scale-95 shadow-sm" 
                              : "text-muted-foreground/30 bg-transparent cursor-default disabled:opacity-50"}
                            ${isSelected 
                              ? "bg-gradient-to-br from-[#ec4899] to-[#a78bfa] text-white shadow-md ring-2 ring-primary/20 scale-105" 
                              : hasHistory 
                                ? "bg-pink-100/60 dark:bg-pink-950/30 text-[#be185d] dark:text-pink-300 border border-pink-200/50 hover:bg-pink-200/50" 
                                : ""}
                          `}
                        >
                          <span>{dayNum}</span>
                          {hasHistory && !isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ec4899] absolute bottom-1.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Detalhes do Dia Selecionado */}
                {selectedHistoryDay ? (
                  (() => {
                    const formattedDate = new Date(selectedHistoryDay.date).toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "2-digit",
                      month: "2-digit",
                      timeZone: "UTC"
                    });
                    const isCopied = copiedDayId === selectedHistoryDay.id;

                    return (
                      <div className="p-5 rounded-3xl glass-card border border-primary/10 space-y-4 animate-fade-in"
                        style={{ background: isRainbow ? "rgba(255,255,255,0.4)" : "rgba(236,72,153,0.02)" }}>
                        
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <span className="text-xs font-black text-primary/70 uppercase tracking-wider block">
                              Turno Arquivado
                            </span>
                            <h4 className="text-lg font-black text-foreground capitalize truncate">
                              {formattedDate}
                            </h4>
                          </div>
                          
                          <Button
                            onClick={() => handleCopyHistoryReport(selectedHistoryDay)}
                            size="sm"
                            className="rounded-full font-bold h-9 px-4 flex items-center gap-1.5 transition-all text-white border-0"
                            style={{
                              background: isCopied ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #ec4899 0%, #a78bfa 100%)",
                              boxShadow: "0 2px 8px rgba(236,72,153,0.15)",
                            }}
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                            {isCopied ? "Copiado! ✧" : "Copiar"}
                          </Button>
                        </div>

                        <div className="w-full h-px bg-primary/5" />

                        <div className="space-y-2 pl-1">
                          {selectedHistoryDay.tasks.map((task: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-2.5 text-base lg:text-sm font-semibold text-muted-foreground">
                              <span className="text-primary mt-0.5">✓</span>
                              <span className="text-foreground/90">{task.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-center py-8 p-4 rounded-3xl bg-primary/5 border border-dashed border-primary/20 flex flex-col items-center gap-2">
                    <span className="text-2xl">💡</span>
                    <p className="text-sm font-bold text-muted-foreground/80">
                      Selecione um dia destacado com a bolinha rosa no calendário para ver os detalhes do turno!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex-shrink-0 pt-3 border-t border-primary/5">
            <Button
              onClick={() => setHistoryModalOpen(false)}
              className="rounded-2xl font-bold h-12 px-6 w-full lg:w-auto"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal de Confirmação de Exclusão de Tarefa Removido para Ação Direta */}
    </div>
  );
}
