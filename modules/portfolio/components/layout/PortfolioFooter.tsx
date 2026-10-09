import Link from "next/link";
import { Mail, ArrowUpRight, Settings } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/modules/portfolio/components/common/SocialIcons";

export function PortfolioFooter() {
  const navigation = [
    { label: "Accueil", href: "/" },
    { label: "Mon Portfolio", href: "/a-propos" },
    { label: "Mes Projets", href: "/projets" },
    { label: "Mon Blog", href: "/blog" },
    { label: "Me contacter", href: "/contact" },
  ];

  return (
    <footer className="bg-[#1f2937] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Logo et Description */}
          <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-6">
            <Link href="/" className="flex items-center space-x-2 md:space-x-3 group text-decoration-none">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#7d1538] rounded-full flex items-center justify-center group-hover:bg-[#a01e4a] transition-colors shadow-lg">
                <span className="text-white font-bold text-lg md:text-xl">M</span>
              </div>
              <div>
                <span className="text-xl md:text-2xl font-bold text-white">Mr.Oury</span>
                <p className="text-gray-400 text-xs md:text-sm">Ingénieur Logiciel &amp; Mathématicien</p>
              </div>
            </Link>

            <p className="text-gray-300 leading-relaxed max-w-md text-sm md:text-base">
              Mathématicien spécialisé en Modelisation, Optimisation, Ingénierie Bancaire, je partage mes connaissances sur l&apos;informatique, les mathématiques, les systèmes bancaires CBS (AmplitudeUp) et la monétique à travers cette plateforme.
            </p>

            {/* Réseaux sociaux */}
            <div className="flex space-x-3 md:space-x-4">
              <a
                href="https://gitlab.com/Mohamed-Oury"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 bg-gray-700/50 rounded-full flex items-center justify-center text-gray-300 hover:bg-[#7d1538] hover:text-white transition-all duration-300"
                aria-label="GitLab"
              >
                <GithubIcon className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/mohamed-diallo-5316a1167"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 bg-gray-700/50 rounded-full flex items-center justify-center text-gray-300 hover:bg-[#7d1538] hover:text-white transition-all duration-300"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4">
              Navigation
            </h3>
            <ul className="space-y-2 md:space-y-3 list-none p-0">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-[#a01e4a] transition-colors duration-300 text-sm md:text-base text-decoration-none"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Redirection Monétique & Collaboration */}
          <div className="space-y-4 md:space-y-6">
            <div className="pt-2">
              <h3 className="text-sm md:text-base font-semibold text-white mb-2">
                Plateforme &amp; Application
              </h3>
              <Link
                href="/hub"
                className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-[#7d1538] to-[#a01e4a] text-white rounded-full font-bold text-xs md:text-sm shadow-md hover:shadow-lg transition-all duration-300 text-decoration-none mb-3"
              >
                <span>💳 Monétique &amp; CBS</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <h3 className="text-sm md:text-base font-semibold text-white mb-2">
                Collaboration
              </h3>
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 bg-[#7d1538] text-white rounded-full hover:bg-[#a01e4a] transition-all duration-300 shadow-md text-xs md:text-sm font-medium text-decoration-none"
              >
                Démarrer un projet
                <ArrowUpRight className="ml-1.5 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Separateur & Copyright */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs md:text-sm text-gray-400">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} Mr.Oury. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center px-3 py-1.5 bg-[#7d1538]/20 text-[#f8d0db] hover:bg-[#7d1538] hover:text-white rounded-full text-xs font-semibold transition-all duration-300 border border-[#7d1538]/40 text-decoration-none"
              >
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                Espace Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
