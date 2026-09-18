"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getCourseHref, siteContent } from "@/content/french-restaurant";

const focusableSelector = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

export function KineticNavigation() {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = buttonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.menu = "open";
    const firstLink = dialogRef.current?.querySelector<HTMLElement>(focusableSelector);
    window.setTimeout(() => firstLink?.focus(), reduceMotion ? 0 : 220);

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
      trigger?.focus();
    };
  }, [open, reduceMotion]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <header className="site-header">
        <Link className="site-wordmark" href="/" aria-label="トップへ">{siteContent.brand.name}</Link>
        <button
          ref={buttonRef}
          className="menu-trigger"
          type="button"
          aria-expanded={open}
          aria-controls="site-navigation"
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          onClick={() => setOpen((value) => !value)}
        >
          <span>MENU</span>
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
              variants={{ closed: { transform: reduceMotion ? "none" : "translate3d(100%,0,0)" }, open: { transform: "translate3d(0,0,0)" } }}
              transition={{ duration: reduceMotion ? 0.18 : 0.46, ease: [0.77, 0, 0.175, 1] }}
            />
            <motion.div
              className="menu-panel menu-panel-burgundy"
              variants={{ closed: { transform: reduceMotion ? "none" : "translate3d(100%,0,0)" }, open: { transform: "translate3d(0,0,0)" } }}
              transition={{ duration: reduceMotion ? 0.18 : 0.5, delay: reduceMotion ? 0 : 0.07, ease: [0.77, 0, 0.175, 1] }}
            />
            <div className="menu-decoration" data-active={activeIndex} aria-hidden="true"><span /><span /></div>
            <nav aria-label="メインナビゲーション">
              <ul className="menu-primary-list">
                {siteContent.navigation.slice(0, 2).map((item, index) => (
                  <motion.li
                    key={item.href}
                    variants={{ closed: { opacity: 0, transform: reduceMotion ? "none" : "translate3d(0,20px,0)" }, open: { opacity: 1, transform: "translate3d(0,0,0)" } }}
                    transition={{ duration: reduceMotion ? 0.18 : 0.42, delay: reduceMotion ? 0 : 0.18 + index * 0.045, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      onClick={closeMenu}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  className="menu-course-group"
                  variants={{ closed: { opacity: 0, transform: reduceMotion ? "none" : "translate3d(0,20px,0)" }, open: { opacity: 1, transform: "translate3d(0,0,0)" } }}
                  transition={{ duration: reduceMotion ? 0.18 : 0.42, delay: reduceMotion ? 0 : 0.27, ease: [0.23, 1, 0.32, 1] }}
                >
                  <p><span>03</span>コース料理</p>
                  <ul>
                    <li><Link href="/courses" aria-current={pathname === "/courses" ? "page" : undefined} onMouseEnter={() => setActiveIndex(2)} onFocus={() => setActiveIndex(2)} onClick={closeMenu}>コース一覧</Link></li>
                    {siteContent.courses.map((course) => {
                      const href = getCourseHref(course.id);
                      return <li key={course.id}><Link href={href} aria-current={pathname === href ? "page" : undefined} onMouseEnter={() => setActiveIndex(2)} onFocus={() => setActiveIndex(2)} onClick={closeMenu}>{course.name}<small>お一人様 {course.price.toLocaleString("ja-JP")}円</small></Link></li>;
                    })}
                  </ul>
                </motion.li>
                {siteContent.navigation.slice(2).map((item, index) => (
                  <motion.li
                    key={item.href}
                    variants={{ closed: { opacity: 0, transform: reduceMotion ? "none" : "translate3d(0,20px,0)" }, open: { opacity: 1, transform: "translate3d(0,0,0)" } }}
                    transition={{ duration: reduceMotion ? 0.18 : 0.42, delay: reduceMotion ? 0 : 0.34 + index * 0.045, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      onMouseEnter={() => setActiveIndex(index + 3)}
                      onFocus={() => setActiveIndex(index + 3)}
                      onClick={closeMenu}
                    >
                      <span>{String(index + 4).padStart(2, "0")}</span>{item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <p className="menu-note">価格も過ごし方も、選びやすく。</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
