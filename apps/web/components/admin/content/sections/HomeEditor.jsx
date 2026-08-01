"use client";

import TextBlockEditor from "../TextBlockEditor";
import { useSectionQuery } from "@/lib/admin-queries";

export default function HomeEditor() {
  const { data = {}, isLoading } = useSectionQuery("home");
  if (isLoading) return <p className="section-loading">Chargement…</p>;

  return (
    <div className="admin-card">
      <span className="section-label">Page d&apos;accueil</span>
      <TextBlockEditor
        section="home" blockKey="services_title" label="Titre section Services" type="richText"
        initialValue={data.services_title?.value}
        hasDraft={data.services_title?.hasDraft} draftValue={data.services_title?.draftValue}
      />
      <TextBlockEditor
        section="home" blockKey="projects_title" label="Titre section Projets" type="richText"
        initialValue={data.projects_title?.value}
        hasDraft={data.projects_title?.hasDraft} draftValue={data.projects_title?.draftValue}
      />
    </div>
  );
}
