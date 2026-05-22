import React, { useState, useEffect } from "react";
import { Settings, Check, AlertCircle, Youtube, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ThemeToggle";

import { getStoredItem, setStoredItem } from "@/utils/storage";

// Default public Focus/Lofi playlist
const DEFAULT_PLAYLIST_ID = "PLOf5_tA_Gj-jP9C2M-7eJ_f6UebAwt5fN";
const PLAYLIST_STORAGE_KEY = "kawaii-playlist-id";

export default function MusicPlayer() {
  const { theme } = useTheme();
  const isRainbow = theme === "rainbow";

  const [playlistId, setPlaylistId] = useState<string>(DEFAULT_PLAYLIST_ID);
  const [inputVal, setInputVal] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    setPlaylistId(getStoredItem(PLAYLIST_STORAGE_KEY, DEFAULT_PLAYLIST_ID));
  }, []);

  const validateAndSave = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) {
      setErrorMsg("O link não pode estar vazio.");
      return;
    }

    let extractedId: string | null = null;

    // 1. Direct ID check (starts with 2 uppercase letters + alphanumeric/hyphens/underscores)
    const directIdRegex = /^[a-zA-Z0-9_-]{12,80}$/;
    if (directIdRegex.test(trimmed)) {
      extractedId = trimmed;
    } else {
      // 2. Try URL parsing
      try {
        const url = new URL(trimmed);
        const listParam = url.searchParams.get("list");
        if (listParam && directIdRegex.test(listParam)) {
          extractedId = listParam;
        }
      } catch (e) {
        // Invalid URL
      }
    }

    if (extractedId) {
      setPlaylistId(extractedId);
      setStoredItem(PLAYLIST_STORAGE_KEY, extractedId);
      setErrorMsg(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setIsEditing(false);
      setInputVal("");
    } else {
      setErrorMsg("Link inválido. Insira uma playlist do YouTube válida.");
    }
  };

  const originUrl = typeof window !== "undefined" ? window.location.origin : "";
  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}&enablejsapi=1&origin=${encodeURIComponent(originUrl)}`;

  return (
    <div 
      className="w-full rounded-3xl p-6 glass-card border border-primary/20 relative shadow-lg overflow-hidden flex flex-col gap-4 animate-fade-in"
      style={isRainbow ? {
        boxShadow: "0 10px 30px rgba(236, 72, 153, 0.15), 0 1px 8px rgba(167, 139, 250, 0.1)",
        background: "rgba(255, 255, 255, 0.45)"
      } : {}}
    >
      {/* Background Accent Blobs for Music Tab */}
      <div className="absolute top-[-40px] right-[-40px] w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-30px] left-[-30px] w-28 h-28 bg-purple-400/10 rounded-full blur-xl pointer-events-none" />

      {/* Header Area */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Music className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-black gradient-text">Música</h3>
            <p className="text-xs font-semibold text-muted-foreground/80">Sua trilha sonora para produtividade ✦</p>
          </div>
        </div>

        {/* Toggle Editor */}
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setErrorMsg(null);
            if (!isEditing) setInputVal("");
          }}
          className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
          aria-label="Configurar Playlist"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Inline Configuration Panel */}
      {isEditing && (
        <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-primary/10 animate-fade-in z-10">
          <span className="text-xs font-bold text-muted-foreground/80 flex items-center gap-1">
            <Youtube className="w-3.5 h-3.5 text-[#ff0000]" /> Inserir link da playlist:
          </span>
          <div className="flex gap-2">
            <Input
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") validateAndSave();
              }}
              placeholder="Cole a URL ou o ID da playlist do YouTube..."
              className={`rounded-xl border-primary/20 text-sm h-10 flex-1 bg-white/80 dark:bg-gray-900/80 focus-visible:ring-primary ${
                errorMsg ? "border-red-400 focus-visible:ring-red-400" : ""
              }`}
            />
            <Button
              onClick={validateAndSave}
              className="rounded-xl h-10 font-bold px-4 text-white"
              style={{
                background: "linear-gradient(135deg, #ec4899 0%, #a78bfa 100%)",
                boxShadow: "0 2px 8px rgba(236,72,153,0.2)"
              }}
            >
              Salvar
            </Button>
          </div>
          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 mt-1 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Success Notification */}
      {success && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl animate-fade-in z-10">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>Playlist salva e atualizada com sucesso! ✦</span>
        </div>
      )}

      {/* Responsive Aspect Ratio Wrapper for Youtube Player */}
      <div 
        className="w-full aspect-video rounded-2xl overflow-hidden shadow-inner border border-primary/5 bg-black/5 dark:bg-black/40 z-10"
        style={{
          boxShadow: "inset 0 4px 12px rgba(0, 0, 0, 0.08)"
        }}
      >
        <iframe
          key={playlistId}
          src={embedUrl}
          title="YouTube Playlist Music Player"
          className="w-full h-full border-0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
