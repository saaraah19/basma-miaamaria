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
      <TextBlockEditor
        section="hero" blockKey="title" label="Titre principal" type="richText" supportsStyles
        initialValue={data.title?.value} initialStyles={data.title?.styles}
        hasDraft={data.title?.hasDraft} draftValue={data.title?.draftValue} draftStyles={data.title?.draftStyles}
      />
      <TextBlockEditor
        section="hero" blockKey="subtitle" label="Sous-titre" type="richText" supportsStyles
        initialValue={data.subtitle?.value} initialStyles={data.subtitle?.styles}
        hasDraft={data.subtitle?.hasDraft} draftValue={data.subtitle?.draftValue} draftStyles={data.subtitle?.draftStyles}
      />
      <TextBlockEditor
        section="hero" blockKey="btn_text" label="Texte du bouton" type="plainText" supportsStyles
        initialValue={data.btn_text?.value} initialStyles={data.btn_text?.styles}
        hasDraft={data.btn_text?.hasDraft} draftValue={data.btn_text?.draftValue} draftStyles={data.btn_text?.draftStyles}
      />
      <TextBlockEditor
        section="hero" blockKey="btn_link" label="Lien du bouton" type="url"
        initialValue={data.btn_link?.value}
        hasDraft={data.btn_link?.hasDraft} draftValue={data.btn_link?.draftValue}
      />
      <HeroBgEditor initialUrl={data.bg_image?.value ?? ""} />
    </div>
  );
}
