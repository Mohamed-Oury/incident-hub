// modules/cbs/flexcube/engine/flexcube-copilot-engine.ts
import {
  FlexcubeNeedInput,
  FlexcubeFullPlan,
  FlexcubeFunctionalAnalysis,
  FlexcubeSubTask,
  FlexcubePlSqlProposal,
  FlexcubeSqlProposal,
  FlexcubeTestCase,
  FlexcubeDeliveryPackage,
  FlexcubeTableDefinition,
  FlexcubeIncident
} from "../types";
import { CbsPromptTraceability } from "../../router/cbs-context";
import { FLEXCUBE_SCHEMA_TABLES } from "../data/flexcube-schema-tables";
import { FLEXCUBE_INCIDENTS } from "../data/flexcube-incidents-data";

/**
 * 1. Résolution sémantique des tables Oracle FLEXCUBE selon la requête et le module
 */
export function resolveFlexcubeTables(queryText: string, targetModule?: string): FlexcubeTableDefinition[] {
  const query = (queryText + " " + (targetModule || "")).toLowerCase();
  const matched = new Set<string>();

  const mappings: { keywords: string[]; tables: string[] }[] = [
    {
      keywords: ["client", "cif", "tiers", "kyc", "identite", "morale", "physique", "nom", "rccm", "nif"],
      tables: ["STTM_CUSTOMER", "STTM_BRANCH"]
    },
    {
      keywords: ["compte", "solde", "courant", "epargne", "rib", "bban", "decouvert", "gel", "bloque", "dormant", "disponible"],
      tables: ["STTM_CUST_ACCOUNT", "STTM_ACCOUNT_CLASS", "ACTB_ACCBAL_HISTORY"]
    },
    {
      keywords: ["ecriture", "mouvement", "comptable", "debit", "credit", "journal", "journalier", "drcr", "balance"],
      tables: ["ACTB_DAILY_LOG", "ACVW_ALL_AC_ENTRIES", "GLTB_GL_BALANCES", "GLTM_GLMASTER"]
    },
    {
      keywords: ["virement", "transfert", "swift", "rtgs", "ordre", "fond", "remise", "mt103", "pacs"],
      tables: ["FTTB_CONTRACT_MASTER", "ACTB_DAILY_LOG", "STTM_CUST_ACCOUNT"]
    },
    {
      keywords: ["pret", "credit", "emprunt", "echeance", "amortissement", "interet", "capital", "impaye", "contentieux"],
      tables: ["CLTB_ACCOUNT_MASTER", "CLTB_ACCOUNT_SCHEDULES", "STTM_CUST_ACCOUNT"]
    },
    {
      keywords: ["lettre de credit", "credoc", "lc", "trade", "import", "export", "collatéral", "amendement"],
      tables: ["LCTB_CONTRACT_MASTER", "STTM_CUST_ACCOUNT"]
    },
    {
      keywords: ["caisse", "guichet", "especes", "billetage", "teller", "versement", "retrait guichet"],
      tables: ["DETB_RTL_TELLER", "ACTB_DAILY_LOG", "STTM_BRANCH"]
    },
    {
      keywords: ["batch", "cloture", "aeod", "eod", "bod", "eoti", "eofi", "peod", "nocturne", "arrete"],
      tables: ["AETB_PROCESS_PROGRESS", "EOTB_PROGRAM_MASTER", "ACTB_DAILY_LOG", "GLTB_GL_BALANCES"]
    },
    {
      keywords: ["switch", "monetique", "gateway", "atm", "pos", "gab", "tpe", "iso 8583", "passerelle", "api", "xml"],
      tables: ["GWTM_GATEWAY_PARAM", "STTM_CUST_ACCOUNT", "ACTB_DAILY_LOG"]
    },
    {
      keywords: ["devise", "change", "cours", "taux", "fx", "cotation", "mid"],
      tables: ["CYTM_RATES", "STTM_BRANCH"]
    }
  ];

  for (const m of mappings) {
    if (m.keywords.some((kw) => query.includes(kw))) {
      m.tables.forEach((t) => matched.add(t));
    }
  }

  if (matched.size === 0) {
    matched.add("STTM_CUST_ACCOUNT");
    matched.add("STTM_CUSTOMER");
    matched.add("ACTB_DAILY_LOG");
  }

  const results = FLEXCUBE_SCHEMA_TABLES.filter((t) => matched.has(t.tableName));
  return results.length > 0 ? results : [FLEXCUBE_SCHEMA_TABLES[0], FLEXCUBE_SCHEMA_TABLES[1]];
}

