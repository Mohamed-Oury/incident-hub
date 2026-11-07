import {
  EMV_TAG_DICTIONARY,
  EmvTagDefinition,
  TVR_BITS_SPEC,
  TvrBitExplanation,
  TSI_BITS_SPEC,
  TsiBitExplanation,
  AIP_BITS_SPEC,
  AipBitExplanation,
  CVM_METHODS_DICT,
  CVM_CONDITIONS_DICT,
  CVM_RESULTS_DICT,
  CID_DICT,
} from "./emv-tag-definitions";
import { maskPAN } from "../../security/masking";

export interface DecodedEmvTag {
  tag: string;
  name: string;
  length: number;
  rawHex: string;
  displayValue: string;
  formattedValue?: string;
  spec?: EmvTagDefinition;
  isConstructed: boolean;
  children?: DecodedEmvTag[];
  tvrAnalysis?: Array<{
    byte: number;
    bit: number;
    label: string;
    meaning: string;
    severity: "CRITICAL" | "WARNING" | "INFO";
    isSet: boolean;
  }>;
  tsiAnalysis?: Array<{
    byte: number;
    bit: number;
    label: string;
    meaning: string;
    isSet: boolean;
  }>;
  aipAnalysis?: Array<{
    byte: number;
    bit: number;
    label: string;
    meaning: string;
    isSet: boolean;
  }>;
  cvmAnalysis?: {
    methodHex: string;
    methodDescription: string;
    conditionHex: string;
    conditionDescription: string;
    resultHex: string;
    resultDescription: string;
    status: "SUCCESS" | "FAILED" | "UNKNOWN";
  };
  cidAnalysis?: {
    type: "ARQC" | "TC" | "AAC" | "AAR";
    label: string;
    meaning: string;
    severity: "INFO" | "WARNING" | "CRITICAL";
    adviceRequired: boolean;
  };
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
  tsiSummary?: {
    rawHex: string;
    executedSteps: string[];
    notExecutedSteps: string[];
  };
  aipSummary?: {
    rawHex: string;
    supportedFeatures: string[];
  };
  cvmSummary?: {
    rawHex: string;
    method: string;
    condition: string;
    status: "SUCCESS" | "FAILED" | "UNKNOWN";
    summary: string;
  };
  cidSummary?: {
    rawHex: string;
    type: "ARQC" | "TC" | "AAC" | "AAR";
    label: string;
    meaning: string;
    severity: "INFO" | "WARNING" | "CRITICAL";
  };
  securityAudit: {
    cryptogramType: "ARQC" | "TC" | "AAC" | "AAR" | "INDÉTERMINÉ";
    atcDecimal?: number;
    unpredictableNumberHex?: string;
    amountFormatted?: string;
    currencyLabel?: string;
    transactionTypeLabel?: string;
    riskVerdict: "CONFORME_EN_LIGNE" | "ACCORD_HORS_LIGNE" | "REFUS_LOCAL_PUCE" | "ALERTE_SECURITE";
    riskVerdictLabel: string;
    riskLevel: "BAS" | "MOYEN" | "ELEVE" | "CRITIQUE";
    forensicReasons: string[];
    recommendedActions: string[];
  };
  errors: string[];
  warnings: string[];
}

/**
 * Décode l'octet CID (Cryptogram Information Data - Tag 9F27)
 */
export function decodeCidHex(cidHex: string) {
  const clean = cidHex.replace(/\s/g, "").toUpperCase().slice(0, 2).padEnd(2, "0");
  const byteVal = parseInt(clean, 16);
  // Bits 8 et 7 définissent le type de cryptogramme
  const cryptoBits = (byteVal & 0xC0).toString(16).toUpperCase().padStart(2, "0");
  const adviceRequired = (byteVal & 0x08) !== 0;

  const spec = CID_DICT[cryptoBits] || {
    type: "ARQC",
    label: "Cryptogramme Inconnu",
    meaning: `Type de cryptogramme binaire non répertorié (0x${cryptoBits}).`,
    severity: "WARNING" as const,
  };

  return {
    rawHex: clean,
    type: spec.type,
    label: spec.label,
    meaning: spec.meaning,
    severity: spec.severity,
    adviceRequired,
  };
}

