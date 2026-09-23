// modules/cbs/copilot/engine.ts
import {
  DevelopmentNeedInput,
  FunctionalAnalysis,
  CopilotSubTask,
  Generated4GlProposal,
  GeneratedPerScreen,
  GeneratedSqlQuery,
  CopilotTestCase,
  DeliveryPackage,
  CopilotFullPlan,
  CodeReviewFinding,
} from "./types";
import { CBS_SCHEMA_TABLES, CbsTableDefinition } from "../cbs-advanced-data";

/**
 * 1. MOTEUR SÉMANTIQUE DE RÉSOLUTION DES TABLES AMPLITUDE (PARMI LES 220+ TABLES)
 */
function resolveAmplitudeTables(text: string, domain: string): CbsTableDefinition[] {
  const query = (text + " " + domain).toLowerCase();

  const keywordMappings: { keywords: string[]; tableNames: string[] }[] = [
    {
      keywords: ["carte", "monetique", "retrait", "gab", "atm", "tpe", "porteur", "pan", "pin", "arqc", "switch"],
      tableNames: ["BKCAR_PORT", "BKCAR_BIN", "BKCAR_OPPO", "BKCAR_PLAF", "BKMNT_GAB", "BKCPT", "BKTRA"],
    },
    {
      keywords: ["virement", "transfert", "swift", "prélèvement", "prelevement", "rtgs", "mobile money", "sepa", "pacs"],
      tableNames: ["BKVIR_EMIS", "BKVIR_RECUS", "BKVIR_MASS", "BKSWF_MSG", "BKMOB_OPER", "BKCPT", "BKTRA"],
    },
    {
      keywords: ["chèque", "cheque", "chéquier", "chequier", "effet", "lettre de change", "impayé", "impaye", "protêt", "escompte"],
      tableNames: ["BKCHQ_EMIS", "BKCHQ_OPPO", "BKCHQ_COMP", "BKCHQ_IMPAYE", "BKEFF_PORTEF", "BKCPT"],
    },
    {
      keywords: ["crédit", "credit", "prêt", "pret", "échéance", "echeance", "amortissement", "emprunt", "sureté", "caution"],
      tableNames: ["BKPRT_DOS", "BKPRT_ECH", "BKPRT_GAR", "BKPRT_CONTENT", "BKPRT_TAUX", "BKCPT"],
    },
    {
      keywords: ["dat", "dépôt à terme", "depot a terme", "épargne", "epargne", "livret", "placement", "bon de caisse", "opcvm"],
      tableNames: ["BKDAT_CONTRAT", "BKDAT_ECH", "BKEP_LIVRET", "BKBDC_BON", "BKCPT"],
    },
    {
      keywords: ["trade", "crédoc", "credoc", "crédit documentaire", "remdoc", "douane", "aval", "incoterm", "nostro", "loro"],
      tableNames: ["BKCRE_IMP", "BKCRE_EXP", "BKREM_IMP", "BKCAU_MARCHE", "BKCORR_NOSTRO", "BKCPT"],
    },
    {
      keywords: ["balance", "arrêté", "arrete", "eod", "bod", "grand livre", "comptable", "débit", "crédit", "debit", "credit", "clôture"],
      tableNames: ["BKCOM", "BKCHA_PLAN", "BKEOD_JOURN", "BKEOD_CYCLE", "BKTRA", "BKDEV"],
    },
    {
      keywords: ["client", "tiers", "kyc", "personne", "aml", "lcb-ft", "mandataire", "actionnaire", "rccm"],
      tableNames: ["BKCLI", "BKADR", "BKKYC", "BKPEU", "BKCLI_ALERT", "BKCPT"],
    },
    {
      keywords: ["agence", "guichet", "caisse", "billetage", "espèces", "especes", "coffre"],
      tableNames: ["BKAGE_PARAM", "BKAGE_GUICH", "BKAGE_ARRET", "BKCAR_COFFRE", "BKCPT"],
    },
    {
      keywords: ["sécurité", "securite", "profil", "habilitation", "droit", "tuxedo", "batch", "verrou", "lock"],
      tableNames: ["BKSEC_PROFIL", "BKSEC_HABIL", "BKBAT_PARAM", "BKBAT_LOG", "BKLOCK"],
    },
    {
      keywords: ["change", "devise", "cours", "fixing", "réévaluation", "reevaluation"],
      tableNames: ["BKDEV", "BKDEV_HIST", "BKDEV_REEVAL", "BKCVD", "BKCPT"],
    },
  ];

  const matchedTableNames = new Set<string>();

  for (const mapping of keywordMappings) {
    if (mapping.keywords.some((kw) => query.includes(kw))) {
      mapping.tableNames.forEach((t) => matchedTableNames.add(t));
    }
  }

  if (matchedTableNames.size === 0) {
    matchedTableNames.add("BKCPT");
    matchedTableNames.add("BKCLI");
    matchedTableNames.add("BKTRA");
  }

  const resolved = CBS_SCHEMA_TABLES.filter((t) => matchedTableNames.has(t.tableName));
  return resolved.length > 0 ? resolved : [CBS_SCHEMA_TABLES[1], CBS_SCHEMA_TABLES[0]];
}

type OperationType = "CONSULTATION" | "MODIFICATION" | "CREATION" | "BATCH_CYCLE" | "TRANSFERT_FLUX";

function detectOperationType(queryText: string): OperationType {
  const text = queryText.toLowerCase();

  if (text.includes("virement") || text.includes("transfert") || text.includes("débit et crédit") || text.includes("debit et credit")) {
    return "TRANSFERT_FLUX";
  }
  if (text.includes("batch") || text.includes("arrêté") || text.includes("arrete") || text.includes("eod") || text.includes("bod") || text.includes("nocturne") || text.includes("balayage")) {
    return "BATCH_CYCLE";
  }
  if (text.includes("modifier") || text.includes("mise à jour") || text.includes("maj") || text.includes("bloquer") || text.includes("changer") || text.includes("recalculer") || text.includes("solder")) {
    return "MODIFICATION";
  }
  if (text.includes("créer") || text.includes("creer") || text.includes("ouverture") || text.includes("ajouter") || text.includes("insérer") || text.includes("nouveau") || text.includes("emission")) {
    return "CREATION";
  }
  return "CONSULTATION";
}

