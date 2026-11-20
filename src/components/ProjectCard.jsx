import { spotlight } from "../lib/spotlight.js";
import { textLinkClass } from "../lib/ui.js";
import Icon from "./Icon.jsx";

// One card per project. All fields come from data.js
export default function ProjectCard({ project }) {
  const hasLinks = project.live || project.repo;

  return (
    <article
      onPointerMove={spotlight}
      className="card reveal group rounded-[28px] p-3 transition-[translate,box-shadow,border-color] duration-500 ease-smooth hover:-translate-y-1 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_60px_-28px_rgba(20,86,216,0.55)]"
    >
      <div
        className={`tone-${project.tone} relative aspect-[16/10] overflow-hidden rounded-[18px] border border-white/10`}
      >
        <span
          aria-hidden="true"
          className="absolute top-3.5 left-4 z-10 font-display text-sm font-semibold tracking-[0.12em] text-white/85 [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]"
        >
          {project.id}
        </span>
        <img
          src={project.image}
          alt={project.imageAlt}
          loading="lazy"
          style={{ "--shot-scale": project.zoom ?? 1 }}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-smooth [transform:scale(var(--shot-scale,1))] group-hover:[transform:scale(calc(var(--shot-scale,1)_+_0.05))]"
        />
      </div>

      <div className="px-2 pt-5 pb-2">
        {project.tags.length > 0 && (
          <ul aria-label="Technologies" className="mb-3 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-line-strong bg-white/4 px-3 py-1 text-sm font-medium text-ink-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
        <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">{project.title}</h2>
        <p className="mt-2 text-base leading-relaxed text-ink-muted">{project.description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-6">
          {project.live && (
            <a className={textLinkClass} href={project.live} target="_blank" rel="noopener noreferrer">
              Live site
              <Icon name="arrowUpRight" size={16} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {project.repo && (
            <a className={textLinkClass} href={project.repo} target="_blank" rel="noopener noreferrer">
              Source code
              <Icon name="arrowUpRight" size={16} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {!hasLinks && (
            <span className="inline-flex min-h-8 items-center rounded-full border border-dashed border-line-strong px-3.5 text-sm font-medium text-ink-faint">
              {project.badge ?? "Coming soon"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}