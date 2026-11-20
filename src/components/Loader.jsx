import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import logo from "../assets/Logo.webp";
import { buildBoard } from "../lib/circuit.js";
import { lockScroll, markIntroSeen, prefersReducedMotion, releaseIntro } from "../lib/motion.js";
import "./loader.css";

/* Intro */

const PULSE = 64; // Length
const SPEED = 0.6; // Speed
const CHIP_OFF = "0 0 0 1px rgba(93,180,255,0.18), 0 0 0 0 rgba(57,169,255,0)";
const CHIP_FLASH = "0 0 0 1px rgba(93,180,255,0.95), 0 0 80px 8px rgba(57,169,255,0.6)";
const CHIP_SETTLED = "0 0 0 1px rgba(93,180,255,0.55), 0 0 40px 2px rgba(57,169,255,0.3)";

function Board({ board, W, H }) {
  const { cw, ch, cx, cy, traces } = board;
  return (
    <div className="ld-board" aria-hidden="true">
      <div className="ld-dots" />
      <svg className="ld-svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {traces.map((t, i) => (
          <path key={`t${i}`} className="ld-trace" d={t.d} data-delay={t.delay} />
        ))}
        {traces.map((t, i) => (
          <g key={`p${i}`}>
            <path className="ld-pulse ld-pulse-glow" d={t.d} data-delay={t.delay} />
            <path className="ld-pulse ld-pulse-core" d={t.d} data-delay={t.delay} />
          </g>
        ))}
        {traces.map((t, i) => (
          <circle key={`v${i}`} className="ld-via" cx={t.ex} cy={t.ey} r="0" data-delay={t.delay} />
        ))}
      </svg>
      <div
        className="ld-chip"
        style={{ width: cw, height: ch, left: cx - cw / 2, top: cy - ch / 2 }}
      >
        <img className="ld-logo" src={logo} width="197" height="96" alt="" />
      </div>
      <p className="ld-status" style={{ top: cy + ch / 2 + 28 }}>
        <i className="ld-led" />
        <span className="ld-text">000%</span>
      </p>
    </div>
  );
}

