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
  const brandRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const brand = brandRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    const actions = actionsRef.current;
    if (!section || !frame || !brand || !title || !description || !actions) return;

    gsap.registerPlugin(ScrollTrigger, CustomEase);
    CustomEase.create("restaurant-expand", "0.23,1,0.32,1");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const useNativeMobileScroll = window.matchMedia("(max-width: 1023px)").matches;
    if (useNativeMobileScroll) return;

    const context = gsap.context(() => {
      if (!reduceMotion) {
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
      }
      const exitTransform = (offset: number) => reduceMotion ? "none" : `translate3d(0,${offset}px,0)`;
      const copyTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: reduceMotion ? "26% top" : "42% top",
          scrub: reduceMotion ? 0.18 : 0.4,
        },
      });

      copyTimeline
        .to(actions, {
          autoAlpha: 0,
          transform: exitTransform(-8),
          duration: 0.12,
          ease: "restaurant-expand",
          onComplete: () => { actions.style.pointerEvents = "none"; },
          onReverseComplete: () => { actions.style.pointerEvents = ""; },
        })
        .to(description, { autoAlpha: 0, transform: exitTransform(-10), duration: 0.12, ease: "restaurant-expand" })
        .to(title, { autoAlpha: 0, transform: exitTransform(-12), duration: 0.12, ease: "restaurant-expand" })
        .to(brand, { autoAlpha: 0, transform: exitTransform(-10), duration: 0.12, ease: "restaurant-expand" });
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

        <div className="hero-copy">
          <p ref={brandRef} className="hero-brand">{siteContent.brand.name}<span>{siteContent.brand.descriptor}</span></p>
          <h1 ref={titleRef} id="hero-title">
            {siteContent.hero.title.split("\n").map((line) => <span key={line}>{line}</span>)}
          </h1>
          <p ref={descriptionRef} className="hero-description">{siteContent.hero.body}</p>
          <div ref={actionsRef} className="hero-actions">
            <Button asChild variant="ivory" size="large"><Link className="hero-primary-action" href="/courses">コースを見る</Link></Button>
            <Button asChild variant="outline" size="large"><Link href="/#reservation">席を予約する</Link></Button>
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true"><span>SCROLL</span><i /></div>
      </div>
    </section>
  );
}
