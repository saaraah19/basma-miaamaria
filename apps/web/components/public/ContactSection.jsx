import Link from "next/link";
import { getSection } from "@/lib/api-server";
import { sanitize } from "@/lib/sanitize";
import ContactForm from "./ContactForm";
import "./ContactSection.css";

export default async function ContactSection() {
  const content = await getSection("contact").catch(() => ({}));

  const title = content?.title?.value ?? "Contactez-nous";
  const subtitle =
    content?.subtitle?.value ??
    "Vous avez un projet d'architecture ou de décoration ? Discutons-en.";
  const mapsUrl = content?.maps_url?.value ?? "";
  const calendly = content?.calendly?.value ?? "";
  const btnDevisText = content?.btn_devis_text?.value ?? "Demander un devis";
  const btnDevisLink = content?.btn_devis_link?.value ?? "/devis";
  const btnRdvText = content?.btn_rdv_text?.value ?? "Prendre rendez-vous";
  const formBtnText = content?.form_btn_text?.value ?? "Envoyer";

  return (
    <section className="contact-section">
      <h2 className="contact-title" dangerouslySetInnerHTML={{ __html: sanitize(title) }} />
      <p className="contact-subtitle" dangerouslySetInnerHTML={{ __html: sanitize(subtitle) }} />

      <div className="contact-container">
        {mapsUrl && (
          <div className="contact-map">
            <iframe
              title="Localisation Bureau Basma Miamaria"
              src={mapsUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        <ContactForm submitLabel={formBtnText} />
      </div>

      <div className="contact-actions">
        <Link href={btnDevisLink} className="btn-devis">
          {btnDevisText}
        </Link>
        {calendly && (
          <a href={calendly} target="_blank" rel="noopener noreferrer" className="btn-rdv">
            {btnRdvText}
          </a>
        )}
      </div>
    </section>
  );
}
