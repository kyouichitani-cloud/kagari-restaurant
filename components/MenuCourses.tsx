"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
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
              <h2>{course.name}</h2>
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
  const rootRef = useMenuReveal();
  return (
    <div className="course-detail-page" ref={rootRef}>
      <header className="course-detail-header" id="menu-content">
        <Link className="course-back-link" href="/menu"><span aria-hidden="true">←</span> お品書きへ戻る</Link>
        <p>COURSE {String(courseIndex + 1).padStart(2, "0")}</p>
        <h1>{course.name}</h1>
        <div><p>{course.description}</p><p>全10皿</p><strong>{course.price.toLocaleString("ja-JP")}円</strong></div>
      </header>

      <div className="course-detail-dishes">
        {course.dishes.map((dish, index) => (
          <article className="course-detail-dish" data-menu-reveal key={dish.imageSrc}>
            <div className="course-detail-copy">
              <p className="course-detail-number"><span>{String(index + 1).padStart(2, "0")}</span> / 10</p>
              <p className="course-detail-chapter">{dish.chapter}</p>
              <h2>{dish.title}</h2>
              {dish.description && <p className="course-detail-description">{dish.description}</p>}
              {(dish.origin || dish.details.length > 0) && <dl>{dish.origin && <div><dt>産地</dt><dd>{dish.origin}</dd></div>}{dish.details.map((detail) => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl>}
            </div>
            <CoursePicture dish={dish} eager={index < 2} className="course-detail-image" />
          </article>
        ))}
      </div>

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

function CoursePicture({ dish, eager, className }: { dish: MenuDish; eager: boolean; className: string }) {
  const existing = dish.imageSrc.startsWith("/images/course/");
  return <picture className={className}><img src={dish.imageSrc} alt={dish.alt} width={existing ? 1672 : 1440} height={existing ? 941 : 960} loading={eager ? "eager" : "lazy"} decoding="async" /></picture>;
}
