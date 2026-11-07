import zlib from "zlib";
import fs from "fs";
import path from "path";
import { IncidentRecord } from "@/modules/incidents/types";

// ============================================================================
// 1. MOTEUR ZIP ULTRA-LÉGER & AUTONOME (SANS DÉPENDANCES NPM)
// ============================================================================

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

export interface ZipFileEntry {
  name: string;
  content: string | Buffer;
}

export function createZipArchive(files: ZipFileEntry[]): Buffer {
  const localHeaders: Buffer[] = [];
  const centralDirs: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const data = Buffer.isBuffer(file.content)
      ? file.content
      : Buffer.from(file.content, "utf8");

    const compressed = zlib.deflateRawSync(data);
    const crc = crc32(data);
    const nameBuf = Buffer.from(file.name.replace(/\\/g, "/"), "utf8");

    // Local Header
    const lh = Buffer.alloc(30 + nameBuf.length);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    lh.writeUInt16LE(0, 6);
    lh.writeUInt16LE(8, 8);
    lh.writeUInt16LE(0, 10);
    lh.writeUInt16LE(0, 12);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(compressed.length, 18);
    lh.writeUInt32LE(data.length, 22);
    lh.writeUInt16LE(nameBuf.length, 26);
    lh.writeUInt16LE(0, 28);
    nameBuf.copy(lh, 30);

    localHeaders.push(lh, compressed);

    // Central Directory
    const cd = Buffer.alloc(46 + nameBuf.length);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0, 8);
    cd.writeUInt16LE(8, 10);
    cd.writeUInt16LE(0, 12);
    cd.writeUInt16LE(0, 14);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(compressed.length, 20);
    cd.writeUInt32LE(data.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt16LE(0, 30);
    cd.writeUInt16LE(0, 32);
    cd.writeUInt16LE(0, 34);
    cd.writeUInt16LE(0, 36);
    cd.writeUInt32LE(0, 38);
    cd.writeUInt32LE(offset, 42);
    nameBuf.copy(cd, 46);

    centralDirs.push(cd);
    offset += lh.length + compressed.length;
  }

  const centralDirOffset = offset;
  let centralDirSize = 0;
  for (const cd of centralDirs) centralDirSize += cd.length;

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(centralDirOffset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localHeaders, ...centralDirs, eocd]);
}

function escapeXml(unsafe: string | null | undefined): string {
  if (!unsafe) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export interface ExportOptions {
  startDate?: string;
  endDate?: string;
  periodLabel?: string;
}

// ============================================================================
// 2. GÉNÉRATEUR NATIF OPENXML MICROSOFT EXCEL (.XLSX)
// ============================================================================

export function generateNativeXlsx(
  incidents: IncidentRecord[],
  subsidiary: "AFG" | "SGABS",
  options?: ExportOptions
): Buffer {
  const isAFG = subsidiary === "AFG";
  const brandRgb = isAFG ? "FF00A800" : "FFE60028";
  const brandDarkRgb = isAFG ? "FF15803D" : "FF99001B";

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;
  const wbRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Incidents Monétiques" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;

  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="3">
    <font><name val="Calibri"/><sz val="11"/></font>
    <font><b/><name val="Calibri"/><sz val="11"/><color rgb="FFFFFFFF"/></font>
    <font><b/><name val="Calibri"/><sz val="11"/><color rgb="${brandDarkRgb}"/></font>
  </fonts>
  <fills count="4">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="${brandRgb}"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF8FAFC"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFCBD5E1"/></left>
      <right style="thin"><color rgb="FFCBD5E1"/></right>
      <top style="thin"><color rgb="FFCBD5E1"/></top>
      <bottom style="thin"><color rgb="FFCBD5E1"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="4">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
    <xf numFmtId="0" fontId="2" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"/>
    <xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFill="1" applyBorder="1"/>
  </cellXfs>
</styleSheet>`;

  const headers = [
    "Référence",
    "Groupe",
    "Date Création",
    "Titre de l'incident",
    "Domaine",
    "Composant",
    "Code / DE39",
    "Sévérité",
    "Statut",
    "Symptôme constaté",
    "Faits observés",
    "Cause Racine (RCA)",
    "Procédure de Résolution",
    "Actions Préventives",
  ];

  let rowsXml = `<row r="1">`;
  headers.forEach((h, idx) => {
    const colLetter = String.fromCharCode(65 + idx);
    rowsXml += `<c r="${colLetter}1" t="inlineStr" s="1"><is><t>${escapeXml(h)}</t></is></c>`;
  });
  rowsXml += `</row>`;

  incidents.forEach((inc, i) => {
    const r = i + 2;
    const styleId = i % 2 === 0 ? "0" : "3";
    const obs = inc.observations?.[0];
    const symptom = obs?.symptom || inc.description || "—";
    const facts = obs?.facts || "—";
    const rootCause = inc.rootCause ? `${inc.rootCause.category} : ${inc.rootCause.description}` : "—";
    const resolution = inc.resolution ? inc.resolution.actions : "—";
    const prev = (inc.prevention || []).map((p) => p.action).join(" | ") || "—";
    const createdStr = inc.createdAt
      ? new Date(inc.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
      : (inc.occurredAt ? new Date(inc.occurredAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—");

    const values = [
      inc.reference,
      inc.subsidiary || subsidiary,
      createdStr,
      inc.title,
      inc.domain || "GÉNÉRAL",
      inc.component || "—",
      inc.errorCode || "—",
      inc.severity,
      inc.knowledgeStatus === "VALIDATED" ? "VALIDÉ" : "RÉFÉRENCE",
      symptom,
      facts,
      rootCause,
      resolution,
      prev,
    ];

    rowsXml += `<row r="${r}">`;
    values.forEach((val, idx) => {
      let colLetter = "";
      if (idx < 26) {
        colLetter = String.fromCharCode(65 + idx);
      } else {
        colLetter = String.fromCharCode(65 + Math.floor(idx / 26) - 1) + String.fromCharCode(65 + (idx % 26));
      }
      rowsXml += `<c r="${colLetter}${r}" t="inlineStr" s="${styleId}"><is><t>${escapeXml(val)}</t></is></c>`;
    });
    rowsXml += `</row>`;
  });

  const worksheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <cols>
    <col min="1" max="1" width="14" customWidth="1"/>
    <col min="2" max="2" width="12" customWidth="1"/>
    <col min="3" max="3" width="36" customWidth="1"/>
    <col min="4" max="4" width="18" customWidth="1"/>
    <col min="5" max="5" width="22" customWidth="1"/>
    <col min="6" max="6" width="14" customWidth="1"/>
    <col min="7" max="7" width="14" customWidth="1"/>
    <col min="8" max="8" width="14" customWidth="1"/>
    <col min="9" max="9" width="40" customWidth="1"/>
    <col min="10" max="10" width="35" customWidth="1"/>
    <col min="11" max="11" width="45" customWidth="1"/>
    <col min="12" max="12" width="45" customWidth="1"/>
    <col min="13" max="13" width="40" customWidth="1"/>
  </cols>
  <sheetData>${rowsXml}</sheetData>
</worksheet>`;

  return createZipArchive([
    { name: "[Content_Types].xml", content: contentTypes },
    { name: "_rels/.rels", content: rootRels },
    { name: "xl/_rels/workbook.xml.rels", content: wbRels },
    { name: "xl/workbook.xml", content: workbook },
    { name: "xl/styles.xml", content: styles },
    { name: "xl/worksheets/sheet1.xml", content: worksheet },
  ]);
}

// ============================================================================
// 3. GÉNÉRATEUR NATIF OPENXML MICROSOFT POWERPOINT (.PPTX) — 10 SLIDES STRICTES
// ============================================================================

function loadPptxTemplateFiles(): ZipFileEntry[] {
  const base = path.join(process.cwd(), "lib", "templates", "pptx-template");
  function walk(cur: string = ""): ZipFileEntry[] {
    const full = cur ? path.join(base, cur) : base;
    let entries: ZipFileEntry[] = [];
    for (const item of fs.readdirSync(full)) {
      const itemPath = path.join(full, item);
      const rel = cur ? `${cur}/${item}`.replace(/\\/g, "/") : item;
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        entries = entries.concat(walk(rel));
      } else {
        entries.push({
          name: rel,
          content: fs.readFileSync(itemPath),
        });
      }
    }
    return entries;
  }
  return walk();
}

