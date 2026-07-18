"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import ThemeToggle from "@/components/public/ThemeToggle";
import { useSession, useLogout } from "@/lib/auth-client";
import "./AdminLayout.css";

const NAV_ITEMS = [
  { href: "/admin", icon: "🏠", label: "Dashboard", exact: true },
  { href: "/admin/projects", icon: "🏗️", label: "Projets" },
  { href: "/admin/content", icon: "✏️", label: "Contenu" },
  { href: "/admin/media", icon: "🖼️", label: "Médias" },
];

export default function AdminLayout({ title, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isError, isLoading } = useSession();
  const logout = useLogout();

  useEffect(() => {
    if (!isLoading && isError) {
      router.replace(`/admin/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isError, pathname, router]);

  // Avoid flashing the dashboard shell before we know the session is
  // actually valid — the middleware's cookie-presence check already kept
  // out the fully-logged-out case, this covers "cookie present but expired."
  if (isLoading || isError) return null;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>BSMA</h2>
          <p>Panel d&apos;administration</p>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={isActive ? "active" : ""}>
                <span className="admin-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="admin-logout-btn"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          🚪 {logout.isPending ? "Déconnexion..." : "Déconnexion"}
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h1>{title}</h1>
          <div className="admin-topbar-right">
            <ThemeToggle />
            {user?.email && <span className="admin-user-email">{user.email}</span>}
          </div>
        </div>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
