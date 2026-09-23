// modules/cbs/cbs-advanced-data.ts
import { CBS_ADDITIONAL_TABLES } from "./cbs-additional-tables";
import { CBS_EXTENDED_DICTIONARY } from "./cbs-amplitude-full-dictionary";

export interface CbsTableDefinition {
  tableName: string;
  module: string;
  description: string;
  primaryKey: string[];
  foreignKeys: { column: string; references: string }[];
  columns: { name: string; type: string; description: string; sensitive?: boolean }[];
  sampleQuery: string;
  criticalNotes: string;
}

export interface CbsSqlQuery {
  id: string;
  title: string;
  category: "EQUILIBRE" | "PERFORMANCE" | "SECURITE" | "PURGE" | "AUDIT";
  dbType: "Oracle" | "Informix" | "Both";
  description: string;
  sql: string;
  parameters: { name: string; label: string; defaultValue: string }[];
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  executionAdvice: string;
}

export interface CbsBatchIncidentScenario {
  id: string;
  stepCode: string;
  stepName: string;
  errorCode: string;
  errorMessage: string;
  severity: "CRITIQUE - NO GO BOD" | "MAJEUR" | "MINEUR - BYPASS POSSIBLE";
  rootCause: string;
  immediateAction: string;
  recoveryCommand: string;
  bypassAllowed: boolean;
  bypassProcedure?: string;
  slaImpactMinutes: number;
}

export interface CbsLogRule {
  pattern: RegExp | string;
  source: "Oracle Alert" | "Amplitude Batch" | "Tuxedo" | "Weblogic" | "AIX Syslog";
  severity: "CRITICAL" | "HIGH" | "WARNING" | "INFO";
  title: string;
  explanation: string;
  recommendedAction: string;
  extractedFields: string[];
}

export interface CbsReconciliationRecord {
  fileReference: string;
  network: "VISA" | "MASTERCARD" | "GIM_UEMOA";
  txDate: string;
  cardMasked: string;
  accountNumber: string;
  amount: number;
  currency: string;
  authCode: string;
  cbsStatus: "MATCHED" | "SUSPENSE" | "REJECTED" | "PENDING";
  rejectReason?: string;
  cbsAccountFound: boolean;
  glSuspenseAccount: string;
  solution: string;
}

