import Link from "next/link";
import { getSection, getProjects } from "@/lib/api-server";
import { sanitize } from "@/lib/sanitize";
import ProjectCard from "./ProjectCard";
import "./ProjectsSection.css";

export default async function ProjectsSection() {
  const [home, projects] = await Promise.all([
    getSection("home").catch(() => ({})),
    getProjects().catch(() => []),
  ]);

  const title = home?.projects_title?.value ?? "Nos Projets";
  const displayed = projects.slice(0, 4);

  return (
    <section className="projects-section">
      <h2 className="projects-title" dangerouslySetInnerHTML={{ __html: sanitize(title) }} />

      <div className="projects-grid">
        {displayed.map((project, index) => (
          <ProjectCard key={project.id} project={project} priority={index === 0} />
        ))}
      </div>

      {projects.length > 4 && (
        <Link href="/projects">
          <button className="projects-see-all">Voir tous les projets</button>
        </Link>
      )}
    </section>
  );
}
