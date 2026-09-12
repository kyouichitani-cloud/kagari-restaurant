"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Course } from "@/content/restaurant";
import { reservationCourses } from "@/content/reservation";

export function MenuCourses({ dishes }: { dishes: Course[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = Array.from(rootRef.current?.querySelectorAll<HTMLElement>(".menu-course") ?? []);
    if (!sections.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.visible = "true";
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12%", threshold: 0.08 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef}>
      <header className="menu-page-header" id="menu-content">
        <p>お品書き</p>
        <h1>五つのコース</h1>
        <p>季節とお席の時間に合わせて、仕立てをお選びください。</p>
        <nav aria-label="コース目次">
          {reservationCourses.map((course) => <a href={`#course-${course.id}`} key={course.id}><span>{course.name}</span><small>{course.price.toLocaleString("ja-JP")}円</small></a>)}
        </nav>
      </header>

      <div className="menu-course-list">
        {reservationCourses.map((course, courseIndex) => {
          const included = dishes.slice(courseIndex * 2, courseIndex * 2 + 2);
          return (
            <section className="menu-course" id={`course-${course.id}`} aria-labelledby={`course-${course.id}-title`} key={course.id}>
              <header className="menu-course-copy">
                <p>COURSE {String(courseIndex + 1).padStart(2, "0")}</p>
                <div><h2 id={`course-${course.id}-title`}>{course.name}</h2><strong>{course.price.toLocaleString("ja-JP")}円</strong></div>
                <p>{course.description}</p>
              </header>
              <div className="menu-course-dishes">
                {included.map((dish, dishIndex) => <article className={dishIndex === 0 ? "menu-course-main" : undefined} key={dish.id ?? dish.image}>
                  <CoursePicture dish={dish} eager={courseIndex === 0} />
                  <div className="menu-course-dish-copy">
                    <p><span>{String(courseIndex * 2 + dishIndex + 1).padStart(2, "0")}</span>{dish.chapter}</p>
                    <h3>{dish.title}</h3>
                    <p>{dish.description}</p>
                    <dl><div><dt>産地</dt><dd>{dish.origin}</dd></div>{dish.details.map((detail) => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl>
                  </div>
                </article>)}
              </div>
            </section>
          );
        })}
      </div>
      <div className="menu-reserve"><Link href="/#reservation">席を予約する</Link></div>
    </div>
  );
}

function CoursePicture({ dish, eager }: { dish: Course; eager: boolean }) {
  return <picture><source media="(max-width: 767px)" srcSet={`/images/course/portrait/${dish.image}.avif`} type="image/avif" /><source media="(max-width: 1023px)" srcSet={`/images/course/square/${dish.image}.avif`} type="image/avif" /><source srcSet={`/images/course/avif/${dish.image}.avif`} type="image/avif" /><source srcSet={`/images/course/webp/${dish.image}.webp`} type="image/webp" /><img src={`/images/course/${dish.image}.png`} alt={`${dish.chapter}「${dish.title}」`} width="1672" height="941" loading={eager ? "eager" : "lazy"} /></picture>;
}
