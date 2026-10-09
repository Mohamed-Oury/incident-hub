import { PortfolioHeader } from "@/modules/portfolio/components/layout/PortfolioHeader";
import { PortfolioFooter } from "@/modules/portfolio/components/layout/PortfolioFooter";
import { MarkdownRenderer } from "@/modules/portfolio/components/blog/MarkdownRenderer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User, Tag, BookOpen, MessageSquare } from "lucide-react";

export const revalidate = 60;

interface BlogPostDetailPageProps {
  params: Promise<{ slug: string }>;
}

const parseTags = (tagsInput: string | null | undefined): string[] => {
  if (!tagsInput) return [];
  try {
    const parsed = JSON.parse(tagsInput);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {}
  return tagsInput.split(",").map((s) => s.trim()).filter(Boolean);
};

export default async function BlogPostDetailPage({ params }: BlogPostDetailPageProps) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!post) {
    notFound();
  }

  const tags = parseTags(post.tags);

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans flex flex-col justify-between">
      <div>
        <PortfolioHeader />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-black via-gray-900 to-[#7d1538] text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link
                href="/blog"
                className="inline-flex items-center text-rose-200 hover:text-white font-semibold transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux articles du blog
              </Link>
            </div>

            <div className="max-w-4xl space-y-6">
              {/* Catégorie */}
              <div>
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                  {post.category}
                </span>
              </div>

              {/* Titre */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight text-white tracking-tight">
                {post.title}
              </h1>

              {/* Métadonnées de l'article */}
              <div className="flex flex-wrap items-center gap-6 text-rose-100 text-xs sm:text-sm font-medium pt-2 border-t border-white/10">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-rose-300" />
                  <span>{post.author?.name || "Mr. Diallo"}</span>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-rose-300" />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-rose-300" />
                  <span>{post.readTime || 5} min de lecture</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Body Section */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Cover Image */}
            {post.coverImage && (
              <div className="mb-10 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-auto max-h-[450px] object-cover"
                />
              </div>
            )}

            {/* Extrait mis en avant */}
            {post.excerpt && (
              <div className="mb-8 p-6 bg-rose-50/70 border-l-4 border-[#7d1538] rounded-r-2xl">
                <p className="text-base sm:text-lg font-medium text-gray-800 leading-relaxed italic">
                  "{post.excerpt}"
                </p>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-10 flex flex-wrap items-center gap-2 pb-6 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 flex items-center">
                  <Tag className="w-3.5 h-3.5 mr-1" /> Tags :
                </span>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-rose-50 text-[#7d1538] text-xs font-bold rounded-full border border-rose-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Contenu principal de l'article */}
            <article className="prose prose-lg max-w-none text-gray-800 leading-relaxed text-base md:text-lg">
              <div className="bg-white rounded-2xl">
                <MarkdownRenderer content={post.content} />
              </div>
            </article>

            {/* Carte de signature d'auteur */}
            <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-2xl flex items-center space-x-4 shadow-2xs">
              <div className="w-14 h-14 bg-[#7d1538] text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                MO
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">
                  {post.author?.name || "Mohamed Oury Diallo"}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ingénieur Logiciel, Mathématicien &amp; Expert Monétique / Core Banking
                </p>
              </div>
            </div>

            {/* Navigation retour */}
            <div className="pt-8 mt-10 border-t border-gray-200 flex justify-between items-center">
              <Link
                href="/blog"
                className="inline-flex items-center text-[#7d1538] hover:text-[#63102c] font-bold text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la liste des articles
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Bottom Banner */}
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Envie de discuter de cet article ?
            </h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              N'hésitez pas à me contacter pour échanger sur ce sujet ou pour explorer des opportunités de collaboration.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-[#7d1538] hover:bg-[#63102c] text-white transition-colors rounded-xl text-sm font-semibold shadow-md"
              >
                Me contacter
              </Link>
            </div>
          </div>
        </section>
      </div>

      <PortfolioFooter />
    </div>
  );
}
