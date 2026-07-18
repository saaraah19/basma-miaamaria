import { getSection } from "@/lib/api-server";
import { sanitize } from "@/lib/sanitize";
import { toInlineStyle } from "@/lib/blockStyles";
import "./about.css";

export const metadata = {
  title: "À Propos",
  description:
    "Découvrez l'histoire, les valeurs et les domaines d'expertise du cabinet Basma Miamaria — architecture et décoration intérieure à Oran.",
  alternates: { canonical: "/about" },
};

const DEFAULT_VALEURS = [
  { icon: "✓", label: "Excellence", desc: "Qualité impeccable dans chaque détail" },
  { icon: "✓", label: "Créativité", desc: "Solutions innovantes et uniques" },
  { icon: "✓", label: "Écoresponsabilité", desc: "Design durable et écologique" },
  { icon: "✓", label: "Écoute", desc: "Compréhension totale de vos besoins" },
];

const DEFAULT_EXPERTISE = [
  { icon: "🏛️", label: "Architecture" },
  { icon: "🛋️", label: "Décoration" },
  { icon: "🔨", label: "Rénovation" },
  { icon: "💡", label: "Consultation" },
];

// Content already went through valeursListSchema/expertiseListSchema on
// write (see content.controller.js), so this parse can't fail against
// malformed structure — only against genuinely corrupt JSON, hence the
// fallback rather than a crash.
const parseList = (raw, fallback) => {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export default async function AboutPage() {
  const about = await getSection("about").catch(() => ({}));

  const title = about.title?.value ?? "À Propos de Basma Miamaria";
  const subtitle = about.subtitle?.value ?? "Excellence en architecture et décoration intérieure";
  const histoireTitle = about.histoire_title?.value ?? "Notre Histoire";
  const histoire1 = about.histoire_1?.value ?? "";
  const histoire2 = about.histoire_2?.value ?? "";
  const valeursTitle = about.valeurs_title?.value ?? "Nos Valeurs";
  const valeurs = parseList(about.valeurs?.value, DEFAULT_VALEURS);
  const expertiseTitle = about.expertise_title?.value ?? "Domaines d'Expertise";
  const expertise = parseList(about.expertise?.value, DEFAULT_EXPERTISE);
  const ctaTitle = about.cta_title?.value ?? "Prêt à transformer votre espace ?";
  const ctaButton = about.cta_button?.value ?? "Demander un devis gratuit";

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1
            className="about-title"
            style={toInlineStyle(about.title?.styles)}
            dangerouslySetInnerHTML={{ __html: sanitize(title) }}
          />
          <p
            className="about-subtitle"
            style={toInlineStyle(about.subtitle?.styles)}
            dangerouslySetInnerHTML={{ __html: sanitize(subtitle) }}
          />
        </div>
      </section>

      <section className="about-content">
        <div className="about-grid">
          <div className="about-section">
            <h2
              className="section-title"
              dangerouslySetInnerHTML={{ __html: sanitize(histoireTitle) }}
            />
            <div className="section-divider" />
            <div dangerouslySetInnerHTML={{ __html: sanitize(histoire1) }} />
            <div dangerouslySetInnerHTML={{ __html: sanitize(histoire2) }} />
          </div>

          <div className="about-section">
            <h2
              className="section-title"
              dangerouslySetInnerHTML={{ __html: sanitize(valeursTitle) }}
            />
            <div className="section-divider" />
            <ul className="values-list">
              {valeurs.map((v, i) => (
                <li key={i}>
                  <span className="value-icon">{v.icon}</span>
                  <span><strong>{v.label}</strong> — {v.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="about-section">
            <h2
              className="section-title"
              dangerouslySetInnerHTML={{ __html: sanitize(expertiseTitle) }}
            />
            <div className="section-divider" />
            <div className="expertise-grid">
              {expertise.map((e, i) => (
                <div className="expertise-item" key={i}>
                  <div className="expertise-icon">{e.icon}</div>
                  <h3>{e.label}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <h2 dangerouslySetInnerHTML={{ __html: sanitize(ctaTitle) }} />
        <a href="/devis" className="cta-button">
          {ctaButton}
        </a>
      </section>
    </div>
  );
}
