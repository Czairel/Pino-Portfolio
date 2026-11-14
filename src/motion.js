import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

/* Accessibility */
export const RESPECT_REDUCED_MOTION = false;

const reducedMotionQuery = () => window.matchMedia("(prefers-reduced-motion: reduce)");
export const prefersReducedMotion = () => RESPECT_REDUCED_MOTION && reducedMotionQuery().matches;

// Motion
if (prefersReducedMotion()) document.documentElement.dataset.reduceMotion = "";

/* Scrolling */

let lenis = null;

export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const instance = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis = instance;
    if (scrollLocks > 0) instance.stop(); // Intro

    const tick = (time) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, []);
}

/* Intro */

const INTRO_KEY = "intro-seen";
let scrollLocks = 0;

const introSeen = () => {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false; // Storage
  }
};

export function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* Storage */
  }
}

// Session
export const shouldPlayIntro = () => !introSeen();

// Diagnostics
export function introSkipReason() {
  if (introSeen()) return "it already played this session. Run sessionStorage.clear() and refresh";
  return null;
}

// Locking
export function lockScroll() {
  const root = document.documentElement;
  const previous = root.style.overflow;
  let released = false;
  scrollLocks += 1;
  root.style.overflow = "hidden";
  lenis?.stop();
  return () => {
    if (released) return;
    released = true;
    scrollLocks -= 1;
    root.style.overflow = previous;
    if (scrollLocks === 0) lenis?.start();
  };
}

// Release
let introReleased = !shouldPlayIntro();
const introWaiters = new Set();

export function releaseIntro() {
  introReleased = true;
  // Context
  setTimeout(() => {
    introWaiters.forEach((fn) => fn());
    introWaiters.clear();
  }, 0);
}

// Waiting
export function afterIntro(fn) {
  if (introReleased) {
    fn();
    return undefined;
  }
  introWaiters.add(fn);
  return () => introWaiters.delete(fn);
}

export function scrollToTop(immediate = false) {
  if (lenis) {
    lenis.scrollTo(0, immediate ? { immediate: true } : { duration: 1.2 });
  } else {
    window.scrollTo(0, 0);
  }
}

/* Entrance */

export function revealPage(root) {
  if (!root || prefersReducedMotion()) return undefined;

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    root.querySelectorAll("[data-split]").forEach((el) => {
      // Wrapping
      const split = SplitText.create(el, { type: "words" });
      tl.from(
        split.words,
        { yPercent: 55, opacity: 0, duration: 0.9, stagger: 0.07, clearProps: "transform,opacity" },
        0.05
      );
    });

    // Cards
    const fades = root.querySelectorAll(".reveal-fade");
    if (fades.length) {
      tl.from(fades, { opacity: 0, duration: 0.45, ease: "power1.out", clearProps: "opacity" }, 0);
    }

    const items = root.querySelectorAll(".reveal");
    if (items.length) {
      tl.from(
        items,
        { y: 28, opacity: 0, duration: 0.9, stagger: 0.09, clearProps: "transform,opacity" },
        0.1
      );
    }
  }, root);

  return () => ctx.revert();
}

/* Parallax */

export function parallaxPortrait() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (prefersReducedMotion() || !fine.matches) return undefined;

  const figure = document.querySelector(".portrait-figure");
  const back = document.querySelectorAll(".portrait-glow, .portrait-disc");
  if (!figure) return undefined;

  const figX = gsap.quickTo(figure, "x", { duration: 0.9, ease: "power3.out" });
  const figY = gsap.quickTo(figure, "y", { duration: 0.9, ease: "power3.out" });
  const backX = back.length ? gsap.quickTo(back, "x", { duration: 1.2, ease: "power3.out" }) : null;
  const backY = back.length ? gsap.quickTo(back, "y", { duration: 1.2, ease: "power3.out" }) : null;

  const onMove = (event) => {
    const nx = event.clientX / window.innerWidth - 0.5;
    const ny = event.clientY / window.innerHeight - 0.5;
    figX(nx * 22);
    figY(ny * 16);
    backX?.(nx * -12);
    backY?.(ny * -9);
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  return () => {
    window.removeEventListener("pointermove", onMove);
    gsap.killTweensOf([figure, ...back]);
    gsap.set([figure, ...back], { clearProps: "transform" });
  };
}