export default function Loader({ onDone }) {
  const rootRef = useRef(null);
  const skipRef = useRef(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const [view] = useState(() => {
    const W = document.documentElement.clientWidth;
    const H = window.innerHeight;
    return { W, H, board: buildBoard(W, H) };
  });

  useLayoutEffect(() => {
    const root = rootRef.current;
    const unlock = lockScroll();
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const all = (selector) => gsap.utils.toArray(selector, root);
      const traces = all(".ld-trace");
      const pulses = all(".ld-pulse");
      const vias = all(".ld-via");
      const chips = all(".ld-chip");
      const logos = all(".ld-logo");
      const statuses = all(".ld-status");
      const texts = all(".ld-text");
      const leds = all(".ld-led");
      const top = root.querySelector(".ld-top");
      const bottom = root.querySelector(".ld-bot");
      const beam = root.querySelector(".ld-beam");

      // Initial
      traces.forEach((el) => {
        const len = el.getTotalLength();
        el.style.strokeDasharray = len;
        el.style.strokeDashoffset = len;
      });
      pulses.forEach((el) => {
        const len = el.getTotalLength();
        el.style.strokeDasharray = `${PULSE} ${len}`;
        el.style.strokeDashoffset = -len;
      });
      gsap.set(chips, { opacity: 0 });
      gsap.set(statuses, { opacity: 0 });
      gsap.set(beam, { scaleX: 0, opacity: 1 });

      const state = { v: 0, on: false };
      const paint = () => {
        const label = state.on ? "Online" : `${String(Math.round(state.v)).padStart(3, "0")}%`;
        texts.forEach((el) => {
          el.textContent = label;
        });
      };
      const own = (el) => Number(el.dataset.delay);

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        markIntroSeen();
        unlock();
        doneRef.current();
      };

      // Reduced
      if (prefersReducedMotion()) {
        gsap.set([...chips, ...statuses], { opacity: 1 }); // Visibility
        gsap.set(traces, { strokeDashoffset: 0 });
        gsap.set(vias, { attr: { r: 4 }, stroke: "#bfe4ff" });
        gsap.set(pulses, { opacity: 0 });
        gsap.set(beam, { opacity: 0 });
        gsap.set(root, { opacity: 0 });

        const calm = gsap.timeline({ defaults: { ease: "power1.inOut" }, onComplete: finish });
        calm
          .to(root, { opacity: 1, duration: 0.5 }, 0)
          .to(state, { v: 100, duration: 1, ease: "none", onUpdate: paint }, 0.3)
          .call(
            () => {
              state.on = true;
              paint();
            },
            null,
            1.3
          )
          .to(logos, { filter: "grayscale(0) brightness(1)", duration: 0.5 }, 1.3)
          .to(chips, { boxShadow: CHIP_SETTLED, duration: 0.6 }, 1.3)
          .to(traces, { stroke: "rgba(93,180,255,0.8)", duration: 0.5 }, 1.3)
          .to(
            leds,
            { backgroundColor: "#8fd0ff", boxShadow: "0 0 12px 3px rgba(57,169,255,0.9)", duration: 0.4 },
            1.3
          )
          .call(releaseIntro, null, 2.1)
          .to(root, { opacity: 0, duration: 0.6 }, 2.1);

        skipRef.current = () => calm.progress(1);
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power2.out" }, onComplete: finish });
      tl.timeScale(SPEED);

      // Draw
      tl.to(chips, { opacity: 1, duration: 0.5 }, 0.1)
        .to(statuses, { opacity: 1, duration: 0.4 }, 0.3)
        .to(state, { v: 100, duration: 1.45, ease: "none", onUpdate: paint }, 0.15)
        .to(
          traces,
          { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut", delay: (i, el) => own(el) },
          0.2
        )
        .to(
          vias,
          { attr: { r: 4 }, duration: 0.3, ease: "back.out(3)", delay: (i, el) => own(el) + 0.45 },
          0.2
        )

        // Pulse
        .to(
          pulses,
          { strokeDashoffset: PULSE, duration: 0.55, ease: "power1.in", delay: (i, el) => own(el) },
          0.8
        )

        // Power
        .call(
          () => {
            state.on = true;
            paint();
          },
          null,
          1.6
        )
        .to(logos, { filter: "grayscale(0) brightness(1)", duration: 0.3, ease: "power1.out" }, 1.6)
        .to(chips, { boxShadow: CHIP_FLASH, duration: 0.3 }, 1.6)
        .to(chips, { boxShadow: CHIP_SETTLED, duration: 0.5, ease: "power1.inOut" }, 1.9)
        .to(traces, { stroke: "rgba(93,180,255,0.8)", duration: 0.35 }, 1.6)
        .to(vias, { stroke: "#bfe4ff", duration: 0.3 }, 1.6)
        .to(
          leds,
          {
            backgroundColor: "#8fd0ff",
            boxShadow: "0 0 12px 3px rgba(57,169,255,0.9)",
            duration: 0.2,
          },
          1.6
        )
        .to(beam, { scaleX: 1, duration: 0.35, ease: "power3.out" }, 1.85)

        // Reveal
        .call(releaseIntro, null, 2.3)
        .to(top, { yPercent: -50, duration: 0.95, ease: "power4.inOut" }, 2.15)
        .to(bottom, { yPercent: 50, duration: 0.95, ease: "power4.inOut" }, 2.15)
        .to(beam, { opacity: 0, duration: 0.35, ease: "power1.in" }, 2.15);

      // Skip
      skipRef.current = () => tl.progress(1);
    }, root);

    const onKey = (event) => {
      if (event.key === "Escape") skipRef.current?.();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      ctx.revert();
      unlock();
    };
  }, []);

  const { W, H, board } = view;

  return (
    <div className="ld-root" ref={rootRef}>
      <p className="sr-only" role="status">
        Loading portfolio
      </p>
      <div className="ld-half ld-top">
        <Board board={board} W={W} H={H} />
      </div>
      <div className="ld-half ld-bot">
        <Board board={board} W={W} H={H} />
      </div>
      <div className="ld-beam" aria-hidden="true" />
      <button
        type="button"
        className="ld-skip"
        aria-label="Skip intro animation"
        onClick={() => skipRef.current?.()}
      >
        Skip
      </button>
    </div>
  );
}
