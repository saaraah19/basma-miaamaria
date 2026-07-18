"use client";

import TextBlockEditor from "../TextBlockEditor";
import { useSectionQuery } from "@/lib/admin-queries";

export default function ContactPageEditor() {
  const { data = {}, isLoading } = useSectionQuery("contact_page");
  if (isLoading) return <p className="section-loading">Chargement…</p>;

  return (
    <div className="admin-card">
      <span className="section-label">Page Contact</span>
      <TextBlockEditor section="contact_page" blockKey="hero_title" label="Titre hero" type="richText" supportsStyles initialValue={data.hero_title?.value} initialStyles={data.hero_title?.styles} />
      <TextBlockEditor section="contact_page" blockKey="hero_subtitle" label="Sous-titre" type="richText" supportsStyles initialValue={data.hero_subtitle?.value} initialStyles={data.hero_subtitle?.styles} />
      <TextBlockEditor section="contact_page" blockKey="address" label="Adresse" type="plainText" initialValue={data.address?.value} />
      <TextBlockEditor section="contact_page" blockKey="phone" label="Téléphone" type="plainText" initialValue={data.phone?.value} />
      <TextBlockEditor section="contact_page" blockKey="email" label="Email" type="plainText" initialValue={data.email?.value} />
      <TextBlockEditor section="contact_page" blockKey="hours_1" label="Horaires 1" type="plainText" initialValue={data.hours_1?.value} />
      <TextBlockEditor section="contact_page" blockKey="hours_2" label="Horaires 2" type="plainText" initialValue={data.hours_2?.value} />
      <TextBlockEditor section="contact_page" blockKey="facebook" label="Facebook URL" type="url" initialValue={data.facebook?.value} />
      <TextBlockEditor section="contact_page" blockKey="instagram" label="Instagram URL" type="url" initialValue={data.instagram?.value} />
      <TextBlockEditor section="contact_page" blockKey="submit_btn" label="Texte bouton" type="plainText" supportsStyles initialValue={data.submit_btn?.value} initialStyles={data.submit_btn?.styles} />
    </div>
  );
}
