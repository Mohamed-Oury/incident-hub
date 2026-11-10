import { NextRequest, NextResponse } from "next/server";
import { generateWeeklyReportPdf } from "@/lib/activity-report-pdf";
import { WeeklyActivityReport } from "@/modules/activity-report/types";
import { SAMPLE_SGABS_REPORT, SAMPLE_AFG_REPORT } from "@/modules/activity-report/templates";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let report: WeeklyActivityReport = body.report;

    if (!report) {
      const sub = body.subsidiary === "AFG" ? "AFG" : "SGABS";
      report = sub === "AFG" ? SAMPLE_AFG_REPORT : SAMPLE_SGABS_REPORT;
    }

    const pdfBuffer = generateWeeklyReportPdf(report);
    const subTag = report.subsidiary || "SGABS";
    const weekTag = `Semaine_${report.weekNumber || 45}`;
    const filename = `CRA_${subTag}_${weekTag}_${report.year || 2026}.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (err: any) {
    console.error("Erreur génération CRA PDF:", err);
    return NextResponse.json({ error: err.message || "Erreur export CRA PDF" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sub = searchParams.get("subsidiary") === "AFG" ? "AFG" : "SGABS";
    const report = sub === "AFG" ? SAMPLE_AFG_REPORT : SAMPLE_SGABS_REPORT;

    const pdfBuffer = generateWeeklyReportPdf(report);
    const filename = `CRA_${sub}_Semaine_${report.weekNumber}_${report.year}.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (err: any) {
    console.error("Erreur GET CRA PDF:", err);
    return NextResponse.json({ error: err.message || "Erreur export CRA PDF" }, { status: 500 });
  }
}

