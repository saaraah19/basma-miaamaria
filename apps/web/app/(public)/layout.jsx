// after
import { Suspense } from "react";
import NavBar from "@/components/public/NavBar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";

// NavBar et Footer lisent leurs données via l'API. Sans <Suspense>, la
// page entière attendait ces lectures avant d'envoyer le moindre octet :
// si la base dormait, le visiteur ne voyait rien (page blanche) et le
// loading.jsx de ce dossier ne pouvait jamais s'afficher. Avec <Suspense>,
// la structure part tout de suite et l'écran de chargement apparaît.
//
// L'espace réservé de la barre de navigation a la même hauteur que la
// vraie (≈ 78 px) pour éviter un saut d'affichage à son arrivée.
function NavBarPlaceholder() {
  return (
    <div
      aria-hidden="true"
      style={{
        boxSizing: "border-box",
        minHeight: "4.85rem",
        background: "var(--color-bg)",
        borderBottom: "2px solid var(--color-primary)",
      }}
    />
  );
}

export default function PublicLayout({ children }) {
  return (
    <>
      <Suspense fallback={<NavBarPlaceholder />}>
        <NavBar />
      </Suspense>
      <main>{children}</main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>
    </>
  );
}