export function generateCopilotPlan(input: DevelopmentNeedInput): CopilotFullPlan {
  const title = input?.title?.trim() || "Nouveau Traitement Amplitude Core Banking";
  const bankingDomain = input?.bankingDomain?.trim() || "Général Core Banking";
  const functionalDescription = input?.functionalDescription?.trim() || "Traitement transactionnel standardisé";
  const amplitudeVersion = input?.amplitudeVersion || "v11.x";
  const technicalEnvironment = input?.technicalEnvironment || "Informix / AIX";
  const targetUsers = input?.targetUsers?.trim() || "Opérateur / Gestionnaire CBS";
  const inputData = input?.inputData?.trim() || "Paramètres de recherche et d'exécution";
  const expectedOutput = input?.expectedOutput?.trim() || "Statut d'exécution et enregistrements comptables";
  const knownBusinessRules = input?.knownBusinessRules?.trim() || "Contrôle d'intégrité référentielle et d'habilitation";

  const allText = title + " " + bankingDomain + " " + functionalDescription + " " + inputData + " " + knownBusinessRules;
  const opType = detectOperationType(allText);
  const relevantTables = resolveAmplitudeTables(allText, bankingDomain);
  const primaryTable = relevantTables[0] || CBS_SCHEMA_TABLES[1];
  const secondaryTable = relevantTables[1] || null;

  const needsIhm =
    !allText.toLowerCase().includes("sans ihm") &&
    !allText.toLowerCase().includes("batch cli") &&
    (opType !== "BATCH_CYCLE" || allText.toLowerCase().includes("écran") || allText.toLowerCase().includes("ihm") || allText.toLowerCase().includes("formulaire"));

  const opSuffix = opType === "MODIFICATION" ? "maj" : opType === "CREATION" ? "cre" : opType === "BATCH_CYCLE" ? "bat" : opType === "TRANSFERT_FLUX" ? "flx" : "cst";
  const progName = "p_cbs_" + primaryTable.tableName.toLowerCase() + "_" + opSuffix;
  const formName = "f_cbs_" + primaryTable.tableName.toLowerCase() + "_" + opSuffix;

  const analysis: FunctionalAnalysis = {
    summary: "Développement et intégration du module '" + title + "' (" + opType + ") sur le domaine '" + bankingDomain + "' (Amplitude " + amplitudeVersion + ").",
    businessObjective: "Permettre aux " + targetUsers + " d'exécuter : " + functionalDescription.slice(0, 140) + "... avec intégrité transactionnelle garantie sur " + primaryTable.tableName + ".",
    actors: [targetUsers, "Superviseur d'Agence", "Moteur de Transactions Amplitude", "SGBD " + technicalEnvironment],
    preconditions: [
      "Session opérateur authentifiée avec habilitation sur le module (" + primaryTable.module + ").",
      "Journée comptable BOD (Beginning of Day) active et accessible en écriture.",
      "Disponibilité de la table maîtresse " + primaryTable.tableName + " avec index (" + primaryTable.primaryKey.join(", ") + ").",
    ],
    postconditions: [
      "Table " + primaryTable.tableName + " mise à jour ou consultée sans aucun verrou résiduel orphelin.",
      "Piste d'audit légale renseignée dans la table de sécurité des accès.",
      "Code retour normalisé (0=Succès, >0=Erreur métier) transmis au programme appelant.",
    ],
    businessRules: [
      knownBusinessRules,
      "Vérification préalable de l'existence de la clé primaire sur " + primaryTable.tableName + " (" + primaryTable.primaryKey.join(", ") + ").",
      opType === "MODIFICATION" || opType === "TRANSFERT_FLUX"
        ? "Encadrement obligatoire sous transaction atomique BEGIN WORK / COMMIT WORK avec protection anti-deadlock (LOCK MODE WAIT 15)."
        : "Interdiction formelle de Full Table Scan sur les tables volumineuses.",
      "Vérification de la conformité du profil opérateur et contrôle de double validation si montant au-delà du seuil réglementaire.",
    ],
    requiredData: [
      inputData,
      "Identifiants clés : " + primaryTable.primaryKey.join(", "),
      "Colonnes de référence : " + primaryTable.columns.slice(0, 4).map((c) => c.name).join(", "),
      "Métadonnées de sécurité (Agence, Opérateur, Horodatage système)",
    ],
    cbsDependencies: [
      "Table maîtresse principale : " + primaryTable.tableName + " (" + primaryTable.description + ")",
      ...(secondaryTable ? ["Table liée secondaire : " + secondaryTable.tableName + " (" + secondaryTable.description + ")"] : []),
      "Gestionnaire de transactions Informix/Oracle (BEGIN WORK / COMMIT WORK)",
      "Middleware d'échanges Tuxedo / Référentiel de sécurité CBS",
    ],
    unresolvedQuestions: [
      "Comportement exigé en cas d'accès concurrent sur " + primaryTable.tableName + " pendant les heures d'affluence agence ?",
      "Les habilitations doivent-elles restreindre les données au code agence de l'opérateur connecté ?",
      "Faut-il générer un extrait comptable dématérialisé (spool d'impression ou flux XML/JSON) ?",
    ],
    technicalRisks: [
      "Risque de verrouillage bloquant sur " + primaryTable.tableName + " si la transaction reste ouverte sans COMMIT immédiat.",
      "Altération des performances SGBD si la clause WHERE n'utilise pas l'index primaire (" + primaryTable.primaryKey.join(", ") + ").",
      "Perte de traçabilité en cas d'interruption inattendue du batch ou de la session Curses.",
    ],
  };

  const subTasks: CopilotSubTask[] = [
    {
      id: "TASK-01",
      title: "Analyse fonctionnelle & mapping dictionnaire (" + primaryTable.tableName + ")",
      description: "Valider les champs requis pour '" + title + "' avec les colonnes de la table " + primaryTable.tableName + " (" + primaryTable.columns.map((c) => c.name).slice(0, 5).join(", ") + ").",
      type: "FONCTIONNEL",
      priority: "HAUTE",
      dependencies: [],
      estimation: "0.5 jour",
      inputs: inputData,
      outputs: "Matrice de spécification détaillée et plan d'imputation SGBD",
      acceptanceCriteria: [
        "Toutes les colonnes requises existent dans " + primaryTable.tableName + " et respectent les types Informix.",
        "Les règles de gestion sont validées par la maîtrise d'ouvrage (MOA).",
      ],
      concernedFiles: ["docs/spec_" + primaryTable.tableName.toLowerCase() + "_" + opSuffix + ".md"],
      status: "VALIDE",
    },
    {
      id: "TASK-02",
      title: "Modélisation des requêtes SGBD & Index (" + primaryTable.tableName + ")",
      description: "Rédiger et optimiser les requêtes SQL (" + opType + ") sur " + primaryTable.tableName + " avec utilisation stricte des index primaires.",
      type: "SQL",
      priority: "HAUTE",
      dependencies: ["TASK-01"],
      estimation: "0.5 jour",
      inputs: "Dictionnaire SGBD Amplitude (" + technicalEnvironment + ")",
      outputs: "Script SQL optimisé pour " + primaryTable.tableName,
      acceptanceCriteria: [
        "Temps de réponse < 20ms garanti par l'index PK_" + primaryTable.tableName + ".",
        "Absence de Full Table Scan sur les tables volumineuses.",
      ],
      concernedFiles: ["src/sql/" + primaryTable.tableName.toLowerCase() + "_" + opSuffix + ".sql"],
      status: "A_FAIRE",
    },
    ...(needsIhm
      ? [
          {
            id: "TASK-03",
            title: "Conception du masque écran Curses (.per) [" + formName + ".per]",
            description: "Créer le formulaire terminal 24x80 format Curses avec zones de saisie (" + primaryTable.primaryKey.join(", ") + ") et touches de fonction.",
            type: "IHM_PER" as const,
            priority: "MOYENNE" as const,
            dependencies: ["TASK-01"],
            estimation: "1 jour",
            inputs: "Paramètres IHM : " + inputData,
            outputs: "Fichier source " + formName + ".per compilé en " + formName + ".frm",
            acceptanceCriteria: [
              "Ergonomie conforme à la charte terminal Amplitude (Touches F1, F5, F10, F12).",
              "Champs protégés NOENTRY pour les données calculées ou confidentielles.",
            ],
            concernedFiles: ["src/forms/" + formName + ".per"],
            status: "A_FAIRE" as const,
          },
        ]
      : []),
    {
      id: "TASK-04",
      title: "Développement applicatif Informix 4GL [" + progName + ".4gl]",
      description: "Programmer la logique métier " + opType + ", les contrôles WHENEVER ERROR, la capture SQLCA.SQLCODE et les transactions.",
      type: "4GL",
      priority: "BLOQUANTE",
      dependencies: ["TASK-02", ...(needsIhm ? ["TASK-03"] : [])],
      estimation: "1.5 jour",
      inputs: "Spécifications techniques & scripts SQL (" + primaryTable.tableName + ")",
      outputs: "Programme source " + progName + ".4gl compilé en binaire exécutable",
      acceptanceCriteria: [
        "Gestion systématique de SQLCA.SQLCODE après chaque accès SGBD.",
        "Blocs transactionnels BEGIN WORK / COMMIT WORK avec ROLLBACK sécurisé.",
        "Codes retours normalisés (0=Succès, 1=Validation, 2=Inexistant, 99=Crash).",
      ],
      concernedFiles: ["src/prog/" + progName + ".4gl"],
      status: "A_FAIRE",
    },
    {
      id: "TASK-05",
      title: "Plan de qualification unitaire & scénarios aux limites (" + title + ")",
      description: "Rédiger et exécuter la campagne de tests pour les cas nominaux, rejets métier et tentatives non autorisées.",
      type: "TEST",
      priority: "HAUTE",
      dependencies: ["TASK-04"],
      estimation: "1 jour",
      inputs: "Jeux d'essais en base de Recette / Sandbox bancaire",
      outputs: "PV de recette technique et procès-verbal de non-régression",
      acceptanceCriteria: [
        "100% des cas d'erreurs interceptés proprement sans crash du binaire.",
        "L'intégrité des soldes et des tables de contrôle est rigoureusement confirmée.",
      ],
      concernedFiles: ["tests/tu_" + primaryTable.tableName.toLowerCase() + "_" + opSuffix + ".sh"],
      status: "A_FAIRE",
    },
    {
      id: "TASK-06",
      title: "Dossier de mise en production (MEP) & Rollback",
      description: "Constituer le package de déploiement, l'ordre de compilation C4GL/FORM4GL et le protocole de retour arrière sous 10 minutes.",
      type: "DOCUMENTATION",
      priority: "HAUTE",
      dependencies: ["TASK-05"],
      estimation: "0.5 jour",
      inputs: "Binaires compilés, masques .frm et scripts SQL validés",
      outputs: "Package de livraison zippé avec bordereau d'exploitation",
      acceptanceCriteria: [
        "Procédure de rollback testée et réalisable en moins de 10 minutes en production.",
      ],
      concernedFiles: ["delivery/mep_" + progName + ".txt"],
      status: "A_FAIRE",
    },
  ];

  const pkFields = primaryTable.primaryKey;
  const colSample = primaryTable.columns.slice(0, 6);

  const dynamicDefines = [
    "DEFINE v_user_id      VARCHAR(10)",
    "DEFINE v_code_retour  INTEGER",
    "DEFINE v_message      VARCHAR(255)",
    ...pkFields.map((pk) => "DEFINE v_" + pk.toLowerCase() + "       VARCHAR(15)"),
    ...colSample
      .filter((c) => !pkFields.includes(c.name))
      .map((c) => {
        const isNum = c.type.includes("NUMBER") || c.type.includes("DECIMAL");
        const isDate = c.type.includes("DATE");
        const t = isNum ? "DECIMAL(19,4)" : isDate ? "DATE" : "VARCHAR(35)";
        return "DEFINE v_" + c.name.toLowerCase() + "       " + t;
      }),
  ];

  let businessLogic4Gl = "";
  if (opType === "MODIFICATION" || opType === "TRANSFERT_FLUX") {
    businessLogic4Gl = "    -- Début du bloc transactionnel atomique avec protection anti-deadlock\n" +
      "    BEGIN WORK\n\n" +
      "    DISPLAY \"--- VERIFICATION DU VERROU & LECTURE PREALABLE --- \" AT 8, 2\n" +
      "    WHENEVER ERROR CONTINUE\n" +
      "    SELECT " + colSample.map((c) => c.name.toLowerCase()).join(", ") + "\n" +
      "      INTO " + colSample.map((c) => "v_" + c.name.toLowerCase()).join(", ") + "\n" +
      "      FROM " + primaryTable.tableName.toLowerCase() + "\n" +
      "     WHERE " + pkFields.map((pk) => pk.toLowerCase() + " = v_" + pk.toLowerCase()).join(" AND ") + "\n" +
      "       FOR UPDATE\n\n" +
      "    IF SQLCA.SQLCODE = 100 THEN\n" +
      "        ROLLBACK WORK\n" +
      "        LET v_code_retour = 2\n" +
      "        LET v_message = \"Rejet : Enregistrement cible introuvable sur table " + primaryTable.tableName + ".\"\n" +
      "        ERROR v_message\n" +
      "    ELSE\n" +
      "        IF SQLCA.SQLCODE < 0 THEN\n" +
      "            ROLLBACK WORK\n" +
      "            LET v_code_retour = 99\n" +
      "            LET v_message = \"Erreur SGBD verrouillage : \", SQLCA.SQLCODE USING \"-<<<<<<\"\n" +
      "            ERROR v_message\n" +
      "        ELSE\n" +
      "            -- Mise à jour métier sécurisée\n" +
      "            UPDATE " + primaryTable.tableName.toLowerCase() + "\n" +
      "               SET " + (colSample.slice(pkFields.length, pkFields.length + 2).map((c) => c.name.toLowerCase() + " = v_" + c.name.toLowerCase()).join(", ") || "eta = 'A'") + "\n" +
      "             WHERE " + pkFields.map((pk) => pk.toLowerCase() + " = v_" + pk.toLowerCase()).join(" AND ") + "\n\n" +
      "            IF SQLCA.SQLCODE < 0 THEN\n" +
      "                ROLLBACK WORK\n" +
      "                LET v_code_retour = 98\n" +
      "                LET v_message = \"Erreur UPDATE DML : \", SQLCA.SQLCODE USING \"-<<<<<<\"\n" +
      "                ERROR v_message\n" +
      "            ELSE\n" +
      "                COMMIT WORK\n" +
      "                LET v_code_retour = 0\n" +
      "                LET v_message = \"Mise a jour validee avec succes dans " + primaryTable.tableName + ".\"\n" +
      "                DISPLAY v_message AT 20, 2\n" +
      "            END IF\n" +
      "        END IF\n" +
      "    END IF\n" +
      "    WHENEVER ERROR STOP";
  } else if (opType === "CREATION") {
    businessLogic4Gl = "    -- Insertion d'un nouvel enregistrement dans " + primaryTable.tableName + "\n" +
      "    BEGIN WORK\n" +
      "    WHENEVER ERROR CONTINUE\n" +
      "    INSERT INTO " + primaryTable.tableName.toLowerCase() + " (\n" +
      "        " + colSample.map((c) => c.name.toLowerCase()).join(", ") + "\n" +
      "    ) VALUES (\n" +
      "        " + colSample.map((c) => "v_" + c.name.toLowerCase()).join(", ") + "\n" +
      "    )\n\n" +
      "    IF SQLCA.SQLCODE = -239 OR SQLCA.SQLCODE = -268 THEN\n" +
      "        ROLLBACK WORK\n" +
      "        LET v_code_retour = 3\n" +
      "        LET v_message = \"Rejet : Violation de cle unique / Enregistrement deja existant.\"\n" +
      "        ERROR v_message\n" +
      "    ELSE\n" +
      "        IF SQLCA.SQLCODE < 0 THEN\n" +
      "            ROLLBACK WORK\n" +
      "            LET v_code_retour = 99\n" +
      "            LET v_message = \"Erreur SQL Insertion : \", SQLCA.SQLCODE USING \"-<<<<<<\"\n" +
      "            ERROR v_message\n" +
      "        ELSE\n" +
      "            COMMIT WORK\n" +
      "            LET v_code_retour = 0\n" +
      "            LET v_message = \"Creation enregistree avec succes sur " + primaryTable.tableName + ".\"\n" +
      "            DISPLAY v_message AT 20, 2\n" +
      "        END IF\n" +
      "    END IF\n" +
      "    WHENEVER ERROR STOP";
  } else if (opType === "BATCH_CYCLE") {
    businessLogic4Gl = "    -- Traitement par curseur de masse (Batch sans IHM)\n" +
      "    DISPLAY \"Demarrage du traitement par lot sur " + primaryTable.tableName + "...\"\n" +
      "    DECLARE c_batch_cur CURSOR FOR\n" +
      "        SELECT " + colSample.map((c) => c.name.toLowerCase()).join(", ") + "\n" +
      "          FROM " + primaryTable.tableName.toLowerCase() + "\n" +
      "         ORDER BY " + pkFields.map((pk) => pk.toLowerCase()).join(", ") + "\n\n" +
      "    OPEN c_batch_cur\n" +
      "    FOREACH c_batch_cur INTO " + colSample.map((c) => "v_" + c.name.toLowerCase()).join(", ") + "\n" +
      "        -- Traitement unitaire sécurisé\n" +
      "        IF v_" + pkFields[0].toLowerCase() + " IS NOT NULL THEN\n" +
      "            LET v_code_retour = v_code_retour + 1\n" +
      "        END IF\n" +
      "    END FOREACH\n" +
      "    CLOSE c_batch_cur\n\n" +
      "    LET v_message = \"Traitement batch termine avec succes sur " + primaryTable.tableName + ".\"\n" +
      "    DISPLAY v_message";
  } else {
    businessLogic4Gl = "    -- Recherche et lecture avec contrôle d'existence\n" +
      "    WHENEVER ERROR CONTINUE\n" +
      "    SELECT " + colSample.map((c) => c.name.toLowerCase()).join(", ") + "\n" +
      "      INTO " + colSample.map((c) => "v_" + c.name.toLowerCase()).join(", ") + "\n" +
      "      FROM " + primaryTable.tableName.toLowerCase() + "\n" +
      "     WHERE " + pkFields.map((pk) => pk.toLowerCase() + " = v_" + pk.toLowerCase()).join(" AND ") + "\n\n" +
      "    IF SQLCA.SQLCODE = 100 THEN\n" +
      "        LET v_code_retour = 2\n" +
      "        LET v_message = \"Rejet : Enregistrement introuvable sur table " + primaryTable.tableName + ".\"\n" +
      "        ERROR v_message\n" +
      "    ELSE\n" +
      "        IF SQLCA.SQLCODE < 0 THEN\n" +
      "            LET v_code_retour = 99\n" +
      "            LET v_message = \"Erreur SQL SGBD interne : \", SQLCA.SQLCODE USING \"-<<<<<<\"\n" +
      "            ERROR v_message\n" +
      "        ELSE\n" +
      "            LET v_code_retour = 0\n" +
      "            DISPLAY \"--- DONNEES RETROUVEES DANS " + primaryTable.tableName + " --- \" AT 10, 2\n" +
      colSample.slice(0, 4).map((c, i) => "            DISPLAY \"" + c.name + " : \", v_" + c.name.toLowerCase() + " AT " + (12 + i) + ", 5").join("\n") + "\n" +
      "            LET v_message = \"Consultation validee avec succes.\"\n" +
      "        END IF\n" +
      "    END IF\n" +
      "    WHENEVER ERROR STOP";
  }

  const generated4GlCode = "###############################################################################\n" +
    "# Programme : " + progName + ".4gl\n" +
    "# Objet     : " + title + "\n" +
    "# Domaine   : " + bankingDomain + " (Table centrale : " + primaryTable.tableName + ")\n" +
    "# Système   : Sopra Banking Amplitude (" + amplitudeVersion + ")\n" +
    "# SGBD      : " + technicalEnvironment + "\n" +
    "# Compilateur : Informix 4GL (c4gl) / Curses Standard AIX\n" +
    "###############################################################################\n\n" +
    "DATABASE amplitude_db\n\n" +
    "GLOBALS\n" +
    "    DEFINE g_user_id      VARCHAR(10),\n" +
    "    DEFINE g_code_agence  VARCHAR(5)\n" +
    "END GLOBALS\n\n" +
    "MAIN\n    " +
    dynamicDefines.join("\n    ") + "\n\n" +
    "    -- Initialisation des variables de travail\n" +
    "    LET v_code_retour = 0\n" +
    "    LET v_message     = NULL\n\n" +
    "    -- En-tête d'exécution\n" +
    "    DISPLAY \"=================================================================\" AT 1, 2\n" +
    "    DISPLAY \"    SOPRA BANKING AMPLITUDE - MODULE : " + title.toUpperCase().slice(0, 35) + "\" AT 2, 2\n" +
    "    DISPLAY \"=================================================================\" AT 3, 2\n\n" +
    (needsIhm
      ? "    -- Ouverture du masque d'écran interactif\n" +
        "    OPEN WINDOW w_" + primaryTable.tableName.toLowerCase() + " AT 4, 2 WITH FORM \"" + formName + "\"\n\n" +
        "    INPUT BY NAME " + pkFields.map((pk) => "v_" + pk.toLowerCase()).join(", ") + " WITHOUT DEFAULTS\n" +
        pkFields.map((pk) => "        BEFORE FIELD v_" + pk.toLowerCase() + "\n" +
          "            MESSAGE \"Saisissez " + pk + " ou F12 pour quitter\"\n" +
          "        AFTER FIELD v_" + pk.toLowerCase() + "\n" +
          "            IF v_" + pk.toLowerCase() + " IS NULL THEN\n" +
          "                ERROR \"Champ obligatoire : " + pk + "\"\n" +
          "                NEXT FIELD v_" + pk.toLowerCase() + "\n" +
          "            END IF").join("\n") + "\n" +
        "    END INPUT\n\n"
      : "    -- Mode batch / paramétrage en ligne de commande Unix\n" +
        pkFields.map((pk, idx) => "    LET v_" + pk.toLowerCase() + " = ARG_VAL(" + (idx + 1) + ")").join("\n") + "\n\n") +
    "    -- 1. Contrôle des paramètres obligatoires\n" +
    "    IF " + pkFields.map((pk) => "v_" + pk.toLowerCase() + " IS NULL").join(" OR ") + " THEN\n" +
    "        LET v_code_retour = 1\n" +
    "        LET v_message = \"Parametres obligatoires manquants (" + pkFields.join(", ") + ").\"\n" +
    "        ERROR v_message\n" +
    "        EXIT PROGRAM (v_code_retour)\n" +
    "    END IF\n\n" +
    "    -- 2. Exécution de la logique métier bancaire\n" +
    businessLogic4Gl + "\n\n" +
    "    -- 3. Traçabilité dans la piste d'audit Core Banking\n" +
    "    INSERT INTO trace_audit_cbs (prog_nom, user_id, date_oper, action_desc, code_ret)\n" +
    "    VALUES (\"" + progName + "\", g_user_id, CURRENT YEAR TO SECOND, v_message, v_code_retour)\n\n" +
    (needsIhm
      ? "    PROMPT \"Appuyez sur Entree pour continuer...\" FOR CHAR v_message\n" +
        "    CLOSE WINDOW w_" + primaryTable.tableName.toLowerCase() + "\n\n"
      : "    -- Fin de traitement\n\n") +
    "    EXIT PROGRAM (v_code_retour)\n" +
    "END MAIN";

  const code4GlProposal: Generated4GlProposal = {
    programObjective: "Exécuter le traitement métier pour '" + title + "' avec accès contrôlé sur la table " + primaryTable.tableName + " (" + primaryTable.description + ").",
    programType: needsIhm ? "Programme Interactif Formulaire Curses (.per)" : "Traitement Batch / Fonction C4GL",
    entryPoint: "MAIN ou FUNCTION " + progName + "()",
    parameters: pkFields.map((pk) => "p_" + pk.toLowerCase() + " CHAR(15)"),
    variables: dynamicDefines,
    dataStructures: ["RECORD LIKE " + primaryTable.tableName.toLowerCase() + ".*", ...(secondaryTable ? ["RECORD LIKE " + secondaryTable.tableName.toLowerCase() + ".*"] : [])],
    errorHandling: "Interception systématique WHENEVER ERROR CONTINUE et analyse rigoureuse de SQLCA.SQLCODE.",
    transactionControl: opType === "MODIFICATION" || opType === "CREATION" || opType === "TRANSFERT_FLUX"
      ? "BEGIN WORK / COMMIT WORK avec protection ROLLBACK et verrous exclusifs contrôlés."
      : "Lecture optimisée sans verrouillage résiduel.",
    loggingStrategy: "Enregistrement systématique dans la table trace_audit_cbs des rejets et succès.",
    code4Gl: generated4GlCode,
    importantNotes: [
      "Table maîtresse ciblée : '" + primaryTable.tableName + "' (" + primaryTable.module + ").",
      "Clé primaire impérative pour les recherches et écritures : (" + primaryTable.primaryKey.join(", ") + ").",
      "Statut des codes retours : 0=Succès, 1=Paramètre manquant, 2=Inexistant, 3=Doublon, 99=Erreur SGBD.",
    ],
  };

  let perScreen: GeneratedPerScreen | null = null;
  if (needsIhm) {
    const inputFields = pkFields.map((pk, idx) => "f00" + idx + " = " + primaryTable.tableName.toLowerCase() + "." + pk.toLowerCase() + ", REQUIRED, UPSHIFT, COMMENTS = \"Saisissez " + pk + "\";");
    const readOnlyFields = colSample
      .filter((c) => !pkFields.includes(c.name))
      .slice(0, 4)
      .map((c, idx) => "f0" + (idx + 10) + " = " + primaryTable.tableName.toLowerCase() + "." + c.name.toLowerCase() + ", NOENTRY;");

    perScreen = {
      screenName: formName + ".per",
      title: "Formulaire Curses - " + title.slice(0, 40),
      screenType: "Formulaire Transactionnel Interactif Curses 24x80",
      dimensions: "24 lignes x 80 colonnes (Standard terminal Curses/AIX)",
      inputFieldList: pkFields.map((pk) => "v_" + pk.toLowerCase() + " (Clé primaire, obligatoire)"),
      readOnlyFieldList: colSample.filter((c) => !pkFields.includes(c.name)).slice(0, 4).map((c) => primaryTable.tableName.toLowerCase() + "." + c.name.toLowerCase() + " (" + c.description + ")"),
      buttons: ["F1 = Aide contextuelle", "F5 = Réinitialiser", "F10 = Valider", "F12 = Quitter l'écran"],
      messages: ["Ligne 23 : Guidage utilisateur et statuts opérationnels", "Ligne 24 : Erreurs bloquantes et alertes SGBD"],
      visualMockupAscii: "+------------------------------------------------------------------------------+\n" +
        "|            SOPRA BANKING AMPLITUDE - MODULE " + primaryTable.tableName.padEnd(8) + "                 |\n" +
        "+------------------------------------------------------------------------------+\n" +
        "|                                                                              |\n" +
        "|  [ CRITÈRES D'IDENTIFICATION ]                                               |\n" +
        "|  " + pkFields.map((pk, i) => pk.padEnd(12) + ": [f00" + i + "     ]").join("  ") + "\n" +
        "|                                                                              |\n" +
        "|  [ DONNÉES ENREGISTRÉES ]                                                    |\n" +
        "|  " + colSample.filter((c) => !pkFields.includes(c.name)).slice(0, 3).map((c, i) => c.name.padEnd(12) + ": [f0" + (i + 10) + "                        ]").join("\n|  ") + "\n" +
        "|                                                                              |\n" +
        "|  [F1] Aide    [F5] Recharger    [F10] Valider    [F12] Quitter               |\n" +
        "+------------------------------------------------------------------------------+\n" +
        "| MESSAGE : Saisissez les critères puis appuyez sur Entrée                     |\n" +
        "+------------------------------------------------------------------------------+",
      perCodeSnippet: "DATABASE amplitude_db\n" +
        "SCREEN SIZE 24 BY 80\n" +
        "{\n" +
        "================================================================================\n" +
        "           SOPRA BANKING AMPLITUDE - " + primaryTable.tableName + " (" + opType + ")\n" +
        "================================================================================\n\n" +
        " " + pkFields.map((pk, i) => pk.padEnd(10) + ": [f00" + i + "       ]").join("  ") + "\n" +
        "--------------------------------------------------------------------------------\n" +
        " " + colSample.filter((c) => !pkFields.includes(c.name)).slice(0, 4).map((c, i) => c.name.padEnd(12) + ": [f0" + (i + 10) + "                             ]").join("\n ") + "\n" +
        "================================================================================\n" +
        " [F1] Aide   [F5] Recharger   [F10] Valider   [F12] Quitter\n" +
        "}\n" +
        "END\n" +
        "TABLES\n" +
        "    " + primaryTable.tableName.toLowerCase() + (secondaryTable ? ", " + secondaryTable.tableName.toLowerCase() : "") + "\n" +
        "ATTRIBUTES\n" +
        "    " + inputFields.join("\n    ") + "\n" +
        "    " + readOnlyFields.join("\n    ") + "\n" +
        "INSTRUCTIONS\n" +
        "    DELIMITERS \"[]\"\n" +
        "END",
      amplitudeIntegrationNotes: [
        "Compiler le masque avec : 'form4gl " + formName + ".per' (génère " + formName + ".frm).",
        "Le binaire .frm compilé doit résider dans le répertoire $FORMPATH sur le serveur " + technicalEnvironment + ".",
        "Validation stricte des longueurs de champs selon les attributs de la table " + primaryTable.tableName + ".",
      ],
    };
  }

  const sqlProposal: GeneratedSqlQuery = {
    objective: "Exécution optimisée de l'opération '" + opType + "' sur la table " + primaryTable.tableName + " pour '" + title + "'.",
    targetTables: [
      primaryTable.tableName + " (" + primaryTable.description + ")",
      ...(secondaryTable ? [secondaryTable.tableName + " (" + secondaryTable.description + ")"] : []),
    ],
    joins: secondaryTable
      ? "LEFT OUTER JOIN " + secondaryTable.tableName + " s ON p." + primaryTable.primaryKey[0] + " = s." + (secondaryTable.primaryKey[0] || primaryTable.primaryKey[0])
      : "Aucune jointure nécessaire (table centrale unitaire)",
    parameters: pkFields.map((pk) => ":p_" + pk.toLowerCase() + " (VARCHAR)"),
    filters: "WHERE " + pkFields.map((pk) => "t." + pk + " = :p_" + pk.toLowerCase()).join(" AND "),
    performanceRisks: [
      "Vérifier que l'index PK_" + primaryTable.tableName + " (" + primaryTable.primaryKey.join(", ") + ") est scrupuleusement exploité.",
      "Sur Informix, utiliser 'LOCK MODE WAIT 15' pour prévenir l'erreur -154 (Deadlock / Lock Timeout).",
      "En cas de grand volume, limiter la restitution ou paginer les curseurs.",
    ],
    securityPrecautions: [
      "Contrôler le filtrage par code agence pour respecter le cloisonnement des données.",
      "Vérifier les privilèges d'exécution DML dans la table des autorisations applicatives.",
    ],
    sqlCode: "-- 1. Requête principale " + opType + " sur " + primaryTable.tableName + "\n" +
      "SELECT " + colSample.map((c) => "t." + c.name).join(", ") + "\n" +
      "FROM " + primaryTable.tableName + " t\n" +
      "WHERE " + pkFields.map((pk) => "t." + pk + " = :p_" + pk.toLowerCase()).join("\n  AND ") + ";\n\n" +
      "-- 2. Index utilisé pour cette requête :\n" +
      "-- Index PK_" + primaryTable.tableName + " ON " + primaryTable.tableName + " (" + primaryTable.primaryKey.join(", ") + ")",
  };

  const testCases: CopilotTestCase[] = [
    {
      id: "TC-01",
      category: "NOMINAL",
      title: "Exécution nominale de '" + title + "' sur " + primaryTable.tableName,
      preconditions: "Enregistrement valide présent dans " + primaryTable.tableName + ", opérateur habilité profil gestionnaire.",
      testSteps: [
        "1. Saisir les critères clés (" + pkFields.join(", ") + ").",
        "2. Valider par F10 ou soumettre l'ordre.",
        "3. Vérifier les données retournées.",
      ],
      expectedResult: "Opération validée avec succès, code retour 0, intégrité de " + primaryTable.tableName + " préservée.",
      actualStatus: "A_TESTER",
    },
    {
      id: "TC-02",
      category: "ERREUR",
      title: "Rejet sur clé primaire inexistante dans " + primaryTable.tableName,
      preconditions: "Clé (" + pkFields.map(() => "99999").join(", ") + ") absente du dictionnaire.",
      testSteps: ["1. Saisir une référence erronée.", "2. Valider par F10."],
      expectedResult: "Message bloquant explicite 'Rejet : Enregistrement introuvable dans " + primaryTable.tableName + "', code retour 2.",
      actualStatus: "A_TESTER",
    },
    {
      id: "TC-03",
      category: "LIMITES",
      title: "Contrôle de concurrence ou saturation transactionnelle",
      preconditions: "Deux sessions concurrentes tentant une écriture simultanée sur la même ressource.",
      testSteps: ["1. Ouvrir deux sessions 4GL.", "2. Initier l'écriture concurrente."],
      expectedResult: "Capture du code retour SGBD sans blocage fatal (ROLLBACK ordonné).",
      actualStatus: "A_TESTER",
    },
    {
      id: "TC-04",
      category: "DROITS",
      title: "Tentative d'accès non autorisé sur module " + primaryTable.module,
      preconditions: "Opérateur non rattaché au profil d'habilitation requis.",
      testSteps: ["1. Connexion avec compte utilisateur restreint.", "2. Appel du programme."],
      expectedResult: "Rejet immédiat 'Habilitation insuffisante' avec journalisation dans l'audit de sécurité.",
      actualStatus: "A_TESTER",
    },
  ];

  const deliveryPackage: DeliveryPackage = {
    modifiedFiles: [
      "src/prog/" + progName + ".4gl",
      ...(needsIhm ? ["src/forms/" + formName + ".per"] : []),
      "src/sql/" + primaryTable.tableName.toLowerCase() + "_" + opSuffix + ".sql",
      "config/menus/amplitude_menu_" + primaryTable.module.toLowerCase().replace(/[^a-z0-9]/g, "_") + ".xml",
    ],
    parametersToDeclare: [
      "Variable d'environnement $AMPLITUDE_FORMS pointant sur le dossier compilé .frm",
      "Habilitation profil '" + progName.toUpperCase() + "' dans la table de sécurité CBS (BKSEC)",
    ],
    installationScripts: [
      "c4gl -o bin/" + progName + " src/prog/" + progName + ".4gl",
      ...(needsIhm ? ["form4gl src/forms/" + formName + ".per"] : []),
      "chmod 750 bin/" + progName,
    ],
    installationOrder: [
      "1. Sauvegarde des binaires existants dans /backup/cbs/bin/.",
      "2. Compilation des masques d'écran .per vers .frm (form4gl).",
      "3. Compilation des programmes sources .4gl vers exécutables .4ge / binaires C4GL.",
      "4. Déclaration des entrées de menu et habilitations en base de recette.",
      "5. Validation des tests unitaires et procès-verbal de recette.",
    ],
    preDeliveryChecklist: [
      "✓ Code source inspecté sans identifiant en clair ni mot de passe en dur.",
      "✓ Plan d'exécution SQL validé sur index PK_" + primaryTable.tableName + ".",
      "✓ Sauvegarde de sécurité de la base de données validée avant déploiement.",
    ],
    postDeliveryChecklist: [
      "✓ Contrôle de l'absence d'erreurs 4GL dans les logs système.",
      "✓ Validation du test pilote nominal avec retour code 0.",
      "✓ Vérification de l'absence de verrous exclusifs résiduels (onstat -k / V$LOCK).",
    ],
    rollbackPlan: [
      "Étape 1 : Remplacer immédiatement le binaire déployé par la copie de sauvegarde : 'cp /backup/cbs/bin/" + progName + " $AMPLITUDE_BIN/'",
      "Étape 2 : Réactiver l'ancien masque écran si modifié.",
      "Étape 3 : Purger le cache applicatif Tuxedo / WebLogic : 'tmadmin -c; shutdown -y; boot -y'",
      "Étape 4 : Confirmer le retour nominal du service sous 10 minutes maximum.",
    ],
  };

  return {
    need: input,
    analysis,
    subTasks,
    code4GlProposal,
    perScreen,
    sqlProposal,
    testCases,
    deliveryPackage,
    generatedDate: new Date().toISOString(),
  };
}