// ----------------------------------------------------
// 1. DICTIONNAIRE DES TABLES MAÎTRESSES AMPLITUDE
// ----------------------------------------------------
export const CBS_SCHEMA_TABLES: CbsTableDefinition[] = [
  {
    tableName: "BKCLI",
    module: "Clientèle / KYC",
    description: "Table centrale des clients physiques et moraux (Tiers).",
    primaryKey: ["CLI"],
    foreignKeys: [{ column: "GRP", references: "BKGRP.GRP" }, { column: "GES", references: "BKGES.GES" }],
    columns: [
      { name: "CLI", type: "VARCHAR2(15)", description: "Identifiant unique interne du client." },
      { name: "NOM", type: "VARCHAR2(45)", description: "Nom patronymique ou raison sociale." },
      { name: "PRE", type: "VARCHAR2(30)", description: "Prénom du client." },
      { name: "TYP", type: "VARCHAR2(2)", description: "Type de personne : 01=Physique, 02=Morale, 03=EI." },
      { name: "ETA", type: "VARCHAR2(1)", description: "État du dossier client (A=Actif, F=Fermé, B=Bloqué)." },
      { name: "SEG", type: "VARCHAR2(3)", description: "Segment commercial de la clientèle." },
      { name: "RESID", type: "VARCHAR2(1)", description: "Résidence fiscale (O=Résident, N=Non-résident)." },
      { name: "DATNAI", type: "DATE", description: "Date de naissance ou de constitution légale.", sensitive: true },
    ],
    sampleQuery: "SELECT CLI, NOM, PRE, ETA, SEG FROM BKCLI WHERE ETA = 'A' AND ROWNUM <= 50;",
    criticalNotes: "Ne jamais modifier directement par script SQL sans passer par les API Tiers pour préserver les audits de conformité.",
  },
  {
    tableName: "BKCPT",
    module: "Comptes & Soldes",
    description: "Comptes à vue, comptes d'épargne et comptes techniques d'agences.",
    primaryKey: ["AGE", "NCP"],
    foreignKeys: [{ column: "CLI", references: "BKCLI.CLI" }, { column: "DEV", references: "BKDEV.DEV" }],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Code de l'agence de rattachement du compte." },
      { name: "NCP", type: "VARCHAR2(11)", description: "Numéro de compte racine (11 positions)." },
      { name: "CLI", type: "VARCHAR2(15)", description: "Code du client titulaire du compte." },
      { name: "DEV", type: "VARCHAR2(3)", description: "Code devise ISO du compte (ex: XOF, EUR, USD)." },
      { name: "CHA", type: "VARCHAR2(4)", description: "Chapitre comptable du plan de comptes." },
      { name: "SOL", type: "NUMBER(19,4)", description: "Solde comptable en devise du compte." },
      { name: "SIND", type: "NUMBER(19,4)", description: "Montant des indisponibilités / blocages provisions." },
      { name: "ETA", type: "VARCHAR2(1)", description: "État : A=Ouvert, F=Clôturé, D=Contentieux, I=Inactif." },
      { name: "DEB", type: "NUMBER(19,4)", description: "Autorisation de découvert accordée." },
    ],
    sampleQuery: "SELECT AGE, NCP, CLI, SOL, SIND, (SOL - SIND) AS DISPONIBLE FROM BKCPT WHERE NCP = '01001234567';",
    criticalNotes: "Le solde temps réel disponible pour la monétique correspond à (SOL - SIND + DEB).",
  },
  {
    tableName: "BKCOM",
    module: "Comptabilité & Balance",
    description: "Grand Livre et écritures comptables élémentaires validées.",
    primaryKey: ["AGE", "CHA", "DEV", "NCP", "SUF"],
    foreignKeys: [{ column: "CHA", references: "BKCHA.CHA" }],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Code agence comptable." },
      { name: "CHA", type: "VARCHAR2(4)", description: "Chapitre comptable (Classe 1 à 7)." },
      { name: "DEV", type: "VARCHAR2(3)", description: "Devise de tenue du compte général." },
      { name: "NCP", type: "VARCHAR2(11)", description: "Numéro de compte ou sous-compte GL." },
      { name: "SUF", type: "VARCHAR2(2)", description: "Suffixe de subdivision comptable." },
      { name: "SDC", type: "NUMBER(19,4)", description: "Solde cumulé au Débit." },
      { name: "SCC", type: "NUMBER(19,4)", description: "Solde cumulé au Crédit." },
      { name: "SDE", type: "NUMBER(19,4)", description: "Solde net Débiteur." },
      { name: "SCR", type: "NUMBER(19,4)", description: "Solde net Créditeur." },
    ],
    sampleQuery: "SELECT SUM(SDE) AS TOTAL_DEBIT, SUM(SCR) AS TOTAL_CREDIT FROM BKCOM WHERE DEV = 'XOF';",
    criticalNotes: "Contrôle fondamental de la balance EOD : TOTAL_DEBIT - TOTAL_CREDIT doit être rigoureusement égal à zéro.",
  },
  {
    tableName: "BKTRA",
    module: "Transactions / Mouvements",
    description: "Mouvements unitaires et journal de saisie des transactions bancaires.",
    primaryKey: ["AGE", "DCO", "ETA", "EVE"],
    foreignKeys: [{ column: "NCP", references: "BKCPT.NCP" }],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Code agence d'initiation." },
      { name: "DCO", type: "DATE", description: "Date comptable du mouvement." },
      { name: "DVA", type: "DATE", description: "Date de valeur de l'opération." },
      { name: "OPE", type: "VARCHAR2(3)", description: "Code opération interne Amplitude (ex: 010, 050)." },
      { name: "NCP", type: "VARCHAR2(11)", description: "Compte imputé." },
      { name: "MON", type: "NUMBER(19,4)", description: "Montant de l'écriture en devise d'origine." },
      { name: "SEN", type: "VARCHAR2(1)", description: "Sens : D=Débit, C=Crédit." },
      { name: "LIB", type: "VARCHAR2(40)", description: "Libellé de la transaction apparaissant sur le relevé." },
      { name: "UTI", type: "VARCHAR2(10)", description: "Opérateur ou automate ayant initié le mouvement." },
    ],
    sampleQuery: "SELECT DCO, OPE, NCP, MON, SEN, LIB FROM BKTRA WHERE DCO = TRUNC(SYSDATE) AND OPE = 'MNT';",
    criticalNotes: "Table très volumineuse. Tout SELECT d'exploitation doit impérativement filtrer sur la date DCO et le compte NCP indexés.",
  },
  {
    tableName: "BKDEV",
    module: "Paramétrage Devises",
    description: "Tables des devises gérées et cours de change journaliers.",
    primaryKey: ["DEV"],
    foreignKeys: [],
    columns: [
      { name: "DEV", type: "VARCHAR2(3)", description: "Code monnaie ISO 4217." },
      { name: "LIB", type: "VARCHAR2(30)", description: "Libellé de la devise." },
      { name: "DEC", type: "NUMBER(1)", description: "Nombre de décimales (0 pour XOF/JPY, 2 pour EUR/USD)." },
      { name: "COU", type: "NUMBER(15,7)", description: "Cours de référence du jour contre devise pivot." },
      { name: "ETA", type: "VARCHAR2(1)", description: "Statut de cotation (A=Actif, S=Suspendu)." },
    ],
    sampleQuery: "SELECT DEV, LIB, COU, DEC FROM BKDEV WHERE ETA = 'A';",
    criticalNotes: "Si les cours de clôture ne sont pas saisis à 18h00, le batch de réévaluation de change bloque.",
  },
  {
    tableName: "BKOPE",
    module: "Référentiel Opérations",
    description: "Types d'opérations et schémas comptables automatisés.",
    primaryKey: ["OPE"],
    foreignKeys: [],
    columns: [
      { name: "OPE", type: "VARCHAR2(3)", description: "Code opération à 3 caractères." },
      { name: "LIB", type: "VARCHAR2(35)", description: "Libellé opération standard." },
      { name: "SCH", type: "VARCHAR2(6)", description: "Schéma d'imputation comptable générique." },
      { name: "TAX", type: "VARCHAR2(1)", description: "Assujettissement à la taxe (TVA/TOB)." },
    ],
    sampleQuery: "SELECT OPE, LIB, SCH FROM BKOPE WHERE OPE LIKE 'M%';",
    criticalNotes: "Définit les flux miroir entre la monétique et les comptes généraux de compensation.",
  },
  ...CBS_ADDITIONAL_TABLES,
  ...CBS_EXTENDED_DICTIONARY,
];

