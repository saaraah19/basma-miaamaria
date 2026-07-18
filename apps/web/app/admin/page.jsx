"use client";

import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { useProjectsQuery, useServicesQuery } from "@/lib/admin-queries";
import "./dashboard.css";

function StatCard({ icon, label, value, href }) {
  return (
    <Link href={href} className="stat-card">
      <div className="stat-card-icon">{icon}</div>
      <div>
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
      </div>
    </Link>
  );
}

function QuickAction({ icon, label, desc, href }) {
  return (
    <Link href={href} className="quick-action">
      <div className="quick-action-icon">{icon}</div>
      <div>
        <div className="quick-action-label">{label}</div>
        <div className="quick-action-desc">{desc}</div>
      </div>
    </Link>
  );
}

function DashboardContent() {
  const { data: projects = [] } = useProjectsQuery();
  const { data: services = [] } = useServicesQuery();

  return (
    <>
      <div className="stats-grid">
        <StatCard icon="🏗️" label="Projets" value={projects.length} href="/admin/projects" />
        <StatCard icon="🛋️" label="Services" value={services.length} href="/admin/content" />
      </div>

      <div className="admin-card">
        <p className="quick-actions-label">Accès rapide</p>
        <div className="quick-actions-row">
          <QuickAction icon="＋" label="Nouveau projet" desc="Ajouter au portfolio" href="/admin/projects" />
          <QuickAction icon="✏️" label="Modifier le contenu" desc="Textes & sections" href="/admin/content" />
          <QuickAction icon="🖼️" label="Gérer les médias" desc="Images & fichiers" href="/admin/media" />
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <AdminLayout title="Dashboard">
      <DashboardContent />
    </AdminLayout>
  );
}
