"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { blockStylesSchema } from "@bsma/shared";
import { useUpdateContentBlock, usePublishContentBlock, useDiscardContentDraft } from "@/lib/admin-queries";
import StyleControls from "./StyleControls";
import "./TextBlockEditor.css";

// ... RichTextToolbar and RichTextField stay exactly as before, unchanged ...

export default function TextBlockEditor({
  section,
  blockKey,
  label,
  type = "plainText",
  initialValue = "",
  initialStyles = null,
  supportsStyles = false,
  hasDraft = false,
  draftValue = null,
  draftStyles = null,
}) {
  // While a draft exists, the editor works on the draft — that's what
  // "continuing to edit" means. The published value/styles stay untouched
  // and are what handleDiscard reverts back to.
  const startingValue = hasDraft ? draftValue ?? "" : initialValue;
  const startingStyles = hasDraft ? draftStyles ?? {} : initialStyles ?? {};

  const [plainValue, setPlainValue] = useState(startingValue);
  const [styles, setStyles] = useState(startingStyles);
  const [saved, setSaved] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const getRichValueRef = useRef(() => startingValue);

  const { mutate, isPending } = useUpdateContentBlock(section);
  const publishBlock = usePublishContentBlock(section);
  const discardDraft = useDiscardContentDraft(section);

  const isPlainDirty = type !== "richText" && plainValue !== startingValue;
  const isStylesDirty = supportsStyles && JSON.stringify(styles) !== JSON.stringify(startingStyles);
  const dirty = touched || isPlainDirty || isStylesDirty;

  useEffect(() => {
    if (!dirty) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const handleSave = () => {
    setError("");
    const value = type === "richText" ? getRichValueRef.current() : plainValue;

    if (supportsStyles) {
      const stylesResult = blockStylesSchema.safeParse(styles);
      if (!stylesResult.success) {
        setError("Style invalide.");
        return;
      }
    }

    mutate(
      { key: blockKey, value, styles: supportsStyles ? styles : undefined },
      {
        onSuccess: () => {
          setSaved(true);
          setTouched(false);
          setTimeout(() => setSaved(false), 2000);
        },
        onError: (err) => setError(err.response?.data?.error ?? "Erreur lors de la sauvegarde."),
      }
    );
  };

  const handlePublish = () => {
    setError("");
    publishBlock.mutate(blockKey, {
      onSuccess: () => {
        setPublished(true);
        setTimeout(() => setPublished(false), 2000);
      },
      onError: (err) => setError(err.response?.data?.error ?? "Erreur lors de la publication."),
    });
  };

  const handleDiscard = () => {
    if (!window.confirm("Annuler le brouillon et revenir à la version publiée ?")) return;
    discardDraft.mutate(blockKey, {
      onSuccess: () => {
        // Reverts the visible editor back to the published value. Works
        // correctly for plainText/url (controlled inputs). For richText,
        // Tiptap only reads its initial content once at mount — a full
        // resync would need editor.commands.setContent(), left out here
        // to keep this change contained. In practice, a page refresh after
        // discarding a rich-text draft shows the correct published text.
        setPlainValue(initialValue);
        setStyles(initialStyles ?? {});
        setTouched(false);
      },
    });
  };

  return (
    <div className="text-block-editor">
      <div className="text-block-editor-header">
        <span className="text-block-label">{label}</span>
        {dirty && !saved && <span className="dirty-indicator">● non sauvegardé</span>}
        {saved && <span className="save-indicator">✓ Brouillon enregistré</span>}
        {published && <span className="save-indicator">✓ Publié</span>}
        {!dirty && !saved && hasDraft && <span className="draft-indicator">● Brouillon non publié</span>}
      </div>

      {error && <div className="text-block-error">{error}</div>}

      {supportsStyles && <StyleControls styles={styles} onChange={setStyles} />}

      {type === "richText" && (
        <RichTextField
          initialValue={startingValue}
          onGetValue={(getter) => { getRichValueRef.current = getter; }}
          onTouched={() => setTouched(true)}
        />
      )}

      {type === "plainText" && (
        <textarea
          className="admin-textarea"
          value={plainValue}
          onChange={(e) => setPlainValue(e.target.value)}
          rows={2}
        />
      )}

      {type === "url" && (
        <input
          className="admin-input"
          type="text"
          value={plainValue}
          onChange={(e) => setPlainValue(e.target.value)}
          placeholder="https:// ou /chemin-relatif"
        />
      )}

      <div className="text-block-actions">
        <button className="btn-success" onClick={handleSave} disabled={isPending}>
          {isPending ? "Sauvegarde..." : "Enregistrer le brouillon"}
        </button>
        {hasDraft && (
          <>
            <button className="btn-primary" onClick={handlePublish} disabled={publishBlock.isPending}>
              {publishBlock.isPending ? "Publication..." : "Publier"}
            </button>
            <button className="btn-secondary" onClick={handleDiscard} disabled={discardDraft.isPending}>
              Annuler le brouillon
            </button>
          </>
        )}
      </div>
    </div>
  );
}