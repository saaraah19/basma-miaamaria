"use client";

import { useEffect, useRef } from "react";
import "./ConfirmModal.css";

export default function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel = "Supprimer" }) {
  const modalRef = useRef(null);
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        ref={modalRef}
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <h3 id="confirm-modal-title">{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button ref={cancelRef} className="btn-secondary" onClick={onCancel}>Annuler</button>
          <button className="btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}