export function analyzeCbsFailure(traceOrError: string) {
  const isDeadlock = traceOrError.includes("143") || traceOrError.toLowerCase().includes("deadlock");
  const isLockTimeout = traceOrError.includes("154") || traceOrError.toLowerCase().includes("lock timeout");
  const isNotFound = traceOrError.includes("100") || traceOrError.toLowerCase().includes("not found");
  const isDbDown = traceOrError.includes("25588") || traceOrError.includes("cannot connect");

  return {
    symptom: traceOrError.slice(0, 100),
    context: "Exécution transactionnelle Core Banking / Batch Amplitude",
    step: isDeadlock || isLockTimeout ? "Accès concurrentiel aux tables de soldes" : isNotFound ? "Recherche de clé primaire" : "Connexion SGBD",
    probableProgram: "Traitement DML 4GL en cours de mise à jour (UPDATE/INSERT)",
    sqlInvolved: isDeadlock ? "SELECT ... FOR UPDATE ou UPDATE bkcom" : "SELECT INTO",
    hypotheses: [
      isDeadlock ? "Interblocage (Deadlock) entre deux sessions tentant de verrouiller les mêmes comptes dans un ordre différent." : "Accès sur enregistrement inexistant.",
      "Dépassement du timer de verrouillage Informix/Oracle (LOCK MODE WAIT 15).",
    ],
    checksToPerform: [
      "Exécuter 'onstat -k' sur Informix ou requêter V$LOCK / DBA_BLOCKERS sur Oracle.",
      "Vérifier la cohérence de l'ordre de tri des comptes dans les boucles de mise à jour 4GL.",
    ],
    rootCause: isDeadlock
      ? "Violation de l'ordre canonique de verrouillage des ressources dans le code 4GL."
      : isLockTimeout
      ? "Session bloquante maintenue ouverte sans COMMIT WORK rapide."
      : "Donnée absente ou session SGBD interrompue.",
    recommendedFix:
      "Trier systématiquement les comptes par clé primaire croissante avant d'effectuer les 'SELECT ... FOR UPDATE', et réduire la portée de la transaction.",
    validationTest: "Passage d'un test de charge concurrentiel de 20 sessions simultanées sans aucun code erreur 143/154.",
  };
}

