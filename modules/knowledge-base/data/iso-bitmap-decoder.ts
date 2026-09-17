export interface DataElementSpec {
  de: number;
  name: string;
  format: string;
  lengthType: "FIXED" | "LLVAR" | "LLLVAR";
  maxLength: number;
  description: string;
  category: "IDENTIFICATION" | "MONTANT" | "TRACE" | "DONNEES_CARTE" | "TERMINAL" | "SECURITE" | "RESEAU";
}

export const ISO_DE_DEFINITIONS: Record<number, DataElementSpec> = {
  1: { de: 1, name: "Secondary Bit Map", format: "b 64", lengthType: "FIXED", maxLength: 64, category: "RESEAU", description: "Indique la présence des champs DE65 à DE128." },
  2: { de: 2, name: "Primary Account Number (PAN)", format: "n ..19", lengthType: "LLVAR", maxLength: 19, category: "DONNEES_CARTE", description: "Numéro de la carte du porteur (doit être masqué)." },
  3: { de: 3, name: "Processing Code", format: "n 6", lengthType: "FIXED", maxLength: 6, category: "TRACE", description: "Code opération (ex: 010000 Retrait, 000000 Achat, 310000 Solde)." },
  4: { de: 4, name: "Amount, Transaction", format: "n 12", lengthType: "FIXED", maxLength: 12, category: "MONTANT", description: "Montant de la transaction dans la devise du terminal." },
  5: { de: 5, name: "Amount, Settlement", format: "n 12", lengthType: "FIXED", maxLength: 12, category: "MONTANT", description: "Montant de compensation." },
  6: { de: 6, name: "Amount, Cardholder Billing", format: "n 12", lengthType: "FIXED", maxLength: 12, category: "MONTANT", description: "Montant facturé au porteur." },
  7: { de: 7, name: "Transmission Date & Time", format: "n 10", lengthType: "FIXED", maxLength: 10, category: "TRACE", description: "Horodatage d'envoi UTC (MMDDhhmmss)." },
  8: { de: 8, name: "Amount, Cardholder Billing Fee", format: "n 8", lengthType: "FIXED", maxLength: 8, category: "MONTANT", description: "Frais appliqués au porteur." },
  9: { de: 9, name: "Conversion Rate, Settlement", format: "n 8", lengthType: "FIXED", maxLength: 8, category: "MONTANT", description: "Taux de conversion pour la compensation." },
  10: { de: 10, name: "Conversion Rate, Cardholder Billing", format: "n 8", lengthType: "FIXED", maxLength: 8, category: "MONTANT", description: "Taux de change facturation porteur." },
  11: { de: 11, name: "Systems Trace Audit Number (STAN)", format: "n 6", lengthType: "FIXED", maxLength: 6, category: "TRACE", description: "Numéro d'audit unique généré par l'initiateur (GAB/TPE)." },
  12: { de: 12, name: "Time, Local Transaction", format: "n 6", lengthType: "FIXED", maxLength: 6, category: "TRACE", description: "Heure locale de transaction (hhmmss)." },
  13: { de: 13, name: "Date, Local Transaction", format: "n 4", lengthType: "FIXED", maxLength: 4, category: "TRACE", description: "Date locale de transaction (MMDD)." },
  14: { de: 14, name: "Date, Expiration", format: "n 4", lengthType: "FIXED", maxLength: 4, category: "DONNEES_CARTE", description: "Date d'expiration de la carte (YYMM)." },
  15: { de: 15, name: "Date, Settlement", format: "n 4", lengthType: "FIXED", maxLength: 4, category: "TRACE", description: "Date de compensation (MMDD)." },
  16: { de: 16, name: "Date, Conversion", format: "n 4", lengthType: "FIXED", maxLength: 4, category: "TRACE", description: "Date de conversion de devises." },
  17: { de: 17, name: "Date, Capture", format: "n 4", lengthType: "FIXED", maxLength: 4, category: "TRACE", description: "Date de télécollecte." },
  18: { de: 18, name: "Merchant's Type (MCC)", format: "n 4", lengthType: "FIXED", maxLength: 4, category: "TERMINAL", description: "Merchant Category Code (ex: 6011 pour GAB)." },
  19: { de: 19, name: "Acquiring Institution Country Code", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "IDENTIFICATION", description: "Code ISO pays de l'Acquéreur." },
  22: { de: 22, name: "Point of Service Entry Mode (POS Entry Mode)", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "DONNEES_CARTE", description: "Mode de lecture carte (051 Puce avec PIN, 021 Piste, 071 Sans contact)." },
  23: { de: 23, name: "Card Sequence Number (PAN Sequence)", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "DONNEES_CARTE", description: "Numéro de séquence de la carte (CSN)." },
  24: { de: 24, name: "Function Code (Network Info)", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "RESEAU", description: "Code fonction réseau (ex: 200 message original)." },
  25: { de: 25, name: "Point of Service Condition Code", format: "n 2", lengthType: "FIXED", maxLength: 2, category: "TERMINAL", description: "Condition du point de vente (00 Normal, 08 Mail/Phone)." },
  26: { de: 26, name: "Point of Service PIN Capture Code", format: "n 2", lengthType: "FIXED", maxLength: 2, category: "SECURITE", description: "Capacité de saisie PIN du terminal." },
  28: { de: 28, name: "Amount, Transaction Fee", format: "x+n 8", lengthType: "FIXED", maxLength: 9, category: "MONTANT", description: "Montant des frais de transaction." },
  32: { de: 32, name: "Acquiring Institution Identification Code", format: "n ..11", lengthType: "LLVAR", maxLength: 11, category: "IDENTIFICATION", description: "Code d'identification de la banque acquéreuse." },
  33: { de: 33, name: "Forwarding Institution Identification Code", format: "n ..11", lengthType: "LLVAR", maxLength: 11, category: "IDENTIFICATION", description: "Code de la banque ou switch relais." },
  35: { de: 35, name: "Track 2 Data", format: "z ..37", lengthType: "LLVAR", maxLength: 37, category: "DONNEES_CARTE", description: "Piste 2 magnétique ou équivalent puce." },
  37: { de: 37, name: "Retrieval Reference Number (RRN)", format: "an 12", lengthType: "FIXED", maxLength: 12, category: "TRACE", description: "Référence unique globale de la transaction." },
  38: { de: 38, name: "Authorization Identification Response", format: "an 6", lengthType: "FIXED", maxLength: 6, category: "IDENTIFICATION", description: "Numéro d'autorisation délivré par l'émetteur." },
  39: { de: 39, name: "Response Code", format: "an 2", lengthType: "FIXED", maxLength: 2, category: "TRACE", description: "Code retour d'approbation ou de rejet (ex: 00, 51, 91)." },
  41: { de: 41, name: "Card Acceptor Terminal Identification (TID)", format: "ans 8", lengthType: "FIXED", maxLength: 8, category: "TERMINAL", description: "Identifiant du terminal (GAB ou TPE)." },
  42: { de: 42, name: "Card Acceptor Identification Code (MID)", format: "ans 15", lengthType: "FIXED", maxLength: 15, category: "TERMINAL", description: "Identifiant commerçant ou agence." },
  43: { de: 43, name: "Card Acceptor Name/Location", format: "ans 40", lengthType: "FIXED", maxLength: 40, category: "TERMINAL", description: "Nom et localisation de l'établissement." },
  44: { de: 44, name: "Additional Response Data", format: "an ..25", lengthType: "LLVAR", maxLength: 25, category: "TRACE", description: "Données de réponse complémentaires." },
  48: { de: 48, name: "Additional Data - Private", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Données privatives réseau / Switch." },
  49: { de: 49, name: "Currency Code, Transaction", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "MONTANT", description: "Code ISO devise de transaction (ex: 952 XOF, 978 EUR)." },
  50: { de: 50, name: "Currency Code, Settlement", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "MONTANT", description: "Code devise de compensation." },
  51: { de: 51, name: "Currency Code, Cardholder Billing", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "MONTANT", description: "Code devise facturation porteur." },
  52: { de: 52, name: "Personal Identification Number (PIN) Data", format: "b 64", lengthType: "FIXED", maxLength: 64, category: "SECURITE", description: "PIN Block chiffré (DES/3DES/AES)." },
  53: { de: 53, name: "Security Related Control Information", format: "n 16", lengthType: "FIXED", maxLength: 16, category: "SECURITE", description: "Index clé et algo de sécurité." },
  54: { de: 54, name: "Additional Amounts", format: "an ..120", lengthType: "LLLVAR", maxLength: 120, category: "MONTANT", description: "Soldes compte (Solde comptable, solde disponible)." },
  55: { de: 55, name: "Integrated Circuit Card (ICC) / EMV Data", format: "b ..999", lengthType: "LLLVAR", maxLength: 999, category: "DONNEES_CARTE", description: "Tags EMV complets (ARQC, TC, TVR, AID...)." },
  60: { de: 60, name: "Advice / Terminal Reason Code", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "TERMINAL", description: "Données terminal et informations privées." },
  61: { de: 61, name: "Point of Service (POS) Data Code", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "TERMINAL", description: "Caractéristiques détaillées du point d'acceptation." },
  62: { de: 62, name: "Intermediate Network Facility Data", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Données privatives réseau intermédiaire." },
  63: { de: 63, name: "Network Data", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Informations de routage et switch." },
  64: { de: 64, name: "Message Authentication Code (MAC)", format: "b 64", lengthType: "FIXED", maxLength: 64, category: "SECURITE", description: "Signature cryptographique du message primaire." },
  66: { de: 66, name: "Settlement Code", format: "n 1", lengthType: "FIXED", maxLength: 1, category: "TRACE", description: "Code de règlement/compensation." },
  70: { de: 70, name: "Network Management Information Code", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "RESEAU", description: "Code fonction gestion réseau (ex: 001 Echo, 101 Sign-on)." },
  90: { de: 90, name: "Original Data Elements", format: "n 42", lengthType: "FIXED", maxLength: 42, category: "TRACE", description: "Données du message d'origine lors d'un Reversal 0400." },
  95: { de: 95, name: "Replacement Amounts", format: "an 42", lengthType: "FIXED", maxLength: 42, category: "MONTANT", description: "Montants réels distribués lors d'un Reversal partiel." },
  100: { de: 100, name: "Receiving Institution Identification Code", format: "n ..11", lengthType: "LLVAR", maxLength: 11, category: "IDENTIFICATION", description: "Code banque réceptrice." },
  102: { de: 102, name: "Account Identification 1", format: "ans ..28", lengthType: "LLVAR", maxLength: 28, category: "IDENTIFICATION", description: "Numéro de compte source (RIB/IBAN)." },
  103: { de: 103, name: "Account Identification 2", format: "ans ..28", lengthType: "LLVAR", maxLength: 28, category: "IDENTIFICATION", description: "Numéro de compte cible (virement)." },
  128: { de: 128, name: "Message Authentication Code (Secondary MAC)", format: "b 64", lengthType: "FIXED", maxLength: 64, category: "SECURITE", description: "MAC secondaire calculé sur DE65 à DE127." },
};

export interface BitmapDecodeResult {
  rawInput: string;
  normalizedHex: string;
  binaryString: string;
  isSecondaryPresent: boolean;
  totalBits: number;
  presentFields: Array<{
    de: number;
    spec?: DataElementSpec;
    bytePosition: number;
    bitInByte: number;
  }>;
  missingFields: number[];
  warnings: string[];
}

export function decodeIsoBitmap(input: string): BitmapDecodeResult {
  const warnings: string[] = [];
  let cleanInput = input.replace(/[\s\-_:]/g, "").toUpperCase();

  // Accepter aussi une saisie binaire si l'opérateur a tapé 0101...
  let binaryString = "";
  let normalizedHex = "";

  const isBinary = /^[01]+$/.test(cleanInput);

  if (isBinary) {
    binaryString = cleanInput;
    // Remplir jusqu'au multiple de 64 bits si besoin
    if (binaryString.length <= 64) {
      binaryString = binaryString.padEnd(64, "0");
    } else if (binaryString.length <= 128) {
      binaryString = binaryString.padEnd(128, "0");
    }
    // Convertir en Hex
    for (let i = 0; i < binaryString.length; i += 4) {
      const nibble = binaryString.slice(i, i + 4);
      normalizedHex += parseInt(nibble, 2).toString(16).toUpperCase();
    }
  } else {
    // Vérification hexadécimale
    if (!/^[0-9A-F]+$/.test(cleanInput)) {
      warnings.push("La chaîne contient des caractères non hexadécimaux valides.");
      cleanInput = cleanInput.replace(/[^0-9A-F]/g, "");
    }

    // Un bitmap primaire standard fait 16 caractères hex (64 bits)
    // Un bitmap étendu fait 32 caractères hex (128 bits)
    if (cleanInput.length < 16) {
      warnings.push(`Longueur de bitmap courte (${cleanInput.length} hex). Complété à 16 hex pour analyse.`);
      cleanInput = cleanInput.padEnd(16, "0");
    } else if (cleanInput.length > 16 && cleanInput.length < 32) {
      warnings.push(`Bitmap entre 16 et 32 hex (${cleanInput.length} hex). Complété à 32 hex.`);
      cleanInput = cleanInput.padEnd(32, "0");
    } else if (cleanInput.length > 32) {
      warnings.push(`Bitmap de plus de 32 hex (${cleanInput.length} hex). Tronqué aux 128 premiers bits.`);
      cleanInput = cleanInput.slice(0, 32);
    }

    normalizedHex = cleanInput;

    // Convertir Hex en Binaire
    for (let i = 0; i < normalizedHex.length; i++) {
      const hexChar = normalizedHex[i];
      const binNibble = parseInt(hexChar, 16).toString(2).padStart(4, "0");
      binaryString += binNibble;
    }
  }

  const isSecondaryPresent = binaryString[0] === "1";
  const totalBits = binaryString.length;

  const presentFields: BitmapDecodeResult["presentFields"] = [];
  const missingFields: number[] = [];

  for (let bitIndex = 0; bitIndex < binaryString.length; bitIndex++) {
    const deNumber = bitIndex + 1;
    const isPresent = binaryString[bitIndex] === "1";

    if (isPresent) {
      const spec = ISO_DE_DEFINITIONS[deNumber];
      const bytePosition = Math.floor(bitIndex / 8) + 1;
      const bitInByte = (bitIndex % 8) + 1;
      presentFields.push({
        de: deNumber,
        spec,
        bytePosition,
        bitInByte,
      });
    } else {
      missingFields.push(deNumber);
    }
  }

  if (isSecondaryPresent && totalBits < 128) {
    warnings.push("Le bit 1 (Secondary Bitmap) est actif mais seulement 64 bits ont été fournis. Le Bitmap secondaire est manquant.");
  }

  return {
    rawInput: input,
    normalizedHex,
    binaryString,
    isSecondaryPresent,
    totalBits,
    presentFields,
    missingFields,
    warnings,
  };
}
