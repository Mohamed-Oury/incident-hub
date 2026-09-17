"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SessionUser } from "@/modules/auth/types";

interface AppShellProps {
  children: React.ReactNode;
  user?: SessionUser | null;
  pageTitle?: string;
  eyebrow?: string;
}

export function AppShell({ children, user, pageTitle = "Vue d'ensemble", eyebrow = "EXPLOITATION MONÉTIQUE" }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "Vue d'ensemble", icon: "⊞" },
    { href: "/knowledge", label: "Base de connaissance", icon: "📚" },
    { href: "/de39", label: "Référentiel DE39", icon: "🏷️" },
    { href: "/diagnostic", label: "Diagnostic Assistant", icon: "⚡" },
    { href: "/incidents/new", label: "Nouvel incident", icon: "➕" },
    { href: "/audit", label: "Piste d'audit", icon: "🛡️" },
  ];

  return (
    <div className="shell">
      {/* Sidebar FIXÉE & RÉDUCTIBLE */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="brand">
          <span className="brand-mark">P</span>
          <div className="brand-text">
            M.OURY
            <b>INCIDENT HUB</b>
          </div>
          <button
            type="button"
            className="btn-toggle-sidebar"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Agrandir le menu" : "Réduire le menu"}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="nav-menu" aria-label="Navigation principale">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-item ${isActive ? "active" : ""}`}
                title={collapsed ? link.label : undefined}
              >
                <span className="nav-icon">{link.icon}</span>
                <span className="nav-label">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <span style={{ fontSize: "1.1rem" }}>🛡️</span>
          <div>
            Environnement sécurisé
            <br />
            <b>Données sensibles masquées</b>
          </div>
        </div>
      </aside>

      {/* Contenu avec marge dynamique */}
      <div className={`content ${collapsed ? "collapsed-margin" : ""}`}>
        <header className="topbar">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="page-title">{pageTitle}</h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <Link href="/incidents/new" className="btn-emerald" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
              + Déclarer incident
            </Link>

            {/* Header épuré : rôle et déconnexion */}
            <div className="user-badge">
              <div className="user-avatar">
                {user?.role ? user.role.slice(0, 2) : "AD"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", fontSize: "0.82rem" }}>
                <span style={{ color: "#059669", fontWeight: 700, fontSize: "0.78rem" }}>
                  {user?.role || "ADMIN"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-logout"
                title="Se déconnecter"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        <main className="view-container">
          {children}
        </main>
      </div>
    </div>
  );
}
