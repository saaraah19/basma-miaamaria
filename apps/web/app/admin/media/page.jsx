"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";
import { useMediaQuery, useMediaMutations } from "@/lib/admin-queries";
import { cldUrl } from "@/lib/cloudinary-url";
import "./media.css";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

function MediaManagerContent() {
  const inputRef = useRef();
  const { data: media = [], isLoading } = useMediaQuery();
  const { upload, remove } = useMediaMutations();

  const [toDelete, setToDelete] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const handleFile = (file) => {
    if (!file) return;
    setUploadError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError("Format non autorisé — JPG, PNG ou WEBP uniquement.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setUploadError("Fichier trop volumineux — 8 Mo maximum.");
      return;
    }

    upload.mutate(file, {
      onError: (err) => setUploadError(err.response?.data?.error ?? "Erreur lors de l'upload."),
    });
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <>
      <div className="admin-card">
        <h2 className="media-section-title">Uploader un fichier</h2>
        <label className="media-upload-label">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <span className="btn-primary">
            {upload.isPending ? "Upload en cours..." : "📁 Choisir une image"}
          </span>
        </label>
        <p className="media-upload-hint">JPG, PNG, WEBP — 8 Mo maximum par fichier</p>
        {uploadError && <div className="text-block-error">⚠️ {uploadError}</div>}
      </div>

      <div className="admin-card">
        <h2 className="media-section-title">{media.length} fichier(s)</h2>

        {isLoading ? (
          <p className="section-loading">Chargement...</p>
        ) : media.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: "2rem" }}>🖼️</p>
            <p>Aucun média uploadé.</p>
          </div>
        ) : (
          <div className="media-grid">
            {media.map((m) => (
              <div key={m.id} className="media-item">
                <div className="media-item-image">
                  <Image
                    src={cldUrl(m.url, { w: 320 })}
                    alt={m.filename}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 45vw, 160px"
                  />
                </div>
                <div className="media-item-info">
                  <p className="media-item-filename" title={m.filename}>{m.filename}</p>
                  <div className="media-item-actions">
                    <button className="btn-secondary" onClick={() => copyUrl(m.url)}>
                      {copiedUrl === m.url ? "✓ Copié" : "🔗 URL"}
                    </button>
                    <button className="btn-danger" onClick={() => setToDelete(m)}>🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toDelete && (
        <ConfirmModal
          title="Supprimer ce fichier ?"
          message={`"${toDelete.filename}" sera supprimé définitivement.`}
          onConfirm={() => { remove.mutate(toDelete.id); setToDelete(null); }}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}

export default function MediaManagerPage() {
  return (
    <AdminLayout title="Gestionnaire de Médias">
      <MediaManagerContent />
    </AdminLayout>
  );
}
