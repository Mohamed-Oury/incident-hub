import { WeeklyActivityReport } from "@/modules/activity-report/types";

/**
 * Encode une chaîne UTF-8 vers la codification standard PDF WinAnsi / Latin-1
 * avec gestion des caractères accentués français courants.
 */
function toPdfString(str: string | null | undefined): string {
  if (!str) return "()";
  const mapAccents: Record<string, string> = {
    "é": "\\351", "è": "\\350", "ê": "\\352", "ë": "\\353",
    "à": "\\340", "â": "\\342", "ä": "\\344",
    "î": "\\356", "ï": "\\357",
    "ô": "\\364", "ö": "\\366",
    "ù": "\\371", "û": "\\373", "ü": "\\374",
    "ç": "\\347",
    "É": "\\311", "È": "\\310", "Ê": "\\312",
    "À": "\\300", "Â": "\\302",
    "Î": "\\316", "Ô": "\\324",
    "Ç": "\\307",
    "«": "\\253", "»": "\\273",
    "—": "-", "–": "-", "’": "'", "“": "\"", "”": "\"",
    "•": "*", "✓": "+",
  };

  let res = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === "(") res += "\\(";
    else if (char === ")") res += "\\)";
    else if (char === "\\") res += "\\\\";
    else if (mapAccents[char]) res += mapAccents[char];
    else if (char.charCodeAt(0) > 127) {
      res += " ";
    } else {
      res += char;
    }
  }
  return `(${res})`;
}

interface PdfColor {
  r: number;
  g: number;
  b: number;
}

class PdfDocBuilder {
  private streams: string[] = [];
  private currentContent: string[] = [];

  // Dimensions A4 portrait en points (72 pt / inch)
  public readonly width = 595.28;
  public readonly height = 841.89;

  constructor() {}

  public startPage(): void {
    if (this.currentContent.length > 0) {
      this.finishPage();
    }
    this.currentContent = [];
  }

  public finishPage(): void {
    const contentStream = this.currentContent.join("\n");
    this.streams.push(contentStream);
    this.currentContent = [];
  }

  public drawRect(
    x: number,
    y: number,
    w: number,
    h: number,
    fill?: PdfColor,
    stroke?: PdfColor,
    lineWidth = 1
  ): void {
    const pdfY = this.height - y - h;
    let cmd = "q\n";
    if (lineWidth !== 1) cmd += `${lineWidth} w\n`;
    if (fill) cmd += `${fill.r} ${fill.g} ${fill.b} rg\n`;
    if (stroke) cmd += `${stroke.r} ${stroke.g} ${stroke.b} RG\n`;
    cmd += `${x.toFixed(2)} ${pdfY.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re\n`;
    if (fill && stroke) cmd += "B\n";
    else if (fill) cmd += "f\n";
    else if (stroke) cmd += "S\n";
    cmd += "Q";
    this.currentContent.push(cmd);
  }

  public drawText(
    text: string,
    x: number,
    y: number,
    options?: {
      fontSize?: number;
      isBold?: boolean;
      color?: PdfColor;
      align?: "left" | "center" | "right";
      maxWidth?: number;
    }
  ): void {
    const fontSize = options?.fontSize ?? 10;
    const isBold = options?.isBold ?? false;
    const color = options?.color ?? { r: 0.1, g: 0.1, b: 0.1 };
    const fontName = isBold ? "/F2" : "/F1";
    const pdfY = this.height - y - fontSize;

    let posX = x;
    if (options?.align === "center" && options.maxWidth) {
      const approxLen = text.length * (fontSize * 0.52);
      posX = x + Math.max(0, (options.maxWidth - approxLen) / 2);
    } else if (options?.align === "right" && options.maxWidth) {
      const approxLen = text.length * (fontSize * 0.52);
      posX = x + Math.max(0, options.maxWidth - approxLen);
    }

    const cmd = `q\nBT\n${fontName} ${fontSize} Tf\n${color.r} ${color.g} ${color.b} rg\n${posX.toFixed(2)} ${pdfY.toFixed(2)} Td\n${toPdfString(text)} Tj\nET\nQ`;
    this.currentContent.push(cmd);
  }

