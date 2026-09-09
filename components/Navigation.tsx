"use client";

import { useEffect, useRef, useState } from "react";
import type { RestaurantContent } from "@/content/restaurant";

export function Navigation({ navigation, brand, details }: Pick<RestaurantContent, "navigation" | "brand" | "details">) {
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [nearBooking, setNearBooking] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    document.documentElement.dataset.menu = open ? "open" : "closed";
    if (open) {
      const background = Array.from(document.querySelectorAll<HTMLElement>("main > :not(.nav-shell)"));
      const previousInert = background.map((element) => element.inert);
      background.forEach((element) => { element.inert = true; });
      document.querySelector<HTMLElement>("#mobile-menu a")?.focus();
      const closeOnEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") { setOpen(false); window.setTimeout(() => triggerRef.current?.focus(), 0); }
        if (event.key === "Tab") {
          const items = Array.from(document.querySelectorAll<HTMLElement>("#mobile-menu a, .menu-trigger"));
          const first = items[0];
          const last = items.at(-1);
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
      };
      window.addEventListener("keydown", closeOnEscape);
      return () => {
        window.removeEventListener("keydown", closeOnEscape);
        background.forEach((element, index) => { element.inert = previousInert[index]; });
        delete document.documentElement.dataset.menu;
      };
    }
    return () => { delete document.documentElement.dataset.menu; };
  }, [open]);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), { threshold: 0 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const targets = [document.getElementById("reservation"), document.querySelector("footer")].filter(Boolean) as Element[];
    if (!targets.length) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
      setNearBooking(visible.size > 0);
    }, { rootMargin: "0px 0px -15%" });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <>
    <header className="nav-shell">
      <a className="wordmark" href="#top" aria-label={`${brand.ja} ホーム`}><span>{brand.ja}</span><small>{brand.en}</small></a>
      <nav aria-label="メインナビゲーション">{navigation.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}</nav>
      <a className="nav-book" href="#reservation">席を予約する</a>
      <button ref={triggerRef} className="menu-trigger" type="button" aria-label={open ? "メニューを閉じる" : "メニューを開く"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}><span /><span /></button>
      <div className="mobile-menu" id="mobile-menu" data-open={open} aria-hidden={!open} role="dialog" aria-modal="true" aria-label="サイトメニュー">
        <nav aria-label="モバイルナビゲーション">{navigation.map((item, index) => <a href={item.href} key={item.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}><small>{String(index + 1).padStart(2, "0")}</small>{item.label}</a>)}</nav>
        <a className="mobile-book" href="#reservation" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>席を予約する</a>
        <a className="mobile-phone" href={`tel:${details.telephone.replaceAll("-", "")}`} tabIndex={open ? 0 : -1}>{details.telephone}<small>{details.reception}</small></a>
        <p>火と水と器で、季節を結ぶ。</p>
      </div>
    </header>
    <a className="persistent-book" data-visible={pastHero && !nearBooking} href="#reservation"><span className="persistent-mark">篝</span><span>席を予約する</span></a>
    </>
  );
}
