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
  1: { de: 1, name: "Secondary Bit Map", format: "b 64", lengthType: "FIXED", maxLength: 16, category: "RESEAU", description: "Indique la présence des champs étendus DE65 à DE128 (16 car. hex)." },
  2: { de: 2, name: "Primary Account Number (PAN)", format: "n ..19", lengthType: "LLVAR", maxLength: 19, category: "DONNEES_CARTE", description: "Numéro de la carte du porteur (doit être masqué PCI-DSS)." },
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
  20: { de: 20, name: "Country Code, Primary Account Number", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "IDENTIFICATION", description: "Code ISO pays de la carte/émetteur." },
  21: { de: 21, name: "Country Code, Forwarding Institution", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "IDENTIFICATION", description: "Code ISO pays de l'organisme expéditeur." },
  22: { de: 22, name: "Point of Service Entry Mode (POS Entry Mode)", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "DONNEES_CARTE", description: "Mode de lecture carte (051 Puce avec PIN, 021 Piste, 071 Sans contact)." },
  23: { de: 23, name: "Card Sequence Number (PAN Sequence)", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "DONNEES_CARTE", description: "Numéro de séquence de la carte (CSN)." },
  24: { de: 24, name: "Function Code (Network Info)", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "RESEAU", description: "Code fonction réseau (ex: 200 message original)." },
  25: { de: 25, name: "Point of Service Condition Code", format: "n 2", lengthType: "FIXED", maxLength: 2, category: "TERMINAL", description: "Condition du point de vente (00 Normal, 08 Mail/Phone)." },
  26: { de: 26, name: "Point of Service PIN Capture Code", format: "n 2", lengthType: "FIXED", maxLength: 2, category: "SECURITE", description: "Capacité de saisie PIN du terminal." },
  27: { de: 27, name: "Authorizing Identification Response Length", format: "n 1", lengthType: "FIXED", maxLength: 1, category: "IDENTIFICATION", description: "Longueur du code d'autorisation émetteur." },
  28: { de: 28, name: "Amount, Transaction Fee", format: "x+n 8", lengthType: "FIXED", maxLength: 9, category: "MONTANT", description: "Montant des frais de transaction." },
  29: { de: 29, name: "Amount, Settlement Fee", format: "x+n 8", lengthType: "FIXED", maxLength: 9, category: "MONTANT", description: "Montant des frais de compensation." },
  30: { de: 30, name: "Amount, Transaction Processing Fee", format: "x+n 8", lengthType: "FIXED", maxLength: 9, category: "MONTANT", description: "Montant des frais de traitement de transaction." },
  31: { de: 31, name: "Amount, Settlement Processing Fee", format: "x+n 8", lengthType: "FIXED", maxLength: 9, category: "MONTANT", description: "Montant des frais de traitement de compensation." },
  32: { de: 32, name: "Acquiring Institution Identification Code", format: "n ..11", lengthType: "LLVAR", maxLength: 11, category: "IDENTIFICATION", description: "Code d'identification de la banque acquéreuse." },
  33: { de: 33, name: "Forwarding Institution Identification Code", format: "n ..11", lengthType: "LLVAR", maxLength: 11, category: "IDENTIFICATION", description: "Code de la banque ou switch relais." },
  34: { de: 34, name: "Extended Primary Account Number", format: "n ..28", lengthType: "LLVAR", maxLength: 28, category: "DONNEES_CARTE", description: "Numéro de compte principal étendu." },
  35: { de: 35, name: "Track 2 Data", format: "z ..37", lengthType: "LLVAR", maxLength: 37, category: "DONNEES_CARTE", description: "Piste 2 magnétique ou équivalent puce." },
  36: { de: 36, name: "Track 3 Data", format: "n ..104", lengthType: "LLLVAR", maxLength: 104, category: "DONNEES_CARTE", description: "Données de piste magnétique 3." },
  37: { de: 37, name: "Retrieval Reference Number (RRN)", format: "an 12", lengthType: "FIXED", maxLength: 12, category: "TRACE", description: "Référence unique globale de la transaction." },
  38: { de: 38, name: "Authorization Identification Response", format: "an 6", lengthType: "FIXED", maxLength: 6, category: "IDENTIFICATION", description: "Numéro d'autorisation délivré par l'émetteur." },
  39: { de: 39, name: "Response Code", format: "an 2", lengthType: "FIXED", maxLength: 2, category: "TRACE", description: "Code retour d'approbation ou de rejet (ex: 00, 51, 91)." },
  40: { de: 40, name: "Service Restriction Code", format: "an 3", lengthType: "FIXED", maxLength: 3, category: "DONNEES_CARTE", description: "Code de restriction de service." },
  41: { de: 41, name: "Card Acceptor Terminal Identification (TID)", format: "ans 8", lengthType: "FIXED", maxLength: 8, category: "TERMINAL", description: "Identifiant du terminal (GAB ou TPE)." },
  42: { de: 42, name: "Card Acceptor Identification Code (MID)", format: "ans 15", lengthType: "FIXED", maxLength: 15, category: "TERMINAL", description: "Identifiant commerçant ou agence." },
  43: { de: 43, name: "Card Acceptor Name/Location", format: "ans 40", lengthType: "FIXED", maxLength: 40, category: "TERMINAL", description: "Nom et localisation de l'établissement." },
  44: { de: 44, name: "Additional Response Data", format: "an ..25", lengthType: "LLVAR", maxLength: 25, category: "TRACE", description: "Données de réponse complémentaires." },
  45: { de: 45, name: "Track 1 Data", format: "ans ..76", lengthType: "LLVAR", maxLength: 76, category: "DONNEES_CARTE", description: "Piste 1 magnétique (Nom porteur + PAN, sensible PCI-DSS)." },
  46: { de: 46, name: "Additional Data - ISO", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "MONTANT", description: "Données et montants additionnels ISO." },
  47: { de: 47, name: "Additional Data - National", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Données additionnelles réservées au réseau national." },
  48: { de: 48, name: "Additional Data - Private", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Données privatives réseau / Switch." },
  49: { de: 49, name: "Currency Code, Transaction", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "MONTANT", description: "Code ISO devise de transaction (ex: 952 XOF, 978 EUR)." },
  50: { de: 50, name: "Currency Code, Settlement", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "MONTANT", description: "Code devise de compensation." },
  51: { de: 51, name: "Currency Code, Cardholder Billing", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "MONTANT", description: "Code devise facturation porteur." },
  52: { de: 52, name: "Personal Identification Number (PIN) Data", format: "b 64", lengthType: "FIXED", maxLength: 16, category: "SECURITE", description: "PIN Block chiffré (16 caractères hex / 8 octets - sensible PCI-DSS)." },
  53: { de: 53, name: "Security Related Control Information", format: "n 16", lengthType: "FIXED", maxLength: 16, category: "SECURITE", description: "Index clé et algo de sécurité." },
  54: { de: 54, name: "Additional Amounts", format: "an ..120", lengthType: "LLLVAR", maxLength: 120, category: "MONTANT", description: "Soldes compte (Solde comptable, solde disponible)." },
  55: { de: 55, name: "Integrated Circuit Card (ICC) / EMV Data", format: "b ..999", lengthType: "LLLVAR", maxLength: 999, category: "DONNEES_CARTE", description: "Tags EMV complets (ARQC, TC, TVR, AID...)." },
  56: { de: 56, name: "Original Data Elements / Reserved ISO", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "TRACE", description: "Éléments de données d'origine réservés ISO." },
  57: { de: 57, name: "Authorization Life Cycle Code", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "TRACE", description: "Code de cycle de vie d'autorisation." },
  58: { de: 58, name: "Authorizing Agent Institution Id", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "IDENTIFICATION", description: "Identifiant de l'institution agent d'autorisation." },
  59: { de: 59, name: "Transport Data", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Données de transport géographiques." },
  60: { de: 60, name: "Advice / Terminal Reason Code", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "TERMINAL", description: "Données terminal et informations privées." },
  61: { de: 61, name: "Point of Service (POS) Data Code", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "TERMINAL", description: "Caractéristiques détaillées du point d'acceptation." },
  62: { de: 62, name: "Intermediate Network Facility Data", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Données privatives réseau intermédiaire." },
  63: { de: 63, name: "Network Data", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Informations de routage et switch." },
  64: { de: 64, name: "Message Authentication Code (MAC)", format: "b 64", lengthType: "FIXED", maxLength: 16, category: "SECURITE", description: "Signature cryptographique du message primaire (16 car. hex)." },
  65: { de: 65, name: "Tertiary Bitmap / Extended Bitmap Indicator", format: "b 64", lengthType: "FIXED", maxLength: 16, category: "RESEAU", description: "Indicateur de bitmap tertiaire (DE129 à DE192)." },
  66: { de: 66, name: "Settlement Code", format: "n 1", lengthType: "FIXED", maxLength: 1, category: "TRACE", description: "Code de règlement/compensation." },
  67: { de: 67, name: "Extended Payment Code", format: "n 2", lengthType: "FIXED", maxLength: 2, category: "TRACE", description: "Code de paiement étendu." },
  68: { de: 68, name: "Receiving Institution Country Code", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "IDENTIFICATION", description: "Code ISO pays de l'institution réceptrice." },
  69: { de: 69, name: "Settlement Institution Country Code", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "IDENTIFICATION", description: "Code ISO pays de l'institution de compensation." },
  70: { de: 70, name: "Network Management Information Code", format: "n 3", lengthType: "FIXED", maxLength: 3, category: "RESEAU", description: "Code fonction gestion réseau (ex: 001 Echo, 101 Sign-on)." },
  71: { de: 71, name: "Message Number", format: "n 4", lengthType: "FIXED", maxLength: 4, category: "RESEAU", description: "Numéro de séquence du message." },
  72: { de: 72, name: "Message Number, Last", format: "n 4", lengthType: "FIXED", maxLength: 4, category: "RESEAU", description: "Numéro du dernier message dans le lot." },
  73: { de: 73, name: "Date, Action", format: "n 6", lengthType: "FIXED", maxLength: 6, category: "TRACE", description: "Date d'action (YYMMDD)." },
  74: { de: 74, name: "Credits, Number", format: "n 10", lengthType: "FIXED", maxLength: 10, category: "MONTANT", description: "Nombre total d'opérations de crédit." },
  75: { de: 75, name: "Credits, Reversal Number", format: "n 10", lengthType: "FIXED", maxLength: 10, category: "MONTANT", description: "Nombre total d'extournes de crédit." },
  76: { de: 76, name: "Debits, Number", format: "n 10", lengthType: "FIXED", maxLength: 10, category: "MONTANT", description: "Nombre total d'opérations de débit." },
  77: { de: 77, name: "Debits, Reversal Number", format: "n 10", lengthType: "FIXED", maxLength: 10, category: "MONTANT", description: "Nombre total d'extournes de débit." },
  78: { de: 78, name: "Transfer, Number", format: "n 10", lengthType: "FIXED", maxLength: 10, category: "MONTANT", description: "Nombre total de transferts." },
  79: { de: 79, name: "Transfer, Reversal Number", format: "n 10", lengthType: "FIXED", maxLength: 10, category: "MONTANT", description: "Nombre total d'extournes de transfert." },
  80: { de: 80, name: "Inquiries, Number", format: "n 10", lengthType: "FIXED", maxLength: 10, category: "MONTANT", description: "Nombre total de consultations." },
  81: { de: 81, name: "Authorizations, Number", format: "n 10", lengthType: "FIXED", maxLength: 10, category: "MONTANT", description: "Nombre total d'autorisations." },
  82: { de: 82, name: "Credits, Processing Fee Amount", format: "n 12", lengthType: "FIXED", maxLength: 12, category: "MONTANT", description: "Frais de traitement des crédits." },
  83: { de: 83, name: "Credits, Transaction Fee Amount", format: "n 12", lengthType: "FIXED", maxLength: 12, category: "MONTANT", description: "Frais de transaction des crédits." },
  84: { de: 84, name: "Debits, Processing Fee Amount", format: "n 12", lengthType: "FIXED", maxLength: 12, category: "MONTANT", description: "Frais de traitement des débits." },
  85: { de: 85, name: "Debits, Transaction Fee Amount", format: "n 12", lengthType: "FIXED", maxLength: 12, category: "MONTANT", description: "Frais de transaction des débits." },
  86: { de: 86, name: "Credits, Amount", format: "n 16", lengthType: "FIXED", maxLength: 16, category: "MONTANT", description: "Montant cumulé des crédits." },
  87: { de: 87, name: "Credits, Reversal Amount", format: "n 16", lengthType: "FIXED", maxLength: 16, category: "MONTANT", description: "Montant cumulé des extournes de crédits." },
  88: { de: 88, name: "Debits, Amount", format: "n 16", lengthType: "FIXED", maxLength: 16, category: "MONTANT", description: "Montant cumulé des débits." },
  89: { de: 89, name: "Debits, Reversal Amount", format: "n 16", lengthType: "FIXED", maxLength: 16, category: "MONTANT", description: "Montant cumulé des extournes de débits." },
  90: { de: 90, name: "Original Data Elements", format: "n 42", lengthType: "FIXED", maxLength: 42, category: "TRACE", description: "Données du message d'origine lors d'un Reversal 0400." },
  91: { de: 91, name: "File Update Code", format: "an 1", lengthType: "FIXED", maxLength: 1, category: "TRACE", description: "Code de mise à jour de fichier." },
  92: { de: 92, name: "File Security Code", format: "an 2", lengthType: "FIXED", maxLength: 2, category: "SECURITE", description: "Code de sécurité de fichier." },
  93: { de: 93, name: "Response Indicator", format: "an 5", lengthType: "FIXED", maxLength: 5, category: "TRACE", description: "Indicateur de réponse." },
  94: { de: 94, name: "Service Indicator", format: "an 7", lengthType: "FIXED", maxLength: 7, category: "RESEAU", description: "Indicateur de service." },
  95: { de: 95, name: "Replacement Amounts", format: "an 42", lengthType: "FIXED", maxLength: 42, category: "MONTANT", description: "Montants réels distribués lors d'un Reversal partiel." },
  96: { de: 96, name: "Message Security Code", format: "b 64", lengthType: "FIXED", maxLength: 16, category: "SECURITE", description: "Code de sécurité du message / Gestion de clés (16 car. hex)." },
  97: { de: 97, name: "Amount, Net Settlement", format: "x+n 16", lengthType: "FIXED", maxLength: 17, category: "MONTANT", description: "Montant net de compensation avec signe." },
  98: { de: 98, name: "Payee", format: "ans 25", lengthType: "FIXED", maxLength: 25, category: "IDENTIFICATION", description: "Bénéficiaire du paiement." },
  99: { de: 99, name: "Settlement Institution Identification Code", format: "n ..11", lengthType: "LLVAR", maxLength: 11, category: "IDENTIFICATION", description: "Code de l'institution de compensation." },
  100: { de: 100, name: "Receiving Institution Identification Code", format: "n ..11", lengthType: "LLVAR", maxLength: 11, category: "IDENTIFICATION", description: "Code banque réceptrice." },
  101: { de: 101, name: "File Name", format: "ans ..17", lengthType: "LLVAR", maxLength: 17, category: "TRACE", description: "Nom du fichier échangé." },
  102: { de: 102, name: "Account Identification 1", format: "ans ..28", lengthType: "LLVAR", maxLength: 28, category: "IDENTIFICATION", description: "Numéro de compte source (RIB/IBAN)." },
  103: { de: 103, name: "Account Identification 2", format: "ans ..28", lengthType: "LLVAR", maxLength: 28, category: "IDENTIFICATION", description: "Numéro de compte cible (virement)." },
  104: { de: 104, name: "Transaction Description", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "TRACE", description: "Description textuelle de la transaction." },
  105: { de: 105, name: "Reserved for ISO use", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Champ réservé à l'usage ISO." },
  106: { de: 106, name: "Reserved for ISO use", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Champ réservé à l'usage ISO." },
  107: { de: 107, name: "Reserved for ISO use", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Champ réservé à l'usage ISO." },
  108: { de: 108, name: "Reserved for ISO use", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Champ réservé à l'usage ISO." },
  109: { de: 109, name: "Reserved for ISO use", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Champ réservé à l'usage ISO." },
  110: { de: 110, name: "Reserved for ISO use", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Champ réservé à l'usage ISO." },
  111: { de: 111, name: "Reserved for ISO use", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Champ réservé à l'usage ISO." },
  112: { de: 112, name: "Reserved for National use", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Champ réservé à l'usage National." },
  113: { de: 113, name: "Reserved for National use", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Champ réservé à l'usage National." },
  114: { de: 114, name: "Reserved for National use", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Champ réservé à l'usage National." },
  115: { de: 115, name: "Reserved for National use", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Champ réservé à l'usage National." },
  116: { de: 116, name: "Reserved for National use", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Champ réservé à l'usage National." },
  117: { de: 117, name: "Reserved for National use", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Champ réservé à l'usage National." },
  118: { de: 118, name: "Reserved for National use", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Champ réservé à l'usage National." },
  119: { de: 119, name: "Reserved for National use", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Champ réservé à l'usage National." },
  120: { de: 120, name: "Record Data / Private", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Données privées d'enregistrement." },
  121: { de: 121, name: "Authorizing Agent Institution Id", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "IDENTIFICATION", description: "Identifiant de l'institution agent d'autorisation." },
  122: { de: 122, name: "Additional Data - Private", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Données additionnelles privatives." },
  123: { de: 123, name: "POS / Verification Data", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "SECURITE", description: "Données de vérification canal et capacités étendues POS." },
  124: { de: 124, name: "Additional Data - Private", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Données privatives complémentaires." },
  125: { de: 125, name: "Network Management - Private", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Informations de gestion de réseau privatives." },
  126: { de: 126, name: "Pre-authorization & Issuer Data", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "TRACE", description: "Données de pré-autorisation et émetteur." },
  127: { de: 127, name: "Private Data / Switch Data", format: "ans ..999", lengthType: "LLLVAR", maxLength: 999, category: "RESEAU", description: "Données privatives Switch / Postilion / Base24." },
  128: { de: 128, name: "Message Authentication Code (Secondary MAC)", format: "b 64", lengthType: "FIXED", maxLength: 16, category: "SECURITE", description: "MAC secondaire calculé sur DE65 à DE127 (16 car. hex)." },
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
