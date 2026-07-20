import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/api-server";
import ProjectGalleryLoader from "@/components/public/ProjectGalleryLoader";
import "./project-detail.css";

async function loadProject(slug) {
  try {
    return await getProject(slug);
  } catch (err) {
    if (err.status === 404) return null;
    throw err; // real errors (API down) still surface as a proper error page
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) return {};

  const cover = project.images?.find((img) => img.isCover) ?? project.images?.[0];
  const description = project.description.slice(0, 155);

  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description,
      images: cover ? [{ url: cover.url }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) notFound();

  return (
    <div className="projects-page">
      <h1 className="projects-page-title">{project.title}</h1>
      <p className="projects-page-sub">{project.category}</p>

      <div className="project-detail">
<ProjectGalleryLoader images={project.images} projectTitle={project.title} />
        <div className="project-detail-info">
          <h2>Description</h2>
          <p>{project.description}</p>

          {(project.surface || project.duration || project.budget) && (
            <>
              <h3>Détails</h3>
              <ul>
                {project.surface && <li><strong>Surface :</strong> {project.surface}</li>}
                {project.duration && <li><strong>Durée :</strong> {project.duration}</li>}
                {project.budget && <li><strong>Budget :</strong> {project.budget}</li>}
              </ul>
            </>
          )}

          <Link href="/projects" className="btn-devis">← Retour aux projets</Link>
        </div>
      </div>
    </div>
  );
}
