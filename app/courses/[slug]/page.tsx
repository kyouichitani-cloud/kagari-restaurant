import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KineticNavigation } from "@/components/KineticNavigation";
import { CourseName } from "@/components/CourseName";
import { RestaurantFooter } from "@/components/RestaurantFooter";
import { SectionReveal } from "@/components/SectionReveal";
import { Button } from "@/components/ui/button";
import { getCourse, getCourseHref, getCourseReservationHref, siteContent } from "@/content/french-restaurant";

type CoursePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return siteContent.courses.map((course) => ({ slug: course.id }));
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return { title: "KAGARI｜コースが見つかりません" };
  return {
    title: `KAGARI｜${course.name}`,
    description: `${course.name}。お一人様・税込 ${course.price.toLocaleString("ja-JP")}円。${course.scene}`,
    alternates: { canonical: getCourseHref(course.id) },
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const courseIndex = siteContent.courses.findIndex((item) => item.id === course.id);
  const previousCourse = siteContent.courses[courseIndex - 1];
  const nextCourse = siteContent.courses[courseIndex + 1];

  return (
    <main id="top" className="course-page course-detail-page">
      <a className="skip-link" href="#course-detail-content">本文へ移動</a>
      <KineticNavigation />
      <section className="course-detail-hero" aria-labelledby="course-detail-title">
        <Image src={course.image} alt={course.alt} fill priority sizes="100vw" />
        <div className="course-detail-shade" aria-hidden="true" />
        <div className="section-shell course-detail-hero-content">
          <SectionReveal>
            <Link className="back-link" href="/courses">コース一覧へ戻る</Link>
            <p className="section-kicker">コース料理</p>
            <h1 id="course-detail-title"><CourseName name={course.name} /></h1>
            <p className="course-detail-price"><span>お一人様・税込</span>{course.price.toLocaleString("ja-JP")}円</p>
          </SectionReveal>
        </div>
      </section>

      <section id="course-detail-content" className="course-detail-content" aria-label={`${course.name}の詳細`}>
        <div className="section-shell course-detail-grid">
          <SectionReveal className="course-detail-intro">
            <p className="section-kicker">おすすめの利用シーン</p>
            <h2>{course.scene}</h2>
            <p>{course.description}</p>
          </SectionReveal>
          <SectionReveal className="course-detail-composition" direction="right" delay={0.12}>
            <p className="section-kicker">現在登録されているコース構成</p>
            <ol>
              {course.composition.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}
            </ol>
            <p className="course-note">{course.note}</p>
          </SectionReveal>
        </div>

        <div className="section-shell course-detail-options">
          <SectionReveal>
            <p className="section-kicker">追加オプション</p>
            <h2>予約フォームで選べます。</h2>
          </SectionReveal>
          <div>
            <SectionReveal className="course-option" delay={0.1}><h3>ドリンク</h3><p>「単品」または「飲み放題」から選べます。</p></SectionReveal>
            <SectionReveal className="course-option" delay={0.18}><h3>記念日ケーキ</h3><p>お名前とプレートメッセージを入力できます。</p></SectionReveal>
          </div>
        </div>

        <div className="section-shell course-detail-reservation">
          <SectionReveal>
            <p>選択内容は、確認画面まで変更できます。</p>
            <Button asChild variant="ivory" size="large"><Link href={getCourseReservationHref(course.id)}>このコースで予約する</Link></Button>
          </SectionReveal>
        </div>

        <nav className="section-shell course-pagination" aria-label="ほかのコース">
          {previousCourse ? <Link href={getCourseHref(previousCourse.id)}><span>前のコース</span>{previousCourse.name}</Link> : <span aria-hidden="true" />}
          <Link className="course-list-link" href="/courses">コース一覧へ戻る</Link>
          {nextCourse ? <Link href={getCourseHref(nextCourse.id)}><span>次のコース</span>{nextCourse.name}</Link> : <span aria-hidden="true" />}
        </nav>
      </section>
      <RestaurantFooter />
    </main>
  );
}
