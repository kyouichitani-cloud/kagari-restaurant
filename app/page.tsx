import Image from "next/image";
import { BackToTop } from "@/components/BackToTop";
import { CourseExperience } from "@/components/CourseExperience";
import { Entrance } from "@/components/Entrance";
import { GlobalMotion } from "@/components/GlobalMotion";
import { KagariHero } from "@/components/KagariHero";
import { Navigation } from "@/components/Navigation";
import { ReservationForm } from "@/components/ReservationForm";
import { getRestaurantContent } from "@/content/microcms";
import { publicationReady, siteUrl } from "@/content/site";

export default async function Home() {
  const { restaurant, reservationPolicy } = await getRestaurantContent();
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Restaurant", name: `${restaurant.brand.ja} ${restaurant.brand.en}`, image: `${siteUrl}/images/responsive/wide/space.avif`, url: siteUrl, telephone: restaurant.details.telephone,
    address: { "@type": "PostalAddress", streetAddress: restaurant.details.address, addressCountry: "JP" },
    servesCuisine: ["日本料理", "懐石料理"], priceRange: "¥¥¥¥", acceptsReservations: true, openingHours: restaurant.details.hours,
  };
  return (
    <main id="top">
      <a className="skip-link" href="#content-start">本文へ移動</a>
      {publicationReady && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}
      <div id="top-sentinel" aria-hidden="true" />
      <Entrance />
      <Navigation navigation={restaurant.navigation} brand={restaurant.brand} details={restaurant.details} />
      <GlobalMotion />

      <KagariHero hero={restaurant.hero} brand={restaurant.brand} />

      <section className="news" id="content-start" aria-labelledby="news-title">
        <header><p>INFORMATION</p><h2 id="news-title">お知らせ</h2></header>
        <ol>{restaurant.notices.map((notice) => <li key={notice.id ?? `${notice.date}-${notice.title}`}><time dateTime={notice.date.replaceAll(".", "-")}>{notice.date}</time><span>{notice.title}</span></li>)}</ol>
      </section>

      <CourseExperience courses={restaurant.courses} section={restaurant.courseSection} />

      <section className="chef" id="chef" aria-labelledby="chef-title">
        <picture className="chef-image"><source media="(max-width: 1024px)" srcSet="/images/responsive/portrait/chef-naoto-takase.avif" type="image/avif" /><source srcSet="/images/chef-naoto-takase.avif" type="image/avif" /><source srcSet="/images/chef-naoto-takase.webp" type="image/webp" /><Image src="/images/chef-naoto-takase.png" alt="篝 料理長 髙瀬直人" width={1536} height={1024} sizes="(max-width: 767px) 38vw, (max-width: 1024px) 42vw, 58vw" /></picture>
        <div className="chef-copy">
          <p className="section-label">{restaurant.chef.title}</p>
          <h2 id="chef-title" className="sr-only">料理長の言葉</h2>
          <blockquote className="chef-quote" aria-label={restaurant.chef.quote}>
            <span aria-hidden="true">鮎の青い香りが残る、</span>
            <span aria-hidden="true">わずかな旬を逃さない。</span>
            <span aria-hidden="true">炭との距離を見極め、</span>
            <span aria-hidden="true">皮は香ばしく、</span>
            <span aria-hidden="true">身はしっとりと焼き上げます。</span>
          </blockquote>
          <p className="chef-sign">{restaurant.chef.name}<small>{restaurant.chef.nameEn}</small></p>
          <p>{restaurant.chef.bio}</p>
        </div>
      </section>

      <section className="philosophy" id="philosophy" aria-labelledby="philosophy-title">
        <div className="philosophy-image"><Image src="/images/avif/philosophy.avif" alt="炭火の前で一皿を仕上げる料理人の手元" fill sizes="(max-width: 1023px) 100vw, 58vw" /></div>
        <div className="philosophy-copy"><p className="section-label">PHILOSOPHY</p><h2 id="philosophy-title">{restaurant.philosophy.title}</h2><p>{restaurant.philosophy.body}</p></div>
      </section>

      <section className="provenance" aria-labelledby="provenance-title">
        <div className="provenance-copy">
          <p className="section-label">PRODUCERS</p>
          <h2 id="provenance-title" aria-label={restaurant.provenance.title}>
            <span aria-hidden="true">誰が育て、</span>
            <span aria-hidden="true">誰が獲ったか</span>
          </h2>
          <p>{restaurant.provenance.body}</p>
        </div>
        <div className="provenance-image"><Image src="/images/avif/provenance.avif" alt="畑から届いた根菜と葉、魚介の素材" width={1672} height={941} sizes="(max-width: 1023px) 100vw, 64vw" /></div>
      </section>

      <section className="space" id="space" aria-labelledby="space-title">
        <Image src="/images/avif/space.avif" alt="檜のカウンター八席と炭場" fill sizes="100vw" />
        <div className="space-grade" />
        <div><p className="section-label">GINZA, TOKYO</p><h2 id="space-title">{restaurant.space.title}</h2><p>{restaurant.space.body}</p></div>
      </section>

      <section className="visit" id="access" aria-labelledby="visit-title">
        <div><p className="section-label">ACCESS & INFORMATION</p><h2 id="visit-title">銀座八丁目</h2><address><p>{restaurant.details.address}</p><p>{restaurant.details.access}</p><p><a href={`tel:${restaurant.details.telephone.replaceAll("-", "")}`}>{restaurant.details.telephone}</a><br />{restaurant.details.reception}</p></address></div>
        <dl>
          <div><dt>営業時間</dt><dd>{restaurant.details.hours}<br />{restaurant.details.closed}</dd></div>
          <div><dt>御料理</dt><dd>{restaurant.details.course}<br />{restaurant.details.pairing}</dd></div>
          <div><dt>お席</dt><dd>{restaurant.details.seats}<br />{restaurant.details.children}</dd></div>
          <div><dt>お願い</dt><dd>{restaurant.details.dress}<br />{restaurant.details.allergy}</dd></div>
          <div><dt>キャンセル</dt><dd>{restaurant.details.cancellation}</dd></div>
        </dl>
      </section>

      <section className="reservation" id="reservation" aria-labelledby="reservation-title">
        <div className="reservation-visual"><Image src="/images/avif/reservation.avif" alt="夜の二席を照らすカウンターの灯り" fill sizes="(max-width: 1023px) 100vw, 55vw" /></div>
        <div className="reservation-panel"><h2 id="reservation-title">{restaurant.reservation.title}</h2><p>{restaurant.reservation.note}</p><ReservationForm policy={reservationPolicy} allergyNote={restaurant.details.allergy} cancellation={restaurant.details.cancellation} /></div>
      </section>

      <footer>
        <div className="footer-image"><Image src="/images/avif/access.avif" alt="雨に濡れた銀座の路地と篝の入口" fill sizes="100vw" /></div>
        <div className="footer-content">
          <div className="footer-brand"><strong>篝</strong><span>KAGARI</span></div>
          <address><p>{restaurant.details.address}</p><p>{restaurant.details.hours}</p><p><a href={`tel:${restaurant.details.telephone.replaceAll("-", "")}`}>{restaurant.details.telephone}</a></p></address>
          <p className="legal"><a href="/privacy">プライバシーポリシー</a><br /><a href="/legal">特定商取引法に基づく表記</a><br />© 2026 KAGARI</p>
        </div>
      </footer>
      <BackToTop />
    </main>
  );
}
