import { Suspense } from "react";
import HeroSection from "@/components/public/HeroSection";
import ServicesSection from "@/components/public/ServicesSection";
import ProjectsSection from "@/components/public/ProjectsSection";
import ContactSection from "@/components/public/ContactSection";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Accueil",
  description:
    "Basma Miamaria — cabinet d'architecture et de décoration intérieure à Oran. Découvrez nos projets, nos services et demandez un devis gratuit.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<SectionFallback />}>
        <ServicesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ProjectsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ContactSection />
      </Suspense>
    </>
  );
}

function SectionFallback() {
  return <div style={{ minHeight: "40vh" }} aria-hidden="true" />;
}
