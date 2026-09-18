"use client";

import { useEffect } from "react";

function isReloadNavigation() {
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (navigation) return navigation.type === "reload";
  return "navigation" in performance && performance.navigation.type === 1;
}

export function ReloadScrollReset() {
  useEffect(() => {
    if (!isReloadNavigation()) return;

    const previousRestoration = window.history.scrollRestoration;
    const timers: number[] = [];
    let firstFrame = 0;
    let secondFrame = 0;
    let active = true;

    const reset = () => {
      if (active) window.scrollTo(0, 0);
    };

    const resetAfterRestore = () => {
      reset();
      firstFrame = window.requestAnimationFrame(() => {
        reset();
        secondFrame = window.requestAnimationFrame(reset);
      });
      timers.push(window.setTimeout(reset, 80));
      timers.push(window.setTimeout(reset, 260));
    };

    const finish = () => {
      active = false;
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("load", resetAfterRestore);
      window.removeEventListener("pageshow", resetAfterRestore);
      window.history.scrollRestoration = previousRestoration;
    };

    // Only reloads bypass browser scroll restoration. Normal visits keep their URL hash,
    // and client-side navigation remains under Next.js and browser history control.
    window.history.scrollRestoration = "manual";
    resetAfterRestore();
    window.addEventListener("load", resetAfterRestore, { once: true });
    window.addEventListener("pageshow", resetAfterRestore);
    timers.push(window.setTimeout(finish, 520));

    return finish;
  }, []);

  return null;
}
