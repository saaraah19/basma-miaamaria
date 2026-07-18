"use client";

import TextBlockEditor from "../TextBlockEditor";
import { useSectionQuery } from "@/lib/admin-queries";

export default function DevisEditor() {
  const { data = {}, isLoading } = useSectionQuery("devis");
  if (isLoading) return <p className="section-loading">Chargement…</p>;

  return (
    <div className="admin-card">
      <span className="section-label">Page Devis</span>
      <TextBlockEditor section="devis" blockKey="title" label="Titre" type="richText" supportsStyles initialValue={data.title?.value} initialStyles={data.title?.styles} />
      <TextBlockEditor section="devis" blockKey="subtitle" label="Sous-titre" type="richText" supportsStyles initialValue={data.subtitle?.value} initialStyles={data.subtitle?.styles} />
      <TextBlockEditor section="devis" blockKey="submit_btn" label="Texte bouton" type="plainText" supportsStyles initialValue={data.submit_btn?.value} initialStyles={data.submit_btn?.styles} />
    </div>
  );
}
