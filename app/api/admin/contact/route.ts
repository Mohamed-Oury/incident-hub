import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/modules/auth/auth-service";

export async function GET() {
  try {
    let contact = await prisma.contactInfo.findFirst();
    if (!contact) {
      contact = await prisma.contactInfo.create({
        data: {
          title: "Me contacter",
          subtitle: "Parlons de vos projets bancaires, CBS Amplitude ou monétique",
          email: "mohaourydiallo@gmail.com",
          phone: "+225 07 00 00 00 00",
          address: "Abidjan, Côte d'Ivoire",
          availability: "Disponible pour du conseil, des missions CBS et de la prestation Monétique.",
          socialLinks: JSON.stringify([
            { platform: "GitLab", url: "https://gitlab.com/Mohamed-Oury" },
            { platform: "LinkedIn", url: "https://www.linkedin.com/in/mohamed-diallo-5316a1167" },
          ]),
        },
      });
    }
    return NextResponse.json(contact);
  } catch (error) {
    console.error("GET /api/admin/contact error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const existing = await prisma.contactInfo.findFirst();

    if (existing) {
      const updated = await prisma.contactInfo.update({
        where: { id: existing.id },
        data: {
          title: body.title,
          subtitle: body.subtitle,
          email: body.email,
          phone: body.phone,
          address: body.address,
          socialLinks: body.socialLinks,
          availability: body.availability,
        },
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.contactInfo.create({
        data: {
          title: body.title || "Me contacter",
          subtitle: body.subtitle || "",
          email: body.email || "mohaourydiallo@gmail.com",
          phone: body.phone || "",
          address: body.address || "",
          socialLinks: body.socialLinks || "[]",
          availability: body.availability || "",
        },
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error("PUT /api/admin/contact error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
