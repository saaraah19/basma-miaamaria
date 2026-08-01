"use client";
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import HeroEditor from "@/components/admin/content/sections/HeroEditor";
import HomeEditor from "@/components/admin/content/sections/HomeEditor";
import AboutEditor from "@/components/admin/content/sections/AboutEditor";
import ServicesEditor from "@/components/admin/content/sections/ServicesEditor";
import ContactEditor from "@/components/admin/content/sections/ContactEditor";
import NavbarEditor from "@/components/admin/content/sections/NavbarEditor";
import FooterEditor from "@/components/admin/content/sections/FooterEditor";
import ContactPageEditor from "@/components/admin/content/sections/ContactPageEditor";
import DevisEditor from "@/components/admin/content/sections/DevisEditor";
import "./content.css";

// Each tab maps to the public URL it actually affects — used to render a
// "view on site" link next to the tab bar. Navbar/Footer touch every page,
// so they link to the homepage as the most representative preview.
const TABS = [
  { key: "hero", label: "Hero", Component: HeroEditor, publicPath: "/" },
  { key: "home", label: "Home", Component: HomeEditor, publicPath: "/" },
  { key: "about", label: "À propos", Component: AboutEditor, publicPath: "/about" },
  { key: "services", label: "Services", Component: ServicesEditor, publicPath: "/#services" },
  { key: "contact", label: "Contact", Component: ContactEditor, publicPath: "/#contact" },
  { key: "navbar", label: "Navbar", Component: NavbarEditor, publicPath: "/" },
  { key: "footer", label: "Footer", Component: FooterEditor, publicPath: "/" },
  { key: "contact_page", label: "Page Contact", Component: ContactPageEditor, publicPath: "/contact" },
  { key: "devis", label: "Devis", Component: DevisEditor, publicPath: "/devis" },
];

function ContentEditorContent() {
  const [activeTab, setActiveTab] = useState("hero");

  const activeTabData = TABS.find((t) => t.key === activeTab);
  const ActiveComponent = activeTabData?.Component;

  return (
    <>
      <div className="content-tab-bar">
        <div className="content-tab-bar-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? "active" : ""}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTabData?.publicPath && (
          <a
            className="btn-secondary content-view-link"
            href={`${process.env.NEXT_PUBLIC_SITE_URL}${activeTabData.publicPath}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 Voir sur le site
          </a>
        )}
      </div>

      {ActiveComponent && <ActiveComponent />}
    </>
  );
}

export default function ContentEditorPage() {
  return (
    <AdminLayout title="Éditeur de contenu">
      <ContentEditorContent />
    </AdminLayout>
  );
}
