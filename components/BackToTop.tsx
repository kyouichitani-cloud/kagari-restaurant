"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const sentinel = document.getElementById("top-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0 });
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, []);
  function goTop() {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 1279px), (pointer: coarse)").matches ? "auto" : "smooth" });
  }
  return <button className="back-top" data-visible={visible} type="button" aria-label="ページの一番上へ戻る" tabIndex={visible ? 0 : -1} onClick={goTop}><span>上へ</span><i aria-hidden="true" /></button>;
}
