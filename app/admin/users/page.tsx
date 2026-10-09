"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Edit, Trash2, RefreshCw, Key, Shield, CheckCircle2, XCircle } from "lucide-react";
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
  const [role, setRole] = useState<UserRole>("OPERATOR");
  const [submitting, setSubmitting] = useState(false);

  // Modal / Mode Édition
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("OPERATOR");
  const [editActive, setEditActive] = useState(true);
  const [editResetPwd, setEditResetPwd] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Modal de Confirmation de Suppression
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [deleting, setDeleting] = useState(false);

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
      setRole("OPERATOR");
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

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/users/${userToDelete.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec suppression");
      setSuccessMsg(`L'utilisateur ${userToDelete.name} a été supprimé.`);
      setUserToDelete(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 text-sm mt-1">
            Gérez les comptes d&apos;accès, rôles et autorisations des collaborateurs.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-colors cursor-pointer border-0 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-sm font-semibold flex items-center">
          <XCircle className="w-5 h-5 mr-2 flex-shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-semibold flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grille Principale (Responsive sans overflow) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulaire de création (4 colonnes) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center pb-3 border-b border-gray-100">
            <Plus className="w-5 h-5 mr-2 text-[#7d1538]" />
            Créer un Collaborateur
          </h2>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom Complet</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mohamed Diallo"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Adresse Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m.diallo@banque.com"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Rôle Applicatif</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] outline-none"
              >
                <option value="OPERATOR">Opérateur</option>
                <option value="EXPERT">Expert Monétique / CBS</option>
                <option value="VALIDATOR">Validateur</option>
                <option value="VIEWER">Lecteur</option>
                <option value="ADMIN">Administrateur Global</option>
              </select>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600">
              🔒 <b>Sécurité :</b> Mot de passe initial défini automatiquement sur <code className="bg-gray-200 px-1.5 py-0.5 rounded text-gray-800 font-bold">123456</code>.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#7d1538] hover:bg-[#a01e4a] text-white font-bold rounded-xl text-sm shadow transition-all cursor-pointer border-0 disabled:opacity-50"
            >
              {submitting ? "Création en cours..." : "+ Valider la Création"}
            </button>
          </form>
        </div>

        {/* Tableau des utilisateurs (8 colonnes, responsive scrollable uniquement dans son conteneur) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 min-w-0">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2 text-[#7d1538]" />
              Utilisateurs Enregistrés ({users.length})
            </h2>
          </div>

          <div className="overflow-x-auto w-full rounded-xl border border-gray-200">
            <table className="w-full text-left border-collapse text-sm min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-bold border-b border-gray-200">
                  <th className="py-3 px-4">Collaborateur</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Rôle</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500 font-medium">
                      Chargement des profils...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500 font-medium">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-900 whitespace-nowrap">{u.name}</td>
                      <td className="py-3 px-4 text-gray-600 text-xs whitespace-nowrap">{u.email}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${
                            u.role === "ADMIN"
                              ? "bg-[#7d1538] text-white border-[#7d1538]"
                              : "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {ROLE_LABELS[u.role] || u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`text-xs font-bold ${u.active ? "text-emerald-600" : "text-red-600"}`}>
                          {u.active ? "● Actif" : "○ Inactif"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex space-x-2">
                          <button
                            onClick={() => openEditModal(u)}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs transition-colors cursor-pointer border-0"
                          >
                            ✏️ Éditer
                          </button>
                          {u.email !== "mohaourydiallo@gmail.com" && (
                            <button
                              onClick={() => setUserToDelete(u)}
                              className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg text-xs transition-colors cursor-pointer border-0"
                            >
                              🗑️ Supprimer
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

      {/* Modal d'édition */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Modifier le Profil</h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600 text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Adresse Email</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Rôle Applicatif</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
                  disabled={editingUser.email === "mohaourydiallo@gmail.com"}
                >
                  <option value="OPERATOR">Opérateur</option>
                  <option value="EXPERT">Expert Monétique / CBS</option>
                  <option value="VALIDATOR">Validateur</option>
                  <option value="VIEWER">Lecteur</option>
                  <option value="ADMIN">Administrateur Global</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="editActive"
                  checked={editActive}
                  onChange={(e) => setEditActive(e.target.checked)}
                  disabled={editingUser.email === "mohaourydiallo@gmail.com"}
                  className="w-4 h-4 text-[#7d1538] rounded"
                />
                <label htmlFor="editActive" className="text-sm font-semibold text-gray-800">
                  Compte actif (accès autorisé)
                </label>
              </div>

              <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                <label className="flex items-center space-x-2 text-xs font-bold text-red-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editResetPwd}
                    onChange={(e) => setEditResetPwd(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <span>Réinitialiser le mot de passe à &quot;123456&quot;</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors border-0 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 bg-[#7d1538] hover:bg-[#a01e4a] text-white font-bold rounded-xl text-xs shadow transition-colors border-0 cursor-pointer"
                >
                  {updating ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de suppression */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl">
              🗑️
            </div>
            <h3 className="text-xl font-bold text-gray-900">Confirmer la suppression</h3>
            <p className="text-sm text-gray-600">
              Voulez-vous supprimer définitivement le collaborateur <b className="text-gray-900">{userToDelete.name}</b> ?
            </p>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors border-0 cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteUser}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow transition-colors border-0 cursor-pointer"
              >
                {deleting ? "Suppression..." : "Oui, Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
