import { IncidentRecord } from "@/modules/incidents/types";

/**
 * Service d'export natif OpenXML pour Microsoft Excel (.xlsx) et Microsoft PowerPoint (.pptx)
 * 100% compatibles avec les versions modernes de Microsoft Office (sans avertissements de sécurité ni rejets de format).
 */

export interface ExportFilterOptions {
  startDate?: string;
  endDate?: string;
  periodLabel?: string;
}

export async function exportIncidentsToExcel(
  incidents: IncidentRecord[],
  subsidiary: "AFG" | "SGABS",
  options?: ExportFilterOptions
): Promise<void> {
  try {
    const res = await fetch("/api/export/excel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        incidents,
        subsidiary,
        startDate: options?.startDate,
        endDate: options?.endDate,
        periodLabel: options?.periodLabel,
      }),
    });

    if (!res.ok) {
      throw new Error(`Erreur serveur (${res.status}) lors de l'export Excel`);
    }

    const blob = await res.blob();
    const startSafe = (options?.startDate || "debut").replace(/[\/\\]/g, "-");
    const endSafe = (options?.endDate || "fin").replace(/[\/\\]/g, "-");
    const periodTag = options?.startDate || options?.endDate
      ? `_${startSafe}_au_${endSafe}`
      : `_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;
    const filename = `Rapport_Incidents_Monetiques_${subsidiary}${periodTag}.xlsx`;

    triggerDownload(blob, filename);
  } catch (err: any) {
    console.error("Échec export Excel:", err);
    alert("Impossible de générer le fichier Excel natif. Veuillez réessayer.");
  }
}

export async function exportSingleIncidentToPowerPoint(
  incident: IncidentRecord,
  subsidiary?: "AFG" | "SGABS"
): Promise<void> {
  try {
    const targetSub = (incident.subsidiary || subsidiary || "AFG") as "AFG" | "SGABS";
    const res = await fetch("/api/export/powerpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ incidents: [incident], subsidiary: targetSub }),
    });

    if (!res.ok) {
      throw new Error(`Erreur serveur (${res.status}) lors de l'export PowerPoint`);
    }

    const blob = await res.blob();
    const filename = `Fiche_Incident_${incident.reference}_${targetSub}.pptx`;

    triggerDownload(blob, filename);
  } catch (err: any) {
    console.error("Échec export PowerPoint individuel:", err);
    alert("Impossible de générer la présentation PowerPoint de l'incident.");
  }
}

export async function exportIncidentsToPowerPoint(
  incidents: IncidentRecord[],
  subsidiary: "AFG" | "SGABS",
  options?: ExportFilterOptions
): Promise<void> {
  try {
    const res = await fetch("/api/export/powerpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        incidents,
        subsidiary,
        startDate: options?.startDate,
        endDate: options?.endDate,
        periodLabel: options?.periodLabel,
      }),
    });

    if (!res.ok) {
      throw new Error(`Erreur serveur (${res.status}) lors de l'export PowerPoint global`);
    }

    const blob = await res.blob();
    const startSafe = (options?.startDate || "debut").replace(/[\/\\]/g, "-");
    const endSafe = (options?.endDate || "fin").replace(/[\/\\]/g, "-");
    const periodTag = options?.startDate || options?.endDate
      ? `_${startSafe}_au_${endSafe}`
      : `_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;
    const filename = `Recueil_Fiches_Incidents_${subsidiary}${periodTag}.pptx`;

    triggerDownload(blob, filename);
  } catch (err: any) {
    console.error("Échec export PowerPoint global:", err);
    alert("Impossible de générer le recueil PowerPoint.");
  }
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
