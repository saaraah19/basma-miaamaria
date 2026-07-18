import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaPinterestP, FaLinkedinIn } from "react-icons/fa";
import { getSection } from "@/lib/api-server";
import { sanitize } from "@/lib/sanitize";
import "./Footer.css";

export default async function Footer() {
  const content = await getSection("footer").catch(() => ({}));
  const currentYear = new Date().getFullYear();

  // richText per CONTENT_REGISTRY — sanitize before dangerouslySetInnerHTML
  const tagline = content?.tagline?.value ?? "Architecture & Décoration Intérieure";
  const description =
    content?.description?.value ??
    "Création d'espaces élégants et raffinés qui reflètent votre style personnel et votre mode de vie.";

  // plainText per CONTENT_REGISTRY — render directly, no HTML parsing
  const phone = content?.phone?.value ?? "+213562580995";
  const email = content?.email?.value ?? "basmamiammaria@gmail.com";
  const address = content?.address?.value ?? "Oran, Algérie";

  // url per CONTENT_REGISTRY
  const facebook = content?.facebook?.value ?? "https://www.facebook.com/BasmaMiaamaria";
  const instagram = content?.instagram?.value ?? "https://www.instagram.com/basma_miaamaria/";
  const pinterest = content?.pinterest?.value ?? "#";
  const linkedin = content?.linkedin?.value ?? "#";

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-brand">
          <Image
            src="/logo_bsma.jpg"
            alt="Basma Miamaria Logo"
            width={120}
            height={60}
            className="footer-logo-image"
          />
          <h3 className="footer-logo">Basma Miamaria</h3>
          <p className="footer-tagline" dangerouslySetInnerHTML={{ __html: sanitize(tagline) }} />
          <p
            className="footer-description"
            dangerouslySetInnerHTML={{ __html: sanitize(description) }}
          />
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Navigation</h4>
          <ul className="footer-links">
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="/projects">Nos Projets</Link></li>
            <li><Link href="/about">À Propos</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/devis">Demander un Devis</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Contactez-nous</h4>
          <ul className="footer-contact">
            <li>
              <span className="contact-label">Tél:</span>
              <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
            </li>
            <li>
              <span className="contact-label">Email:</span>
              <a href={`mailto:${email}`}>{email}</a>
            </li>
            <li>
              <span className="contact-label">Adresse:</span>
              <span>{address}</span>
            </li>
          </ul>
        </div>

        <div className="footer-section footer-social">
          <h4 className="footer-section-title">Suivez-nous</h4>
          <div className="social-icons">
            <a href={facebook} className="social-icon" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href={instagram} className="social-icon" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href={pinterest} className="social-icon" aria-label="Pinterest" target="_blank" rel="noopener noreferrer">
              <FaPinterestP />
            </a>
            <a href={linkedin} className="social-icon" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <p className="footer-copyright">© {currentYear} Basma Miamaria. Tous droits réservés.</p>
        <div className="footer-bottom-links">
          <a href="#privacy">Politique de Confidentialité</a>
          <a href="#terms">Conditions d&apos;Utilisation</a>
        </div>
      </div>
    </footer>
  );
}
