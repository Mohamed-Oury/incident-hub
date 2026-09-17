export interface EmvTagDefinition {
  tag: string;
  name: string;
  format: "HEX" | "ASCII" | "BINARY" | "NUMERIC";
  length: string;
  description: string;
  criticalForOperator: boolean;
  diagnosticTip: string;
}

export const EMV_TAG_DICTIONARY: Record<string, EmvTagDefinition> = {
  "4F": {
    tag: "4F",
    name: "Application Identifier (AID)",
    format: "HEX",
    length: "5-16 bytes",
    description: "Identifiant international de l'application carte (ex: A0000000031010 pour Visa Credit, A0000000041010 pour Mastercard).",
    criticalForOperator: true,
    diagnosticTip: "Si l'AID est absent ou non supporté par le terminal (TAC/IAC), la transaction est rejetée immédiatement sans contact avec le Switch."
  },
  "50": {
    tag: "50",
    name: "Application Label",
    format: "ASCII",
    length: "1-16 bytes",
    description: "Nom commercial imprimable de l'application (ex: 'VISA DEBIT', 'MASTERCARD').",
    criticalForOperator: false,
    diagnosticTip: "Utilisé pour l'affichage sur l'écran client et l'impression sur ticket."
  },
  "57": {
    tag: "57",
    name: "Track 2 Equivalent Data",
    format: "HEX",
    length: "up to 19 bytes",
    description: "Données équivalentes à la piste 2 magnétique stockées dans la puce (PAN + Date expiration + Service Code).",
    criticalForOperator: true,
    diagnosticTip: "Doit obligatoirement être masqué dans les journaux d'audit (conformité PCI-DSS)."
  },
  "5A": {
    tag: "5A",
    name: "Application Primary Account Number (PAN)",
    format: "NUMERIC",
    length: "up to 19 digits",
    description: "Numéro de carte porteur extrait de la puce EMV.",
    criticalForOperator: true,
    diagnosticTip: "Vérifier la concordance exacte avec le PAN transmis dans le champ ISO DE2."
  },
  "82": {
    tag: "82",
    name: "Application Interchange Profile (AIP)",
    format: "HEX",
    length: "2 bytes",
    description: "Indique les fonctions de sécurité supportées par la carte (SDA, DDA, CDA, Cardholder Verification, Terminal Risk Management).",
    criticalForOperator: true,
    diagnosticTip: "Si l'octet 1 bit 6 (DDA) est à 0 et que le terminal impose le DDA, la transaction bascule en dégradé ou refuse le mode hors-ligne."
  },
  "84": {
    tag: "84",
    name: "Dedicated File (DF) Name",
    format: "HEX",
    length: "5-16 bytes",
    description: "Identifiant du fichier application sélectionné dans la puce.",
    criticalForOperator: false,
    diagnosticTip: "Correspond généralement à l'AID complet exécuté par le lecteur."
  },
  "8A": {
    tag: "8A",
    name: "Authorization Response Code (ARC)",
    format: "ASCII",
    length: "2 bytes",
    description: "Code réponse retourné par l'émetteur ou généré par le terminal pour le script puce (ex: '00', 'Z3', 'Y1').",
    criticalForOperator: true,
    diagnosticTip: "Indispensable dans la trame 0210/0110 pour permettre à la carte de valider la réponse émetteur."
  },
  "95": {
    tag: "95",
    name: "Terminal Verification Results (TVR)",
    format: "BINARY",
    length: "5 bytes (40 bits)",
    description: "État de conformité et résultats des contrôles de sécurité exécutés par le terminal durant la transaction EMV.",
    criticalForOperator: true,
    diagnosticTip: "Le champ d'analyse N°1 en exploitation EMV ! Chaque bit explique précisément une anomalie (PIN faux, puce expirée, contrôle offline échoué)."
  },
  "9B": {
    tag: "9B",
    name: "Transaction Status Information (TSI)",
    format: "BINARY",
    length: "2 bytes (16 bits)",
    description: "Indique quelles étapes de sécurité EMV ont été réellement exécutées (authentification, vérification porteur, gestion des risques).",
    criticalForOperator: true,
    diagnosticTip: "Permet de vérifier si le contrôle offline (CAM) ou la saisie PIN en ligne a bien été tenté par le terminal."
  },
  "9F02": {
    tag: "9F02",
    name: "Amount, Authorized (Numeric)",
    format: "NUMERIC",
    length: "6 bytes (12 digits)",
    description: "Montant autorisé encodé dans la puce (ex: 000000050000 pour 500.00).",
    criticalForOperator: true,
    diagnosticTip: "Doit être rigoureusement identique au montant présent dans le champ ISO DE4 pour que l'ARQC soit valide."
  },
  "9F03": {
    tag: "9F03",
    name: "Amount, Other (Numeric)",
    format: "NUMERIC",
    length: "6 bytes (12 digits)",
    description: "Montant secondaire ou cashback associé à l'opération.",
    criticalForOperator: false,
    diagnosticTip: "Utilisé lors de retraits avec rendu d'espèces chez les commerçants."
  },
  "9F10": {
    tag: "9F10",
    name: "Issuer Application Data (IAD / CVR)",
    format: "HEX",
    length: "up to 32 bytes",
    description: "Données propriétaires de l'émetteur contenant notamment le CVR (Card Verification Results) et le compteur de PIN faux.",
    criticalForOperator: true,
    diagnosticTip: "Contient le statut interne de la puce : compteur d'essais PIN restants et décision de l'automate interne de la carte."
  },
  "9F1A": {
    tag: "9F1A",
    name: "Terminal Country Code",
    format: "NUMERIC",
    length: "2 bytes (3 digits)",
    description: "Code pays ISO du terminal (ex: 0840 pour USA, 0952/0250 pour zone UEMOA/Afrique de l'Ouest, 0250 France).",
    criticalForOperator: false,
    diagnosticTip: "Doit concorder avec le pays d'acquisition du DE19."
  },
  "9F26": {
    tag: "9F26",
    name: "Application Cryptogram (ARQC / TC / AAC)",
    format: "HEX",
    length: "8 bytes",
    description: "Signature cryptographique dynamique générée par la puce (ARQC en demande d'autorisation, TC en accord offline, AAC en refus).",
    criticalForOperator: true,
    diagnosticTip: "Vérifié par le serveur d'autorisation via le HSM émetteur. Si le HSM rejette l'ARQC, le DE39 retourne '55' ou '05' !"
  },
  "9F27": {
    tag: "9F27",
    name: "Cryptogram Information Data (CID)",
    format: "HEX",
    length: "1 byte",
    description: "Indique le type de cryptogramme généré par la carte (80=ARQC demande online, 40=TC accord local, 00=AAC refus local).",
    criticalForOperator: true,
    diagnosticTip: "Permet de savoir si la carte exigeait impérativement une autorisation en ligne ou acceptait le mode hors-ligne."
  },
  "9F36": {
    tag: "9F36",
    name: "Application Transaction Counter (ATC)",
    format: "HEX",
    length: "2 bytes",
    description: "Compteur séquentiel de transactions incrémenté par la puce à chaque utilisation.",
    criticalForOperator: true,
    diagnosticTip: "Surveillance de fraude (rejeu/replay attack). Si l'ATC reçu est inférieur ou égal à l'ATC précédent, le Switch rejette la transaction !"
  },
  "9F37": {
    tag: "9F37",
    name: "Unpredictable Number (UN)",
    format: "HEX",
    length: "4 bytes",
    description: "Nombre aléatoire généré par le terminal pour garantir l'unicité du cryptogramme ARQC.",
    criticalForOperator: true,
    diagnosticTip: "Si le générateur aléatoire du terminal est défaillant, le HSM émetteur échouera systématiquement la vérification ARQC."
  }
};

