"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { Button } from "@/components/ui/button";
import { siteContent } from "@/content/french-restaurant";

export function ScrollExpansionHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const copy = copyRef.current;
    if (!section || !frame || !copy) return;

    gsap.registerPlugin(ScrollTrigger, CustomEase);
    CustomEase.create("restaurant-expand", "0.23,1,0.32,1");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        frame,
        { scale: 1 },
        {
          scale: () => (window.innerWidth < 768 ? 1.36 : 2.08),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        },
      );
      gsap.to(copy, {
        opacity: 0.16,
        transform: "translate3d(0,-12px,0)",
        ease: "restaurant-expand",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "45% top",
          scrub: 0.4,
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <div className="hero-sticky">
        <Image
          className="hero-background"
          src={siteContent.images.background}
          alt="記念日のテーブルが用意された落ち着いた店内"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-shade" aria-hidden="true" />

        <div ref={frameRef} className="hero-frame">
          <Image
            src={siteContent.images.hero}
            alt="フレンチ料理と、奥のテーブルで過ごす二人"
            fill
            priority
            sizes="(max-width: 767px) 76vw, 46vw"
          />
        </div>

        <div ref={copyRef} className="hero-copy">
          <p className="hero-brand">{siteContent.brand.name}<span>{siteContent.brand.descriptor}</span></p>
          <h1 id="hero-title">
            {siteContent.hero.title.split("\n").map((line) => <span key={line}>{line}</span>)}
          </h1>
          <p className="hero-description">{siteContent.hero.body}</p>
          <div className="hero-actions">
            <Button asChild variant="ivory" size="large"><Link href="#courses">コースを見る</Link></Button>
            <Button asChild variant="outline" size="large"><Link href="#reservation">席を予約する</Link></Button>
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true"><span>SCROLL</span><i /></div>
      </div>
    </section>
  );
}
