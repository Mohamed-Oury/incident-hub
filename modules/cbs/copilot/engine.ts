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

export function generateCopilotPlan(input: DevelopmentNeedInput): CopilotFullPlan {
  const isAccountOrClient =
    input.bankingDomain.toLowerCase().includes("compte") ||
    input.functionalDescription.toLowerCase().includes("compte") ||
    input.title.toLowerCase().includes("compte");

  const isVirementOrFlux =
    input.bankingDomain.toLowerCase().includes("virement") ||
    input.functionalDescription.toLowerCase().includes("virement") ||
    input.functionalDescription.toLowerCase().includes("transfert");

  const needsIhm =
    input.functionalDescription.toLowerCase().includes("écran") ||
    input.functionalDescription.toLowerCase().includes("ihm") ||
    input.functionalDescription.toLowerCase().includes("formulaire") ||
    input.functionalDescription.toLowerCase().includes("gestionnaire") ||
    input.functionalDescription.toLowerCase().includes("consulter") ||
    input.functionalDescription.toLowerCase().includes("rechercher");

  // 1. Analyse fonctionnelle
  const analysis: FunctionalAnalysis = {
    summary: `Développement et intégration pour '${input.title}' sur le domaine '${input.bankingDomain}' (Amplitude ${input.amplitudeVersion}).`,
    businessObjective: `Offrir aux ${input.targetUsers || "utilisateurs autorisés"} la capacité de ${input.functionalDescription.slice(0, 120)}... de manière sécurisée et tracée dans le CBS.`,
    actors: [input.targetUsers || "Gestionnaire Bancaire / Exploitant", "Superviseur d'Agence", "Système CBS Amplitude"],
    preconditions: [
      "Session opérateur active et authentifiée avec profil habilité sur le module.",
      "Journée comptable BOD (Beginning of Day) ouverte et non clôturée.",
      "Accès en lecture/écriture accordé sur le périmètre agence de l'opérateur.",
    ],
    postconditions: [
      "Opération validée et historisée dans la piste d'audit CBS.",
      "Intégrité des tables comptables et soldes préservée sans verrou résiduel.",
      "Structure de données de sortie retournée au programme appelant ou à l'écran.",
    ],
    businessRules: [
      input.knownBusinessRules || "Contrôle d'existence et de validité de l'identifiant renseigné.",
      "Interdiction de traitement sur les entités fermées ou bloquées juridiquement.",
      "Respect strict de la séparation des profils et contrôle de double signature si montant seuil dépassé.",
    ],
    requiredData: [
      input.inputData || "Clé de recherche / Identifiant compte",
      "Statut administratif et juridique",
      "Soldes et devises de référence",
      "Piste d'audit (Opérateur, Date, Heure, Agence)",
    ],
    cbsDependencies: [
      "Référentiel agences et devises Amplitude",
      "Module de sécurité et droits d'accès (SECURITE_PROFIL)",
      "Gestionnaire de transactions SQL (BEGIN WORK / COMMIT WORK)",
    ],
    unresolvedQuestions: [
      "Information nécessaire : nom réel de la table ou structure CBS à confirmer dans le dictionnaire de données pour l'environnement cible.",
      "Quel est le comportement attendu en cas de compte débiteur non autorisé ?",
      "Le programme doit-il supporter l'appel en mode Batch (sans IHM) et interactif (.per) ?",
    ],
    technicalRisks: [
      "Verrouillage exclusif prolongé sur table centrale lors d'un pic d'activité agence.",
      "Full Table Scan en cas d'absence d'index sur la clé secondaire de recherche.",
      "Élévation de privilèges si la vérification de profil n'est pas effectuée en amont du traitement 4GL.",
    ],
  };

  // 2. Décomposition en sous-tâches
  const subTasks: CopilotSubTask[] = [
    {
      id: "TASK-01",
      title: "Analyse fonctionnelle détaillée & dictionnaire de données",
      description: "Vérifier la concordance des champs requis avec le dictionnaire de données Amplitude de la banque.",
      type: "FONCTIONNEL",
      priority: "HAUTE",
      dependencies: [],
      estimation: "0.5 jour",
      inputs: input.inputData || "Spécification métier",
      outputs: "Matrice de mapping champs CBS",
      acceptanceCriteria: [
        "Tous les champs nécessaires sont identifiés dans le schéma cible.",
        "Les règles de validation métier sont formellement validées par la MOA.",
      ],
      concernedFiles: ["DOC_FONCT_" + input.title.replace(/\s+/g, "_") + ".md"],
      status: "VALIDE",
    },
    {
      id: "TASK-02",
      title: "Modélisation des accès SGBD & Requêtes SQL",
      description: "Rédiger et optimiser les requêtes SELECT / UPDATE avec contrôle d'index et clause de verrouillage maîtrisée.",
      type: "SQL",
      priority: "HAUTE",
      dependencies: ["TASK-01"],
      estimation: "0.5 jour",
      inputs: "Schéma de base de données SGBD (Oracle/Informix)",
      outputs: "Script SQL paramétré avec plan d'exécution validé",
      acceptanceCriteria: [
        "Temps d'exécution < 15ms sur un volume de 2 millions d'enregistrements.",
        "Index existant utilisé sans Full Table Scan.",
      ],
      concernedFiles: ["src/sql/" + (isAccountOrClient ? "sel_compte_detail.sql" : "oper_flux.sql")],
      status: "A_FAIRE",
    },
    ...(needsIhm
      ? [
          {
            id: "TASK-03",
            title: "Conception de l'écran formulaire Form (.per)",
            description: "Créer le fichier de masque écran .per avec zones de saisie, zones protégées et labels explicites.",
            type: "IHM_PER" as const,
            priority: "MOYENNE" as const,
            dependencies: ["TASK-01"],
            estimation: "1 jour",
            inputs: "Cahier des charges IHM & charte graphique Amplitude",
            outputs: "Fichier source .per compilé en .frm",
            acceptanceCriteria: [
              "Navigation ergonomique au clavier (Tab, Flèches, F12 pour quitter, F1 pour aide).",
              "Champs protégés en lecture seule non éditables par l'utilisateur.",
            ],
            concernedFiles: ["src/forms/f_cbs_" + (isAccountOrClient ? "cpt_rech.per" : "oper_saisie.per")],
            status: "A_FAIRE" as const,
          },
        ]
      : []),
    {
      id: "TASK-04",
      title: "Développement du module applicatif Informix 4GL",
      description: "Implémenter la logique métier, les contrôles de saisie, la gestion des transactions et les codes retour.",
      type: "4GL",
      priority: "BLOQUANTE",
      dependencies: ["TASK-02", ...(needsIhm ? ["TASK-03"] : [])],
      estimation: "1.5 jour",
      inputs: "Spécification technique & requêtes SQL",
      outputs: "Fichier source .4gl compilé en .4go / .4ge",
      acceptanceCriteria: [
        "Gestion rigoureuse de status et SQLCA.SQLCODE après chaque accès SGBD.",
        "Absence de variables non initialisées.",
        "Rollback automatique en cas d'anomalie.",
      ],
      concernedFiles: ["src/prog/p_cbs_" + (isAccountOrClient ? "cpt_consult.4gl" : "traitement_flux.4gl")],
      status: "A_FAIRE",
    },
    {
      id: "TASK-05",
      title: "Plan de tests unitaires & scénarios aux limites",
      description: "Exécuter les jeux d'essais nominaux, cas d'erreurs (compte inexistant, devise non supportée) et tests d'habilitation.",
      type: "TEST",
      priority: "HAUTE",
      dependencies: ["TASK-04"],
      estimation: "1 jour",
      inputs: "Jeux de données d'environnement de Recette",
      outputs: "Procès-verbal de recette technique et couverture 100%",
      acceptanceCriteria: [
        "100% des cas d'erreurs génèrent un message explicite sans crash du programme.",
        "L'intégrité de la base de données est garantie.",
      ],
      concernedFiles: ["tests/tu_cbs_" + (isAccountOrClient ? "cpt.sh" : "oper.sh")],
      status: "A_FAIRE",
    },
    {
      id: "TASK-06",
      title: "Dossier de livraison & Procédure de Rollback",
      description: "Rédiger la fiche de mise en production, l'ordre de compilation et le script de retour arrière immédiat.",
      type: "DOCUMENTATION",
      priority: "HAUTE",
      dependencies: ["TASK-05"],
      estimation: "0.5 jour",
      inputs: "Binaires compilés et scripts SQL",
      outputs: "Package de livraison zippé avec bordereau de MEP",
      acceptanceCriteria: [
        "Procédure de rollback testée et réalisable en moins de 10 minutes en cas d'anomalie.",
      ],
      concernedFiles: ["delivery/MEP_CBS_" + input.title.replace(/\s+/g, "_") + ".txt"],
      status: "A_FAIRE",
    },
  ];

  // 3. Proposition de Code 4GL
  const progName = isAccountOrClient ? "p_cbs_cpt_consult" : "p_cbs_traitement_flux";
  const code4GlProposal: Generated4GlProposal = {
    programObjective: `Assurer le traitement métier pour '${input.title}' avec contrôles stricts de solvabilité, sécurité et gestion des erreurs.`,
    programType: needsIhm ? "Programme Interactif avec Écran Formulaire" : "Programme Batch / Fonction Métier",
    entryPoint: `MAIN ou FUNCTION ${progName}()`,
    parameters: ["p_identifiant CHAR(24)", "p_code_agence CHAR(5)", "p_user_login CHAR(10)"],
    variables: [
      "v_statut CHAR(2)",
      "v_solde DECIMAL(18,3)",
      "v_nom_client CHAR(50)",
      "v_code_retour INTEGER",
      "v_message CHAR(255)",
    ],
    dataStructures: ["RECORD LIKE structure_cbs.*"],
    errorHandling: "Contrôle systématique de SQLCA.SQLCODE et interception WHENEVER ERROR CONTINUE",
    transactionControl: "BEGIN WORK / COMMIT WORK avec protection ROLLBACK WORK",
    loggingStrategy: "Journalisation dans la table d'audit CBS des tentatives frauduleuses ou erreurs critiques",
    code4Gl: `###############################################################################
# Programme : ${progName}.4gl
# Objet     : ${input.title}
# Auteur    : M.Oury (CBS 4GL Development Copilot)
# Système   : Sopra Banking Amplitude (${input.amplitudeVersion})
# Note      : Proposition technique à adapter au dictionnaire réel de la banque.
###############################################################################

DATABASE amplitude_db

GLOBALS
    DEFINE g_user_id      CHAR(10),
    DEFINE g_code_agence  CHAR(5)
END GLOBALS

MAIN
    DEFINE v_num_compte   CHAR(24)
    DEFINE v_client_nom   CHAR(50)
    DEFINE v_solde_disp   DECIMAL(18,3)
    DEFINE v_etat_compte  CHAR(2)
    DEFINE v_code_retour  INTEGER
    DEFINE v_message      CHAR(255)

    -- Initialisation des variables
    LET v_code_retour = 0
    LET v_message     = NULL
    LET v_solde_disp  = 0.000

    -- Affichage de l'en-tête de session
    DISPLAY "--- INITIALISATION DU TRAITEMENT CBS AMPLITUDE ---" AT 1, 2

    ${needsIhm ? `-- Ouverture de l'écran formulaire
    OPEN WINDOW w_cbs_cpt AT 3, 2 WITH FORM "f_cbs_cpt_rech"
    
    INPUT BY NAME v_num_compte WITHOUT DEFAULTS
        BEFORE FIELD v_num_compte
            MESSAGE "Veuillez saisir le numéro de compte (ou F12 pour quitter)"
        AFTER FIELD v_num_compte
            IF v_num_compte IS NULL OR v_num_compte = "" THEN
                ERROR "Erreur : Le numéro de compte est obligatoire."
                NEXT FIELD v_num_compte
            END IF
    END INPUT` : `-- Récupération des paramètres en ligne de commande
    LET v_num_compte = ARG_VAL(1)`}

    -- 1. Contrôle fonctionnel préalable
    IF v_num_compte IS NULL OR LENGTH(v_num_compte) < 6 THEN
        LET v_code_retour = 1
        LET v_message = "Numéro de compte non conforme ou manquant."
        DISPLAY v_message AT 23, 2
        EXIT PROGRAM (v_code_retour)
    END IF

    -- 2. Recherche et contrôle d'existence dans le référentiel CBS
    -- Information nécessaire : nom réel de la table (ex: BKCOM / BKMVT / COMPTES)
    WHENEVER ERROR CONTINUE
    SELECT c.nom_client, c.solde_disponible, c.statut
      INTO v_client_nom, v_solde_disp, v_etat_compte
      FROM bkcom c
     WHERE c.num_compte = v_num_compte

    IF SQLCA.SQLCODE = 100 THEN
        LET v_code_retour = 2
        LET v_message = "Rejet : Compte client inexistant dans le référentiel CBS."
        ERROR v_message
    ELSE
        IF SQLCA.SQLCODE < 0 THEN
            LET v_code_retour = 99
            LET v_message = "Erreur SQL SGBD interne : ", SQLCA.SQLCODE USING "-<<<<<<"
            ERROR v_message
        ELSE
            -- 3. Contrôles métier spécifiques
            IF v_etat_compte = "F" OR v_etat_compte = "CLO" THEN
                LET v_code_retour = 3
                LET v_message = "Avertissement : Ce compte est clôturé / bloqué juridiquement."
                ERROR v_message
            ELSE
                -- Affichage des informations validées
                DISPLAY "Compte valide : ", v_num_compte CLIPPED AT 10, 5
                DISPLAY "Titulaire     : ", v_client_nom CLIPPED AT 11, 5
                DISPLAY "Solde Dispo   : ", v_solde_disp USING "---,---,---,---.&&&" AT 12, 5
                LET v_message = "Consultation effectuée avec succès."
            END IF
        END IF
    END IF
    WHENEVER ERROR STOP

    -- 4. Enregistrement dans la piste d'audit CBS
    INSERT INTO trace_audit_cbs (prog_nom, user_id, date_oper, action_desc, code_ret)
    VALUES ("${progName}", g_user_id, CURRENT YEAR TO SECOND, v_message, v_code_retour)

    ${needsIhm ? `PROMPT "Appuyez sur Entrée pour quitter..." FOR CHAR v_message
    CLOSE WINDOW w_cbs_cpt` : `-- Clôture normale`}
    
    EXIT PROGRAM (v_code_retour)
END MAIN`,
    importantNotes: [
      "La table 'bkcom' est une désignation usuelle Amplitude : confirmez son libellé exact sur votre schéma (ex: BKSOL, BKCOM, CLI_CPT).",
      "Toujours encadrer les ordres d'écriture DML dans un bloc BEGIN WORK / COMMIT WORK avec gestion de ROLLBACK WORK.",
      "Le code retour doit être normalisé : 0 = Succès, 1 = Format invalide, 2 = Introuvable, 3 = Statut bloqué, 99 = Erreur technique SGBD.",
    ],
  };

  // 4. Écran .per (si besoin IHM)
  let perScreen: GeneratedPerScreen | null = null;
  if (needsIhm) {
    perScreen = {
      screenName: isAccountOrClient ? "f_cbs_cpt_rech.per" : "f_cbs_oper_saisie.per",
      title: `Consultation & Traitement - ${input.title}`,
      screenType: "Formulaire Transactionnel Interactif",
      dimensions: "24 lignes x 80 colonnes (Standard terminal Curses/AIX)",
      inputFieldList: ["v_num_compte (Numéro de compte, 24 caractères alphanumériques)"],
      readOnlyFieldList: [
        "v_client_nom (Titulaire, 50 caractères)",
        "v_solde_disp (Solde disponible, numérique formaté)",
        "v_etat_compte (Statut administratif)",
      ],
      buttons: ["F1 = Aide fonctionnelle", "F5 = Rafraîchir", "F10 = Valider", "F12 = Quitter l'écran"],
      messages: [
        "Ligne 23 : Messages d'avertissement et guidage opérateur",
        "Ligne 24 : Erreurs bloquantes et alertes de sécurité",
      ],
      visualMockupAscii: `+------------------------------------------------------------------------------+
|                     BANQUE - CBS AMPLITUDE (MODULE COMPTES)                  |
+------------------------------------------------------------------------------+
|                                                                              |
|  [ CRITÈRES DE RECHERCHE ]                                                   |
|  Numéro de compte : [________________________]                               |
|                                                                              |
|  [ INFORMATIONS DU COMPTE ]                                                  |
|  Titulaire        : [                                                  ]     |
|  Statut juridique : [__]                                                     |
|  Solde disponible : [____________________] FCFA                              |
|                                                                              |
|  [ DERNIÈRES OPÉRATIONS COMPTABLES ]                                         |
|  Date       | Réf Mouvement    | Libellé                  | Débit / Crédit   |
|  -----------+------------------+--------------------------+----------------  |
|  [  /  /  ] | [              ] | [                      ] | [              ] |
|  [  /  /  ] | [              ] | [                      ] | [              ] |
|  [  /  /  ] | [              ] | [                      ] | [              ] |
|                                                                              |
|  [F1] Aide    [F5] Rafraîchir    [F10] Valider recherche    [F12] Quitter    |
+------------------------------------------------------------------------------+
| MESSAGE : Saisissez un numéro de compte et appuyez sur F10                   |
+------------------------------------------------------------------------------+`,
      perCodeSnippet: `DATABASE amplitude_db
SCREEN
{
==============================================================================
                    CONSULTATION COMPTE CLIENT - CBS AMPLITUDE
==============================================================================

  Numéro de compte : [f001                    ]

  Titulaire        : [f002                                              ]
  Statut Compte    : [f003]
  Solde Disponible : [f004                ]

==============================================================================
 [F10] Rechercher         [F5] Réinitialiser         [F12] Quitter
==============================================================================
}
END
TABLES
  bkcom
ATTRIBUTES
  f001 = bkcom.num_compte, REQUIRED, UPSHIFT,
         COMMENTS = "Saisissez le numéro de compte client (24 caractères max)";
  f002 = bkcom.nom_client, NOENTRY;
  f003 = bkcom.statut, NOENTRY;
  f004 = bkcom.solde_disponible, NOENTRY, FORMAT = "---,---,---,---.&&&";
INSTRUCTIONS
  DELIMITERS "[]"
END`,
      amplitudeIntegrationNotes: [
        "Compiler le masque avec : 'form4gl f_cbs_cpt_rech.per' (génère f_cbs_cpt_rech.frm).",
        "Le fichier .frm doit être déployé dans le répertoire $AMPLITUDE_FORMS / $FORMPATH.",
        "Vérifier le support de l'émulation terminal VT100 / VT220 pour l'affichage correct des bordures ASCII.",
      ],
    };
  }

  // 5. Proposition SQL
  const sqlProposal: GeneratedSqlQuery = {
    objective: `Extraction performante des données de compte et historique pour '${input.title}'.`,
    targetTables: [isAccountOrClient ? "bkcom (Comptes)" : "bkmvt (Mouvements)", "bkcli (Clients)"],
    joins: "INNER JOIN bkcli ON bkcom.cod_client = bkcli.cod_client",
    parameters: [":p_num_compte (CHAR 24)", ":p_date_valeur (DATE)"],
    filters: "WHERE bkcom.num_compte = :p_num_compte AND bkcom.cod_agence = :p_agence",
    performanceRisks: [
      "Risque de Full Table Scan si recherche sur le nom au lieu du numéro de compte (index clé primaire).",
      "Éviter les fonctions scalaires dans le WHERE (ex: UPPER, SUBSTR) qui invalident l'utilisation de l'index B-Tree.",
      "Sur Informix, exécuter 'SET ISOLATION TO DIRTY READ' si la requête est purement informative et n'effectue aucun calcul comptable bloquant.",
    ],
    securityPrecautions: [
      "Filtrage systématique par code agence pour empêcher les fuites de données inter-agences non autorisées.",
      "Masquage partiel des numéros de carte ou données PII sensibles dans les historiques de mouvements.",
    ],
    sqlCode: `-- Requête principale d'extraction optimisée pour Amplitude
SELECT 
    c.num_compte,
    c.cod_client,
    cl.nom_client,
    c.statut,
    c.devise,
    c.solde_comptable,
    c.solde_disponible,
    c.date_derniere_op
FROM bkcom c
INNER JOIN bkcli cl ON c.cod_client = cl.cod_client
WHERE c.num_compte = :p_num_compte
  AND c.cod_agence = :p_code_agence;

-- Index recommandé à vérifier dans le schéma :
-- CREATE UNIQUE INDEX idx_bkcom_numcpt ON bkcom (num_compte);`,
  };

  // 6. Jeux de Tests
  const testCases: CopilotTestCase[] = [
    {
      id: "TC-01",
      category: "NOMINAL",
      title: "Consultation normale d'un compte actif avec solde créditeur",
      preconditions: "Compte existant, statut 'A' (Actif), solde > 0, opérateur habilité agence.",
      testSteps: [
        "1. Saisir le numéro de compte '001001234567'.",
        "2. Valider par F10.",
        "3. Contrôler les informations affichées à l'écran.",
      ],
      expectedResult: "Titulaire correct affiché, solde exact conforme au solde SGBD, code retour 0.",
      actualStatus: "A_TESTER",
    },
    {
      id: "TC-02",
      category: "ERREUR",
      title: "Recherche sur un numéro de compte inexistant",
      preconditions: "Numéro de compte '999999999999' absent de la base.",
      testSteps: ["1. Saisir '999999999999'.", "2. Valider par F10."],
      expectedResult: "Message bloquant 'Rejet : Compte client inexistant' affiché en ligne 24, code retour 2.",
      actualStatus: "A_TESTER",
    },
    {
      id: "TC-03",
      category: "LIMITES",
      title: "Traitement d'un compte clôturé ou sous séquestre",
      preconditions: "Compte avec statut = 'F' (Fermé) ou 'BLQ' (Bloqué).",
      testSteps: ["1. Saisir le compte bloqué.", "2. Valider par F10."],
      expectedResult: "Avertissement affiché, interdiction formelle d'engager des mouvements financiers, code retour 3.",
      actualStatus: "A_TESTER",
    },
    {
      id: "TC-04",
      category: "DROITS",
      title: "Tentative d'accès par un opérateur d'une agence non autorisée",
      preconditions: "Opérateur agence 001 tentant d'accéder à un compte confidentiel agence 009.",
      testSteps: ["1. Connexion avec login opérateur standard.", "2. Demande d'accès au compte hors périmètre."],
      expectedResult: "Rejet immédiat 'Accès refusé : habilitation agence insuffisante' avec traçage audit de sécurité.",
      actualStatus: "A_TESTER",
    },
  ];

  // 7. Package de Livraison & Rollback
  const deliveryPackage: DeliveryPackage = {
    modifiedFiles: [
      `src/prog/${progName}.4gl`,
      ...(needsIhm ? [`src/forms/f_cbs_cpt_rech.per`] : []),
      `src/sql/sel_compte_detail.sql`,
      `config/menus/amplitude_menu_custom.xml`,
    ],
    parametersToDeclare: [
      "Variable d'environnement $AMPLITUDE_FORMS pointant sur le dossier compilé .frm",
      "Habilitation profil 'OPER_CPT_CONSULT' dans la table des droits CBS (BKSEC)",
    ],
    installationScripts: [
      `c4gl -o bin/${progName} src/prog/${progName}.4gl`,
      ...(needsIhm ? [`form4gl src/forms/f_cbs_cpt_rech.per`] : []),
      `chmod 750 bin/${progName}`,
    ],
    installationOrder: [
      "1. Sauvegarde à froid / Backup des binaires existants dans /backup/cbs/bin/.",
      "2. Compilation des masques .per vers .frm.",
      "3. Compilation des sources .4gl vers exécutables .4ge / binaires C4GL.",
      "4. Déclaration des entrées de menu et habilitations en base de recette.",
      "5. Exécution des tests pilotes avec compte de test.",
    ],
    preDeliveryChecklist: [
      "✓ Code source inspecté sans mot de passe ni clé en clair.",
      "✓ Plan d'exécution SQL validé avec index (pas de full table scan).",
      "✓ Sauvegarde de la base de données validée avant le déploiement.",
    ],
    postDeliveryChecklist: [
      "✓ Vérification des logs système dans /var/log/amplitude/ pour absence d'erreurs 4GL.",
      "✓ Test d'un appel nominal avec retour code 0.",
      "✓ Contrôle de l'absence de verrous orphelins (onstat -k / V$LOCK).",
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

/**
 * Moteur d'analyse de point de rupture 4GL / SQL pour le mode RUN/BUILD
 */
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
