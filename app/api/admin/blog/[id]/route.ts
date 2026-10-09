import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/modules/auth/auth-service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!post) {
      return NextResponse.json({ error: "Article non trouvé" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error("GET /api/admin/blog/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        category: body.category,
        tags: Array.isArray(body.tags) ? JSON.stringify(body.tags) : body.tags,
        coverImage: body.coverImage,
        published: body.published,
        featured: body.featured,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("PUT /api/admin/blog/[id] error:", error);
    return NextResponse.json({ error: "Erreur mise à jour article" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/blog/[id] error:", error);
    return NextResponse.json({ error: "Erreur suppression article" }, { status: 500 });
  }
}