// ----------------------------------------------------
// 2. BIBLIOTHÈQUE DE REQUÊTES SQL EXPERTES
// ----------------------------------------------------
export const CBS_SQL_PLAYBOOKS: CbsSqlQuery[] = [
  {
    id: "sql_balance_check",
    title: "Contrôle d'Équilibre Global de la Balance (Débit vs Crédit)",
    category: "EQUILIBRE",
    dbType: "Both",
    description: "Vérifie avant le lancement du batch EOD que la balance générale est strictement équilibrée. Doit retourner un différentiel égal à 0.",
    sql: `SELECT 
    DEV AS DEVISE,
    SUM(NVL(SDE, 0)) AS TOTAL_DEBITS,
    SUM(NVL(SCR, 0)) AS TOTAL_CREDITS,
    ABS(SUM(NVL(SDE, 0)) - SUM(NVL(SCR, 0))) AS ECART_DESEQUILIBRE
FROM BKCOM
WHERE AGE LIKE ':AGENCE'
GROUP BY DEV
HAVING ABS(SUM(NVL(SDE, 0)) - SUM(NVL(SCR, 0))) > 0;`,
    parameters: [
      { name: "AGENCE", label: "Code Agence (% pour toutes)", defaultValue: "%" }
    ],
    riskLevel: "LOW",
    executionAdvice: "Si cette requête renvoie une ligne, STOP IMMÉDIAT : ne lancez pas l'arrêté journalier tant que le déséquilibre n'est pas identifié."
  },
  {
    id: "sql_detect_blocking_sessions",
    title: "Détection des Sessions Bloquantes et Locks Exclusifs",
    category: "PERFORMANCE",
    dbType: "Oracle",
    description: "Identifie la session applicative ou utilisateur qui détient un verrou empêchant le batch Amplitude de progresser.",
    sql: `SELECT 
    b.sid AS BLOCKING_SID,
    b.serial# AS BLOCKING_SERIAL,
    b.username AS DB_USER,
    b.osuser AS OS_USER,
    b.program AS PROGRAMME,
    w.sid AS WAITING_SID,
    o.object_name AS TABLE_VERROUILLEE,
    l.locked_mode AS MODE_VERROU
FROM v$lock l1
JOIN v$session b ON l1.sid = b.sid
JOIN v$lock l2 ON l1.id1 = l2.id1 AND l1.id2 = l2.id2 AND l2.request > 0
JOIN v$session w ON l2.sid = w.sid
JOIN v$locked_object lo ON lo.session_id = b.sid
JOIN dba_objects o ON lo.object_id = o.object_id
WHERE l1.block = 1;`,
    parameters: [],
    riskLevel: "LOW",
    executionAdvice: "Utilisez le BLOCKING_SID et BLOCKING_SERIAL pour terminer la session bloquante avec ALTER SYSTEM KILL SESSION."
  },
  {
    id: "sql_tablespace_capacity",
    title: "Surveillance de l'Espace Tablespaces Oracle (Seuil > 85%)",
    category: "PERFORMANCE",
    dbType: "Oracle",
    description: "Contrôle l'espace libre dans les tablespaces Amplitude pour prévenir une saturation en plein milieu d'une écriture EOD (ORA-01653).",
    sql: `SELECT 
    df.tablespace_name AS TABLESPACE,
    ROUND(df.total_mb, 2) AS TOTAL_MB,
    ROUND(df.total_mb - fs.free_mb, 2) AS USED_MB,
    ROUND(fs.free_mb, 2) AS FREE_MB,
    ROUND((1 - (fs.free_mb / df.total_mb)) * 100, 2) AS PCT_UTILISATION
FROM (
    SELECT tablespace_name, SUM(bytes)/(1024*1024) total_mb
    FROM dba_data_files
    GROUP BY tablespace_name
) df
JOIN (
    SELECT tablespace_name, SUM(bytes)/(1024*1024) free_mb
    FROM dba_free_space
    GROUP BY tablespace_name
) fs ON df.tablespace_name = fs.tablespace_name
WHERE (1 - (fs.free_mb / df.total_mb)) * 100 >= :SEUIL_PCT
ORDER BY PCT_UTILISATION DESC;`,
    parameters: [
      { name: "SEUIL_PCT", label: "Seuil d'alerte (%)", defaultValue: "85" }
    ],
    riskLevel: "LOW",
    executionAdvice: "Si le tablespace DATA_AMP ou INDX_AMP dépasse 90%, étendez immédiatement le datafile avant le batch EOD."
  },
  {
    id: "sql_monetique_suspens",
    title: "Détection des Suspens de Compensation Monétique non Apurés",
    category: "AUDIT",
    dbType: "Both",
    description: "Extrait les opérations sur les comptes techniques de clearing monétique non réconciliées depuis plus de 48 heures.",
    sql: `SELECT 
    t.AGE,
    t.DCO AS DATE_COMPTABLE,
    t.NCP AS COMPTE_SUSPENS,
    t.OPE,
    t.MON AS MONTANT,
    t.SEN,
    t.LIB AS LIBELLE_OPERATION
FROM BKTRA t
WHERE t.NCP LIKE ':COMPTE_PREFIX%'
  AND t.DCO <= TRUNC(SYSDATE) - :JOURS
ORDER BY t.DCO ASC, t.MON DESC;`,
    parameters: [
      { name: "COMPTE_PREFIX", label: "Racine compte suspens (ex: 371)", defaultValue: "371" },
      { name: "JOURS", label: "Ancienneté minimale (jours)", defaultValue: "2" }
    ],
    riskLevel: "LOW",
    executionAdvice: "Ces suspens représentent un risque financier direct pour la banque (perte de règlement ou débit non répercuté client)."
  },
  {
    id: "sql_anomalous_overdrafts",
    title: "Comptes en Dépassement de Découvert Non Autorisé",
    category: "AUDIT",
    dbType: "Both",
    description: "Détecte les comptes particuliers ou entreprises dont le solde débiteur dépasse l'autorisation formelle de découvert.",
    sql: `SELECT 
    c.AGE,
    c.NCP,
    cli.NOM || ' ' || cli.PRE AS TITULAIRE,
    c.SOL AS SOLDE_COMPTABLE,
    NVL(c.DEB, 0) AS DECOUVERT_AUTORISE,
    (ABS(c.SOL) - NVL(c.DEB, 0)) AS MONTANT_DEPASSEMENT
FROM BKCPT c
JOIN BKCLI cli ON c.CLI = cli.CLI
WHERE c.SOL < 0 
  AND ABS(c.SOL) > NVL(c.DEB, 0)
  AND c.ETA = 'A'
ORDER BY MONTANT_DEPASSEMENT DESC;`,
    parameters: [],
    riskLevel: "LOW",
    executionAdvice: "À fournir au département des risques et des engagements avant le calcul des agios EOD."
  }
];

