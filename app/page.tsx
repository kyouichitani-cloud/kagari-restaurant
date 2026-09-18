import Image from "next/image";
import Link from "next/link";
import { FrenchReservationForm } from "@/components/FrenchReservationForm";
import { KineticNavigation } from "@/components/KineticNavigation";
import { ScrollExpansionHero } from "@/components/ScrollExpansionHero";
import { SectionReveal } from "@/components/SectionReveal";
import { Button } from "@/components/ui/button";
import { siteContent } from "@/content/french-restaurant";

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
          <div className="section-shell reasons-layout">
            <SectionReveal className="reasons-heading">
              <p className="section-kicker">選ばれる理由</p>
              <h2 id="reasons-title">迷う時間も、<br />楽しめるように。</h2>
            </SectionReveal>
            <div className="reasons-list">
              {[
                ["価格が見える", "コースは5,000円から。三つの違いを、料理写真と一緒に比べられます。"],
                ["追加を選べる", "ドリンクは単品または飲み放題。記念日ケーキは、どのコースにも追加できます。"],
                ["気負わず相談できる", "まだ決まっていない内容は予約時に伝えられます。詳細は確認連絡で丁寧にご案内します。"],
              ].map(([title, body], index) => (
                <SectionReveal key={title} className="reason-row" direction={index === 1 ? "right" : "up"} delay={index * 0.08}>
                  <span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p>
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
                  <h3>{course.name}</h3>
                  <p className="course-price"><span>お一人様</span>{course.price.toLocaleString("ja-JP")}<small>円</small></p>
                  <p className="course-description">{course.description}</p>
                  <dl><dt>構成例</dt><dd>{course.composition.join(" ／ ")}</dd></dl>
                  <p className="course-note">{course.note}</p>
                  <Button asChild variant="quiet"><Link href="#reservation">このコースで予約する</Link></Button>
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
              <h2 id="cake-title">「おめでとう」を、<br />食事の余韻に。</h2>
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
            <SectionReveal className="access-heading"><p className="section-kicker">店舗情報・アクセス</p><h2 id="access-title">お出かけ前に。</h2><p>店舗名や住所などの正式情報は、確定後にこのデータ欄だけを更新できる構成です。</p></SectionReveal>
            <SectionReveal className="access-details" direction="right" delay={0.12}>
              <dl>
                <div><dt>店名</dt><dd>{siteContent.brand.name}</dd></div>
                <div><dt>住所</dt><dd>{siteContent.details.address}<small>{siteContent.details.access}</small></dd></div>
                <div><dt>営業時間</dt><dd>{siteContent.details.hours}</dd></div>
                <div><dt>電話番号</dt><dd>{siteContent.details.telephone}</dd></div>
              </dl>
            </SectionReveal>
            <SectionReveal className="map-placeholder" delay={0.2}>
              <span>現在地（仮）</span><p>地図は住所確定後に掲載します</p><i aria-hidden="true" />
            </SectionReveal>
          </div>
        </section>

        <section id="reservation" className="reservation-section" aria-labelledby="reservation-title">
          <div className="section-shell reservation-heading">
            <SectionReveal><p className="section-kicker">ご予約</p><h2 id="reservation-title">ふたりの予定を、<br />聞かせてください。</h2></SectionReveal>
            <SectionReveal direction="right" delay={0.12}><p>入力内容を確認したあと、デモ送信へ進みます。現在は予約システム未接続のため、実際の予約は成立しません。</p></SectionReveal>
          </div>
          <div className="section-shell"><FrenchReservationForm /></div>
        </section>
      </div>

      <footer className="site-footer">
        <div className="footer-main"><p>{siteContent.brand.name}</p><span>{siteContent.brand.descriptor}</span></div>
        <nav aria-label="フッターナビゲーション"><Link href="#courses">コース料理</Link><Link href="#access">店舗情報</Link><Link href="#reservation">ご予約</Link></nav>
        <p className="footer-note">掲載情報はデモ用の仮データです。<br />© {new Date().getFullYear()} {siteContent.brand.name}</p>
      </footer>
    </main>
  );
}
