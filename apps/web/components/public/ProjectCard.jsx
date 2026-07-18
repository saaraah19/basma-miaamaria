import Link from "next/link";
import Image from "next/image";
import { cldUrl } from "@/lib/cloudinary-url";
import "./ProjectCard.css";

export default function ProjectCard({ project, priority = false }) {
  const cover = project.images?.find((img) => img.isCover) ?? project.images?.[0];

  return (
    <Link href={`/projects/${project.slug}`} className="project-card">
      {cover ? (
        <Image
          src={cldUrl(cover.url, { w: 600 })}
          alt={`${project.title} — ${project.category}`}
          width={600}
          height={450}
          className="project-card-image"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      ) : (
        <div className="project-card-no-image">📷 Aucune image</div>
      )}
      <div className="project-overlay">
        <div className="project-overlay-content">
          <h3>{project.title}</h3>
          <p>{project.category}</p>
          <span className="project-view-btn">Voir le projet</span>
        </div>
      </div>
    </Link>
  );
}
