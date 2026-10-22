import { useEffect } from "react";

export function Opening({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 4200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-sun-room" role="status" aria-label="Grand opening">
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="museum-sign">Now Open</p>
          <h2 className="gold-text text-6xl font-bold md:text-8xl">GRAND OPENING</h2>
          <div className="mt-6 flex justify-center gap-3 text-5xl animate-walk-in" aria-hidden>
            <span>🧑‍🎨</span><span>👩‍🦳</span><span>🧑‍🎓</span><span>👨‍👧</span><span>👩‍💼</span>
          </div>
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 w-1/2 border-r-4 border-gold bg-navy animate-door-left">
        <div className="absolute right-6 top-1/2 h-16 w-3 rounded bg-gold" />
      </div>
      <div className="absolute inset-y-0 right-0 w-1/2 border-l-4 border-gold bg-navy animate-door-right">
        <div className="absolute left-6 top-1/2 h-16 w-3 rounded bg-gold" />
      </div>
      <button onClick={onDone} className="btn-ghost-museum absolute bottom-6 right-6 z-10 bg-card text-foreground">Skip</button>
    </div>
  );
}
