import { PortfolioHeader } from "@/modules/portfolio/components/layout/PortfolioHeader";
import { PortfolioFooter } from "@/modules/portfolio/components/layout/PortfolioFooter";
import { MarkdownRenderer } from "@/modules/portfolio/components/blog/MarkdownRenderer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GithubIcon } from "@/modules/portfolio/components/common/SocialIcons";
import {
  ArrowLeft,
  Calendar,
  Tag,
  ExternalLink,
  Code,
  Users,
  Globe,
  Star,
  Layers,
  ShieldCheck,
} from "lucide-react";

export const revalidate = 60;

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

const parseTechs = (techsInput: string | null | undefined): string[] => {
  if (!techsInput) return [];
  try {
    const parsed = JSON.parse(techsInput);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {}
  return techsInput.split(",").map((s) => s.trim()).filter(Boolean);
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    notFound();
  }

  const technologies = parseTechs(project.technologies);

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans flex flex-col justify-between">
      <div>
        <PortfolioHeader />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-black via-gray-900 to-[#7d1538] text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link
                href="/projets"
                className="inline-flex items-center text-rose-200 hover:text-white font-semibold transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux projets
              </Link>
            </div>

            <div className="max-w-4xl space-y-6">
              {/* Catégorie */}
              <div>
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                  {project.category}
                </span>
              </div>

              {/* Titre */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight text-white tracking-tight">
                {project.title}
              </h1>

              {/* Extrait */}
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-normal">
                {project.excerpt || project.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2.5 border border-white/40 bg-white/10 hover:bg-white hover:text-gray-900 text-white font-medium rounded-xl transition-all duration-200 text-sm shadow-sm"
                  >
                    <GithubIcon className="w-4 h-4 mr-2" />
                    Voir le code GitHub
                  </a>
                )}

                {project.demoUrl && (
                  project.demoUrl.startsWith("/") ? (
                    <Link
                      href={project.demoUrl}
                      className="inline-flex items-center px-5 py-2.5 bg-[#7d1538] hover:bg-[#63102c] text-white font-medium rounded-xl transition-all duration-200 text-sm shadow-md"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Explorer la plateforme en direct
                    </Link>
                  ) : (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2.5 bg-[#7d1538] hover:bg-[#63102c] text-white font-medium rounded-xl transition-all duration-200 text-sm shadow-md"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Voir la démo en direct
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Detail Body Section */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content (2 Columns) */}
              <div className="lg:col-span-2 space-y-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-2 h-6 bg-[#7d1538] rounded-full mr-3"></div>
                    À propos du projet
                  </h2>

                  <div className="bg-white border border-gray-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
                    <MarkdownRenderer content={project.description} />
                  </div>
                </div>

                {/* Illustration Image / Mockup Card */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Visuel du projet</h3>
                  {project.imageUrl || project.featuredImage ? (
                    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md">
                      <img
                        src={project.imageUrl || project.featuredImage || ""}
                        alt={project.title}
                        className="w-full h-auto max-h-[450px] object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-rose-50 via-gray-100 to-gray-200 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-center p-6">
                      <div className="w-16 h-16 bg-[#7d1538]/10 text-[#7d1538] rounded-full flex items-center justify-center mb-3">
                        <Layers className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-bold text-gray-700">{project.title}</p>
                      <p className="text-xs text-gray-500 mt-1">Architecture &amp; Réalisation Technique</p>
                    </div>
                  )}
                </div>

                {/* Main Features Grid */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Fonctionnalités principales</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3.5 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="w-9 h-9 bg-rose-50 rounded-lg flex items-center justify-center shrink-0">
                        <Code className="w-5 h-5 text-[#7d1538]" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">Interface utilisateur moderne &amp; réactive</span>
                    </div>

                    <div className="flex items-center space-x-3.5 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="w-9 h-9 bg-rose-50 rounded-lg flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5 text-[#7d1538]" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">Sécurité &amp; contrôle d'accès administrateur</span>
                    </div>

                    <div className="flex items-center space-x-3.5 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="w-9 h-9 bg-rose-50 rounded-lg flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5 text-[#7d1538]" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">API REST haute performance</span>
                    </div>

                    <div className="flex items-center space-x-3.5 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="w-9 h-9 bg-rose-50 rounded-lg flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-[#7d1538]" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">Gestion de base de données optimisée</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Info (1 Column) */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-6 sticky top-8 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-200">
                    Spécifications techniques
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 text-gray-700">
                      <Calendar className="w-4 h-4 text-[#7d1538] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date de réalisation</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          {new Date(project.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 text-gray-700">
                      <Tag className="w-4 h-4 text-[#7d1538] mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Technologies utilisées</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 bg-white text-[#7d1538] text-xs font-bold rounded-lg border border-rose-200 shadow-2xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {project.featured && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-1">
                      <div className="flex items-center justify-center space-x-1.5 text-amber-800 font-bold text-xs">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span>Projet Vedette</span>
                      </div>
                      <p className="text-[11px] text-amber-700">
                        Cette réalisation fait partie de mes projets phares.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Bottom Banner */}
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Envie de collaborer sur un projet similaire ?
            </h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              Si ce projet vous intéresse ou si vous avez une idée de développement sur-mesure, n'hésitez pas à me contacter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-[#7d1538] hover:bg-[#63102c] text-white transition-colors rounded-xl text-sm font-semibold shadow-md"
              >
                Discutons de votre projet
              </Link>
              <Link
                href="/projets"
                className="inline-flex items-center justify-center px-8 py-3 border border-[#7d1538] text-[#7d1538] hover:bg-[#7d1538] hover:text-white transition-colors rounded-xl text-sm font-semibold"
              >
                Voir mes autres projets
              </Link>
            </div>
          </div>
        </section>
      </div>

      <PortfolioFooter />
    </div>
  );
}
