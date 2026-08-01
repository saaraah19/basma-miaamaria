import { getProjects, getCategories } from "@/lib/api-server";
import ProjectsFilterGrid from "@/components/public/ProjectsFilterGrid";
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

  const [projects, categories] = await Promise.all([
    getProjects().catch(() => []),
    getCategories().catch(() => []),
  ]);

  const categoryNames = categories.map((c) => c.name);
  const activeCategory = category && categoryNames.includes(category) ? category : ALL_LABEL;

  return (
    <div className="projects-page">
      <h1 className="projects-page-title">Nos Projets</h1>

      <ProjectsFilterGrid
        projects={projects}
        categoryNames={categoryNames}
        activeCategory={activeCategory}
      />
    </div>
  );
}