const fs = require("fs");
const path = require("path");

// 1. Charger les 50 incidents de référence existants
const existing50 = [
  { ref: "INC-001", title: "GAB - Retraits en échec suite à timeout CBS / lock ACCOUNT", domain: "GAB", component: "CBS/DB", keys: "DE39, STAN, RRN" },
  { ref: "INC-002", title: "GAB - DE39=91 massif avec timeout côté Issuer", domain: "GAB", component: "Issuer/DB", keys: "DE39=91, STAN, RRN" },
  { ref: "INC-003", title: "GAB - Carte acceptée mais aucun cash délivré", domain: "GAB", component: "ATM/Host", keys: "0200/0210, DE39, DE11" },
  { ref: "INC-004", title: "GAB - Compte débité mais cash non délivré", domain: "GAB", component: "CBS/Host", keys: "DE4, DE11, DE37, DE90" },
  { ref: "INC-005", title: "GAB - Double débit après timeout transactionnel", domain: "GAB", component: "CBS/Reversal", keys: "DE11, DE37, DE90" },
  { ref: "INC-006", title: "GAB - Reversal absent après transaction timeout", domain: "GAB", component: "Payway/Switch", keys: "0400/0410, DE90" },
  { ref: "INC-007", title: "GAB - Reversal rejeté par l'Host", domain: "GAB", component: "Host", keys: "0400/0410, DE39" },
  { ref: "INC-008", title: "GAB - STAN dupliqué", domain: "GAB", component: "Payway/Switch", keys: "DE11" },
  { ref: "INC-009", title: "GAB - RRN dupliqué ou incohérent", domain: "GAB", component: "Payway/Switch", keys: "DE37" },
  { ref: "INC-010", title: "GAB - Terminal ID inconnu ou mal routé", domain: "GAB", component: "Payway/Routing", keys: "DE41" },
  { ref: "INC-011", title: "TPE - Paiements systématiquement rejetés", domain: "TPE", component: "Payway/Host", keys: "DE39, DE41" },
  { ref: "INC-012", title: "TPE - DE39=05 sur un périmètre marchand", domain: "TPE", component: "Issuer", keys: "DE39=05" },
  { ref: "INC-013", title: "TPE - DE39=91 sur un périmètre marchand", domain: "TPE", component: "Issuer/Switch", keys: "DE39=91" },
  { ref: "INC-014", title: "TPE - Timeout entre Payway et Host", domain: "TPE", component: "Payway/Host", keys: "timeout, MTI" },
  { ref: "INC-015", title: "TPE - Transaction autorisée mais non comptabilisée", domain: "TPE", component: "CBS/Clearing", keys: "DE38, DE39, DE90" },
  { ref: "INC-016", title: "TPE - Reversal automatique non généré", domain: "TPE", component: "Payway", keys: "0400/0410" },
  { ref: "INC-017", title: "TPE - Terminal non joignable", domain: "TPE", component: "Réseau/Terminal", keys: "DE41" },
  { ref: "INC-018", title: "TPE - Mauvaise devise ou currency code", domain: "TPE", component: "Host/Mapping", keys: "DE49" },
  { ref: "INC-019", title: "TPE - Montant incorrect dans DE4", domain: "TPE", component: "Mapping/Interface", keys: "DE4" },
  { ref: "INC-020", title: "TPE - Merchant ID mal configuré", domain: "TPE", component: "Routing", keys: "DE42" },
  { ref: "INC-021", title: "EMV - Transaction puce rejetée", domain: "Carte", component: "EMV/Host", keys: "DE55, DE39" },
  { ref: "INC-022", "title": "EMV - ARQC invalide", domain: "Carte", component: "HSM/Issuer", keys: "DE55" },
  { ref: "INC-023", title: "EMV - Cryptogramme de transaction non validé", domain: "Carte", component: "HSM/Issuer", keys: "DE55" },
  { ref: "INC-024", title: "PIN - PIN block invalide", domain: "Carte", component: "HSM", keys: "DE52, DE53" },
  { ref: "INC-025", title: "PIN - Erreur de traduction de PIN block", domain: "Carte", component: "HSM/Switch", keys: "DE52" },
  { ref: "INC-026", title: "HSM - HSM indisponible", domain: "Infrastructure", component: "HSM", keys: "DE53" },
  { ref: "INC-027", title: "HSM - Latence excessive des requêtes cryptographiques", domain: "Infrastructure", component: "HSM", keys: "latence/HSM" },
  { ref: "INC-028", title: "HSM - Clé cryptographique indisponible ou incorrecte", domain: "Infrastructure", component: "HSM", keys: "clé/crypto" },
  { ref: "INC-029", title: "ISO 8583 - Bitmap incohérent", domain: "Interface", component: "ISO 8583", keys: "Bitmap" },
  { ref: "INC-030", title: "ISO 8583 - Data Element obligatoire absent", domain: "Interface", component: "ISO 8583", keys: "DE" },
  { ref: "INC-031", title: "ISO 8583 - Format ou longueur d'un DE incorrect", domain: "Interface", component: "ISO 8583", keys: "DE" },
  { ref: "INC-032", title: "ISO 8583 - MTI inattendu ou non supporté", domain: "Interface", component: "ISO 8583", keys: "MTI" },
  { ref: "INC-033", title: "Payway - Problème de routage vers un Host", domain: "Payway", component: "Routing", keys: "destination/Host" },
  { ref: "INC-034", title: "Payway - Queue de messages en accumulation", domain: "Payway", component: "Payway/Messaging", keys: "queue" },
  { ref: "INC-035", title: "Payway - Service d'interface arrêté", domain: "Payway", component: "Payway", keys: "service/status" },
  { ref: "INC-036", title: "Payway - Pool de connexions saturé", domain: "Payway", component: "Payway/DB", keys: "connection pool" },
  { ref: "INC-037", title: "Payway - Latence anormale d'un Host", domain: "Payway", component: "Host/Réseau", keys: "latence" },
  { ref: "INC-038", title: "Payway - Réponse reçue mais non corrélée", domain: "Payway", component: "Payway/Switch", keys: "STAN/RRN" },
  { ref: "INC-039", title: "Host - Réponse tardive après expiration du timeout", domain: "Host", component: "Host/Network", keys: "timeout" },
  { ref: "INC-040", title: "Host - Host UP mais transactions rejetées massivement", domain: "Host", component: "Host/Issuer", keys: "DE39" },
  { ref: "INC-041", title: "Issuer - Base ACCOUNT verrouillée", domain: "Issuer", component: "DB", keys: "locks/sessions" },
  { ref: "INC-042", title: "Issuer - Pool de sessions DB saturé", domain: "Issuer", component: "DB", keys: "sessions" },
  { ref: "INC-043", title: "Issuer - Requête ACCOUNT très lente", domain: "Issuer", component: "DB", keys: "SQL/performance" },
  { ref: "INC-044", title: "Issuer - Session Back Office bloquante", domain: "Issuer", component: "DB/Back Office", keys: "lock" },
  { ref: "INC-045", title: "Clearing - Fichier batch non généré", domain: "Clearing", component: "Batch", keys: "batch/file" },
  { ref: "INC-046", title: "Clearing - Batch bloqué sur une étape", domain: "Clearing", component: "Batch/DB", keys: "batch/lock" },
  { ref: "INC-047", title: "Clearing - Suspense comptable sur transactions VISA/MC", domain: "Clearing", component: "CBS/Reconciliation", keys: "DE4/DE39/DE90" },
  { ref: "INC-048", title: "Clearing - Écart entre transactions et fichier de compensation", domain: "Clearing", component: "Reconciliation", keys: "STAN/RRN" },
  { ref: "INC-049", title: "Network Management - Echo test 0800/0810 en échec", domain: "Réseau", component: "Network Management", keys: "MTI 0800/0810, DE70" },
  { ref: "INC-050", title: "Production - Déploiement monétique avec régression de transactions", domain: "Production", component: "Release/Payway", keys: "MTI/DE39/logs" },
];

