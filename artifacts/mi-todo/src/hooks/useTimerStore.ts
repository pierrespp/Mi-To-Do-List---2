import { create } from "zustand";
import { persist } from "zustand/middleware";
import { playSoftChime } from "../utils/audio-synthesizer";

export interface Alarm {
  id: string;
  time: string; // Format "HH:MM"
  label: string;
  active: boolean;
  triggeredToday: boolean;
}

interface TimerState {
  // Alarm State
  alarms: Alarm[];
  
  // Timer State
  timeLeft: number; // remaining seconds
  isRunning: boolean;
  duration: number; // total duration in seconds (e.g. 900 for 15 mins)
  
  // Alarm Actions
  toggleAlarm: (id: string) => void;
  updateAlarmTime: (id: string, time: string) => void;
  resetTriggeredFlags: () => void;
  
  // Timer Actions
  startTimer: (duration?: number) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
}

const DEFAULT_ALARMS: Alarm[] = [
  { id: "doors", time: "22:00", label: "Fechar Portas", active: true, triggeredToday: false },
  { id: "cashier", time: "00:00", label: "Fechar Caixa", active: true, triggeredToday: false },
  { id: "closing", time: "00:20", label: "Finalizar Turno", active: true, triggeredToday: false },
];

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      alarms: DEFAULT_ALARMS,
      timeLeft: 900,
      isRunning: false,
      duration: 900,

      toggleAlarm: (id) =>
        set((state) => ({
          alarms: state.alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, active: !alarm.active } : alarm
          ),
        })),

      updateAlarmTime: (id, time) =>
        set((state) => ({
          alarms: state.alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, time, triggeredToday: false } : alarm
          ),
        })),

      resetTriggeredFlags: () =>
        set((state) => ({
          alarms: state.alarms.map((alarm) => ({ ...alarm, triggeredToday: false })),
        })),

      startTimer: (duration = 900) =>
        set((state) => ({
          duration,
          timeLeft: state.isRunning ? state.timeLeft : (state.timeLeft === 0 ? duration : state.timeLeft),
          isRunning: true,
        })),

      pauseTimer: () => set({ isRunning: false }),

      resetTimer: () =>
        set((state) => ({
          timeLeft: state.duration,
          isRunning: false,
        })),

      tick: () => {
        const state = get();
        const now = new Date();
        const currentHHMM = now.toTimeString().slice(0, 5); // Returns "HH:MM"

        // 1. Process Timer Countdown
        let newTimeLeft = state.timeLeft;
        let newIsRunning = state.isRunning;

        if (state.isRunning) {
          if (state.timeLeft > 1) {
            newTimeLeft = state.timeLeft - 1;
          } else {
            newTimeLeft = 0;
            newIsRunning = false;
            // Play chime on completion
            playSoftChime();
          }
        }

        // 2. Check Daily Alarm Triggers
        let alarmsChanged = false;
        const updatedAlarms = state.alarms.map((alarm) => {
          if (alarm.active && alarm.time === currentHHMM && !alarm.triggeredToday) {
            playSoftChime();
            alarmsChanged = true;
            return { ...alarm, triggeredToday: true };
          }
          
          // Reset triggeredToday flag once current time moves past the alarm time
          if (alarm.triggeredToday && alarm.time !== currentHHMM) {
            alarmsChanged = true;
            return { ...alarm, triggeredToday: false };
          }

          return alarm;
        });

        if (state.isRunning || alarmsChanged || newTimeLeft !== state.timeLeft) {
          set({
            timeLeft: newTimeLeft,
            isRunning: newIsRunning,
            alarms: updatedAlarms,
          });
        }
      },
    }),
    {
      name: "mi-todo-timer-storage",
      partialize: (state) => ({
        alarms: state.alarms,
        timeLeft: state.timeLeft,
        duration: state.duration,
        isRunning: state.isRunning,
      }),
    }
  )
);