/**
 * 2. Moteur de Génération du Plan Complet FLEXCUBE Copilot
 */
export function generateFlexcubePlan(input: FlexcubeNeedInput): FlexcubeFullPlan {
  const tables = resolveFlexcubeTables(input.functionalDescription + " " + input.knownBusinessRules, input.module);
  const primaryTable = tables[0]?.tableName || "STTM_CUST_ACCOUNT";
  const cleanTitle = input.title.replace(/[^a-zA-Z0-9_ ]/g, "").trim().replace(/\s+/g, "_").toUpperCase();
  const pkgBaseName = `CUSPKS_${cleanTitle.substring(0, 15) || "BANK_FEATURE"}`;

  // Analyse Fonctionnelle
  const analysis: FlexcubeFunctionalAnalysis = {
    summary: `Développement et intégration bancaire pour le besoin "${input.title}" sur Oracle FLEXCUBE (Module ${input.module}).`,
    businessObjective: input.functionalDescription,
    targetModule: input.module,
    actors: [input.targetUsers || "Gestionnaire Bancaire Agence / Opérateur Back-Office", "Système Batch AEOD", "Superviseur Habilité"],
    preconditions: [
      `Compte et entités existants et actifs dans les tables maîtresses (${primaryTable}).`,
      "Agence ouverte et date système valide dans STTM_BRANCH.",
      "Utilisateur habilité avec profil fonctionnel adéquat dans SMS (Security Management System)."
    ],
    postconditions: [
      "Persistance transactionnelle dans les tables applicatives avec mise à jour des soldes ou statuts.",
      "Génération des traces d audit et des écritures comptables associées dans ACTB_DAILY_LOG le cas échéant.",
      "Notification ou retour de statut à l interface utilisateur ou à la Gateway."
    ],
    businessRules: [
      input.knownBusinessRules || "Validation stricte des habilitations et respect de la règle d intégrité référentielle.",
      "Contrôle d absence d opposition ou de gel juridique (FROZEN != 'Y', AC_STAT_NO_DR != 'Y').",
      "Équilibre systématique Débit = Crédit en devise locale (LCY_AMOUNT) pour tout mouvement comptable.",
      "Exécution sous transaction atomique sans COMMIT intermédiaire dans les sous-procédures."
    ],
    requiredData: [input.inputData || "Numéro de compte, Code agence, Montant, Devise, Motif"],
    flexcubeDependencies: tables.map((t) => `${t.tableName} (${t.module})`),
    accountingImpacts: [
      input.module === "AC" || input.module === "FT"
        ? "Imputation directe dans le journal des écritures ACTB_DAILY_LOG avec déversement en fin de journée vers GLTB_GL_BALANCES."
        : "Pas d écriture comptable financière immédiate, enregistrement de données signalétiques ou statutaires."
    ],
    unresolvedQuestions: [
      input.flexcubeVersion === "UNCONFIRMED"
        ? "Version exacte de FLEXCUBE à confirmer (12.4 vs 14.x) : impact possible sur les signatures des API Kernel de validation."
        : `Version confirmée : Oracle FLEXCUBE ${input.flexcubeVersion}.`,
      "Vérifier si un workflow de double signature (Maker-Checker) spécifique à l agence doit être déclenché au-delà d un seuil."
    ],
    technicalRisks: [
      "Risque de verrou concurrent (ORA-00054) lors des fortes affluences si la sélection se fait sans NOWAIT.",
      "Impact sur la durée de clôture AEOD si le volume de données à traiter n est pas indexé correctement."
    ]
  };

  // Sous-tâches ordonnées
  const subTasks: FlexcubeSubTask[] = [
    {
      id: "TASK-01",
      title: "Analyse des spécifications fonctionnelles & impacts comptables",
      description: "Revue détaillée des règles métier, identification des tables impactées et modélisation du schéma d écritures.",
      type: "FONCTIONNEL",
      priority: "BLOQUANTE",
      dependencies: [],
      estimation: "1.5 jours",
      inputs: input.inputData,
      outputs: "Document de Spécification Fonctionnelle Détaillée (SFD)",
      acceptanceCriteria: ["Validation par le Responsable Métier", "Validation du schéma comptable"],
      concernedObjects: [primaryTable],
      status: "VALIDE"
    },
    {
      id: "TASK-02",
      title: "Scripts DDL & Indexation de performance",
      description: "Création des tables d audit, séquences et index composites sur les colonnes de jointure.",
      type: "SQL_DDL",
      priority: "HAUTE",
      dependencies: ["TASK-01"],
      estimation: "1 jour",
      inputs: "Spécification de données",
      outputs: `Scripts DDL pour tables de support et index sur ${primaryTable}`,
      acceptanceCriteria: ["Absence de Full Table Scan sur les requêtes volumineuses", "Respect des conventions FCC"],
      concernedObjects: [primaryTable, "CSTM_AUDIT_LOG"],
      status: "A_FAIRE"
    },
    {
      id: "TASK-03",
      title: `Développement du Package Custom (${pkgBaseName}_CUSTOM)`,
      description: "Implémentation de la logique métier, contrôles de pré-validation et traitement des données en PL/SQL sécurisé.",
      type: "PLSQL_PACKAGE",
      priority: "BLOQUANTE",
      dependencies: ["TASK-02"],
      estimation: "3 jours",
      inputs: "Package Spec & SFD",
      outputs: `${pkgBaseName}_CUSTOM.spc et ${pkgBaseName}_CUSTOM.sql`,
      acceptanceCriteria: ["Compilation sans warning", "Absence de COMMIT intempestif", "Gestion d exception ORA-00054"],
      concernedObjects: [pkgBaseName],
      status: "A_FAIRE"
    },
    {
      id: "TASK-04",
      title: "Développement des Triggers & Hooks d Extensibilité",
      description: "Raccordement des hooks d appel entre le package Kernel et le package Custom de la banque.",
      type: "TRIGGER",
      priority: "HAUTE",
      dependencies: ["TASK-03"],
      estimation: "1 jour",
      inputs: "Spécification d interface",
      outputs: "Triggers d appel ou configuration ODT",
      acceptanceCriteria: ["Exécution transparente lors de la validation"],
      concernedObjects: [pkgBaseName],
      status: "A_FAIRE"
    },
    {
      id: "TASK-05",
      title: "Tests Unitaires & Simulation de Concurrence",
      description: "Exécution des scénarios nominaux, tests de dépassement de limite et vérification des verrous concurrents.",
      type: "TEST_UNITAIRE",
      priority: "HAUTE",
      dependencies: ["TASK-04"],
      estimation: "2 jours",
      inputs: "Jeu de données de test recette",
      outputs: "Procès-verbal de tests unitaires",
      acceptanceCriteria: ["100% des cas nominaux et d erreur passés avec succès"],
      concernedObjects: ["TEST_SUITE"],
      status: "A_FAIRE"
    },
    {
      id: "TASK-06",
      title: "Package de Livraison & Procédure de Rollback",
      description: "Constitution du livrable technique selon les standards release FLEXCUBE et rédaction du plan de repli.",
      type: "DOCUMENTATION",
      priority: "MOYENNE",
      dependencies: ["TASK-05"],
      estimation: "0.5 jour",
      inputs: "Ensemble des scripts validés",
      outputs: "Release notes et package SQL prêt à installer",
      acceptanceCriteria: ["Ordre de compilation vérifié", "Script de rollback testé"],
      concernedObjects: ["DELIVERY_ZIP"],
      status: "A_FAIRE"
    }
  ];

  // Proposition de code PL/SQL
  const plsqlProposal: FlexcubePlSqlProposal = {
    packageName: `${pkgBaseName}_CUSTOM`,
    packageType: "CUSTOM",
    packageSpec: `CREATE OR REPLACE PACKAGE ${pkgBaseName}_CUSTOM AS
  /* =========================================================================
   * Nom du Package : ${pkgBaseName}_CUSTOM
   * Objectif       : ${input.title}
   * Module         : Oracle FLEXCUBE ${input.module}
   * Environnement  : Base de Données Oracle Enterprise
   * ========================================================================= */

  -- Codes d erreurs applicatifs
  g_err_account_not_found CONSTANT VARCHAR2(15) := 'FCUBS-AC-NOTFND';
  g_err_insufficient_bal  CONSTANT VARCHAR2(15) := 'AC-VAL-001';
  g_err_account_blocked   CONSTANT VARCHAR2(15) := 'FCUBS-AC-BLCK';

  -- Procédure principale d exécution
  PROCEDURE Pr_Process_Request (
    p_branch_code IN  VARCHAR2,
    p_account_no  IN  VARCHAR2,
    p_amount      IN  NUMBER,
    p_currency    IN  VARCHAR2,
    p_ref_no      OUT VARCHAR2,
    p_status      OUT VARCHAR2,
    p_err_code    OUT VARCHAR2,
    p_err_msg     OUT VARCHAR2
  );

  -- Fonction de contrôle de pré-validation
  FUNCTION Fn_Pre_Check (
    p_branch_code IN VARCHAR2,
    p_account_no  IN VARCHAR2
  ) RETURN BOOLEAN;

END ${pkgBaseName}_CUSTOM;
/`,
    packageBody: `CREATE OR REPLACE PACKAGE BODY ${pkgBaseName}_CUSTOM AS
  /* =========================================================================
   * Corps du Package : ${pkgBaseName}_CUSTOM
   * ========================================================================= */

  -- Procédure autonome d enregistrement des traces d audit
  PROCEDURE Pr_Log_Audit (
    p_action   IN VARCHAR2,
    p_account  IN VARCHAR2,
    p_detail   IN VARCHAR2
  ) IS
    PRAGMA AUTONOMOUS_TRANSACTION;
  BEGIN
    INSERT INTO CSTB_DEBUG_LOG (LOG_DATE, MODULE, MESSAGE)
    VALUES (SYSDATE, '${input.module}', p_action || ' - AC: ' || p_account || ' - ' || p_detail);
    COMMIT;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
  END Pr_Log_Audit;

  FUNCTION Fn_Pre_Check (
    p_branch_code IN VARCHAR2,
    p_account_no  IN VARCHAR2
  ) RETURN BOOLEAN IS
    l_frozen  CHAR(1);
    l_no_dr   CHAR(1);
    l_rec_st  CHAR(1);
  BEGIN
    SELECT AC_STAT_FROZEN, AC_STAT_NO_DR, RECORD_STAT
    INTO l_frozen, l_no_dr, l_rec_st
    FROM STTM_CUST_ACCOUNT
    WHERE BRANCH_CODE = p_branch_code AND CUST_AC_NO = p_account_no;

    IF l_rec_st = 'C' OR l_frozen = 'Y' OR l_no_dr = 'Y' THEN
      RETURN FALSE;
    END IF;

    RETURN TRUE;
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RETURN FALSE;
  END Fn_Pre_Check;

  PROCEDURE Pr_Process_Request (
    p_branch_code IN  VARCHAR2,
    p_account_no  IN  VARCHAR2,
    p_amount      IN  NUMBER,
    p_currency    IN  VARCHAR2,
    p_ref_no      OUT VARCHAR2,
    p_status      OUT VARCHAR2,
    p_err_code    OUT VARCHAR2,
    p_err_msg     OUT VARCHAR2
  ) IS
    RESOURCE_BUSY EXCEPTION;
    PRAGMA EXCEPTION_INIT(RESOURCE_BUSY, -54);

    l_avail_bal NUMBER(22,3);
    l_ccy       VARCHAR2(3);
  BEGIN
    p_status := 'FAILED';

    -- 1. Vérification des prérequis
    IF NOT Fn_Pre_Check(p_branch_code, p_account_no) THEN
      p_err_code := g_err_account_blocked;
      p_err_msg  := 'Le compte est clôturé ou sous restriction de débit.';
      Pr_Log_Audit('PRE_CHECK_FAIL', p_account_no, p_err_msg);
      RETURN;
    END IF;

    -- 2. Verrouillage sécurisé avec NOWAIT (Évite ORA-00054 bloquant)
    SELECT ACY_AVL_BAL, CCY
    INTO l_avail_bal, l_ccy
    FROM STTM_CUST_ACCOUNT
    WHERE BRANCH_CODE = p_branch_code AND CUST_AC_NO = p_account_no
    FOR UPDATE NOWAIT;

    -- 3. Contrôle de provision disponible
    IF p_amount > 0 AND l_avail_bal < p_amount THEN
      p_err_code := g_err_insufficient_bal;
      p_err_msg  := 'Solde disponible insuffisant pour l opération.';
      Pr_Log_Audit('INSUFFICIENT_FUNDS', p_account_no, 'Requis: ' || p_amount || ', Dispo: ' || l_avail_bal);
      RETURN;
    END IF;

    -- 4. Exécution du traitement métier
    p_ref_no := 'FC' || TO_CHAR(SYSDATE, 'YYYYMMDD') || LPAD(ROUND(DBMS_RANDOM.VALUE(1, 999999)), 6, '0');
    p_status := 'SUCCESS';
    p_err_code := '00';
    p_err_msg  := 'Traitement validé avec succès.';

    Pr_Log_Audit('PROCESS_SUCCESS', p_account_no, 'Ref: ' || p_ref_no || ', Montant: ' || p_amount);

    -- NOTE : Pas de COMMIT ici. La validation transactionnelle finale est déléguée au superviseur / gateway.
  EXCEPTION
    WHEN RESOURCE_BUSY THEN
      p_err_code := 'ORA-00054';
      p_err_msg  := 'Compte momentanément occupé par une autre transaction. Veuillez réessayer.';
      Pr_Log_Audit('LOCK_TIMEOUT', p_account_no, p_err_msg);
    WHEN NO_DATA_FOUND THEN
      p_err_code := g_err_account_not_found;
      p_err_msg  := 'Numéro de compte inexistant dans l agence spécifiée.';
      Pr_Log_Audit('NOT_FOUND', p_account_no, p_err_msg);
    WHEN OTHERS THEN
      p_err_code := 'ORA-' || LPAD(SQLCODE, 5, '0');
      p_err_msg  := SQLERRM;
      Pr_Log_Audit('FATAL_ERROR', p_account_no, p_err_msg);
  END Pr_Process_Request;

END ${pkgBaseName}_CUSTOM;
/`,
    entryPoints: ["Fn_Pre_Check", "Pr_Process_Request"],
    errorHandlingStrategy: "Capture explicite de ORA-00054 (Resource busy) et journalisation via Autonomous Transaction.",
    autonomousTransactions: true,
    performanceConsiderations: [
      "Clause FOR UPDATE NOWAIT pour éviter l engorgement des pools de connexions WebLogic.",
      "Journalisation d audit isolée dans PRAGMA AUTONOMOUS_TRANSACTION.",
      "Index composite requis sur (BRANCH_CODE, CUST_AC_NO)."
    ],
    importantNotes: [
      "Ce package est configuré pour l extensibilité Custom : les objets natifs Kernel restent intouchés.",
      "À déployer dans le schéma de base de données FCC_USER avec les privilèges appropriés."
    ]
  };

  // Proposition SQL & Index
  const sqlProposal: FlexcubeSqlProposal = {
    objective: `Optimisation des accès et requêtes de contrôle pour ${input.title}`,
    targetTables: tables.map((t) => t.tableName),
    sqlCode: `-- Requête de contrôle de solde et statut pour l opération
SELECT ca.BRANCH_CODE,
       ca.CUST_AC_NO,
       ca.CCY,
       ca.ACY_AVL_BAL,
       ca.AC_STAT_FROZEN,
       ca.AC_STAT_NO_DR,
       c.CUSTOMER_NAME1
FROM STTM_CUST_ACCOUNT ca
JOIN STTM_CUSTOMER c ON ca.CUST_NO = c.CUSTOMER_NO
WHERE ca.BRANCH_CODE = :p_branch_code
  AND ca.CUST_AC_NO  = :p_account_no
  AND ca.RECORD_STAT = 'O';`,
    indexRecommendations: [
      `CREATE INDEX IDX_${primaryTable}_LOOKUP ON ${primaryTable} (BRANCH_CODE, CUST_AC_NO) COMPUTE STATISTICS;`
    ],
    rollbackScript: `-- Script de retour arrière
DROP INDEX IDX_${primaryTable}_LOOKUP;
DROP PACKAGE ${pkgBaseName}_CUSTOM;`
  };

  // Cas de tests unitaires
  const testCases: FlexcubeTestCase[] = [
    {
      id: "TC-01",
      category: "NOMINAL",
      title: "Traitement nominal avec compte actif et solde suffisant",
      preconditions: "Compte existant dans STTM_CUST_ACCOUNT avec ACY_AVL_BAL >= 100 000 XOF et RECORD_STAT = 'O'.",
      testSteps: [
        "1. Appeler Pr_Process_Request avec montant = 50 000 XOF.",
        "2. Vérifier que p_status retourne 'SUCCESS'.",
        "3. Contrôler la génération de la référence p_ref_no."
      ],
      expectedResult: "Status SUCCESS, référence générée, trace présente dans CSTB_DEBUG_LOG.",
      actualStatus: "A_TESTER"
    },
    {
      id: "TC-02",
      category: "ERREUR_METIER",
      title: "Refus pour solde disponible insuffisant (AC-VAL-001)",
      preconditions: "Compte avec solde disponible = 5 000 XOF.",
      testSteps: [
        "1. Appeler Pr_Process_Request avec montant = 50 000 XOF.",
        "2. Vérifier que p_status retourne 'FAILED'.",
        "3. Vérifier que p_err_code = 'AC-VAL-001'."
      ],
      expectedResult: "Statut FAILED avec code d erreur AC-VAL-001 explicite.",
      actualStatus: "A_TESTER"
    },
    {
      id: "TC-03",
      category: "LIMITES",
      title: "Refus sur compte gelé administrativement (AC_STAT_FROZEN = 'Y')",
      preconditions: "Compte avec drapeau de gel positionné à 'Y'.",
      testSteps: [
        "1. Appeler Pr_Process_Request.",
        "2. Vérifier le blocage immédiat lors du Fn_Pre_Check."
      ],
      expectedResult: "Rejet immédiat avant pose de verrou.",
      actualStatus: "A_TESTER"
    },
    {
      id: "TC-04",
      category: "CONCURRENCE_VERROU",
      title: "Gestion propre du verrouillage concurrent (ORA-00054)",
      preconditions: "Session concurrente maintenant un verrou exclusif sur la ligne du compte.",
      testSteps: [
        "1. Ouvrir une session SQL et faire SELECT ... FOR UPDATE sans commit.",
        "2. Lancer Pr_Process_Request dans une seconde session.",
        "3. Vérifier que la fonction lève ORA-00054 sans bloquer indéfiniment."
      ],
      expectedResult: "Retour immédiat de l erreur ORA-00054 sans gel de session WebLogic.",
      actualStatus: "A_TESTER"
    }
  ];

  // Package de livraison
  const deliveryPackage: FlexcubeDeliveryPackage = {
    modifiedObjects: [`${pkgBaseName}_CUSTOM (Package)`, `IDX_${primaryTable}_LOOKUP (Index)`],
    deploymentOrder: [
      "1. Exécution des scripts d indexation SQL (DDL)",
      `2. Compilation de la spécification ${pkgBaseName}_CUSTOM.spc`,
      `3. Compilation du corps de package ${pkgBaseName}_CUSTOM.sql`,
      "4. Octroi des privilèges GRANT EXECUTE au rôle applicatif FCC_APP_ROLE",
      "5. Création des synonymes publics le cas échéant"
    ],
    grantStatements: [
      `GRANT EXECUTE ON ${pkgBaseName}_CUSTOM TO FCC_APP_ROLE;`
    ],
    synonymCreation: [
      `CREATE OR REPLACE PUBLIC SYNONYM ${pkgBaseName}_CUSTOM FOR ${pkgBaseName}_CUSTOM;`
    ],
    preDeliveryChecklist: [
      "Sauvegarde complète du schéma ou export Data Pump avant déploiement.",
      "Vérification de l absence de session batch AEOD active lors de la compilation."
    ],
    postDeliveryChecklist: [
      "Vérification du statut VALID des objets compilés dans DBA_OBJECTS.",
      "Exécution du cas de test nominal TC-01 en environnement UAT."
    ],
    rollbackPlan: [
      `1. DROP PACKAGE ${pkgBaseName}_CUSTOM;`,
      `2. DROP INDEX IDX_${primaryTable}_LOOKUP;`,
      "3. Recompilation des objets invalidés via DBMS_UTILITY.COMPILE_SCHEMA."
    ]
  };

  // Traçabilité & Transparence
  const traceability: CbsPromptTraceability = {
    officialDocsUsed: [
      "Oracle FLEXCUBE Universal Banking 14.x / 12.4 Extensibility Reference Guide",
      "FCUBS Development Workbench (ODT) Standards & Guidelines",
      "Oracle Database 19c PL/SQL Packages and Types Reference"
    ],
    inferredRules: [
      "Application stricte de la séparation _KERNEL / _CUSTOM conformément au framework Oracle.",
      "Gestion de la concurrence avec NOWAIT pour respecter les SLAs de réponse en ligne.",
      "Isolation des traces d audit dans une transaction autonome (PRAGMA AUTONOMOUS_TRANSACTION)."
    ],
    unconfirmedAssumptions: [
      input.flexcubeVersion === "UNCONFIRMED"
        ? "Version installée non certifiée : valider les conventions de nommage du cluster régional (ex: UEMOA/CEMAC)."
        : `Version ${input.flexcubeVersion} prise en compte.`,
      "Vérifier la politique de purge automatique de la table CSTB_DEBUG_LOG sur votre environnement."
    ],
    versionCaveat: input.flexcubeVersion === "UNCONFIRMED"
      ? "ATTENTION : La version exacte de FLEXCUBE n est pas encore confirmée. Ce code utilise les patterns standards Oracle 12.4 / 14.x et doit être validé sur votre environnement de développement cible avant toute mise en recette."
      : `Code généré pour Oracle FLEXCUBE ${input.flexcubeVersion}.`
  };

  return {
    need: input,
    analysis,
    subTasks,
    plsqlProposal,
    sqlProposal,
    testCases,
    deliveryPackage,
    traceability,
    generatedDate: new Date().toISOString()
  };
}

