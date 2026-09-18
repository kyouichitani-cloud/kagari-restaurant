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

      <div id="main-content">
        <section id="concept" className="concept-section section-ivory" aria-labelledby="concept-title">
          <div className="section-shell concept-grid">
            <SectionReveal className="concept-heading">
              <p className="section-kicker">私たちについて</p>
              <h2 id="concept-title">おいしい、の先にある<br />ふたりの時間まで。</h2>
            </SectionReveal>
            <SectionReveal className="concept-copy" direction="right" delay={0.12}>
              <p>少し背筋が伸びるのに、肩肘は張らなくていい。料理を待つ時間も、乾杯の一瞬も、あとから思い出したくなる夜を目指します。</p>
              <p>コースの違いと価格を先に分かりやすく。初めてのフレンチでも、自分たちらしい過ごし方を選べるように整えています。</p>
            </SectionReveal>
            <SectionReveal className="concept-image" delay={0.2}>
              <Image src={siteContent.images.fish} alt="シェフが白身魚の一皿にソースを添える様子" fill sizes="(max-width: 767px) calc(100vw - 2rem), 58vw" />
            </SectionReveal>
            <p className="concept-aside">特別な日を、特別扱いしすぎない。</p>
          </div>
        </section>

        <section className="reasons-section" aria-labelledby="reasons-title">
          <div className="section-shell">
            <SectionReveal className="reasons-news">
              <div className="reasons-news-meta"><span>NEWS</span><time dateTime="2026-09-18">2026.09.18</time></div>
              <Link href="#reservation">ご予約と記念日ケーキについて<span aria-hidden="true">→</span></Link>
            </SectionReveal>
          </div>
          <div className="section-shell reasons-layout">
            <SectionReveal className="reasons-heading" delay={0.1}>
              <p className="section-kicker">選ばれる理由</p>
              <h2 id="reasons-title">迷う時間も、<br />楽しめるように。</h2>
            </SectionReveal>
            <div className="reasons-list">
              {[
                ["予算から選べる", "5,000円、7,500円、10,000円。料理の内容と写真を見ながら、ふたりに合うコースを選べます。"],
                ["過ごし方を選べる", "ドリンクは単品または飲み放題。記念日ケーキも、すべてのコースに追加できます。"],
                ["迷ったままでも相談できる", "ケーキのお名前やメッセージなど、まだ決まっていないことは予約時に相談できます。"],
              ].map(([title, body], index) => (
                <SectionReveal key={title} className="reason-row" direction="up" delay={0.18 + index * 0.1}>
                  <span className="reason-number">{String(index + 1).padStart(2, "0")}</span>
                  <div className="reason-copy"><h3>{title}</h3><p>{body}</p></div>
                  <i className="reason-marker" aria-hidden="true" />
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="courses" className="courses-section" aria-labelledby="courses-title">
          <div className="section-shell courses-intro">
            <SectionReveal>
              <p className="section-kicker">コース料理</p>
              <h2 id="courses-title">今夜にちょうどいい、<br />三つのコース。</h2>
            </SectionReveal>
            <SectionReveal className="courses-intro-copy" direction="right" delay={0.12}>
              <p>すべてお一人様の価格です。掲載している料理構成は仮データのため、正式な内容に合わせて差し替えられます。</p>
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
                  <p className="course-price"><span>お一人様</span>{course.price.toLocaleString("ja-JP")}<small>円</small></p>
                  <p className="course-description">{course.description}</p>
                  <dl><dt>構成例</dt><dd>{course.composition.join(" ／ ")}</dd></dl>
                  <p className="course-note">{course.note}</p>
                  <div className="course-actions">
                    <Button asChild variant="quiet"><Link href={getCourseHref(course.id)}>詳しく見る</Link></Button>
                    <Button asChild variant="quiet"><Link href="#reservation">このコースで予約する</Link></Button>
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
              <h2 id="drinks-title">一杯ずつでも、<br />飲み放題でも。</h2>
              <p className="drinks-lead">すべてのコースで、二つのスタイルから選べます。迷った場合も、予約内容の確認時にご相談いただけます。</p>
            </SectionReveal>
            <div className="drink-options">
              {siteContent.drinks.map((drink, index) => (
                <SectionReveal key={drink.id} className="drink-option" delay={0.12 + index * 0.08}>
                  <span aria-hidden="true">0{index + 1}</span><div><h3>{drink.label}</h3><p>{drink.description}</p></div>
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
              <h2 id="cake-title"><span className="cake-title-line">「おめでとう」の気持ちを、</span><span className="cake-title-line">食後のひと皿に。</span></h2>
              <p>三つすべてのコースで、記念日ケーキを希望できます。お名前やプレートのメッセージは、予約フォームからお知らせください。</p>
              <p className="cake-note">料金・サイズ・対応内容は未確定です。内容を確認後、店舗よりご案内いたします。</p>
              <Button asChild variant="ivory"><Link href="#reservation">ケーキを希望して予約する</Link></Button>
            </SectionReveal>
          </div>
        </section>

        <section id="gallery" className="gallery-section" aria-labelledby="gallery-title">
          <div className="section-shell gallery-heading">
            <SectionReveal><p className="section-kicker">料理と店内</p><h2 id="gallery-title">夜の断片。</h2></SectionReveal>
            <SectionReveal direction="right" delay={0.1}><p>料理の仕上がる瞬間から、乾杯のあとの静かなテーブルまで。写真はすべて差し替え可能な仮素材です。</p></SectionReveal>
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
            <SectionReveal className="access-heading"><p className="section-kicker">店舗情報・アクセス</p><h2 id="access-title">お出かけ前に。</h2><p>番地や建物名は、店舗の正式情報が決まり次第このデータ欄だけを更新できます。</p></SectionReveal>
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
              <div className="access-links"><a href={siteContent.details.mapUrl} target="_blank" rel="noopener noreferrer">Googleマップで見る</a>{siteContent.details.instagram.url && <a className="instagram-access-button" href={siteContent.details.instagram.url} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${siteContent.details.instagram.label} を新しいタブで開く`}><InstagramLogo size={23} weight="thin" aria-hidden="true" /><span className="instagram-access-identity"><strong>Instagram</strong><small>{siteContent.details.instagram.label}</small></span><span className="instagram-access-cta">最新情報を見る <span className="instagram-arrow" aria-hidden="true">↗</span></span></a>}</div>
            </SectionReveal>
            <SectionReveal className="map-placeholder" delay={0.2}>
              <span>現在地（仮）</span><p>地図は住所確定後に掲載します</p><i aria-hidden="true" />
            </SectionReveal>
          </div>
        </section>

        <section id="reservation" className="reservation-section" aria-labelledby="reservation-title">
          <div className="section-shell reservation-heading">
            <SectionReveal><p className="section-kicker">ONLINE RESERVATION</p><p className="reservation-duration">所要時間 約3分</p><h2 id="reservation-title">ふたりの予定を、<br />聞かせてください。</h2></SectionReveal>
            <SectionReveal direction="right" delay={0.12}><p>入力内容を確認したあと、デモ送信へ進みます。現在は予約システム未接続のため、実際の予約は成立しません。</p></SectionReveal>
          </div>
          <div className="section-shell"><FrenchReservationForm /></div>
        </section>
      </div>

      <RestaurantFooter />
    </main>
  );
}
