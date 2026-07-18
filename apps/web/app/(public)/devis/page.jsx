import { getSection } from "@/lib/api-server";
import { sanitize } from "@/lib/sanitize";
import { toInlineStyle } from "@/lib/blockStyles";
import DevisForm from "@/components/public/DevisForm";
import "./devis.css";

export const metadata = {
  title: "Demander un Devis",
  description:
    "Décrivez votre projet d'architecture, de décoration intérieure ou de rénovation et recevez une estimation personnalisée de Basma Miamaria.",
  alternates: { canonical: "/devis" },
};

export default async function DevisPage() {
  const content = await getSection("devis").catch(() => ({}));

  const title = content?.title?.value ?? "Demander un devis";
  const subtitle =
    content?.subtitle?.value ??
    "Décrivez votre projet afin que nous puissions vous proposer une estimation personnalisée.";
  const submitBtn = content?.submit_btn?.value ?? "Envoyer ma demande";

  return (
    <section className="devis-section">
      <h1
        className="devis-title"
        style={toInlineStyle(content?.title?.styles)}
        dangerouslySetInnerHTML={{ __html: sanitize(title) }}
      />
      <p
        className="devis-subtitle"
        style={toInlineStyle(content?.subtitle?.styles)}
        dangerouslySetInnerHTML={{ __html: sanitize(subtitle) }}
      />

      <DevisForm submitLabel={submitBtn} />
    </section>
  );
}
