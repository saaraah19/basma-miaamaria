"use client";

import TextBlockEditor from "../TextBlockEditor";
import { useSectionQuery } from "@/lib/admin-queries";

export default function FooterEditor() {
  const { data = {}, isLoading } = useSectionQuery("footer");
  if (isLoading) return <p className="section-loading">Chargement…</p>;

  return (
    <div className="admin-card">
      <span className="section-label">Footer</span>
      <TextBlockEditor
        section="footer" blockKey="tagline" label="Tagline" type="richText" supportsStyles
        initialValue={data.tagline?.value} initialStyles={data.tagline?.styles}
        hasDraft={data.tagline?.hasDraft} draftValue={data.tagline?.draftValue} draftStyles={data.tagline?.draftStyles}
      />
      <TextBlockEditor
        section="footer" blockKey="description" label="Description" type="richText" supportsStyles
        initialValue={data.description?.value} initialStyles={data.description?.styles}
        hasDraft={data.description?.hasDraft} draftValue={data.description?.draftValue} draftStyles={data.description?.draftStyles}
      />
      <TextBlockEditor
        section="footer" blockKey="phone" label="Téléphone" type="plainText"
        initialValue={data.phone?.value}
        hasDraft={data.phone?.hasDraft} draftValue={data.phone?.draftValue}
      />
      <TextBlockEditor
        section="footer" blockKey="email" label="Email" type="plainText"
        initialValue={data.email?.value}
        hasDraft={data.email?.hasDraft} draftValue={data.email?.draftValue}
      />
      <TextBlockEditor
        section="footer" blockKey="address" label="Adresse" type="plainText"
        initialValue={data.address?.value}
        hasDraft={data.address?.hasDraft} draftValue={data.address?.draftValue}
      />
      <TextBlockEditor
        section="footer" blockKey="facebook" label="Facebook URL" type="url"
        initialValue={data.facebook?.value}
        hasDraft={data.facebook?.hasDraft} draftValue={data.facebook?.draftValue}
      />
      <TextBlockEditor
        section="footer" blockKey="instagram" label="Instagram URL" type="url"
        initialValue={data.instagram?.value}
        hasDraft={data.instagram?.hasDraft} draftValue={data.instagram?.draftValue}
      />
      <TextBlockEditor
        section="footer" blockKey="pinterest" label="Pinterest URL" type="url"
        initialValue={data.pinterest?.value}
        hasDraft={data.pinterest?.hasDraft} draftValue={data.pinterest?.draftValue}
      />
      <TextBlockEditor
        section="footer" blockKey="linkedin" label="LinkedIn URL" type="url"
        initialValue={data.linkedin?.value}
        hasDraft={data.linkedin?.hasDraft} draftValue={data.linkedin?.draftValue}
      />
    </div>
  );
}
