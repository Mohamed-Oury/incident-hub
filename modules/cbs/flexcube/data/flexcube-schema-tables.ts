// modules/cbs/flexcube/data/flexcube-schema-tables.ts
import { FlexcubeTableDefinition } from "../types";

export const FLEXCUBE_SCHEMA_TABLES: FlexcubeTableDefinition[] = [
  // --- MODULE ST (Static Maintenance) ---
  {
    tableName: "STTM_CUSTOMER",
    module: "ST",
    description: "Référentiel central des tiers et clients de la banque (Particuliers, Entreprises, Institutions).",
    primaryKey: ["CUSTOMER_NO"],
    businessRole: "Enregistrement unique du client, statut KYC, pays de résidence, secteur institutionnel et gel réglementaire.",
    indexingAdvice: "Index unique sur CUSTOMER_NO. Index non-unique sur EXT_REF_NO et UNIQUE_ID_VALUE.",
    keyColumns: [
      { name: "CUSTOMER_NO", type: "VARCHAR2(9)", nullable: false, description: "Numéro interne unique du client CIF" },
      { name: "CUSTOMER_TYPE", type: "CHAR(1)", nullable: false, description: "Type de tiers: I (Individu), C (Corporate), B (Banque)" },
      { name: "SHORT_NAME", type: "VARCHAR2(20)", nullable: false, description: "Identifiant court / raison sociale abrégée" },
      { name: "CUSTOMER_NAME1", type: "VARCHAR2(105)", nullable: false, description: "Nom patronymique officiel ou raison sociale complète" },
      { name: "RECORD_STAT", type: "CHAR(1)", nullable: false, description: "Statut de fiche: O (Open), C (Closed)" },
      { name: "AUTH_STAT", type: "CHAR(1)", nullable: false, description: "Statut d autorisation: A (Authorized), U (Unauthorized)" },
      { name: "FROZEN", type: "CHAR(1)", nullable: true, description: "Indicateur de blocage global du client (Y/N)" },
      { name: "DECEASED", type: "CHAR(1)", nullable: true, description: "Indicateur client décédé (Y/N)" }
    ]
  },
  {
    tableName: "STTM_CUST_ACCOUNT",
    module: "ST",
    description: "Table maîtresse des comptes clients bancaires (Comptes Courants, Épargne, Dépôts).",
    primaryKey: ["BRANCH_CODE", "CUST_AC_NO"],
    businessRole: "Porte le paramétrage du compte, la classe de compte, la devise, les restrictions de débit/crédit et les liaisons agence.",
    indexingAdvice: "Index primaire sur (BRANCH_CODE, CUST_AC_NO). Index essentiel sur (CUST_NO, CCY).",
    keyColumns: [
      { name: "BRANCH_CODE", type: "VARCHAR2(3)", nullable: false, description: "Code agence domiciliataire du compte" },
      { name: "CUST_AC_NO", type: "VARCHAR2(20)", nullable: false, description: "Numéro de compte client (RIB / BBAN)" },
      { name: "CUST_NO", type: "VARCHAR2(9)", nullable: false, description: "Code client titulaire CIF (STTM_CUSTOMER)" },
      { name: "CCY", type: "VARCHAR2(3)", nullable: false, description: "Code devise ISO du compte (ex: XOF, EUR, USD)" },
      { name: "ACCOUNT_CLASS", type: "VARCHAR2(6)", nullable: false, description: "Classe de compte produit (ex: CURR, SAVG)" },
      { name: "AC_STAT_NO_DR", type: "CHAR(1)", nullable: true, description: "Interdiction de débit (Y/N - Gel compte)" },
      { name: "AC_STAT_NO_CR", type: "CHAR(1)", nullable: true, description: "Interdiction de crédit (Y/N)" },
      { name: "AC_STAT_FROZEN", type: "CHAR(1)", nullable: true, description: "Compte bloqué juridiquement ou administrativement" },
      { name: "RECORD_STAT", type: "CHAR(1)", nullable: false, description: "Statut d enregistrement (O=Open, C=Closed)" },
      { name: "AUTH_STAT", type: "CHAR(1)", nullable: false, description: "Statut de validation (A=Authorisé, U=En attente)" }
    ]
  },
  {
    tableName: "STTM_BRANCH",
    module: "ST",
    description: "Configuration des agences du réseau bancaire, codes guichets et calendriers comptables.",
    primaryKey: ["BRANCH_CODE"],
    businessRole: "Définit les agences physiques, la devise de reporting local et la date de valeur système.",
    keyColumns: [
      { name: "BRANCH_CODE", type: "VARCHAR2(3)", nullable: false, description: "Identifiant code agence 3 caractères" },
      { name: "BRANCH_NAME", type: "VARCHAR2(35)", nullable: false, description: "Dénomination de l agence" },
      { name: "BRANCH_LCY", type: "VARCHAR2(3)", nullable: false, description: "Devise locale de l agence (LCY)" },
      { name: "RECORD_STAT", type: "CHAR(1)", nullable: false, description: "O=Open, C=Closed" }
    ]
  },
  {
    tableName: "CYTM_RATES",
    module: "ST",
    description: "Table des cours de change des devises (Achat, Vente, Mid, Taux officiel banque centrale).",
    primaryKey: ["BRANCH_CODE", "CCY1", "CCY2", "RATE_TYPE"],
    businessRole: "Alimente le module de conversion FX temps réel et les réévaluations de clôture AEOD.",
    keyColumns: [
      { name: "BRANCH_CODE", type: "VARCHAR2(3)", nullable: false, description: "Code agence appliquant le cours" },
      { name: "CCY1", type: "VARCHAR2(3)", nullable: false, description: "Devise de base" },
      { name: "CCY2", type: "VARCHAR2(3)", nullable: false, description: "Devise de cotation" },
      { name: "RATE_TYPE", type: "VARCHAR2(8)", nullable: false, description: "Type de cours (STANDARD, SPOT, CASH)" },
      { name: "MID_RATE", type: "NUMBER(24,12)", nullable: false, description: "Taux moyen calculé" }
    ]
  },
  {
    tableName: "STTM_ACCOUNT_CLASS",
    module: "ST",
    description: "Définition des classes de produits comptes (règles de solde minimum, agios, relevés).",
    primaryKey: ["ACCOUNT_CLASS"],
    businessRole: "Gabarit technique hérité par chaque compte client rattaché.",
    keyColumns: [
      { name: "ACCOUNT_CLASS", type: "VARCHAR2(6)", nullable: false, description: "Code de la classe de compte" },
      { name: "DESCRIPTION", type: "VARCHAR2(35)", nullable: false, description: "Libellé de la classe" },
      { name: "AC_CLASS_TYPE", type: "CHAR(1)", nullable: false, description: "C=Current, S=Savings, D=Deposit" }
    ]
  },

  // --- MODULE AC (Accounting & Daily Entries) ---
  {
    tableName: "ACTB_DAILY_LOG",
    module: "AC",
    description: "Journal central des écritures comptables de la journée en cours avant déversement GL.",
    primaryKey: ["AC_ENTRY_SR_NO"],
    businessRole: "Enregistre chaque mouvement Débit ou Crédit généré par les transactions guichet, virements, monétique ou batch.",
    indexingAdvice: "Index partitionné par BRANCH_CODE et VALUE_DATE. Index haute performance sur (AC_NO, VALUE_DATE).",
    keyColumns: [
      { name: "AC_ENTRY_SR_NO", type: "NUMBER", nullable: false, description: "Numéro de séquence unique d écriture comptable" },
      { name: "AC_BRANCH", type: "VARCHAR2(3)", nullable: false, description: "Agence du compte mouvementé" },
      { name: "AC_NO", type: "VARCHAR2(20)", nullable: false, description: "Numéro de compte client ou compte GL débité/crédité" },
      { name: "AC_CCY", type: "VARCHAR2(3)", nullable: false, description: "Devise de l opération" },
      { name: "DRCR_IND", type: "CHAR(1)", nullable: false, description: "Sens comptable : D (Débit) ou C (Crédit)" },
      { name: "LCY_AMOUNT", type: "NUMBER(22,3)", nullable: false, description: "Montant équivalent en devise locale agence" },
      { name: "FCY_AMOUNT", type: "NUMBER(22,3)", nullable: true, description: "Montant en devise étrangère (si compte devises)" },
      { name: "TRN_CODE", type: "VARCHAR2(3)", nullable: false, description: "Code transaction métier (ex: 001 Retrait, 020 Virement)" },
      { name: "VALUE_DATE", type: "DATE", nullable: false, description: "Date de valeur de l écriture" },
      { name: "BOOKING_DATE", type: "DATE", nullable: false, description: "Date comptable système d enregistrement" },
      { name: "MODULE", type: "VARCHAR2(2)", nullable: false, description: "Module émetteur (ST, FT, CL, DE, GW)" }
    ]
  },
  {
    tableName: "ACVW_ALL_AC_ENTRIES",
    module: "AC",
    description: "Vue unifiée des mouvements comptables combinant la journée courante (ACTB_DAILY_LOG) et l historique archivé.",
    primaryKey: ["AC_ENTRY_SR_NO"],
    businessRole: "Utilisée pour les extraits de compte client, consultations solde et audits de transactions.",
    keyColumns: [
      { name: "AC_ENTRY_SR_NO", type: "NUMBER", nullable: false, description: "Identifiant d écriture" },
      { name: "AC_NO", type: "VARCHAR2(20)", nullable: false, description: "Numéro de compte" },
      { name: "DRCR_IND", type: "CHAR(1)", nullable: false, description: "D/C" },
      { name: "LCY_AMOUNT", type: "NUMBER(22,3)", nullable: false, description: "Montant LCY" },
      { name: "VALUE_DATE", type: "DATE", nullable: false, description: "Date de valeur" }
    ]
  },
  {
    tableName: "ACTB_ACCBAL_HISTORY",
    module: "AC",
    description: "Historique des soldes de clôture journalière par compte client et date comptable.",
    primaryKey: ["BRANCH_CODE", "ACCOUNT_NUMBER", "BAL_DATE"],
    businessRole: "Permet la restitution des échelles d intérêts, soldes moyens et attestations de solde à date passée.",
    keyColumns: [
      { name: "BRANCH_CODE", type: "VARCHAR2(3)", nullable: false, description: "Code agence" },
      { name: "ACCOUNT_NUMBER", type: "VARCHAR2(20)", nullable: false, description: "Numéro de compte client" },
      { name: "BAL_DATE", type: "DATE", nullable: false, description: "Date de solde arrêté" },
      { name: "CLOSING_BAL", type: "NUMBER(22,3)", nullable: false, description: "Solde comptable de clôture" }
    ]
  },

  // --- MODULE GL (General Ledger) ---
  {
    tableName: "GLTB_GL_BALANCES",
    module: "GL",
    description: "Table des balances et cumuls des comptes du Grand Livre général.",
    primaryKey: ["BRANCH_CODE", "GL_CODE", "CCY_CODE", "FIN_YEAR", "PERIOD_CODE"],
    businessRole: "Fournit les soldes comptables synthétiques pour l arrêt de bilan, compte de résultat et ratios prudentiels.",
    keyColumns: [
      { name: "BRANCH_CODE", type: "VARCHAR2(3)", nullable: false, description: "Agence" },
      { name: "GL_CODE", type: "VARCHAR2(9)", nullable: false, description: "Code compte Grand Livre (ex: 101000000 Caisse)" },
      { name: "CCY_CODE", type: "VARCHAR2(3)", nullable: false, description: "Devise du solde GL" },
      { name: "CR_BAL_LCY", type: "NUMBER(22,3)", nullable: false, description: "Cumul Crédit en devise locale" },
      { name: "DR_BAL_LCY", type: "NUMBER(22,3)", nullable: false, description: "Cumul Débit en devise locale" }
    ]
  },
  {
    tableName: "GLTM_GLMASTER",
    module: "GL",
    description: "Plan de comptes général de la banque sous Oracle FLEXCUBE.",
    primaryKey: ["GL_CODE"],
    businessRole: "Hiérarchie des comptes de bilan et hors-bilan, classification actif/passif/charges/produits.",
    keyColumns: [
      { name: "GL_CODE", type: "VARCHAR2(9)", nullable: false, description: "Identifiant compte Grand Livre" },
      { name: "GL_DESC", type: "VARCHAR2(105)", nullable: false, description: "Libellé officiel du compte de GL" },
      { name: "CATEGORY", type: "CHAR(1)", nullable: false, description: "1=Actif, 2=Passif, 3=Charges, 4=Produits, 5=Hors-bilan" }
    ]
  },

  // --- MODULE FT (Funds Transfer) ---
  {
    tableName: "FTTB_CONTRACT_MASTER",
    module: "FT",
    description: "Contrats de virements de fonds nationaux, régionaux et internationaux (SWIFT/RTGS).",
    primaryKey: ["CONTRACT_REF_NO"],
    businessRole: "Cycle de vie d un ordre de transfert : saisie, contrôle provision, validation, émission message SWIFT MT103/PACS008.",
    keyColumns: [
      { name: "CONTRACT_REF_NO", type: "VARCHAR2(16)", nullable: false, description: "Référence unique du contrat de virement" },
      { name: "PRODUCT_CODE", type: "VARCHAR2(4)", nullable: false, description: "Produit de transfert (ex: OTIS, OTNN)" },
      { name: "DR_ACCOUNT", type: "VARCHAR2(20)", nullable: false, description: "Compte donneur d ordre débité" },
      { name: "CR_ACCOUNT", type: "VARCHAR2(20)", nullable: false, description: "Compte bénéficiaire ou compte Nostro crédité" },
      { name: "TRANSFER_AMOUNT", type: "NUMBER(22,3)", nullable: false, description: "Montant principal transféré" },
      { name: "CONTRACT_STATUS", type: "CHAR(1)", nullable: false, description: "A=Actif, L=Liquidé, R=Rejeté, H=Hold" }
    ]
  },

  // --- MODULE CL (Consumer Lending / Crédits) ---
  {
    tableName: "CLTB_ACCOUNT_MASTER",
    module: "CL",
    description: "Dossiers de prêts, découverts autorisés et crédits à la consommation / corporate.",
    primaryKey: ["BRANCH_CODE", "ACCOUNT_NUMBER"],
    businessRole: "Porte le capital emprunté, le barème de taux d intérêt, la périodicité d amortissement et les impayés.",
    keyColumns: [
      { name: "BRANCH_CODE", type: "VARCHAR2(3)", nullable: false, description: "Agence prêteuse" },
      { name: "ACCOUNT_NUMBER", type: "VARCHAR2(20)", nullable: false, description: "Identifiant contrat de prêt" },
      { name: "CUSTOMER_ID", type: "VARCHAR2(9)", nullable: false, description: "Emprunteur principal" },
      { name: "AMOUNT_FINANCED", type: "NUMBER(22,3)", nullable: false, description: "Capital octroyé" },
      { name: "ACCOUNT_STATUS", type: "VARCHAR2(4)", nullable: false, description: "NORM=Normal, PAST=Arriéré, DUBT=Douteux" }
    ]
  },
  {
    tableName: "CLTB_ACCOUNT_SCHEDULES",
    module: "CL",
    description: "Tableau d amortissement prévisionnel et réel de chaque échéance de crédit.",
    primaryKey: ["BRANCH_CODE", "ACCOUNT_NUMBER", "SCHEDULE_DATE", "COMPONENT_NAME"],
    businessRole: "Pilote les prélèvements automatiques lors de la clôture AEOD (part de capital et part d intérêts).",
    keyColumns: [
      { name: "SCHEDULE_DATE", type: "DATE", nullable: false, description: "Date d échéance" },
      { name: "COMPONENT_NAME", type: "VARCHAR2(10)", nullable: false, description: "Composant : PRINCIPAL, MAIN_INT, PENALTY" },
      { name: "AMOUNT_DUE", type: "NUMBER(22,3)", nullable: false, description: "Montant exigible" },
      { name: "AMOUNT_SETTLED", type: "NUMBER(22,3)", nullable: false, description: "Montant déjà recouvré" }
    ]
  },

  // --- MODULE AEOD (Automated End of Day) ---
  {
    tableName: "AETB_PROCESS_PROGRESS",
    module: "AEOD",
    description: "Surveillance et monitoring temps réel de l exécution de la chaîne batch nocturne AEOD.",
    primaryKey: ["BRANCH_CODE", "EOD_DATE", "PROCESS_NAME"],
    businessRole: "Enregistre l heure de début, de fin, le statut (W=Working, S=Success, F=Failed) et les erreurs bloquantes de clôture.",
    keyColumns: [
      { name: "BRANCH_CODE", type: "VARCHAR2(3)", nullable: false, description: "Agence en cours d arrêté" },
      { name: "EOD_DATE", type: "DATE", nullable: false, description: "Journée comptable clôturée" },
      { name: "PROCESS_NAME", type: "VARCHAR2(30)", nullable: false, description: "Nom du programme batch (ex: AC_EOD, CL_BATCH)" },
      { name: "STAGE", type: "VARCHAR2(10)", nullable: false, description: "Étape AEOD : EOTI, EOFI, EOD, BOD" },
      { name: "STATUS", type: "CHAR(1)", nullable: false, description: "W=En cours, S=Terminé avec succès, F=En échec" },
      { name: "ERROR_CODE", type: "VARCHAR2(15)", nullable: true, description: "Code incident SGBD ou applicatif" }
    ]
  },
  {
    tableName: "EOTB_PROGRAM_MASTER",
    module: "AEOD",
    description: "Ordonnanceur officiel des programmes batch exécutés dans chaque phase AEOD.",
    primaryKey: ["PROGRAM_NAME"],
    businessRole: "Définit les dépendances et l ordre séquentiel de lancement des batchs nocturnes.",
    keyColumns: [
      { name: "PROGRAM_NAME", type: "VARCHAR2(30)", nullable: false, description: "Nom du package/job PL/SQL exécuté" },
      { name: "PHASE", type: "VARCHAR2(10)", nullable: false, description: "Phase d exécution (PEOD, EOTI, EOFI, EOD, BOD)" },
      { name: "SEQUENCE_NO", type: "NUMBER(4)", nullable: false, description: "Ordre séquentiel de lancement" }
    ]
  },

  // --- MODULE GW (Gateway & Interfaces Monétiques) ---
  {
    tableName: "GWTM_GATEWAY_PARAM",
    module: "GW",
    description: "Paramétrage des canaux et passerelles d échange temps réel (Switch Monétique GAB/TPE, E-Banking, API).",
    primaryKey: ["SOURCE_CODE"],
    businessRole: "Définit les règles d authentification, timeouts de réponse et transformation de messages externes.",
    keyColumns: [
      { name: "SOURCE_CODE", type: "VARCHAR2(15)", nullable: false, description: "Identifiant du canal externe (ex: SWITCH_ATM, MOBILE_APP)" },
      { name: "SERVICE_NAME", type: "VARCHAR2(30)", nullable: false, description: "Service web FCUBS exposé" },
      { name: "LOG_ORIGINAL_MSG", type: "CHAR(1)", nullable: false, description: "Indicateur d archivage des messages bruts (Y/N)" }
    ]
  }
];
