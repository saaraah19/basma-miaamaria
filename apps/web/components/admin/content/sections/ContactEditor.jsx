"use client";

import TextBlockEditor from "../TextBlockEditor";
import { useSectionQuery } from "@/lib/admin-queries";

export default function ContactEditor() {
  const { data = {}, isLoading } = useSectionQuery("contact");
  if (isLoading) return <p className="section-loading">Chargement…</p>;

  return (
    <div className="admin-card">
      <span className="section-label">Section Contact — Home</span>
      <TextBlockEditor
        section="contact" blockKey="title" label="Titre" type="richText" supportsStyles
        initialValue={data.title?.value} initialStyles={data.title?.styles}
        hasDraft={data.title?.hasDraft} draftValue={data.title?.draftValue} draftStyles={data.title?.draftStyles}
      />
      <TextBlockEditor
        section="contact" blockKey="subtitle" label="Sous-titre" type="richText" supportsStyles
        initialValue={data.subtitle?.value} initialStyles={data.subtitle?.styles}
        hasDraft={data.subtitle?.hasDraft} draftValue={data.subtitle?.draftValue} draftStyles={data.subtitle?.draftStyles}
      />
      <TextBlockEditor
        section="contact" blockKey="maps_url" label="URL Google Maps (embed)" type="url"
        initialValue={data.maps_url?.value}
        hasDraft={data.maps_url?.hasDraft} draftValue={data.maps_url?.draftValue}
      />
      <TextBlockEditor
        section="contact" blockKey="calendly" label="Lien Calendly" type="url"
        initialValue={data.calendly?.value}
        hasDraft={data.calendly?.hasDraft} draftValue={data.calendly?.draftValue}
      />
      <TextBlockEditor
        section="contact" blockKey="btn_devis_text" label="Bouton Devis — texte" type="plainText" supportsStyles
        initialValue={data.btn_devis_text?.value} initialStyles={data.btn_devis_text?.styles}
        hasDraft={data.btn_devis_text?.hasDraft} draftValue={data.btn_devis_text?.draftValue} draftStyles={data.btn_devis_text?.draftStyles}
      />
      <TextBlockEditor
        section="contact" blockKey="btn_devis_link" label="Bouton Devis — lien" type="url"
        initialValue={data.btn_devis_link?.value}
        hasDraft={data.btn_devis_link?.hasDraft} draftValue={data.btn_devis_link?.draftValue}
      />
      <TextBlockEditor
        section="contact" blockKey="btn_rdv_text" label="Bouton RDV — texte" type="plainText" supportsStyles
        initialValue={data.btn_rdv_text?.value} initialStyles={data.btn_rdv_text?.styles}
        hasDraft={data.btn_rdv_text?.hasDraft} draftValue={data.btn_rdv_text?.draftValue} draftStyles={data.btn_rdv_text?.draftStyles}
      />
      <TextBlockEditor
        section="contact" blockKey="form_btn_text" label="Bouton formulaire" type="plainText" supportsStyles
        initialValue={data.form_btn_text?.value} initialStyles={data.form_btn_text?.styles}
        hasDraft={data.form_btn_text?.hasDraft} draftValue={data.form_btn_text?.draftValue} draftStyles={data.form_btn_text?.draftStyles}
      />
    </div>
  );
}
