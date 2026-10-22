import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ARTWORKS, MOVEMENT_NAMES } from "@/game/artworks";
import { fileToDataUrl, readOverrides, useArtworkImages, writeOverride } from "@/game/images";

export const Route = createFileRoute("/teacher")({
  head: () => ({
    meta: [
      { title: "Teacher Image Setup — The Museum Curator Challenge" },
      { name: "description", content: "Upload or link authorized reproductions of the ten paintings used in the Museum Curator Challenge." },
      { property: "og:title", content: "Teacher Image Setup — Museum Curator Challenge" },
      { property: "og:description", content: "Configure the ten artwork images before students play." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Teacher,
});

function Teacher() {
  const { urls, status } = useArtworkImages();
  const [err, setErr] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const ok = ARTWORKS.filter((w) => status[w.id] === "ok").length;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <p className="museum-sign">Curator's Office</p>
      <h1 className="text-5xl font-bold">Teacher Image Setup</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        The five Impressionist paintings use public-domain museum reproductions. The five Surrealist works are still protected by copyright,
        so please upload or link reproductions you are authorized to use (e.g. from your school's licensed image library).
        Images are saved in this browser only.
      </p>
      <p className="mt-3 font-semibold">{ok}/10 images ready {ok === 10 && "— the game is ready for students! "}
        <Link to="/" className="underline">Back to the game</Link></p>
      {err && <p role="alert" className="mt-3 rounded bg-destructive/10 p-3 text-destructive">{err}</p>}

      <div className="mt-6 space-y-4">
        {ARTWORKS.map((w) => {
          const st = status[w.id];
          const custom = !!readOverrides()[w.id];
          return (
            <div key={w.id} className="grid gap-4 rounded-lg bg-card p-4 shadow md:grid-cols-[160px_1fr]">
              <div className="museum-frame grid h-32 place-items-center">
                {urls[w.id] && st !== "error"
                  ? <img src={urls[w.id]!} alt={w.title} className="h-full w-full object-contain" />
                  : <span className="text-xs text-muted-foreground">{st === "error" ? "Failed to load" : "No image"}</span>}
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{w.id} · {MOVEMENT_NAMES[w.movement]}</p>
                <h2 className="text-2xl">{w.title}</h2>
                <p className="text-sm text-muted-foreground">{w.artist}, {w.year} · <a href={w.reference} target="_blank" rel="noreferrer" className="underline">Museum reference</a></p>
                <p className="mt-1 text-sm">Status: <strong className={st === "ok" ? "text-success" : "text-destructive"}>{st}</strong>{custom && " (teacher image)"}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <label className="btn-ghost-museum cursor-pointer text-sm">
                    Upload image
                    <input type="file" accept="image/*" className="sr-only" onChange={async (e) => {
                      const f = e.target.files?.[0]; if (!f) return;
                      try { setErr(null); writeOverride(w.id, await fileToDataUrl(f)); }
                      catch (x) { setErr(x instanceof Error ? x.message : "Upload failed — the image may be too large for browser storage."); }
                    }} />
                  </label>
                  <input value={drafts[w.id] ?? ""} onChange={(e) => setDrafts((d) => ({ ...d, [w.id]: e.target.value }))}
                    placeholder="…or paste an authorized image URL" className="min-w-0 flex-1 rounded border border-input bg-background px-3 py-2 text-sm" />
                  <button className="btn-ghost-museum text-sm" disabled={!drafts[w.id]}
                    onClick={() => { writeOverride(w.id, drafts[w.id].trim()); setDrafts((d) => ({ ...d, [w.id]: "" })); }}>Save URL</button>
                  {custom && <button className="text-sm underline" onClick={() => writeOverride(w.id, null)}>Reset</button>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
