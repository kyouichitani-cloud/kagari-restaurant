import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackToTop } from "@/components/BackToTop";
import { CourseDetail } from "@/components/MenuCourses";
import { GlobalMotion } from "@/components/GlobalMotion";
import { Navigation } from "@/components/Navigation";
import { courseSlug, getCompleteMenu } from "@/content/menu";
import { getRestaurantContent } from "@/content/microcms";

const slugs = ["yoi", "akari", "kagari", "homura", "special"];

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { restaurant } = await getRestaurantContent();
  const course = getCompleteMenu(restaurant.courses).find((item) => courseSlug(item.id) === slug);
  return course ? { title: `${course.name} | お品書き | 篝 KAGARI`, description: course.description } : {};
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { restaurant } = await getRestaurantContent();
  const courses = getCompleteMenu(restaurant.courses);
  const index = courses.findIndex((course) => courseSlug(course.id) === slug);
  if (index < 0) notFound();
  const course = courses[index];
  const previous = courses[(index - 1 + courses.length) % courses.length];
  const next = courses[(index + 1) % courses.length];
  return <main id="top" className="menu-page"><a className="skip-link" href="#menu-content">本文へ移動</a><div id="top-sentinel" aria-hidden="true" /><Navigation navigation={restaurant.navigation} brand={restaurant.brand} details={restaurant.details} /><GlobalMotion /><CourseDetail course={course} courseIndex={index} previous={previous} next={next} /><BackToTop /></main>;
}
