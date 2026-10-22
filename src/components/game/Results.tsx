import { useState } from "react";
import { Check, X } from "lucide-react";
import { ARTWORKS, MOVEMENT_NAMES } from "@/game/artworks";
import { feedbackFor, score, verdictFor } from "@/game/scoring";
import type { GameState } from "@/game/state";
import { FramedPainting } from "./shared";

const TONE = { gold: "⭐⭐⭐⭐⭐", silver: "⭐⭐⭐⭐", bronze: "⭐⭐⭐", reno: "🚧 Under Renovation 🚧" };

export function Results({ g, urls, onRestart }: { g: GameState; urls: Record<string, string | null>; onRestart: () => void }) {
  const s = score(g);
  const v = verdictFor(s.total);
  const [review, setReview] = useState(false);
  const date = new Date(g.completedAt || Date.now()).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return (
    <section className="relative mx-auto max-w-5xl px-4 py-10">
      {v.tone === "gold" && (
        <div className="no-print pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i} className="animate-confetti absolute block h-3 w-2 bg-gold"
              style={{ left: `${(i * 37) % 100}%`, animationDuration: `${4 + (i % 5)}s`, animationDelay: `${(i % 7) * 0.4}s`, opacity: 0.8 }} />
          ))}
        </div>
      )}

      <article className="relative z-10 rounded-sm border border-border bg-card p-6 shadow-2xl md:p-10">
        <header className="border-b-4 border-double border-foreground pb-4 text-center">
          <p className="museum-sign">The Museum Gazette · {date}</p>
          <h1 className="mt-2 text-4xl font-bold md:text-6xl">THE EXHIBITION REVIEWS ARE IN!</h1>
          <p className="mt-1 text-muted-foreground">The Museum Curator Challenge — Two Art Movements. One Grand Exhibition.</p>
        </header>

        <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="museum-sign">{v.tier}</p>
            <h2 className="text-4xl font-bold leading-tight md:text-5xl">{v.headline}</h2>
            <p className="mt-1 text-2xl" aria-label="Review rating">{TONE[v.tone]}</p>
            <p className="mt-4 text-lg leading-relaxed">{v.message}</p>
            <p className="mt-4 border-l-4 border-gold bg-secondary p-3 italic">Critic's note: {feedbackFor(s)}</p>
          </div>
          <div className="rounded border border-border bg-background p-5">
            <p className="museum-sign">Curator</p>
            <p className="font-display text-3xl">{g.name}</p>
            <dl className="mt-4 space-y-2">
              <Row k="Gallery Organization" v={`${s.placement}/50`} />
              <Row k="Artwork Descriptions" v={`${s.label}/30`} />
              <Row k="Exhibition Themes" v={`${s.theme}/20`} />
            </dl>
            <div className="mt-4 border-t-2 border-foreground pt-3 text-center">
              <p className="museum-sign">Final Curator Score</p>
              <p className="gold-text font-display text-6xl font-bold">{s.total}/100</p>
              <p className="text-muted-foreground">{s.total}%</p>
            </div>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
              <li>Correctly classified artworks: {s.placedOk}/10</li>
              <li>Correctly matched descriptions: {s.labelsOk}/10</li>
              <li>Correct exhibition themes: {s.themesOk}/2</li>
            </ul>
          </div>
        </div>

        <div className="no-print mt-8 flex flex-wrap justify-center gap-3">
          <button className="btn-gold" onClick={() => setReview((r) => !r)}>{review ? "Hide Review" : "Review My Exhibition"}</button>
          <button className="btn-ghost-museum" onClick={() => window.print()}>Print / Save My Curator Report</button>
          <button className="btn-ghost-museum" onClick={onRestart}>Try Again</button>
        </div>
      </article>

      {review && (
        <div className="no-print relative z-10 mt-8 space-y-4 animate-fade-up">
          <h2 className="text-center text-3xl">Exhibition Review</h2>
          {ARTWORKS.map((w) => {
            const placedOk = g.placements[w.id] === w.movement;
            const labelOk = g.labels[w.id] === w.id;
            return (
              <div key={w.id} className="grid gap-4 rounded-lg bg-card p-4 shadow md:grid-cols-[180px_1fr]">
                <FramedPainting art={w} src={urls[w.id]} />
                <div>
                  <h3 className="text-2xl">{w.title}</h3>
                  <p className="text-muted-foreground">{w.artist}, {w.year} · <strong>{MOVEMENT_NAMES[w.movement]}</strong></p>
                  <p className="mt-2 flex items-center gap-1 text-sm"><Mark ok={placedOk} />
                    Your gallery: {g.placements[w.id] ? MOVEMENT_NAMES[g.placements[w.id]] : "—"}</p>
                  <p className="flex items-center gap-1 text-sm"><Mark ok={labelOk} /> Label {labelOk ? "matched correctly" : "did not match"}</p>
                  <p className="mt-2 italic">“{w.label}”</p>
                  <p className="mt-2 text-sm">💡 {w.feedback}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{w.credit}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between border-b border-dashed border-border pb-1"><dt>{k}</dt><dd className="font-bold">{v}</dd></div>
);
const Mark = ({ ok }: { ok: boolean }) => ok
  ? <Check className="h-4 w-4 text-success" aria-label="Correct" />
  : <X className="h-4 w-4 text-destructive" aria-label="Incorrect" />;
