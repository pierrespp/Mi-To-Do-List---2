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
  getListTasksQueryKey,
  getGetWorkspaceStatsQueryKey,
  getListSectionsQueryKey,
} from "@/lib/api-supabase";
import { useState, KeyboardEvent, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Plus, Trash2, Heart, Star, Sparkles, Loader2, Pin, Calendar, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ThemeToggle";
import { petBridge } from "../../../../src/integrations/petBridge";

/* ─── Section colour palette ─────────────────────────────────── */
const PALETTES = [
  { bg: "rgba(252,165,165,0.22)",  border: "rgba(252,165,165,0.5)",  text: "#dc2626", glow: "rgba(252,165,165,0.45)"  },
  { bg: "rgba(253,224,71,0.22)",   border: "rgba(253,224,71,0.55)",  text: "#b45309", glow: "rgba(253,224,71,0.45)"   },
  { bg: "rgba(196,181,253,0.25)",  border: "rgba(196,181,253,0.5)",  text: "#7c3aed", glow: "rgba(196,181,253,0.45)"  },
  { bg: "rgba(103,232,249,0.2)",   border: "rgba(103,232,249,0.5)",  text: "#0891b2", glow: "rgba(103,232,249,0.4)"   },
  { bg: "rgba(134,239,172,0.2)",   border: "rgba(134,239,172,0.5)",  text: "#15803d", glow: "rgba(134,239,172,0.4)"   },
  { bg: "rgba(249,168,212,0.22)",  border: "rgba(249,168,212,0.5)",  text: "#be185d", glow: "rgba(249,168,212,0.45)"  },
];

/* ─── Main bunny mascot ───────────────────────────────────────── */
function KawaiiMascot({ size = 96, mood = "happy" }: { size?: number; mood?: "happy" | "idle" | "cheer" }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 120 138" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 4px 16px rgba(236,72,153,0.3))" }}>
      <ellipse cx="37" cy="38" rx="14" ry="26" fill="#f9c8d9" />
      <ellipse cx="37" cy="38" rx="8" ry="18" fill="#f7a8c4" />
      <ellipse cx="83" cy="38" rx="14" ry="26" fill="#f9c8d9" />
      <ellipse cx="83" cy="38" rx="8" ry="18" fill="#f7a8c4" />
      <ellipse cx="60" cy="88" rx="44" ry="44" fill="#fff5f8" />
      <ellipse cx="60" cy="88" rx="44" ry="44" fill="url(#bunnyGrad)" />
      <circle cx="45" cy="81" r="7" fill="#1a0033" />
      <circle cx="75" cy="81" r="7" fill="#1a0033" />
      <circle cx="47" cy="79" r="2.5" fill="white" />
      <circle cx="77" cy="79" r="2.5" fill="white" />
      <ellipse cx="34" cy="91" rx="9" ry="5.5" fill="#f9a8d4" opacity="0.55" />
      <ellipse cx="86" cy="91" rx="9" ry="5.5" fill="#f9a8d4" opacity="0.55" />
      <ellipse cx="60" cy="94" rx="4" ry="3" fill="#e87dab" />
      {mood === "cheer" ? (
        <path d="M 52 100 Q 60 110 68 100" stroke="#e87dab" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      ) : (
        <path d="M 54 100 Q 60 107 66 100" stroke="#e87dab" strokeWidth="2" fill="none" strokeLinecap="round"/>
      )}
      <text x="94" y="62" fontSize="14" fill="#f9a8d4" opacity="0.9">✦</text>
      <text x="10" y="60" fontSize="10" fill="#c4b5fd" opacity="0.8">✦</text>
      {mood === "cheer" && (
        <>
          <text x="96" y="88" fontSize="13" fill="#fde68a">⭐</text>
          <text x="8" y="85" fontSize="11" fill="#f9a8d4">✨</text>
        </>
      )}
      <defs>
        <radialGradient id="bunnyGrad" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#fff5f8" />
          <stop offset="100%" stopColor="#fce7f3" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ─── Mini kawaii star character ──────────────────────────────── */
