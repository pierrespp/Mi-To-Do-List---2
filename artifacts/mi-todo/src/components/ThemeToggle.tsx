import { useState, useEffect, createContext, useContext } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="lg"
        className="rounded-full shadow-lg h-14 w-14 p-0 glass-card bg-white/80 hover:bg-white text-primary hover:scale-110 transition-all duration-300"
        onClick={() => setTheme(theme === "clean" ? "rainbow" : "clean")}
      >
        <Palette className="w-6 h-6" />
      </Button>
    </div>
  );
}
