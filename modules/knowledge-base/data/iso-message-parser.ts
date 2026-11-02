import { ISO_DE_DEFINITIONS, DataElementSpec } from "./iso-bitmap-decoder";
import { MTI_CATALOG, MTIDefinition } from "./iso-mti-reference";
import { DE39_CATALOG } from "./iso-de39-reference";
import { parseEmvTlv, EmvDecodeResult, DecodedEmvTag } from "./emv-tlv-decoder";
import { maskPAN, maskPinBlock } from "../../security/masking";

export interface ParsedDataElement {
  de: number;
  spec?: DataElementSpec;
  rawValue: string;
  displayValue: string;
  length: number;
  lengthHeader?: string;
  isMasked: boolean;
  offsetStart: number;
  offsetEnd: number;
  error?: string;
  interpretation?: string;
  emvTags?: DecodedEmvTag[];
}

export interface IsoParseResult {
  rawInput: string;
  detectedFormat: "STANDARD" | "WIRESHARK_HEX_DUMP" | "LOG_EXTRACTED";
  tcpLengthHeader?: string;
  isoHeader?: string;
  tpduHeader?: string;
  mti: string;
  mtiDef?: MTIDefinition;
  bitmapHex: string;
  bitmapBinary: string;
  isSecondaryBitmap: boolean;
  totalFieldsCount: number;
  fields: ParsedDataElement[];
  remainingUnparsed?: string;
  criticalInsights: {
    pan?: string;
    procCode?: string;
    procCodeDescription?: string;
    amount?: string;
    currency?: string;
    stan?: string;
    localTime?: string;
    localDate?: string;
    transmissionDateTime?: string;
    expirationDate?: string;
    mcc?: string;
    posEntryMode?: string;
    posEntryModeDescription?: string;
    posConditionCode?: string;
    csn?: string;
    rrn?: string;
    authCode?: string;
    responseCode?: string;
    responseDescription?: string;
    responseCategory?: string;
    diagnosticAdvice?: string;
    tid?: string;
    mid?: string;
    acceptorName?: string;
    networkCode?: string;
    originalData?: string;
    account1?: string;
    account2?: string;
    emvParsed?: EmvDecodeResult;
    hasPinBlock?: boolean;
    hasMac?: boolean;
  };
  errors: string[];
  warnings: string[];
  sanitizationNotes: string[];
}

export const ISO_CURRENCIES: Record<string, string> = {
  "952": "XOF - Franc CFA (BCEAO)",
  "950": "XAF - Franc CFA (BEAC)",
  "978": "EUR - Euro",
  "840": "USD - Dollar Américain",
  "826": "GBP - Livre Sterling",
  "324": "GNF - Franc Guinéen",
  "504": "MAD - Dirham Marocain",
  "788": "TND - Dinar Tunisien",
  "012": "DZD - Dinar Algérien",
  "756": "CHF - Franc Suisse",
  "124": "CAD - Dollar Canadien",
  "392": "JPY - Yen Japonais",
  "156": "CNY - Yuan Chinois",
};

export function resolveProcCode(code: string): string {
  if (!code || code.length < 2) return code;
  const tx = code.slice(0, 2);
  const fromAcct = code.length >= 4 ? code.slice(2, 4) : "00";
  const toAcct = code.length >= 6 ? code.slice(4, 6) : "00";

  let txName = "Opération diverse";
  switch (tx) {
    case "00":
      txName = "Achat / Paiement Marchand";
      break;
    case "01":
      txName = "Retrait Espèces (GAB / Guichet)";
      break;
    case "09":
      txName = "Achat avec Retrait Espèces (Cashback)";
      break;
    case "20":
      txName = "Remboursement / Avoir (Refund)";
      break;
    case "30":
    case "31":
      txName = "Demande de Solde (Balance Inquiry)";
      break;
    case "40":
      txName = "Transfert / Virement Compte à Compte";
      break;
    case "50":
      txName = "Paiement de Facture (Bill Payment)";
      break;
    case "80":
      txName = "Dépôt Espèces / Chèque";
      break;
    case "90":
      txName = "Changement de Code PIN";
      break;
  }

  const acctType = (a: string) => {
    switch (a) {
      case "00":
        return "Défaut";
      case "10":
        return "Épargne";
      case "20":
        return "Chèque / Courant";
      case "30":
        return "Crédit";
      default:
        return a;
    }
  };

  return `${code} - ${txName} (Source: ${acctType(fromAcct)}${toAcct !== "00" ? `, Cible: ${acctType(toAcct)}` : ""})`;
}

