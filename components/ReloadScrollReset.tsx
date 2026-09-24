"use client";

import { useLayoutEffect } from "react";

export function ReloadScrollReset() {
  useLayoutEffect(() => {
    if (window.location.hash) return;

    const previousRestoration = window.history.scrollRestoration;
    const timers: number[] = [];
    const frames: number[] = [];
    let active = true;

    const reset = () => {
      if (active && !window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    };

    const clearScheduledResets = () => {
      frames.splice(0).forEach((frame) => window.cancelAnimationFrame(frame));
      timers.splice(0).forEach((timer) => window.clearTimeout(timer));
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

    const finish = () => {
      stopResetting();
      window.removeEventListener("load", resetAfterRestore);
      window.removeEventListener("pageshow", resetAfterRestore);
      window.removeEventListener("pagehide", resetBeforeCache);
      document.removeEventListener("visibilitychange", resetWhenVisibilityChanges);
      window.removeEventListener("touchstart", stopResetting);
      window.removeEventListener("pointerdown", stopResetting);
      window.removeEventListener("wheel", stopResetting);
      window.removeEventListener("keydown", stopResetting);
      window.history.scrollRestoration = previousRestoration;
    };

    window.history.scrollRestoration = "manual";
    resetAfterRestore();
    window.addEventListener("load", resetAfterRestore, { once: true });
    window.addEventListener("pageshow", resetAfterRestore);
    window.addEventListener("pagehide", resetBeforeCache);
    document.addEventListener("visibilitychange", resetWhenVisibilityChanges);
    window.addEventListener("touchstart", stopResetting, { passive: true, once: true });
    window.addEventListener("pointerdown", stopResetting, { passive: true, once: true });
    window.addEventListener("wheel", stopResetting, { passive: true, once: true });
    window.addEventListener("keydown", stopResetting, { once: true });

    return finish;
  }, []);

  return null;
}
