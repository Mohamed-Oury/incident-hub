"use client";

import { useState, useEffect } from "react";
import { User, Briefcase, GraduationCap, Globe, Save, Plus, Trash2, CheckCircle2 } from "lucide-react";

interface Skill {
  name: string;
  level: number;
  category: string;
  icon?: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  type: "work" | "education" | "project";
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
}

interface Language {
  name: string;
  level: string;
  flag?: string;
}

interface AboutData {
  id?: string;
  title: string;
  subtitle: string;
  content: string;
  profileImage: string;
  cvUrl: string;
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  languages: Language[];
}

export default function AdminAboutPage() {
  const [aboutData, setAboutData] = useState<AboutData>({
    title: "À propos de moi",
    subtitle: "Ingénieur Logiciel, Mathématicien & Expert Monétique - CBS",
    content: "Magistère en Mathématiques option Analyse Numérique & Modélisation Mathématique...",
    profileImage: "",
    cvUrl: "",
    skills: [],
    experiences: [],
    education: [],
    languages: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const res = await fetch("/api/admin/about");
      if (res.ok) {
        const data = await res.json();
        setAboutData(data);
      }
    } catch (err) {
      console.error("Erreur lors du chargement À propos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aboutData),
      });

      if (res.ok) {
        const updated = await res.json();
        setAboutData(updated);
        setMessage({ type: "success", text: "Données À propos enregistrées avec succès !" });
      } else {
        setMessage({ type: "error", text: "Erreur lors de la sauvegarde." });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Erreur serveur lors de la sauvegarde." });
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    setAboutData({
      ...aboutData,
      skills: [...aboutData.skills, { name: "", level: 5, category: "GÉNÉRAL", icon: "💻" }],
    });
  };

  const removeSkill = (index: number) => {
    setAboutData({
      ...aboutData,
      skills: aboutData.skills.filter((_, i) => i !== index),
    });
  };

  const addExperience = () => {
    setAboutData({
      ...aboutData,
      experiences: [
        ...aboutData.experiences,
        { id: `exp-${Date.now()}`, title: "", company: "", period: "", description: "", type: "work" },
      ],
    });
  };

  const removeExperience = (index: number) => {
    setAboutData({
      ...aboutData,
      experiences: aboutData.experiences.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 font-semibold">
        Chargement des données À propos...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Gérer la page À propos</h1>
          <p className="text-gray-600 text-sm mt-1">
            Modifiez la présentation, les compétences, le parcours professionnel et la formation de Mr. Oury.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-6 py-3 bg-[#7d1538] hover:bg-[#a01e4a] text-white font-bold rounded-full shadow-md transition-all text-sm cursor-pointer border-0 disabled:opacity-50"
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

      {/* Informations générales */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center pb-3 border-b border-gray-100">
          <User className="w-5 h-5 mr-2 text-[#7d1538]" />
          Informations Générales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Titre Principal</label>
            <input
              type="text"
              value={aboutData.title}
              onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] focus:bg-white outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Sous-titre / Spécialités</label>
            <input
              type="text"
              value={aboutData.subtitle}
              onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] focus:bg-white outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Biographie &amp; Présentation (Markdown)</label>
          <textarea
            rows={8}
            value={aboutData.content}
            onChange={(e) => setAboutData({ ...aboutData, content: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#7d1538] focus:bg-white outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">URL Image de Profil</label>
            <input
              type="text"
              value={aboutData.profileImage}
              onChange={(e) => setAboutData({ ...aboutData, profileImage: e.target.value })}
              placeholder="/images/profile.png"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] focus:bg-white outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">URL Téléchargement CV (PDF)</label>
            <input
              type="text"
              value={aboutData.cvUrl}
              onChange={(e) => setAboutData({ ...aboutData, cvUrl: e.target.value })}
              placeholder="/cv-mohamed-diallo.pdf"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] focus:bg-white outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Compétences */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-[#7d1538]" />
            Compétences Techniques
          </h2>
          <button
            onClick={addSkill}
            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-colors cursor-pointer border-0"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Ajouter une compétence
          </button>
        </div>

        <div className="space-y-4">
          {aboutData.skills.map((skill, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase">Nom</label>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => {
                    const newSkills = [...aboutData.skills];
                    newSkills[index].name = e.target.value;
                    setAboutData({ ...aboutData, skills: newSkills });
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase">Catégorie</label>
                <input
                  type="text"
                  value={skill.category}
                  onChange={(e) => {
                    const newSkills = [...aboutData.skills];
                    newSkills[index].category = e.target.value;
                    setAboutData({ ...aboutData, skills: newSkills });
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase">Icône / Emoji</label>
                <input
                  type="text"
                  value={skill.icon || ""}
                  onChange={(e) => {
                    const newSkills = [...aboutData.skills];
                    newSkills[index].icon = e.target.value;
                    setAboutData({ ...aboutData, skills: newSkills });
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-center"
                />
              </div>

              <div className="flex items-center justify-end pt-3 md:pt-0">
                <button
                  onClick={() => removeSkill(index)}
                  className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors cursor-pointer border-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expériences & Parcours */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-[#7d1538]" />
            Expériences &amp; Parcour Professionnel
          </h2>
          <button
            onClick={addExperience}
            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-colors cursor-pointer border-0"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Ajouter une expérience
          </button>
        </div>

        <div className="space-y-4">
          {aboutData.experiences.map((exp, index) => (
            <div key={exp.id || index} className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Poste / Titre</label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => {
                      const newExps = [...aboutData.experiences];
                      newExps[index].title = e.target.value;
                      setAboutData({ ...aboutData, experiences: newExps });
                    }}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Entreprise / Organisme</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const newExps = [...aboutData.experiences];
                      newExps[index].company = e.target.value;
                      setAboutData({ ...aboutData, experiences: newExps });
                    }}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Période</label>
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => {
                      const newExps = [...aboutData.experiences];
                      newExps[index].period = e.target.value;
                      setAboutData({ ...aboutData, experiences: newExps });
                    }}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Description des réalisations</label>
                <textarea
                  rows={3}
                  value={exp.description}
                  onChange={(e) => {
                    const newExps = [...aboutData.experiences];
                    newExps[index].description = e.target.value;
                    setAboutData({ ...aboutData, experiences: newExps });
                  }}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => removeExperience(index)}
                  className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-bold transition-colors cursor-pointer border-0 inline-flex items-center"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-8 py-3.5 bg-[#7d1538] hover:bg-[#a01e4a] text-white font-bold rounded-full shadow-lg transition-all text-sm cursor-pointer border-0"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Sauvegarde en cours..." : "Enregistrer toutes les modifications"}
        </button>
      </div>
    </div>
  );
}
