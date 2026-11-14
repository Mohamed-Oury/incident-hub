/**
 * Référentiel & moteur d'analyse multi-normes ISO 8583 :
 * Support exhaustif des versions ISO 8583:1987 (0xxx) et ISO 8583:1993 (1xxx).
 * Utilisé pour le parsing, la corrélation multi-sauts, la détection des passerelles bi-normes
 * et la restitution enrichie des Data Elements (DE).
 */

import { IsoStandardVersion } from "./types";
export type { IsoStandardVersion };

export interface IsoMtiInfo {
  mti: string;
  version: "ISO 8583:1987" | "ISO 8583:1993" | "ISO 8583:2003" | "USAGE_PRIVE";
  class: string;
  function: string;
  originator: string;
  nameFr: string;
  category: "AUTORISATION" | "FINANCIER" | "ANNULATION_REVERSAL" | "RECONCILIATION" | "GESTION_RESEAU" | "AUTRE";
  expectedResponseMti?: string;
  equivalentOtherVersion?: {
    version: "ISO 8583:1987" | "ISO 8583:1993";
    mti: string;
  };
}

export interface IsoFieldDefinition {
  de: number;
  code: string;
  standard1987Name: string;
  standard1993Name: string;
  format1987: string;
  format1993: string;
  lengthType: "FIXED" | "LLVAR" | "LLLVAR";
  descriptionFr: string;
  versionDifferences?: string;
}

// ----------------------------------------------------------------------------
// 1. CATALOGUE DES MTI (1987 vs 1993)
// ----------------------------------------------------------------------------

