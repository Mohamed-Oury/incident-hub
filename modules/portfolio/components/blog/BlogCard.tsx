import Link from "next/link";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";

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

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const categoryIcons: Record<string, string> = {
    MATHEMATIQUES: "📐",
    INFORMATIQUE: "💻",
    CBS: "🔄",
    GEOPOLITIQUE: "🌍",
  };

  const authorName = typeof post.author === "object" ? post.author?.name : post.author || "Mr.Oury";

  return (
    <div
      className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-[#7d1538]/20 flex flex-col justify-between h-full ${featured ? "ring-2 ring-[#7d1538]/30 shadow-[#7d1538]/10" : ""
        }`}
    >
      <div>
        {/* Visuel d'en-tête */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#7d1538]/5 via-gray-50 to-[#a01e4a]/10 flex items-center justify-center">
          <div className="relative z-10 text-center">
            <div className="text-5xl mb-2">{categoryIcons[post.category] || "📝"}</div>
            <div className="text-xs font-bold text-[#7d1538] uppercase tracking-wider">{post.category}</div>
          </div>

          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow text-xs font-bold text-[#7d1538]">
            {post.category}
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="w-3.5 h-3.5" />
              <span className="font-semibold">{authorName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(post.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#7d1538] transition-colors leading-tight line-clamp-2">
            {post.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-0">
        <div className="flex items-center text-xs text-[#7d1538] font-semibold mb-3">
          <Clock className="w-3.5 h-3.5 mr-1" />
          <span>{post.readTime} min de lecture</span>
        </div>

        <Link href={`/blog/${post.slug}`} className="block text-decoration-none">
          <button className="w-full bg-[#7d1538] hover:bg-[#a01e4a] text-white rounded-full py-2.5 px-4 font-bold text-sm transition-all duration-300 shadow hover:shadow-lg flex items-center justify-center group/btn cursor-pointer border-0">
            Lire l&apos;article
            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  );
}
