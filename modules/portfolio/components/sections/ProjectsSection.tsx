import Link from "next/link";
import { ArrowRight, Code, Database, Brain, Rocket, ExternalLink, Layers } from "lucide-react";
import { GithubIcon } from "@/modules/portfolio/components/common/SocialIcons";
import ProjectCard from "@/modules/portfolio/components/projects/ProjectCard";

interface Project {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  technologies: string[];
  createdAt: Date;
  featured?: boolean;
}

interface ProjectsSectionProps {
  recentProjects: Project[];
  stats: {
    total: number;
    web: number;
    bancaire: number;
    research: number;
    cbs: number;
  };
}

export function ProjectsSection({ recentProjects, stats }: ProjectsSectionProps) {
  return (
    <section className="relative py-20 lg:py-24 bg-gray-50 overflow-hidden border-b border-gray-100">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-5 py-2 rounded-full bg-[#7d1538]/10 text-[#7d1538] text-sm font-semibold mb-6 shadow-sm">
            <Rocket className="w-4 h-4 mr-2" />
            Portfolio de Projets
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Mes <span className="text-[#7d1538]">Créations</span> &amp;{" "}
            <span className="text-[#7d1538]">Innovations</span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez une sélection de mes projets alliant développement web moderne, recherche mathématique appliquée et analyse de systèmes complexes bancaires.
          </p>
        </div>

        {/* Catégories de projets */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-7 bg-[#7d1538] rounded-full"></div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Types de Projets</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Ingénierie logiciel */}
            <div className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#7d1538]/30 transition-all duration-300 shadow-sm hover:shadow-xl group">
              <div className="w-14 h-14 bg-[#7d1538] rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-md">
                <Code className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2 text-center group-hover:text-[#7d1538] transition-colors">
                Ingénierie logiciel
              </h4>
              <p className="text-gray-500 text-xs text-center mb-4 leading-relaxed">
                Applications modernes avec React, Next.js, Angular et Flutter
              </p>
              <div className="flex items-center justify-between text-sm font-bold border-t border-gray-100 pt-3">
                <span className="text-[#7d1538]">{stats.web}</span>
                <span className="text-gray-400 font-normal">projets</span>
              </div>
            </div>

            {/* Systèmes Bancaires */}
            <div className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#7d1538]/30 transition-all duration-300 shadow-sm hover:shadow-xl group">
              <div className="w-14 h-14 bg-[#a01e4a] rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-md">
                <Database className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2 text-center group-hover:text-[#7d1538] transition-colors">
                Systèmes Bancaires
              </h4>
              <p className="text-gray-500 text-xs text-center mb-4 leading-relaxed">
                Solutions bancaires et applications métier (SGABS)
              </p>
              <div className="flex items-center justify-between text-sm font-bold border-t border-gray-100 pt-3">
                <span className="text-[#7d1538]">{stats.bancaire}</span>
                <span className="text-gray-400 font-normal">projets</span>
              </div>
            </div>

            {/* Mathématiques */}
            <div className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#7d1538]/30 transition-all duration-300 shadow-sm hover:shadow-xl group">
              <div className="w-14 h-14 bg-[#5c0f28] rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-md">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2 text-center group-hover:text-[#7d1538] transition-colors">
                Mathématiques
              </h4>
              <p className="text-gray-500 text-xs text-center mb-4 leading-relaxed">
                Projets de recherche en mathématiques appliquées
              </p>
              <div className="flex items-center justify-between text-sm font-bold border-t border-gray-100 pt-3">
                <span className="text-[#7d1538]">{stats.research}</span>
                <span className="text-gray-400 font-normal">projets</span>
              </div>
            </div>

            {/* CBS & Monétique */}
            <div className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#7d1538]/30 transition-all duration-300 shadow-sm hover:shadow-xl group">
              <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-md">
                <Layers className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2 text-center group-hover:text-[#7d1538] transition-colors">
                CBS &amp; Monétique
              </h4>
              <p className="text-gray-500 text-xs text-center mb-4 leading-relaxed">
                Informix 4GL, Amplitude, ISO 8583 &amp; PowerCard
              </p>
              <div className="flex items-center justify-between text-sm font-bold border-t border-gray-100 pt-3">
                <span className="text-[#7d1538]">{stats.cbs}</span>
                <span className="text-gray-400 font-normal">projets</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dernières Réalisations */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-7 bg-[#7d1538] rounded-full"></div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Mes Dernières Réalisations</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} featured={project.featured} />
            ))}
          </div>
        </div>

        {/* Liens réseaux sociaux / GitLab */}
        <div className="mb-12 bg-white rounded-3xl p-8 shadow-md border border-gray-200">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Explorez Mon Travail</h3>
            <p className="text-gray-500 text-sm">Découvrez mes projets sur différentes plateformes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://gitlab.com/Mohamed-Oury"
              target="_blank"
              rel="noreferrer"
              className="flex items-center p-5 bg-gray-50 rounded-2xl group hover:bg-[#7d1538]/5 transition-colors text-decoration-none"
            >
              <div className="w-12 h-12 bg-[#7d1538] rounded-xl flex items-center justify-center mr-4 shadow-sm">
                <GithubIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-0.5 text-base">Code Source</h4>
                <p className="text-gray-500 text-xs">Consultez le code sur GitLab</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#7d1538] group-hover:translate-x-1 transition-all" />
            </a>

            <a
              href="https://www.linkedin.com/in/mohamed-diallo-5316a1167"
              target="_blank"
              rel="noreferrer"
              className="flex items-center p-5 bg-gray-50 rounded-2xl group hover:bg-[#7d1538]/5 transition-colors text-decoration-none"
            >
              <div className="w-12 h-12 bg-[#a01e4a] rounded-xl flex items-center justify-center mr-4 shadow-sm">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-0.5 text-base">Mon LinkedIn</h4>
                <p className="text-gray-500 text-xs">Allez sur mon profil professionnel</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#7d1538] group-hover:translate-x-1 transition-all" />
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/projets" className="text-decoration-none">
            <button className="bg-[#7d1538] hover:bg-[#a01e4a] text-white px-10 py-4 rounded-full text-base sm:text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center cursor-pointer border-0">
              <Rocket className="w-5 h-5 mr-3" />
              Découvrir tous mes projets
              <ArrowRight className="ml-3 h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
