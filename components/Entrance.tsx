"use client";

import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from "react";

type Phase = "idle" | "loading" | "exiting" | "complete";
type Event = "START" | "READY" | "FINISH";

function transition(phase: Phase, event: Event): Phase {
  if (phase === "idle" && event === "START") return "loading";
  if (phase === "loading" && event === "READY") return "exiting";
  if (phase === "exiting" && event === "FINISH") return "complete";
  return phase;
}

export function Entrance() {
  const [phase, dispatch] = useReducer(transition, "idle");
  const overlayRef = useRef<HTMLDivElement>(null);
  const runRef = useRef(0);
  const finishedRef = useRef(false);
  const releaseRef = useRef<() => void>(() => undefined);
  const cancelRef = useRef<() => void>(() => undefined);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    cancelRef.current();
    releaseRef.current();
    dispatch("FINISH");
  }, []);

  useEffect(() => {
    if (phase !== "exiting") return;
    const revisiting = overlayRef.current?.dataset.revisit === "true";
    const fallback = window.setTimeout(finish, revisiting ? 120 : 200);
    return () => window.clearTimeout(fallback);
  }, [finish, phase]);

  useLayoutEffect(() => {
    const run = ++runRef.current;
    const controller = new AbortController();
    const { signal } = controller;
    cancelRef.current = () => controller.abort();
    const html = document.documentElement;
    const body = document.body;
    const main = overlayRef.current?.parentElement;
    const siblings = main ? Array.from(main.children).filter((element) => element !== overlayRef.current) as HTMLElement[] : [];
    const previous = {
      htmlOverflow: html.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyPointerEvents: body.style.pointerEvents,
      bodyVisibility: body.style.visibility,
      bodyOpacity: body.style.opacity,
      siblingInert: siblings.map((element) => element.inert),
    };
    let released = false;
    const timers = new Set<number>();
    const after = (milliseconds: number) => new Promise<void>((resolve) => {
      const timer = window.setTimeout(() => { timers.delete(timer); resolve(); }, milliseconds);
      timers.add(timer);
    });

    const release = () => {
      if (released) return;
      released = true;
      delete html.dataset.loading;
      delete html.dataset.revisit;
      html.style.overflow = previous.htmlOverflow;
      html.style.overscrollBehavior = previous.htmlOverscroll;
      body.style.overflow = previous.bodyOverflow;
      body.style.pointerEvents = previous.bodyPointerEvents;
      body.style.visibility = previous.bodyVisibility;
      body.style.opacity = previous.bodyOpacity;
      siblings.forEach((element, index) => { element.inert = previous.siblingInert[index]; });
    };
    releaseRef.current = release;

    html.dataset.loading = "true";
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    siblings.forEach((element) => { element.inert = true; });
    dispatch("START");

    let revisiting = false;
    try { revisiting = sessionStorage.getItem("kagari-entered") === "1"; } catch { revisiting = false; }
    overlayRef.current?.setAttribute("data-revisit", String(revisiting));

    const resources = revisiting ? Promise.resolve() : Promise.allSettled([waitForHero(signal), after(200)]).then(() => undefined);
    const failSafe = after(revisiting ? 0 : 430);

    Promise.race([resources, failSafe]).then(() => {
      if (signal.aborted || run !== runRef.current) return;
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      try { sessionStorage.setItem("kagari-entered", "1"); } catch { /* Storage is optional. */ }
      dispatch("READY");
      window.dispatchEvent(new Event("kagari:ready"));
    });

    return () => {
      runRef.current += 1;
      controller.abort();
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      release();
    };
  }, []);

  if (phase === "complete") return null;
  return (
    <div
      ref={overlayRef}
      className="entrance"
      data-phase={phase}
      aria-hidden="true"
      onAnimationEnd={(event) => { if (phase === "exiting" && event.animationName === "cut-open") finish(); }}
      onTransitionEnd={(event) => { if (phase === "exiting" && event.propertyName === "opacity") finish(); }}
    >
      <div className="entrance-mark"><span className="entrance-ember" /><strong>篝</strong><small>KAGARI</small></div>
      <div className="entrance-cut" />
    </div>
  );
}

function abortPromise(signal: AbortSignal) {
  return new Promise<never>((_, reject) => signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true }));
}

function waitForHero(signal: AbortSignal) {
  const image = document.querySelector<HTMLImageElement>(".hero img");
  if (!image) return Promise.resolve();
  const loaded = image.complete ? Promise.resolve() : new Promise<void>((resolve) => {
    const done = () => resolve();
    image.addEventListener("load", done, { once: true, signal });
    image.addEventListener("error", done, { once: true, signal });
  });
  return Promise.race([loaded.then(() => image.decode?.().catch(() => undefined)), abortPromise(signal)]);
}
