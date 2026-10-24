import Link from "next/link";
import { getSession } from "@/modules/auth/auth-service";
import { canManageUsers } from "@/modules/auth/types";
import { getAllUsers } from "@/modules/auth/user-store";
import { AppShell } from "@/modules/layout/AppShell";
import { UsersManagementClient } from "./UsersManagementClient";

export const dynamic = "force-dynamic";

export default async function UsersManagementPage() {
  const user = await getSession();

  if (!user || !canManageUsers(user)) {
    return (
      <AppShell user={user} pageTitle="Accès Refusé" eyebrow="GOUVERNANCE & SÉCURITÉ">
        <div
          style={{
            background: "#ffffff",
            padding: "2.5rem",
            borderRadius: "16px",
            border: "1px solid #fecaca",
            maxWidth: "620px",
            margin: "2rem auto",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔒</div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#991b1b", marginBottom: "0.5rem" }}>
            Accès réservé au Super Administrateur
          </h2>
          <p style={{ fontSize: "0.92rem", color: "#64748b", marginBottom: "1.5rem" }}>
            Seul le Super Administrateur est autorisé à consulter cet onglet et à créer, modifier ou supprimer des utilisateurs.
          </p>
          <Link href="/hub" className="btn-primary">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </AppShell>
    );
  }

  const allUsers = await getAllUsers();
  const initialUsers = allUsers.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    roles: u.roles,
    active: u.active,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  }));

  return (
    <AppShell
      user={user}
      pageTitle="Gestion des Utilisateurs"
      eyebrow="ADMINISTRATION & HABILITATIONS"
    >
      <UsersManagementClient initialUsers={initialUsers} />
    </AppShell>
  );
}
