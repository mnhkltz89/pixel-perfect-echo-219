import { ARTWORKS, FEEDBACK, POINTS, THEMES, VERDICTS, type Movement } from "./artworks";

export interface Answers {
  placements: Record<string, Movement>;
  /** artworkId -> labelId (label ids equal the artwork id they describe) */
  labels: Record<string, string>;
  themes: Partial<Record<Movement, string>>;
}

export function score(a: Answers) {
  const placedOk = ARTWORKS.filter((w) => a.placements[w.id] === w.movement).length;
  const labelsOk = ARTWORKS.filter((w) => a.labels[w.id] === w.id).length;
  const themesOk = (["S", "I"] as Movement[]).filter(
    (m) => THEMES[m].options.find((o) => o.id === a.themes[m])?.correct,
  ).length;
  const placement = placedOk * POINTS.placement;
  const label = labelsOk * POINTS.label;
  const theme = themesOk * POINTS.theme;
  const total = placement + label + theme;
  return { placedOk, labelsOk, themesOk, placement, label, theme, total };
}

export const verdictFor = (total: number) => VERDICTS.find((v) => total >= v.min)!;

export function feedbackFor(s: ReturnType<typeof score>) {
  if (s.total >= 90) return FEEDBACK.excellent;
  const misses = [
    { k: "placement", ratio: 1 - s.placedOk / 10 },
    { k: "label", ratio: 1 - s.labelsOk / 10 },
    { k: "theme", ratio: 1 - s.themesOk / 2 },
  ].sort((x, y) => y.ratio - x.ratio);
  return FEEDBACK[misses[0].k as "placement" | "label" | "theme"];
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
