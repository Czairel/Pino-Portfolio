import { profile } from "../data.js";
import { scrollToTop } from "../lib/motion.js";
import { textLinkClass } from "../lib/ui.js";
import Container from "./Container.jsx";
import Icon from "./Icon.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-canvas/60">
      <Container className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-faint sm:text-base">
          © {profile.year} {profile.shortName}. All rights reserved.
        </p>
        <button type="button" className={`${textLinkClass} -ml-1 self-start px-1 sm:ml-0 sm:self-auto`} onClick={() => scrollToTop()}>
          Back to top
          <Icon name="arrowUp" size={16} className="transition-transform group-hover:-translate-y-0.5" />
        </button>
      </Container>
    </footer>
  );
}
