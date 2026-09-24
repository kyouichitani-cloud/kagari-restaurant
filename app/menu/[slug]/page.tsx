import { notFound, redirect } from "next/navigation";

const slugs = ["yoi", "akari", "kagari", "homura", "special"];

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugs.includes(slug)) notFound();
  redirect("/courses");
}
