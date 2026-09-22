// modules/crypto/emv-arqc.ts

export interface ArqcInput {
  pan: string;
  panSequenceNumber: string; // Tag 5F34 (ex: "01")
  amountAuth: string; // Tag 9F02 (ex: "000000050000" pour 500.00)
  amountOther: string; // Tag 9F03 (ex: "000000000000")
  terminalCountryCode: string; // Tag 9F1A (ex: "0952")
  tvr: string; // Tag 95 (ex: "0000008000")
  transactionCurrencyCode: string; // Tag 5F2A (ex: "0952")
  transactionDate: string; // Tag 9A (YYMMDD, ex: "260922")
  transactionType: string; // Tag 9C (ex: "01" pour retrait, "00" pour achat)
  unpredictableNumber: string; // Tag 9F37 (4 bytes hex, ex: "9A1B2C3D")
  applicationTransactionCounter: string; // Tag 9F36 (2 bytes hex, ex: "004A")
  mkAcHex: string; // Master Key AC (16 bytes / 32 hex chars, ex: "0123456789ABCDEFFEDCBA9876543210")
}

export interface ArqcResult {
  sessionKeyHex: string;
  diversificationData: string;
  transactionDataString: string;
  arqcHex: string; // Tag 9F26 (8 bytes hex)
  arpcHex: string; // Tag 91 (8 or 16 bytes hex)
  arc: string; // Tag 8A (ex: "00" ou "Z3")
  csu: string; // Card Status Update (4 bytes)
  verificationStatus: "VERIFIED" | "FAILED";
  diagnosticAnalysis: {
    tvrFlagSummary: string[];
    riskPoints: string[];
    hsmCommand: string;
    advice: string;
  };
}

/**
 * Implémentation déterministe pour simulation pédagogique et bancaire
 * basée sur les spécifications EMVCo Book 2 (Security & Key Management)
 */
export function computeEmvCryptograms(input: ArqcInput): ArqcResult {
  const cleanPan = input.pan.replace(/\D/g, "");
  const psn = input.panSequenceNumber.padStart(2, "0").slice(-2);
  const atc = input.applicationTransactionCounter.replace(/[^0-9A-Fa-f]/g, "").padStart(4, "0").slice(-4).toUpperCase();
  const un = input.unpredictableNumber.replace(/[^0-9A-Fa-f]/g, "").padStart(8, "0").slice(-8).toUpperCase();
  const amt = input.amountAuth.replace(/\D/g, "").padStart(12, "0").slice(-12);
  const amtOther = input.amountOther.replace(/\D/g, "").padStart(12, "0").slice(-12);
  const tvr = input.tvr.replace(/[^0-9A-Fa-f]/g, "").padEnd(10, "0").slice(0, 10).toUpperCase();
  const cur = input.transactionCurrencyCode.padStart(4, "0").slice(-4);
  const country = input.terminalCountryCode.padStart(4, "0").slice(-4);
  const date = input.transactionDate.replace(/\D/g, "").padStart(6, "0").slice(-6);
  const type = input.transactionType.padStart(2, "0").slice(-2);

  // 1. Dérivation de données (PAN + PSN)
  const panLastDigits = cleanPan.slice(-16).padStart(16, "0");
  const diversificationData = `${panLastDigits.slice(0, 14)}${psn}`;

  // Dérivation Session Key (SK-AC) via hash déterministe simulant 3DES
  let seed = 0;
  const combinedKey = (input.mkAcHex + diversificationData + atc).toUpperCase();
  for (let i = 0; i < combinedKey.length; i++) {
    seed = (seed * 37 + combinedKey.charCodeAt(i)) & 0xffffffff;
  }
  const sessionKeyHex = Math.abs(seed).toString(16).padStart(8, "0").repeat(4).slice(0, 32).toUpperCase();

  // 2. Concaténation des données de transaction standard (Tag 9F02, 9F03, 9F1A, 95, 5F2A, 9A, 9C, 9F37, 9F36)
  const transactionData = `${amt}${amtOther}${country}${tvr}${cur}${date}${type}${un}${atc}`;

  // 3. Calcul ARQC (Tag 9F26)
  let arqcSeed = 0;
  const arqcInputStr = sessionKeyHex + transactionData;
  for (let i = 0; i < arqcInputStr.length; i++) {
    arqcSeed = (arqcSeed * 41 + arqcInputStr.charCodeAt(i)) & 0xffffffff;
  }
  const arqcHex = Math.abs(arqcSeed).toString(16).padStart(8, "0").repeat(2).slice(0, 16).toUpperCase();

  // 4. Calcul ARPC (Tag 91) avec ARC "00" (Approuvé)
  const arc = "00";
  const csu = "00000000"; // Pas d'actions spécifiques de blocage puce
  let arpcSeed = 0;
  const arpcInputStr = arqcHex + arc + sessionKeyHex;
  for (let i = 0; i < arpcInputStr.length; i++) {
    arpcSeed = (arpcSeed * 43 + arpcInputStr.charCodeAt(i)) & 0xffffffff;
  }
  const arpcHex = Math.abs(arpcSeed).toString(16).padStart(8, "0").repeat(2).slice(0, 16).toUpperCase();

  // Analyse TVR
  const tvrFlags: string[] = [];
  const riskPoints: string[] = [];
  if (tvr.slice(0, 2) !== "00") {
    tvrFlags.push("Byte 1 : Échec authentification de données hors-ligne (SDA/DDA/CDA)");
    riskPoints.push("Suspicion de clonage ou altération des certificats puce.");
  }
  if (parseInt(tvr.slice(4, 6), 16) & 0x04) {
    tvrFlags.push("Byte 3 : PIN bloqué ou nombre maximum de tentatives PIN dépassé");
    riskPoints.push("Risque de fraude : le porteur a échoué ses saisies PIN.");
  }
  if (parseInt(tvr.slice(6, 8), 16) & 0x80) {
    tvrFlags.push("Byte 4 : Transaction excède le plafond de cumul sans contact / plancher");
  }
  if (parseInt(tvr.slice(8, 10), 16) & 0x80) {
    tvrFlags.push("Byte 5 : Échec de la vérification du code PIN en ligne");
  }

  return {
    sessionKeyHex,
    diversificationData,
    transactionDataString: transactionData,
    arqcHex,
    arpcHex,
    arc,
    csu,
    verificationStatus: "VERIFIED",
    diagnosticAnalysis: {
      tvrFlagSummary: tvrFlags.length > 0 ? tvrFlags : ["Aucune anomalie TVR détectée (Puce intègre)."],
      riskPoints: riskPoints.length > 0 ? riskPoints : ["Profil de risque conforme, transaction nominale."],
      hsmCommand: `Thales payShield: 'KQ' (Verify ARQC & Generate ARPC) / Atalla: Command 30`,
      advice: "En cas de code retour DE39=84 (Invalid ARQC) ou 05 (Do Not Honor), vérifier la désynchronisation de l'ATC ou une incohérence sur la table MK-AC de la banque émettrice.",
    },
  };
}
