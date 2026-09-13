"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { CompleteMenuCourse, MenuDish } from "@/content/menu";

const pad = (value: number) => String(value).padStart(2, "0");
const anchorFor = (courseId: string) => courseId === "honoo" ? "homura" : courseId;

export function MenuCourses({ courses }: { courses: CompleteMenuCourse[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.dataset.motion = reduceMotion ? "reduced" : "ready";

    const revealItems = Array.from(root.querySelectorAll<HTMLElement>(".menu-course-copy, .menu-course-dish"));
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.visible = "true";
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10%", threshold: 0.08 });
    revealItems.forEach((item) => revealObserver.observe(item));

    const activationTokens = new WeakMap<HTMLElement, number>();
    const activateDish = async (dish: HTMLElement) => {
      const story = dish.closest<HTMLElement>(".menu-course-story");
      if (!story) return;
      const index = Number(dish.dataset.index ?? 0);
      if (story.dataset.active === String(index)) return;
      const image = story.querySelector<HTMLImageElement>(`.menu-course-image[data-index="${index}"] img`);
      if (!image) return;
      const token = (activationTokens.get(story) ?? 0) + 1;
      activationTokens.set(story, token);
      image.loading = "eager";
      const nextImage = story.querySelector<HTMLImageElement>(`.menu-course-image[data-index="${Math.min(index + 1, 9)}"] img`);
      if (nextImage) nextImage.loading = "eager";
      try {
        if (!image.complete || image.naturalWidth === 0) await image.decode();
      } catch {
        return;
      }
      if (token !== activationTokens.get(story)) return;
      story.dataset.active = String(index);
      story.querySelectorAll<HTMLElement>(".menu-course-image").forEach((item) => {
        item.dataset.active = item.dataset.index === String(index) ? "true" : "false";
      });
      story.querySelectorAll<HTMLElement>(".menu-course-dish").forEach((item) => {
        if (item.dataset.index === String(index)) item.setAttribute("aria-current", "step");
        else item.removeAttribute("aria-current");
      });
      const current = story.querySelector<HTMLElement>(".menu-course-current");
      const progress = story.querySelector<HTMLElement>(".menu-course-progress span");
      if (current) current.textContent = pad(index + 1);
      if (progress) progress.style.transform = `scaleY(${(index + 1) / 10})`;
    };

    const dishObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) void activateDish(entry.target as HTMLElement);
      });
    }, { rootMargin: "-42% 0px -42%", threshold: 0 });
    root.querySelectorAll<HTMLElement>(".menu-course-dish").forEach((dish) => dishObserver.observe(dish));

    return () => {
      revealObserver.disconnect();
      dishObserver.disconnect();
      delete root.dataset.motion;
    };
  }, []);

  const showPreview = (index: number) => {
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>(".menu-index-preview-item").forEach((item) => {
      item.dataset.active = item.dataset.index === String(index) ? "true" : "false";
    });
  };

  return (
    <div className="menu-content" ref={rootRef}>
      <header className="menu-page-header" id="menu-content">
        <div className="menu-page-title">
          <p>お品書き</p>
          <h1>五つのコース</h1>
          <p>季節とお席の時間に合わせて、仕立てをお選びください。</p>
        </div>
        <div className="menu-index">
          <nav aria-label="コース一覧">
            {courses.map((course, index) => (
              <a href={`#${anchorFor(course.id)}`} key={course.id} onPointerEnter={() => showPreview(index)} onFocus={() => showPreview(index)}>
                <CoursePicture dish={course.dishes[0]} eager={index === 0} className="menu-index-mobile-image" />
                <span className="menu-index-number">{pad(index + 1)}</span>
                <strong>{course.name}</strong>
                <small>全10皿</small>
                <span className="menu-index-action">コースを見る <b aria-hidden="true">→</b></span>
              </a>
            ))}
          </nav>
          <div className="menu-index-preview" aria-hidden="true">
            {courses.map((course, index) => (
              <CoursePicture dish={course.dishes[0]} eager={index === 0} className="menu-index-preview-item" dataIndex={index} active={index === 0} key={course.id} />
            ))}
          </div>
        </div>
      </header>

      <div className="menu-course-list">
        {courses.map((course, courseIndex) => (
          <section className="menu-course" id={anchorFor(course.id)} aria-labelledby={`${course.id}-title`} key={course.id}>
            <header className="menu-course-copy">
              <p className="menu-course-number">COURSE {pad(courseIndex + 1)}</p>
              <div className="menu-course-heading">
                <div className="menu-course-title-mask"><h2 id={`${course.id}-title`}>{course.name}</h2></div>
                <strong>{course.price.toLocaleString("ja-JP")}円</strong>
              </div>
              <p className="menu-course-description">{course.description}</p>
              <p className="menu-course-count">全10皿</p>
            </header>

            <div className="menu-course-story" data-active="0">
              <div className="menu-course-visual">
                <div className="menu-course-image-stack">
                  {course.dishes.map((dish, dishIndex) => (
                    <CoursePicture dish={dish} eager={courseIndex === 0 && dishIndex < 2} className="menu-course-image" dataIndex={dishIndex} active={dishIndex === 0} key={dish.imageSrc} />
                  ))}
                </div>
                <div className="menu-course-status" aria-hidden="true">
                  <span><b className="menu-course-current">01</b> / 10</span>
                  <i className="menu-course-progress"><span /></i>
                </div>
              </div>

              <div className="menu-course-dishes">
                {course.dishes.map((dish, dishIndex) => (
                  <article className="menu-course-dish" data-index={dishIndex} aria-current={dishIndex === 0 ? "step" : undefined} key={dish.imageSrc}>
                    <CoursePicture dish={dish} eager={courseIndex === 0 && dishIndex < 2} className="menu-course-mobile-image" />
                    <div className="menu-course-dish-copy">
                      <p><span>{pad(dishIndex + 1)}</span>{dish.chapter}</p>
                      <h3>{dish.title}</h3>
                      {dish.description && <p>{dish.description}</p>}
                      {(dish.origin || dish.details.length > 0) && <dl>{dish.origin && <div><dt>産地</dt><dd>{dish.origin}</dd></div>}{dish.details.map((detail) => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl>}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
      <div className="menu-reserve"><Link href="/#reservation">席を予約する</Link></div>
    </div>
  );
}

function CoursePicture({ dish, eager, className, dataIndex, active }: { dish: MenuDish; eager: boolean; className: string; dataIndex?: number; active?: boolean }) {
  const existing = dish.imageSrc.startsWith("/images/course/");
  return <picture className={className} data-index={dataIndex} data-active={active ? "true" : "false"}><img src={dish.imageSrc} alt={dish.alt} width={existing ? 1672 : 1440} height={existing ? 941 : 960} loading={eager ? "eager" : "lazy"} decoding="async" /></picture>;
}
