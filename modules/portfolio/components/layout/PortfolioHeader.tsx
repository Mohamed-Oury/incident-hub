"use client";

import Link from "next/link";
import { useState } from "react";

export function PortfolioHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { label: "Accueil", href: "/" },
    { label: "À propos", href: "/a-propos" },
    { label: "Projets", href: "/projets" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 md:space-x-3 group text-decoration-none">
            <div className="w-9 h-9 md:w-11 md:h-11 bg-[#7d1538] rounded-full flex items-center justify-center group-hover:bg-[#a01e4a] transition-all duration-300 shadow-md">
              <span className="text-white font-bold text-base md:text-xl">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">Mr.Diallo</span>
              <span className="text-xs text-gray-500 hidden sm:block">
                Mathématicien &amp; Expert Monétique - CBS
              </span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-[#7d1538] transition-colors duration-200 font-medium text-sm lg:text-base text-decoration-none"
              >
                {item.label}
              </Link>
            ))}

            {/* Onglet Spécial Redirection vers la Plateforme Monétique & CBS */}
            <Link
              href="/hub"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7d1538] to-[#a01e4a] text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 font-bold text-xs lg:text-sm text-decoration-none shadow-md"
            >
              <span>💳</span>
              <span>Plateforme Monétique &amp; CBS</span>
              <span className="bg-white text-[#7d1538] text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                HUB
              </span>
            </Link>
          </nav>

          {/* Actions Desktop (Bouton Contact & Admin) */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/contact"
              className="bg-[#7d1538] text-white px-5 py-2.5 rounded-full hover:bg-[#a01e4a] transition-all duration-300 shadow-md text-sm font-medium text-decoration-none"
            >
              Contact
            </Link>
            <Link
              href="/admin/dashboard"
              className="border border-[#7d1538] text-[#7d1538] hover:bg-[#7d1538] hover:text-white px-4 py-2 rounded-full transition-all duration-300 text-xs font-semibold text-decoration-none"
            >
              Admin
            </Link>
          </div>

          {/* Bouton Menu Mobile */}
          <button
            className="md:hidden p-2 text-[#7d1538] hover:bg-gray-100 rounded-lg transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <span className="text-2xl">☰</span>
          </button>
        </div>

        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white">
            <nav className="space-y-2 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2.5 text-gray-700 hover:text-[#7d1538] hover:bg-gray-50 rounded-lg text-base font-medium text-decoration-none"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/hub"
                className="block bg-gradient-to-r from-[#7d1538] to-[#a01e4a] text-white px-4 py-3 rounded-lg text-center font-bold text-decoration-none shadow"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                💳 Plateforme Monétique &amp; CBS (HUB)
              </Link>
              <Link
                href="/contact"
                className="block bg-[#7d1538] text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-[#a01e4a] text-decoration-none"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Me contacter
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
