import { useEffect, useLayoutEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { profile } from "../data.js";
import { afterIntro, revealPage, scrollToTop, useSmoothScroll } from "../lib/motion.js";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import ParticlesBackground from "./ParticlesBackground.jsx";

const pageTitles = {
  "/": `${profile.shortName} | ${profile.role}`,
  "/about": `About | ${profile.shortName}`,
  "/projects": `Projects | ${profile.shortName}`,
  "/contact": `Contact | ${profile.shortName}`,
};

// Header, page content and Footer. Shared by every route
export default function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const lastPath = useRef(pathname);
  useSmoothScroll();

  // Entrance animation
  useLayoutEffect(() => {
    let cleanup;
    const cancel = afterIntro(() => {
      cleanup = revealPage(mainRef.current);
    });
    return () => {
      cancel?.();
      cleanup?.();
    };
  }, [pathname]);

  useEffect(() => {
    scrollToTop(true);
    document.title = pageTitles[pathname] ?? `Page not found | ${profile.shortName}`;

    // After a page change, move focus to the content so keyboard and screen reader users start there
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      mainRef.current?.focus({ preventScroll: true });
    }
  }, [pathname]);

  // "#main" would break hash routing, so focus the content ourselves
  const skipToContent = (event) => {
    event.preventDefault();
    mainRef.current?.focus();
  };

  return (
    <div className="flex min-h-svh flex-col">
      <ParticlesBackground />
      <a
        href="#main"
        onClick={skipToContent}
        className="fixed top-3 left-3 z-200 -translate-y-[200%] rounded-full bg-white px-5 py-3 font-semibold text-canvas focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
