"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import { ROLE_LABELS, UserRole } from "@/modules/auth/types";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Formulaire création
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("ROLE_EXPLOITATION");
  const [submitting, setSubmitting] = useState(false);

  // Modal / Mode Édition
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("ROLE_EXPLOITATION");
  const [editActive, setEditActive] = useState(true);
  const [editResetPwd, setEditResetPwd] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur chargement utilisateurs");
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Impossible de créer l'utilisateur");

      setSuccessMsg(`Utilisateur créé avec succès ! Mot de passe initial : 123456`);
      setName("");
      setEmail("");
      setRole("ROLE_EXPLOITATION");
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (u: UserItem) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditRole(u.role);
    setEditActive(u.active);
    setEditResetPwd(false);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUpdating(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          role: editRole,
          active: editActive,
          resetPassword: editResetPwd,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec modification utilisateur");

      setSuccessMsg(`Utilisateur ${editName} mis à jour avec succès ! ${editResetPwd ? "(Mot de passe réinitialisé à 123456)" : ""}`);
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous certain de vouloir supprimer l'utilisateur ${name} ?`)) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec suppression");
      setSuccessMsg(`Utilisateur ${name} supprimé avec succès.`);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AppShell pageTitle="Gestion des Utilisateurs & Rôles Applicatifs" eyebrow="ADMINISTRATION SYSTÈME">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        
        {/* Bandeau d'information sur la politique d'accès */}
        <div
          style={{
            background: "#111827",
            color: "#ffffff",
            padding: "1.25rem 1.5rem",
            borderRadius: "12px",
            borderLeft: "5px solid #e60028",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.08em", color: "#e60028", fontWeight: 700, textTransform: "uppercase" }}>
              POLITIQUE DE CONTRÔLE D&apos;ACCÈS BASÉE SUR LES RÔLES (RBAC)
            </span>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginTop: "0.2rem" }}>
              Chaque onglet regroupé correspond à un pôle de compétences
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "0.15rem" }}>
              Les collaborateurs accèdent directement à la première vue de leur pôle sans voir les autres sections. Mot de passe initial : <code style={{ color: "#ffffff", background: "#374151", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>123456</code>.
            </p>
          </div>
        </div>

        {error && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid #fecaca" }}>
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div style={{ background: "#ecfdf5", color: "#065f46", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid #a7f3d0" }}>
            ✅ {successMsg}
          </div>
        )}

        {/* Modal de modification d'utilisateur */}
        {editingUser && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
          >
            <div
              className="card"
              style={{
                width: "100%",
                maxWidth: "500px",
                background: "#ffffff",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Modifier l&apos;utilisateur</h3>
                <button
                  onClick={() => setEditingUser(null)}
                  style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateUser} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    Nom complet :
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    Email professionnel :
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    Rôle / Périmètre applicatif :
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="input"
                    disabled={editingUser.email === "ourykohkoun@gmail.com"}
                  >
                    <option value="ROLE_EXPLOITATION">⚡ Pôle Exploitation (Dashboard, Base Connaissances, Diagnostic)</option>
                    <option value="ROLE_DECODEURS">🧮 Pôle Décodeurs (Parseur ISO 8583, Bitmap, EMV/DE55, Journal GAB)</option>
                    <option value="ROLE_REFERENTIELS">📖 Pôle Référentiels (MTI, DE39, Piste d&apos;audit)</option>
                    <option value="ROLE_EXPERTISE">🛠️ Pôle Expertise &amp; Outils (Clés HSM, Timeouts, Post-Mortem)</option>
                    <option value="ADMIN">👑 Administrateur Global (Accès Intégral)</option>
                  </select>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <input
                    type="checkbox"
                    id="activeCheckbox"
                    checked={editActive}
                    onChange={(e) => setEditActive(e.target.checked)}
                    disabled={editingUser.email === "ourykohkoun@gmail.com"}
                  />
                  <label htmlFor="activeCheckbox" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    Compte actif (autorisé à se connecter)
                  </label>
                </div>

                <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#e60028" }}>
                    <input
                      type="checkbox"
                      checked={editResetPwd}
                      onChange={(e) => setEditResetPwd(e.target.checked)}
                    />
                    Réinitialiser le mot de passe à &quot;123456&quot;
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="btn-primary"
                  >
                    {updating ? "Enregistrement..." : "Enregistrer les modifications"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 2fr", gap: "1.5rem" }}>
          
          {/* Formulaire de création */}
          <div className="card">
            <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.5rem" }}>
              ➕ Créer un collaborateur
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
              Attribuez le rôle adéquat pour restreindre l&apos;accès au périmètre métier du collaborateur.
            </p>

            <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                  Nom complet du collaborateur :
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Jean Dupont"
                  className="input"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                  Adresse email professionnelle :
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="j.dupont@banque.com"
                  className="input"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                  Périmètre &amp; Rôle applicatif :
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="input"
                  style={{ background: "#ffffff", color: "#111827" }}
                >
                  <option value="ROLE_EXPLOITATION">⚡ Pôle Exploitation (Dashboard, Base Connaissances, Diagnostic)</option>
                  <option value="ROLE_DECODEURS">🧮 Pôle Décodeurs (Parseur ISO 8583, Bitmap, EMV/DE55, Journal GAB)</option>
                  <option value="ROLE_REFERENTIELS">📖 Pôle Référentiels (MTI, DE39, Piste d&apos;audit)</option>
                  <option value="ROLE_EXPERTISE">🛠️ Pôle Expertise &amp; Outils (Clés HSM, Timeouts, Post-Mortem)</option>
                  <option value="ADMIN">👑 Administrateur Global (Accès Intégral)</option>
                </select>
              </div>

              <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "0.78rem", color: "#64748b" }}>
                🔒 <b>Sécurité :</b> Mot de passe initial défini automatiquement sur <code>123456</code>.
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
              >
                {submitting ? "Création en cours..." : "+ Valider la création"}
              </button>
            </form>
          </div>

          {/* Liste des utilisateurs existants avec action Modifier & Supprimer */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Utilisateurs Enregistrés ({users.length})</h3>
              <button
                type="button"
                onClick={fetchUsers}
                className="btn-secondary"
                style={{ fontSize: "0.78rem", padding: "0.35rem 0.75rem" }}
              >
                🔄 Actualiser
              </button>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Collaborateur</th>
                    <th>Email</th>
                    <th>Rôle / Périmètre</th>
                    <th>Statut</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                        Chargement des profils...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                        Aucun utilisateur trouvé.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <b style={{ color: "#111827" }}>{u.name}</b>
                        </td>
                        <td style={{ fontSize: "0.85rem", color: "#4b5563" }}>{u.email}</td>
                        <td>
                          <span
                            style={{
                              display: "inline-block",
                              fontSize: "0.72rem",
                              fontWeight: 800,
                              padding: "0.25rem 0.6rem",
                              borderRadius: "6px",
                              background: u.role === "ADMIN" ? "#111827" : "#fef2f2",
                              color: u.role === "ADMIN" ? "#ffffff" : "#e60028",
                              border: u.role === "ADMIN" ? "1px solid #374151" : "1px solid #fee2e2",
                            }}
                          >
                            {ROLE_LABELS[u.role] || u.role}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.75rem", color: u.active ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
                            {u.active ? "● Actif" : "○ Inactif"}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "0.35rem" }}>
                            <button
                              type="button"
                              onClick={() => openEditModal(u)}
                              className="btn-secondary"
                              style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                            >
                              ✏️ Modifier
                            </button>
                            {u.email !== "ourykohkoun@gmail.com" && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                style={{
                                  background: "#fee2e2",
                                  border: "1px solid #fecaca",
                                  color: "#991b1b",
                                  padding: "0.3rem 0.6rem",
                                  fontSize: "0.75rem",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontWeight: 600,
                                }}
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