export const ISO_MTI_CATALOG: Record<string, IsoMtiInfo> = {
  // === ISO 8583:1987 ===
  "0100": {
    mti: "0100",
    version: "ISO 8583:1987",
    class: "Autorisation",
    function: "Demande (Request)",
    originator: "Acquéreur",
    nameFr: "Demande d'Autorisation (1987)",
    category: "AUTORISATION",
    expectedResponseMti: "0110",
    equivalentOtherVersion: { version: "ISO 8583:1993", mti: "1100" },
  },
  "0110": {
    mti: "0110",
    version: "ISO 8583:1987",
    class: "Autorisation",
    function: "Réponse à la Demande",
    originator: "Émetteur",
    nameFr: "Réponse d'Autorisation (1987)",
    category: "AUTORISATION",
    equivalentOtherVersion: { version: "ISO 8583:1993", mti: "1110" },
  },
  "0120": {
    mti: "0120",
    version: "ISO 8583:1987",
    class: "Autorisation",
    function: "Avis (Advice)",
    originator: "Acquéreur",
    nameFr: "Avis d'Autorisation (1987)",
    category: "AUTORISATION",
    expectedResponseMti: "0130",
    equivalentOtherVersion: { version: "ISO 8583:1993", mti: "1120" },
  },
  "0130": {
    mti: "0130",
    version: "ISO 8583:1987",
    class: "Autorisation",
    function: "Réponse à l'Avis",
    originator: "Émetteur / Hôte",
    nameFr: "Réponse d'Avis d'Autorisation (1987)",
    category: "AUTORISATION",
    equivalentOtherVersion: { version: "ISO 8583:1993", mti: "1130" },
  },
  "0200": {
    mti: "0200",
    version: "ISO 8583:1987",
    class: "Financier",
    function: "Demande (Request)",
    originator: "Acquéreur (GAB/TPE)",
    nameFr: "Demande Financière / Retrait / Paiement (1987)",
    category: "FINANCIER",
    expectedResponseMti: "0210",
    equivalentOtherVersion: { version: "ISO 8583:1993", mti: "1200" },
  },
  "0210": {
    mti: "0210",
    version: "ISO 8583:1987",
    class: "Financier",
    function: "Réponse à la Demande",
    originator: "Émetteur",
    nameFr: "Réponse Financière (1987)",
    category: "FINANCIER",
    equivalentOtherVersion: { version: "ISO 8583:1993", mti: "1210" },
  },
  "0220": {
    mti: "0220",
    version: "ISO 8583:1987",
    class: "Financier",
    function: "Avis (Advice)",
    originator: "Acquéreur",
    nameFr: "Avis Financier (1987)",
    category: "FINANCIER",
    expectedResponseMti: "0230",
    equivalentOtherVersion: { version: "ISO 8583:1993", mti: "1220" },
  },
  "0230": {
    mti: "0230",
    version: "ISO 8583:1987",
    class: "Financier",
    function: "Réponse à l'Avis Financier",
    originator: "Émetteur",
    nameFr: "Réponse d'Avis Financier (1987)",
    category: "FINANCIER",
    equivalentOtherVersion: { version: "ISO 8583:1993", mti: "1230" },
  },
  "0400": {
    mti: "0400",
    version: "ISO 8583:1987",
    class: "Annulation / Reversal",
    function: "Demande d'Annulation",
    originator: "Acquéreur",
    nameFr: "Demande d'Annulation / Reversal (1987)",
    category: "ANNULATION_REVERSAL",
    expectedResponseMti: "0410",
    equivalentOtherVersion: { version: "ISO 8583:1993", mti: "1420" },
  },
  "0410": {
    mti: "0410",
    version: "ISO 8583:1987",
    class: "Annulation / Reversal",
    function: "Réponse d'Annulation",
    originator: "Émetteur",
    nameFr: "Réponse d'Annulation (1987)",
    category: "ANNULATION_REVERSAL",
    equivalentOtherVersion: { version: "ISO 8583:1993", mti: "1430" },
  },
  "0420": {
    mti: "0420",
    version: "ISO 8583:1987",
    class: "Annulation / Reversal",
    function: "Avis d'Annulation (Reversal Advice)",
    originator: "Acquéreur (GAB/Switch)",
    nameFr: "Avis d'Annulation / Extourne SAF (1987)",
    category: "ANNULATION_REVERSAL",
    expectedResponseMti: "0430",
    equivalentOtherVersion: { version: "ISO 8583:1993", mti: "1420" },
  },
  "0430": {
    mti: "0430",
    version: "ISO 8583:1987",
    class: "Annulation / Reversal",
    function: "Réponse d'Avis d'Annulation",
    originator: "Émetteur",
    nameFr: "Réponse d'Avis d'Extourne (1987)",
    category: "ANNULATION_REVERSAL",
    equivalentOtherVersion: { version: "ISO 8583:1993", mti: "1430" },
  },
  "0500": {
    mti: "0500",
    version: "ISO 8583:1987",
    class: "Réconciliation",
    function: "Demande de Réconciliation",
    originator: "Acquéreur",
    nameFr: "Demande de Réconciliation / Balance (1987)",
    category: "RECONCILIATION",
    expectedResponseMti: "0510",
    equivalentOtherVersion: { version: "ISO 8583:1993", mti: "1520" },
  },
  "0510": {
    mti: "0510",
    version: "ISO 8583:1987",
    class: "Réconciliation",
    function: "Réponse de Réconciliation",
    originator: "Émetteur / Hôte",
    nameFr: "Réponse de Réconciliation (1987)",
    category: "RECONCILIATION",
    equivalentOtherVersion: { version: "ISO 8583:1993", mti: "1530" },
  },
  "0800": {
    mti: "0800",
    version: "ISO 8583:1987",
    class: "Gestion Réseau",
    function: "Demande (Echo, Logon, Key)",
    originator: "Switch / Partenaire",
    nameFr: "Gestion Réseau & Echo Test (1987)",
    category: "GESTION_RESEAU",
    expectedResponseMti: "0810",
    equivalentOtherVersion: { version: "ISO 8583:1993", mti: "1804" },
  },
  "0810": {
    mti: "0810",
    version: "ISO 8583:1987",
    class: "Gestion Réseau",
    function: "Réponse Réseau",
    originator: "Partenaire / Switch",
    nameFr: "Réponse de Gestion Réseau (1987)",
    category: "GESTION_RESEAU",
    equivalentOtherVersion: { version: "ISO 8583:1993", mti: "1814" },
  },
  "0820": {
    mti: "0820",
    version: "ISO 8583:1987",
    class: "Gestion Réseau",
    function: "Avis Réseau",
    originator: "Switch",
    nameFr: "Avis de Gestion Réseau (1987)",
    category: "GESTION_RESEAU",
    expectedResponseMti: "0830",
  },

  // === ISO 8583:1993 ===
  "1100": {
    mti: "1100",
    version: "ISO 8583:1993",
    class: "Autorisation",
    function: "Demande (Request)",
    originator: "Acquéreur",
    nameFr: "Demande d'Autorisation (1993)",
    category: "AUTORISATION",
    expectedResponseMti: "1110",
    equivalentOtherVersion: { version: "ISO 8583:1987", mti: "0100" },
  },
  "1110": {
    mti: "1110",
    version: "ISO 8583:1993",
    class: "Autorisation",
    function: "Réponse à la Demande",
    originator: "Émetteur",
    nameFr: "Réponse d'Autorisation (1993)",
    category: "AUTORISATION",
    equivalentOtherVersion: { version: "ISO 8583:1987", mti: "0110" },
  },
  "1120": {
    mti: "1120",
    version: "ISO 8583:1993",
    class: "Autorisation",
    function: "Avis (Advice)",
    originator: "Acquéreur",
    nameFr: "Avis d'Autorisation (1993)",
    category: "AUTORISATION",
    expectedResponseMti: "1130",
    equivalentOtherVersion: { version: "ISO 8583:1987", mti: "0120" },
  },
  "1130": {
    mti: "1130",
    version: "ISO 8583:1993",
    class: "Autorisation",
    function: "Réponse à l'Avis",
    originator: "Émetteur",
    nameFr: "Réponse d'Avis d'Autorisation (1993)",
    category: "AUTORISATION",
    equivalentOtherVersion: { version: "ISO 8583:1987", mti: "0130" },
  },
  "1200": {
    mti: "1200",
    version: "ISO 8583:1993",
    class: "Financier",
    function: "Demande (Request)",
    originator: "Acquéreur",
    nameFr: "Demande Financière / Retrait / Paiement (1993)",
    category: "FINANCIER",
    expectedResponseMti: "1210",
    equivalentOtherVersion: { version: "ISO 8583:1987", mti: "0200" },
  },
  "1210": {
    mti: "1210",
    version: "ISO 8583:1993",
    class: "Financier",
    function: "Réponse à la Demande",
    originator: "Émetteur",
    nameFr: "Réponse Financière (1993)",
    category: "FINANCIER",
    equivalentOtherVersion: { version: "ISO 8583:1987", mti: "0210" },
  },
  "1220": {
    mti: "1220",
    version: "ISO 8583:1993",
    class: "Financier",
    function: "Avis (Advice)",
    originator: "Acquéreur",
    nameFr: "Avis Financier (1993)",
    category: "FINANCIER",
    expectedResponseMti: "1230",
    equivalentOtherVersion: { version: "ISO 8583:1987", mti: "0220" },
  },
  "1230": {
    mti: "1230",
    version: "ISO 8583:1993",
    class: "Financier",
    function: "Réponse d'Avis",
    originator: "Émetteur",
    nameFr: "Réponse d'Avis Financier (1993)",
    category: "FINANCIER",
    equivalentOtherVersion: { version: "ISO 8583:1987", mti: "0230" },
  },
  "1420": {
    mti: "1420",
    version: "ISO 8583:1993",
    class: "Annulation / Reversal",
    function: "Avis d'Annulation (Reversal Advice)",
    originator: "Acquéreur / Switch",
    nameFr: "Avis d'Annulation / Extourne SAF (1993)",
    category: "ANNULATION_REVERSAL",
    expectedResponseMti: "1430",
    equivalentOtherVersion: { version: "ISO 8583:1987", mti: "0420" },
  },
  "1430": {
    mti: "1430",
    version: "ISO 8583:1993",
    class: "Annulation / Reversal",
    function: "Réponse d'Avis d'Annulation",
    originator: "Émetteur",
    nameFr: "Réponse d'Avis d'Annulation (1993)",
    category: "ANNULATION_REVERSAL",
    equivalentOtherVersion: { version: "ISO 8583:1987", mti: "0430" },
  },
  "1520": {
    mti: "1520",
    version: "ISO 8583:1993",
    class: "Réconciliation",
    function: "Avis de Réconciliation",
    originator: "Acquéreur",
    nameFr: "Avis de Réconciliation / Lot (1993)",
    category: "RECONCILIATION",
    expectedResponseMti: "1530",
    equivalentOtherVersion: { version: "ISO 8583:1987", mti: "0500" },
  },
  "1530": {
    mti: "1530",
    version: "ISO 8583:1993",
    class: "Réconciliation",
    function: "Réponse d'Avis de Réconciliation",
    originator: "Hôte",
    nameFr: "Réponse de Réconciliation (1993)",
    category: "RECONCILIATION",
    equivalentOtherVersion: { version: "ISO 8583:1987", mti: "0510" },
  },
  "1800": {
    mti: "1800",
    version: "ISO 8583:1993",
    class: "Gestion Réseau",
    function: "Demande Réseau",
    originator: "Switch",
    nameFr: "Demande de Gestion Réseau (1993)",
    category: "GESTION_RESEAU",
    expectedResponseMti: "1810",
    equivalentOtherVersion: { version: "ISO 8583:1987", mti: "0800" },
  },
  "1804": {
    mti: "1804",
    version: "ISO 8583:1993",
    class: "Gestion Réseau",
    function: "Notification / Echo Test",
    originator: "Switch / Partenaire",
    nameFr: "Gestion Réseau / Echo Test (1993)",
    category: "GESTION_RESEAU",
    expectedResponseMti: "1814",
    equivalentOtherVersion: { version: "ISO 8583:1987", mti: "0800" },
  },
  "1810": {
    mti: "1810",
    version: "ISO 8583:1993",
    class: "Gestion Réseau",
    function: "Réponse Réseau",
    originator: "Partenaire",
    nameFr: "Réponse de Gestion Réseau (1993)",
    category: "GESTION_RESEAU",
    equivalentOtherVersion: { version: "ISO 8583:1987", mti: "0810" },
  },
  "1814": {
    mti: "1814",
    version: "ISO 8583:1993",
    class: "Gestion Réseau",
    function: "Accusé Réseau / Echo Response",
    originator: "Partenaire",
    nameFr: "Réponse Echo Test / Réseau (1993)",
    category: "GESTION_RESEAU",
    equivalentOtherVersion: { version: "ISO 8583:1987", mti: "0810" },
  },
};

