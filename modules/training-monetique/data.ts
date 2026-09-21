// modules/training-monetique/data.ts
import { MonetiqueGrade, MonetiqueLesson } from "./types";

export const MONETIQUE_GRADES: MonetiqueGrade[] = [
  {
    level: 1,
    gradeCode: "APPRENTI",
    name: "Niveau 1 : Fondamentaux de la Monétique & ISO 8583",
    badge: "🟢 Apprenti Monétique",
    color: "#10b981",
    minPassScorePct: 80,
    objective: "Comprendre les acteurs du paiement (Porteur, Acquéreur, Émetteur, Scheme), l'anatomie d'une trame ISO 8583 (MTI, Bitmap, Datatypes) et les codes réponses DE39.",
    recommendedResources: [
      {
        title: "Norme Internationale ISO 8583-1:1987 / 1993 / 2003",
        type: "STANDARD_ISO",
        reference: "ISO/IEC 8583 Financial Transaction Card Originated Messages",
        description: "Spécification formelle de la structure des messages d'échange financier, des classes MTI et du dictionnaire des 128 champs (Data Elements)."
      },
      {
        title: "Manuel Opérationnel d'Acquisition & Émission GIM-UEMOA / UEMOA",
        type: "GUIDE_GIM",
        reference: "GIM-SPEC-TECH-V3.2",
        description: "Règles régionales de routage monétique interbancaire, gestion des codes pays (952 XOF) et profils de terminaux."
      },
      {
        title: "Guide de Décryptage des Codes Réponses DE39 & Traitement des Rejets",
        type: "DOC_SCHEME",
        reference: "SCHEME-DE39-REFERENCE-GUIDE",
        description: "Taxonomie exhaustive des codes d'approbation (00), refus porteur (51, 54, 55) et incidents techniques (68, 91, 96)."
      }
    ]
  },
  {
    level: 2,
    gradeCode: "JUNIOR",
    name: "Niveau 2 : Terminaux Bancaires (ATM / POS) & Protocoles",
    badge: "🔵 Junior Monétique",
    color: "#3b82f6",
    minPassScorePct: 80,
    objective: "Maîtriser le fonctionnement des automates bancaires (GAB/ATM), des terminaux de paiement (TPE/POS), des flux d'autorisation en temps réel et des annulations/reversals (0400/0420).",
    recommendedResources: [
      {
        title: "Protocole NDC+ (NCR Direct Connect) & DDC (Diebold Direct Connect)",
        type: "MANUEL_HSM",
        reference: "ATM-NDC-DDC-MSG-PROTOCOL",
        description: "Spécifications des messages d'états GAB, commandes de distribution de billets, gestion des cassettes et capteurs de bourrage."
      },
      {
        title: "Guide d'Analyse des Journaux Électroniques GAB (ATM Electronic Journal)",
        type: "DOC_SCHEME",
        reference: "EJ-AUDIT-FORENSIC-V2",
        description: "Méthodologie de réconciliation des réclamations porteur : distinction entre rejet avant présentation, capture et bourrage avec volet non ouvert."
      },
      {
        title: "Architecture du Routage Monétique & Time-Outs Réseau (STAN, RRN)",
        type: "GUIDE_GIM",
        reference: "SWITCH-ROUTING-TIMEOUT-MATRIX",
        description: "Cycle de vie des transactions : émission 0200, attente réponse émetteur, déclenchement d'annulation 0420 sur expiration du timer (30s)."
      }
    ]
  },
  {
    level: 3,
    gradeCode: "CONFIRME",
    name: "Niveau 3 : Puce EMV, TLV, Cryptogrammes & Sécurité Porteur",
    badge: "🟡 Confirmé Monétique",
    color: "#f59e0b",
    minPassScorePct: 85,
    objective: "Décortiquer les spécifications EMV Book 1 à 4, le champ DE55 (TLV), la génération d'ARQC / TC / AAC, et l'analyse bit-à-bit du registre TVR (Tag 95) et TSI (Tag 9B).",
    recommendedResources: [
      {
        title: "Spécifications Officielles EMVCo (Books 1, 2, 3, 4)",
        type: "SPEC_EMV",
        reference: "EMVCo Integrated Circuit Card Specifications for Payment Systems v4.3",
        description: "Standards mondiaux des cartes à puce : sélection d'application (AID), authentification de données (SDA, DDA, CDA) et gestion du risque terminal."
      },
      {
        title: "Manuel de Décodage Tag-Length-Value (BER-TLV) & Tag 95 (TVR)",
        type: "SPEC_EMV",
        reference: "EMV-TLV-DICTIONARY-BOOK3",
        description: "Décomposition bit-à-bit du TVR (5 octets) pour détecter les échecs de saisie de PIN, cartes périmées et forçages en ligne."
      },
      {
        title: "Guide des Cryptogrammes Applicatifs (ARQC, ARPC, TC, AAC)",
        type: "DOC_SCHEME",
        reference: "EMV-CHIP-ONLINE-AUTH-GUIDE",
        description: "Validation de l'authenticité de la puce par l'émetteur : calcul de l'ARQC, vérification en HSM hôte et émission de l'ARPC avec mise à jour de script."
      }
    ]
  },
  {
    level: 4,
    gradeCode: "SENIOR",
    name: "Niveau 4 : Cryptographie Bancaire, HSM & Sécurité PCI-DSS",
    badge: "🟠 Senior Monétique",
    color: "#f97316",
    minPassScorePct: 85,
    objective: "Maîtriser la hiérarchie des clés de sécurité (LMK, ZMK, ZPK, PVK, CVK), les formats de PIN Block (ISO Format 0, 1, 3), la translation de PIN en HSM et le chiffrement 3DES/AES.",
    recommendedResources: [
      {
        title: "Manuel des Commandes Thales payShield 9000 / 10K & Atalla HSM",
        type: "MANUEL_HSM",
        reference: "THALES-HOST-COMMANDS-REFERENCE",
        description: "Commandes cryptographiques hôte : génération de clés (A0), translation de PIN Block (CA), vérification CVV/iCVV (CY) et vérification ARQC (KQ/KW)."
      },
      {
        title: "Normes de Sécurité du PIN PCI-PIN & PCI-PTS v6",
        type: "STANDARD_ISO",
        reference: "PCI Security Standards Council - PIN Security Requirements",
        description: "Règles strictes de non-divulgation du PIN en clair, séparation des tâches (dual custody / split knowledge) et destruction inviolable des clés en cas d'intrusion physique."
      },
      {
        title: "Standard ANSI X9.8 / ISO 9564-1 (Format de PIN Block)",
        type: "STANDARD_ISO",
        reference: "ISO 9564-1 Banking - Personal Identification Number (PIN) management",
        description: "Calcul mathématique du XOR entre le PIN en clair et le PAN du porteur pour produire le bloc ISO Format 0."
      }
    ]
  },
  {
    level: 5,
    gradeCode: "EXPERT",
    name: "Niveau 5 : Clearing, Compensation, Rapprochement & Litiges Schemes",
    badge: "🔴 Expert Monétique",
    color: "#ef4444",
    minPassScorePct: 90,
    objective: "Gérer de bout en bout les flux de compensation interbancaire (Visa Base II, Mastercard IPM, GIM-UEMOA), le cycle de chargeback / litiges (First Chargeback, Pre-Arbitration), et le déversement comptable dans le CBS.",
    recommendedResources: [
      {
        title: "Spécifications Techniques Visa Base II Clearing & Settlement",
        type: "DOC_SCHEME",
        reference: "VISA-BASE-II-CLEARING-MANUAL",
        description: "Structure des enregistrements TCE (Transaction Code Enforcement), draft clearing, conversion de change multi-devises et balance de règlement."
      },
      {
        title: "Mastercard Integrated Processing Management (IPM) Manual",
        type: "DOC_SCHEME",
        reference: "MASTERCARD-IPM-CLEARING-V5",
        description: "Gestion des flux de présentation financière, messages 1240 / 1442, frais interchange et lettrage sur compte de compensation."
      },
      {
        title: "Réglementation des Litiges & Chargebacks Schemes (Visa Dispute Resolution)",
        type: "GUIDE_GIM",
        reference: "SCHEME-DISPUTE-RULES-2026",
        description: "Procédure d'impayé : motifs Reason Codes (10.4 Fraude, 13.1 Services non fournis), délais de recevabilité (120 jours) et arbitrage financier."
      }
    ]
  }
];

