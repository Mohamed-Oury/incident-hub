import { ISO_DE_DEFINITIONS, DataElementSpec } from "./iso-bitmap-decoder";
import { MTI_CATALOG, MTIDefinition } from "./iso-mti-reference";
import { maskPAN, maskPinBlock } from "@/modules/security/masking";

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
}

export interface IsoParseResult {
  rawInput: string;
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
    amount?: string;
    stan?: string;
    rrn?: string;
    authCode?: string;
    responseCode?: string;
    posEntryMode?: string;
    tid?: string;
    mid?: string;
  };
  errors: string[];
  warnings: string[];
}

export function parseIso8583Message(rawMessage: string): IsoParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fields: ParsedDataElement[] = [];

  // Nettoyage de la trame (retrait des espaces, retours à la ligne, tabulations)
  let clean = rawMessage.replace(/[\s\r\n\t]/g, "").toUpperCase();

  let tpduHeader: string | undefined = undefined;

  // Détection d'un header TPDU (généralement 10 caractères hex ou 5 octets ex: 6000010000)
  // Si le message commence par un header de 10 carats et que les carats 10..14 ressemblent à un MTI (ex: 0100, 0200, 0400, 0800)
  if (clean.length > 14 && /^(60|16|00)[0-9A-F]{8}(0[1248][0-3][0-4])/.test(clean)) {
    tpduHeader = clean.slice(0, 10);
    clean = clean.slice(10);
  }

  if (clean.length < 20) {
    errors.push("Trame trop courte pour contenir un MTI (4 caractères) et un Bitmap (16 caractères hex).");
    return {
      rawInput: rawMessage,
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
    };
  }

  // 1. Extraction MTI (4 caractères)
  const mti = clean.slice(0, 4);
  const mtiDef = MTI_CATALOG.find((m) => m.mti === mti);
  if (!mtiDef) {
    warnings.push(`MTI "${mti}" non répertorié dans les MTI standards.`);
  }

  let cursor = 4;

  // 2. Détection et extraction du Bitmap (Hexadécimal)
  // Les 16 premiers caractères hex = 64 bits du Primary Bitmap
  const primaryHex = clean.slice(cursor, cursor + 16);
  if (!/^[0-9A-F]{16}$/.test(primaryHex)) {
    errors.push("Le Bitmap primaire n'est pas une chaîne hexadécimale valide de 16 caractères.");
  }
  cursor += 16;

  // Convertir le premier nibble pour tester le bit 1
  const firstNibbleVal = parseInt(primaryHex[0], 16);
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
      warnings.push(`Champ DE${deNumber} présent dans le Bitmap mais sans spécification de longueur standard. Arrêt du découpage séquentiel.`);
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
      if (isNaN(length)) {
        errors.push(`En-tête de longueur invalide "${lengthHeader}" pour le champ LLVAR DE${deNumber}.`);
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
      if (isNaN(length)) {
        errors.push(`En-tête de longueur invalide "${lengthHeader}" pour le champ LLLVAR DE${deNumber}.`);
        break;
      }
      cursor += 3;
    }

    if (cursor + length > clean.length) {
      warnings.push(`Trame incomplète : DE${deNumber} nécessite ${length} caractères mais seuls ${clean.length - cursor} restants.`);
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
        error: "Champ tronqué",
      });
      break;
    }

    const rawValue = clean.slice(cursor, cursor + length);
    cursor += length;
    const offsetEnd = cursor;

    // Masquage données sensibles PCI-DSS
    let displayValue = rawValue;
    let isMasked = false;

    if (deNumber === 2) {
      displayValue = maskPAN(rawValue);
      isMasked = true;
      criticalInsights.pan = displayValue;
    } else if (deNumber === 35) {
      displayValue = maskPAN(rawValue.slice(0, 16)) + "=****************";
      isMasked = true;
    } else if (deNumber === 52) {
      displayValue = maskPinBlock(rawValue);
      isMasked = true;
    } else {
      displayValue = rawValue;
    }

    // Récupération des insights critiques pour l'exploitant
    if (deNumber === 3) criticalInsights.procCode = rawValue;
    if (deNumber === 4) {
      const amtNum = (parseInt(rawValue, 10) / 100).toFixed(2);
      criticalInsights.amount = amtNum;
    }
    if (deNumber === 11) criticalInsights.stan = rawValue;
    if (deNumber === 22) criticalInsights.posEntryMode = rawValue;
    if (deNumber === 37) criticalInsights.rrn = rawValue;
    if (deNumber === 38) criticalInsights.authCode = rawValue;
    if (deNumber === 39) criticalInsights.responseCode = rawValue;
    if (deNumber === 41) criticalInsights.tid = rawValue;
    if (deNumber === 42) criticalInsights.mid = rawValue;

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
    });
  }

  const remainingUnparsed = cursor < clean.length ? clean.slice(cursor) : undefined;
  if (remainingUnparsed) {
    warnings.push(`${remainingUnparsed.length} caractères résiduels n'ont pas pu être associés aux champs du Bitmap.`);
  }

  return {
    rawInput: rawMessage,
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
  };
}
