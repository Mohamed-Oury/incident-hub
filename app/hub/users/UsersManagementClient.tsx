"use client";

import { useState } from "react";
import {
  UserRole,
  ROLE_LABELS,
  MODULE_ROLES,
  SUPER_ADMIN_EMAILS,
} from "@/modules/auth/types";

export interface ManagedUserItem {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  roles: UserRole[];
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

const GOVERNANCE_ROLES: {
  role: UserRole;
  label: string;
  badge: string;
  color: string;
  description: string;
}[] = [
  {
    role: "SUPER_ADMIN",
    label: "Super Administrateur",
    badge: "👑 Super Admin",
    color: "#7c3aed",
    description:
      "Accès intégral aux 3 modules + Gestion des utilisateurs (créer/modifier/supprimer) + Suppression & Modification des incidents validés",
  },
  {
    role: "ADMIN",
    label: "Administrateur",
    badge: "🛡️ Admin",
    color: "#0f172a",
    description:
      "Peut modifier les incidents (même validés) dans la base de connaissances. Ne peut pas supprimer d'incident ni gérer les utilisateurs.",
  },
];

const POLE_ROLES: {
  role: UserRole;
  label: string;
  badge: string;
  description: string;
}[] = [
  {
    role: "ROLE_EXPLOITATION",
    label: "Pôle Exploitation & Diagnostic",
    badge: "⚡ Exploitation",
    description: "Vue d'ensemble, Base de connaissances, Diagnostic, Antisèches",
  },
  {
    role: "ROLE_DECODEURS",
    label: "Pôle Analyse & Décodeurs",
    badge: "🧮 Décodeurs",
    description: "Parseur Trame ISO 8583, Décodeur Bitmap, EMV / DE55, Journal GAB",
  },
  {
    role: "ROLE_REFERENTIELS",
    label: "Pôle Formation & Référentiels",
    badge: "🎓 Formation & Certif",
    description: "Cursus certifiants, Académies, Normes MTI / DE39",
  },
  {
    role: "ROLE_EXPERTISE",
    label: "Pôle Expertise & Ops",
    badge: "🛠️ Expertise & Ops",
    description: "Diagnostic Clés HSM, Générateur Post-Mortem, Logs AIX, Incidents RUN/AEOD",
  },
];

function getRoleBadgeStyle(role: UserRole): { bg: string; text: string; border: string; label: string } {
  switch (role) {
    case "SUPER_ADMIN":
      return { bg: "#f3e8ff", text: "#6b21a8", border: "#d8b4fe", label: "👑 SUPER ADMIN" };
    case "ADMIN":
      return { bg: "#e0e7ff", text: "#1e40af", border: "#bfdbfe", label: "🛡️ ADMIN" };
    case "ROLE_MONETIQUE":
      return { bg: "#ffe4e6", text: "#be123c", border: "#fecdd3", label: "💳 Monétique" };
    case "ROLE_AMPLITUDE":
      return { bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd", label: "🏦 Amplitude" };
    case "ROLE_FLEXCUBE":
      return { bg: "#ffedd5", text: "#c2410c", border: "#fed7aa", label: "🏛️ FLEXCUBE" };
    case "ROLE_EXPLOITATION":
      return { bg: "#ecfdf5", text: "#047857", border: "#a7f3d0", label: "⚡ Exploitation" };
    case "ROLE_DECODEURS":
      return { bg: "#f1f5f9", text: "#334155", border: "#cbd5e1", label: "🧮 Décodeurs" };
    case "ROLE_REFERENTIELS":
      return { bg: "#fef3c7", text: "#92400e", border: "#fde68a", label: "🎓 Formation/Réf" };
    case "ROLE_EXPERTISE":
      return { bg: "#fae8ff", text: "#86198f", border: "#f5d0fe", label: "🛠️ Expertise/Ops" };
    default:
      return { bg: "#f4f4f5", text: "#3f3f46", border: "#e4e4e7", label: ROLE_LABELS[role] || role };
  }
}

export function UsersManagementClient({ initialUsers }: { initialUsers: ManagedUserItem[] }) {
  const [users, setUsers] = useState<ManagedUserItem[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Formulaire de création
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("123456");
  const [createRoles, setCreateRoles] = useState<UserRole[]>(["ROLE_MONETIQUE"]);
  const [creating, setCreating] = useState(false);

  // Formulaire d'édition
  const [editingUser, setEditingUser] = useState<ManagedUserItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [editRoles, setEditRoles] = useState<UserRole[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);

  const toggleRoleInList = (list: UserRole[], role: UserRole): UserRole[] => {
    const exists = list.includes(role);
    let next: UserRole[];
    if (exists) {
      next = list.filter((r) => r !== role);
    } else {
      next = [...list, role];
      // Si on coche SUPER_ADMIN, on coche automatiquement les 3 modules
      if (role === "SUPER_ADMIN") {
        if (!next.includes("ROLE_MONETIQUE")) next.push("ROLE_MONETIQUE");
        if (!next.includes("ROLE_AMPLITUDE")) next.push("ROLE_AMPLITUDE");
        if (!next.includes("ROLE_FLEXCUBE")) next.push("ROLE_FLEXCUBE");
      }
    }
    return next;
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createRoles.length === 0) {
      setFeedback({ type: "error", message: "Veuillez cocher au moins un rôle ou module d'accès." });
      return;
    }
    setCreating(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createName,
          email: createEmail,
          password: createPassword,
          roles: createRoles,
          role: createRoles[0],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la création de l'utilisateur.");
      }

      setUsers((prev) => [data.user, ...prev]);
      setCreateName("");
      setCreateEmail("");
      setCreatePassword("123456");
      setCreateRoles(["ROLE_MONETIQUE"]);
      setShowCreateModal(false);
      setFeedback({
        type: "success",
        message: `Utilisateur "${data.user.name}" (${data.user.email}) créé avec succès ! Mot de passe : ${data.user.defaultPassword || "123456"}`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = (u: ManagedUserItem) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditPassword("");
    setEditActive(u.active);
    setEditRoles(Array.isArray(u.roles) && u.roles.length > 0 ? u.roles : [u.role]);
    setFeedback(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (editRoles.length === 0) {
      setFeedback({ type: "error", message: "Veuillez cocher au moins un rôle pour cet utilisateur." });
      return;
    }

    setSavingEdit(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          active: editActive,
          roles: editRoles,
          role: editRoles[0],
          password: editPassword.trim() ? editPassword.trim() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour.");
      }

      setUsers((prev) => prev.map((item) => (item.id === editingUser.id ? data.user : item)));
      setEditingUser(null);
      setFeedback({
        type: "success",
        message: `Profil et habilitations de "${data.user.name}" mis à jour avec succès.`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleToggleActive = async (u: ManagedUserItem) => {
    try {
      const res = await fetch(`/api/users/${u.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !u.active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers((prev) => prev.map((item) => (item.id === u.id ? data.user : item)));
      setFeedback({
        type: "success",
        message: `Compte ${u.email} ${!u.active ? "activé" : "désactivé"}.`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  const handleDeleteUser = async (u: ManagedUserItem) => {
    if (!window.confirm(`Confirmez-vous la suppression définitive de l'utilisateur "${u.name}" (${u.email}) ?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/users/${u.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Impossible de supprimer.");
      setUsers((prev) => prev.filter((item) => item.id !== u.id));
      setFeedback({
        type: "success",
        message: `Utilisateur "${u.name}" (${u.email}) supprimé définitivement.`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.roles || [u.role]).some((r) => r.toLowerCase().includes(q))
    );
  });

  const renderRoleCheckboxes = (
    selectedRoles: UserRole[],
    onToggle: (r: UserRole) => void
  ) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* 1. Accès aux Modules de l'Application */}
      <div>
        <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          1. Accès aux Modules de l&apos;Application (Univers)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
          {MODULE_ROLES.map((m) => {
            const checked = selectedRoles.includes(m.role);
            return (
              <label
                key={m.role}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.65rem",
                  padding: "0.85rem",
                  borderRadius: "10px",
                  border: checked ? `2px solid ${m.color}` : "1px solid #cbd5e1",
                  background: checked ? `${m.color}0d` : "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(m.role)}
                  style={{ marginTop: "0.2rem", width: "16px", height: "16px", accentColor: m.color }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.88rem", color: "#0f172a" }}>{m.badge}</div>
                  <div style={{ fontSize: "0.76rem", color: "#64748b", marginTop: "0.2rem", lineHeight: 1.35 }}>
                    {m.description}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Rôles de Gouvernance & Administration */}
      <div>
        <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          2. Rôles d&apos;Administration &amp; Droits sur la Base de Connaissances
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.75rem" }}>
          {GOVERNANCE_ROLES.map((g) => {
            const checked = selectedRoles.includes(g.role);
            return (
              <label
                key={g.role}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.65rem",
                  padding: "0.85rem",
                  borderRadius: "10px",
                  border: checked ? `2px solid ${g.color}` : "1px solid #cbd5e1",
                  background: checked ? `${g.color}0d` : "#ffffff",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(g.role)}
                  style={{ marginTop: "0.2rem", width: "16px", height: "16px", accentColor: g.color }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.88rem", color: "#0f172a" }}>
                    {g.badge} — {g.label}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "#64748b", marginTop: "0.2rem", lineHeight: 1.35 }}>
                    {g.description}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Pôles Fonctionnels Spécifiques */}
      <div>
        <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          3. Pôles Métier Spécifiques (Optionnel — laissez décoché pour accès complet au module choisi)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.65rem" }}>
          {POLE_ROLES.map((p) => {
            const checked = selectedRoles.includes(p.role);
            return (
              <label
                key={p.role}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.6rem",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  border: checked ? "2px solid #059669" : "1px solid #e2e8f0",
                  background: checked ? "#ecfdf5" : "#f8fafc",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(p.role)}
                  style={{ marginTop: "0.2rem", width: "15px", height: "15px", accentColor: "#059669" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.84rem", color: "#0f172a" }}>{p.badge}</div>
                  <div style={{ fontSize: "0.74rem", color: "#64748b", marginTop: "0.15rem" }}>
                    {p.description}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* En-tête & Bouton Créer */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#ffffff",
          padding: "1.75rem 2rem",
          borderRadius: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              color: "#c084fc",
              background: "rgba(192, 132, 252, 0.15)",
              padding: "0.25rem 0.65rem",
              borderRadius: "999px",
              border: "1px solid rgba(192, 132, 252, 0.3)",
            }}
          >
            👑 ESPACE RÉSERVÉ SUPER ADMINISTRATEUR
          </span>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 900, marginTop: "0.5rem", marginBottom: "0.25rem" }}>
            Gestion des Utilisateurs &amp; Habilitations Multi-Modules
          </h2>
          <p style={{ fontSize: "0.88rem", color: "#94a3b8", margin: 0 }}>
            Créez, modifiez ou supprimez les comptes et cochez leurs accès aux modules (Monétique, Amplitude, FLEXCUBE) ainsi que leurs privilèges d&apos;administration.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowCreateModal(!showCreateModal);
            setEditingUser(null);
          }}
          style={{
            background: "linear-gradient(135deg, #e11d48 0%, #be123c 100%)",
            color: "#ffffff",
            border: "none",
            padding: "0.75rem 1.35rem",
            borderRadius: "10px",
            fontWeight: 800,
            fontSize: "0.88rem",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(225, 29, 72, 0.35)",
          }}
        >
          {showCreateModal ? "✕ Fermer le formulaire" : "➕ Nouvel Utilisateur"}
        </button>
      </div>

      {/* Message de confirmation ou d'erreur */}
      {feedback && (
        <div
          style={{
            padding: "1rem 1.25rem",
            borderRadius: "12px",
            fontWeight: 600,
            fontSize: "0.88rem",
            background: feedback.type === "success" ? "#ecfdf5" : "#fef2f2",
            color: feedback.type === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${feedback.type === "success" ? "#a7f3d0" : "#fecaca"}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            {feedback.type === "success" ? "✅ " : "⚠️ "}
            {feedback.message}
          </span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 800, color: "inherit" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Formulaire de Création d'Utilisateur */}
      {showCreateModal && (
        <form
          onSubmit={handleCreateUser}
          style={{
            background: "#ffffff",
            padding: "1.75rem",
            borderRadius: "16px",
            border: "2px solid #0f172a",
            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "1.35rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.85rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              ➕ Créer un nouvel utilisateur et cocher ses rôles d&apos;accès
            </h3>
            <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
              Cochez un ou plusieurs modules / rôles
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.35rem" }}>
                Nom complet *
              </label>
              <input
                type="text"
                required
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Ex: Amadou Koné"
                style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.88rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.35rem" }}>
                Adresse Email *
              </label>
              <input
                type="email"
                required
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                placeholder="Ex: amadou.kone@banque.com"
                style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.88rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.35rem" }}>
                Mot de passe initial
              </label>
              <input
                type="text"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                placeholder="123456"
                style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.88rem" }}
              />
            </div>
          </div>

          {renderRoleCheckboxes(createRoles, (role) =>
            setCreateRoles((prev) => toggleRoleInList(prev, role))
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid #e2e8f0" }}>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="btn-secondary"
              style={{ padding: "0.6rem 1.15rem", fontSize: "0.85rem" }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={creating}
              className="btn-emerald"
              style={{ padding: "0.6rem 1.4rem", fontSize: "0.85rem", fontWeight: 800 }}
            >
              {creating ? "Création en cours..." : "✓ Créer l'utilisateur avec ces rôles"}
            </button>
          </div>
        </form>
      )}

      {/* Modal / Panneau de Modification d'un Utilisateur */}
      {editingUser && (
        <form
          onSubmit={handleSaveEdit}
          style={{
            background: "#ffffff",
            padding: "1.75rem",
            borderRadius: "16px",
            border: "2px solid #0284c7",
            boxShadow: "0 10px 25px rgba(2, 132, 199, 0.12)",
            display: "flex",
            flexDirection: "column",
            gap: "1.35rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.85rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0369a1", margin: 0 }}>
              ✏️ Modifier l&apos;utilisateur : {editingUser.name} ({editingUser.email})
            </h3>
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              style={{ background: "none", border: "none", fontSize: "1rem", cursor: "pointer", color: "#64748b", fontWeight: 800 }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.35rem" }}>
                Nom complet *
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.88rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.35rem" }}>
                Adresse Email *
              </label>
              <input
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.88rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.35rem" }}>
                Nouveau mot de passe (optionnel)
              </label>
              <input
                type="text"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Laisser vide pour conserver l'actuel"
                style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.88rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.35rem" }}>
                Statut du compte
              </label>
              <select
                value={editActive ? "ACTIVE" : "INACTIVE"}
                onChange={(e) => setEditActive(e.target.value === "ACTIVE")}
                style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.88rem" }}
              >
                <option value="ACTIVE">✓ Compte Actif</option>
                <option value="INACTIVE">✕ Compte Désactivé</option>
              </select>
            </div>
          </div>

          {renderRoleCheckboxes(editRoles, (role) =>
            setEditRoles((prev) => toggleRoleInList(prev, role))
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid #e2e8f0" }}>
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="btn-secondary"
              style={{ padding: "0.6rem 1.15rem", fontSize: "0.85rem" }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={savingEdit}
              className="btn-emerald"
              style={{ padding: "0.6rem 1.4rem", fontSize: "0.85rem", fontWeight: 800 }}
            >
              {savingEdit ? "Enregistrement..." : "💾 Enregistrer les modifications"}
            </button>
          </div>
        </form>
      )}

      {/* Barre de recherche & Tableau des Utilisateurs */}
      <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Utilisateurs enregistrés ({filteredUsers.length})
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0.2rem 0 0 0" }}>
              Seul le Super Administrateur peut créer, modifier ou supprimer un utilisateur.
            </p>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email ou rôle..."
            style={{
              minWidth: "280px",
              padding: "0.55rem 0.9rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "0.85rem",
            }}
          />
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôles &amp; Modules Autorisés</th>
                <th>Statut</th>
                <th style={{ textAlign: "right" }}>Actions SuperAdmin</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const rolesList = Array.isArray(u.roles) && u.roles.length > 0 ? u.roles : [u.role];
                const isProtectedSuperAdmin = SUPER_ADMIN_EMAILS.includes(u.email.toLowerCase());

                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{u.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>ID: {u.id}</div>
                    </td>
                    <td>
                      <code style={{ fontSize: "0.82rem", color: "#334155", fontWeight: 600 }}>{u.email}</code>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                        {rolesList.map((r) => {
                          const st = getRoleBadgeStyle(r);
                          return (
                            <span
                              key={r}
                              style={{
                                fontSize: "0.73rem",
                                fontWeight: 700,
                                padding: "0.2rem 0.55rem",
                                borderRadius: "6px",
                                background: st.bg,
                                color: st.text,
                                border: `1px solid ${st.border}`,
                              }}
                            >
                              {st.label}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.active ? "badge-emerald" : "badge-warning"}`}>
                        {u.active ? "✓ Actif" : "Désactivé"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.4rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(u)}
                          className="btn-secondary"
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem", fontWeight: 700 }}
                        >
                          ✏️ Modifier
                        </button>
                        {!isProtectedSuperAdmin && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleToggleActive(u)}
                              className="btn-secondary"
                              style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem" }}
                            >
                              {u.active ? "Désactiver" : "Activer"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u)}
                              style={{
                                padding: "0.35rem 0.65rem",
                                fontSize: "0.78rem",
                                fontWeight: 700,
                                borderRadius: "8px",
                                border: "1px solid #fecaca",
                                background: "#fef2f2",
                                color: "#dc2626",
                                cursor: "pointer",
                              }}
                            >
                              🗑️ Supprimer
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
