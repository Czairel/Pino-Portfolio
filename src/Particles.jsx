import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion.js";

// tsParticles is loaded on demand so it never blocks the first paint.
export default function ParticlesBackground() {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    let cancelled = false;
    let container;

    (async () => {
      const [{ tsParticles }, { loadSlim }] = await Promise.all([
        import("@tsparticles/engine"),
        import("@tsparticles/slim"),
      ]);
      await loadSlim(tsParticles);
      if (cancelled || !ref.current) return;

      const small = window.matchMedia("(max-width: 720px)").matches;

      container = await tsParticles.load({
        element: ref.current,
        options: {
          fullScreen: { enable: false },
          fpsLimit: 60,
          detectRetina: true,
          pauseOnBlur: true,
          pauseOnOutsideViewport: true,
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: small ? 26 : 58, density: { enable: true, width: 1000, height: 1000 } },
            paint: { fill: { enable: true, color: { value: "#5db4ff" } } },
            opacity: { value: { min: 0.15, max: 0.5 } },
            size: { value: { min: 1, max: 2.4 } },
            shape: { type: "circle" },
            links: { enable: true, distance: 150, color: "#39a9ff", opacity: 0.13, width: 1 },
            move: {
              enable: true,
              speed: 0.35,
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "out" },
            },
          },
          interactivity: {
            detectsOn: "window",
            events: { onHover: { enable: true, mode: "grab" } },
            modes: { grab: { distance: 170, links: { opacity: 0.35 } } },
          },
        },
      });

      if (cancelled) container?.destroy();
    })();

    return () => {
      cancelled = true;
      container?.destroy();
    };
  }, []);

  return <div ref={ref} className="particles" aria-hidden="true" />;
}
