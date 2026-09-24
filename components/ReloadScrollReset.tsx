"use client";

import { useLayoutEffect } from "react";

export function ReloadScrollReset() {
  useLayoutEffect(() => {
    if (window.location.hash) return;

    const previousRestoration = window.history.scrollRestoration;
    const timers: number[] = [];
    const frames: number[] = [];
    let active = true;
    let interval: number | undefined;

    const reset = () => {
      if (active && !window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    };

    const clearScheduledResets = () => {
      frames.splice(0).forEach((frame) => window.cancelAnimationFrame(frame));
      timers.splice(0).forEach((timer) => window.clearTimeout(timer));
      if (interval !== undefined) {
        window.clearInterval(interval);
        interval = undefined;
      }
    };

    const resetAfterRestore = () => {
      clearScheduledResets();
      active = true;
      reset();
      frames.push(window.requestAnimationFrame(() => {
        reset();
        frames.push(window.requestAnimationFrame(reset));
      }));
      timers.push(window.setTimeout(reset, 0));
      timers.push(window.setTimeout(reset, 120));
      timers.push(window.setTimeout(reset, 400));
      timers.push(window.setTimeout(reset, 900));
      timers.push(window.setTimeout(reset, 1600));
      timers.push(window.setTimeout(reset, 3000));
      timers.push(window.setTimeout(reset, 5000));
      interval = window.setInterval(reset, 250);
      timers.push(window.setTimeout(() => {
        if (interval !== undefined) {
          window.clearInterval(interval);
          interval = undefined;
        }
      }, 5200));
    };

    const stopResetting = () => {
      active = false;
      clearScheduledResets();
    };

    const resetBeforeCache = () => {
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    };

    const resetWhenVisibilityChanges = () => {
      if (document.visibilityState === "visible") {
        resetAfterRestore();
      } else {
        resetBeforeCache();
      }
    };

    const stopForScrollKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
        stopResetting();
      }
    };

    const handleHistoryChange = () => {
      if (window.location.hash) {
        stopResetting();
      } else {
        resetAfterRestore();
      }
    };

    const finish = () => {
      stopResetting();
      window.removeEventListener("load", resetAfterRestore);
      window.removeEventListener("pageshow", resetAfterRestore);
      window.removeEventListener("pagehide", resetBeforeCache);
      window.removeEventListener("popstate", handleHistoryChange);
      window.removeEventListener("hashchange", handleHistoryChange);
      document.removeEventListener("visibilitychange", resetWhenVisibilityChanges);
      window.removeEventListener("touchmove", stopResetting);
      window.removeEventListener("wheel", stopResetting);
      window.removeEventListener("keydown", stopForScrollKey);
      window.history.scrollRestoration = previousRestoration;
    };

    window.history.scrollRestoration = "manual";
    resetAfterRestore();
    window.addEventListener("load", resetAfterRestore, { once: true });
    window.addEventListener("pageshow", resetAfterRestore);
    window.addEventListener("pagehide", resetBeforeCache);
    window.addEventListener("popstate", handleHistoryChange);
    window.addEventListener("hashchange", handleHistoryChange);
    document.addEventListener("visibilitychange", resetWhenVisibilityChanges);
    window.addEventListener("touchmove", stopResetting, { passive: true, once: true });
    window.addEventListener("wheel", stopResetting, { passive: true, once: true });
    window.addEventListener("keydown", stopForScrollKey);

    return finish;
  }, []);

  return null;
}
