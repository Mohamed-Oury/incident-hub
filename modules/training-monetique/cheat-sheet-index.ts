// modules/training-monetique/cheat-sheet-index.ts
// Index (données pures) de l'Antisèche Monétique : sert au composant MonetiqueCheatSheet
// (recherche, filtres, sommaire, copie) et aux tests QA. Le contenu riche de chaque fiche
// est rendu dans MonetiqueCheatSheet.tsx à partir de l'id.

export type MonetiqueCheatCategory =
  | "METHODE"
  | "ISO8583"
  | "FLUX"
  | "EMV"
  | "CRYPTO"
  | "COMPENSATION";

export interface MonetiqueCheatSection {
  id: number;
  category: MonetiqueCheatCategory;
  title: string;
  short: string;
  badge: string;
  badgeColor: string;
  rawText: string;
}

export const MONETIQUE_CHEAT_CATEGORIES: { id: "ALL" | MonetiqueCheatCategory; label: string }[] = [
  { id: "ALL", label: "Toutes les fiches" },
  { id: "METHODE", label: "🧩 Méthode & Diagnostic RUN" },
  { id: "ISO8583", label: "📬 ISO 8583 (MTI, Bitmap, DE)" },
  { id: "FLUX", label: "🔄 Flux, GAB & Reversals" },
  { id: "EMV", label: "💳 EMV (DE55, TVR, ARQC)" },
  { id: "CRYPTO", label: "🔐 Clés, PIN & HSM" },
  { id: "COMPENSATION", label: "🏦 Compensation & Litiges" },
];