/**
 * Décode le TVR (Terminal Verification Results - Tag 95, 5 octets)
 */
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

/**
 * Décode le TSI (Transaction Status Information - Tag 9B, 2 octets)
 */
export function decodeTsiHex(tsiHex: string) {
  const cleanTsi = tsiHex.replace(/\s/g, "").toUpperCase().slice(0, 4).padEnd(4, "0");
  const bytes: number[] = [];
  for (let i = 0; i < cleanTsi.length; i += 2) {
    bytes.push(parseInt(cleanTsi.slice(i, i + 2), 16));
  }

  const results: Array<TsiBitExplanation & { isSet: boolean }> = [];
  const executedSteps: string[] = [];
  const notExecutedSteps: string[] = [];

  for (const item of TSI_BITS_SPEC) {
    const byteVal = bytes[item.byte - 1] || 0;
    const bitMask = 1 << (item.bit - 1);
    const isSet = (byteVal & bitMask) !== 0;

    results.push({
      ...item,
      isSet,
    });

    if (isSet) {
      executedSteps.push(item.meaning);
    } else {
      notExecutedSteps.push(item.meaning);
    }
  }

  return {
    rawHex: cleanTsi,
    results,
    executedSteps,
    notExecutedSteps,
  };
}

/**
 * Décode l'AIP (Application Interchange Profile - Tag 82, 2 octets)
 */
export function decodeAipHex(aipHex: string) {
  const cleanAip = aipHex.replace(/\s/g, "").toUpperCase().slice(0, 4).padEnd(4, "0");
  const bytes: number[] = [];
  for (let i = 0; i < cleanAip.length; i += 2) {
    bytes.push(parseInt(cleanAip.slice(i, i + 2), 16));
  }

  const results: Array<AipBitExplanation & { isSet: boolean }> = [];
  const supportedFeatures: string[] = [];

  for (const item of AIP_BITS_SPEC) {
    const byteVal = bytes[item.byte - 1] || 0;
    const bitMask = 1 << (item.bit - 1);
    const isSet = (byteVal & bitMask) !== 0;

    results.push({
      ...item,
      isSet,
    });

    if (isSet) {
      supportedFeatures.push(item.meaning);
    }
  }

  return {
    rawHex: cleanAip,
    results,
    supportedFeatures,
  };
}

/**
 * Décode le résultat CVM (Cardholder Verification Method Results - Tag 9F34, 3 octets)
 */
export function decodeCvmResultsHex(cvmHex: string) {
  const cleanCvm = cvmHex.replace(/\s/g, "").toUpperCase().slice(0, 6).padEnd(6, "0");
  const methodHex = cleanCvm.slice(0, 2);
  const conditionHex = cleanCvm.slice(2, 4);
  const resultHex = cleanCvm.slice(4, 6);

  const methodDescription = CVM_METHODS_DICT[methodHex] || `Méthode CVM inconnue (${methodHex})`;
  const conditionDescription = CVM_CONDITIONS_DICT[conditionHex] || `Condition CVM inconnue (${conditionHex})`;
  const resLookup = CVM_RESULTS_DICT[resultHex] || {
    label: `Résultat inconnu (${resultHex})`,
    status: "UNKNOWN" as const,
  };

  return {
    methodHex,
    methodDescription,
    conditionHex,
    conditionDescription,
    resultHex,
    resultDescription: resLookup.label,
    status: resLookup.status,
  };
}

/**
 * Décode la devise ISO 4217 (Tag 5F2A)
 */
export function decodeEmvCurrency(currHex: string): string {
  const clean = currHex.replace(/\s/g, "").toUpperCase();
  const map: Record<string, string> = {
    "0952": "XOF (Franc CFA UEMOA)",
    "0950": "XAF (Franc CFA CEMAC)",
    "0978": "EUR (Euro €)",
    "0840": "USD (Dollar US $)",
    "0504": "MAD (Dirham Marocain)",
    "0826": "GBP (Livre Sterling £)",
    "0756": "CHF (Franc Suisse)",
  };
  return map[clean] || `Devise ISO ${clean}`;
}