// ----------------------------------------------------
// 3. SCÉNARIOS DE DIAGNOSTIC DE BLOCAGE EOD
// ----------------------------------------------------
export const CBS_BATCH_DIAGNOSTICS: CbsBatchIncidentScenario[] = [
  {
    id: "eod_ora_00054",
    stepCode: "B_CPT_ARRETE",
    stepName: "Étape 8 - Calcul des Intérêts & Agios",
    errorCode: "ORA-00054",
    errorMessage: "resource busy and acquire with NOWAIT specified or timeout expired",
    severity: "CRITIQUE - NO GO BOD",
    rootCause: "Une transaction cliente ou un utilisateur sous SQL*Plus / Toad maintient un lock exclusif sur la table BKCOM ou BKCPT.",
    immediateAction: "Identifier la session bloquante via v$locked_object et exécuter un ALTER SYSTEM KILL SESSION immédiat.",
    recoveryCommand: "ALTER SYSTEM KILL SESSION ':SID,:SERIAL' IMMEDIATE;\n./reprise_batch.sh -step B_CPT_ARRETE -resume",
    bypassAllowed: false,
    slaImpactMinutes: 25
  },
  {
    id: "eod_ora_01653",
    stepCode: "B_GL_BALANCE",
    stepName: "Étape 9 - Génération de la Balance Générale & GL",
    errorCode: "ORA-01653",
    errorMessage: "unable to extend table AMPLITUDE.BKCOM by 8192 in tablespace DATA_AMP",
    severity: "CRITIQUE - NO GO BOD",
    rootCause: "Saturation complète de l'espace disque alloué au tablespace DATA_AMP. Le batch ne peut plus insérer d'écritures.",
    immediateAction: "Agrandir le datafile ou ajouter un nouveau datafile au tablespace concerné via le DBA d'astreinte.",
    recoveryCommand: "ALTER TABLESPACE DATA_AMP ADD DATAFILE '/u02/oradata/amp/data_amp05.dbf' SIZE 10G AUTOEXTEND ON MAXSIZE 30G;\n./relance_step.sh B_GL_BALANCE",
    bypassAllowed: false,
    slaImpactMinutes: 35
  },
  {
    id: "eod_ora_01555",
    stepCode: "B_CLI_EXPIR_PIECE",
    stepName: "Étape 4 - Purge et Revue Documentaire KYC",
    errorCode: "ORA-01555",
    errorMessage: "snapshot too old: rollback segment number 12 with name '_SYSSMU12$' too small",
    severity: "MINEUR - BYPASS POSSIBLE",
    rootCause: "La requête de lecture longue durée n'arrive plus à retrouver l'image cohérente des blocs écrasés par d'autres transactions concurrentes.",
    immediateAction: "Cette étape KYC n'étant pas bloquante pour la comptabilité, elle peut être bypassée exceptionnellement et relancée le lendemain matin.",
    recoveryCommand: "./bypass_step.sh B_CLI_EXPIR_PIECE --force --reason='KYC_NON_BLOCKING_ORA1555'",
    bypassAllowed: true,
    bypassProcedure: "Inscrire l'incident dans le PV d'astreinte. Programmer la relance manuelle à 08h30 après l'ouverture.",
    slaImpactMinutes: 10
  },
  {
    id: "eod_sigsegv_c",
    stepCode: "B_DAT_ICNE",
    stepName: "Étape 7 - Calcul des Intérêts Courus Dépôts (DAT)",
    errorCode: "SIGSEGV 11",
    errorMessage: "Segmentation violation - core dump generated in /tmp/core_amp_icne",
    severity: "CRITIQUE - NO GO BOD",
    rootCause: "Pointeur mémoire corrompu dans le binaire C/Pro*C suite à une division par zéro sur un DAT avec taux nul ou date future invalide.",
    immediateAction: "Isoler le numéro de contrat DAT coupable dans le fichier log /amp/log/icne.err et repositionner son flag d'exclusion temporaire.",
    recoveryCommand: "grep 'ERR_CONTRACT' /amp/log/icne.err\nUPDATE BKDAT SET TOPEXCL = 'O' WHERE NDAT = ':NUM_DAT';\n./reprise_batch.sh -step B_DAT_ICNE",
    bypassAllowed: false,
    slaImpactMinutes: 45
  }
];

