import portrait from "../assets/Pic.webp";
import BodyText from "../components/BodyText.jsx";
import Container from "../components/Container.jsx";
import Eyebrow from "../components/Eyebrow.jsx";
import SectionHead from "../components/SectionHead.jsx";
import SkillCard from "../components/SkillCard.jsx";
import { spotlight } from "../lib/spotlight.js";
import { profile, skills } from "../data.js";

export default function AboutPage() {
  return (
    <>
      {/* Phones: title, photo, then text. Desktop: the photo keeps its full 4:5 size and the title and text sit centered beside it */}
      <Container
        as="section"
        aria-labelledby="about-title"
        className="grid gap-8 py-8 md:py-14 lg:grid-cols-[5fr_7fr] lg:gap-x-20 lg:gap-y-0"
      >
        <SectionHead id="about-title" eyebrow="About me" title="A little about me" className="lg:col-start-2 lg:self-end" />

        <div className="reveal photo-panel relative mx-auto aspect-[4/5] w-full max-w-64 overflow-hidden rounded-[28px] border border-line-strong sm:max-w-sm lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:max-w-[460px] lg:self-center">
          <img
            src={portrait}
            width="497"
            height="502"
            alt={`Portrait of ${profile.shortName}`}
            loading="lazy"
            className="absolute inset-0 size-full object-cover object-bottom"
          />
        </div>

        <div className="lg:col-start-2 lg:self-start">
          {profile.about.map((paragraph) => (
            <BodyText key={paragraph}>{paragraph}</BodyText>
          ))}
        </div>
      </Container>

      <Container as="section" aria-labelledby="skills-title" className="pt-4 pb-16 md:pb-24">
        <Eyebrow>What I work with</Eyebrow>
        <h2
          id="skills-title"
          className="reveal mb-7 font-display text-3xl leading-tight font-semibold tracking-[-0.02em] sm:text-4xl"
        >
          Skills
        </h2>
        <div onPointerMove={spotlight} className="card reveal grid gap-5 p-5 md:p-6">
          {skills.map((group) => (
            <SkillCard key={group.group} group={group} />
          ))}
        </div>
      </Container>
    </>
  );
}