// ----------------------------------------------------------------------------
// 2. DIFFÉRENCES SUR LES DATA ELEMENTS (1987 vs 1993)
// ----------------------------------------------------------------------------

export const ISO_FIELD_DIFFERENCES: Record<number, IsoFieldDefinition> = {
  12: {
    de: 12,
    code: "DE12",
    standard1987Name: "Time, Local Transaction",
    standard1993Name: "Date and Time, Local Transaction",
    format1987: "n 6 (hhmmss)",
    format1993: "n 12..14 (YYYYMMDDhhmmss ou YYMMDDhhmmss)",
    lengthType: "FIXED",
    descriptionFr: "Horodatage local terminal. En norme 1987, il ne contient que l'heure (hhmmss) ; en norme 1993, il regroupe la date et l'heure complètes.",
    versionDifferences: "ISO 1987 sépare DE12 (heure) et DE13 (date MMDD). ISO 1993 fusionne date et heure en DE12 sur 12 à 14 chiffres.",
  },
  13: {
    de: 13,
    code: "DE13",
    standard1987Name: "Date, Local Transaction",
    standard1993Name: "Date, Effective / Settlement",
    format1987: "n 4 (MMDD)",
    format1993: "n 4 (MMDD)",
    lengthType: "FIXED",
    descriptionFr: "Date de transaction locale en 1987. En 1993, souvent utilisé comme date de valeur/règlement car l'horodatage local est déjà dans le DE12.",
  },
  15: {
    de: 15,
    code: "DE15",
    standard1987Name: "Date, Settlement",
    standard1993Name: "Date, Settlement",
    format1987: "n 4 (MMDD)",
    format1993: "n 4 ou n 6",
    lengthType: "FIXED",
    descriptionFr: "Date de règlement interbancaire (date comptable de compensation).",
  },
  22: {
    de: 22,
    code: "DE22",
    standard1987Name: "Point of Service Entry Mode",
    standard1993Name: "POS Data Code",
    format1987: "n 3 (ex: 021, 051)",
    format1993: "ans 12 ou ans 15",
    lengthType: "FIXED",
    descriptionFr: "Mode de saisie de la carte (Puce EMV, Piste magnétique, Sans contact, Manuel). En 1993, le format étendu (POS Data Code) encode l'environnement complet du terminal sur 12 caractères.",
    versionDifferences: "Format n 3 en ISO 1987 (très répandu GAB/TPE) vs bloc structuré multi-sous-champs en ISO 1993.",
  },
  25: {
    de: 25,
    code: "DE25",
    standard1987Name: "Point of Service Condition Code",
    standard1993Name: "Point of Service Condition Code",
    format1987: "n 2",
    format1993: "n 2 ou an 2",
    lengthType: "FIXED",
    descriptionFr: "Code condition du point de vente (00=Normal, 01=Client absent/VAD, 08=Mail/Phone, 59=Commerce électronique sécurisé).",
  },
  38: {
    de: 38,
    code: "DE38",
    standard1987Name: "Authorization Identification Response",
    standard1993Name: "Approval Code",
    format1987: "an 6",
    format1993: "an 6",
    lengthType: "FIXED",
    descriptionFr: "Code d'approbation délivré par l'émetteur en cas d'accord (ex: '648291'). Indispensable pour la comptabilisation.",
  },
  39: {
    de: 39,
    code: "DE39",
    standard1987Name: "Response Code",
    standard1993Name: "Action Code",
    format1987: "an 2 (ex: '00', '51', '91')",
    format1993: "an 2 ou n 3 (Action Code)",
    lengthType: "FIXED",
    descriptionFr: "Code réponse de l'émetteur ou du switch (00=Approuvé, 05=Ne pas honorer, 51=Solde insuffisant, 91=Émetteur inaccessible).",
    versionDifferences: "ISO 1987 utilise 2 caractères alphanumériques. ISO 1993 nomme ce champ Action Code et supporte des codes étendus.",
  },
  53: {
    de: 53,
    code: "DE53",
    standard1987Name: "Security Related Control Information",
    standard1993Name: "Security Related Control Information (Extended)",
    format1987: "n 16",
    format1993: "b 48 ou b 96 / LLVAR",
    lengthType: "LLVAR",
    descriptionFr: "Paramètres de gestion des clés de chiffrement (PIN, MAC, index de clé HSM).",
  },
  56: {
    de: 56,
    code: "DE56",
    standard1987Name: "Réservé / Non standard en 1987",
    standard1993Name: "Original Data Elements (Pivot Reversal)",
    format1987: "Non défini en standard 1987",
    format1993: "LLVAR ans ..35 (Original MTI + STAN + Horodatage + Acquéreur)",
    lengthType: "LLVAR",
    descriptionFr: "Éléments de la transaction d'origine. CRUCIAL : en norme ISO 8583:1993, le DE56 remplace le DE90 pour lier les avis d'annulation 1420 à la transaction d'origine 1200.",
    versionDifferences: "En ISO 8583:1987, les données d'origine sont portées par DE90 (n 42). En ISO 8583:1993, elles sont portées par DE56.",
  },
  62: {
    de: 62,
    code: "DE62",
    standard1987Name: "Private Use (Données privatives)",
    standard1993Name: "Custom Payment / SMS Data",
    format1987: "LLLVAR ans ..999",
    format1993: "LLLVAR ans ..999",
    lengthType: "LLLVAR",
    descriptionFr: "Champ privatif utilisé par les switchs pour transporter les numéros de ticket, référence marchande ou données d'itinérance.",
  },
  63: {
    de: 63,
    code: "DE63",
    standard1987Name: "SMS Private Data / Network Data",
    standard1993Name: "Network Data / Trace Privée",
    format1987: "LLLVAR ans ..999",
    format1993: "LLLVAR ans ..999",
    lengthType: "LLLVAR",
    descriptionFr: "Données de réseau Visa/Mastercard SMS (Single Message System) ou informations bancaires propriétaires.",
  },
  90: {
    de: 90,
    code: "DE90",
    standard1987Name: "Original Data Elements (Extourne 1987)",
    standard1993Name: "Original Data Elements (Historique)",
    format1987: "n 42 (MTI 4 + STAN 6 + Date/Heure 10 + Acq 11 + Fwd 11)",
    format1993: "n 42 (Remplacé par DE56 dans les profils stricts 1993)",
    lengthType: "FIXED",
    descriptionFr: "Éléments de la transaction d'origine pour l'annulation (Reversal 0400/0420) en norme ISO 8583:1987.",
    versionDifferences: "Standard obligatoire en 1987. En 1993, migré vers DE56 (ou conservé en double pour rétrocompatibilité).",
  },
};

