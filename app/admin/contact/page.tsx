"use client";

import { useState, useEffect } from "react";
import { Mail, Save, Phone, MapPin, Globe, Plus, Trash2, CheckCircle2 } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
}

interface ContactData {
  id?: string;
  title: string;
  subtitle?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  socialLinks: string;
  availability: string;
}

export default function AdminContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactData>({
    title: "Me contacter",
    subtitle: "Parlons de vos projets bancaires, CBS Amplitude ou monétique",
    email: "mohaourydiallo@gmail.com",
    phone: "+225 07 00 00 00 00",
    address: "Abidjan, Côte d'Ivoire",
    socialLinks: "[]",
    availability: "Disponible pour du conseil, des missions CBS et de la prestation Monétique.",
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  useEffect(() => {
    try {
      const parsed = JSON.parse(contactInfo.socialLinks || "[]");
      setSocialLinks(Array.isArray(parsed) ? parsed : []);
    } catch {
      setSocialLinks([]);
    }
  }, [contactInfo.socialLinks]);

  const fetchContactInfo = async () => {
    try {
      const res = await fetch("/api/admin/contact");
      if (res.ok) {
        const data = await res.json();
        setContactInfo(data);
      }
    } catch (err) {
      console.error("Erreur récupération contact:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const dataToSave = {
        ...contactInfo,
        socialLinks: JSON.stringify(socialLinks),
      };

      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (res.ok) {
        const updated = await res.json();
        setContactInfo(updated);
        setMessage({ type: "success", text: "Informations de contact sauvegardées !" });
      } else {
        setMessage({ type: "error", text: "Erreur lors de la sauvegarde." });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Erreur serveur." });
    } finally {
      setSaving(false);
    }
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "LinkedIn", url: "" }]);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500 font-semibold">Chargement des infos de contact...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Informations de Contact</h1>
          <p className="text-gray-600 text-sm mt-1">
            Modifiez vos coordonnées et vos liens de réseaux sociaux affichés sur le Portfolio.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-6 py-3 bg-[#7d1538] hover:bg-[#a01e4a] text-white font-bold rounded-full shadow-md transition-all text-sm cursor-pointer border-0"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Sauvegarde..." : "Sauvegarder"}
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

      {/* Formulaire principal */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center pb-3 border-b border-gray-100">
          <Mail className="w-5 h-5 mr-2 text-[#7d1538]" />
          Coordonnées Générales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Titre de la Page</label>
            <input
              type="text"
              value={contactInfo.title}
              onChange={(e) => setContactInfo({ ...contactInfo, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#7d1538] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Adresse Email principale</label>
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#7d1538] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Téléphone</label>
            <input
              type="text"
              value={contactInfo.phone || ""}
              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7d1538] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Localisation / Adresse</label>
            <input
              type="text"
              value={contactInfo.address || ""}
              onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7d1538] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Message de Disponibilité</label>
          <textarea
            rows={3}
            value={contactInfo.availability}
            onChange={(e) => setContactInfo({ ...contactInfo, availability: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7d1538] outline-none"
          />
        </div>
      </div>

      {/* Réseaux sociaux */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-[#7d1538]" />
            Réseaux Sociaux
          </h2>
          <button
            onClick={addSocialLink}
            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-colors cursor-pointer border-0"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Ajouter un réseau
          </button>
        </div>

        <div className="space-y-3">
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input
                type="text"
                placeholder="Plateforme (ex: GitLab, LinkedIn)"
                value={link.platform}
                onChange={(e) => {
                  const updated = [...socialLinks];
                  updated[index].platform = e.target.value;
                  setSocialLinks(updated);
                }}
                className="w-1/3 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold"
              />
              <input
                type="text"
                placeholder="URL (ex: https://gitlab.com/...)"
                value={link.url}
                onChange={(e) => {
                  const updated = [...socialLinks];
                  updated[index].url = e.target.value;
                  setSocialLinks(updated);
                }}
                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
              />
              <button
                onClick={() => removeSocialLink(index)}
                className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors cursor-pointer border-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
