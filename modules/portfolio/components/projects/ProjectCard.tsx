import Link from "next/link";
import { ExternalLink, Calendar, Tag, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/modules/portfolio/components/common/SocialIcons";

interface Project {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  technologies: string[];
  createdAt: Date;
  featured?: boolean;
  githubUrl?: string | null;
  demoUrl?: string | null;
  imageUrl?: string | null;
}

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const categoryIcons: Record<string, string> = {
    WEB: "🌐",
    MOBILE: "📱",
    BANCAIRE: "🏦",
    CBS: "💳",
    RESEARCH: "🔬",
    DESKTOP: "💻",
    OTHER: "⚙️",
  };

  return (
    <div
      className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-[#7d1538]/20 transform hover:scale-[1.02] flex flex-col justify-between h-full ${
        featured ? "ring-2 ring-[#7d1538]/30 shadow-[#7d1538]/10" : ""
      }`}
    >
      {/* Header visuel de la carte */}
      <div>
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#7d1538]/10 via-gray-50 to-[#a01e4a]/15 flex items-center justify-center">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="relative z-10 text-center">
              <div className="text-5xl mb-2">{categoryIcons[project.category] || "💻"}</div>
              <div className="text-xs font-bold text-[#7d1538] uppercase tracking-wider">{project.category}</div>
            </div>
          )}

          {featured && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-[#7d1538] to-[#a01e4a] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              🌟 Vedette
            </div>
          )}

          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow">
            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
              ● Actif
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold bg-[#7d1538]/10 text-[#7d1538]">
              {project.category}
            </span>
            <div className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              <span>{new Date(project.createdAt).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#7d1538] transition-colors leading-tight">
            {project.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {project.excerpt}
          </p>

          {/* Technologies */}
          <div className="mb-5">
            <div className="flex items-center mb-2 text-xs font-semibold text-[#7d1538]">
              <Tag className="w-3.5 h-3.5 mr-1" />
              <span>Technologies</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-2 py-0.5 bg-[#7d1538]/10 text-[#7d1538] text-xs font-bold rounded-full">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 pt-0">
        <Link href={`/projets/${project.id}`} className="block text-decoration-none">
          <button className="w-full bg-[#7d1538] hover:bg-[#a01e4a] text-white rounded-full py-2.5 px-4 font-bold text-sm transition-all duration-300 shadow hover:shadow-lg flex items-center justify-center group/btn cursor-pointer border-0">
            Découvrir le projet
            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  );
}
