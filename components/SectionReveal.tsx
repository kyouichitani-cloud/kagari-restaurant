"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
};

export function SectionReveal({ children, className, direction = "up", delay = 0 }: SectionRevealProps) {
  const reduceMotion = useReducedMotion();
  const [useStaticLayout, setUseStaticLayout] = useState(false);
  const revealClassName = ["section-reveal", className].filter(Boolean).join(" ");

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px), (hover: none), (pointer: coarse)");
    const update = () => setUseStaticLayout(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (reduceMotion || useStaticLayout) {
    return <div className={revealClassName}>{children}</div>;
  }

  const offset = direction === "left"
    ? "translate3d(-28px,0,0)"
    : direction === "right"
      ? "translate3d(28px,0,0)"
      : "translate3d(0,26px,0)";

  return (
    <motion.div
      className={revealClassName}
      initial={{ opacity: 0, transform: offset }}
      whileInView={{ opacity: 1, transform: "translate3d(0,0,0)" }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
