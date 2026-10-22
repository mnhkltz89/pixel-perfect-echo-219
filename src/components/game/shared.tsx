import { useEffect, useState } from "react";
import { Search, Volume2, VolumeX, X } from "lucide-react";
import type { Artwork } from "@/game/artworks";
import { soundPref } from "@/game/sound";
import type { Phase } from "@/game/state";

export function FramedPainting({ art, src, size = "md", onZoom, className = "" }: {
  art: Artwork; src: string | null; size?: "sm" | "md" | "lg"; onZoom?: () => void; className?: string;
}) {
  const h = size === "sm" ? "h-20" : size === "lg" ? "h-[70vh]" : "h-36";
  return (
    <div className={`museum-frame relative ${className}`}>
      {src ? (
        <img src={src} alt={`${art.title} by ${art.artist}, ${art.year}. ${art.feature}`}
          className={`${h} w-full object-contain`} draggable={false} loading="lazy" />
      ) : (
        <div className={`${h} grid place-items-center text-xs text-muted-foreground`}>Image missing</div>
      )}
      {onZoom && (
        <button type="button" onClick={(e) => { e.stopPropagation(); onZoom(); }}
          aria-label={`Enlarge ${art.title}`}
          className="absolute right-1 top-1 rounded-full bg-card/90 p-1.5 text-foreground shadow hover:bg-card">
          <Search className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function ZoomModal({ art, src, onClose }: { art: Artwork | null; src: string | null; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  if (!art) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={art.title}
      className="fixed inset-0 z-50 grid place-items-center bg-navy/90 p-4 animate-fade-up" onClick={onClose}>
      <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between text-navy-foreground">
          <div>
            <h3 className="text-3xl">{art.title}</h3>
            <p className="opacity-80">{art.artist}, {art.year}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="btn-ghost-museum"><X className="h-5 w-5" /></button>
        </div>
        <FramedPainting art={art} src={src} size="lg" />
        <p className="mt-2 text-xs text-navy-foreground/70">{art.credit}</p>
      </div>
    </div>
  );
}

const STEPS: { p: Phase; label: string }[] = [
  { p: "stage1", label: "Organize the Collection" },
  { p: "stage2", label: "Restore the Labels" },
  { p: "stage3", label: "Grand Exhibition" },
];

export function TopBar({ phase, name }: { phase: Phase; name: string }) {
  const [muted, setMuted] = useState(false);
  useEffect(() => setMuted(soundPref.muted), []);
  const idx = STEPS.findIndex((s) => s.p === phase);
  const doneAll = phase === "opening" || phase === "results";
  return (
    <header className="no-print sticky top-0 z-40 border-b border-gold/40 bg-navy text-navy-foreground">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-2.5">
        <div className="mr-auto">
          <p className="museum-sign">Exhibition Preparation</p>
          <p className="font-display text-lg leading-tight">Curator {name || "—"}</p>
        </div>
        <ol className="flex items-center gap-2 text-sm" aria-label="Progress">
          {STEPS.map((s, i) => {
            const done = doneAll || i < idx; const cur = i === idx;
            return (
              <li key={s.p} className="flex items-center gap-2">
                <span aria-current={cur ? "step" : undefined}
                  className={`grid h-7 w-7 place-items-center rounded-full border text-xs font-bold ${done ? "border-gold bg-gold text-accent-foreground" : cur ? "border-gold text-gold" : "border-navy-foreground/30 text-navy-foreground/50"}`}>
                  {done ? "✓" : i + 1}
                </span>
                <span className={`hidden md:inline ${cur ? "text-gold" : "opacity-70"}`}>{s.label}</span>
                {i < 2 && <span className="h-px w-5 bg-navy-foreground/30" />}
              </li>
            );
          })}
        </ol>
        <button onClick={() => { soundPref.set(!muted); setMuted(!muted); }}
          aria-label={muted ? "Turn sound on" : "Mute sound"} className="rounded-full p-2 hover:bg-navy-foreground/10">
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}

export function StageHeader({ sign, title, text }: { sign: string; title: string; text: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center animate-fade-up">
      <p className="museum-sign">{sign}</p>
      <h2 className="mt-1 text-4xl font-semibold md:text-5xl">{title}</h2>
      <p className="mt-3 text-lg text-muted-foreground">{text}</p>
    </div>
  );
}
