import "./BrandLoader.css";

// Écran de chargement de marque, affiché par app/(public)/loading.jsx
// pendant que le serveur attend des données (ex. réveil de la base Neon).
//
// Volontairement 100 % CSS : aucun JS côté client, aucune dépendance,
// et aucun dégradé (aplats de vert olive uniquement, comme demandé).
// Il n'apparaît qu'après ~0,3 s : un chargement rapide n'affiche rien.

// Élévation d'un petit pavillon tracée comme sur un plan d'architecte.
// [tracé SVG, délai d'apparition en secondes]
const TRACES = [
  ["M8 118 H192", 0], // sol
  ["M30 118 V64 H120 V118", 0.25], // volume bas
  ["M120 118 V40 H168 V118", 0.6], // volume haut
  ["M22 64 H128", 0.95], // débord de toiture (bas)
  ["M112 40 H176", 1.15], // débord de toiture (haut)
  ["M44 80 H76 V104 H44 Z", 1.4], // fenêtre
  ["M90 80 H108 V104 H90 Z", 1.6], // fenêtre
  ["M134 58 H154 V104 H134 Z", 1.8], // grande baie
  ["M183 22 A7 7 0 1 1 169 22 A7 7 0 1 1 183 22", 2.0], // soleil
  ["M28 132 H170", 2.2], // cote
  ["M28 127 V137", 2.4], // repère de cote
  ["M170 127 V137", 2.5], // repère de cote
];

export default function BrandLoader() {
  return (
    <div className="brand-loader">
      <svg
        className="brand-loader__plan"
        viewBox="0 0 200 145"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <pattern
            id="brand-loader-grid"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path d="M10 0H0V10" fill="none" stroke="currentColor" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect
          className="brand-loader__grid"
          width="200"
          height="145"
          fill="url(#brand-loader-grid)"
        />
        {TRACES.map(([d, delay]) => (
          <path
            key={d}
            d={d}
            pathLength="1"
            className="brand-loader__trace"
            style={{ "--d": `${delay}s` }}
          />
        ))}
      </svg>

      <p className="brand-loader__name">Basma Miaamaria</p>
      <p className="brand-loader__tag">Architecture &amp; Décoration Intérieure</p>

      <span className="brand-loader__track" aria-hidden="true">
        <span className="brand-loader__bar" />
      </span>

      <p className="brand-loader__hint" aria-hidden="true">
        Le site se réveille, quelques secondes encore. Merci de votre patience.
      </p>

      <span className="brand-loader__sr" role="status">
        Chargement en cours
      </span>
    </div>
  );
}