export function resolvePosEntryMode(pem: string): string {
  if (!pem || pem.length < 2) return pem;
  const panMode = pem.slice(0, 2);
  const pinCap = pem.length >= 3 ? pem[2] : "";

  let panDesc = "Mode lecture inconnu";
  switch (panMode) {
    case "01":
      panDesc = "Saisie Manuelle (VAD/Keyed)";
      break;
    case "02":
      panDesc = "Piste Magnétique (Magstripe)";
      break;
    case "05":
      panDesc = "Puce Contact EMV (ICC)";
      break;
    case "07":
      panDesc = "Sans Contact EMV (Contactless ICC)";
      break;
    case "91":
      panDesc = "Sans Contact Piste (Contactless Magstripe)";
      break;
    case "90":
      panDesc = "Piste Magnétique complète";
      break;
    case "00":
      panDesc = "Non spécifié";
      break;
  }

  let pinDesc = "";
  switch (pinCap) {
    case "1":
      pinDesc = "avec PIN sécurisé";
      break;
    case "2":
      pinDesc = "sans capacité PIN";
      break;
    case "8":
      pinDesc = "avec PIN bypass / signature";
      break;
    case "0":
      pinDesc = "capacité PIN non spécifiée";
      break;
  }

  return `${pem} - ${panDesc}${pinDesc ? ` (${pinDesc})` : ""}`;
}