// ----------------------------------------------------
// 4. RÈGLES DE DÉCODAGE ET ANALYSEUR DE LOGS
// ----------------------------------------------------
export const CBS_LOG_RULES: CbsLogRule[] = [
  {
    pattern: "ORA-00054",
    source: "Oracle Alert",
    severity: "CRITICAL",
    title: "Ressource occupée / Verrou Bloquant (ORA-00054)",
    explanation: "Une opération DDL ou SELECT FOR UPDATE NOWAIT a échoué car une ressource (table ou ligne) est déjà verrouillée en exclusif par une session concurrente.",
    recommendedAction: "Exécutez la requête des sessions bloquantes dans l'onglet SQL Playbooks, identifiez le SID coupable et terminez la session avec ALTER SYSTEM KILL SESSION.",
    extractedFields: ["SID", "TABLE"]
  },
  {
    pattern: "ORA-01653",
    source: "Oracle Alert",
    severity: "CRITICAL",
    title: "Tablespace Saturé - Impossible d'étendre la table",
    explanation: "Le tablespace Oracle n'a plus assez d'espace contigu pour allouer un nouvel extent lors des écritures batch volumineuses.",
    recommendedAction: "Vérifiez le filesystem AIX avec 'df -g'. Si de la place est disponible, ajoutez un datafile ou passez AUTOEXTEND ON avec RESIZE.",
    extractedFields: ["TABLESPACE", "TABLE"]
  },
  {
    pattern: "ORA-01555",
    source: "Oracle Alert",
    severity: "HIGH",
    title: "Snapshot Too Old (ORA-01555)",
    explanation: "Le segment UNDO (Rollback) a été recyclé avant la fin d'une requête de lecture à longue durée. L'image de consistance en lecture est perdue.",
    recommendedAction: "Augmentez UNDO_RETENTION (ALTER SYSTEM SET UNDO_RETENTION = 7200) ou relancez le batch isolé sans transactions concurrentes.",
    extractedFields: ["ROLLBACK_SEGMENT"]
  },
  {
    pattern: "SIGSEGV",
    source: "Amplitude Batch",
    severity: "CRITICAL",
    title: "Crash Binaire Amplitude (SIGSEGV Core Dump)",
    explanation: "Le programme C/C++ du noyau Amplitude a accédé à une zone mémoire non allouée (corruption de pointeur ou valeur anormale en base).",
    recommendedAction: "Inspectez le fichier .err correspondant dans /amp/run/log. Isolez la dernière ligne client/compte lue juste avant le crash.",
    extractedFields: ["BINARY", "CORE_FILE"]
  },
  {
    pattern: "TUXEDO",
    source: "Tuxedo",
    severity: "HIGH",
    title: "Time-out ou Erreur Serveur d'Application Tuxedo",
    explanation: "Le service Tuxedo métier (ex: SV_COMPTE) ne répond plus ou a dépassé le seuil de time-out réseau/base de données.",
    recommendedAction: "Vérifiez l'état des serveurs Tuxedo avec 'tmadmin -> psr'. Redémarrez le service spécifique avec 'tmshutdown -s <SERVICE>' puis 'tmboot -s <SERVICE>'.",
    extractedFields: ["SERVICE_NAME"]
  },
  {
    pattern: "filesystem full",
    source: "AIX Syslog",
    severity: "CRITICAL",
    title: "Problème Système Fichiers AIX / Disque Saturé",
    explanation: "Le filesystem AIX contenant les interfaces ou les logs batch n'a plus d'espace disponible en écriture.",
    recommendedAction: "Exécutez 'df -g' pour trouver le filesystem à 100%. Purgez les vieux logs gzip ou étendez le Logical Volume avec chfs.",
    extractedFields: ["MOUNT_POINT"]
  }
];

