"use client";

import TextBlockEditor from "../TextBlockEditor";
import { useSectionQuery } from "@/lib/admin-queries";

export default function FooterEditor() {
  const { data = {}, isLoading } = useSectionQuery("footer");
  if (isLoading) return <p className="section-loading">Chargement…</p>;

  return (
    <div className="admin-card">
      <span className="section-label">Footer</span>
      <TextBlockEditor section="footer" blockKey="tagline" label="Tagline" type="richText" supportsStyles initialValue={data.tagline?.value} initialStyles={data.tagline?.styles} />
      <TextBlockEditor section="footer" blockKey="description" label="Description" type="richText" supportsStyles initialValue={data.description?.value} initialStyles={data.description?.styles} />
      <TextBlockEditor section="footer" blockKey="phone" label="Téléphone" type="plainText" initialValue={data.phone?.value} />
      <TextBlockEditor section="footer" blockKey="email" label="Email" type="plainText" initialValue={data.email?.value} />
      <TextBlockEditor section="footer" blockKey="address" label="Adresse" type="plainText" initialValue={data.address?.value} />
      <TextBlockEditor section="footer" blockKey="facebook" label="Facebook URL" type="url" initialValue={data.facebook?.value} />
      <TextBlockEditor section="footer" blockKey="instagram" label="Instagram URL" type="url" initialValue={data.instagram?.value} />
      <TextBlockEditor section="footer" blockKey="pinterest" label="Pinterest URL" type="url" initialValue={data.pinterest?.value} />
      <TextBlockEditor section="footer" blockKey="linkedin" label="LinkedIn URL" type="url" initialValue={data.linkedin?.value} />
    </div>
  );
}
