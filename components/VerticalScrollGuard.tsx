"use client";

import { useEffect } from "react";

type LockedAxis = "x" | "y" | null;

export function VerticalScrollGuard() {
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let lockedAxis: LockedAxis = null;

    const resetHorizontalPosition = () => {
      if (window.scrollX !== 0) window.scrollTo({ left: 0, top: window.scrollY, behavior: "auto" });
      document.documentElement.scrollLeft = 0;
      document.body.scrollLeft = 0;
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        lockedAxis = null;
        return;
      }

      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      lockedAxis = null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;

      const deltaX = event.touches[0].clientX - startX;
      const deltaY = event.touches[0].clientY - startY;

      if (lockedAxis === null && Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= 8) {
        lockedAxis = Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y";
      }

      if (lockedAxis === "x" && event.cancelable) event.preventDefault();
    };

    const handleTouchEnd = () => {
      lockedAxis = null;
      resetHorizontalPosition();
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true, capture: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false, capture: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true, capture: true });
    document.addEventListener("touchcancel", handleTouchEnd, { passive: true, capture: true });
    window.addEventListener("scroll", resetHorizontalPosition, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart, true);
      document.removeEventListener("touchmove", handleTouchMove, true);
      document.removeEventListener("touchend", handleTouchEnd, true);
      document.removeEventListener("touchcancel", handleTouchEnd, true);
      window.removeEventListener("scroll", resetHorizontalPosition);
    };
  }, []);

  return null;
}
