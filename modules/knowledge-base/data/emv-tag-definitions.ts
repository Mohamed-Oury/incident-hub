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
  "42": {
    tag: "42",
    name: "Issuer Identification Number (IIN / BIN)",
    format: "NUMERIC",
    length: "3 bytes (6 digits)",
    description: "Numéro d'identification de l'émetteur (6 premiers chiffres de la carte ou BIN bancaire).",
    criticalForOperator: true,
    diagnosticTip: "Permet d'identifier la banque émettrice et d'orienter le routage dans le Switch monétique."
  },
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
    description: "Nom commercial imprimable de l'application (ex: 'VISA DEBIT', 'MASTERCARD', 'GIM-UEMOA').",
    criticalForOperator: false,
    diagnosticTip: "Utilisé pour l'affichage sur l'écran client et l'impression sur le ticket de caisse ou ticket GAB."
  },
  "57": {
    tag: "57",
    name: "Track 2 Equivalent Data",
    format: "HEX",
    length: "up to 19 bytes",
    description: "Données équivalentes à la piste 2 magnétique stockées dans la puce (PAN + Séparateur D + Date expiration YYMM + Service Code).",
    criticalForOperator: true,
    diagnosticTip: "Doit obligatoirement être masqué dans les journaux d'audit (conformité stricte PCI-DSS)."
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
  "5F20": {
    tag: "5F20",
    name: "Cardholder Name",
    format: "ASCII",
    length: "2-26 bytes",
    description: "Nom et prénom du porteur gravés sur la carte et enregistrés dans la puce.",
    criticalForOperator: false,
    diagnosticTip: "Utilisé lors des contrôles d'identité en agence ou pour l'authentification client."
  },
  "5F24": {
    tag: "5F24",
    name: "Application Expiration Date",
    format: "NUMERIC",
    length: "3 bytes (YYMMDD)",
    description: "Date d'expiration de l'application carte au format AAMMJJ.",
    criticalForOperator: true,
    diagnosticTip: "Si la date système du terminal dépasse cette valeur, le bit 'Expired Application' du TVR (Octet 2 bit 7) s'active."
  },
  "5F25": {
    tag: "5F25",
    name: "Application Effective Date",
    format: "NUMERIC",
    length: "3 bytes (YYMMDD)",
    description: "Date de début de validité de l'application au format AAMMJJ.",
    criticalForOperator: false,
    diagnosticTip: "Si la transaction intervient avant cette date, le TVR active 'Application not yet effective' (Octet 2 bit 6)."
  },
  "5F28": {
    tag: "5F28",
    name: "Issuer Country Code",
    format: "NUMERIC",
    length: "2 bytes (3 digits)",
    description: "Code pays ISO 3166-1 numérique de la banque émettrice de la carte (ex: 0840 USA, 0250 France, 0952 UEMOA/Sénégal).",
    criticalForOperator: false,
    diagnosticTip: "Permet de déterminer si l'opération est domestique ou internationale pour l'application des frais de commission."
  },
  "5F2A": {
    tag: "5F2A",
    name: "Transaction Currency Code",
    format: "NUMERIC",
    length: "2 bytes (3 digits)",
    description: "Code devise de la transaction selon ISO 4217 (ex: 0952 XOF, 0978 EUR, 0840 USD, 0504 MAD).",
    criticalForOperator: true,
    diagnosticTip: "Doit concorder rigoureusement avec le champ ISO DE49 pour garantir la validité du cryptogramme ARQC."
  },
  "5F2D": {
    tag: "5F2D",
    name: "Language Preference",
    format: "ASCII",
    length: "2-8 bytes",
    description: "Code langue préféré du porteur selon ISO 639-1 (ex: 'fr', 'en', 'ar').",
    criticalForOperator: false,
    diagnosticTip: "Permet au terminal et à l'automate d'adapter automatiquement la langue des menus et reçus."
  },
  "5F30": {
    tag: "5F30",
    name: "Service Code",
    format: "NUMERIC",
    length: "2 bytes (3 digits)",
    description: "Code de service déterminant les règles d'utilisation de la carte (ex: 201 = International avec puce, PIN obligatoire).",
    criticalForOperator: true,
    diagnosticTip: "Si le 1er chiffre commence par 2 ou 6, la carte dispose d'une puce EMV et interdit le repli magnétique sans motif valable."
  },
  "5F34": {
    tag: "5F34",
    name: "Application Primary Account Number (PAN) Sequence Number (PSN)",
    format: "NUMERIC",
    length: "1 byte (2 digits)",
    description: "Numéro de séquence de la carte pour distinguer plusieurs cartes associées au même compte (ex: 01, 02).",
    criticalForOperator: true,
    diagnosticTip: "Doit concorder avec le champ ISO DE23. Indispensable pour la dérivation de clé de session HSM émetteur !"
  },
  "5F36": {
    tag: "5F36",
    name: "Transaction Currency Exponent",
    format: "NUMERIC",
    length: "1 byte (1 digit)",
    description: "Nombre de décimales de la devise (ex: 0 pour XOF/XAF/JPY, 2 pour EUR/USD).",
    criticalForOperator: false,
    diagnosticTip: "Utilisé pour la conversion et le cadrage du montant autorisé dans les calculs arithmétiques."
  },
  "5F50": {
    tag: "5F50",
    name: "Issuer URL",
    format: "ASCII",
    length: "Variable",
    description: "Adresse web de la banque émettrice pour le service client ou le portail 3D-Secure.",
    criticalForOperator: false,
    diagnosticTip: "Utilisé dans certaines applications e-commerce pour la redirection client."
  },
  "5F53": {
    tag: "5F53",
    name: "International Bank Account Number (IBAN)",
    format: "ASCII",
    length: "Variable",
    description: "Identifiant international du compte bancaire débité par la carte.",
    criticalForOperator: false,
    diagnosticTip: "Utile pour la réconciliation directe avec le Core Banking (CBS Amplitude)."
  },
  "70": {
    tag: "70",
    name: "EMV Proprietary Template / AEF Data Template",
    format: "HEX",
    length: "Variable",
    description: "Template enveloppe contenant les enregistrements de données privatives de la puce (Records).",
    criticalForOperator: false,
    diagnosticTip: "Conteneur TLV construit contenant d'autres sous-tags EMV."
  },
  "71": {
    tag: "71",
    name: "Issuer Script Template 1",
    format: "HEX",
    length: "Variable",
    description: "Commandes de script émetteur exécutées par le terminal avant l'émission de la commande GENERATE AC finale.",
    criticalForOperator: true,
    diagnosticTip: "Utilisé pour modifier les plafonds ou mettre à jour les tables de risque avant clôture de la transaction."
  },
  "72": {
    tag: "72",
    name: "Issuer Script Template 2",
    format: "HEX",
    length: "Variable",
    description: "Commandes de script émetteur exécutées après l'émission de la commande GENERATE AC finale (déblocage PIN, mise à jour solde puce).",
    criticalForOperator: true,
    diagnosticTip: "Transmis dans la réponse ISO 0210/0110 pour débloquer le compteur de PIN faux (Unblock PIN) ou réinitialiser le compteur de transactions."
  },
  "77": {
    tag: "77",
    name: "Response Message Template Format 2",
    format: "HEX",
    length: "Variable",
    description: "Structure de données TLV retournée par la carte en réponse aux commandes APDU (ex: GENERATE AC).",
    criticalForOperator: false,
    diagnosticTip: "Template construit encapsulant le cryptogramme 9F26, le CID 9F27, l'ATC 9F36 et l'IAD 9F10."
  },
  "80": {
    tag: "80",
    name: "Response Message Template Format 1",
    format: "HEX",
    length: "Variable",
    description: "Structure de données brutes retournée par la carte en réponse à Get Processing Options (GPO).",
    criticalForOperator: false,
    diagnosticTip: "Contient généralement l'AIP (2 octets) suivi de l'AFL (Application File Locator)."
  },
  "82": {
    tag: "82",
    name: "Application Interchange Profile (AIP)",
    format: "HEX",
    length: "2 bytes",
    description: "Indique les fonctions de sécurité supportées par la carte (SDA, DDA, CDA, Cardholder Verification, Terminal Risk Management).",
    criticalForOperator: true,
    diagnosticTip: "Si l'octet 1 bit 6 (DDA) est à 0 et que le terminal impose le DDA, la transaction bascule en mode dégradé ou refuse le mode hors-ligne."
  },
  "84": {
    tag: "84",
    name: "Dedicated File (DF) Name",
    format: "HEX",
    length: "5-16 bytes",
    description: "Identifiant du fichier application sélectionné dans la puce (souvent identique à l'AID).",
    criticalForOperator: false,
    diagnosticTip: "Correspond à l'application sélectionnée lors de l'échange APDU SELECT APPLICATION."
  },
  "8A": {
    tag: "8A",
    name: "Authorization Response Code (ARC)",
    format: "ASCII",
    length: "2 bytes",
    description: "Code réponse retourné par l'émetteur ou généré par le terminal pour le script puce (ex: '00', 'Z3', 'Y1').",
    criticalForOperator: true,
    diagnosticTip: "Indispensable dans la trame 0210/0110 pour permettre à la carte de valider la réponse émetteur et générer le TC final."
  },
  "8C": {
    tag: "8C",
    name: "Card Risk Management Data Object List 1 (CDOL1)",
    format: "HEX",
    length: "Variable",
    description: "Liste des tags et longueurs que le terminal doit transmettre à la carte pour la première commande GENERATE AC (demande ARQC).",
    criticalForOperator: false,
    diagnosticTip: "Définit les éléments nécessaires au calcul du cryptogramme : montant, devise, TVR, date, type de transaction, aléa."
  },
  "8D": {
    tag: "8D",
    name: "Card Risk Management Data Object List 2 (CDOL2)",
    format: "HEX",
    length: "Variable",
    description: "Liste des éléments attendus par la carte pour le 2nd GENERATE AC (après réponse de l'hôte, avec ARC et ARPC).",
    criticalForOperator: false,
    diagnosticTip: "Comprend généralement le code d'autorisation 8A et les données d'authentification émetteur 91."
  },
  "8E": {
    tag: "8E",
    name: "Cardholder Verification Method (CVM) List",
    format: "HEX",
    length: "Variable",
    description: "Règles ordonnées de vérification du porteur programmées dans la puce (ex: PIN offline en priorité, puis PIN online, puis signature).",
    criticalForOperator: true,
    diagnosticTip: "Explique pourquoi le terminal a basculé du PIN vers la signature ou a exigé un PIN en ligne."
  },
  "8F": {
    tag: "8F",
    name: "Certification Authority Public Key Index (CAPKI)",
    format: "HEX",
    length: "1 byte",
    description: "Index de la clé publique de l'autorité de certification (Visa, Mastercard, GIM) stockée dans le terminal.",
    criticalForOperator: true,
    diagnosticTip: "Si l'index n'est pas configuré dans le terminal, l'authentification hors-ligne SDA/DDA échoue immédiatement (TVR bit SDA/DDA failed)."
  },
  "90": {
    tag: "90",
    name: "Issuer Public Key Certificate",
    format: "HEX",
    length: "Variable",
    description: "Certificat de la clé publique émetteur signé par l'autorité de certification de la marque (CA).",
    criticalForOperator: false,
    diagnosticTip: "Vérifié par le terminal à l'aide de la clé publique CA correspondante à l'index 8F."
  },
  "91": {
    tag: "91",
    name: "Issuer Authentication Data (ARPC)",
    format: "HEX",
    length: "8-16 bytes",
    description: "Cryptogramme d'authentification émetteur (ARPC) et code réponse ARC générés par le HSM de la banque émettrice.",
    criticalForOperator: true,
    diagnosticTip: "Si l'ARPC est rejeté par la puce, celle-ci refuse la transaction (génère un AAC) et active le bit 'Issuer authentication failed' du TVR."
  },
  "92": {
    tag: "92",
    name: "Issuer Public Key Remainder",
    format: "HEX",
    length: "Variable",
    description: "Reste de la clé publique émetteur si la longueur excède la capacité du certificat 90.",
    criticalForOperator: false,
    diagnosticTip: "Utilisé lors de la reconstitution de clés RSA de grande longueur (> 1024 bits)."
  },
  "93": {
    tag: "93",
    name: "Signed Static Application Data (SSAD)",
    format: "HEX",
    length: "Variable",
    description: "Signature numérique statique utilisée pour l'authentification SDA de la carte.",
    criticalForOperator: false,
    diagnosticTip: "Permet de vérifier qu'aucun enregistrement critique de la puce n'a été altéré."
  },
  "94": {
    tag: "94",
    name: "Application File Locator (AFL)",
    format: "HEX",
    length: "Variable",
    description: "Indique au terminal quels fichiers et enregistrements (SFI) de la puce doivent être lus durant la transaction.",
    criticalForOperator: false,
    diagnosticTip: "Chaque groupe de 4 octets définit un SFI, le 1er enregistrement, le dernier enregistrement et le nombre d'enregistrements impliqués dans l'authentification."
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
  "97": {
    tag: "97",
    name: "Transaction Certificate Data Object List (TDOL)",
    format: "HEX",
    length: "Variable",
    description: "Liste des données incluses dans le calcul du hash du certificat de transaction (TC).",
    criticalForOperator: false,
    diagnosticTip: "Si la TDOL est absente de la carte, le terminal utilise sa liste par défaut (TVR octet 5 bit 8)."
  },
  "98": {
    tag: "98",
    name: "TC Hash Value",
    format: "HEX",
    length: "20 bytes",
    description: "Empreinte cryptographique SHA-1 générée par le terminal sur les éléments de la TDOL.",
    criticalForOperator: false,
    diagnosticTip: "Preuve irréfutable de l'intégrité de la transaction pour le règlement des litiges."
  },
  "9A": {
    tag: "9A",
    name: "Transaction Date",
    format: "NUMERIC",
    length: "3 bytes (YYMMDD)",
    description: "Date locale de la transaction au format AAMMJJ au niveau du terminal.",
    criticalForOperator: true,
    diagnosticTip: "Doit concorder avec le champ ISO DE13. Utilisé dans le calcul de l'ARQC."
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
  "9C": {
    tag: "9C",
    name: "Transaction Type",
    format: "NUMERIC",
    length: "1 byte (2 digits)",
    description: "Type d'opération EMV (00 = Achat/Débit, 01 = Retrait espèces, 09 = Achat avec cashback, 20 = Remboursement/Crédit, 31 = Consultation solde).",
    criticalForOperator: true,
    diagnosticTip: "Correspond aux deux premiers chiffres du code de traitement ISO DE3 (Processing Code)."
  },
  "9D": {
    tag: "9D",
    name: "Directory Definition File (DDO)",
    format: "HEX",
    length: "Variable",
    description: "Objet de définition de répertoire pour la sélection d'applications selon ISO 7816-4.",
    criticalForOperator: false,
    diagnosticTip: "Utilisé lors de la découverte des applications présentes sur la carte."
  },
  "9F01": {
    tag: "9F01",
    name: "Acquirer Identifier",
    format: "NUMERIC",
    length: "6-11 digits",
    description: "Identifiant international de l'acquéreur (banque propriétaire du terminal ou du GAB).",
    criticalForOperator: false,
    diagnosticTip: "Correspond au champ ISO DE32."
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
    diagnosticTip: "Utilisé lors de retraits avec rendu d'espèces chez les commerçants (Cashback) ou frais de surcharge."
  },
  "9F06": {
    tag: "9F06",
    name: "Application Identifier (AID) - Terminal",
    format: "HEX",
    length: "5-16 bytes",
    description: "Identifiant de l'application supportée par le terminal pour le matching avec la carte.",
    criticalForOperator: false,
    diagnosticTip: "Permet de confirmer que le lecteur et la puce ont sélectionné la même version d'AID."
  },
  "9F07": {
    tag: "9F07",
    name: "Application Usage Control (AUC)",
    format: "BINARY",
    length: "2 bytes",
    description: "Contraintes d'utilisation de la carte programmées par l'émetteur (autorisé sur DAB uniquement, en national, international, commerce, retraits).",
    criticalForOperator: true,
    diagnosticTip: "Si la carte est utilisée sur un service non autorisé (ex: carte de retrait utilisée en e-commerce), le TVR active 'Requested service not allowed'."
  },
  "9F08": {
    tag: "9F08",
    name: "Application Version Number (Card)",
    format: "HEX",
    length: "2 bytes",
    description: "Numéro de version de l'application stockée dans la puce.",
    criticalForOperator: false,
    diagnosticTip: "Comparé avec le tag 9F09 du terminal. Si différent, le bit 'Different versions' du TVR est levé."
  },
  "9F09": {
    tag: "9F09",
    name: "Application Version Number (Terminal)",
    format: "HEX",
    length: "2 bytes",
    description: "Version de l'application EMV active sur le lecteur ou le terminal.",
    criticalForOperator: false,
    diagnosticTip: "Doit être mis à jour régulièrement selon les mandats des réseaux de cartes (Visa/Mastercard)."
  },
  "9F0B": {
    tag: "9F0B",
    name: "Cardholder Name Extended",
    format: "ASCII",
    length: "27-45 bytes",
    description: "Extension du nom du porteur pour les noms longs dépassant 26 caractères.",
    criticalForOperator: false,
    diagnosticTip: "Utilisé lorsque le tag 5F20 est insuffisant pour contenir le nom complet."
  },
  "9F0D": {
    tag: "9F0D",
    name: "Issuer Action Code - Default (IAC-Default)",
    format: "BINARY",
    length: "5 bytes",
    description: "Masque d'action émetteur définissant les anomalies TVR provoquant un refus local si la transaction ne peut aller en ligne.",
    criticalForOperator: true,
    diagnosticTip: "Si le terminal est hors-ligne et qu'un bit du TVR matche l'IAC-Default, la transaction est déclinée localement (AAC)."
  },
  "9F0E": {
    tag: "9F0E",
    name: "Issuer Action Code - Denial (IAC-Denial)",
    format: "BINARY",
    length: "5 bytes",
    description: "Masque d'action émetteur définissant les anomalies TVR provoquant un refus catégorique immédiat (refus absolu sans tentative d'autorisation en ligne).",
    criticalForOperator: true,
    diagnosticTip: "Vérifier si un bit critique (ex: puce sur liste noire, DDA échoué) correspond à ce masque."
  },
  "9F0F": {
    tag: "9F0F",
    name: "Issuer Action Code - Online (IAC-Online)",
    format: "BINARY",
    length: "5 bytes",
    description: "Masque d'action émetteur imposant la demande d'autorisation en ligne vers l'hôte (ARQC) dès qu'un bit TVR coïncide.",
    criticalForOperator: true,
    diagnosticTip: "Explique pourquoi le terminal bascule systématiquement en ligne même sous le seuil plancher (Floor Limit)."
  },
  "9F10": {
    tag: "9F10",
    name: "Issuer Application Data (IAD / CVR)",
    format: "HEX",
    length: "up to 32 bytes",
    description: "Données propriétaires de l'émetteur contenant notamment le CVR (Card Verification Results) et le compteur d'essais PIN restants.",
    criticalForOperator: true,
    diagnosticTip: "Contient le statut interne de la puce : compteur d'essais PIN restants et décision de l'automate interne de la carte."
  },
  "9F11": {
    tag: "9F11",
    name: "Issuer Code Table Index",
    format: "NUMERIC",
    length: "1 byte",
    description: "Index de la table de caractères utilisée pour l'affichage du nom de l'application (ex: ISO 8859).",
    criticalForOperator: false,
    diagnosticTip: "Assure le rendu correct des caractères accentués ou alphabets spécifiques."
  },
  "9F12": {
    tag: "9F12",
    name: "Application Preferred Name",
    format: "ASCII",
    length: "1-16 bytes",
    description: "Nom d'application préféré par l'émetteur pour la langue choisie par le porteur.",
    criticalForOperator: false,
    diagnosticTip: "Affiché sur l'écran de sélection de l'application en cas de carte multi-applicative."
  },
  "9F13": {
    tag: "9F13",
    name: "Last Online Application Transaction Counter (ATC) Register",
    format: "HEX",
    length: "2 bytes",
    description: "Valeur de l'ATC lors de la dernière transaction autorisée en ligne.",
    criticalForOperator: false,
    diagnosticTip: "Permet à l'émetteur de vérifier le nombre de transactions hors-ligne consécutives effectuées."
  },
  "9F14": {
    tag: "9F14",
    name: "Lower Consecutive Offline Limit",
    format: "NUMERIC",
    length: "1 byte",
    description: "Nombre maximal de transactions hors-ligne autorisées sans appel d'autorisation en ligne.",
    criticalForOperator: false,
    diagnosticTip: "Dès que ce seuil est atteint, le TVR active 'Lower consecutive offline limit exceeded'."
  },
  "9F15": {
    tag: "9F15",
    name: "Merchant Category Code (MCC)",
    format: "NUMERIC",
    length: "2 bytes (4 digits)",
    description: "Code d'activité commerciale du commerçant (ex: 6011 pour DAB/GAB, 5411 supermarchés).",
    criticalForOperator: false,
    diagnosticTip: "Doit concorder avec le champ ISO DE18."
  },
  "9F16": {
    tag: "9F16",
    name: "Merchant Identifier",
    format: "ASCII",
    length: "15 bytes",
    description: "Identifiant unique du commerçant sur la plateforme d'acquisition (champ ISO DE42).",
    criticalForOperator: false,
    diagnosticTip: "Utilisé pour la facturation et le règlement des transactions."
  },
  "9F17": {
    tag: "9F17",
    name: "PIN Try Counter (PTC)",
    format: "HEX",
    length: "1 byte",
    description: "Nombre de tentatives de saisie PIN hors-ligne restantes avant le verrouillage définitif de la puce (ex: 03, 02, 01, 00).",
    criticalForOperator: true,
    diagnosticTip: "Si le PTC atteint 0, la carte est bloquée et rejettera tout PIN même correct ! Nécessite un déblocage par script émetteur (Tag 72)."
  },
  "9F1A": {
    tag: "9F1A",
    name: "Terminal Country Code",
    format: "NUMERIC",
    length: "2 bytes (3 digits)",
    description: "Code pays ISO 3166-1 du terminal (ex: 0840 USA, 0250 France, 0952 UEMOA/Sénégal).",
    criticalForOperator: false,
    diagnosticTip: "Doit concorder avec le pays d'acquisition du DE19."
  },
  "9F1E": {
    tag: "9F1E",
    name: "Interface Device (IFD) Serial Number",
    format: "ASCII",
    length: "8 bytes",
    description: "Numéro de série du lecteur physique de carte ou du PIN Pad.",
    criticalForOperator: false,
    diagnosticTip: "Permet de tracer le matériel spécifique en cas d'attaque par skimming ou sabotage."
  },
  "9F21": {
    tag: "9F21",
    name: "Transaction Time",
    format: "NUMERIC",
    length: "3 bytes (HHMMSS)",
    description: "Heure locale de la transaction au format HHMMSS.",
    criticalForOperator: false,
    diagnosticTip: "Concordance avec le champ ISO DE12."
  },
  "9F26": {
    tag: "9F26",
    name: "Application Cryptogram (ARQC / TC / AAC)",
    format: "HEX",
    length: "8 bytes",
    description: "Signature cryptographique dynamique 3DES/AES générée par la puce (ARQC en demande d'autorisation, TC en accord, AAC en refus).",
    criticalForOperator: true,
    diagnosticTip: "Vérifié par le serveur d'autorisation via le HSM émetteur. Si le HSM rejette l'ARQC, le DE39 retourne '55' ou '05' !"
  },
  "9F27": {
    tag: "9F27",
    name: "Cryptogram Information Data (CID)",
    format: "HEX",
    length: "1 byte",
    description: "Indique le type de cryptogramme généré par la carte (80 = ARQC demande online, 40 = TC accord local, 00 = AAC refus local, C0 = AAR renvoi).",
    criticalForOperator: true,
    diagnosticTip: "Permet de savoir si la carte exigeait impérativement une autorisation en ligne ou acceptait le mode hors-ligne."
  },
  "9F33": {
    tag: "9F33",
    name: "Terminal Capabilities",
    format: "BINARY",
    length: "3 bytes",
    description: "Capacités matérielles du terminal (Octet 1: types de lecture, Octet 2: méthodes CVM, Octet 3: sécurité SDA/DDA/CDA).",
    criticalForOperator: true,
    diagnosticTip: "Indique si le terminal accepte le PIN en clair, le PIN chiffré en ligne, ou s'il gère l'authentification DDA."
  },
  "9F34": {
    tag: "9F34",
    name: "Cardholder Verification Method (CVM) Results",
    format: "HEX",
    length: "3 bytes",
    description: "Résultat détaillé de la vérification du porteur (Octet 1: méthode tentée, Octet 2: condition, Octet 3: succès/échec).",
    criticalForOperator: true,
    diagnosticTip: "Octet 1 = 02 (PIN Online), Octet 3 = 02 (Succès). Si Octet 3 = 01, la vérification du porteur a échoué."
  },
  "9F35": {
    tag: "9F35",
    name: "Terminal Type",
    format: "NUMERIC",
    length: "1 byte (2 digits)",
    description: "Environnement opérationnel du terminal (14 = GAB autonome hors agence, 11 = GAB en agence, 21 = TPE commerçant en ligne, 22 = TPE offline).",
    criticalForOperator: false,
    diagnosticTip: "Conditionne les règles de gestion des risques et la politique d'autorisation des émetteurs."
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
    diagnosticTip: "Si le générateur aléatoire du terminal est défaillant (ex: UN constant), le HSM émetteur échouera systématiquement la vérification ARQC."
  },
  "9F39": {
    tag: "9F39",
    name: "Point of Service (POS) Entry Mode",
    format: "NUMERIC",
    length: "1 byte (2 digits)",
    description: "Mode d'acquisition de la transaction (05 = Puce avec contact, 07 = Puce sans-contact / Contactless, 90 = Piste magnétique).",
    criticalForOperator: true,
    diagnosticTip: "Correspond au champ ISO DE22. Permet de détecter les cas de repli (Fallback)."
  },
  "9F40": {
    tag: "9F40",
    name: "Additional Terminal Capabilities",
    format: "BINARY",
    length: "5 bytes",
    description: "Fonctions supplémentaires supportées par le terminal (retrait, dépôt, virement, consultation, cashback, impression ticket).",
    criticalForOperator: false,
    diagnosticTip: "Définit la panoplie transactionnelle autorisée sur ce terminal."
  },
  "9F41": {
    tag: "9F41",
    name: "Transaction Sequence Counter",
    format: "NUMERIC",
    length: "2-4 bytes",
    description: "Numéro de séquence propre au terminal incrémenté à chaque opération (équivalent au STAN ISO DE11).",
    criticalForOperator: false,
    diagnosticTip: "Permet de corréler les logs locaux du terminal avec les traces de l'hôte."
  },
  "9F45": {
    tag: "9F45",
    name: "Data Authentication Code",
    format: "HEX",
    length: "2 bytes",
    description: "Code d'authentification des données retourné lors d'une vérification SDA réussie.",
    criticalForOperator: false,
    diagnosticTip: "Présent dans les cartes supportant l'authentification statique."
  },
  "9F49": {
    tag: "9F49",
    name: "Dynamic Data Authentication Data Object List (DDOL)",
    format: "HEX",
    length: "Variable",
    description: "Liste des éléments demandés par la puce pour exécuter l'authentification dynamique DDA (inclut obligatoirement l'aléa 9F37).",
    criticalForOperator: false,
    diagnosticTip: "Permet à la puce de signer numériquement les données de la transaction avec sa clé privée."
  },
  "9F4C": {
    tag: "9F4C",
    name: "ICC Dynamic Number",
    format: "HEX",
    length: "2-8 bytes",
    description: "Nombre aléatoire généré par la puce pour l'authentification dynamique DDA.",
    criticalForOperator: false,
    diagnosticTip: "Assure l'unicité de la réponse cryptographique de la carte."
  },
  "9F53": {
    tag: "9F53",
    name: "Consecutive Transaction Counter International - Limit (Visa)",
    format: "HEX",
    length: "1 byte",
    description: "Compteur international de transactions hors-ligne consécutives propriétaire Visa.",
    criticalForOperator: false,
    diagnosticTip: "Utilisé dans les profils de risque internationaux pour forcer l'autorisation en ligne."
  },
  "9F5B": {
    tag: "9F5B",
    name: "Issuer Script Results",
    format: "HEX",
    length: "Variable",
    description: "Résultats de l'exécution des scripts émetteurs (succès ou échec des commandes APDU envoyées dans les tags 71/72).",
    criticalForOperator: true,
    diagnosticTip: "Doit être analysé si le client signale que son PIN débloqué en agence ne fonctionne toujours pas."
  },
  "9F6E": {
    tag: "9F6E",
    name: "Form Factor Indicator (Visa / Mastercard Contactless)",
    format: "HEX",
    length: "4 bytes",
    description: "Indique le facteur de forme du support de paiement (carte physique, smartphone NFC, montre connectée, sticker).",
    criticalForOperator: false,
    diagnosticTip: "Permet d'identifier si la transaction a été initiée via Apple Pay, Google Pay ou une carte plastique."
  },
  "9F7C": {
    tag: "9F7C",
    name: "Customer Exclusive Data",
    format: "HEX",
    length: "Variable",
    description: "Données privatives émetteur réservées à la personnalisation carte ou programmes fidélité.",
    criticalForOperator: false,
    diagnosticTip: "Champs spécifiques à la politique commerciale de la banque."
  },
  "BF0C": {
    tag: "BF0C",
    name: "FCI Issuer Discretionary Data",
    format: "HEX",
    length: "Variable",
    description: "Données discrétionnaires de l'émetteur encapsulées dans la réponse FCI (File Control Information).",
    criticalForOperator: false,
    diagnosticTip: "Contient souvent le tag 50 (Application Label) ou des informations de marque."
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

export interface TsiBitExplanation {
  byte: number;
  bit: number;
  label: string;
  meaning: string;
}

export const TSI_BITS_SPEC: TsiBitExplanation[] = [
  // Octet 1 : Actions de sécurité exécutées
  { byte: 1, bit: 8, label: "Offline data authentication was performed", meaning: "L'authentification hors-ligne (SDA ou DDA) a été réellement exécutée par le terminal." },
  { byte: 1, bit: 7, label: "Cardholder verification was performed", meaning: "La vérification du porteur (saisie PIN ou contrôle signature) a été exécutée." },
  { byte: 1, bit: 6, label: "Card risk management was performed", meaning: "La gestion des risques de la carte (contrôle des plafonds de la puce) a été effectuée." },
  { byte: 1, bit: 5, label: "Issuer authentication was performed", meaning: "L'authentification de l'émetteur (vérification du cryptogramme ARPC) a été tentée." },
  { byte: 1, bit: 4, label: "Terminal risk management was performed", meaning: "La gestion des risques du terminal (contrôle Floor Limit et aléatoire) a été effectuée." },
  { byte: 1, bit: 3, label: "Script processing was performed", meaning: "L'exécution des scripts émetteurs reçus dans la réponse a été réalisée par le terminal." },
  
  // Octet 2 : Compléments
  { byte: 2, bit: 8, label: "Quick Chip / RFU", meaning: "Mode Quick Chip ou réservé pour utilisation future (RFU)." },
];

export interface AipBitExplanation {
  byte: number;
  bit: number;
  label: string;
  meaning: string;
}

export const AIP_BITS_SPEC: AipBitExplanation[] = [
  // Octet 1 : Mécanismes supportés par la puce
  { byte: 1, bit: 7, label: "SDA supported", meaning: "La carte supporte l'authentification statique des données (SDA)." },
  { byte: 1, bit: 6, label: "DDA supported", meaning: "La carte supporte l'authentification dynamique des données (DDA / Signature RSA)." },
  { byte: 1, bit: 5, label: "Cardholder verification supported", meaning: "La carte prend en charge la vérification du porteur (CVM)." },
  { byte: 1, bit: 4, label: "Terminal risk management to be performed", meaning: "La carte exige que le terminal exécute sa gestion des risques (TRM)." },
  { byte: 1, bit: 3, label: "Issuer authentication supported", meaning: "La carte prend en charge la vérification du cryptogramme hôte ARPC." },
  { byte: 1, bit: 2, label: "On-device cardholder verification supported", meaning: "La carte supporte le CVM biométrique sur le dispositif (CDCVM / Smartphone / Capteur empreinte)." },
  { byte: 1, bit: 1, label: "CDA supported", meaning: "La carte supporte l'authentification combinée DDA/Génération de cryptogramme (CDA)." },

  // Octet 2
  { byte: 2, bit: 8, label: "Relay resistance protocol supported", meaning: "La carte supporte le protocole anti-attaque par relais (RRP pour paiement sans-contact)." },
];

export const CVM_METHODS_DICT: Record<string, string> = {
  "00": "Aucun CVM requis (Fail CVM Processing)",
  "01": "Plaintext PIN by ICC (Contrôle du code secret en clair hors-ligne par la puce)",
  "02": "Encrypted PIN online (Code secret chiffré transmis en ligne au HSM émetteur)",
  "03": "Plaintext PIN by ICC + Signature (Code secret hors-ligne combiné à la signature ticket)",
  "04": "Encrypted PIN by ICC (Code secret chiffré hors-ligne vérifié par la puce)",
  "05": "Encrypted PIN by ICC + Signature (Code secret chiffré hors-ligne + Signature ticket)",
  "1E": "Signature paper (Signature manuscrite du porteur sur facturette papier)",
  "1F": "No CVM required (Aucune vérification requise - ex: Petit montant sans-contact)",
  "41": "Plaintext PIN by ICC if unattended cash (PIN hors-ligne si automate sans personnel)",
  "42": "Encrypted PIN online if unattended cash (PIN en ligne si automate sans personnel)",
};

export const CVM_CONDITIONS_DICT: Record<string, string> = {
  "00": "Always (Toujours applicable)",
  "01": "If unattended cash (Si distributeur ou automate sans personnel)",
  "02": "If not unattended cash and not manual cash and not purchase with cashback",
  "03": "If terminal supports this CVM (Si le terminal prend en charge cette méthode)",
  "04": "If manual cash (Si retrait manuel d'espèces au guichet)",
  "05": "If purchase with cashback (Si achat avec rendu d'espèces en caisse)",
  "06": "If transaction in the application currency and under X",
  "07": "If transaction in the application currency and over X",
  "08": "If transaction in the application currency and under Y",
  "09": "If transaction in the application currency and over Y",
};

export const CVM_RESULTS_DICT: Record<string, { label: string; status: "SUCCESS" | "FAILED" | "UNKNOWN" }> = {
  "00": { label: "Non évalué / Inconnu", status: "UNKNOWN" },
  "01": { label: "Échec de la vérification du porteur (PIN incorrect ou refus)", status: "FAILED" },
  "02": { label: "Vérification du porteur réussie avec succès (PIN ou Signature valide)", status: "SUCCESS" },
};

export const CID_DICT: Record<string, { type: "ARQC" | "TC" | "AAC" | "AAR"; label: string; meaning: string; severity: "INFO" | "WARNING" | "CRITICAL" }> = {
  "80": {
    type: "ARQC",
    label: "ARQC (Authorization Request Cryptogram)",
    meaning: "Demande d'autorisation en ligne impérative vers le serveur hôte de la banque émettrice.",
    severity: "INFO",
  },
  "40": {
    type: "TC",
    label: "TC (Transaction Certificate)",
    meaning: "Accord hors-ligne accordé directement par la puce (Offline Approved). Aucune autorisation en ligne requise.",
    severity: "INFO",
  },
  "00": {
    type: "AAC",
    label: "AAC (Application Authentication Cryptogram)",
    meaning: "Refus local absolu décidé unilatéralement par la puce (Offline Declined). La transaction est annulée.",
    severity: "CRITICAL",
  },
  "C0": {
    type: "AAR",
    label: "AAR (Application Authorization Referral)",
    meaning: "Renvoi vers le centre d'appel téléphonique d'autorisation demandé par la puce.",
    severity: "WARNING",
  },
};