// ----------------------------------------------------------------------------
// 3. FONCTIONS D'ANALYSE ET DÉTECTION
// ----------------------------------------------------------------------------

/**
 * Détecte la version ISO 8583 d'un MTI.
 */
export function detectIsoVersionFromMti(mti?: string): "ISO 8583:1987" | "ISO 8583:1993" | "ISO 8583:2003" | "UNKNOWN" {
  if (!mti || mti.length < 4) return "UNKNOWN";
  const firstChar = mti.charAt(0);
  if (firstChar === "0") return "ISO 8583:1987";
  if (firstChar === "1") return "ISO 8583:1993";
  if (firstChar === "2") return "ISO 8583:2003";
  return "UNKNOWN";
}

/**
 * Récupère les métadonnées riches d'un MTI.
 */
export function getMtiInfo(mti: string): IsoMtiInfo {
  if (ISO_MTI_CATALOG[mti]) {
    return ISO_MTI_CATALOG[mti];
  }

  const version = detectIsoVersionFromMti(mti);
  const classChar = mti.charAt(1);
  const functionChar = mti.charAt(2);
  const originatorChar = mti.charAt(3);

  const classes: Record<string, string> = {
    "1": "Autorisation",
    "2": "Financier",
    "3": "Fichier",
    "4": "Annulation / Reversal",
    "5": "Réconciliation",
    "6": "Administration",
    "7": "Gestion Litiges",
    "8": "Gestion Réseau",
  };

  const categories: Record<string, IsoMtiInfo["category"]> = {
    "1": "AUTORISATION",
    "2": "FINANCIER",
    "4": "ANNULATION_REVERSAL",
    "5": "RECONCILIATION",
    "8": "GESTION_RESEAU",
  };

  return {
    mti,
    version: version === "UNKNOWN" ? "ISO 8583:1987" : version,
    class: classes[classChar] || "Général",
    function: functionChar === "0" ? "Demande" : functionChar === "1" ? "Réponse" : functionChar === "2" ? "Avis" : "Autre",
    originator: originatorChar === "0" ? "Acquéreur" : originatorChar === "2" ? "Émetteur" : "Switch/Autre",
    nameFr: `Message MTI ${mti} (${version})`,
    category: categories[classChar] || "AUTRE",
    expectedResponseMti: functionChar === "0" ? `${mti.slice(0, 2)}1${mti.slice(3)}` : undefined,
  };
}

