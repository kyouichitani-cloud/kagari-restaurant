"use client";

import { useEffect } from "react";

export function GlobalMotion() {
  useEffect(() => {
    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const listeners = anchors.map((anchor) => {
      const handler = (event: MouseEvent) => {
        const target = document.querySelector(anchor.hash);
        if (!target) return;
        event.preventDefault();
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const touchLayout = window.matchMedia("(max-width: 1279px), (pointer: coarse)").matches;
        target.scrollIntoView({ behavior: reduced || touchLayout ? "auto" : "smooth", block: "start" });
      };
      anchor.addEventListener("click", handler);
      return () => anchor.removeEventListener("click", handler);
      });
    return () => { listeners.forEach((remove) => remove()); };
  }, []);
  return null;
}
