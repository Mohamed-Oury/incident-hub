import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/modules/auth/auth-service";

export async function GET() {
  try {
    let stats = await prisma.siteStats.findFirst({ where: { id: "main-stats" } });
    if (!stats) {
      stats = await prisma.siteStats.create({
        data: {
          id: "main-stats",
          totalViews: 15000,
          yearsExperience: 5,
        },
      });
    }
    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
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
    const updated = await prisma.siteStats.upsert({
      where: { id: "main-stats" },
      update: {
        totalViews: body.totalViews ?? 15000,
        yearsExperience: body.yearsExperience ?? 5,
        customStat1Label: body.customStat1Label,
        customStat1Value: body.customStat1Value,
        customStat2Label: body.customStat2Label,
        customStat2Value: body.customStat2Value,
      },
      create: {
        id: "main-stats",
        totalViews: body.totalViews ?? 15000,
        yearsExperience: body.yearsExperience ?? 5,
        customStat1Label: body.customStat1Label,
        customStat1Value: body.customStat1Value,
        customStat2Label: body.customStat2Label,
        customStat2Value: body.customStat2Value,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/admin/stats error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