// ----------------------------------------------------
// 5. DONNÉES DE COMPENSATION & RÉCONCILIATION MONÉTIQUE
// ----------------------------------------------------
export const CBS_RECONCILIATION_DATA: CbsReconciliationRecord[] = [
  {
    fileReference: "CLEAR_VISA_20260920_001.TXT",
    network: "VISA",
    txDate: "2026-09-20 14:22:10",
    cardMasked: "4111 11** **** 1234",
    accountNumber: "01001556677",
    amount: 85000,
    currency: "XOF",
    authCode: "654321",
    cbsStatus: "MATCHED",
    cbsAccountFound: true,
    glSuspenseAccount: "37110000",
    solution: "Imputation comptable directe validée sur le compte client et contrepartie compensée."
  },
  {
    fileReference: "CLEAR_MC_20260920_044.TXT",
    network: "MASTERCARD",
    txDate: "2026-09-20 16:45:00",
    cardMasked: "5200 82** **** 9988",
    accountNumber: "02008899112",
    amount: 150000,
    currency: "XOF",
    authCode: "987123",
    cbsStatus: "SUSPENSE",
    rejectReason: "Compte client bloqué administrativement (ATD / Saisie attribution reçue le jour même).",
    cbsAccountFound: true,
    glSuspenseAccount: "37110050",
    solution: "Débit orienté sur le compte de suspens monétique 37110050. Notification au back-office pour régularisation juridique."
  },
  {
    fileReference: "CLEAR_GIM_20260920_012.DAT",
    network: "GIM_UEMOA",
    txDate: "2026-09-20 11:05:32",
    cardMasked: "6051 44** **** 3344",
    accountNumber: "01009999999",
    amount: 40000,
    currency: "XOF",
    authCode: "112233",
    cbsStatus: "REJECTED",
    rejectReason: "Compte clôturé dans Amplitude depuis plus de 30 jours (Code retour 42).",
    cbsAccountFound: false,
    glSuspenseAccount: "37110099",
    solution: "Émission d'un message de contestation / chargeback (Présentation non recevable)."
  },
  {
    fileReference: "CLEAR_VISA_20260920_002.TXT",
    network: "VISA",
    txDate: "2026-09-20 15:30:19",
    cardMasked: "4023 60** **** 7711",
    accountNumber: "01002233445",
    amount: 25000,
    currency: "XOF",
    authCode: "776655",
    cbsStatus: "PENDING",
    cbsAccountFound: true,
    glSuspenseAccount: "37110000",
    solution: "En attente d'imputation dans le lot de compensation de nuit (Batch B_MNT_CLEARING)."
  }
];
