"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import type { CompleteMenuCourse, MenuDish } from "@/content/menu";
import { courseSlug } from "@/content/menu";

const pad = (value: number) => String(value).padStart(2, "0");

export function MenuCourses({ courses }: { courses: CompleteMenuCourse[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeCourse, setActiveCourse] = useState(0);
  const [activeDishes, setActiveDishes] = useState<Record<string, number>>(() => Object.fromEntries(courses.map((course) => [course.id, 0])));

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.dataset.motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "ready";
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.visible = "true";
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    root.querySelectorAll<HTMLElement>(".menu-axis-course").forEach((section) => revealObserver.observe(section));
    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const courseObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const index = Number((visible.target as HTMLElement).dataset.courseIndex);
      if (!Number.isFinite(index)) return;
      setActiveCourse((current) => current === index ? current : index);
    }, { rootMargin: "-28% 0px -58%", threshold: 0 });
    root.querySelectorAll<HTMLElement>(".menu-axis-course").forEach((section) => courseObserver.observe(section));

    const dishObservers = Array.from(root.querySelectorAll<HTMLElement>(".dish-carousel")).map((carousel) => {
      const courseId = carousel.dataset.courseId ?? "";
      const observer = new IntersectionObserver((entries) => {
        const centered = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!centered) return;
        const index = Number((centered.target as HTMLElement).dataset.dishIndex);
        setActiveDishes((current) => current[courseId] === index ? current : { ...current, [courseId]: index });
      }, { root: carousel, threshold: 0.6 });
      carousel.querySelectorAll<HTMLElement>(".dish-panel").forEach((panel) => observer.observe(panel));
      return observer;
    });
    return () => {
      courseObserver.disconnect();
      dishObservers.forEach((observer) => observer.disconnect());
    };
  }, [courses]);

  const goToDish = (courseId: string, index: number) => {
    const root = rootRef.current;
    const carousel = root?.querySelector<HTMLElement>(`.dish-carousel[data-course-id="${courseId}"]`);
    const panel = carousel?.querySelector<HTMLElement>(`.dish-panel[data-dish-index="${index}"]`);
    if (!carousel || !panel) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    carousel.scrollTo({ left: panel.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
    panel.focus({ preventScroll: true });
  };

  const closeCoursePicker = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.closest("details")?.removeAttribute("open");
  };

  return (
    <div className="menu-axis-page" ref={rootRef}>
      <header className="menu-axis-header" id="menu-content" tabIndex={-1}>
        <p>お品書き</p>
        <h1>五つのコース</h1>
        <p>下へコースを巡り、横へ一皿ずつご覧ください。</p>
        <nav aria-label="五つのコース">
          {courses.map((course, index) => <a href={`#${courseSlug(course.id)}`} aria-current={index === activeCourse ? "location" : undefined} key={course.id}><span>{pad(index + 1)}</span>{course.name}</a>)}
        </nav>
      </header>

      <details className="menu-mobile-course-picker">
        <summary><span>{pad(activeCourse + 1)} / 05</span>{courses[activeCourse].name}<i className="course-picker-chevron" aria-hidden="true" /></summary>
        <nav aria-label="コースを選択">{courses.map((course, index) => <a href={`#${courseSlug(course.id)}`} aria-current={index === activeCourse ? "location" : undefined} onClick={closeCoursePicker} key={course.id}><span>{pad(index + 1)}</span>{course.name}</a>)}</nav>
      </details>

      <aside className="menu-desktop-course-nav" aria-label="現在のコース">
        {courses.map((course, index) => <a href={`#${courseSlug(course.id)}`} aria-current={index === activeCourse ? "location" : undefined} key={course.id}><span>{pad(index + 1)}</span>{course.name}</a>)}
      </aside>

      <div className="menu-axis-courses">
        {courses.map((course, courseIndex) => {
          const currentDish = activeDishes[course.id] ?? 0;
          return (
            <section className="menu-axis-course" id={courseSlug(course.id)} data-course-index={courseIndex} aria-labelledby={`${course.id}-title`} key={course.id}>
              <header className="menu-axis-course-header">
                <p>コース {pad(courseIndex + 1)} / 05</p>
                <div className="menu-axis-title-mask"><h2 id={`${course.id}-title`}>{course.name}</h2></div>
                <p>{course.description}</p>
                <div><span>全10皿</span><strong>{course.price.toLocaleString("ja-JP")}円</strong></div>
                {courseIndex === 0 && <div className="menu-axis-guide"><p>横にスワイプして料理を見る</p><p>下にスクロールして次のコースへ</p></div>}
              </header>

              <div className="dish-carousel" data-course-id={course.id} aria-label={`${course.name}コース、全10皿。横へスクロールして料理を選択`} tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") { event.preventDefault(); goToDish(course.id, Math.max(0, currentDish - 1)); }
                  if (event.key === "ArrowRight") { event.preventDefault(); goToDish(course.id, Math.min(course.dishes.length - 1, currentDish + 1)); }
                }}>
                <div className="dish-carousel-track">
                  {course.dishes.map((dish, dishIndex) => (
                    <article className="dish-panel" data-dish-index={dishIndex} data-active={dishIndex === currentDish ? "true" : "false"} aria-current={dishIndex === currentDish ? "step" : undefined} tabIndex={-1} key={dish.imageSrc}>
                      <div className="dish-panel-frame">
                        <CoursePicture dish={dish} priority={courseIndex === 0 && dishIndex === 0} />
                        <div className="dish-panel-copy">
                          <p className="dish-panel-number"><span>{pad(dishIndex + 1)}</span> / 10</p>
                          <p className="dish-panel-chapter">{dish.chapter}</p>
                          <h3>{dish.title}</h3>
                          {dish.description && <p className="dish-panel-description">{dish.description}</p>}
                        </div>
                      </div>
                      {(dish.origin || dish.details.length > 0) && <dl className="dish-panel-details">{dish.origin && <div><dt>産地</dt><dd>{dish.origin}</dd></div>}{dish.details.map((detail) => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl>}
                    </article>
                  ))}
                </div>
              </div>

              <nav className="dish-axis-progress" aria-label={`${course.name}コースの料理を選択`}>
                <p><span>{pad(currentDish + 1)}</span> / 10</p>
                <div>{course.dishes.map((dish, dishIndex) => <button type="button" aria-label={`${dishIndex + 1}皿目 ${dish.title}を表示`} aria-current={dishIndex === currentDish ? "step" : undefined} onClick={() => goToDish(course.id, dishIndex)} key={dish.imageSrc}><span>{pad(dishIndex + 1)}</span></button>)}</div>
              </nav>
            </section>
          );
        })}
      </div>
      <div className="menu-axis-footer"><Link href="/#reservation">席を予約する<span aria-hidden="true">→</span></Link></div>
    </div>
  );
}

function CoursePicture({ dish, priority }: { dish: MenuDish; priority: boolean }) {
  const existing = dish.imageSrc.includes("/images/course/");
  return (
    <picture className="dish-panel-image">
      <Image
        src={dish.imageSrc}
        alt={dish.alt}
        width={existing ? 1672 : 1440}
        height={existing ? 941 : 960}
        sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 959px) calc(100vw - 96px), (max-width: 1279px) 900px, (max-width: 1666px) 72vw, 1200px"
        priority={priority}
      />
    </picture>
  );
}
