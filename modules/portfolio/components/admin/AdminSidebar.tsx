"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  MessageSquare,
  User,
  BarChart3,
  Mail,
  Users,
  LogOut,
  X,
  Globe,
  Settings,
} from "lucide-react";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user?: { name?: string; email?: string; role?: string } | null;
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: "Tableau de bord", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Articles", href: "/admin/blog", icon: FileText },
    { name: "Projets", href: "/admin/projects", icon: FolderOpen },
    { name: "À propos", href: "/admin/about", icon: User },
    { name: "Statistiques", href: "/admin/stats", icon: BarChart3 },
    { name: "Contact", href: "/admin/contact", icon: Mail },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Utilisateurs", href: "/admin/users", icon: Users },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar fixée */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 md:w-72 bg-white border-r border-gray-200 shadow-xl z-50 transition-transform duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header de la sidebar */}
        <div className="flex items-center justify-between h-16 md:h-20 px-6 bg-gradient-to-r from-[#7d1538] to-[#a01e4a] text-white flex-shrink-0 shadow-md">
          <Link href="/admin/dashboard" className="flex items-center space-x-3 text-decoration-none">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <span className="text-white font-bold text-lg block leading-tight">Admin Panel</span>
              <span className="text-white/80 text-xs font-medium">Mr.Oury Portfolio</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
            aria-label="Fermer la sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation principale */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Gestion Portfolio
          </div>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 text-decoration-none relative ${
                  isActive
                    ? "bg-[#7d1538] text-white shadow-md shadow-[#7d1538]/20"
                    : "text-gray-700 hover:bg-gray-100 hover:text-[#7d1538]"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-white rounded-r-full" />
                )}
                <Icon
                  className={`w-5 h-5 mr-3 transition-colors ${
                    isActive ? "text-white" : "text-gray-500 group-hover:text-[#7d1538]"
                  }`}
                />
                <span className="font-semibold">{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-gray-100">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
              Navigation Rapide
            </div>
            <Link
              href="/"
              className="flex items-center px-3.5 py-2.5 rounded-xl font-medium text-sm text-gray-700 hover:bg-gray-100 hover:text-[#7d1538] transition-all text-decoration-none"
            >
              <Globe className="w-5 h-5 mr-3 text-gray-500" />
              <span>Voir le Portfolio (Public)</span>
            </Link>
            <Link
              href="/hub"
              className="flex items-center px-3.5 py-2.5 rounded-xl font-medium text-sm text-gray-700 hover:bg-[#7d1538]/10 hover:text-[#7d1538] transition-all text-decoration-none mt-1"
            >
              <span className="mr-3 text-lg">💳</span>
              <span className="font-bold">App Monétique & CBS</span>
            </Link>
          </div>
        </div>

        {/* Footer Sidebar : profil & déconnexion */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/80 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-9 h-9 bg-gradient-to-br from-[#7d1538] to-[#a01e4a] rounded-xl flex items-center justify-center text-white shadow-sm font-bold">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">
                {user?.name || "Mr. Oury Diallo"}
              </p>
              <p className="text-[11px] text-gray-500 truncate">
                {user?.email || "mohaourydiallo@gmail.com"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-white border border-red-200 text-red-700 hover:bg-red-50 font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
