import { ARTWORKS, THEMES, type Movement } from "@/game/artworks";
import { play } from "@/game/sound";
import type { GameState } from "@/game/state";
import { FramedPainting, StageHeader } from "./shared";

const byId = Object.fromEntries(ARTWORKS.map((w) => [w.id, w]));

export function Stage3({ g, setG, urls }: { g: GameState; setG: (f: (g: GameState) => GameState) => void; urls: Record<string, string | null> }) {
  const done = !!g.themes.S && !!g.themes.I;
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <StageHeader sign="Mission 3 · Exhibition Statement" title="The Grand Opening"
        text="The paintings are displayed and the labels are ready. Now your museum needs a clear message! Choose the exhibition statement that best represents each artistic movement." />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {(["S", "I"] as Movement[]).map((z) => (
          <fieldset key={z} className={`rounded-lg p-5 shadow-xl ${z === "S" ? "bg-dream-room" : "bg-sun-room"}`}>
            <legend className="sr-only">{THEMES[z].question}</legend>
            <p className="museum-sign">{z === "S" ? "Gallery A · Surrealism" : "Gallery B · Impressionism"}</p>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {g.order.filter((id) => g.placements[id] === z).map((id) => (
                <FramedPainting key={id} art={byId[id]} src={urls[id]} size="sm" className="w-28 shrink-0" />
              ))}
            </div>
            <h3 className="mt-3 text-2xl">{THEMES[z].question}</h3>
            <div className="mt-3 space-y-2">
              {g.themeOrder[z].map((oid) => {
                const o = THEMES[z].options.find((x) => x.id === oid)!;
                const checked = g.themes[z] === oid;
                const [head, ...rest] = o.text.split(":");
                return (
                  <label key={oid} className={`flex cursor-pointer gap-3 rounded-md border-2 bg-card/95 p-3 text-card-foreground transition ${checked ? "border-gold shadow-lg" : "border-transparent hover:border-gold/50"}`}>
                    <input type="radio" name={`theme-${z}`} checked={checked} className="mt-1 accent-gold"
                      onChange={() => { play("place"); setG((s) => ({ ...s, themes: { ...s.themes, [z]: oid } })); }} />
                    <span><strong className="font-display text-lg">{head}:</strong>{rest.join(":")}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button className="btn-gold text-lg" disabled={!done}
          onClick={() => { play("fanfare"); setG((s) => ({ ...s, phase: "opening", completedAt: new Date().toISOString() })); window.scrollTo(0, 0); }}>
          Open My Museum!
        </button>
      </div>
    </section>
  );
}