function StarKawaii({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="30,4 36,22 55,22 41,33 46,51 30,40 14,51 19,33 5,22 24,22"
        fill="#fde68a" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="24" cy="27" r="3" fill="#1a0033" />
      <circle cx="36" cy="27" r="3" fill="#1a0033" />
      <circle cx="25" cy="26" r="1.2" fill="white" />
      <circle cx="37" cy="26" r="1.2" fill="white" />
      <ellipse cx="19" cy="32" rx="4" ry="2.5" fill="#f9a8d4" opacity="0.5" />
      <ellipse cx="41" cy="32" rx="4" ry="2.5" fill="#f9a8d4" opacity="0.5" />
      <path d="M 25 34 Q 30 39 35 34" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Mini kawaii cloud character ─────────────────────────────── */
function CloudKawaii({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 80 55" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="37" rx="32" ry="17" fill="white" />
      <ellipse cx="26" cy="29" rx="16" ry="14" fill="white" />
      <ellipse cx="50" cy="25" rx="19" ry="16" fill="white" />
      <ellipse cx="40" cy="37" rx="32" ry="17" fill="rgba(196,181,253,0.3)" />
      <ellipse cx="26" cy="29" rx="16" ry="14" fill="rgba(196,181,253,0.2)" />
      <ellipse cx="50" cy="25" rx="19" ry="16" fill="rgba(249,168,212,0.2)" />
      <circle cx="33" cy="35" r="3" fill="#1a0033" />
      <circle cx="47" cy="35" r="3" fill="#1a0033" />
      <circle cx="34" cy="34" r="1.2" fill="white" />
      <circle cx="48" cy="34" r="1.2" fill="white" />
      <path d="M 35 41 Q 40 46 45 41" stroke="#a78bfa" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Mini kawaii heart character ─────────────────────────────── */
function HeartKawaii({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.95} viewBox="0 0 60 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 52 C6 37 4 10 20 8 C25 7 30 14 30 14 C30 14 35 7 40 8 C56 10 54 37 30 52Z"
        fill="#fda4af" stroke="#fb7185" strokeWidth="1.5"/>
      <path d="M30 52 C6 37 4 10 20 8 C25 7 30 14 30 14 C30 14 35 7 40 8 C56 10 54 37 30 52Z"
        fill="url(#heartGrad)" />
      <circle cx="23" cy="25" r="3" fill="#1a0033" />
      <circle cx="37" cy="25" r="3" fill="#1a0033" />
      <circle cx="24" cy="24" r="1.2" fill="white" />
      <circle cx="38" cy="24" r="1.2" fill="white" />
      <ellipse cx="17" cy="30" rx="4" ry="2.5" fill="#fff" opacity="0.45" />
      <ellipse cx="43" cy="30" rx="4" ry="2.5" fill="#fff" opacity="0.45" />
      <path d="M 25 33 Q 30 38 35 33" stroke="#ec4899" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <defs>
        <linearGradient id="heartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(253,164,175,0.5)" />
          <stop offset="100%" stopColor="rgba(251,113,133,0.2)" />
        </linearGradient>
      </defs>
    </svg>
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
      {PARTICLES.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          width: i % 2 === 0 ? 7 : 5,
          height: i % 2 === 0 ? 7 : 5,
          borderRadius: "50%",
          background: p.color,
          marginLeft: i % 2 === 0 ? -3.5 : -2.5,
          marginTop:  i % 2 === 0 ? -3.5 : -2.5,
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
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(236,72,153,0.12)" strokeWidth={8} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
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
const STICKERS = [
  { emoji: "🌸", top: "7%",  right: "4%",  size: 30, opacity: 0.28, anim: "drift 7s ease-in-out infinite",    delay: "0s",   blur: "0.5px" },
  { emoji: "☁️", top: "18%", left: "2%",   size: 28, opacity: 0.22, anim: "floatUp 8s ease-in-out infinite",  delay: "1.2s", blur: "1px"   },
  { emoji: "💖", top: "42%", right: "2%",  size: 26, opacity: 0.26, anim: "sway 5s ease-in-out infinite",     delay: "0.5s", blur: "0.5px" },
  { emoji: "🎀", top: "65%", left: "1.5%", size: 28, opacity: 0.22, anim: "drift 9s ease-in-out infinite",    delay: "2s",   blur: "1px"   },
  { emoji: "⭐", top: "78%", right: "5%",  size: 24, opacity: 0.3,  anim: "twinkle 4s ease-in-out infinite",  delay: "1.5s", blur: "0"     },
  { emoji: "✨", top: "28%", left: "3%",   size: 22, opacity: 0.25, anim: "sparkBurst 3.5s ease-in-out infinite", delay: "0.8s", blur: "0" },
  { emoji: "🌈", top: "88%", right: "10%", size: 32, opacity: 0.18, anim: "floatUp 11s ease-in-out infinite", delay: "3s",   blur: "1px"   },
  { emoji: "🦋", top: "55%", left: "2%",   size: 24, opacity: 0.2,  anim: "sway 6s ease-in-out infinite",     delay: "1s",   blur: "0.5px" },
  { emoji: "🌟", top: "12%", left: "30%",  size: 20, opacity: 0.18, anim: "twinkle 5s ease-in-out infinite",  delay: "2.5s", blur: "0"     },
  { emoji: "💫", top: "50%", right: "8%",  size: 20, opacity: 0.22, anim: "orbit 8s linear infinite",         delay: "0s",   blur: "0"     },
  { emoji: "🌺", top: "33%", right: "6%",  size: 22, opacity: 0.2,  anim: "drift 10s ease-in-out infinite",   delay: "4s",   blur: "1px"   },
  { emoji: "💝", top: "72%", left: "5%",   size: 22, opacity: 0.22, anim: "floatUp 6s ease-in-out infinite",  delay: "0.3s", blur: "0"     },
];

function BlobBackground() {
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
      {STICKERS.map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          top: s.top,
          ...(s.left ? { left: s.left } : { right: s.right }),
          fontSize: s.size,
          opacity: s.opacity,
          filter: `blur(${s.blur})`,
          animation: s.anim,
          animationDelay: s.delay,
          lineHeight: 1,
          userSelect: "none",
        }}>{s.emoji}</div>
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
    { emoji: "🌸", top: 10, right: 10, size: 20, anim: "twinkle 4s ease-in-out infinite", delay: "0s" },
    { emoji: "✨", top: 38, right: 16, size: 14, anim: "sparkBurst 3s ease-in-out infinite", delay: "0.5s" },
    { emoji: "💫", top: 60, right: 8,  size: 16, anim: "floatUp 5s ease-in-out infinite",   delay: "1s"  },
  ];
  return (
    <div className="blob-bg" style={{ position: "absolute", top: 0, right: 0, width: 40, height: 90, pointerEvents: "none" }}>
      {items.map((it, i) => (
        <div key={i} style={{
          position: "absolute", top: it.top, right: it.right,
          fontSize: it.size, opacity: 0.45,
          animation: it.anim, animationDelay: it.delay,
        }}>{it.emoji}</div>
      ))}
    </div>
  );
}

/* ─── Rainbow arc for empty state ────────────────────────────── */
function RainbowArc() {
  return (
    <svg viewBox="0 0 300 160" width="260" style={{ opacity: 0.35, position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", zIndex: 0 }}>
      <path d="M 15 148 Q 150 -15 285 148" stroke="#ec4899" strokeWidth="11" fill="none" strokeLinecap="round"/>
      <path d="M 32 148 Q 150 8 268 148"   stroke="#f97316" strokeWidth="9"  fill="none" strokeLinecap="round"/>
      <path d="M 50 148 Q 150 30 250 148"  stroke="#fbbf24" strokeWidth="7"  fill="none" strokeLinecap="round"/>
      <path d="M 68 148 Q 150 50 232 148"  stroke="#22c55e" strokeWidth="5"  fill="none" strokeLinecap="round"/>
      <path d="M 86 148 Q 150 68 214 148"  stroke="#06b6d4" strokeWidth="4"  fill="none" strokeLinecap="round"/>
      <path d="M 104 148 Q 150 84 196 148" stroke="#a78bfa" strokeWidth="3"  fill="none" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Daily quotes ────────────────────────────────────────────── */
const QUOTES = [
  "You're doing amazing ✨",
  "One task at a time 💖",
  "Progress, not perfection 🌸",
  "You've got this, bb 🌟",
  "Making magic happen ✦",
  "Small steps = big magic 🌈",
  "Proud of you today 💜",
];

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

  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newSectionName, setNewSectionName] = useState("");
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [mascotMood, setMascotMood] = useState<"idle" | "cheer">("idle");

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const createSection = useCreateSection();
  const restartShift = useRestartShift();

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
        { onSuccess: () => {
          setNewTaskTitle("");
          queryClient.invalidateQueries({ queryKey: getListTasksQueryKey(slug) });
          queryClient.invalidateQueries({ queryKey: getGetWorkspaceStatsQueryKey(slug) });
        }}
      );
    }
  };

  const handleCreateSection = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSectionName.trim()) {
      createSection.mutate(
        { slug, data: { name: newSectionName.trim(), emoji: "✨" } },
        { onSuccess: () => {
          setNewSectionName("");
          setIsAddingSection(false);
          queryClient.invalidateQueries({ queryKey: getListSectionsQueryKey(slug) });
        }}
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

      {/* ═══════════════ SIDEBAR ═══════════════════════════════ */}
      <div className="w-72 flex flex-col p-6 glass-sidebar border-r z-10 relative" style={{ minHeight: "100vh" }}>
        <SidebarStickers />

        {/* Workspace name */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 fill-primary text-primary flex-shrink-0"
              style={{ filter: isRainbow ? "drop-shadow(0 0 6px rgba(236,72,153,0.5))" : undefined }} />
            <h1 className="text-xl font-black gradient-text truncate">{workspace?.name}</h1>
          </div>
          <p className="text-xs font-semibold text-muted-foreground/70 pl-7">{quote}</p>
          {/* Kawaii deco strip */}
          {isRainbow && (
            <div className="flex gap-1 mt-2 pl-7 text-sm" style={{ opacity: 0.5 }}>
              {["🌸","💖","⭐","✨","🎀"].map((s, i) => (
                <span key={i} style={{
                  animation: `floatUp ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.25}s`,
                  display: "inline-block",
                }}>{s}</span>
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
            onClick={() => setSelectedSectionId(null)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold transition-all duration-200"
            style={selectedSectionId === null ? {
              background: "linear-gradient(135deg, #ec4899, #a78bfa)",
              color: "white",
              boxShadow: isRainbow ? "0 4px 16px rgba(236,72,153,0.35)" : "0 2px 10px rgba(236,72,153,0.2)",
              transform: "scale(1.03)",
            } : { color: "var(--color-muted-foreground)" }}
            onMouseEnter={e => { if (selectedSectionId !== null) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.6)"; }}
            onMouseLeave={e => { if (selectedSectionId !== null) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <Star className="w-5 h-5 flex-shrink-0" /> Todas as Tarefas
          </button>

          {sections?.map((section, i) => {
            const pal = PALETTES[i % PALETTES.length];
            const isSelected = selectedSectionId === section.id;
            const isImportant = section.name.toLowerCase().includes("import");
            return (
              <button key={section.id}
                onClick={() => setSelectedSectionId(section.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold transition-all duration-200"
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
                <span className="flex-shrink-0">{section.emoji}</span>
                <span className="truncate">{section.name}</span>
                {isImportant && <span className="ml-auto text-xs opacity-70">⭐</span>}
              </button>
            );
          })}

          {isAddingSection ? (
            <Input autoFocus value={newSectionName}
              onChange={e => setNewSectionName(e.target.value)}
              onKeyDown={handleCreateSection}
              onBlur={() => setIsAddingSection(false)}
              placeholder="Nome da seção..."
              className="mt-2 rounded-2xl bg-white/60 border-primary/20" />
          ) : (
            <button onClick={() => setIsAddingSection(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold text-muted-foreground hover:text-primary transition-all mt-1"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <Plus className="w-5 h-5" /> Nova Seção
            </button>
          )}
        </div>

        {/* Sidebar mascot — reacts when a task is completed */}
        {isRainbow && (
          <div className="flex flex-col items-center gap-2 mt-4 mb-2">
            <div
              className="float-animation"
              style={{
                opacity: 0.82,
                transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                transform: mascotMood === "cheer" ? "scale(1.18) translateY(-4px)" : "scale(1)",
              }}
            >
              <KawaiiMascot size={52} mood={mascotMood} />
            </div>
            <div className="flex gap-1 text-base" style={{ opacity: 0.4 }}>
              {["💜","🌸","💜"].map((s, i) => (
                <span key={i} style={{ animation: `twinkle ${3 + i}s ease-in-out infinite`, animationDelay: `${i * 0.4}s`, display: "inline-block" }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Reiniciar Turno */}
        <div className="pt-4 mt-auto">
          <Button className="w-full rounded-2xl h-14 text-base font-black border-0 text-white"
            style={{
              background: "linear-gradient(135deg, #ec4899 0%, #a78bfa 60%, #06b6d4 100%)",
              boxShadow: isRainbow ? "0 4px 20px rgba(236,72,153,0.4), 0 0 40px rgba(167,139,250,0.2)" : "0 4px 14px rgba(236,72,153,0.25)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(236,72,153,0.55)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = isRainbow ? "0 4px 20px rgba(236,72,153,0.4)" : "0 4px 14px rgba(236,72,153,0.25)"; }}
            onClick={() => {
              restartShift.mutate({ slug }, {
                onSuccess: () => {
                  petBridge.turnRestart();
                  queryClient.invalidateQueries({ queryKey: getListTasksQueryKey(slug) });
                  queryClient.invalidateQueries({ queryKey: getGetWorkspaceStatsQueryKey(slug) });
                }
              });
            }}>
            {restartShift.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <RefreshCw className="w-5 h-5 mr-2" />}
            ✨ Reiniciar Turno
          </Button>
        </div>
      </div>

      {/* ═══════════════ MAIN AREA ════════════════════════════ */}
      <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto" style={{ position: "relative", zIndex: 1 }}>
        <div className="max-w-3xl w-full mx-auto space-y-8">

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
                    <KawaiiMascot size={130} mood="idle" />
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
                        }}>
                          {["⭐","✨","💖"][i]}
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
                    {["✦","🌸","🌈","💖","🎀","✦"].map((s, i) => (
                      <span key={i} style={{
                        animation: `floatUp ${2.5 + i * 0.35}s ease-in-out infinite`,
                        animationDelay: `${i * 0.28}s`,
                        display: "inline-block",
                      }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>

            ) : (
              /* ── TASK CARDS ── */
              filteredTasks.map((task, idx) => {
                const sectionInfo = task.sectionId != null ? sectionMap.get(task.sectionId) : null;
                const pal = sectionInfo?.palette;
                const isCompleting = completingId === task.id;
                const isImportant = sectionInfo?.name?.toLowerCase().includes("import");

                return (
                  <div key={task.id}
                    className={`flex items-center gap-4 p-5 rounded-3xl glass-card transition-all duration-300 task-card-enter ${
                      task.completed ? "opacity-55" : ""
                    } ${isImportant && isRainbow ? "important-section-card" : ""}`}
                    style={{
                      animationDelay: `${idx * 0.04}s`,
                      background: task.completed ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.72)",
                      borderLeft: isRainbow && pal && !task.completed ? `3px solid ${pal.border}` : undefined,
                      boxShadow: isRainbow && pal && !task.completed
                        ? `0 4px 20px ${pal.glow.replace("0.45","0.18")}, 0 1px 4px rgba(0,0,0,0.04)`
                        : "0 2px 12px rgba(0,0,0,0.05)",
                      transition: "all 0.25s cubic-bezier(0.34,1.2,0.64,1)",
                    }}
                    onMouseEnter={e => {
                      if (!task.completed) {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px) scale(1.006)";
                        if (isRainbow && pal) (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${pal.glow.replace("0.45","0.32")}, 0 2px 8px rgba(0,0,0,0.06)`;
                      }
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = "";
                      if (isRainbow && pal && !task.completed) (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${pal.glow.replace("0.45","0.18")}, 0 1px 4px rgba(0,0,0,0.04)`;
                    }}
                  >
                    {/* Premium Checkbox */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <button
                        onClick={() => handleToggleTask(task.id, task.completed)}
                        className={isCompleting ? "check-bounce" : ""}
                        style={{
                          width: 34, height: 34,
                          borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer",
                          position: "relative",
                          overflow: "visible",
                          border: task.completed ? "none" : "2.5px solid rgba(236,72,153,0.35)",
                          background: task.completed
                            ? "linear-gradient(135deg, #ec4899, #a78bfa)"
                            : "rgba(255,255,255,0.4)",
                          boxShadow: task.completed
                            ? isRainbow
                              ? "0 0 16px rgba(236,72,153,0.55), 0 0 32px rgba(167,139,250,0.3)"
                              : "0 2px 10px rgba(236,72,153,0.3)"
                            : "none",
                          transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                        }}
                        onMouseEnter={e => {
                          if (!task.completed) {
                            const el = e.currentTarget as HTMLElement;
                            el.style.borderColor = "#ec4899";
                            el.style.background = "rgba(236,72,153,0.1)";
                            el.style.transform = "scale(1.1)";
                            el.style.boxShadow = "0 0 10px rgba(236,72,153,0.25)";
                          }
                        }}
                        onMouseLeave={e => {
                          if (!task.completed) {
                            const el = e.currentTarget as HTMLElement;
                            el.style.borderColor = "rgba(236,72,153,0.35)";
                            el.style.background = "rgba(255,255,255,0.4)";
                            el.style.transform = "";
                            el.style.boxShadow = "none";
                          }
                        }}
                      >
                        {/* Custom animated checkmark */}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                          style={{ opacity: task.completed ? 1 : 0, transition: "opacity 0.2s" }}>
                          <path d="M3 8.5 L6.5 12 L13 5"
                            stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                            strokeDasharray="20"
                            strokeDashoffset={task.completed ? "0" : "20"}
                            style={{ transition: "stroke-dashoffset 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
                          />
                        </svg>

                        {/* Ripple ring on completion */}
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

                      {/* Particle burst — rainbow mode only */}
                      {isCompleting && isRainbow && <SparkBurst />}
                    </div>

                    {/* Title + section badge */}
                    <div className="flex-1 min-w-0">
                      <span className={`text-lg font-bold block truncate ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {task.title}
                      </span>
                      {selectedSectionId === null && sectionInfo && !task.completed && (
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
                        onClick={() => {
                          deleteTask.mutate({ slug, taskId: task.id }, {
                            onSuccess: () => {
                              queryClient.invalidateQueries({ queryKey: getListTasksQueryKey(slug) });
                              queryClient.invalidateQueries({ queryKey: getGetWorkspaceStatsQueryKey(slug) });
                            }
                          });
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground transition-all ml-1"
                        style={{ transition: "all 0.2s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; (e.currentTarget as HTMLElement).style.color = "#dc2626"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = ""; }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
