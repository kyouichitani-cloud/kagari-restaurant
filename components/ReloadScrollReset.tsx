"use client";

import { useLayoutEffect } from "react";

export function ReloadScrollReset() {
  useLayoutEffect(() => {
    const navigationEntry = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isReload = navigationEntry?.type === "reload";
    const previousRestoration = window.history.scrollRestoration;
    const timers: number[] = [];
    const frames: number[] = [];
    let active = isReload || !window.location.hash;

    const removeHash = () => {
      if (!window.location.hash) return;
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
    };

    if (isReload) removeHash();

    const reset = () => {
      if (!active || window.location.hash) return;
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    const clearScheduledResets = () => {
      frames.splice(0).forEach((frame) => window.cancelAnimationFrame(frame));
      timers.splice(0).forEach((timer) => window.clearTimeout(timer));
    };

    const stopResetting = () => {
      active = false;
      clearScheduledResets();
    };

    const scheduleReset = () => {
      if (!active) return;
      reset();
      frames.push(window.requestAnimationFrame(() => {
        reset();
        frames.push(window.requestAnimationFrame(reset));
      }));
      [100, 400, 900, 1600, 3000].forEach((delay) => timers.push(window.setTimeout(reset, delay)));
      timers.push(window.setTimeout(stopResetting, 3200));
    };

    const prepareForReload = () => {
      try {
        window.sessionStorage.setItem("kagari-force-top", "1");
      } catch {
        // Safariのプライベートブラウズなど、保存できない環境でもスクロールだけは戻す。
      }
      window.history.scrollRestoration = "manual";
      removeHash();
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    const stopForScrollKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) stopResetting();
    };

    const stopForAnchorClick = (event: MouseEvent) => {
      const source = event.target;
      if (!(source instanceof Element)) return;
      const anchor = source.closest<HTMLAnchorElement>('a[href*="#"]');
      if (anchor?.hash) stopResetting();
    };

    window.history.scrollRestoration = "manual";
    scheduleReset();

    window.addEventListener("beforeunload", prepareForReload);
    window.addEventListener("pagehide", prepareForReload);
    window.addEventListener("touchstart", stopResetting, { passive: true, once: true });
    window.addEventListener("pointerdown", stopResetting, { passive: true, once: true });
    window.addEventListener("touchmove", stopResetting, { passive: true, once: true });
    window.addEventListener("wheel", stopResetting, { passive: true, once: true });
    window.addEventListener("keydown", stopForScrollKey);
    document.addEventListener("click", stopForAnchorClick, true);

    return () => {
      stopResetting();
      window.removeEventListener("beforeunload", prepareForReload);
      window.removeEventListener("pagehide", prepareForReload);
      window.removeEventListener("touchstart", stopResetting);
      window.removeEventListener("pointerdown", stopResetting);
      window.removeEventListener("touchmove", stopResetting);
      window.removeEventListener("wheel", stopResetting);
      window.removeEventListener("keydown", stopForScrollKey);
      document.removeEventListener("click", stopForAnchorClick, true);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  return null;
}
