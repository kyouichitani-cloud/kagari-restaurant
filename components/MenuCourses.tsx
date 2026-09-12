import type { Course } from "@/content/restaurant";
import { reservationCourses } from "@/content/reservation";
import Link from "next/link";

export function MenuCourses({ dishes }: { dishes: Course[] }) {
  return (
    <>
      <section className="menu-plans" aria-labelledby="menu-plans-title">
        <header><p>お品書き</p><h1 id="menu-plans-title">五つのコース</h1><p>季節とお席の時間に合わせて、仕立てをお選びください。</p></header>
        <ol>{reservationCourses.map((course) => <li key={course.id}><div><h2>{course.name}</h2><p>{course.description}</p></div><strong>{course.price.toLocaleString("ja-JP")}円</strong></li>)}</ol>
      </section>
      <section className="menu-dishes" aria-labelledby="menu-dishes-title">
        <header><p>篝　三十三千円</p><h2 id="menu-dishes-title">十皿のおまかせ</h2></header>
        <div className="menu-dish-list">{dishes.map((dish, index) => <article key={dish.id ?? dish.image}>
          <picture><source media="(max-width: 767px)" srcSet={`/images/course/portrait/${dish.image}.avif`} type="image/avif" /><source media="(max-width: 1023px)" srcSet={`/images/course/square/${dish.image}.avif`} type="image/avif" /><source srcSet={`/images/course/avif/${dish.image}.avif`} type="image/avif" /><source srcSet={`/images/course/webp/${dish.image}.webp`} type="image/webp" /><img src={`/images/course/${dish.image}.png`} alt={`${dish.chapter}「${dish.title}」`} width="1672" height="941" loading={index < 2 ? "eager" : "lazy"} /></picture>
          <div><p className="menu-dish-number">{String(index + 1).padStart(2, "0")}　{dish.chapter}</p><h3>{dish.title}</h3><p>{dish.description}</p><dl><div><dt>産地</dt><dd>{dish.origin}</dd></div>{dish.details.map((detail) => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl></div>
        </article>)}</div>
      </section>
      <div className="menu-reserve"><Link href="/#reservation">席を予約する</Link></div>
    </>
  );
}
