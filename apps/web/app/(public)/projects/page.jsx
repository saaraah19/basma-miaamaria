import Link from "next/link";
import { PROJECT_CATEGORIES } from "@bsma/shared";
import { getProjects } from "@/lib/api-server";
import ProjectCard from "@/components/public/ProjectCard";
import "./projects.css";

export const metadata = {
  title: "Nos Projets",
  description:
    "Découvrez le portfolio de Basma Miamaria : projets d'architecture, de décoration intérieure et de rénovation réalisés à Oran et en Algérie.",
  alternates: { canonical: "/projects" },
};

const ALL_LABEL = "Tous";

export default async function ProjectsPage({ searchParams }) {
  const { category } = await searchParams;
  const activeCategory = category && PROJECT_CATEGORIES.includes(category) ? category : ALL_LABEL;

  const projects = await getProjects().catch(() => []);
  const filtered =
    activeCategory === ALL_LABEL ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="projects-page">
      <h1 className="projects-page-title">Nos Projets</h1>

      <nav className="projects-filters" aria-label="Filtrer par catégorie">
        {[ALL_LABEL, ...PROJECT_CATEGORIES].map((cat) => {
          const href = cat === ALL_LABEL ? "/projects" : `/projects?category=${encodeURIComponent(cat)}`;
          return (
            <Link
              key={cat}
              href={href}
              className={activeCategory === cat ? "active" : ""}
              aria-current={activeCategory === cat ? "true" : undefined}
            >
              {cat}
            </Link>
          );
        })}
      </nav>

      {filtered.length === 0 ? (
        <p className="projects-empty">Aucun projet dans cette catégorie pour le moment.</p>
      ) : (
        <div className="projects-grid">
          {filtered.map((project, index) => (
            <ProjectCard key={project.id} project={project} priority={index < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
