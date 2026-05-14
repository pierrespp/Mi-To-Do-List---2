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
  getGetWorkspaceQueryKey
} from "@workspace/api-client-react";
import { useState, KeyboardEvent, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Plus, Trash2, Heart, Star, Sparkles, Loader2, Pin, Calendar, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ThemeToggle";

/* ─── Section colour palette ─────────────────────────────────── */
const PALETTES = [
  { bg: "rgba(252,165,165,0.22)",  border: "rgba(252,165,165,0.5)",  text: "#dc2626", glow: "rgba(252,165,165,0.45)"  },
  { bg: "rgba(253,224,71,0.22)",   border: "rgba(253,224,71,0.55)",  text: "#b45309", glow: "rgba(253,224,71,0.45)"   },
  { bg: "rgba(196,181,253,0.25)",  border: "rgba(196,181,253,0.5)",  text: "#7c3aed", glow: "rgba(196,181,253,0.45)"  },
  { bg: "rgba(103,232,249,0.2)",   border: "rgba(103,232,249,0.5)",  text: "#0891b2", glow: "rgba(103,232,249,0.4)"   },
  { bg: "rgba(134,239,172,0.2)",   border: "rgba(134,239,172,0.5)",  text: "#15803d", glow: "rgba(134,239,172,0.4)"   },
  { bg: "rgba(249,168,212,0.22)",  border: "rgba(249,168,212,0.5)",  text: "#be185d", glow: "rgba(249,168,212,0.45)"  },
];

/* ─── Kawaii Mascot SVG ───────────────────────────────────────── */
function KawaiiMascot({ size = 96, mood = "happy" }: { size?: number; mood?: "happy" | "idle" | "cheer" }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 120 138" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 4px 12px rgba(236,72,153,0.25))" }}>
      {/* Ears */}
      <ellipse cx="37" cy="38" rx="14" ry="26" fill="#f9c8d9" />
      <ellipse cx="37" cy="38" rx="8" ry="18" fill="#f7a8c4" />
      <ellipse cx="83" cy="38" rx="14" ry="26" fill="#f9c8d9" />
      <ellipse cx="83" cy="38" rx="8" ry="18" fill="#f7a8c4" />
      {/* Head */}
      <ellipse cx="60" cy="88" rx="44" ry="44" fill="#fff5f8" />
      <ellipse cx="60" cy="88" rx="44" ry="44" fill="url(#bunnyGrad)" />
      {/* Eyes */}
      <circle cx="45" cy="81" r="7" fill="#1a0033" />
      <circle cx="75" cy="81" r="7" fill="#1a0033" />
      <circle cx="47" cy="79" r="2.5" fill="white" />
      <circle cx="77" cy="79" r="2.5" fill="white" />
      {/* Blush */}
      <ellipse cx="34" cy="91" rx="9" ry="5.5" fill="#f9a8d4" opacity="0.55" />
      <ellipse cx="86" cy="91" rx="9" ry="5.5" fill="#f9a8d4" opacity="0.55" />
      {/* Nose */}
      <ellipse cx="60" cy="94" rx="4" ry="3" fill="#e87dab" />
      {/* Mouth */}
      {mood === "cheer" ? (
        <path d="M 52 100 Q 60 110 68 100" stroke="#e87dab" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      ) : (
        <path d="M 54 100 Q 60 107 66 100" stroke="#e87dab" strokeWidth="2" fill="none" strokeLinecap="round"/>
      )}
      {/* Star accents */}
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
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        transform: "none",
      }}>
        <span style={{ fontSize: 15, fontWeight: 900, color: "#ec4899", lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#a78bfa", lineHeight: 1.2 }}>/{total}</span>
      </div>
    </div>
  );
}

