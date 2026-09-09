"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Course, RestaurantContent } from "@/content/restaurant";
import { scrollPageTo } from "@/components/pageScroll";

const defaultWeights = [0.65, 0.85, 1, 1, 1.4, 1.45, 1.6, 1.05, 0.65, 0.35];
const groupTitles = ["序盤", "火の章", "締め"];
type TriggerHandle = { start: number; end: number; kill: () => void };

function indexForProgress(progress: number, boundaries: number[], count: number) {
  if (progress >= 1) return count - 1;
  const boundary = boundaries.findIndex((end, index) => index > 0 && progress < end);
  return Math.max(0, boundary - 1);
}

function createGroups(count: number) {
  const points = [0, Math.max(1, Math.round(count * 0.3)), Math.max(2, Math.round(count * 0.7)), count];
  return groupTitles.map((title, index) => ({ title, range: [points[index], points[index + 1]] as const })).filter((group) => group.range[1] > group.range[0]);
}

export function CourseExperience({ courses, section }: { courses: Course[]; section: RestaurantContent["courseSection"] }) {
  const root = useRef<HTMLElement>(null);
  const meterRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<TriggerHandle | null>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const boundaries = useMemo(() => {
    const weights = courses.map((_, index) => defaultWeights[index] ?? 1);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    return weights.reduce<number[]>((values, weight) => [...values, values.at(-1)! + weight / totalWeight], [0]);
  }, [courses]);
  const groups = useMemo(() => createGroups(courses.length), [courses.length]);
  const count = courses.length;
  useEffect(() => {
    let disposed = false;
    let revert: () => void = () => undefined;
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 1280px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const syncReduced = () => setReduced(reducedQuery.matches);
    syncReduced();
    reducedQuery.addEventListener("change", syncReduced);

    const enableDesktopCourse = async () => {
      if (!desktopQuery.matches) return;
      const [gsapModule, triggerModule] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed || !desktopQuery.matches) return;
      const gsap = gsapModule.default;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => `+=${window.innerHeight * (window.innerWidth < 1280 ? 4 : 5)}`,
        pin: ".course-stage",
        scrub: 0.55,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const next = indexForProgress(self.progress, boundaries, count);
          setActive((current) => current === next ? current : next);
          if (meterRef.current) meterRef.current.style.transform = `scaleX(${self.progress})`;
        },
      });
      triggerRef.current = trigger as TriggerHandle;
      revert = () => { trigger.kill(); triggerRef.current = null; };
    };
    const syncDesktopCourse = () => { revert(); revert = () => undefined; void enableDesktopCourse(); };
    desktopQuery.addEventListener("change", syncDesktopCourse);
    void enableDesktopCourse();
    return () => {
      disposed = true;
      reducedQuery.removeEventListener("change", syncReduced);
      desktopQuery.removeEventListener("change", syncDesktopCourse);
      revert();
    };
  }, [boundaries, count]);

  function jumpTo(index: number) {
    const trigger = triggerRef.current;
    if (!trigger) {
      const plate = document.getElementById(`plate-${index + 1}`);
      if (plate) scrollPageTo(plate.getBoundingClientRect().top + window.scrollY);
      return;
    }
    const midpoint = (boundaries[index] + boundaries[index + 1]) / 2;
    scrollPageTo(trigger.start + (trigger.end - trigger.start) * midpoint);
  }

  return (
    <section className="course" id="course" ref={root} aria-labelledby="course-title" data-reduced={reduced} data-chapter={active}>
      <div className="course-stage">
        <div className="course-images" aria-hidden="true">
          {courses.map((course, index) => <CoursePicture className="course-image" active={index === active} course={course} alt="" key={course.id ?? `${course.image}-${index}`} />)}
        </div>
        <div className="course-scrim" />
        <div className="course-heading"><p>{section.eyebrow}</p><h2 id="course-title">{section.title}<span>{section.titleAccent}</span></h2></div>
        <div className="course-chapter" key={active} aria-hidden="true">
          <p className="course-count"><span>{String(active + 1).padStart(2, "0")}</span> / {String(count).padStart(2, "0")}</p>
          <p className="course-kicker">{courses[active].chapter}</p>
          <h3>{courses[active].title}</h3>
          <p className="course-description">{courses[active].description}</p>
          <dl><div><dt>産地</dt><dd>{courses[active].origin}</dd></div>{courses[active].details.map((detail) => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl>
        </div>
        <nav className="course-index" aria-label="コース料理の章へ移動">{courses.map((course, index) => <button type="button" key={course.id ?? `${course.chapter}-${index}`} aria-current={index === active ? "step" : undefined} data-active={index === active} onClick={() => jumpTo(index)}><span>{String(index + 1).padStart(2, "0")}</span>{course.chapter}</button>)}</nav>
        <div className="course-progress" aria-hidden="true"><i ref={meterRef} /></div>
        <ol className="sr-course-list">{courses.map((course, index) => <li key={course.id ?? `${course.image}-${index}`}><strong>{course.chapter}　{course.title}</strong><span>{course.description}</span><span>産地: {course.origin}</span>{course.details.map((detail) => <span key={detail.label}>{detail.label}: {detail.value}</span>)}</li>)}</ol>
      </div>

      <div className="course-tablet" aria-label={`コース料理 ${count}皿`}>{courses.map((course, index) => <Plate course={course} index={index} count={count} key={course.id ?? `${course.image}-${index}`} />)}</div>
      <div className="course-mobile" aria-label={`コース料理 ${count}皿`}>
        <header><h2>{section.title}<span>{section.titleAccent}</span></h2><p>{section.intro}</p></header>
        {groups.map((group, groupIndex) => <details className="course-group" open={groupIndex === 0} key={group.title}><summary><span>0{groupIndex + 1}</span><strong>{group.title}</strong><small>{group.range[1] - group.range[0]}皿</small></summary>{courses.slice(group.range[0], group.range[1]).map((course, offset) => <Plate course={course} index={group.range[0] + offset} count={count} key={course.id ?? `${course.image}-${offset}`} />)}</details>)}
      </div>
    </section>
  );
}

function Plate({ course, index, count }: { course: Course; index: number; count: number }) {
  return <article id={`plate-${index + 1}`} className={`mobile-plate mobile-plate-${index % 3}`}><CoursePicture course={course} alt={course.photo?.alt ?? `${course.chapter}「${course.title}」`} responsive /><div className="mobile-plate-copy"><p><span>{String(index + 1).padStart(2, "0")}</span> / {String(count).padStart(2, "0")}　{course.chapter}</p><h3>{course.title}</h3><p>{course.description}</p><dl><div><dt>産地</dt><dd>{course.origin}</dd></div>{course.details.map((detail) => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl></div></article>;
}

function imageUrl(url: string, width: number) {
  const target = new URL(url);
  target.searchParams.set("w", String(width));
  return target.toString();
}

function CoursePicture({ course, alt, className, active, responsive = false }: { course: Course; alt: string; className?: string; active?: boolean; responsive?: boolean }) {
  if (course.photo) {
    const width = course.photo.width ?? 1672;
    const height = course.photo.height ?? 941;
    return <picture className={className} data-active={active}><img src={imageUrl(course.photo.url, 1600)} srcSet={`${imageUrl(course.photo.url, 640)} 640w, ${imageUrl(course.photo.url, 1024)} 1024w, ${imageUrl(course.photo.url, 1600)} 1600w`} sizes={responsive ? "(max-width: 767px) 88vw, (max-width: 1279px) 50vw, 64vw" : "100vw"} alt={alt} width={width} height={height} loading="lazy" /></picture>;
  }
  return <picture className={className} data-active={active}>{responsive && <source media="(max-width: 767px)" srcSet={`/images/course/portrait/${course.image}.avif`} type="image/avif" />}<source media="(max-width: 1279px)" srcSet={`/images/course/square/${course.image}.avif`} type="image/avif" /><source srcSet={`/images/course/avif/${course.image}.avif`} type="image/avif" /><source srcSet={`/images/course/webp/${course.image}.webp`} type="image/webp" /><img src={`/images/course/${course.image}.png`} alt={alt} width="1672" height="941" loading="lazy" /></picture>;
}
