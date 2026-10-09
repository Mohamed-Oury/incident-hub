"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Trash2,
  Eye,
  ExternalLink,
  Tag,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { MarkdownRenderer } from "@/modules/portfolio/components/blog/MarkdownRenderer";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

interface ProjectData {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  technologies: string;
  imageUrl: string | null;
  featuredImage: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  published: boolean;
  featured: boolean;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("BANCAIRE");
  const [excerpt, setExcerpt] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    async function loadProject() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/admin/projects/${id}`);
        if (!res.ok) {
          throw new Error("Impossible de charger le projet");
        }
        const data: ProjectData = await res.json();
        setTitle(data.title || "");
        setCategory(data.category || "BANCAIRE");
        setExcerpt(data.excerpt || "");
        setDescription(data.description || "");
        
        // Parse technologies
        try {
          const parsed = JSON.parse(data.technologies || "[]");
          setTechnologies(Array.isArray(parsed) ? parsed.join(", ") : data.technologies);
        } catch {
          setTechnologies(data.technologies || "");
        }

        setImageUrl(data.imageUrl || data.featuredImage || "");
        setDemoUrl(data.demoUrl || "");
        setGithubUrl(data.githubUrl || "");
        setPublished(Boolean(data.published));
        setFeatured(Boolean(data.featured));
      } catch (err: any) {
        setNotification({ type: "error", message: err.message || "Erreur de chargement" });
      } finally {
        setIsLoading(false);
      }
    }
    loadProject();
  }, [id]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setNotification({ type: "error", message: "Le titre est obligatoire" });
      return;
    }

    try {
      setIsSaving(true);
      setNotification(null);

      const techsArray = technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title,
        category,
        excerpt,
        description: description || excerpt,
        technologies: JSON.stringify(techsArray),
        imageUrl: imageUrl.trim() || null,
        demoUrl: demoUrl.trim() || null,
        githubUrl: githubUrl.trim() || null,
        published,
        featured,
      };

      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur lors de l'enregistrement");
      }

      setNotification({ type: "success", message: "Projet mis à jour avec succès !" });
      router.refresh();
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Erreur lors de la sauvegarde" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous certain de vouloir supprimer ce projet ? Cette action est irréversible.")) {
      return;
    }

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      router.push("/admin/projects");
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Erreur de suppression" });
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7d1538]"></div>
        <p className="text-gray-500 font-medium text-sm">Chargement du projet...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Barre de navigation supérieure */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div className="space-y-1">
          <Link
            href="/admin/projects"
            className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#7d1538] transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Retour à la liste des projets
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-8 bg-[#7d1538] rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              Modifier le projet : <span className="text-[#7d1538]">{title || "Sans titre"}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/projets/${id}`}
            target="_blank"
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center shadow-2xs"
          >
            <Eye className="w-4 h-4 mr-1.5" />
            Voir sur le site
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center border border-rose-200 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Supprimer
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#7d1538] hover:bg-[#63102c] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-1.5" />
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center space-x-3 text-sm font-medium border ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Formulaire principal */}
      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center">
            <Sparkles className="w-4 h-4 text-[#7d1538] mr-2" />
            Informations Générales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Titre */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Titre du projet *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex: Monétique & CBS Hub"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] outline-none"
                required
              />
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Catégorie Métier
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] outline-none cursor-pointer"
              >
                <option value="BANCAIRE">BANCAIRE</option>
                <option value="CBS">CBS</option>
                <option value="WEB">WEB</option>
                <option value="MOBILE">MOBILE</option>
                <option value="RESEARCH">RESEARCH</option>
                <option value="DESKTOP">DESKTOP</option>
                <option value="OTHER">AUTRE</option>
              </select>
            </div>
          </div>

          {/* Extrait */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Résumé court / Extrait
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brève description affichée sur les cartes de prévisualisation..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] outline-none leading-relaxed"
            />
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1 text-[#7d1538]" />
              Technologies (séparées par des virgules)
            </label>
            <input
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="ex: Next.js 15, TypeScript, Informix 4GL, ISO 8583, Genero"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] outline-none"
            />
          </div>
        </div>

        {/* Liens & Médias */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center">
            <ImageIcon className="w-4 h-4 text-[#7d1538] mr-2" />
            Visuels &amp; Liens d'Accès
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image URL */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                URL de l'image / Illustration (SVG ou WebP)
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="ex: /images/projects/hub/hub-hero.svg"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] outline-none font-mono"
              />
            </div>

            {/* Prévisualisation miniature */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Aperçu du visuel
              </span>
              <div className="h-16 rounded-xl border border-gray-200 bg-gray-900 flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-500 italic">Aucune image</span>
                )}
              </div>
            </div>

            {/* Demo URL */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center">
                <ExternalLink className="w-3.5 h-3.5 mr-1 text-[#7d1538]" />
                Lien Démo / Accès direct
              </label>
              <input
                type="text"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="ex: /hub ou https://..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] outline-none"
              />
            </div>

            {/* GitHub URL */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Lien GitHub / Dépôt source
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="ex: https://github.com/Mohamed-Oury/incident-hub"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] outline-none"
              />
            </div>
          </div>

          {/* Options de Publication */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-8 items-center">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-5 h-5 text-[#7d1538] rounded-md border-gray-300 focus:ring-[#7d1538]"
              />
              <span className="text-sm font-bold text-gray-800">Publié sur le site public</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-5 h-5 text-[#7d1538] rounded-md border-gray-300 focus:ring-[#7d1538]"
              />
              <span className="text-sm font-bold text-amber-700">🌟 Projet Vedette (Mis en avant)</span>
            </label>
          </div>
        </div>

        {/* Description détaillée avec onglets Édition & Rendu Markdown */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-gray-900">
              Description Détaillée &amp; Modules (Markdown)
            </h2>

            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "edit"
                    ? "bg-white text-[#7d1538] shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Éditeur
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "preview"
                    ? "bg-white text-[#7d1538] shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Aperçu du rendu
              </button>
            </div>
          </div>

          {activeTab === "edit" ? (
            <div className="space-y-2">
              <textarea
                rows={18}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Rédigez la description détaillée en Markdown. Vous pouvez insérer des images avec ![Titre](/images/...) et des titres avec ## ..."
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#7d1538] outline-none leading-relaxed"
              />
              <p className="text-xs text-gray-500 italic">
                Supporte la syntaxe Markdown enrichie : titres (##), code (```lang), listes, images (![alt](url)) et tableaux.
              </p>
            </div>
          ) : (
            <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-200 min-h-[350px]">
              {description ? (
                <MarkdownRenderer content={description} />
              ) : (
                <p className="text-gray-400 italic text-center py-12">
                  Aucun contenu à prévisualiser pour l'instant.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bouton d'enregistrement bas de page */}
        <div className="flex justify-end space-x-4 pt-4">
          <Link
            href="/admin/projects"
            className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold rounded-full text-sm transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-[#7d1538] hover:bg-[#63102c] text-white font-bold rounded-full text-sm transition-all shadow-md hover:shadow-lg flex items-center disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
