import BodyText from "../components/BodyText.jsx";
import Container from "../components/Container.jsx";
import Icon from "../components/Icon.jsx";
import SectionHead from "../components/SectionHead.jsx";
import { links } from "../data.js";
import { spotlight } from "../lib/spotlight.js";

// Only channels that have a value in data.js are shown
function getChannels() {
  const strip = (url) => url.replace(/^https?:\/\//, "");
  const channels = [];
  if (links.github) {
    channels.push({ key: "github", label: "GitHub", value: strip(links.github), href: links.github, icon: "github", external: true });
  }
  if (links.linkedin) {
    channels.push({ key: "linkedin", label: "LinkedIn", value: strip(links.linkedin), href: links.linkedin, icon: "linkedin", external: true });
  }
  if (links.email) {
    channels.push({ key: "email", label: "Email", value: links.email, href: `mailto:${links.email}`, icon: "mail", external: false });
  }
  return channels;
}

export default function ContactPage() {
  const channels = getChannels();

  return (
    <Container
      as="section"
      aria-labelledby="contact-title"
      className="grid gap-8 py-8 pb-16 md:py-14 lg:min-h-[calc(100svh-6rem)] lg:grid-cols-2 lg:items-center lg:gap-20"
    >
      <div>
        <SectionHead id="contact-title" eyebrow="Get in touch" title="Contact Me" />
        <BodyText>
          Interested in working together? Reach out through any of the links and I'll get back to you.
        </BodyText>
      </div>

      <div className="reveal panel p-3 sm:p-4">
        <h2 className="mx-2 mt-1 mb-4 text-sm font-semibold tracking-[0.16em] text-ink-faint uppercase">
          Find me online
        </h2>
        <ul className="grid gap-3">
          {channels.map((channel) => (
            <li key={channel.key}>
              <a
                href={channel.href}
                onPointerMove={spotlight}
                {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="card group flex min-h-20 items-center gap-4 p-4 hover:-translate-y-0.5 sm:p-5"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-[14px] border border-accent/30 bg-accent/10 text-accent-text">
                  <Icon name={channel.icon} />
                </span>
                <span className="grid min-w-0 flex-1">
                  <span className="text-sm font-semibold tracking-[0.14em] text-ink-faint uppercase">
                    {channel.label}
                  </span>
                  <span className="font-display text-base font-medium [overflow-wrap:anywhere] sm:text-lg">
                    {channel.value}
                    {channel.external && <span className="sr-only"> (opens in a new tab)</span>}
                  </span>
                </span>
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong text-ink-muted transition duration-300 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-accent/50 group-hover:text-accent-text">
                  <Icon name="arrowUpRight" size={18} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
