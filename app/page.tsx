import Image from "next/image";
import Link from "next/link";
import { InstagramLogo } from "@phosphor-icons/react/ssr";
import { FrenchReservationForm } from "@/components/FrenchReservationForm";
import { KineticNavigation } from "@/components/KineticNavigation";
import { CourseName } from "@/components/CourseName";
import { RestaurantFooter } from "@/components/RestaurantFooter";
import { ScrollExpansionHero } from "@/components/ScrollExpansionHero";
import { SectionReveal } from "@/components/SectionReveal";
import { Button } from "@/components/ui/button";
import { getCourseHref, siteContent } from "@/content/french-restaurant";

export default function Home() {
  return (
    <main id="top">
      <a className="skip-link" href="#main-content">本文へ移動</a>
      <KineticNavigation />
      <ScrollExpansionHero />

      <div id="main-content" tabIndex={-1}>
        <section id="concept" className="concept-section section-ivory" aria-labelledby="concept-title">
          <div className="section-shell concept-grid">
            <SectionReveal className="concept-heading">
              <p className="section-kicker">KAGARIについて</p>
              <h2 id="concept-title">コース料理を、もっと気軽に。</h2>
            </SectionReveal>
            <SectionReveal className="concept-intro" direction="right" delay={0.1}>
              <p>
                <span>旬の食材を生かした料理と、</span>
                <span>落ち着いて過ごせる空間。</span>
                <span className="concept-sentence-start">かしこまりすぎず、</span>
                <span>二人の時間をゆっくり楽しめる店です。</span>
              </p>
            </SectionReveal>
            <SectionReveal className="concept-image" delay={0.2}>
              <Image src={siteContent.images.fish} alt="シェフが白身魚の一皿にソースを添える様子" fill sizes="(max-width: 767px) calc(100vw - 2rem), 58vw" />
            </SectionReveal>
            <p className="concept-aside">誕生日や記念日、いつものデートにも。</p>
          </div>
        </section>

        <aside className="news-strip" aria-label="お知らせ">
          <div className="section-shell">
            <SectionReveal className="news-strip-inner">
              <div className="reasons-news-meta"><span>お知らせ</span><time dateTime="2026-09-18">2026.09.18</time></div>
              <p className="news-title">ご予約と記念日ケーキについて</p>
            </SectionReveal>
          </div>
        </aside>

        <section id="courses" className="courses-section" aria-labelledby="courses-title">
          <div className="section-shell courses-intro">
            <SectionReveal>
              <p className="section-kicker">コース料理</p>
              <h2 id="courses-title">3つのコース</h2>
            </SectionReveal>
            <SectionReveal className="courses-intro-copy" direction="right" delay={0.12}>
              <p>料金はお一人様・税込です。</p>
              <Button asChild variant="quiet"><Link href="/courses">コース一覧を見る</Link></Button>
            </SectionReveal>
          </div>

          <div className="course-stories">
            {siteContent.courses.map((course, index) => (
              <article key={course.id} className={`course-story course-story-${index + 1}`}>
                <SectionReveal className="course-photo" direction={index % 2 ? "right" : "left"}>
                  <Image src={course.image} alt={course.alt} fill sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1100px) 60vw, 54vw" />
                  <span className="course-index" aria-hidden="true">0{index + 1}</span>
                </SectionReveal>
                <SectionReveal className="course-copy" delay={0.12}>
                  <p className="course-scene">{course.scene}</p>
                  <h3><CourseName name={course.name} /></h3>
                  <p className="course-price">
                    <span>お一人様・税込</span>
                    <strong>{course.price.toLocaleString("ja-JP")}</strong>
                    <small>円</small>
                  </p>
                  <p className="course-description">{course.description}</p>
                  <dl><dt>構成例</dt><dd>{course.composition.join(" ／ ")}</dd></dl>
                  <div className="course-actions">
                    <Button asChild variant="quiet"><Link href={getCourseHref(course.id)}>詳しく見る</Link></Button>
                    <Button asChild variant="ivory"><Link href="#reservation">このコースで予約する</Link></Button>
                  </div>
                </SectionReveal>
              </article>
            ))}
          </div>
        </section>

        <section id="drinks" className="drinks-section section-ivory" aria-labelledby="drinks-title">
          <div className="drinks-photo"><Image src={siteContent.images.wine} alt="テーブルで赤ワインをグラスへ注ぐ様子" fill sizes="(max-width: 767px) 100vw, 47vw" /></div>
          <div className="drinks-content">
            <SectionReveal>
              <p className="section-kicker">ドリンク</p>
              <h2 id="drinks-title">ドリンクプラン</h2>
            </SectionReveal>
            <div className="drink-options">
              {siteContent.drinks.map((drink, index) => (
                <SectionReveal key={drink.id} className="drink-option" delay={0.12 + index * 0.08}>
                  <div><h3>{drink.label}</h3><p>{drink.description}</p></div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="cake" className="cake-section" aria-labelledby="cake-title">
          <div className="cake-photo"><Image src={siteContent.images.anniversary} alt="記念日ケーキと二人分のグラスが置かれたテーブル" fill sizes="100vw" /></div>
          <div className="cake-shade" aria-hidden="true" />
          <div className="section-shell cake-content">
            <SectionReveal className="cake-copy" direction="left">
              <p className="section-kicker">記念日ケーキ</p>
              <h2 id="cake-title">記念日ケーキ</h2>
              <p>お食事の締めくくりに、記念日用のケーキをご用意します。</p>
              <div className="cake-detail-row">
                <p className="cake-note">料金とサイズは、予約確認時にご案内します。</p>
                <p className="cake-description">ホールケーキのプレートに、お名前と短いメッセージを入れられます。内容は予約フォームにご入力ください。</p>
              </div>
              <Button asChild variant="ivory"><Link href="#reservation">予約フォームへ</Link></Button>
            </SectionReveal>
          </div>
        </section>

        <section id="gallery" className="gallery-section" aria-labelledby="gallery-title">
          <div className="section-shell gallery-heading">
            <SectionReveal><h2 id="gallery-title">料理・店内写真</h2></SectionReveal>
            <SectionReveal direction="right" delay={0.1}><p>掲載写真は仮素材です。</p></SectionReveal>
          </div>
          <div className="gallery-grid">
            <SectionReveal className="gallery-item gallery-wide"><Image src={siteContent.images.hero} alt="フレンチ料理を囲む夜の店内" fill sizes="(max-width: 767px) 100vw, 66vw" /></SectionReveal>
            <SectionReveal className="gallery-item gallery-tall" delay={0.08}><Image src={siteContent.images.wine} alt="赤ワインをグラスへ注ぐ手元" fill sizes="(max-width: 767px) 60vw, 32vw" /></SectionReveal>
            <SectionReveal className="gallery-item gallery-square" delay={0.12}><Image src={siteContent.images.beef} alt="牛肉と季節の野菜を盛り付けた料理" fill sizes="(max-width: 767px) 100vw, 40vw" /></SectionReveal>
            <SectionReveal className="gallery-item gallery-landscape" delay={0.16}><Image src={siteContent.images.anniversary} alt="記念日ケーキが用意された店内のテーブル" fill sizes="(max-width: 767px) 100vw, 56vw" /></SectionReveal>
          </div>
        </section>

        <section id="access" className="access-section section-ivory" aria-labelledby="access-title">
          <div className="section-shell access-grid">
            <SectionReveal className="access-heading"><p className="section-kicker">店舗情報・アクセス</p><h2 id="access-title">店舗情報</h2></SectionReveal>
            <SectionReveal className="access-details" direction="right" delay={0.12}>
              <dl>
                <div><dt>店名</dt><dd>{siteContent.brand.name}</dd></div>
                <div><dt>業態</dt><dd>{siteContent.brand.descriptor}</dd></div>
                <div><dt>住所</dt><dd>{siteContent.details.address}<small>{siteContent.details.access}</small></dd></div>
                <div><dt>営業時間</dt><dd>{siteContent.details.hours}</dd></div>
                <div><dt>最終入店</dt><dd>{siteContent.details.lastEntry}</dd></div>
                <div><dt>定休日</dt><dd>{siteContent.details.closed}</dd></div>
                <div><dt>ドレスコード</dt><dd>{siteContent.details.dressCode}</dd></div>
              </dl>
              <div className="access-links"><a href={siteContent.details.mapUrl} target="_blank" rel="noopener noreferrer">Googleマップで見る</a>{siteContent.details.instagram.url && <a className="instagram-access-button" href={siteContent.details.instagram.url} target="_blank" rel="noopener noreferrer" aria-label={`公式インスタグラム ${siteContent.details.instagram.label} を新しいタブで開く`}><InstagramLogo size={23} weight="thin" aria-hidden="true" /><span className="instagram-access-identity"><strong>公式インスタグラム</strong><small>{siteContent.details.instagram.label}</small></span><span className="instagram-access-cta">最新情報を見る <span className="instagram-arrow" aria-hidden="true">↗</span></span></a>}</div>
            </SectionReveal>
            <SectionReveal className="map-placeholder" delay={0.2}>
              <span>現在地（仮）</span><p>地図は住所確定後に掲載します</p><i aria-hidden="true" />
            </SectionReveal>
          </div>
        </section>

        <section id="reservation" className="reservation-section" aria-labelledby="reservation-title">
          <div className="section-shell reservation-heading">
            <SectionReveal><p className="section-kicker">予約フォーム</p><p className="reservation-duration">所要時間 約3分</p><h2 id="reservation-title">予約内容の入力</h2></SectionReveal>
            <SectionReveal direction="right" delay={0.12}><p>現在はデモフォームです。入力内容は送信・保存されません。</p></SectionReveal>
          </div>
          <div className="section-shell"><FrenchReservationForm /></div>
        </section>
      </div>

      <RestaurantFooter />
    </main>
  );
}
