"use client";

import { useCallback, useEffect, useState } from "react";
import { cldUrl } from "@/lib/cloudinary-url";
import "./ProjectGallery.css";

export default function ProjectGallery({ images, projectTitle }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActive(0);
  }, [images]);

  const goTo = useCallback(
    (index) => {
      if (!images || images.length === 0) return;
      setActive(((index % images.length) + images.length) % images.length);
    },
    [images]
  );

  // Lock body scroll while the lightbox is open, and wire up keyboard nav.
  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goTo(active - 1);
      if (e.key === "ArrowRight") goTo(active + 1);
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, active, goTo]);

  if (!images || images.length === 0) return null;

  const hasMultiple = images.length > 1;
  const current = images[active];

  return (
    <div className="project-gallery">
      <div className="gallery-main">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current.id}
          src={cldUrl(current.url, { w: 1200 })}
          alt={current.alt || `${projectTitle} — vue ${active + 1}`}
          className="gallery-main-image"
          loading="eager"
          onClick={() => setLightboxOpen(true)}
        />
        <button
          type="button"
          className="gallery-zoom-hint"
          onClick={() => setLightboxOpen(true)}
          aria-label="Agrandir l'image"
        >
          🔍
        </button>

        {hasMultiple && (
          <>
            <button
              type="button"
              className="gallery-arrow gallery-arrow-prev"
              onClick={() => goTo(active - 1)}
              aria-label="Image précédente"
            >
              ‹
            </button>
            <button
              type="button"
              className="gallery-arrow gallery-arrow-next"
              onClick={() => goTo(active + 1)}
              aria-label="Image suivante"
            >
              ›
            </button>
            <div className="gallery-counter">
              {active + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="gallery-thumbs">
          {images.map((img, i) => (
            <button
              type="button"
              key={img.id}
              className={`gallery-thumb${i === active ? " is-active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Voir l'image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cldUrl(img.url, { w: 160 })} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${projectTitle} — visionneuse d'images`}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setLightboxOpen(false)}
            aria-label="Fermer"
          >
            ✕
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cldUrl(current.url, { w: 1920 })}
            alt={current.alt || `${projectTitle} — vue ${active + 1}`}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />

          {hasMultiple && (
            <>
              <button
                type="button"
                className="lightbox-arrow lightbox-arrow-prev"
                onClick={(e) => { e.stopPropagation(); goTo(active - 1); }}
                aria-label="Image précédente"
              >
                ‹
              </button>
              <button
                type="button"
                className="lightbox-arrow lightbox-arrow-next"
                onClick={(e) => { e.stopPropagation(); goTo(active + 1); }}
                aria-label="Image suivante"
              >
                ›
              </button>
              <div className="lightbox-counter">
                {active + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}