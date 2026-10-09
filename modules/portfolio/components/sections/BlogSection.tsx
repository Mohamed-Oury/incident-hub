import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import BlogCard from "@/modules/portfolio/components/blog/BlogCard";

interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  createdAt: Date;
  tags?: string[];
  author?: { name: string } | string;
}

interface BlogSectionProps {
  recentPosts: BlogPost[];
  blogStats: {
    total: number;
    cbs: number;
    informatique: number;
    mathematiques: number;
  };
}

export function BlogSection({ recentPosts, blogStats }: BlogSectionProps) {
  const categories = [
    {
      id: "mathematiques",
      name: "Mathématiques",
      description: "Articles sur les mathématiques et leurs applications",
      icon: "📐",
      count: blogStats.mathematiques,
    },
    {
      id: "informatique",
      name: "Informatique",
      description: "Développement, algorithmes et technologies",
      icon: "💻",
      count: blogStats.informatique,
    },
    {
      id: "cbs",
      name: "CBS",
      description: "Contenu sur les systèmes bancaires complexes",
      icon: "🔄",
      count: blogStats.cbs,
    },
  ];

  return (
    <section className="relative py-20 lg:py-24 bg-white overflow-hidden border-b border-gray-100">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-5 py-2 rounded-full bg-[#7d1538]/10 text-[#7d1538] text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Mon Blog Personnel
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Mes <span className="text-[#7d1538]">Réflexions</span> &amp;{" "}
            <span className="text-[#7d1538]">Analyses</span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez mes articles approfondis sur les mathématiques appliquées, le développement logiciel, les systèmes CBS bancaires et les enjeux technologiques contemporains.
          </p>
        </div>

        {/* Domaines d'expertise */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-7 bg-[#7d1538] rounded-full"></div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Domaines d&apos;Expertise</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group relative p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#7d1538]/30 transition-all duration-300 hover:shadow-xl"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#7d1538] to-[#a01e4a] rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-md">
                  <span className="text-2xl text-white">{category.icon}</span>
                </div>

                <h4 className="text-xl font-bold text-gray-900 mb-2 text-center group-hover:text-[#7d1538] transition-colors">
                  {category.name}
                </h4>

                <p className="text-gray-500 text-xs sm:text-sm text-center mb-4 leading-relaxed">
                  {category.description}
                </p>

                <div className="flex items-center justify-between text-sm font-bold border-t border-gray-100 pt-3">
                  <span className="text-[#7d1538]">{category.count}</span>
                  <span className="text-gray-400 font-normal">articles</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mes 3 derniers articles */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-7 bg-[#7d1538] rounded-full"></div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Mes 3 Derniers Articles</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/blog" className="text-decoration-none">
            <button className="bg-[#7d1538] hover:bg-[#a01e4a] text-white px-10 py-4 rounded-full text-base sm:text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center cursor-pointer border-0">
              <BookOpen className="w-5 h-5 mr-3" />
              Explorer tous mes articles
              <ArrowRight className="ml-3 h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