/**
 * Récupère la désignation contextuelle d'un Data Element selon la norme active (1987 vs 1993).
 */
export function getFieldDescriptor(
  deNumber: string | number,
  targetNorm: "ISO 8583:1987" | "ISO 8583:1993" | "AUTO" = "AUTO",
  mtiContext?: string
): {
  code: string;
  name: string;
  format: string;
  isSpecificToNorm: boolean;
  versionNotice?: string;
  descriptionFr?: string;
} {
  const num = typeof deNumber === "number" ? deNumber : parseInt(deNumber, 10);
  const diff = ISO_FIELD_DIFFERENCES[num];

  const resolvedNorm =
    targetNorm === "AUTO"
      ? mtiContext?.startsWith("1")
        ? "ISO 8583:1993"
        : "ISO 8583:1987"
      : targetNorm;

  if (diff) {
    const is1993 = resolvedNorm === "ISO 8583:1993";
    return {
      code: diff.code,
      name: is1993 ? diff.standard1993Name : diff.standard1987Name,
      format: is1993 ? diff.format1993 : diff.format1987,
      isSpecificToNorm: !!diff.versionDifferences,
      versionNotice: diff.versionDifferences,
      descriptionFr: diff.descriptionFr,
    };
  }

  return {
    code: `DE${num}`,
    name: `Data Element ${num}`,
    format: "ans",
    isSpecificToNorm: false,
  };
}

