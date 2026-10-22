import { useEffect, useState } from "react";
import { ARTWORKS, THEMES, type Movement } from "./artworks";
import { shuffle } from "./scoring";

export type Phase = "welcome" | "stage1" | "stage2" | "stage3" | "opening" | "results";

export interface GameState {
  phase: Phase;
  name: string;
  order: string[];
  labelOrder: string[];
  themeOrder: Record<Movement, string[]>;
  placements: Record<string, Movement>;
  labels: Record<string, string>;
  themes: Partial<Record<Movement, string>>;
  completedAt?: string;
}

const KEY = "curator-progress-v1";

export function freshGame(name = ""): GameState {
  return {
    phase: "welcome", name,
    order: shuffle(ARTWORKS.map((w) => w.id)),
    labelOrder: shuffle(ARTWORKS.map((w) => w.id)),
    themeOrder: { S: shuffle(THEMES.S.options.map((o) => o.id)), I: shuffle(THEMES.I.options.map((o) => o.id)) },
    placements: {}, labels: {}, themes: {},
  };
}

export function useGame() {
  const [g, setG] = useState<GameState | null>(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      setG(saved ? JSON.parse(saved) : freshGame());
    } catch { setG(freshGame()); }
  }, []);
  useEffect(() => { if (g) localStorage.setItem(KEY, JSON.stringify(g)); }, [g]);
  return [g, setG as React.Dispatch<React.SetStateAction<GameState>>] as const;
}
