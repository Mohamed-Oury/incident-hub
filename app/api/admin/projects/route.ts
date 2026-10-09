import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/modules/auth/auth-service";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/admin/projects error:", error);
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
    const { title, excerpt, description, category, technologies, imageUrl, githubUrl, demoUrl, published, featured } = body;

    const project = await prisma.project.create({
      data: {
        title,
        excerpt,
        description: description || excerpt,
        category: category || "WEB",
        technologies: Array.isArray(technologies) ? JSON.stringify(technologies) : technologies || "[]",
        imageUrl,
        githubUrl,
        demoUrl,
        published: published ?? true,
        featured: featured ?? false,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("POST /api/admin/projects error:", error);
    return NextResponse.json({ error: "Erreur lors de la création du projet" }, { status: 500 });
  }
}
