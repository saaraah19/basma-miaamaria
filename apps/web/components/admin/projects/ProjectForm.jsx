"use client";

import { useState } from "react";
import { projectCreateSchema, PROJECT_CATEGORIES } from "@bsma/shared";
import { useCreateProject, useUpdateProject } from "@/lib/admin-queries";
import "./ProjectForm.css";

const EMPTY_FORM = {
  title: "",
  category: PROJECT_CATEGORIES[0],
  description: "",
  surface: "",
  duration: "",
  budget: "",
};

export default function ProjectForm({ project = null, onClose }) {
  const isEdit = Boolean(project);
  const [form, setForm] = useState(
    isEdit
      ? {
          title: project.title,
          category: project.category,
          description: project.description,
          surface: project.surface ?? "",
          duration: project.duration ?? "",
          budget: project.budget ?? "",
        }
      : EMPTY_FORM
  );
  const [fieldErrors, setFieldErrors] = useState({});

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const isPending = createProject.isPending || updateProject.isPending;

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate with the exact same schema the API enforces — a client-side
    // rejection here is never stricter or looser than what the server will
    // actually accept, since both import from @bsma/shared.
    const result = projectCreateSchema.safeParse(form);
    if (!result.success) {
      const errors = {};
      for (const issue of result.error.issues) {
        errors[issue.path.join(".")] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    try {
      if (isEdit) {
        await updateProject.mutateAsync({ id: project.id, data: result.data });
      } else {
        await createProject.mutateAsync(result.data);
      }
      onClose();
    } catch (err) {
      setFieldErrors({ _root: err.response?.data?.error ?? "Erreur lors de l'enregistrement." });
    }
  };

  return (
    <div className="project-form-overlay" onClick={onClose}>
      <div className="project-form-box" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? "Modifier le projet" : "Nouveau projet"}</h2>

        {fieldErrors._root && <div className="form-error-banner">{fieldErrors._root}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre *</label>
            <input
              className="admin-input"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Ex: Maison Contemporaine"
            />
            {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
          </div>

          <div className="form-group">
            <label>Catégorie *</label>
            <select
              className="admin-select"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {PROJECT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              className="admin-textarea"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Description du projet..."
              rows={4}
            />
            {fieldErrors.description && <span className="field-error">{fieldErrors.description}</span>}
          </div>

          <div className="form-group">
            <label>Surface</label>
            <input className="admin-input" value={form.surface} onChange={(e) => set("surface", e.target.value)} placeholder="Ex: 120 m²" />
          </div>

          <div className="form-group">
            <label>Durée</label>
            <input className="admin-input" value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="Ex: 3-6 mois" />
          </div>

          <div className="form-group">
            <label>Budget</label>
            <input className="admin-input" value={form.budget} onChange={(e) => set("budget", e.target.value)} placeholder="Ex: sur demande" />
          </div>

          <div className="project-form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-success" disabled={isPending}>
              {isPending ? "Sauvegarde..." : isEdit ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
