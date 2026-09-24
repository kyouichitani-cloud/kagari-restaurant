"use client";

import { useEffect } from "react";

export function GlobalMotion() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const source = event.target;
      if (!(source instanceof Element)) return;
      const anchor = source.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor?.hash) return;
      const id = decodeURIComponent(anchor.hash.slice(1));
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const distance = Math.abs(target.getBoundingClientRect().top);
      const instant = reduced || anchor.classList.contains("skip-link") || distance > window.innerHeight * 1.5;
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      if (instant) document.documentElement.style.scrollBehavior = "auto";
      if (window.location.hash !== anchor.hash) {
        const oldURL = window.location.href;
        window.history.pushState(window.history.state, "", anchor.hash);
        window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL, newURL: window.location.href }));
      }
      target.scrollIntoView({ behavior: instant ? "auto" : "smooth", block: "start" });
      if (instant) {
        window.requestAnimationFrame(() => {
          document.documentElement.style.scrollBehavior = previousScrollBehavior;
        });
      }
      if (anchor.classList.contains("skip-link")) {
        window.requestAnimationFrame(() => target.focus({ preventScroll: true }));
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
  return null;
}
