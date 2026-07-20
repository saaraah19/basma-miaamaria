"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";
import { useCategoriesQuery, useCategoryMutations } from "@/lib/admin-queries";
import "./categories.css";

function CategoriesContent() {
  const { data: categories = [], isLoading } = useCategoriesQuery();
  const { create, remove } = useCategoryMutations();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await create.mutateAsync({ name: name.trim() });
      setName("");
    } catch (err) {
      setError(err.response?.data?.error ?? "Erreur lors de la création.");
    }
  };

  const handleDelete = async () => {
    try {
      await remove.mutateAsync(toDelete.id);
      setToDelete(null);
    } catch (err) {
      setError(err.response?.data?.error ?? "Erreur lors de la suppression.");
      setToDelete(null);
    }
  };

  return (
    <>
      <div className="admin-card">
        <span className="section-label">Nouvelle catégorie</span>
        {error && <div className="text-block-error">{error}</div>}
        <form className="categories-add-form" onSubmit={handleAdd}>
          <input
            className="admin-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Aménagement extérieur"
            maxLength={60}
            required
          />
          <button className="btn-success" type="submit" disabled={create.isPending}>
            {create.isPending ? "Ajout..." : "+ Ajouter"}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <span className="section-label">{categories.length} catégorie(s)</span>

        {isLoading ? (
          <p className="section-loading">Chargement…</p>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: "2rem" }}>🏷️</p>
            <p>Aucune catégorie pour l&apos;instant.</p>
          </div>
        ) : (
          <div className="categories-list">
            {categories.map((c) => (
              <div key={c.id} className="categories-row">
                <span className="badge badge-gray">{c.name}</span>
                <button className="btn-danger" onClick={() => setToDelete(c)}>🗑</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {toDelete && (
        <ConfirmModal
          title={`Supprimer "${toDelete.name}" ?`}
          message="Si des projets utilisent encore cette catégorie, la suppression sera refusée — réassignez-les d'abord."
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}

export default function CategoriesPage() {
  return (
    <AdminLayout title="Catégories">
      <CategoriesContent />
    </AdminLayout>
  );
}