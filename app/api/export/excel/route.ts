import { NextRequest, NextResponse } from "next/server";
import { generateNativeXlsx } from "@/lib/openxml-engine";
import { IncidentRecord } from "@/modules/incidents/types";
import { getAllIncidents } from "@/modules/incidents/data-store";

function parseToIso(dateStr?: string): string {
  if (!dateStr) return "";
  const cleaned = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return cleaned;
  const parts = cleaned.split(/[/.-]/);
  if (parts.length === 3) {
    const day = parts[0].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    let year = parts[2];
    if (year.length === 2) year = `20${year}`;
    if (year.length === 4 && Number(day) >= 1 && Number(day) <= 31 && Number(month) >= 1 && Number(month) <= 12) {
      return `${year}-${month}-${day}`;
    }
  }
  return "";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const subsidiary = (body.subsidiary === "AFG" ? "AFG" : "SGABS") as "AFG" | "SGABS";
    let incidents: IncidentRecord[] = body.incidents;
    const { startDate, endDate, periodLabel } = body;

    if (!incidents || !Array.isArray(incidents) || incidents.length === 0) {
      const all = await getAllIncidents();
      incidents = all.filter((i) => (i.subsidiary || "SGABS") === subsidiary);

      const startIso = parseToIso(startDate);
      const endIso = parseToIso(endDate);
      if (startIso || endIso) {
        incidents = incidents.filter((inc) => {
          const t = inc.createdAt || inc.occurredAt;
          if (!t) return false;
          const d = new Date(t);
          if (isNaN(d.getTime())) return false;
          if (startIso && d < new Date(`${startIso}T00:00:00.000`)) return false;
          if (endIso && d > new Date(`${endIso}T23:59:59.999`)) return false;
          return true;
        });
      }
    }

    const xlsxBuffer = generateNativeXlsx(incidents, subsidiary, { startDate, endDate, periodLabel });
    const startSafe = (startDate || "debut").replace(/[\/\\]/g, "-");
    const endSafe = (endDate || "fin").replace(/[\/\\]/g, "-");
    const periodTag = startDate || endDate
      ? `_${startSafe}_au_${endSafe}`
      : `_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;
    const filename = `Rapport_Incidents_Monetiques_${subsidiary}${periodTag}.xlsx`;

    return new Response(new Uint8Array(xlsxBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(xlsxBuffer.length),
      },
    });
  } catch (err: any) {
    console.error("Erreur génération XLSX:", err);
    return NextResponse.json({ error: err.message || "Erreur export Excel" }, { status: 500 });
  }
}
