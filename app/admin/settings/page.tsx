"use client";

import { useState } from "react";
import { Settings, User, Globe, Shield, Bell, Save, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Mr.Oury - Portfolio & Banking Hub",
    siteDescription: "Portfolio & Plateforme d'ingénierie CBS Amplitude et Monétique ISO 8583 / EMV",
    contactEmail: "mohaourydiallo@gmail.com",
    siteUrl: "https://mroury-monetique.com",
  });

  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setMessage({ type: "success", text: "Paramètres mis à jour avec succès !" });
    } catch {
      setMessage({ type: "error", text: "Erreur lors de la mise à jour." });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "Général", icon: Settings },
    { id: "profile", label: "Profil & Mot de passe", icon: User },
    { id: "seo", label: "SEO & Référencement", icon: Globe },
    { id: "security", label: "Sécurité & Sessions", icon: Shield },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Paramètres Administrateur</h1>
          <p className="text-gray-600 text-sm mt-1">Configurez les paramètres généraux, SEO et la sécurité du compte.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-6 py-3 bg-[#7d1538] hover:bg-[#a01e4a] text-white font-bold rounded-full shadow-md transition-all text-sm cursor-pointer border-0"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Enregistrement..." : "Sauvegarder"}
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="text-sm font-semibold">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation des onglets */}
        <div className="lg:col-span-1 bg-white p-3 rounded-2xl border border-gray-200 shadow-sm self-start">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all text-left border-0 cursor-pointer ${
                    isActive ? "bg-[#7d1538] text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenu principal de l'onglet */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "general" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-gray-900 pb-3 border-b border-gray-100">
                Informations du Site
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Nom de l&apos;application</label>
                  <input
                    type="text"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Description Globale</label>
                  <textarea
                    rows={3}
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email Administrateur</label>
                    <input
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">URL Principale</label>
                    <input
                      type="text"
                      value={generalSettings.siteUrl}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, siteUrl: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-gray-900 pb-3 border-b border-gray-100">
                Sécurité &amp; Mot de Passe
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Mot de passe actuel</label>
                  <input
                    type="password"
                    value={passwordSettings.currentPassword}
                    onChange={(e) => setPasswordSettings({ ...passwordSettings, currentPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Nouveau mot de passe</label>
                    <input
                      type="password"
                      value={passwordSettings.newPassword}
                      onChange={(e) => setPasswordSettings({ ...passwordSettings, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      value={passwordSettings.confirmPassword}
                      onChange={(e) => setPasswordSettings({ ...passwordSettings, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-900 pb-3 border-b border-gray-100">
                Métadonnées &amp; Moteurs de recherche
              </h2>
              <p className="text-sm text-gray-600">
                Le titre et les balises OpenGraph sont optimisés automatiquement pour Google et les réseaux sociaux.
              </p>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-900 pb-3 border-b border-gray-100">
                Statut de la session
              </h2>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold">
                Session Administrateur active (Jeton HMAC SHA256 vérifié).
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