/* ─── Animated Background Blobs ──────────────────────────────── */
function BlobBackground() {
  return (
    <div className="blob-bg" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "-10%", left: "-5%",
        width: 420, height: 420, borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
        background: "radial-gradient(circle at 40% 40%, rgba(249,168,212,0.45), rgba(196,181,253,0.2) 60%, transparent 80%)",
        animation: "blobFloat1 16s ease-in-out infinite", filter: "blur(2px)",
      }} />
      <div style={{
        position: "absolute", bottom: "5%", right: "-8%",
        width: 380, height: 380, borderRadius: "40% 60% 30% 70% / 60% 40% 50% 50%",
        background: "radial-gradient(circle at 60% 60%, rgba(103,232,249,0.3), rgba(167,139,250,0.2) 60%, transparent 80%)",
        animation: "blobFloat2 20s ease-in-out infinite", filter: "blur(2px)",
      }} />
      <div style={{
        position: "absolute", top: "40%", left: "30%",
        width: 280, height: 280, borderRadius: "50% 50% 30% 70% / 40% 60% 40% 60%",
        background: "radial-gradient(circle at 50% 50%, rgba(253,224,71,0.18), rgba(249,168,212,0.1) 60%, transparent 80%)",
        animation: "blobFloat3 24s ease-in-out infinite", filter: "blur(3px)",
      }} />
      {/* Floating sparkles */}
      {["10%","30%","55%","75%","90%"].map((left, i) => (
        <div key={i} style={{
          position: "absolute", left, top: `${15 + i * 14}%`,
          fontSize: i % 2 === 0 ? 16 : 12,
          opacity: 0.25,
          animation: `floatUp ${3.5 + i * 0.7}s ease-in-out infinite`,
          animationDelay: `${i * 0.6}s`,
        }}>
          {["✦","✨","⭐","✦","✨"][i]}
        </div>
      ))}
    </div>
  );
}

/* ─── Daily quotes ────────────────────────────────────────────── */
const QUOTES = [
  "You're doing amazing ✨",
  "One task at a time 💖",
  "Progress, not perfection 🌸",
  "You've got this, bb 🌟",
  "Making magic happen ✦",
];

