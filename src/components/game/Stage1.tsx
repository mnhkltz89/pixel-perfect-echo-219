import { useState, type DragEvent } from "react";
import { ARTWORKS, type Artwork, type Movement } from "@/game/artworks";
import { play } from "@/game/sound";
import type { GameState } from "@/game/state";
import { FramedPainting, StageHeader, ZoomModal } from "./shared";

type Zone = Movement | "C";
const byId = Object.fromEntries(ARTWORKS.map((w) => [w.id, w]));

export function Stage1({ g, setG, urls }: { g: GameState; setG: (f: (g: GameState) => GameState) => void; urls: Record<string, string | null> }) {
  const [sel, setSel] = useState<string | null>(null);
  const [zoom, setZoom] = useState<string | null>(null);
  const [over, setOver] = useState<Zone | null>(null);

  const move = (id: string, z: Zone) => {
    setG((s) => {
      const p = { ...s.placements };
      if (z === "C") delete p[id]; else p[id] = z;
      return { ...s, placements: p };
    });
    play("place"); setSel(null);
  };
  const inZone = (z: Zone) => g.order.filter((id) => (z === "C" ? !g.placements[id] : g.placements[id] === z));
  const count = Object.keys(g.placements).length;

  const dropProps = (z: Zone) => ({
    onDragOver: (e: DragEvent) => { e.preventDefault(); setOver(z); },
    onDragLeave: () => setOver(null),
    onDrop: (e: DragEvent) => { e.preventDefault(); setOver(null); const id = e.dataTransfer.getData("text/plain"); if (byId[id]) move(id, z); },
  });

  const Card = ({ art, compact }: { art: Artwork; compact?: boolean }) => (
    <div draggable onDragStart={(e) => { e.dataTransfer.setData("text/plain", art.id); setSel(null); }}
      className={`group cursor-grab rounded-md bg-card/95 p-2 text-card-foreground shadow transition active:cursor-grabbing ${sel === art.id ? "ring-4 ring-gold" : ""}`}>
      <button type="button" onClick={() => setSel(sel === art.id ? null : art.id)} aria-pressed={sel === art.id}
        aria-label={`Select ${art.title} to place it`} className="block w-full text-left">
        <FramedPainting art={art} src={urls[art.id]} size={compact ? "sm" : "md"} onZoom={() => setZoom(art.id)} />
        <p className={`mt-2 font-display font-semibold leading-tight ${compact ? "text-sm" : "text-base"}`}>{art.title}</p>
        <p className="text-xs text-muted-foreground">{art.artist}, {art.year}</p>
      </button>
      {sel === art.id && (
        <div className="mt-2 flex flex-wrap gap-1 text-xs">
          {g.placements[art.id] !== "S" && <button className="rounded bg-dream px-2 py-1 text-dream-foreground" onClick={() => move(art.id, "S")}>→ Gallery A</button>}
          {g.placements[art.id] !== "I" && <button className="rounded bg-sun-muted px-2 py-1 text-sun-foreground" onClick={() => move(art.id, "I")}>→ Gallery B</button>}
          {g.placements[art.id] && <button className="rounded bg-muted px-2 py-1" onClick={() => move(art.id, "C")}>Return</button>}
        </div>
      )}
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <StageHeader sign="Mission 1 · Collection Inventory" title="The Mixed-Up Collection"
        text="Curator, our paintings have arrived without their gallery assignments! Examine each artwork and decide where it belongs. Drag the paintings into the correct exhibition room." />
      <p className="mt-2 text-center text-sm text-muted-foreground">Tip: you can also click a painting, then choose a gallery.</p>

      <div {...dropProps("C")} aria-label="Unsorted collection"
        className={`mt-6 rounded-lg border-2 border-dashed p-4 transition ${over === "C" ? "border-gold bg-gold-soft/40" : "border-border bg-card/40"}`}>
        <p className="museum-sign mb-3">Unsorted Collection</p>
        {inZone("C").length === 0 ? <p className="py-4 text-center text-muted-foreground">All artworks have been placed. ✨</p> : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {inZone("C").map((id) => <Card key={id} art={byId[id]} />)}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {(["S", "I"] as Movement[]).map((z) => (
          <div key={z} {...dropProps(z)} aria-label={z === "S" ? "Gallery A: Surrealism" : "Gallery B: Impressionism"}
            className={`min-h-72 rounded-lg p-5 shadow-xl transition ${z === "S" ? "bg-dream-room" : "bg-sun-room"} ${over === z ? "ring-4 ring-gold" : ""}`}>
            <p className="museum-sign">{z === "S" ? "Gallery A" : "Gallery B"}</p>
            <h3 className={`text-3xl ${z === "S" ? "animate-float" : ""}`}>{z === "S" ? "Surrealism Gallery" : "Impressionism Gallery"}</h3>
            <p className="text-sm opacity-80">{z === "S" ? "Dreams, Imagination & the Unconscious" : "Light, Color & Everyday Moments"}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
              {inZone(z).map((id) => <Card key={id} art={byId[id]} compact />)}
            </div>
            {inZone(z).length === 0 && <p className="mt-8 text-center opacity-60">Drop paintings here</p>}
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <p className="text-lg font-semibold" aria-live="polite">Artworks placed: {count}/10</p>
        <button className="btn-gold" disabled={count < 10}
          onClick={() => { play("unlock"); setG((s) => ({ ...s, phase: "stage2" })); window.scrollTo(0, 0); }}>
          Confirm Gallery Arrangement
        </button>
      </div>
      <ZoomModal art={zoom ? byId[zoom] : null} src={zoom ? urls[zoom] : null} onClose={() => setZoom(null)} />
    </section>
  );
}
