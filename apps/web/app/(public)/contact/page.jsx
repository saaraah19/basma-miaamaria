import { getSection } from "@/lib/api-server";
import { sanitize } from "@/lib/sanitize";
import { toInlineStyle } from "@/lib/blockStyles";
import ContactForm from "@/components/public/ContactForm";
import "./contact.css";

export const metadata = {
  title: "Contact",
  description:
    "Contactez Basma Miamaria pour votre projet d'architecture ou de décoration intérieure à Oran. Téléphone, email, adresse et formulaire de contact.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const content = await getSection("contact_page").catch(() => ({}));

  const heroTitle = content?.hero_title?.value ?? "Contactez-Nous";
  const heroSub = content?.hero_subtitle?.value ?? "Discutons de votre prochain projet";
  const address = content?.address?.value ?? "Oran, Algérie";
  const phone = content?.phone?.value ?? "+213562580995";
  const email = content?.email?.value ?? "basmamiammaria@gmail.com";
  const hours1 = content?.hours_1?.value ?? "Lun - Ven: 9h00 - 18h00";
  const hours2 = content?.hours_2?.value ?? "Sam: 10h00 - 16h00";
  const facebook = content?.facebook?.value ?? "https://www.facebook.com/BasmaMiaamaria";
  const instagram = content?.instagram?.value ?? "https://www.instagram.com/basma_miaamaria/";
  const submitBtn = content?.submit_btn?.value ?? "Envoyer le message";

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1
            className="contact-title"
            style={toInlineStyle(content?.hero_title?.styles)}
            dangerouslySetInnerHTML={{ __html: sanitize(heroTitle) }}
          />
          <p
            className="contact-subtitle"
            style={toInlineStyle(content?.hero_subtitle?.styles)}
            dangerouslySetInnerHTML={{ __html: sanitize(heroSub) }}
          />
        </div>
      </section>

      <section className="contact-content">
        <div className="contact-container">
          <div className="contact-info">
            <h2 className="info-title">Informations de Contact</h2>
            <div className="info-divider" />

            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-details">
                <h3>Localisation</h3>
                <p>{address}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📞</div>
              <div className="info-details">
                <h3>Téléphone</h3>
                <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div className="info-details">
                <h3>Email</h3>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">🕐</div>
              <div className="info-details">
                <h3>Horaires</h3>
                <p>{hours1}</p>
                <p>{hours2}</p>
              </div>
            </div>

            <div className="social-section">
              <h3>Suivez-nous</h3>
              <div className="social-links-contact">
                <a href={facebook} className="social-link" target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href={instagram} className="social-link" target="_blank" rel="noopener noreferrer">Instagram</a>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <h2 className="form-title">Envoyez-nous un message</h2>
            <div className="form-divider" />
            <ContactForm submitLabel={submitBtn} />
          </div>
        </div>
      </section>
    </div>
  );
}
