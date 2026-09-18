import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { KineticNavigation } from "@/components/KineticNavigation";
import { CourseName } from "@/components/CourseName";
import { RestaurantFooter } from "@/components/RestaurantFooter";
import { SectionReveal } from "@/components/SectionReveal";
import { Button } from "@/components/ui/button";
import { getCourseHref, getCourseReservationHref, siteContent } from "@/content/french-restaurant";

export const metadata: Metadata = {
  title: "KAGARI｜コース料理",
  description: "季節のフレンチコース、彩りフレンチコース、シェフ特選フレンチコースの内容と価格をご案内します。",
  alternates: { canonical: "/courses" },
};

export default function CoursesPage() {
  return (
    <main id="top" className="course-page">
      <a className="skip-link" href="#course-content">本文へ移動</a>
      <KineticNavigation />
      <section className="course-index-hero" aria-labelledby="courses-page-title">
        <div className="section-shell">
          <SectionReveal>
            <p className="section-kicker">コース料理</p>
            <h1 id="courses-page-title">今夜のために、<br />選べる三つのコース。</h1>
            <p>どのコースも、お一人様・税込の価格を分かりやすく掲載しています。料理構成は現在登録されている仮データです。</p>
          </SectionReveal>
        </div>
      </section>

      <section id="course-content" className="course-index-list" aria-label="コース一覧">
        {siteContent.courses.map((course, index) => (
          <article key={course.id} className={`course-index-row course-index-row-${index + 1}`}>
            <SectionReveal className="course-index-image" direction={index % 2 ? "right" : "left"}>
              <Image src={course.image} alt={course.alt} fill sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1023px) 74vw, 53vw" />
            </SectionReveal>
            <SectionReveal className="course-index-copy" delay={0.12}>
              <p className="course-index-number">0{index + 1}</p>
              <h2><CourseName name={course.name} /></h2>
              <p className="course-index-price"><span>お一人様・税込</span>{course.price.toLocaleString("ja-JP")}円</p>
              <p>{course.description}</p>
              <p className="course-index-scene">{course.scene}</p>
              <div className="course-actions">
                <Button asChild variant="quiet"><Link href={getCourseHref(course.id)}>詳しく見る</Link></Button>
                <Button asChild variant="outline"><Link href={getCourseReservationHref(course.id)}>このコースで予約する</Link></Button>
              </div>
            </SectionReveal>
          </article>
        ))}
      </section>

      <section className="course-index-cta" aria-labelledby="course-cta-title">
        <div className="section-shell">
          <SectionReveal>
            <p className="section-kicker">ご予約</p>
            <h2 id="course-cta-title">コースを選んで、<br />ふたりの予定を決める。</h2>
            <p>ご予約フォームでは、コースのほか、ドリンクと記念日ケーキの希望も選択できます。</p>
            <Button asChild variant="ivory" size="large"><Link href="/#reservation">コースを選んで予約する</Link></Button>
          </SectionReveal>
        </div>
      </section>
      <RestaurantFooter />
    </main>
  );
}
