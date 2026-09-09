import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const content = read("content/restaurant.ts");
const courseImages = [...content.matchAll(/image: "([^"]+)"/g)].map((match) => match[1]);
const origins = [...content.matchAll(/origin: "([^"]+)"/g)].map((match) => match[1]);
if (courseImages.length !== 10 || new Set(courseImages).size !== 10) throw new Error("Ten unique course records are required.");
if (origins.length !== 10 || new Set(origins).size !== 10) throw new Error("Ten unique origins are required.");
for (const image of courseImages) for (const path of [`public/images/course/avif/${image}.avif`, `public/images/course/portrait/${image}.avif`, `public/images/course/square/${image}.avif`]) if (!existsSync(new URL(path, root))) throw new Error(`Missing asset: ${path}`);
const sourcePaths = ["app/page.tsx", "app/globals.css", "content/reservation.ts", "content/site.ts", ...["BackToTop", "CourseExperience", "Entrance", "GlobalMotion", "KagariHero", "Navigation", "ReservationForm"].map((name) => `components/${name}.tsx`)];
const sources = sourcePaths.map(read).join("\n");
for (const banned of [/transition:\s*all/, /ease-in\b/, /scale\(0\)/, /Lorem Ipsum/i, /TODO/, /\u672a\u78ba\u5b9a|\u6e96\u5099\u4e2d|\u9078\u5b9a\u4e2d|\u30c7\u30e2/]) if (banned.test(sources + content)) throw new Error(`Banned pattern found: ${banned}`);
for (const required of ["viewportFit", "application/ld+json", "prefers-reduced-motion:reduce", "aria-current", "aria-modal=\"true\""]) if (!sources.includes(required) && !read("app/layout.tsx").includes(required)) throw new Error(`Required production behavior missing: ${required}`);
for (const forbiddenSlot of ["18:30", "19:00", "19:30", "20:00"]) if (sources.includes(forbiddenSlot)) throw new Error(`Unsupported reservation slot found: ${forbiddenSlot}`);
for (const slot of ["18:00", "20:45"]) if (!read("content/reservation.ts").includes(slot)) throw new Error(`Reservation slot missing: ${slot}`);
console.log("Production verification passed: content, responsive assets, metadata, accessibility and motion guards.");