/**
 * 3. Analyse d incident RUN FLEXCUBE
 */
export function analyzeFlexcubeIncident(errorOrLogText: string): {
  detectedIncident: FlexcubeIncident | null;
  rootCause: string;
  recommendedAction: string;
  sqlQuery: string;
} {
  const text = errorOrLogText.toLowerCase();

  for (const inc of FLEXCUBE_INCIDENTS) {
    if (text.includes(inc.errorCode.toLowerCase()) || text.includes(inc.title.toLowerCase()) || (inc.typicalLog && text.includes(inc.typicalLog.toLowerCase()))) {
      return {
        detectedIncident: inc,
        rootCause: inc.rootCause,
        recommendedAction: inc.resolutionProcedure.join("\n"),
        sqlQuery: inc.investigationQuery
      };
    }
  }

  // Fallback si l erreur n est pas exactement répertoriée
  return {
    detectedIncident: null,
    rootCause: "Anomalie d exécution Oracle FLEXCUBE à investiguer via les vues dynamiques v$session / v$locked_object.",
    recommendedAction: "1. Isoler la session concernée.\n2. Consulter les traces dans CSTB_DEBUG_LOG.\n3. Vérifier l état des tablespaces.",
    sqlQuery: "SELECT s.sid, s.serial#, s.username, s.status, s.program FROM v$session s WHERE s.status = 'ACTIVE';"
  };
}

