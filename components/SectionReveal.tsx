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
  const [useLightweightMotion, setUseLightweightMotion] = useState(false);
  const revealClassName = ["section-reveal", className].filter(Boolean).join(" ");

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px), (pointer: coarse)");
    const update = () => setUseLightweightMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (useLightweightMotion) {
    return <div className={revealClassName}>{children}</div>;
  }

  const simplifyMotion = Boolean(reduceMotion) || useLightweightMotion;
  const offset = simplifyMotion ? "translate3d(0,0,0)" : direction === "left"
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
        duration: reduceMotion ? 0.2 : useLightweightMotion ? 0.24 : 0.7,
        delay: simplifyMotion ? 0 : delay,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
