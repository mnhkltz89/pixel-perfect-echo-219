let ctx: AudioContext | null = null;
export const soundPref = {
  get muted() { try { return localStorage.getItem("curator-muted") === "1"; } catch { return false; } },
  set(m: boolean) { localStorage.setItem("curator-muted", m ? "1" : "0"); },
};

function tone(freq: number, start: number, dur: number, vol = 0.08, type: OscillatorType = "sine") {
  if (!ctx) return;
  const o = ctx.createOscillator(); const g = ctx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime + start);
  g.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur + 0.05);
}

export function play(kind: "place" | "unlock" | "fanfare") {
  if (soundPref.muted || typeof window === "undefined") return;
  try {
    ctx ??= new AudioContext();
    if (kind === "place") { tone(520, 0, 0.15, 0.06, "triangle"); }
    if (kind === "unlock") { tone(523, 0, 0.2); tone(659, 0.12, 0.2); tone(784, 0.24, 0.35); }
    if (kind === "fanfare") { [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.15, 0.5, 0.07, "triangle")); }
  } catch { /* audio unavailable */ }
}
