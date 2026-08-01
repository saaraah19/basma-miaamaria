"use client";

import { valeursListSchema, expertiseListSchema } from "@bsma/shared";
import TextBlockEditor from "../TextBlockEditor";
import ListFieldEditor from "../ListFieldEditor";
import { useSectionQuery } from "@/lib/admin-queries";

const DEFAULT_VALEURS = [
  { icon: "✓", label: "Excellence", desc: "Qualité impeccable dans chaque détail" },
];
const DEFAULT_EXPERTISE = [{ icon: "🏛️", label: "Architecture" }];

const parseList = (raw, fallback) => {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export default function AboutEditor() {
  const { data = {}, isLoading } = useSectionQuery("about");
  if (isLoading) return <p className="section-loading">Chargement…</p>;

  const valeurs = parseList(data.valeurs?.value, DEFAULT_VALEURS);
  const expertise = parseList(data.expertise?.value, DEFAULT_EXPERTISE);

  return (
    <div className="admin-card">
      <span className="section-label">Page À Propos</span>

      <h3 className="section-subheading">Hero</h3>
      <TextBlockEditor
        section="about" blockKey="title" label="Titre hero" type="richText" supportsStyles
        initialValue={data.title?.value} initialStyles={data.title?.styles}
        hasDraft={data.title?.hasDraft} draftValue={data.title?.draftValue} draftStyles={data.title?.draftStyles}
      />
      <TextBlockEditor
        section="about" blockKey="subtitle" label="Sous-titre" type="richText" supportsStyles
        initialValue={data.subtitle?.value} initialStyles={data.subtitle?.styles}
        hasDraft={data.subtitle?.hasDraft} draftValue={data.subtitle?.draftValue} draftStyles={data.subtitle?.draftStyles}
      />

      <h3 className="section-subheading">Histoire</h3>
      <TextBlockEditor
        section="about" blockKey="histoire_title" label="Titre section" type="richText"
        initialValue={data.histoire_title?.value}
        hasDraft={data.histoire_title?.hasDraft} draftValue={data.histoire_title?.draftValue}
      />
      <TextBlockEditor
        section="about" blockKey="histoire_1" label="Paragraphe 1" type="richText"
        initialValue={data.histoire_1?.value}
        hasDraft={data.histoire_1?.hasDraft} draftValue={data.histoire_1?.draftValue}
      />
      <TextBlockEditor
        section="about" blockKey="histoire_2" label="Paragraphe 2" type="richText"
        initialValue={data.histoire_2?.value}
        hasDraft={data.histoire_2?.hasDraft} draftValue={data.histoire_2?.draftValue}
      />

      <h3 className="section-subheading">Valeurs</h3>
      <TextBlockEditor
        section="about" blockKey="valeurs_title" label="Titre section" type="richText"
        initialValue={data.valeurs_title?.value}
        hasDraft={data.valeurs_title?.hasDraft} draftValue={data.valeurs_title?.draftValue}
      />
      <ListFieldEditor
        section="about"
        blockKey="valeurs"
        label="Valeurs"
        schema={valeursListSchema}
        initialItems={valeurs}
        emptyItem={{ icon: "✓", label: "", desc: "" }}
        fields={[
          { key: "icon", placeholder: "✓", width: "52px" },
          { key: "label", placeholder: "Label", width: "1fr" },
          { key: "desc", placeholder: "Description", width: "2fr" },
        ]}
      />

      <h3 className="section-subheading">Expertise</h3>
      <TextBlockEditor
        section="about" blockKey="expertise_title" label="Titre section" type="richText"
        initialValue={data.expertise_title?.value}
        hasDraft={data.expertise_title?.hasDraft} draftValue={data.expertise_title?.draftValue}
      />
      <ListFieldEditor
        section="about"
        blockKey="expertise"
        label="Expertise"
        schema={expertiseListSchema}
        initialItems={expertise}
        emptyItem={{ icon: "🏛️", label: "" }}
        fields={[
          { key: "icon", placeholder: "🏛️", width: "68px" },
          { key: "label", placeholder: "Label", width: "1fr" },
        ]}
      />

      <h3 className="section-subheading">Appel à l&apos;action</h3>
      <TextBlockEditor
        section="about" blockKey="cta_title" label="Titre CTA" type="richText" supportsStyles
        initialValue={data.cta_title?.value} initialStyles={data.cta_title?.styles}
        hasDraft={data.cta_title?.hasDraft} draftValue={data.cta_title?.draftValue} draftStyles={data.cta_title?.draftStyles}
      />
      <TextBlockEditor
        section="about" blockKey="cta_button" label="Texte bouton" type="plainText" supportsStyles
        initialValue={data.cta_button?.value} initialStyles={data.cta_button?.styles}
        hasDraft={data.cta_button?.hasDraft} draftValue={data.cta_button?.draftValue} draftStyles={data.cta_button?.draftStyles}
      />
    </div>
  );
}