/**
 * Décode le type de transaction EMV (Tag 9C)
 */
export function decodeEmvTransactionType(typeHex: string): string {
  const clean = typeHex.replace(/\s/g, "").toUpperCase();
  const map: Record<string, string> = {
    "00": "00 - Achat / Débit Marchand",
    "01": "01 - Retrait Espèces (DAB / GAB)",
    "09": "09 - Achat avec Rendu d'Espèces (Cashback)",
    "20": "20 - Remboursement / Crédit Porteur",
    "31": "31 - Consultation de Solde Compte",
  };
  return map[clean] || `Type ${clean}`;
}

/**
 * Moteur principal de décodage des paquets TLV EMV (Champ ISO DE55)
 */
export function parseEmvTlv(inputHex: string): EmvDecodeResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const tags: DecodedEmvTag[] = [];

  let clean = inputHex.replace(/[\s\r\n\t:]/g, "").toUpperCase();

  let index = 0;
  let tvrSummary: EmvDecodeResult["tvrSummary"] = undefined;
  let tsiSummary: EmvDecodeResult["tsiSummary"] = undefined;
  let aipSummary: EmvDecodeResult["aipSummary"] = undefined;
  let cvmSummary: EmvDecodeResult["cvmSummary"] = undefined;
  let cidSummary: EmvDecodeResult["cidSummary"] = undefined;

  let atcDecimal: number | undefined = undefined;
  let unpredictableNumberHex: string | undefined = undefined;
  let amountFormatted: string | undefined = undefined;
  let currencyLabel: string | undefined = undefined;
  let transactionTypeLabel: string | undefined = undefined;

  while (index < clean.length) {
    // 1. Détection du Tag
    if (index + 2 > clean.length) break;

    let tag = clean.slice(index, index + 2);
    index += 2;

    const firstByte = parseInt(tag, 16);
    // Si les 5 bits de poids faible sont à 1 (0x1F), le tag fait au moins 2 octets
    if ((firstByte & 0x1F) === 0x1F) {
      if (index + 2 > clean.length) {
        errors.push(`Tag à plusieurs octets tronqué à la position ${index}.`);
        break;
      }
      tag += clean.slice(index, index + 2);
      index += 2;

      // Si le bit de poids fort du 2ème octet est à 1, le tag continue sur un 3ème octet
      const secondByte = parseInt(tag.slice(2, 4), 16);
      if ((secondByte & 0x80) !== 0 && index + 2 <= clean.length) {
        tag += clean.slice(index, index + 2);
        index += 2;
      }
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
    let formattedValue: string | undefined = undefined;
    const isConstructed = (firstByte & 0x20) !== 0;

    // Décodage récursif des templates construits (77, 70, 6F, A5, BF0C)
    let children: DecodedEmvTag[] | undefined = undefined;
    if (isConstructed && rawHex.length >= 4) {
      try {
        const nestedResult = parseEmvTlv(rawHex);
        if (nestedResult.tags.length > 0) {
          children = nestedResult.tags;
        }
      } catch {
        // En cas d'échec du sous-découpage, conserver la valeur brute
      }
    }

    // Masquage et formatage selon le Tag
    if (tag === "5A") {
      displayValue = maskPAN(rawHex);
      formattedValue = displayValue;
    } else if (tag === "57") {
      const splitD = rawHex.toUpperCase().split("D");
      const panPart = splitD[0] || "";
      displayValue = maskPAN(panPart) + "=D****************";
      formattedValue = displayValue;
    } else if (tag === "50" || tag === "5F20" || tag === "5F50" || tag === "8A" || tag === "9F12" || tag === "9F1E") {
      // Décodage ASCII
      try {
        let asciiStr = "";
        for (let c = 0; c < rawHex.length; c += 2) {
          const code = parseInt(rawHex.slice(c, c + 2), 16);
          if (code >= 32 && code <= 126) asciiStr += String.fromCharCode(code);
        }
        if (asciiStr.trim()) {
          formattedValue = `"${asciiStr.trim()}"`;
        }
      } catch {
        // fallback
      }
    } else if (tag === "9F02" || tag === "9F03") {
      // Montant numérique
      const amtNum = (parseInt(rawHex, 10) / 100).toFixed(2);
      formattedValue = `${amtNum}`;
      if (tag === "9F02") amountFormatted = amtNum;
    } else if (tag === "5F2A") {
      formattedValue = decodeEmvCurrency(rawHex);
      currencyLabel = formattedValue;
    } else if (tag === "9C") {
      formattedValue = decodeEmvTransactionType(rawHex);
      transactionTypeLabel = formattedValue;
    } else if (tag === "9A" || tag === "5F24" || tag === "5F25") {
      // Date YYMMDD
      if (rawHex.length === 6) {
        formattedValue = `20${rawHex.slice(0, 2)}-${rawHex.slice(2, 4)}-${rawHex.slice(4, 6)}`;
      }
    } else if (tag === "9F36") {
      // ATC
      atcDecimal = parseInt(rawHex, 16);
      formattedValue = `ATC #${atcDecimal} (0x${rawHex})`;
    } else if (tag === "9F37") {
      unpredictableNumberHex = rawHex;
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
      formattedValue = `${tvrDecoded.criticalFlags.length} alerte(s) critique(s), ${tvrDecoded.warningFlags.length} avertissement(s)`;
    }

    // Décodage spécifique TSI (Tag 9B)
    let tsiAnalysis = undefined;
    if (tag === "9B") {
      const tsiDecoded = decodeTsiHex(rawHex);
      tsiAnalysis = tsiDecoded.results;
      tsiSummary = {
        rawHex,
        executedSteps: tsiDecoded.executedSteps,
        notExecutedSteps: tsiDecoded.notExecutedSteps,
      };
      formattedValue = `${tsiDecoded.executedSteps.length} étape(s) EMV validée(s)`;
    }

    // Décodage spécifique AIP (Tag 82)
    let aipAnalysis = undefined;
    if (tag === "82") {
      const aipDecoded = decodeAipHex(rawHex);
      aipAnalysis = aipDecoded.results;
      aipSummary = {
        rawHex,
        supportedFeatures: aipDecoded.supportedFeatures,
      };
      formattedValue = `${aipDecoded.supportedFeatures.length} mécanisme(s) de sécurité supporté(s)`;
    }

    // Décodage spécifique CVM Results (Tag 9F34)
    let cvmAnalysis = undefined;
    if (tag === "9F34") {
      cvmAnalysis = decodeCvmResultsHex(rawHex);
      cvmSummary = {
        rawHex,
        method: cvmAnalysis.methodDescription,
        condition: cvmAnalysis.conditionDescription,
        status: cvmAnalysis.status,
        summary: `${cvmAnalysis.methodDescription} ➜ ${cvmAnalysis.resultDescription}`,
      };
      formattedValue = cvmSummary.summary;
    }

    // Décodage spécifique CID (Tag 9F27)
    let cidAnalysis = undefined;
    if (tag === "9F27") {
      cidAnalysis = decodeCidHex(rawHex);
      cidSummary = {
        rawHex,
        type: cidAnalysis.type,
        label: cidAnalysis.label,
        meaning: cidAnalysis.meaning,
        severity: cidAnalysis.severity,
      };
      formattedValue = `${cidAnalysis.label} (${cidAnalysis.type})`;
    }

    tags.push({
      tag,
      name: spec ? spec.name : `Tag Inconnu / Propriétaire (${tag})`,
      length: lengthInBytes,
      rawHex,
      displayValue,
      formattedValue,
      spec,
      isConstructed,
      children,
      tvrAnalysis,
      tsiAnalysis,
      aipAnalysis,
      cvmAnalysis,
      cidAnalysis,
    });
  }

  // Audit de sécurité global EMV & Synthèse de Risque
  const forensicReasons: string[] = [];
  const recommendedActions: string[] = [];

  const cryptogramType = cidSummary?.type || "INDÉTERMINÉ";

  if (cryptogramType === "ARQC") {
    forensicReasons.push("La puce demande impérativement une autorisation en ligne (ARQC).");
  } else if (cryptogramType === "TC") {
    forensicReasons.push("La puce a validé et autorisé la transaction en mode hors-ligne (TC).");
  } else if (cryptogramType === "AAC") {
    forensicReasons.push("La puce a refusé unilatéralement la transaction localement (AAC).");
  }

  if (tvrSummary) {
    if (tvrSummary.criticalFlags.length > 0) {
      forensicReasons.push(...tvrSummary.criticalFlags);
    }
    if (tvrSummary.warningFlags.length > 0) {
      forensicReasons.push(...tvrSummary.warningFlags);
    }
  }

  // Détection du dépassement PIN
  const hasPinLimit = tvrSummary?.criticalFlags.some((f) => f.includes("PIN") || f.includes("essais"));
  if (hasPinLimit) {
    recommendedActions.push("La carte a atteint le seuil d'essais PIN. Nécessite un déblocage par script émetteur (Tag 72) ou en agence.");
  }

  // Détection anomalie aléatoire (attaque par rejeu)
  if (unpredictableNumberHex === "00000000" || unpredictableNumberHex === "FFFFFFFF") {
    forensicReasons.push("Nombre aléatoire suspect ou fixe détecté (Risque critique d'attaque par rejeu).");
    recommendedActions.push("Vérifier le générateur de nombres aléatoires (TRNG) du lecteur de carte ou du PIN Pad.");
  }

  // Synthèse du niveau de risque
  let riskVerdict: EmvDecodeResult["securityAudit"]["riskVerdict"] = "CONFORME_EN_LIGNE";
  let riskVerdictLabel = "Demande d'autorisation en ligne nominale (ARQC)";
  let riskLevel: EmvDecodeResult["securityAudit"]["riskLevel"] = "BAS";

  if (cryptogramType === "AAC" || (tvrSummary && tvrSummary.criticalFlags.length > 0)) {
    riskVerdict = "REFUS_LOCAL_PUCE";
    riskVerdictLabel = "Transaction refusée par les contrôles de sécurité puce / terminal";
    riskLevel = "CRITIQUE";
    recommendedActions.push("Refuser la transaction et notifier le porteur du motif sécuritaire (PIN bloqué, DDA échoué, carte expirée).");
  } else if (cryptogramType === "TC") {
    riskVerdict = "ACCORD_HORS_LIGNE";
    riskVerdictLabel = "Transaction approuvée hors-ligne avec succès (TC)";
    riskLevel = "BAS";
    recommendedActions.push("Télécollecter la transaction hors-ligne lors de la prochaine télécollecte de compensation.");
  } else if (tvrSummary && tvrSummary.warningFlags.length > 0) {
    riskVerdict = "CONFORME_EN_LIGNE";
    riskVerdictLabel = "Autorisation en ligne forcée suite aux avertissements de risque (TRM)";
    riskLevel = "MOYEN";
    recommendedActions.push("Transmettre l'ARQC au HSM émetteur pour calcul et vérification du cryptogramme.");
  }

  if (recommendedActions.length === 0) {
    recommendedActions.push("Transmettre le paquet DE55 au Switch monétique pour vérification du cryptogramme ARQC par le HSM.");
  }

  return {
    rawInput: inputHex,
    tagsCount: tags.length,
    tags,
    tvrSummary,
    tsiSummary,
    aipSummary,
    cvmSummary,
    cidSummary,
    securityAudit: {
      cryptogramType,
      atcDecimal,
      unpredictableNumberHex,
      amountFormatted,
      currencyLabel,
      transactionTypeLabel,
      riskVerdict,
      riskVerdictLabel,
      riskLevel,
      forensicReasons,
      recommendedActions,
    },
    errors,
    warnings,
  };
}
