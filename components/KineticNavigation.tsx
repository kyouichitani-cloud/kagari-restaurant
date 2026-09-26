"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { getCourseHref, siteContent } from "@/content/french-restaurant";

const focusableSelector = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";
const menuIndicatorLabels = [
  siteContent.navigation[0].label,
  siteContent.navigation[1].label,
  "コース料理",
  ...siteContent.navigation.slice(2).map((item) => item.label),
];

function scrollToSection(targetId: string) {
  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  document.getElementById(targetId)?.scrollIntoView({ block: "start" });
  window.requestAnimationFrame(() => {
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
  });
}

export function KineticNavigation() {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [compactScreen, setCompactScreen] = useState(false);
  const disableMotion = Boolean(reduceMotion) || compactScreen;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreTriggerFocusRef = useRef(true);
  const pendingScrollTargetRef = useRef<string | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px), (hover: none), (pointer: coarse)");
    const update = () => setCompactScreen(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    restoreTriggerFocusRef.current = true;
    const trigger = buttonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.menu = "open";
    const firstLink = dialogRef.current?.querySelector<HTMLElement>(focusableSelector);
    window.setTimeout(() => firstLink?.focus(), disableMotion ? 0 : 220);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const elements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      delete document.documentElement.dataset.menu;
      document.removeEventListener("keydown", onKeyDown);
      if (restoreTriggerFocusRef.current) trigger?.focus({ preventScroll: true });
    };
  }, [disableMotion, open]);

  useEffect(() => {
    if (pathname !== "/" || !window.location.hash) return;
    const targetId = window.location.hash.slice(1);
    const frame = window.requestAnimationFrame(() => scrollToSection(targetId));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (open || !pendingScrollTargetRef.current) return;
    const targetId = pendingScrollTargetRef.current;
    pendingScrollTargetRef.current = null;
    const timer = window.setTimeout(() => scrollToSection(targetId), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  const closeMenu = () => {
    restoreTriggerFocusRef.current = false;
    setOpen(false);
  };
  const getNavigationHref = (href: string) => pathname === "/" && href.startsWith("/#") ? href.slice(1) : href;
  const handleMenuLink = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (href === "/" && pathname === "/" && !isModifiedClick) {
      event.preventDefault();
      pendingScrollTargetRef.current = "top";
      closeMenu();
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
      return;
    }

    const targetId = href.startsWith("/#") ? href.slice(2) : "";
    if (!targetId || !document.getElementById(targetId) || isModifiedClick) {
      closeMenu();
      return;
    }

    event.preventDefault();
    pendingScrollTargetRef.current = targetId;
    closeMenu();
    window.history.pushState(null, "", `#${targetId}`);
  };

  const handleWordmarkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (pathname !== "/" || isModifiedClick) return;
    event.preventDefault();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
    scrollToSection("top");
  };

  return (
    <>
      <header className="site-header">
        <Link className="site-wordmark" href="/" onClick={handleWordmarkClick}><span>{siteContent.brand.name}</span><small>{siteContent.brand.descriptor}</small></Link>
        <button
          ref={buttonRef}
          className="menu-trigger"
          type="button"
          aria-expanded={open}
          aria-controls="site-navigation"
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          onClick={() => setOpen((value) => !value)}
        >
          <span>メニュー</span>
          <i className={open ? "is-open" : ""} aria-hidden="true" />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-navigation"
            ref={dialogRef}
            className="menu-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="サイトメニュー"
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.div
              className="menu-panel menu-panel-navy"
              variants={{ closed: { transform: disableMotion ? "none" : "translate3d(100%,0,0)" }, open: { transform: "translate3d(0,0,0)" } }}
              transition={{ duration: disableMotion ? 0 : 0.46, ease: [0.77, 0, 0.175, 1] }}
            />
            <motion.div
              className="menu-panel menu-panel-burgundy"
              variants={{ closed: { transform: disableMotion ? "none" : "translate3d(100%,0,0)" }, open: { transform: "translate3d(0,0,0)" } }}
              transition={{ duration: disableMotion ? 0 : 0.5, delay: disableMotion ? 0 : 0.07, ease: [0.77, 0, 0.175, 1] }}
            />
            <div className="menu-decoration" data-active={activeIndex} aria-hidden="true">
              <span />
              <span />
              <b>{menuIndicatorLabels[activeIndex]}</b>
            </div>
            <nav aria-label="メインナビゲーション">
              <ul className="menu-primary-list">
                {siteContent.navigation.slice(0, 2).map((item, index) => (
                  <motion.li
                    key={item.href}
                    variants={{ closed: { opacity: 0, transform: disableMotion ? "none" : "translate3d(0,20px,0)" }, open: { opacity: 1, transform: "translate3d(0,0,0)" } }}
                    transition={{ duration: disableMotion ? 0 : 0.42, delay: disableMotion ? 0 : 0.18 + index * 0.045, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <Link
                      href={getNavigationHref(item.href)}
                      aria-current={pathname === item.href ? "page" : undefined}
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      onClick={(event) => handleMenuLink(event, item.href)}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  className="menu-course-group"
                  variants={{ closed: { opacity: 0, transform: disableMotion ? "none" : "translate3d(0,20px,0)" }, open: { opacity: 1, transform: "translate3d(0,0,0)" } }}
                  transition={{ duration: disableMotion ? 0 : 0.42, delay: disableMotion ? 0 : 0.27, ease: [0.23, 1, 0.32, 1] }}
                >
                  <p><span>03</span>コース料理</p>
                  <ul>
                    <li><Link href="/courses" aria-current={pathname === "/courses" ? "page" : undefined} onMouseEnter={() => setActiveIndex(2)} onFocus={() => setActiveIndex(2)} onClick={(event) => handleMenuLink(event, "/courses")}>コース一覧</Link></li>
                    {siteContent.courses.map((course) => {
                      const href = getCourseHref(course.id);
                      return <li key={course.id}><Link href={href} aria-current={pathname === href ? "page" : undefined} onMouseEnter={() => setActiveIndex(2)} onFocus={() => setActiveIndex(2)} onClick={(event) => handleMenuLink(event, href)}>{course.name}<small>お一人様 {course.price.toLocaleString("ja-JP")}円</small></Link></li>;
                    })}
                  </ul>
                </motion.li>
                {siteContent.navigation.slice(2).map((item, index) => (
                  <motion.li
                    key={item.href}
                    variants={{ closed: { opacity: 0, transform: disableMotion ? "none" : "translate3d(0,20px,0)" }, open: { opacity: 1, transform: "translate3d(0,0,0)" } }}
                    transition={{ duration: disableMotion ? 0 : 0.42, delay: disableMotion ? 0 : 0.34 + index * 0.045, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <Link
                      href={getNavigationHref(item.href)}
                      aria-current={pathname === item.href ? "page" : undefined}
                      onMouseEnter={() => setActiveIndex(index + 3)}
                      onFocus={() => setActiveIndex(index + 3)}
                      onClick={(event) => handleMenuLink(event, item.href)}
                    >
                      <span>{String(index + 4).padStart(2, "0")}</span>{item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="menu-note"><p>3つのコースから選べます。</p>{siteContent.details.instagram.url && <a href={siteContent.details.instagram.url} target="_blank" rel="noopener noreferrer">公式インスタグラム <span className="instagram-handle">{siteContent.details.instagram.label}</span> <span className="instagram-arrow" aria-hidden="true">↗</span></a>}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
