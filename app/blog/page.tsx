import { PortfolioHeader } from "@/modules/portfolio/components/layout/PortfolioHeader";
import { PortfolioFooter } from "@/modules/portfolio/components/layout/PortfolioFooter";
import BlogCard from "@/modules/portfolio/components/blog/BlogCard";
import { CallToAction } from "@/modules/portfolio/components/common/CallToAction";
import { prisma } from "@/lib/prisma";
import { Sparkles } from "lucide-react";

export const revalidate = 60;

export default async function BlogListPage() {
  const postsRaw = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  const posts = postsRaw.map((post) => ({
    ...post,
    tags: typeof post.tags === "string" ? JSON.parse(post.tags || "[]") : post.tags,
  }));

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans">
      <PortfolioHeader />

      <main className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header section */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#7d1538]/10 text-[#7d1538] text-xs sm:text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Réflexions &amp; Analyses
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
              Mon <span className="text-[#7d1538]">Blog</span> Personnel
            </h1>
            <p className="text-lg text-gray-600 mt-4 leading-relaxed">
              Articles sur le développement informatique, l&apos;analyse numérique, les systèmes bancaires CBS Amplitude et la monétique.
            </p>
          </div>

          {/* Grille d'articles avec BlogCard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} featured={post.featured} />
            ))}
          </div>
        </div>
      </main>

      <CallToAction />
      <PortfolioFooter />
    </div>
  );
}
