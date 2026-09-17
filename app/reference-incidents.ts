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
  }
];
