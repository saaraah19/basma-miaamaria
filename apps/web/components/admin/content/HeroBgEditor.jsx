"use client";

import { useState } from "react";
import Image from "next/image";
import { cldUrl } from "@/lib/cloudinary-url";
import { useMediaMutations, useUpdateContentBlock } from "@/lib/admin-queries";
import "./HeroBgEditor.css";

export default function HeroBgEditor({ initialUrl }) {
  const [preview, setPreview] = useState(initialUrl);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const { upload } = useMediaMutations();
  const updateContent = useUpdateContentBlock("hero");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");

    try {
      const media = await upload.mutateAsync(file);
      await updateContent.mutateAsync({ key: "bg_image", value: media.url });
      setPreview(media.url);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.response?.data?.error ?? "Erreur lors de l'upload.");
    }
  };

  const isBusy = upload.isPending || updateContent.isPending;

  return (
    <div className="hero-bg-editor">
      <div className="hero-bg-header">
        <span className="text-block-label">Image de fond</span>
        {saved && <span className="save-indicator">✓ Sauvegardé</span>}
      </div>

      {error && <div className="text-block-error">{error}</div>}

      {preview && (
        <div className="hero-bg-preview">
          <Image src={cldUrl(preview, { w: 800 })} alt="Aperçu image de fond" fill style={{ objectFit: "cover" }} />
        </div>
      )}

      <label className="hero-bg-upload-label">
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} disabled={isBusy} />
        <span className="btn-secondary">
          {isBusy ? "Upload en cours…" : preview ? "🔄 Changer l'image" : "📁 Choisir une image"}
        </span>
      </label>
      <p className="hero-bg-hint">Recommandé : 1920×1080px minimum, JPG ou WEBP</p>
    </div>
  );
}