/**
 * Revue automatique de code 4GL
 */
export function review4GlCode(code: string): CodeReviewFinding[] {
  const findings: CodeReviewFinding[] = [];
  const lines = code.split("\n");

  let hasWheneverError = false;
  let hasBeginWork = false;
  let hasCommitWork = false;

  lines.forEach((line, idx) => {
    const lineNum = `Ligne ${idx + 1}`;
    const clean = line.trim().toUpperCase();

    if (clean.includes("WHENEVER ERROR")) hasWheneverError = true;
    if (clean.includes("BEGIN WORK")) hasBeginWork = true;
    if (clean.includes("COMMIT WORK")) hasCommitWork = true;

    // Détection de variables non protégées ou SQL sans contrôle
    if (clean.startsWith("SELECT") && !clean.includes("INTO") && !clean.includes("DECLARE")) {
      findings.push({
        id: `REV-${idx + 1}`,
        category: "SYNTAXE",
        severity: "BLOQUANTE",
        location: lineNum,
        description: "SELECT orphelin sans clause INTO ou CURSOR",
        explanation: "En Informix 4GL, tout SELECT doit spécifier des variables réceptrices via 'INTO v_var' ou utiliser un CURSOR déclaré.",
        proposedFix: "Ajouter la clause 'INTO v_variable' pour stocker le résultat.",
        validationTest: "Compilation C4GL sans erreur de syntaxe SQL.",
      });
    }

    if (clean.startsWith("DELETE FROM") && !clean.includes("WHERE")) {
      findings.push({
        id: `REV-DEL-${idx + 1}`,
        category: "SECURITE",
        severity: "BLOQUANTE",
        location: lineNum,
        description: "DELETE sans clause WHERE détecté",
        explanation: "Suppression massive non restreinte détruisant l'intégrité de la base bancaire.",
        proposedFix: "Spécifier obligatoirement une condition WHERE num_compte = :param.",
        validationTest: "Vérifier que seul l'enregistrement cible est affecté.",
      });
    }
  });

  if (hasBeginWork && !hasCommitWork) {
    findings.push({
      id: "REV-TX-01",
      category: "TRANSACTION",
      severity: "BLOQUANTE",
      location: "Bloc Transactionnel",
      description: "BEGIN WORK sans COMMIT WORK identifié",
      explanation: "Une transaction non fermée laissera des verrous exclusifs sur la table et provoquera des blocages en cascade (Timeouts EOD).",
      proposedFix: "Ajouter impérativement un COMMIT WORK ou ROLLBACK WORK en cas d'erreur.",
      validationTest: "Vérifier la libération immédiate des verrous après exécution.",
    });
  }

  if (!hasWheneverError) {
    findings.push({
      id: "REV-ERR-01",
      category: "CONVENTIONS",
      severity: "MAJEURE",
      location: "En-tête de programme",
      description: "Absence de directive WHENEVER ERROR",
      explanation: "Par défaut, une erreur SQL interrompt brutalement l'exécutable sans permettre un rollback ou une journalisation propre.",
      proposedFix: "Déclarer 'WHENEVER ERROR CONTINUE' avant les accès SQL critiques et tester SQLCA.SQLCODE.",
      validationTest: "Simuler une erreur SQL (table verrouillée) et vérifier la capture du code retour.",
    });
  }

  return findings;
}
