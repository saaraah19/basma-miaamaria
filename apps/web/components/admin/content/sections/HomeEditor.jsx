"use client";

import TextBlockEditor from "../TextBlockEditor";
import { useSectionQuery } from "@/lib/admin-queries";

export default function HomeEditor() {
  const { data = {}, isLoading } = useSectionQuery("home");
  if (isLoading) return <p className="section-loading">Chargement…</p>;

  return (
    <div className="admin-card">
      <span className="section-label">Page d&apos;accueil</span>
      <TextBlockEditor section="home" blockKey="services_title" label="Titre section Services" type="richText" initialValue={data.services_title?.value} />
      <TextBlockEditor section="home" blockKey="projects_title" label="Titre section Projets" type="richText" initialValue={data.projects_title?.value} />
    </div>
  );
}
