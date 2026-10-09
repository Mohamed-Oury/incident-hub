import Link from "next/link";
import {
  FileText,
  FolderOpen,
  MessageSquare,
  Users,
  Plus,
  ArrowRight,
  Eye,
  BarChart3,
  Zap,
  Target,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [blogPosts, projects, messages, stats] = await Promise.all([
    prisma.blogPost.findMany({ orderBy: { createdAt: "desc" }, include: { author: true } }),
    prisma.project.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.message.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.siteStats.findFirst({ where: { id: "main-stats" } }),
  ]);

  const unreadMessages = messages.filter((m) => !m.read).length;
  const publishedBlogPosts = blogPosts.filter((b) => b.published).length;
  const publishedProjects = projects.filter((p) => p.published).length;

  const statCards = [
    {
      title: "Articles",
      value: blogPosts.length,
      description: `${publishedBlogPosts} publiés`,
      icon: FileText,
      color: "bg-[#7d1538]",
      href: "/admin/blog",
      trend: "+12%",
    },
    {
      title: "Projets",
      value: projects.length,
      description: `${publishedProjects} actifs`,
      icon: FolderOpen,
      color: "bg-blue-600",
      href: "/admin/projects",
      trend: "+8%",
    },
    {
      title: "Messages",
      value: messages.length,
      description: `${unreadMessages} non lus`,
      icon: MessageSquare,
      color: "bg-emerald-600",
      href: "/admin/messages",
      trend: unreadMessages > 0 ? `${unreadMessages} nouveaux` : "À jour",
    },
    {
      title: "Lecteurs",
      value: stats?.totalViews || 15000,
      description: `${stats?.yearsExperience || 5} ans d'expérience`,
      icon: Users,
      color: "bg-purple-600",
      href: "/admin/stats",
      trend: "Total vus",
    },
  ];

  const quickActions = [
    {
      title: "Nouvel Article",
      description: "Créer un nouvel article de blog",
      icon: Plus,
      href: "/admin/blog/new",
      color: "bg-[#7d1538] hover:bg-[#a01e4a]",
    },
    {
      title: "Nouveau Projet",
      description: "Ajouter un nouveau projet au portfolio",
      icon: Plus,
      href: "/admin/projects/new",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Voir les Messages",
      description: "Consulter les messages de contact",
      icon: Eye,
      href: "/admin/messages",
      color: "bg-emerald-600 hover:bg-emerald-700",
    },
  ];

  const categoryStats = [
    { name: "CBS", value: blogPosts.filter((b) => b.category === "CBS").length, color: "bg-[#7d1538]" },
    { name: "Informatique", value: blogPosts.filter((b) => b.category === "INFORMATIQUE").length, color: "bg-blue-600" },
    { name: "Mathématiques", value: blogPosts.filter((b) => b.category === "MATHEMATIQUES").length, color: "bg-purple-600" },
    { name: "Projets Bancaires", value: projects.filter((p) => p.category === "BANCAIRE" || p.category === "CBS").length, color: "bg-emerald-600" },
  ];

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-8 bg-[#7d1538] rounded-full" />
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Tableau de Bord</h1>
        </div>
        <p className="text-gray-600 text-base max-w-3xl leading-relaxed">
          Bienvenue dans votre espace d&apos;administration. Gérez vos articles, projets, statistiques et messages en temps réel.
        </p>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.color} text-white shadow`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.title}</h3>
                  <div className="text-3xl font-black text-gray-900 mt-1">{stat.value}</div>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{stat.description}</p>
                </div>
                <Link
                  href={stat.href}
                  className="mt-4 pt-3 border-t border-gray-100 inline-flex items-center text-xs font-bold text-[#7d1538] hover:text-[#a01e4a] text-decoration-none"
                >
                  <span>Gérer</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-[#7d1538]" />
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href} className="block text-decoration-none group">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center space-x-4">
                  <div className={`p-3.5 rounded-xl ${action.color} text-white shadow`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 group-hover:text-[#7d1538] transition-colors text-base truncate">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#7d1538] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Grille Articles & Projets Récents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Articles Récents */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#7d1538]" />
                Articles Récents
              </h3>
              <span className="text-xs font-semibold text-gray-500">{blogPosts.length} au total</span>
            </div>
            <div className="space-y-3">
              {blogPosts.slice(0, 4).map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl hover:bg-gray-100/80 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{post.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Catégorie: <span className="font-semibold text-[#7d1538]">{post.category}</span> •{" "}
                      {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:text-[#7d1538] hover:border-[#7d1538] transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/admin/blog"
            className="mt-6 pt-3 border-t border-gray-100 block text-center text-xs font-bold text-[#7d1538] hover:underline text-decoration-none"
          >
            Voir tous les articles →
          </Link>
        </div>

        {/* Projets Récents */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <FolderOpen className="w-5 h-5 mr-2 text-blue-600" />
                Projets Récents
              </h3>
              <span className="text-xs font-semibold text-gray-500">{projects.length} au total</span>
            </div>
            <div className="space-y-3">
              {projects.slice(0, 4).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl hover:bg-gray-100/80 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{project.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Catégorie: <span className="font-semibold text-blue-600">{project.category}</span> •{" "}
                      {new Date(project.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <Link
                    href={`/projets/${project.id}`}
                    target="_blank"
                    className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/admin/projects"
            className="mt-6 pt-3 border-t border-gray-100 block text-center text-xs font-bold text-blue-600 hover:underline text-decoration-none"
          >
            Voir tous les projets →
          </Link>
        </div>
      </div>

      {/* Répartition par Catégorie */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
          Répartition par Domaine &amp; Catégorie
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryStats.map((cat) => (
            <div key={cat.name} className="p-4 bg-gray-50 rounded-xl text-center border border-gray-100">
              <div className={`w-10 h-10 ${cat.color} text-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow`}>
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-gray-600">{cat.name}</h4>
              <div className="text-2xl font-black text-gray-900 mt-1">{cat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
