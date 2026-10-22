import { useEffect, useState } from "react";
import { ARTWORKS } from "./artworks";

const KEY = "curator-images-v1";
type Overrides = Record<string, string>;

export function readOverrides(): Overrides {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
export function writeOverride(id: string, url: string | null) {
    if (url) o[id] = url; else delete o[id];
  localStorage.setItem(KEY, JSON.stringify(o));
  window.dispatchEvent(new Event("curator-images"));
}

export type ImgStatus = "missing" | "loading" | "ok" | "error";

/** Resolved image URLs + load status for every artwork. */
export function useArtworkImages() {
  const [urls, setUrls] = useState<Record<string, string | null>>({});
  const [status, setStatus] = useState<Record<string, ImgStatus>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => {
            const u: Record<string, string | null> = {};
      const st: Record<string, ImgStatus> = {};
      ARTWORKS.forEach((w) => {
        u[w.id] = w.defaultImage;
        st[w.id] = u[w.id] ? "loading" : "missing";
      });
      setUrls(u); setStatus(st); setReady(true);
      ARTWORKS.forEach((w) => {
        const src = u[w.id];
        if (!src) return;
        const img = new Image();
        img.onload = () => setStatus((s) => ({ ...s, [w.id]: "ok" }));
        img.onerror = () => setStatus((s) => ({ ...s, [w.id]: "error" }));
        img.src = src;
      });
    };
    load();
    window.addEventListener("curator-images", load);
    return () => window.removeEventListener("curator-images", load);
  }, []);

  const allOk = ready && ARTWORKS.every((w) => status[w.id] === "ok");
  return { urls, status, ready, allOk };
}

/** Downscale an uploaded file to a JPEG data URL so it fits in local storage. */
export function fileToDataUrl(file: File, max = 1400): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const r = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/jpeg", 0.85));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error("This file could not be read as an image."));
    img.src = URL.createObjectURL(file);
  });
}
