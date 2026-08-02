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

function RichTextToolbar({ editor }) {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL du lien :", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="tiptap-toolbar">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "is-active" : ""}>B</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "is-active" : ""}><em>I</em></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive("underline") ? "is-active" : ""}><u>U</u></button>

      <div className="toolbar-divider" />

      <select
        onChange={(e) => {
          const val = e.target.value;
          if (val === "p") editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level: parseInt(val, 10) }).run();
        }}
        value={
          editor.isActive("heading", { level: 1 }) ? "1" :
          editor.isActive("heading", { level: 2 }) ? "2" :
          editor.isActive("heading", { level: 3 }) ? "3" : "p"
        }
      >
        <option value="p">Paragraphe</option>
        <option value="1">Titre 1</option>
        <option value="2">Titre 2</option>
        <option value="3">Titre 3</option>
      </select>

      <div className="toolbar-divider" />

      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "is-active" : ""}>• Liste</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "is-active" : ""}>1. Liste</button>
      <button type="button" onClick={setLink} className={editor.isActive("link") ? "is-active" : ""}>🔗</button>

      <div className="toolbar-divider" />

      <button type="button" onClick={() => editor.chain().focus().undo().run()}>↩</button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()}>↪</button>
    </div>
  );
}

function RichTextField({ initialValue, onGetValue, onTouched }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
    ],
    content: initialValue || "<p></p>",
    immediatelyRender: false,
    onUpdate: () => onTouched?.(),
  });

  useEffect(() => {
    onGetValue(() => editor?.getHTML() ?? "");
  });

  return (
    <>
      <RichTextToolbar editor={editor} />
      <div className="tiptap-editor-wrapper">
        <EditorContent editor={editor} />
      </div>
    </>
  );
}

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