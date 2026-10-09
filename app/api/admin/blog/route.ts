import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/modules/auth/auth-service";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: true },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/admin/blog error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, excerpt, content, category, tags, coverImage, published, featured } = body;

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        excerpt,
        content,
        category: category || "INFORMATIQUE",
        tags: Array.isArray(tags) ? JSON.stringify(tags) : tags || "[]",
        coverImage,
        published: published ?? true,
        featured: featured ?? false,
        authorId: session.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("POST /api/admin/blog error:", error);
    return NextResponse.json({ error: "Erreur lors de la création de l'article" }, { status: 500 });
  }
}
