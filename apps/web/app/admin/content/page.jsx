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

const TABS = [
  { key: "hero", label: "Hero", Component: HeroEditor },
  { key: "home", label: "Home", Component: HomeEditor },
  { key: "about", label: "À propos", Component: AboutEditor },
  { key: "services", label: "Services", Component: ServicesEditor },
  { key: "contact", label: "Contact", Component: ContactEditor },
  { key: "navbar", label: "Navbar", Component: NavbarEditor },
  { key: "footer", label: "Footer", Component: FooterEditor },
  { key: "contact_page", label: "Page Contact", Component: ContactPageEditor },
  { key: "devis", label: "Devis", Component: DevisEditor },
];

function ContentEditorContent() {
  const [activeTab, setActiveTab] = useState("hero");
  const ActiveComponent = TABS.find((t) => t.key === activeTab)?.Component;

  return (
    <>
      <div className="content-tab-bar">
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
