"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GithubIcon } from "@/modules/portfolio/components/common/SocialIcons";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Search,
  Filter,
  Calendar,
  Tag,
  Star,
  AlertTriangle,
  Code,
  Globe,
  PauseCircle,
  PlayCircle,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  excerpt: string;
  technologies: string | string[];
  category: string;
  githubUrl?: string | null;
  demoUrl?: string | null;
  imageUrl?: string | null;
  featuredImage?: string | null;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    projectId: string | null;
    projectTitle: string;
  }>({
    isOpen: false,
    projectId: null,
    projectTitle: "",
  });
  const [featureModal, setFeatureModal] = useState<{
    isOpen: boolean;
    projectId: string | null;
    projectTitle: string;
    action: "feature" | "unfeature";
  }>({
    isOpen: false,
    projectId: null,
    projectTitle: "",
    action: "feature",
  });
  const [publishModal, setPublishModal] = useState<{
    isOpen: boolean;
    projectId: string | null;
    projectTitle: string;
    action: "publish" | "unpublish";
  }>({
    isOpen: false,
    projectId: null,
    projectTitle: "",
    action: "publish",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error("Erreur lors du chargement des projets");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des projets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.projectId) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/projects/${deleteModal.projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProjects(projects.filter((project) => project.id !== deleteModal.projectId));
        setDeleteModal({ isOpen: false, projectId: null, projectTitle: "" });
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      alert("Erreur lors de la suppression");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFeatureToggle = async () => {
    if (!featureModal.projectId) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/projects/${featureModal.projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          featured: featureModal.action === "feature",
        }),
      });

      if (response.ok) {
        setProjects(
          projects.map((project) =>
            project.id === featureModal.projectId
              ? { ...project, featured: featureModal.action === "feature" }
              : project
          )
        );
        setFeatureModal({ isOpen: false, projectId: null, projectTitle: "", action: "feature" });
      } else {
        alert("Erreur lors de la modification");
      }
    } catch (error) {
      alert("Erreur lors de la modification");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!publishModal.projectId) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/projects/${publishModal.projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          published: publishModal.action === "publish",
        }),
      });

      if (response.ok) {
        setProjects(
          projects.map((project) =>
            project.id === publishModal.projectId
              ? { ...project, published: publishModal.action === "publish" }
              : project
          )
        );
        setPublishModal({ isOpen: false, projectId: null, projectTitle: "", action: "publish" });
      } else {
        alert("Erreur lors de la publication");
      }
    } catch (error) {
      alert("Erreur lors de la publication");
    } finally {
      setIsProcessing(false);
    }
  };

  const parseTechs = (techs: string | string[]): string[] => {
    if (Array.isArray(techs)) return techs;
    if (!techs) return [];
    try {
      const parsed = JSON.parse(techs);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // split comma
    }
    return techs.split(",").map((s) => s.trim()).filter(Boolean);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.excerpt && project.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === "all" || project.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      BANCAIRE: "bg-blue-100 text-blue-800 border-blue-200",
      CBS: "bg-emerald-100 text-emerald-800 border-emerald-200",
      WEB: "bg-purple-100 text-purple-800 border-purple-200",
      MOBILE: "bg-orange-100 text-orange-800 border-orange-200",
      DESKTOP: "bg-indigo-100 text-indigo-800 border-indigo-200",
      RESEARCH: "bg-pink-100 text-pink-800 border-pink-200",
      OTHER: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      BANCAIRE: "Bancaire",
      CBS: "CBS",
      WEB: "Web",
      MOBILE: "Mobile",
      DESKTOP: "Desktop",
      RESEARCH: "Recherche",
      OTHER: "Autre",
    };
    return labels[category] || category;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7d1538]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-8 bg-[#7d1538] rounded-full"></div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Projets</h1>
          </div>
          <p className="text-gray-600 text-base">
            Gérez vos projets et réalisations
          </p>
        </div>

        <Link href="/admin/projects/new">
          <button className="bg-[#7d1538] hover:bg-[#63102c] text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center">
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Projet
          </button>
        </Link>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7d1538] focus:border-[#7d1538] text-sm text-gray-900"
            />
          </div>

          {/* Filtre par catégorie */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7d1538] focus:border-[#7d1538] text-sm text-gray-900 bg-white"
            >
              <option value="all">Toutes les catégories</option>
              <option value="BANCAIRE">Bancaire</option>
              <option value="CBS">CBS</option>
              <option value="WEB">Web</option>
              <option value="MOBILE">Mobile</option>
              <option value="DESKTOP">Desktop</option>
              <option value="RESEARCH">Recherche</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <Code className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold text-gray-900">{projects.length}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Publiés</p>
            <p className="text-xl font-bold text-gray-900">{projects.filter((p) => p.published).length}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">En vedette</p>
            <p className="text-xl font-bold text-gray-900">{projects.filter((p) => p.featured).length}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
            <GithubIcon className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Open Source</p>
            <p className="text-xl font-bold text-gray-900">{projects.filter((p) => p.githubUrl).length}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Catégories</p>
            <p className="text-xl font-bold text-gray-900">{new Set(projects.map((p) => p.category)).size}</p>
          </div>
        </div>
      </div>

      {/* Liste des projets en grille 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const techs = parseTechs(project.technologies);
          return (
            <div key={project.id} className="bg-white border border-gray-200 shadow-md hover:shadow-lg rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* En-tête du projet */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{project.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {project.published ? (
                        <div className="flex items-center space-x-1">
                          <Globe className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs text-emerald-600 font-medium">Publié</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <PauseCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500 font-medium">Brouillon</span>
                        </div>
                      )}
                      {project.featured && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-amber-500 fill-current" />
                          <span className="text-xs text-amber-600 font-medium">Vedette</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${getCategoryColor(project.category)}`}>
                    {getCategoryLabel(project.category)}
                  </span>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {project.excerpt}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {techs.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-rose-50 text-[#7d1538] text-xs font-medium rounded-md border border-rose-200"
                    >
                      {tech}
                    </span>
                  ))}
                  {techs.length > 5 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md border border-gray-200">
                      +{techs.length - 5}
                    </span>
                  )}
                </div>

                {/* Métadonnées */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(project.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                        title="Voir sur GitHub"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                        title="Voir la démo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/portfolio/projects/${project.id}`} target="_blank" className="w-full">
                    <button className="w-full py-2 px-3 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-medium transition-colors flex items-center justify-center">
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Détails
                    </button>
                  </Link>

                  <Link href={`/admin/projects/edit/${project.id}`} className="w-full">
                    <button className="w-full py-2 px-3 border border-[#7d1538] text-[#7d1538] hover:bg-[#7d1538] hover:text-white rounded-xl text-xs font-medium transition-colors flex items-center justify-center">
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      Modifier
                    </button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      setPublishModal({
                        isOpen: true,
                        projectId: project.id,
                        projectTitle: project.title,
                        action: project.published ? "unpublish" : "publish",
                      })
                    }
                    className={`py-2 px-3 border rounded-xl text-xs font-medium transition-colors flex items-center justify-center ${
                      project.published
                        ? "border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white"
                        : "border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                    }`}
                  >
                    {project.published ? (
                      <>
                        <PauseCircle className="w-3.5 h-3.5 mr-1" />
                        Dépublier
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-3.5 h-3.5 mr-1" />
                        Publier
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      setFeatureModal({
                        isOpen: true,
                        projectId: project.id,
                        projectTitle: project.title,
                        action: project.featured ? "unfeature" : "feature",
                      })
                    }
                    className={`py-2 px-3 border rounded-xl text-xs font-medium transition-colors flex items-center justify-center ${
                      project.featured
                        ? "border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
                        : "border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white"
                    }`}
                  >
                    {project.featured ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                        Retirer
                      </>
                    ) : (
                      <>
                        <Star className="w-3.5 h-3.5 mr-1" />
                        Vedette
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() =>
                    setDeleteModal({
                      isOpen: true,
                      projectId: project.id,
                      projectTitle: project.title,
                    })
                  }
                  className="w-full py-2 px-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-medium transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Supprimer le projet
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message si aucun projet */}
      {filteredProjects.length === 0 && (
        <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-12 text-center">
          <div className="space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-[#7d1538]/10 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-[#7d1538]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Aucun projet trouvé</h3>
            <p className="text-gray-600 text-sm">
              {searchQuery ? "Essayez avec des mots-clés différents." : "Commencez par créer votre premier projet."}
            </p>
            {!searchQuery && (
              <Link href="/admin/projects/new" className="inline-block">
                <button className="bg-[#7d1538] hover:bg-[#63102c] text-white px-6 py-3 rounded-full font-medium shadow-md">
                  <Plus className="w-5 h-5 mr-2 inline-block" />
                  Créer un projet
                </button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Modal de suppression */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-red-600">Confirmer la suppression</h3>
            <p className="text-gray-600 text-sm">
              Êtes-vous sûr de vouloir supprimer le projet <strong>"{deleteModal.projectTitle}"</strong> ? Cette action est irréversible.
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setDeleteModal({ isOpen: false, projectId: null, projectTitle: "" })}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {isProcessing ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de mise en vedette */}
      {featureModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className={`text-lg font-bold ${featureModal.action === "feature" ? "text-emerald-600" : "text-amber-600"}`}>
              {featureModal.action === "feature" ? "Mettre en vedette" : "Retirer de la vedette"}
            </h3>
            <p className="text-gray-600 text-sm">
              {featureModal.action === "feature"
                ? `Voulez-vous mettre le projet "${featureModal.projectTitle}" en vedette ?`
                : `Voulez-vous retirer le projet "${featureModal.projectTitle}" de la vedette ?`}
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setFeatureModal({ isOpen: false, projectId: null, projectTitle: "", action: "feature" })}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleFeatureToggle}
                disabled={isProcessing}
                className={`flex-1 py-2.5 text-white rounded-xl text-sm font-medium disabled:opacity-50 ${
                  featureModal.action === "feature"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {isProcessing ? "Traitement..." : featureModal.action === "feature" ? "Mettre en vedette" : "Retirer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de publication */}
      {publishModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className={`text-lg font-bold flex items-center space-x-2 ${publishModal.action === "publish" ? "text-emerald-600" : "text-amber-600"}`}>
              {publishModal.action === "publish" ? <PlayCircle className="w-5 h-5" /> : <PauseCircle className="w-5 h-5" />}
              <span>{publishModal.action === "publish" ? "Publier le projet" : "Dépublier le projet"}</span>
            </h3>
            <p className="text-gray-600 text-sm">
              {publishModal.action === "publish"
                ? `Voulez-vous publier le projet "${publishModal.projectTitle}" ? Il sera visible sur votre portfolio public.`
                : `Voulez-vous dépublier le projet "${publishModal.projectTitle}" ? Il ne sera plus visible sur votre portfolio public.`}
            </p>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-600">
              {publishModal.action === "publish"
                ? "✅ Le projet apparaîtra dans votre portfolio public"
                : "⚠️ Le projet sera masqué dans votre portfolio public"}
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setPublishModal({ isOpen: false, projectId: null, projectTitle: "", action: "publish" })}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handlePublishToggle}
                disabled={isProcessing}
                className={`flex-1 py-2.5 text-white rounded-xl text-sm font-medium disabled:opacity-50 ${
                  publishModal.action === "publish"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {isProcessing ? "Traitement..." : publishModal.action === "publish" ? "Publier" : "Dépublier"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
