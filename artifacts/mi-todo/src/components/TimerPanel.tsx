import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Clock, AlertCircle, Sparkles } from "lucide-react";
import { useTimerStore } from "@/hooks/useTimerStore";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ThemeToggle";

export default function TimerPanel() {
  const { theme } = useTheme();
  const isRainbow = theme === "rainbow";

  const {
    alarms,
    timeLeft,
    isRunning,
    duration,
    toggleAlarm,
    updateAlarmTime,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimerStore();

  // Real-time clock for UI display
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  const formattedClock = currentTime.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Timer format (MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Circular progress math
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = duration > 0 ? (timeLeft / duration) * 100 : 0;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Pet selection based on timer state
  // We use kawaii_pet_gabiru.png (Lazy Gray Cat) for eating/sleeping vibe, and mascote_cheer.png for celebration
  const isTimeUp = timeLeft === 0;
  const petSrc = isTimeUp 
    ? `${import.meta.env.BASE_URL}mascote_cheer.png` 
    : `${import.meta.env.BASE_URL}kawaii_pet_gabiru.png`;

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Real-time Clock Card */}
      <div 
        className="p-6 rounded-3xl glass-card border border-primary/15 text-center relative overflow-hidden shadow-md"
        style={isRainbow ? { boxShadow: "0 8px 32px rgba(236,72,153,0.12)" } : undefined}
      >
        {isRainbow && (
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-gradient-to-br from-pink-300 to-purple-400 opacity-20 rounded-full blur-xl animate-pulse" />
        )}
        <span className="text-xs font-black text-primary/70 uppercase tracking-widest block mb-1">
          Horário do Sistema ✦
        </span>
        <h3 className="text-4xl font-black gradient-text tracking-wider tabular-nums">
          {formattedClock}
        </h3>
      </div>

      {/* Alarm Settings Card */}
      <div className="p-6 rounded-3xl glass-card border border-primary/15 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-black text-foreground">Alarmes de Turno</h4>
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse ml-auto" />
        </div>

        <div className="space-y-3.5">
          {alarms.map((alarm) => (
            <div 
              key={alarm.id} 
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white/45 dark:bg-gray-950/20 border border-primary/5 transition-all hover:bg-white/60"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-black text-foreground truncate">
                  {alarm.label}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {alarm.active ? "Ativo" : "Desativado"}
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <Input
                  type="time"
                  value={alarm.time}
                  onChange={(e) => updateAlarmTime(alarm.id, e.target.value)}
                  className="w-24 h-9 text-center font-bold text-sm rounded-xl bg-white/70 dark:bg-gray-800/70 border-primary/20 focus-visible:ring-primary focus-visible:ring-1"
                />
                <Switch
                  checked={alarm.active}
                  onCheckedChange={() => toggleAlarm(alarm.id)}
                  aria-label={`Ativar alarme de ${alarm.label}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 15-Minute Meal Timer Card */}
      <div className="p-6 rounded-3xl glass-card border border-primary/15 space-y-6 shadow-sm text-center relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 mb-1">
          <AlertCircle className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-black text-foreground">Timer de Refeição</h4>
        </div>

        {/* Circular Progress Container */}
        <div className="relative flex items-center justify-center w-40 h-40 mx-auto">
          {/* Circular SVG Progress */}
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="rgba(236,72,153,0.1)"
              strokeWidth="10"
            />
            {/* Active Ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="url(#timerProgressGrad)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
            <defs>
              <linearGradient id="timerProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central Pet Sticker + Animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={petSrc}
              alt="Mascote Timer"
              className={`w-16 h-16 object-contain transition-all duration-300 ${
                isRunning ? "float-animation scale-105" : "scale-100"
              }`}
              style={{
                filter: isRainbow ? "drop-shadow(0 4px 8px rgba(236,72,153,0.25))" : "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
              }}
            />
          </div>
        </div>

        {/* Time Text display */}
        <div className="space-y-1">
          <span className="text-3xl font-black text-foreground tabular-nums tracking-wider block">
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs font-bold text-muted-foreground block">
            {isTimeUp ? "Bom apetite! Hora de voltar 🍰" : isRunning ? "Refeição em andamento..." : "Parado"}
          </span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => startTimer(900)} // preset to 15 mins (900 seconds)
            className="h-10 px-4 rounded-2xl bg-primary/10 hover:bg-primary/15 text-primary text-xs font-black transition-all"
          >
            15 Minutos
          </button>
          
          <div className="h-6 w-px bg-primary/10" />

          {isRunning ? (
            <button
              onClick={pauseTimer}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-pink-500 to-purple-600 hover:scale-105 active:scale-95 shadow-md transition-all"
              aria-label="Pausar Timer"
            >
              <Pause className="w-5 h-5 fill-current" />
            </button>
          ) : (
            <button
              onClick={() => startTimer(timeLeft === 0 ? 900 : timeLeft)}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-pink-500 to-purple-600 hover:scale-105 active:scale-95 shadow-md transition-all"
              aria-label="Iniciar Timer"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
          )}

          <button
            onClick={resetTimer}
            className="w-11 h-11 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary bg-primary/5 hover:bg-primary/10 transition-all active:scale-95"
            aria-label="Reiniciar Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
