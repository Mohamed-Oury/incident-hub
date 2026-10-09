"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Trash2,
  Eye,
  Tag,
  Image as ImageIcon,
  Check,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { MarkdownRenderer } from "@/modules/portfolio/components/blog/MarkdownRenderer";

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
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
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("MATHEMATIQUES");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/admin/blog/${id}`);
        if (!res.ok) {
          throw new Error("Impossible de charger l'article");
        }
        const data = await res.json();
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setCategory(data.category || "MATHEMATIQUES");
        setExcerpt(data.excerpt || "");
        setContent(data.content || "");
        
        try {
          const parsed = JSON.parse(data.tags || "[]");
          setTags(Array.isArray(parsed) ? parsed.join(", ") : data.tags);
        } catch {
          setTags(data.tags || "");
        }

        setCoverImage(data.coverImage || "");
        setPublished(Boolean(data.published));
        setFeatured(Boolean(data.featured));
      } catch (err: any) {
        setNotification({ type: "error", message: err.message || "Erreur de chargement" });
      } finally {
        setIsLoading(false);
      }
    }
    loadPost();
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

      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title,
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        category,
        excerpt,
        content,
        tags: JSON.stringify(tagsArray),
        coverImage: coverImage.trim() || null,
        published,
        featured,
      };

      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur lors de l'enregistrement");
      }

      setNotification({ type: "success", message: "Article mis à jour avec succès !" });
      router.refresh();
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Erreur lors de la sauvegarde" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous certain de vouloir supprimer cet article ? Cette action est irréversible.")) {
      return;
    }

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      router.push("/admin/blog");
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Erreur de suppression" });
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7d1538]"></div>
        <p className="text-gray-500 font-medium text-sm">Chargement de l'article...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Barre de navigation supérieure */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div className="space-y-1">
          <Link
            href="/admin/blog"
            className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#7d1538] transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Retour à la liste des articles
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-8 bg-[#7d1538] rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              Modifier l'article : <span className="text-[#7d1538]">{title || "Sans titre"}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {slug && (
            <Link
              href={`/blog/${slug}`}
              target="_blank"
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center shadow-2xs"
            >
              <Eye className="w-4 h-4 mr-1.5" />
              Voir l'article
            </Link>
          )}

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
            <BookOpen className="w-4 h-4 text-[#7d1538] mr-2" />
            Informations Générales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Titre */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Titre de l'article *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de l'article..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] outline-none"
                required
              />
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] outline-none cursor-pointer"
              >
                <option value="MATHEMATIQUES">MATHEMATIQUES</option>
                <option value="INFORMATIQUE">INFORMATIQUE (Monétique)</option>
                <option value="CBS">CBS Core Banking</option>
                <option value="GEOPOLITIQUE">GEOPOLITIQUE</option>
              </select>
            </div>

            {/* Slug */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Identifiant URL (Slug)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="slug-de-l-article"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#7d1538] outline-none"
              />
            </div>

            {/* Image de couverture */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center">
                <ImageIcon className="w-3.5 h-3.5 mr-1 text-[#7d1538]" />
                Image de couverture (URL)
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="/images/... ou https://..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] outline-none font-mono"
              />
            </div>
          </div>

          {/* Extrait */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Extrait / Chapô de l'article
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brève introduction visible sur la liste du blog..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] outline-none leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1 text-[#7d1538]" />
              Tags (séparés par des virgules)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ex: Mathématiques, Monte Carlo, Black Scholes, Bâle III"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] outline-none"
            />
          </div>

          {/* Statut de publication */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-8 items-center">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-5 h-5 text-[#7d1538] rounded-md border-gray-300 focus:ring-[#7d1538]"
              />
              <span className="text-sm font-bold text-gray-800">Article Publié sur le blog</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-5 h-5 text-[#7d1538] rounded-md border-gray-300 focus:ring-[#7d1538]"
              />
              <span className="text-sm font-bold text-amber-700">🌟 Article Mis en avant</span>
            </label>
          </div>
        </div>

        {/* Contenu Markdown */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-gray-900">
              Contenu Rédactionnel (Markdown)
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
                rows={22}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Rédigez l'article en Markdown avec formules mathématiques ($$...$$), code (```lang) et illustrations..."
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#7d1538] outline-none leading-relaxed"
              />
            </div>
          ) : (
            <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-200 min-h-[400px]">
              {content ? (
                <MarkdownRenderer content={content} />
              ) : (
                <p className="text-gray-400 italic text-center py-12">
                  Aucun contenu à prévisualiser pour l'instant.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end space-x-4 pt-4">
          <Link
            href="/admin/blog"
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
