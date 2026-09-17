import { EMV_TAG_DICTIONARY, EmvTagDefinition, TVR_BITS_SPEC, TvrBitExplanation } from "./emv-tag-definitions";
import { maskPAN } from "@/modules/security/masking";

export interface DecodedEmvTag {
  tag: string;
  name: string;
  length: number;
  rawHex: string;
  displayValue: string;
  spec?: EmvTagDefinition;
  isConstructed: boolean;
  tvrAnalysis?: Array<{
    byte: number;
    bit: number;
    label: string;
    meaning: string;
    severity: "CRITICAL" | "WARNING" | "INFO";
    isSet: boolean;
  }>;
}

export interface EmvDecodeResult {
  rawInput: string;
  tagsCount: number;
  tags: DecodedEmvTag[];
  tvrSummary?: {
    rawHex: string;
    criticalFlags: string[];
    warningFlags: string[];
    infoFlags: string[];
  };
  errors: string[];
  warnings: string[];
}

export function decodeTvrHex(tvrHex: string) {
  const cleanTvr = tvrHex.replace(/\s/g, "").toUpperCase().slice(0, 10).padEnd(10, "0");
  const bytes: number[] = [];
  for (let i = 0; i < cleanTvr.length; i += 2) {
    bytes.push(parseInt(cleanTvr.slice(i, i + 2), 16));
  }

  const results: Array<TvrBitExplanation & { isSet: boolean }> = [];
  const criticalFlags: string[] = [];
  const warningFlags: string[] = [];
  const infoFlags: string[] = [];

  for (const item of TVR_BITS_SPEC) {
    const byteVal = bytes[item.byte - 1] || 0;
    // bit 8 est le plus significatif (0x80)
    const bitMask = 1 << (item.bit - 1);
    const isSet = (byteVal & bitMask) !== 0;

    results.push({
      ...item,
      isSet,
    });

    if (isSet) {
      if (item.severity === "CRITICAL") criticalFlags.push(item.meaning);
      else if (item.severity === "WARNING") warningFlags.push(item.meaning);
      else infoFlags.push(item.meaning);
    }
  }

  return {
    rawHex: cleanTvr,
    results,
    criticalFlags,
    warningFlags,
    infoFlags,
  };
}

export function parseEmvTlv(inputHex: string): EmvDecodeResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const tags: DecodedEmvTag[] = [];

  let clean = inputHex.replace(/[\s\r\n\t:]/g, "").toUpperCase();

  let index = 0;
  let tvrSummary: EmvDecodeResult["tvrSummary"] = undefined;

  while (index < clean.length) {
    // 1. Détection du Tag
    if (index + 2 > clean.length) break;

    let tag = clean.slice(index, index + 2);
    index += 2;

    const firstByte = parseInt(tag, 16);
    // Si les 5 bits de poids faible sont à 1 (0x1F), le tag fait 2 octets (ex: 9F02, 9F26)
    if ((firstByte & 0x1F) === 0x1F) {
      if (index + 2 > clean.length) {
        errors.push(`Tag à 2 octets tronqué à la position ${index}.`);
        break;
      }
      tag += clean.slice(index, index + 2);
      index += 2;
    }

    // 2. Détection de la Longueur (L)
    if (index + 2 > clean.length) {
      errors.push(`Longueur manquante pour le tag ${tag}.`);
      break;
    }

    const firstLenByte = parseInt(clean.slice(index, index + 2), 16);
    index += 2;

    let lengthInBytes = firstLenByte;

    if (firstLenByte > 0x80) {
      // Longueur encodée sur plusieurs octets
      const numLengthBytes = firstLenByte & 0x7F;
      if (index + numLengthBytes * 2 > clean.length) {
        errors.push(`Octets de longueur étendus incomplets pour le tag ${tag}.`);
        break;
      }
      lengthInBytes = parseInt(clean.slice(index, index + numLengthBytes * 2), 16);
      index += numLengthBytes * 2;
    }

    // Chaque octet correspond à 2 caractères hexadécimaux
    const lengthInHexChars = lengthInBytes * 2;

    if (index + lengthInHexChars > clean.length) {
      warnings.push(`Valeur du Tag ${tag} tronquée : ${lengthInBytes} octets attendus, mais la fin de chaîne a été atteinte.`);
      const rawHex = clean.slice(index);
      index = clean.length;
      tags.push({
        tag,
        name: EMV_TAG_DICTIONARY[tag]?.name || `Tag EMV ${tag}`,
        length: Math.floor(rawHex.length / 2),
        rawHex,
        displayValue: rawHex,
        spec: EMV_TAG_DICTIONARY[tag],
        isConstructed: (firstByte & 0x20) !== 0,
      });
      break;
    }

    const rawHex = clean.slice(index, index + lengthInHexChars);
    index += lengthInHexChars;

    const spec = EMV_TAG_DICTIONARY[tag];
    let displayValue = rawHex;

    // Masquage données sensibles de carte
    if (tag === "5A") {
      displayValue = maskPAN(rawHex);
    } else if (tag === "57") {
      displayValue = maskPAN(rawHex.slice(0, 16)) + "=D****************";
    }

    // Décodage spécifique TVR (Tag 95)
    let tvrAnalysis = undefined;
    if (tag === "95") {
      const tvrDecoded = decodeTvrHex(rawHex);
      tvrAnalysis = tvrDecoded.results;
      tvrSummary = {
        rawHex,
        criticalFlags: tvrDecoded.criticalFlags,
        warningFlags: tvrDecoded.warningFlags,
        infoFlags: tvrDecoded.infoFlags,
      };
    }

    tags.push({
      tag,
      name: spec ? spec.name : `Tag Inconnu / Propriétaire (${tag})`,
      length: lengthInBytes,
      rawHex,
      displayValue,
      spec,
      isConstructed: (firstByte & 0x20) !== 0,
      tvrAnalysis,
    });
  }

  return {
    rawInput: inputHex,
    tagsCount: tags.length,
    tags,
    tvrSummary,
    errors,
    warnings,
  };
}