export const MONETIQUE_CHEAT_SHEET: MonetiqueCheatSection[] = [
  {
    id: 1,
    category: "METHODE",
    title: "1. 🧭 Diagnostiquer un incident monétique",
    short: "Diagnostic",
    badge: "Fondation RUN",
    badgeColor: "#3b82f6",
    rawText:
      "Méthode de diagnostic incident monétique : Symptôme → Périmètre (canal GAB TPE e-commerce, BIN, réseau) → Trame (MTI, STAN, RRN, DE39) → Logs (switch, HSM, journal GAB) → Cause racine → Action / escalade → Post-mortem. Questions : depuis quand, combien, quel BIN, un terminal ou tous, qui a répondu (émetteur, stand-in, switch).",
  },
  {
    id: 2,
    category: "METHODE",
    title: "2. ✅ Checklist de qualification d'incident",
    short: "Checklist",
    badge: "Checklist interactive",
    badgeColor: "#10b981",
    rawText:
      "Checklist qualification incident : heure de début, canal, BIN émetteur, réseau GIM-UEMOA Visa Mastercard UPI, MTI et DE39 relevés, exemple STAN RRN, taux d'échec, logs switch, statut HSM, sessions réseau 0800 echo, impact client, escalade et communication.",
  },
  {
    id: 3,
    category: "ISO8583",
    title: "3. 📬 MTI : lire les 4 chiffres",
    short: "MTI",
    badge: "Message Type Indicator",
    badgeColor: "#8b5cf6",
    rawText:
      "MTI 4 chiffres : version (0=1987, 1=1993, 2=2003), classe (1 autorisation, 2 financier, 4 annulation reversal, 5 réconciliation, 8 gestion réseau), fonction (0 requête, 1 réponse, 2 advice, 3 réponse advice), origine (0 acquéreur, 1 répétition acquéreur, 2 émetteur). Paires 0100/0110, 0120/0130, 0200/0210, 0220/0230, 0400/0410, 0420/0430, 0421, 0800/0810 sign-on echo test échange de clés DE70.",
  },
  {
    id: 4,
    category: "ISO8583",
    title: "4. 🧮 Bitmap : de l'hexa aux champs présents",
    short: "Bitmap",
    badge: "Décodage manuel",
    badgeColor: "#8b5cf6",
    rawText:
      "Bitmap primaire 64 bits = 16 caractères hexa. Chaque hexa = 4 bits poids 8 4 2 1. Hexa n couvre les champs 4n-3 à 4n. Bit 1 à 1 = bitmap secondaire présent (champs 65 à 128). Exemple 723804010A808000 = champs 2 3 4 7 11 12 13 22 32 37 39 41 49.",
  },
  {
    id: 5,
    category: "ISO8583",
    title: "5. 🗂️ Les champs (DE) à connaître par cœur",
    short: "Champs DE",
    badge: "Data Elements",
    badgeColor: "#8b5cf6",
    rawText:
      "DE2 PAN, DE3 code traitement (00 achat, 01 retrait, 20 remboursement, 30 solde, 40 transfert), DE4 montant (XOF sans décimale), DE7 date heure transmission GMT, DE11 STAN, DE12 DE13 heure date locales, DE14 expiration, DE18 MCC, DE22 mode de saisie, DE32 acquéreur, DE35 piste 2, DE37 RRN, DE38 code autorisation, DE39 code réponse, DE41 terminal TID, DE42 commerçant MID, DE43 nom localisation, DE49 devise 952 XOF 950 XAF 978 EUR 840 USD, DE52 PIN block, DE55 EMV, DE64 DE128 MAC, DE70 gestion réseau, DE90 données originales, DE95 montants de remplacement.",
  },
  {
    id: 6,
    category: "ISO8583",
    title: "6. 🏷️ Codes réponse DE39 : sens & réflexe RUN",
    short: "DE39",
    badge: "Top codes réponse",
    badgeColor: "#ef4444",
    rawText:
      "DE39 : 00 approuvée, 01 référer émetteur, 03 commerçant invalide, 04 capturer carte, 05 ne pas honorer, 12 transaction invalide, 13 montant invalide, 14 carte invalide, 30 erreur format, 41 perdue, 43 volée, 51 provision insuffisante, 54 expirée, 55 PIN incorrect, 57 non autorisée porteur, 58 non autorisée terminal, 61 plafond montant, 62 carte restreinte, 65 plafond fréquence, 75 essais PIN dépassés, 91 émetteur indisponible, 94 doublon, 96 dysfonctionnement système. Code isolé = porteur, code en masse = système.",
  },
  {
    id: 7,
    category: "FLUX",
    title: "7. 🔗 Chaîne des acteurs & stand-in",
    short: "Acteurs",
    badge: "Architecture",
    badgeColor: "#f59e0b",
    rawText:
      "Chaîne : porteur → accepteur (GAB, TPE, e-commerce) → acquéreur → switch / réseau (GIM-UEMOA, Visa, Mastercard, UPI) → émetteur. Autorisation temps réel, compensation fichiers J+1, règlement mouvement de fonds. Stand-in STIP : le réseau répond à la place de l'émetteur indisponible puis envoie un advice 0120 / 0220.",
  },
  {
    id: 8,
    category: "FLUX",
    title: "8. 🏧 Retrait GAB (NDC/DDC) & journal électronique",
    short: "GAB",
    badge: "Cinématique ATM",
    badgeColor: "#f59e0b",
    rawText:
      "Retrait GAB : insertion carte, lecture puce, saisie PIN chiffré par EPP (TPK), choix montant, Transaction Request NDC (11), 0200 DE3=01, 0210 DE39=00, Transaction Reply (4), distribution, Solicited Status (22). Échec distribution ou time-out → reversal 0420 (partiel avec DE95). Journal électronique : CARD INSERTED, PIN ENTERED, NOTES PRESENTED, NOTES TAKEN, NOTES RETRACTED, CARD RETAINED. Client débité non servi.",
  },
  {
    id: 9,
    category: "FLUX",
    title: "9. ⏱️ Reversals 0400/0420 & time-outs",
    short: "Reversals",
    badge: "Anti double débit",
    badgeColor: "#f59e0b",
    rawText:
      "Reversal : 0400 demande d'annulation (réponse 0410), 0420 advice d'annulation store and forward acquitté par 0430, répété en 0421. Déclencheurs : time-out, réponse tardive, échec de distribution, annulation commerçant, réponse rejetée (MAC, format). DE90 données originales (MTI, STAN, DE7, acquéreur), DE95 montants de remplacement. Rapprochement STAN RRN DE7 DE41 PAN. Règle : time-out amont supérieur au time-out aval.",
  },
  {
    id: 10,
    category: "EMV",
    title: "10. 🧬 DE55 & BER-TLV : lire les tags EMV",
    short: "DE55 TLV",
    badge: "Tag-Length-Value",
    badgeColor: "#06b6d4",
    rawText:
      "BER-TLV : Tag (2 octets si 5 bits bas du 1er octet = 1F, ex 9F 5F), Length (81 XX, 82 XXXX au-delà de 127), Value. Tags : 4F AID, 57 piste 2, 5A PAN, 5F24 expiration, 5F2A devise, 5F34 PSN, 82 AIP, 84 DF name, 8A code réponse, 91 données authentification émetteur ARPC, 95 TVR, 9A date, 9B TSI, 9C type, 9F02 montant, 9F03 autre montant, 9F10 IAD, 9F1A pays, 9F26 cryptogramme, 9F27 CID, 9F33 capacités terminal, 9F34 CVM results, 9F36 ATC, 9F37 nombre imprévisible, 71 72 scripts émetteur.",
  },
  {
    id: 11,
    category: "EMV",
    title: "11. 🔬 TVR (Tag 95) & TSI (Tag 9B) octet par octet",
    short: "TVR / TSI",
    badge: "Analyse forensique",
    badgeColor: "#06b6d4",
    rawText:
      "TVR 5 octets : octet 1 authentification offline (SDA DDA CDA, non effectuée, données ICC manquantes, liste noire), octet 2 restrictions d'usage (versions, application expirée, pas encore active, service non autorisé, nouvelle carte), octet 3 vérification porteur (CVM échouée, CVM inconnue, essais PIN dépassés, PIN pad absent, PIN non saisi, PIN online saisi), octet 4 gestion des risques terminal (plafond floor limit, limites offline consécutives, sélection aléatoire, forcé online), octet 5 authentification émetteur (TDOL par défaut, échec authentification émetteur, échec script). TSI 9B : authentification offline, vérification porteur, gestion risques carte, authentification émetteur, gestion risques terminal, script effectués.",
  },
  {
    id: 12,
    category: "EMV",
    title: "12. 🛡️ Cryptogrammes ARQC / ARPC / TC / AAC",
    short: "ARQC / ARPC",
    badge: "Authentification online",
    badgeColor: "#06b6d4",
    rawText:
      "GENERATE AC : AAC refus, TC acceptation offline, ARQC demande online. CID 9F27 : 00 AAC, 40 TC, 80 ARQC. ARQC calculé avec clé de session dérivée de la MK-AC (PAN, PSN, ATC) sur 9F02 9F03 9F1A 95 5F2A 9A 9C 9F37 82 9F36 9F10. HSM émetteur vérifie ARQC et génère ARPC renvoyé dans tag 91, carte fait 2nd GENERATE AC TC ou AAC. Causes d'échec : mauvaise IMK, mauvais schéma de dérivation ou CVN, données mal mappées, PSN absent.",
  },
  {
    id: 13,
    category: "CRYPTO",
    title: "13. 🗝️ Hiérarchie des clés & KCV",
    short: "Clés",
    badge: "Key management",
    badgeColor: "#ec4899",
    rawText:
      "LMK clé maître locale du HSM. ZMK clé de zone échangée en composants entre institutions. ZPK clé PIN de zone. TMK clé maître terminal. TPK clé PIN terminal. PVK vérification PIN (PVV, offset IBM 3624). CVK CVV CVV2 iCVV. IMK MK-AC EMV. ZAK TAK MAC. BDK IPEK DUKPT pour TPE. KCV = chiffrement d'un bloc de zéros, comparer des deux côtés. Composants XOR, double contrôle, connaissance partagée. PIN incorrect en masse ou rejet MAC = KCV désynchronisé.",
  },
  {
    id: 14,
    category: "CRYPTO",
    title: "14. 🔢 PIN Block ISO-0 (ISO 9564 format 0)",
    short: "PIN Block",
    badge: "Calcul pas à pas",
    badgeColor: "#ec4899",
    rawText:
      "PIN block ISO-0 : champ PIN = 0 + longueur + PIN + F jusqu'à 16 hexa ; champ PAN = 0000 + 12 chiffres les plus à droite du PAN hors chiffre de contrôle ; XOR des deux. Exemple PIN 1234, PAN 4970101234567890 : 041234FFFFFFFFFF XOR 0000010123456789 = 041235FEDCBA9876, puis chiffrement TPK au terminal, translation TPK vers ZPK puis ZPK vers ZPK en HSM. Formats ISO-1 (sans PAN), ISO-3 (remplissage aléatoire), ISO-4 (AES).",
  },
  {
    id: 15,
    category: "CRYPTO",
    title: "15. 🖥️ Commandes HSM Thales payShield courantes",
    short: "HSM",
    badge: "Exploitation HSM",
    badgeColor: "#ec4899",
    rawText:
      "Commandes payShield : NC diagnostic, A0 génération de clé, A6 import de clé, A8 export, BU calcul KCV, FA translation ZPK de ZMK vers LMK, CA translation PIN TPK vers ZPK, CC translation PIN ZPK vers ZPK, JE ZPK vers LMK, DA DC vérification PIN terminal, EA EC vérification PIN interchange, CW CY génération et vérification CVV, KQ vérification ARQC génération ARPC. Réponse = 2e lettre incrémentée (CA → CB). Erreurs : 00 OK, 01 échec de vérification, 10 parité clé source, 11 parité clé destination, 15 données invalides, 20 PIN block invalide, 68 commande désactivée.",
  },
  {
    id: 16,
    category: "COMPENSATION",
    title: "16. 🏦 Compensation Base II / IPM & règlement",
    short: "Compensation",
    badge: "Clearing & Settlement",
    badgeColor: "#a855f7",
    rawText:
      "Autorisation temps réel ≠ compensation (présentation des fichiers par l'acquéreur, J+1) ≠ règlement (mouvement de fonds net via la banque de règlement, BCEAO STAR-UEMOA pour GIM-UEMOA). Visa Base II : TC05 achat, TC06 crédit, TC07 cash, TC15 TC16 TC17 chargebacks. Mastercard IPM : 1240 présentation (DE24 200 première, 205 282 seconde), 1442 chargeback (450 453), 1644 header trailer, 1740 frais. Rapprochement autorisation présentation : DE38, RRN, montant, PAN. Écarts : présentation sans autorisation, autorisation non présentée, montant différent.",
  },
  {
    id: 17,
    category: "COMPENSATION",
    title: "17. ⚖️ Litiges & chargebacks",
    short: "Chargebacks",
    badge: "Cycle de litige",
    badgeColor: "#a855f7",
    rawText:
      "Cycle litige : transaction, présentation, réclamation porteur, demande de copie, chargeback émetteur, représentation (second presentment) acquéreur avec preuves, pré-arbitrage, arbitrage par le réseau (frais au perdant). Délais indicatifs : environ 120 jours pour le chargeback, 30 à 45 jours pour la représentation. Visa VCR : 10 fraude, 11 autorisation, 12 erreur de traitement, 13 litige consommateur. Mastercard : 4808 autorisation, 4834 erreur point d'interaction, 4837 absence d'autorisation porteur, 4853 litige porteur. GAB débité non servi : journal électronique, compteurs cassettes, reversal.",
  },
  {
    id: 18,
    category: "METHODE",
    title: "18. ⚡ LA MÉTHODE À RETENIR",
    short: "Décalogue",
    badge: "Le Décalogue Monétique",
    badgeColor: "#eab308",
    rawText:
      "Décalogue : 1 partir de la trame MTI DE39 STAN RRN, 2 identifier qui a répondu, 3 code isolé porteur code en masse système, 4 rapprocher par STAN RRN DE7 DE41, 5 réponse non reçue = reversal acquitté, 6 PIN incorrect en masse = clés KCV TPK ZPK, 7 lire DE55 CID TVR TSI, 8 vérifier les sessions réseau 0800 echo, 9 autorisation ≠ compensation ≠ règlement, 10 documenter horodatage impact cause action post-mortem.",
  },
];
