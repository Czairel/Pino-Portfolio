import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

/*
  Should the site honour the visitor's "reduce motion" setting (on Windows:
  Accessibility > Visual effects > Animation effects turned off)?
    false: the full animation plays for everyone (the intro still has Skip / Esc).
    true:  those visitors get a calm, fade-only intro and no movement at all.
  Some people turn that setting on because motion makes them dizzy, which is
  the reason to leave this true if you want to be safe for them.
*/
export const RESPECT_REDUCED_MOTION = false;

const reducedMotionQuery = () => window.matchMedia("(prefers-reduced-motion: reduce)");
export const prefersReducedMotion = () => RESPECT_REDUCED_MOTION && reducedMotionQuery().matches;

// Lets style.css switch off hover movement and the orbiting ring the same way
if (prefersReducedMotion()) document.documentElement.dataset.reduceMotion = "";

/* ---------- Lenis smooth scrolling (driven by GSAP's ticker) ---------- */

let lenis = null;

export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const instance = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis = instance;
    if (scrollLocks > 0) instance.stop(); // intro still playing

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

/* ---------- Intro loader hooks ---------- */

const INTRO_KEY = "intro-seen";
let scrollLocks = 0;

const introSeen = () => {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false; // storage blocked: just play it
  }
};

export function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* storage blocked: the intro will replay next visit, which is harmless */
  }
}

// Play the intro once per browser session. Reduced-motion users get a calm,
// fade-only version of it (see Loader.jsx) instead of none at all.
export const shouldPlayIntro = () => !introSeen();

// Why the intro was skipped (shown in the console during development), or null.
export function introSkipReason() {
  if (introSeen()) return "it already played this session. Run sessionStorage.clear() and refresh";
  return null;
}

// Block scrolling while the loader covers the page. Lenis may not exist yet
// (it starts after first paint), so useSmoothScroll checks scrollLocks too.
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

// The page entrance waits for the loader to open, so nobody misses it.
let introReleased = !shouldPlayIntro();
const introWaiters = new Set();

export function releaseIntro() {
  introReleased = true;
  // Called from inside the loader's GSAP timeline, so hop out of its context first.
  // Otherwise GSAP files the page's SplitText under the loader and reverts it
  // (re-wrapping the heading) the moment the loader unmounts.
  setTimeout(() => {
    introWaiters.forEach((fn) => fn());
    introWaiters.clear();
  }, 0);
}

// Runs fn now if the intro is over, otherwise when it opens. Returns a canceller.
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

/* ---------- GSAP: staggered page entrance ---------- */
// Headings marked [data-split] reveal word by word; everything marked
// .reveal fades up in document order. Returns a cleanup function.

export function revealPage(root) {
  if (!root || prefersReducedMotion()) return undefined;

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    root.querySelectorAll("[data-split]").forEach((el) => {
      // Split headings must not use text-wrap: balance (see style.css): SplitText
      // cannot keep the balanced wrap, so the heading would re-wrap mid-entrance.
      const split = SplitText.create(el, { type: "words" });
      tl.from(
        split.words,
        { yPercent: 55, opacity: 0, duration: 0.9, stagger: 0.07, clearProps: "transform,opacity" },
        0.05
      );
    });

    // Cards only fade in, all together and immediately: no sliding, no stagger delay
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

/* ---------- GSAP: hero portrait follows the pointer (depth parallax) ---------- */

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
