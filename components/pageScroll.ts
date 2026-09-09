let frame = 0;
let cleanup: (() => void) | null = null;

export function cancelPageScroll() {
  cancelAnimationFrame(frame);
  frame = 0;
  cleanup?.();
  cleanup = null;
}

export function scrollPageTo(top: number) {
  cancelPageScroll();
  const html = document.documentElement;
  const previousBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  const target = Math.max(0, top);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || Math.abs(scrollY - target) < 2) {
    scrollTo(0, target);
    html.style.scrollBehavior = previousBehavior;
    return;
  }

  const start = scrollY;
  const startedAt = performance.now();
  const duration = Math.min(650, Math.max(280, Math.abs(target - start) / 9));
  const interrupt = () => cancelPageScroll();
  const events: (keyof WindowEventMap)[] = ["wheel", "touchstart", "pointerdown", "keydown"];
  events.forEach((event) => window.addEventListener(event, interrupt, { passive: true, once: true }));
  cleanup = () => {
    events.forEach((event) => window.removeEventListener(event, interrupt));
    html.style.scrollBehavior = previousBehavior;
  };
  const tick = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - Math.pow(1 - progress, 4);
    scrollTo(0, start + (target - start) * eased);
    if (progress < 1) frame = requestAnimationFrame(tick);
    else {
      scrollTo(0, target);
      cancelPageScroll();
    }
  };
  frame = requestAnimationFrame(tick);
}
