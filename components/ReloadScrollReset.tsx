"use client";

import { useLayoutEffect } from "react";

function isReloadNavigation() {
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (navigation) return navigation.type === "reload";
  return "navigation" in performance && performance.navigation.type === 1;
}

export function ReloadScrollReset() {
  useLayoutEffect(() => {
    if (!isReloadNavigation() || window.location.hash) return;

    const previousRestoration = document.documentElement.dataset.previousScrollRestoration === "manual" ? "manual" : "auto";
    const timers: number[] = [];
    let firstFrame = 0;
    let secondFrame = 0;
    let active = true;

    const reset = () => {
      if (!active) return;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };

    window.history.scrollRestoration = "manual";
    reset();
    firstFrame = window.requestAnimationFrame(() => {
      reset();
      secondFrame = window.requestAnimationFrame(reset);
    });
    timers.push(window.setTimeout(reset, 60));
    timers.push(window.setTimeout(() => {
      reset();
      window.history.scrollRestoration = previousRestoration;
      window.removeEventListener("pageshow", reset);
      delete document.documentElement.dataset.reload;
      delete document.documentElement.dataset.previousScrollRestoration;
      active = false;
    }, 500));
    window.addEventListener("pageshow", reset);

    return () => {
      active = false;
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("pageshow", reset);
      window.history.scrollRestoration = previousRestoration;
      delete document.documentElement.dataset.reload;
      delete document.documentElement.dataset.previousScrollRestoration;
    };
  }, []);

  return null;
}