export function sanitizeIsoRawInput(rawMessage: string): {
  clean: string;
  detectedFormat: "STANDARD" | "WIRESHARK_HEX_DUMP" | "LOG_EXTRACTED";
  isoHeader?: string;
  tpduHeader?: string;
  tcpLengthHeader?: string;
  sanitizationNotes: string[];
} {
  const sanitizationNotes: string[] = [];
  const lines = rawMessage
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // 1. Détection de dump hexadécimal type Wireshark / TCPDump :
  // Ex: 0000   02 00 72 38 20 01 08 e1 80 00 16 49 70 10 12 34   ..r8 ...Ip.4
  const wiresharkLineRegex = /^[0-9a-fA-F]{4,8}[:\s]+((?:[0-9a-fA-F]{2}[\s\-]+){2,16}[0-9a-fA-F]{2})/i;
  const wiresharkMatches = lines.filter((l) => wiresharkLineRegex.test(l));

  if (lines.length > 0 && wiresharkMatches.length >= Math.max(1, Math.floor(lines.length * 0.4))) {
    sanitizationNotes.push("Format Wireshark / Hex Dump détecté : octets extraits et convertis en trame continue.");
    const byteHexParts: string[] = [];
    for (const line of lines) {
      const match = line.match(wiresharkLineRegex);
      if (match) {
        byteHexParts.push(match[1].replace(/[\s\-]/g, ""));
      }
    }
    const cleanWireshark = byteHexParts.join("").toUpperCase();
    return {
      clean: cleanWireshark,
      detectedFormat: "WIRESHARK_HEX_DUMP",
      sanitizationNotes,
    };
  }

  // 2. Nettoyage de chaîne standard
  let candidate = rawMessage.replace(/[\r\n\t]/g, " ").trim();

  // Retirer les séparateurs type log comme "|" ou " - "
  if (candidate.includes("|")) {
    sanitizationNotes.push("Séparateurs '|' retirés de la trame.");
    candidate = candidate.replace(/\|/g, " ");
  }

  // Retirer les espaces internes (ex: "0200 7238 2001...")
  let noSpaces = candidate.replace(/\s+/g, "").toUpperCase();

  let tcpLengthHeader: string | undefined = undefined;
  let isoHeader: string | undefined = undefined;
  let tpduHeader: string | undefined = undefined;

  // CAS A : La trame commence déjà directement par un MTI valide + Bitmap primaire (16 hex)
  // Ex: 0200 7238200108E18000...
  const startsWithMtiAndBitmap = /^(0[1-8][0-3][0-9]|1[1-8][0-3][0-9])[0-9A-F]{16}/.test(noSpaces);

  if (!startsWithMtiAndBitmap) {
    // CAS B : Détection d'en-tête ISO (ex: ISO015000050 suivi de MTI + Bitmap)
    if (/^ISO[0-9A-Z]{9}(0[1-8][0-3][0-9]|1[1-8][0-3][0-9])[0-9A-F]{16}/.test(noSpaces)) {
      isoHeader = noSpaces.slice(0, 12);
      sanitizationNotes.push(`En-tête ISO détecté : ${isoHeader}.`);
      noSpaces = noSpaces.slice(12);
    }
    // CAS C : Détection TPDU (10 hex chars, souvent préfixe 60, 16 ou 00, suivi de MTI + Bitmap)
    else if (/^(60|16|00)[0-9A-F]{8}(0[1-8][0-3][0-9]|1[1-8][0-3][0-9])[0-9A-F]{16}/.test(noSpaces)) {
      tpduHeader = noSpaces.slice(0, 10);
      sanitizationNotes.push(`En-tête TPDU détecté : ${tpduHeader}.`);
      noSpaces = noSpaces.slice(10);
    }
    // CAS D : Détection TCP Length (2 ou 4 octets hex) + TPDU/ISO + MTI
    else if (/^[0-9A-F]{4}(60|16|00)[0-9A-F]{8}(0[1-8][0-3][0-9]|1[1-8][0-3][0-9])[0-9A-F]{16}/.test(noSpaces)) {
      tcpLengthHeader = noSpaces.slice(0, 4);
      tpduHeader = noSpaces.slice(4, 14);
      sanitizationNotes.push(`En-têtes détectés : TCP Length (${tcpLengthHeader}) + TPDU (${tpduHeader}).`);
      noSpaces = noSpaces.slice(14);
    }
    else if (/^[0-9A-F]{4}(0[1-8][0-3][0-9]|1[1-8][0-3][0-9])[0-9A-F]{16}/.test(noSpaces)) {
      tcpLengthHeader = noSpaces.slice(0, 4);
      sanitizationNotes.push(`En-tête TCP Length détecté : ${tcpLengthHeader}.`);
      noSpaces = noSpaces.slice(4);
    }
    // CAS E : Ligne de log avec préfixe quelconque (ex: "[INFO] 14:00:23 ISO: 0200...")
    else {
      const mtiMatch = noSpaces.match(/(0[1-8][0-3][0-9]|1[1-8][0-3][0-9])[0-9A-F]{16}/);
      if (mtiMatch && mtiMatch.index && mtiMatch.index > 0) {
        const prefix = noSpaces.slice(0, mtiMatch.index);
        sanitizationNotes.push(`Préfixe de journal/trace ignoré (${prefix.length} car.).`);
        noSpaces = noSpaces.slice(mtiMatch.index);
      }
    }
  }

  return {
    clean: noSpaces,
    detectedFormat: isoHeader || tpduHeader || tcpLengthHeader ? "LOG_EXTRACTED" : "STANDARD",
    isoHeader,
    tpduHeader,
    tcpLengthHeader,
    sanitizationNotes,
  };
}

