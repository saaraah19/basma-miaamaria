"use client";

import TextBlockEditor from "../TextBlockEditor";
import { useSectionQuery } from "@/lib/admin-queries";

export default function NavbarEditor() {
  const { data = {}, isLoading } = useSectionQuery("navbar");
  if (isLoading) return <p className="section-loading">Chargement…</p>;

  return (
    <div className="admin-card">
      <span className="section-label">Navbar</span>
      <TextBlockEditor
        section="navbar" blockKey="site_name" label="Nom du cabinet" type="plainText"
        initialValue={data.site_name?.value}
        hasDraft={data.site_name?.hasDraft} draftValue={data.site_name?.draftValue}
      />
      <TextBlockEditor
        section="navbar" blockKey="btn_devis_text" label="Texte bouton devis" type="plainText"
        initialValue={data.btn_devis_text?.value}
        hasDraft={data.btn_devis_text?.hasDraft} draftValue={data.btn_devis_text?.draftValue}
      />
    </div>
  );
}
