"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
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

    const useNativeMobileScroll = window.matchMedia("(max-width: 1023px), (hover: none), (pointer: coarse)").matches;
    if (useNativeMobileScroll) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let disposed = false;
    let revertAnimation: (() => void) | undefined;

    const initialiseDesktopAnimation = async () => {
      const [{ gsap }, { ScrollTrigger }, { CustomEase }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/CustomEase"),
      ]);
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger, CustomEase);
      CustomEase.create("restaurant-expand", "0.23,1,0.32,1");

      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 0.52)}`,
            pin: section,
            pinSpacing: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .fromTo(frame, { scale: 1 }, { scale: 2.08, ease: "none", duration: 1 }, 0)
          .to(copy, {
            autoAlpha: 0,
            transform: "translate3d(0,-12px,0)",
            ease: "restaurant-expand",
            duration: 0.58,
          }, 0);
      }, section);

      revertAnimation = () => context.revert();
    };

    void initialiseDesktopAnimation();

    return () => {
      disposed = true;
      revertAnimation?.();
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <div className="hero-sticky">
        <Image
          className="hero-background"
          src={siteContent.images.background}
          alt="記念日のテーブルが用意された落ち着いた店内"
          fill
          loading="eager"
          fetchPriority="low"
          quality={68}
          sizes="100vw"
        />
        <div className="hero-shade" aria-hidden="true" />

        <div ref={frameRef} className="hero-frame">
          <Image
            src={siteContent.images.hero}
            alt="フレンチ料理と、奥のテーブルで過ごす二人"
            fill
            priority
            fetchPriority="high"
            quality={68}
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
            <Button asChild variant="ivory" size="large"><Link className="hero-primary-action" href="/courses">コースを見る</Link></Button>
            <Button asChild variant="outline" size="large"><Link href="#reservation">席を予約する</Link></Button>
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true"><span>下へ</span><i /></div>
      </div>
    </section>
  );
}
