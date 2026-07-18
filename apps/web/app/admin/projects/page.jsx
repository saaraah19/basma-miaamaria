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
} from "@/lib/admin-queries";
import "./projects.css";

function ProjectManagerContent() {
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [selected, setSelected] = useState(null);

  const { data: projects = [], isLoading } = useProjectsQuery();
  const { data: selectedProject } = useProjectQuery(selected);
  const deleteProject = useDeleteProject();

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

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        {isLoading ? (
          <p className="projects-loading">Chargement…</p>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: "2rem" }}>🏗️</p>
            <p>Aucun projet pour l&apos;instant.</p>
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
              {projects.map((p) => (
                <ProjectRow
                  key={p.id}
                  project={p}
                  isSelected={selected === p.id}
                  selectedProject={selected === p.id ? selectedProject : null}
                  onToggleImages={() => setSelected(selected === p.id ? null : p.id)}
                  onEdit={() => { setEditProject(p); setShowForm(true); }}
                  onDelete={() => setToDelete(p)}
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

function ProjectRow({ project, isSelected, selectedProject, onToggleImages, onEdit, onDelete }) {
  return (
    <>
      <tr style={{ background: isSelected ? "var(--color-hover)" : undefined }}>
        <td style={{ fontWeight: 500, paddingLeft: "1.5rem" }}>{project.title}</td>
        <td><span className="badge badge-gray">{project.category}</span></td>
        <td style={{ color: "var(--color-muted)" }}>{project.images?.length ?? 0}</td>
        <td>
          <span className={`badge ${project.isVisible ? "badge-green" : "badge-gray"}`}>
            {project.isVisible ? "Visible" : "Masqué"}
          </span>
        </td>
        <td>
          <div className="row-actions">
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
