"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string | string[];
  coverImage: string | null;
  readTime: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; postId: string | null; postTitle: string }>({
    isOpen: false,
    postId: null,
    postTitle: "",
  });
  const [publishModal, setPublishModal] = useState<{
    isOpen: boolean;
    postId: string | null;
    postTitle: string;
    action: "publish" | "unpublish";
  }>({
    isOpen: false,
    postId: null,
    postTitle: "",
    action: "publish",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/admin/blog");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Erreur chargement articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.postId) return;
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/blog/${deleteModal.postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== deleteModal.postId));
        setDeleteModal({ isOpen: false, postId: null, postTitle: "" });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!publishModal.postId) return;
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/blog/${publishModal.postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          published: publishModal.action === "publish",
        }),
      });

      if (response.ok) {
        setPosts(
          posts.map((post) =>
            post.id === publishModal.postId
              ? { ...post, published: publishModal.action === "publish" }
              : post
          )
        );
        setPublishModal({ isOpen: false, postId: null, postTitle: "", action: "publish" });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && post.published) ||
      (filterStatus === "draft" && !post.published);

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (published: boolean) => {
    return published
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : "bg-amber-100 text-amber-800 border-amber-200";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      MATHEMATIQUES: "bg-purple-100 text-purple-800 border-purple-200",
      INFORMATIQUE: "bg-blue-100 text-blue-800 border-blue-200",
      CBS: "bg-emerald-100 text-emerald-800 border-emerald-200",
      GEOPOLITIQUE: "bg-amber-100 text-amber-800 border-amber-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (isLoading) {
    return <div className="p-12 text-center text-gray-500 font-semibold">Chargement des articles...</div>;
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-8 bg-[#7d1538] rounded-full" />
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Gestion des Articles</h1>
          </div>
          <p className="text-gray-600 text-base">Créez, modifiez et gérez vos articles de blog</p>
        </div>

        <Link href="/admin/blog/new">
          <button className="inline-flex items-center px-6 py-3 bg-[#7d1538] hover:bg-[#a01e4a] text-white font-bold rounded-full shadow-lg transition-all text-sm cursor-pointer border-0">
            <Plus className="w-5 h-5 mr-2" />
            Nouvel Article
          </button>
        </Link>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7d1538] outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#7d1538] outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="published">Publiés</option>
              <option value="draft">Brouillons</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cartes Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Total Articles</p>
            <p className="text-2xl font-black text-gray-900">{posts.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Publiés</p>
            <p className="text-2xl font-black text-gray-900">{posts.filter((p) => p.published).length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Brouillons</p>
            <p className="text-2xl font-black text-gray-900">{posts.filter((p) => !p.published).length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center font-bold">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Catégories</p>
            <p className="text-2xl font-black text-gray-900">{new Set(posts.map((p) => p.category)).size}</p>
          </div>
        </div>
      </div>

      {/* Grille 2x2 des Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight">{post.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${getStatusColor(
                    post.published
                  )}`}
                >
                  {post.published ? "Publié" : "Brouillon"}
                </span>
              </div>

              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(post.category)}`}
                >
                  {post.category}
                </span>
                <div className="flex items-center text-xs text-gray-500 font-medium">
                  <User className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  <span>{post.author?.name || "Mr. Oury"}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  <span>{new Date(post.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-gray-100">
              <Link href={`/blog/${post.slug}`} target="_blank" className="flex-1 min-w-[100px]">
                <button className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs border border-gray-200 transition-colors flex items-center justify-center cursor-pointer">
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  Détails
                </button>
              </Link>

              <Link href={`/admin/blog/edit/${post.id}`} className="flex-1 min-w-[100px]">
                <button className="w-full py-2 px-3 bg-[#7d1538]/10 hover:bg-[#7d1538] text-[#7d1538] hover:text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center cursor-pointer border-0">
                  <Edit className="w-3.5 h-3.5 mr-1.5" />
                  Modifier
                </button>
              </Link>

              <button
                onClick={() =>
                  setPublishModal({
                    isOpen: true,
                    postId: post.id,
                    postTitle: post.title,
                    action: post.published ? "unpublish" : "publish",
                  })
                }
                className={`flex-1 min-w-[100px] py-2 px-3 font-bold rounded-xl text-xs border transition-colors flex items-center justify-center cursor-pointer ${
                  post.published
                    ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                {post.published ? <XCircle className="w-3.5 h-3.5 mr-1.5" /> : <CheckCircle className="w-3.5 h-3.5 mr-1.5" />}
                {post.published ? "Dépublier" : "Publier"}
              </button>

              <button
                onClick={() => setDeleteModal({ isOpen: true, postId: post.id, postTitle: post.title })}
                className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs border border-red-200 transition-colors flex items-center justify-center cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Supprimer l&apos;article ?</h3>
            <p className="text-sm text-gray-600">
              Voulez-vous supprimer <b>&quot;{deleteModal.postTitle}&quot;</b> ?
            </p>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setDeleteModal({ isOpen: false, postId: null, postTitle: "" })}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs cursor-pointer border-0"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl text-xs shadow cursor-pointer border-0"
              >
                {isProcessing ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {publishModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              {publishModal.action === "publish" ? "Publier l'article ?" : "Dépublier l'article ?"}
            </h3>
            <p className="text-sm text-gray-600">
              Confirmez l&apos;action sur <b>&quot;{publishModal.postTitle}&quot;</b>.
            </p>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setPublishModal({ isOpen: false, postId: null, postTitle: "", action: "publish" })}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs cursor-pointer border-0"
              >
                Annuler
              </button>
              <button
                onClick={handlePublishToggle}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-[#7d1538] text-white font-bold rounded-xl text-xs shadow cursor-pointer border-0"
              >
                {isProcessing ? "Traitement..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
