// modules/cbs/flexcube/data/flexcube-cheat-sheet-data.ts
import { FlexcubeCheatCategory, FlexcubeCheatSection } from "../types";

export const FLEXCUBE_CHEAT_CATEGORIES: { id: "ALL" | FlexcubeCheatCategory; label: string; icon: string }[] = [
  { id: "ALL", label: "Toutes les fiches (20)", icon: "📚" },
  { id: "ARCHITECTURE", label: "Architecture N-Tier & ODT", icon: "🏗️" },
  { id: "SCHEMA", label: "Tables & Schéma SGBD", icon: "🗄️" },
  { id: "PLSQL", label: "PL/SQL & Extensibilité", icon: "⚡" },
  { id: "AEOD", label: "Chaîne Batch & AEOD", icon: "⚙️" },
  { id: "RUN_INCIDENTS", label: "Incidents & Traces Debug", icon: "🚨" },
  { id: "GATEWAY", label: "Passerelles Gateway & Switch", icon: "🔄" },
];

export const FLEXCUBE_CHEAT_SHEET: FlexcubeCheatSection[] = [
  {
    id: 1,
    category: "ARCHITECTURE",
    title: "1. 🏗️ Architecture 3-Tier Oracle FLEXCUBE",
    short: "Architecture 3-Tier",
    badge: "Fondations Core",
    badgeColor: "#3b82f6",
    rawText: "L architecture Oracle FLEXCUBE repose sur trois tiers distincts : Client Web IHM (HTML5/JavaScript), Serveur d application (Oracle WebLogic Server avec services EJB/JMS/REST), et Base de données Oracle Enterprise (PL/SQL packages, tables partitionnées, Oracle RAC).",
    summaryPoints: [
      "Client UI : Interface web dynamique générée à partir des définitions d écrans RAD/ODT (fichiers XML/JS).",
      "Tier Applicatif : Oracle WebLogic Server gérant les sessions utilisateurs, les pools JDBC, la sécurité JAAS et les files JMS de la Gateway.",
      "Tier Base de Données : Moteur métier central exécuté en PL/SQL avec tables partitionnées et procédures stockées à haute performance.",
      "Communication : Échanges stateless entre l UI et WebLogic, appels JDBC hautement optimisés vers la base de données Oracle."
    ],
    caveat: "La configuration des DataSources WebLogic (taille du pool, timeouts de connexion) est critique pour la tenue en charge des agences."
  },
  {
    id: 2,
    category: "ARCHITECTURE",
    title: "2. 🛠️ ODT Workbench & Philosophie RAD",
    short: "ODT / RAD Tool",
    badge: "Outil Officiel",
    badgeColor: "#8b5cf6",
    rawText: "L Open Development Tool (ODT) est l atelier de génie logiciel d Oracle pour FLEXCUBE. Il permet de modéliser les écrans, définir les blocs de données, générer les spécifications d interface et créer les squelettes de packages PL/SQL.",
    summaryPoints: [
      "Génération assistée : À partir d une définition visuelle d écran (RADXML), ODT génère les scripts DDL, les fichiers d interface et les packages PL/SQL.",
      "Respect des couches : ODT produit automatiquement les packages Kernel standards et les points d ancrage pour le code spécifique banque.",
      "Cohérence du dictionnaire : Tout ajout de champ ou d écran doit passer par ODT pour maintenir la synchronisation avec les métadonnées système.",
      "Déploiement : Les fichiers générés (fichiers .inc, .spc, .sql) sont déployés selon un ordre strict défini par le guide de release."
    ],
    codeSample: "-- Structure générée par ODT :\n-- STPKS_STDCIF_MAIN.spc (Package Kernel)\n-- STPKS_STDCIF_CUSTOM.spc (Package Personnalisation)"
  },
  {
    id: 3,
    category: "ARCHITECTURE",
    title: "3. 📦 Hiérarchie des Packages : Kernel vs Cluster vs Custom",
    short: "Kernel vs Custom",
    badge: "Extensibilité",
    badgeColor: "#10b981",
    rawText: "Oracle FLEXCUBE applique une séparation stricte des responsabilités de code : Kernel (fourni par Oracle, intouchable), Cluster (adaptations régionales certifiées), et Custom (développements spécifiques de la banque).",
    summaryPoints: [
      "Package Kernel (_KERNEL / _MAIN) : Contient la logique métier standard internationale. Ne JAMAIS modifier sous peine de rupture de support.",
      "Package Cluster (_CLUSTER) : Adaptations réglementaires pour une zone monétaire donnée (ex: spécificités UEMOA, CEMAC, SEPA).",
      "Package Custom (_CUSTOM) : Espace réservé aux développeurs de la banque pour ajouter des règles métier, validations et intégrations locales.",
      "Mécanisme de Hook : Le Kernel appelle systématiquement les fonctions Pre_Check et Post_Check du package Custom à chaque étape du cycle de vie."
    ],
    codeSample: "CREATE OR REPLACE PACKAGE BODY STPKS_STDCIF_CUSTOM AS\n  FUNCTION Fn_Pre_Check_Mandatory(...) RETURN BOOLEAN IS\n  BEGIN\n    -- Contrôle spécifique de la banque ici\n    RETURN TRUE;\n  END Fn_Pre_Check_Mandatory;\nEND STPKS_STDCIF_CUSTOM;"
  },
  {
    id: 4,
    category: "SCHEMA",
    title: "4. 🗄️ Dictionnaire Tables Clients & Tiers (STTM_CUSTOMER)",
    short: "STTM_CUSTOMER",
    badge: "Module ST",
    badgeColor: "#0284c7",
    rawText: "La table STTM_CUSTOMER est le pivot central de la connaissance client (CIF). Elle regroupe les données signalétiques, le type de client (Individu, Corporate, Banque), le statut juridique et les indicateurs de gel.",
    summaryPoints: [
      "CUSTOMER_NO : Clé primaire sur 9 caractères alphanumériques identifiant le client de manière unique dans toute la banque.",
      "CUSTOMER_TYPE : 'I' pour personne physique (Particulier), 'C' pour entreprise (Corporate), 'B' pour établissement de crédit.",
      "FROZEN & DECEASED : Drapeaux de blocage global qui interdisent immédiatement toute opération au débit sur l ensemble des comptes du client.",
      "RECORD_STAT & AUTH_STAT : Cycle de vie standard FLEXCUBE : O (Open) / C (Closed), A (Authorized) / U (Unauthorized)."
    ]
  },
  {
    id: 5,
    category: "SCHEMA",
    title: "5. 💳 Dictionnaire Comptes Bancaires (STTM_CUST_ACCOUNT)",
    short: "STTM_CUST_ACCOUNT",
    badge: "Module ST / AC",
    badgeColor: "#0284c7",
    rawText: "STTM_CUST_ACCOUNT est la table maîtresse hébergeant tous les comptes clients. Clé primaire composite : (BRANCH_CODE, CUST_AC_NO).",
    summaryPoints: [
      "BRANCH_CODE : Code agence de domiciliation (3 caractères).",
      "CUST_AC_NO : Numéro de compte client (20 caractères max).",
      "CCY : Devise du compte (XOF, EUR, USD...).",
      "ACCOUNT_CLASS : Réfère au gabarit produit (STTM_ACCOUNT_CLASS) déterminant les règles tarifaires et d arrêté.",
      "AC_STAT_NO_DR / AC_STAT_NO_CR : Permet de bloquer sélectivement les mouvements au débit ou au crédit sans clôturer le compte."
    ],
    codeSample: "SELECT CUST_AC_NO, CCY, ACY_AVL_BAL, AC_STAT_NO_DR\nFROM STTM_CUST_ACCOUNT\nWHERE CUST_NO = '000123456' AND RECORD_STAT = 'O';"
  },
  {
    id: 6,
    category: "SCHEMA",
    title: "6. 📝 Journal Comptable Journalier (ACTB_DAILY_LOG)",
    short: "ACTB_DAILY_LOG",
    badge: "Module AC",
    badgeColor: "#f59e0b",
    rawText: "ACTB_DAILY_LOG enregistre toutes les écritures comptables générées pendant la journée en cours. C est la table la plus volumineuse et la plus sollicitée en écriture.",
    summaryPoints: [
      "AC_ENTRY_SR_NO : Clé primaire séquentielle alimentée par SEQ_AC_ENTRY_SR_NO.",
      "DRCR_IND : Sens comptable 'D' (Débit) ou 'C' (Crédit).",
      "LCY_AMOUNT : Montant équivalent en devise locale de l agence (pour équilibre de la balance générale).",
      "FCY_AMOUNT : Montant en devise étrangère le cas échéant.",
      "VALUE_DATE vs BOOKING_DATE : Date de valeur financière vs date comptable d enregistrement.",
      "Déversement : Vidée ou archivée lors de l AEOD après réconciliation et mise à jour de GLTB_GL_BALANCES."
    ]
  },
  {
    id: 7,
    category: "SCHEMA",
    title: "7. 🏛️ Grand Livre & Balances Générales (GLTB_GL_BALANCES)",
    short: "GLTB_GL_BALANCES",
    badge: "Module GL",
    badgeColor: "#f59e0b",
    rawText: "GLTB_GL_BALANCES consolide les soldes des comptes généraux de bilan et hors-bilan par agence, devise, exercice comptable et période.",
    summaryPoints: [
      "Clé primaire : (BRANCH_CODE, GL_CODE, CCY_CODE, FIN_YEAR, PERIOD_CODE).",
      "Soldes cumulés : CR_BAL_LCY (total des crédits) et DR_BAL_LCY (total des débits).",
      "Équilibre : À chaque instant, Somme(DR_BAL_LCY) doit égaler Somme(CR_BAL_LCY) pour l ensemble des comptes.",
      "Liaison : Les comptes clients sont agrégés dans le GL via les comptes collectifs définis dans la classe de compte."
    ]
  },
  {
    id: 8,
    category: "PLSQL",
    title: "8. ⚡ Conventions PL/SQL & Gestion des Transactions",
    short: "Conventions PL/SQL",
    badge: "Code Propre",
    badgeColor: "#10b981",
    rawText: "Le développement PL/SQL sous Oracle FLEXCUBE impose des règles strictes pour garantir l intégrité des données, la tenue en charge et la compatibilité avec la chaîne batch.",
    summaryPoints: [
      "Jamais de COMMIT dans les fonctions métier : La transaction est pilotée par la couche d orchestration supérieure ou la Gateway.",
      "Gestion des verrous : Toujours utiliser SELECT ... FOR UPDATE NOWAIT avec gestion de l exception ORA-00054.",
      "Bind Variables obligatoires : Toujours utiliser des variables liées pour éviter l engorgement de la Shared Pool Oracle (ORA-04031).",
      "Gestion des exceptions : Utiliser RAISE_APPLICATION_ERROR avec les plages de codes réservées (-20000 à -20999) ou les messages FCUBS."
    ],
    codeSample: "DECLARE\n  RESOURCE_BUSY EXCEPTION;\n  PRAGMA EXCEPTION_INIT(RESOURCE_BUSY, -54);\nBEGIN\n  SELECT ACY_AVL_BAL INTO l_bal\n  FROM STTM_CUST_ACCOUNT\n  WHERE CUST_AC_NO = p_ac_no FOR UPDATE NOWAIT;\nEXCEPTION\n  WHEN RESOURCE_BUSY THEN\n    p_err_code := 'FCUBS-LOCK-BUSY';\nEND;"
  },
  {
    id: 9,
    category: "PLSQL",
    title: "9. 🔄 Autonomous Transactions & Logs d Audit",
    short: "Autonomous Transactions",
    badge: "Audit & Traces",
    badgeColor: "#10b981",
    rawText: "Pour consigner des traces d audit ou des erreurs techniques sans être impacté par un ROLLBACK de la transaction principale, Oracle offre le pragma AUTONOMOUS_TRANSACTION.",
    summaryPoints: [
      "Isolation complète : La procédure autonome s exécute dans sa propre transaction indépendante.",
      "Commit obligatoire : La routine autonome doit impérativement faire un COMMIT ou un ROLLBACK avant de se terminer.",
      "Usage idéal : Enregistrement des logs d erreurs techniques, traces de sécurité et compteurs d accès.",
      "Piège à éviter : Ne jamais modifier les tables métier principales dans une transaction autonome (risque de deadlock)."
    ],
    codeSample: "PROCEDURE Pr_Log_Error(p_msg VARCHAR2) IS\n  PRAGMA AUTONOMOUS_TRANSACTION;\nBEGIN\n  INSERT INTO CSTB_DEBUG_LOG(LOG_DATE, MSG) VALUES (SYSDATE, p_msg);\n  COMMIT;\nEND Pr_Log_Error;"
  },
  {
    id: 10,
    category: "PLSQL",
    title: "10. 🚀 Optimisation des Traitements de Masse (BULK COLLECT & FORALL)",
    short: "BULK COLLECT / FORALL",
    badge: "Performance Batch",
    badgeColor: "#059669",
    rawText: "Les opérations sur de grands volumes de comptes ou d écritures doivent minimiser les allers-retours entre le moteur PL/SQL et le moteur SQL grâce au bulk processing.",
    summaryPoints: [
      "BULK COLLECT avec LIMIT : Charger les lignes en mémoire par paquets (ex: LIMIT 1000) pour préserver la mémoire PGA.",
      "FORALL : Exécuter des INSERT, UPDATE ou DELETE ensemblistes en un seul appel moteur.",
      "SAVE EXCEPTIONS : Permet de poursuivre le traitement batch même si quelques lignes isolées lèvent une contrainte d intégrité.",
      "Gain de temps : Réduction de 80% du temps d exécution par rapport à une boucle CURSOR FOR classique."
    ],
    codeSample: "OPEN c_accounts;\nLOOP\n  FETCH c_accounts BULK COLLECT INTO l_tab LIMIT 1000;\n  EXIT WHEN l_tab.COUNT = 0;\n  FORALL i IN 1..l_tab.COUNT\n    UPDATE STTM_CUST_ACCOUNT SET ... WHERE CUST_AC_NO = l_tab(i).ac_no;\nEND LOOP;\nCLOSE c_accounts;"
  },
  {
    id: 11,
    category: "AEOD",
    title: "11. ⚙️ Les 5 Phases de la Clôture Nocturne AEOD",
    short: "Phases AEOD",
    badge: "Cœur Batch",
    badgeColor: "#dc2626",
    rawText: "L Automated End of Day (AEOD) est le processus automatisé qui clôture la journée bancaire et initialise la suivante. Il s articule en 5 phases rigoureuses et séquentielles.",
    summaryPoints: [
      "1. PEOD (Pre End of Day) : Contrôles préliminaires, fermeture des caisses et guichets agences.",
      "2. EOTI (End of Transaction Input) : Arrêt des saisies transactionnelles, traitement des flux en suspens.",
      "3. EOFI (End of Financial Input) : Gel des flux financiers, réconciliation comptable Débit/Crédit du jour.",
      "4. EOD (End of Day) : Calcul des intérêts débiteurs/créditeurs, échéanciers de prêts, déversement GL.",
      "5. BOD (Beginning of Day) : Avancement de la date système, initialisation des tables, réouverture des flux."
    ]
  },
  {
    id: 12,
    category: "AEOD",
    title: "12. 🔍 Diagnostic des Blocages de Batch (AETB_PROCESS_PROGRESS)",
    short: "Diagnostic AEOD",
    badge: "Runbook Incident",
    badgeColor: "#dc2626",
    rawText: "En cas d interruption de la clôture nocturne, la table AETB_PROCESS_PROGRESS est le tableau de bord immédiat de l exploitant.",
    summaryPoints: [
      "STATUS = 'F' (Failed) : Indique le programme exact qui a planté et l heure précise de l incident.",
      "ERROR_CODE : Contient le code d erreur SGBD (ORA-...) ou le code fonctionnel FCUBS.",
      "Statut 'W' (Working) figé : Indique un blocage par verrou (deadlock ou lock attente) ou une boucle infinie.",
      "Reprise après incident : Toujours résoudre la cause racine avant de relancer le job pour éviter d aggraver la corruption."
    ],
    codeSample: "SELECT PROCESS_NAME, STAGE, STATUS, ERROR_CODE, START_TIME, END_TIME\nFROM AETB_PROCESS_PROGRESS\nWHERE EOD_DATE = TRUNC(SYSDATE) AND STATUS IN ('F', 'W');"
  },
  {
    id: 13,
    category: "AEOD",
    title: "13. 🕒 Bascule de Date Système (BOD Turnover)",
    short: "BOD Turnover",
    badge: "Transition J+1",
    badgeColor: "#dc2626",
    rawText: "La phase BOD (Beginning of Day) officialise le passage à la nouvelle journée comptable dans la table STTM_BRANCH.",
    summaryPoints: [
      "CURRENT_CYCLE : Incrémenté pour la nouvelle période de traitement.",
      "TODAY : Avancé à la date du prochain jour ouvré selon le calendrier des jours fériés.",
      "PREV_WORKING_DAY : Conserve la date de la journée qui vient d être clôturée.",
      "Purge des tables temporaires : Nettoyage des journaux de travail et réinitialisation des limites quotidiennes."
    ]
  },
  {
    id: 14,
    category: "RUN_INCIDENTS",
    title: "14. 🚨 Diagnostic des Verrous Oracle (ORA-00054 & Locks)",
    short: "Gestion Verrous ORA",
    badge: "Urgence RUN",
    badgeColor: "#e60028",
    rawText: "L erreur ORA-00054 survient lorsqu une requête tente de verrouiller une ressource déjà détenue par une autre session. C est l incident RUN le plus fréquent en production.",
    summaryPoints: [
      "Identifier la session bloquante : Requêter v$locked_object croisée avec v$session et dba_objects.",
      "Vérifier le module et la machine : S agit-il d un utilisateur agence, d un batch ou d une extraction SQL tierce ?",
      "Kill session ciblé : Exécuter ALTER SYSTEM KILL SESSION avec les privilèges DBA appropriés.",
      "Contrôle post-action : S assurer que les transactions en attente se libèrent instantanément."
    ],
    codeSample: "SELECT s.sid, s.serial#, s.username, s.program, o.object_name\nFROM v$session s\nJOIN v$locked_object l ON s.sid = l.session_id\nJOIN dba_objects o ON l.object_id = o.object_id;"
  },
  {
    id: 15,
    category: "RUN_INCIDENTS",
    title: "15. 📜 Traces Debug & Journalisation (FCS_DEBUG)",
    short: "Traces FCS_DEBUG",
    badge: "Investigation",
    badgeColor: "#d97706",
    rawText: "Oracle FLEXCUBE dispose d un mécanisme interne de traçage applicatif fin activable par utilisateur, agence ou module via la procédure DEBUG.PR_DEBUG.",
    summaryPoints: [
      "Activation ciblée : Ne jamais activer le debug globalement en production (impact de 30% sur les temps de réponse).",
      "Niveau de log : Paramétrer pour un utilisateur spécifique dans CSTB_DEBUG_USERS.",
      "Consultation : Les traces sont enregistrées dans CSTB_DEBUG_LOG ou des fichiers plats sur le serveur SGBD (selon configuration).",
      "Désactivation immédiate : Dès la fin de l analyse de l incident, désactiver le traçage pour préserver les I/O disque."
    ],
    codeSample: "-- Activer le debug pour un utilisateur :\nINSERT INTO CSTB_DEBUG_USERS (USER_ID) VALUES ('EXPLOIT01');\nCOMMIT;\n-- Désactiver :\nDELETE FROM CSTB_DEBUG_USERS WHERE USER_ID = 'EXPLOIT01';\nCOMMIT;"
  },
  {
    id: 16,
    category: "RUN_INCIDENTS",
    title: "16. ⚠️ Erreurs SGBD Classiques : ORA-01555 & ORA-01653",
    short: "ORA-01555 & 01653",
    badge: "SGBD Oracle",
    badgeColor: "#d97706",
    rawText: "Deux erreurs d infrastructure Oracle classiques menacent régulièrement la production Core Banking : le manque d espace d annulation (01555) et le manque d espace disque (01653).",
    summaryPoints: [
      "ORA-01555 (Snapshot too old) : La requête s exécute depuis plus longtemps que la rétention des blocs images dans l UNDO Tablespace. Solution : augmenter UNDO_RETENTION et optimiser la requête.",
      "ORA-01653 (Unable to extend table) : Le tablespace de données n a plus d espace libre contigu. Solution : ajouter un datafile ou activer AUTOEXTEND sur les datafiles existants.",
      "Supervision prédictive : Suivre l évolution des segments de tables et de tablespaces chaque matin."
    ]
  },
  {
    id: 17,
    category: "GATEWAY",
    title: "17. 🔄 Architecture de la Passerelle Gateway (GW)",
    short: "Architecture Gateway",
    badge: "Intégration",
    badgeColor: "#0284c7",
    rawText: "La Gateway Oracle FLEXCUBE est la porte d entrée sécurisée de tous les systèmes périphériques (Switch Monétique, E-Banking, Agences distantes, Partenaires).",
    summaryPoints: [
      "Protocoles supportés : Services Web SOAP/XML, API REST JSON, Files de messages JMS et appels EJB directs.",
      "Mode Synchrone vs Asynchrone : Les transactions monétiques GAB/TPE utilisent le mode synchrone à haute réactivité (< 1s) ; les virements de masse utilisent le mode asynchrone.",
      "Table de paramétrage : GWTM_GATEWAY_PARAM définit les règles d authentification, les droits d accès aux services et les quotas.",
      "Audit des échanges : GWTB_IN_LOG et GWTB_OUT_LOG enregistrent les requêtes entrantes, réponses et temps de traitement."
    ]
  },
  {
    id: 18,
    category: "GATEWAY",
    title: "18. 💳 Intégration Monétique Switch ↔ FLEXCUBE",
    short: "Interface Monétique",
    badge: "Monétique Core",
    badgeColor: "#7d1538",
    rawText: "L échange entre un Switch Monétique (Payway / Powercard) et Oracle FLEXCUBE s effectue par transformation de trames ISO 8583 en appels de services Gateway.",
    summaryPoints: [
      "Autorisation en ligne (0100/0200) : Vérification du solde disponible dans STTM_CUST_ACCOUNT et pose d un montant bloqué (Hold).",
      "Temps de réponse exigé : SLA strict < 800ms pour éviter les timeouts sur le terminal GAB/TPE.",
      "Annulation (0400/0420) : Libération immédiate de la provision bloquée en cas de transaction abandonnée.",
      "Compensation nocturne : Déversement des fichiers de clearing pour imputation comptable définitive (débit du compte client, crédit des comptes de clearing interbancaire)."
    ]
  },
  {
    id: 19,
    category: "GATEWAY",
    title: "19. 🛡️ Gestion du Stand-In Monétique & Déconnexion",
    short: "Stand-In & Déconnexion",
    badge: "Haute Dispo",
    badgeColor: "#7d1538",
    rawText: "Lorsque le Core Banking FLEXCUBE est indisponible (ex: phase de gel EOD ou maintenance DBA), le Switch Monétique bascule en mode Stand-In (autorisation autonome sur plafonds locaux).",
    summaryPoints: [
      "Seuils Stand-In : Le switch autorise les retraits dans la limite de montants sécurisés paramétrés par type de carte.",
      "Stockage des flux : Toutes les transactions validées en Stand-In sont empilées dans un journal SAF (Store and Forward).",
      "Rejeu automatique : Dès la fin de la phase BOD de FLEXCUBE, le Switch rejoue les écritures différées via la Gateway.",
      "Réconciliation : Comparaison des soldes réels pour détecter les éventuels dépassements de solde survenus pendant l isolement."
    ]
  },
  {
    id: 20,
    category: "SCHEMA",
    title: "20. 📑 Bonnes Pratiques d Indexation & Partitionnement",
    short: "Index & Partitionnement",
    badge: "Performance SGBD",
    badgeColor: "#059669",
    rawText: "Dans une banque à fort volume (millions de comptes et de transactions), le bon partitionnement des tables et le ciblage des index conditionnent la stabilité du Core Banking.",
    summaryPoints: [
      "Partitionnement par Date : Partitionner ACTB_DAILY_LOG et les tables d historique par mois ou par trimestre sur VALUE_DATE.",
      "Index locaux vs globaux : Préférer les index partitionnés locaux pour faciliter la purge et les archivages sans verrouiller toute la table.",
      "Index composites : Toujours ordonner les colonnes de l index de la plus sélective à la moins sélective.",
      "Statistiques Oracle : Planifier un GATHER_TABLE_STATS hebdomadaire après les gros traitements de clôture pour maintenir l optimiseur CBO au plus haut niveau."
    ],
    codeSample: "EXEC DBMS_STATS.GATHER_TABLE_STATS('FCC', 'ACTB_DAILY_LOG', estimate_percent => DBMS_STATS.AUTO_SAMPLE_SIZE, cascade => TRUE);"
  }
];
