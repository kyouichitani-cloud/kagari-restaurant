import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const page = read("app/page.tsx");
const styles = read("app/globals.css");
const form = read("components/FrenchReservationForm.tsx");
const navigation = read("components/KineticNavigation.tsx");
const hero = read("components/ScrollExpansionHero.tsx");
const coursesPage = read("app/courses/page.tsx");
const courseDetailPage = read("app/courses/[slug]/page.tsx");
const content = read("content/french-restaurant.ts");
const packageJson = JSON.parse(read("package.json"));
const sources = [page, styles, form, navigation, hero, coursesPage, courseDetailPage, content].join("\n");

const expectedCourses = [
  ["季節のフレンチコース", "5000"],
  ["彩りフレンチコース", "7500"],
  ["シェフ特選フレンチコース", "10000"],
];
for (const [name, price] of expectedCourses) {
  if (!content.includes(`name: "${name}"`) || !content.includes(`price: ${price}`)) {
    throw new Error(`Course data is missing or incorrect: ${name}`);
  }
}

for (const image of ["hero", "fish", "anniversary", "beef", "wine"]) {
  const path = `public/images/french/${image}.avif`;
  if (!existsSync(new URL(path, root))) throw new Error(`Missing optimized image: ${path}`);
}

for (const dependency of ["next", "typescript", "tailwindcss", "framer-motion", "gsap", "@radix-ui/react-slot"]) {
  if (!packageJson.dependencies?.[dependency] && !packageJson.devDependencies?.[dependency]) {
    throw new Error(`Missing dependency: ${dependency}`);
  }
}

for (const required of [
  "prefers-reduced-motion: reduce",
  "aria-expanded={open}",
  "aria-controls=\"site-navigation\"",
  "aria-modal=\"true\"",
  "event.key === \"Escape\"",
  "document.body.style.overflow = \"hidden\"",
  "記念日ケーキをご希望ですか？",
  "入力内容の確認",
  "実際の予約は送信されていません",
  "CustomEase",
  "ScrollTrigger",
  "getCourseReservationHref",
  "generateStaticParams",
  "notFound()",
  "お一人様・税込",
]) {
  if (!sources.includes(required)) throw new Error(`Required behavior or copy is missing: ${required}`);
}

for (const banned of [/transition:\s*all/, /scale\(0\)/, /Lorem Ipsum/i, /TODO/]) {
  if (banned.test(sources)) throw new Error(`Banned pattern found: ${banned}`);
}

console.log("Production verification passed: course data, local images, stack, form states, navigation accessibility, and motion guards.");
