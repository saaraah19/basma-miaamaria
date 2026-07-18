import Link from "next/link";
import Image from "next/image";
import { getSection } from "@/lib/api-server";
import ThemeToggle from "./ThemeToggle";
import "./NavBar.css";

export default async function NavBar() {
  // If the API is briefly unreachable, fall back to sane defaults rather
  // than crashing the whole layout — a navbar with the wrong site name is
  // recoverable, a 500 on every page is not.
  const content = await getSection("navbar").catch(() => ({}));

  const siteName = content?.site_name?.value ?? "Basma Miamaria";
  const btnDevisText = content?.btn_devis_text?.value ?? "Demander un devis";

  return (
    <nav className="navbar">
      <Link href="/" className="logo-container">
        <Image
          src="/logo_bsma.jpg"
          alt="Basma Miamaria Logo"
          width={50}
          height={50}
          className="logo-image"
          priority
        />
        <span className="logo-text">{siteName}</span>
      </Link>

      <ul className="nav-links">
        <li><Link href="/">Accueil</Link></li>
        <li><Link href="/about">À propos</Link></li>
        <li><Link href="/projects">Projets</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>

      <div className="navbar-right">
        <ThemeToggle />
        <Link href="/devis" className="devis-button">
          {btnDevisText}
        </Link>
      </div>
    </nav>
  );
}
