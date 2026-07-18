import Link from "next/link";
import BackButton from "@/components/public/BackButton";
import "./not-found.css";

export const metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-number">
          <span className="notfound-4">4</span>
          <span className="notfound-0">0</span>
          <span className="notfound-4b">4</span>
        </div>

        <div className="notfound-divider" />

        <h1 className="notfound-title">Page introuvable</h1>
        <p className="notfound-subtitle">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>

        <div className="notfound-actions">
          <BackButton />
          <Link href="/" className="notfound-btn-home">Accueil</Link>
          <Link href="/projects" className="notfound-btn-projects">Nos Projets</Link>
        </div>
      </div>
    </div>
  );
}
