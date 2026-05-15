import type { ThemeMode } from "../types/petTypes";

export interface PetTheme {
  bg: string;
  demoBg: string;
  card: string;
  accent: string;
  text: string;
  subtext: string;
  border: string;
  glow: string;
  badge: string;
  badgeText: string;
  button: string;
  buttonText: string;
  progressBg: string;
  progressFill: string;
  petBody: string;
  petFace: string;
  petAccent: string;
}

export const KAWAII_THEME: PetTheme = {
  bg: "from-pink-50 via-purple-50 to-sky-50",
  demoBg: "from-fuchsia-950 via-purple-950 to-indigo-950",
  card: "bg-white/70 backdrop-blur-md",
  accent: "#f472b6",
  text: "#6b21a8",
  subtext: "#a855f7",
  border: "border-pink-200/50",
  glow: "shadow-[0_0_40px_rgba(244,114,182,0.3)]",
  badge: "bg-gradient-to-r from-pink-400 to-purple-500",
  badgeText: "text-white",
  button: "bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600",
  buttonText: "text-white",
  progressBg: "bg-pink-100/60",
  progressFill: "from-pink-400 to-purple-500",
  petBody: "#f9a8d4",
  petFace: "#fce7f3",
  petAccent: "#e879f9",
};

export const CLEAN_THEME: PetTheme = {
  bg: "from-slate-100 to-gray-100",
  demoBg: "from-slate-900 via-slate-800 to-zinc-900",
  card: "bg-white/20 backdrop-blur-xl",
  accent: "#94a3b8",
  text: "#334155",
  subtext: "#94a3b8",
  border: "border-white/20",
  glow: "shadow-[0_4px_32px_rgba(0,0,0,0.08)]",
  badge: "bg-white/10 backdrop-blur-sm border border-white/20",
  badgeText: "text-slate-300",
  button: "bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm",
  buttonText: "text-slate-300",
  progressBg: "bg-white/10",
  progressFill: "from-slate-400 to-slate-300",
  petBody: "#94a3b8",
  petFace: "#cbd5e1",
  petAccent: "#64748b",
};

export function getTheme(mode: ThemeMode): PetTheme {
  return mode === "kawaii" ? KAWAII_THEME : CLEAN_THEME;
}
