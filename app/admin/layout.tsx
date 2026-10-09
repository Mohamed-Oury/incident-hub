"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/modules/portfolio/components/admin/AdminSidebar";
import AdminTopBar from "@/modules/portfolio/components/admin/AdminTopBar";

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar de l'Admin */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} />

      {/* Zone de contenu principal */}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0 transition-all duration-300">
        <AdminTopBar setSidebarOpen={setSidebarOpen} user={user} />

        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
