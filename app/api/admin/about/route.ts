import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/modules/auth/auth-service";

export async function GET() {
  try {
    const about = await prisma.about.findFirst();

    if (!about) {
      return NextResponse.json({
        title: "À propos de moi",
        subtitle: "Ingénieur Logiciel & Mathématicien",
        content: "",
        profileImage: "",
        cvUrl: "",
        skills: [],
        experiences: [],
        education: [],
        languages: [],
      });
    }

    return NextResponse.json({
      ...about,
      skills: typeof about.skills === "string" ? JSON.parse(about.skills || "[]") : about.skills,
      experiences: typeof about.experiences === "string" ? JSON.parse(about.experiences || "[]") : about.experiences,
      education: typeof about.education === "string" ? JSON.parse(about.education || "[]") : about.education,
      languages: typeof about.languages === "string" ? JSON.parse(about.languages || "[]") : about.languages,
    });
  } catch (error) {
    console.error("GET /api/admin/about error:", error);
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
    const existing = await prisma.about.findFirst();

    const dataToSave = {
      title: body.title || "À propos de moi",
      subtitle: body.subtitle || "",
      content: body.content || "",
      profileImage: body.profileImage || "",
      cvUrl: body.cvUrl || "",
      skills: Array.isArray(body.skills) ? JSON.stringify(body.skills) : body.skills || "[]",
      experiences: Array.isArray(body.experiences) ? JSON.stringify(body.experiences) : body.experiences || "[]",
      education: Array.isArray(body.education) ? JSON.stringify(body.education) : body.education || "[]",
      languages: Array.isArray(body.languages) ? JSON.stringify(body.languages) : body.languages || "[]",
    };

    let result;
    if (existing) {
      result = await prisma.about.update({
        where: { id: existing.id },
        data: dataToSave,
      });
    } else {
      result = await prisma.about.create({
        data: dataToSave,
      });
    }

    return NextResponse.json({
      ...result,
      skills: typeof result.skills === "string" ? JSON.parse(result.skills || "[]") : result.skills,
      experiences: typeof result.experiences === "string" ? JSON.parse(result.experiences || "[]") : result.experiences,
      education: typeof result.education === "string" ? JSON.parse(result.education || "[]") : result.education,
      languages: typeof result.languages === "string" ? JSON.parse(result.languages || "[]") : result.languages,
    });
  } catch (error) {
    console.error("POST /api/admin/about error:", error);
    return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 });
  }
}