/* ─── Main Component ─────────────────────────────────────────── */
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

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const createSection = useCreateSection();
  const restartShift = useRestartShift();

  const quote = QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length];

  /* ── section lookup helpers ── */
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
      setTimeout(() => setCompletingId(null), 700);
    }
    updateTask.mutate({ slug, taskId, data: { completed: !completed } }, {
      onSuccess: () => {
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

      {/* ═══ Sidebar ═══════════════════════════════════════════ */}
      <div className="w-72 flex flex-col p-6 glass-sidebar border-r z-10 relative" style={{ minHeight: "100vh" }}>

        {/* Logo / workspace name */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 fill-primary text-primary" style={{ filter: isRainbow ? "drop-shadow(0 0 6px rgba(236,72,153,0.5))" : undefined }} />
            <h1 className="text-xl font-black gradient-text truncate">{workspace?.name}</h1>
          </div>
          <p className="text-xs font-semibold text-muted-foreground/70 pl-7">{quote}</p>
        </div>

        {/* Progress ring + stats */}
        {stats && (
          <div className="mb-6 flex items-center gap-4 p-4 rounded-2xl" style={{
            background: isRainbow ? "rgba(255,255,255,0.45)" : "rgba(236,72,153,0.06)",
            border: "1px solid rgba(236,72,153,0.12)",
          }}>
            <ProgressRing value={stats.completed} total={stats.total} size={68} />
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className="text-sm font-black text-foreground truncate">
                {stats.completed} de {stats.total} feitas
              </div>
              {/* Progress bar */}
              <div className="w-full rounded-full overflow-hidden progress-shimmer" style={{ height: 7, background: "rgba(236,72,153,0.1)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${completionPct}%`,
                    background: "linear-gradient(90deg, #ec4899, #a78bfa, #06b6d4)",
                    transition: "width 0.7s cubic-bezier(0.34,1.56,0.64,1)",
                    boxShadow: isRainbow ? "0 0 8px 2px rgba(236,72,153,0.4)" : undefined,
                  }}
                />
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
            } : {
              color: "var(--color-muted-foreground)",
            }}
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
              <button
                key={section.id}
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
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = isImportant && isRainbow ? "transparent" : "transparent"; }}
              >
                <span className="flex-shrink-0">{section.emoji}</span>
                <span className="truncate">{section.name}</span>
                {isImportant && <span className="ml-auto text-xs opacity-70">⭐</span>}
              </button>
            );
          })}

          {isAddingSection ? (
            <Input
              autoFocus
              value={newSectionName}
              onChange={e => setNewSectionName(e.target.value)}
              onKeyDown={handleCreateSection}
              onBlur={() => setIsAddingSection(false)}
              placeholder="Nome da seção..."
              className="mt-2 rounded-2xl bg-white/60 border-primary/20"
            />
          ) : (
            <button
              onClick={() => setIsAddingSection(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold text-muted-foreground hover:text-primary transition-all mt-1"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <Plus className="w-5 h-5" /> Nova Seção
            </button>
          )}
        </div>

        {/* Decorative mascot */}
        {isRainbow && (
          <div className="flex justify-center mt-4 mb-2 float-animation" style={{ opacity: 0.75 }}>
            <KawaiiMascot size={54} mood="idle" />
          </div>
        )}

        {/* Reiniciar Turno */}
        <div className="pt-4 mt-auto">
          <Button
            className="w-full rounded-2xl h-14 text-base font-black border-0 text-white transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #ec4899 0%, #a78bfa 60%, #06b6d4 100%)",
              boxShadow: isRainbow
                ? "0 4px 20px rgba(236,72,153,0.4), 0 0 40px rgba(167,139,250,0.2)"
                : "0 4px 14px rgba(236,72,153,0.25)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(236,72,153,0.55)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = isRainbow ? "0 4px 20px rgba(236,72,153,0.4)" : "0 4px 14px rgba(236,72,153,0.25)"; }}
            onClick={() => {
              restartShift.mutate({ slug }, {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: getListTasksQueryKey(slug) });
                  queryClient.invalidateQueries({ queryKey: getGetWorkspaceStatsQueryKey(slug) });
                }
              });
            }}
          >
            {restartShift.isPending
              ? <Loader2 className="w-5 h-5 animate-spin mr-2" />
              : <RefreshCw className="w-5 h-5 mr-2" />
            }
            ✨ Reiniciar Turno
          </Button>
        </div>
      </div>

      {/* ═══ Main Area ══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto" style={{ position: "relative", zIndex: 1 }}>
        <div className="max-w-3xl w-full mx-auto space-y-8">

          {/* Header */}
          <header className="flex items-center gap-3">
            <h2 className="text-4xl font-black gradient-text" style={{
              ...(isImportantsSection && isRainbow ? {
                background: "linear-gradient(135deg, #f59e0b, #fbbf24, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 8px rgba(251,191,36,0.4))",
              } : {}),
            }}>
              {selectedSectionId
                ? sections?.find(s => s.id === selectedSectionId)?.name
                : "Todas as Tarefas"
              }
            </h2>
            <Sparkles
              className="w-7 h-7"
              style={{
                color: isImportantsSection ? "#f59e0b" : "hsl(var(--secondary))",
                filter: isRainbow ? "drop-shadow(0 0 6px rgba(236,72,153,0.5))" : undefined,
                animation: isRainbow ? "sparkBurst 2.5s ease-in-out infinite" : undefined,
              }}
            />
            {isImportantsSection && isRainbow && (
              <span style={{ fontSize: 22, animation: "starSpin 4s linear infinite", display: "inline-block" }}>⭐</span>
            )}
          </header>

          {/* Task input */}
          <div className="relative">
            <Input
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={handleCreateTask}
              placeholder="O que vamos fazer hoje? ✨"
              className="h-16 pl-6 pr-12 text-xl rounded-full glass-card border-primary/20 shadow-md focus-visible:ring-primary focus-visible:ring-2 font-semibold placeholder:text-muted-foreground/60"
              style={isRainbow ? { boxShadow: "0 4px 20px rgba(236,72,153,0.15), 0 2px 8px rgba(167,139,250,0.1)" } : undefined}
            />
            {createTask.isPending && (
              <Loader2 className="w-6 h-6 absolute right-4 top-5 animate-spin text-primary" />
            )}
          </div>

          {/* Task list */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              /* ── Empty state ── */
              <div className="text-center py-16 flex flex-col items-center gap-5">
                <div className="bounce-in">
                  <KawaiiMascot size={110} mood="idle" />
                </div>
                <div>
                  <h3 className="text-2xl font-black gradient-text mb-2">Tudo limpo por aqui! ✨</h3>
                  <p className="text-muted-foreground font-semibold">Seu board mágico está esperando por você 🌟</p>
                  <p className="text-sm text-muted-foreground/70 mt-1 font-medium">Digite uma tarefa acima e pressione Enter</p>
                </div>
                {/* Floating sparkles around mascot */}
                {isRainbow && (
                  <div className="flex gap-4 text-2xl" style={{ opacity: 0.6 }}>
                    {["✦","🌸","✨","💖","✦"].map((s, i) => (
                      <span key={i} style={{ animation: `floatUp ${2.5 + i * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              filteredTasks.map((task, idx) => {
                const sectionInfo = task.sectionId != null ? sectionMap.get(task.sectionId) : null;
                const pal = sectionInfo?.palette;
                const isCompleting = completingId === task.id;
                const isImportant = sectionInfo?.name?.toLowerCase().includes("import");

                return (
                  <div
                    key={task.id}
                    className={`flex items-center gap-4 p-5 rounded-3xl glass-card transition-all duration-300 task-card-enter ${
                      task.completed ? "opacity-55" : ""
                    } ${isImportant && isRainbow ? "important-section-card" : ""}`}
                    style={{
                      animationDelay: `${idx * 0.04}s`,
                      background: task.completed
                        ? "rgba(255,255,255,0.35)"
                        : isRainbow && pal
                          ? `rgba(255,255,255,0.7)`
                          : "rgba(255,255,255,0.75)",
                      borderLeft: isRainbow && pal && !task.completed ? `3px solid ${pal.border}` : undefined,
                      boxShadow: isRainbow && pal && !task.completed
                        ? `0 4px 20px ${pal.glow.replace("0.45", "0.18")}, 0 1px 4px rgba(0,0,0,0.04)`
                        : "0 2px 12px rgba(0,0,0,0.05)",
                      transition: "all 0.25s cubic-bezier(0.34,1.2,0.64,1)",
                    }}
                    onMouseEnter={e => {
                      if (!task.completed) {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px) scale(1.005)";
                        if (isRainbow && pal) (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${pal.glow.replace("0.45", "0.32")}, 0 2px 8px rgba(0,0,0,0.06)`;
                      }
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = "";
                      if (isRainbow && pal && !task.completed) (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${pal.glow.replace("0.45", "0.18")}, 0 1px 4px rgba(0,0,0,0.04)`;
                    }}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleTask(task.id, task.completed)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                        task.completed
                          ? "border-transparent text-white"
                          : "border-primary/40 hover:border-primary text-transparent hover:bg-primary/10"
                      } ${isCompleting ? "check-bounce" : ""}`}
                      style={task.completed ? {
                        background: "linear-gradient(135deg, #ec4899, #a78bfa)",
                        boxShadow: isRainbow ? "0 0 10px rgba(236,72,153,0.4)" : undefined,
                      } : undefined}
                    >
                      <Check className={`w-4 h-4 ${task.completed ? "opacity-100" : "opacity-0"}`} />
                    </button>

                    {/* Title + section badge */}
                    <div className="flex-1 min-w-0">
                      <span className={`text-lg font-bold block truncate ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {task.title}
                      </span>
                      {/* Section badge — only in All Tasks view */}
                      {selectedSectionId === null && sectionInfo && !task.completed && (
                        <span
                          className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold"
                          style={{
                            background: pal?.bg ?? "rgba(236,72,153,0.12)",
                            border: `1px solid ${pal?.border ?? "rgba(236,72,153,0.25)"}`,
                            color: pal?.text ?? "#ec4899",
                            backdropFilter: "blur(6px)",
                          }}
                        >
                          {sectionInfo.emoji} {sectionInfo.name}
                        </span>
                      )}
                    </div>

                    {/* Badges row */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {task.priority === "high" && (
                        <Badge
                          className="border-0 rounded-full px-2.5 py-0.5 font-bold text-xs"
                          style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}
                        >
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
                        <span className="sparkle-animation text-base">✨</span>
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
