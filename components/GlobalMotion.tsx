"use client";

import { useEffect } from "react";
import { cancelPageScroll, scrollPageTo } from "@/components/pageScroll";

export function GlobalMotion() {
  useEffect(() => {
    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const listeners = anchors.map((anchor) => {
      const handler = (event: MouseEvent) => {
        const target = document.querySelector(anchor.hash);
        if (!target) return;
        event.preventDefault();
        scrollPageTo(target.getBoundingClientRect().top + window.scrollY);
      };
      anchor.addEventListener("click", handler);
      return () => anchor.removeEventListener("click", handler);
      });
    return () => { listeners.forEach((remove) => remove()); cancelPageScroll(); };
  }, []);
  return null;
}
