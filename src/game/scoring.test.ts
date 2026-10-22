import { describe, expect, it } from "vitest";
import { ARTWORKS } from "./artworks";
import { score, verdictFor } from "./scoring";

const perfect = {
  placements: Object.fromEntries(ARTWORKS.map((w) => [w.id, w.movement])),
  labels: Object.fromEntries(ARTWORKS.map((w) => [w.id, w.id])),
  themes: { S: "SA", I: "IB" } as const,
};

describe("scoring", () => {
  it("max score is exactly 100", () => {
    expect(score(perfect).total).toBe(100);
  });
  it("all wrong scores 0", () => {
    const s = score({
      placements: Object.fromEntries(ARTWORKS.map((w) => [w.id, w.movement === "S" ? "I" : "S"])),
      labels: Object.fromEntries(ARTWORKS.map((w, i) => [w.id, ARTWORKS[(i + 1) % 10].id])),
      themes: { S: "SB", I: "IA" },
    });
    expect(s.total).toBe(0);
  });
  it("label points are independent of gallery placement", () => {
    const s = score({ ...perfect, placements: {}, themes: {} });
    expect(s.label).toBe(30);
    expect(s.total).toBe(30);
  });
  it("verdict boundaries", () => {
    expect(verdictFor(100).tier).toBe("SOLD-OUT OPENING!");
    expect(verdictFor(90).tier).toBe("SOLD-OUT OPENING!");
    expect(verdictFor(89).tier).toBe("CROWD FAVORITE!");
    expect(verdictFor(75).tier).toBe("CROWD FAVORITE!");
    expect(verdictFor(74).tier).toBe("MIXED REVIEWS!");
    expect(verdictFor(60).tier).toBe("MIXED REVIEWS!");
    expect(verdictFor(59).tier).toBe("BACK TO THE CURATOR'S DESK!");
    expect(verdictFor(0).tier).toBe("BACK TO THE CURATOR'S DESK!");
  });
});
