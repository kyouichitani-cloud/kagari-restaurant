"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { CompleteMenuCourse, MenuDish } from "@/content/menu";

export function MenuCourses({ courses }: { courses: CompleteMenuCourse[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const revealItems = Array.from(rootRef.current?.querySelectorAll<HTMLElement>(".menu-course-copy, .menu-course-dishes article") ?? []);
    if (!revealItems.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.visible = "true";
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12%", threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef}>
      <header className="menu-page-header" id="menu-content">
        <p>お品書き</p>
        <h1>五つのコース</h1>
        <p>季節とお席の時間に合わせて、仕立てをお選びください。</p>
        <nav aria-label="コース目次">
          {courses.map((course) => <a href={`#course-${course.id}`} key={course.id}><span>{course.name}</span><small>{course.price.toLocaleString("ja-JP")}円</small></a>)}
        </nav>
      </header>

      <div className="menu-course-list">
        {courses.map((course, courseIndex) => (
            <section className="menu-course" id={`course-${course.id}`} aria-labelledby={`course-${course.id}-title`} key={course.id}>
              <header className="menu-course-copy">
                <p>COURSE {String(courseIndex + 1).padStart(2, "0")}</p>
                <div><h2 id={`course-${course.id}-title`}>{course.name}</h2><strong>{course.price.toLocaleString("ja-JP")}円</strong></div>
                <p>{course.description}</p>
              </header>
              <div className="menu-course-dishes">
                {course.dishes.map((dish, dishIndex) => <article className={dishIndex === 0 ? "menu-course-main" : undefined} key={dish.imageSrc}>
                  <CoursePicture dish={dish} eager={courseIndex === 0} />
                  <div className="menu-course-dish-copy">
                    <p><span>{String(dishIndex + 1).padStart(2, "0")}</span>{dish.chapter}</p>
                    <h3>{dish.title}</h3>
                    {dish.description && <p>{dish.description}</p>}
                    {(dish.origin || dish.details.length > 0) && <dl>{dish.origin && <div><dt>産地</dt><dd>{dish.origin}</dd></div>}{dish.details.map((detail) => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl>}
                  </div>
                </article>)}
              </div>
            </section>
        ))}
      </div>
      <div className="menu-reserve"><Link href="/#reservation">席を予約する</Link></div>
    </div>
  );
}

function CoursePicture({ dish, eager }: { dish: MenuDish; eager: boolean }) {
  const existing = dish.imageSrc.startsWith("/images/course/");
  return <picture><img src={dish.imageSrc} alt={dish.alt} width={existing ? 1672 : 1440} height={existing ? 941 : 960} loading={eager ? "eager" : "lazy"} /></picture>;
}
