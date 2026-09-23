// modules/cbs/cbs-amplitude-full-dictionary.ts
import { CbsTableDefinition } from "./cbs-advanced-data";

export const CBS_EXTENDED_DICTIONARY: CbsTableDefinition[] = [
  {
    tableName: "BKCAR_PORT",
    module: "Monétique & Cartes",
    description: "Porteurs de cartes, PIN offset et paramètres de personnalisation EMV.",
    primaryKey: ["NUM_CARTE"],
    foreignKeys: [],
    columns: [
      { name: "NUM_CARTE", type: "VARCHAR2(19)", description: "Champ NUM_CARTE pour BKCAR_PORT" },
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKCAR_PORT" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKCAR_PORT" },
      { name: "CLI", type: "VARCHAR2(15)", description: "Champ CLI pour BKCAR_PORT" },
      { name: "PIN_OFF", type: "VARCHAR2(16)", description: "Champ PIN_OFF pour BKCAR_PORT" },
      { name: "PVKI", type: "VARCHAR2(1)", description: "Champ PVKI pour BKCAR_PORT" },
      { name: "STATUT", type: "VARCHAR2(2)", description: "Champ STATUT pour BKCAR_PORT" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_PORT WHERE NUM_CARTE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_PORT du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAR_BIN",
    module: "Monétique & Cartes",
    description: "Plages de BIN bancaires et tables de routage interbancaire.",
    primaryKey: ["BIN_START"],
    foreignKeys: [],
    columns: [
      { name: "BIN_START", type: "VARCHAR2(8)", description: "Champ BIN_START pour BKCAR_BIN" },
      { name: "BIN_END", type: "VARCHAR2(8)", description: "Champ BIN_END pour BKCAR_BIN" },
      { name: "RESEAU", type: "VARCHAR2(10)", description: "Champ RESEAU pour BKCAR_BIN" },
      { name: "TYPE_CARTE", type: "VARCHAR2(10)", description: "Champ TYPE_CARTE pour BKCAR_BIN" },
      { name: "PAYS", type: "VARCHAR2(3)", description: "Champ PAYS pour BKCAR_BIN" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_BIN WHERE BIN_START IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_BIN du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAR_OPPO",
    module: "Monétique & Cartes",
    description: "Journal des mises en opposition cartes (perte, vol, fraude).",
    primaryKey: ["NUM_CARTE", "DCO_OPPO"],
    foreignKeys: [],
    columns: [
      { name: "NUM_CARTE", type: "VARCHAR2(19)", description: "Champ NUM_CARTE pour BKCAR_OPPO" },
      { name: "DCO_OPPO", type: "DATE", description: "Champ DCO_OPPO pour BKCAR_OPPO" },
      { name: "MOTIF", type: "VARCHAR2(3)", description: "Champ MOTIF pour BKCAR_OPPO" },
      { name: "UTI", type: "VARCHAR2(10)", description: "Champ UTI pour BKCAR_OPPO" },
      { name: "STATUT_DIFF", type: "VARCHAR2(1)", description: "Champ STATUT_DIFF pour BKCAR_OPPO" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_OPPO WHERE NUM_CARTE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_OPPO du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAR_PLAF",
    module: "Monétique & Cartes",
    description: "Plafonds de retrait GAB et paiement TPE par profil porteur.",
    primaryKey: ["CODE_PROFIL"],
    foreignKeys: [],
    columns: [
      { name: "CODE_PROFIL", type: "VARCHAR2(5)", description: "Champ CODE_PROFIL pour BKCAR_PLAF" },
      { name: "PLAF_RET_JOUR", type: "NUMBER(15,2)", description: "Champ PLAF_RET_JOUR pour BKCAR_PLAF" },
      { name: "PLAF_RET_SEM", type: "NUMBER(15,2)", description: "Champ PLAF_RET_SEM pour BKCAR_PLAF" },
      { name: "PLAF_PAI_JOUR", type: "NUMBER(15,2)", description: "Champ PLAF_PAI_JOUR pour BKCAR_PLAF" },
      { name: "PLAF_PAI_SEM", type: "NUMBER(15,2)", description: "Champ PLAF_PAI_SEM pour BKCAR_PLAF" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_PLAF WHERE CODE_PROFIL IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_PLAF du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAR_FRAIS",
    module: "Monétique & Cartes",
    description: "Cotisations périodiques carte et commissions sur retours d'autorisation.",
    primaryKey: ["CODE_PROFIL", "PERIODICITE"],
    foreignKeys: [],
    columns: [
      { name: "CODE_PROFIL", type: "VARCHAR2(5)", description: "Champ CODE_PROFIL pour BKCAR_FRAIS" },
      { name: "PERIODICITE", type: "VARCHAR2(1)", description: "Champ PERIODICITE pour BKCAR_FRAIS" },
      { name: "MONTANT_COTIS", type: "NUMBER(15,2)", description: "Champ MONTANT_COTIS pour BKCAR_FRAIS" },
      { name: "OPE_FRAIS", type: "VARCHAR2(3)", description: "Champ OPE_FRAIS pour BKCAR_FRAIS" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_FRAIS WHERE CODE_PROFIL IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_FRAIS du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAR_CLEAR",
    module: "Monétique & Cartes",
    description: "Fichiers de clearing et compensation entrants (Base II, IPM, GIMAC).",
    primaryKey: ["REF_FICHIER", "NUM_LIGNE"],
    foreignKeys: [],
    columns: [
      { name: "REF_FICHIER", type: "VARCHAR2(30)", description: "Champ REF_FICHIER pour BKCAR_CLEAR" },
      { name: "NUM_LIGNE", type: "NUMBER(8)", description: "Champ NUM_LIGNE pour BKCAR_CLEAR" },
      { name: "PAN_MASQUE", type: "VARCHAR2(19)", description: "Champ PAN_MASQUE pour BKCAR_CLEAR" },
      { name: "MONTANT", type: "NUMBER(19,4)", description: "Champ MONTANT pour BKCAR_CLEAR" },
      { name: "STATUT_RECON", type: "VARCHAR2(2)", description: "Champ STATUT_RECON pour BKCAR_CLEAR" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_CLEAR WHERE REF_FICHIER IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_CLEAR du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAR_SUSP",
    module: "Monétique & Cartes",
    description: "Suspends monétiques en attente de régularisation comptable.",
    primaryKey: ["NUM_SUSP"],
    foreignKeys: [],
    columns: [
      { name: "NUM_SUSP", type: "VARCHAR2(15)", description: "Champ NUM_SUSP pour BKCAR_SUSP" },
      { name: "STAN", type: "VARCHAR2(6)", description: "Champ STAN pour BKCAR_SUSP" },
      { name: "RRN", type: "VARCHAR2(12)", description: "Champ RRN pour BKCAR_SUSP" },
      { name: "MONTANT", type: "NUMBER(19,4)", description: "Champ MONTANT pour BKCAR_SUSP" },
      { name: "MOTIF_SUSP", type: "VARCHAR2(30)", description: "Champ MOTIF_SUSP pour BKCAR_SUSP" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_SUSP WHERE NUM_SUSP IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_SUSP du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAR_LITIGE",
    module: "Monétique & Cartes",
    description: "Gestion des dossiers de chargeback et contestations porteurs.",
    primaryKey: ["DOSSIER_ID"],
    foreignKeys: [],
    columns: [
      { name: "DOSSIER_ID", type: "VARCHAR2(15)", description: "Champ DOSSIER_ID pour BKCAR_LITIGE" },
      { name: "NUM_CARTE", type: "VARCHAR2(19)", description: "Champ NUM_CARTE pour BKCAR_LITIGE" },
      { name: "DCO_TX", type: "DATE", description: "Champ DCO_TX pour BKCAR_LITIGE" },
      { name: "MONTANT", type: "NUMBER(19,4)", description: "Champ MONTANT pour BKCAR_LITIGE" },
      { name: "STAGE_CB", type: "VARCHAR2(10)", description: "Champ STAGE_CB pour BKCAR_LITIGE" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_LITIGE WHERE DOSSIER_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_LITIGE du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAR_TPE",
    module: "Monétique & Cartes",
    description: "Parc des terminaux de paiement électronique TPE et commerçants.",
    primaryKey: ["TPE_ID"],
    foreignKeys: [],
    columns: [
      { name: "TPE_ID", type: "VARCHAR2(16)", description: "Champ TPE_ID pour BKCAR_TPE" },
      { name: "MERCHANT_ID", type: "VARCHAR2(15)", description: "Champ MERCHANT_ID pour BKCAR_TPE" },
      { name: "LIBELLE_COMM", type: "VARCHAR2(40)", description: "Champ LIBELLE_COMM pour BKCAR_TPE" },
      { name: "MCC", type: "VARCHAR2(4)", description: "Champ MCC pour BKCAR_TPE" },
      { name: "STATUT", type: "VARCHAR2(1)", description: "Champ STATUT pour BKCAR_TPE" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_TPE WHERE TPE_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_TPE du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAR_COMM",
    module: "Monétique & Cartes",
    description: "Contrats commerçants, taux de commission et comptes de crédit.",
    primaryKey: ["MERCHANT_ID"],
    foreignKeys: [],
    columns: [
      { name: "MERCHANT_ID", type: "VARCHAR2(15)", description: "Champ MERCHANT_ID pour BKCAR_COMM" },
      { name: "AGE_COMM", type: "VARCHAR2(5)", description: "Champ AGE_COMM pour BKCAR_COMM" },
      { name: "NCP_COMM", type: "VARCHAR2(11)", description: "Champ NCP_COMM pour BKCAR_COMM" },
      { name: "TAUX_COMM_PCT", type: "NUMBER(5,3)", description: "Champ TAUX_COMM_PCT pour BKCAR_COMM" },
      { name: "FREQUENCE_REG", type: "VARCHAR2(1)", description: "Champ FREQUENCE_REG pour BKCAR_COMM" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_COMM WHERE MERCHANT_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_COMM du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAR_BATCH",
    module: "Monétique & Cartes",
    description: "Journal des télécollectes commerçants TPE journalières.",
    primaryKey: ["MERCHANT_ID", "DCO_BATCH", "NUM_LOT"],
    foreignKeys: [],
    columns: [
      { name: "MERCHANT_ID", type: "VARCHAR2(15)", description: "Champ MERCHANT_ID pour BKCAR_BATCH" },
      { name: "DCO_BATCH", type: "DATE", description: "Champ DCO_BATCH pour BKCAR_BATCH" },
      { name: "NUM_LOT", type: "VARCHAR2(6)", description: "Champ NUM_LOT pour BKCAR_BATCH" },
      { name: "NB_TRANS", type: "NUMBER(6)", description: "Champ NB_TRANS pour BKCAR_BATCH" },
      { name: "TOTAL_BRUT", type: "NUMBER(19,4)", description: "Champ TOTAL_BRUT pour BKCAR_BATCH" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_BATCH WHERE MERCHANT_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_BATCH du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAR_HSM",
    module: "Monétique & Cartes",
    description: "Paramétrage des serveurs cryptographiques HSM et clés LMK/ZMK.",
    primaryKey: ["HSM_ID"],
    foreignKeys: [],
    columns: [
      { name: "HSM_ID", type: "VARCHAR2(8)", description: "Champ HSM_ID pour BKCAR_HSM" },
      { name: "IP_ADDR", type: "VARCHAR2(15)", description: "Champ IP_ADDR pour BKCAR_HSM" },
      { name: "PORT_NUM", type: "NUMBER(5)", description: "Champ PORT_NUM pour BKCAR_HSM" },
      { name: "LMK_ID", type: "VARCHAR2(4)", description: "Champ LMK_ID pour BKCAR_HSM" },
      { name: "STATUT_CONN", type: "VARCHAR2(1)", description: "Champ STATUT_CONN pour BKCAR_HSM" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_HSM WHERE HSM_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_HSM du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAR_3DS",
    module: "Monétique & Cartes",
    description: "Transactions d'authentification e-commerce 3D-Secure 2.x.",
    primaryKey: ["ACS_TRANS_ID"],
    foreignKeys: [],
    columns: [
      { name: "ACS_TRANS_ID", type: "VARCHAR2(36)", description: "Champ ACS_TRANS_ID pour BKCAR_3DS" },
      { name: "PAN_MASQUE", type: "VARCHAR2(19)", description: "Champ PAN_MASQUE pour BKCAR_3DS" },
      { name: "METHODE_AUTH", type: "VARCHAR2(10)", description: "Champ METHODE_AUTH pour BKCAR_3DS" },
      { name: "STATUS_3DS", type: "VARCHAR2(2)", description: "Champ STATUS_3DS pour BKCAR_3DS" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_3DS WHERE ACS_TRANS_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_3DS du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAR_GAB_PARC",
    module: "Monétique & Cartes",
    description: "Inventaire technique des automates bancaires GAB/ATM.",
    primaryKey: ["GAB_ID"],
    foreignKeys: [],
    columns: [
      { name: "GAB_ID", type: "VARCHAR2(8)", description: "Champ GAB_ID pour BKCAR_GAB_PARC" },
      { name: "MODELE", type: "VARCHAR2(30)", description: "Champ MODELE pour BKCAR_GAB_PARC" },
      { name: "ADRESSE_IP", type: "VARCHAR2(15)", description: "Champ ADRESSE_IP pour BKCAR_GAB_PARC" },
      { name: "DATE_INSTALL", type: "DATE", description: "Champ DATE_INSTALL pour BKCAR_GAB_PARC" },
      { name: "STATUT_DISPO", type: "VARCHAR2(1)", description: "Champ STATUT_DISPO pour BKCAR_GAB_PARC" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_GAB_PARC WHERE GAB_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_GAB_PARC du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAR_COFFRE",
    module: "Monétique & Cartes",
    description: "Comptabilité des cassettes billets et rechargement fonds ATM.",
    primaryKey: ["GAB_ID", "CASSETTE_NUM"],
    foreignKeys: [],
    columns: [
      { name: "GAB_ID", type: "VARCHAR2(8)", description: "Champ GAB_ID pour BKCAR_COFFRE" },
      { name: "CASSETTE_NUM", type: "NUMBER(2)", description: "Champ CASSETTE_NUM pour BKCAR_COFFRE" },
      { name: "DEVISE", type: "VARCHAR2(3)", description: "Champ DEVISE pour BKCAR_COFFRE" },
      { name: "VALEUR_FACIALE", type: "NUMBER(7)", description: "Champ VALEUR_FACIALE pour BKCAR_COFFRE" },
      { name: "NB_BILLETS", type: "NUMBER(6)", description: "Champ NB_BILLETS pour BKCAR_COFFRE" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_COFFRE WHERE GAB_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_COFFRE du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAR_PREPAY",
    module: "Monétique & Cartes",
    description: "Comptes de monnaie électronique et cartes prépayées rechargeables.",
    primaryKey: ["NUM_SERIE"],
    foreignKeys: [],
    columns: [
      { name: "NUM_SERIE", type: "VARCHAR2(16)", description: "Champ NUM_SERIE pour BKCAR_PREPAY" },
      { name: "SOLDE_COURANT", type: "NUMBER(19,4)", description: "Champ SOLDE_COURANT pour BKCAR_PREPAY" },
      { name: "STATUT_ACTIV", type: "VARCHAR2(1)", description: "Champ STATUT_ACTIV pour BKCAR_PREPAY" },
      { name: "CLI_PORTEUR", type: "VARCHAR2(15)", description: "Champ CLI_PORTEUR pour BKCAR_PREPAY" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_PREPAY WHERE NUM_SERIE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_PREPAY du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAR_WALLET",
    module: "Monétique & Cartes",
    description: "Tokens Apple Pay, Google Pay et liaisons Wallet mobile.",
    primaryKey: ["TOKEN_REF"],
    foreignKeys: [],
    columns: [
      { name: "TOKEN_REF", type: "VARCHAR2(32)", description: "Champ TOKEN_REF pour BKCAR_WALLET" },
      { name: "NUM_CARTE", type: "VARCHAR2(19)", description: "Champ NUM_CARTE pour BKCAR_WALLET" },
      { name: "TYPE_DEVICE", type: "VARCHAR2(10)", description: "Champ TYPE_DEVICE pour BKCAR_WALLET" },
      { name: "STATUT_TOKEN", type: "VARCHAR2(1)", description: "Champ STATUT_TOKEN pour BKCAR_WALLET" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_WALLET WHERE TOKEN_REF IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_WALLET du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAR_FEES",
    module: "Monétique & Cartes",
    description: "Grilles des commissions d'interchange national et international.",
    primaryKey: ["SCHEME", "TYPE_OPERATION"],
    foreignKeys: [],
    columns: [
      { name: "SCHEME", type: "VARCHAR2(10)", description: "Champ SCHEME pour BKCAR_FEES" },
      { name: "TYPE_OPERATION", type: "VARCHAR2(10)", description: "Champ TYPE_OPERATION pour BKCAR_FEES" },
      { name: "INTERCHANGE_PCT", type: "NUMBER(5,3)", description: "Champ INTERCHANGE_PCT pour BKCAR_FEES" },
      { name: "FIXE_MONTANT", type: "NUMBER(15,2)", description: "Champ FIXE_MONTANT pour BKCAR_FEES" }
    ],
    sampleQuery: "SELECT * FROM BKCAR_FEES WHERE SCHEME IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAR_FEES du module Monétique & Cartes dans Core Banking Amplitude."
  },
  {
    tableName: "BKVIR_EMIS",
    module: "Virements & Flux",
    description: "Virements émis nationaux, régionaux et internationaux.",
    primaryKey: ["REF_VIR"],
    foreignKeys: [],
    columns: [
      { name: "REF_VIR", type: "VARCHAR2(20)", description: "Champ REF_VIR pour BKVIR_EMIS" },
      { name: "AGE_ORD", type: "VARCHAR2(5)", description: "Champ AGE_ORD pour BKVIR_EMIS" },
      { name: "NCP_ORD", type: "VARCHAR2(11)", description: "Champ NCP_ORD pour BKVIR_EMIS" },
      { name: "MONTANT", type: "NUMBER(19,4)", description: "Champ MONTANT pour BKVIR_EMIS" },
      { name: "DEV", type: "VARCHAR2(3)", description: "Champ DEV pour BKVIR_EMIS" },
      { name: "IBAN_BENEF", type: "VARCHAR2(34)", description: "Champ IBAN_BENEF pour BKVIR_EMIS" },
      { name: "STATUT", type: "VARCHAR2(2)", description: "Champ STATUT pour BKVIR_EMIS" }
    ],
    sampleQuery: "SELECT * FROM BKVIR_EMIS WHERE REF_VIR IS NOT NULL;",
    criticalNotes: "Table maîtresse BKVIR_EMIS du module Virements & Flux dans Core Banking Amplitude."
  },
  {
    tableName: "BKVIR_RECUS",
    module: "Virements & Flux",
    description: "Virements reçus en provenance de confrères et systèmes de compensation.",
    primaryKey: ["REF_EXT"],
    foreignKeys: [],
    columns: [
      { name: "REF_EXT", type: "VARCHAR2(35)", description: "Champ REF_EXT pour BKVIR_RECUS" },
      { name: "BANQUE_EMET", type: "VARCHAR2(11)", description: "Champ BANQUE_EMET pour BKVIR_RECUS" },
      { name: "AGE_BENEF", type: "VARCHAR2(5)", description: "Champ AGE_BENEF pour BKVIR_RECUS" },
      { name: "NCP_BENEF", type: "VARCHAR2(11)", description: "Champ NCP_BENEF pour BKVIR_RECUS" },
      { name: "MONTANT", type: "NUMBER(19,4)", description: "Champ MONTANT pour BKVIR_RECUS" },
      { name: "DCO", type: "DATE", description: "Champ DCO pour BKVIR_RECUS" }
    ],
    sampleQuery: "SELECT * FROM BKVIR_RECUS WHERE REF_EXT IS NOT NULL;",
    criticalNotes: "Table maîtresse BKVIR_RECUS du module Virements & Flux dans Core Banking Amplitude."
  },
  {
    tableName: "BKVIR_PERIO",
    module: "Virements & Flux",
    description: "Ordres de virements permanents automatiques et programmés.",
    primaryKey: ["NUM_ORDRE"],
    foreignKeys: [],
    columns: [
      { name: "NUM_ORDRE", type: "VARCHAR2(15)", description: "Champ NUM_ORDRE pour BKVIR_PERIO" },
      { name: "AGE_DEB", type: "VARCHAR2(5)", description: "Champ AGE_DEB pour BKVIR_PERIO" },
      { name: "NCP_DEB", type: "VARCHAR2(11)", description: "Champ NCP_DEB pour BKVIR_PERIO" },
      { name: "MONTANT", type: "NUMBER(19,4)", description: "Champ MONTANT pour BKVIR_PERIO" },
      { name: "PERIODICITE", type: "VARCHAR2(1)", description: "Champ PERIODICITE pour BKVIR_PERIO" },
      { name: "PROCH_ECHEANCE", type: "DATE", description: "Champ PROCH_ECHEANCE pour BKVIR_PERIO" }
    ],
    sampleQuery: "SELECT * FROM BKVIR_PERIO WHERE NUM_ORDRE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKVIR_PERIO du module Virements & Flux dans Core Banking Amplitude."
  },
  {
    tableName: "BKVIR_MASS",
    module: "Virements & Flux",
    description: "Lots de virements de masse (salaires, pensions, fournisseurs).",
    primaryKey: ["REF_LOT"],
    foreignKeys: [],
    columns: [
      { name: "REF_LOT", type: "VARCHAR2(20)", description: "Champ REF_LOT pour BKVIR_MASS" },
      { name: "ENTREPRISE_CLI", type: "VARCHAR2(15)", description: "Champ ENTREPRISE_CLI pour BKVIR_MASS" },
      { name: "NB_LIGNES", type: "NUMBER(6)", description: "Champ NB_LIGNES pour BKVIR_MASS" },
      { name: "MONTANT_TOTAL", type: "NUMBER(19,4)", description: "Champ MONTANT_TOTAL pour BKVIR_MASS" },
      { name: "STATUT_TRAIT", type: "VARCHAR2(2)", description: "Champ STATUT_TRAIT pour BKVIR_MASS" }
    ],
    sampleQuery: "SELECT * FROM BKVIR_MASS WHERE REF_LOT IS NOT NULL;",
    criticalNotes: "Table maîtresse BKVIR_MASS du module Virements & Flux dans Core Banking Amplitude."
  },
  {
    tableName: "BKVIR_REJET",
    module: "Virements & Flux",
    description: "Table des rejets de virements avec codes motifs normalisés (ISO 20022).",
    primaryKey: ["REF_VIR", "CODE_REJET"],
    foreignKeys: [],
    columns: [
      { name: "REF_VIR", type: "VARCHAR2(20)", description: "Champ REF_VIR pour BKVIR_REJET" },
      { name: "CODE_REJET", type: "VARCHAR2(4)", description: "Champ CODE_REJET pour BKVIR_REJET" },
      { name: "LIBELLE_REJET", type: "VARCHAR2(60)", description: "Champ LIBELLE_REJET pour BKVIR_REJET" },
      { name: "DATE_REJET", type: "DATE", description: "Champ DATE_REJET pour BKVIR_REJET" }
    ],
    sampleQuery: "SELECT * FROM BKVIR_REJET WHERE REF_VIR IS NOT NULL;",
    criticalNotes: "Table maîtresse BKVIR_REJET du module Virements & Flux dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRL_EMIS",
    module: "Virements & Flux",
    description: "Prélèvements automatiques émis pour le compte de grands facturiers.",
    primaryKey: ["REF_PRL"],
    foreignKeys: [],
    columns: [
      { name: "REF_PRL", type: "VARCHAR2(20)", description: "Champ REF_PRL pour BKPRL_EMIS" },
      { name: "REF_MANDAT", type: "VARCHAR2(35)", description: "Champ REF_MANDAT pour BKPRL_EMIS" },
      { name: "NCP_DEB", type: "VARCHAR2(11)", description: "Champ NCP_DEB pour BKPRL_EMIS" },
      { name: "MONTANT", type: "NUMBER(19,4)", description: "Champ MONTANT pour BKPRL_EMIS" },
      { name: "DCO_PREVUE", type: "DATE", description: "Champ DCO_PREVUE pour BKPRL_EMIS" }
    ],
    sampleQuery: "SELECT * FROM BKPRL_EMIS WHERE REF_PRL IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRL_EMIS du module Virements & Flux dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRL_MANDAT",
    module: "Virements & Flux",
    description: "Mandats de prélèvement SEPA/Bancaires et oppositions débiteurs.",
    primaryKey: ["REF_MANDAT"],
    foreignKeys: [],
    columns: [
      { name: "REF_MANDAT", type: "VARCHAR2(35)", description: "Champ REF_MANDAT pour BKPRL_MANDAT" },
      { name: "CLI_CREANCIER", type: "VARCHAR2(15)", description: "Champ CLI_CREANCIER pour BKPRL_MANDAT" },
      { name: "CLI_DEBITEUR", type: "VARCHAR2(15)", description: "Champ CLI_DEBITEUR pour BKPRL_MANDAT" },
      { name: "NCP_DEBITEUR", type: "VARCHAR2(11)", description: "Champ NCP_DEBITEUR pour BKPRL_MANDAT" },
      { name: "STATUT_MANDAT", type: "VARCHAR2(1)", description: "Champ STATUT_MANDAT pour BKPRL_MANDAT" }
    ],
    sampleQuery: "SELECT * FROM BKPRL_MANDAT WHERE REF_MANDAT IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRL_MANDAT du module Virements & Flux dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRL_REJET",
    module: "Virements & Flux",
    description: "Incidents de paiement sur prélèvements et contestations 8 semaines.",
    primaryKey: ["REF_PRL"],
    foreignKeys: [],
    columns: [
      { name: "REF_PRL", type: "VARCHAR2(20)", description: "Champ REF_PRL pour BKPRL_REJET" },
      { name: "MOTIF_REJET", type: "VARCHAR2(4)", description: "Champ MOTIF_REJET pour BKPRL_REJET" },
      { name: "DATE_CONTESTATION", type: "DATE", description: "Champ DATE_CONTESTATION pour BKPRL_REJET" },
      { name: "STATUT_REJET", type: "VARCHAR2(1)", description: "Champ STATUT_REJET pour BKPRL_REJET" }
    ],
    sampleQuery: "SELECT * FROM BKPRL_REJET WHERE REF_PRL IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRL_REJET du module Virements & Flux dans Core Banking Amplitude."
  },
  {
    tableName: "BKSWF_MSG",
    module: "Virements & Flux",
    description: "Messages SWIFT MT103, MT202 et ISO 20022 pacs.008 entrants/sortants.",
    primaryKey: ["SWIFT_REF"],
    foreignKeys: [],
    columns: [
      { name: "SWIFT_REF", type: "VARCHAR2(16)", description: "Champ SWIFT_REF pour BKSWF_MSG" },
      { name: "TYPE_MSG", type: "VARCHAR2(10)", description: "Champ TYPE_MSG pour BKSWF_MSG" },
      { name: "SENDER_BIC", type: "VARCHAR2(11)", description: "Champ SENDER_BIC pour BKSWF_MSG" },
      { name: "RECEIVER_BIC", type: "VARCHAR2(11)", description: "Champ RECEIVER_BIC pour BKSWF_MSG" },
      { name: "MONTANT", type: "NUMBER(19,4)", description: "Champ MONTANT pour BKSWF_MSG" },
      { name: "STATUT_ACK", type: "VARCHAR2(3)", description: "Champ STATUT_ACK pour BKSWF_MSG" }
    ],
    sampleQuery: "SELECT * FROM BKSWF_MSG WHERE SWIFT_REF IS NOT NULL;",
    criticalNotes: "Table maîtresse BKSWF_MSG du module Virements & Flux dans Core Banking Amplitude."
  },
  {
    tableName: "BKSWF_STOP",
    module: "Virements & Flux",
    description: "Filtres de conformité et criblage sanctions / embargos (OFAC, ONU).",
    primaryKey: ["FILTRE_ID"],
    foreignKeys: [],
    columns: [
      { name: "FILTRE_ID", type: "VARCHAR2(10)", description: "Champ FILTRE_ID pour BKSWF_STOP" },
      { name: "MOT_CLE_SANCTION", type: "VARCHAR2(50)", description: "Champ MOT_CLE_SANCTION pour BKSWF_STOP" },
      { name: "PAYS_EMBARGO", type: "VARCHAR2(3)", description: "Champ PAYS_EMBARGO pour BKSWF_STOP" },
      { name: "ACTION_PRISE", type: "VARCHAR2(10)", description: "Champ ACTION_PRISE pour BKSWF_STOP" }
    ],
    sampleQuery: "SELECT * FROM BKSWF_STOP WHERE FILTRE_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKSWF_STOP du module Virements & Flux dans Core Banking Amplitude."
  },
  {
    tableName: "BKRTGS_QUEUE",
    module: "Virements & Flux",
    description: "File d'attente des paiements de gros montant en temps réel (RTGS).",
    primaryKey: ["QUEUE_ID"],
    foreignKeys: [],
    columns: [
      { name: "QUEUE_ID", type: "VARCHAR2(20)", description: "Champ QUEUE_ID pour BKRTGS_QUEUE" },
      { name: "PRIORITE", type: "NUMBER(2)", description: "Champ PRIORITE pour BKRTGS_QUEUE" },
      { name: "MONTANT", type: "NUMBER(19,4)", description: "Champ MONTANT pour BKRTGS_QUEUE" },
      { name: "STATUT_LIQ", type: "VARCHAR2(1)", description: "Champ STATUT_LIQ pour BKRTGS_QUEUE" }
    ],
    sampleQuery: "SELECT * FROM BKRTGS_QUEUE WHERE QUEUE_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKRTGS_QUEUE du module Virements & Flux dans Core Banking Amplitude."
  },
  {
    tableName: "BKACH_LOTS",
    module: "Virements & Flux",
    description: "Lots de télécompensation interbancaire automatisée (ACH / SICA).",
    primaryKey: ["LOT_ID"],
    foreignKeys: [],
    columns: [
      { name: "LOT_ID", type: "VARCHAR2(15)", description: "Champ LOT_ID pour BKACH_LOTS" },
      { name: "CODE_CHAMBRE", type: "VARCHAR2(6)", description: "Champ CODE_CHAMBRE pour BKACH_LOTS" },
      { name: "SENS_FLUX", type: "VARCHAR2(1)", description: "Champ SENS_FLUX pour BKACH_LOTS" },
      { name: "TOTAL_OPER", type: "NUMBER(6)", description: "Champ TOTAL_OPER pour BKACH_LOTS" },
      { name: "TOTAL_NET", type: "NUMBER(19,4)", description: "Champ TOTAL_NET pour BKACH_LOTS" }
    ],
    sampleQuery: "SELECT * FROM BKACH_LOTS WHERE LOT_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKACH_LOTS du module Virements & Flux dans Core Banking Amplitude."
  },
  {
    tableName: "BKMOB_OPER",
    module: "Virements & Flux",
    description: "Transactions Mobile Money (Wave, Orange, MTN, Moov) vers comptes.",
    primaryKey: ["MOBILE_TX_ID"],
    foreignKeys: [],
    columns: [
      { name: "MOBILE_TX_ID", type: "VARCHAR2(30)", description: "Champ MOBILE_TX_ID pour BKMOB_OPER" },
      { name: "OPERATEUR", type: "VARCHAR2(10)", description: "Champ OPERATEUR pour BKMOB_OPER" },
      { name: "MSISDN", type: "VARCHAR2(20)", description: "Champ MSISDN pour BKMOB_OPER" },
      { name: "NCP_CBS", type: "VARCHAR2(11)", description: "Champ NCP_CBS pour BKMOB_OPER" },
      { name: "STATUT_CALLBACK", type: "VARCHAR2(2)", description: "Champ STATUT_CALLBACK pour BKMOB_OPER" }
    ],
    sampleQuery: "SELECT * FROM BKMOB_OPER WHERE MOBILE_TX_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKMOB_OPER du module Virements & Flux dans Core Banking Amplitude."
  },
  {
    tableName: "BKMOB_PART",
    module: "Virements & Flux",
    description: "Comptes de cantonnement et partenaires fintech agrégateurs.",
    primaryKey: ["PARTENAIRE_CODE"],
    foreignKeys: [],
    columns: [
      { name: "PARTENAIRE_CODE", type: "VARCHAR2(10)", description: "Champ PARTENAIRE_CODE pour BKMOB_PART" },
      { name: "NCP_CANTONNEMENT", type: "VARCHAR2(11)", description: "Champ NCP_CANTONNEMENT pour BKMOB_PART" },
      { name: "CLE_API_HASH", type: "VARCHAR2(64)", description: "Champ CLE_API_HASH pour BKMOB_PART" },
      { name: "STATUT_ACTIF", type: "VARCHAR2(1)", description: "Champ STATUT_ACTIF pour BKMOB_PART" }
    ],
    sampleQuery: "SELECT * FROM BKMOB_PART WHERE PARTENAIRE_CODE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKMOB_PART du module Virements & Flux dans Core Banking Amplitude."
  },
  {
    tableName: "BKINST_PAY",
    module: "Virements & Flux",
    description: "Paiements instantanés IP (Instant Payment 24/7/365 en moins de 10s).",
    primaryKey: ["TX_INST_ID"],
    foreignKeys: [],
    columns: [
      { name: "TX_INST_ID", type: "VARCHAR2(35)", description: "Champ TX_INST_ID pour BKINST_PAY" },
      { name: "DATE_HEURE", type: "TIMESTAMP", description: "Champ DATE_HEURE pour BKINST_PAY" },
      { name: "LATENCE_MS", type: "NUMBER(5)", description: "Champ LATENCE_MS pour BKINST_PAY" },
      { name: "STATUT_CONFIRM", type: "VARCHAR2(1)", description: "Champ STATUT_CONFIRM pour BKINST_PAY" }
    ],
    sampleQuery: "SELECT * FROM BKINST_PAY WHERE TX_INST_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKINST_PAY du module Virements & Flux dans Core Banking Amplitude."
  },
  {
    tableName: "BKFLUX_AUDIT",
    module: "Virements & Flux",
    description: "Journal d'audit inviolable des ordres de paiement et signatures électroniques.",
    primaryKey: ["ORDRE_ID"],
    foreignKeys: [],
    columns: [
      { name: "ORDRE_ID", type: "VARCHAR2(25)", description: "Champ ORDRE_ID pour BKFLUX_AUDIT" },
      { name: "SIGNATAIRE_USER", type: "VARCHAR2(10)", description: "Champ SIGNATAIRE_USER pour BKFLUX_AUDIT" },
      { name: "CERTIFICAT_EMV", type: "VARCHAR2(128)", description: "Champ CERTIFICAT_EMV pour BKFLUX_AUDIT" },
      { name: "HORODATAGE_SERVEUR", type: "TIMESTAMP", description: "Champ HORODATAGE_SERVEUR pour BKFLUX_AUDIT" }
    ],
    sampleQuery: "SELECT * FROM BKFLUX_AUDIT WHERE ORDRE_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKFLUX_AUDIT du module Virements & Flux dans Core Banking Amplitude."
  },
  {
    tableName: "BKCHQ_EMIS",
    module: "Chèques & Effets",
    description: "Carnets de chèques délivrés aux clients et statut des formules.",
    primaryKey: ["AGE", "NCP", "NUM_CHQ_DEB"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKCHQ_EMIS" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKCHQ_EMIS" },
      { name: "NUM_CHQ_DEB", type: "VARCHAR2(10)", description: "Champ NUM_CHQ_DEB pour BKCHQ_EMIS" },
      { name: "NUM_CHQ_FIN", type: "VARCHAR2(10)", description: "Champ NUM_CHQ_FIN pour BKCHQ_EMIS" },
      { name: "DAT_LIVRAISON", type: "DATE", description: "Champ DAT_LIVRAISON pour BKCHQ_EMIS" }
    ],
    sampleQuery: "SELECT * FROM BKCHQ_EMIS WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCHQ_EMIS du module Chèques & Effets dans Core Banking Amplitude."
  },
  {
    tableName: "BKCHQ_OPPO",
    module: "Chèques & Effets",
    description: "Oppositions sur chèques et chéquiers pour perte, vol ou utilisation frauduleuse.",
    primaryKey: ["AGE", "NCP", "NUM_CHQ"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKCHQ_OPPO" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKCHQ_OPPO" },
      { name: "NUM_CHQ", type: "VARCHAR2(10)", description: "Champ NUM_CHQ pour BKCHQ_OPPO" },
      { name: "MOTIF_OPPO", type: "VARCHAR2(2)", description: "Champ MOTIF_OPPO pour BKCHQ_OPPO" },
      { name: "DAT_OPPO", type: "DATE", description: "Champ DAT_OPPO pour BKCHQ_OPPO" }
    ],
    sampleQuery: "SELECT * FROM BKCHQ_OPPO WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCHQ_OPPO du module Chèques & Effets dans Core Banking Amplitude."
  },
  {
    tableName: "BKCHQ_COMP",
    module: "Chèques & Effets",
    description: "Remises de chèques compensables confrères et lettrage chambre de compensation.",
    primaryKey: ["REF_REMISE", "NUM_LIGNE"],
    foreignKeys: [],
    columns: [
      { name: "REF_REMISE", type: "VARCHAR2(15)", description: "Champ REF_REMISE pour BKCHQ_COMP" },
      { name: "NUM_LIGNE", type: "NUMBER(4)", description: "Champ NUM_LIGNE pour BKCHQ_COMP" },
      { name: "BANQUE_TIR", type: "VARCHAR2(5)", description: "Champ BANQUE_TIR pour BKCHQ_COMP" },
      { name: "MONTANT", type: "NUMBER(19,4)", description: "Champ MONTANT pour BKCHQ_COMP" },
      { name: "STATUT_SORT", type: "VARCHAR2(2)", description: "Champ STATUT_SORT pour BKCHQ_COMP" }
    ],
    sampleQuery: "SELECT * FROM BKCHQ_COMP WHERE REF_REMISE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCHQ_COMP du module Chèques & Effets dans Core Banking Amplitude."
  },
  {
    tableName: "BKCHQ_IMPAYE",
    module: "Chèques & Effets",
    description: "Chèques impayés pour provision insuffisante et pénalités de régularisation.",
    primaryKey: ["REF_CHQ"],
    foreignKeys: [],
    columns: [
      { name: "REF_CHQ", type: "VARCHAR2(20)", description: "Champ REF_CHQ pour BKCHQ_IMPAYE" },
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKCHQ_IMPAYE" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKCHQ_IMPAYE" },
      { name: "MONTANT", type: "NUMBER(19,4)", description: "Champ MONTANT pour BKCHQ_IMPAYE" },
      { name: "MOTIF_IMPAYE", type: "VARCHAR2(3)", description: "Champ MOTIF_IMPAYE pour BKCHQ_IMPAYE" },
      { name: "DATE_REJET", type: "DATE", description: "Champ DATE_REJET pour BKCHQ_IMPAYE" }
    ],
    sampleQuery: "SELECT * FROM BKCHQ_IMPAYE WHERE REF_CHQ IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCHQ_IMPAYE du module Chèques & Effets dans Core Banking Amplitude."
  },
  {
    tableName: "BKCHQ_CERTIF",
    module: "Chèques & Effets",
    description: "Chèques certifiés et chèques de banque émis avec blocage de provision.",
    primaryKey: ["NUM_CHQ_BANQUE"],
    foreignKeys: [],
    columns: [
      { name: "NUM_CHQ_BANQUE", type: "VARCHAR2(15)", description: "Champ NUM_CHQ_BANQUE pour BKCHQ_CERTIF" },
      { name: "BENEFICIAIRE", type: "VARCHAR2(60)", description: "Champ BENEFICIAIRE pour BKCHQ_CERTIF" },
      { name: "MONTANT", type: "NUMBER(19,4)", description: "Champ MONTANT pour BKCHQ_CERTIF" },
      { name: "NCP_EMETTEUR", type: "VARCHAR2(11)", description: "Champ NCP_EMETTEUR pour BKCHQ_CERTIF" },
      { name: "STATUT_PAI", type: "VARCHAR2(1)", description: "Champ STATUT_PAI pour BKCHQ_CERTIF" }
    ],
    sampleQuery: "SELECT * FROM BKCHQ_CERTIF WHERE NUM_CHQ_BANQUE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCHQ_CERTIF du module Chèques & Effets dans Core Banking Amplitude."
  },
  {
    tableName: "BKCHQ_STOCK",
    module: "Chèques & Effets",
    description: "Gestion des stocks de formules de chèques vierges et sécurisées en agence.",
    primaryKey: ["AGE", "TYPE_CHEQUIER"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKCHQ_STOCK" },
      { name: "TYPE_CHEQUIER", type: "VARCHAR2(3)", description: "Champ TYPE_CHEQUIER pour BKCHQ_STOCK" },
      { name: "QTE_STOCK", type: "NUMBER(5)", description: "Champ QTE_STOCK pour BKCHQ_STOCK" },
      { name: "SEUIL_ALERTE", type: "NUMBER(4)", description: "Champ SEUIL_ALERTE pour BKCHQ_STOCK" }
    ],
    sampleQuery: "SELECT * FROM BKCHQ_STOCK WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCHQ_STOCK du module Chèques & Effets dans Core Banking Amplitude."
  },
  {
    tableName: "BKCHQ_CMD",
    module: "Chèques & Effets",
    description: "Commandes de chéquiers transmises aux imprimeurs fiduciaires.",
    primaryKey: ["CMD_REF"],
    foreignKeys: [],
    columns: [
      { name: "CMD_REF", type: "VARCHAR2(15)", description: "Champ CMD_REF pour BKCHQ_CMD" },
      { name: "CLI", type: "VARCHAR2(15)", description: "Champ CLI pour BKCHQ_CMD" },
      { name: "TYPE_MODELE", type: "VARCHAR2(4)", description: "Champ TYPE_MODELE pour BKCHQ_CMD" },
      { name: "DATE_COMMANDE", type: "DATE", description: "Champ DATE_COMMANDE pour BKCHQ_CMD" },
      { name: "STATUT_EXPED", type: "VARCHAR2(1)", description: "Champ STATUT_EXPED pour BKCHQ_CMD" }
    ],
    sampleQuery: "SELECT * FROM BKCHQ_CMD WHERE CMD_REF IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCHQ_CMD du module Chèques & Effets dans Core Banking Amplitude."
  },
  {
    tableName: "BKEFF_PORTEF",
    module: "Chèques & Effets",
    description: "Portefeuille d'effets de commerce (Lettres de change, Billets à ordre).",
    primaryKey: ["REF_EFFET"],
    foreignKeys: [],
    columns: [
      { name: "REF_EFFET", type: "VARCHAR2(20)", description: "Champ REF_EFFET pour BKEFF_PORTEF" },
      { name: "TIREUR_CLI", type: "VARCHAR2(15)", description: "Champ TIREUR_CLI pour BKEFF_PORTEF" },
      { name: "TIRE_NOM", type: "VARCHAR2(45)", description: "Champ TIRE_NOM pour BKEFF_PORTEF" },
      { name: "MONTANT", type: "NUMBER(19,4)", description: "Champ MONTANT pour BKEFF_PORTEF" },
      { name: "ECHEANCE", type: "DATE", description: "Champ ECHEANCE pour BKEFF_PORTEF" },
      { name: "STATUT", type: "VARCHAR2(2)", description: "Champ STATUT pour BKEFF_PORTEF" }
    ],
    sampleQuery: "SELECT * FROM BKEFF_PORTEF WHERE REF_EFFET IS NOT NULL;",
    criticalNotes: "Table maîtresse BKEFF_PORTEF du module Chèques & Effets dans Core Banking Amplitude."
  },
  {
    tableName: "BKEFF_ESCOMP",
    module: "Chèques & Effets",
    description: "Lignes d'escompte d'effets accordées et agios précomptés.",
    primaryKey: ["REF_BORDEREAU"],
    foreignKeys: [],
    columns: [
      { name: "REF_BORDEREAU", type: "VARCHAR2(15)", description: "Champ REF_BORDEREAU pour BKEFF_ESCOMP" },
      { name: "CLI", type: "VARCHAR2(15)", description: "Champ CLI pour BKEFF_ESCOMP" },
      { name: "TAUX_ESCOMPTE", type: "NUMBER(5,3)", description: "Champ TAUX_ESCOMPTE pour BKEFF_ESCOMP" },
      { name: "TOTAL_AGIOS", type: "NUMBER(19,4)", description: "Champ TOTAL_AGIOS pour BKEFF_ESCOMP" },
      { name: "NET_CREDITE", type: "NUMBER(19,4)", description: "Champ NET_CREDITE pour BKEFF_ESCOMP" }
    ],
    sampleQuery: "SELECT * FROM BKEFF_ESCOMP WHERE REF_BORDEREAU IS NOT NULL;",
    criticalNotes: "Table maîtresse BKEFF_ESCOMP du module Chèques & Effets dans Core Banking Amplitude."
  },
  {
    tableName: "BKEFF_AVAL",
    module: "Chèques & Effets",
    description: "Avals et cautions donnés sur effets de commerce.",
    primaryKey: ["REF_EFFET", "CLI_AVAL"],
    foreignKeys: [],
    columns: [
      { name: "REF_EFFET", type: "VARCHAR2(20)", description: "Champ REF_EFFET pour BKEFF_AVAL" },
      { name: "CLI_AVAL", type: "VARCHAR2(15)", description: "Champ CLI_AVAL pour BKEFF_AVAL" },
      { name: "MONTANT_GARANTI", type: "NUMBER(19,4)", description: "Champ MONTANT_GARANTI pour BKEFF_AVAL" },
      { name: "DAT_ENGAGEMENT", type: "DATE", description: "Champ DAT_ENGAGEMENT pour BKEFF_AVAL" }
    ],
    sampleQuery: "SELECT * FROM BKEFF_AVAL WHERE REF_EFFET IS NOT NULL;",
    criticalNotes: "Table maîtresse BKEFF_AVAL du module Chèques & Effets dans Core Banking Amplitude."
  },
  {
    tableName: "BKEFF_ENCAIS",
    module: "Chèques & Effets",
    description: "Effets remis à l'encaissement direct et commissions de manipulation.",
    primaryKey: ["REF_EFFET"],
    foreignKeys: [],
    columns: [
      { name: "REF_EFFET", type: "VARCHAR2(20)", description: "Champ REF_EFFET pour BKEFF_ENCAIS" },
      { name: "BANQUE_DOMICIL", type: "VARCHAR2(5)", description: "Champ BANQUE_DOMICIL pour BKEFF_ENCAIS" },
      { name: "STATUT_ENCAIS", type: "VARCHAR2(1)", description: "Champ STATUT_ENCAIS pour BKEFF_ENCAIS" },
      { name: "FRAIS_REMISE", type: "NUMBER(15,2)", description: "Champ FRAIS_REMISE pour BKEFF_ENCAIS" }
    ],
    sampleQuery: "SELECT * FROM BKEFF_ENCAIS WHERE REF_EFFET IS NOT NULL;",
    criticalNotes: "Table maîtresse BKEFF_ENCAIS du module Chèques & Effets dans Core Banking Amplitude."
  },
  {
    tableName: "BKEFF_PROTET",
    module: "Chèques & Effets",
    description: "Protêts dressés par huissier pour non-paiement ou non-acceptation.",
    primaryKey: ["REF_PROTET"],
    foreignKeys: [],
    columns: [
      { name: "REF_PROTET", type: "VARCHAR2(15)", description: "Champ REF_PROTET pour BKEFF_PROTET" },
      { name: "REF_EFFET", type: "VARCHAR2(20)", description: "Champ REF_EFFET pour BKEFF_PROTET" },
      { name: "NOM_HUISSIER", type: "VARCHAR2(40)", description: "Champ NOM_HUISSIER pour BKEFF_PROTET" },
      { name: "DATE_SIGNIF", type: "DATE", description: "Champ DATE_SIGNIF pour BKEFF_PROTET" }
    ],
    sampleQuery: "SELECT * FROM BKEFF_PROTET WHERE REF_PROTET IS NOT NULL;",
    criticalNotes: "Table maîtresse BKEFF_PROTET du module Chèques & Effets dans Core Banking Amplitude."
  },
  {
    tableName: "BKCHQ_INTERD",
    module: "Chèques & Effets",
    description: "Fichier national des interdits bancaires et déclarations Banque Centrale.",
    primaryKey: ["NUM_IDENT_BANCAIRE"],
    foreignKeys: [],
    columns: [
      { name: "NUM_IDENT_BANCAIRE", type: "VARCHAR2(20)", description: "Champ NUM_IDENT_BANCAIRE pour BKCHQ_INTERD" },
      { name: "CLI", type: "VARCHAR2(15)", description: "Champ CLI pour BKCHQ_INTERD" },
      { name: "DATE_DEBUT_INTERD", type: "DATE", description: "Champ DATE_DEBUT_INTERD pour BKCHQ_INTERD" },
      { name: "DATE_FIN_PREVUE", type: "DATE", description: "Champ DATE_FIN_PREVUE pour BKCHQ_INTERD" }
    ],
    sampleQuery: "SELECT * FROM BKCHQ_INTERD WHERE NUM_IDENT_BANCAIRE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCHQ_INTERD du module Chèques & Effets dans Core Banking Amplitude."
  },
  {
    tableName: "BKCHQ_SCAN",
    module: "Chèques & Effets",
    description: "Indexation des images chèques numérisées lors de la compensation électronique.",
    primaryKey: ["CHQ_MICR"],
    foreignKeys: [],
    columns: [
      { name: "CHQ_MICR", type: "VARCHAR2(35)", description: "Champ CHQ_MICR pour BKCHQ_SCAN" },
      { name: "URL_RECTO", type: "VARCHAR2(120)", description: "Champ URL_RECTO pour BKCHQ_SCAN" },
      { name: "URL_VERSO", type: "VARCHAR2(120)", description: "Champ URL_VERSO pour BKCHQ_SCAN" },
      { name: "STATUT_OCR", type: "VARCHAR2(1)", description: "Champ STATUT_OCR pour BKCHQ_SCAN" }
    ],
    sampleQuery: "SELECT * FROM BKCHQ_SCAN WHERE CHQ_MICR IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCHQ_SCAN du module Chèques & Effets dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_DOS",
    module: "Crédits & Financements",
    description: "Dossiers d'instruction de crédit et comités de décision.",
    primaryKey: ["DOSSIER_ID"],
    foreignKeys: [],
    columns: [
      { name: "DOSSIER_ID", type: "VARCHAR2(15)", description: "Champ DOSSIER_ID pour BKPRT_DOS" },
      { name: "CLI", type: "VARCHAR2(15)", description: "Champ CLI pour BKPRT_DOS" },
      { name: "OBJET_PRET", type: "VARCHAR2(40)", description: "Champ OBJET_PRET pour BKPRT_DOS" },
      { name: "MONTANT_DEMANDE", type: "NUMBER(19,4)", description: "Champ MONTANT_DEMANDE pour BKPRT_DOS" },
      { name: "DECISION_COMITE", type: "VARCHAR2(2)", description: "Champ DECISION_COMITE pour BKPRT_DOS" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_DOS WHERE DOSSIER_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_DOS du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_ECH",
    module: "Crédits & Financements",
    description: "Tableau d'amortissement détaillé échéance par échéance.",
    primaryKey: ["DOSSIER_ID", "NUM_ECH"],
    foreignKeys: [],
    columns: [
      { name: "DOSSIER_ID", type: "VARCHAR2(15)", description: "Champ DOSSIER_ID pour BKPRT_ECH" },
      { name: "NUM_ECH", type: "NUMBER(4)", description: "Champ NUM_ECH pour BKPRT_ECH" },
      { name: "DATE_ECH", type: "DATE", description: "Champ DATE_ECH pour BKPRT_ECH" },
      { name: "CAPITAL_ECH", type: "NUMBER(19,4)", description: "Champ CAPITAL_ECH pour BKPRT_ECH" },
      { name: "INTERET_ECH", type: "NUMBER(19,4)", description: "Champ INTERET_ECH pour BKPRT_ECH" },
      { name: "STATUT_PAI", type: "VARCHAR2(1)", description: "Champ STATUT_PAI pour BKPRT_ECH" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_ECH WHERE DOSSIER_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_ECH du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_TAUX",
    module: "Crédits & Financements",
    description: "Grilles des taux débiteurs indexés (TBB, EURIBOR) et marges banque.",
    primaryKey: ["CODE_GRILLE", "DCO_APPLICATION"],
    foreignKeys: [],
    columns: [
      { name: "CODE_GRILLE", type: "VARCHAR2(6)", description: "Champ CODE_GRILLE pour BKPRT_TAUX" },
      { name: "DCO_APPLICATION", type: "DATE", description: "Champ DCO_APPLICATION pour BKPRT_TAUX" },
      { name: "TAUX_BASE", type: "NUMBER(6,4)", description: "Champ TAUX_BASE pour BKPRT_TAUX" },
      { name: "MARGE_MAX", type: "NUMBER(5,3)", description: "Champ MARGE_MAX pour BKPRT_TAUX" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_TAUX WHERE CODE_GRILLE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_TAUX du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_GAR",
    module: "Crédits & Financements",
    description: "Sûretés réelles, hypothèques, nantissements et cautions rattachés au prêt.",
    primaryKey: ["DOSSIER_ID", "GARANTIE_ID"],
    foreignKeys: [],
    columns: [
      { name: "DOSSIER_ID", type: "VARCHAR2(15)", description: "Champ DOSSIER_ID pour BKPRT_GAR" },
      { name: "GARANTIE_ID", type: "VARCHAR2(15)", description: "Champ GARANTIE_ID pour BKPRT_GAR" },
      { name: "TYPE_SURETE", type: "VARCHAR2(3)", description: "Champ TYPE_SURETE pour BKPRT_GAR" },
      { name: "VALEUR_ESTIMEE", type: "NUMBER(19,4)", description: "Champ VALEUR_ESTIMEE pour BKPRT_GAR" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_GAR WHERE DOSSIER_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_GAR du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_ASSUR",
    module: "Crédits & Financements",
    description: "Contrats d'assurance emprunteur (Décès, Invalidité, Perte d'emploi).",
    primaryKey: ["DOSSIER_ID"],
    foreignKeys: [],
    columns: [
      { name: "DOSSIER_ID", type: "VARCHAR2(15)", description: "Champ DOSSIER_ID pour BKPRT_ASSUR" },
      { name: "CIE_ASSURANCE", type: "VARCHAR2(30)", description: "Champ CIE_ASSURANCE pour BKPRT_ASSUR" },
      { name: "QUOTITE_PCT", type: "NUMBER(3)", description: "Champ QUOTITE_PCT pour BKPRT_ASSUR" },
      { name: "PRIME_MENSUELLE", type: "NUMBER(15,2)", description: "Champ PRIME_MENSUELLE pour BKPRT_ASSUR" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_ASSUR WHERE DOSSIER_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_ASSUR du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_RESTR",
    module: "Crédits & Financements",
    description: "Historique des rééchelonnements, restructurations et reports d'échéance.",
    primaryKey: ["RESTR_ID"],
    foreignKeys: [],
    columns: [
      { name: "RESTR_ID", type: "VARCHAR2(15)", description: "Champ RESTR_ID pour BKPRT_RESTR" },
      { name: "DOSSIER_ID", type: "VARCHAR2(15)", description: "Champ DOSSIER_ID pour BKPRT_RESTR" },
      { name: "NOUV_ECHEANCE_FIN", type: "DATE", description: "Champ NOUV_ECHEANCE_FIN pour BKPRT_RESTR" },
      { name: "CAPITAL_RESTANT", type: "NUMBER(19,4)", description: "Champ CAPITAL_RESTANT pour BKPRT_RESTR" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_RESTR WHERE RESTR_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_RESTR du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_CONTENT",
    module: "Crédits & Financements",
    description: "Créances en souffrance, passage en contentieux et recouvrement judiciaire.",
    primaryKey: ["DOSSIER_ID"],
    foreignKeys: [],
    columns: [
      { name: "DOSSIER_ID", type: "VARCHAR2(15)", description: "Champ DOSSIER_ID pour BKPRT_CONTENT" },
      { name: "DATE_CONTENTIEUX", type: "DATE", description: "Champ DATE_CONTENTIEUX pour BKPRT_CONTENT" },
      { name: "AVOCAT_RESP", type: "VARCHAR2(35)", description: "Champ AVOCAT_RESP pour BKPRT_CONTENT" },
      { name: "PROVISION_SOUFFR", type: "NUMBER(19,4)", description: "Champ PROVISION_SOUFFR pour BKPRT_CONTENT" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_CONTENT WHERE DOSSIER_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_CONTENT du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_PENA",
    module: "Crédits & Financements",
    description: "Intérêts moratoires et pénalités de retard calculés automatiquement.",
    primaryKey: ["DOSSIER_ID", "NUM_ECH"],
    foreignKeys: [],
    columns: [
      { name: "DOSSIER_ID", type: "VARCHAR2(15)", description: "Champ DOSSIER_ID pour BKPRT_PENA" },
      { name: "NUM_ECH", type: "NUMBER(4)", description: "Champ NUM_ECH pour BKPRT_PENA" },
      { name: "TAUX_PENALITE", type: "NUMBER(5,3)", description: "Champ TAUX_PENALITE pour BKPRT_PENA" },
      { name: "MONTANT_PENA", type: "NUMBER(19,4)", description: "Champ MONTANT_PENA pour BKPRT_PENA" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_PENA WHERE DOSSIER_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_PENA du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_RBOURS",
    module: "Crédits & Financements",
    description: "Remboursements anticipés totaux ou partiels et indemnités IRA.",
    primaryKey: ["REMBOURSE_ID"],
    foreignKeys: [],
    columns: [
      { name: "REMBOURSE_ID", type: "VARCHAR2(15)", description: "Champ REMBOURSE_ID pour BKPRT_RBOURS" },
      { name: "DOSSIER_ID", type: "VARCHAR2(15)", description: "Champ DOSSIER_ID pour BKPRT_RBOURS" },
      { name: "DATE_PAIEMENT", type: "DATE", description: "Champ DATE_PAIEMENT pour BKPRT_RBOURS" },
      { name: "CAPITAL_REMBOURSE", type: "NUMBER(19,4)", description: "Champ CAPITAL_REMBOURSE pour BKPRT_RBOURS" },
      { name: "INDEMNITE_IRA", type: "NUMBER(15,2)", description: "Champ INDEMNITE_IRA pour BKPRT_RBOURS" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_RBOURS WHERE REMBOURSE_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_RBOURS du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_SYNDIC",
    module: "Crédits & Financements",
    description: "Crédits syndiqués, participations en pool bancaire et mandats de chef de file.",
    primaryKey: ["POOL_ID"],
    foreignKeys: [],
    columns: [
      { name: "POOL_ID", type: "VARCHAR2(15)", description: "Champ POOL_ID pour BKPRT_SYNDIC" },
      { name: "NOM_CONSORTIUM", type: "VARCHAR2(50)", description: "Champ NOM_CONSORTIUM pour BKPRT_SYNDIC" },
      { name: "PART_BANQUE_PCT", type: "NUMBER(5,2)", description: "Champ PART_BANQUE_PCT pour BKPRT_SYNDIC" },
      { name: "BANQUE_AGENT", type: "VARCHAR2(11)", description: "Champ BANQUE_AGENT pour BKPRT_SYNDIC" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_SYNDIC WHERE POOL_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_SYNDIC du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_LEASING",
    module: "Crédits & Financements",
    description: "Contrats de crédit-bail mobilier / immobilier et options d'achat.",
    primaryKey: ["LEASING_ID"],
    foreignKeys: [],
    columns: [
      { name: "LEASING_ID", type: "VARCHAR2(15)", description: "Champ LEASING_ID pour BKPRT_LEASING" },
      { name: "DESCRIPTION_BIEN", type: "VARCHAR2(60)", description: "Champ DESCRIPTION_BIEN pour BKPRT_LEASING" },
      { name: "VALEUR_RESIDUELLE", type: "NUMBER(19,4)", description: "Champ VALEUR_RESIDUELLE pour BKPRT_LEASING" },
      { name: "LOYER_PERIODIQUE", type: "NUMBER(15,2)", description: "Champ LOYER_PERIODIQUE pour BKPRT_LEASING" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_LEASING WHERE LEASING_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_LEASING du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_DECOU",
    module: "Crédits & Financements",
    description: "Autorisations de découverts en compte courant et facilités de caisse.",
    primaryKey: ["AGE", "NCP", "AUTORIS_ID"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKPRT_DECOU" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKPRT_DECOU" },
      { name: "AUTORIS_ID", type: "VARCHAR2(10)", description: "Champ AUTORIS_ID pour BKPRT_DECOU" },
      { name: "MONTANT_DECOU", type: "NUMBER(19,4)", description: "Champ MONTANT_DECOU pour BKPRT_DECOU" },
      { name: "DATE_EXPIRATION", type: "DATE", description: "Champ DATE_EXPIRATION pour BKPRT_DECOU" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_DECOU WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_DECOU du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_AVANCE",
    module: "Crédits & Financements",
    description: "Avances sur titres cotés, avances sur salaires et cautions sur marchés publics.",
    primaryKey: ["AVANCE_ID"],
    foreignKeys: [],
    columns: [
      { name: "AVANCE_ID", type: "VARCHAR2(15)", description: "Champ AVANCE_ID pour BKPRT_AVANCE" },
      { name: "CLI", type: "VARCHAR2(15)", description: "Champ CLI pour BKPRT_AVANCE" },
      { name: "NATURE_NANTISSEMENT", type: "VARCHAR2(20)", description: "Champ NATURE_NANTISSEMENT pour BKPRT_AVANCE" },
      { name: "VALEUR_COTE", type: "NUMBER(19,4)", description: "Champ VALEUR_COTE pour BKPRT_AVANCE" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_AVANCE WHERE AVANCE_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_AVANCE du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_SCORING",
    module: "Crédits & Financements",
    description: "Notes de solvabilité financière attribuées lors du scoring automatique.",
    primaryKey: ["DOSSIER_ID"],
    foreignKeys: [],
    columns: [
      { name: "DOSSIER_ID", type: "VARCHAR2(15)", description: "Champ DOSSIER_ID pour BKPRT_SCORING" },
      { name: "SCORE_GLOBAL", type: "NUMBER(3)", description: "Champ SCORE_GLOBAL pour BKPRT_SCORING" },
      { name: "CLASSE_RISQUE", type: "VARCHAR2(2)", description: "Champ CLASSE_RISQUE pour BKPRT_SCORING" },
      { name: "RECOMMANDATION", type: "VARCHAR2(10)", description: "Champ RECOMMANDATION pour BKPRT_SCORING" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_SCORING WHERE DOSSIER_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_SCORING du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_CAMPAGNE",
    module: "Crédits & Financements",
    description: "Offres promotionnelles de crédit conso et barèmes saisonniers.",
    primaryKey: ["CAMPAGNE_CODE"],
    foreignKeys: [],
    columns: [
      { name: "CAMPAGNE_CODE", type: "VARCHAR2(10)", description: "Champ CAMPAGNE_CODE pour BKPRT_CAMPAGNE" },
      { name: "NOM_CAMPAGNE", type: "VARCHAR2(40)", description: "Champ NOM_CAMPAGNE pour BKPRT_CAMPAGNE" },
      { name: "TAUX_PROMO_PCT", type: "NUMBER(5,3)", description: "Champ TAUX_PROMO_PCT pour BKPRT_CAMPAGNE" },
      { name: "DATE_FIN_OFFRE", type: "DATE", description: "Champ DATE_FIN_OFFRE pour BKPRT_CAMPAGNE" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_CAMPAGNE WHERE CAMPAGNE_CODE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_CAMPAGNE du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_SUBV",
    module: "Crédits & Financements",
    description: "Crédits bonifiés, prêts à taux zéro et subventions d'État.",
    primaryKey: ["DOSSIER_ID"],
    foreignKeys: [],
    columns: [
      { name: "DOSSIER_ID", type: "VARCHAR2(15)", description: "Champ DOSSIER_ID pour BKPRT_SUBV" },
      { name: "ORGANISME_SUBV", type: "VARCHAR2(30)", description: "Champ ORGANISME_SUBV pour BKPRT_SUBV" },
      { name: "TAUX_BONIFICATION", type: "NUMBER(5,3)", description: "Champ TAUX_BONIFICATION pour BKPRT_SUBV" },
      { name: "PRISE_EN_CHARGE_ETAT", type: "NUMBER(19,4)", description: "Champ PRISE_EN_CHARGE_ETAT pour BKPRT_SUBV" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_SUBV WHERE DOSSIER_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_SUBV du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_REFIN",
    module: "Crédits & Financements",
    description: "Créances mobilisées en refinancement auprès de la Banque Centrale.",
    primaryKey: ["DOSSIER_ID"],
    foreignKeys: [],
    columns: [
      { name: "DOSSIER_ID", type: "VARCHAR2(15)", description: "Champ DOSSIER_ID pour BKPRT_REFIN" },
      { name: "DATE_MOBILISATION", type: "DATE", description: "Champ DATE_MOBILISATION pour BKPRT_REFIN" },
      { name: "QUOTITE_MOBILISEE", type: "NUMBER(19,4)", description: "Champ QUOTITE_MOBILISEE pour BKPRT_REFIN" },
      { name: "ACCORD_BCE", type: "VARCHAR2(15)", description: "Champ ACCORD_BCE pour BKPRT_REFIN" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_REFIN WHERE DOSSIER_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_REFIN du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKPRT_RELANCE",
    module: "Crédits & Financements",
    description: "Courriers et SMS de mise en demeure pour impayés de crédit.",
    primaryKey: ["RELANCE_ID"],
    foreignKeys: [],
    columns: [
      { name: "RELANCE_ID", type: "VARCHAR2(15)", description: "Champ RELANCE_ID pour BKPRT_RELANCE" },
      { name: "DOSSIER_ID", type: "VARCHAR2(15)", description: "Champ DOSSIER_ID pour BKPRT_RELANCE" },
      { name: "NIVEAU_RELANCE", type: "NUMBER(1)", description: "Champ NIVEAU_RELANCE pour BKPRT_RELANCE" },
      { name: "DATE_ENVOI", type: "DATE", description: "Champ DATE_ENVOI pour BKPRT_RELANCE" },
      { name: "ACCUSE_RECEP", type: "VARCHAR2(1)", description: "Champ ACCUSE_RECEP pour BKPRT_RELANCE" }
    ],
    sampleQuery: "SELECT * FROM BKPRT_RELANCE WHERE RELANCE_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPRT_RELANCE du module Crédits & Financements dans Core Banking Amplitude."
  },
  {
    tableName: "BKDAT_CONTRAT",
    module: "Épargne & Placements",
    description: "Dépôts à terme (DAT), montant bloqué, durée et taux négocié.",
    primaryKey: ["DAT_REF"],
    foreignKeys: [],
    columns: [
      { name: "DAT_REF", type: "VARCHAR2(15)", description: "Champ DAT_REF pour BKDAT_CONTRAT" },
      { name: "CLI", type: "VARCHAR2(15)", description: "Champ CLI pour BKDAT_CONTRAT" },
      { name: "NCP_DEB", type: "VARCHAR2(11)", description: "Champ NCP_DEB pour BKDAT_CONTRAT" },
      { name: "MONTANT_PLACE", type: "NUMBER(19,4)", description: "Champ MONTANT_PLACE pour BKDAT_CONTRAT" },
      { name: "DUREE_MOIS", type: "NUMBER(3)", description: "Champ DUREE_MOIS pour BKDAT_CONTRAT" },
      { name: "TAUX_INTERET", type: "NUMBER(6,4)", description: "Champ TAUX_INTERET pour BKDAT_CONTRAT" }
    ],
    sampleQuery: "SELECT * FROM BKDAT_CONTRAT WHERE DAT_REF IS NOT NULL;",
    criticalNotes: "Table maîtresse BKDAT_CONTRAT du module Épargne & Placements dans Core Banking Amplitude."
  },
  {
    tableName: "BKDAT_ECH",
    module: "Épargne & Placements",
    description: "Échéancier de versement des intérêts de DAT (in fine ou périodique).",
    primaryKey: ["DAT_REF", "NUM_ECH"],
    foreignKeys: [],
    columns: [
      { name: "DAT_REF", type: "VARCHAR2(15)", description: "Champ DAT_REF pour BKDAT_ECH" },
      { name: "NUM_ECH", type: "NUMBER(3)", description: "Champ NUM_ECH pour BKDAT_ECH" },
      { name: "DATE_VERST", type: "DATE", description: "Champ DATE_VERST pour BKDAT_ECH" },
      { name: "MONTANT_BRUT", type: "NUMBER(19,4)", description: "Champ MONTANT_BRUT pour BKDAT_ECH" },
      { name: "TAXE_RETENUE", type: "NUMBER(19,4)", description: "Champ TAXE_RETENUE pour BKDAT_ECH" }
    ],
    sampleQuery: "SELECT * FROM BKDAT_ECH WHERE DAT_REF IS NOT NULL;",
    criticalNotes: "Table maîtresse BKDAT_ECH du module Épargne & Placements dans Core Banking Amplitude."
  },
  {
    tableName: "BKDAT_RUPT",
    module: "Épargne & Placements",
    description: "Ruptures anticipées de placements à terme et pénalités d'intérêts.",
    primaryKey: ["DAT_REF"],
    foreignKeys: [],
    columns: [
      { name: "DAT_REF", type: "VARCHAR2(15)", description: "Champ DAT_REF pour BKDAT_RUPT" },
      { name: "DATE_RESILIATION", type: "DATE", description: "Champ DATE_RESILIATION pour BKDAT_RUPT" },
      { name: "PENALITE_TAUX", type: "NUMBER(5,3)", description: "Champ PENALITE_TAUX pour BKDAT_RUPT" },
      { name: "MONTANT_RESTITUE", type: "NUMBER(19,4)", description: "Champ MONTANT_RESTITUE pour BKDAT_RUPT" }
    ],
    sampleQuery: "SELECT * FROM BKDAT_RUPT WHERE DAT_REF IS NOT NULL;",
    criticalNotes: "Table maîtresse BKDAT_RUPT du module Épargne & Placements dans Core Banking Amplitude."
  },
  {
    tableName: "BKBDC_BON",
    module: "Épargne & Placements",
    description: "Bons de caisse émis au porteur ou à ordre nominatifs.",
    primaryKey: ["BON_NUM"],
    foreignKeys: [],
    columns: [
      { name: "BON_NUM", type: "VARCHAR2(15)", description: "Champ BON_NUM pour BKBDC_BON" },
      { name: "VALEUR_NOMINALE", type: "NUMBER(19,4)", description: "Champ VALEUR_NOMINALE pour BKBDC_BON" },
      { name: "DATE_SOUSCRIPTION", type: "DATE", description: "Champ DATE_SOUSCRIPTION pour BKBDC_BON" },
      { name: "DATE_REMBOURSEMENT", type: "DATE", description: "Champ DATE_REMBOURSEMENT pour BKBDC_BON" },
      { name: "STATUT_BON", type: "VARCHAR2(1)", description: "Champ STATUT_BON pour BKBDC_BON" }
    ],
    sampleQuery: "SELECT * FROM BKBDC_BON WHERE BON_NUM IS NOT NULL;",
    criticalNotes: "Table maîtresse BKBDC_BON du module Épargne & Placements dans Core Banking Amplitude."
  },
  {
    tableName: "BKBDC_COUPON",
    module: "Épargne & Placements",
    description: "Paiement des coupons d'intérêts sur bons de caisse échus.",
    primaryKey: ["BON_NUM", "NUM_COUPON"],
    foreignKeys: [],
    columns: [
      { name: "BON_NUM", type: "VARCHAR2(15)", description: "Champ BON_NUM pour BKBDC_COUPON" },
      { name: "NUM_COUPON", type: "NUMBER(2)", description: "Champ NUM_COUPON pour BKBDC_COUPON" },
      { name: "MONTANT_COUPON", type: "NUMBER(19,4)", description: "Champ MONTANT_COUPON pour BKBDC_COUPON" },
      { name: "DATE_PAIEMENT", type: "DATE", description: "Champ DATE_PAIEMENT pour BKBDC_COUPON" }
    ],
    sampleQuery: "SELECT * FROM BKBDC_COUPON WHERE BON_NUM IS NOT NULL;",
    criticalNotes: "Table maîtresse BKBDC_COUPON du module Épargne & Placements dans Core Banking Amplitude."
  },
  {
    tableName: "BKEP_LIVRET",
    module: "Épargne & Placements",
    description: "Comptes sur livret d'épargne réglementée et quinzaines de calcul.",
    primaryKey: ["AGE", "NCP"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKEP_LIVRET" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKEP_LIVRET" },
      { name: "PLAFOND_LIVRET", type: "NUMBER(19,4)", description: "Champ PLAFOND_LIVRET pour BKEP_LIVRET" },
      { name: "INTERETS_ACQUIS", type: "NUMBER(19,4)", description: "Champ INTERETS_ACQUIS pour BKEP_LIVRET" },
      { name: "DATE_DERNIERE_CAPIT", type: "DATE", description: "Champ DATE_DERNIERE_CAPIT pour BKEP_LIVRET" }
    ],
    sampleQuery: "SELECT * FROM BKEP_LIVRET WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKEP_LIVRET du module Épargne & Placements dans Core Banking Amplitude."
  },
  {
    tableName: "BKEP_QUINZ",
    module: "Épargne & Placements",
    description: "Historique des soldes par quinzaine d'intérêts d'épargne.",
    primaryKey: ["AGE", "NCP", "NUM_QUINZAINE"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKEP_QUINZ" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKEP_QUINZ" },
      { name: "NUM_QUINZAINE", type: "VARCHAR2(6)", description: "Champ NUM_QUINZAINE pour BKEP_QUINZ" },
      { name: "SOLDE_QUINZAINE", type: "NUMBER(19,4)", description: "Champ SOLDE_QUINZAINE pour BKEP_QUINZ" }
    ],
    sampleQuery: "SELECT * FROM BKEP_QUINZ WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKEP_QUINZ du module Épargne & Placements dans Core Banking Amplitude."
  },
  {
    tableName: "BKEP_PLAN",
    module: "Épargne & Placements",
    description: "Plans d'épargne logement (PEL) et plans d'épargne retraite (PER).",
    primaryKey: ["PLAN_REF"],
    foreignKeys: [],
    columns: [
      { name: "PLAN_REF", type: "VARCHAR2(15)", description: "Champ PLAN_REF pour BKEP_PLAN" },
      { name: "CLI", type: "VARCHAR2(15)", description: "Champ CLI pour BKEP_PLAN" },
      { name: "VERSEMENT_REGULIER", type: "NUMBER(15,2)", description: "Champ VERSEMENT_REGULIER pour BKEP_PLAN" },
      { name: "DROITS_A_PRET", type: "NUMBER(19,4)", description: "Champ DROITS_A_PRET pour BKEP_PLAN" }
    ],
    sampleQuery: "SELECT * FROM BKEP_PLAN WHERE PLAN_REF IS NOT NULL;",
    criticalNotes: "Table maîtresse BKEP_PLAN du module Épargne & Placements dans Core Banking Amplitude."
  },
  {
    tableName: "BKOPC_PART",
    module: "Épargne & Placements",
    description: "Parts d'OPCVM, SICAV et FCP souscrites par les clients.",
    primaryKey: ["SOUSCRIP_ID"],
    foreignKeys: [],
    columns: [
      { name: "SOUSCRIP_ID", type: "VARCHAR2(15)", description: "Champ SOUSCRIP_ID pour BKOPC_PART" },
      { name: "CODE_ISIN", type: "VARCHAR2(12)", description: "Champ CODE_ISIN pour BKOPC_PART" },
      { name: "NB_PARTS", type: "NUMBER(12,4)", description: "Champ NB_PARTS pour BKOPC_PART" },
      { name: "PRIX_ACQUISITION", type: "NUMBER(15,4)", description: "Champ PRIX_ACQUISITION pour BKOPC_PART" }
    ],
    sampleQuery: "SELECT * FROM BKOPC_PART WHERE SOUSCRIP_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKOPC_PART du module Épargne & Placements dans Core Banking Amplitude."
  },
  {
    tableName: "BKOPC_VL",
    module: "Épargne & Placements",
    description: "Valeurs liquidatives quotidiennes des fonds d'investissement gérés.",
    primaryKey: ["CODE_ISIN", "DATE_VL"],
    foreignKeys: [],
    columns: [
      { name: "CODE_ISIN", type: "VARCHAR2(12)", description: "Champ CODE_ISIN pour BKOPC_VL" },
      { name: "DATE_VL", type: "DATE", description: "Champ DATE_VL pour BKOPC_VL" },
      { name: "VALEUR_LIQUIDATIVE", type: "NUMBER(15,4)", description: "Champ VALEUR_LIQUIDATIVE pour BKOPC_VL" },
      { name: "ACTIF_NET_FONDS", type: "NUMBER(19,4)", description: "Champ ACTIF_NET_FONDS pour BKOPC_VL" }
    ],
    sampleQuery: "SELECT * FROM BKOPC_VL WHERE CODE_ISIN IS NOT NULL;",
    criticalNotes: "Table maîtresse BKOPC_VL du module Épargne & Placements dans Core Banking Amplitude."
  },
  {
    tableName: "BKTITR_CPT",
    module: "Épargne & Placements",
    description: "Comptes-titres ordinaires et portefeuilles d'instruments financiers.",
    primaryKey: ["AGE", "NCP_TITRES"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKTITR_CPT" },
      { name: "NCP_TITRES", type: "VARCHAR2(11)", description: "Champ NCP_TITRES pour BKTITR_CPT" },
      { name: "VALORISATION_TOTALE", type: "NUMBER(19,4)", description: "Champ VALORISATION_TOTALE pour BKTITR_CPT" },
      { name: "DROITS_GARDE_AN", type: "NUMBER(15,2)", description: "Champ DROITS_GARDE_AN pour BKTITR_CPT" }
    ],
    sampleQuery: "SELECT * FROM BKTITR_CPT WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKTITR_CPT du module Épargne & Placements dans Core Banking Amplitude."
  },
  {
    tableName: "BKTITR_ORDRE",
    module: "Épargne & Placements",
    description: "Ordres de bourse transmis sur les marchés d'actions et obligations.",
    primaryKey: ["ORDRE_BOURSE_ID"],
    foreignKeys: [],
    columns: [
      { name: "ORDRE_BOURSE_ID", type: "VARCHAR2(15)", description: "Champ ORDRE_BOURSE_ID pour BKTITR_ORDRE" },
      { name: "CODE_ISIN", type: "VARCHAR2(12)", description: "Champ CODE_ISIN pour BKTITR_ORDRE" },
      { name: "SENS_ORDRE", type: "VARCHAR2(1)", description: "Champ SENS_ORDRE pour BKTITR_ORDRE" },
      { name: "QUANTITE", type: "NUMBER(8)", description: "Champ QUANTITE pour BKTITR_ORDRE" },
      { name: "COURS_LIMITE", type: "NUMBER(15,4)", description: "Champ COURS_LIMITE pour BKTITR_ORDRE" }
    ],
    sampleQuery: "SELECT * FROM BKTITR_ORDRE WHERE ORDRE_BOURSE_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKTITR_ORDRE du module Épargne & Placements dans Core Banking Amplitude."
  },
  {
    tableName: "BKTAX_PLACEM",
    module: "Épargne & Placements",
    description: "Prélèvements forfaitaires libératoires et retenues à la source sur placements.",
    primaryKey: ["ANNEE_FISCALE", "CLI"],
    foreignKeys: [],
    columns: [
      { name: "ANNEE_FISCALE", type: "NUMBER(4)", description: "Champ ANNEE_FISCALE pour BKTAX_PLACEM" },
      { name: "CLI", type: "VARCHAR2(15)", description: "Champ CLI pour BKTAX_PLACEM" },
      { name: "TOTAL_INTERETS_BRUTS", type: "NUMBER(19,4)", description: "Champ TOTAL_INTERETS_BRUTS pour BKTAX_PLACEM" },
      { name: "IRVM_RETENU", type: "NUMBER(19,4)", description: "Champ IRVM_RETENU pour BKTAX_PLACEM" }
    ],
    sampleQuery: "SELECT * FROM BKTAX_PLACEM WHERE ANNEE_FISCALE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKTAX_PLACEM du module Épargne & Placements dans Core Banking Amplitude."
  },
  {
    tableName: "BKCER_DEPOT",
    module: "Épargne & Placements",
    description: "Certificats de dépôt négociables émis sur le marché monétaire interbancaire.",
    primaryKey: ["CDN_ID"],
    foreignKeys: [],
    columns: [
      { name: "CDN_ID", type: "VARCHAR2(15)", description: "Champ CDN_ID pour BKCER_DEPOT" },
      { name: "SOUSCRIPTEUR_BANQUE", type: "VARCHAR2(11)", description: "Champ SOUSCRIPTEUR_BANQUE pour BKCER_DEPOT" },
      { name: "MONTANT_CDN", type: "NUMBER(19,4)", description: "Champ MONTANT_CDN pour BKCER_DEPOT" },
      { name: "TAUX_MONETAIRE", type: "NUMBER(6,4)", description: "Champ TAUX_MONETAIRE pour BKCER_DEPOT" }
    ],
    sampleQuery: "SELECT * FROM BKCER_DEPOT WHERE CDN_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCER_DEPOT du module Épargne & Placements dans Core Banking Amplitude."
  },
  {
    tableName: "BKCRE_IMP",
    module: "Commerce International",
    description: "Crédits documentaires import ouverts en faveur de fournisseurs étrangers.",
    primaryKey: ["CRED_ID"],
    foreignKeys: [],
    columns: [
      { name: "CRED_ID", type: "VARCHAR2(16)", description: "Champ CRED_ID pour BKCRE_IMP" },
      { name: "DONNEUR_ORDRE", type: "VARCHAR2(15)", description: "Champ DONNEUR_ORDRE pour BKCRE_IMP" },
      { name: "BENEFICIAIRE_NOM", type: "VARCHAR2(50)", description: "Champ BENEFICIAIRE_NOM pour BKCRE_IMP" },
      { name: "MONTANT", type: "NUMBER(19,4)", description: "Champ MONTANT pour BKCRE_IMP" },
      { name: "DEV", type: "VARCHAR2(3)", description: "Champ DEV pour BKCRE_IMP" },
      { name: "DATE_EXPIRATION", type: "DATE", description: "Champ DATE_EXPIRATION pour BKCRE_IMP" }
    ],
    sampleQuery: "SELECT * FROM BKCRE_IMP WHERE CRED_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCRE_IMP du module Commerce International dans Core Banking Amplitude."
  },
  {
    tableName: "BKCRE_EXP",
    module: "Commerce International",
    description: "Crédits documentaires export notifiés ou confirmés pour exportateurs locaux.",
    primaryKey: ["CRED_EXP_ID"],
    foreignKeys: [],
    columns: [
      { name: "CRED_EXP_ID", type: "VARCHAR2(16)", description: "Champ CRED_EXP_ID pour BKCRE_EXP" },
      { name: "BANQUE_EMETTRICE", type: "VARCHAR2(11)", description: "Champ BANQUE_EMETTRICE pour BKCRE_EXP" },
      { name: "MONTANT", type: "NUMBER(19,4)", description: "Champ MONTANT pour BKCRE_EXP" },
      { name: "CONFIRMATION_STATUT", type: "VARCHAR2(1)", description: "Champ CONFIRMATION_STATUT pour BKCRE_EXP" }
    ],
    sampleQuery: "SELECT * FROM BKCRE_EXP WHERE CRED_EXP_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCRE_EXP du module Commerce International dans Core Banking Amplitude."
  },
  {
    tableName: "BKCRE_UTIL",
    module: "Commerce International",
    description: "Levées de documents, utilisations partielles et règlements de crédocs.",
    primaryKey: ["UTIL_ID"],
    foreignKeys: [],
    columns: [
      { name: "UTIL_ID", type: "VARCHAR2(16)", description: "Champ UTIL_ID pour BKCRE_UTIL" },
      { name: "CRED_ID", type: "VARCHAR2(16)", description: "Champ CRED_ID pour BKCRE_UTIL" },
      { name: "MONTANT_LEVE", type: "NUMBER(19,4)", description: "Champ MONTANT_LEVE pour BKCRE_UTIL" },
      { name: "DATE_PAIEMENT", type: "DATE", description: "Champ DATE_PAIEMENT pour BKCRE_UTIL" },
      { name: "CONFORME_STATUT", type: "VARCHAR2(1)", description: "Champ CONFORME_STATUT pour BKCRE_UTIL" }
    ],
    sampleQuery: "SELECT * FROM BKCRE_UTIL WHERE UTIL_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCRE_UTIL du module Commerce International dans Core Banking Amplitude."
  },
  {
    tableName: "BKCRE_MODIF",
    module: "Commerce International",
    description: "Avenants et amendements aux crédits documentaires (prorogation, hausse montant).",
    primaryKey: ["CRED_ID", "NUM_AVENANT"],
    foreignKeys: [],
    columns: [
      { name: "CRED_ID", type: "VARCHAR2(16)", description: "Champ CRED_ID pour BKCRE_MODIF" },
      { name: "NUM_AVENANT", type: "NUMBER(2)", description: "Champ NUM_AVENANT pour BKCRE_MODIF" },
      { name: "MOTIF_AMENDEMENT", type: "VARCHAR2(40)", description: "Champ MOTIF_AMENDEMENT pour BKCRE_MODIF" },
      { name: "DIFF_MONTANT", type: "NUMBER(19,4)", description: "Champ DIFF_MONTANT pour BKCRE_MODIF" }
    ],
    sampleQuery: "SELECT * FROM BKCRE_MODIF WHERE CRED_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCRE_MODIF du module Commerce International dans Core Banking Amplitude."
  },
  {
    tableName: "BKREM_IMP",
    module: "Commerce International",
    description: "Remises documentaires import reçues à l'encaissement (D/P, D/A).",
    primaryKey: ["REMDOC_ID"],
    foreignKeys: [],
    columns: [
      { name: "REMDOC_ID", type: "VARCHAR2(16)", description: "Champ REMDOC_ID pour BKREM_IMP" },
      { name: "TIREUR_NOM", type: "VARCHAR2(45)", description: "Champ TIREUR_NOM pour BKREM_IMP" },
      { name: "TIRE_CLI", type: "VARCHAR2(15)", description: "Champ TIRE_CLI pour BKREM_IMP" },
      { name: "CONDITIONS_LIVRAISON", type: "VARCHAR2(3)", description: "Champ CONDITIONS_LIVRAISON pour BKREM_IMP" }
    ],
    sampleQuery: "SELECT * FROM BKREM_IMP WHERE REMDOC_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKREM_IMP du module Commerce International dans Core Banking Amplitude."
  },
  {
    tableName: "BKREM_EXP",
    module: "Commerce International",
    description: "Remises documentaires export transmises aux correspondants bancaires.",
    primaryKey: ["REMDOC_EXP_ID"],
    foreignKeys: [],
    columns: [
      { name: "REMDOC_EXP_ID", type: "VARCHAR2(16)", description: "Champ REMDOC_EXP_ID pour BKREM_EXP" },
      { name: "CLIENT_LOCAL", type: "VARCHAR2(15)", description: "Champ CLIENT_LOCAL pour BKREM_EXP" },
      { name: "BANQUE_DEST", type: "VARCHAR2(11)", description: "Champ BANQUE_DEST pour BKREM_EXP" },
      { name: "MONTANT", type: "NUMBER(19,4)", description: "Champ MONTANT pour BKREM_EXP" }
    ],
    sampleQuery: "SELECT * FROM BKREM_EXP WHERE REMDOC_EXP_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKREM_EXP du module Commerce International dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAU_MARCHE",
    module: "Commerce International",
    description: "Cautions sur marchés publics (Soumission, Bonne fin, Avance de démarrage).",
    primaryKey: ["CAUTION_ID"],
    foreignKeys: [],
    columns: [
      { name: "CAUTION_ID", type: "VARCHAR2(16)", description: "Champ CAUTION_ID pour BKCAU_MARCHE" },
      { name: "CLI_SOUMISSIONNAIRE", type: "VARCHAR2(15)", description: "Champ CLI_SOUMISSIONNAIRE pour BKCAU_MARCHE" },
      { name: "BENEFICIAIRE_ETAT", type: "VARCHAR2(50)", description: "Champ BENEFICIAIRE_ETAT pour BKCAU_MARCHE" },
      { name: "MONTANT_CAUTIONNE", type: "NUMBER(19,4)", description: "Champ MONTANT_CAUTIONNE pour BKCAU_MARCHE" }
    ],
    sampleQuery: "SELECT * FROM BKCAU_MARCHE WHERE CAUTION_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAU_MARCHE du module Commerce International dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAU_DOUANE",
    module: "Commerce International",
    description: "Crédits d'enlèvement en douane et cautions auprès de l'administration des douanes.",
    primaryKey: ["CAU_DOUANE_ID"],
    foreignKeys: [],
    columns: [
      { name: "CAU_DOUANE_ID", type: "VARCHAR2(16)", description: "Champ CAU_DOUANE_ID pour BKCAU_DOUANE" },
      { name: "DECLARANT_CLI", type: "VARCHAR2(15)", description: "Champ DECLARANT_CLI pour BKCAU_DOUANE" },
      { name: "BUREAU_DOUANE", type: "VARCHAR2(20)", description: "Champ BUREAU_DOUANE pour BKCAU_DOUANE" },
      { name: "PLAFOND_ENLEVEMENT", type: "NUMBER(19,4)", description: "Champ PLAFOND_ENLEVEMENT pour BKCAU_DOUANE" }
    ],
    sampleQuery: "SELECT * FROM BKCAU_DOUANE WHERE CAU_DOUANE_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAU_DOUANE du module Commerce International dans Core Banking Amplitude."
  },
  {
    tableName: "BKCAU_AVAL",
    module: "Commerce International",
    description: "Avals bancaires donnés sur traites de commerce et engagements par signature.",
    primaryKey: ["AVAL_ID"],
    foreignKeys: [],
    columns: [
      { name: "AVAL_ID", type: "VARCHAR2(16)", description: "Champ AVAL_ID pour BKCAU_AVAL" },
      { name: "BENEFICIAIRE", type: "VARCHAR2(45)", description: "Champ BENEFICIAIRE pour BKCAU_AVAL" },
      { name: "MONTANT_AVAL", type: "NUMBER(19,4)", description: "Champ MONTANT_AVAL pour BKCAU_AVAL" },
      { name: "ECHEANCE_AVAL", type: "DATE", description: "Champ ECHEANCE_AVAL pour BKCAU_AVAL" }
    ],
    sampleQuery: "SELECT * FROM BKCAU_AVAL WHERE AVAL_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCAU_AVAL du module Commerce International dans Core Banking Amplitude."
  },
  {
    tableName: "BKCRE_COMM",
    module: "Commerce International",
    description: "Commissions d'ouverture, d'engagement et de paiement sur opérations trade.",
    primaryKey: ["CRED_ID", "TYPE_FRAIS"],
    foreignKeys: [],
    columns: [
      { name: "CRED_ID", type: "VARCHAR2(16)", description: "Champ CRED_ID pour BKCRE_COMM" },
      { name: "TYPE_FRAIS", type: "VARCHAR2(5)", description: "Champ TYPE_FRAIS pour BKCRE_COMM" },
      { name: "MONTANT_COMM", type: "NUMBER(15,2)", description: "Champ MONTANT_COMM pour BKCRE_COMM" },
      { name: "COMPTE_PRELEV", type: "VARCHAR2(11)", description: "Champ COMPTE_PRELEV pour BKCRE_COMM" }
    ],
    sampleQuery: "SELECT * FROM BKCRE_COMM WHERE CRED_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCRE_COMM du module Commerce International dans Core Banking Amplitude."
  },
  {
    tableName: "BKCRE_LITIG",
    module: "Commerce International",
    description: "Discrépances, réserves documentaires et litiges de conformité UCP 600.",
    primaryKey: ["LITIGE_ID"],
    foreignKeys: [],
    columns: [
      { name: "LITIGE_ID", type: "VARCHAR2(15)", description: "Champ LITIGE_ID pour BKCRE_LITIG" },
      { name: "CRED_ID", type: "VARCHAR2(16)", description: "Champ CRED_ID pour BKCRE_LITIG" },
      { name: "DESCRIPTION_DISCREPANCE", type: "VARCHAR2(80)", description: "Champ DESCRIPTION_DISCREPANCE pour BKCRE_LITIG" },
      { name: "LEVE_RESERVES", type: "VARCHAR2(1)", description: "Champ LEVE_RESERVES pour BKCRE_LITIG" }
    ],
    sampleQuery: "SELECT * FROM BKCRE_LITIG WHERE LITIGE_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCRE_LITIG du module Commerce International dans Core Banking Amplitude."
  },
  {
    tableName: "BKCORR_LIMIT",
    module: "Commerce International",
    description: "Lignes de crédit et plafonds de risque accordés aux banques correspondantes.",
    primaryKey: ["CORRESPONDANT_BIC"],
    foreignKeys: [],
    columns: [
      { name: "CORRESPONDANT_BIC", type: "VARCHAR2(11)", description: "Champ CORRESPONDANT_BIC pour BKCORR_LIMIT" },
      { name: "LIMITE_CREDIT", type: "NUMBER(19,4)", description: "Champ LIMITE_CREDIT pour BKCORR_LIMIT" },
      { name: "ENCOURS_ENGAGE", type: "NUMBER(19,4)", description: "Champ ENCOURS_ENGAGE pour BKCORR_LIMIT" },
      { name: "NOTATION_MOODYS", type: "VARCHAR2(4)", description: "Champ NOTATION_MOODYS pour BKCORR_LIMIT" }
    ],
    sampleQuery: "SELECT * FROM BKCORR_LIMIT WHERE CORRESPONDANT_BIC IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCORR_LIMIT du module Commerce International dans Core Banking Amplitude."
  },
  {
    tableName: "BKCORR_NOSTRO",
    module: "Commerce International",
    description: "Comptes Nostro détenus auprès de correspondants en devises étrangères.",
    primaryKey: ["NOSTRO_ID"],
    foreignKeys: [],
    columns: [
      { name: "NOSTRO_ID", type: "VARCHAR2(10)", description: "Champ NOSTRO_ID pour BKCORR_NOSTRO" },
      { name: "BIC_CORRESPONDANT", type: "VARCHAR2(11)", description: "Champ BIC_CORRESPONDANT pour BKCORR_NOSTRO" },
      { name: "DEVISE_COMPTE", type: "VARCHAR2(3)", description: "Champ DEVISE_COMPTE pour BKCORR_NOSTRO" },
      { name: "SOLDE_COMPTABLE", type: "NUMBER(19,4)", description: "Champ SOLDE_COMPTABLE pour BKCORR_NOSTRO" }
    ],
    sampleQuery: "SELECT * FROM BKCORR_NOSTRO WHERE NOSTRO_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCORR_NOSTRO du module Commerce International dans Core Banking Amplitude."
  },
  {
    tableName: "BKCORR_LORO",
    module: "Commerce International",
    description: "Comptes Loro ouverts dans les livres de la banque pour des confrères.",
    primaryKey: ["LORO_ID"],
    foreignKeys: [],
    columns: [
      { name: "LORO_ID", type: "VARCHAR2(10)", description: "Champ LORO_ID pour BKCORR_LORO" },
      { name: "BANQUE_CLIENTE", type: "VARCHAR2(11)", description: "Champ BANQUE_CLIENTE pour BKCORR_LORO" },
      { name: "SOLDE_DISPONIBLE", type: "NUMBER(19,4)", description: "Champ SOLDE_DISPONIBLE pour BKCORR_LORO" },
      { name: "CONVENTION_TARIF", type: "VARCHAR2(6)", description: "Champ CONVENTION_TARIF pour BKCORR_LORO" }
    ],
    sampleQuery: "SELECT * FROM BKCORR_LORO WHERE LORO_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCORR_LORO du module Commerce International dans Core Banking Amplitude."
  },
  {
    tableName: "BKCHA_PLAN",
    module: "Comptabilité Générale",
    description: "Plan de comptes général détaillé (Classes 1 à 8 conformes plan comptable).",
    primaryKey: ["CHA"],
    foreignKeys: [],
    columns: [
      { name: "CHA", type: "VARCHAR2(6)", description: "Champ CHA pour BKCHA_PLAN" },
      { name: "INTITULE_COMPTE", type: "VARCHAR2(50)", description: "Champ INTITULE_COMPTE pour BKCHA_PLAN" },
      { name: "CLASSE_COMPTABLE", type: "VARCHAR2(1)", description: "Champ CLASSE_COMPTABLE pour BKCHA_PLAN" },
      { name: "SENS_NORMAL", type: "VARCHAR2(1)", description: "Champ SENS_NORMAL pour BKCHA_PLAN" }
    ],
    sampleQuery: "SELECT * FROM BKCHA_PLAN WHERE CHA IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCHA_PLAN du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKCHA_PARAM",
    module: "Comptabilité Générale",
    description: "Paramètres de centralisation, lettrage automatique et rapprochement.",
    primaryKey: ["CHA"],
    foreignKeys: [],
    columns: [
      { name: "CHA", type: "VARCHAR2(6)", description: "Champ CHA pour BKCHA_PARAM" },
      { name: "COMPTE_CENTRALISATEUR", type: "VARCHAR2(6)", description: "Champ COMPTE_CENTRALISATEUR pour BKCHA_PARAM" },
      { name: "LETTRAGE_OBLIG", type: "VARCHAR2(1)", description: "Champ LETTRAGE_OBLIG pour BKCHA_PARAM" },
      { name: "AUTORISE_MANUEL", type: "VARCHAR2(1)", description: "Champ AUTORISE_MANUEL pour BKCHA_PARAM" }
    ],
    sampleQuery: "SELECT * FROM BKCHA_PARAM WHERE CHA IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCHA_PARAM du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKJOU_CODE",
    module: "Comptabilité Générale",
    description: "Codes journaux comptables d'imputation (Caisse, Achats, OD, Virements).",
    primaryKey: ["CODE_JOURNAL"],
    foreignKeys: [],
    columns: [
      { name: "CODE_JOURNAL", type: "VARCHAR2(3)", description: "Champ CODE_JOURNAL pour BKJOU_CODE" },
      { name: "LIBELLE_JOURNAL", type: "VARCHAR2(35)", description: "Champ LIBELLE_JOURNAL pour BKJOU_CODE" },
      { name: "TYPE_JOURNAL", type: "VARCHAR2(2)", description: "Champ TYPE_JOURNAL pour BKJOU_CODE" }
    ],
    sampleQuery: "SELECT * FROM BKJOU_CODE WHERE CODE_JOURNAL IS NOT NULL;",
    criticalNotes: "Table maîtresse BKJOU_CODE du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKECR_PIECE",
    module: "Comptabilité Générale",
    description: "Numérotation chronologique des pièces comptables et justificatifs d'écriture.",
    primaryKey: ["NUM_PIECE", "ANNEE_COMPTABLE"],
    foreignKeys: [],
    columns: [
      { name: "NUM_PIECE", type: "VARCHAR2(15)", description: "Champ NUM_PIECE pour BKECR_PIECE" },
      { name: "ANNEE_COMPTABLE", type: "NUMBER(4)", description: "Champ ANNEE_COMPTABLE pour BKECR_PIECE" },
      { name: "DCO_PIECE", type: "DATE", description: "Champ DCO_PIECE pour BKECR_PIECE" },
      { name: "TOTAL_DEBIT", type: "NUMBER(19,4)", description: "Champ TOTAL_DEBIT pour BKECR_PIECE" }
    ],
    sampleQuery: "SELECT * FROM BKECR_PIECE WHERE NUM_PIECE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKECR_PIECE du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKCOM_AUXIL",
    module: "Comptabilité Générale",
    description: "Balances auxiliaires des tiers (fournisseurs d'exploitation, personnel).",
    primaryKey: ["COMPTE_GENERAL", "TIERS_ID"],
    foreignKeys: [],
    columns: [
      { name: "COMPTE_GENERAL", type: "VARCHAR2(6)", description: "Champ COMPTE_GENERAL pour BKCOM_AUXIL" },
      { name: "TIERS_ID", type: "VARCHAR2(15)", description: "Champ TIERS_ID pour BKCOM_AUXIL" },
      { name: "SOLDE_AUXIL", type: "NUMBER(19,4)", description: "Champ SOLDE_AUXIL pour BKCOM_AUXIL" }
    ],
    sampleQuery: "SELECT * FROM BKCOM_AUXIL WHERE COMPTE_GENERAL IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCOM_AUXIL du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKLET_MATCH",
    module: "Comptabilité Générale",
    description: "Lignes d'écritures lettrées et références de pointage comptable.",
    primaryKey: ["NUM_LETTRAGE"],
    foreignKeys: [],
    columns: [
      { name: "NUM_LETTRAGE", type: "VARCHAR2(12)", description: "Champ NUM_LETTRAGE pour BKLET_MATCH" },
      { name: "ECRITURE_ID_1", type: "NUMBER(10)", description: "Champ ECRITURE_ID_1 pour BKLET_MATCH" },
      { name: "ECRITURE_ID_2", type: "NUMBER(10)", description: "Champ ECRITURE_ID_2 pour BKLET_MATCH" },
      { name: "DATE_LETTRAGE", type: "DATE", description: "Champ DATE_LETTRAGE pour BKLET_MATCH" }
    ],
    sampleQuery: "SELECT * FROM BKLET_MATCH WHERE NUM_LETTRAGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKLET_MATCH du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKEOD_JOURN",
    module: "Comptabilité Générale",
    description: "Calendrier des journées comptables (ouvertes, clôturées, archivées).",
    primaryKey: ["DCO"],
    foreignKeys: [],
    columns: [
      { name: "DCO", type: "DATE", description: "Champ DCO pour BKEOD_JOURN" },
      { name: "STATUT_JOURNEE", type: "VARCHAR2(1)", description: "Champ STATUT_JOURNEE pour BKEOD_JOURN" },
      { name: "DATE_HEURE_OUVERTURE", type: "TIMESTAMP", description: "Champ DATE_HEURE_OUVERTURE pour BKEOD_JOURN" },
      { name: "DATE_HEURE_CLOTURE", type: "TIMESTAMP", description: "Champ DATE_HEURE_CLOTURE pour BKEOD_JOURN" }
    ],
    sampleQuery: "SELECT * FROM BKEOD_JOURN WHERE DCO IS NOT NULL;",
    criticalNotes: "Table maîtresse BKEOD_JOURN du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKEOD_CYCLE",
    module: "Comptabilité Générale",
    description: "Séquencement des traitements batch de nuit de la chaîne EOD.",
    primaryKey: ["ETAPE_SEQ"],
    foreignKeys: [],
    columns: [
      { name: "ETAPE_SEQ", type: "NUMBER(3)", description: "Champ ETAPE_SEQ pour BKEOD_CYCLE" },
      { name: "NOM_SCRIPT_BATCH", type: "VARCHAR2(30)", description: "Champ NOM_SCRIPT_BATCH pour BKEOD_CYCLE" },
      { name: "DUREE_MAX_MINUTES", type: "NUMBER(3)", description: "Champ DUREE_MAX_MINUTES pour BKEOD_CYCLE" },
      { name: "BLOCAGE_ON_ERROR", type: "VARCHAR2(1)", description: "Champ BLOCAGE_ON_ERROR pour BKEOD_CYCLE" }
    ],
    sampleQuery: "SELECT * FROM BKEOD_CYCLE WHERE ETAPE_SEQ IS NOT NULL;",
    criticalNotes: "Table maîtresse BKEOD_CYCLE du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKEOD_ALERTE",
    module: "Comptabilité Générale",
    description: "Anomalies comptables relevées en fin de journée avant basculement J+1.",
    primaryKey: ["ALERTE_ID"],
    foreignKeys: [],
    columns: [
      { name: "ALERTE_ID", type: "NUMBER(8)", description: "Champ ALERTE_ID pour BKEOD_ALERTE" },
      { name: "SEVERITE", type: "VARCHAR2(10)", description: "Champ SEVERITE pour BKEOD_ALERTE" },
      { name: "DESCRIPTION_ANOMALIE", type: "VARCHAR2(80)", description: "Champ DESCRIPTION_ANOMALIE pour BKEOD_ALERTE" },
      { name: "ACQUITTEMENT_USER", type: "VARCHAR2(10)", description: "Champ ACQUITTEMENT_USER pour BKEOD_ALERTE" }
    ],
    sampleQuery: "SELECT * FROM BKEOD_ALERTE WHERE ALERTE_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKEOD_ALERTE du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKIMM_IMMOB",
    module: "Comptabilité Générale",
    description: "Actifs immobilisés de la banque, amortissements et dotations annuelles.",
    primaryKey: ["IMMOB_ID"],
    foreignKeys: [],
    columns: [
      { name: "IMMOB_ID", type: "VARCHAR2(12)", description: "Champ IMMOB_ID pour BKIMM_IMMOB" },
      { name: "DESIGNATION", type: "VARCHAR2(50)", description: "Champ DESIGNATION pour BKIMM_IMMOB" },
      { name: "VALEUR_ORIGINE", type: "NUMBER(19,4)", description: "Champ VALEUR_ORIGINE pour BKIMM_IMMOB" },
      { name: "TAUX_AMORT_PCT", type: "NUMBER(5,2)", description: "Champ TAUX_AMORT_PCT pour BKIMM_IMMOB" }
    ],
    sampleQuery: "SELECT * FROM BKIMM_IMMOB WHERE IMMOB_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKIMM_IMMOB du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKIMM_AMORT",
    module: "Comptabilité Générale",
    description: "Tableau d'amortissement comptable et fiscal des immobilisations.",
    primaryKey: ["IMMOB_ID", "ANNEE"],
    foreignKeys: [],
    columns: [
      { name: "IMMOB_ID", type: "VARCHAR2(12)", description: "Champ IMMOB_ID pour BKIMM_AMORT" },
      { name: "ANNEE", type: "NUMBER(4)", description: "Champ ANNEE pour BKIMM_AMORT" },
      { name: "DOTATION_EXERCICE", type: "NUMBER(19,4)", description: "Champ DOTATION_EXERCICE pour BKIMM_AMORT" },
      { name: "VNC_CLOTURE", type: "NUMBER(19,4)", description: "Champ VNC_CLOTURE pour BKIMM_AMORT" }
    ],
    sampleQuery: "SELECT * FROM BKIMM_AMORT WHERE IMMOB_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKIMM_AMORT du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKBUD_CENTRE",
    module: "Comptabilité Générale",
    description: "Centres de coûts analytiques et contrôle de gestion budgétaire.",
    primaryKey: ["CENTRE_COUT"],
    foreignKeys: [],
    columns: [
      { name: "CENTRE_COUT", type: "VARCHAR2(8)", description: "Champ CENTRE_COUT pour BKBUD_CENTRE" },
      { name: "LIBELLE_CENTRE", type: "VARCHAR2(40)", description: "Champ LIBELLE_CENTRE pour BKBUD_CENTRE" },
      { name: "DIRECTION_RESP", type: "VARCHAR2(30)", description: "Champ DIRECTION_RESP pour BKBUD_CENTRE" }
    ],
    sampleQuery: "SELECT * FROM BKBUD_CENTRE WHERE CENTRE_COUT IS NOT NULL;",
    criticalNotes: "Table maîtresse BKBUD_CENTRE du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKBUD_ALLOC",
    module: "Comptabilité Générale",
    description: "Budgets alloués annuels et consommations mensuelles constatées.",
    primaryKey: ["CENTRE_COUT", "ANNEE", "MOIS"],
    foreignKeys: [],
    columns: [
      { name: "CENTRE_COUT", type: "VARCHAR2(8)", description: "Champ CENTRE_COUT pour BKBUD_ALLOC" },
      { name: "ANNEE", type: "NUMBER(4)", description: "Champ ANNEE pour BKBUD_ALLOC" },
      { name: "MOIS", type: "NUMBER(2)", description: "Champ MOIS pour BKBUD_ALLOC" },
      { name: "BUDGET_PREVU", type: "NUMBER(19,4)", description: "Champ BUDGET_PREVU pour BKBUD_ALLOC" },
      { name: "DEPENSE_REELLE", type: "NUMBER(19,4)", description: "Champ DEPENSE_REELLE pour BKBUD_ALLOC" }
    ],
    sampleQuery: "SELECT * FROM BKBUD_ALLOC WHERE CENTRE_COUT IS NOT NULL;",
    criticalNotes: "Table maîtresse BKBUD_ALLOC du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKPAYS_RISQ",
    module: "Comptabilité Générale",
    description: "Provisions pour risque-pays sur créances souveraines étrangères.",
    primaryKey: ["CODE_PAYS"],
    foreignKeys: [],
    columns: [
      { name: "CODE_PAYS", type: "VARCHAR2(3)", description: "Champ CODE_PAYS pour BKPAYS_RISQ" },
      { name: "TAUX_PROVISION_PCT", type: "NUMBER(5,2)", description: "Champ TAUX_PROVISION_PCT pour BKPAYS_RISQ" },
      { name: "CLASSE_OCDE", type: "NUMBER(1)", description: "Champ CLASSE_OCDE pour BKPAYS_RISQ" }
    ],
    sampleQuery: "SELECT * FROM BKPAYS_RISQ WHERE CODE_PAYS IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPAYS_RISQ du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKCONV_PROV",
    module: "Comptabilité Générale",
    description: "Provisions collectives IFRS 9 pour pertes de crédit attendues (ECL Stage 1/2/3).",
    primaryKey: ["STAGE_IFRS9", "PORTEFEUILLE"],
    foreignKeys: [],
    columns: [
      { name: "STAGE_IFRS9", type: "VARCHAR2(2)", description: "Champ STAGE_IFRS9 pour BKCONV_PROV" },
      { name: "PORTEFEUILLE", type: "VARCHAR2(10)", description: "Champ PORTEFEUILLE pour BKCONV_PROV" },
      { name: "PD_PCT", type: "NUMBER(6,4)", description: "Champ PD_PCT pour BKCONV_PROV" },
      { name: "LGD_PCT", type: "NUMBER(5,2)", description: "Champ LGD_PCT pour BKCONV_PROV" },
      { name: "ECL_MONTANT", type: "NUMBER(19,4)", description: "Champ ECL_MONTANT pour BKCONV_PROV" }
    ],
    sampleQuery: "SELECT * FROM BKCONV_PROV WHERE STAGE_IFRS9 IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCONV_PROV du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKDEV_REEVAL",
    module: "Comptabilité Générale",
    description: "Résultats de réévaluation de change latents lors de l'arrêté mensuel.",
    primaryKey: ["DEV", "MOIS_ANNEE"],
    foreignKeys: [],
    columns: [
      { name: "DEV", type: "VARCHAR2(3)", description: "Champ DEV pour BKDEV_REEVAL" },
      { name: "MOIS_ANNEE", type: "VARCHAR2(6)", description: "Champ MOIS_ANNEE pour BKDEV_REEVAL" },
      { name: "PLUS_VALUE_LATENTE", type: "NUMBER(19,4)", description: "Champ PLUS_VALUE_LATENTE pour BKDEV_REEVAL" },
      { name: "MOINS_VALUE_LATENTE", type: "NUMBER(19,4)", description: "Champ MOINS_VALUE_LATENTE pour BKDEV_REEVAL" }
    ],
    sampleQuery: "SELECT * FROM BKDEV_REEVAL WHERE DEV IS NOT NULL;",
    criticalNotes: "Table maîtresse BKDEV_REEVAL du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKFUS_BANQ",
    module: "Comptabilité Générale",
    description: "Écritures de consolidation groupe et retraitements inter-sociétés.",
    primaryKey: ["ECRITURE_CONSO_ID"],
    foreignKeys: [],
    columns: [
      { name: "ECRITURE_CONSO_ID", type: "VARCHAR2(15)", description: "Champ ECRITURE_CONSO_ID pour BKFUS_BANQ" },
      { name: "SOCIETE_MERE", type: "VARCHAR2(5)", description: "Champ SOCIETE_MERE pour BKFUS_BANQ" },
      { name: "FILIALE_CONCERNEE", type: "VARCHAR2(5)", description: "Champ FILIALE_CONCERNEE pour BKFUS_BANQ" },
      { name: "MONTANT_ELIMINE", type: "NUMBER(19,4)", description: "Champ MONTANT_ELIMINE pour BKFUS_BANQ" }
    ],
    sampleQuery: "SELECT * FROM BKFUS_BANQ WHERE ECRITURE_CONSO_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKFUS_BANQ du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKARCH_COMP",
    module: "Comptabilité Générale",
    description: "Tables d'archives pluriannuelles des grands livres pour contrôle fiscal 10 ans.",
    primaryKey: ["EXERCICE_COMPTABLE"],
    foreignKeys: [],
    columns: [
      { name: "EXERCICE_COMPTABLE", type: "NUMBER(4)", description: "Champ EXERCICE_COMPTABLE pour BKARCH_COMP" },
      { name: "DATE_ARCHIVAGE", type: "DATE", description: "Champ DATE_ARCHIVAGE pour BKARCH_COMP" },
      { name: "HASH_INTEGRITE_SHA256", type: "VARCHAR2(64)", description: "Champ HASH_INTEGRITE_SHA256 pour BKARCH_COMP" }
    ],
    sampleQuery: "SELECT * FROM BKARCH_COMP WHERE EXERCICE_COMPTABLE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKARCH_COMP du module Comptabilité Générale dans Core Banking Amplitude."
  },
  {
    tableName: "BKCLI_RELAT",
    module: "Clientèle & KYC",
    description: "Relations entre clients (conjoint, cautionnaire, associé, filiale).",
    primaryKey: ["CLI_SOURCE", "CLI_CIBLE"],
    foreignKeys: [],
    columns: [
      { name: "CLI_SOURCE", type: "VARCHAR2(15)", description: "Champ CLI_SOURCE pour BKCLI_RELAT" },
      { name: "CLI_CIBLE", type: "VARCHAR2(15)", description: "Champ CLI_CIBLE pour BKCLI_RELAT" },
      { name: "NATURE_LIEN", type: "VARCHAR2(3)", description: "Champ NATURE_LIEN pour BKCLI_RELAT" }
    ],
    sampleQuery: "SELECT * FROM BKCLI_RELAT WHERE CLI_SOURCE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCLI_RELAT du module Clientèle & KYC dans Core Banking Amplitude."
  },
  {
    tableName: "BKCLI_ALERT",
    module: "Clientèle & KYC",
    description: "Alertes LAB/AML pour détection de transactions atypiques ou soupçonnées.",
    primaryKey: ["ALERTE_AML_ID"],
    foreignKeys: [],
    columns: [
      { name: "ALERTE_AML_ID", type: "VARCHAR2(15)", description: "Champ ALERTE_AML_ID pour BKCLI_ALERT" },
      { name: "CLI", type: "VARCHAR2(15)", description: "Champ CLI pour BKCLI_ALERT" },
      { name: "SCENARIO_FRAUDE", type: "VARCHAR2(20)", description: "Champ SCENARIO_FRAUDE pour BKCLI_ALERT" },
      { name: "SCORE_ANOMALIE", type: "NUMBER(3)", description: "Champ SCORE_ANOMALIE pour BKCLI_ALERT" },
      { name: "STATUS_ENQUETE", type: "VARCHAR2(1)", description: "Champ STATUS_ENQUETE pour BKCLI_ALERT" }
    ],
    sampleQuery: "SELECT * FROM BKCLI_ALERT WHERE ALERTE_AML_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCLI_ALERT du module Clientèle & KYC dans Core Banking Amplitude."
  },
  {
    tableName: "BKCLI_REGIST",
    module: "Clientèle & KYC",
    description: "Déclarations de soupçon transmises à la cellule de renseignement financier.",
    primaryKey: ["DECLARATION_REF"],
    foreignKeys: [],
    columns: [
      { name: "DECLARATION_REF", type: "VARCHAR2(20)", description: "Champ DECLARATION_REF pour BKCLI_REGIST" },
      { name: "DATE_SIGNALEMENT", type: "DATE", description: "Champ DATE_SIGNALEMENT pour BKCLI_REGIST" },
      { name: "OFFICIER_CONFORMITE", type: "VARCHAR2(10)", description: "Champ OFFICIER_CONFORMITE pour BKCLI_REGIST" },
      { name: "STATUT_TRAITEMENT", type: "VARCHAR2(1)", description: "Champ STATUT_TRAITEMENT pour BKCLI_REGIST" }
    ],
    sampleQuery: "SELECT * FROM BKCLI_REGIST WHERE DECLARATION_REF IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCLI_REGIST du module Clientèle & KYC dans Core Banking Amplitude."
  },
  {
    tableName: "BKCLI_PIECE",
    module: "Clientèle & KYC",
    description: "Justificatifs d'identité numérisés (CNI, Passeport, Statuts juridiques).",
    primaryKey: ["CLI", "TYPE_PIECE"],
    foreignKeys: [],
    columns: [
      { name: "CLI", type: "VARCHAR2(15)", description: "Champ CLI pour BKCLI_PIECE" },
      { name: "TYPE_PIECE", type: "VARCHAR2(5)", description: "Champ TYPE_PIECE pour BKCLI_PIECE" },
      { name: "NUM_DOCUMENT", type: "VARCHAR2(30)", description: "Champ NUM_DOCUMENT pour BKCLI_PIECE" },
      { name: "DATE_EXPIRATION", type: "DATE", description: "Champ DATE_EXPIRATION pour BKCLI_PIECE" },
      { name: "URL_ARCHIVE", type: "VARCHAR2(100)", description: "Champ URL_ARCHIVE pour BKCLI_PIECE" }
    ],
    sampleQuery: "SELECT * FROM BKCLI_PIECE WHERE CLI IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCLI_PIECE du module Clientèle & KYC dans Core Banking Amplitude."
  },
  {
    tableName: "BKCLI_CONTR",
    module: "Clientèle & KYC",
    description: "Contrats cadres bancaires signés par les clients.",
    primaryKey: ["CONTRAT_NUM"],
    foreignKeys: [],
    columns: [
      { name: "CONTRAT_NUM", type: "VARCHAR2(16)", description: "Champ CONTRAT_NUM pour BKCLI_CONTR" },
      { name: "CLI", type: "VARCHAR2(15)", description: "Champ CLI pour BKCLI_CONTR" },
      { name: "TYPE_CONTRAT", type: "VARCHAR2(6)", description: "Champ TYPE_CONTRAT pour BKCLI_CONTR" },
      { name: "DATE_ADHESION", type: "DATE", description: "Champ DATE_ADHESION pour BKCLI_CONTR" }
    ],
    sampleQuery: "SELECT * FROM BKCLI_CONTR WHERE CONTRAT_NUM IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCLI_CONTR du module Clientèle & KYC dans Core Banking Amplitude."
  },
  {
    tableName: "BKCLI_PROFIL",
    module: "Clientèle & KYC",
    description: "Profil d'investisseur (Prudent, Équilibré, Dynamique) selon réglementation MiFID.",
    primaryKey: ["CLI"],
    foreignKeys: [],
    columns: [
      { name: "CLI", type: "VARCHAR2(15)", description: "Champ CLI pour BKCLI_PROFIL" },
      { name: "SCORE_RISQUE_MIFID", type: "VARCHAR2(10)", description: "Champ SCORE_RISQUE_MIFID pour BKCLI_PROFIL" },
      { name: "DATE_EVALUATION", type: "DATE", description: "Champ DATE_EVALUATION pour BKCLI_PROFIL" }
    ],
    sampleQuery: "SELECT * FROM BKCLI_PROFIL WHERE CLI IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCLI_PROFIL du module Clientèle & KYC dans Core Banking Amplitude."
  },
  {
    tableName: "BKCLI_SECT",
    module: "Clientèle & KYC",
    description: "Nomenclatures des secteurs d'activité économique (Codes CITI / NAF).",
    primaryKey: ["CODE_SECTEUR"],
    foreignKeys: [],
    columns: [
      { name: "CODE_SECTEUR", type: "VARCHAR2(6)", description: "Champ CODE_SECTEUR pour BKCLI_SECT" },
      { name: "INTITULE_SECTEUR", type: "VARCHAR2(60)", description: "Champ INTITULE_SECTEUR pour BKCLI_SECT" },
      { name: "COEFFICIENT_PONDERATION", type: "NUMBER(4,2)", description: "Champ COEFFICIENT_PONDERATION pour BKCLI_SECT" }
    ],
    sampleQuery: "SELECT * FROM BKCLI_SECT WHERE CODE_SECTEUR IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCLI_SECT du module Clientèle & KYC dans Core Banking Amplitude."
  },
  {
    tableName: "BKCLI_NOTIF",
    module: "Clientèle & KYC",
    description: "Préférences de communication et abonnements alertes SMS/Email.",
    primaryKey: ["CLI"],
    foreignKeys: [],
    columns: [
      { name: "CLI", type: "VARCHAR2(15)", description: "Champ CLI pour BKCLI_NOTIF" },
      { name: "OPTIN_SMS", type: "VARCHAR2(1)", description: "Champ OPTIN_SMS pour BKCLI_NOTIF" },
      { name: "OPTIN_EMAIL", type: "VARCHAR2(1)", description: "Champ OPTIN_EMAIL pour BKCLI_NOTIF" },
      { name: "FREQUENCE_RELEVE", type: "VARCHAR2(1)", description: "Champ FREQUENCE_RELEVE pour BKCLI_NOTIF" }
    ],
    sampleQuery: "SELECT * FROM BKCLI_NOTIF WHERE CLI IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCLI_NOTIF du module Clientèle & KYC dans Core Banking Amplitude."
  },
  {
    tableName: "BKCLI_FIDEL",
    module: "Clientèle & KYC",
    description: "Programmes de fidélité, points acquis et avantages tarifaires.",
    primaryKey: ["CLI"],
    foreignKeys: [],
    columns: [
      { name: "CLI", type: "VARCHAR2(15)", description: "Champ CLI pour BKCLI_FIDEL" },
      { name: "POINTS_CUMULES", type: "NUMBER(8)", description: "Champ POINTS_CUMULES pour BKCLI_FIDEL" },
      { name: "SEGMENT_VIP", type: "VARCHAR2(1)", description: "Champ SEGMENT_VIP pour BKCLI_FIDEL" }
    ],
    sampleQuery: "SELECT * FROM BKCLI_FIDEL WHERE CLI IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCLI_FIDEL du module Clientèle & KYC dans Core Banking Amplitude."
  },
  {
    tableName: "BKCLI_HISTO",
    module: "Clientèle & KYC",
    description: "Historique complet des modifications d'état civil et raison sociale.",
    primaryKey: ["CLI", "DATE_MODIF"],
    foreignKeys: [],
    columns: [
      { name: "CLI", type: "VARCHAR2(15)", description: "Champ CLI pour BKCLI_HISTO" },
      { name: "DATE_MODIF", type: "TIMESTAMP", description: "Champ DATE_MODIF pour BKCLI_HISTO" },
      { name: "ANCIEN_NOM", type: "VARCHAR2(45)", description: "Champ ANCIEN_NOM pour BKCLI_HISTO" },
      { name: "OPERATEUR_MODIF", type: "VARCHAR2(10)", description: "Champ OPERATEUR_MODIF pour BKCLI_HISTO" }
    ],
    sampleQuery: "SELECT * FROM BKCLI_HISTO WHERE CLI IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCLI_HISTO du module Clientèle & KYC dans Core Banking Amplitude."
  },
  {
    tableName: "BKAGE_PARAM",
    module: "Gestion Agences",
    description: "Paramètres d'exploitation des agences (horaires, caisse max, coffre).",
    primaryKey: ["AGE"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKAGE_PARAM" },
      { name: "NOM_AGENCE", type: "VARCHAR2(35)", description: "Champ NOM_AGENCE pour BKAGE_PARAM" },
      { name: "ENCAISSE_MAX", type: "NUMBER(19,4)", description: "Champ ENCAISSE_MAX pour BKAGE_PARAM" },
      { name: "RESPONSABLE_MATRICULE", type: "VARCHAR2(10)", description: "Champ RESPONSABLE_MATRICULE pour BKAGE_PARAM" }
    ],
    sampleQuery: "SELECT * FROM BKAGE_PARAM WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKAGE_PARAM du module Gestion Agences dans Core Banking Amplitude."
  },
  {
    tableName: "BKAGE_GUICH",
    module: "Gestion Agences",
    description: "Guichets de caisse agence et soldes de caisse en fin de journée.",
    primaryKey: ["AGE", "NUM_GUICHET"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKAGE_GUICH" },
      { name: "NUM_GUICHET", type: "VARCHAR2(3)", description: "Champ NUM_GUICHET pour BKAGE_GUICH" },
      { name: "CAISSIER_USER", type: "VARCHAR2(10)", description: "Champ CAISSIER_USER pour BKAGE_GUICH" },
      { name: "SOLDE_ESPECES", type: "NUMBER(15,2)", description: "Champ SOLDE_ESPECES pour BKAGE_GUICH" }
    ],
    sampleQuery: "SELECT * FROM BKAGE_GUICH WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKAGE_GUICH du module Gestion Agences dans Core Banking Amplitude."
  },
  {
    tableName: "BKAGE_ARRET",
    module: "Gestion Agences",
    description: "Arrêtés journaliers de caisse et PV de rapprochement d'espèces.",
    primaryKey: ["AGE", "DCO", "NUM_GUICHET"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKAGE_ARRET" },
      { name: "DCO", type: "DATE", description: "Champ DCO pour BKAGE_ARRET" },
      { name: "NUM_GUICHET", type: "VARCHAR2(3)", description: "Champ NUM_GUICHET pour BKAGE_ARRET" },
      { name: "BILLETAGE_REEL", type: "NUMBER(15,2)", description: "Champ BILLETAGE_REEL pour BKAGE_ARRET" },
      { name: "ECART_CAISSE", type: "NUMBER(15,2)", description: "Champ ECART_CAISSE pour BKAGE_ARRET" }
    ],
    sampleQuery: "SELECT * FROM BKAGE_ARRET WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKAGE_ARRET du module Gestion Agences dans Core Banking Amplitude."
  },
  {
    tableName: "BKAGE_FERIE",
    module: "Gestion Agences",
    description: "Calendrier des jours fériés légaux et chômés par pays/région.",
    primaryKey: ["PAYS", "DATE_FERIE"],
    foreignKeys: [],
    columns: [
      { name: "PAYS", type: "VARCHAR2(3)", description: "Champ PAYS pour BKAGE_FERIE" },
      { name: "DATE_FERIE", type: "DATE", description: "Champ DATE_FERIE pour BKAGE_FERIE" },
      { name: "LIBELLE_FETE", type: "VARCHAR2(40)", description: "Champ LIBELLE_FETE pour BKAGE_FERIE" }
    ],
    sampleQuery: "SELECT * FROM BKAGE_FERIE WHERE PAYS IS NOT NULL;",
    criticalNotes: "Table maîtresse BKAGE_FERIE du module Gestion Agences dans Core Banking Amplitude."
  },
  {
    tableName: "BKAGE_ZONE",
    module: "Gestion Agences",
    description: "Zones géographiques et découpage des directions régionales.",
    primaryKey: ["CODE_ZONE"],
    foreignKeys: [],
    columns: [
      { name: "CODE_ZONE", type: "VARCHAR2(4)", description: "Champ CODE_ZONE pour BKAGE_ZONE" },
      { name: "NOM_ZONE", type: "VARCHAR2(30)", description: "Champ NOM_ZONE pour BKAGE_ZONE" },
      { name: "DIRECTEUR_ZONE", type: "VARCHAR2(10)", description: "Champ DIRECTEUR_ZONE pour BKAGE_ZONE" }
    ],
    sampleQuery: "SELECT * FROM BKAGE_ZONE WHERE CODE_ZONE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKAGE_ZONE du module Gestion Agences dans Core Banking Amplitude."
  },
  {
    tableName: "BKAGE_RESEAU",
    module: "Gestion Agences",
    description: "Points de vente avancés, agences mobiles et distributeurs hors-murs.",
    primaryKey: ["CODE_POINT_VENTE"],
    foreignKeys: [],
    columns: [
      { name: "CODE_POINT_VENTE", type: "VARCHAR2(8)", description: "Champ CODE_POINT_VENTE pour BKAGE_RESEAU" },
      { name: "AGENCE_RATTACH", type: "VARCHAR2(5)", description: "Champ AGENCE_RATTACH pour BKAGE_RESEAU" },
      { name: "TYPE_POINT", type: "VARCHAR2(4)", description: "Champ TYPE_POINT pour BKAGE_RESEAU" }
    ],
    sampleQuery: "SELECT * FROM BKAGE_RESEAU WHERE CODE_POINT_VENTE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKAGE_RESEAU du module Gestion Agences dans Core Banking Amplitude."
  },
  {
    tableName: "BKSEC_PROFIL",
    module: "Sécurité & Droits",
    description: "Profils de sécurité applicatifs et rôles fonctionnels Amplitude.",
    primaryKey: ["CODE_PROFIL"],
    foreignKeys: [],
    columns: [
      { name: "CODE_PROFIL", type: "VARCHAR2(10)", description: "Champ CODE_PROFIL pour BKSEC_PROFIL" },
      { name: "LIBELLE_PROFIL", type: "VARCHAR2(40)", description: "Champ LIBELLE_PROFIL pour BKSEC_PROFIL" },
      { name: "NIVEAU_PRIVILEGE", type: "NUMBER(2)", description: "Champ NIVEAU_PRIVILEGE pour BKSEC_PROFIL" }
    ],
    sampleQuery: "SELECT * FROM BKSEC_PROFIL WHERE CODE_PROFIL IS NOT NULL;",
    criticalNotes: "Table maîtresse BKSEC_PROFIL du module Sécurité & Droits dans Core Banking Amplitude."
  },
  {
    tableName: "BKSEC_HABIL",
    module: "Sécurité & Droits",
    description: "Droits fins d'accès accordés aux écrans et fonctions (Lecture/Écriture/Validation).",
    primaryKey: ["CODE_PROFIL", "FONCTION_ID"],
    foreignKeys: [],
    columns: [
      { name: "CODE_PROFIL", type: "VARCHAR2(10)", description: "Champ CODE_PROFIL pour BKSEC_HABIL" },
      { name: "FONCTION_ID", type: "VARCHAR2(20)", description: "Champ FONCTION_ID pour BKSEC_HABIL" },
      { name: "DROIT_ACCES", type: "VARCHAR2(4)", description: "Champ DROIT_ACCES pour BKSEC_HABIL" }
    ],
    sampleQuery: "SELECT * FROM BKSEC_HABIL WHERE CODE_PROFIL IS NOT NULL;",
    criticalNotes: "Table maîtresse BKSEC_HABIL du module Sécurité & Droits dans Core Banking Amplitude."
  },
  {
    tableName: "BKSEC_DOUBLE",
    module: "Sécurité & Droits",
    description: "Règles de double signature (Four-Eyes Principle) par seuil financier.",
    primaryKey: ["CODE_OPERATION", "PLAFOND_MONNAIE"],
    foreignKeys: [],
    columns: [
      { name: "CODE_OPERATION", type: "VARCHAR2(3)", description: "Champ CODE_OPERATION pour BKSEC_DOUBLE" },
      { name: "PLAFOND_MONNAIE", type: "NUMBER(19,4)", description: "Champ PLAFOND_MONNAIE pour BKSEC_DOUBLE" },
      { name: "PROFIL_APPROBATEUR", type: "VARCHAR2(10)", description: "Champ PROFIL_APPROBATEUR pour BKSEC_DOUBLE" }
    ],
    sampleQuery: "SELECT * FROM BKSEC_DOUBLE WHERE CODE_OPERATION IS NOT NULL;",
    criticalNotes: "Table maîtresse BKSEC_DOUBLE du module Sécurité & Droits dans Core Banking Amplitude."
  },
  {
    tableName: "BKSEC_HISTP",
    module: "Sécurité & Droits",
    description: "Historique des mots de passe utilisateurs pour interdire la réutilisation.",
    primaryKey: ["UTI", "HASH_PASSWORD"],
    foreignKeys: [],
    columns: [
      { name: "UTI", type: "VARCHAR2(10)", description: "Champ UTI pour BKSEC_HISTP" },
      { name: "HASH_PASSWORD", type: "VARCHAR2(64)", description: "Champ HASH_PASSWORD pour BKSEC_HISTP" },
      { name: "DATE_MODIF", type: "TIMESTAMP", description: "Champ DATE_MODIF pour BKSEC_HISTP" }
    ],
    sampleQuery: "SELECT * FROM BKSEC_HISTP WHERE UTI IS NOT NULL;",
    criticalNotes: "Table maîtresse BKSEC_HISTP du module Sécurité & Droits dans Core Banking Amplitude."
  },
  {
    tableName: "BKSEC_SESSION",
    module: "Sécurité & Droits",
    description: "Sessions utilisateurs actives connectées sous Tuxedo / Amplitude Web.",
    primaryKey: ["SESSION_ID"],
    foreignKeys: [],
    columns: [
      { name: "SESSION_ID", type: "VARCHAR2(32)", description: "Champ SESSION_ID pour BKSEC_SESSION" },
      { name: "UTI", type: "VARCHAR2(10)", description: "Champ UTI pour BKSEC_SESSION" },
      { name: "IP_CLIENT", type: "VARCHAR2(15)", description: "Champ IP_CLIENT pour BKSEC_SESSION" },
      { name: "DERNIERE_ACTIVITE", type: "TIMESTAMP", description: "Champ DERNIERE_ACTIVITE pour BKSEC_SESSION" }
    ],
    sampleQuery: "SELECT * FROM BKSEC_SESSION WHERE SESSION_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKSEC_SESSION du module Sécurité & Droits dans Core Banking Amplitude."
  },
  {
    tableName: "BKSEC_TENTAT",
    module: "Sécurité & Droits",
    description: "Tentatives d'intrusion, échecs d'authentification et blocages de compte.",
    primaryKey: ["UTI", "DATE_HEURE"],
    foreignKeys: [],
    columns: [
      { name: "UTI", type: "VARCHAR2(10)", description: "Champ UTI pour BKSEC_TENTAT" },
      { name: "DATE_HEURE", type: "TIMESTAMP", description: "Champ DATE_HEURE pour BKSEC_TENTAT" },
      { name: "NB_ECHECS", type: "NUMBER(2)", description: "Champ NB_ECHECS pour BKSEC_TENTAT" },
      { name: "COMPTE_VERROUILLE", type: "VARCHAR2(1)", description: "Champ COMPTE_VERROUILLE pour BKSEC_TENTAT" }
    ],
    sampleQuery: "SELECT * FROM BKSEC_TENTAT WHERE UTI IS NOT NULL;",
    criticalNotes: "Table maîtresse BKSEC_TENTAT du module Sécurité & Droits dans Core Banking Amplitude."
  },
  {
    tableName: "BKBAT_PARAM",
    module: "Batch & Exploitation",
    description: "Paramètres généraux d'exécution des chaînes batch (threads, timeouts).",
    primaryKey: ["CHAINE_CODE"],
    foreignKeys: [],
    columns: [
      { name: "CHAINE_CODE", type: "VARCHAR2(10)", description: "Champ CHAINE_CODE pour BKBAT_PARAM" },
      { name: "MAX_THREADS", type: "NUMBER(2)", description: "Champ MAX_THREADS pour BKBAT_PARAM" },
      { name: "TIMEOUT_SECONDES", type: "NUMBER(6)", description: "Champ TIMEOUT_SECONDES pour BKBAT_PARAM" }
    ],
    sampleQuery: "SELECT * FROM BKBAT_PARAM WHERE CHAINE_CODE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKBAT_PARAM du module Batch & Exploitation dans Core Banking Amplitude."
  },
  {
    tableName: "BKBAT_LOG",
    module: "Batch & Exploitation",
    description: "Logs détaillés des étapes de traitements batch avec temps CPU.",
    primaryKey: ["LOG_ID"],
    foreignKeys: [],
    columns: [
      { name: "LOG_ID", type: "NUMBER(10)", description: "Champ LOG_ID pour BKBAT_LOG" },
      { name: "SCRIPT_NAME", type: "VARCHAR2(30)", description: "Champ SCRIPT_NAME pour BKBAT_LOG" },
      { name: "DATE_DEBUT", type: "TIMESTAMP", description: "Champ DATE_DEBUT pour BKBAT_LOG" },
      { name: "DATE_FIN", type: "TIMESTAMP", description: "Champ DATE_FIN pour BKBAT_LOG" },
      { name: "CODE_RETOUR", type: "NUMBER(3)", description: "Champ CODE_RETOUR pour BKBAT_LOG" }
    ],
    sampleQuery: "SELECT * FROM BKBAT_LOG WHERE LOG_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKBAT_LOG du module Batch & Exploitation dans Core Banking Amplitude."
  },
  {
    tableName: "BKBAT_REPRISE",
    module: "Batch & Exploitation",
    description: "Points de reprise (Checkpoints) en cas de crash batch EOD.",
    primaryKey: ["STEP_ID"],
    foreignKeys: [],
    columns: [
      { name: "STEP_ID", type: "VARCHAR2(20)", description: "Champ STEP_ID pour BKBAT_REPRISE" },
      { name: "DERNIERE_CLE_TRAITEE", type: "VARCHAR2(30)", description: "Champ DERNIERE_CLE_TRAITEE pour BKBAT_REPRISE" },
      { name: "STATUT_REPRISE", type: "VARCHAR2(1)", description: "Champ STATUT_REPRISE pour BKBAT_REPRISE" }
    ],
    sampleQuery: "SELECT * FROM BKBAT_REPRISE WHERE STEP_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKBAT_REPRISE du module Batch & Exploitation dans Core Banking Amplitude."
  },
  {
    tableName: "BKTUX_SRV",
    module: "Batch & Exploitation",
    description: "Services transactionnels déclarés sur les serveurs Tuxedo.",
    primaryKey: ["SERVICE_NAME"],
    foreignKeys: [],
    columns: [
      { name: "SERVICE_NAME", type: "VARCHAR2(30)", description: "Champ SERVICE_NAME pour BKTUX_SRV" },
      { name: "SERVER_GROUP", type: "VARCHAR2(15)", description: "Champ SERVER_GROUP pour BKTUX_SRV" },
      { name: "STATUS_DISPO", type: "VARCHAR2(1)", description: "Champ STATUS_DISPO pour BKTUX_SRV" }
    ],
    sampleQuery: "SELECT * FROM BKTUX_SRV WHERE SERVICE_NAME IS NOT NULL;",
    criticalNotes: "Table maîtresse BKTUX_SRV du module Batch & Exploitation dans Core Banking Amplitude."
  },
  {
    tableName: "BKTUX_FILE",
    module: "Batch & Exploitation",
    description: "Files d'attente IPC / Tuxedo et volumétrie des requêtes en attente.",
    primaryKey: ["QUEUE_NAME"],
    foreignKeys: [],
    columns: [
      { name: "QUEUE_NAME", type: "VARCHAR2(20)", description: "Champ QUEUE_NAME pour BKTUX_FILE" },
      { name: "MAX_MSG", type: "NUMBER(6)", description: "Champ MAX_MSG pour BKTUX_FILE" },
      { name: "CURRENT_MSG", type: "NUMBER(6)", description: "Champ CURRENT_MSG pour BKTUX_FILE" }
    ],
    sampleQuery: "SELECT * FROM BKTUX_FILE WHERE QUEUE_NAME IS NOT NULL;",
    criticalNotes: "Table maîtresse BKTUX_FILE du module Batch & Exploitation dans Core Banking Amplitude."
  },
  {
    tableName: "BKINTF_API",
    module: "Interfaces & WebServices",
    description: "Catalogue des API REST / SOAP ouvertes sur le Core Banking.",
    primaryKey: ["API_ENDPOINT"],
    foreignKeys: [],
    columns: [
      { name: "API_ENDPOINT", type: "VARCHAR2(60)", description: "Champ API_ENDPOINT pour BKINTF_API" },
      { name: "METHODE_HTTP", type: "VARCHAR2(6)", description: "Champ METHODE_HTTP pour BKINTF_API" },
      { name: "SERVICE_4GL_MAPPE", type: "VARCHAR2(30)", description: "Champ SERVICE_4GL_MAPPE pour BKINTF_API" }
    ],
    sampleQuery: "SELECT * FROM BKINTF_API WHERE API_ENDPOINT IS NOT NULL;",
    criticalNotes: "Table maîtresse BKINTF_API du module Interfaces & WebServices dans Core Banking Amplitude."
  },
  {
    tableName: "BKINTF_LOG",
    module: "Interfaces & WebServices",
    description: "Traçabilité des appels API externes avec payload et codes HTTP.",
    primaryKey: ["CALL_ID"],
    foreignKeys: [],
    columns: [
      { name: "CALL_ID", type: "VARCHAR2(36)", description: "Champ CALL_ID pour BKINTF_LOG" },
      { name: "API_ENDPOINT", type: "VARCHAR2(60)", description: "Champ API_ENDPOINT pour BKINTF_LOG" },
      { name: "CODE_HTTP", type: "NUMBER(3)", description: "Champ CODE_HTTP pour BKINTF_LOG" },
      { name: "DUREE_EXEC_MS", type: "NUMBER(6)", description: "Champ DUREE_EXEC_MS pour BKINTF_LOG" }
    ],
    sampleQuery: "SELECT * FROM BKINTF_LOG WHERE CALL_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKINTF_LOG du module Interfaces & WebServices dans Core Banking Amplitude."
  },
  {
    tableName: "BKCFG_ENV",
    module: "Batch & Exploitation",
    description: "Variables d'environnement système et chemins des répertoires ().",
    primaryKey: ["VAR_NAME"],
    foreignKeys: [],
    columns: [
      { name: "VAR_NAME", type: "VARCHAR2(30)", description: "Champ VAR_NAME pour BKCFG_ENV" },
      { name: "VALEUR_VAR", type: "VARCHAR2(100)", description: "Champ VALEUR_VAR pour BKCFG_ENV" },
      { name: "DESCRIPTION", type: "VARCHAR2(60)", description: "Champ DESCRIPTION pour BKCFG_ENV" }
    ],
    sampleQuery: "SELECT * FROM BKCFG_ENV WHERE VAR_NAME IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCFG_ENV du module Batch & Exploitation dans Core Banking Amplitude."
  },
  {
    tableName: "BKCFG_LIC",
    module: "Batch & Exploitation",
    description: "Licences logicielles Amplitude et quotas de connexions simultanées.",
    primaryKey: ["MODULE_LICENCE"],
    foreignKeys: [],
    columns: [
      { name: "MODULE_LICENCE", type: "VARCHAR2(20)", description: "Champ MODULE_LICENCE pour BKCFG_LIC" },
      { name: "NB_UTILISATEURS_MAX", type: "NUMBER(5)", description: "Champ NB_UTILISATEURS_MAX pour BKCFG_LIC" },
      { name: "DATE_EXPIRATION", type: "DATE", description: "Champ DATE_EXPIRATION pour BKCFG_LIC" }
    ],
    sampleQuery: "SELECT * FROM BKCFG_LIC WHERE MODULE_LICENCE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCFG_LIC du module Batch & Exploitation dans Core Banking Amplitude."
  },
  {
    tableName: "BKPURGE_TAB",
    module: "Batch & Exploitation",
    description: "Règles de purge et d'archivage périodique des tables volumineuses.",
    primaryKey: ["TABLE_CIBLE"],
    foreignKeys: [],
    columns: [
      { name: "TABLE_CIBLE", type: "VARCHAR2(30)", description: "Champ TABLE_CIBLE pour BKPURGE_TAB" },
      { name: "DELAI_RETENTION_JOURS", type: "NUMBER(4)", description: "Champ DELAI_RETENTION_JOURS pour BKPURGE_TAB" },
      { name: "DERNIERE_PURGE", type: "DATE", description: "Champ DERNIERE_PURGE pour BKPURGE_TAB" }
    ],
    sampleQuery: "SELECT * FROM BKPURGE_TAB WHERE TABLE_CIBLE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKPURGE_TAB du module Batch & Exploitation dans Core Banking Amplitude."
  },
  {
    tableName: "BKCPT_HIST",
    module: "Comptes & Soldes",
    description: "Historique des modifications d'attributs de comptes.",
    primaryKey: ["AGE", "NCP", "DCO"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKCPT_HIST" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKCPT_HIST" },
      { name: "DCO", type: "DATE", description: "Champ DCO pour BKCPT_HIST" },
      { name: "CHA_OLD", type: "VARCHAR2(4)", description: "Champ CHA_OLD pour BKCPT_HIST" },
      { name: "CHA_NEW", type: "VARCHAR2(4)", description: "Champ CHA_NEW pour BKCPT_HIST" },
      { name: "UTI", type: "VARCHAR2(10)", description: "Champ UTI pour BKCPT_HIST" }
    ],
    sampleQuery: "SELECT * FROM BKCPT_HIST WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCPT_HIST du module Comptes & Soldes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCPT_BLOQ",
    module: "Comptes & Soldes",
    description: "Blocages judiciaires, saisies-attributions et oppositions comptes.",
    primaryKey: ["AGE", "NCP", "NUM_BLOQ"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKCPT_BLOQ" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKCPT_BLOQ" },
      { name: "NUM_BLOQ", type: "VARCHAR2(10)", description: "Champ NUM_BLOQ pour BKCPT_BLOQ" },
      { name: "MOTIF", type: "VARCHAR2(40)", description: "Champ MOTIF pour BKCPT_BLOQ" },
      { name: "MON_BLOQ", type: "NUMBER(19,4)", description: "Champ MON_BLOQ pour BKCPT_BLOQ" },
      { name: "DAT_BLOQ", type: "DATE", description: "Champ DAT_BLOQ pour BKCPT_BLOQ" },
      { name: "ETA", type: "VARCHAR2(1)", description: "Champ ETA pour BKCPT_BLOQ" }
    ],
    sampleQuery: "SELECT * FROM BKCPT_BLOQ WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCPT_BLOQ du module Comptes & Soldes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCPT_DELE",
    module: "Comptes & Soldes",
    description: "Délégations de signature et procurations sur comptes.",
    primaryKey: ["AGE", "NCP", "CLI_MAND"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKCPT_DELE" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKCPT_DELE" },
      { name: "CLI_MAND", type: "VARCHAR2(15)", description: "Champ CLI_MAND pour BKCPT_DELE" },
      { name: "TYP_POUV", type: "VARCHAR2(2)", description: "Champ TYP_POUV pour BKCPT_DELE" },
      { name: "PLAFOND", type: "NUMBER(19,4)", description: "Champ PLAFOND pour BKCPT_DELE" },
      { name: "DAT_FIN", type: "DATE", description: "Champ DAT_FIN pour BKCPT_DELE" }
    ],
    sampleQuery: "SELECT * FROM BKCPT_DELE WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCPT_DELE du module Comptes & Soldes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCPT_DOC",
    module: "Comptes & Soldes",
    description: "Documents contractuels et conventions de compte signées.",
    primaryKey: ["AGE", "NCP", "REF_DOC"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKCPT_DOC" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKCPT_DOC" },
      { name: "REF_DOC", type: "VARCHAR2(20)", description: "Champ REF_DOC pour BKCPT_DOC" },
      { name: "TYP_DOC", type: "VARCHAR2(5)", description: "Champ TYP_DOC pour BKCPT_DOC" },
      { name: "DAT_SIGN", type: "DATE", description: "Champ DAT_SIGN pour BKCPT_DOC" },
      { name: "STATUT", type: "VARCHAR2(1)", description: "Champ STATUT pour BKCPT_DOC" }
    ],
    sampleQuery: "SELECT * FROM BKCPT_DOC WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCPT_DOC du module Comptes & Soldes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCPT_AGIOS",
    module: "Comptes & Soldes",
    description: "Paramétrage spécifique de calcul d'intérêts et agios par compte.",
    primaryKey: ["AGE", "NCP"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKCPT_AGIOS" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKCPT_AGIOS" },
      { name: "TAUX_DEB", type: "NUMBER(7,4)", description: "Champ TAUX_DEB pour BKCPT_AGIOS" },
      { name: "TAUX_CRED", type: "NUMBER(7,4)", description: "Champ TAUX_CRED pour BKCPT_AGIOS" },
      { name: "EXONERATION", type: "VARCHAR2(1)", description: "Champ EXONERATION pour BKCPT_AGIOS" },
      { name: "DAT_EFFET", type: "DATE", description: "Champ DAT_EFFET pour BKCPT_AGIOS" }
    ],
    sampleQuery: "SELECT * FROM BKCPT_AGIOS WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCPT_AGIOS du module Comptes & Soldes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCPT_FUSION",
    module: "Comptes & Soldes",
    description: "Journal des transferts et fusions de comptes inter-agences.",
    primaryKey: ["AGE_SRC", "NCP_SRC", "AGE_DST", "NCP_DST"],
    foreignKeys: [],
    columns: [
      { name: "AGE_SRC", type: "VARCHAR2(5)", description: "Champ AGE_SRC pour BKCPT_FUSION" },
      { name: "NCP_SRC", type: "VARCHAR2(11)", description: "Champ NCP_SRC pour BKCPT_FUSION" },
      { name: "AGE_DST", type: "VARCHAR2(5)", description: "Champ AGE_DST pour BKCPT_FUSION" },
      { name: "NCP_DST", type: "VARCHAR2(11)", description: "Champ NCP_DST pour BKCPT_FUSION" },
      { name: "SOL_TRANS", type: "NUMBER(19,4)", description: "Champ SOL_TRANS pour BKCPT_FUSION" },
      { name: "DAT_FUS", type: "DATE", description: "Champ DAT_FUS pour BKCPT_FUSION" }
    ],
    sampleQuery: "SELECT * FROM BKCPT_FUSION WHERE AGE_SRC IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCPT_FUSION du module Comptes & Soldes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCPT_SEUILS",
    module: "Comptes & Soldes",
    description: "Plafonds de débit, seuils d'alerte et découverts exceptionnels.",
    primaryKey: ["AGE", "NCP", "TYP_SEUIL"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKCPT_SEUILS" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKCPT_SEUILS" },
      { name: "TYP_SEUIL", type: "VARCHAR2(3)", description: "Champ TYP_SEUIL pour BKCPT_SEUILS" },
      { name: "MONTANT", type: "NUMBER(19,4)", description: "Champ MONTANT pour BKCPT_SEUILS" },
      { name: "DAT_FIN", type: "DATE", description: "Champ DAT_FIN pour BKCPT_SEUILS" }
    ],
    sampleQuery: "SELECT * FROM BKCPT_SEUILS WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCPT_SEUILS du module Comptes & Soldes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCPT_TARIF",
    module: "Comptes & Soldes",
    description: "Grille tarifaire personnalisée et réductions de frais de tenue de compte.",
    primaryKey: ["AGE", "NCP", "CODE_TARIF"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKCPT_TARIF" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKCPT_TARIF" },
      { name: "CODE_TARIF", type: "VARCHAR2(5)", description: "Champ CODE_TARIF pour BKCPT_TARIF" },
      { name: "REMISE_PCT", type: "NUMBER(5,2)", description: "Champ REMISE_PCT pour BKCPT_TARIF" },
      { name: "VALIDE_JUSQU", type: "DATE", description: "Champ VALIDE_JUSQU pour BKCPT_TARIF" }
    ],
    sampleQuery: "SELECT * FROM BKCPT_TARIF WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCPT_TARIF du module Comptes & Soldes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCPT_INACT",
    module: "Comptes & Soldes",
    description: "Suivi réglementaire des comptes inactifs et déshérence (Loi Eckert).",
    primaryKey: ["AGE", "NCP"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKCPT_INACT" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKCPT_INACT" },
      { name: "DAT_DER_MVT", type: "DATE", description: "Champ DAT_DER_MVT pour BKCPT_INACT" },
      { name: "DELAI_INACT_MOIS", type: "NUMBER(3)", description: "Champ DELAI_INACT_MOIS pour BKCPT_INACT" },
      { name: "RELANCE_COUNT", type: "NUMBER(2)", description: "Champ RELANCE_COUNT pour BKCPT_INACT" },
      { name: "STATUT", type: "VARCHAR2(1)", description: "Champ STATUT pour BKCPT_INACT" }
    ],
    sampleQuery: "SELECT * FROM BKCPT_INACT WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCPT_INACT du module Comptes & Soldes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCPT_IBAN",
    module: "Comptes & Soldes",
    description: "Identifiants internationaux de comptes (IBAN, BIC, BBAN).",
    primaryKey: ["AGE", "NCP"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKCPT_IBAN" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKCPT_IBAN" },
      { name: "IBAN", type: "VARCHAR2(34)", description: "Champ IBAN pour BKCPT_IBAN" },
      { name: "BIC", type: "VARCHAR2(11)", description: "Champ BIC pour BKCPT_IBAN" },
      { name: "CLE_RIB", type: "VARCHAR2(2)", description: "Champ CLE_RIB pour BKCPT_IBAN" }
    ],
    sampleQuery: "SELECT * FROM BKCPT_IBAN WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCPT_IBAN du module Comptes & Soldes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCPT_VALEUR",
    module: "Comptes & Soldes",
    description: "Soldes en date de valeur calculés pour application des agios débiteurs.",
    primaryKey: ["AGE", "NCP", "DVA"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKCPT_VALEUR" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKCPT_VALEUR" },
      { name: "DVA", type: "DATE", description: "Champ DVA pour BKCPT_VALEUR" },
      { name: "SOLDE_VALEUR", type: "NUMBER(19,4)", description: "Champ SOLDE_VALEUR pour BKCPT_VALEUR" },
      { name: "NB_JOURS_VALEUR", type: "NUMBER(3)", description: "Champ NB_JOURS_VALEUR pour BKCPT_VALEUR" }
    ],
    sampleQuery: "SELECT * FROM BKCPT_VALEUR WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCPT_VALEUR du module Comptes & Soldes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCPT_COLLEC",
    module: "Comptes & Soldes",
    description: "Comptes collecteurs et sous-comptes virtuels pour Trésorerie Cash Pooling.",
    primaryKey: ["NCP_MAITRE", "NCP_VIRTUEL"],
    foreignKeys: [],
    columns: [
      { name: "NCP_MAITRE", type: "VARCHAR2(11)", description: "Champ NCP_MAITRE pour BKCPT_COLLEC" },
      { name: "NCP_VIRTUEL", type: "VARCHAR2(11)", description: "Champ NCP_VIRTUEL pour BKCPT_COLLEC" },
      { name: "NIVEAU_POOLING", type: "NUMBER(2)", description: "Champ NIVEAU_POOLING pour BKCPT_COLLEC" },
      { name: "SEUIL_ECREMAGE", type: "NUMBER(19,4)", description: "Champ SEUIL_ECREMAGE pour BKCPT_COLLEC" }
    ],
    sampleQuery: "SELECT * FROM BKCPT_COLLEC WHERE NCP_MAITRE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCPT_COLLEC du module Comptes & Soldes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCPT_RELEVE",
    module: "Comptes & Soldes",
    description: "Historique des relevés périodiques générés et adressés au client.",
    primaryKey: ["AGE", "NCP", "NUM_RELEVE"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKCPT_RELEVE" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKCPT_RELEVE" },
      { name: "NUM_RELEVE", type: "VARCHAR2(10)", description: "Champ NUM_RELEVE pour BKCPT_RELEVE" },
      { name: "DATE_ARRETE", type: "DATE", description: "Champ DATE_ARRETE pour BKCPT_RELEVE" },
      { name: "ANCIEN_SOLDE", type: "NUMBER(19,4)", description: "Champ ANCIEN_SOLDE pour BKCPT_RELEVE" },
      { name: "NOUVEAU_SOLDE", type: "NUMBER(19,4)", description: "Champ NOUVEAU_SOLDE pour BKCPT_RELEVE" }
    ],
    sampleQuery: "SELECT * FROM BKCPT_RELEVE WHERE AGE IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCPT_RELEVE du module Comptes & Soldes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCPT_ESCROW",
    module: "Comptes & Soldes",
    description: "Comptes séquestres et consignations de fonds sous conditions suspensives.",
    primaryKey: ["ESCROW_ID"],
    foreignKeys: [],
    columns: [
      { name: "ESCROW_ID", type: "VARCHAR2(15)", description: "Champ ESCROW_ID pour BKCPT_ESCROW" },
      { name: "NCP_SEQUESTRE", type: "VARCHAR2(11)", description: "Champ NCP_SEQUESTRE pour BKCPT_ESCROW" },
      { name: "TIERS_DEPOSITAIRE", type: "VARCHAR2(15)", description: "Champ TIERS_DEPOSITAIRE pour BKCPT_ESCROW" },
      { name: "CONDITIONS_LIBERATION", type: "VARCHAR2(80)", description: "Champ CONDITIONS_LIBERATION pour BKCPT_ESCROW" }
    ],
    sampleQuery: "SELECT * FROM BKCPT_ESCROW WHERE ESCROW_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCPT_ESCROW du module Comptes & Soldes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCPT_DEV_ISO",
    module: "Comptes & Soldes",
    description: "Comptes multi-devises rattachés sous une même racine client.",
    primaryKey: ["RACINE_CLI", "DEV"],
    foreignKeys: [],
    columns: [
      { name: "RACINE_CLI", type: "VARCHAR2(8)", description: "Champ RACINE_CLI pour BKCPT_DEV_ISO" },
      { name: "DEV", type: "VARCHAR2(3)", description: "Champ DEV pour BKCPT_DEV_ISO" },
      { name: "NCP_DEV", type: "VARCHAR2(11)", description: "Champ NCP_DEV pour BKCPT_DEV_ISO" },
      { name: "STATUT_DEV", type: "VARCHAR2(1)", description: "Champ STATUT_DEV pour BKCPT_DEV_ISO" }
    ],
    sampleQuery: "SELECT * FROM BKCPT_DEV_ISO WHERE RACINE_CLI IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCPT_DEV_ISO du module Comptes & Soldes dans Core Banking Amplitude."
  },
  {
    tableName: "BKCPT_AUDIT",
    module: "Comptes & Soldes",
    description: "Piste d'audit des consultations de comptes par les agents de la banque.",
    primaryKey: ["AUDIT_ID"],
    foreignKeys: [],
    columns: [
      { name: "AUDIT_ID", type: "NUMBER(10)", description: "Champ AUDIT_ID pour BKCPT_AUDIT" },
      { name: "AGE", type: "VARCHAR2(5)", description: "Champ AGE pour BKCPT_AUDIT" },
      { name: "NCP", type: "VARCHAR2(11)", description: "Champ NCP pour BKCPT_AUDIT" },
      { name: "USER_ID", type: "VARCHAR2(10)", description: "Champ USER_ID pour BKCPT_AUDIT" },
      { name: "DATE_HEURE", type: "TIMESTAMP", description: "Champ DATE_HEURE pour BKCPT_AUDIT" },
      { name: "TERMINAL_IP", type: "VARCHAR2(15)", description: "Champ TERMINAL_IP pour BKCPT_AUDIT" }
    ],
    sampleQuery: "SELECT * FROM BKCPT_AUDIT WHERE AUDIT_ID IS NOT NULL;",
    criticalNotes: "Table maîtresse BKCPT_AUDIT du module Comptes & Soldes dans Core Banking Amplitude."
  },
];