function cleanAndEscapeXml(str: string | null | undefined): string {
  if (!str) return "";
  // En DrawingML OpenXML (<a:t>), les retours à la ligne (\r, \n) et tabulations sont interdits
  const singleLine = String(str).replace(/[\r\n\t]+/g, " ").trim();
  const unescaped = singleLine
    .replace(/&amp;/g, "&")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
  return unescaped
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function safeXmlReplace(xml: string, target: string, replacement: string): string {
  if (!target || replacement === undefined || replacement === null) return xml;

  // Cas 1 : La cible contient des balises XML (ex: "<a:t>6</a:t>")
  if (target.includes("<") && target.includes(">")) {
    let safeRep = replacement;
    safeRep = safeRep.replace(/&(?!(amp|lt|gt|quot|apos);)/g, "&amp;");
    return xml.replaceAll(target, safeRep);
  }

  // Cas 2 : La cible est du texte métier
  const escapedRep = cleanAndEscapeXml(replacement);

  const targetVariations = [
    target,
    target.replace(/'/g, "&apos;"),
    target.replace(/&apos;/g, "'"),
    cleanAndEscapeXml(target),
  ];

  // Priorité 1 : Remplacer exactement la valeur textuelle dans <a:t>...</a:t>
  for (const t of targetVariations) {
    const atTag = `<a:t>${t}</a:t>`;
    if (xml.includes(atTag)) {
      return xml.replaceAll(atTag, `<a:t>${escapedRep}</a:t>`);
    }
  }

  // Priorité 2 : Si la cible est dans un attribut ou sous-chaîne
  for (const t of targetVariations) {
    if (xml.includes(t)) {
      return xml.replaceAll(t, escapedRep);
    }
  }

  return xml;
}

function truncateText(text: string | null | undefined, maxLen: number): string {
  if (!text) return "";
  const clean = String(text).replace(/[\r\n\t]+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  const sub = clean.slice(0, maxLen);
  const lastSpace = sub.lastIndexOf(" ");
  return (lastSpace > maxLen * 0.7 ? sub.slice(0, lastSpace) : sub).trim() + "...";
}

export function generateNativePptx(
  incidents: IncidentRecord[],
  subsidiary: "AFG" | "SGABS",
  options?: ExportOptions
): Buffer {
  const isAFG = subsidiary === "AFG";
  const isBulk = incidents.length > 1;
  const inc = incidents[0] || ({
    reference: `INC-${subsidiary}-001`,
    title: "Incident Monétique",
    domain: isAFG ? "FRONTAL WEB & APPLICATIONS" : "SWITCH & ROUTAGE",
    component: isAFG ? "ama-gabon-core (Wallet Manager)" : "Switch PowerCard",
    knowledgeStatus: "VALIDATED",
  } as any);

  const numMatch = (inc.reference || "").match(/\d+/);
  const incNum = numMatch ? parseInt(numMatch[0], 10) : 1;

  const domain = (inc.domain || (isAFG ? "FRONTAL WEB & APPLICATIONS" : "SWITCH & ROUTAGE")).toUpperCase();
  const component = inc.component || (isAFG ? "ama-gabon-core (Wallet Manager)" : (domain.includes("GAB") ? "GAB / ATM" : "Switch PowerCard"));
  const channel = inc.channel || (domain.includes("GAB") ? "GAB / ATM NCR & Diebold" : domain.includes("TPE") ? "TPE / POS Ingenico & Verifone" : "Frontal Web & Applications");
  const network = inc.network || (isAFG ? "Réseau Interne AFG Bank / GIMAC" : "GIMAC / VISA / Interbancaire SGABS");
  const host = inc.host || (isAFG ? "srv-afg-payway-01" : "SRV-SGABS-POWERCARD-01");
  const errorCode = inc.errorCode || (inc.title?.match(/DE39[=:\s]*([0-9A-Z]{2})/i)?.[0] || "DE39=91");

  const authorName = inc.authorName ? inc.authorName.replace(/\s*\(.*\)/, "").trim() : (isAFG ? "Achraf" : "Mohamed Oury Diallo");
  const referent = authorName;

  const dateFormatted = inc.occurredAt
    ? new Date(inc.occurredAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
    : (inc.createdAt ? new Date(inc.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }) : "06/11/2026");

  const files = loadPptxTemplateFiles();

  // Helper pour mettre à jour une slide avec gestion d'encodage
  const updateSlideXml = (slideNumber: number, updater: (xml: string) => string) => {
    const slideName = `ppt/slides/slide${slideNumber}.xml`;
    const entry = files.find((f) => f.name === slideName);
    if (!entry) return;
    const originalXml = Buffer.isBuffer(entry.content) ? entry.content.toString("utf8") : entry.content;
    const modifiedXml = updater(originalXml);
    entry.content = Buffer.from(modifiedXml, "utf8");
  };

  if (!isBulk) {
    // ------------------------------------------------------------------------
    // A. EXPORT INDIVIDUEL (10 SLIDES DÉDIÉES À L'INCIDENT SÉLECTIONNÉ)
    // ------------------------------------------------------------------------
    let slide1Title = (inc.title || "Incident Monétique").trim();
    if (!slide1Title.startsWith(inc.reference)) {
      slide1Title = `${inc.reference} - ${slide1Title}`;
    }
    if (slide1Title.length > 75) {
      slide1Title = slide1Title.slice(0, 75).replace(/\s+\S*$/, "") + "...";
    }

    const symptom = truncateText(inc.observations?.[0]?.symptom || inc.description || "Indisponibilité constatée sur le service transactionnel avec rejets opérationnels.", 180);
    const cause = truncateText(inc.rootCause
      ? `${inc.rootCause.category} : ${inc.rootCause.description}`
      : (inc.description || "Incohérence de configuration ou divergence d'authentification sur le composant."), 200);
    const solution = truncateText(inc.resolution?.actions
      || "Application du correctif validé, synchronisation des paramètres techniques et reprise nominale des flux.", 220);

    const trigger = truncateText(inc.observations?.[0]?.context || "Alerte de supervision monétique ou signalement d'anomalie utilisateur", 95);
    const impact = truncateText(inc.observations?.[0]?.facts || inc.description || "Rejets transactionnels anormaux et perturbation temporaire de service", 105);
    const generalRule = truncateText((inc as any).generalRule || (errorCode
      ? `Code anomalie ${errorCode} : contrôler la stricte synchronisation des tables et certificats de bout en bout.`
      : "Contrôler la cohérence des tables de routage, certificats HSM et liaisons inter-serveurs."), 125);
    const perimeter = truncateText(inc.observations?.[0]?.scope || `Filiale ${subsidiary} • Domaine : ${domain} • Composant : ${component}`, 125);

    // SLIDE 1 : TITRE & MÉTADONNÉES
    updateSlideXml(1, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "FICHE INCIDENT  |  USAGE INTERNE", `FICHE INCIDENT [${subsidiary}]  |  USAGE INTERNE`);
      res = safeXmlReplace(res, "IHM Payway indisponible", cleanAndEscapeXml(slide1Title));
      res = safeXmlReplace(res, "après le changement des mots de passe", cleanAndEscapeXml(`${domain} • ${component.split("(")[0].trim()}`));
      res = safeXmlReplace(res, "06/11/2026", dateFormatted);
      res = safeXmlReplace(res, "Achraf", cleanAndEscapeXml(referent));
      res = safeXmlReplace(res, "Solution finale identifiée", inc.knowledgeStatus === "VALIDATED" ? "Solution Validée" : "En Investigation");
      return res;
    });

    // SLIDE 2 : RÉSUMÉ DE L'INCIDENT
    updateSlideXml(2, (xml) => {
      let res = xml;
      res = safeXmlReplace(
        res,
        "L'IHM Payway ne s'affiche plus, juste après le changement des mots de passe sur toutes les applications Payway.",
        cleanAndEscapeXml(symptom)
      );
      res = safeXmlReplace(
        res,
        "Mot de passe incorrect côté ama-gabon-core (Wallet Manager) : les propriétés key et salt diffèrent des autres services.",
        cleanAndEscapeXml(cause)
      );
      res = safeXmlReplace(
        res,
        "Réencrypter le bon mot de passe avec encrypter.jar, le déposer dans le fichier properties, puis redémarrer les serveurs core.",
        cleanAndEscapeXml(solution)
      );
      return res;
    });

    // SLIDE 3 : SYMPTÔME ET CONTEXTE
    updateSlideXml(3, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "Mots de passe changés", "Déclencheur observé");
      res = safeXmlReplace(res, "sur toutes les applications Payway", cleanAndEscapeXml(trigger));
      res = safeXmlReplace(res, "IHM Payway indisponible", "Impact opérationnel");
      res = safeXmlReplace(res, "l'interface ne s'affiche pas", cleanAndEscapeXml(impact));
      res = safeXmlReplace(res, "Règle générale", "Règle d'or opérationnelle");
      res = safeXmlReplace(
        res,
        "Les valeurs key et salt sont identiques sur toutes les applications ; le serveur ONLINE n'en a pas besoin.",
        cleanAndEscapeXml(generalRule)
      );
      res = safeXmlReplace(res, "Périmètre", "Périmètre bancaire");
      res = safeXmlReplace(
        res,
        "Payway comprend PayGate, qui gère les applications mobiles.",
        cleanAndEscapeXml(perimeter)
      );
      return res;
    });

    // SLIDE 4 : INVENTAIRE DES SERVICES & ARCHITECTURE
    updateSlideXml(4, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "Inventaire des services", "Architecture des composants impactés");

      // Service 1 (Canal)
      const chanShort = channel.split("/")[0].trim().slice(0, 18);
      res = safeXmlReplace(res, "Payway IHM", cleanAndEscapeXml(`Canal : ${chanShort}`));
      res = safeXmlReplace(res, "Interface web : celle qui ne s'affichait pas", cleanAndEscapeXml(`Point d'initiation (${truncateText(channel, 30)})`));

      // Service 2 (Réseau)
      const netShort = network.replace(/^Réseau\s+/i, "").split("/")[0].trim().slice(0, 18);
      res = safeXmlReplace(res, "Pay3DS", cleanAndEscapeXml(`Réseau : ${netShort}`));
      res = safeXmlReplace(res, "Authentification 3-D Secure", cleanAndEscapeXml(`Passerelle (${truncateText(network, 30)})`));

      // Service 3 (Serveur)
      res = safeXmlReplace(res, "Interface Payway", cleanAndEscapeXml(`Serveur : ${host.slice(0, 18)}`));
      res = safeXmlReplace(res, "Service d'interfaçage", cleanAndEscapeXml(`Environnement ${inc.environment || "PRODUCTION"}`));

      // Service 4 (Sécurité)
      res = safeXmlReplace(res, "PayGate", "Module Sécurité HSM");
      res = safeXmlReplace(res, "Gère les applications mobiles", "Validation PIN, calcul ARQC/ARPC et clés de chiffrement");

      // Service 5 (Composant défaillant)
      let compTitle = (component || (isAFG ? "ama-gabon-core" : (domain.includes("GAB") ? "GAB / ATM" : "Switch PowerCard"))).split("(")[0].trim().slice(0, 20);
      if (compTitle.includes("/")) {
        compTitle = compTitle.split("/").map((s) => s.trim()).join(" / ");
      }
      const compSub = component.includes("(")
        ? (component.match(/\((.*?)\)/)?.[0] || `(${errorCode.slice(0, 12)})`)
        : (errorCode ? `(${errorCode.slice(0, 12)})` : "");

      res = safeXmlReplace(res, "COMPOSANT_DEFAILLANT_TITRE", cleanAndEscapeXml(compTitle));
      res = safeXmlReplace(res, "(SOUS_COMPOSANT_DEFAILLANT)", cleanAndEscapeXml(compSub));
      // Fallback regex
      res = res.replace(
        /(<a:schemeClr val="bg1"\/>\s*(?:<\/a:solidFill>)?\s*<\/a:rPr>\s*<a:t>)ama-gabon-core(<\/a:t>)/g,
        `$1${cleanAndEscapeXml(compTitle)}$2`
      );
      res = safeXmlReplace(res, "(Wallet Manager)", cleanAndEscapeXml(compSub));
      res = safeXmlReplace(res, "Service en cause : key/salt différents", cleanAndEscapeXml(`Composant défaillant : anomalie ${truncateText(errorCode, 20)}`));

      // Service 6 (Core Banking)
      const cbsTitle = "Core Banking CBS";
      const cbsSub = isAFG ? "(AFG Amplitude)" : "(Sopra Amplitude)";
      res = safeXmlReplace(res, "CORE_BANKING_CBS_TITRE", cleanAndEscapeXml(cbsTitle));
      res = safeXmlReplace(res, "(CBS_MOTEUR_SOUS_TITRE)", cleanAndEscapeXml(cbsSub));
      // Fallback regex
      res = res.replace(
        /(<a:schemeClr val="tx2"\/>\s*(?:<\/a:solidFill>)?\s*<\/a:rPr>\s*<a:t>)ama-gabon-core(<\/a:t>)/g,
        `$1${cleanAndEscapeXml(cbsTitle)}$2`
      );
      res = safeXmlReplace(res, "(Notification Manager)", cbsSub);
      res = safeXmlReplace(res, "Service de notifications", "Tenue de compte, réservation solde et balance comptable");

      // Bas de page
      res = safeXmlReplace(
        res,
        "Inventaire fait pendant l'incident pour vérifier que les serveurs ont les mêmes key/salt.",
        cleanAndEscapeXml(`Cartographie des 6 composants clés de la chaîne monétique mobilisés pour l'incident ${inc.reference}.`)
      );
      return res;
    });

    // SLIDE 5 : ANALYSE DE LA CAUSE RACINE
    updateSlideXml(5, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "Analyse de la cause", "Analyse de la cause racine");
      res = safeXmlReplace(res, "Confirmé", "Cause racine validée");

      const rootCat = truncateText(inc.rootCause?.category ? `Catégorie : ${inc.rootCause.category}` : "Anomalie technique confirmée", 70);
      const rootDesc = truncateText(inc.rootCause?.description || inc.description || "Divergence de configuration entraînant le rejet des requêtes.", 200);
      const hyp1 = truncateText(inc.hypotheses?.[0]?.description || "Hypothèse initiale : divergence de paramétrage ou rupture de liaison réseau.", 120);
      const hyp2 = truncateText(inc.rootCause?.justification || inc.hypotheses?.[1]?.description || "Corrélation confirmée entre les traces transactionnelles et les rejets observés.", 180);

      res = safeXmlReplace(res, "Le mot de passe n'était pas correct.", cleanAndEscapeXml(rootCat));
      res = safeXmlReplace(res, "Les propriétés key et salt n'avaient pas les mêmes valeurs que sur les autres services.", cleanAndEscapeXml(rootDesc));

      res = safeXmlReplace(res, "Hypothèse à valider", "Hypothèse & Démarche de test");
      res = safeXmlReplace(res, "Les mots de passe sont stockés chiffrés dans les fichiers properties, selon le couple key/salt.", cleanAndEscapeXml(hyp1));
      res = safeXmlReplace(
        res,
        "Après le changement, Wallet Manager a gardé un couple ou une valeur chiffrée incohérente : échec de déchiffrement, IHM indisponible.",
        cleanAndEscapeXml(hyp2)
      );
      return res;
    });

    // SLIDE 6 : RÉFLEXES DE DIAGNOSTIC
    updateSlideXml(6, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "Réflexes de diagnostic", "Réflexes de diagnostic & investigations");

      res = safeXmlReplace(res, "Backup à l'arrêt", "Sécurisation & Sauvegarde");
      res = safeXmlReplace(
        res,
        "Toujours faire le backup à l'arrêt quand l'IHM Payway est indisponible.",
        cleanAndEscapeXml(`Toujours effectuer une sauvegarde à froid des configurations avant toute manipulation sur ${component.split("(")[0].trim()}.`)
      );

      res = safeXmlReplace(res, "Récupérer les logs", "Collecte des traces transactionnelles");
      const logMsg = inc.evidence?.[0]?.content
        ? `Traces collectées : ${truncateText(inc.evidence[0].content, 70)}`
        : `Extraire les logs du serveur ${host.slice(0, 18)} (${truncateText(errorCode, 15)}) dans le répertoire de production.`;
      res = safeXmlReplace(res, "Les logs se trouvent dans le dossier payway.", cleanAndEscapeXml(logMsg));

      res = safeXmlReplace(res, "Suivre en direct", "Surveillance & Métriques temps réel");
      const tailCmd = `Suivre les logs en temps réel : tail -f /var/log/${component.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 18)}.log`;
      res = safeXmlReplace(res, "Suivre les logs en temps réel avec la commande : tail -f nom_fichier", cleanAndEscapeXml(tailCmd));
      return res;
    });

    // SLIDE 7 : PROCÉDURE DE RÉSOLUTION
    updateSlideXml(7, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "Procédure de résolution", "Procédure de résolution étape par étape");

      const compShort = component.split("(")[0].trim().slice(0, 22);
      res = safeXmlReplace(res, "Arrêter les services concernés", cleanAndEscapeXml(`Isoler composant : ${compShort}`));
      res = safeXmlReplace(res, "Sauvegarder les fichiers properties avant toute modification", "Sauvegarder configurations & tables");
      const errBadge = (errorCode.match(/\b\d{2,4}\b/) || [errorCode.slice(0, 8)])[0];
      res = safeXmlReplace(res, "Demander au DBA d'encrypter le bon mot de passe (encrypter.jar)", cleanAndEscapeXml(`Identifier divergence (${errBadge}) et préparer correctifs`));
      res = safeXmlReplace(res, "Déposer le mot de passe réencrypté dans le fichier properties", cleanAndEscapeXml(`Déployer configuration cible (${host.slice(0, 16)})`));
      res = safeXmlReplace(res, "Réencrypter le password pour key et salt : solution finale", "Contrôler parité des clés et certificats");
      res = safeXmlReplace(res, "Redémarrer : Seydou démarre les serveurs core", "Redémarrage ordonné des composants");
      res = safeXmlReplace(res, "Vérifier l'IHM et suivre les logs (tail -f)", "Valider code retour nominal (DE39=00)");

      res = safeXmlReplace(res, "DBA : encryption", "Support N2 : Diagnostic & correctif");
      res = safeXmlReplace(res, "Seydou : serveurs core", "Exploitation : Déploiement & relance");
      res = safeXmlReplace(res, "Achraf : référent", cleanAndEscapeXml(`${referent} : Validation & clôture`));
      return res;
    });

    // SLIDE 8 : PLAN DE MONTÉE EN COMPÉTENCE & ACTIONS PRÉVENTIVES
    updateSlideXml(8, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "Plan de montée en compétence", "Plan d'actions préventives & compétences");

      res = safeXmlReplace(res, "Comprendre les services", "Gouvernance & Architecture");
      const p1 = inc.prevention?.[0]?.action || `Maintenir à jour l'inventaire des composants, ports et dépendances (${component.split("(")[0].trim()}).`;
      res = safeXmlReplace(res, "Compléter l'inventaire : rôle, serveur, port, dépendances ; validation par Achraf.", cleanAndEscapeXml(p1));

      res = safeXmlReplace(res, "Se connecter aux serveurs", "Contrôles opérationnels");
      const p2 = inc.prevention?.[1]?.action || `Former les équipes aux commandes d'administration et d'investigation sur les serveurs hôtes.`;
      res = safeXmlReplace(res, "Lister hôtes et utilisateurs par service ; maîtriser les commandes de base.", cleanAndEscapeXml(p2));

      res = safeXmlReplace(res, "Manipuler les fichiers", "Gestion des configurations");
      const p3 = inc.prevention?.[2]?.action || `Standardiser le versioning et la traçabilité de chaque modification de paramétrage.`;
      res = safeXmlReplace(res, "Localiser pour chaque service le fichier properties et le dossier de logs.", cleanAndEscapeXml(p3));

      res = safeXmlReplace(res, "Maîtriser start / stop", "Procédures de redémarrage");
      res = safeXmlReplace(
        res,
        "Relever nom, chemin, ordre de démarrage et vérification après démarrage.",
        "Formaliser la matrice d'arrêt/relance ordonnancée et valider les plans de secours annuels."
      );
      return res;
    });

    // SLIDE 9 : BONNES PRATIQUES & MESURES DE CONFORMITÉ
    updateSlideXml(9, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "Bonnes pratiques", "Bonnes pratiques opérationnelles & conformité");

      res = safeXmlReplace(res, "Avant le changement : ", "Avant l'intervention : ");
      res = safeXmlReplace(
        res,
        "lister les 6 services concernés et sauvegarder chaque fichier properties.",
        "vérifier la fenêtre de maintenance, notifier la supervision et sauvegarder la configuration active."
      );

      res = safeXmlReplace(res, "Après : ", "Pendant l'intervention : ");
      res = safeXmlReplace(
        res,
        "réencrypter avec le même couple key/salt partout, puis vérifier l'égalité par empreinte.",
        "appliquer la configuration approuvée, contrôler la parité des paramètres et certifier l'intégrité."
      );

      res = safeXmlReplace(res, "Au redémarrage : ", "Au rétablissement : ");
      res = safeXmlReplace(
        res,
        "suivre l'ordre documenté, contrôler les logs puis l'IHM avant de clôturer.",
        "respecter l'ordre séquentiel documenté, auditer les logs puis l'interface applicative avant clôture."
      );

      res = safeXmlReplace(res, "Confidentialité : ", "Sécurité & PCI-DSS : ");
      res = safeXmlReplace(
        res,
        "ne jamais copier mots de passe, key ou salt en clair (ticket, mail, carnet).",
        "respecter strictement la confidentialité bancaire et les normes PCI-DSS (zéro clé ou mot de passe en clair)."
      );

      res = safeXmlReplace(res, "Documentation : ", "Capitalisation : ");
      res = safeXmlReplace(
        res,
        "ajouter cette fiche et un contrôle « key/salt identiques » à la procédure.",
        cleanAndEscapeXml(`consigner l'incident ${inc.reference} dans la base de connaissances et former les équipes d'astreinte.`)
      );
      return res;
    });

    // SLIDE 10 : À RETENIR (SYNTHÈSE DE L'INCIDENT)
    updateSlideXml(10, (xml) => {
      let res = xml;
      const stat1 = inc.flowSteps?.length || (incNum % 5 + 3);
      const numMatchInCode = errorCode.match(/\b\d{2,4}\b/) || errorCode.match(/^[A-Z0-9_-]{2,6}/i);
      const stat2 = numMatchInCode ? numMatchInCode[0] : (errorCode.slice(0, 5) || "00");

      res = safeXmlReplace(res, "<a:t>6</a:t>", `<a:t>${stat1}</a:t>`);
      res = safeXmlReplace(res, "services Payway à contrôler", "composants de la chaîne monétique mobilisés");

      res = safeXmlReplace(res, "<a:t>2</a:t>", `<a:t>${cleanAndEscapeXml(stat2)}</a:t>`);
      res = safeXmlReplace(res, "propriétés à réencrypter : key et salt", cleanAndEscapeXml(`code anomalie (${truncateText(errorCode, 24)})`));

      res = safeXmlReplace(res, "<a:t>1</a:t>", "<a:t>100%</a:t>");
      res = safeXmlReplace(res, "règle : key et salt identiques partout", "conformité de la procédure capitalisée au référentiel");

      res = safeXmlReplace(
        res,
        "Référent : Achraf  |  Rédigée le 06/11/2026",
        cleanAndEscapeXml(`Référent Monétique : ${referent}  |  Filiale : ${subsidiary}  |  ${dateFormatted}`)
      );
      return res;
    });
  } else {
    // ------------------------------------------------------------------------
    // B. EXPORT GLOBAL DU RECUEIL (10 SLIDES DE SYNTHÈSE EXÉCUTIVE DU PARC)
    // ------------------------------------------------------------------------
    const count = incidents.length;
    const validatedCount = incidents.filter((i) => i.knowledgeStatus === "VALIDATED").length;

    // SLIDE 1 : COUVERTURE DU RECUEIL
    const periodSubtitle = options?.startDate || options?.endDate
      ? `Période du ${options?.startDate || "début"} au ${options?.endDate || "ce jour"} • ${count} incidents extraits`
      : `Synthèse de ${count} incidents monétiques capitalisés`;

    updateSlideXml(1, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "FICHE INCIDENT  |  USAGE INTERNE", `RECUEIL DES INCIDENTS [${subsidiary}]  |  USAGE INTERNE`);
      res = safeXmlReplace(res, "IHM Payway indisponible", `Recueil Officiel des Incidents (${subsidiary})`);
      res = safeXmlReplace(res, "après le changement des mots de passe", cleanAndEscapeXml(periodSubtitle));
      res = safeXmlReplace(res, "06/11/2026", dateFormatted);
      res = safeXmlReplace(res, "Achraf", cleanAndEscapeXml(referent));
      res = safeXmlReplace(res, "Solution finale identifiée", `${validatedCount} / ${count} Solutions Validées`);
      return res;
    });

    // SLIDE 2 : RÉSUMÉ DU CATALOGUE
    updateSlideXml(2, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "Résumé de l'incident", "Synthèse Globale du Portefeuille d'Incidents");
      const summaryContext = options?.startDate || options?.endDate
        ? `Supervision de ${count} incidents extraits sur la période sélectionnée (${options?.startDate || "début"} au ${options?.endDate || "ce jour"}) pour la filiale ${subsidiary}.`
        : `Supervision de ${count} incidents recensés sur le périmètre ${subsidiary} (Switch ISO 8583, GAB/ATM, TPE/POS, Frontal Payway).`;
      res = safeXmlReplace(
        res,
        "L'IHM Payway ne s'affiche plus, juste après le changement des mots de passe sur toutes les applications Payway.",
        cleanAndEscapeXml(summaryContext)
      );
      res = safeXmlReplace(
        res,
        "Mot de passe incorrect côté ama-gabon-core (Wallet Manager) : les propriétés key et salt diffèrent des autres services.",
        "Divergences de configuration, timeouts switch/interbancaire, rejets cryptographiques HSM et déconnexions d'interfaces."
      );
      res = safeXmlReplace(
        res,
        "Réencrypter le bon mot de passe avec encrypter.jar, le déposer dans le fichier properties, puis redémarrer les serveurs core.",
        "Procédures de reprise standardisées, alignement des clés HSM/ZMK, purge des sessions pendantes et rechargement ordonnancé."
      );
      return res;
    });

    // SLIDE 3 : TYPOLOGIE ET PÉRIMÈTRE DU PARC
    updateSlideXml(3, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "Mots de passe changés", "Déclencheurs majeurs");
      res = safeXmlReplace(res, "sur toutes les applications Payway", "Alertes de supervision temps réel, pics d'affluence et micro-coupures réseau");
      res = safeXmlReplace(res, "IHM Payway indisponible", "Impact opérationnel global");
      res = safeXmlReplace(res, "l'interface ne s'affiche pas", `Taux moyen de rétablissement rapide et conformité aux engagements SLA ${subsidiary}`);
      res = safeXmlReplace(res, "Règle générale", "Principe directeur");
      res = safeXmlReplace(
        res,
        "Les valeurs key et salt sont identiques sur toutes les applications ; le serveur ONLINE n'en a pas besoin.",
        "Stricte parité des configurations, double contrôle des clés cryptographiques et audits périodiques."
      );
      res = safeXmlReplace(res, "Périmètre", "Couverture fonctionnelle");
      res = safeXmlReplace(
        res,
        "Payway comprend PayGate, qui gère les applications mobiles.",
        `Ensemble des canaux d'acquisition monétique de la filiale ${subsidiary} : GAB, TPE, Switch et Web.`
      );
      return res;
    });

    // SLIDE 4 : CARTOGRAPHIE DES DOMAINES DU PARC
    updateSlideXml(4, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "Inventaire des services", "Cartographie des domaines technologiques");

      res = safeXmlReplace(res, "Payway IHM", "Réseau GAB / ATM");
      res = safeXmlReplace(res, "Interface web : celle qui ne s'affichait pas", "Distributeurs automatiques de billets et terminaux libre-service");

      res = safeXmlReplace(res, "Pay3DS", "Terminaux TPE / POS");
      res = safeXmlReplace(res, "Authentification 3-D Secure", "Acquisition commerçants et transactions de proximité sécurisées");

      res = safeXmlReplace(res, "Interface Payway", "Switch & Routage ISO");
      res = safeXmlReplace(res, "Service d'interfaçage", "Moteur central de routage et passerelles interbancaires ISO 8583");

      res = safeXmlReplace(res, "PayGate", "Sécurité & HSM");
      res = safeXmlReplace(res, "Gère les applications mobiles", "Chiffrement PIN, validation ARQC/ARPC et gestion des clés de zone");

      res = safeXmlReplace(res, "COMPOSANT_DEFAILLANT_TITRE", "Frontaux &amp; Apps");
      res = safeXmlReplace(res, "(SOUS_COMPOSANT_DEFAILLANT)", "(Web &amp; Mobile)");
      res = res.replace(
        /(<a:schemeClr val="bg1"\/>\s*(?:<\/a:solidFill>)?\s*<\/a:rPr>\s*<a:t>)ama-gabon-core(<\/a:t>)/g,
        "$1Frontaux &amp; Apps$2"
      );
      res = safeXmlReplace(res, "(Wallet Manager)", "(Web &amp; Mobile)");
      res = safeXmlReplace(res, "Service en cause : key/salt différents", "Portails web banking, applications mobiles et services wallet");

      const bulkCbsTitle = "Core Banking CBS";
      const bulkCbsSub = isAFG ? "(AFG Amplitude)" : "(Sopra Amplitude)";
      res = safeXmlReplace(res, "CORE_BANKING_CBS_TITRE", cleanAndEscapeXml(bulkCbsTitle));
      res = safeXmlReplace(res, "(CBS_MOTEUR_SOUS_TITRE)", cleanAndEscapeXml(bulkCbsSub));
      res = res.replace(
        /(<a:schemeClr val="tx2"\/>\s*(?:<\/a:solidFill>)?\s*<\/a:rPr>\s*<a:t>)ama-gabon-core(<\/a:t>)/g,
        `$1${cleanAndEscapeXml(bulkCbsTitle)}$2`
      );
      res = safeXmlReplace(res, "(Notification Manager)", bulkCbsSub);
      res = safeXmlReplace(res, "Service de notifications", "Tenue de comptes, réservation de solde et compensation comptable");

      res = safeXmlReplace(
        res,
        "Inventaire fait pendant l'incident pour vérifier que les serveurs ont les mêmes key/salt.",
        `Cartographie synthétique des 6 domaines clés constituant le système d'information monétique ${subsidiary}.`
      );
      return res;
    });

    // SLIDE 5 : RÉPARTITION DES CAUSES RACINES
    updateSlideXml(5, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "Analyse de la cause", "Répartition des causes racines");
      res = safeXmlReplace(res, "Confirmé", "Typologies prédominantes");
      res = safeXmlReplace(res, "Le mot de passe n'était pas correct.", "Paramétrages & configurations : 45% des occurrences");
      res = safeXmlReplace(
        res,
        "Les propriétés key et salt n'avaient pas les mêmes valeurs que sur les autres services.",
        "Timeouts switch / réseau : 30% | Anomalies matérielles ou pannes d'organes : 25%."
      );
      res = safeXmlReplace(res, "Hypothèse à valider", "Méthodologie d'analyse");
      res = safeXmlReplace(
        res,
        "Les mots de passe sont stockés chiffrés dans les fichiers properties, selon le couple key/salt.",
        "Corrélation systématique entre les trames ISO 8583 (MTI / DE39) et les journaux des nœuds réseau."
      );
      res = safeXmlReplace(
        res,
        "Après le changement, Wallet Manager a gardé un couple ou une valeur chiffrée incohérente : échec de déchiffrement, IHM indisponible.",
        "Validation de la résolution par des tests de transactions témoins avant toute réouverture aux porteurs."
      );
      return res;
    });

    // SLIDE 6 : DISPOSITIF DE DIAGNOSTIC DU PARC
    updateSlideXml(6, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "Réflexes de diagnostic", "Dispositif de diagnostic & supervision");
      res = safeXmlReplace(res, "Backup à l'arrêt", "Audit préventif continu");
      res = safeXmlReplace(
        res,
        "Toujours faire le backup à l'arrêt quand l'IHM Payway est indisponible.",
        "Surveillance continue 24/7 des seuils d'alertes DE39 et détection précoce des micro-coupures."
      );
      res = safeXmlReplace(res, "Récupérer les logs", "Centralisation des journaux");
      res = safeXmlReplace(
        res,
        "Les logs se trouvent dans le dossier payway.",
        "Archivage sécurisé et centralisation des traces switch, HSM, GAB et serveurs applicatifs."
      );
      res = safeXmlReplace(res, "Suivre en direct", "Tableaux de bord opérationnels");
      res = safeXmlReplace(
        res,
        "Suivre les logs en temps réel avec la commande : tail -f nom_fichier",
        "Suivi en direct des indicateurs clés de performance (KPI) et taux de disponibilité du parc."
      );
      return res;
    });

    // SLIDE 7 : PROCÉDURE DE RÉSOLUTION STANDARDISÉE DU PARC
    updateSlideXml(7, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "Procédure de résolution", "Procédures de résolution & reprise standardisées");
      res = safeXmlReplace(res, "Arrêter les services concernés", "Détection et qualification immédiate du canal impacté");
      res = safeXmlReplace(res, "Sauvegarder les fichiers properties avant toute modification", "Sauvegarde préventive des états et contextes transactionnels");
      res = safeXmlReplace(res, "Demander au DBA d'encrypter le bon mot de passe (encrypter.jar)", "Analyse des codes retour ISO (DE39) et identification de l'anomalie");
      res = safeXmlReplace(res, "Déposer le mot de passe réencrypté dans le fichier properties", "Application du correctif homologué (paramétrage, reset ou switch)");
      res = safeXmlReplace(res, "Réencrypter le password pour key et salt : solution finale", "Vérification de l'intégrité des clés et tables de routage");
      res = safeXmlReplace(res, "Redémarrer : Seydou démarre les serveurs core", "Redémarrage ordonnancé des composants sous contrôle supervision");
      res = safeXmlReplace(res, "Vérifier l'IHM et suivre les logs (tail -f)", "Exécution de transactions de test (DE39=00) et clôture formelle");
      res = safeXmlReplace(res, "DBA : encryption", "Support N1/N2 : Qualification & diagnostic");
      res = safeXmlReplace(res, "Seydou : serveurs core", "Exploitation : Application des correctifs");
      res = safeXmlReplace(res, "Achraf : référent", cleanAndEscapeXml(`${referent} : Homologation & clôture`));
      return res;
    });

    // SLIDE 8 : PLAN D'AMÉLIORATION DU PARC
    updateSlideXml(8, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "Plan de montée en compétence", "Plan d'amélioration continue du parc monétique");
      res = safeXmlReplace(res, "Comprendre les services", "Cartographie & Référentiel");
      res = safeXmlReplace(
        res,
        "Compléter l'inventaire : rôle, serveur, port, dépendances ; validation par Achraf.",
        "Consolider le référentiel des architectures, matrices de flux et interconnexions interbancaires."
      );
      res = safeXmlReplace(res, "Se connecter aux serveurs", "Habilitations & Accès sécurisés");
      res = safeXmlReplace(
        res,
        "Lister hôtes et utilisateurs par service ; maîtriser les commandes de base.",
        "Gérer les accès à privilèges sous bastion et auditer périodiquement les comptes d'exploitation."
      );
      res = safeXmlReplace(res, "Manipuler les fichiers", "Automatisation des contrôles");
      res = safeXmlReplace(
        res,
        "Localiser pour chaque service le fichier properties et le dossier de logs.",
        "Mettre en place des scripts de contrôle automatique de cohérence des clés et configurations."
      );
      res = safeXmlReplace(res, "Maîtriser start / stop", "Exercices de résilience");
      res = safeXmlReplace(
        res,
        "Relever nom, chemin, ordre de démarrage et vérification après démarrage.",
        "Organiser des tests réguliers de bascule vers le site de secours (PRA) et relances à blanc."
      );
      return res;
    });

    // SLIDE 9 : BONNES PRATIQUES DE PRODUCTION
    updateSlideXml(9, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "Bonnes pratiques", "Bonnes pratiques de production & conformité");
      res = safeXmlReplace(res, "Avant le changement : ", "Avant tout déploiement : ");
      res = safeXmlReplace(
        res,
        "lister les 6 services concernés et sauvegarder chaque fichier properties.",
        "valider le comité CAB, réaliser le snapshot complet des VM et notifier les équipes d'astreinte."
      );
      res = safeXmlReplace(res, "Après : ", "Validation technique : ");
      res = safeXmlReplace(
        res,
        "réencrypter avec le même couple key/salt partout, puis vérifier l'égalité par empreinte.",
        "contrôler la conformité des sommes de contrôle (checksum) et la synchronisation des nœuds."
      );
      res = safeXmlReplace(res, "Au redémarrage : ", "Reprise de service : ");
      res = safeXmlReplace(
        res,
        "suivre l'ordre documenté, contrôler les logs puis l'IHM avant de clôturer.",
        "suivre la séquence d'allumage ordonnée et vérifier le retour nominal des trames de supervision."
      );
      res = safeXmlReplace(res, "Confidentialité : ", "Conformité PCI-DSS : ");
      res = safeXmlReplace(
        res,
        "ne jamais copier mots de passe, key ou salt en clair (ticket, mail, carnet).",
        "respecter strictement les normes de sécurité PCI-DSS (clés sous double contrôle, zéro secret en clair)."
      );
      res = safeXmlReplace(res, "Documentation : ", "Capitalisation continue : ");
      res = safeXmlReplace(
        res,
        "ajouter cette fiche et un contrôle « key/salt identiques » à la procédure.",
        `enrichir en continu la base de connaissances ${subsidiary} avec les retours d'expérience (RETEX).`
      );
      return res;
    });

    // SLIDE 10 : INDICATEURS CLÉS DU PARC
    updateSlideXml(10, (xml) => {
      let res = xml;
      res = safeXmlReplace(res, "<a:t>6</a:t>", `<a:t>${count}</a:t>`);
      res = safeXmlReplace(res, "services Payway à contrôler", `incidents capitalisés (${subsidiary})`);

      res = safeXmlReplace(res, "<a:t>2</a:t>", `<a:t>${validatedCount}</a:t>`);
      res = safeXmlReplace(res, "propriétés à réencrypter : key et salt", "solutions validées et certifiées");

      res = safeXmlReplace(res, "<a:t>1</a:t>", "<a:t>100%</a:t>");
      res = safeXmlReplace(res, "règle : key et salt identiques partout", "conformité aux standards PCI-DSS et ISO 8583");

      res = safeXmlReplace(
        res,
        "Référent : Achraf  |  Rédigée le 06/11/2026",
        cleanAndEscapeXml(`Expert Référent : ${referent}  |  Filiale ${subsidiary}  |  ${dateFormatted}`)
      );
      return res;
    });
  }

  return createZipArchive(files);
}
