import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import { ARTWORKS } from "@/game/artworks";
import { useArtworkImages } from "@/game/images";
import { play } from "@/game/sound";
import { freshGame, useGame } from "@/game/state";
import { TopBar } from "@/components/game/shared";
import { Stage1 } from "@/components/game/Stage1";
import { Stage2 } from "@/components/game/Stage2";
import { Stage3 } from "@/components/game/Stage3";
import { Opening } from "@/components/game/Opening";
import { Results } from "@/components/game/Results";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Museum Curator Challenge — Surrealism & Impressionism" },
      { name: "description", content: "An interactive museum game: sort famous paintings, restore labels, and open your own Surrealism and Impressionism exhibition." },
      { property: "og:title", content: "The Museum Curator Challenge" },
      { property: "og:description", content: "Two Art Movements. One Grand Exhibition. Can you create a successful art exhibition?" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Game,
});

function Game() {
  const [g, setG] = useGame();
  const { urls, status, allOk, ready } = useArtworkImages();
  const finishOpening = useCallback(() => setG((s) => ({ ...s, phase: "results" })), [setG]);

  if (!g || !ready) return <div className="grid min-h-screen place-items-center museum-sign">Opening the museum…</div>;

  if (g.phase === "welcome") {
    const problems = ARTWORKS.filter((w) => status[w.id] !== "ok");
    const loading = problems.some((w) => status[w.id] === "loading");
    return (
      <main className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-4xl text-center animate-fade-up">
          <p className="museum-sign">Two Art Movements. One Grand Exhibition.</p>
          <h1 className="mt-3 text-5xl font-bold leading-none md:text-7xl">THE MUSEUM <span className="gold-text">CURATOR</span> CHALLENGE</h1>
          <p className="mt-4 font-display text-2xl italic text-muted-foreground">Can You Create a Successful Art Exhibition?</p>

          <div className="mx-auto mt-8 max-w-2xl rounded-sm border border-border bg-card p-6 text-left shadow-xl md:p-8">
            <p className="font-display text-2xl font-semibold">Welcome, Curator!</p>
            <p className="mt-3">Our museum is preparing an important exhibition featuring two revolutionary art movements: <strong>Surrealism</strong> and <strong>Impressionism</strong>.</p>
            <p className="mt-3">Unfortunately, the artworks have been mixed together, their descriptions are missing, and the exhibition rooms are not ready.</p>
            <p className="mt-3">Your mission is to organize the paintings, identify their artistic characteristics, and prepare an unforgettable exhibition for our visitors.</p>
            <p className="mt-3 font-semibold">The museum's reputation is in your hands!</p>

            <ol className="mt-6 grid gap-3 sm:grid-cols-3">
              {["Organize the Art Collection.", "Restore the Artwork Descriptions.", "Prepare the Grand Exhibition."].map((t, i) => (
                <li key={t} className="rounded border-t-4 border-gold bg-secondary p-3 text-sm">
                  <span className="font-display text-3xl text-gold">{i + 1}</span><br />{t}
                </li>
              ))}
            </ol>

            <form className="mt-6" onSubmit={(e) => {
              e.preventDefault();
              if (!g.name.trim() || !allOk) return;
              play("unlock");
              setG((s) => ({ ...s, name: s.name.trim(), phase: "stage1" }));
            }}>
              <label htmlFor="name" className="museum-sign">Your first name or curator nickname</label>
              <input id="name" value={g.name} maxLength={40} required
                onChange={(e) => setG((s) => ({ ...s, name: e.target.value }))}
                className="mt-1 w-full rounded border-2 border-input bg-background px-4 py-3 text-lg focus:border-gold focus:outline-none" placeholder="e.g. Curator Ana" />
              <div className="mt-6 text-center">
                <button className="btn-gold text-lg" disabled={!g.name.trim() || !allOk}>Begin Your Curator Mission</button>
              </div>
            </form>

            {!allOk && (
              <div role="alert" className="mt-6 rounded border border-destructive/40 bg-destructive/10 p-4 text-sm">
                {loading ? <p>Checking the artwork images…</p> : (
                  <>
                    <p className="font-semibold">The exhibition is not ready yet: {problems.length} painting image(s) are missing or failed to load.</p>
                    <ul className="mt-2 list-disc pl-5">
                      {problems.map((w) => <li key={w.id}>{w.title} ({w.artist}) — {status[w.id] === "error" ? "image failed to load" : "no image set"}</li>)}
                    </ul>
                    <p className="mt-2">Please check your internet connection and refresh the page.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  const restart = () => { setG(() => ({ ...freshGame(g.name), phase: "welcome" })); window.scrollTo(0, 0); };

  return (
    <main className="min-h-screen">
      <TopBar phase={g.phase} name={g.name} />
      {g.phase === "stage1" && <Stage1 g={g} setG={setG} urls={urls} />}
      {g.phase === "stage2" && <Stage2 g={g} setG={setG} urls={urls} />}
      {g.phase === "stage3" && <Stage3 g={g} setG={setG} urls={urls} />}
      {g.phase === "opening" && <Opening onDone={finishOpening} />}
      {g.phase === "results" && <Results g={g} urls={urls} onRestart={restart} />}
    </main>
  );
}
