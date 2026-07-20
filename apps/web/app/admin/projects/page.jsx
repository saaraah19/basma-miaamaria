"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProjectForm from "@/components/admin/projects/ProjectForm";
import ImageUploader from "@/components/admin/projects/ImageUploader";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";
import {
  useProjectsQuery,
  useProjectQuery,
  useDeleteProject,
  useUpdateProject,
} from "@/lib/admin-queries";
import "./projects.css";

function ProjectManagerContent() {
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const { data: projects = [], isLoading } = useProjectsQuery();
  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );
  const { data: selectedProject } = useProjectQuery(selected);
  const deleteProject = useDeleteProject();
  const updateProject = useUpdateProject();

  const handleDelete = async () => {
    await deleteProject.mutateAsync(toDelete.id);
    if (selected === toDelete.id) setSelected(null);
    setToDelete(null);
  };

  return (
    <>
      <div className="projects-header">
        <div>
          <span className="projects-header-label">Gestion des projets</span>
          <span className="projects-header-count">
            {projects.length} projet{projects.length !== 1 ? "s" : ""}
          </span>
        </div>
        <button className="btn-primary" onClick={() => { setEditProject(null); setShowForm(true); }}>
          + Nouveau projet
        </button>
      </div>

      <input
        className="admin-input"
        placeholder="Rechercher un projet (titre ou catégorie)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "1rem", maxWidth: "320px" }}
      />

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        {isLoading ? (
          <p className="projects-loading">Chargement…</p>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: "2rem" }}>🏗️</p>
            <p>{projects.length === 0 ? "Aucun projet pour l'instant." : "Aucun résultat pour cette recherche."}</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: "1.5rem" }}>Projet</th>
                <th>Catégorie</th>
                <th>Images</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => (
                <ProjectRow
                  key={p.id}
                  project={p}
                  isSelected={selected === p.id}
                  selectedProject={selected === p.id ? selectedProject : null}
                  onToggleImages={() => setSelected(selected === p.id ? null : p.id)}
                  onEdit={() => { setEditProject(p); setShowForm(true); }}
                  onDelete={() => setToDelete(p)}
                  onToggleVisibility={(project) =>
                    updateProject.mutate({ id: project.id, data: { isVisible: !project.isVisible } })
                  }
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <ProjectForm project={editProject} onClose={() => { setShowForm(false); setEditProject(null); }} />
      )}

      {toDelete && (
        <ConfirmModal
          title={`Supprimer "${toDelete.title}" ?`}
          message="Toutes les images liées seront également supprimées. Cette action est irréversible."
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}

function ProjectRow({ project, isSelected, selectedProject, onToggleImages, onEdit, onDelete, onToggleVisibility }) {
  const imageCount = project.images?.length ?? 0;
  const hasNoImages = imageCount === 0;

  return (
    <>
      <tr style={{ background: isSelected ? "var(--color-hover)" : undefined }}>
        <td style={{ fontWeight: 500, paddingLeft: "1.5rem" }}>
          {project.title}
          {hasNoImages && project.isVisible && (
            <span className="no-image-warning" title="Ce projet est visible mais n'a aucune image">
              ⚠️ Sans image
            </span>
          )}
        </td>
        <td><span className="badge badge-gray">{project.category}</span></td>
        <td style={{ color: "var(--color-muted)" }}>{imageCount}</td>
        <td>
          <button
            className={`badge-toggle ${project.isVisible ? "badge-green" : "badge-gray"}`}
            onClick={() => onToggleVisibility(project)}
            title={project.isVisible ? "Cliquer pour masquer" : "Cliquer pour rendre visible"}
          >
            {project.isVisible ? "Visible" : "Masqué"}
          </button>
        </td>
        <td>
          <div className="row-actions">
            {project.isVisible && (
              <a
                className="btn-secondary"
                style={{ fontSize: "0.775rem", padding: "0.4rem 0.75rem" }}
                href={`${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                🔗 Voir
              </a>
            )}
            <button
              className={isSelected ? "btn-primary" : "btn-secondary"}
              style={{ fontSize: "0.775rem", padding: "0.4rem 0.75rem" }}
              onClick={onToggleImages}
            >
              🖼 Images
            </button>
            <button className="btn-secondary" style={{ fontSize: "0.775rem", padding: "0.4rem 0.75rem" }} onClick={onEdit}>
              ✏️ Éditer
            </button>
            <button className="btn-danger" style={{ padding: "0.4rem 0.65rem" }} onClick={onDelete}>
              🗑
            </button>
          </div>
        </td>
      </tr>

      {isSelected && selectedProject && (
        <tr>
          <td colSpan={5} className="image-panel-cell">
            <p className="image-panel-label">Images — {selectedProject.title}</p>
            <ImageUploader projectId={project.id} images={selectedProject.images ?? []} />
          </td>
        </tr>
      )}
    </>
  );
}

export default function ProjectManagerPage() {
  return (
    <AdminLayout title="Projets">
      <ProjectManagerContent />
    </AdminLayout>
  );
}