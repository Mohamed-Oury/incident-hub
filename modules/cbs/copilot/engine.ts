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
      "Vérification des habilitations spécifiques agence sur la table BKCPT (filtre sur colonne AGE).",
      "Quel est le comportement attendu en cas de compte débiteur au-delà de la limite DEB autorisée ?",
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
      concernedFiles: ["docs/spec_" + (isAccountOrClient ? "cpt_consult.md" : "oper_flux.md")],
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
      concernedFiles: ["delivery/mep_cbs_" + (isAccountOrClient ? "cpt_consult.txt" : "oper_flux.txt")],
      status: "A_FAIRE",
    },
  ];

  // 3. Proposition de Code 4GL
  const progName = isAccountOrClient ? "p_cbs_cpt_consult" : "p_cbs_traitement_flux";
  const code4GlProposal: Generated4GlProposal = {
    programObjective: `Assurer le traitement métier pour '${input.title}' avec contrôles stricts de solvabilité sur BKCPT, contrôle KYC tiers BKCLI et gestion des erreurs SQLCA.`,
    programType: needsIhm ? "Programme Interactif avec Écran Formulaire (.per)" : "Programme Batch / Fonction Métier (C4GL)",
    entryPoint: `MAIN ou FUNCTION ${progName}()`,
    parameters: ["p_agence CHAR(5)", "p_ncp CHAR(11)", "p_user_login CHAR(10)"],
    variables: [
      "v_age VARCHAR(5)",
      "v_ncp VARCHAR(11)",
      "v_cli VARCHAR(15)",
      "v_nom VARCHAR(45)",
      "v_pre VARCHAR(30)",
      "v_dev VARCHAR(3)",
      "v_sol DECIMAL(19,4)",
      "v_sind DECIMAL(19,4)",
      "v_deb DECIMAL(19,4)",
      "v_solde_dispo DECIMAL(19,4)",
      "v_eta VARCHAR(1)",
      "v_code_retour INTEGER",
      "v_message VARCHAR(255)",
    ],
    dataStructures: ["RECORD LIKE bkcpt.*", "RECORD LIKE bkcli.*"],
    errorHandling: "Contrôle systématique de SQLCA.SQLCODE et interception WHENEVER ERROR CONTINUE",
    transactionControl: "BEGIN WORK / COMMIT WORK avec protection ROLLBACK WORK",
    loggingStrategy: "Journalisation dans la table d'audit CBS des tentatives frauduleuses ou erreurs critiques",
    code4Gl: `###############################################################################
# Programme : ${progName}.4gl
# Objet     : ${input.title}
# Auteur    : M.Oury (CBS 4GL Development Copilot)
# Système   : Sopra Banking Amplitude (${input.amplitudeVersion})
# SGBD      : ${input.technicalEnvironment} (Tables BKCPT, BKCLI, BKTRA)
###############################################################################

DATABASE amplitude_db

GLOBALS
    DEFINE g_user_id      VARCHAR(10),
    DEFINE g_code_agence  VARCHAR(5)
END GLOBALS

MAIN
    DEFINE v_age          VARCHAR(5)
    DEFINE v_ncp          VARCHAR(11)
    DEFINE v_cli          VARCHAR(15)
    DEFINE v_nom          VARCHAR(45)
    DEFINE v_pre          VARCHAR(30)
    DEFINE v_dev          VARCHAR(3)
    DEFINE v_sol          DECIMAL(19,4)
    DEFINE v_sind         DECIMAL(19,4)
    DEFINE v_deb          DECIMAL(19,4)
    DEFINE v_solde_dispo  DECIMAL(19,4)
    DEFINE v_eta          VARCHAR(1)
    DEFINE v_code_retour  INTEGER
    DEFINE v_message      VARCHAR(255)

    -- Initialisation des compteurs et accumulateurs
    LET v_code_retour = 0
    LET v_message     = NULL
    LET v_solde_dispo = 0.0000

    -- Affichage de l'en-tête de session d'ingénierie Amplitude
    DISPLAY "--- INITIALISATION DU TRAITEMENT CBS AMPLITUDE ---" AT 1, 2

    ${needsIhm ? `-- Ouverture du masque écran formulaire
    OPEN WINDOW w_cbs_cpt AT 3, 2 WITH FORM "f_cbs_cpt_rech"
    
    INPUT BY NAME v_age, v_ncp WITHOUT DEFAULTS
        BEFORE FIELD v_age
            MESSAGE "Saisissez l'agence (ex: 00100) ou F12 pour quitter"
        AFTER FIELD v_age
            IF v_age IS NULL OR LENGTH(v_age) < 3 THEN
                ERROR "Erreur : Code agence obligatoire (min 3 caractères)."
                NEXT FIELD v_age
            END IF

        BEFORE FIELD v_ncp
            MESSAGE "Saisissez le numéro de compte racine (11 chiffres) ou F12 pour quitter"
        AFTER FIELD v_ncp
            IF v_ncp IS NULL OR LENGTH(v_ncp) < 6 THEN
                ERROR "Erreur : Numéro de compte racine BKCPT invalide."
                NEXT FIELD v_ncp
            END IF
    END INPUT` : `-- Récupération des paramètres en ligne de commande (Batch/Script)
    LET v_age = ARG_VAL(1)
    LET v_ncp = ARG_VAL(2)`}

    -- 1. Contrôle fonctionnel préalable
    IF v_age IS NULL OR v_ncp IS NULL THEN
        LET v_code_retour = 1
        LET v_message = "Paramètres de recherche manquants (AGE/NCP obligatoires)."
        DISPLAY v_message AT 23, 2
        EXIT PROGRAM (v_code_retour)
    END IF

    -- 2. Recherche et contrôle d'existence dans le référentiel des comptes BKCPT et tiers BKCLI
    WHENEVER ERROR CONTINUE
    SELECT c.cli, c.dev, c.sol, c.sind, NVL(c.deb, 0), c.eta, k.nom, k.pre
      INTO v_cli, v_dev, v_sol, v_sind, v_deb, v_eta, v_nom, v_pre
      FROM bkcpt c, OUTER bkcli k
     WHERE c.age = v_age
       AND c.ncp = v_ncp
       AND c.cli = k.cli

    IF SQLCA.SQLCODE = 100 THEN
        LET v_code_retour = 2
        LET v_message = "Rejet : Compte introuvable dans BKCPT (AGE: " || v_age || ", NCP: " || v_ncp || ")."
        ERROR v_message
    ELSE
        IF SQLCA.SQLCODE < 0 THEN
            LET v_code_retour = 99
            LET v_message = "Erreur SQL SGBD interne : ", SQLCA.SQLCODE USING "-<<<<<<"
            ERROR v_message
        ELSE
            -- 3. Contrôles métier de conformité et de statut juridique
            IF v_eta = "F" THEN
                LET v_code_retour = 3
                LET v_message = "Avertissement : Ce compte est CLÔTURÉ (Statut F dans BKCPT)."
                ERROR v_message
            ELSE
                IF v_eta = "D" THEN
                    LET v_code_retour = 4
                    LET v_message = "Alerte Sécurité : Compte en CONTENTIEUX / SÉQUESTRE (Statut D)."
                    ERROR v_message
                ELSE
                    -- Calcul de solvabilité temps réel Amplitude
                    LET v_solde_dispo = (v_sol - v_sind + v_deb)

                    -- Affichage des informations validées
                    DISPLAY "Compte Valide : ", v_age CLIPPED, "-", v_ncp CLIPPED AT 10, 5
                    DISPLAY "Titulaire     : ", v_nom CLIPPED, " ", v_pre CLIPPED AT 11, 5
                    DISPLAY "Devise        : ", v_dev CLIPPED AT 12, 5
                    DISPLAY "Solde Compt.  : ", v_sol USING "---,---,---,--&.&&&&" AT 13, 5
                    DISPLAY "Indisponible  : ", v_sind USING "---,---,---,--&.&&&&" AT 14, 5
                    DISPLAY "Découvert Aut.: ", v_deb USING "---,---,---,--&.&&&&" AT 15, 5
                    DISPLAY "SOLDE DISPO   : ", v_solde_dispo USING "---,---,---,--&.&&&&" AT 16, 5
                    LET v_message = "Consultation effectuée avec succès."
                END IF
            END IF
        END IF
    END IF
    WHENEVER ERROR STOP

    -- 4. Piste d'audit CBS
    INSERT INTO trace_audit_cbs (prog_nom, user_id, date_oper, action_desc, code_ret)
    VALUES ("${progName}", g_user_id, CURRENT YEAR TO SECOND, v_message, v_code_retour)

    ${needsIhm ? `PROMPT "Appuyez sur Entrée pour quitter..." FOR CHAR v_message
    CLOSE WINDOW w_cbs_cpt` : `-- Clôture normale`}
    
    EXIT PROGRAM (v_code_retour)
END MAIN`,
    importantNotes: [
      "Table centrale des soldes : 'BKCPT' indexée sur (AGE, NCP). Ne jamais faire de SELECT sans la clause 'AGE = v_age AND NCP = v_ncp'.",
      "Formule de disponibilité monétique Amplitude : Solde Disponible = SOL - SIND + DEB.",
      "Le code retour normalisé : 0 = Succès, 1 = Paramètres invalides, 2 = Compte inexistant, 3 = Clôturé, 4 = Contentieux, 99 = Erreur SGBD.",
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
      inputFieldList: [
        "v_age (Code Agence, 5 caractères)",
        "v_ncp (Numéro de compte racine, 11 caractères)",
      ],
      readOnlyFieldList: [
        "bkcli.nom / bkcli.pre (Titulaire Tiers, 45+30 caractères)",
        "bkcpt.dev (Devise ISO, 3 caractères)",
        "bkcpt.sol (Solde comptable, 19,4 formaté)",
        "bkcpt.sind (Indisponibilités, 19,4 formaté)",
        "bkcpt.deb (Découvert accordé, 19,4 formaté)",
        "solde_dispo (Solde net disponible temps réel)",
        "bkcpt.eta (État : A=Actif, F=Fermé, D=Contentieux)",
      ],
      buttons: ["F1 = Aide fonctionnelle", "F2 = Derniers Mouvements", "F5 = Rafraîchir", "F10 = Valider", "F12 = Quitter l'écran"],
      messages: [
        "Ligne 23 : Messages de guidage et statut opérationnel",
        "Ligne 24 : Erreurs bloquantes et alertes de sécurité",
      ],
      visualMockupAscii: `+------------------------------------------------------------------------------+
|             SOPRA BANKING AMPLITUDE - ATELIER DE CONSULTATION BKCPT          |
+------------------------------------------------------------------------------+
|                                                                              |
|  [ CRITÈRES D'IDENTIFICATION COMPTE ]                                        |
|  Code Agence : [f000 ]         Numéro Compte : [f001       ]                 |
|                                                                              |
|  [ RÉFÉRENTIEL TIERS & PROFIL JURIDIQUE ]                                    |
|  Code Tiers  : [f002           ]                                             |
|  Titulaire   : [f003                                        ] [f004        ] |
|  Devise      : [f005]          Statut Compte : [f006] (A=Actif, F=Fermé)     |
|                                                                              |
|  [ POSITION DE TRÉSORERIE TEMPS RÉEL ]                                       |
|  Solde Comptable  : [f007               ] XOF                                |
|  Indisponibilités : [f008               ] XOF (Blocages / Garanties)         |
|  Découvert Accordé: [f009               ] XOF                                |
|  --------------------------------------------------------------------------  |
|  SOLDE DISPONIBLE : [f010               ] XOF (Temps réel monétique)         |
|                                                                              |
|  [F1] Aide    [F2] Mouvements BKTRA    [F5] Recharger    [F12] Quitter       |
+------------------------------------------------------------------------------+
| MESSAGE : Renseignez le code agence et compte racine puis appuyez sur Entrée |
+------------------------------------------------------------------------------+`,
      perCodeSnippet: `DATABASE amplitude_db
SCREEN SIZE 24 BY 80
{
================================================================================
           SOPRA BANKING AMPLITUDE - CONSULTATION SOLDE COMPTE
================================================================================

 Agence : [f000 ]       Numéro Compte : [f001       ]
--------------------------------------------------------------------------------
 Code Client   : [f002           ]
 Titulaire     : [f003                                        ] [f004      ]
 Devise        : [f005]  Statut Compte : [f006] (A=Actif, F=Ferme, D=Contentieux)

 Solde Comptable : [f007               ]
 Indisponibilités: [f008               ]
 Découvert Aut.  : [f009               ]
 -------------------------------------------------------------------------------
 SOLDE DISPONIBLE: [f010               ]
================================================================================
 [F1] Aide   [F2] Derniers Mouvements   [F5] Recharger   [F12] Quitter
}
END
TABLES
    bkcpt, bkcli
ATTRIBUTES
    f000 = bkcpt.age, REQUIRED, UPSHIFT, COMMENTS = "Code agence (5 caractères)";
    f001 = bkcpt.ncp, REQUIRED, COMMENTS = "Numéro de compte racine (11 chiffres)";
    f002 = bkcpt.cli, NOENTRY;
    f003 = bkcli.nom, NOENTRY;
    f004 = bkcli.pre, NOENTRY;
    f005 = bkcpt.dev, NOENTRY;
    f006 = bkcpt.eta, NOENTRY;
    f007 = bkcpt.sol, FORMAT = "---,---,---,--&.&&", NOENTRY;
    f008 = bkcpt.sind, FORMAT = "---,---,---,--&.&&", NOENTRY;
    f009 = bkcpt.deb, FORMAT = "---,---,---,--&.&&", NOENTRY;
    f010 = FORMONLY.solde_dispo TYPE DECIMAL(19,4), FORMAT = "---,---,---,--&.&&", REVERSE, NOENTRY;
INSTRUCTIONS
    DELIMITERS "[]"
END`,
      amplitudeIntegrationNotes: [
        "Compiler le masque avec l'outil natif Informix/Amplitude : 'form4gl f_cbs_cpt_rech.per' (génère f_cbs_cpt_rech.frm).",
        "Le binaire .frm compilé doit être déposé dans le répertoire $AMPLITUDE_FORMS / $FORMPATH sur le serveur AIX/Linux.",
        "Le champ calculé solde_dispo utilise la clause FORMONLY pour ne pas altérer le dictionnaire physique BKCPT.",
      ],
    };
  }

  // 5. Proposition SQL
  const sqlProposal: GeneratedSqlQuery = {
    objective: `Extraction performante des soldes et historique des mouvements pour '${input.title}'.`,
    targetTables: ["BKCPT (Comptes & Soldes)", "BKCLI (Référentiel Tiers KYC)", "BKTRA (Journal des Mouvements)"],
    joins: "INNER JOIN BKCLI k ON c.CLI = k.CLI",
    parameters: [":p_age (VARCHAR 5)", ":p_ncp (VARCHAR 11)", ":p_date_j (DATE)"],
    filters: "WHERE c.AGE = :p_age AND c.NCP = :p_ncp",
    performanceRisks: [
      "Risque de Full Table Scan sur BKTRA si non filtré par DCO (Date Comptable) et NCP (index primaire).",
      "Éviter les fonctions scalaires dans le WHERE (ex: UPPER, SUBSTR) qui désactivent l'index B-Tree Informix.",
      "Sur Informix, exécuter 'SET ISOLATION TO DIRTY READ' si la requête est purement informative et n'effectue aucun calcul comptable bloquant.",
    ],
    securityPrecautions: [
      "Filtrage systématique par code agence pour empêcher les fuites de données inter-agences non autorisées.",
      "Masquage partiel des numéros de carte ou données PII sensibles dans les historiques de mouvements.",
    ],
    sqlCode: `-- 1. Consultation solde en temps réel avec jointure client KYC
SELECT 
    c.AGE,
    c.NCP,
    c.CLI,
    k.NOM,
    k.PRE,
    c.DEV,
    c.SOL,
    c.SIND,
    NVL(c.DEB, 0) AS DECOUVERT,
    (c.SOL - c.SIND + NVL(c.DEB, 0)) AS SOLDE_DISPONIBLE,
    c.ETA
FROM BKCPT c
LEFT OUTER JOIN BKCLI k ON c.CLI = k.CLI
WHERE c.AGE = :p_age
  AND c.NCP = :p_ncp;

-- 2. Consultation des 10 dernières écritures dans le journal des transactions BKTRA
SELECT 
    t.DCO,
    t.OPE,
    t.NCP,
    t.MON,
    t.SEN,
    t.LIB,
    t.UTI
FROM BKTRA t
WHERE t.AGE = :p_age
  AND t.NCP = :p_ncp
  AND t.DCO >= TRUNC(SYSDATE) - 30
ORDER BY t.DCO DESC, t.EVE DESC;

-- Index primaire utilisé :
-- PK_BKCPT ON BKCPT (AGE, NCP)
-- PK_BKTRA ON BKTRA (AGE, DCO, ETA, EVE)`,
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