export function parseIso8583Message(rawMessage: string): IsoParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fields: ParsedDataElement[] = [];

  const sanitized = sanitizeIsoRawInput(rawMessage);
  let clean = sanitized.clean;
  const { tpduHeader, isoHeader, tcpLengthHeader, detectedFormat, sanitizationNotes } = sanitized;

  if (clean.length < 20) {
    errors.push("Trame trop courte pour contenir un MTI (4 caractères) et un Bitmap (16 caractères hex).");
    return {
      rawInput: rawMessage,
      detectedFormat,
      tcpLengthHeader,
      isoHeader,
      tpduHeader,
      mti: "",
      bitmapHex: "",
      bitmapBinary: "",
      isSecondaryBitmap: false,
      totalFieldsCount: 0,
      fields: [],
      criticalInsights: {},
      errors,
      warnings,
      sanitizationNotes,
    };
  }

  // 1. Extraction MTI (4 caractères)
  const mti = clean.slice(0, 4);
  const mtiDef = MTI_CATALOG.find((m) => m.mti === mti);
  if (!mtiDef) {
    warnings.push(`MTI "${mti}" non répertorié dans les MTI standards ISO 8583 (vérifier si trame 1993 ou 2003).`);
  }

  let cursor = 4;

  // 2. Détection et extraction du Bitmap (Hexadécimal)
  // Les 16 premiers caractères hex = 64 bits du Primary Bitmap
  const primaryHex = clean.slice(cursor, cursor + 16);
  if (!/^[0-9A-F]{16}$/.test(primaryHex)) {
    errors.push(`Le Bitmap primaire n'est pas une chaîne hexadécimale valide de 16 caractères (obtenu: "${primaryHex}").`);
  }
  cursor += 16;

  // Convertir le premier nibble pour tester le bit 1
  const firstNibbleVal = parseInt(primaryHex[0] || "0", 16);
  const hasSecondary = (firstNibbleVal & 0x8) !== 0; // Bit 1 = 1

  let fullBitmapHex = primaryHex;
  if (hasSecondary) {
    const secondaryHex = clean.slice(cursor, cursor + 16);
    if (!/^[0-9A-F]{16}$/.test(secondaryHex)) {
      errors.push("Le Bit 1 est actif mais les 16 caractères suivants ne forment pas un Bitmap secondaire valide.");
    } else {
      fullBitmapHex += secondaryHex;
      cursor += 16;
    }
  }

  // Conversion Bitmap Hex -> Binaire
  let bitmapBinary = "";
  for (let i = 0; i < fullBitmapHex.length; i++) {
    bitmapBinary += parseInt(fullBitmapHex[i], 16).toString(2).padStart(4, "0");
  }

  // 3. Découpage champ par champ selon le Bitmap
  const criticalInsights: IsoParseResult["criticalInsights"] = {};

  for (let bitIdx = 1; bitIdx < bitmapBinary.length; bitIdx++) {
    const isPresent = bitmapBinary[bitIdx] === "1";
    if (!isPresent) continue;

    const deNumber = bitIdx + 1; // DE2, DE3, ...
    const spec = ISO_DE_DEFINITIONS[deNumber];

    if (!spec) {
      warnings.push(`Champ DE${deNumber} présent dans le Bitmap mais sans spécification standard. Arrêt du découpage.`);
      break;
    }

    const offsetStart = cursor;
    let length = 0;
    let lengthHeader = "";

    if (spec.lengthType === "FIXED") {
      length = spec.maxLength;
    } else if (spec.lengthType === "LLVAR") {
      if (cursor + 2 > clean.length) {
        errors.push(`Trame tronquée lors de la lecture de l'en-tête LLVAR pour DE${deNumber}.`);
        break;
      }
      lengthHeader = clean.slice(cursor, cursor + 2);
      length = parseInt(lengthHeader, 10);
      if (isNaN(length) || length < 0) {
        errors.push(`En-tête de longueur invalide "${lengthHeader}" pour le champ LLVAR DE${deNumber} à l'offset ${cursor}.`);
        break;
      }
      cursor += 2;
    } else if (spec.lengthType === "LLLVAR") {
      if (cursor + 3 > clean.length) {
        errors.push(`Trame tronquée lors de la lecture de l'en-tête LLLVAR pour DE${deNumber}.`);
        break;
      }
      lengthHeader = clean.slice(cursor, cursor + 3);
      length = parseInt(lengthHeader, 10);
      if (isNaN(length) || length < 0) {
        errors.push(`En-tête de longueur invalide "${lengthHeader}" pour le champ LLLVAR DE${deNumber} à l'offset ${cursor}.`);
        break;
      }
      cursor += 3;
    }

    // Gestion de la troncature éventuelle
    if (cursor + length > clean.length) {
      const remainingLength = clean.length - cursor;
      warnings.push(`Trame incomplète : DE${deNumber} (${spec.name}) nécessite ${length} car. mais seuls ${remainingLength} sont disponibles.`);
      const rawValue = clean.slice(cursor);
      cursor = clean.length;
      fields.push({
        de: deNumber,
        spec,
        rawValue,
        displayValue: rawValue,
        length: rawValue.length,
        lengthHeader,
        isMasked: false,
        offsetStart,
        offsetEnd: cursor,
        error: `Champ tronqué (${remainingLength}/${length} car.)`,
      });
      break;
    }

    const rawValue = clean.slice(cursor, cursor + length);
    cursor += length;
    const offsetEnd = cursor;

    // Masquage données sensibles PCI-DSS
    let displayValue = rawValue;
    let isMasked = false;
    let emvTags: DecodedEmvTag[] | undefined = undefined;
    let interpretation: string | undefined = undefined;

    if (deNumber === 2) {
      displayValue = maskPAN(rawValue);
      isMasked = true;
      criticalInsights.pan = displayValue;
      interpretation = `PAN Masqué PCI-DSS (${rawValue.length} chiffres, BIN: ${rawValue.slice(0, 6)})`;
    } else if (deNumber === 14) {
      displayValue = "**/**";
      isMasked = true;
      criticalInsights.expirationDate = displayValue;
      interpretation = "Date d'expiration masquée PCI-DSS";
    } else if (deNumber === 35 || deNumber === 45) {
      const panPart = rawValue.slice(0, Math.min(16, rawValue.length));
      displayValue = maskPAN(panPart) + "=**************** (PISTE MASQUÉE PCI-DSS)";
      isMasked = true;
      interpretation = `Piste ${deNumber === 35 ? "2" : "1"} masquée PCI-DSS`;
    } else if (deNumber === 52) {
      displayValue = maskPinBlock(rawValue);
      isMasked = true;
      criticalInsights.hasPinBlock = true;
      interpretation = "PIN Block chiffré (DES/3DES - 16 hex)";
    } else if (deNumber === 55) {
      // Décodage automatique EMV TLV
      try {
        const emvRes = parseEmvTlv(rawValue);
        if (emvRes.tags.length > 0) {
          emvTags = emvRes.tags;
          criticalInsights.emvParsed = emvRes;
          interpretation = `${emvRes.tags.length} Tags EMV décodés (${emvRes.tags.map((t) => t.tag).join(", ")})`;
        }
      } catch {
        // En cas d'erreur de décodage EMV local, garder la valeur brute
      }
    }

    // Interprétations enrichies des insights métiers
    if (deNumber === 3) {
      criticalInsights.procCode = rawValue;
      criticalInsights.procCodeDescription = resolveProcCode(rawValue);
      interpretation = criticalInsights.procCodeDescription;
    }
    if (deNumber === 4) {
      const amtNum = (parseInt(rawValue, 10) / 100).toFixed(2);
      criticalInsights.amount = amtNum;
      interpretation = `Montant unitaire : ${amtNum}`;
    }
    if (deNumber === 7) criticalInsights.transmissionDateTime = rawValue;
    if (deNumber === 11) criticalInsights.stan = rawValue;
    if (deNumber === 12) {
      criticalInsights.localTime = rawValue.replace(/(\d{2})(\d{2})(\d{2})/, "$1:$2:$3");
      interpretation = `Heure locale: ${criticalInsights.localTime}`;
    }
    if (deNumber === 13) {
      criticalInsights.localDate = rawValue.replace(/(\d{2})(\d{2})/, "$1/$2");
      interpretation = `Date locale: ${criticalInsights.localDate}`;
    }
    if (deNumber === 18) {
      criticalInsights.mcc = rawValue;
      interpretation = rawValue === "6011" ? "GAB / Distributeur Automatique (ATM)" : `MCC: ${rawValue}`;
    }
    if (deNumber === 22) {
      criticalInsights.posEntryMode = rawValue;
      criticalInsights.posEntryModeDescription = resolvePosEntryMode(rawValue);
      interpretation = criticalInsights.posEntryModeDescription;
    }
    if (deNumber === 23) criticalInsights.csn = rawValue;
    if (deNumber === 25) {
      criticalInsights.posConditionCode = rawValue;
      interpretation = rawValue === "00" ? "00 - Transaction Normale" : rawValue === "08" ? "08 - VAD / Mail-Phone" : `Condition ${rawValue}`;
    }
    if (deNumber === 37) criticalInsights.rrn = rawValue;
    if (deNumber === 38) criticalInsights.authCode = rawValue;
    if (deNumber === 39) {
      criticalInsights.responseCode = rawValue;
      const rcItem = DE39_CATALOG.find((item) => item.code === rawValue);
      if (rcItem) {
        criticalInsights.responseDescription = `${rcItem.code} - ${rcItem.label}`;
        criticalInsights.responseCategory = rcItem.category;
        criticalInsights.diagnosticAdvice = rcItem.recommendedAction;
        interpretation = `${rcItem.label} : ${rcItem.meaning}`;
      } else {
        interpretation = rawValue === "00" ? "Approuvé / Honoré" : `Code rejet : ${rawValue}`;
      }
    }
    if (deNumber === 41) criticalInsights.tid = rawValue;
    if (deNumber === 42) criticalInsights.mid = rawValue;
    if (deNumber === 43) criticalInsights.acceptorName = rawValue.trim();
    if (deNumber === 49) {
      criticalInsights.currency = ISO_CURRENCIES[rawValue] || rawValue;
      interpretation = criticalInsights.currency;
    }
    if (deNumber === 64 || deNumber === 128) criticalInsights.hasMac = true;
    if (deNumber === 70) {
      criticalInsights.networkCode = rawValue;
      interpretation =
        rawValue === "001" || rawValue === "301"
          ? "Echo Test Réseau"
          : rawValue === "101"
          ? "Sign-On Réseau"
          : rawValue === "102"
          ? "Sign-Off Réseau"
          : `Code Réseau: ${rawValue}`;
    }
    if (deNumber === 90) {
      criticalInsights.originalData = rawValue;
      if (rawValue.length >= 42) {
        interpretation = `Origine: MTI=${rawValue.slice(0, 4)} STAN=${rawValue.slice(4, 10)} Date=${rawValue.slice(10, 20)}`;
      }
    }
    if (deNumber === 102) criticalInsights.account1 = rawValue;
    if (deNumber === 103) criticalInsights.account2 = rawValue;

    fields.push({
      de: deNumber,
      spec,
      rawValue,
      displayValue,
      length,
      lengthHeader,
      isMasked,
      offsetStart,
      offsetEnd,
      interpretation,
      emvTags,
    });
  }

  const remainingUnparsed = cursor < clean.length ? clean.slice(cursor) : undefined;
  if (remainingUnparsed) {
    warnings.push(`${remainingUnparsed.length} caractères résiduels n'ont pas pu être associés aux champs du Bitmap.`);
  }

  return {
    rawInput: rawMessage,
    detectedFormat,
    tcpLengthHeader,
    isoHeader,
    tpduHeader,
    mti,
    mtiDef,
    bitmapHex: fullBitmapHex,
    bitmapBinary,
    isSecondaryBitmap: hasSecondary,
    totalFieldsCount: fields.length,
    fields,
    remainingUnparsed,
    criticalInsights,
    errors,
    warnings,
    sanitizationNotes,
  };
}