/**
 * 4. Audit & Revue de Code PL/SQL FLEXCUBE
 */
export function reviewFlexcubePlSql(code: string): {
  issues: { severity: "CRITIQUE" | "AVERTISSEMENT" | "INFO"; message: string; fix: string }[];
  score: number;
} {
  const issues: { severity: "CRITIQUE" | "AVERTISSEMENT" | "INFO"; message: string; fix: string }[] = [];
  const upper = code.toUpperCase();

  if (upper.includes("COMMIT") && !upper.includes("AUTONOMOUS_TRANSACTION")) {
    issues.push({
      severity: "CRITIQUE",
      message: "Présence d une instruction COMMIT dans une procédure non autonome. Cela brise l atomicité transactionnelle du Core Banking.",
      fix: "Déléguer le COMMIT à la couche d orchestration supérieure ou utiliser PRAGMA AUTONOMOUS_TRANSACTION si c est un log d audit."
    });
  }

  if (upper.includes("FOR UPDATE") && !upper.includes("NOWAIT") && !upper.includes("WAIT")) {
    issues.push({
      severity: "CRITIQUE",
      message: "SELECT ... FOR UPDATE sans clause NOWAIT détecté. Risque élevé de blocage indéfini des sessions et de gel de l application.",
      fix: "Ajouter la clause NOWAIT et intercepter l exception ORA-00054."
    });
  }

  if (upper.includes("EXECUTE IMMEDIATE") && !upper.includes("USING")) {
    issues.push({
      severity: "AVERTISSEMENT",
      message: "Utilisation possible de SQL dynamique sans variables de liaison (USING). Risque de saturation de la Shared Pool (ORA-04031).",
      fix: "Toujours utiliser la clause USING avec des variables liées dans les instructions EXECUTE IMMEDIATE."
    });
  }

  if (upper.includes("CURSOR") && !upper.includes("CLOSE")) {
    issues.push({
      severity: "AVERTISSEMENT",
      message: "Curseur explicite ouvert sans fermeture évidente (CLOSE). Risque d épuisement des curseurs ouverts (ORA-01000).",
      fix: "Assurer la fermeture systématique des curseurs dans tous les chemins d exécution et blocs d exception."
    });
  }

  const score = Math.max(0, 100 - issues.filter((i) => i.severity === "CRITIQUE").length * 35 - issues.filter((i) => i.severity === "AVERTISSEMENT").length * 15);

  return { issues, score };
}