export interface TvrBitExplanation {
  byte: number;
  bit: number;
  label: string;
  meaning: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
}

export const TVR_BITS_SPEC: TvrBitExplanation[] = [
  // Octet 1 : Authentification de la carte
  { byte: 1, bit: 8, label: "Offline data authentication was not performed", meaning: "Aucune authentification hors-ligne (SDA/DDA) n'a été effectuée.", severity: "INFO" },
  { byte: 1, bit: 7, label: "SDA failed", meaning: "Échec de l'authentification statique des données (SDA).", severity: "CRITICAL" },
  { byte: 1, bit: 6, label: "ICC data missing", meaning: "Données obligatoires manquantes dans la puce.", severity: "CRITICAL" },
  { byte: 1, bit: 5, label: "Card on exception file", meaning: "Carte présente sur la liste noire locale du terminal.", severity: "CRITICAL" },
  { byte: 1, bit: 4, label: "DDA failed", meaning: "Échec de l'authentification dynamique des données (DDA). Clé publique corrompue ou puce compromise.", severity: "CRITICAL" },
  { byte: 1, bit: 3, label: "CDA failed", meaning: "Échec de l'authentification combinée DDA/Génération de cryptogramme (CDA).", severity: "CRITICAL" },

  // Octet 2 : Contrôle d'application
  { byte: 2, bit: 8, label: "ICC and terminal have different versions", meaning: "Version de l'application carte différente de celle du terminal.", severity: "INFO" },
  { byte: 2, bit: 7, label: "Expired application", meaning: "Carte expirée au moment de la transaction.", severity: "CRITICAL" },
  { byte: 2, bit: 6, label: "Application not yet effective", meaning: "La date de début de validité de la carte n'est pas encore atteinte.", severity: "CRITICAL" },
  { byte: 2, bit: 5, label: "Requested service not allowed", meaning: "Service non autorisé pour ce type de carte (ex: retrait international interdit).", severity: "WARNING" },
  { byte: 2, bit: 4, label: "New card", meaning: "Première utilisation de la carte.", severity: "INFO" },

  // Octet 3 : Vérification du porteur (CVM)
  { byte: 3, bit: 8, label: "Cardholder verification was not successful", meaning: "Échec global de la méthode de vérification du porteur (PIN ou signature).", severity: "CRITICAL" },
  { byte: 3, bit: 7, label: "Unrecognised CVM", meaning: "Méthode de vérification CVM inconnue du terminal.", severity: "WARNING" },
  { byte: 3, bit: 6, label: "PIN try limit exceeded", meaning: "Compteur d'essais PIN dépassé (3 codes faux consécutifs). Puce verrouillée !", severity: "CRITICAL" },
  { byte: 3, bit: 5, label: "PIN entry required and PIN pad not present", meaning: "Saisie PIN requise mais le terminal ne possède pas de PIN Pad sécurisé.", severity: "CRITICAL" },
  { byte: 3, bit: 4, label: "PIN entry required, PIN pad present, but PIN was not entered", meaning: "PIN requis et clavier présent, mais le porteur n'a pas composé son code.", severity: "WARNING" },
  { byte: 3, bit: 3, label: "Online PIN entered", meaning: "Le code PIN a été saisi et chiffré pour vérification en ligne par l'hôte.", severity: "INFO" },

  // Octet 4 : Gestion des risques du terminal (TRM)
  { byte: 4, bit: 8, label: "Transaction exceeds floor limit", meaning: "Montant supérieur au plafond plancher (Floor Limit). Autorisation en ligne obligatoire.", severity: "WARNING" },
  { byte: 4, bit: 7, label: "Lower consecutive offline limit exceeded", meaning: "Nombre limite de transactions hors-ligne consécutives dépassé.", severity: "WARNING" },
  { byte: 4, bit: 6, label: "Upper consecutive offline limit exceeded", meaning: "Plafond supérieur de transactions offline consécutives dépassé.", severity: "WARNING" },
  { byte: 4, bit: 5, label: "Transaction selected randomly for online processing", meaning: "Transaction sélectionnée aléatoirement pour contrôle en ligne.", severity: "INFO" },
  { byte: 4, bit: 4, label: "Merchant forced transaction online", meaning: "Le commerçant a forcé l'appel d'autorisation en ligne manuellement.", severity: "INFO" },

  // Octet 5 : Décision terminal
  { byte: 5, bit: 8, label: "Default TDOL used", meaning: "Liste TDOL par défaut utilisée par le terminal.", severity: "INFO" },
  { byte: 5, bit: 7, label: "Issuer authentication failed", meaning: "Échec de l'authentification de l'émetteur (ARPC invalide retourné par l'hôte).", severity: "CRITICAL" },
  { byte: 5, bit: 6, label: "Script processing failed before final GENERATE AC", meaning: "Échec d'exécution du script de mise à jour de la puce avant finalisation.", severity: "CRITICAL" },
  { byte: 5, bit: 5, label: "Script processing failed after final GENERATE AC", meaning: "Échec d'exécution du script de mise à jour de la puce après finalisation.", severity: "CRITICAL" },
];
