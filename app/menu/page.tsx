import type { Metadata } from "next";
import { BackToTop } from "@/components/BackToTop";
import { GlobalMotion } from "@/components/GlobalMotion";
import { MenuCourses } from "@/components/MenuCourses";
import { Navigation } from "@/components/Navigation";
import { getRestaurantContent } from "@/content/microcms";
import { getCompleteMenu } from "@/content/menu";

export const metadata: Metadata = { title: "お品書き | 篝 KAGARI" };

export default async function MenuPage() {
  const { restaurant } = await getRestaurantContent();
  return <main id="top" className="menu-page"><a className="skip-link" href="#menu-content">本文へ移動</a><div id="top-sentinel" aria-hidden="true" /><Navigation navigation={restaurant.navigation} brand={restaurant.brand} details={restaurant.details} /><GlobalMotion /><MenuCourses courses={getCompleteMenu(restaurant.courses)} /><BackToTop /></main>;
}
