import { PortfolioHeader } from "@/modules/portfolio/components/layout/PortfolioHeader";
import { PortfolioFooter } from "@/modules/portfolio/components/layout/PortfolioFooter";
import ProjectCard from "@/modules/portfolio/components/projects/ProjectCard";
import { CallToAction } from "@/modules/portfolio/components/common/CallToAction";
import { prisma } from "@/lib/prisma";
import { Rocket } from "lucide-react";

export const revalidate = 60;

export default async function ProjectsPage() {
  const projectsRaw = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const projects = projectsRaw.map((p) => ({
    ...p,
    technologies: JSON.parse(p.technologies || "[]") as string[],
  }));

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans">
      <PortfolioHeader />

      <main className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header section */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#7d1538]/10 text-[#7d1538] text-xs sm:text-sm font-semibold mb-4">
              <Rocket className="w-4 h-4 mr-2" />
              Réalisations &amp; Applications
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
              Tous mes <span className="text-[#7d1538]">Projets</span>
            </h1>
            <p className="text-lg text-gray-600 mt-4 leading-relaxed">
              Découvrez la liste complète de mes réalisations en développement logiciel, systèmes bancaires SGABS, monétique et mathématiques appliquées.
            </p>
          </div>

          {/* Grille des projets avec ProjectCard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} featured={project.featured} />
            ))}
          </div>
        </div>
      </main>

      <CallToAction />
      <PortfolioFooter />
    </div>
  );
}
