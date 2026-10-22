import { useState, type DragEvent } from "react";
import { X } from "lucide-react";
import { ARTWORKS, type Movement } from "@/game/artworks";
import { play } from "@/game/sound";
import type { GameState } from "@/game/state";
import { FramedPainting, StageHeader, ZoomModal } from "./shared";

const byId = Object.fromEntries(ARTWORKS.map((w) => [w.id, w]));

export function Stage2({ g, setG, urls }: { g: GameState; setG: (f: (g: GameState) => GameState) => void; urls: Record<string, string | null> }) {
  const [selLabel, setSelLabel] = useState<string | null>(null);
  const [selArt, setSelArt] = useState<string | null>(null);
  const [zoom, setZoom] = useState<string | null>(null);

  const assign = (artId: string, labelId: string) => {
    setG((s) => {
      const l = { ...s.labels };
      for (const k of Object.keys(l)) if (l[k] === labelId) delete l[k];
      l[artId] = labelId;
      return { ...s, labels: l };
    });
    play("place"); setSelLabel(null); setSelArt(null);
  };
  const unassign = (artId: string) => setG((s) => { const l = { ...s.labels }; delete l[artId]; return { ...s, labels: l }; });

  const used = new Set(Object.values(g.labels));
  const pool = g.labelOrder.filter((id) => !used.has(id));
  const count = Object.keys(g.labels).length;

  const clickSlot = (artId: string) => {
    if (selLabel) assign(artId, selLabel);
    else setSelArt(selArt === artId ? null : artId);
  };
  const clickLabel = (labelId: string) => {
    if (selArt) assign(selArt, labelId);
    else setSelLabel(selLabel === labelId ? null : labelId);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <StageHeader sign="Mission 2 · Label Restoration" title="The Lost Artwork Labels"
        text="Every great exhibition needs an explanation! Unfortunately, the museum labels have been mixed up. Look carefully at the paintings and match each artwork with the description that best explains its visual characteristics." />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {(["S", "I"] as Movement[]).map((z) => (
            <div key={z} className={`rounded-lg p-5 shadow-xl ${z === "S" ? "bg-dream-room" : "bg-sun-room"}`}>
              <p className="museum-sign">{z === "S" ? "Gallery A · Surrealism" : "Gallery B · Impressionism"}</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {g.order.filter((id) => g.placements[id] === z).map((id) => {
                  const art = byId[id]; const lab = g.labels[id];
                  return (
                    <div key={id} className="rounded-md bg-card/95 p-2 text-card-foreground shadow">
                      <FramedPainting art={art} src={urls[id]} onZoom={() => setZoom(id)} />
                      <p className="mt-2 font-display font-semibold leading-tight">{art.title}</p>
                      <p className="text-xs text-muted-foreground">{art.artist}, {art.year}</p>
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e: DragEvent) => { e.preventDefault(); const l = e.dataTransfer.getData("text/label"); if (l) assign(id, l); }}
                        className={`mt-2 min-h-20 rounded border-2 border-dashed p-2 text-sm transition ${lab ? "border-gold bg-gold-soft/30" : selArt === id ? "border-gold bg-gold-soft/50" : "border-border"}`}>
                        {lab ? (
                          <div className="flex gap-1">
                            <p className="flex-1 italic">“{byId[lab].label}”</p>
                            <button onClick={() => unassign(id)} aria-label={`Remove label from ${art.title}`} className="h-6 shrink-0 rounded p-0.5 hover:bg-muted"><X className="h-4 w-4" /></button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => clickSlot(id)} className="h-full w-full text-muted-foreground" aria-pressed={selArt === id}>
                            {selLabel ? "Click to place the selected label here" : selArt === id ? "Now choose a label →" : "Empty label slot — drop or click"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-lg bg-card p-4 shadow-lg">
            <p className="museum-sign">Label Archive</p>
            <p className="text-lg font-semibold" aria-live="polite">Labels restored: {count}/10</p>
            <div className="mt-3 max-h-[60vh] space-y-2 overflow-auto pr-1">
              {pool.map((lid) => (
                <button key={lid} draggable onDragStart={(e) => e.dataTransfer.setData("text/label", lid)}
                  onClick={() => clickLabel(lid)} aria-pressed={selLabel === lid}
                  className={`block w-full cursor-grab rounded border-l-4 border-gold bg-secondary p-3 text-left text-sm shadow-sm transition hover:bg-gold-soft/50 ${selLabel === lid ? "ring-2 ring-gold" : ""}`}>
                  {byId[lid].label}
                </button>
              ))}
              {pool.length === 0 && <p className="text-muted-foreground">All labels are on the wall.</p>}
            </div>
          </div>
          <button className="btn-gold mt-4 w-full" disabled={count < 10}
            onClick={() => { play("unlock"); setG((s) => ({ ...s, phase: "stage3" })); window.scrollTo(0, 0); }}>
            Submit Museum Labels
          </button>
        </aside>
      </div>
      <ZoomModal art={zoom ? byId[zoom] : null} src={zoom ? urls[zoom] : null} onClose={() => setZoom(null)} />
    </section>
  );
}
