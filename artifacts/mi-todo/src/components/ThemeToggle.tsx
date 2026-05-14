import { useState, useEffect, createContext, useContext } from "react";

type Theme = "clean" | "rainbow";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("kawaii-theme");
    return (saved as Theme) || "clean";
  });

  useEffect(() => {
    localStorage.setItem("kawaii-theme", theme);
    if (theme === "rainbow") {
      document.documentElement.classList.add("theme-rainbow");
    } else {
      document.documentElement.classList.remove("theme-rainbow");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isRainbow = theme === "rainbow";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setTheme(isRainbow ? "clean" : "rainbow")}
        title={isRainbow ? "Mudar para Clean" : "Mudar para Pride Kawaii"}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          position: "relative",
          background: isRainbow
            ? "linear-gradient(135deg, #ec4899, #a78bfa, #06b6d4)"
            : "linear-gradient(135deg, #e0e7ff, #f3e8ff)",
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
          boxShadow: isRainbow
            ? "0 0 0 3px white, 0 0 20px 4px rgba(236,72,153,0.45), 0 0 40px 8px rgba(167,139,250,0.25)"
            : "0 4px 18px rgba(167,139,250,0.35), 0 0 0 3px white",
        }}
        className={isRainbow ? "orb-glow" : ""}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.15)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        }}
      >
        <span style={{ fontSize: 22, lineHeight: 1, display: "block", textAlign: "center" }}>
          {isRainbow ? "🌈" : "🎨"}
        </span>
        {isRainbow && (
          <span
            style={{
              position: "absolute",
              inset: -2,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ec4899, #a78bfa, #06b6d4, #ec4899)",
              backgroundSize: "200% 200%",
              animation: "gradientShift 3s linear infinite",
              zIndex: -1,
              opacity: 0.4,
            }}
          />
        )}
      </button>
    </div>
  );
}