export const MONETIQUE_LESSONS: MonetiqueLesson[] = [
  // --- NIVEAU 1 : FONDAMENTAUX & ISO 8583 ---
  {
    id: "m_l1_01",
    gradeLevel: 1,
    category: "ISO8583",
    title: "1.1 Architecture des Acteurs Monétiques & Chaîne de Paiement",
    summary: "Comprendre les 4 coins du modèle bancaire : Porteur, Acquéreur, Émetteur et Switch International.",
    keyConcepts: ["Porteur (Cardholder)", "Acquéreur (Acquirer)", "Émetteur (Issuer)", "Scheme / Switch (Visa, Mastercard, GIM)", "Interchange"],
    detailedContent: `Le paiement par carte repose sur le modèle dit "des quatre coins" :
1. Le Porteur de la carte (Cardholder) : client détenant un compte auprès d'une banque émettrice.
2. Le Commerçant ou GAB : affilié auprès d'une banque acquéreuse pour accepter les paiements.
3. La Banque Acquéreuse (Acquirer) : capture la transaction sur son TPE ou GAB et la transmet au réseau.
4. La Banque Émettrice (Issuer) : tient le compte du porteur, vérifie la provision, valide le code PIN et répond à la demande d'autorisation.
Le Switch ou Scheme (Visa, Mastercard, GIM-UEMOA) agit comme tiers de confiance assurant le routage technique en quelques millisecondes et le règlement financier ultérieur.`,
    technicalSample: `[Porteur] -> [TPE/GAB Acquéreur]
                  |
                  v
          [Banque Acquéreuse]
                  |  (Trame ISO 8583 - MTI 0200)
                  v
         [Switch / Scheme Network]
                  |  (Routage vers BIN émetteur)
                  v
          [Banque Émettrice] -> Débit provision & Réponse 0210`,
    explanation: "La séparation stricte entre l'Acquisition (collecte locale du paiement) et l'Émission (gestion du compte porteur) est le principe fondateur de l'interbancalité mondiale.",
    goldenRules: [
      "Toujours identifier si votre banque intervient comme Émettrice (Issuer) ou Acquéreuse (Acquirer) dans l'analyse d'un incident.",
      "Le Switch ne stocke pas les soldes des clients : il ne fait que router les messages selon les plages de BIN (Bank Identification Number)."
    ],
    pitfallsToAvoid: [
      "Confondre la banque de l'automate (acquéreur) et la banque de la carte (émetteur) lors du traitement d'une réclamation de retrait non distribué."
    ]
  },
  {
    id: "m_l1_02",
    gradeLevel: 1,
    category: "ISO8583",
    title: "1.2 Anatomie d'un Message ISO 8583 : MTI, Bitmaps & Datatypes",
    summary: "Déchiffrez la structure des trames : identification de classe, bitmap hexadécimal et champs numériques/alphanumériques.",
    keyConcepts: ["MTI (Message Type Identifier)", "Primary Bitmap", "Secondary Bitmap", "Champs Fixes vs LLVAR / LLLVAR", "Padding"],
    detailedContent: `Une trame ISO 8583 se décompose toujours en 3 sections fondamentales :
1. Le MTI (4 chiffres) : 
   - 1er chiffre : Version ISO (ex: 0 = ISO 1987, 1 = ISO 1993, 2 = ISO 2003).
   - 2e chiffre : Classe de message (1 = Autorisation, 2 = Financier, 4 = Reversal, 8 = Gestion réseau).
   - 3e chiffre : Fonction du message (0 = Demande, 1 = Réponse, 2 = Avis / Advice).
   - 4e chiffre : Origine (0 = Acquéreur, 2 = Émetteur).
2. Le Bitmap (16 ou 32 caractères hexadécimaux) :
   - Chaque caractère hexadécimal représente 4 bits. Si le bit N est à 1, le Data Element N est présent dans le corps du message.
   - Si le bit 1 est à 1, un Bitmap Secondaire (champs 65 à 128) est présent.
3. Les Data Elements :
   - Fixes (ex: DE4 Montant = 12 chiffres fixes).
   - Variables LLVAR (ex: DE2 PAN = 2 chiffres de longueur suivis du numéro de carte).
   - Variables LLLVAR (ex: DE55 EMV = 3 chiffres de longueur suivis des données).`,
    technicalSample: `Trame brute : 02007238200108E18000164970101234567890010000000000050000...
Décomposition :
- MTI: 0200 (Demande financière d'autorisation)
- Bitmap: 7238200108E18000 -> 0111 0010 0011 1000 ... (Présence DE2, DE3, DE4, DE7, DE11, DE12...)
- DE2 (LLVAR): Longueur "16", Valeur "4970101234567890"
- DE4 (n12): "000000050000" = 500.00 XOF`,
    explanation: "Le Bitmap évite de transmettre des séparateurs de champs ou des octets nuls, garantissant une transmission ultra-compacte sur les liaisons télécoms bancaires.",
    goldenRules: [
      "Le premier bit du Bitmap primaire est le drapeau d'extension vers le Bitmap secondaire.",
      "Les montants ISO 8583 sont toujours exprimés en centimes sans virgule (ex: 50 000 FCFA s'écrit 000005000000 si devise sans décimale, ou avec 2 décimales selon DE49)."
    ],
    pitfallsToAvoid: [
      "Oublier de lire les 2 octets d'en-tête de longueur pour un champ LLVAR : décaler la lecture d'un seul octet désynchronise la totalité de la trame restante."
    ]
  },
  {
    id: "m_l1_03",
    gradeLevel: 1,
    category: "ISO8583",
    title: "1.3 Référentiel des Codes Réponses DE39 & Traitement des Rejets",
    summary: "Interprétez immédiatement les décisions d'autorisation et distinguez les rejets clients des pannes système.",
    keyConcepts: ["00 Approbation", "51 Provision insuffisante", "54 Carte expirée", "55 Code PIN incorrect", "68 Time-out acquéreur", "91 Émetteur inaccessible", "96 Erreur système"],
    detailedContent: `Le champ DE39 (Response Code) contient la décision formelle retournée par la banque émettrice :
- Codes d'Approbation :
  * 00 : Transaction approuvée avec succès.
- Rejets liés au Porteur (Régularisation commerciale) :
  * 51 : Solde insuffisant / dépassement de découvert autorisé.
  * 54 : Date d'expiration de la carte dépassée.
  * 55 : Code PIN erroné (compteur de faux essais incrémenté).
  * 75 : Nombre maximum d'essais PIN dépassé (carte bloquée).
- Rejets Techniques & Défaillances Système (Alerte Run / Astreinte) :
  * 68 : Réponse reçue trop tard par l'acquéreur (Time-out dépassé).
  * 91 : Serveur d'autorisation émetteur injoignable ou ligne télécom coupée.
  * 96 : Dysfonctionnement système interne du switch ou de la base CBS.`,
    technicalSample: `Réception réponse 0210 :
MTI: 0210
DE39: 51  -> Statut: REJET COMMERCIAL (Solde insuffisant)
Action TPE : Afficher "FONDS INSUFFISANTS" - Pas de notification d'astreinte IT.

Réception réponse 0210 :
MTI: 0210
DE39: 91  -> Statut: PANNE D'INFRASTRUCTURE IT (Émetteur inaccessible)
Action Run : Vérifier le lien VPN/X.25 avec le switch et l'état du démon HSM.`,
    explanation: "Une bonne plateforme de monitoring monétique doit distinguer automatiquement les rejets métier porteur (taux normal ~8-12%) des pics d'erreurs 91/96 qui révèlent un incident de production.",
    goldenRules: [
      "Ne jamais déclencher d'alerte d'astreinte de nuit pour des codes 51 ou 55 (comportement client normal).",
      "Déclencher une alerte critique P1 si le taux de code 91 ou 96 dépasse 3% sur 5 minutes glissantes."
    ],
    pitfallsToAvoid: [
      "Afficher 'Code Erreur 91' sur l'écran du client au GAB : les messages doivent être vulgarisés ('Incident technique momentané, veuillez retirer votre carte')."
    ]
  },

  // --- NIVEAU 2 : TERMINAUX & PROTOCOLES ---
  {
    id: "m_l2_01",
    gradeLevel: 2,
    category: "ATM_POS",
    title: "2.1 Cinématique d'un Retrait GAB (NDC/DDC) & Journal Électronique",
    summary: "Suivez le parcours mécanique et logiciel d'une distribution d'espèces et résolvez les litiges de non-distribution.",
    keyConcepts: ["Protocole NDC / DDC", "Journal Électronique (ATM EJ)", "Capteurs de volet (Shutter)", "Coffre & Cassettes", "Bourrage (Stacker Jam)"],
    detailedContent: `Lors d'un retrait sur un distributeur de billets (GAB/ATM), deux flux opèrent en parallèle :
1. Le flux télécom ISO 8583 : demande 0200 transmise à la banque, vérification du solde et réponse 0210 autorisant le débit.
2. Le flux électromécanique interne (piloté par le protocole NDC ou DDC) :
   - Prélèvement des billets dans les cassettes correspondantes (Pick).
   - Acheminement vers la zone de regroupement (Stack).
   - Contrôle d'épaisseur par capteur double (Double detect) pour s'assurer qu'aucun billet n'est collé.
   - Présentation au client par ouverture du volet (Shutter Open).
   - Sortie des billets par le client (Taken).
Si un bourrage survient avant l'ouverture du volet, les billets restent bloqués à l'intérieur. Le GAB enregistre l'incident dans son Journal Électronique (EJ) et émet un Reversal (0420) pour annuler le débit bancaire.`,
    technicalSample: `Trace du Journal Électronique (ATM EJ) :
14:32:01 CARD INSERTED: PAN 497010******7890
14:32:05 PIN ENTERED
14:32:08 HOST AUTHORIZATION GRANTED: DE39=00
14:32:10 DISPENSE COMMAND: 4 x 10 000 XOF
14:32:12 BILLS PICKED FROM CASSETTE 1: 4 NOTES
14:32:15 HARDWARE ERROR: STACKER JAM IN TRANSPORT MODULE
14:32:16 SHUTTER STATUS: CLOSED (NOT OPENED)
14:32:17 REVERSAL GENERATED: MTI 0420 STAN=123456`,
    explanation: "L'horodatage et la mention 'SHUTTER STATUS: CLOSED' constituent la preuve juridique absolue que le client n'a pas pu toucher les fonds.",
    goldenRules: [
      "Dans tout litige client GAB, le Journal Électronique (EJ) prévaut sur les impressions papier du commerçant ou les déclarations verbales.",
      "Toujours vérifier la balance comptable de la caisse physique du GAB lors du rechargement (cash-out / cash-in)."
    ],
    pitfallsToAvoid: [
      "Rembourser un client sur la seule foi d'une réclamation sans analyser l'EJ : si le journal indique 'NOTES TAKEN BY CUSTOMER', la banque s'exposerait à une fraude avérée."
    ]
  },
  {
    id: "m_l2_02",
    gradeLevel: 2,
    category: "ATM_POS",
    title: "2.2 Annulations & Reversals (0400 / 0420) : Maîtrise des Time-Outs",
    summary: "Garantissez la cohérence financière lorsqu'une transaction est approuvée mais non distribuée.",
    keyConcepts: ["MTI 0400 / 0420 (Reversal)", "STAN (DE11)", "RRN (DE37)", "Time-out Acquéreur (30s)", "Débit fantôme (Ghost Debit)"],
    detailedContent: `Dans une architecture monétique, l'acquéreur envoie une demande 0200 et démarre un chronomètre (généralement 25 à 30 secondes).
Trois scénarios peuvent survenir :
1. Réponse 0210 reçue dans les temps : le terminal distribue les fonds ou valide le ticket.
2. Réponse 0210 reçue avec retard (Time-out expiré) : le terminal refuse le paiement pour le client et envoie immédiatement un avis d'annulation 0420 pour libérer la provision chez l'émetteur.
3. Aucune réponse reçue : le terminal envoie un 0420 pour s'assurer que si l'émetteur a traité la demande en silence, le débit soit immédiatement annulé.
Le message de Reversal reprend obligatoirement le STAN d'origine (DE11), le montant (DE4) et la référence RRN (DE37) pour lettrer l'opération à annuler.`,
    technicalSample: `Demande initiale :
MTI: 0200 | DE11: 456789 | DE4: 000000020000 | DE37: 260920456789
[Attente 30 secondes... Pas de réponse] -> Événement: TIMEOUT ACQUÉREUR

Trame de compensation d'urgence :
MTI: 0420 (Reversal Advice)
DE11: 456789 (Même STAN que la demande)
DE4: 000000020000
DE37: 260920456789
DE39: 00
DE90: 0200456789... (Champs d'identification de la transaction d'origine)`,
    explanation: "Le Reversal est le garant de l'intégrité bilancielle en monétique temps réel. Sans lui, les clients subiraient des débits injustifiés à chaque micro-coupure réseau.",
    goldenRules: [
      "Le switch monétique doit retransmettre le message 0420 en rafale (SAF - Store And Forward) jusqu'à confirmation d'acquittement par l'émetteur.",
      "Le champ DE90 doit obligatoirement être renseigné dans un Reversal pour lier techniquement l'annulation à l'autorisation initiale."
    ],
    pitfallsToAvoid: [
      "Générer un Reversal avec un nouveau STAN différent de l'original : l'émetteur ne pourra pas retrouver la transaction et rejettera l'annulation (erreur 25 - Transaction not found)."
    ]
  },

  // --- NIVEAU 3 : EMV, TLV & CRYPTOGRAMMES ---
  {
    id: "m_l3_01",
    gradeLevel: 3,
    category: "EMV_CARTE",
    title: "3.1 Structure du Champ DE55 & Encodage BER-TLV",
    summary: "Disséquez les données cryptographiques émises par la puce dans la norme Tag-Length-Value.",
    keyConcepts: ["Champ DE55", "Format BER-TLV", "Tag 9F26 (ARQC)", "Tag 95 (TVR)", "Tag 9F36 (ATC)", "Tag 9F10 (Issuer Data)"],
    detailedContent: `Le champ DE55 d'une trame ISO 8583 transporte les données générées par le microprocesseur de la carte bancaire.
Chaque élément suit la norme BER-TLV (Tag - Longueur - Valeur) :
- Tag : Identifiant hexadécimal sur 1 ou 2 octets (ex: 9F26 = Application Cryptogram, 95 = Terminal Verification Results).
- Longueur : Taille des données qui suivent, codée sur 1 ou 2 octets (ex: 08 = 8 octets, soit 16 caractères hexadécimaux).
- Valeur : Charge utile binaire.
Tags vitaux dans une transaction EMV :
- 9F26 (8 octets) : L'Application Cryptogram (ARQC en ligne).
- 95 (5 octets) : Le TVR (Registre des contrôles de sécurité effectués par le terminal).
- 9F36 (2 octets) : L'ATC (Application Transaction Counter, incrémenté à chaque paiement).
- 9F37 (4 octets) : L'Unpredictable Number (Nombre aléatoire généré par le terminal pour empêcher le rejeu de transaction).`,
    technicalSample: `Trame DE55 brute :
9F26 08 4D5E12F9884511A2  -> Tag 9F26 (Cryptogramme), Longueur 8, Valeur 4D5E12F9884511A2
9F27 01 80                -> Tag 9F27 (Cryptogram Info Data), Longueur 1, Valeur 80 (Demande ARQC en ligne)
95   05 0000000000        -> Tag 95 (TVR), Longueur 5, Aucun risque détecté
9F36 02 005A              -> Tag 9F36 (ATC), Longueur 2, Transaction n° 90 de la carte`,
    explanation: "Grâce à l'ATC et à l'Unpredictable Number, chaque cryptogramme généré par la puce est mathématiquement unique au monde : copier les données ne permet aucunement de reproduire un paiement valide.",
    goldenRules: [
      "Dans le champ DE55, l'ordre des tags TLV n'est pas fixe : le parseur logiciel doit inspecter dynamiquement chaque tag et sa longueur.",
      "Le tag 9F27 indique le type de cryptogramme : 80 = ARQC (autorisation en ligne), 40 = TC (approuvé hors ligne), 00 = AAC (rejeté hors ligne)."
    ],
    pitfallsToAvoid: [
      "Tronquer le champ DE55 dans la base de données : si un tag est coupé, le HSM hôte refusera de vérifier le cryptogramme de la transaction."
    ]
  },
  {
    id: "m_l3_02",
    gradeLevel: 3,
    category: "EMV_CARTE",
    title: "3.2 Analyse Forensique du Registre TVR (Tag 95) & TSI (Tag 9B)",
    summary: "Décodez bit-à-bit les décisions prises par le terminal : PIN erroné, forçage hors-ligne ou carte blacklistée.",
    keyConcepts: ["Tag 95 (TVR - 5 octets)", "Tag 9B (TSI - 2 octets)", "Offline Data Authentication (SDA/DDA/CDA)", "Cardholder Verification (CVM)", "Floor Limit"],
    detailedContent: `Le TVR (Terminal Verification Results - Tag 95) est composé de 5 octets représentant 40 drapeaux (flags) binaires. Il documente l'historique complet de la transaction physique :
- Octet 1 (Authentification des données carte) :
  * Bit 7 : L'authentification hors ligne (Offline Data Authentication) n'a pas été effectuée.
  * Bit 6 : Échec de l'authentification SDA (Static Data Authentication).
  * Bit 4 : Données de la carte corrompues ou numéro de version de l'application non supporté.
- Octet 2 (Contrôle du porteur - CVM) :
  * Bit 8 : Le CVM (Cardholder Verification Method) a échoué.
  * Bit 7 : PIN pad du terminal en panne ou absent.
  * Bit 6 : Nombre maximum d'essais de code PIN dépassé (PIN Try Limit Exceeded).
- Octet 3 (Gestion du risque terminal) :
  * Bit 8 : Montant supérieur au plafond hors-ligne (Floor Limit Exceeded).
  * Bit 7 : Transaction sélectionnée au hasard pour vérification en ligne (Random Online Selection).
- Octet 4 (Contrôles de dates et application) :
  * Bit 8 : Transaction effectuée avant la date de début de validité de la carte.
  * Bit 7 : Carte expirée (Expired Application).`,
    technicalSample: `Exemple d'analyse d'un TVR anormal :
Hexadécimal : "00 40 80 40 00"
Binaire décomposé :
- Octet 1: 00 (Authentification puce réussie)
- Octet 2: 40 (0100 0000 -> Bit 7 à 1 : PIN Try Limit Exceeded - Client bloqué sur mauvais PIN)
- Octet 3: 80 (1000 0000 -> Bit 8 à 1 : Plafond Floor Limit dépassé)
- Octet 4: 40 (0100 0000 -> Bit 7 à 1 : Application expirée)
Verdict automatique du moteur : FORÇAGE FRAUDULEUX D'UNE CARTE PÉRIMÉE SUR CODE PIN ÉPUISÉ.`,
    explanation: "Le décodage du TVR permet de connaître exactement les raisons d'un incident sans avoir besoin d'interroger physiquement le porteur ou le commerçant.",
    goldenRules: [
      "Un TVR à '0000000000' atteste que tous les contrôles de sécurité terminaux se sont déroulés sans aucune anomalie.",
      "Le bit 'PIN Try Limit Exceeded' (Octet 2, Bit 6) justifie légalement la capture physique de la carte par le GAB."
    ],
    pitfallsToAvoid: [
      "Traiter le TVR comme un nombre entier : le TVR est un masque de bits strict où chaque position a une signification juridique indépendante."
    ]
  },

  // --- NIVEAU 4 : SÉCURITÉ & HSM ---
  {
    id: "m_l4_01",
    gradeLevel: 4,
    category: "HSM_SECURITE",
    title: "4.1 Hiérarchie des Clés Cryptographiques & Module HSM",
    summary: "Maîtrisez les clés maîtresses LMK, ZMK, ZPK, PVK et comprenez pourquoi aucune clé ne circule jamais en clair.",
    keyConcepts: ["HSM (Hardware Security Module)", "LMK (Local Master Key)", "ZMK (Zone Master Key)", "ZPK (Zone PIN Key)", "PVK (PIN Verification Key)", "CVK (Card Verification Key)"],
    detailedContent: `La sécurité bancaire repose sur un principe absolu : les clés cryptographiques et les codes PIN ne doivent JAMAIS apparaître en clair dans la mémoire d'un serveur informatique standard.
Toutes les opérations sensibles sont déléguées à un boîtier inviolable : le HSM (Hardware Security Module).
Hiérarchie des clés en monétique :
1. LMK (Local Master Key) : clé maîtresse propre au HSM. Toutes les autres clés stockées dans le système hôte sont chiffrées sous la LMK (Cryptogramme de clé).
2. ZMK (Zone Master Key) : clé d'échange partagée entre deux entités bancaires (ex: Switch et Banque). Elle sert uniquement à transporter de nouvelles clés.
3. ZPK (Zone PIN Key) : clé de session servant à chiffrer le PIN Block entre le terminal/switch et le serveur d'autorisation.
4. PVK (PIN Verification Key) : paire de clés détenue par la banque émettrice pour calculer l'Offset de PIN ou vérifier la valeur de référence stockée en base.
5. CVK (Card Verification Key) : clé servant à générer et vérifier les codes CVV1 (piste magnétique) et CVV2 (3 chiffres au dos de la carte).`,
    technicalSample: `Architecture d'échange de clés :
1. Échange physique : 2 ou 3 dépositaires entrent les composantes de la ZMK sur la console du HSM.
2. Échange dynamique : Le switch génère une nouvelle ZPK, la chiffre sous la ZMK et l'envoie par trame réseau 0800.
3. Réception par la banque :
   - Ordre au HSM : Commande "Translate ZPK from ZMK to LMK"
   - Résultat en base : La ZPK est désormais stockée chiffrée sous la LMK de la banque.`,
    explanation: "Si un pirate copie l'intégralité du disque dur d'un serveur monétique, il ne trouve que des cryptogrammes indéchiffrables sans la LMK physique enfermée dans le HSM.",
    goldenRules: [
      "Les clés maîtresses (LMK/ZMK) doivent toujours être gérées sous le principe de la double ou triple garde (Split Knowledge / Dual Control).",
      "Une clé ZPK doit être renouvelée périodiquement (tous les jours ou à chaque démarrage de session 0800)."
    ],
    pitfallsToAvoid: [
      "Afficher une clé ou un PIN Block dans les fichiers de logs applicatifs : violation grave de la norme internationale PCI-DSS passible du retrait de l'agrément bancaire."
    ]
  },
  {
    id: "m_l4_02",
    gradeLevel: 4,
    category: "HSM_SECURITE",
    title: "4.2 Encodage du PIN Block (ISO-0) & Translation en HSM",
    summary: "Calculez le XOR entre le PIN et le PAN, et comprenez la commande de translation de zone ZPK -> LMK/PVK.",
    keyConcepts: ["PIN Block ISO-0 (Format 0 / ANSI X9.8)", "Opération XOR", "Translation de PIN", "Commande Thales CC / CA", "Offset de PIN"],
    detailedContent: `Le code confidentiel (PIN) ne voyage jamais seul : il est encapsulé dans un bloc de 16 caractères hexadécimaux (8 octets) appelé PIN Block.
Format le plus utilisé au monde : ISO Format 0 (ANSI X9.8) :
- Bloc 1 (PIN encapsulé) : 0 | L | P | P | P | P | F | F | F | F | F | F | F | F | F | F
  (0 = indicateur de format, L = Longueur du PIN [ex: 4], P = chiffres du PIN, F = Padding hexadécimal).
- Bloc 2 (PAN encapsulé) : 0 | 0 | 0 | 0 | 12 chiffres de droite du PAN (hors clé de Luhn).
- PIN Block Résultant = Bloc 1 XOR Bloc 2.
Translation en cours de route :
Lorsqu'un acquéreur transmet une transaction à l'émetteur via un switch :
- Le PIN arrive chiffré sous la ZPK Acquéreur.
- Le Switch le transmet au HSM qui le déchiffre sous la ZPK Acquéreur et le rechiffre immédiatement sous la ZPK Émetteur à l'intérieur de sa puce sécurisée, sans JAMAIS laisser le PIN en clair dans la mémoire du serveur.`,
    technicalSample: `Exemple de calcul PIN Block ISO-0 :
PIN: 1234  |  PAN: 4970 1012 3456 7890
- Bloc 1 : 041234FFFFFFFFFF
- Bloc 2 : 0000012345678900 (Les 12 chiffres avant le dernier "0")
- XOR mathématique :
    041234FFFFFFFFFF
  ^ 0000012345678900
  ------------------
  = 041235DCBA9876FF  -> Chiffré ensuite sous la clé 3DES ZPK.`,
    explanation: "Grâce au XOR avec le numéro de compte (PAN), deux clients ayant le même code secret 1234 auront des PIN Blocks chiffrés totalement différents, empêchant les attaques par dictionnaire.",
    goldenRules: [
      "Ne jamais réutiliser le même PAN dans un test de validation sans recalculer le PIN Block.",
      "La translation de PIN Block est la seule fonction cryptographique autorisée à manipuler un PIN entre deux réseaux bancaires."
    ],
    pitfallsToAvoid: [
      "Tenter de déchiffrer un PIN Block par programme : seul le HSM bancaire certifié FIPS 140-2 dispose des droits d'exécution nécessaires."
    ]
  },

  // --- NIVEAU 5 : CLEARING & RAPPROCHEMENT ---
  {
    id: "m_l5_01",
    gradeLevel: 5,
    category: "CLEARING_COMPENSATION",
    title: "5.1 Fichiers de Compensation (Visa Base II / IPM) & Cycles de Règlement",
    summary: "Passez de l'autorisation temps réel au règlement financier effectif entre banques centrales.",
    keyConcepts: ["Clearing vs Settlement", "Fichier Base II (Visa)", "Fichier IPM (Mastercard)", "Interchange Fee", "Compte Nostro / Vostro"],
    detailedContent: `Une transaction monétique comporte deux temps majeurs :
1. L'Autorisation (Online, temps réel) : vérifie la provision et bloque le montant sous forme d'empreinte financière.
2. La Compensation & Règlement (Clearing & Settlement, différé en batch) :
   - En fin de journée, l'acquéreur envoie son fichier de télécollecte au scheme (Visa Base II ou Mastercard IPM).
   - Le scheme rapproche les transactions, calcule les commissions d'interchange (Interchange Fee dues à l'émetteur pour la couverture du risque) et convertit les devises au cours officiel du jour.
   - Le Règlement financier (Settlement) s'opère par virement brut ou net entre les comptes Nostro des banques auprès de la banque centrale (BCEAO, BEAC, Fed).`,
    technicalSample: `Ligne de fichier de compensation Visa Base II (Format TC05 / TCE) :
05 (Code Transaction: Achat)
4970101234567890 (PAN)
000000050000 (Montant: 500.00 XOF)
952 (Devise)
0920 (Date transaction)
123456 (Numéro d'autorisation d'origine)
000000001250 (Commission d'interchange: 12.50 XOF reversée à l'émetteur)`,
    explanation: "Une banque peut afficher 10 000 autorisations par jour, mais tant que les fichiers de clearing ne sont pas intégrés et réglés, aucun euro ou franc CFA n'a transité d'une banque à l'autre.",
    goldenRules: [
      "Les écarts entre l'autorisation temps réel (0200) et le fichier de clearing doivent être tracés en compte d'attente d'ajustement monétique.",
      "Ne jamais comptabiliser deux fois une transaction : le fichier de clearing confirme et solde l'écriture d'autorisation préalable."
    ],
    pitfallsToAvoid: [
      "Confondre la date d'autorisation (date locale client) et la date de valeur comptable de compensation (Settlement Date)."
    ]
  },
  {
    id: "m_l5_02",
    gradeLevel: 5,
    category: "CLEARING_COMPENSATION",
    title: "5.2 Gestion des Impayés, Litiges (Chargebacks) & Arbitrage Schemes",
    summary: "Maîtrisez les procédures de contestation de débit : Reason Codes, délais réglementaires et réimputations.",
    keyConcepts: ["Chargeback", "Reason Codes (Visa / MC)", "Représentation (Re-presentment)", "Pré-arbitrage & Arbitrage", "Compte de litige monétique"],
    detailedContent: `Lorsqu'un porteur conteste un débit sur son relevé (fraude, carte clonée, marchand n'ayant pas délivré le bien ou retrait GAB non perçu), la banque émettrice déclenche la procédure d'impayé (Chargeback) :
1. Premier Chargeback (First Chargeback) : L'émetteur débite d'office l'acquéreur via le switch avec un code motif normé (ex: Visa 10.4 pour Fraude EMV, 13.1 pour Non-délivrance).
2. Représentation (Second Presentment) : L'acquéreur dispose d'un délai (30 à 45 jours) pour fournir les preuves tangibles (bon de livraison signé, reçu EMV avec cryptogramme TC valide).
3. Pré-arbitrage : Si le litige persiste, la partie lésée engage une négociation encadrée.
4. Arbitrage officiel du Scheme : Les juristes de Visa ou Mastercard tranchent définitivement le dossier. La partie perdante supporte le montant du litige plus des frais d'arbitrage élevés (généralement 500 $).`,
    technicalSample: `Cycle de vie d'un dossier de chargeback :
Jour J : Retrait contesté par le porteur (50 000 XOF).
J+2 : Émission du First Chargeback Reason Code 4834/10.4.
      Écriture CBS : Débit compte Acquéreur / Crédit compte d'attente client.
J+25 : Réception de la Représentation acquéreur avec l'ATM EJ montrant "BILLS TAKEN".
J+28 : Émetteur constate la preuve irréfutable -> Clôture du dossier et redébit du porteur.`,
    explanation: "La maîtrise des Reason Codes et des délais calendaires de contestation est déterminante pour éviter que la banque ne subisse des pertes sèches sur les fraudes porteurs.",
    goldenRules: [
      "Toujours vérifier la présence d'un cryptogramme TC (Transaction Certificate) dans les preuves fournies : il prouve que la puce a physiquement validé la transaction.",
      "Respecter scrupuleusement la limite réglementaire de 120 jours calendaires pour initier un chargeback auprès du switch."
    ],
    pitfallsToAvoid: [
      "Engager une procédure d'arbitrage sans dossier solide : les frais de pénalité de 500 $ dépassent souvent la valeur marchande du litige initial !"
    ]
  }
];