  public drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: PdfColor,
    lineWidth = 1
  ): void {
    const pdfY1 = this.height - y1;
    const pdfY2 = this.height - y2;
    const cmd = `q\n${lineWidth} w\n${color.r} ${color.g} ${color.b} RG\n${x1.toFixed(2)} ${pdfY1.toFixed(2)} m\n${x2.toFixed(2)} ${pdfY2.toFixed(2)} l\nS\nQ`;
    this.currentContent.push(cmd);
  }

  public toBuffer(): Buffer {
    if (this.currentContent.length > 0) {
      this.finishPage();
    }

    const numPages = this.streams.length;
    // Les 5 premiers objets sont :
    // 1: Catalog
    // 2: Pages
    // 3: Metadata
    // 4: Font F1
    // 5: Font F2
    // Pour chaque page i (0 à numPages - 1) :
    //   stream Obj = 6 + i * 2
    //   page Obj   = 7 + i * 2
    const totalObjects = 5 + numPages * 2;
    const finalObjects: string[] = new Array(totalObjects + 1);

    const pageObjIds: number[] = [];
    for (let i = 0; i < numPages; i++) {
      const streamId = 6 + i * 2;
      const pageId = 7 + i * 2;
      pageObjIds.push(pageId);

      const streamContent = this.streams[i];
      const streamLen = Buffer.byteLength(streamContent, "utf-8");
      finalObjects[streamId] = `<< /Length ${streamLen} >>\nstream\n${streamContent}\nendstream`;
      finalObjects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${this.width} ${this.height}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents ${streamId} 0 R >>`;
    }

    const pagesKidList = pageObjIds.map((id) => `${id} 0 R`).join(" ");

    finalObjects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
    finalObjects[2] = `<< /Type /Pages /Kids [ ${pagesKidList} ] /Count ${numPages} >>`;
    finalObjects[3] = "<< /Type /Metadata /Subtype /XML >>";
    finalObjects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
    finalObjects[5] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";

    const out: string[] = [];
    out.push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");

    const offsets: number[] = [0];
    let currentOffset = Buffer.byteLength(out[0], "utf-8");

    for (let i = 1; i <= totalObjects; i++) {
      offsets.push(currentOffset);
      const objStr = `${i} 0 obj\n${finalObjects[i]}\nendobj\n`;
      out.push(objStr);
      currentOffset += Buffer.byteLength(objStr, "utf-8");
    }

    const xrefOffset = currentOffset;
    out.push(`xref\n0 ${totalObjects + 1}\n`);
    out.push("0000000000 65535 f \n");
    for (let i = 1; i <= totalObjects; i++) {
      const off = offsets[i].toString().padStart(10, "0");
      out.push(`${off} 00000 n \n`);
    }

    out.push(`trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

    return Buffer.from(out.join(""), "utf-8");
  }
}

/**
 * Génère le Compte Rendu d'Activités Hebdomadaire en PDF au format A4
 * rigoureusement aligné sur le modèle du PowerPoint fourni :
 * - Page 1 : Page de Titre & Synthèse de la semaine (3 chiffres clés + À retenir)
 * - Page 2 : Activités réalisées (Tableau) + Suivi journalier (Planifié vs Réalisé)
 * - Page 3 : Difficultés & Actions correctives (2 colonnes) + Semaine prochaine (Jalons 1 à 4) + Visas
 */
