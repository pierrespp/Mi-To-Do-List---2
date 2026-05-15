import { useState, useEffect, createContext, useContext } from "react";
import { petBridge } from "../../../../src/integrations/petBridge";

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
    petBridge.themeChanged(theme);
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
  const [clicking, setClicking] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    setClicking(true);
    setTimeout(() => setClicking(false), 380);
    setTheme(isRainbow ? "clean" : "rainbow");
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
    >
      {/* Tooltip */}
      {hovered && (
        <div style={{
          background: isRainbow
            ? "linear-gradient(135deg, #ec4899, #a78bfa)"
            : "rgba(255,255,255,0.95)",
          color: isRainbow ? "white" : "#7c3aed",
          padding: "5px 12px",
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 800,
          backdropFilter: "blur(10px)",
          border: `1px solid ${isRainbow ? "rgba(255,255,255,0.3)" : "rgba(167,139,250,0.3)"}`,
          boxShadow: isRainbow
            ? "0 4px 16px rgba(236,72,153,0.3)"
            : "0 4px 12px rgba(167,139,250,0.2)",
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          animation: "tooltipSlideUp 0.2s ease-out forwards",
          letterSpacing: "0.01em",
        }}>
          {isRainbow ? "🎨 Mudar para Clean" : "🌈 Mudar para Kawaii"}
        </div>
      )}

      {/* Orb wrapper */}
      <div style={{ position: "relative", width: 62, height: 62 }}>

        {/* Spinning conic ring — rainbow only */}
        {isRainbow && (
          <div style={{
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            background: "conic-gradient(from 0deg, #ec4899, #f97316, #fbbf24, #22c55e, #06b6d4, #a78bfa, #ec4899)",
            animation: "conicSpin 2.5s linear infinite",
            zIndex: 0,
          }} />
        )}

        {/* White separator ring */}
        <div style={{
          position: "absolute",
          inset: isRainbow ? -1 : 0,
          borderRadius: "50%",
          background: "white",
          zIndex: 1,
        }} />

        {/* Outer glow */}
        <div style={{
          position: "absolute",
          inset: -10,
          borderRadius: "50%",
          background: isRainbow
            ? "radial-gradient(circle, rgba(236,72,153,0.45) 0%, transparent 68%)"
            : "radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 68%)",
          animation: isRainbow ? "glowPulse 2s ease-in-out infinite" : undefined,
          zIndex: 0,
          pointerEvents: "none",
        }} />

        {/* Main button */}
        <button
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label={isRainbow ? "Mudar para Clean" : "Mudar para Kawaii Pride"}
          style={{
            position: "relative",
            zIndex: 2,
            width: 62,
            height: 62,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            overflow: "hidden",
            background: isRainbow
              ? "linear-gradient(135deg, #ec4899 0%, #a78bfa 55%, #06b6d4 100%)"
              : "linear-gradient(145deg, #f3e8ff 0%, #e0e7ff 100%)",
            boxShadow: isRainbow
              ? "0 6px 24px rgba(236,72,153,0.5), 0 0 0 3px white"
              : "0 4px 18px rgba(167,139,250,0.35), 0 0 0 3px white",
            transform: clicking
              ? "scale(0.86)"
              : hovered
                ? "scale(1.16)"
                : "scale(1)",
            transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease",
          }}
        >
          <span style={{
            fontSize: 28,
            lineHeight: 1,
            display: "block",
            textAlign: "center",
            pointerEvents: "none",
            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            transform: clicking ? "scale(0.7) rotate(-20deg)" : "scale(1) rotate(0deg)",
          }}>
            {isRainbow ? "🌈" : "🎨"}
          </span>

          {/* Click ripple */}
          {clicking && (
            <span style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.45)",
              animation: "rippleExpand 0.38s ease-out forwards",
              pointerEvents: "none",
            }} />
          )}
        </button>
      </div>
    </div>
  );
}
