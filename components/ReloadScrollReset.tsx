"use client";

import { useLayoutEffect } from "react";

export function ReloadScrollReset() {
  useLayoutEffect(() => {
    const navigationEntry = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isReload = navigationEntry?.type === "reload";
    const previousRestoration = window.history.scrollRestoration;
    let resetFrame = 0;

    const removeHash = () => {
      if (!window.location.hash) return;
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
    };

    if (isReload) removeHash();

    const prepareForReload = () => {
      try {
        window.sessionStorage.setItem("kagari-force-top", "1");
      } catch {
        // Safariのプライベートブラウズなど、保存できない環境でもスクロールだけは戻す。
      }
      window.history.scrollRestoration = "manual";
      removeHash();
    };

    window.history.scrollRestoration = "manual";
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      resetFrame = window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    }

    window.addEventListener("beforeunload", prepareForReload);
    window.addEventListener("pagehide", prepareForReload);

    return () => {
      window.cancelAnimationFrame(resetFrame);
      window.removeEventListener("beforeunload", prepareForReload);
      window.removeEventListener("pagehide", prepareForReload);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  return null;
}