/**
 * Analyse l'ensemble des événements d'une transaction pour diagnostiquer le profil normatif ISO :
 * Détecte les flux 100% 1987, 100% 1993 ou les passerelles de conversion bi-normes (1987 <-> 1993).
 */
export function analyzeTransactionIsoProfile(events: Array<{ mti?: string; isoFields?: Record<string, string> }>): {
  dominantVersion: IsoStandardVersion;
  hasBiNormBridge: boolean;
  mtiSequence: string[];
  bridgeDetails?: string;
  normativeObservations: string[];
} {
  const mtis = events.map((e) => e.mti).filter((m): m is string => !!m);
  const versions = mtis.map((m) => detectIsoVersionFromMti(m));

  const has1987 = versions.includes("ISO 8583:1987");
  const has1993 = versions.includes("ISO 8583:1993");

  const observations: string[] = [];

  // Détection des Data Elements pivots de norme
  const hasDe56 = events.some((e) => e.isoFields && e.isoFields["56"]);
  const hasDe90 = events.some((e) => e.isoFields && e.isoFields["90"]);
  const hasDe12Combined = events.some(
    (e) => e.isoFields && e.isoFields["12"] && e.isoFields["12"].length >= 12
  );

  if (hasDe56) {
    observations.push("Présence de DE56 (Original Data Elements spécifique à la norme ISO 8583:1993).");
  }
  if (hasDe90) {
    observations.push("Présence de DE90 (Original Data Elements conforme à la norme ISO 8583:1987).");
  }
  if (hasDe12Combined) {
    observations.push("Horodatage DE12 étendu (>=12 chiffres) : encodage date+heure selon norme ISO 8583:1993.");
  }

  if (has1987 && has1993) {
    const ingressMti = mtis[0];
    const egressMti = mtis[mtis.length - 1];
    const bridgeText = `Passerelle Bi-Norme détectée : Ingestion en ${ingressMti} (${detectIsoVersionFromMti(
      ingressMti
    )}) corrélée avec ${egressMti} (${detectIsoVersionFromMti(egressMti)}).`;

    observations.unshift(bridgeText);

    return {
      dominantVersion: "BI_NORME",
      hasBiNormBridge: true,
      mtiSequence: mtis,
      bridgeDetails: bridgeText,
      normativeObservations: observations,
    };
  }

  if (has1993) {
    return {
      dominantVersion: "ISO 8583:1993",
      hasBiNormBridge: false,
      mtiSequence: mtis,
      normativeObservations: [
        "Flux 100 % conforme à la norme ISO 8583:1993 (MTI de classe 1xxx).",
        ...observations,
      ],
    };
  }

  if (has1987) {
    return {
      dominantVersion: "ISO 8583:1987",
      hasBiNormBridge: false,
      mtiSequence: mtis,
      normativeObservations: [
        "Flux conforme à la norme standard ISO 8583:1987 (MTI de classe 0xxx).",
        ...observations,
      ],
    };
  }

  return {
    dominantVersion: "UNKNOWN",
    hasBiNormBridge: false,
    mtiSequence: mtis,
    normativeObservations: observations,
  };
}

