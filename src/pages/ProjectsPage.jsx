import Container from "../components/Container.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import SectionHead from "../components/SectionHead.jsx";
import { projects } from "../data.js";

export default function ProjectsPage() {
  return (
    <Container as="section" aria-labelledby="projects-title" className="py-8 pb-16 md:py-14 md:pb-24">
      <SectionHead id="projects-title" eyebrow="My work" title="Projects" className="mb-8 md:mb-12" />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Container>
  );
}
