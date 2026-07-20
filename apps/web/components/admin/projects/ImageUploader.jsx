"use client";

import { useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cldUrl } from "@/lib/cloudinary-url";
import {
  useAddProjectImages,
  useDeleteProjectImage,
  useSetProjectImageCover,
  useReorderProjectImages,
  useUpdateProjectImageAlt,
} from "@/lib/admin-queries";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";
import "./ImageUploader.css";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

function SortableImage({ img, onDelete, onSetCover, onAltChange }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: img.id,
  });
  const [altValue, setAltValue] = useState(img.alt ?? "");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="image-cell">
      <div className={`image-item ${img.isCover ? "is-cover" : ""}`}>
        <div className="drag-handle" {...attributes} {...listeners}>⠿</div>
        {img.isCover && <span className="cover-badge">Cover</span>}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cldUrl(img.url, { w: 300 })} alt={img.alt ?? ""} loading="lazy" />
        <div className="image-item-actions">
          {!img.isCover && (
            <button className="btn-cover" onClick={() => onSetCover(img)}>⭐ Cover</button>
          )}
          <button className="btn-del" onClick={() => onDelete(img)}>🗑 Suppr.</button>
        </div>
      </div>
      <input
        className="image-alt-input"
        type="text"
        placeholder="Texte alternatif (SEO)"
        value={altValue}
        onChange={(e) => setAltValue(e.target.value)}
        onBlur={() => {
          if (altValue !== (img.alt ?? "")) onAltChange(img, altValue);
        }}
      />
    </div>
  );
}

export default function ImageUploader({ projectId, images = [] }) {
  const inputRef = useRef();
  const [dragOver, setDragOver] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [localImages, setLocalImages] = useState(null);
  const [uploadError, setUploadError] = useState("");

const addImages = useAddProjectImages();
  const deleteImage = useDeleteProjectImage();
  const setCover = useSetProjectImageCover();
  const reorder = useReorderProjectImages();
  const updateAlt = useUpdateProjectImageAlt();

  const sensors = useSensors(useSensor(PointerSensor));
  const displayed = localImages ?? images;

  const validateFiles = (fileList) => {
    const files = Array.from(fileList);
    const rejected = files.filter(
      (f) => !ALLOWED_TYPES.includes(f.type) || f.size > MAX_SIZE_BYTES
    );
    if (rejected.length > 0) {
      setUploadError(
        `${rejected.length} fichier(s) rejeté(s) — JPG/PNG/WEBP uniquement, 8 Mo maximum par fichier.`
      );
    } else {
      setUploadError("");
    }
    return files.filter((f) => ALLOWED_TYPES.includes(f.type) && f.size <= MAX_SIZE_BYTES);
  };

  const handleFiles = (fileList) => {
    const valid = validateFiles(fileList);
    if (valid.length > 0) addImages.mutate({ projectId, files: valid });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = displayed.findIndex((i) => i.id === active.id);
    const newIndex = displayed.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(displayed, oldIndex, newIndex);
    setLocalImages(reordered);
    reorder.mutate({
      projectId,
      updates: reordered.map((img, i) => ({ id: img.id, order: i })),
    });
  };

  return (
    <div className="image-uploader">
      <div
        className={`upload-zone ${dragOver ? "drag-over" : ""}`}
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <div className="upload-icon">📁</div>
        <p>Glisse des images ici ou clique pour sélectionner</p>
        <p className="upload-hint">JPG, PNG, WEBP — 8 Mo maximum par fichier</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {uploadError && <div className="upload-error">⚠️ {uploadError}</div>}
      {addImages.isPending && <div className="uploading-bar">⏳ Upload en cours...</div>}
      {addImages.isError && (
        <div className="upload-error">
          ⚠️ {addImages.error?.response?.data?.error ?? "Erreur lors de l'upload."}
        </div>
      )}

      {displayed.length > 0 && (
        <p className="image-count-hint">
          {displayed.length} image(s) — glisse pour réordonner, ⭐ pour définir la cover
        </p>
      )}

      {displayed.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={displayed.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="images-grid">
              {displayed.map((img) => (
                <SortableImage
                  key={img.id}
                  img={img}
                  onDelete={setToDelete}
                  onSetCover={(image) => setCover.mutate({ imageId: image.id, projectId })}
                  onAltChange={(image, alt) => updateAlt.mutate({ imageId: image.id, alt, projectId })}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {toDelete && (
        <ConfirmModal
          title="Supprimer l'image ?"
          message="Cette action est irréversible."
          onConfirm={() => {
            deleteImage.mutate({ imageId: toDelete.id, projectId });
            setToDelete(null);
            setLocalImages(null);
          }}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