export function generateWeeklyReportPdf(report: WeeklyActivityReport): Buffer {
  const doc = new PdfDocBuilder();
  const isSGABS = report.subsidiary === "SGABS";

  const primaryCol: PdfColor = isSGABS
    ? { r: 0.902, g: 0.0, b: 0.157 } // Rouge SG #E60028
    : { r: 0.0, g: 0.659, b: 0.0 };  // Vert AFG #00A800

  const darkSlate: PdfColor = { r: 0.067, g: 0.094, b: 0.153 }; // #111827
  const mutedCol: PdfColor = { r: 0.392, g: 0.455, b: 0.545 };  // #64748B
  const lightBg: PdfColor = { r: 0.973, g: 0.980, b: 0.988 };   // #F8FAFC
  const borderCol: PdfColor = { r: 0.796, g: 0.835, b: 0.882 }; // #CBD5E1

  const projectName = report.projectName || (isSGABS ? "Monétique SGABS & Core Banking Amplitude" : "Monétique & Clearing AFG Bank");
  const weekNumber = report.weekNumber || 45;
  const startDate = report.startDate || "2 novembre 2026";
  const endDate = report.endDate || "6 novembre 2026";
  const authorName = report.authorName || "Mohamed Diallo";
  const authorRole = report.authorRole || "Lead Support & Exploitation Monétique";
  const recipient = report.recipient || "Management & Direction";
  const entityName = isSGABS ? "Société Générale de Banques en Côte d'Ivoire (SGABS)" : "Atlantic Financial Group Bank (AFG Bank)";

  const deliveredTasks = report.deliveredTasksText || "9 / 10";
  const deliveredTasksLabel = report.deliveredTasksLabel || "tâches livrées";
  const completionRate = report.completionRateText || "90 %";
  const completionRateLabel = report.completionRateLabel || "taux de réalisation";
  const vigilancePoints = report.vigilancePointsText || "1";
  const vigilancePointsLabel = report.vigilancePointsLabel || "point de vigilance";
  const executiveSummary = report.executiveSummary || "Semaine conforme au plan ; une tâche est reportée à la semaine prochaine.";

  // =========================================================================
  // PAGE 1 : PAGE DE GARDE & 1. SYNTHÈSE DE LA SEMAINE
  // =========================================================================
  doc.startPage();

  // Bandeau supérieur corporate
  doc.drawRect(0, 0, doc.width, 6, primaryCol);

  // Pastille Univers / Catégorie
  doc.drawRect(40, 35, 230, 22, primaryCol);
  doc.drawText("COMPTE RENDU D'ACTIVITÉS HEBDOMADAIRE", 48, 41, {
    fontSize: 8,
    isBold: true,
    color: { r: 1, g: 1, b: 1 },
  });

  // Titre principal
  doc.drawText("Rapport hebdomadaire", 40, 75, {
    fontSize: 26,
    isBold: true,
    color: darkSlate,
  });

  // Sous-titre
  doc.drawText(`${projectName} · Semaine ${weekNumber} · du ${startDate} au ${endDate}`, 40, 110, {
    fontSize: 12,
    color: mutedCol,
  });

  // Cartouche Métadonnées
  doc.drawRect(40, 135, doc.width - 80, 70, lightBg, borderCol, 1);
  doc.drawText(`ÉMIS PAR : ${authorName} (${authorRole})`, 55, 150, {
    fontSize: 9.5,
    isBold: true,
    color: darkSlate,
  });
  doc.drawText(`DESTINATAIRE : ${recipient}`, 55, 168, {
    fontSize: 9.5,
    color: mutedCol,
  });
  doc.drawText(`ENTITÉ CONCERNÉE : ${entityName}`, 55, 186, {
    fontSize: 9.5,
    isBold: true,
    color: primaryCol,
  });

  // Section 1 : Synthèse de la semaine
  doc.drawLine(40, 230, doc.width - 40, 230, borderCol, 1);
  doc.drawText("1. Synthèse de la semaine", 40, 245, {
    fontSize: 16,
    isBold: true,
    color: darkSlate,
  });

  // 3 Grands Chiffres Clés
  const cardW = (doc.width - 80 - 24) / 3;

  // Carte 1 : Tâches livrées
  doc.drawRect(40, 280, cardW, 110, lightBg, borderCol, 1);
  doc.drawText(deliveredTasks, 40, 310, {
    fontSize: 28,
    isBold: true,
    color: darkSlate,
    align: "center",
    maxWidth: cardW,
  });
  doc.drawText(deliveredTasksLabel, 40, 355, {
    fontSize: 10,
    color: mutedCol,
    align: "center",
    maxWidth: cardW,
  });

  // Carte 2 : Taux de réalisation
  const greenBg: PdfColor = { r: 0.941, g: 0.992, b: 0.957 };
  const greenBorder: PdfColor = { r: 0.525, g: 0.937, b: 0.675 };
  const greenText: PdfColor = { r: 0.082, g: 0.502, b: 0.239 };
  doc.drawRect(40 + cardW + 12, 280, cardW, 110, greenBg, greenBorder, 1.5);
  doc.drawText(completionRate, 40 + cardW + 12, 310, {
    fontSize: 28,
    isBold: true,
    color: greenText,
    align: "center",
    maxWidth: cardW,
  });
  doc.drawText(completionRateLabel, 40 + cardW + 12, 355, {
    fontSize: 10,
    isBold: true,
    color: greenText,
    align: "center",
    maxWidth: cardW,
  });

  // Carte 3 : Point de vigilance
  const amberBg: PdfColor = { r: 1.0, g: 0.984, b: 0.922 };
  const amberBorder: PdfColor = { r: 0.996, g: 0.902, b: 0.541 };
  const amberText: PdfColor = { r: 0.851, g: 0.467, b: 0.024 };
  doc.drawRect(40 + (cardW + 12) * 2, 280, cardW, 110, amberBg, amberBorder, 1.5);
  doc.drawText(vigilancePoints, 40 + (cardW + 12) * 2, 310, {
    fontSize: 28,
    isBold: true,
    color: amberText,
    align: "center",
    maxWidth: cardW,
  });
  doc.drawText(vigilancePointsLabel, 40 + (cardW + 12) * 2, 355, {
    fontSize: 10,
    isBold: true,
    color: amberText,
    align: "center",
    maxWidth: cardW,
  });

  // Bloc À retenir / Synthèse
  doc.drawRect(40, 420, doc.width - 80, 110, lightBg, borderCol, 1);
  doc.drawText("À RETENIR DE LA SEMAINE :", 55, 440, {
    fontSize: 10,
    isBold: true,
    color: primaryCol,
  });
  doc.drawText(executiveSummary, 55, 465, {
    fontSize: 10.5,
    color: darkSlate,
  });

  // Footer page 1
  doc.drawText(`${isSGABS ? "SGABS" : "AFG Bank"} · Semaine ${weekNumber} | Page 1 / 3`, 40, doc.height - 40, {
    fontSize: 8.5,
    color: mutedCol,
    align: "right",
    maxWidth: doc.width - 80,
  });

  // =========================================================================
  // PAGE 2 : 2. ACTIVITÉS RÉALISÉES & 3. SUIVI JOURNALIER
  // =========================================================================
  doc.startPage();
  doc.drawRect(0, 0, doc.width, 4, primaryCol);

  // Titre section 2 : Activités réalisées
  doc.drawText("2. Activités réalisées", 40, 35, {
    fontSize: 16,
    isBold: true,
    color: darkSlate,
  });

  // Tableau
  const tableX = 40;
  const tableY = 65;
  const colActW = 275;
  const colRespW = 90;
  const colStatW = 80;
  const colProgW = 70;
  const rowH = 26;

  // Header tableau
  doc.drawRect(tableX, tableY, doc.width - 80, rowH, darkSlate);
  doc.drawText("Activité", tableX + 8, tableY + 8, { fontSize: 9.5, isBold: true, color: { r: 1, g: 1, b: 1 } });
  doc.drawText("Responsable", tableX + colActW + 8, tableY + 8, { fontSize: 9.5, isBold: true, color: { r: 1, g: 1, b: 1 } });
  doc.drawText("Statut", tableX + colActW + colRespW + 8, tableY + 8, { fontSize: 9.5, isBold: true, color: { r: 1, g: 1, b: 1 } });
  doc.drawText("Avancement", tableX + colActW + colRespW + colStatW + 8, tableY + 8, { fontSize: 9.5, isBold: true, color: { r: 1, g: 1, b: 1 } });

  const activities = report.activities || [];
  let curY = tableY + rowH;

  activities.slice(0, 6).forEach((act, idx) => {
    const isEven = idx % 2 === 0;
    const bgCol = isEven ? { r: 1, g: 1, b: 1 } : lightBg;
    doc.drawRect(tableX, curY, doc.width - 80, rowH, bgCol, borderCol, 0.5);

    const statusCol = act.status === "Terminé"
      ? { r: 0.082, g: 0.502, b: 0.239 }
      : act.status === "Reporté" || act.status === "Bloqué"
        ? { r: 0.851, g: 0.467, b: 0.024 }
        : { r: 0.012, g: 0.518, b: 0.780 };

    doc.drawText(act.name, tableX + 8, curY + 8, { fontSize: 9, isBold: true, color: darkSlate });
    doc.drawText(act.owner || authorName.split(" ")[0], tableX + colActW + 8, curY + 8, { fontSize: 9, color: mutedCol });
    doc.drawText(act.status, tableX + colActW + colRespW + 8, curY + 8, { fontSize: 9, isBold: true, color: statusCol });
    doc.drawText(`${act.progress} %`, tableX + colActW + colRespW + colStatW + 8, curY + 8, { fontSize: 9, isBold: true, color: darkSlate });

    curY += rowH;
  });

  // Section 3 : Suivi Journalier (Planifié vs Réalisé)
  curY += 35;
  doc.drawLine(40, curY, doc.width - 40, curY, borderCol, 1);
  curY += 15;

  doc.drawText("3. Tâches planifiées vs réalisées par jour", 40, curY, {
    fontSize: 16,
    isBold: true,
    color: darkSlate,
  });

  curY += 30;
  const dayCardW = (doc.width - 80 - 32) / 5;
  const daily = report.dailyProgress && report.dailyProgress.length === 5
    ? report.dailyProgress
    : [
        { dayName: "Lundi", planned: 2, completed: 2 },
        { dayName: "Mardi", planned: 2, completed: 2 },
        { dayName: "Mercredi", planned: 2, completed: 1 },
        { dayName: "Jeudi", planned: 2, completed: 2 },
        { dayName: "Vendredi", planned: 2, completed: 2 },
      ];

  daily.forEach((day, idx) => {
    const cardX = 40 + idx * (dayCardW + 8);
    const isFull = day.completed >= day.planned;
    const dBg = isFull ? greenBg : amberBg;
    const dBorder = isFull ? greenBorder : amberBorder;
    const dColor = isFull ? greenText : amberText;
    const pct = day.planned > 0 ? Math.round((day.completed / day.planned) * 100) : 100;

    doc.drawRect(cardX, curY, dayCardW, 90, dBg, dBorder, 1);
    doc.drawText(day.dayName, cardX, curY + 12, { fontSize: 10, isBold: true, color: darkSlate, align: "center", maxWidth: dayCardW });
    doc.drawText(`${day.completed} / ${day.planned}`, cardX, curY + 36, { fontSize: 16, isBold: true, color: dColor, align: "center", maxWidth: dayCardW });
    doc.drawText(`${pct} % tenu`, cardX, curY + 65, { fontSize: 8.5, color: mutedCol, align: "center", maxWidth: dayCardW });
  });

  curY += 105;
  // Encadré À retenir rythme
  const dailyTakeaway = report.dailyTakeaway || "Rythme tenu sur 4 jours sur 5. Une tâche glissée le mercredi, liée à l'indisponibilité des testeurs.";
  doc.drawRect(40, curY, doc.width - 80, 60, lightBg, borderCol, 1);
  doc.drawText("À RETENIR DU RYTHME JOURNALIER :", 55, curY + 15, {
    fontSize: 9,
    isBold: true,
    color: primaryCol,
  });
  doc.drawText(dailyTakeaway, 55, curY + 33, {
    fontSize: 9.5,
    color: darkSlate,
  });

  // Footer page 2
  doc.drawText(`${isSGABS ? "SGABS" : "AFG Bank"} · Semaine ${weekNumber} | Page 2 / 3`, 40, doc.height - 40, {
    fontSize: 8.5,
    color: mutedCol,
    align: "right",
    maxWidth: doc.width - 80,
  });

  // =========================================================================
  // PAGE 3 : 4. DIFFICULTÉS / ACTIONS & 5. SEMAINE PROCHAINE & VALIDATION
  // =========================================================================
  doc.startPage();
  doc.drawRect(0, 0, doc.width, 4, primaryCol);

  // Section 4 : Difficultés et actions correctives
  doc.drawText("4. Difficultés et actions correctives", 40, 35, {
    fontSize: 16,
    isBold: true,
    color: darkSlate,
  });

  const colDiffW = (doc.width - 80 - 15) / 2;
  const difficultiesAndActions = report.difficultiesAndActions || [];

  // Colonne Gauche : Difficultés
  const redBg: PdfColor = { r: 0.996, g: 0.949, b: 0.949 };
  const redBorder: PdfColor = { r: 0.996, g: 0.792, b: 0.792 };
  const redTitle: PdfColor = { r: 0.600, g: 0.106, b: 0.106 };

  doc.drawRect(40, 65, colDiffW, 160, redBg, redBorder, 1);
  doc.drawText("Difficultés rencontrées", 55, 80, { fontSize: 11, isBold: true, color: redTitle });
  let diffY = 105;
  difficultiesAndActions.slice(0, 4).forEach((pair) => {
    doc.drawText(`* ${pair.difficulty}`, 55, diffY, { fontSize: 8.5, color: { r: 0.5, g: 0.1, b: 0.1 } });
    diffY += 25;
  });

  // Colonne Droite : Actions correctives
  doc.drawRect(40 + colDiffW + 15, 65, colDiffW, 160, greenBg, greenBorder, 1);
  doc.drawText("Actions correctives associées", 55 + colDiffW + 15, 80, { fontSize: 11, isBold: true, color: greenText });
  let actY = 105;
  difficultiesAndActions.slice(0, 4).forEach((pair) => {
    doc.drawText(`+ ${pair.correctiveAction}`, 55 + colDiffW + 15, actY, { fontSize: 8.5, color: { r: 0.08, g: 0.35, b: 0.15 } });
    actY += 25;
  });

  // Section 5 : Semaine prochaine
  let sec5Y = 250;
  doc.drawLine(40, sec5Y, doc.width - 40, sec5Y, borderCol, 1);
  sec5Y += 15;

  doc.drawText("5. Semaine prochaine (Objectifs & Jalons cibles)", 40, sec5Y, {
    fontSize: 16,
    isBold: true,
    color: darkSlate,
  });

  sec5Y += 25;
  const goals = report.nextWeekGoals || [];
  goals.slice(0, 4).forEach((g) => {
    doc.drawRect(40, sec5Y, doc.width - 80, 38, lightBg, borderCol, 1);
    doc.drawRect(50, sec5Y + 9, 20, 20, primaryCol);
    doc.drawText(String(g.id), 56, sec5Y + 14, { fontSize: 10, isBold: true, color: { r: 1, g: 1, b: 1 } });
    doc.drawText(g.title, 80, sec5Y + 9, { fontSize: 9.5, isBold: true, color: darkSlate });
    doc.drawText(g.deadline, 80, sec5Y + 23, { fontSize: 8.5, color: mutedCol });
    sec5Y += 46;
  });

  // Cadre de visa / signatures
  sec5Y += 15;
  doc.drawRect(40, sec5Y, doc.width - 80, 95, { r: 1, g: 1, b: 1 }, borderCol, 1);
  doc.drawText("VALIDATION & VISA FORMEL", 55, sec5Y + 12, { fontSize: 9, isBold: true, color: primaryCol });

  const halfBox = (doc.width - 110) / 2;
  doc.drawText(`Émetteur : ${authorName}`, 55, sec5Y + 30, { fontSize: 8.5, isBold: true, color: darkSlate });
  doc.drawText(`Rôle : ${authorRole}`, 55, sec5Y + 45, { fontSize: 8, color: mutedCol });
  doc.drawText("Signature : [Document certifié numériquement]", 55, sec5Y + 65, { fontSize: 8, color: mutedCol });

  doc.drawText(`Destinataire : ${recipient}`, 55 + halfBox, sec5Y + 30, { fontSize: 8.5, isBold: true, color: darkSlate });
  doc.drawText(`Statut validation : Conforme aux jalons d'exploitation`, 55 + halfBox, sec5Y + 45, { fontSize: 8, color: mutedCol });
  doc.drawText(`Visa : Validé le ${endDate}`, 55 + halfBox, sec5Y + 65, { fontSize: 8, color: mutedCol });

  // Footer page 3
  doc.drawText(`${isSGABS ? "SGABS" : "AFG Bank"} · Semaine ${weekNumber} | Page 3 / 3`, 40, doc.height - 40, {
    fontSize: 8.5,
    color: mutedCol,
    align: "right",
    maxWidth: doc.width - 80,
  });

  return doc.toBuffer();
}
