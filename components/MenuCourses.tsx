"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CompleteMenuCourse, MenuDish } from "@/content/menu";
import { courseSlug } from "@/content/menu";

function useMenuReveal() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.dataset.motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "ready";
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-menu-reveal]"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.visible = "true";
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    items.forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      delete root.dataset.motion;
    };
  }, []);

  return rootRef;
}

export function MenuCourses({ courses }: { courses: CompleteMenuCourse[] }) {
  const rootRef = useMenuReveal();
  return (
    <div className="course-index-page" ref={rootRef}>
      <header className="course-index-header" id="menu-content">
        <p>お品書き</p>
        <h1>五つのコース</h1>
        <p>季節とお席の時間に合わせて、仕立てをお選びください。</p>
      </header>
      <div className="course-index-list">
        {courses.map((course, index) => (
          <article className="course-index-item" data-menu-reveal key={course.id}>
            <CoursePicture dish={course.dishes[0]} eager={index < 2} className="course-index-image" />
            <div className="course-index-copy">
              <p>{String(index + 1).padStart(2, "0")} / 05</p>
              <div className="course-index-title-mask"><h2>{course.name}</h2></div>
              <p>{course.description}</p>
              <dl><div><dt>品数</dt><dd>全10皿</dd></div><div><dt>料金</dt><dd>{course.price.toLocaleString("ja-JP")}円</dd></div></dl>
              <Link href={`/menu/${courseSlug(course.id)}`}>このコースを見る<span aria-hidden="true">→</span></Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function CourseDetail({ course, courseIndex, previous, next }: { course: CompleteMenuCourse; courseIndex: number; previous: CompleteMenuCourse; next: CompleteMenuCourse }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const introTimerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const [locked, setLocked] = useState(false);
  const dish = course.dishes[activeIndex];

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.dataset.motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "ready";
    root.dataset.intro = "true";
    frameRef.current = window.requestAnimationFrame(() => {
      root.dataset.entered = "true";
      introTimerRef.current = window.setTimeout(() => { delete root.dataset.intro; }, 1000);
    });
    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      if (introTimerRef.current !== null) window.clearTimeout(introTimerRef.current);
    };
  }, []);

  useEffect(() => {
    [activeIndex - 1, activeIndex + 1].filter((index) => index >= 0 && index < course.dishes.length).forEach((index) => {
      const preload = new Image();
      preload.src = course.dishes[index].imageSrc;
    });
  }, [activeIndex, course.dishes]);

  const changeDish = useCallback(async (nextIndex: number) => {
    if (locked || nextIndex === activeIndex || nextIndex < 0 || nextIndex >= course.dishes.length) return;
    setLocked(true);
    const preload = new Image();
    preload.src = course.dishes[nextIndex].imageSrc;
    try {
      await preload.decode();
    } catch {
      setLocked(false);
      return;
    }
    const nextDirection = nextIndex > activeIndex ? "next" : "previous";
    setDirection(nextDirection);
    setPhase("out");
    timerRef.current = window.setTimeout(() => {
      setActiveIndex(nextIndex);
      setPhase("in");
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = window.requestAnimationFrame(() => {
          setPhase("idle");
          timerRef.current = window.setTimeout(() => setLocked(false), 480);
        });
      });
    }, 220);
  }, [activeIndex, course.dishes, locked]);

  const move = (step: -1 | 1) => changeDish(activeIndex + step);
  const accent = ["yoi", "akari", "kagari", "homura", "special"][courseIndex];
  return (
    <div className="course-detail-page" data-accent={accent} ref={rootRef}>
      <header className="course-detail-header" id="menu-content">
        <Link className="course-back-link" href="/menu"><span aria-hidden="true">←</span> お品書きへ戻る</Link>
        <p className="course-intro-number">COURSE {String(courseIndex + 1).padStart(2, "0")}</p>
        <div className="course-intro-title-mask"><h1>{course.name}</h1></div>
        <div className="course-intro-meta"><p>{course.description}</p><p>全10皿</p><strong>{course.price.toLocaleString("ja-JP")}円</strong><Link href="/#reservation">席を予約する<span aria-hidden="true">→</span></Link></div>
      </header>

      <section className="dish-viewer" aria-label={`${course.name}コースの料理`} data-phase={phase} data-direction={direction} tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
          if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
        }}
        onPointerDown={(event) => { if (event.pointerType !== "mouse") pointerStart.current = { x: event.clientX, y: event.clientY }; }}
        onPointerUp={(event) => {
          const start = pointerStart.current;
          pointerStart.current = null;
          if (!start || event.pointerType === "mouse") return;
          const x = event.clientX - start.x;
          const y = event.clientY - start.y;
          if (Math.abs(x) > 48 && Math.abs(x) > Math.abs(y) * 1.25) move(x < 0 ? 1 : -1);
        }}>
        <CoursePicture dish={dish} eager className="dish-viewer-image" />
        <div className="dish-viewer-copy" aria-live="polite" aria-atomic="true">
          <p className="course-detail-number"><span>{String(activeIndex + 1).padStart(2, "0")}</span> / 10</p>
          <p className="course-detail-chapter">{dish.chapter}</p>
          <h2>{dish.title}</h2>
          {dish.description && <p className="course-detail-description">{dish.description}</p>}
          {(dish.origin || dish.details.length > 0) && <dl>{dish.origin && <div><dt>産地</dt><dd>{dish.origin}</dd></div>}{dish.details.map((detail) => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl>}
          <div className="dish-viewer-controls">
            <button type="button" aria-label="前の料理を表示" disabled={activeIndex === 0 || locked} onClick={() => move(-1)}>← 前の料理</button>
            <button type="button" aria-label="次の料理を表示" disabled={activeIndex === 9 || locked} onClick={() => move(1)}>次の料理 →</button>
          </div>
        </div>
        <nav className="dish-progress" aria-label="料理を選択">
          {course.dishes.map((item, index) => <button type="button" aria-label={`${index + 1}皿目 ${item.title}を表示`} aria-current={index === activeIndex ? "step" : undefined} disabled={locked} onClick={() => changeDish(index)} key={item.imageSrc}><span>{String(index + 1).padStart(2, "0")}</span></button>)}
        </nav>
      </section>

      <noscript><ol className="course-noscript-list">{course.dishes.map((item, index) => <li key={item.imageSrc}><strong>{String(index + 1).padStart(2, "0")} / 10　{item.chapter}　{item.title}</strong>{item.description && <p>{item.description}</p>}</li>)}</ol></noscript>

      <div className="course-detail-footer">
        <p>現在のコース　<strong>{course.name}</strong></p>
        <nav aria-label="コース間の移動">
          <Link href={`/menu/${courseSlug(previous.id)}`}><span aria-hidden="true">←</span> {previous.name}</Link>
          <Link href="/menu">お品書き一覧へ</Link>
          <Link href={`/menu/${courseSlug(next.id)}`}>{next.name} <span aria-hidden="true">→</span></Link>
        </nav>
        <Link className="course-reserve-link" href="/#reservation">このコースで席を予約する<span aria-hidden="true">→</span></Link>
      </div>
    </div>
  );
}

function CoursePicture({ dish, eager = false, className }: { dish: MenuDish; eager?: boolean; className: string }) {
  const existing = dish.imageSrc.startsWith("/images/course/");
  return <picture className={className}><img src={dish.imageSrc} alt={dish.alt} width={existing ? 1672 : 1440} height={existing ? 941 : 960} loading={eager ? "eager" : "lazy"} decoding="async" /></picture>;
}
