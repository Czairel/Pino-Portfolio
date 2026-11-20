import ButtonLink from "../components/ButtonLink.jsx";
import Container from "../components/Container.jsx";
import Icon from "../components/Icon.jsx";
import SectionHead from "../components/SectionHead.jsx";

export default function NotFoundPage() {
  return (
    <Container
      as="section"
      aria-labelledby="notfound-title"
      className="flex min-h-[60svh] flex-col items-start justify-center py-12"
    >
      <SectionHead id="notfound-title" eyebrow="404" title="Page not found" className="mb-6" />
      <p className="reveal mb-8 max-w-[44ch] text-lg text-ink-muted">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <ButtonLink to="/" className="reveal w-full sm:w-auto">
        Return home
        <Icon name="arrowRight" size={18} className="transition-transform group-hover:translate-x-1" />
      </ButtonLink>
    </Container>
  );
}
