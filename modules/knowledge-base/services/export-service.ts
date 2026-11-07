import { IncidentRecord } from "@/modules/incidents/types";

/**
 * Service d'export élaboré et explicite pour les incidents monétiques
 * Supporte :
 * 1. Excel (.xls / SpreadsheetML format avec charte graphique filiale AFG ou SGABS)
 * 2. PowerPoint (.ppt / Diaporama exécutif complet avec slides KPI et fiches d'incidents)
 */

export function exportIncidentsToExcel(incidents: IncidentRecord[], subsidiary: "AFG" | "SGABS"): void {
  const isAFG = subsidiary === "AFG";
  const brandColor = isAFG ? "#00a800" : "#e60028";
  const brandDark = isAFG ? "#15803d" : "#99001b";
  const brandLight = isAFG ? "#f0fdf4" : "#fef2f2";
  const brandBorder = isAFG ? "#bbf7d0" : "#fecaca";
  const subName = isAFG ? "AFG Bank (Atlantic Financial Group)" : "Société Générale (SGABS)";

  const dateStr = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Construction d'un classeur Excel SpreadsheetML avec mise en forme élaborée
  const rowsHtml = incidents.map((inc, index) => {
    const isEven = index % 2 === 0;
    const bgRow = isEven ? "#ffffff" : "#f8fafc";
    const obs = inc.observations?.[0];
    const symptom = obs?.symptom || inc.description || "—";
    const facts = obs?.facts || "—";
    const rootCause = inc.rootCause ? `${inc.rootCause.category} : ${inc.rootCause.description}` : "—";
    const resolution = inc.resolution ? inc.resolution.actions : "—";
    const prevention = (inc.prevention || []).map((p) => p.action).join(" | ") || "—";

    const sevColor =
      inc.severity === "CRITICAL"
        ? "#dc2626"
        : inc.severity === "HIGH"
        ? "#ea580c"
        : inc.severity === "MEDIUM"
        ? "#0284c7"
        : "#16a34a";

    return `
      <tr style="background-color: ${bgRow};">
        <td style="font-weight: bold; border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #0f172a;">${inc.reference}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: 600; color: #0f172a;">${escapeXml(inc.title)}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold; color: ${brandColor};">${inc.subsidiary || subsidiary}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${inc.domain || "GÉNÉRAL"}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; color: #334155;">${escapeXml(inc.component || "—")}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-family: monospace; font-weight: bold; color: #b91c1c;">${inc.errorCode || "—"}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold; color: ${sevColor};">${inc.severity}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${inc.knowledgeStatus === "VALIDATED" ? "VALIDÉ" : "RÉFÉRENCE"}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; color: #475569; font-size: 11px;">${escapeXml(symptom)}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; color: #475569; font-size: 11px;">${escapeXml(facts)}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; color: #0f172a; font-size: 11px;">${escapeXml(rootCause)}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; color: #0f172a; font-size: 11px;">${escapeXml(resolution)}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; color: #334155; font-size: 11px;">${escapeXml(prevention)}</td>
      </tr>
    `;
  }).join("");

  const excelContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Incidents Monétiques ${subsidiary}</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                  <x:Print>
                    <x:ValidPrinterInfo/>
                    <x:PaperSizeIndex>9</x:PaperSizeIndex>
                    <x:HorizontalResolution>600</x:HorizontalResolution>
                    <x:VerticalResolution>600</x:VerticalResolution>
                  </x:Print>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: Calibri, Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
        </style>
      </head>
      <body>
        <!-- BANNIÈRE EXÉCUTIVE -->
        <table style="margin-bottom: 20px;">
          <tr>
            <td colspan="13" style="background-color: ${brandColor}; color: #ffffff; font-size: 18px; font-weight: bold; padding: 16px; text-align: center;">
              RAPPORT EXÉCUTIF DES INCIDENTS MONÉTIQUES CAPITALISÉS — ${subName.toUpperCase()}
            </td>
          </tr>
          <tr>
            <td colspan="13" style="background-color: ${brandLight}; border: 1px solid ${brandBorder}; padding: 10px; font-size: 12px; color: #334155;">
              <strong>Périmètre :</strong> ${subName} &nbsp;|&nbsp; 
              <strong>Date d'export :</strong> ${dateStr} &nbsp;|&nbsp; 
              <strong>Total Incidents :</strong> ${incidents.length} &nbsp;|&nbsp; 
              <strong>Conformité :</strong> PCI-DSS • ISO 8583 • Core Banking (Amplitude & FLEXCUBE)
            </td>
          </tr>
          <tr><td colspan="13" style="height: 12px;"></td></tr>
        </table>

        <!-- TABLEAU DES DONNÉES -->
        <table>
          <thead>
            <tr style="background-color: ${brandDark}; color: #ffffff; font-weight: bold; text-align: center; font-size: 12px;">
              <th style="border: 1px solid #cbd5e1; padding: 10px; width: 90px;">Référence</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px; width: 260px;">Titre de l'incident</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px; width: 85px;">Filiale</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px; width: 100px;">Domaine</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px; width: 140px;">Composant</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px; width: 90px;">Code / DE39</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px; width: 90px;">Sévérité</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px; width: 110px;">Statut</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px; width: 280px;">Symptôme constaté</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px; width: 260px;">Faits observés</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px; width: 300px;">Cause Racine (RCA)</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px; width: 320px;">Procédure de Résolution</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px; width: 280px;">Actions Préventives</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
    </html>
  `;

  downloadBlob(excelContent, `Rapport_Incidents_Monetiques_${subsidiary}_${getTimestampStr()}.xls`, "application/vnd.ms-excel;charset=utf-8");
}

export function exportIncidentsToPowerPoint(incidents: IncidentRecord[], subsidiary: "AFG" | "SGABS"): void {
  const isAFG = subsidiary === "AFG";
  const brandColor = isAFG ? "#00a800" : "#e60028";
  const brandDark = isAFG ? "#15803d" : "#99001b";
  const brandLight = isAFG ? "#f0fdf4" : "#fef2f2";
  const subName = isAFG ? "AFG Bank (Atlantic Financial Group)" : "Société Générale (SGABS)";

  const dateStr = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const criticalCount = incidents.filter((i) => i.severity === "CRITICAL").length;
  const highCount = incidents.filter((i) => i.severity === "HIGH").length;
  const mediumCount = incidents.filter((i) => i.severity === "MEDIUM").length;

  // Génération des diapositives d'incidents (les 20 incidents les plus significatifs pour une présentation dynamique)
  const displayLimit = Math.min(incidents.length, 25);
  const slideIncidents = incidents.slice(0, displayLimit);

  const incidentSlidesHtml = slideIncidents.map((inc, idx) => {
    const obs = inc.observations?.[0];
    const symptom = obs?.symptom || inc.description || "Dysfonctionnement constaté en production.";
    const facts = obs?.facts || "Impact sur les flux d'autorisation.";
    const rootCauseDesc = inc.rootCause ? inc.rootCause.description : "Analyse technique complétée.";
    const rootCauseCat = inc.rootCause ? inc.rootCause.category : (inc.domain || "Monétique");
    const resolution = inc.resolution ? inc.resolution.actions : "Actions curatives appliquées.";
    const prevList = (inc.prevention || []).map((p) => `<li>${escapeXml(p.action)}</li>`).join("");

    return `
      <!-- SLIDE INCIDENT ${inc.reference} -->
      <div class="slide" style="page-break-after: always; width: 1000px; height: 600px; padding: 36px 45px; background: #0b1120; color: #ffffff; box-sizing: border-box; position: relative; font-family: -apple-system, Segoe UI, Arial, sans-serif;">
        <!-- Header Slide -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid ${brandColor}; padding-bottom: 12px; margin-bottom: 20px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: ${brandColor}; color: #ffffff; font-size: 11px; font-weight: 900; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
                ${inc.reference}
              </span>
              <span style="color: #94a3b8; font-size: 12px; font-weight: 700;">
                ${subName} • ${inc.domain || "MONÉTIQUE"}
              </span>
              <span style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); font-size: 11px; font-weight: 800; padding: 2px 7px; border-radius: 4px;">
                ${inc.severity}
              </span>
            </div>
            <h2 style="font-size: 18px; font-weight: 800; margin: 6px 0 0 0; color: #ffffff;">
              ${escapeXml(inc.title)}
            </h2>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase;">COMPOSANT EN CAUSE</div>
            <div style="font-size: 13px; font-weight: 800; color: #38bdf8; margin-top: 2px;">${escapeXml(inc.component || "Switch")}</div>
            <div style="font-size: 11px; color: #f43f5e; font-weight: 700;">${inc.errorCode || "ISO 8583"}</div>
          </div>
        </div>

        <!-- Corps de la Slide en 2 Colonnes -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 420px;">
          <!-- Colonne Gauche : Constat & Analyse -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 10px; padding: 14px;">
              <div style="font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase; margin-bottom: 6px;">
                1. Symptôme &amp; Impact Opérationnel
              </div>
              <p style="font-size: 12px; color: #cbd5e1; margin: 0; line-height: 1.45;">
                ${escapeXml(symptom)}
              </p>
              <div style="margin-top: 8px; font-size: 11px; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 6px;">
                <strong>Faits constatés :</strong> ${escapeXml(facts)}
              </div>
            </div>

            <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 10px; padding: 14px;">
              <div style="font-size: 11px; font-weight: 800; color: #f59e0b; text-transform: uppercase; margin-bottom: 6px;">
                2. Cause Racine Démontrée (RCA)
              </div>
              <div style="font-size: 11px; font-weight: 800; color: #fcd34d; margin-bottom: 4px;">
                [Catégorie : ${escapeXml(rootCauseCat)}]
              </div>
              <p style="font-size: 12px; color: #cbd5e1; margin: 0; line-height: 1.45;">
                ${escapeXml(rootCauseDesc)}
              </p>
            </div>
          </div>

          <!-- Colonne Droite : Résolution & Prévention -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 10px; padding: 14px;">
              <div style="font-size: 11px; font-weight: 800; color: #4ade80; text-transform: uppercase; margin-bottom: 6px;">
                3. Procédure Curative &amp; Résolution
              </div>
              <p style="font-size: 12px; color: #cbd5e1; margin: 0; line-height: 1.45; white-space: pre-line;">
                ${escapeXml(resolution)}
              </p>
            </div>

            <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 10px; padding: 14px;">
              <div style="font-size: 11px; font-weight: 800; color: #a78bfa; text-transform: uppercase; margin-bottom: 6px;">
                4. Garde-fous &amp; Prévention de Récurrence
              </div>
              <ul style="margin: 0; padding-left: 18px; font-size: 11px; color: #cbd5e1; line-height: 1.5;">
                ${prevList || "<li>Contrôles périodiques et revue des timers.</li>"}
              </ul>
            </div>
          </div>
        </div>

        <!-- Pied de Slide -->
        <div style="position: absolute; bottom: 14px; left: 45px; right: 45px; display: flex; justify-content: space-between; font-size: 10px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 6px;">
          <span>Banking Command Center • Fiche Technique ${inc.reference}</span>
          <span>Slide ${idx + 3} / ${displayLimit + 2}</span>
        </div>
      </div>
    `;
  }).join("");

  const pptHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:p="urn:schemas-microsoft-com:office:powerpoint" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <p:PresentationOptions>
            <p:SlideSize x="1000" y="600"/>
          </p:PresentationOptions>
        </xml>
        <![endif]-->
        <style>
          @page { size: landscape; margin: 0; }
          body { margin: 0; padding: 0; background: #060b13; }
          .slide { page-break-after: always; }
        </style>
      </head>
      <body>
        <!-- ========================================== -->
        <!-- SLIDE 1 : COUVERTURE EXÉCUTIVE             -->
        <!-- ========================================== -->
        <div class="slide" style="width: 1000px; height: 600px; padding: 70px 80px; background: linear-gradient(135deg, #060b13 0%, #0f172a 100%); color: #ffffff; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; font-family: -apple-system, Segoe UI, Arial, sans-serif;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 5px 12px; borderRadius: 20px; font-size: 12px; font-weight: 800; color: ${brandColor}; text-transform: uppercase;">
              RAPPORT OFFICIEL DE CAPITALISATION MONÉTIQUE
            </div>
            <h1 style="font-size: 34px; font-weight: 900; margin: 24px 0 12px 0; letter-spacing: -0.02em; line-height: 1.15; color: #ffffff;">
              Revue des Incidents de Production &amp; Résolutions<br/>
              <span style="color: ${brandColor};">${subName}</span>
            </h1>
            <p style="font-size: 16px; color: #94a3b8; max-width: 750px; line-height: 1.5; margin: 0;">
              Dossier technique d'exploitation, diagnostic des causes racines (RCA), corrélation des trames ISO 8583 et plan de prévention pérenne.
            </p>
          </div>

          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
              <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 800;">Auteur &amp; Référent Technique</div>
              <div style="font-size: 14px; font-weight: 800; color: #f8fafc; margin-top: 2px;">Mohamed Oury Diallo</div>
              <div style="font-size: 12px; color: #94a3b8;">Expert IT Banking • Monétique &amp; Core Banking (Amplitude &amp; FLEXCUBE)</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 800;">Date de publication</div>
              <div style="font-size: 14px; font-weight: 800; color: #ffffff; margin-top: 2px;">${dateStr}</div>
              <div style="font-size: 11px; color: #4ade80;">Document Confidentiel • Usage Interne</div>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- SLIDE 2 : TABLEAU DE BORD KPI & SYNTHÈSE   -->
        <!-- ========================================== -->
        <div class="slide" style="width: 1000px; height: 600px; padding: 45px 60px; background: #090e1a; color: #ffffff; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; font-family: -apple-system, Segoe UI, Arial, sans-serif;">
          <div>
            <div style="font-size: 12px; font-weight: 800; color: ${brandColor}; text-transform: uppercase; letter-spacing: 0.1em;">
              SYNTHÈSE STATISTIQUE GLOBALE
            </div>
            <h2 style="font-size: 24px; font-weight: 900; margin: 6px 0 20px 0; color: #ffffff;">
              Indicateurs de Supervision &amp; Gravité — ${subName}
            </h2>

            <!-- Grille des Cartouches KPI -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 25px;">
              <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; border-radius: 12px; padding: 18px; text-align: center;">
                <div style="font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Incidents Analysés</div>
                <div style="font-size: 36px; font-weight: 900; color: #ffffff; margin-top: 4px;">${incidents.length}</div>
                <div style="font-size: 10px; color: #38bdf8; margin-top: 2px;">100% Capitalisés</div>
              </div>

              <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 12px; padding: 18px; text-align: center;">
                <div style="font-size: 11px; color: #f87171; font-weight: 700; text-transform: uppercase;">Incidents Critiques</div>
                <div style="font-size: 36px; font-weight: 900; color: #ef4444; margin-top: 4px;">${criticalCount}</div>
                <div style="font-size: 10px; color: #fca5a5; margin-top: 2px;">Impact Business Immédiat</div>
              </div>

              <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(234, 88, 12, 0.4); border-radius: 12px; padding: 18px; text-align: center;">
                <div style="font-size: 11px; color: #fb923c; font-weight: 700; text-transform: uppercase;">Gravité Haute</div>
                <div style="font-size: 36px; font-weight: 900; color: #ea580c; margin-top: 4px;">${highCount}</div>
                <div style="font-size: 10px; color: #fdba74; margin-top: 2px;">Dégradation de Service</div>
              </div>

              <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 12px; padding: 18px; text-align: center;">
                <div style="font-size: 11px; color: #34d399; font-weight: 700; text-transform: uppercase;">Taux de Clôture RCA</div>
                <div style="font-size: 36px; font-weight: 900; color: #10b981; margin-top: 4px;">100%</div>
                <div style="font-size: 10px; color: #6ee7b7; margin-top: 2px;">Cause Racine Formelle</div>
              </div>
            </div>

            <!-- Synthèse des domaines -->
            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid #1e293b; border-radius: 12px; padding: 18px;">
              <div style="font-size: 12px; font-weight: 800; color: #ffffff; text-transform: uppercase; margin-bottom: 8px;">
                Périmètre d'Impact par Brique Architecturale
              </div>
              <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin: 0;">
                Les incidents traités couvrent l'intégralité du cycle transactionnel : 
                <strong>GAB/ATM</strong> (problématiques CDM, capteurs, shutters, extournes 0420), 
                <strong>TPE/POS</strong> (règles marchands MID/TID, vélocité, devises), 
                <strong>Sécurité &amp; Cryptographie</strong> (Thales PayShield, dérives ZPK, validation ARQC/ATC), 
                <strong>Routage Interbancaire</strong> (Switch GIMAC, VISA, failover BGP) et 
                <strong>Core Banking</strong> (Sopra Amplitude, verrous Oracle ORA-00054, fichiers de clearing Base II).
              </p>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px;">
            <span>${subName} • Banking Command Center</span>
            <span>Slide 2 / ${displayLimit + 2}</span>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- SLIDES DES INCIDENTS INDIVIDUELS           -->
        <!-- ========================================== -->
        ${incidentSlidesHtml}
      </body>
    </html>
  `;

  downloadBlob(pptHtml, `Presentation_Incidents_Monetiques_${subsidiary}_${getTimestampStr()}.ppt`, "application/vnd.ms-powerpoint;charset=utf-8");
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getTimestampStr(): string {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
}

function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

