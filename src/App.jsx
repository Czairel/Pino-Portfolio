import { Link, NavLink, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import logo from "../Logo.webp";
import portrait from "../Pic.webp";
import { links, profile, projects } from "./data.js";
import Loader from "./Loader.jsx";
import ParticlesBackground from "./Particles.jsx";
import {
  afterIntro,
  introSkipReason,
  parallaxPortrait,
  revealPage,
  scrollToTop,
  shouldPlayIntro,
  useSmoothScroll,
} from "./motion.js";

/* Helpers */

// Name
function HeroName({ name }) {
  const words = name.split(" ");
  if (words.length < 3) return name;
  return (
    <>
      {words.slice(0, -2).join(" ")} <span className="nowrap">{words.slice(-2).join(" ")}</span>
    </>
  );
}

const iconPaths = {
  github: (
    <>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  mail: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </>
  ),
  arrowUp: (
    <>
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </>
  ),
  accessibility: (
    <>
      <circle cx="16" cy="4" r="1" />
      <path d="m18 19 1-7-6 1" />
      <path d="m5 8 3-3 5.5 3-2.36 3.5" />
      <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
      <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
    </>
  ),
  pointer: (
    <>
      <path d="M14 4.1 12 6" />
      <path d="m5.1 8-2.9-.8" />
      <path d="m6 12-1.9 2" />
      <path d="M7.2 2.2 8 5.1" />
      <path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" />
    </>
  ),
};

function Icon({ name, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {iconPaths[name]}
    </svg>
  );
}

// Spotlight
function spotlight(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

// Channels
function getChannels() {
  const channels = [];
  if (links.github) {
    channels.push({
      key: "github",
      label: "GitHub",
      value: links.github.replace(/^https?:\/\//, ""),
      href: links.github,
      icon: "github",
      external: true,
    });
  }
  if (links.linkedin) {
    channels.push({
      key: "linkedin",
      label: "LinkedIn",
      value: links.linkedin.replace(/^https?:\/\//, ""),
      href: links.linkedin,
      icon: "linkedin",
      external: true,
    });
  }
  if (links.email) {
    channels.push({
      key: "email",
      label: "Email",
      value: links.email,
      href: `mailto:${links.email}`,
      icon: "mail",
      external: false,
    });
  }
  return channels;
}

function SectionHead({ eyebrow, title, children }) {
  return (
    <div className="section-head">
      <p className="eyebrow reveal">
        {eyebrow}
      </p>
      <h1 className="section-title" data-split>
        {title}
      </h1>
      {children}
    </div>
  );
}

/* Layout */

const pageTitles = {
  "/": `${profile.shortName} | ${profile.role}`,
  "/about": `About | ${profile.shortName}`,
  "/projects": `Projects | ${profile.shortName}`,
  "/contact": `Contact | ${profile.shortName}`,
};

function Layout() {
  const { pathname } = useLocation();
  useSmoothScroll();

  // Entrance
  useLayoutEffect(() => {
    let cleanup;
    const cancel = afterIntro(() => {
      cleanup = revealPage(document.getElementById("main"));
    });
    return () => {
      cancel?.();
      cleanup?.();
    };
  }, [pathname]);

  useEffect(() => {
    scrollToTop(true);
    document.title = pageTitles[pathname] ?? `Page not found | ${profile.shortName}`;
  }, [pathname]);

  // Accessibility
  const skipToContent = (event) => {
    event.preventDefault();
    document.getElementById("main")?.focus();
  };

  return (
    <>
      <ParticlesBackground />
      <a className="skip-link" href="#main" onClick={skipToContent}>
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label={`${profile.shortName}, home`}>
            <img src={logo} width="197" height="96" alt="Czai logo" />
          </Link>
          <nav className="main-nav" aria-label="Main navigation">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About Me</NavLink>
            <NavLink to="/projects">Projects</NavLink>
          </nav>
          <Link className="btn btn-primary btn-sm" to="/contact">
            Hire Me
          </Link>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <p>
            © {profile.year} {profile.shortName}. All rights reserved.
          </p>
          <div className="footer-end">
            <button
              className="text-link"
              type="button"
              onClick={() => scrollToTop()}
            >
              Back to top <Icon name="arrowUp" size={16} />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}

/* Pages */

function HomePage() {
  useEffect(() => parallaxPortrait(), []);

  return (
    <section className="container hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow reveal">
          <span className="eyebrow-dot" aria-hidden="true" />
          Hello, I'm
        </p>
        <h1 id="hero-title" className="hero-name" data-split>
          <HeroName name={profile.name} />
        </h1>
        <p className="hero-role gradient-text reveal">
          {profile.role}
        </p>
        <p className="lede reveal">
          {profile.tagline}
        </p>

        <div className="cta-row reveal">
          <Link className="btn btn-primary" to="/projects">
            View my work <Icon name="arrowRight" size={18} />
          </Link>
          <Link className="btn btn-ghost" to="/contact">
            Contact
          </Link>
        </div>

      </div>

      <div className="hero-visual reveal">
        <div className="portrait">
          <span className="portrait-glow" aria-hidden="true" />
          <span className="portrait-disc" aria-hidden="true" />
          <span className="portrait-orbit" aria-hidden="true" />
          <span className="portrait-ring" aria-hidden="true" />
          <span className="portrait-figure">
            <img
              src={portrait}
              width="497"
              height="502"
              alt={`Portrait of ${profile.shortName}`}
              fetchPriority="high"
            />
          </span>
        </div>
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <section className="container page about" aria-labelledby="about-title">
      <div className="about-photo reveal">
        <img
          src={portrait}
          width="497"
          height="502"
          alt={`Portrait of ${profile.shortName}`}
          loading="lazy"
        />
      </div>

      <div className="about-copy">
        <p className="eyebrow reveal">
          About me
        </p>
        <h1 id="about-title" className="section-title" data-split>
          A little about me
        </h1>
        {profile.about.map((paragraph) => (
          <p key={paragraph} className="body-lg reveal">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  const hasLinks = project.live || project.repo;
  return (
    <article
      className="card project-card reveal-fade"
     
      onPointerMove={spotlight}
    >
      <div className={`project-preview tone-${project.tone}`} aria-hidden="true">
        <span className="project-number">{project.id}</span>
        {project.image ? (
          <img
            className="project-shot"
            src={project.image}
            alt=""
            loading="lazy"
            style={{ "--shot-scale": project.zoom ?? 1 }}
          />
        ) : (
          <div className="mock">
            <div className="mock-bar">
              <i />
              <i />
              <i />
            </div>
            <div className="mock-body">
              <b className="mock-line w60" />
              <b className="mock-line w85" />
              <b className="mock-line w40" />
              <div className="mock-tiles">
                <b />
                <b />
                <b />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="project-body">
        {project.tags.length > 0 && (
          <ul className="tags" aria-label="Technologies">
            {project.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        <div className="project-links">
          {project.live && (
            <a className="text-link" href={project.live} target="_blank" rel="noopener noreferrer">
              Live site <Icon name="arrowUpRight" size={16} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {project.repo && (
            <a className="text-link" href={project.repo} target="_blank" rel="noopener noreferrer">
              Source code <Icon name="arrowUpRight" size={16} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {!hasLinks && <span className="badge">{project.badge ?? "Coming soon"}</span>}
        </div>
      </div>
    </article>
  );
}

function ProjectsPage() {
  return (
    <section className="container page page-top" aria-labelledby="projects-title">
      <div className="section-head">
        <p className="eyebrow reveal">
          My work
        </p>
        <h1 id="projects-title" className="section-title" data-split>
          Projects
        </h1>
      </div>
      <div className="project-grid">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

function ContactPage() {
  const channels = getChannels();
  return (
    <section className="container page contact" aria-labelledby="contact-title">
      <div className="contact-copy">
        <p className="eyebrow reveal">
          Get in touch
        </p>
        <h1 id="contact-title" className="section-title" data-split>
          Contact Me
        </h1>
        <p className="body-lg reveal">
          Interested in working together? Reach out through any of the links
          and I'll get back to you.
        </p>
      </div>

      <div className="contact-panel reveal">
        <p className="panel-label">Find me online</p>
        <ul className="contact-list">
          {channels.map((c) => (
            <li key={c.key}>
              <a
                className="card contact-card"
                href={c.href}
                onPointerMove={spotlight}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span className="principle-icon">
                  <Icon name={c.icon} />
                </span>
                <span className="contact-text">
                  <span className="contact-label">{c.label}</span>
                  <span className="contact-value">{c.value}</span>
                </span>
                <span className="contact-arrow">
                  <Icon name="arrowUpRight" size={18} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section className="container page notfound">
      <SectionHead eyebrow="404" title="Page not found" />
      <Link className="btn btn-primary reveal" to="/">
        Return home <Icon name="arrowRight" size={18} />
      </Link>
    </section>
  );
}

export default function App() {
  const [intro, setIntro] = useState(shouldPlayIntro);

  useEffect(() => {
    if (import.meta.env.DEV && !intro) {
      const why = introSkipReason();
      if (why) console.info(`[intro] skipped: ${why}.`);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      {intro && <Loader onDone={() => setIntro(false)} />}
    </>
  );
}
