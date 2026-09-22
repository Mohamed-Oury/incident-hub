export type ReferenceIncident = {
  reference: string;
  title: string;
  domain: string;
  component: string;
  analysisKeys: string;
  knowledgeStatus: "REFERENCE_SCENARIO" | "VALIDATED";
};

export const referenceIncidents: ReferenceIncident[] = [
  {
    "reference": "INC-001",
    "title": "GAB - Retraits en échec suite à timeout CBS / lock ACCOUNT",
    "domain": "GAB",
    "component": "CBS/DB",
    "analysisKeys": "DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-002",
    "title": "GAB - DE39=91 massif avec timeout côté Issuer",
    "domain": "GAB",
    "component": "Issuer/DB",
    "analysisKeys": "DE39=91, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-003",
    "title": "GAB - Carte acceptée mais aucun cash délivré",
    "domain": "GAB",
    "component": "ATM/Host",
    "analysisKeys": "0200/0210, DE39, DE11",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-004",
    "title": "GAB - Compte débité mais cash non délivré",
    "domain": "GAB",
    "component": "CBS/Host",
    "analysisKeys": "DE4, DE11, DE37, DE90",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-005",
    "title": "GAB - Double débit après timeout transactionnel",
    "domain": "GAB",
    "component": "CBS/Reversal",
    "analysisKeys": "DE11, DE37, DE90",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-006",
    "title": "GAB - Reversal absent après transaction timeout",
    "domain": "GAB",
    "component": "Payway/Switch",
    "analysisKeys": "0400/0410, DE90",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-007",
    "title": "GAB - Reversal rejeté par l'Host",
    "domain": "GAB",
    "component": "Host",
    "analysisKeys": "0400/0410, DE39",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-008",
    "title": "GAB - STAN dupliqué",
    "domain": "GAB",
    "component": "Payway/Switch",
    "analysisKeys": "DE11",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-009",
    "title": "GAB - RRN dupliqué ou incohérent",
    "domain": "GAB",
    "component": "Payway/Switch",
    "analysisKeys": "DE37",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-010",
    "title": "GAB - Terminal ID inconnu ou mal routé",
    "domain": "GAB",
    "component": "Payway/Routing",
    "analysisKeys": "DE41",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-011",
    "title": "TPE - Paiements systématiquement rejetés",
    "domain": "TPE",
    "component": "Payway/Host",
    "analysisKeys": "DE39, DE41",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-012",
    "title": "TPE - DE39=05 sur un périmètre marchand",
    "domain": "TPE",
    "component": "Issuer",
    "analysisKeys": "DE39=05",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-013",
    "title": "TPE - DE39=91 sur un périmètre marchand",
    "domain": "TPE",
    "component": "Issuer/Switch",
    "analysisKeys": "DE39=91",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-014",
    "title": "TPE - Timeout entre Payway et Host",
    "domain": "TPE",
    "component": "Payway/Host",
    "analysisKeys": "timeout, MTI",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-015",
    "title": "TPE - Transaction autorisée mais non comptabilisée",
    "domain": "TPE",
    "component": "CBS/Clearing",
    "analysisKeys": "DE38, DE39, DE90",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-016",
    "title": "TPE - Reversal automatique non généré",
    "domain": "TPE",
    "component": "Payway",
    "analysisKeys": "0400/0410",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-017",
    "title": "TPE - Terminal non joignable",
    "domain": "TPE",
    "component": "Réseau/Terminal",
    "analysisKeys": "DE41",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-018",
    "title": "TPE - Mauvaise devise ou currency code",
    "domain": "TPE",
    "component": "Host/Mapping",
    "analysisKeys": "DE49",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-019",
    "title": "TPE - Montant incorrect dans DE4",
    "domain": "TPE",
    "component": "Mapping/Interface",
    "analysisKeys": "DE4",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-020",
    "title": "TPE - Merchant ID mal configuré",
    "domain": "TPE",
    "component": "Routing",
    "analysisKeys": "DE42",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-021",
    "title": "EMV - Transaction puce rejetée",
    "domain": "Carte",
    "component": "EMV/Host",
    "analysisKeys": "DE55, DE39",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-022",
    "title": "EMV - ARQC invalide",
    "domain": "Carte",
    "component": "HSM/Issuer",
    "analysisKeys": "DE55",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-023",
    "title": "EMV - Cryptogramme de transaction non validé",
    "domain": "Carte",
    "component": "HSM/Issuer",
    "analysisKeys": "DE55",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-024",
    "title": "PIN - PIN block invalide",
    "domain": "Carte",
    "component": "HSM",
    "analysisKeys": "DE52, DE53",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-025",
    "title": "PIN - Erreur de traduction de PIN block",
    "domain": "Carte",
    "component": "HSM/Switch",
    "analysisKeys": "DE52",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-026",
    "title": "HSM - HSM indisponible",
    "domain": "Infrastructure",
    "component": "HSM",
    "analysisKeys": "DE53",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-027",
    "title": "HSM - Latence excessive des requêtes cryptographiques",
    "domain": "Infrastructure",
    "component": "HSM",
    "analysisKeys": "latence/HSM",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-028",
    "title": "HSM - Clé cryptographique indisponible ou incorrecte",
    "domain": "Infrastructure",
    "component": "HSM",
    "analysisKeys": "clé/crypto",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-029",
    "title": "ISO 8583 - Bitmap incohérent",
    "domain": "Interface",
    "component": "ISO 8583",
    "analysisKeys": "Bitmap",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-030",
    "title": "ISO 8583 - Data Element obligatoire absent",
    "domain": "Interface",
    "component": "ISO 8583",
    "analysisKeys": "DE",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-031",
    "title": "ISO 8583 - Format ou longueur d'un DE incorrect",
    "domain": "Interface",
    "component": "ISO 8583",
    "analysisKeys": "DE",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-032",
    "title": "ISO 8583 - MTI inattendu ou non supporté",
    "domain": "Interface",
    "component": "ISO 8583",
    "analysisKeys": "MTI",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-033",
    "title": "Payway - Problème de routage vers un Host",
    "domain": "Payway",
    "component": "Routing",
    "analysisKeys": "destination/Host",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-034",
    "title": "Payway - Queue de messages en accumulation",
    "domain": "Payway",
    "component": "Payway/Messaging",
    "analysisKeys": "queue",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-035",
    "title": "Payway - Service d'interface arrêté",
    "domain": "Payway",
    "component": "Payway",
    "analysisKeys": "service/status",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-036",
    "title": "Payway - Pool de connexions saturé",
    "domain": "Payway",
    "component": "Payway/DB",
    "analysisKeys": "connection pool",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-037",
    "title": "Payway - Latence anormale d'un Host",
    "domain": "Payway",
    "component": "Host/Réseau",
    "analysisKeys": "latence",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-038",
    "title": "Payway - Réponse reçue mais non corrélée",
    "domain": "Payway",
    "component": "Payway/Switch",
    "analysisKeys": "STAN/RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-039",
    "title": "Host - Réponse tardive après expiration du timeout",
    "domain": "Host",
    "component": "Host/Network",
    "analysisKeys": "timeout",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-040",
    "title": "Host - Host UP mais transactions rejetées massivement",
    "domain": "Host",
    "component": "Host/Issuer",
    "analysisKeys": "DE39",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-041",
    "title": "Issuer - Base ACCOUNT verrouillée",
    "domain": "Issuer",
    "component": "DB",
    "analysisKeys": "locks/sessions",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-042",
    "title": "Issuer - Pool de sessions DB saturé",
    "domain": "Issuer",
    "component": "DB",
    "analysisKeys": "sessions",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-043",
    "title": "Issuer - Requête ACCOUNT très lente",
    "domain": "Issuer",
    "component": "DB",
    "analysisKeys": "SQL/performance",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-044",
    "title": "Issuer - Session Back Office bloquante",
    "domain": "Issuer",
    "component": "DB/Back Office",
    "analysisKeys": "lock",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-045",
    "title": "Clearing - Fichier batch non généré",
    "domain": "Clearing",
    "component": "Batch",
    "analysisKeys": "batch/file",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-046",
    "title": "Clearing - Batch bloqué sur une étape",
    "domain": "Clearing",
    "component": "Batch/DB",
    "analysisKeys": "batch/lock",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-047",
    "title": "Clearing - Suspense comptable sur transactions VISA/MC",
    "domain": "Clearing",
    "component": "CBS/Reconciliation",
    "analysisKeys": "DE4/DE39/DE90",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-048",
    "title": "Clearing - Écart entre transactions et fichier de compensation",
    "domain": "Clearing",
    "component": "Reconciliation",
    "analysisKeys": "STAN/RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-049",
    "title": "Network Management - Echo test 0800/0810 en échec",
    "domain": "Réseau",
    "component": "Network Management",
    "analysisKeys": "MTI 0800/0810, DE70",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-050",
    "title": "Production - Déploiement monétique avec régression de transactions",
    "domain": "Production",
    "component": "Release/Payway",
    "analysisKeys": "MTI/DE39/logs",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-051",
    "title": "GAB - EPP Clavier - Anomalie type 1 sur PIN Pad chiffrant",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52, KSN, DUKPT",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-052",
    "title": "GAB - Lecteur Carte - Anomalie type 1 sur Lecteur hybride motorisé",
    "domain": "GAB",
    "component": "ATM/Lecteur",
    "analysisKeys": "Track2, Chip, MTI 0200",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-053",
    "title": "GAB - Cassette Billets - Anomalie type 1 sur Module de distribution",
    "domain": "GAB",
    "component": "ATM/Cassettes",
    "analysisKeys": "Cassette Status, DE4",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-054",
    "title": "GAB - Dépôt Automatique - Anomalie type 1 sur Module de recyclage/dépôt",
    "domain": "GAB",
    "component": "ATM/Dépôt",
    "analysisKeys": "Envelope, Depository, 0200",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-055",
    "title": "GAB - Audit Trail - Anomalie type 1 sur Journal électronique",
    "domain": "GAB",
    "component": "ATM/Journal",
    "analysisKeys": "EJ, Decryption, Audit",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-056",
    "title": "TPE - Paiement NFC - Anomalie type 1 sur Lecteur NFC sans contact",
    "domain": "TPE",
    "component": "TPE/Contactless",
    "analysisKeys": "NFC, Tag 9F6E, DE55",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-057",
    "title": "TPE - Passerelle Monétique - Anomalie type 1 sur Concentrateur TPE",
    "domain": "TPE",
    "component": "TPE/Passerelle",
    "analysisKeys": "TLS, IP, Port 8443",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-058",
    "title": "TPE - Télécollecte Fin Journée - Anomalie type 1 sur Télécollecte CB",
    "domain": "TPE",
    "component": "TPE/Télécollecte",
    "analysisKeys": "MTI 0500, Batch Upload",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-059",
    "title": "TPE - Conversion Devise DCC - Anomalie type 1 sur DCC Dynamic Currency",
    "domain": "TPE",
    "component": "TPE/Multi-devise",
    "analysisKeys": "DE49, DE51, DE6",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-060",
    "title": "TPE - Remboursement Commerçant - Anomalie type 1 sur Opération Refund",
    "domain": "TPE",
    "component": "TPE/Remboursement",
    "analysisKeys": "MTI 0200, DE3=200000",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-061",
    "title": "Carte - Kernel EMV Contact - Anomalie type 1 sur Noyau EMV L2",
    "domain": "Carte",
    "component": "EMV/Kernel",
    "analysisKeys": "Tag 9F36, Tag 9F10, DE55",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-062",
    "title": "Carte - Authentification 3DSv2 - Anomalie type 1 sur Plateforme 3D-Secure",
    "domain": "Carte",
    "component": "Carte/3DS",
    "analysisKeys": "CAVV, AAV, E-commerce",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-063",
    "title": "Carte - Token ApplePay/GooglePay - Anomalie type 1 sur Service de Tokenisation",
    "domain": "Carte",
    "component": "Carte/Tokenisation",
    "analysisKeys": "PAR, DPAN, Token Vault",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-064",
    "title": "Carte - Dépassement Plafond - Anomalie type 1 sur Gestion des plafonds cartes",
    "domain": "Carte",
    "component": "Carte/Plafond",
    "analysisKeys": "DE39=61, DE39=65",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-065",
    "title": "Infrastructure - Sécurité Clé LMK - Anomalie type 1 sur Local Master Key",
    "domain": "Infrastructure",
    "component": "HSM/LMK",
    "analysisKeys": "LMK, HSM PayShield",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-066",
    "title": "Infrastructure - Validation CVV2 - Anomalie type 1 sur Générateur CVV/iCVV",
    "domain": "Infrastructure",
    "component": "HSM/CVV",
    "analysisKeys": "CVV2, CSC, DE39=82",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-067",
    "title": "Infrastructure - Vérification PVV/IBM3624 - Anomalie type 1 sur PIN Verification Value",
    "domain": "Infrastructure",
    "component": "HSM/PVV",
    "analysisKeys": "PVV, PVKI, DE52",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-068",
    "title": "Infrastructure - Certificat Root CA EMV - Anomalie type 1 sur Infrastructure PKI",
    "domain": "Infrastructure",
    "component": "HSM/Certificats",
    "analysisKeys": "EMV CA Public Key, RID",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-069",
    "title": "Interface - Décodage Processing Code - Anomalie type 1 sur Processing Code",
    "domain": "Interface",
    "component": "ISO 8583/DE3",
    "analysisKeys": "DE3 (000000, 010000, 310000)",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-070",
    "title": "Interface - Identification Marchand - Anomalie type 1 sur Card Acceptor Name",
    "domain": "Interface",
    "component": "ISO 8583/DE43",
    "analysisKeys": "DE43 City/Country",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-071",
    "title": "Interface - Montants Additionnels Solde - Anomalie type 1 sur Additional Amounts",
    "domain": "Interface",
    "component": "ISO 8583/DE54",
    "analysisKeys": "DE54 Available Balance",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-072",
    "title": "Interface - Données Privées Terminal - Anomalie type 1 sur Terminal Data",
    "domain": "Interface",
    "component": "ISO 8583/DE60",
    "analysisKeys": "DE60 Terminal Capability",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-073",
    "title": "Switch - Interface VISA SMS - Anomalie type 1 sur Lien Direct VISA Base I/II",
    "domain": "Switch",
    "component": "Switch/VISA",
    "analysisKeys": "VISA VIP, VAP, 0100",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-074",
    "title": "Switch - Interface Mastercard Banknet - Anomalie type 1 sur Lien Mastercard MIP",
    "domain": "Switch",
    "component": "Switch/Mastercard",
    "analysisKeys": "MIP, 0100, DE48 SE",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-075",
    "title": "Switch - Interbancarité GIMAC - Anomalie type 1 sur Switch Régional GIMAC",
    "domain": "Switch",
    "component": "Switch/GIMAC",
    "analysisKeys": "GIMAC MTI, 0200, DE100",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-076",
    "title": "Switch - Bascule Haute Disponibilité - Anomalie type 1 sur Routage Fallback",
    "domain": "Switch",
    "component": "Switch/Bascule",
    "analysisKeys": "Active/Passive Switch, VIP",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-077",
    "title": "Clearing - Extourne Comptable - Anomalie type 1 sur Contrepassation d'écritures",
    "domain": "Clearing",
    "component": "CBS/Contrepassation",
    "analysisKeys": "DE90, Annulation CBS",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-078",
    "title": "Clearing - Heure de Coupure Cut-Off - Anomalie type 1 sur Arrêté comptable journalier",
    "domain": "Clearing",
    "component": "Clearing/CutOff",
    "analysisKeys": "Cut-Off, Batch Balance",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-079",
    "title": "Clearing - Rejet Lot Compensation - Anomalie type 1 sur Rejet fichier compensation",
    "domain": "Clearing",
    "component": "Clearing/Rejet",
    "analysisKeys": "Fichier EPA, Chargeback",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-080",
    "title": "Clearing - Litige & Chargeback TC40 - Anomalie type 1 sur Déclaration Impayés/Fraude",
    "domain": "Clearing",
    "component": "Clearing/Fraude",
    "analysisKeys": "Chargeback, Representment",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-081",
    "title": "GAB - EPP Clavier - Anomalie type 2 sur PIN Pad chiffrant",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52, KSN, DUKPT",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-082",
    "title": "GAB - Lecteur Carte - Anomalie type 2 sur Lecteur hybride motorisé",
    "domain": "GAB",
    "component": "ATM/Lecteur",
    "analysisKeys": "Track2, Chip, MTI 0200",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-083",
    "title": "GAB - Cassette Billets - Anomalie type 2 sur Module de distribution",
    "domain": "GAB",
    "component": "ATM/Cassettes",
    "analysisKeys": "Cassette Status, DE4",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-084",
    "title": "GAB - Dépôt Automatique - Anomalie type 2 sur Module de recyclage/dépôt",
    "domain": "GAB",
    "component": "ATM/Dépôt",
    "analysisKeys": "Envelope, Depository, 0200",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-085",
    "title": "GAB - Audit Trail - Anomalie type 2 sur Journal électronique",
    "domain": "GAB",
    "component": "ATM/Journal",
    "analysisKeys": "EJ, Decryption, Audit",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-086",
    "title": "TPE - Paiement NFC - Anomalie type 2 sur Lecteur NFC sans contact",
    "domain": "TPE",
    "component": "TPE/Contactless",
    "analysisKeys": "NFC, Tag 9F6E, DE55",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-087",
    "title": "TPE - Passerelle Monétique - Anomalie type 2 sur Concentrateur TPE",
    "domain": "TPE",
    "component": "TPE/Passerelle",
    "analysisKeys": "TLS, IP, Port 8443",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-088",
    "title": "TPE - Télécollecte Fin Journée - Anomalie type 2 sur Télécollecte CB",
    "domain": "TPE",
    "component": "TPE/Télécollecte",
    "analysisKeys": "MTI 0500, Batch Upload",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-089",
    "title": "TPE - Conversion Devise DCC - Anomalie type 2 sur DCC Dynamic Currency",
    "domain": "TPE",
    "component": "TPE/Multi-devise",
    "analysisKeys": "DE49, DE51, DE6",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-090",
    "title": "TPE - Remboursement Commerçant - Anomalie type 2 sur Opération Refund",
    "domain": "TPE",
    "component": "TPE/Remboursement",
    "analysisKeys": "MTI 0200, DE3=200000",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-091",
    "title": "Carte - Kernel EMV Contact - Anomalie type 2 sur Noyau EMV L2",
    "domain": "Carte",
    "component": "EMV/Kernel",
    "analysisKeys": "Tag 9F36, Tag 9F10, DE55",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-092",
    "title": "Carte - Authentification 3DSv2 - Anomalie type 2 sur Plateforme 3D-Secure",
    "domain": "Carte",
    "component": "Carte/3DS",
    "analysisKeys": "CAVV, AAV, E-commerce",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-093",
    "title": "Carte - Token ApplePay/GooglePay - Anomalie type 2 sur Service de Tokenisation",
    "domain": "Carte",
    "component": "Carte/Tokenisation",
    "analysisKeys": "PAR, DPAN, Token Vault",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-094",
    "title": "Carte - Dépassement Plafond - Anomalie type 2 sur Gestion des plafonds cartes",
    "domain": "Carte",
    "component": "Carte/Plafond",
    "analysisKeys": "DE39=61, DE39=65",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-095",
    "title": "Infrastructure - Sécurité Clé LMK - Anomalie type 2 sur Local Master Key",
    "domain": "Infrastructure",
    "component": "HSM/LMK",
    "analysisKeys": "LMK, HSM PayShield",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-096",
    "title": "Infrastructure - Validation CVV2 - Anomalie type 2 sur Générateur CVV/iCVV",
    "domain": "Infrastructure",
    "component": "HSM/CVV",
    "analysisKeys": "CVV2, CSC, DE39=82",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-097",
    "title": "Infrastructure - Vérification PVV/IBM3624 - Anomalie type 2 sur PIN Verification Value",
    "domain": "Infrastructure",
    "component": "HSM/PVV",
    "analysisKeys": "PVV, PVKI, DE52",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-098",
    "title": "Infrastructure - Certificat Root CA EMV - Anomalie type 2 sur Infrastructure PKI",
    "domain": "Infrastructure",
    "component": "HSM/Certificats",
    "analysisKeys": "EMV CA Public Key, RID",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-099",
    "title": "Interface - Décodage Processing Code - Anomalie type 2 sur Processing Code",
    "domain": "Interface",
    "component": "ISO 8583/DE3",
    "analysisKeys": "DE3 (000000, 010000, 310000)",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-100",
    "title": "Interface - Identification Marchand - Anomalie type 2 sur Card Acceptor Name",
    "domain": "Interface",
    "component": "ISO 8583/DE43",
    "analysisKeys": "DE43 City/Country",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-101",
    "title": "Interface - Montants Additionnels Solde - Anomalie type 2 sur Additional Amounts",
    "domain": "Interface",
    "component": "ISO 8583/DE54",
    "analysisKeys": "DE54 Available Balance",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-102",
    "title": "Interface - Données Privées Terminal - Anomalie type 2 sur Terminal Data",
    "domain": "Interface",
    "component": "ISO 8583/DE60",
    "analysisKeys": "DE60 Terminal Capability",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-103",
    "title": "Switch - Interface VISA SMS - Anomalie type 2 sur Lien Direct VISA Base I/II",
    "domain": "Switch",
    "component": "Switch/VISA",
    "analysisKeys": "VISA VIP, VAP, 0100",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-104",
    "title": "Switch - Interface Mastercard Banknet - Anomalie type 2 sur Lien Mastercard MIP",
    "domain": "Switch",
    "component": "Switch/Mastercard",
    "analysisKeys": "MIP, 0100, DE48 SE",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-105",
    "title": "Switch - Interbancarité GIMAC - Anomalie type 2 sur Switch Régional GIMAC",
    "domain": "Switch",
    "component": "Switch/GIMAC",
    "analysisKeys": "GIMAC MTI, 0200, DE100",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-106",
    "title": "Switch - Bascule Haute Disponibilité - Anomalie type 2 sur Routage Fallback",
    "domain": "Switch",
    "component": "Switch/Bascule",
    "analysisKeys": "Active/Passive Switch, VIP",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-107",
    "title": "Clearing - Extourne Comptable - Anomalie type 2 sur Contrepassation d'écritures",
    "domain": "Clearing",
    "component": "CBS/Contrepassation",
    "analysisKeys": "DE90, Annulation CBS",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-108",
    "title": "Clearing - Heure de Coupure Cut-Off - Anomalie type 2 sur Arrêté comptable journalier",
    "domain": "Clearing",
    "component": "Clearing/CutOff",
    "analysisKeys": "Cut-Off, Batch Balance",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-109",
    "title": "Clearing - Rejet Lot Compensation - Anomalie type 2 sur Rejet fichier compensation",
    "domain": "Clearing",
    "component": "Clearing/Rejet",
    "analysisKeys": "Fichier EPA, Chargeback",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-110",
    "title": "Clearing - Litige & Chargeback TC40 - Anomalie type 2 sur Déclaration Impayés/Fraude",
    "domain": "Clearing",
    "component": "Clearing/Fraude",
    "analysisKeys": "Chargeback, Representment",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-111",
    "title": "GAB - EPP Clavier - Anomalie type 3 sur PIN Pad chiffrant",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52, KSN, DUKPT",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-112",
    "title": "GAB - Lecteur Carte - Anomalie type 3 sur Lecteur hybride motorisé",
    "domain": "GAB",
    "component": "ATM/Lecteur",
    "analysisKeys": "Track2, Chip, MTI 0200",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-113",
    "title": "GAB - Cassette Billets - Anomalie type 3 sur Module de distribution",
    "domain": "GAB",
    "component": "ATM/Cassettes",
    "analysisKeys": "Cassette Status, DE4",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-114",
    "title": "GAB - Dépôt Automatique - Anomalie type 3 sur Module de recyclage/dépôt",
    "domain": "GAB",
    "component": "ATM/Dépôt",
    "analysisKeys": "Envelope, Depository, 0200",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-115",
    "title": "GAB - Audit Trail - Anomalie type 3 sur Journal électronique",
    "domain": "GAB",
    "component": "ATM/Journal",
    "analysisKeys": "EJ, Decryption, Audit",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-116",
    "title": "TPE - Paiement NFC - Anomalie type 3 sur Lecteur NFC sans contact",
    "domain": "TPE",
    "component": "TPE/Contactless",
    "analysisKeys": "NFC, Tag 9F6E, DE55",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-117",
    "title": "TPE - Passerelle Monétique - Anomalie type 3 sur Concentrateur TPE",
    "domain": "TPE",
    "component": "TPE/Passerelle",
    "analysisKeys": "TLS, IP, Port 8443",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-118",
    "title": "TPE - Télécollecte Fin Journée - Anomalie type 3 sur Télécollecte CB",
    "domain": "TPE",
    "component": "TPE/Télécollecte",
    "analysisKeys": "MTI 0500, Batch Upload",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-119",
    "title": "TPE - Conversion Devise DCC - Anomalie type 3 sur DCC Dynamic Currency",
    "domain": "TPE",
    "component": "TPE/Multi-devise",
    "analysisKeys": "DE49, DE51, DE6",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-120",
    "title": "TPE - Remboursement Commerçant - Anomalie type 3 sur Opération Refund",
    "domain": "TPE",
    "component": "TPE/Remboursement",
    "analysisKeys": "MTI 0200, DE3=200000",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-121",
    "title": "Carte - Kernel EMV Contact - Anomalie type 3 sur Noyau EMV L2",
    "domain": "Carte",
    "component": "EMV/Kernel",
    "analysisKeys": "Tag 9F36, Tag 9F10, DE55",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-122",
    "title": "Carte - Authentification 3DSv2 - Anomalie type 3 sur Plateforme 3D-Secure",
    "domain": "Carte",
    "component": "Carte/3DS",
    "analysisKeys": "CAVV, AAV, E-commerce",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-123",
    "title": "Carte - Token ApplePay/GooglePay - Anomalie type 3 sur Service de Tokenisation",
    "domain": "Carte",
    "component": "Carte/Tokenisation",
    "analysisKeys": "PAR, DPAN, Token Vault",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-124",
    "title": "Carte - Dépassement Plafond - Anomalie type 3 sur Gestion des plafonds cartes",
    "domain": "Carte",
    "component": "Carte/Plafond",
    "analysisKeys": "DE39=61, DE39=65",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-125",
    "title": "Infrastructure - Sécurité Clé LMK - Anomalie type 3 sur Local Master Key",
    "domain": "Infrastructure",
    "component": "HSM/LMK",
    "analysisKeys": "LMK, HSM PayShield",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-126",
    "title": "Infrastructure - Validation CVV2 - Anomalie type 3 sur Générateur CVV/iCVV",
    "domain": "Infrastructure",
    "component": "HSM/CVV",
    "analysisKeys": "CVV2, CSC, DE39=82",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-127",
    "title": "Infrastructure - Vérification PVV/IBM3624 - Anomalie type 3 sur PIN Verification Value",
    "domain": "Infrastructure",
    "component": "HSM/PVV",
    "analysisKeys": "PVV, PVKI, DE52",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-128",
    "title": "Infrastructure - Certificat Root CA EMV - Anomalie type 3 sur Infrastructure PKI",
    "domain": "Infrastructure",
    "component": "HSM/Certificats",
    "analysisKeys": "EMV CA Public Key, RID",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-129",
    "title": "Interface - Décodage Processing Code - Anomalie type 3 sur Processing Code",
    "domain": "Interface",
    "component": "ISO 8583/DE3",
    "analysisKeys": "DE3 (000000, 010000, 310000)",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-130",
    "title": "Interface - Identification Marchand - Anomalie type 3 sur Card Acceptor Name",
    "domain": "Interface",
    "component": "ISO 8583/DE43",
    "analysisKeys": "DE43 City/Country",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-131",
    "title": "Interface - Montants Additionnels Solde - Anomalie type 3 sur Additional Amounts",
    "domain": "Interface",
    "component": "ISO 8583/DE54",
    "analysisKeys": "DE54 Available Balance",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-132",
    "title": "Interface - Données Privées Terminal - Anomalie type 3 sur Terminal Data",
    "domain": "Interface",
    "component": "ISO 8583/DE60",
    "analysisKeys": "DE60 Terminal Capability",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-133",
    "title": "Switch - Interface VISA SMS - Anomalie type 3 sur Lien Direct VISA Base I/II",
    "domain": "Switch",
    "component": "Switch/VISA",
    "analysisKeys": "VISA VIP, VAP, 0100",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-134",
    "title": "Switch - Interface Mastercard Banknet - Anomalie type 3 sur Lien Mastercard MIP",
    "domain": "Switch",
    "component": "Switch/Mastercard",
    "analysisKeys": "MIP, 0100, DE48 SE",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-135",
    "title": "Switch - Interbancarité GIMAC - Anomalie type 3 sur Switch Régional GIMAC",
    "domain": "Switch",
    "component": "Switch/GIMAC",
    "analysisKeys": "GIMAC MTI, 0200, DE100",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-136",
    "title": "Switch - Bascule Haute Disponibilité - Anomalie type 3 sur Routage Fallback",
    "domain": "Switch",
    "component": "Switch/Bascule",
    "analysisKeys": "Active/Passive Switch, VIP",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-137",
    "title": "Clearing - Extourne Comptable - Anomalie type 3 sur Contrepassation d'écritures",
    "domain": "Clearing",
    "component": "CBS/Contrepassation",
    "analysisKeys": "DE90, Annulation CBS",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-138",
    "title": "Clearing - Heure de Coupure Cut-Off - Anomalie type 3 sur Arrêté comptable journalier",
    "domain": "Clearing",
    "component": "Clearing/CutOff",
    "analysisKeys": "Cut-Off, Batch Balance",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-139",
    "title": "Clearing - Rejet Lot Compensation - Anomalie type 3 sur Rejet fichier compensation",
    "domain": "Clearing",
    "component": "Clearing/Rejet",
    "analysisKeys": "Fichier EPA, Chargeback",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-140",
    "title": "Clearing - Litige & Chargeback TC40 - Anomalie type 3 sur Déclaration Impayés/Fraude",
    "domain": "Clearing",
    "component": "Clearing/Fraude",
    "analysisKeys": "Chargeback, Representment",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-141",
    "title": "GAB - EPP Clavier - Anomalie type 4 sur PIN Pad chiffrant",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52, KSN, DUKPT",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-142",
    "title": "GAB - Lecteur Carte - Anomalie type 4 sur Lecteur hybride motorisé",
    "domain": "GAB",
    "component": "ATM/Lecteur",
    "analysisKeys": "Track2, Chip, MTI 0200",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-143",
    "title": "GAB - Cassette Billets - Anomalie type 4 sur Module de distribution",
    "domain": "GAB",
    "component": "ATM/Cassettes",
    "analysisKeys": "Cassette Status, DE4",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-144",
    "title": "GAB - Dépôt Automatique - Anomalie type 4 sur Module de recyclage/dépôt",
    "domain": "GAB",
    "component": "ATM/Dépôt",
    "analysisKeys": "Envelope, Depository, 0200",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-145",
    "title": "GAB - Audit Trail - Anomalie type 4 sur Journal électronique",
    "domain": "GAB",
    "component": "ATM/Journal",
    "analysisKeys": "EJ, Decryption, Audit",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-146",
    "title": "TPE - Paiement NFC - Anomalie type 4 sur Lecteur NFC sans contact",
    "domain": "TPE",
    "component": "TPE/Contactless",
    "analysisKeys": "NFC, Tag 9F6E, DE55",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-147",
    "title": "TPE - Passerelle Monétique - Anomalie type 4 sur Concentrateur TPE",
    "domain": "TPE",
    "component": "TPE/Passerelle",
    "analysisKeys": "TLS, IP, Port 8443",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-148",
    "title": "TPE - Télécollecte Fin Journée - Anomalie type 4 sur Télécollecte CB",
    "domain": "TPE",
    "component": "TPE/Télécollecte",
    "analysisKeys": "MTI 0500, Batch Upload",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-149",
    "title": "TPE - Conversion Devise DCC - Anomalie type 4 sur DCC Dynamic Currency",
    "domain": "TPE",
    "component": "TPE/Multi-devise",
    "analysisKeys": "DE49, DE51, DE6",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-150",
    "title": "TPE - Remboursement Commerçant - Anomalie type 4 sur Opération Refund",
    "domain": "TPE",
    "component": "TPE/Remboursement",
    "analysisKeys": "MTI 0200, DE3=200000",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-151",
    "title": "Carte - Kernel EMV Contact - Anomalie type 4 sur Noyau EMV L2",
    "domain": "Carte",
    "component": "EMV/Kernel",
    "analysisKeys": "Tag 9F36, Tag 9F10, DE55",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-152",
    "title": "Carte - Authentification 3DSv2 - Anomalie type 4 sur Plateforme 3D-Secure",
    "domain": "Carte",
    "component": "Carte/3DS",
    "analysisKeys": "CAVV, AAV, E-commerce",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-153",
    "title": "Carte - Token ApplePay/GooglePay - Anomalie type 4 sur Service de Tokenisation",
    "domain": "Carte",
    "component": "Carte/Tokenisation",
    "analysisKeys": "PAR, DPAN, Token Vault",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-154",
    "title": "Carte - Dépassement Plafond - Anomalie type 4 sur Gestion des plafonds cartes",
    "domain": "Carte",
    "component": "Carte/Plafond",
    "analysisKeys": "DE39=61, DE39=65",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-155",
    "title": "Infrastructure - Sécurité Clé LMK - Anomalie type 4 sur Local Master Key",
    "domain": "Infrastructure",
    "component": "HSM/LMK",
    "analysisKeys": "LMK, HSM PayShield",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-156",
    "title": "Infrastructure - Validation CVV2 - Anomalie type 4 sur Générateur CVV/iCVV",
    "domain": "Infrastructure",
    "component": "HSM/CVV",
    "analysisKeys": "CVV2, CSC, DE39=82",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-157",
    "title": "Infrastructure - Vérification PVV/IBM3624 - Anomalie type 4 sur PIN Verification Value",
    "domain": "Infrastructure",
    "component": "HSM/PVV",
    "analysisKeys": "PVV, PVKI, DE52",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-158",
    "title": "Infrastructure - Certificat Root CA EMV - Anomalie type 4 sur Infrastructure PKI",
    "domain": "Infrastructure",
    "component": "HSM/Certificats",
    "analysisKeys": "EMV CA Public Key, RID",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-159",
    "title": "Interface - Décodage Processing Code - Anomalie type 4 sur Processing Code",
    "domain": "Interface",
    "component": "ISO 8583/DE3",
    "analysisKeys": "DE3 (000000, 010000, 310000)",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-160",
    "title": "Interface - Identification Marchand - Anomalie type 4 sur Card Acceptor Name",
    "domain": "Interface",
    "component": "ISO 8583/DE43",
    "analysisKeys": "DE43 City/Country",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-161",
    "title": "Interface - Montants Additionnels Solde - Anomalie type 4 sur Additional Amounts",
    "domain": "Interface",
    "component": "ISO 8583/DE54",
    "analysisKeys": "DE54 Available Balance",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-162",
    "title": "Interface - Données Privées Terminal - Anomalie type 4 sur Terminal Data",
    "domain": "Interface",
    "component": "ISO 8583/DE60",
    "analysisKeys": "DE60 Terminal Capability",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-163",
    "title": "Switch - Interface VISA SMS - Anomalie type 4 sur Lien Direct VISA Base I/II",
    "domain": "Switch",
    "component": "Switch/VISA",
    "analysisKeys": "VISA VIP, VAP, 0100",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-164",
    "title": "Switch - Interface Mastercard Banknet - Anomalie type 4 sur Lien Mastercard MIP",
    "domain": "Switch",
    "component": "Switch/Mastercard",
    "analysisKeys": "MIP, 0100, DE48 SE",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-165",
    "title": "Switch - Interbancarité GIMAC - Anomalie type 4 sur Switch Régional GIMAC",
    "domain": "Switch",
    "component": "Switch/GIMAC",
    "analysisKeys": "GIMAC MTI, 0200, DE100",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-166",
    "title": "Switch - Bascule Haute Disponibilité - Anomalie type 4 sur Routage Fallback",
    "domain": "Switch",
    "component": "Switch/Bascule",
    "analysisKeys": "Active/Passive Switch, VIP",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-167",
    "title": "Clearing - Extourne Comptable - Anomalie type 4 sur Contrepassation d'écritures",
    "domain": "Clearing",
    "component": "CBS/Contrepassation",
    "analysisKeys": "DE90, Annulation CBS",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-168",
    "title": "Clearing - Heure de Coupure Cut-Off - Anomalie type 4 sur Arrêté comptable journalier",
    "domain": "Clearing",
    "component": "Clearing/CutOff",
    "analysisKeys": "Cut-Off, Batch Balance",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-169",
    "title": "Clearing - Rejet Lot Compensation - Anomalie type 4 sur Rejet fichier compensation",
    "domain": "Clearing",
    "component": "Clearing/Rejet",
    "analysisKeys": "Fichier EPA, Chargeback",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-170",
    "title": "Clearing - Litige & Chargeback TC40 - Anomalie type 4 sur Déclaration Impayés/Fraude",
    "domain": "Clearing",
    "component": "Clearing/Fraude",
    "analysisKeys": "Chargeback, Representment",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-171",
    "title": "GAB - EPP Clavier - Anomalie type 5 sur PIN Pad chiffrant",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52, KSN, DUKPT",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-172",
    "title": "GAB - Lecteur Carte - Anomalie type 5 sur Lecteur hybride motorisé",
    "domain": "GAB",
    "component": "ATM/Lecteur",
    "analysisKeys": "Track2, Chip, MTI 0200",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-173",
    "title": "GAB - Cassette Billets - Anomalie type 5 sur Module de distribution",
    "domain": "GAB",
    "component": "ATM/Cassettes",
    "analysisKeys": "Cassette Status, DE4",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-174",
    "title": "GAB - Dépôt Automatique - Anomalie type 5 sur Module de recyclage/dépôt",
    "domain": "GAB",
    "component": "ATM/Dépôt",
    "analysisKeys": "Envelope, Depository, 0200",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-175",
    "title": "GAB - Audit Trail - Anomalie type 5 sur Journal électronique",
    "domain": "GAB",
    "component": "ATM/Journal",
    "analysisKeys": "EJ, Decryption, Audit",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-176",
    "title": "TPE - Paiement NFC - Anomalie type 5 sur Lecteur NFC sans contact",
    "domain": "TPE",
    "component": "TPE/Contactless",
    "analysisKeys": "NFC, Tag 9F6E, DE55",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-177",
    "title": "TPE - Passerelle Monétique - Anomalie type 5 sur Concentrateur TPE",
    "domain": "TPE",
    "component": "TPE/Passerelle",
    "analysisKeys": "TLS, IP, Port 8443",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-178",
    "title": "TPE - Télécollecte Fin Journée - Anomalie type 5 sur Télécollecte CB",
    "domain": "TPE",
    "component": "TPE/Télécollecte",
    "analysisKeys": "MTI 0500, Batch Upload",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-179",
    "title": "TPE - Conversion Devise DCC - Anomalie type 5 sur DCC Dynamic Currency",
    "domain": "TPE",
    "component": "TPE/Multi-devise",
    "analysisKeys": "DE49, DE51, DE6",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-180",
    "title": "TPE - Remboursement Commerçant - Anomalie type 5 sur Opération Refund",
    "domain": "TPE",
    "component": "TPE/Remboursement",
    "analysisKeys": "MTI 0200, DE3=200000",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-181",
    "title": "Carte - Kernel EMV Contact - Anomalie type 5 sur Noyau EMV L2",
    "domain": "Carte",
    "component": "EMV/Kernel",
    "analysisKeys": "Tag 9F36, Tag 9F10, DE55",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-182",
    "title": "Carte - Authentification 3DSv2 - Anomalie type 5 sur Plateforme 3D-Secure",
    "domain": "Carte",
    "component": "Carte/3DS",
    "analysisKeys": "CAVV, AAV, E-commerce",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-183",
    "title": "Carte - Token ApplePay/GooglePay - Anomalie type 5 sur Service de Tokenisation",
    "domain": "Carte",
    "component": "Carte/Tokenisation",
    "analysisKeys": "PAR, DPAN, Token Vault",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-184",
    "title": "Carte - Dépassement Plafond - Anomalie type 5 sur Gestion des plafonds cartes",
    "domain": "Carte",
    "component": "Carte/Plafond",
    "analysisKeys": "DE39=61, DE39=65",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-185",
    "title": "Infrastructure - Sécurité Clé LMK - Anomalie type 5 sur Local Master Key",
    "domain": "Infrastructure",
    "component": "HSM/LMK",
    "analysisKeys": "LMK, HSM PayShield",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-186",
    "title": "Infrastructure - Validation CVV2 - Anomalie type 5 sur Générateur CVV/iCVV",
    "domain": "Infrastructure",
    "component": "HSM/CVV",
    "analysisKeys": "CVV2, CSC, DE39=82",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-187",
    "title": "Infrastructure - Vérification PVV/IBM3624 - Anomalie type 5 sur PIN Verification Value",
    "domain": "Infrastructure",
    "component": "HSM/PVV",
    "analysisKeys": "PVV, PVKI, DE52",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-188",
    "title": "Infrastructure - Certificat Root CA EMV - Anomalie type 5 sur Infrastructure PKI",
    "domain": "Infrastructure",
    "component": "HSM/Certificats",
    "analysisKeys": "EMV CA Public Key, RID",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-189",
    "title": "Interface - Décodage Processing Code - Anomalie type 5 sur Processing Code",
    "domain": "Interface",
    "component": "ISO 8583/DE3",
    "analysisKeys": "DE3 (000000, 010000, 310000)",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-190",
    "title": "Interface - Identification Marchand - Anomalie type 5 sur Card Acceptor Name",
    "domain": "Interface",
    "component": "ISO 8583/DE43",
    "analysisKeys": "DE43 City/Country",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-191",
    "title": "Interface - Montants Additionnels Solde - Anomalie type 5 sur Additional Amounts",
    "domain": "Interface",
    "component": "ISO 8583/DE54",
    "analysisKeys": "DE54 Available Balance",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-192",
    "title": "Interface - Données Privées Terminal - Anomalie type 5 sur Terminal Data",
    "domain": "Interface",
    "component": "ISO 8583/DE60",
    "analysisKeys": "DE60 Terminal Capability",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-193",
    "title": "Switch - Interface VISA SMS - Anomalie type 5 sur Lien Direct VISA Base I/II",
    "domain": "Switch",
    "component": "Switch/VISA",
    "analysisKeys": "VISA VIP, VAP, 0100",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-194",
    "title": "Switch - Interface Mastercard Banknet - Anomalie type 5 sur Lien Mastercard MIP",
    "domain": "Switch",
    "component": "Switch/Mastercard",
    "analysisKeys": "MIP, 0100, DE48 SE",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-195",
    "title": "Switch - Interbancarité GIMAC - Anomalie type 5 sur Switch Régional GIMAC",
    "domain": "Switch",
    "component": "Switch/GIMAC",
    "analysisKeys": "GIMAC MTI, 0200, DE100",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-196",
    "title": "Switch - Bascule Haute Disponibilité - Anomalie type 5 sur Routage Fallback",
    "domain": "Switch",
    "component": "Switch/Bascule",
    "analysisKeys": "Active/Passive Switch, VIP",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-197",
    "title": "Clearing - Extourne Comptable - Anomalie type 5 sur Contrepassation d'écritures",
    "domain": "Clearing",
    "component": "CBS/Contrepassation",
    "analysisKeys": "DE90, Annulation CBS",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-198",
    "title": "Clearing - Heure de Coupure Cut-Off - Anomalie type 5 sur Arrêté comptable journalier",
    "domain": "Clearing",
    "component": "Clearing/CutOff",
    "analysisKeys": "Cut-Off, Batch Balance",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-199",
    "title": "Clearing - Rejet Lot Compensation - Anomalie type 5 sur Rejet fichier compensation",
    "domain": "Clearing",
    "component": "Clearing/Rejet",
    "analysisKeys": "Fichier EPA, Chargeback",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-200",
    "title": "Clearing - Litige & Chargeback TC40 - Anomalie type 5 sur Déclaration Impayés/Fraude",
    "domain": "Clearing",
    "component": "Clearing/Fraude",
    "analysisKeys": "Chargeback, Representment",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-201",
    "title": "DE39=00 (Approved / Honoré (Délivrance incomplète ou suspicion)) - Canal GAB : Pic de charge transactionnelle [Cas #1]",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "DE39=00, STAN, RRN, ATM/Dispenser",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-202",
    "title": "DE39=08 (Honor with Identification) - Canal TPE : Pic de charge transactionnelle [Cas #1]",
    "domain": "TPE",
    "component": "TPE/Signature",
    "analysisKeys": "DE39=08, STAN, RRN, TPE/Signature",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-203",
    "title": "DE39=10 (Partial Approval) - Canal TPE : Pic de charge transactionnelle [Cas #1]",
    "domain": "TPE",
    "component": "Middleware/SplitTender",
    "analysisKeys": "DE39=10, STAN, RRN, Middleware/SplitTender",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-204",
    "title": "DE39=85 (No reason to decline) - Canal Switch : Pic de charge transactionnelle [Cas #1]",
    "domain": "Switch",
    "component": "Switch/CardCheck",
    "analysisKeys": "DE39=85, STAN, RRN, Switch/CardCheck",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-205",
    "title": "DE39=01 (Refer to Card Issuer) - Canal Switch : Pic de charge transactionnelle [Cas #1]",
    "domain": "Switch",
    "component": "CBS/IssuerCall",
    "analysisKeys": "DE39=01, STAN, RRN, CBS/IssuerCall",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-206",
    "title": "DE39=02 (Refer to Card Issuer Special Condition) - Canal Switch : Pic de charge transactionnelle [Cas #1]",
    "domain": "Switch",
    "component": "CBS/RiskCondition",
    "analysisKeys": "DE39=02, STAN, RRN, CBS/RiskCondition",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-207",
    "title": "DE39=04 (Pick-up Card Hold-call) - Canal GAB : Pic de charge transactionnelle [Cas #1]",
    "domain": "GAB",
    "component": "ATM/Retention",
    "analysisKeys": "DE39=04, STAN, RRN, ATM/Retention",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-208",
    "title": "DE39=05 (Do Not Honor) - Canal Switch : Pic de charge transactionnelle [Cas #1]",
    "domain": "Switch",
    "component": "Issuer/Scoring",
    "analysisKeys": "DE39=05, STAN, RRN, Issuer/Scoring",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-209",
    "title": "DE39=12 (Invalid Transaction) - Canal Switch : Pic de charge transactionnelle [Cas #1]",
    "domain": "Switch",
    "component": "CBS/ProductRules",
    "analysisKeys": "DE39=12, STAN, RRN, CBS/ProductRules",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-210",
    "title": "DE39=13 (Invalid Amount) - Canal GAB : Pic de charge transactionnelle [Cas #1]",
    "domain": "GAB",
    "component": "ATM/BillMix",
    "analysisKeys": "DE39=13, STAN, RRN, ATM/BillMix",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-211",
    "title": "DE39=14 (Invalid Card Number) - Canal Interface : Pic de charge transactionnelle [Cas #1]",
    "domain": "Interface",
    "component": "Frontal/LuhnValidator",
    "analysisKeys": "DE39=14, STAN, RRN, Frontal/LuhnValidator",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-212",
    "title": "DE39=15 (No Such Issuer) - Canal Switch : Pic de charge transactionnelle [Cas #1]",
    "domain": "Switch",
    "component": "Switch/RoutingTable",
    "analysisKeys": "DE39=15, STAN, RRN, Switch/RoutingTable",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-213",
    "title": "DE39=33 (Expired Card Pick-up) - Canal GAB : Pic de charge transactionnelle [Cas #1]",
    "domain": "GAB",
    "component": "ATM/Retention",
    "analysisKeys": "DE39=33, STAN, RRN, ATM/Retention",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-214",
    "title": "DE39=41 (Lost Card Pick-up) - Canal GAB : Pic de charge transactionnelle [Cas #1]",
    "domain": "GAB",
    "component": "ATM/OppositionLost",
    "analysisKeys": "DE39=41, STAN, RRN, ATM/OppositionLost",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-215",
    "title": "DE39=43 (Stolen Card Pick-up) - Canal GAB : Pic de charge transactionnelle [Cas #1]",
    "domain": "GAB",
    "component": "ATM/OppositionStolen",
    "analysisKeys": "DE39=43, STAN, RRN, ATM/OppositionStolen",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-216",
    "title": "DE39=51 (Insufficient Funds) - Canal Core Banking : Pic de charge transactionnelle [Cas #1]",
    "domain": "Core Banking",
    "component": "CBS/Solvabilite",
    "analysisKeys": "DE39=51, STAN, RRN, CBS/Solvabilite",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-217",
    "title": "DE39=54 (Expired Card) - Canal Carte : Pic de charge transactionnelle [Cas #1]",
    "domain": "Carte",
    "component": "CMS/CardValidity",
    "analysisKeys": "DE39=54, STAN, RRN, CMS/CardValidity",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-218",
    "title": "DE39=57 (Transaction Not Permitted to Cardholder) - Canal Carte : Pic de charge transactionnelle [Cas #1]",
    "domain": "Carte",
    "component": "CMS/ContractProfile",
    "analysisKeys": "DE39=57, STAN, RRN, CMS/ContractProfile",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-219",
    "title": "DE39=61 (Exceeds Withdrawal Amount Limit) - Canal GAB : Pic de charge transactionnelle [Cas #1]",
    "domain": "GAB",
    "component": "CMS/VelocityLimits",
    "analysisKeys": "DE39=61, STAN, RRN, CMS/VelocityLimits",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-220",
    "title": "DE39=62 (Restricted Card) - Canal TPE : Pic de charge transactionnelle [Cas #1]",
    "domain": "TPE",
    "component": "CMS/GeoBlocking",
    "analysisKeys": "DE39=62, STAN, RRN, CMS/GeoBlocking",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-221",
    "title": "DE39=65 (Exceeds Withdrawal Frequency Limit) - Canal GAB : Pic de charge transactionnelle [Cas #1]",
    "domain": "GAB",
    "component": "CMS/FrequencyCounter",
    "analysisKeys": "DE39=65, STAN, RRN, CMS/FrequencyCounter",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-222",
    "title": "DE39=75 (Allowable PIN Tries Exceeded) - Canal Carte : Pic de charge transactionnelle [Cas #1]",
    "domain": "Carte",
    "component": "CMS/PinTriesExceeded",
    "analysisKeys": "DE39=75, STAN, RRN, CMS/PinTriesExceeded",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-223",
    "title": "DE39=55 (Incorrect PIN) - Canal Carte : Pic de charge transactionnelle [Cas #1]",
    "domain": "Carte",
    "component": "HSM/PinVerification",
    "analysisKeys": "DE39=55, STAN, RRN, HSM/PinVerification",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-224",
    "title": "DE39=82 (Incorrect CVV / iCVV) - Canal Interface : Pic de charge transactionnelle [Cas #1]",
    "domain": "Interface",
    "component": "HSM/CvvCheck",
    "analysisKeys": "DE39=82, STAN, RRN, HSM/CvvCheck",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-225",
    "title": "DE39=88 (Cryptographic Failure) - Canal Infrastructure : Pic de charge transactionnelle [Cas #1]",
    "domain": "Infrastructure",
    "component": "HSM/CryptoEngine",
    "analysisKeys": "DE39=88, STAN, RRN, HSM/CryptoEngine",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-226",
    "title": "DE39=89 (Invalid PIN Block) - Canal Infrastructure : Pic de charge transactionnelle [Cas #1]",
    "domain": "Infrastructure",
    "component": "HSM/PinTranslation",
    "analysisKeys": "DE39=89, STAN, RRN, HSM/PinTranslation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-227",
    "title": "DE39=93 (Violation / EMV Cryptogram Failure (ARQC rejeté)) - Canal Carte : Pic de charge transactionnelle [Cas #1]",
    "domain": "Carte",
    "component": "HSM/EmvValidation",
    "analysisKeys": "DE39=93, STAN, RRN, HSM/EmvValidation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-228",
    "title": "DE39=19 (Re-enter Transaction) - Canal Réseau : Pic de charge transactionnelle [Cas #1]",
    "domain": "Réseau",
    "component": "Switch/RetryBuffer",
    "analysisKeys": "DE39=19, STAN, RRN, Switch/RetryBuffer",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-229",
    "title": "DE39=25 (Unable to Locate Record on File) - Canal Switch : Pic de charge transactionnelle [Cas #1]",
    "domain": "Switch",
    "component": "CBS/MatchingReversal",
    "analysisKeys": "DE39=25, STAN, RRN, CBS/MatchingReversal",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-230",
    "title": "DE39=30 (Format Error) - Canal Interface : Pic de charge transactionnelle [Cas #1]",
    "domain": "Interface",
    "component": "Interface/IsoParser",
    "analysisKeys": "DE39=30, STAN, RRN, Interface/IsoParser",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-231",
    "title": "DE39=58 (Transaction Not Permitted to Terminal) - Canal TPE : Pic de charge transactionnelle [Cas #1]",
    "domain": "TPE",
    "component": "TMS/TerminalProfile",
    "analysisKeys": "DE39=58, STAN, RRN, TMS/TerminalProfile",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-232",
    "title": "DE39=68 (Response Received Too Late) - Canal Switch : Pic de charge transactionnelle [Cas #1]",
    "domain": "Switch",
    "component": "Switch/TimerQueue",
    "analysisKeys": "DE39=68, STAN, RRN, Switch/TimerQueue",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-233",
    "title": "DE39=76 (Key Synchronization Error) - Canal Infrastructure : Pic de charge transactionnelle [Cas #1]",
    "domain": "Infrastructure",
    "component": "Switch/KeySync",
    "analysisKeys": "DE39=76, STAN, RRN, Switch/KeySync",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-234",
    "title": "DE39=90 (System Cutover in Progress) - Canal Clearing : Pic de charge transactionnelle [Cas #1]",
    "domain": "Clearing",
    "component": "CBS/CutOver",
    "analysisKeys": "DE39=90, STAN, RRN, CBS/CutOver",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-235",
    "title": "DE39=91 (Issuer or Switch Inoperative) - Canal Réseau : Pic de charge transactionnelle [Cas #1]",
    "domain": "Réseau",
    "component": "Switch/IssuerLink",
    "analysisKeys": "DE39=91, STAN, RRN, Switch/IssuerLink",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-236",
    "title": "DE39=92 (Destination Unreachable) - Canal Réseau : Pic de charge transactionnelle [Cas #1]",
    "domain": "Réseau",
    "component": "Réseau/TelecomGateway",
    "analysisKeys": "DE39=92, STAN, RRN, Réseau/TelecomGateway",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-237",
    "title": "DE39=94 (Duplicate Transmission) - Canal Switch : Pic de charge transactionnelle [Cas #1]",
    "domain": "Switch",
    "component": "Switch/DuplicateDetection",
    "analysisKeys": "DE39=94, STAN, RRN, Switch/DuplicateDetection",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-238",
    "title": "DE39=96 (System Malfunction) - Canal Production : Pic de charge transactionnelle [Cas #1]",
    "domain": "Production",
    "component": "Core/DbConnectionPool",
    "analysisKeys": "DE39=96, STAN, RRN, Core/DbConnectionPool",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-239",
    "title": "DE39=98 (MAC Error) - Canal Infrastructure : Pic de charge transactionnelle [Cas #1]",
    "domain": "Infrastructure",
    "component": "HSM/MacValidator",
    "analysisKeys": "DE39=98, STAN, RRN, HSM/MacValidator",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-240",
    "title": "DE39=99 (PIN Block Translation Failure) - Canal Infrastructure : Pic de charge transactionnelle [Cas #1]",
    "domain": "Infrastructure",
    "component": "HSM/ZpkTranslation",
    "analysisKeys": "DE39=99, STAN, RRN, HSM/ZpkTranslation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-241",
    "title": "DE39=00 (Approved / Honoré (Délivrance incomplète ou suspicion)) - Canal GAB : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "DE39=00, STAN, RRN, ATM/Dispenser",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-242",
    "title": "DE39=08 (Honor with Identification) - Canal TPE : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "TPE",
    "component": "TPE/Signature",
    "analysisKeys": "DE39=08, STAN, RRN, TPE/Signature",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-243",
    "title": "DE39=10 (Partial Approval) - Canal TPE : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "TPE",
    "component": "Middleware/SplitTender",
    "analysisKeys": "DE39=10, STAN, RRN, Middleware/SplitTender",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-244",
    "title": "DE39=85 (No reason to decline) - Canal Switch : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Switch",
    "component": "Switch/CardCheck",
    "analysisKeys": "DE39=85, STAN, RRN, Switch/CardCheck",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-245",
    "title": "DE39=01 (Refer to Card Issuer) - Canal Switch : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Switch",
    "component": "CBS/IssuerCall",
    "analysisKeys": "DE39=01, STAN, RRN, CBS/IssuerCall",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-246",
    "title": "DE39=02 (Refer to Card Issuer Special Condition) - Canal Switch : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Switch",
    "component": "CBS/RiskCondition",
    "analysisKeys": "DE39=02, STAN, RRN, CBS/RiskCondition",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-247",
    "title": "DE39=04 (Pick-up Card Hold-call) - Canal GAB : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "GAB",
    "component": "ATM/Retention",
    "analysisKeys": "DE39=04, STAN, RRN, ATM/Retention",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-248",
    "title": "DE39=05 (Do Not Honor) - Canal Switch : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Switch",
    "component": "Issuer/Scoring",
    "analysisKeys": "DE39=05, STAN, RRN, Issuer/Scoring",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-249",
    "title": "DE39=12 (Invalid Transaction) - Canal Switch : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Switch",
    "component": "CBS/ProductRules",
    "analysisKeys": "DE39=12, STAN, RRN, CBS/ProductRules",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-250",
    "title": "DE39=13 (Invalid Amount) - Canal GAB : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "GAB",
    "component": "ATM/BillMix",
    "analysisKeys": "DE39=13, STAN, RRN, ATM/BillMix",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-251",
    "title": "DE39=14 (Invalid Card Number) - Canal Interface : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Interface",
    "component": "Frontal/LuhnValidator",
    "analysisKeys": "DE39=14, STAN, RRN, Frontal/LuhnValidator",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-252",
    "title": "DE39=15 (No Such Issuer) - Canal Switch : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Switch",
    "component": "Switch/RoutingTable",
    "analysisKeys": "DE39=15, STAN, RRN, Switch/RoutingTable",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-253",
    "title": "DE39=33 (Expired Card Pick-up) - Canal GAB : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "GAB",
    "component": "ATM/Retention",
    "analysisKeys": "DE39=33, STAN, RRN, ATM/Retention",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-254",
    "title": "DE39=41 (Lost Card Pick-up) - Canal GAB : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "GAB",
    "component": "ATM/OppositionLost",
    "analysisKeys": "DE39=41, STAN, RRN, ATM/OppositionLost",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-255",
    "title": "DE39=43 (Stolen Card Pick-up) - Canal GAB : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "GAB",
    "component": "ATM/OppositionStolen",
    "analysisKeys": "DE39=43, STAN, RRN, ATM/OppositionStolen",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-256",
    "title": "DE39=51 (Insufficient Funds) - Canal Core Banking : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Core Banking",
    "component": "CBS/Solvabilite",
    "analysisKeys": "DE39=51, STAN, RRN, CBS/Solvabilite",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-257",
    "title": "DE39=54 (Expired Card) - Canal Carte : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Carte",
    "component": "CMS/CardValidity",
    "analysisKeys": "DE39=54, STAN, RRN, CMS/CardValidity",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-258",
    "title": "DE39=57 (Transaction Not Permitted to Cardholder) - Canal Carte : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Carte",
    "component": "CMS/ContractProfile",
    "analysisKeys": "DE39=57, STAN, RRN, CMS/ContractProfile",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-259",
    "title": "DE39=61 (Exceeds Withdrawal Amount Limit) - Canal GAB : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "GAB",
    "component": "CMS/VelocityLimits",
    "analysisKeys": "DE39=61, STAN, RRN, CMS/VelocityLimits",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-260",
    "title": "DE39=62 (Restricted Card) - Canal TPE : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "TPE",
    "component": "CMS/GeoBlocking",
    "analysisKeys": "DE39=62, STAN, RRN, CMS/GeoBlocking",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-261",
    "title": "DE39=65 (Exceeds Withdrawal Frequency Limit) - Canal GAB : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "GAB",
    "component": "CMS/FrequencyCounter",
    "analysisKeys": "DE39=65, STAN, RRN, CMS/FrequencyCounter",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-262",
    "title": "DE39=75 (Allowable PIN Tries Exceeded) - Canal Carte : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Carte",
    "component": "CMS/PinTriesExceeded",
    "analysisKeys": "DE39=75, STAN, RRN, CMS/PinTriesExceeded",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-263",
    "title": "DE39=55 (Incorrect PIN) - Canal Carte : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Carte",
    "component": "HSM/PinVerification",
    "analysisKeys": "DE39=55, STAN, RRN, HSM/PinVerification",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-264",
    "title": "DE39=82 (Incorrect CVV / iCVV) - Canal Interface : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Interface",
    "component": "HSM/CvvCheck",
    "analysisKeys": "DE39=82, STAN, RRN, HSM/CvvCheck",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-265",
    "title": "DE39=88 (Cryptographic Failure) - Canal Infrastructure : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Infrastructure",
    "component": "HSM/CryptoEngine",
    "analysisKeys": "DE39=88, STAN, RRN, HSM/CryptoEngine",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-266",
    "title": "DE39=89 (Invalid PIN Block) - Canal Infrastructure : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Infrastructure",
    "component": "HSM/PinTranslation",
    "analysisKeys": "DE39=89, STAN, RRN, HSM/PinTranslation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-267",
    "title": "DE39=93 (Violation / EMV Cryptogram Failure (ARQC rejeté)) - Canal Carte : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Carte",
    "component": "HSM/EmvValidation",
    "analysisKeys": "DE39=93, STAN, RRN, HSM/EmvValidation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-268",
    "title": "DE39=19 (Re-enter Transaction) - Canal Réseau : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Réseau",
    "component": "Switch/RetryBuffer",
    "analysisKeys": "DE39=19, STAN, RRN, Switch/RetryBuffer",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-269",
    "title": "DE39=25 (Unable to Locate Record on File) - Canal Switch : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Switch",
    "component": "CBS/MatchingReversal",
    "analysisKeys": "DE39=25, STAN, RRN, CBS/MatchingReversal",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-270",
    "title": "DE39=30 (Format Error) - Canal Interface : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Interface",
    "component": "Interface/IsoParser",
    "analysisKeys": "DE39=30, STAN, RRN, Interface/IsoParser",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-271",
    "title": "DE39=58 (Transaction Not Permitted to Terminal) - Canal TPE : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "TPE",
    "component": "TMS/TerminalProfile",
    "analysisKeys": "DE39=58, STAN, RRN, TMS/TerminalProfile",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-272",
    "title": "DE39=68 (Response Received Too Late) - Canal Switch : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Switch",
    "component": "Switch/TimerQueue",
    "analysisKeys": "DE39=68, STAN, RRN, Switch/TimerQueue",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-273",
    "title": "DE39=76 (Key Synchronization Error) - Canal Infrastructure : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Infrastructure",
    "component": "Switch/KeySync",
    "analysisKeys": "DE39=76, STAN, RRN, Switch/KeySync",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-274",
    "title": "DE39=90 (System Cutover in Progress) - Canal Clearing : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Clearing",
    "component": "CBS/CutOver",
    "analysisKeys": "DE39=90, STAN, RRN, CBS/CutOver",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-275",
    "title": "DE39=91 (Issuer or Switch Inoperative) - Canal Réseau : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Réseau",
    "component": "Switch/IssuerLink",
    "analysisKeys": "DE39=91, STAN, RRN, Switch/IssuerLink",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-276",
    "title": "DE39=92 (Destination Unreachable) - Canal Réseau : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Réseau",
    "component": "Réseau/TelecomGateway",
    "analysisKeys": "DE39=92, STAN, RRN, Réseau/TelecomGateway",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-277",
    "title": "DE39=94 (Duplicate Transmission) - Canal Switch : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Switch",
    "component": "Switch/DuplicateDetection",
    "analysisKeys": "DE39=94, STAN, RRN, Switch/DuplicateDetection",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-278",
    "title": "DE39=96 (System Malfunction) - Canal Production : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Production",
    "component": "Core/DbConnectionPool",
    "analysisKeys": "DE39=96, STAN, RRN, Core/DbConnectionPool",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-279",
    "title": "DE39=98 (MAC Error) - Canal Infrastructure : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Infrastructure",
    "component": "HSM/MacValidator",
    "analysisKeys": "DE39=98, STAN, RRN, HSM/MacValidator",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-280",
    "title": "DE39=99 (PIN Block Translation Failure) - Canal Infrastructure : Transactions transfrontalières & roaming [Cas #2]",
    "domain": "Infrastructure",
    "component": "HSM/ZpkTranslation",
    "analysisKeys": "DE39=99, STAN, RRN, HSM/ZpkTranslation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-281",
    "title": "DE39=00 (Approved / Honoré (Délivrance incomplète ou suspicion)) - Canal GAB : Désynchronisation de tables & routage [Cas #3]",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "DE39=00, STAN, RRN, ATM/Dispenser",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-282",
    "title": "DE39=08 (Honor with Identification) - Canal TPE : Désynchronisation de tables & routage [Cas #3]",
    "domain": "TPE",
    "component": "TPE/Signature",
    "analysisKeys": "DE39=08, STAN, RRN, TPE/Signature",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-283",
    "title": "DE39=10 (Partial Approval) - Canal TPE : Désynchronisation de tables & routage [Cas #3]",
    "domain": "TPE",
    "component": "Middleware/SplitTender",
    "analysisKeys": "DE39=10, STAN, RRN, Middleware/SplitTender",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-284",
    "title": "DE39=85 (No reason to decline) - Canal Switch : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Switch",
    "component": "Switch/CardCheck",
    "analysisKeys": "DE39=85, STAN, RRN, Switch/CardCheck",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-285",
    "title": "DE39=01 (Refer to Card Issuer) - Canal Switch : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Switch",
    "component": "CBS/IssuerCall",
    "analysisKeys": "DE39=01, STAN, RRN, CBS/IssuerCall",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-286",
    "title": "DE39=02 (Refer to Card Issuer Special Condition) - Canal Switch : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Switch",
    "component": "CBS/RiskCondition",
    "analysisKeys": "DE39=02, STAN, RRN, CBS/RiskCondition",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-287",
    "title": "DE39=04 (Pick-up Card Hold-call) - Canal GAB : Désynchronisation de tables & routage [Cas #3]",
    "domain": "GAB",
    "component": "ATM/Retention",
    "analysisKeys": "DE39=04, STAN, RRN, ATM/Retention",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-288",
    "title": "DE39=05 (Do Not Honor) - Canal Switch : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Switch",
    "component": "Issuer/Scoring",
    "analysisKeys": "DE39=05, STAN, RRN, Issuer/Scoring",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-289",
    "title": "DE39=12 (Invalid Transaction) - Canal Switch : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Switch",
    "component": "CBS/ProductRules",
    "analysisKeys": "DE39=12, STAN, RRN, CBS/ProductRules",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-290",
    "title": "DE39=13 (Invalid Amount) - Canal GAB : Désynchronisation de tables & routage [Cas #3]",
    "domain": "GAB",
    "component": "ATM/BillMix",
    "analysisKeys": "DE39=13, STAN, RRN, ATM/BillMix",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-291",
    "title": "DE39=14 (Invalid Card Number) - Canal Interface : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Interface",
    "component": "Frontal/LuhnValidator",
    "analysisKeys": "DE39=14, STAN, RRN, Frontal/LuhnValidator",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-292",
    "title": "DE39=15 (No Such Issuer) - Canal Switch : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Switch",
    "component": "Switch/RoutingTable",
    "analysisKeys": "DE39=15, STAN, RRN, Switch/RoutingTable",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-293",
    "title": "DE39=33 (Expired Card Pick-up) - Canal GAB : Désynchronisation de tables & routage [Cas #3]",
    "domain": "GAB",
    "component": "ATM/Retention",
    "analysisKeys": "DE39=33, STAN, RRN, ATM/Retention",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-294",
    "title": "DE39=41 (Lost Card Pick-up) - Canal GAB : Désynchronisation de tables & routage [Cas #3]",
    "domain": "GAB",
    "component": "ATM/OppositionLost",
    "analysisKeys": "DE39=41, STAN, RRN, ATM/OppositionLost",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-295",
    "title": "DE39=43 (Stolen Card Pick-up) - Canal GAB : Désynchronisation de tables & routage [Cas #3]",
    "domain": "GAB",
    "component": "ATM/OppositionStolen",
    "analysisKeys": "DE39=43, STAN, RRN, ATM/OppositionStolen",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-296",
    "title": "DE39=51 (Insufficient Funds) - Canal Core Banking : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Core Banking",
    "component": "CBS/Solvabilite",
    "analysisKeys": "DE39=51, STAN, RRN, CBS/Solvabilite",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-297",
    "title": "DE39=54 (Expired Card) - Canal Carte : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Carte",
    "component": "CMS/CardValidity",
    "analysisKeys": "DE39=54, STAN, RRN, CMS/CardValidity",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-298",
    "title": "DE39=57 (Transaction Not Permitted to Cardholder) - Canal Carte : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Carte",
    "component": "CMS/ContractProfile",
    "analysisKeys": "DE39=57, STAN, RRN, CMS/ContractProfile",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-299",
    "title": "DE39=61 (Exceeds Withdrawal Amount Limit) - Canal GAB : Désynchronisation de tables & routage [Cas #3]",
    "domain": "GAB",
    "component": "CMS/VelocityLimits",
    "analysisKeys": "DE39=61, STAN, RRN, CMS/VelocityLimits",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-300",
    "title": "DE39=62 (Restricted Card) - Canal TPE : Désynchronisation de tables & routage [Cas #3]",
    "domain": "TPE",
    "component": "CMS/GeoBlocking",
    "analysisKeys": "DE39=62, STAN, RRN, CMS/GeoBlocking",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-301",
    "title": "DE39=65 (Exceeds Withdrawal Frequency Limit) - Canal GAB : Désynchronisation de tables & routage [Cas #3]",
    "domain": "GAB",
    "component": "CMS/FrequencyCounter",
    "analysisKeys": "DE39=65, STAN, RRN, CMS/FrequencyCounter",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-302",
    "title": "DE39=75 (Allowable PIN Tries Exceeded) - Canal Carte : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Carte",
    "component": "CMS/PinTriesExceeded",
    "analysisKeys": "DE39=75, STAN, RRN, CMS/PinTriesExceeded",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-303",
    "title": "DE39=55 (Incorrect PIN) - Canal Carte : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Carte",
    "component": "HSM/PinVerification",
    "analysisKeys": "DE39=55, STAN, RRN, HSM/PinVerification",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-304",
    "title": "DE39=82 (Incorrect CVV / iCVV) - Canal Interface : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Interface",
    "component": "HSM/CvvCheck",
    "analysisKeys": "DE39=82, STAN, RRN, HSM/CvvCheck",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-305",
    "title": "DE39=88 (Cryptographic Failure) - Canal Infrastructure : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Infrastructure",
    "component": "HSM/CryptoEngine",
    "analysisKeys": "DE39=88, STAN, RRN, HSM/CryptoEngine",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-306",
    "title": "DE39=89 (Invalid PIN Block) - Canal Infrastructure : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Infrastructure",
    "component": "HSM/PinTranslation",
    "analysisKeys": "DE39=89, STAN, RRN, HSM/PinTranslation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-307",
    "title": "DE39=93 (Violation / EMV Cryptogram Failure (ARQC rejeté)) - Canal Carte : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Carte",
    "component": "HSM/EmvValidation",
    "analysisKeys": "DE39=93, STAN, RRN, HSM/EmvValidation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-308",
    "title": "DE39=19 (Re-enter Transaction) - Canal Réseau : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Réseau",
    "component": "Switch/RetryBuffer",
    "analysisKeys": "DE39=19, STAN, RRN, Switch/RetryBuffer",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-309",
    "title": "DE39=25 (Unable to Locate Record on File) - Canal Switch : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Switch",
    "component": "CBS/MatchingReversal",
    "analysisKeys": "DE39=25, STAN, RRN, CBS/MatchingReversal",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-310",
    "title": "DE39=30 (Format Error) - Canal Interface : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Interface",
    "component": "Interface/IsoParser",
    "analysisKeys": "DE39=30, STAN, RRN, Interface/IsoParser",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-311",
    "title": "DE39=58 (Transaction Not Permitted to Terminal) - Canal TPE : Désynchronisation de tables & routage [Cas #3]",
    "domain": "TPE",
    "component": "TMS/TerminalProfile",
    "analysisKeys": "DE39=58, STAN, RRN, TMS/TerminalProfile",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-312",
    "title": "DE39=68 (Response Received Too Late) - Canal Switch : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Switch",
    "component": "Switch/TimerQueue",
    "analysisKeys": "DE39=68, STAN, RRN, Switch/TimerQueue",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-313",
    "title": "DE39=76 (Key Synchronization Error) - Canal Infrastructure : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Infrastructure",
    "component": "Switch/KeySync",
    "analysisKeys": "DE39=76, STAN, RRN, Switch/KeySync",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-314",
    "title": "DE39=90 (System Cutover in Progress) - Canal Clearing : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Clearing",
    "component": "CBS/CutOver",
    "analysisKeys": "DE39=90, STAN, RRN, CBS/CutOver",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-315",
    "title": "DE39=91 (Issuer or Switch Inoperative) - Canal Réseau : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Réseau",
    "component": "Switch/IssuerLink",
    "analysisKeys": "DE39=91, STAN, RRN, Switch/IssuerLink",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-316",
    "title": "DE39=92 (Destination Unreachable) - Canal Réseau : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Réseau",
    "component": "Réseau/TelecomGateway",
    "analysisKeys": "DE39=92, STAN, RRN, Réseau/TelecomGateway",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-317",
    "title": "DE39=94 (Duplicate Transmission) - Canal Switch : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Switch",
    "component": "Switch/DuplicateDetection",
    "analysisKeys": "DE39=94, STAN, RRN, Switch/DuplicateDetection",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-318",
    "title": "DE39=96 (System Malfunction) - Canal Production : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Production",
    "component": "Core/DbConnectionPool",
    "analysisKeys": "DE39=96, STAN, RRN, Core/DbConnectionPool",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-319",
    "title": "DE39=98 (MAC Error) - Canal Infrastructure : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Infrastructure",
    "component": "HSM/MacValidator",
    "analysisKeys": "DE39=98, STAN, RRN, HSM/MacValidator",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-320",
    "title": "DE39=99 (PIN Block Translation Failure) - Canal Infrastructure : Désynchronisation de tables & routage [Cas #3]",
    "domain": "Infrastructure",
    "component": "HSM/ZpkTranslation",
    "analysisKeys": "DE39=99, STAN, RRN, HSM/ZpkTranslation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-321",
    "title": "DE39=00 (Approved / Honoré (Délivrance incomplète ou suspicion)) - Canal GAB : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "DE39=00, STAN, RRN, ATM/Dispenser",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-322",
    "title": "DE39=08 (Honor with Identification) - Canal TPE : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "TPE",
    "component": "TPE/Signature",
    "analysisKeys": "DE39=08, STAN, RRN, TPE/Signature",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-323",
    "title": "DE39=10 (Partial Approval) - Canal TPE : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "TPE",
    "component": "Middleware/SplitTender",
    "analysisKeys": "DE39=10, STAN, RRN, Middleware/SplitTender",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-324",
    "title": "DE39=85 (No reason to decline) - Canal Switch : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Switch",
    "component": "Switch/CardCheck",
    "analysisKeys": "DE39=85, STAN, RRN, Switch/CardCheck",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-325",
    "title": "DE39=01 (Refer to Card Issuer) - Canal Switch : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Switch",
    "component": "CBS/IssuerCall",
    "analysisKeys": "DE39=01, STAN, RRN, CBS/IssuerCall",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-326",
    "title": "DE39=02 (Refer to Card Issuer Special Condition) - Canal Switch : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Switch",
    "component": "CBS/RiskCondition",
    "analysisKeys": "DE39=02, STAN, RRN, CBS/RiskCondition",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-327",
    "title": "DE39=04 (Pick-up Card Hold-call) - Canal GAB : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "GAB",
    "component": "ATM/Retention",
    "analysisKeys": "DE39=04, STAN, RRN, ATM/Retention",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-328",
    "title": "DE39=05 (Do Not Honor) - Canal Switch : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Switch",
    "component": "Issuer/Scoring",
    "analysisKeys": "DE39=05, STAN, RRN, Issuer/Scoring",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-329",
    "title": "DE39=12 (Invalid Transaction) - Canal Switch : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Switch",
    "component": "CBS/ProductRules",
    "analysisKeys": "DE39=12, STAN, RRN, CBS/ProductRules",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-330",
    "title": "DE39=13 (Invalid Amount) - Canal GAB : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "GAB",
    "component": "ATM/BillMix",
    "analysisKeys": "DE39=13, STAN, RRN, ATM/BillMix",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-331",
    "title": "DE39=14 (Invalid Card Number) - Canal Interface : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Interface",
    "component": "Frontal/LuhnValidator",
    "analysisKeys": "DE39=14, STAN, RRN, Frontal/LuhnValidator",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-332",
    "title": "DE39=15 (No Such Issuer) - Canal Switch : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Switch",
    "component": "Switch/RoutingTable",
    "analysisKeys": "DE39=15, STAN, RRN, Switch/RoutingTable",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-333",
    "title": "DE39=33 (Expired Card Pick-up) - Canal GAB : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "GAB",
    "component": "ATM/Retention",
    "analysisKeys": "DE39=33, STAN, RRN, ATM/Retention",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-334",
    "title": "DE39=41 (Lost Card Pick-up) - Canal GAB : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "GAB",
    "component": "ATM/OppositionLost",
    "analysisKeys": "DE39=41, STAN, RRN, ATM/OppositionLost",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-335",
    "title": "DE39=43 (Stolen Card Pick-up) - Canal GAB : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "GAB",
    "component": "ATM/OppositionStolen",
    "analysisKeys": "DE39=43, STAN, RRN, ATM/OppositionStolen",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-336",
    "title": "DE39=51 (Insufficient Funds) - Canal Core Banking : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Core Banking",
    "component": "CBS/Solvabilite",
    "analysisKeys": "DE39=51, STAN, RRN, CBS/Solvabilite",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-337",
    "title": "DE39=54 (Expired Card) - Canal Carte : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Carte",
    "component": "CMS/CardValidity",
    "analysisKeys": "DE39=54, STAN, RRN, CMS/CardValidity",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-338",
    "title": "DE39=57 (Transaction Not Permitted to Cardholder) - Canal Carte : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Carte",
    "component": "CMS/ContractProfile",
    "analysisKeys": "DE39=57, STAN, RRN, CMS/ContractProfile",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-339",
    "title": "DE39=61 (Exceeds Withdrawal Amount Limit) - Canal GAB : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "GAB",
    "component": "CMS/VelocityLimits",
    "analysisKeys": "DE39=61, STAN, RRN, CMS/VelocityLimits",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-340",
    "title": "DE39=62 (Restricted Card) - Canal TPE : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "TPE",
    "component": "CMS/GeoBlocking",
    "analysisKeys": "DE39=62, STAN, RRN, CMS/GeoBlocking",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-341",
    "title": "DE39=65 (Exceeds Withdrawal Frequency Limit) - Canal GAB : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "GAB",
    "component": "CMS/FrequencyCounter",
    "analysisKeys": "DE39=65, STAN, RRN, CMS/FrequencyCounter",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-342",
    "title": "DE39=75 (Allowable PIN Tries Exceeded) - Canal Carte : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Carte",
    "component": "CMS/PinTriesExceeded",
    "analysisKeys": "DE39=75, STAN, RRN, CMS/PinTriesExceeded",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-343",
    "title": "DE39=55 (Incorrect PIN) - Canal Carte : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Carte",
    "component": "HSM/PinVerification",
    "analysisKeys": "DE39=55, STAN, RRN, HSM/PinVerification",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-344",
    "title": "DE39=82 (Incorrect CVV / iCVV) - Canal Interface : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Interface",
    "component": "HSM/CvvCheck",
    "analysisKeys": "DE39=82, STAN, RRN, HSM/CvvCheck",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-345",
    "title": "DE39=88 (Cryptographic Failure) - Canal Infrastructure : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Infrastructure",
    "component": "HSM/CryptoEngine",
    "analysisKeys": "DE39=88, STAN, RRN, HSM/CryptoEngine",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-346",
    "title": "DE39=89 (Invalid PIN Block) - Canal Infrastructure : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Infrastructure",
    "component": "HSM/PinTranslation",
    "analysisKeys": "DE39=89, STAN, RRN, HSM/PinTranslation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-347",
    "title": "DE39=93 (Violation / EMV Cryptogram Failure (ARQC rejeté)) - Canal Carte : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Carte",
    "component": "HSM/EmvValidation",
    "analysisKeys": "DE39=93, STAN, RRN, HSM/EmvValidation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-348",
    "title": "DE39=19 (Re-enter Transaction) - Canal Réseau : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Réseau",
    "component": "Switch/RetryBuffer",
    "analysisKeys": "DE39=19, STAN, RRN, Switch/RetryBuffer",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-349",
    "title": "DE39=25 (Unable to Locate Record on File) - Canal Switch : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Switch",
    "component": "CBS/MatchingReversal",
    "analysisKeys": "DE39=25, STAN, RRN, CBS/MatchingReversal",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-350",
    "title": "DE39=30 (Format Error) - Canal Interface : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Interface",
    "component": "Interface/IsoParser",
    "analysisKeys": "DE39=30, STAN, RRN, Interface/IsoParser",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-351",
    "title": "DE39=58 (Transaction Not Permitted to Terminal) - Canal TPE : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "TPE",
    "component": "TMS/TerminalProfile",
    "analysisKeys": "DE39=58, STAN, RRN, TMS/TerminalProfile",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-352",
    "title": "DE39=68 (Response Received Too Late) - Canal Switch : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Switch",
    "component": "Switch/TimerQueue",
    "analysisKeys": "DE39=68, STAN, RRN, Switch/TimerQueue",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-353",
    "title": "DE39=76 (Key Synchronization Error) - Canal Infrastructure : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Infrastructure",
    "component": "Switch/KeySync",
    "analysisKeys": "DE39=76, STAN, RRN, Switch/KeySync",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-354",
    "title": "DE39=90 (System Cutover in Progress) - Canal Clearing : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Clearing",
    "component": "CBS/CutOver",
    "analysisKeys": "DE39=90, STAN, RRN, CBS/CutOver",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-355",
    "title": "DE39=91 (Issuer or Switch Inoperative) - Canal Réseau : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Réseau",
    "component": "Switch/IssuerLink",
    "analysisKeys": "DE39=91, STAN, RRN, Switch/IssuerLink",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-356",
    "title": "DE39=92 (Destination Unreachable) - Canal Réseau : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Réseau",
    "component": "Réseau/TelecomGateway",
    "analysisKeys": "DE39=92, STAN, RRN, Réseau/TelecomGateway",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-357",
    "title": "DE39=94 (Duplicate Transmission) - Canal Switch : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Switch",
    "component": "Switch/DuplicateDetection",
    "analysisKeys": "DE39=94, STAN, RRN, Switch/DuplicateDetection",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-358",
    "title": "DE39=96 (System Malfunction) - Canal Production : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Production",
    "component": "Core/DbConnectionPool",
    "analysisKeys": "DE39=96, STAN, RRN, Core/DbConnectionPool",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-359",
    "title": "DE39=98 (MAC Error) - Canal Infrastructure : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Infrastructure",
    "component": "HSM/MacValidator",
    "analysisKeys": "DE39=98, STAN, RRN, HSM/MacValidator",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-360",
    "title": "DE39=99 (PIN Block Translation Failure) - Canal Infrastructure : Micro-coupure réseau et reconnexion [Cas #4]",
    "domain": "Infrastructure",
    "component": "HSM/ZpkTranslation",
    "analysisKeys": "DE39=99, STAN, RRN, HSM/ZpkTranslation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-361",
    "title": "DE39=00 (Approved / Honoré (Délivrance incomplète ou suspicion)) - Canal GAB : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "DE39=00, STAN, RRN, ATM/Dispenser",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-362",
    "title": "DE39=08 (Honor with Identification) - Canal TPE : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "TPE",
    "component": "TPE/Signature",
    "analysisKeys": "DE39=08, STAN, RRN, TPE/Signature",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-363",
    "title": "DE39=10 (Partial Approval) - Canal TPE : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "TPE",
    "component": "Middleware/SplitTender",
    "analysisKeys": "DE39=10, STAN, RRN, Middleware/SplitTender",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-364",
    "title": "DE39=85 (No reason to decline) - Canal Switch : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Switch",
    "component": "Switch/CardCheck",
    "analysisKeys": "DE39=85, STAN, RRN, Switch/CardCheck",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-365",
    "title": "DE39=01 (Refer to Card Issuer) - Canal Switch : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Switch",
    "component": "CBS/IssuerCall",
    "analysisKeys": "DE39=01, STAN, RRN, CBS/IssuerCall",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-366",
    "title": "DE39=02 (Refer to Card Issuer Special Condition) - Canal Switch : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Switch",
    "component": "CBS/RiskCondition",
    "analysisKeys": "DE39=02, STAN, RRN, CBS/RiskCondition",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-367",
    "title": "DE39=04 (Pick-up Card Hold-call) - Canal GAB : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "GAB",
    "component": "ATM/Retention",
    "analysisKeys": "DE39=04, STAN, RRN, ATM/Retention",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-368",
    "title": "DE39=05 (Do Not Honor) - Canal Switch : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Switch",
    "component": "Issuer/Scoring",
    "analysisKeys": "DE39=05, STAN, RRN, Issuer/Scoring",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-369",
    "title": "DE39=12 (Invalid Transaction) - Canal Switch : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Switch",
    "component": "CBS/ProductRules",
    "analysisKeys": "DE39=12, STAN, RRN, CBS/ProductRules",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-370",
    "title": "DE39=13 (Invalid Amount) - Canal GAB : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "GAB",
    "component": "ATM/BillMix",
    "analysisKeys": "DE39=13, STAN, RRN, ATM/BillMix",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-371",
    "title": "DE39=14 (Invalid Card Number) - Canal Interface : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Interface",
    "component": "Frontal/LuhnValidator",
    "analysisKeys": "DE39=14, STAN, RRN, Frontal/LuhnValidator",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-372",
    "title": "DE39=15 (No Such Issuer) - Canal Switch : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Switch",
    "component": "Switch/RoutingTable",
    "analysisKeys": "DE39=15, STAN, RRN, Switch/RoutingTable",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-373",
    "title": "DE39=33 (Expired Card Pick-up) - Canal GAB : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "GAB",
    "component": "ATM/Retention",
    "analysisKeys": "DE39=33, STAN, RRN, ATM/Retention",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-374",
    "title": "DE39=41 (Lost Card Pick-up) - Canal GAB : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "GAB",
    "component": "ATM/OppositionLost",
    "analysisKeys": "DE39=41, STAN, RRN, ATM/OppositionLost",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-375",
    "title": "DE39=43 (Stolen Card Pick-up) - Canal GAB : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "GAB",
    "component": "ATM/OppositionStolen",
    "analysisKeys": "DE39=43, STAN, RRN, ATM/OppositionStolen",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-376",
    "title": "DE39=51 (Insufficient Funds) - Canal Core Banking : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Core Banking",
    "component": "CBS/Solvabilite",
    "analysisKeys": "DE39=51, STAN, RRN, CBS/Solvabilite",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-377",
    "title": "DE39=54 (Expired Card) - Canal Carte : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Carte",
    "component": "CMS/CardValidity",
    "analysisKeys": "DE39=54, STAN, RRN, CMS/CardValidity",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-378",
    "title": "DE39=57 (Transaction Not Permitted to Cardholder) - Canal Carte : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Carte",
    "component": "CMS/ContractProfile",
    "analysisKeys": "DE39=57, STAN, RRN, CMS/ContractProfile",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-379",
    "title": "DE39=61 (Exceeds Withdrawal Amount Limit) - Canal GAB : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "GAB",
    "component": "CMS/VelocityLimits",
    "analysisKeys": "DE39=61, STAN, RRN, CMS/VelocityLimits",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-380",
    "title": "DE39=62 (Restricted Card) - Canal TPE : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "TPE",
    "component": "CMS/GeoBlocking",
    "analysisKeys": "DE39=62, STAN, RRN, CMS/GeoBlocking",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-381",
    "title": "DE39=65 (Exceeds Withdrawal Frequency Limit) - Canal GAB : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "GAB",
    "component": "CMS/FrequencyCounter",
    "analysisKeys": "DE39=65, STAN, RRN, CMS/FrequencyCounter",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-382",
    "title": "DE39=75 (Allowable PIN Tries Exceeded) - Canal Carte : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Carte",
    "component": "CMS/PinTriesExceeded",
    "analysisKeys": "DE39=75, STAN, RRN, CMS/PinTriesExceeded",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-383",
    "title": "DE39=55 (Incorrect PIN) - Canal Carte : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Carte",
    "component": "HSM/PinVerification",
    "analysisKeys": "DE39=55, STAN, RRN, HSM/PinVerification",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-384",
    "title": "DE39=82 (Incorrect CVV / iCVV) - Canal Interface : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Interface",
    "component": "HSM/CvvCheck",
    "analysisKeys": "DE39=82, STAN, RRN, HSM/CvvCheck",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-385",
    "title": "DE39=88 (Cryptographic Failure) - Canal Infrastructure : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Infrastructure",
    "component": "HSM/CryptoEngine",
    "analysisKeys": "DE39=88, STAN, RRN, HSM/CryptoEngine",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-386",
    "title": "DE39=89 (Invalid PIN Block) - Canal Infrastructure : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Infrastructure",
    "component": "HSM/PinTranslation",
    "analysisKeys": "DE39=89, STAN, RRN, HSM/PinTranslation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-387",
    "title": "DE39=93 (Violation / EMV Cryptogram Failure (ARQC rejeté)) - Canal Carte : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Carte",
    "component": "HSM/EmvValidation",
    "analysisKeys": "DE39=93, STAN, RRN, HSM/EmvValidation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-388",
    "title": "DE39=19 (Re-enter Transaction) - Canal Réseau : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Réseau",
    "component": "Switch/RetryBuffer",
    "analysisKeys": "DE39=19, STAN, RRN, Switch/RetryBuffer",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-389",
    "title": "DE39=25 (Unable to Locate Record on File) - Canal Switch : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Switch",
    "component": "CBS/MatchingReversal",
    "analysisKeys": "DE39=25, STAN, RRN, CBS/MatchingReversal",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-390",
    "title": "DE39=30 (Format Error) - Canal Interface : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Interface",
    "component": "Interface/IsoParser",
    "analysisKeys": "DE39=30, STAN, RRN, Interface/IsoParser",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-391",
    "title": "DE39=58 (Transaction Not Permitted to Terminal) - Canal TPE : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "TPE",
    "component": "TMS/TerminalProfile",
    "analysisKeys": "DE39=58, STAN, RRN, TMS/TerminalProfile",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-392",
    "title": "DE39=68 (Response Received Too Late) - Canal Switch : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Switch",
    "component": "Switch/TimerQueue",
    "analysisKeys": "DE39=68, STAN, RRN, Switch/TimerQueue",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-393",
    "title": "DE39=76 (Key Synchronization Error) - Canal Infrastructure : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Infrastructure",
    "component": "Switch/KeySync",
    "analysisKeys": "DE39=76, STAN, RRN, Switch/KeySync",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-394",
    "title": "DE39=90 (System Cutover in Progress) - Canal Clearing : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Clearing",
    "component": "CBS/CutOver",
    "analysisKeys": "DE39=90, STAN, RRN, CBS/CutOver",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-395",
    "title": "DE39=91 (Issuer or Switch Inoperative) - Canal Réseau : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Réseau",
    "component": "Switch/IssuerLink",
    "analysisKeys": "DE39=91, STAN, RRN, Switch/IssuerLink",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-396",
    "title": "DE39=92 (Destination Unreachable) - Canal Réseau : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Réseau",
    "component": "Réseau/TelecomGateway",
    "analysisKeys": "DE39=92, STAN, RRN, Réseau/TelecomGateway",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-397",
    "title": "DE39=94 (Duplicate Transmission) - Canal Switch : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Switch",
    "component": "Switch/DuplicateDetection",
    "analysisKeys": "DE39=94, STAN, RRN, Switch/DuplicateDetection",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-398",
    "title": "DE39=96 (System Malfunction) - Canal Production : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Production",
    "component": "Core/DbConnectionPool",
    "analysisKeys": "DE39=96, STAN, RRN, Core/DbConnectionPool",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-399",
    "title": "DE39=98 (MAC Error) - Canal Infrastructure : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Infrastructure",
    "component": "HSM/MacValidator",
    "analysisKeys": "DE39=98, STAN, RRN, HSM/MacValidator",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-400",
    "title": "DE39=99 (PIN Block Translation Failure) - Canal Infrastructure : Comportement anormal porteurs & vélocité [Cas #5]",
    "domain": "Infrastructure",
    "component": "HSM/ZpkTranslation",
    "analysisKeys": "DE39=99, STAN, RRN, HSM/ZpkTranslation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-401",
    "title": "DE39=00 (Approved / Honoré (Délivrance incomplète ou suspicion)) - Canal GAB : Timeouts et gestion des annulations [Cas #6]",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "DE39=00, STAN, RRN, ATM/Dispenser",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-402",
    "title": "DE39=08 (Honor with Identification) - Canal TPE : Timeouts et gestion des annulations [Cas #6]",
    "domain": "TPE",
    "component": "TPE/Signature",
    "analysisKeys": "DE39=08, STAN, RRN, TPE/Signature",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-403",
    "title": "DE39=10 (Partial Approval) - Canal TPE : Timeouts et gestion des annulations [Cas #6]",
    "domain": "TPE",
    "component": "Middleware/SplitTender",
    "analysisKeys": "DE39=10, STAN, RRN, Middleware/SplitTender",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-404",
    "title": "DE39=85 (No reason to decline) - Canal Switch : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Switch",
    "component": "Switch/CardCheck",
    "analysisKeys": "DE39=85, STAN, RRN, Switch/CardCheck",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-405",
    "title": "DE39=01 (Refer to Card Issuer) - Canal Switch : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Switch",
    "component": "CBS/IssuerCall",
    "analysisKeys": "DE39=01, STAN, RRN, CBS/IssuerCall",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-406",
    "title": "DE39=02 (Refer to Card Issuer Special Condition) - Canal Switch : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Switch",
    "component": "CBS/RiskCondition",
    "analysisKeys": "DE39=02, STAN, RRN, CBS/RiskCondition",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-407",
    "title": "DE39=04 (Pick-up Card Hold-call) - Canal GAB : Timeouts et gestion des annulations [Cas #6]",
    "domain": "GAB",
    "component": "ATM/Retention",
    "analysisKeys": "DE39=04, STAN, RRN, ATM/Retention",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-408",
    "title": "DE39=05 (Do Not Honor) - Canal Switch : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Switch",
    "component": "Issuer/Scoring",
    "analysisKeys": "DE39=05, STAN, RRN, Issuer/Scoring",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-409",
    "title": "DE39=12 (Invalid Transaction) - Canal Switch : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Switch",
    "component": "CBS/ProductRules",
    "analysisKeys": "DE39=12, STAN, RRN, CBS/ProductRules",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-410",
    "title": "DE39=13 (Invalid Amount) - Canal GAB : Timeouts et gestion des annulations [Cas #6]",
    "domain": "GAB",
    "component": "ATM/BillMix",
    "analysisKeys": "DE39=13, STAN, RRN, ATM/BillMix",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-411",
    "title": "DE39=14 (Invalid Card Number) - Canal Interface : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Interface",
    "component": "Frontal/LuhnValidator",
    "analysisKeys": "DE39=14, STAN, RRN, Frontal/LuhnValidator",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-412",
    "title": "DE39=15 (No Such Issuer) - Canal Switch : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Switch",
    "component": "Switch/RoutingTable",
    "analysisKeys": "DE39=15, STAN, RRN, Switch/RoutingTable",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-413",
    "title": "DE39=33 (Expired Card Pick-up) - Canal GAB : Timeouts et gestion des annulations [Cas #6]",
    "domain": "GAB",
    "component": "ATM/Retention",
    "analysisKeys": "DE39=33, STAN, RRN, ATM/Retention",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-414",
    "title": "DE39=41 (Lost Card Pick-up) - Canal GAB : Timeouts et gestion des annulations [Cas #6]",
    "domain": "GAB",
    "component": "ATM/OppositionLost",
    "analysisKeys": "DE39=41, STAN, RRN, ATM/OppositionLost",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-415",
    "title": "DE39=43 (Stolen Card Pick-up) - Canal GAB : Timeouts et gestion des annulations [Cas #6]",
    "domain": "GAB",
    "component": "ATM/OppositionStolen",
    "analysisKeys": "DE39=43, STAN, RRN, ATM/OppositionStolen",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-416",
    "title": "DE39=51 (Insufficient Funds) - Canal Core Banking : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Core Banking",
    "component": "CBS/Solvabilite",
    "analysisKeys": "DE39=51, STAN, RRN, CBS/Solvabilite",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-417",
    "title": "DE39=54 (Expired Card) - Canal Carte : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Carte",
    "component": "CMS/CardValidity",
    "analysisKeys": "DE39=54, STAN, RRN, CMS/CardValidity",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-418",
    "title": "DE39=57 (Transaction Not Permitted to Cardholder) - Canal Carte : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Carte",
    "component": "CMS/ContractProfile",
    "analysisKeys": "DE39=57, STAN, RRN, CMS/ContractProfile",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-419",
    "title": "DE39=61 (Exceeds Withdrawal Amount Limit) - Canal GAB : Timeouts et gestion des annulations [Cas #6]",
    "domain": "GAB",
    "component": "CMS/VelocityLimits",
    "analysisKeys": "DE39=61, STAN, RRN, CMS/VelocityLimits",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-420",
    "title": "DE39=62 (Restricted Card) - Canal TPE : Timeouts et gestion des annulations [Cas #6]",
    "domain": "TPE",
    "component": "CMS/GeoBlocking",
    "analysisKeys": "DE39=62, STAN, RRN, CMS/GeoBlocking",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-421",
    "title": "DE39=65 (Exceeds Withdrawal Frequency Limit) - Canal GAB : Timeouts et gestion des annulations [Cas #6]",
    "domain": "GAB",
    "component": "CMS/FrequencyCounter",
    "analysisKeys": "DE39=65, STAN, RRN, CMS/FrequencyCounter",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-422",
    "title": "DE39=75 (Allowable PIN Tries Exceeded) - Canal Carte : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Carte",
    "component": "CMS/PinTriesExceeded",
    "analysisKeys": "DE39=75, STAN, RRN, CMS/PinTriesExceeded",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-423",
    "title": "DE39=55 (Incorrect PIN) - Canal Carte : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Carte",
    "component": "HSM/PinVerification",
    "analysisKeys": "DE39=55, STAN, RRN, HSM/PinVerification",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-424",
    "title": "DE39=82 (Incorrect CVV / iCVV) - Canal Interface : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Interface",
    "component": "HSM/CvvCheck",
    "analysisKeys": "DE39=82, STAN, RRN, HSM/CvvCheck",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-425",
    "title": "DE39=88 (Cryptographic Failure) - Canal Infrastructure : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Infrastructure",
    "component": "HSM/CryptoEngine",
    "analysisKeys": "DE39=88, STAN, RRN, HSM/CryptoEngine",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-426",
    "title": "DE39=89 (Invalid PIN Block) - Canal Infrastructure : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Infrastructure",
    "component": "HSM/PinTranslation",
    "analysisKeys": "DE39=89, STAN, RRN, HSM/PinTranslation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-427",
    "title": "DE39=93 (Violation / EMV Cryptogram Failure (ARQC rejeté)) - Canal Carte : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Carte",
    "component": "HSM/EmvValidation",
    "analysisKeys": "DE39=93, STAN, RRN, HSM/EmvValidation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-428",
    "title": "DE39=19 (Re-enter Transaction) - Canal Réseau : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Réseau",
    "component": "Switch/RetryBuffer",
    "analysisKeys": "DE39=19, STAN, RRN, Switch/RetryBuffer",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-429",
    "title": "DE39=25 (Unable to Locate Record on File) - Canal Switch : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Switch",
    "component": "CBS/MatchingReversal",
    "analysisKeys": "DE39=25, STAN, RRN, CBS/MatchingReversal",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-430",
    "title": "DE39=30 (Format Error) - Canal Interface : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Interface",
    "component": "Interface/IsoParser",
    "analysisKeys": "DE39=30, STAN, RRN, Interface/IsoParser",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-431",
    "title": "DE39=58 (Transaction Not Permitted to Terminal) - Canal TPE : Timeouts et gestion des annulations [Cas #6]",
    "domain": "TPE",
    "component": "TMS/TerminalProfile",
    "analysisKeys": "DE39=58, STAN, RRN, TMS/TerminalProfile",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-432",
    "title": "DE39=68 (Response Received Too Late) - Canal Switch : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Switch",
    "component": "Switch/TimerQueue",
    "analysisKeys": "DE39=68, STAN, RRN, Switch/TimerQueue",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-433",
    "title": "DE39=76 (Key Synchronization Error) - Canal Infrastructure : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Infrastructure",
    "component": "Switch/KeySync",
    "analysisKeys": "DE39=76, STAN, RRN, Switch/KeySync",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-434",
    "title": "DE39=90 (System Cutover in Progress) - Canal Clearing : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Clearing",
    "component": "CBS/CutOver",
    "analysisKeys": "DE39=90, STAN, RRN, CBS/CutOver",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-435",
    "title": "DE39=91 (Issuer or Switch Inoperative) - Canal Réseau : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Réseau",
    "component": "Switch/IssuerLink",
    "analysisKeys": "DE39=91, STAN, RRN, Switch/IssuerLink",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-436",
    "title": "DE39=92 (Destination Unreachable) - Canal Réseau : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Réseau",
    "component": "Réseau/TelecomGateway",
    "analysisKeys": "DE39=92, STAN, RRN, Réseau/TelecomGateway",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-437",
    "title": "DE39=94 (Duplicate Transmission) - Canal Switch : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Switch",
    "component": "Switch/DuplicateDetection",
    "analysisKeys": "DE39=94, STAN, RRN, Switch/DuplicateDetection",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-438",
    "title": "DE39=96 (System Malfunction) - Canal Production : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Production",
    "component": "Core/DbConnectionPool",
    "analysisKeys": "DE39=96, STAN, RRN, Core/DbConnectionPool",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-439",
    "title": "DE39=98 (MAC Error) - Canal Infrastructure : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Infrastructure",
    "component": "HSM/MacValidator",
    "analysisKeys": "DE39=98, STAN, RRN, HSM/MacValidator",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-440",
    "title": "DE39=99 (PIN Block Translation Failure) - Canal Infrastructure : Timeouts et gestion des annulations [Cas #6]",
    "domain": "Infrastructure",
    "component": "HSM/ZpkTranslation",
    "analysisKeys": "DE39=99, STAN, RRN, HSM/ZpkTranslation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-441",
    "title": "DE39=00 (Approved / Honoré (Délivrance incomplète ou suspicion)) - Canal GAB : Réconciliation, balance et compensation [Cas #7]",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "DE39=00, STAN, RRN, ATM/Dispenser",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-442",
    "title": "DE39=08 (Honor with Identification) - Canal TPE : Réconciliation, balance et compensation [Cas #7]",
    "domain": "TPE",
    "component": "TPE/Signature",
    "analysisKeys": "DE39=08, STAN, RRN, TPE/Signature",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-443",
    "title": "DE39=10 (Partial Approval) - Canal TPE : Réconciliation, balance et compensation [Cas #7]",
    "domain": "TPE",
    "component": "Middleware/SplitTender",
    "analysisKeys": "DE39=10, STAN, RRN, Middleware/SplitTender",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-444",
    "title": "DE39=85 (No reason to decline) - Canal Switch : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Switch",
    "component": "Switch/CardCheck",
    "analysisKeys": "DE39=85, STAN, RRN, Switch/CardCheck",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-445",
    "title": "DE39=01 (Refer to Card Issuer) - Canal Switch : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Switch",
    "component": "CBS/IssuerCall",
    "analysisKeys": "DE39=01, STAN, RRN, CBS/IssuerCall",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-446",
    "title": "DE39=02 (Refer to Card Issuer Special Condition) - Canal Switch : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Switch",
    "component": "CBS/RiskCondition",
    "analysisKeys": "DE39=02, STAN, RRN, CBS/RiskCondition",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-447",
    "title": "DE39=04 (Pick-up Card Hold-call) - Canal GAB : Réconciliation, balance et compensation [Cas #7]",
    "domain": "GAB",
    "component": "ATM/Retention",
    "analysisKeys": "DE39=04, STAN, RRN, ATM/Retention",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-448",
    "title": "DE39=05 (Do Not Honor) - Canal Switch : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Switch",
    "component": "Issuer/Scoring",
    "analysisKeys": "DE39=05, STAN, RRN, Issuer/Scoring",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-449",
    "title": "DE39=12 (Invalid Transaction) - Canal Switch : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Switch",
    "component": "CBS/ProductRules",
    "analysisKeys": "DE39=12, STAN, RRN, CBS/ProductRules",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-450",
    "title": "DE39=13 (Invalid Amount) - Canal GAB : Réconciliation, balance et compensation [Cas #7]",
    "domain": "GAB",
    "component": "ATM/BillMix",
    "analysisKeys": "DE39=13, STAN, RRN, ATM/BillMix",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-451",
    "title": "DE39=14 (Invalid Card Number) - Canal Interface : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Interface",
    "component": "Frontal/LuhnValidator",
    "analysisKeys": "DE39=14, STAN, RRN, Frontal/LuhnValidator",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-452",
    "title": "DE39=15 (No Such Issuer) - Canal Switch : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Switch",
    "component": "Switch/RoutingTable",
    "analysisKeys": "DE39=15, STAN, RRN, Switch/RoutingTable",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-453",
    "title": "DE39=33 (Expired Card Pick-up) - Canal GAB : Réconciliation, balance et compensation [Cas #7]",
    "domain": "GAB",
    "component": "ATM/Retention",
    "analysisKeys": "DE39=33, STAN, RRN, ATM/Retention",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-454",
    "title": "DE39=41 (Lost Card Pick-up) - Canal GAB : Réconciliation, balance et compensation [Cas #7]",
    "domain": "GAB",
    "component": "ATM/OppositionLost",
    "analysisKeys": "DE39=41, STAN, RRN, ATM/OppositionLost",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-455",
    "title": "DE39=43 (Stolen Card Pick-up) - Canal GAB : Réconciliation, balance et compensation [Cas #7]",
    "domain": "GAB",
    "component": "ATM/OppositionStolen",
    "analysisKeys": "DE39=43, STAN, RRN, ATM/OppositionStolen",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-456",
    "title": "DE39=51 (Insufficient Funds) - Canal Core Banking : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Core Banking",
    "component": "CBS/Solvabilite",
    "analysisKeys": "DE39=51, STAN, RRN, CBS/Solvabilite",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-457",
    "title": "DE39=54 (Expired Card) - Canal Carte : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Carte",
    "component": "CMS/CardValidity",
    "analysisKeys": "DE39=54, STAN, RRN, CMS/CardValidity",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-458",
    "title": "DE39=57 (Transaction Not Permitted to Cardholder) - Canal Carte : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Carte",
    "component": "CMS/ContractProfile",
    "analysisKeys": "DE39=57, STAN, RRN, CMS/ContractProfile",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-459",
    "title": "DE39=61 (Exceeds Withdrawal Amount Limit) - Canal GAB : Réconciliation, balance et compensation [Cas #7]",
    "domain": "GAB",
    "component": "CMS/VelocityLimits",
    "analysisKeys": "DE39=61, STAN, RRN, CMS/VelocityLimits",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-460",
    "title": "DE39=62 (Restricted Card) - Canal TPE : Réconciliation, balance et compensation [Cas #7]",
    "domain": "TPE",
    "component": "CMS/GeoBlocking",
    "analysisKeys": "DE39=62, STAN, RRN, CMS/GeoBlocking",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-461",
    "title": "DE39=65 (Exceeds Withdrawal Frequency Limit) - Canal GAB : Réconciliation, balance et compensation [Cas #7]",
    "domain": "GAB",
    "component": "CMS/FrequencyCounter",
    "analysisKeys": "DE39=65, STAN, RRN, CMS/FrequencyCounter",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-462",
    "title": "DE39=75 (Allowable PIN Tries Exceeded) - Canal Carte : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Carte",
    "component": "CMS/PinTriesExceeded",
    "analysisKeys": "DE39=75, STAN, RRN, CMS/PinTriesExceeded",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-463",
    "title": "DE39=55 (Incorrect PIN) - Canal Carte : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Carte",
    "component": "HSM/PinVerification",
    "analysisKeys": "DE39=55, STAN, RRN, HSM/PinVerification",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-464",
    "title": "DE39=82 (Incorrect CVV / iCVV) - Canal Interface : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Interface",
    "component": "HSM/CvvCheck",
    "analysisKeys": "DE39=82, STAN, RRN, HSM/CvvCheck",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-465",
    "title": "DE39=88 (Cryptographic Failure) - Canal Infrastructure : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Infrastructure",
    "component": "HSM/CryptoEngine",
    "analysisKeys": "DE39=88, STAN, RRN, HSM/CryptoEngine",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-466",
    "title": "DE39=89 (Invalid PIN Block) - Canal Infrastructure : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Infrastructure",
    "component": "HSM/PinTranslation",
    "analysisKeys": "DE39=89, STAN, RRN, HSM/PinTranslation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-467",
    "title": "DE39=93 (Violation / EMV Cryptogram Failure (ARQC rejeté)) - Canal Carte : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Carte",
    "component": "HSM/EmvValidation",
    "analysisKeys": "DE39=93, STAN, RRN, HSM/EmvValidation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-468",
    "title": "DE39=19 (Re-enter Transaction) - Canal Réseau : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Réseau",
    "component": "Switch/RetryBuffer",
    "analysisKeys": "DE39=19, STAN, RRN, Switch/RetryBuffer",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-469",
    "title": "DE39=25 (Unable to Locate Record on File) - Canal Switch : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Switch",
    "component": "CBS/MatchingReversal",
    "analysisKeys": "DE39=25, STAN, RRN, CBS/MatchingReversal",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-470",
    "title": "DE39=30 (Format Error) - Canal Interface : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Interface",
    "component": "Interface/IsoParser",
    "analysisKeys": "DE39=30, STAN, RRN, Interface/IsoParser",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-471",
    "title": "DE39=58 (Transaction Not Permitted to Terminal) - Canal TPE : Réconciliation, balance et compensation [Cas #7]",
    "domain": "TPE",
    "component": "TMS/TerminalProfile",
    "analysisKeys": "DE39=58, STAN, RRN, TMS/TerminalProfile",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-472",
    "title": "DE39=68 (Response Received Too Late) - Canal Switch : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Switch",
    "component": "Switch/TimerQueue",
    "analysisKeys": "DE39=68, STAN, RRN, Switch/TimerQueue",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-473",
    "title": "DE39=76 (Key Synchronization Error) - Canal Infrastructure : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Infrastructure",
    "component": "Switch/KeySync",
    "analysisKeys": "DE39=76, STAN, RRN, Switch/KeySync",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-474",
    "title": "DE39=90 (System Cutover in Progress) - Canal Clearing : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Clearing",
    "component": "CBS/CutOver",
    "analysisKeys": "DE39=90, STAN, RRN, CBS/CutOver",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-475",
    "title": "DE39=91 (Issuer or Switch Inoperative) - Canal Réseau : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Réseau",
    "component": "Switch/IssuerLink",
    "analysisKeys": "DE39=91, STAN, RRN, Switch/IssuerLink",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-476",
    "title": "DE39=92 (Destination Unreachable) - Canal Réseau : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Réseau",
    "component": "Réseau/TelecomGateway",
    "analysisKeys": "DE39=92, STAN, RRN, Réseau/TelecomGateway",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-477",
    "title": "DE39=94 (Duplicate Transmission) - Canal Switch : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Switch",
    "component": "Switch/DuplicateDetection",
    "analysisKeys": "DE39=94, STAN, RRN, Switch/DuplicateDetection",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-478",
    "title": "DE39=96 (System Malfunction) - Canal Production : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Production",
    "component": "Core/DbConnectionPool",
    "analysisKeys": "DE39=96, STAN, RRN, Core/DbConnectionPool",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-479",
    "title": "DE39=98 (MAC Error) - Canal Infrastructure : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Infrastructure",
    "component": "HSM/MacValidator",
    "analysisKeys": "DE39=98, STAN, RRN, HSM/MacValidator",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-480",
    "title": "DE39=99 (PIN Block Translation Failure) - Canal Infrastructure : Réconciliation, balance et compensation [Cas #7]",
    "domain": "Infrastructure",
    "component": "HSM/ZpkTranslation",
    "analysisKeys": "DE39=99, STAN, RRN, HSM/ZpkTranslation",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-481",
    "title": "DE39=00 (Approved / Honoré (Délivrance incomplète ou suspicion)) - Canal GAB : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "DE39=00, STAN, RRN, ATM/Dispenser",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-482",
    "title": "DE39=08 (Honor with Identification) - Canal TPE : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "TPE",
    "component": "TPE/Signature",
    "analysisKeys": "DE39=08, STAN, RRN, TPE/Signature",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-483",
    "title": "DE39=10 (Partial Approval) - Canal TPE : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "TPE",
    "component": "Middleware/SplitTender",
    "analysisKeys": "DE39=10, STAN, RRN, Middleware/SplitTender",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-484",
    "title": "DE39=85 (No reason to decline) - Canal Switch : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "Switch",
    "component": "Switch/CardCheck",
    "analysisKeys": "DE39=85, STAN, RRN, Switch/CardCheck",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-485",
    "title": "DE39=01 (Refer to Card Issuer) - Canal Switch : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "Switch",
    "component": "CBS/IssuerCall",
    "analysisKeys": "DE39=01, STAN, RRN, CBS/IssuerCall",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-486",
    "title": "DE39=02 (Refer to Card Issuer Special Condition) - Canal Switch : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "Switch",
    "component": "CBS/RiskCondition",
    "analysisKeys": "DE39=02, STAN, RRN, CBS/RiskCondition",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-487",
    "title": "DE39=04 (Pick-up Card Hold-call) - Canal GAB : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "GAB",
    "component": "ATM/Retention",
    "analysisKeys": "DE39=04, STAN, RRN, ATM/Retention",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-488",
    "title": "DE39=05 (Do Not Honor) - Canal Switch : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "Switch",
    "component": "Issuer/Scoring",
    "analysisKeys": "DE39=05, STAN, RRN, Issuer/Scoring",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-489",
    "title": "DE39=12 (Invalid Transaction) - Canal Switch : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "Switch",
    "component": "CBS/ProductRules",
    "analysisKeys": "DE39=12, STAN, RRN, CBS/ProductRules",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-490",
    "title": "DE39=13 (Invalid Amount) - Canal GAB : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "GAB",
    "component": "ATM/BillMix",
    "analysisKeys": "DE39=13, STAN, RRN, ATM/BillMix",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-491",
    "title": "DE39=14 (Invalid Card Number) - Canal Interface : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "Interface",
    "component": "Frontal/LuhnValidator",
    "analysisKeys": "DE39=14, STAN, RRN, Frontal/LuhnValidator",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-492",
    "title": "DE39=15 (No Such Issuer) - Canal Switch : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "Switch",
    "component": "Switch/RoutingTable",
    "analysisKeys": "DE39=15, STAN, RRN, Switch/RoutingTable",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-493",
    "title": "DE39=33 (Expired Card Pick-up) - Canal GAB : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "GAB",
    "component": "ATM/Retention",
    "analysisKeys": "DE39=33, STAN, RRN, ATM/Retention",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-494",
    "title": "DE39=41 (Lost Card Pick-up) - Canal GAB : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "GAB",
    "component": "ATM/OppositionLost",
    "analysisKeys": "DE39=41, STAN, RRN, ATM/OppositionLost",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-495",
    "title": "DE39=43 (Stolen Card Pick-up) - Canal GAB : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "GAB",
    "component": "ATM/OppositionStolen",
    "analysisKeys": "DE39=43, STAN, RRN, ATM/OppositionStolen",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-496",
    "title": "DE39=51 (Insufficient Funds) - Canal Core Banking : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "Core Banking",
    "component": "CBS/Solvabilite",
    "analysisKeys": "DE39=51, STAN, RRN, CBS/Solvabilite",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-497",
    "title": "DE39=54 (Expired Card) - Canal Carte : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "Carte",
    "component": "CMS/CardValidity",
    "analysisKeys": "DE39=54, STAN, RRN, CMS/CardValidity",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-498",
    "title": "DE39=57 (Transaction Not Permitted to Cardholder) - Canal Carte : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "Carte",
    "component": "CMS/ContractProfile",
    "analysisKeys": "DE39=57, STAN, RRN, CMS/ContractProfile",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-499",
    "title": "DE39=61 (Exceeds Withdrawal Amount Limit) - Canal GAB : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "GAB",
    "component": "CMS/VelocityLimits",
    "analysisKeys": "DE39=61, STAN, RRN, CMS/VelocityLimits",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-500",
    "title": "DE39=62 (Restricted Card) - Canal TPE : Basculement secours Haute Disponibilité [Cas #8]",
    "domain": "TPE",
    "component": "CMS/GeoBlocking",
    "analysisKeys": "DE39=62, STAN, RRN, CMS/GeoBlocking",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-501",
    "title": "GAB - Échec chiffrement PIN Pad EPP suite à désynchronisation KSN DUKPT (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-502",
    "title": "GAB - Erreur de parité de clé TMK injectée sur clavier EPP (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-503",
    "title": "GAB - Timeout communication série RS232/USB entre PC GAB et EPP (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-504",
    "title": "GAB - Tentative d écoute ou tamper détecté sur clavier chiffrant EPP (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-505",
    "title": "GAB - Incompatibilité du format de PIN Block configuré sur EPP (Format ISO-1 au lieu de ISO-0) (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-506",
    "title": "GAB - Bourrage billets dans le module de transport vertical CDM (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-507",
    "title": "GAB - Divergence de comptage entre capteur d extraction et capteur de dépose shutter (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-508",
    "title": "GAB - Cassette de rejet pleine provoquant l arrêt du service retrait (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-509",
    "title": "GAB - Défaillance moteur pas-à-pas de l extracteur à friction (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-510",
    "title": "GAB - Dépassement de délai d ouverture du volet de présentation des billets (Shutter Timeout) (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-511",
    "title": "GAB - Rejet systématique des cartes à puce pour lecture contact défaillante (Fallback forcé) (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-512",
    "title": "GAB - Capture intempestive de carte suite à arrêt brutal de l alimentation électrique (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-513",
    "title": "GAB - Détection anormale par le capteur anti-skimming entraînant la mise hors service (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-514",
    "title": "GAB - Non-restitution de carte suite à timeout d oubli porteur non paramétré (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-515",
    "title": "GAB - Erreur de lecture piste magnétique sur carte non hybride (Track 2 error) (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-516",
    "title": "GAB - Déconnexion intempestive de l agent de supervision NDC/DDC (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-517",
    "title": "GAB - Saturation du disque local de l automate par les journaux de trace détaillés (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-518",
    "title": "GAB - Erreur de téléchargement des états d écrans graphiques et bannières publicitaires (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-519",
    "title": "GAB - Blocage de l automate en mode supervision après intervention de maintenance sans clôture (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-520",
    "title": "GAB - Incohérence des compteurs d inventaire d espèces entre le superviseur et le serveur central (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-521",
    "title": "GAB - Blocage de l accepteur de billets en liasses lors d un versement client (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-522",
    "title": "GAB - Faux signal de contrefaçon rejetant des billets conformes neufs (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-523",
    "title": "GAB - Échec d impression du ticket de justificatif de dépôt d espèces (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-524",
    "title": "GAB - Cassette de recyclage de billets saturée bloquant la fonction de restitution (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-525",
    "title": "GAB - Erreur d identification du compte destinataire lors d un versement sans carte (En période de forte affluence)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-526",
    "title": "TPE - Rejet de transaction sans contact par défaillance de validation du Tag 9F26 (ARQC) (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-527",
    "title": "TPE - Incompatibilité AID Visa Electron / CB sur terminal marchand autonome (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-528",
    "title": "TPE - Transaction refusée avec code TVR indiquant une vérification de porteur échouée (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-529",
    "title": "TPE - Blocage de la transaction sans contact au-dessus du plafond sans bascule contact (Force Contact) (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-530",
    "title": "TPE - Erreur de décodage des tags TLV étendus dans la trame 0200 émise par le TPE (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-531",
    "title": "TPE - Échec de télécollecte nocturne automatique des transactions marchandes (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-532",
    "title": "TPE - Doublon de télécollecte entraînant un double crédit sur le compte du commerçant (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-533",
    "title": "TPE - Fichier de télécollecte tronqué suite à coupure réseau en cours d émission (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-534",
    "title": "TPE - Rejet du lot de télécollecte pour incohérence du total de contrôle (Checksum Batch) (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-535",
    "title": "TPE - Délai d expiration du certificat de la passerelle de télécollecte marchand (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-536",
    "title": "TPE - Perte de signal radio GPRS/4G sur un lot de TPE déployés en zone commerciale (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-537",
    "title": "TPE - Refus d enregistrement réseau pour carte SIM monétique expirée ou suspendue (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-538",
    "title": "TPE - Temps de réponse d autorisation supérieur à 45 secondes sur liaison cellulaire (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-539",
    "title": "TPE - Changement d antenne relais provoquant la coupure du tunnel VPN IPSec du TPE (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-540",
    "title": "TPE - Interférence radio empêchant l accroche du réseau 4G forçant une bascule 2G instable (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-541",
    "title": "TPE - Échec de mise à jour des tables de routage BIN via le serveur TMS (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-542",
    "title": "TPE - Corruption de la table des devises après injection d un profil erroné (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-543",
    "title": "TPE - Dépassement de capacité mémoire lors du chargement de la nouvelle liste d opposition (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-544",
    "title": "TPE - Blocage de l application monétique suite à injection d un certificat marchand révoqué (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-545",
    "title": "TPE - Désynchronisation de l horodatage du TPE avec le serveur de temps NTP bancaire (En période de forte affluence)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-546",
    "title": "Carte - Rejets massifs avec DE39=54 consécutifs à une date d expiration mal calculée (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-547",
    "title": "Carte - Carte signalée expirée sur le switch alors qu elle est valide sur le CMS (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-548",
    "title": "Carte - Rejet de cartes nouvellement délivrées non reconnues lors de la première utilisation (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-549",
    "title": "Carte - Opposition préventive automatique déclenchée sur un lot de cartes réémises (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-550",
    "title": "Carte - Défaut de renouvellement des cartes arrivant à échéance en fin de mois (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-551",
    "title": "Carte - Rejet avec DE39=61 pour dépassement de plafond hebdomadaire non remis à zéro (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-552",
    "title": "Carte - Incohérence de plafond entre la devise du compte et la devise de calcul du CMS (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-553",
    "title": "Carte - Blocage pour plafond de retrait atteint alors que le solde disponible est largement suffisant (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-554",
    "title": "Carte - Compteur de retraits hors-réseau bloqué après une seule transaction à l étranger (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-555",
    "title": "Carte - Mise à jour d augmentation de plafond demandée en agence non propagée en temps réel (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-556",
    "title": "Carte - Rejet de transaction légitime avec DE39=62 pour porteur en déplacement international (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-557",
    "title": "Carte - Blocage systématique des transactions e-commerce auprès de sites hébergés en Europe (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-558",
    "title": "Carte - Autorisation acceptée dans un pays soumis à embargo bancaire suite à table de pays obsolète (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-559",
    "title": "Carte - Rejet de transaction en zone frontalière captée par un relais de télécommunication étranger (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-560",
    "title": "Carte - Déblocage géographique temporaire non désactivé automatiquement après la date de fin (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-561",
    "title": "Carte - Blocage carte avec DE39=75 suite à 3 tentatives de PIN infructueuses au GAB (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-562",
    "title": "Carte - Compteur de PIN offline de la puce non réaligné après réinitialisation sur le serveur (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-563",
    "title": "Carte - Faux rejet DE39=75 consécutif à une anomalie de lecture de compteur sur puce dégradée (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-564",
    "title": "Carte - Désynchronisation entre le compteur PIN central et le compteur physique de la carte (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-565",
    "title": "Carte - Tentative de forçage de code PIN par attaque par dictionnaire détectée et neutralisée (En période de forte affluence)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-566",
    "title": "Switch - Rejet massif avec DE39=92 pour nouvelle plage de BIN non référencée dans la table de routage (En période de forte affluence)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-567",
    "title": "Switch - Boucle de routage infinie entre le switch régional et le frontal national (En période de forte affluence)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-568",
    "title": "Switch - Délai excessif de résolution de route sur les transactions internationales Visa (En période de forte affluence)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-569",
    "title": "Switch - Bascule accidentelle du flux GAB sur la route de secours TPE aux capacités limitées (En période de forte affluence)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-570",
    "title": "Switch - Perte des tables de routage dynamiques suite à un redémarrage non planifié du switch (En période de forte affluence)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-571",
    "title": "Switch - Saturation de la file d attente des requêtes d autorisation en période de soldes (En période de forte affluence)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-572",
    "title": "Switch - Blocage de la file d attente provoqué par un message malformé bloquant (Poison Message) (En période de forte affluence)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-573",
    "title": "Switch - Perte de messages en transit suite à un dépassement du temps de rétention en file d attente (En période de forte affluence)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-574",
    "title": "Switch - Désynchronisation entre les files de requêtes 0200 et les files de réponses 0210 (En période de forte affluence)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-575",
    "title": "Switch - Dégradation des performances de la file d attente suite à un manque de threads de consommation (En période de forte affluence)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-576",
    "title": "Switch - Absence d émission du message de contre-passation 0400 après expiration du timer de réponse (En période de forte affluence)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-577",
    "title": "Switch - Rejet du message 0400 par l émetteur pour champ DE90 mal renseigné (En période de forte affluence)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-578",
    "title": "Switch - Contre-passation acceptée par l émetteur mais non prise en compte par le Core Banking (En période de forte affluence)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-579",
    "title": "Switch - Génération en boucle de messages de reversal 0400 pour la même transaction (En période de forte affluence)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-580",
    "title": "Switch - Conflit de séquence entre la réponse tardive 0210 et le message de reversal 0400 (En période de forte affluence)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-581",
    "title": "HSM/Crypto - Perte de liaison socket TCP entre le frontal d acquisition et le boîtier HSM Thales payShield (En période de forte affluence)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-582",
    "title": "HSM/Crypto - Saturation du pool de connexions simultanées sur le boîtier cryptographique HSM (En période de forte affluence)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-583",
    "title": "HSM/Crypto - Temps de réponse de calcul cryptographique supérieur à 800ms sur le HSM (En période de forte affluence)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-584",
    "title": "HSM/Crypto - Bascule automatique en échec vers le HSM de secours suite à une désynchronisation de configuration (En période de forte affluence)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-585",
    "title": "HSM/Crypto - Erreur de protocole de communication avec le HSM consécutive à une mise à jour logicielle (En période de forte affluence)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-586",
    "title": "HSM/Crypto - Rejet systématique de vérification PIN sur les flux interbancaires avec DE39=55 (En période de forte affluence)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-587",
    "title": "HSM/Crypto - Erreur de parité lors de l échange dynamique de clé ZPK avec le réseau Visa (En période de forte affluence)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-588",
    "title": "HSM/Crypto - Corruption de la clé de transport de clé ZMK utilisée pour déchiffrer la nouvelle ZPK (En période de forte affluence)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-589",
    "title": "HSM/Crypto - Échec de translation de PIN Block d un format ISO-0 vers un format ISO-3 (En période de forte affluence)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-590",
    "title": "HSM/Crypto - Expiration de la clé de zone ZPK sans renouvellement automatique préalable (En période de forte affluence)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-591",
    "title": "HSM/Crypto - Rejet systématique de toutes les transactions à puce d une nouvelle série de cartes (DE39=05) (En période de forte affluence)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-592",
    "title": "HSM/Crypto - Erreur de dérivation de clé de session EMV consécutive à un compteur ATC incohérent (En période de forte affluence)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-593",
    "title": "HSM/Crypto - Échec de génération du cryptogramme d autorisation ARPC renvoyé à la carte (En période de forte affluence)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-594",
    "title": "HSM/Crypto - Désaccord sur la méthode de calcul du cryptogramme dynamique entre la puce et l hôte (En période de forte affluence)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-595",
    "title": "HSM/Crypto - Rejet de cryptogramme suite à une corruption du Tag 9F37 (Unpredictable Number) en transmission (En période de forte affluence)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-596",
    "title": "Clearing - Rejet du fichier de compensation Visa Base II pour erreur de format d en-tête de lot (En période de forte affluence)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-597",
    "title": "Clearing - Présence de transactions en double dans le fichier de compensation Mastercard IPM (En période de forte affluence)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-598",
    "title": "Clearing - Échec d intégration du fichier de compensation GIMAC suite à un enregistrement corrompu (En période de forte affluence)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-599",
    "title": "Clearing - Dépassement de la fenêtre horaire limite de transmission du fichier de clearing (En période de forte affluence)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-600",
    "title": "Clearing - Incohérence entre les totaux financiers de contrôle et la somme réelle des enregistrements du fichier (En période de forte affluence)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-601",
    "title": "Clearing - Transactions compensées sans correspondance dans la base des autorisations (Orphelines) (En période de forte affluence)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-602",
    "title": "Clearing - Écart de montant entre l autorisation initiale et le règlement final en devise étrangère (En période de forte affluence)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-603",
    "title": "Clearing - Double imputation comptable consécutive à une contestation traitée manuellement et automatiquement (En période de forte affluence)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-604",
    "title": "Clearing - Suspense comptable persistant sur les transactions de pré-autorisation hôtelière non clôturées (En période de forte affluence)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-605",
    "title": "Clearing - Incohérence de devise de règlement entre le compte de compensation Nostro et le compte marchand (En période de forte affluence)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-606",
    "title": "Clearing - Rejet de dossier de contestation pour dépassement du délai réglementaire scheme (120 jours) (En période de forte affluence)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-607",
    "title": "Clearing - Forclusion d un recours en deuxième présentation (Representment) non notifié au commerçant (En période de forte affluence)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-608",
    "title": "Clearing - Débit indu du compte commerçant suite à un chargeback frauduleux non vérifié (En période de forte affluence)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-609",
    "title": "Clearing - Rejet du dossier de litige par la plateforme Visa Resolve Online (VROL) pour pièce jointe non lisible (En période de forte affluence)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-610",
    "title": "Clearing - Contestation client acceptée par la banque mais non transmise sur le réseau interbancaire (En période de forte affluence)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-611",
    "title": "E-Commerce - Échec d authentification 3D-Secure 2.2 sur les paiements e-commerce par carte internationale (En période de forte affluence)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-612",
    "title": "E-Commerce - Rejet de transaction en authentification sans friction (Frictionless) forçant un challenge systématique (En période de forte affluence)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-613",
    "title": "E-Commerce - Non-réception du code OTP par SMS lors de l étape de challenge 3D-Secure (En période de forte affluence)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-614",
    "title": "E-Commerce - Incompatibilité de version de protocole 3D-Secure entre le marchand et l émetteur de la carte (En période de forte affluence)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-615",
    "title": "E-Commerce - Échec d affichage de la page de challenge 3D-Secure dans l iframe du site marchand (En période de forte affluence)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-616",
    "title": "E-Commerce - Erreur HTTP 500 sur l API de paiement e-commerce lors de la validation du panier (En période de forte affluence)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-617",
    "title": "E-Commerce - Non-réception des webhooks de confirmation de paiement par le site e-commerce du commerçant (En période de forte affluence)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-618",
    "title": "E-Commerce - Double débit client consécutif à des clics répétitifs sur le bouton de paiement en ligne (En période de forte affluence)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-619",
    "title": "E-Commerce - Rejet de transaction en ligne pour montant non conforme aux limites du contrat marchand VAD (En période de forte affluence)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-620",
    "title": "E-Commerce - Attaque par force brute sur l API de vérification de validité de carte (Card Testing Attack) (En période de forte affluence)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-621",
    "title": "Mobile/API - Échec d alimentation de portefeuille électronique mobile depuis une carte bancaire (En période de forte affluence)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-622",
    "title": "Mobile/API - Désynchronisation de solde entre le portefeuille mobile et le compte bancaire support (En période de forte affluence)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-623",
    "title": "Mobile/API - Rejet de transaction de virement instantané de compte à wallet pour plafond journalier atteint (En période de forte affluence)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-624",
    "title": "Mobile/API - Échec d enrôlement de la carte bancaire dans le service de paiement sans contact sur smartphone (En période de forte affluence)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-625",
    "title": "Mobile/API - Rejet de paiement par QR Code marchand EMVCo suite à un QR Code altéré ou expiré (En période de forte affluence)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-626",
    "title": "GAB - Échec chiffrement PIN Pad EPP suite à désynchronisation KSN DUKPT (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-627",
    "title": "GAB - Erreur de parité de clé TMK injectée sur clavier EPP (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-628",
    "title": "GAB - Timeout communication série RS232/USB entre PC GAB et EPP (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-629",
    "title": "GAB - Tentative d écoute ou tamper détecté sur clavier chiffrant EPP (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-630",
    "title": "GAB - Incompatibilité du format de PIN Block configuré sur EPP (Format ISO-1 au lieu de ISO-0) (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-631",
    "title": "GAB - Bourrage billets dans le module de transport vertical CDM (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-632",
    "title": "GAB - Divergence de comptage entre capteur d extraction et capteur de dépose shutter (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-633",
    "title": "GAB - Cassette de rejet pleine provoquant l arrêt du service retrait (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-634",
    "title": "GAB - Défaillance moteur pas-à-pas de l extracteur à friction (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-635",
    "title": "GAB - Dépassement de délai d ouverture du volet de présentation des billets (Shutter Timeout) (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-636",
    "title": "GAB - Rejet systématique des cartes à puce pour lecture contact défaillante (Fallback forcé) (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-637",
    "title": "GAB - Capture intempestive de carte suite à arrêt brutal de l alimentation électrique (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-638",
    "title": "GAB - Détection anormale par le capteur anti-skimming entraînant la mise hors service (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-639",
    "title": "GAB - Non-restitution de carte suite à timeout d oubli porteur non paramétré (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-640",
    "title": "GAB - Erreur de lecture piste magnétique sur carte non hybride (Track 2 error) (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-641",
    "title": "GAB - Déconnexion intempestive de l agent de supervision NDC/DDC (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-642",
    "title": "GAB - Saturation du disque local de l automate par les journaux de trace détaillés (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-643",
    "title": "GAB - Erreur de téléchargement des états d écrans graphiques et bannières publicitaires (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-644",
    "title": "GAB - Blocage de l automate en mode supervision après intervention de maintenance sans clôture (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-645",
    "title": "GAB - Incohérence des compteurs d inventaire d espèces entre le superviseur et le serveur central (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-646",
    "title": "GAB - Blocage de l accepteur de billets en liasses lors d un versement client (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-647",
    "title": "GAB - Faux signal de contrefaçon rejetant des billets conformes neufs (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-648",
    "title": "GAB - Échec d impression du ticket de justificatif de dépôt d espèces (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-649",
    "title": "GAB - Cassette de recyclage de billets saturée bloquant la fonction de restitution (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-650",
    "title": "GAB - Erreur d identification du compte destinataire lors d un versement sans carte (Lors d un basculement de secours PRA)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-651",
    "title": "TPE - Rejet de transaction sans contact par défaillance de validation du Tag 9F26 (ARQC) (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-652",
    "title": "TPE - Incompatibilité AID Visa Electron / CB sur terminal marchand autonome (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-653",
    "title": "TPE - Transaction refusée avec code TVR indiquant une vérification de porteur échouée (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-654",
    "title": "TPE - Blocage de la transaction sans contact au-dessus du plafond sans bascule contact (Force Contact) (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-655",
    "title": "TPE - Erreur de décodage des tags TLV étendus dans la trame 0200 émise par le TPE (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-656",
    "title": "TPE - Échec de télécollecte nocturne automatique des transactions marchandes (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-657",
    "title": "TPE - Doublon de télécollecte entraînant un double crédit sur le compte du commerçant (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-658",
    "title": "TPE - Fichier de télécollecte tronqué suite à coupure réseau en cours d émission (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-659",
    "title": "TPE - Rejet du lot de télécollecte pour incohérence du total de contrôle (Checksum Batch) (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-660",
    "title": "TPE - Délai d expiration du certificat de la passerelle de télécollecte marchand (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-661",
    "title": "TPE - Perte de signal radio GPRS/4G sur un lot de TPE déployés en zone commerciale (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-662",
    "title": "TPE - Refus d enregistrement réseau pour carte SIM monétique expirée ou suspendue (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-663",
    "title": "TPE - Temps de réponse d autorisation supérieur à 45 secondes sur liaison cellulaire (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-664",
    "title": "TPE - Changement d antenne relais provoquant la coupure du tunnel VPN IPSec du TPE (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-665",
    "title": "TPE - Interférence radio empêchant l accroche du réseau 4G forçant une bascule 2G instable (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-666",
    "title": "TPE - Échec de mise à jour des tables de routage BIN via le serveur TMS (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-667",
    "title": "TPE - Corruption de la table des devises après injection d un profil erroné (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-668",
    "title": "TPE - Dépassement de capacité mémoire lors du chargement de la nouvelle liste d opposition (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-669",
    "title": "TPE - Blocage de l application monétique suite à injection d un certificat marchand révoqué (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-670",
    "title": "TPE - Désynchronisation de l horodatage du TPE avec le serveur de temps NTP bancaire (Lors d un basculement de secours PRA)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-671",
    "title": "Carte - Rejets massifs avec DE39=54 consécutifs à une date d expiration mal calculée (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-672",
    "title": "Carte - Carte signalée expirée sur le switch alors qu elle est valide sur le CMS (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-673",
    "title": "Carte - Rejet de cartes nouvellement délivrées non reconnues lors de la première utilisation (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-674",
    "title": "Carte - Opposition préventive automatique déclenchée sur un lot de cartes réémises (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-675",
    "title": "Carte - Défaut de renouvellement des cartes arrivant à échéance en fin de mois (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-676",
    "title": "Carte - Rejet avec DE39=61 pour dépassement de plafond hebdomadaire non remis à zéro (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-677",
    "title": "Carte - Incohérence de plafond entre la devise du compte et la devise de calcul du CMS (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-678",
    "title": "Carte - Blocage pour plafond de retrait atteint alors que le solde disponible est largement suffisant (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-679",
    "title": "Carte - Compteur de retraits hors-réseau bloqué après une seule transaction à l étranger (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-680",
    "title": "Carte - Mise à jour d augmentation de plafond demandée en agence non propagée en temps réel (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-681",
    "title": "Carte - Rejet de transaction légitime avec DE39=62 pour porteur en déplacement international (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-682",
    "title": "Carte - Blocage systématique des transactions e-commerce auprès de sites hébergés en Europe (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-683",
    "title": "Carte - Autorisation acceptée dans un pays soumis à embargo bancaire suite à table de pays obsolète (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-684",
    "title": "Carte - Rejet de transaction en zone frontalière captée par un relais de télécommunication étranger (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-685",
    "title": "Carte - Déblocage géographique temporaire non désactivé automatiquement après la date de fin (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-686",
    "title": "Carte - Blocage carte avec DE39=75 suite à 3 tentatives de PIN infructueuses au GAB (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-687",
    "title": "Carte - Compteur de PIN offline de la puce non réaligné après réinitialisation sur le serveur (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-688",
    "title": "Carte - Faux rejet DE39=75 consécutif à une anomalie de lecture de compteur sur puce dégradée (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-689",
    "title": "Carte - Désynchronisation entre le compteur PIN central et le compteur physique de la carte (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-690",
    "title": "Carte - Tentative de forçage de code PIN par attaque par dictionnaire détectée et neutralisée (Lors d un basculement de secours PRA)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-691",
    "title": "Switch - Rejet massif avec DE39=92 pour nouvelle plage de BIN non référencée dans la table de routage (Lors d un basculement de secours PRA)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-692",
    "title": "Switch - Boucle de routage infinie entre le switch régional et le frontal national (Lors d un basculement de secours PRA)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-693",
    "title": "Switch - Délai excessif de résolution de route sur les transactions internationales Visa (Lors d un basculement de secours PRA)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-694",
    "title": "Switch - Bascule accidentelle du flux GAB sur la route de secours TPE aux capacités limitées (Lors d un basculement de secours PRA)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-695",
    "title": "Switch - Perte des tables de routage dynamiques suite à un redémarrage non planifié du switch (Lors d un basculement de secours PRA)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-696",
    "title": "Switch - Saturation de la file d attente des requêtes d autorisation en période de soldes (Lors d un basculement de secours PRA)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-697",
    "title": "Switch - Blocage de la file d attente provoqué par un message malformé bloquant (Poison Message) (Lors d un basculement de secours PRA)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-698",
    "title": "Switch - Perte de messages en transit suite à un dépassement du temps de rétention en file d attente (Lors d un basculement de secours PRA)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-699",
    "title": "Switch - Désynchronisation entre les files de requêtes 0200 et les files de réponses 0210 (Lors d un basculement de secours PRA)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-700",
    "title": "Switch - Dégradation des performances de la file d attente suite à un manque de threads de consommation (Lors d un basculement de secours PRA)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-701",
    "title": "Switch - Absence d émission du message de contre-passation 0400 après expiration du timer de réponse (Lors d un basculement de secours PRA)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-702",
    "title": "Switch - Rejet du message 0400 par l émetteur pour champ DE90 mal renseigné (Lors d un basculement de secours PRA)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-703",
    "title": "Switch - Contre-passation acceptée par l émetteur mais non prise en compte par le Core Banking (Lors d un basculement de secours PRA)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-704",
    "title": "Switch - Génération en boucle de messages de reversal 0400 pour la même transaction (Lors d un basculement de secours PRA)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-705",
    "title": "Switch - Conflit de séquence entre la réponse tardive 0210 et le message de reversal 0400 (Lors d un basculement de secours PRA)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-706",
    "title": "HSM/Crypto - Perte de liaison socket TCP entre le frontal d acquisition et le boîtier HSM Thales payShield (Lors d un basculement de secours PRA)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-707",
    "title": "HSM/Crypto - Saturation du pool de connexions simultanées sur le boîtier cryptographique HSM (Lors d un basculement de secours PRA)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-708",
    "title": "HSM/Crypto - Temps de réponse de calcul cryptographique supérieur à 800ms sur le HSM (Lors d un basculement de secours PRA)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-709",
    "title": "HSM/Crypto - Bascule automatique en échec vers le HSM de secours suite à une désynchronisation de configuration (Lors d un basculement de secours PRA)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-710",
    "title": "HSM/Crypto - Erreur de protocole de communication avec le HSM consécutive à une mise à jour logicielle (Lors d un basculement de secours PRA)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-711",
    "title": "HSM/Crypto - Rejet systématique de vérification PIN sur les flux interbancaires avec DE39=55 (Lors d un basculement de secours PRA)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-712",
    "title": "HSM/Crypto - Erreur de parité lors de l échange dynamique de clé ZPK avec le réseau Visa (Lors d un basculement de secours PRA)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-713",
    "title": "HSM/Crypto - Corruption de la clé de transport de clé ZMK utilisée pour déchiffrer la nouvelle ZPK (Lors d un basculement de secours PRA)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-714",
    "title": "HSM/Crypto - Échec de translation de PIN Block d un format ISO-0 vers un format ISO-3 (Lors d un basculement de secours PRA)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-715",
    "title": "HSM/Crypto - Expiration de la clé de zone ZPK sans renouvellement automatique préalable (Lors d un basculement de secours PRA)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-716",
    "title": "HSM/Crypto - Rejet systématique de toutes les transactions à puce d une nouvelle série de cartes (DE39=05) (Lors d un basculement de secours PRA)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-717",
    "title": "HSM/Crypto - Erreur de dérivation de clé de session EMV consécutive à un compteur ATC incohérent (Lors d un basculement de secours PRA)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-718",
    "title": "HSM/Crypto - Échec de génération du cryptogramme d autorisation ARPC renvoyé à la carte (Lors d un basculement de secours PRA)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-719",
    "title": "HSM/Crypto - Désaccord sur la méthode de calcul du cryptogramme dynamique entre la puce et l hôte (Lors d un basculement de secours PRA)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-720",
    "title": "HSM/Crypto - Rejet de cryptogramme suite à une corruption du Tag 9F37 (Unpredictable Number) en transmission (Lors d un basculement de secours PRA)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-721",
    "title": "Clearing - Rejet du fichier de compensation Visa Base II pour erreur de format d en-tête de lot (Lors d un basculement de secours PRA)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-722",
    "title": "Clearing - Présence de transactions en double dans le fichier de compensation Mastercard IPM (Lors d un basculement de secours PRA)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-723",
    "title": "Clearing - Échec d intégration du fichier de compensation GIMAC suite à un enregistrement corrompu (Lors d un basculement de secours PRA)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-724",
    "title": "Clearing - Dépassement de la fenêtre horaire limite de transmission du fichier de clearing (Lors d un basculement de secours PRA)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-725",
    "title": "Clearing - Incohérence entre les totaux financiers de contrôle et la somme réelle des enregistrements du fichier (Lors d un basculement de secours PRA)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-726",
    "title": "Clearing - Transactions compensées sans correspondance dans la base des autorisations (Orphelines) (Lors d un basculement de secours PRA)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-727",
    "title": "Clearing - Écart de montant entre l autorisation initiale et le règlement final en devise étrangère (Lors d un basculement de secours PRA)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-728",
    "title": "Clearing - Double imputation comptable consécutive à une contestation traitée manuellement et automatiquement (Lors d un basculement de secours PRA)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-729",
    "title": "Clearing - Suspense comptable persistant sur les transactions de pré-autorisation hôtelière non clôturées (Lors d un basculement de secours PRA)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-730",
    "title": "Clearing - Incohérence de devise de règlement entre le compte de compensation Nostro et le compte marchand (Lors d un basculement de secours PRA)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-731",
    "title": "Clearing - Rejet de dossier de contestation pour dépassement du délai réglementaire scheme (120 jours) (Lors d un basculement de secours PRA)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-732",
    "title": "Clearing - Forclusion d un recours en deuxième présentation (Representment) non notifié au commerçant (Lors d un basculement de secours PRA)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-733",
    "title": "Clearing - Débit indu du compte commerçant suite à un chargeback frauduleux non vérifié (Lors d un basculement de secours PRA)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-734",
    "title": "Clearing - Rejet du dossier de litige par la plateforme Visa Resolve Online (VROL) pour pièce jointe non lisible (Lors d un basculement de secours PRA)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-735",
    "title": "Clearing - Contestation client acceptée par la banque mais non transmise sur le réseau interbancaire (Lors d un basculement de secours PRA)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-736",
    "title": "E-Commerce - Échec d authentification 3D-Secure 2.2 sur les paiements e-commerce par carte internationale (Lors d un basculement de secours PRA)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-737",
    "title": "E-Commerce - Rejet de transaction en authentification sans friction (Frictionless) forçant un challenge systématique (Lors d un basculement de secours PRA)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-738",
    "title": "E-Commerce - Non-réception du code OTP par SMS lors de l étape de challenge 3D-Secure (Lors d un basculement de secours PRA)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-739",
    "title": "E-Commerce - Incompatibilité de version de protocole 3D-Secure entre le marchand et l émetteur de la carte (Lors d un basculement de secours PRA)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-740",
    "title": "E-Commerce - Échec d affichage de la page de challenge 3D-Secure dans l iframe du site marchand (Lors d un basculement de secours PRA)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-741",
    "title": "E-Commerce - Erreur HTTP 500 sur l API de paiement e-commerce lors de la validation du panier (Lors d un basculement de secours PRA)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-742",
    "title": "E-Commerce - Non-réception des webhooks de confirmation de paiement par le site e-commerce du commerçant (Lors d un basculement de secours PRA)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-743",
    "title": "E-Commerce - Double débit client consécutif à des clics répétitifs sur le bouton de paiement en ligne (Lors d un basculement de secours PRA)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-744",
    "title": "E-Commerce - Rejet de transaction en ligne pour montant non conforme aux limites du contrat marchand VAD (Lors d un basculement de secours PRA)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-745",
    "title": "E-Commerce - Attaque par force brute sur l API de vérification de validité de carte (Card Testing Attack) (Lors d un basculement de secours PRA)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-746",
    "title": "Mobile/API - Échec d alimentation de portefeuille électronique mobile depuis une carte bancaire (Lors d un basculement de secours PRA)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-747",
    "title": "Mobile/API - Désynchronisation de solde entre le portefeuille mobile et le compte bancaire support (Lors d un basculement de secours PRA)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-748",
    "title": "Mobile/API - Rejet de transaction de virement instantané de compte à wallet pour plafond journalier atteint (Lors d un basculement de secours PRA)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-749",
    "title": "Mobile/API - Échec d enrôlement de la carte bancaire dans le service de paiement sans contact sur smartphone (Lors d un basculement de secours PRA)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-750",
    "title": "Mobile/API - Rejet de paiement par QR Code marchand EMVCo suite à un QR Code altéré ou expiré (Lors d un basculement de secours PRA)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-751",
    "title": "GAB - Échec chiffrement PIN Pad EPP suite à désynchronisation KSN DUKPT (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-752",
    "title": "GAB - Erreur de parité de clé TMK injectée sur clavier EPP (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-753",
    "title": "GAB - Timeout communication série RS232/USB entre PC GAB et EPP (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-754",
    "title": "GAB - Tentative d écoute ou tamper détecté sur clavier chiffrant EPP (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-755",
    "title": "GAB - Incompatibilité du format de PIN Block configuré sur EPP (Format ISO-1 au lieu de ISO-0) (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-756",
    "title": "GAB - Bourrage billets dans le module de transport vertical CDM (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-757",
    "title": "GAB - Divergence de comptage entre capteur d extraction et capteur de dépose shutter (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-758",
    "title": "GAB - Cassette de rejet pleine provoquant l arrêt du service retrait (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-759",
    "title": "GAB - Défaillance moteur pas-à-pas de l extracteur à friction (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-760",
    "title": "GAB - Dépassement de délai d ouverture du volet de présentation des billets (Shutter Timeout) (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-761",
    "title": "GAB - Rejet systématique des cartes à puce pour lecture contact défaillante (Fallback forcé) (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-762",
    "title": "GAB - Capture intempestive de carte suite à arrêt brutal de l alimentation électrique (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-763",
    "title": "GAB - Détection anormale par le capteur anti-skimming entraînant la mise hors service (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-764",
    "title": "GAB - Non-restitution de carte suite à timeout d oubli porteur non paramétré (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-765",
    "title": "GAB - Erreur de lecture piste magnétique sur carte non hybride (Track 2 error) (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-766",
    "title": "GAB - Déconnexion intempestive de l agent de supervision NDC/DDC (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-767",
    "title": "GAB - Saturation du disque local de l automate par les journaux de trace détaillés (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-768",
    "title": "GAB - Erreur de téléchargement des états d écrans graphiques et bannières publicitaires (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-769",
    "title": "GAB - Blocage de l automate en mode supervision après intervention de maintenance sans clôture (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-770",
    "title": "GAB - Incohérence des compteurs d inventaire d espèces entre le superviseur et le serveur central (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-771",
    "title": "GAB - Blocage de l accepteur de billets en liasses lors d un versement client (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-772",
    "title": "GAB - Faux signal de contrefaçon rejetant des billets conformes neufs (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-773",
    "title": "GAB - Échec d impression du ticket de justificatif de dépôt d espèces (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-774",
    "title": "GAB - Cassette de recyclage de billets saturée bloquant la fonction de restitution (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-775",
    "title": "GAB - Erreur d identification du compte destinataire lors d un versement sans carte (Sur périmètre régional Agences)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-776",
    "title": "TPE - Rejet de transaction sans contact par défaillance de validation du Tag 9F26 (ARQC) (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-777",
    "title": "TPE - Incompatibilité AID Visa Electron / CB sur terminal marchand autonome (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-778",
    "title": "TPE - Transaction refusée avec code TVR indiquant une vérification de porteur échouée (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-779",
    "title": "TPE - Blocage de la transaction sans contact au-dessus du plafond sans bascule contact (Force Contact) (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-780",
    "title": "TPE - Erreur de décodage des tags TLV étendus dans la trame 0200 émise par le TPE (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-781",
    "title": "TPE - Échec de télécollecte nocturne automatique des transactions marchandes (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-782",
    "title": "TPE - Doublon de télécollecte entraînant un double crédit sur le compte du commerçant (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-783",
    "title": "TPE - Fichier de télécollecte tronqué suite à coupure réseau en cours d émission (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-784",
    "title": "TPE - Rejet du lot de télécollecte pour incohérence du total de contrôle (Checksum Batch) (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-785",
    "title": "TPE - Délai d expiration du certificat de la passerelle de télécollecte marchand (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-786",
    "title": "TPE - Perte de signal radio GPRS/4G sur un lot de TPE déployés en zone commerciale (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-787",
    "title": "TPE - Refus d enregistrement réseau pour carte SIM monétique expirée ou suspendue (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-788",
    "title": "TPE - Temps de réponse d autorisation supérieur à 45 secondes sur liaison cellulaire (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-789",
    "title": "TPE - Changement d antenne relais provoquant la coupure du tunnel VPN IPSec du TPE (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-790",
    "title": "TPE - Interférence radio empêchant l accroche du réseau 4G forçant une bascule 2G instable (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-791",
    "title": "TPE - Échec de mise à jour des tables de routage BIN via le serveur TMS (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-792",
    "title": "TPE - Corruption de la table des devises après injection d un profil erroné (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-793",
    "title": "TPE - Dépassement de capacité mémoire lors du chargement de la nouvelle liste d opposition (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-794",
    "title": "TPE - Blocage de l application monétique suite à injection d un certificat marchand révoqué (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-795",
    "title": "TPE - Désynchronisation de l horodatage du TPE avec le serveur de temps NTP bancaire (Sur périmètre régional Agences)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-796",
    "title": "Carte - Rejets massifs avec DE39=54 consécutifs à une date d expiration mal calculée (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-797",
    "title": "Carte - Carte signalée expirée sur le switch alors qu elle est valide sur le CMS (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-798",
    "title": "Carte - Rejet de cartes nouvellement délivrées non reconnues lors de la première utilisation (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-799",
    "title": "Carte - Opposition préventive automatique déclenchée sur un lot de cartes réémises (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-800",
    "title": "Carte - Défaut de renouvellement des cartes arrivant à échéance en fin de mois (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-801",
    "title": "Carte - Rejet avec DE39=61 pour dépassement de plafond hebdomadaire non remis à zéro (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-802",
    "title": "Carte - Incohérence de plafond entre la devise du compte et la devise de calcul du CMS (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-803",
    "title": "Carte - Blocage pour plafond de retrait atteint alors que le solde disponible est largement suffisant (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-804",
    "title": "Carte - Compteur de retraits hors-réseau bloqué après une seule transaction à l étranger (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-805",
    "title": "Carte - Mise à jour d augmentation de plafond demandée en agence non propagée en temps réel (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-806",
    "title": "Carte - Rejet de transaction légitime avec DE39=62 pour porteur en déplacement international (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-807",
    "title": "Carte - Blocage systématique des transactions e-commerce auprès de sites hébergés en Europe (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-808",
    "title": "Carte - Autorisation acceptée dans un pays soumis à embargo bancaire suite à table de pays obsolète (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-809",
    "title": "Carte - Rejet de transaction en zone frontalière captée par un relais de télécommunication étranger (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-810",
    "title": "Carte - Déblocage géographique temporaire non désactivé automatiquement après la date de fin (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-811",
    "title": "Carte - Blocage carte avec DE39=75 suite à 3 tentatives de PIN infructueuses au GAB (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-812",
    "title": "Carte - Compteur de PIN offline de la puce non réaligné après réinitialisation sur le serveur (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-813",
    "title": "Carte - Faux rejet DE39=75 consécutif à une anomalie de lecture de compteur sur puce dégradée (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-814",
    "title": "Carte - Désynchronisation entre le compteur PIN central et le compteur physique de la carte (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-815",
    "title": "Carte - Tentative de forçage de code PIN par attaque par dictionnaire détectée et neutralisée (Sur périmètre régional Agences)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-816",
    "title": "Switch - Rejet massif avec DE39=92 pour nouvelle plage de BIN non référencée dans la table de routage (Sur périmètre régional Agences)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-817",
    "title": "Switch - Boucle de routage infinie entre le switch régional et le frontal national (Sur périmètre régional Agences)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-818",
    "title": "Switch - Délai excessif de résolution de route sur les transactions internationales Visa (Sur périmètre régional Agences)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-819",
    "title": "Switch - Bascule accidentelle du flux GAB sur la route de secours TPE aux capacités limitées (Sur périmètre régional Agences)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-820",
    "title": "Switch - Perte des tables de routage dynamiques suite à un redémarrage non planifié du switch (Sur périmètre régional Agences)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-821",
    "title": "Switch - Saturation de la file d attente des requêtes d autorisation en période de soldes (Sur périmètre régional Agences)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-822",
    "title": "Switch - Blocage de la file d attente provoqué par un message malformé bloquant (Poison Message) (Sur périmètre régional Agences)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-823",
    "title": "Switch - Perte de messages en transit suite à un dépassement du temps de rétention en file d attente (Sur périmètre régional Agences)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-824",
    "title": "Switch - Désynchronisation entre les files de requêtes 0200 et les files de réponses 0210 (Sur périmètre régional Agences)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-825",
    "title": "Switch - Dégradation des performances de la file d attente suite à un manque de threads de consommation (Sur périmètre régional Agences)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-826",
    "title": "Switch - Absence d émission du message de contre-passation 0400 après expiration du timer de réponse (Sur périmètre régional Agences)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-827",
    "title": "Switch - Rejet du message 0400 par l émetteur pour champ DE90 mal renseigné (Sur périmètre régional Agences)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-828",
    "title": "Switch - Contre-passation acceptée par l émetteur mais non prise en compte par le Core Banking (Sur périmètre régional Agences)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-829",
    "title": "Switch - Génération en boucle de messages de reversal 0400 pour la même transaction (Sur périmètre régional Agences)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-830",
    "title": "Switch - Conflit de séquence entre la réponse tardive 0210 et le message de reversal 0400 (Sur périmètre régional Agences)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-831",
    "title": "HSM/Crypto - Perte de liaison socket TCP entre le frontal d acquisition et le boîtier HSM Thales payShield (Sur périmètre régional Agences)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-832",
    "title": "HSM/Crypto - Saturation du pool de connexions simultanées sur le boîtier cryptographique HSM (Sur périmètre régional Agences)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-833",
    "title": "HSM/Crypto - Temps de réponse de calcul cryptographique supérieur à 800ms sur le HSM (Sur périmètre régional Agences)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-834",
    "title": "HSM/Crypto - Bascule automatique en échec vers le HSM de secours suite à une désynchronisation de configuration (Sur périmètre régional Agences)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-835",
    "title": "HSM/Crypto - Erreur de protocole de communication avec le HSM consécutive à une mise à jour logicielle (Sur périmètre régional Agences)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-836",
    "title": "HSM/Crypto - Rejet systématique de vérification PIN sur les flux interbancaires avec DE39=55 (Sur périmètre régional Agences)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-837",
    "title": "HSM/Crypto - Erreur de parité lors de l échange dynamique de clé ZPK avec le réseau Visa (Sur périmètre régional Agences)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-838",
    "title": "HSM/Crypto - Corruption de la clé de transport de clé ZMK utilisée pour déchiffrer la nouvelle ZPK (Sur périmètre régional Agences)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-839",
    "title": "HSM/Crypto - Échec de translation de PIN Block d un format ISO-0 vers un format ISO-3 (Sur périmètre régional Agences)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-840",
    "title": "HSM/Crypto - Expiration de la clé de zone ZPK sans renouvellement automatique préalable (Sur périmètre régional Agences)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-841",
    "title": "HSM/Crypto - Rejet systématique de toutes les transactions à puce d une nouvelle série de cartes (DE39=05) (Sur périmètre régional Agences)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-842",
    "title": "HSM/Crypto - Erreur de dérivation de clé de session EMV consécutive à un compteur ATC incohérent (Sur périmètre régional Agences)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-843",
    "title": "HSM/Crypto - Échec de génération du cryptogramme d autorisation ARPC renvoyé à la carte (Sur périmètre régional Agences)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-844",
    "title": "HSM/Crypto - Désaccord sur la méthode de calcul du cryptogramme dynamique entre la puce et l hôte (Sur périmètre régional Agences)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-845",
    "title": "HSM/Crypto - Rejet de cryptogramme suite à une corruption du Tag 9F37 (Unpredictable Number) en transmission (Sur périmètre régional Agences)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-846",
    "title": "Clearing - Rejet du fichier de compensation Visa Base II pour erreur de format d en-tête de lot (Sur périmètre régional Agences)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-847",
    "title": "Clearing - Présence de transactions en double dans le fichier de compensation Mastercard IPM (Sur périmètre régional Agences)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-848",
    "title": "Clearing - Échec d intégration du fichier de compensation GIMAC suite à un enregistrement corrompu (Sur périmètre régional Agences)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-849",
    "title": "Clearing - Dépassement de la fenêtre horaire limite de transmission du fichier de clearing (Sur périmètre régional Agences)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-850",
    "title": "Clearing - Incohérence entre les totaux financiers de contrôle et la somme réelle des enregistrements du fichier (Sur périmètre régional Agences)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-851",
    "title": "Clearing - Transactions compensées sans correspondance dans la base des autorisations (Orphelines) (Sur périmètre régional Agences)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-852",
    "title": "Clearing - Écart de montant entre l autorisation initiale et le règlement final en devise étrangère (Sur périmètre régional Agences)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-853",
    "title": "Clearing - Double imputation comptable consécutive à une contestation traitée manuellement et automatiquement (Sur périmètre régional Agences)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-854",
    "title": "Clearing - Suspense comptable persistant sur les transactions de pré-autorisation hôtelière non clôturées (Sur périmètre régional Agences)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-855",
    "title": "Clearing - Incohérence de devise de règlement entre le compte de compensation Nostro et le compte marchand (Sur périmètre régional Agences)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-856",
    "title": "Clearing - Rejet de dossier de contestation pour dépassement du délai réglementaire scheme (120 jours) (Sur périmètre régional Agences)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-857",
    "title": "Clearing - Forclusion d un recours en deuxième présentation (Representment) non notifié au commerçant (Sur périmètre régional Agences)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-858",
    "title": "Clearing - Débit indu du compte commerçant suite à un chargeback frauduleux non vérifié (Sur périmètre régional Agences)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-859",
    "title": "Clearing - Rejet du dossier de litige par la plateforme Visa Resolve Online (VROL) pour pièce jointe non lisible (Sur périmètre régional Agences)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-860",
    "title": "Clearing - Contestation client acceptée par la banque mais non transmise sur le réseau interbancaire (Sur périmètre régional Agences)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-861",
    "title": "E-Commerce - Échec d authentification 3D-Secure 2.2 sur les paiements e-commerce par carte internationale (Sur périmètre régional Agences)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-862",
    "title": "E-Commerce - Rejet de transaction en authentification sans friction (Frictionless) forçant un challenge systématique (Sur périmètre régional Agences)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-863",
    "title": "E-Commerce - Non-réception du code OTP par SMS lors de l étape de challenge 3D-Secure (Sur périmètre régional Agences)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-864",
    "title": "E-Commerce - Incompatibilité de version de protocole 3D-Secure entre le marchand et l émetteur de la carte (Sur périmètre régional Agences)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-865",
    "title": "E-Commerce - Échec d affichage de la page de challenge 3D-Secure dans l iframe du site marchand (Sur périmètre régional Agences)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-866",
    "title": "E-Commerce - Erreur HTTP 500 sur l API de paiement e-commerce lors de la validation du panier (Sur périmètre régional Agences)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-867",
    "title": "E-Commerce - Non-réception des webhooks de confirmation de paiement par le site e-commerce du commerçant (Sur périmètre régional Agences)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-868",
    "title": "E-Commerce - Double débit client consécutif à des clics répétitifs sur le bouton de paiement en ligne (Sur périmètre régional Agences)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-869",
    "title": "E-Commerce - Rejet de transaction en ligne pour montant non conforme aux limites du contrat marchand VAD (Sur périmètre régional Agences)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-870",
    "title": "E-Commerce - Attaque par force brute sur l API de vérification de validité de carte (Card Testing Attack) (Sur périmètre régional Agences)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-871",
    "title": "Mobile/API - Échec d alimentation de portefeuille électronique mobile depuis une carte bancaire (Sur périmètre régional Agences)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-872",
    "title": "Mobile/API - Désynchronisation de solde entre le portefeuille mobile et le compte bancaire support (Sur périmètre régional Agences)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-873",
    "title": "Mobile/API - Rejet de transaction de virement instantané de compte à wallet pour plafond journalier atteint (Sur périmètre régional Agences)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-874",
    "title": "Mobile/API - Échec d enrôlement de la carte bancaire dans le service de paiement sans contact sur smartphone (Sur périmètre régional Agences)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-875",
    "title": "Mobile/API - Rejet de paiement par QR Code marchand EMVCo suite à un QR Code altéré ou expiré (Sur périmètre régional Agences)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-876",
    "title": "GAB - Échec chiffrement PIN Pad EPP suite à désynchronisation KSN DUKPT (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-877",
    "title": "GAB - Erreur de parité de clé TMK injectée sur clavier EPP (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-878",
    "title": "GAB - Timeout communication série RS232/USB entre PC GAB et EPP (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-879",
    "title": "GAB - Tentative d écoute ou tamper détecté sur clavier chiffrant EPP (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-880",
    "title": "GAB - Incompatibilité du format de PIN Block configuré sur EPP (Format ISO-1 au lieu de ISO-0) (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/EPP",
    "analysisKeys": "DE52/KSN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-881",
    "title": "GAB - Bourrage billets dans le module de transport vertical CDM (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-882",
    "title": "GAB - Divergence de comptage entre capteur d extraction et capteur de dépose shutter (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-883",
    "title": "GAB - Cassette de rejet pleine provoquant l arrêt du service retrait (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-884",
    "title": "GAB - Défaillance moteur pas-à-pas de l extracteur à friction (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-885",
    "title": "GAB - Dépassement de délai d ouverture du volet de présentation des billets (Shutter Timeout) (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/Dispenser",
    "analysisKeys": "CDM/Sensor/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-886",
    "title": "GAB - Rejet systématique des cartes à puce pour lecture contact défaillante (Fallback forcé) (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-887",
    "title": "GAB - Capture intempestive de carte suite à arrêt brutal de l alimentation électrique (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-888",
    "title": "GAB - Détection anormale par le capteur anti-skimming entraînant la mise hors service (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-889",
    "title": "GAB - Non-restitution de carte suite à timeout d oubli porteur non paramétré (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-890",
    "title": "GAB - Erreur de lecture piste magnétique sur carte non hybride (Track 2 error) (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/CardReader",
    "analysisKeys": "EMV/IC/Track2, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-891",
    "title": "GAB - Déconnexion intempestive de l agent de supervision NDC/DDC (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-892",
    "title": "GAB - Saturation du disque local de l automate par les journaux de trace détaillés (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-893",
    "title": "GAB - Erreur de téléchargement des états d écrans graphiques et bannières publicitaires (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-894",
    "title": "GAB - Blocage de l automate en mode supervision après intervention de maintenance sans clôture (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-895",
    "title": "GAB - Incohérence des compteurs d inventaire d espèces entre le superviseur et le serveur central (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/Supervisor",
    "analysisKeys": "NDC/Status/DE41, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-896",
    "title": "GAB - Blocage de l accepteur de billets en liasses lors d un versement client (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-897",
    "title": "GAB - Faux signal de contrefaçon rejetant des billets conformes neufs (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-898",
    "title": "GAB - Échec d impression du ticket de justificatif de dépôt d espèces (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-899",
    "title": "GAB - Cassette de recyclage de billets saturée bloquant la fonction de restitution (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-900",
    "title": "GAB - Erreur d identification du compte destinataire lors d un versement sans carte (En clôture comptable mensuelle)",
    "domain": "GAB",
    "component": "ATM/Depository",
    "analysisKeys": "BRM/Envelope/DE4, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-901",
    "title": "TPE - Rejet de transaction sans contact par défaillance de validation du Tag 9F26 (ARQC) (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-902",
    "title": "TPE - Incompatibilité AID Visa Electron / CB sur terminal marchand autonome (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-903",
    "title": "TPE - Transaction refusée avec code TVR indiquant une vérification de porteur échouée (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-904",
    "title": "TPE - Blocage de la transaction sans contact au-dessus du plafond sans bascule contact (Force Contact) (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-905",
    "title": "TPE - Erreur de décodage des tags TLV étendus dans la trame 0200 émise par le TPE (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/Kernel",
    "analysisKeys": "DE55/TLV/TVR, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-906",
    "title": "TPE - Échec de télécollecte nocturne automatique des transactions marchandes (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-907",
    "title": "TPE - Doublon de télécollecte entraînant un double crédit sur le compte du commerçant (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-908",
    "title": "TPE - Fichier de télécollecte tronqué suite à coupure réseau en cours d émission (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-909",
    "title": "TPE - Rejet du lot de télécollecte pour incohérence du total de contrôle (Checksum Batch) (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-910",
    "title": "TPE - Délai d expiration du certificat de la passerelle de télécollecte marchand (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/Gateway",
    "analysisKeys": "0500/Batch/TPE, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-911",
    "title": "TPE - Perte de signal radio GPRS/4G sur un lot de TPE déployés en zone commerciale (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-912",
    "title": "TPE - Refus d enregistrement réseau pour carte SIM monétique expirée ou suspendue (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-913",
    "title": "TPE - Temps de réponse d autorisation supérieur à 45 secondes sur liaison cellulaire (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-914",
    "title": "TPE - Changement d antenne relais provoquant la coupure du tunnel VPN IPSec du TPE (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-915",
    "title": "TPE - Interférence radio empêchant l accroche du réseau 4G forçant une bascule 2G instable (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/GPRS",
    "analysisKeys": "APN/SIM/GPRS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-916",
    "title": "TPE - Échec de mise à jour des tables de routage BIN via le serveur TMS (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-917",
    "title": "TPE - Corruption de la table des devises après injection d un profil erroné (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-918",
    "title": "TPE - Dépassement de capacité mémoire lors du chargement de la nouvelle liste d opposition (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-919",
    "title": "TPE - Blocage de l application monétique suite à injection d un certificat marchand révoqué (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-920",
    "title": "TPE - Désynchronisation de l horodatage du TPE avec le serveur de temps NTP bancaire (En clôture comptable mensuelle)",
    "domain": "TPE",
    "component": "POS/ParamDownload",
    "analysisKeys": "TMS/Config/BIN, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-921",
    "title": "Carte - Rejets massifs avec DE39=54 consécutifs à une date d expiration mal calculée (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-922",
    "title": "Carte - Carte signalée expirée sur le switch alors qu elle est valide sur le CMS (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-923",
    "title": "Carte - Rejet de cartes nouvellement délivrées non reconnues lors de la première utilisation (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-924",
    "title": "Carte - Opposition préventive automatique déclenchée sur un lot de cartes réémises (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-925",
    "title": "Carte - Défaut de renouvellement des cartes arrivant à échéance en fin de mois (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/Lifecycle",
    "analysisKeys": "DE39=54/CMS/Card, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-926",
    "title": "Carte - Rejet avec DE39=61 pour dépassement de plafond hebdomadaire non remis à zéro (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-927",
    "title": "Carte - Incohérence de plafond entre la devise du compte et la devise de calcul du CMS (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-928",
    "title": "Carte - Blocage pour plafond de retrait atteint alors que le solde disponible est largement suffisant (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-929",
    "title": "Carte - Compteur de retraits hors-réseau bloqué après une seule transaction à l étranger (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-930",
    "title": "Carte - Mise à jour d augmentation de plafond demandée en agence non propagée en temps réel (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/Limits",
    "analysisKeys": "DE39=61/Plafond/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-931",
    "title": "Carte - Rejet de transaction légitime avec DE39=62 pour porteur en déplacement international (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-932",
    "title": "Carte - Blocage systématique des transactions e-commerce auprès de sites hébergés en Europe (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-933",
    "title": "Carte - Autorisation acceptée dans un pays soumis à embargo bancaire suite à table de pays obsolète (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-934",
    "title": "Carte - Rejet de transaction en zone frontalière captée par un relais de télécommunication étranger (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-935",
    "title": "Carte - Déblocage géographique temporaire non désactivé automatiquement après la date de fin (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/GeoControl",
    "analysisKeys": "DE39=62/GeoBlock/CMS, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-936",
    "title": "Carte - Blocage carte avec DE39=75 suite à 3 tentatives de PIN infructueuses au GAB (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-937",
    "title": "Carte - Compteur de PIN offline de la puce non réaligné après réinitialisation sur le serveur (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-938",
    "title": "Carte - Faux rejet DE39=75 consécutif à une anomalie de lecture de compteur sur puce dégradée (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-939",
    "title": "Carte - Désynchronisation entre le compteur PIN central et le compteur physique de la carte (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-940",
    "title": "Carte - Tentative de forçage de code PIN par attaque par dictionnaire détectée et neutralisée (En clôture comptable mensuelle)",
    "domain": "Carte",
    "component": "CMS/PINCounter",
    "analysisKeys": "DE39=75/PIN/Retry, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-941",
    "title": "Switch - Rejet massif avec DE39=92 pour nouvelle plage de BIN non référencée dans la table de routage (En clôture comptable mensuelle)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-942",
    "title": "Switch - Boucle de routage infinie entre le switch régional et le frontal national (En clôture comptable mensuelle)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-943",
    "title": "Switch - Délai excessif de résolution de route sur les transactions internationales Visa (En clôture comptable mensuelle)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-944",
    "title": "Switch - Bascule accidentelle du flux GAB sur la route de secours TPE aux capacités limitées (En clôture comptable mensuelle)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-945",
    "title": "Switch - Perte des tables de routage dynamiques suite à un redémarrage non planifié du switch (En clôture comptable mensuelle)",
    "domain": "Switch",
    "component": "Switch/Router",
    "analysisKeys": "Routing/BIN/DE39=92, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-946",
    "title": "Switch - Saturation de la file d attente des requêtes d autorisation en période de soldes (En clôture comptable mensuelle)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-947",
    "title": "Switch - Blocage de la file d attente provoqué par un message malformé bloquant (Poison Message) (En clôture comptable mensuelle)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-948",
    "title": "Switch - Perte de messages en transit suite à un dépassement du temps de rétention en file d attente (En clôture comptable mensuelle)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-949",
    "title": "Switch - Désynchronisation entre les files de requêtes 0200 et les files de réponses 0210 (En clôture comptable mensuelle)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-950",
    "title": "Switch - Dégradation des performances de la file d attente suite à un manque de threads de consommation (En clôture comptable mensuelle)",
    "domain": "Switch",
    "component": "Switch/Queue",
    "analysisKeys": "Queue/FIFO/Drop, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-951",
    "title": "Switch - Absence d émission du message de contre-passation 0400 après expiration du timer de réponse (En clôture comptable mensuelle)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-952",
    "title": "Switch - Rejet du message 0400 par l émetteur pour champ DE90 mal renseigné (En clôture comptable mensuelle)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-953",
    "title": "Switch - Contre-passation acceptée par l émetteur mais non prise en compte par le Core Banking (En clôture comptable mensuelle)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-954",
    "title": "Switch - Génération en boucle de messages de reversal 0400 pour la même transaction (En clôture comptable mensuelle)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-955",
    "title": "Switch - Conflit de séquence entre la réponse tardive 0210 et le message de reversal 0400 (En clôture comptable mensuelle)",
    "domain": "Switch",
    "component": "Switch/Reversal",
    "analysisKeys": "0400/DE90/Timeout, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-956",
    "title": "HSM/Crypto - Perte de liaison socket TCP entre le frontal d acquisition et le boîtier HSM Thales payShield (En clôture comptable mensuelle)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-957",
    "title": "HSM/Crypto - Saturation du pool de connexions simultanées sur le boîtier cryptographique HSM (En clôture comptable mensuelle)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-958",
    "title": "HSM/Crypto - Temps de réponse de calcul cryptographique supérieur à 800ms sur le HSM (En clôture comptable mensuelle)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-959",
    "title": "HSM/Crypto - Bascule automatique en échec vers le HSM de secours suite à une désynchronisation de configuration (En clôture comptable mensuelle)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-960",
    "title": "HSM/Crypto - Erreur de protocole de communication avec le HSM consécutive à une mise à jour logicielle (En clôture comptable mensuelle)",
    "domain": "HSM/Crypto",
    "component": "HSM/HostLink",
    "analysisKeys": "HSM/Socket/Error, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-961",
    "title": "HSM/Crypto - Rejet systématique de vérification PIN sur les flux interbancaires avec DE39=55 (En clôture comptable mensuelle)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-962",
    "title": "HSM/Crypto - Erreur de parité lors de l échange dynamique de clé ZPK avec le réseau Visa (En clôture comptable mensuelle)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-963",
    "title": "HSM/Crypto - Corruption de la clé de transport de clé ZMK utilisée pour déchiffrer la nouvelle ZPK (En clôture comptable mensuelle)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-964",
    "title": "HSM/Crypto - Échec de translation de PIN Block d un format ISO-0 vers un format ISO-3 (En clôture comptable mensuelle)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-965",
    "title": "HSM/Crypto - Expiration de la clé de zone ZPK sans renouvellement automatique préalable (En clôture comptable mensuelle)",
    "domain": "HSM/Crypto",
    "component": "HSM/ZPKEngine",
    "analysisKeys": "ZPK/PINBlock/ISO-0, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-966",
    "title": "HSM/Crypto - Rejet systématique de toutes les transactions à puce d une nouvelle série de cartes (DE39=05) (En clôture comptable mensuelle)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-967",
    "title": "HSM/Crypto - Erreur de dérivation de clé de session EMV consécutive à un compteur ATC incohérent (En clôture comptable mensuelle)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-968",
    "title": "HSM/Crypto - Échec de génération du cryptogramme d autorisation ARPC renvoyé à la carte (En clôture comptable mensuelle)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-969",
    "title": "HSM/Crypto - Désaccord sur la méthode de calcul du cryptogramme dynamique entre la puce et l hôte (En clôture comptable mensuelle)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-970",
    "title": "HSM/Crypto - Rejet de cryptogramme suite à une corruption du Tag 9F37 (Unpredictable Number) en transmission (En clôture comptable mensuelle)",
    "domain": "HSM/Crypto",
    "component": "HSM/ARQCVerification",
    "analysisKeys": "MK-AC/ARQC/Tag9F26, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-971",
    "title": "Clearing - Rejet du fichier de compensation Visa Base II pour erreur de format d en-tête de lot (En clôture comptable mensuelle)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-972",
    "title": "Clearing - Présence de transactions en double dans le fichier de compensation Mastercard IPM (En clôture comptable mensuelle)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-973",
    "title": "Clearing - Échec d intégration du fichier de compensation GIMAC suite à un enregistrement corrompu (En clôture comptable mensuelle)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-974",
    "title": "Clearing - Dépassement de la fenêtre horaire limite de transmission du fichier de clearing (En clôture comptable mensuelle)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-975",
    "title": "Clearing - Incohérence entre les totaux financiers de contrôle et la somme réelle des enregistrements du fichier (En clôture comptable mensuelle)",
    "domain": "Clearing",
    "component": "Clearing/Incoming",
    "analysisKeys": "TC40/Incoming/File, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-976",
    "title": "Clearing - Transactions compensées sans correspondance dans la base des autorisations (Orphelines) (En clôture comptable mensuelle)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-977",
    "title": "Clearing - Écart de montant entre l autorisation initiale et le règlement final en devise étrangère (En clôture comptable mensuelle)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-978",
    "title": "Clearing - Double imputation comptable consécutive à une contestation traitée manuellement et automatiquement (En clôture comptable mensuelle)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-979",
    "title": "Clearing - Suspense comptable persistant sur les transactions de pré-autorisation hôtelière non clôturées (En clôture comptable mensuelle)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-980",
    "title": "Clearing - Incohérence de devise de règlement entre le compte de compensation Nostro et le compte marchand (En clôture comptable mensuelle)",
    "domain": "Clearing",
    "component": "Clearing/Matching",
    "analysisKeys": "RRN/Match/Suspense, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-981",
    "title": "Clearing - Rejet de dossier de contestation pour dépassement du délai réglementaire scheme (120 jours) (En clôture comptable mensuelle)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-982",
    "title": "Clearing - Forclusion d un recours en deuxième présentation (Representment) non notifié au commerçant (En clôture comptable mensuelle)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-983",
    "title": "Clearing - Débit indu du compte commerçant suite à un chargeback frauduleux non vérifié (En clôture comptable mensuelle)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-984",
    "title": "Clearing - Rejet du dossier de litige par la plateforme Visa Resolve Online (VROL) pour pièce jointe non lisible (En clôture comptable mensuelle)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-985",
    "title": "Clearing - Contestation client acceptée par la banque mais non transmise sur le réseau interbancaire (En clôture comptable mensuelle)",
    "domain": "Clearing",
    "component": "Clearing/Chargeback",
    "analysisKeys": "Chargeback/Dispute/DE39, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-986",
    "title": "E-Commerce - Échec d authentification 3D-Secure 2.2 sur les paiements e-commerce par carte internationale (En clôture comptable mensuelle)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-987",
    "title": "E-Commerce - Rejet de transaction en authentification sans friction (Frictionless) forçant un challenge systématique (En clôture comptable mensuelle)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-988",
    "title": "E-Commerce - Non-réception du code OTP par SMS lors de l étape de challenge 3D-Secure (En clôture comptable mensuelle)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-989",
    "title": "E-Commerce - Incompatibilité de version de protocole 3D-Secure entre le marchand et l émetteur de la carte (En clôture comptable mensuelle)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-990",
    "title": "E-Commerce - Échec d affichage de la page de challenge 3D-Secure dans l iframe du site marchand (En clôture comptable mensuelle)",
    "domain": "E-Commerce",
    "component": "3DS/MPI",
    "analysisKeys": "3DS/MPI/Protocol, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-991",
    "title": "E-Commerce - Erreur HTTP 500 sur l API de paiement e-commerce lors de la validation du panier (En clôture comptable mensuelle)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-992",
    "title": "E-Commerce - Non-réception des webhooks de confirmation de paiement par le site e-commerce du commerçant (En clôture comptable mensuelle)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-993",
    "title": "E-Commerce - Double débit client consécutif à des clics répétitifs sur le bouton de paiement en ligne (En clôture comptable mensuelle)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-994",
    "title": "E-Commerce - Rejet de transaction en ligne pour montant non conforme aux limites du contrat marchand VAD (En clôture comptable mensuelle)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-995",
    "title": "E-Commerce - Attaque par force brute sur l API de vérification de validité de carte (Card Testing Attack) (En clôture comptable mensuelle)",
    "domain": "E-Commerce",
    "component": "PaymentGateway/API",
    "analysisKeys": "REST/Webhook/HTTP500, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-996",
    "title": "Mobile/API - Échec d alimentation de portefeuille électronique mobile depuis une carte bancaire (En clôture comptable mensuelle)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-997",
    "title": "Mobile/API - Désynchronisation de solde entre le portefeuille mobile et le compte bancaire support (En clôture comptable mensuelle)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-998",
    "title": "Mobile/API - Rejet de transaction de virement instantané de compte à wallet pour plafond journalier atteint (En clôture comptable mensuelle)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-999",
    "title": "Mobile/API - Échec d enrôlement de la carte bancaire dans le service de paiement sans contact sur smartphone (En clôture comptable mensuelle)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  },
  {
    "reference": "INC-1000",
    "title": "Mobile/API - Rejet de paiement par QR Code marchand EMVCo suite à un QR Code altéré ou expiré (En clôture comptable mensuelle)",
    "domain": "Mobile/API",
    "component": "Mobile/WalletAPI",
    "analysisKeys": "Wallet/API/TopUp, STAN, RRN",
    "knowledgeStatus": "VALIDATED"
  }
];