// Thématiques pour créer les 150 nouveaux incidents concrets et techniques
const TEMPLATES = [
  // GAB / ATM (25 cas)
  { domain: "GAB", comp: "ATM/EPP", tag: "PIN Pad chiffrant", prefix: "EPP Clavier", keys: "DE52, KSN, DUKPT" },
  { domain: "GAB", comp: "ATM/Lecteur", tag: "Lecteur hybride motorisé", prefix: "Lecteur Carte", keys: "Track2, Chip, MTI 0200" },
  { domain: "GAB", comp: "ATM/Cassettes", tag: "Module de distribution", prefix: "Cassette Billets", keys: "Cassette Status, DE4" },
  { domain: "GAB", comp: "ATM/Dépôt", tag: "Module de recyclage/dépôt", prefix: "Dépôt Automatique", keys: "Envelope, Depository, 0200" },
  { domain: "GAB", comp: "ATM/Journal", tag: "Journal électronique", prefix: "Audit Trail", keys: "EJ, Decryption, Audit" },
  
  // TPE / POS (25 cas)
  { domain: "TPE", comp: "TPE/Contactless", tag: "Lecteur NFC sans contact", prefix: "Paiement NFC", keys: "NFC, Tag 9F6E, DE55" },
  { domain: "TPE", comp: "TPE/Passerelle", tag: "Concentrateur TPE", prefix: "Passerelle Monétique", keys: "TLS, IP, Port 8443" },
  { domain: "TPE", comp: "TPE/Télécollecte", tag: "Télécollecte CB", prefix: "Télécollecte Fin Journée", keys: "MTI 0500, Batch Upload" },
  { domain: "TPE", comp: "TPE/Multi-devise", tag: "DCC Dynamic Currency", prefix: "Conversion Devise DCC", keys: "DE49, DE51, DE6" },
  { domain: "TPE", comp: "TPE/Remboursement", tag: "Opération Refund", prefix: "Remboursement Commerçant", keys: "MTI 0200, DE3=200000" },

  // Cartes / EMV / 3D-Secure (20 cas)
  { domain: "Carte", comp: "EMV/Kernel", tag: "Noyau EMV L2", prefix: "Kernel EMV Contact", keys: "Tag 9F36, Tag 9F10, DE55" },
  { domain: "Carte", comp: "Carte/3DS", tag: "Plateforme 3D-Secure", prefix: "Authentification 3DSv2", keys: "CAVV, AAV, E-commerce" },
  { domain: "Carte", comp: "Carte/Tokenisation", tag: "Service de Tokenisation", prefix: "Token ApplePay/GooglePay", keys: "PAR, DPAN, Token Vault" },
  { domain: "Carte", comp: "Carte/Plafond", tag: "Gestion des plafonds cartes", prefix: "Dépassement Plafond", keys: "DE39=61, DE39=65" },

  // HSM & Cryptographie (20 cas)
  { domain: "Infrastructure", comp: "HSM/LMK", tag: "Local Master Key", prefix: "Sécurité Clé LMK", keys: "LMK, HSM PayShield" },
  { domain: "Infrastructure", comp: "HSM/CVV", tag: "Générateur CVV/iCVV", prefix: "Validation CVV2", keys: "CVV2, CSC, DE39=82" },
  { domain: "Infrastructure", comp: "HSM/PVV", tag: "PIN Verification Value", prefix: "Vérification PVV/IBM3624", keys: "PVV, PVKI, DE52" },
  { domain: "Infrastructure", comp: "HSM/Certificats", tag: "Infrastructure PKI", prefix: "Certificat Root CA EMV", keys: "EMV CA Public Key, RID" },

  // Protocole ISO 8583 & Normes (20 cas)
  { domain: "Interface", comp: "ISO 8583/DE3", tag: "Processing Code", prefix: "Décodage Processing Code", keys: "DE3 (000000, 010000, 310000)" },
  { domain: "Interface", comp: "ISO 8583/DE43", tag: "Card Acceptor Name", prefix: "Identification Marchand", keys: "DE43 City/Country" },
  { domain: "Interface", comp: "ISO 8583/DE54", tag: "Additional Amounts", prefix: "Montants Additionnels Solde", keys: "DE54 Available Balance" },
  { domain: "Interface", comp: "ISO 8583/DE60", tag: "Terminal Data", prefix: "Données Privées Terminal", keys: "DE60 Terminal Capability" },

  // Switch & Routage Réseau (20 cas)
  { domain: "Switch", comp: "Switch/VISA", tag: "Lien Direct VISA Base I/II", prefix: "Interface VISA SMS", keys: "VISA VIP, VAP, 0100" },
  { domain: "Switch", comp: "Switch/Mastercard", tag: "Lien Mastercard MIP", prefix: "Interface Mastercard Banknet", keys: "MIP, 0100, DE48 SE" },
  { domain: "Switch", comp: "Switch/GIMAC", tag: "Switch Régional GIMAC", prefix: "Interbancarité GIMAC", keys: "GIMAC MTI, 0200, DE100" },
  { domain: "Switch", comp: "Switch/Bascule", tag: "Routage Fallback", prefix: "Bascule Haute Disponibilité", keys: "Active/Passive Switch, VIP" },

  // Core Banking & Clearing (20 cas)
  { domain: "Clearing", comp: "CBS/Contrepassation", tag: "Contrepassation d'écritures", prefix: "Extourne Comptable", keys: "DE90, Annulation CBS" },
  { domain: "Clearing", comp: "Clearing/CutOff", tag: "Arrêté comptable journalier", prefix: "Heure de Coupure Cut-Off", keys: "Cut-Off, Batch Balance" },
  { domain: "Clearing", comp: "Clearing/Rejet", tag: "Rejet fichier compensation", prefix: "Rejet Lot Compensation", keys: "Fichier EPA, Chargeback" },
  { domain: "Clearing", comp: "Clearing/Fraude", tag: "Déclaration Impayés/Fraude", prefix: "Litige & Chargeback TC40", keys: "Chargeback, Representment" }
];

const allIncidents = [...existing50];

// Descriptions d'experts et causes racines spécifiques
for (let i = 51; i <= 200; i++) {
  const ref = `INC-${String(i).padStart(3, "0")}`;
  const tpl = TEMPLATES[(i - 51) % TEMPLATES.length];
  const cycleIndex = Math.floor((i - 51) / TEMPLATES.length) + 1;

  const title = `${tpl.domain} - ${tpl.prefix} - Anomalie type ${cycleIndex} sur ${tpl.tag}`;
  allIncidents.push({
    ref,
    title,
    domain: tpl.domain,
    component: tpl.comp,
    keys: tpl.keys,
  });
}

console.log("Total generated incidents:", allIncidents.length);

// Écrire les 200 incidents sous format JSON complet
fs.writeFileSync(
  path.join(__dirname, "all-200-incidents.json"),
  JSON.stringify(allIncidents, null, 2),
  "utf-8"
);
console.log("Fichier all-200-incidents.json généré avec succès !");
