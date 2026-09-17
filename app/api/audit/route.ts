import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const audits = await prisma.auditLog.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, count: audits.length, audits });
  } catch {
    return NextResponse.json({ success: true, count: 0, audits: [] });
  }
}
