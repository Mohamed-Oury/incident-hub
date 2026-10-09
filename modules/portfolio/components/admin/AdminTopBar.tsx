"use client";

import Link from "next/link";
import { Menu, User, ExternalLink, ShieldCheck } from "lucide-react";

interface AdminTopBarProps {
  setSidebarOpen: (open: boolean) => void;
  user?: { name?: string; email?: string; role?: string } | null;
}

export default function AdminTopBar({ setSidebarOpen, user }: AdminTopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-[#7d1538] transition-colors"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden sm:flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#7d1538]/10 text-[#7d1538] text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Espace Administrateur Portfolio
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/"
            target="_blank"
            className="hidden md:inline-flex items-center px-3.5 py-1.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-decoration-none"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            Voir le site public
          </Link>

          <Link
            href="/hub"
            className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#7d1538] to-[#a01e4a] text-white text-xs font-bold shadow hover:shadow-md transition-all text-decoration-none"
          >
            <span>💳 Accès Hub Monétique</span>
          </Link>

          <div className="h-6 w-px bg-gray-200 mx-1" />

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#7d1538] text-white font-bold text-xs flex items-center justify-center shadow">
              {user?.name ? user.name.charAt(0).toUpperCase() : "M"}
            </div>
            <span className="text-xs font-bold text-gray-800 hidden sm:inline-block">
              {user?.name || "Mr. Oury"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
