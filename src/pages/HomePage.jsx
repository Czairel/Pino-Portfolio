import { useEffect } from "react";
import portrait from "../assets/Pic.webp";
import ButtonLink from "../components/ButtonLink.jsx";
import Container from "../components/Container.jsx";
import Eyebrow from "../components/Eyebrow.jsx";
import Icon from "../components/Icon.jsx";
import { profile } from "../data.js";
import { parallaxPortrait } from "../lib/motion.js";

// Keeps the last two words (for example "F. Pino") together on one line
function HeroName({ name }) {
  const words = name.split(" ");
  if (words.length < 3) return name;
  return (
    <>
      {words.slice(0, -2).join(" ")} <span className="whitespace-nowrap">{words.slice(-2).join(" ")}</span>
    </>
  );
}

export default function HomePage() {
  useEffect(() => parallaxPortrait(), []);

  return (
    <Container
      as="section"
      aria-labelledby="hero-title"
      className="hero-grid relative grid items-center gap-8 overflow-x-clip py-8 md:py-14 lg:min-h-[calc(100svh-6rem)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-16"
    >
      <div>
        <Eyebrow>
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(57,169,255,0.18),0_0_14px_rgba(57,169,255,0.8)]"
          />
          Hello, I'm
        </Eyebrow>
        <h1
          id="hero-title"
          data-split
          className="font-display text-[2.6rem] leading-none font-semibold tracking-[-0.035em] sm:text-6xl lg:text-7xl xl:text-[5.2rem]"
        >
          <HeroName name={profile.name} />
        </h1>
        <p className="gradient-text reveal mt-3 w-fit font-display text-2xl font-medium tracking-[-0.02em] sm:text-3xl lg:text-4xl">
          {profile.role}
        </p>
        <p className="reveal mt-5 max-w-[44ch] text-lg leading-relaxed text-ink-muted sm:text-xl">
          {profile.tagline}
        </p>

        <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/projects" className="w-full sm:w-auto">
            View my work
            <Icon name="arrowRight" size={18} className="transition-transform group-hover:translate-x-1" />
          </ButtonLink>
          <ButtonLink to="/contact" variant="ghost" className="w-full sm:w-auto">
            Contact
          </ButtonLink>
        </div>
      </div>

      <div className="reveal order-first grid place-items-center lg:order-none">
        <div className="relative isolate aspect-square w-[min(72%,290px)] md:w-[min(60%,380px)] lg:w-[min(100%,470px)]">
          <span className="portrait-glow" aria-hidden="true" />
          <span className="portrait-disc" aria-hidden="true" />
          <span className="portrait-orbit" aria-hidden="true" />
          <span className="portrait-ring" aria-hidden="true" />
          <span className="portrait-figure absolute inset-0 block">
            <img
              src={portrait}
              width="497"
              height="502"
              alt={`Portrait of ${profile.shortName}`}
              fetchPriority="high"
              className="portrait-photo"
            />
          </span>
        </div>
      </div>
    </Container>
  );
}
