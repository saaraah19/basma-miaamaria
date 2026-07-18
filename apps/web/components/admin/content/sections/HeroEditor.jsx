"use client";

import TextBlockEditor from "../TextBlockEditor";
import HeroBgEditor from "../HeroBgEditor";
import { useSectionQuery } from "@/lib/admin-queries";

export default function HeroEditor() {
  const { data = {}, isLoading } = useSectionQuery("hero");
  if (isLoading) return <p className="section-loading">Chargement…</p>;

  return (
    <div className="admin-card">
      <span className="section-label">Section Hero</span>
      <TextBlockEditor section="hero" blockKey="title" label="Titre principal" type="richText" supportsStyles initialValue={data.title?.value} initialStyles={data.title?.styles} />
      <TextBlockEditor section="hero" blockKey="subtitle" label="Sous-titre" type="richText" supportsStyles initialValue={data.subtitle?.value} initialStyles={data.subtitle?.styles} />
      <TextBlockEditor section="hero" blockKey="btn_text" label="Texte du bouton" type="plainText" supportsStyles initialValue={data.btn_text?.value} initialStyles={data.btn_text?.styles} />
      <TextBlockEditor section="hero" blockKey="btn_link" label="Lien du bouton" type="url" initialValue={data.btn_link?.value} />
      <HeroBgEditor initialUrl={data.bg_image?.value ?? ""} />
    </div>
  );
}
