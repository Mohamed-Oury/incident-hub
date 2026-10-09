import { PortfolioHeader } from "@/modules/portfolio/components/layout/PortfolioHeader";
import { PortfolioFooter } from "@/modules/portfolio/components/layout/PortfolioFooter";
import { HeroSection } from "@/modules/portfolio/components/sections/HeroSection";
import { AboutSection } from "@/modules/portfolio/components/sections/AboutSection";
import { SiteStats } from "@/modules/portfolio/components/common/SiteStats";
import { ProjectsSection } from "@/modules/portfolio/components/sections/ProjectsSection";
import { BlogSection } from "@/modules/portfolio/components/sections/BlogSection";
import { CallToAction } from "@/modules/portfolio/components/common/CallToAction";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // SSR revalidation

export default async function PortfolioHomePage() {
  const [projectsRaw, blogPostsRaw, stats] = await Promise.all([
    prisma.project.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } }),
    prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, include: { author: true } }),
    prisma.siteStats.findFirst({ where: { id: "main-stats" } }),
  ]);

  const recentProjects = projectsRaw.slice(0, 3).map((p) => ({
    ...p,
    technologies: JSON.parse(p.technologies || "[]") as string[],
  }));

  const recentBlogPosts = blogPostsRaw.slice(0, 3).map((p) => ({
    ...p,
    tags: typeof p.tags === "string" ? JSON.parse(p.tags || "[]") : p.tags,
  }));

  const projectStats = {
    total: projectsRaw.length,
    web: projectsRaw.filter((p) => p.category === "WEB").length,
    bancaire: projectsRaw.filter((p) => p.category === "BANCAIRE").length,
    research: projectsRaw.filter((p) => p.category === "RESEARCH").length,
    cbs: projectsRaw.filter((p) => p.category === "CBS").length,
  };

  const blogStats = {
    total: blogPostsRaw.length,
    cbs: blogPostsRaw.filter((b) => b.category === "CBS").length,
    informatique: blogPostsRaw.filter((b) => b.category === "INFORMATIQUE").length,
    mathematiques: blogPostsRaw.filter((b) => b.category === "MATHEMATIQUES").length,
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans">
      <PortfolioHeader />

      <main>
        <HeroSection />
        <AboutSection />
        <SiteStats
          totalPosts={blogPostsRaw.length}
          totalProjects={projectsRaw.length}
          yearsExperience={stats?.yearsExperience || 5}
        />
        <ProjectsSection recentProjects={recentProjects} stats={projectStats} />
        <BlogSection recentPosts={recentBlogPosts} blogStats={blogStats} />
        <CallToAction />
      </main>

      <PortfolioFooter />
    </div>
  );
}
