import { NextRequest, NextResponse } from "next/server";
import { generateNativePptx } from "@/lib/openxml-engine";
import { IncidentRecord } from "@/modules/incidents/types";
import { getAllIncidents, getIncidentByReference } from "@/modules/incidents/data-store";

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
      if (body.reference) {
        const single = await getIncidentByReference(body.reference);
        if (single) incidents = [single];
      }
      if (!incidents || incidents.length === 0) {
        const all = await getAllIncidents();
        incidents = all.filter((i) => (i.subsidiary || "SGABS") === subsidiary);
      }
    }

    const startIso = parseToIso(startDate);
    const endIso = parseToIso(endDate);
    if ((startIso || endIso) && (!body.incidents || body.incidents.length === 0)) {
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

    const isSingle = incidents.length === 1;
    const pptxBuffer = generateNativePptx(incidents, subsidiary, { startDate, endDate, periodLabel });
    const startSafe = (startDate || "debut").replace(/[\/\\]/g, "-");
    const endSafe = (endDate || "fin").replace(/[\/\\]/g, "-");
    const periodTag = startDate || endDate
      ? `_${startSafe}_au_${endSafe}`
      : `_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;
    const filename = isSingle
      ? `Fiche_Incident_${incidents[0].reference}_${subsidiary}.pptx`
      : `Recueil_Fiches_Incidents_${subsidiary}${periodTag}.pptx`;

    return new Response(new Uint8Array(pptxBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pptxBuffer.length),
      },
    });
  } catch (err: any) {
    console.error("Erreur génération PPTX:", err);
    return NextResponse.json({ error: err.message || "Erreur export PowerPoint" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref");
    const sub = (searchParams.get("subsidiary") === "AFG" ? "AFG" : "SGABS") as "AFG" | "SGABS";
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    let incidents: IncidentRecord[] = [];
    if (ref) {
      const single = await getIncidentByReference(ref);
      if (single) incidents = [single];
    }

    if (incidents.length === 0) {
      const all = await getAllIncidents();
      incidents = all.filter((i) => (i.subsidiary || "SGABS") === sub);
    }

    const isSingle = incidents.length === 1;
    const pptxBuffer = generateNativePptx(incidents, sub, { startDate, endDate });
    const startSafe = (startDate || "debut").replace(/[\/\\]/g, "-");
    const endSafe = (endDate || "fin").replace(/[\/\\]/g, "-");
    const periodTag = startDate || endDate
      ? `_${startSafe}_au_${endSafe}`
      : `_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;
    const filename = isSingle
      ? `Fiche_Incident_${incidents[0].reference}_${sub}.pptx`
      : `Recueil_Fiches_Incidents_${sub}${periodTag}.pptx`;

    return new Response(new Uint8Array(pptxBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pptxBuffer.length),
      },
    });
  } catch (err: any) {
    console.error("Erreur GET PPTX:", err);
    return NextResponse.json({ error: err.message || "Erreur export PowerPoint" }, { status: 500 });
  }
}
