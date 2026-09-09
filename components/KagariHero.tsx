"use client";

import Image from "next/image";
import { useLayoutEffect, useState } from "react";
import type { RestaurantContent } from "@/content/restaurant";

export function KagariHero({ hero, brand }: Pick<RestaurantContent, "hero" | "brand">) {
  const [revealed, setRevealed] = useState(false);
  const titleLines = hero.title.includes("\n") ? hero.title.split("\n").filter(Boolean) : hero.title === "火と余白。" ? ["火と", "余白。"] : [hero.title];

  useLayoutEffect(() => {
    let frame = 0;
    const reveal = () => setRevealed(true);
    window.addEventListener("kagari:ready", reveal, { once: true });

    frame = window.requestAnimationFrame(() => {
      if (document.documentElement.dataset.loading !== "true") reveal();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("kagari:ready", reveal);
    };
  }, []);

  return (
    <section className="hero" aria-labelledby="hero-title" data-revealed={revealed}>
      <picture className="hero-media">
        <source media="(max-width: 767px)" srcSet="/images/responsive/portrait/hero.avif" type="image/avif" />
        <source media="(max-width: 1023px)" srcSet="/images/responsive/square/hero.avif" type="image/avif" />
        <Image
          src="/images/responsive/wide/hero.avif"
          alt="白磁の器に盛り付けた季節の一皿"
          width={3200}
          height={1800}
          priority
          sizes="100vw"
        />
      </picture>
      <div className="hero-grade" aria-hidden="true" />
      <div className="hero-copy">
        <div className="hero-title-block">
          <p className="brand-kana">{brand.ja} <span>{brand.en}</span></p>
          <h1 id="hero-title" aria-label={hero.title}>
            {titleLines.map((line) => (
              <span className="hero-line" aria-hidden="true" key={line}>
                <span>{line}</span>
              </span>
            ))}
          </h1>
        </div>
        <div className="hero-action">
          <p>{hero.body}</p>
          <a className="primary-action" href="#reservation">席を予約する</a>
        </div>
      </div>
    </section>
  );
}
