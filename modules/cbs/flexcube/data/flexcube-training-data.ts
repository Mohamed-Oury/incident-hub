// modules/cbs/flexcube/data/flexcube-training-data.ts
import { FlexcubeGrade, FlexcubeLesson, FlexcubeExamQuestion } from "../types";

export const FLEXCUBE_GRADES: FlexcubeGrade[] = [
  {
    level: 1,
    gradeCode: "APPRENTI",
    name: "Niveau 1 : Fondamentaux Core Banking & Navigation FCUBS",
    badge: "🟢 Apprenti FLEXCUBE",
    color: "#10b981",
    minPassScorePct: 80,
    objective: "Comprendre les principes d un Core Banking universel, la structure multicompte/multidevise, la navigation dans les écrans ODT et les données statiques (Clients CIF, Agences, Devises).",
    recommendedResources: [
      {
        title: "Oracle FLEXCUBE Universal Banking - Core User Guide",
        type: "ORACLE_DOC",
        reference: "FCUBS-DOC-CORE-UG-14",
        description: "Manuel officiel utilisateur décrivant l ergonomie générale, les fonctions de recherche, la saisie et les cycles d autorisation (Maker-Checker)."
      },
      {
        title: "Manuel de Paramétrage des Données Statiques (Module ST)",
        type: "ORACLE_DOC",
        reference: "FCUBS-DOC-ST-PARAM-14",
        description: "Guide exhaustif des tables de base : clients (STDCIF), agences (STDBRANCH), devises (CYDCURR) et classes de comptes."
      },
      {
        title: "Principes Comptables Bancaires & Cycles de Vie de Compte",
        type: "BEST_PRACTICE",
        reference: "BANKING-AC-FUNDAMENTALS",
        description: "Fondements du plan comptable bancaire, distinction entre date de valeur et date d opération, et gestion des soldes disponibles."
      }
    ]
  },
  {
    level: 2,
    gradeCode: "OPERATEUR_AEOD",
    name: "Niveau 2 : Exploitation RUN & Pilote de Clôture AEOD",
    badge: "🔵 Opérateur RUN AEOD",
    color: "#3b82f6",
    minPassScorePct: 80,
    objective: "Maîtriser le déroulement de la chaîne de clôture journalière nocturne (AEOD/BOD), la surveillance des batchs dans AETB_PROCESS_PROGRESS et la résolution d urgence des blocages récurrents (verrous, contrats non autorisés).",
    recommendedResources: [
      {
        title: "Guide d Exploitation & d Administration AEOD / Batch",
        type: "AEOD_RUNBOOK",
        reference: "FCUBS-DOC-AEOD-ADMIN-14",
        description: "Spécification détaillée des 5 phases (PEOD, EOTI, EOFI, EOD, BOD), des tables de pilotage et des codes de statut batch."
      },
      {
        title: "Runbook Incident RUN : Verrous Oracle & Concurrence (ORA-00054)",
        type: "BEST_PRACTICE",
        reference: "RUNBOOK-ORACLE-LOCK-MGMT",
        description: "Méthodologie d identification des sessions bloquantes dans v$session et v$locked_object avec procédures de purge sécurisées."
      },
      {
        title: "Procédures de Secours & Reprise après Incident Batch",
        type: "AEOD_RUNBOOK",
        reference: "AEOD-DISASTER-RECOVERY-SOP",
        description: "Arbre de décision pour la relance des programmes en échec, contournement d erreur et basculement d urgence."
      }
    ]
  },
  {
    level: 3,
    gradeCode: "DEVELOPPEUR_PLSQL",
    name: "Niveau 3 : Développement PL/SQL & Extensibilité ODT/RAD",
    badge: "🟣 Développeur PL/SQL FCUBS",
    color: "#8b5cf6",
    minPassScorePct: 80,
    objective: "Concevoir des développements spécifiques conformes aux standards Oracle FLEXCUBE : utilisation de l Open Development Tool (ODT), séparation des couches Kernel/Custom, écriture de triggers et packages personnalisés sans régression.",
    recommendedResources: [
      {
        title: "Oracle FLEXCUBE Development Workbench / ODT Guide",
        type: "GUIDE_ODT",
        reference: "FCUBS-ODT-DEV-WORKBENCH-14",
        description: "Guide pas à pas de modélisation d écrans (RADXML), génération de code DDL/PLSQL et intégration de fonctions personnalisées."
      },
      {
        title: "Guide d Architecture d Extensibilité & Packages Custom",
        type: "ORACLE_DOC",
        reference: "FCUBS-EXTENSIBILITY-REF-14",
        description: "Patterns officiels pour les packages _CUSTOM, hooks de pré/post-validation (Fn_Pre_Check, Fn_Post_Check) et gestion des exceptions."
      },
      {
        title: "Guide de Performance PL/SQL Avancé (Bulk Collect, Autonomous)",
        type: "BEST_PRACTICE",
        reference: "ORACLE-PLSQL-HIGH-PERF",
        description: "Optimisation des requêtes par paquets, réduction des commutations de contexte et gestion propre des transactions autonomes."
      }
    ]
  },
  {
    level: 4,
    gradeCode: "EXPERT_PRODUITS",
    name: "Niveau 4 : Expert Paramétrage Produits & Comptabilité AC/GL",
    badge: "🟠 Expert Métier AC/GL",
    color: "#f59e0b",
    minPassScorePct: 80,
    objective: "Paramétrer et auditer les modules financiers avancés : plan comptable général GL, schémas de comptabilisation des mouvements AC, moteurs de prêts amortissables CL, virements interbancaires FT et crédits documentaires LC.",
    recommendedResources: [
      {
        title: "Manuel de Paramétrage Comptable & Moteur d Écritures (Accounting)",
        type: "ORACLE_DOC",
        reference: "FCUBS-DOC-AC-GL-SPEC-14",
        description: "Structure du Grand Livre, gestion des devises locales/étrangères, balances consolidées et schémas d écritures par type de produit."
      },
      {
        title: "Guide Métier Consumer Lending (CL) & Échéanciers de Crédits",
        type: "ORACLE_DOC",
        reference: "FCUBS-DOC-CL-LENDING-14",
        description: "Formules d amortissement financier, calculs d intérêts dégressifs/constants, pénalités de retard et traitement des impayés."
      },
      {
        title: "Spécification des Flux de Paiements & Virements Internationaux (FT)",
        type: "ORACLE_DOC",
        reference: "FCUBS-DOC-FT-PAYMENTS-14",
        description: "Paramétrage des comptes Nostro/Loro, conversion de change automatique et intégration des messages SWIFT MT103 / ISO 20022."
      }
    ]
  },
  {
    level: 5,
    gradeCode: "ARCHITECTE_CORE",
    name: "Niveau 5 : Architecte Core Banking & Intégration Gateway/Switch",
    badge: "🔴 Architecte Core Banking",
    color: "#7d1538",
    minPassScorePct: 80,
    objective: "Superviser l architecture globale multi-systèmes : connectivité Gateway (EJB/JMS/REST), intégration temps réel avec le switch monétique (Payway / Powercard / ISO 8583), haute disponibilité Oracle RAC et réconciliation comptable de masse.",
    recommendedResources: [
      {
        title: "Oracle FLEXCUBE Gateway Architecture & Integration Guide",
        type: "ORACLE_DOC",
        reference: "FCUBS-DOC-GATEWAY-ARCH-14",
        description: "Spécification technique des connecteurs entrants/sortants, architecture des queues JMS, sécurité et SLAs de réponse en ligne."
      },
      {
        title: "Guide d Intégration Switch Monétique ↔ Core Banking en Temps Réel",
        type: "BEST_PRACTICE",
        reference: "SWITCH-FCUBS-ONLINE-INTEGRATION",
        description: "Patterns d échange pour l autorisation instantanée (0100/0200), gestion des holds de provision, reversals (0400/0420) et clearing de fin de journée."
      },
      {
        title: "Livre Blanc Haute Disponibilité Oracle RAC & Disaster Recovery",
        type: "BEST_PRACTICE",
        reference: "ORACLE-RAC-FCUBS-MAX-AVAIL",
        description: "Architecture de résilience sans perte de données (RPO=0, RTO<15min) avec Active Data Guard et reprise transparente après sinistre."
      }
    ]
  }
];

export const FLEXCUBE_LESSONS: FlexcubeLesson[] = [
  // --- GRADE 1 ---
  {
    id: "FCUBS-LES-01",
    gradeLevel: 1,
    title: "Introduction à Oracle FLEXCUBE & Architecture Fonctionnelle",
    durationMinutes: 30,
    module: "ST",
    overview: "Présentation des concepts fondateurs de FLEXCUBE : architecture modulaire, centralisation des données de tiers, multidevise native et séparation agences.",
    keyTakeaways: [
      "FLEXCUBE est un Core Banking System universel couvrant la banque de détail, la banque d entreprise et les opérations de marché.",
      "Chaque opération est enregistrée avec sa devise d origine (ACY) et convertie en devise locale de l agence (LCY).",
      "Le principe de Maker-Checker (double validation) est appliqué par défaut à toutes les créations et modifications sensibles."
    ],
    contentMarkdown: "Oracle FLEXCUBE est structuré autour d un référentiel unique garantissant l unicité du client et la cohérence des écritures comptables..."
  },
  {
    id: "FCUBS-LES-02",
    gradeLevel: 1,
    title: "Le Référentiel Client CIF & Cycle de Vie du Compte Bancaire",
    durationMinutes: 35,
    module: "ST",
    overview: "Étude détaillée des tables STTM_CUSTOMER et STTM_CUST_ACCOUNT : création d un tiers, contrôles KYC, ouverture de compte et restrictions opérationnelles.",
    keyTakeaways: [
      "Le numéro CIF (Customer Information File) dans STTM_CUSTOMER identifie de façon unique le client dans toutes les agences.",
      "Un compte dans STTM_CUST_ACCOUNT est toujours identifié par le couple (BRANCH_CODE, CUST_AC_NO).",
      "Les drapeaux AC_STAT_NO_DR et AC_STAT_NO_CR permettent de bloquer sélectivement les débits ou les crédits sans clôturer le compte."
    ],
    contentMarkdown: "La création d un compte bancaire sous FLEXCUBE hérite des caractéristiques définies dans la classe de compte (STTM_ACCOUNT_CLASS)..."
  },
  {
    id: "FCUBS-LES-03",
    gradeLevel: 1,
    title: "Principes Comptables : Date de Valeur, Date Système & Soldes",
    durationMinutes: 30,
    module: "AC",
    overview: "Comprendre la distinction fondamentale entre date comptable (Booking Date) et date de valeur financière (Value Date), et le calcul des soldes disponibles.",
    keyTakeaways: [
      "La Booking Date est la date officielle de la journée système de la banque lors de la saisie de l écriture.",
      "La Value Date est la date à partir de laquelle les intérêts commencent à courir (antidatage ou postdatage possible).",
      "Le solde disponible réel est calculé comme : Solde Comptable - Montants Bloqués (Holds) - Montants Débit en suspens."
    ],
    contentMarkdown: "Dans le moteur comptable AC, chaque mouvement donne lieu à deux lignes ou plus dans ACTB_DAILY_LOG..."
  },

  // --- GRADE 2 ---
  {
    id: "FCUBS-LES-04",
    gradeLevel: 2,
    title: "Architecture & Séquencement de la Clôture Journalière AEOD",
    durationMinutes: 40,
    module: "AEOD",
    overview: "Analyse approfondie des 5 phases de l Automated End of Day (PEOD, EOTI, EOFI, EOD, BOD) et du rôle de l ordonnanceur EOTB_PROGRAM_MASTER.",
    keyTakeaways: [
      "La phase PEOD valide la fermeture de tous les guichets et caisses de l agence.",
      "La phase EOTI fige les saisies manuelles et traite les derniers flux en attente.",
      "La phase EOFI arrête définitivement les flux financiers et valide l équilibre Débit = Crédit de la journée.",
      "La phase EOD calcule les intérêts et déverse les soldes dans le Grand Livre.",
      "La phase BOD avance la date système à J+1 et réinitialise les services."
    ],
    contentMarkdown: "L AEOD orchestre l ensemble des batchs de fin de journée de manière séquentielle et dépendante..."
  },
  {
    id: "FCUBS-LES-05",
    gradeLevel: 2,
    title: "Supervision du Batch & Diagnostic d Urgence dans AETB_PROCESS_PROGRESS",
    durationMinutes: 35,
    module: "AEOD",
    overview: "Techniques de pilotage en direct de la chaîne nocturne, lecture des statuts d exécution et protocole d alerte en cas d échec.",
    keyTakeaways: [
      "Le statut 'F' (Failed) déclenche une interruption immédiate de la chaîne batch dépendante.",
      "Le statut 'W' (Working) qui persiste anormalement indique un blocage par verrou ou une contention de ressources.",
      "Toujours inspecter le code d erreur associé et les traces du processus avant toute décision de reprise."
    ],
    contentMarkdown: "La table AETB_PROCESS_PROGRESS contient l historique en temps réel de chaque programme exécuté..."
  },
  {
    id: "FCUBS-LES-06",
    gradeLevel: 2,
    title: "Gestion des Verrous Oracle & Résolution de l Incident ORA-00054",
    durationMinutes: 35,
    module: "AEOD",
    overview: "Identification des verrous concurrents sur la base Oracle bloquant la clôture et méthodologie sécurisée de déblocage.",
    keyTakeaways: [
      "L erreur ORA-00054 se produit lorsqu une ressource verrouillée en mode exclusif est requise par le batch.",
      "Croiser v$session et v$locked_object permet de repérer instantanément la session responsable.",
      "L interruption d une session via ALTER SYSTEM KILL SESSION doit respecter les règles de gouvernance bancaire."
    ],
    contentMarkdown: "En environnement de production, les verrous intempestifs sur ACTB_DAILY_LOG sont la cause première des blocages nocturnes..."
  },

  // --- GRADE 3 ---
  {
    id: "FCUBS-LES-07",
    gradeLevel: 3,
    title: "L Atelier ODT / RAD Workbench & Modélisation d Écrans",
    durationMinutes: 45,
    module: "ST",
    overview: "Prise en main de l Open Development Tool (ODT) pour créer un nouvel écran de maintenance ou une fonction bancaire sur-mesure.",
    keyTakeaways: [
      "ODT génère la structure XML de l écran (RADXML) et les squelettes de packages associés.",
      "Définition des Data Blocks, des éléments de formulaires, des tables sous-jacentes et des listes de valeurs (LOV).",
      "Production des fichiers d installation nécessaires à l intégration dans la console WebLogic."
    ],
    contentMarkdown: "L utilisation d ODT garantit que les métadonnées de l écran sont enregistrées dans le dictionnaire central de FLEXCUBE..."
  },
  {
    id: "FCUBS-LES-08",
    gradeLevel: 3,
    title: "Conception des Packages Custom : Séparation Kernel vs Custom",
    durationMinutes: 45,
    module: "ST",
    overview: "Règles d architecture pour enrichir le Core Banking sans modifier les packages natifs fournis par Oracle.",
    keyTakeaways: [
      "Les packages _KERNEL ne doivent JAMAIS être modifiés par la banque sous peine de perdre le support Oracle.",
      "Toute personnalisation est implémentée dans les packages _CUSTOM via les hooks prévus par le framework.",
      "Les fonctions Fn_Pre_Check et Fn_Post_Check permettent de valider les règles métier propres à l institution."
    ],
    contentMarkdown: "Le framework d extensibilité de FLEXCUBE appelle systématiquement le package Custom à chaque étape du cycle de vie..."
  },
  {
    id: "FCUBS-LES-09",
    gradeLevel: 3,
    title: "Programmation PL/SQL Haute Performance pour les Traitements Batch",
    durationMinutes: 40,
    module: "AC",
    overview: "Techniques avancées d écriture PL/SQL pour manipuler des millions d enregistrements sans impacter les temps de réponse.",
    keyTakeaways: [
      "Utilisation de BULK COLLECT avec clause LIMIT pour contrôler la consommation de mémoire PGA.",
      "Emploi de l instruction FORALL pour les opérations DML groupées.",
      "Gestion rigoureuse des curseurs et fermeture systématique des ressources pour éviter les fuites mémoire."
    ],
    contentMarkdown: "Le passage à un traitement ensembliste avec BULK COLLECT permet de diviser le temps de traitement batch par 5 à 10..."
  },

  // --- GRADE 4 ---
  {
    id: "FCUBS-LES-10",
    gradeLevel: 4,
    title: "Architecture Comptable & Moteur d Écritures (ACTB_DAILY_LOG & GL)",
    durationMinutes: 45,
    module: "AC",
    overview: "Comprendre le cheminement d une écriture comptable de son émission à son déversement définitif dans le Grand Livre.",
    keyTakeaways: [
      "Chaque événement bancaire déclenche un schéma d écritures paramétré (Accounting Role).",
      "Vérification temps réel de l équilibre des débits et des crédits en devise locale agence (LCY).",
      "Le déversement dans GLTB_GL_BALANCES met à jour les comptes de bilan et de compte de résultat."
    ],
    contentMarkdown: "Le moteur comptable de FLEXCUBE garantit l intégrité stricte de la comptabilité en partie double..."
  },
  {
    id: "FCUBS-LES-11",
    gradeLevel: 4,
    title: "Module Consumer Lending (CL) : Gestion des Prêts & Échéanciers",
    durationMinutes: 40,
    module: "CL",
    overview: "Paramétrage des produits de crédit, calcul des tableaux d amortissement et traitement des recouvrements automatiques.",
    keyTakeaways: [
      "Les prêts sont modélisés dans CLTB_ACCOUNT_MASTER avec leurs barèmes de taux d intérêts.",
      "CLTB_ACCOUNT_SCHEDULES contient le détail de chaque échéance future (capital, intérêts, taxes).",
      "Le batch de nuit prélève automatiquement les mensualités sur le compte courant de l emprunteur."
    ],
    contentMarkdown: "Le module CL intègre la gestion des découverts, des prêts personnels et des crédits immobiliers..."
  },
  {
    id: "FCUBS-LES-12",
    gradeLevel: 4,
    title: "Virements & Transferts de Fonds (Module FT & Normes SWIFT / ISO 20022)",
    durationMinutes: 40,
    module: "FT",
    overview: "Cycle de vie d un contrat de virement national et international, génération des messages d échange interbancaires.",
    keyTakeaways: [
      "Un contrat de virement dans FTTB_CONTRACT_MASTER passe par les statuts Saisie, Validation, Imputation.",
      "Génération automatique des messages SWIFT (MT103 pour les clients, MT202 pour les banques) ou des messages ISO 20022 PACS.008.",
      "Contrôle systématique de provision et blocage des fonds avant confirmation du transfert extérieur."
    ],
    contentMarkdown: "Le module FT gère l acheminement des paiements avec calcul des frais et commissions associés..."
  },

  // --- GRADE 5 ---
  {
    id: "FCUBS-LES-13",
    gradeLevel: 5,
    title: "Passerelle Gateway FLEXCUBE : Architecture & Protocoles",
    durationMinutes: 45,
    module: "GW",
    overview: "Conception et administration de la passerelle Gateway pour interconnecter les canaux digitaux et les automates externes.",
    keyTakeaways: [
      "La Gateway expose des services web SOAP, des API REST et des files de messages JMS pour l intégration d entreprise.",
      "Elle gère la transformation des formats de messages, l authentification sécurisée et le contrôle des quotas.",
      "Les tables GWTB_IN_LOG et GWTB_OUT_LOG enregistrent toutes les transactions pour audit et traçabilité."
    ],
    contentMarkdown: "La Gateway est le composant central d interopérabilité de FLEXCUBE avec le reste du système d information bancaire..."
  },
  {
    id: "FCUBS-LES-14",
    gradeLevel: 5,
    title: "Intégration Temps Réel Switch Monétique ↔ FLEXCUBE & Stand-In",
    durationMinutes: 50,
    module: "GW",
    overview: "Raccordement d un Switch Monétique (Payway / Powercard) à FLEXCUBE pour l autorisation en ligne et la gestion de la compensation.",
    keyTakeaways: [
      "Conversion des messages ISO 8583 (0100/0200) en requêtes de réservation de solde (Hold) en moins de 800ms.",
      "En cas d indisponibilité de FLEXCUBE (clôture EOD), le switch bascule en mode Stand-In sécurisé.",
      "Réconciliation journalière et déversement des fichiers de compensation pour imputation comptable définitive."
    ],
    contentMarkdown: "L intégration monétique requiert un respect rigoureux des SLAs temps de réponse pour éviter l abandon des transactions aux distributeurs..."
  },
  {
    id: "FCUBS-LES-15",
    gradeLevel: 5,
    title: "Haute Disponibilité Oracle RAC, Partitionnement & Disaster Recovery",
    durationMinutes: 45,
    module: "AC",
    overview: "Stratégies d infrastructure et de dimensionnement pour garantir la continuité d activité du Core Banking 24h/24 et 7j/7.",
    keyTakeaways: [
      "Déploiement en cluster Oracle Real Application Clusters (RAC) pour assurer la redondance active des nœuds SGBD.",
      "Partitionnement mensuel des tables d écritures pour optimiser les performances de requêtes et faciliter l archivage.",
      "Mise en place d une base de secours Oracle Active Data Guard pour une bascule rapide en cas de sinistre."
    ],
    contentMarkdown: "La haute disponibilité du Core Banking repose sur l élimination de tout point unique de défaillance (SPOF) à tous les niveaux de l architecture..."
  }
];

export const FLEXCUBE_EXAMS: FlexcubeExamQuestion[] = [
  {
    "id": "FCUBS-Q-001",
    "gradeLevel": 1,
    "module": "ST",
    "question": "Dans Oracle FLEXCUBE, quelle table constitue le référentiel central de tous les tiers et clients de la banque ?",
    "options": [
      "STTM_CUSTOMER",
      "STTM_CUST_ACCOUNT",
      "ACTB_DAILY_LOG",
      "GLTB_GL_BALANCES"
    ],
    "correctIndex": 0,
    "explanation": "STTM_CUSTOMER est la table CIF maîtresse hébergeant l identifiant unique CUSTOMER_NO et les données légales du client.",
    "referenceDoc": "FCUBS-DOC-CORE-UG-14"
  },
  {
    "id": "FCUBS-Q-002",
    "gradeLevel": 1,
    "module": "ST",
    "question": "Quel couple de colonnes compose la clé primaire de la table des comptes clients STTM_CUST_ACCOUNT ?",
    "options": [
      "(CUSTOMER_NO, CCY)",
      "(BRANCH_CODE, CUST_AC_NO)",
      "(ACCOUNT_CLASS, CUST_AC_NO)",
      "(BRANCH_CODE, CCY)"
    ],
    "correctIndex": 1,
    "explanation": "Un compte client est identifié de manière unique par son agence de rattachement (BRANCH_CODE) et son numéro de compte (CUST_AC_NO).",
    "referenceDoc": "FCUBS-DOC-ST-PARAM-14"
  },
  {
    "id": "FCUBS-Q-003",
    "gradeLevel": 1,
    "module": "ST",
    "question": "Quelle est la différence fondamentale entre la Booking Date et la Value Date sous FLEXCUBE ?",
    "options": [
      "La Booking Date est la date de clôture, la Value Date est la date de naissance du client",
      "La Booking Date est la date comptable système du jour d enregistrement, la Value Date est la date financière de calcul des intérêts",
      "Ce sont deux champs strictement identiques dans toutes les tables",
      "La Value Date est réservée aux opérations de change exclusivement"
    ],
    "correctIndex": 1,
    "explanation": "La Booking Date reflète la date système lors de la passation de l écriture, alors que la Value Date détermine la prise en compte financière des intérêts.",
    "referenceDoc": "BANKING-AC-FUNDAMENTALS"
  },
  {
    "id": "FCUBS-Q-004",
    "gradeLevel": 1,
    "module": "ST",
    "question": "Que signifie le statut AUTH_STAT = 'U' sur un contrat ou une fiche client ?",
    "options": [
      "Le contrat est verrouillé définitivement (Unlocked)",
      "Le contrat est en attente de validation / autorisation (Unauthorized)",
      "Le contrat a été annulé par un superviseur",
      "Le compte est sous séquestre judiciaire"
    ],
    "correctIndex": 1,
    "explanation": "Dans le workflow Maker-Checker de FLEXCUBE, 'U' signifie Unauthorized (en attente d approbation par un Checker).",
    "referenceDoc": "FCUBS-DOC-CORE-UG-14"
  },
  {
    "id": "FCUBS-Q-005",
    "gradeLevel": 1,
    "module": "ST",
    "question": "Quel drapeau dans STTM_CUST_ACCOUNT permet d interdire les retraits et débits sans clôturer le compte ?",
    "options": [
      "RECORD_STAT = 'C'",
      "AC_STAT_NO_DR = 'Y'",
      "FROZEN_ALL = '1'",
      "AUTH_STAT = 'R'"
    ],
    "correctIndex": 1,
    "explanation": "AC_STAT_NO_DR = 'Y' bloque tous les débits sur le compte tout en autorisant les encaissements ou virements entrants.",
    "referenceDoc": "FCUBS-DOC-ST-PARAM-14"
  },
  {
    "id": "FCUBS-Q-006",
    "gradeLevel": 1,
    "module": "ST",
    "question": "Dans quel module FLEXCUBE sont paramétrées les tables de taux de change (CYTM_RATES) et devises ?",
    "options": [
      "Module CL (Crédits)",
      "Module FT (Virements)",
      "Module ST (Static Maintenance)",
      "Module DE (Caisses)"
    ],
    "correctIndex": 2,
    "explanation": "Le module ST (Static Maintenance) gère l ensemble des tables de base : devises, agences, clients et classes de comptes.",
    "referenceDoc": "FCUBS-DOC-ST-PARAM-14"
  },
  {
    "id": "FCUBS-Q-007",
    "gradeLevel": 1,
    "module": "ST",
    "question": "Quel type de client correspond au code CUSTOMER_TYPE = 'C' dans STTM_CUSTOMER ?",
    "options": [
      "Client Particulier Individuel",
      "Client Entreprise / Personne Morale (Corporate)",
      "Banque Centrale exclusivement",
      "Client Comptant sans dossier"
    ],
    "correctIndex": 1,
    "explanation": "'I' correspond à Individu (Particulier), 'C' à Corporate (Entreprise) et 'B' à Banque / Correspondant.",
    "referenceDoc": "FCUBS-DOC-CORE-UG-14"
  },
  {
    "id": "FCUBS-Q-008",
    "gradeLevel": 1,
    "module": "ST",
    "question": "Quelle table héberge les gabarits de produits comptes (règles de solde minimum, fréquences de relevés) ?",
    "options": [
      "STTM_ACCOUNT_CLASS",
      "STTM_PROD_MASTER",
      "ACTB_CLASS_RULES",
      "GLTM_ACC_TEMPLATE"
    ],
    "correctIndex": 0,
    "explanation": "STTM_ACCOUNT_CLASS définit les caractéristiques héritées par les comptes clients rattachés à cette classe de produit.",
    "referenceDoc": "FCUBS-DOC-ST-PARAM-14"
  },
  {
    "id": "FCUBS-Q-009",
    "gradeLevel": 1,
    "module": "ST",
    "question": "Comment est calculé le solde disponible d un compte client sous FLEXCUBE ?",
    "options": [
      "Solde Comptable seul",
      "Solde Comptable - Montants Bloqués (Holds) - Engagements débit",
      "Solde Comptable + Agios à venir",
      "Somme des opérations du mois courant"
    ],
    "correctIndex": 1,
    "explanation": "Le solde disponible déduit du solde comptable les blocages administratifs ou pré-autorisations monétiques en cours.",
    "referenceDoc": "BANKING-AC-FUNDAMENTALS"
  },
  {
    "id": "FCUBS-Q-010",
    "gradeLevel": 1,
    "module": "ST",
    "question": "Quel est l effet du drapeau FROZEN = 'Y' positionné au niveau de la table client STTM_CUSTOMER ?",
    "options": [
      "Seul le compte principal est gelé",
      "Tous les comptes ouverts sous ce numéro client sont immédiatement gelés au débit",
      "L agence du client est fermée",
      "Le client ne peut plus recevoir de virements entrants"
    ],
    "correctIndex": 1,
    "explanation": "Le gel au niveau CIF (STTM_CUSTOMER) se propage automatiquement à l ensemble des comptes rattachés à ce tiers.",
    "referenceDoc": "FCUBS-DOC-ST-PARAM-14"
  },
  {
    "id": "FCUBS-Q-011",
    "gradeLevel": 1,
    "module": "ST",
    "question": "Dans quel écran utilisateur FLEXCUBE s effectue la saisie complète d un nouveau dossier client Particulier ?",
    "options": [
      "STDCIF",
      "STDACCLS",
      "ACDENTRY",
      "FTDTRN"
    ],
    "correctIndex": 0,
    "explanation": "L écran fonctionnel STDCIF (Customer Information Maintenance) est l écran standard de création et modification des tiers.",
    "referenceDoc": "FCUBS-DOC-CORE-UG-14"
  },
  {
    "id": "FCUBS-Q-012",
    "gradeLevel": 1,
    "module": "ST",
    "question": "Que représente la colonne BRANCH_LCY dans la table de paramétrage d agence STTM_BRANCH ?",
    "options": [
      "Le code de la banque centrale",
      "La devise locale légale utilisée par l agence pour sa comptabilité",
      "Le plafond de retrait de l agence",
      "Le numéro de compte de caisse central"
    ],
    "correctIndex": 1,
    "explanation": "BRANCH_LCY définit la Local Currency de l agence, devise de référence pour l équilibre de sa balance comptable.",
    "referenceDoc": "FCUBS-DOC-ST-PARAM-14"
  },
  {
    "id": "FCUBS-Q-013",
    "gradeLevel": 1,
    "module": "ST",
    "question": "Quel statut prend un enregistrement qui a été officiellement clôturé dans FLEXCUBE ?",
    "options": [
      "RECORD_STAT = 'C'",
      "RECORD_STAT = 'D'",
      "AUTH_STAT = 'C'",
      "STATUS = 'VOID'"
    ],
    "correctIndex": 0,
    "explanation": "Dans le standard Oracle FCUBS, RECORD_STAT vaut 'O' (Open) pour un élément actif et 'C' (Closed) après clôture.",
    "referenceDoc": "FCUBS-DOC-CORE-UG-14"
  },
  {
    "id": "FCUBS-Q-014",
    "gradeLevel": 1,
    "module": "ST",
    "question": "Pourquoi une banque utilise-t-elle le principe du double regard (Maker-Checker) dans un Core Banking ?",
    "options": [
      "Pour accélérer le temps de saisie des opérations",
      "Pour réduire les risques de fraude et d erreurs matérielles de saisie",
      "Pour éviter l utilisation de mots de passe",
      "Pour contourner les contraintes d intégrité de la base de données"
    ],
    "correctIndex": 1,
    "explanation": "La séparation des rôles entre l opérateur de saisie (Maker) et le validateur habilité (Checker) est une exigence réglementaire bancaire.",
    "referenceDoc": "BANKING-AC-FUNDAMENTALS"
  },
  {
    "id": "FCUBS-Q-015",
    "gradeLevel": 1,
    "module": "ST",
    "question": "Quelle table enregistre les taux de change entre deux devises et leur date d application ?",
    "options": [
      "CYTM_RATES",
      "STTM_EXCHANGE",
      "FXTM_RATE_BOARD",
      "ACTB_CURR_CONV"
    ],
    "correctIndex": 0,
    "explanation": "CYTM_RATES maintient les cours de change acheteur, vendeur et moyen (Mid Rate) utilisés par le moteur FX de FLEXCUBE.",
    "referenceDoc": "FCUBS-DOC-ST-PARAM-14"
  },
  {
    "id": "FCUBS-Q-016",
    "gradeLevel": 2,
    "module": "AEOD",
    "question": "Dans quel ordre séquentiel se déroulent les 5 phases officielles de la chaîne de clôture nocturne AEOD ?",
    "options": [
      "EOD -> BOD -> EOTI -> EOFI -> PEOD",
      "PEOD -> EOTI -> EOFI -> EOD -> BOD",
      "BOD -> PEOD -> EOFI -> EOTI -> EOD",
      "EOFI -> EOTI -> PEOD -> BOD -> EOD"
    ],
    "correctIndex": 1,
    "explanation": "L ordre strict est : Pre-EOD (PEOD), End of Transaction Input (EOTI), End of Financial Input (EOFI), End of Day (EOD), Beginning of Day (BOD).",
    "referenceDoc": "FCUBS-DOC-AEOD-ADMIN-14"
  },
  {
    "id": "FCUBS-Q-017",
    "gradeLevel": 2,
    "module": "AEOD",
    "question": "Que se passe-t-il spécifiquement lors de la phase EOTI (End of Transaction Input) de l AEOD ?",
    "options": [
      "Les guichets physiques ouvrent pour les clients",
      "Le système bascule en lecture seule et refuse toute nouvelle saisie de transaction utilisateur",
      "La date système de la banque avance à J+1 immédiatement",
      "Tous les comptes inactifs sont automatiquement clôturés"
    ],
    "correctIndex": 1,
    "explanation": "La phase EOTI marque l arrêt formel des saisies en agence afin de stabiliser le périmètre de la journée à clôturer.",
    "referenceDoc": "FCUBS-DOC-AEOD-ADMIN-14"
  },
  {
    "id": "FCUBS-Q-018",
    "gradeLevel": 2,
    "module": "AEOD",
    "question": "Quelle table de la base Oracle FLEXCUBE permet de suivre en temps réel la progression et les erreurs de l AEOD ?",
    "options": [
      "EOTB_PROGRAM_MASTER",
      "AETB_PROCESS_PROGRESS",
      "ACTB_DAILY_LOG",
      "CSTB_SYSTEM_MONITOR"
    ],
    "correctIndex": 1,
    "explanation": "AETB_PROCESS_PROGRESS trace chaque job batch avec son statut ('W'=Working, 'S'=Success, 'F'=Failed) et son code d erreur.",
    "referenceDoc": "FCUBS-DOC-AEOD-ADMIN-14"
  },
  {
    "id": "FCUBS-Q-019",
    "gradeLevel": 2,
    "module": "AEOD",
    "question": "Quelle est la cause la plus courante d un échec au passage de la phase EOTI avec le code ST-TXN-PEND-01 ?",
    "options": [
      "Un tablespace disque est saturé",
      "Un contrat ou une transaction de la journée est restée en statut non validé (Hold / Unauthorized)",
      "Le serveur d application WebLogic est éteint",
      "Le cours de change de l euro n a pas été renseigné"
    ],
    "correctIndex": 1,
    "explanation": "FLEXCUBE interdit la clôture de la journée si des opérations initiées par des opérateurs n ont pas été formellement validées ou annulées.",
    "referenceDoc": "AEOD-DISASTER-RECOVERY-SOP"
  },
  {
    "id": "FCUBS-Q-020",
    "gradeLevel": 2,
    "module": "AEOD",
    "question": "Quelle commande SQL DBA permet de terminer une session bloquante retenant un verrou ORA-00054 sur ACTB_DAILY_LOG ?",
    "options": [
      "DROP SESSION 'sid,serial#';",
      "ALTER SYSTEM KILL SESSION 'sid,serial#' IMMEDIATE;",
      "UPDATE v$session SET status = 'DEAD';",
      "DELETE FROM v$locked_object WHERE session_id = 'sid';"
    ],
    "correctIndex": 1,
    "explanation": "ALTER SYSTEM KILL SESSION 'sid,serial#' IMMEDIATE libère immédiatement les verrous détenus par la session bloquante.",
    "referenceDoc": "RUNBOOK-ORACLE-LOCK-MGMT"
  },
  {
    "id": "FCUBS-Q-021",
    "gradeLevel": 2,
    "module": "AEOD",
    "question": "Que réalise le programme batch IC_ACCRUAL_BATCH pendant la phase EOD ?",
    "options": [
      "L émission des cartes bancaires périmées",
      "Le calcul journalier des courus d intérêts créditeurs et des agios débiteurs sur les comptes",
      "Le virement des salaires de la banque",
      "La réouverture des connexions au Switch monétique"
    ],
    "correctIndex": 1,
    "explanation": "IC_ACCRUAL_BATCH calcule les proratas d intérêts dus ou à percevoir pour la journée comptable écoulée.",
    "referenceDoc": "FCUBS-DOC-AEOD-ADMIN-14"
  },
  {
    "id": "FCUBS-Q-022",
    "gradeLevel": 2,
    "module": "AEOD",
    "question": "Lors de quelle phase de l AEOD la date officielle de la journée comptable dans STTM_BRANCH bascule-t-elle à J+1 ?",
    "options": [
      "Phase PEOD",
      "Phase EOTI",
      "Phase EOD",
      "Phase BOD (Beginning of Day)"
    ],
    "correctIndex": 3,
    "explanation": "C est la phase BOD qui effectue le turnover de date système vers le prochain jour ouvré.",
    "referenceDoc": "FCUBS-DOC-AEOD-ADMIN-14"
  },
  {
    "id": "FCUBS-Q-023",
    "gradeLevel": 2,
    "module": "AEOD",
    "question": "Quel statut dans AETB_PROCESS_PROGRESS indique qu un job batch s est arrêté en anomalie bloquante ?",
    "options": [
      "STATUS = 'S'",
      "STATUS = 'F'",
      "STATUS = 'W'",
      "STATUS = 'K'"
    ],
    "correctIndex": 1,
    "explanation": "'F' signifie Failed (Échec) et stoppe l enchaînement des étapes dépendantes.",
    "referenceDoc": "FCUBS-DOC-AEOD-ADMIN-14"
  },
  {
    "id": "FCUBS-Q-024",
    "gradeLevel": 2,
    "module": "AEOD",
    "question": "Pourquoi est-il formellement déconseillé de passer manuellement un job batch à 'Skip' dans AETB_PROCESS_PROGRESS sans analyse approfondie ?",
    "options": [
      "Car cela supprime la table de base de données",
      "Car cela risque d introduire des déséquilibres comptables ou d omettre le calcul des intérêts",
      "Car cela réinitialise les mots de passe des utilisateurs",
      "Car cela empêche le redémarrage du serveur WebLogic"
    ],
    "correctIndex": 1,
    "explanation": "Sauter une étape comptable ou de calcul compromet l intégrité du bilan et peut masquer une corruption de données.",
    "referenceDoc": "AEOD-DISASTER-RECOVERY-SOP"
  },
  {
    "id": "FCUBS-Q-025",
    "gradeLevel": 2,
    "module": "AEOD",
    "question": "Quelle vue Oracle permet de diagnostiquer l erreur ORA-01555 (Snapshot too old) survenue lors d un batch nocturne ?",
    "options": [
      "v$undostat",
      "v$tablespace_free",
      "v$sql_history",
      "v$backup_status"
    ],
    "correctIndex": 0,
    "explanation": "v$undostat fournit la durée maximale des requêtes (maxquerylen) et les occurrences d erreurs ORA-01555 (ssolderrcnt).",
    "referenceDoc": "RUNBOOK-ORACLE-LOCK-MGMT"
  },
  {
    "id": "FCUBS-Q-026",
    "gradeLevel": 2,
    "module": "AEOD",
    "question": "Dans quel module FLEXCUBE sont orchestrées les alertes d échéancier de crédits (CL_AUTO_SCHD_SETTLE) ?",
    "options": [
      "Module LC",
      "Module CL (Consumer Lending)",
      "Module GW",
      "Module ST"
    ],
    "correctIndex": 1,
    "explanation": "Le module CL gère le prélèvement automatique des mensualités de prêts lors de l AEOD.",
    "referenceDoc": "FCUBS-DOC-AEOD-ADMIN-14"
  },
  {
    "id": "FCUBS-Q-027",
    "gradeLevel": 2,
    "module": "AEOD",
    "question": "Quel traitement est opéré par le programme GL_POST_BATCH lors de la phase EOD ?",
    "options": [
      "La mise à jour définitive des soldes dans GLTB_GL_BALANCES à partir du journal ACTB_DAILY_LOG",
      "La transmission des relevés de comptes aux clients par email",
      "L impression des chéquiers commandés en agence",
      "La vérification du code PIN des cartes"
    ],
    "correctIndex": 0,
    "explanation": "GL_POST_BATCH consolide et fige les soldes des comptes généraux de bilan dans la table GLTB_GL_BALANCES.",
    "referenceDoc": "FCUBS-DOC-AEOD-ADMIN-14"
  },
  {
    "id": "FCUBS-Q-028",
    "gradeLevel": 2,
    "module": "AEOD",
    "question": "Que vérifie la phase EOFI avant d autoriser le passage à la phase suivante ?",
    "options": [
      "Que tous les emails de confirmation sont partis",
      "L équilibre comptable strict Débit = Crédit sur toutes les écritures de la journée",
      "Le solde de caisse physique de chaque distributeur GAB",
      "La validation des congés des directeurs d agence"
    ],
    "correctIndex": 1,
    "explanation": "EOFI s assure qu aucune devise ne présente de déséquilibre comptable entre débits et crédits.",
    "referenceDoc": "FCUBS-DOC-AEOD-ADMIN-14"
  },
  {
    "id": "FCUBS-Q-029",
    "gradeLevel": 2,
    "module": "AEOD",
    "question": "Quelle action préventive évite l incident ORA-01653 (Tablespace plein) pendant la clôture nocturne ?",
    "options": [
      "Activer l auto-extension (AUTOEXTEND ON) sur les fichiers de données et superviser le seuil de 85%",
      "Supprimer la table GLTB_GL_BALANCES avant chaque batch",
      "Réduire la taille des mémoires tampons SGA",
      "Exécuter l AEOD en plein milieu de journée"
    ],
    "correctIndex": 0,
    "explanation": "L auto-extension et la surveillance proactive de l espace disque évitent l interruption brutale des écritures de clôture.",
    "referenceDoc": "RUNBOOK-ORACLE-LOCK-MGMT"
  },
  {
    "id": "FCUBS-Q-030",
    "gradeLevel": 2,
    "module": "AEOD",
    "question": "Que doit faire l exploitant si le turnover de date échoue en BOD avec l erreur BA-DATE-FAIL pour une agence ?",
    "options": [
      "Supprimer l agence de la base de données",
      "Vérifier et mettre à jour le calendrier des jours ouvrés et fériés de l agence dans STTM_BRANCH_HOLIDAYS",
      "Redémarrer le serveur de base de données à froid",
      "Forcer la date système manuellement dans le BIOS du serveur"
    ],
    "correctIndex": 1,
    "explanation": "L erreur BA-DATE-FAIL survient lorsque la table des jours fériés n a pas de date ouvrée valide déclarée pour le lendemain.",
    "referenceDoc": "AEOD-DISASTER-RECOVERY-SOP"
  },
  {
    "id": "FCUBS-Q-031",
    "gradeLevel": 3,
    "module": "ST",
    "question": "Pourquoi est-il interdit de modifier directement les packages suffixés par _KERNEL dans FLEXCUBE ?",
    "options": [
      "Car ils sont chiffrés par Oracle et impossibles à lire",
      "Car toute modification fait perdre le support officiel Oracle et sera écrasée lors du prochain patchset",
      "Car ils ne contiennent aucune logique métier",
      "Car Oracle Database refuse de compiler les packages Kernel"
    ],
    "correctIndex": 1,
    "explanation": "La séparation stricte impose de placer les adaptations spécifiques dans les packages _CUSTOM pour garantir l évolutivité.",
    "referenceDoc": "FCUBS-EXTENSIBILITY-REF-14"
  },
  {
    "id": "FCUBS-Q-032",
    "gradeLevel": 3,
    "module": "ST",
    "question": "Quel est le rôle de l Open Development Tool (ODT) dans l écosystème Oracle FLEXCUBE ?",
    "options": [
      "C est un outil de monitoring des disques durs du serveur",
      "C est l atelier RAD permettant de concevoir les écrans, définir les blocs de données et générer les squelettes de code PL/SQL",
      "C est un simulateur de guichet automatique bancaire",
      "C est le compilateur Java de WebLogic"
    ],
    "correctIndex": 1,
    "explanation": "ODT (Development Workbench) modélise les écrans et garantit la cohérence entre IHM, métadonnées et packages de base.",
    "referenceDoc": "FCUBS-ODT-DEV-WORKBENCH-14"
  },
  {
    "id": "FCUBS-Q-033",
    "gradeLevel": 3,
    "module": "ST",
    "question": "Où un développeur de la banque doit-il insérer un contrôle métier spécifique lors de la validation d un tiers CIF ?",
    "options": [
      "Dans le package STPKS_STDCIF_KERNEL",
      "Dans la fonction Fn_Pre_Check_Mandatory du package STPKS_STDCIF_CUSTOM",
      "Directement dans un script SQL anonyme non versionné",
      "Dans la table des logs système"
    ],
    "correctIndex": 1,
    "explanation": "Le framework d extensibilité appelle les fonctions de pré/post contrôle du package _CUSTOM.",
    "referenceDoc": "FCUBS-EXTENSIBILITY-REF-14"
  },
  {
    "id": "FCUBS-Q-034",
    "gradeLevel": 3,
    "module": "ST",
    "question": "Pourquoi ne doit-on JAMAIS inclure d instruction COMMIT à l intérieur d une fonction de validation PL/SQL dans FLEXCUBE ?",
    "options": [
      "Car le moteur Oracle ne supporte pas le mot-clé COMMIT",
      "Car cela brise la gestion transactionnelle globale pilotée par la couche supérieure et empêche un ROLLBACK en cas d erreur ultérieure",
      "Car cela ralentit systématiquement la connexion réseau",
      "Car le COMMIT efface les données de session du client"
    ],
    "correctIndex": 1,
    "explanation": "Le contrôle transactionnel (COMMIT/ROLLBACK) doit être atomique et géré au niveau de l orchestration finale de l opération.",
    "referenceDoc": "ORACLE-PLSQL-HIGH-PERF"
  },
  {
    "id": "FCUBS-Q-035",
    "gradeLevel": 3,
    "module": "ST",
    "question": "Quel avantage majeur offre l utilisation combinée de BULK COLLECT (avec LIMIT) et FORALL en PL/SQL ?",
    "options": [
      "Elle permet de créer des tables temporaires automatiquement",
      "Elle réduit drastiquement les commutations de contexte entre le moteur PL/SQL et le moteur SQL pour traiter de gros volumes",
      "Elle désactive les contraintes d intégrité de la base",
      "Elle chiffre les montants en mémoire"
    ],
    "correctIndex": 1,
    "explanation": "Le bulk processing élimine le surcoût des allers-retours ligne par ligne entre les moteurs SQL et PL/SQL.",
    "referenceDoc": "ORACLE-PLSQL-HIGH-PERF"
  },
  {
    "id": "FCUBS-Q-036",
    "gradeLevel": 3,
    "module": "ST",
    "question": "Dans quel cas précis le pragma AUTONOMOUS_TRANSACTION est-il légitimement utilisé dans un développement FLEXCUBE ?",
    "options": [
      "Pour passer des écritures comptables sans débit du compte",
      "Pour journaliser une trace d audit ou une erreur dans une table de log indépendamment du ROLLBACK de la transaction métier principale",
      "Pour accélérer les requêtes SELECT sur les gros volumes",
      "Pour contourner les habilitations de sécurité JAAS"
    ],
    "correctIndex": 1,
    "explanation": "Une transaction autonome s exécute et se commite de façon isolée, garantissant la persistance des traces d incidents.",
    "referenceDoc": "ORACLE-PLSQL-HIGH-PERF"
  },
  {
    "id": "FCUBS-Q-037",
    "gradeLevel": 3,
    "module": "ST",
    "question": "Quel est le risque majeur de l utilisation de SQL dynamique concaténé sans variables liées (Bind Variables) ?",
    "options": [
      "Une saturation de la mémoire partagée Shared Pool (ORA-04031) et un risque d injection SQL",
      "Une perte immédiate de connexion réseau au serveur WebLogic",
      "La conversion forcée de tous les montants en dollars",
      "L impossibilité d imprimer les tickets de caisse"
    ],
    "correctIndex": 0,
    "explanation": "Les requêtes sans variables liées forcent un parsing dur (Hard Parse) à chaque appel, fragmentant la Shared Pool.",
    "referenceDoc": "ORACLE-PLSQL-HIGH-PERF"
  },
  {
    "id": "FCUBS-Q-038",
    "gradeLevel": 3,
    "module": "ST",
    "question": "Quelle clause doit impérativement accompagner un SELECT ... FOR UPDATE pour éviter de geler l application en cas de verrou concurrent ?",
    "options": [
      "Clause CASCADE",
      "Clause NOWAIT (ou WAIT n)",
      "Clause PARALLEL 4",
      "Clause DISTINCT"
    ],
    "correctIndex": 1,
    "explanation": "NOWAIT lève immédiatement l exception ORA-00054 si la ligne est déjà verrouillée, permettant une reprise propre côté code.",
    "referenceDoc": "ORACLE-PLSQL-HIGH-PERF"
  },
  {
    "id": "FCUBS-Q-039",
    "gradeLevel": 3,
    "module": "ST",
    "question": "Comment déclare-t-on formellement l exception pour intercepter ORA-00054 en PL/SQL ?",
    "options": [
      "EXCEPTION ORA_LOCK_ERROR;",
      "RESOURCE_BUSY EXCEPTION; PRAGMA EXCEPTION_INIT(RESOURCE_BUSY, -54);",
      "WHEN -54 THEN NULL;",
      "CATCH(ORA_00054);"
    ],
    "correctIndex": 1,
    "explanation": "PRAGMA EXCEPTION_INIT associe un nom d exception PL/SQL à un code d erreur interne Oracle.",
    "referenceDoc": "ORACLE-PLSQL-HIGH-PERF"
  },
  {
    "id": "FCUBS-Q-040",
    "gradeLevel": 3,
    "module": "ST",
    "question": "Quel format de fichier généré par ODT décrit la structure d écran et les blocs de données (Data Blocks) ?",
    "options": [
      "Fichier .RADXML",
      "Fichier .EXE",
      "Fichier .CSV",
      "Fichier .JSON"
    ],
    "correctIndex": 0,
    "explanation": "Le fichier RADXML stocke la modélisation graphique et logique de l écran dans le Workbench FLEXCUBE.",
    "referenceDoc": "FCUBS-ODT-DEV-WORKBENCH-14"
  },
  {
    "id": "FCUBS-Q-041",
    "gradeLevel": 3,
    "module": "ST",
    "question": "Quelle plage de codes d erreurs est réservée pour les exceptions applicatives levées via RAISE_APPLICATION_ERROR ?",
    "options": [
      "-1 à -100",
      "-20000 à -20999",
      "-50000 à -60000",
      "0 à 1000"
    ],
    "correctIndex": 1,
    "explanation": "Oracle réserve la plage -20000 à -20999 aux messages et codes d erreurs personnalisés définis par les développeurs.",
    "referenceDoc": "ORACLE-PLSQL-HIGH-PERF"
  },
  {
    "id": "FCUBS-Q-042",
    "gradeLevel": 3,
    "module": "ST",
    "question": "Quelle instruction est utilisée avec FORALL pour continuer le traitement même si certaines lignes individuelles échouent ?",
    "options": [
      "FORALL ... SAVE EXCEPTIONS",
      "FORALL ... IGNORE ALL",
      "FORALL ... SKIP ERROR",
      "FORALL ... ON ERROR RESUME NEXT"
    ],
    "correctIndex": 0,
    "explanation": "SAVE EXCEPTIONS permet d empiler les erreurs dans SQL%BULK_EXCEPTIONS et de traiter l intégralité des lignes valides.",
    "referenceDoc": "ORACLE-PLSQL-HIGH-PERF"
  },
  {
    "id": "FCUBS-Q-043",
    "gradeLevel": 3,
    "module": "ST",
    "question": "Dans quel ordre doivent être exécutés les scripts d un package de release FLEXCUBE ?",
    "options": [
      "1. Triggers, 2. Tables DDL, 3. Packages Custom, 4. Écrans",
      "1. Tables DDL, 2. Vues/Séquences, 3. Spécifications de packages (.spc), 4. Corps de packages (.sql), 5. Triggers",
      "1. Corps de packages, 2. Spécifications, 3. Tables",
      "L ordre n a aucune importance sous Oracle"
    ],
    "correctIndex": 1,
    "explanation": "Les objets sous-jacents et spécifications doivent exister avant de compiler les corps de packages dépendants.",
    "referenceDoc": "FCUBS-EXTENSIBILITY-REF-14"
  },
  {
    "id": "FCUBS-Q-044",
    "gradeLevel": 3,
    "module": "ST",
    "question": "Pourquoi est-il crucial de fermer un curseur explicite (CLOSE c_cur) dans le bloc d exception d une procédure ?",
    "options": [
      "Pour éviter l épuisement des curseurs ouverts dans la session Oracle (ORA-01000)",
      "Pour effacer les données de la table requêtée",
      "Pour envoyer un email au DBA",
      "Pour forcer le redémarrage de la base"
    ],
    "correctIndex": 0,
    "explanation": "Un curseur non fermé consomme des descripteurs de mémoire PGA et peut mener à ORA-01000: maximum open cursors exceeded.",
    "referenceDoc": "ORACLE-PLSQL-HIGH-PERF"
  },
  {
    "id": "FCUBS-Q-045",
    "gradeLevel": 3,
    "module": "ST",
    "question": "Quel outil Oracle permet d analyser le plan d exécution et le coût CPU/I-O d une requête SQL avant déploiement ?",
    "options": [
      "EXPLAIN PLAN FOR (ou DBMS_XPLAN.DISPLAY)",
      "SQL*Plus CONNECT",
      "ALTER SESSION SET DEBUG",
      "DBMS_OUTPUT.PUT_LINE"
    ],
    "correctIndex": 0,
    "explanation": "EXPLAIN PLAN FOR révèle l utilisation des index, les balayages de tables complets (FTS) et le coût estimé par l optimiseur.",
    "referenceDoc": "ORACLE-PLSQL-HIGH-PERF"
  },
  {
    "id": "FCUBS-Q-046",
    "gradeLevel": 4,
    "module": "AC",
    "question": "Dans quelle table sont stockées toutes les lignes d écritures comptables générées pendant la journée en cours avant déversement GL ?",
    "options": [
      "ACTB_DAILY_LOG",
      "GLTM_GLMASTER",
      "STTM_CUSTOMER",
      "AETB_PROCESS_PROGRESS"
    ],
    "correctIndex": 0,
    "explanation": "ACTB_DAILY_LOG est le journal comptable au fil de l eau recevant chaque mouvement de débit et de crédit.",
    "referenceDoc": "FCUBS-DOC-AC-GL-SPEC-14"
  },
  {
    "id": "FCUBS-Q-047",
    "gradeLevel": 4,
    "module": "AC",
    "question": "Quelle règle d équilibre fondamental le moteur comptable AC applique-t-il sur chaque transaction financière ?",
    "options": [
      "Somme des crédits doit dépasser les débits de 10%",
      "Somme des débits en devise locale (LCY_AMOUNT) = Somme des crédits en devise locale (LCY_AMOUNT)",
      "Les débits ne sont comptabilisés que le lendemain",
      "Seuls les comptes en devises étrangères doivent être équilibrés"
    ],
    "correctIndex": 1,
    "explanation": "Le principe de comptabilité en partie double impose l équilibre strict Débit = Crédit en équivalent monnaie locale.",
    "referenceDoc": "FCUBS-DOC-AC-GL-SPEC-14"
  },
  {
    "id": "FCUBS-Q-048",
    "gradeLevel": 4,
    "module": "AC",
    "question": "Quelle table maintient les soldes cumulés des comptes de Grand Livre par période et exercice comptable ?",
    "options": [
      "GLTB_GL_BALANCES",
      "GLTM_ACCOUNT_NAMES",
      "ACTB_BALANCE_CACHE",
      "STTB_DAILY_TRIAL"
    ],
    "correctIndex": 0,
    "explanation": "GLTB_GL_BALANCES regroupe les soldes de synthèse de chaque compte GL par devise et période.",
    "referenceDoc": "FCUBS-DOC-AC-GL-SPEC-14"
  },
  {
    "id": "FCUBS-Q-049",
    "gradeLevel": 4,
    "module": "AC",
    "question": "Quelle table du module Consumer Lending (CL) contient le détail des échéances d amortissement d un crédit bancaire ?",
    "options": [
      "CLTB_ACCOUNT_SCHEDULES",
      "CLTB_RATE_CHANGES",
      "CLTM_LOAN_PRODUCTS",
      "ACTB_DAILY_LOG"
    ],
    "correctIndex": 0,
    "explanation": "CLTB_ACCOUNT_SCHEDULES liste chaque date d échéance avec la décomposition en capital, intérêts et taxes.",
    "referenceDoc": "FCUBS-DOC-CL-LENDING-14"
  },
  {
    "id": "FCUBS-Q-050",
    "gradeLevel": 4,
    "module": "AC",
    "question": "Quel type de contrat est géré par la table maîtresse FTTB_CONTRACT_MASTER ?",
    "options": [
      "Les contrats de coffres-forts",
      "Les contrats d ordres de virement et de transfert de fonds (Funds Transfer)",
      "Les contrats d assurance des agents",
      "Les baux de location des agences"
    ],
    "correctIndex": 1,
    "explanation": "Le module FT (Funds Transfer) traite les virements ponctuels et permanents, nationaux et internationaux.",
    "referenceDoc": "FCUBS-DOC-FT-PAYMENTS-14"
  },
  {
    "id": "FCUBS-Q-051",
    "gradeLevel": 4,
    "module": "AC",
    "question": "Quel message SWIFT standard est traditionnellement généré lors d un virement international émis pour le compte d un client sous FLEXCUBE ?",
    "options": [
      "MT103 (Single Customer Credit Transfer)",
      "MT940 (Customer Statement Message)",
      "MT500 (Securities Trade)",
      "MT700 (Issue of Documentary Credit)"
    ],
    "correctIndex": 0,
    "explanation": "Le message MT103 (ou équivalent ISO 20022 PACS.008) est le format standard des virements clientèle transfrontaliers.",
    "referenceDoc": "FCUBS-DOC-FT-PAYMENTS-14"
  },
  {
    "id": "FCUBS-Q-052",
    "gradeLevel": 4,
    "module": "AC",
    "question": "Comment sont comptabilisés les intérêts courus non échus (IC Accruals) lors de la clôture journalière ?",
    "options": [
      "Par un débit du compte client et crédit du compte de la banque centrale",
      "Par une écriture de dotation : Débit d un compte de charge d intérêts et Crédit d un compte GL d intérêts courus à payer (ou inversement pour les prêts)",
      "Les intérêts ne sont jamais calculés de façon journalière",
      "Par un prélèvement en espèces au guichet"
    ],
    "correctIndex": 1,
    "explanation": "Le calcul d accrual journalier applique le principe de rattachement des charges et produits à l exercice comptable.",
    "referenceDoc": "FCUBS-DOC-AC-GL-SPEC-14"
  },
  {
    "id": "FCUBS-Q-053",
    "gradeLevel": 4,
    "module": "AC",
    "question": "Quel module FLEXCUBE pilote l émission, l amendement et le paiement des Lettres de Crédit (Crédits Documentaires) ?",
    "options": [
      "Module LC (Letters of Credit)",
      "Module DE (Data Entry)",
      "Module ST (Static Maintenance)",
      "Module CL (Consumer Lending)"
    ],
    "correctIndex": 0,
    "explanation": "Le module LC gère l ensemble des instruments de Trade Finance pour les opérations d import/export.",
    "referenceDoc": "FCUBS-DOC-FT-PAYMENTS-14"
  },
  {
    "id": "FCUBS-Q-054",
    "gradeLevel": 4,
    "module": "AC",
    "question": "Pourquoi un compte GL de liaison clientèle (ex: 211100000) doit-il avoir le paramètre Direct Posting Allowed = 'N' ?",
    "options": [
      "Pour empêcher la clôture du compte",
      "Pour interdire les saisies manuelles directes qui causeraient des divergences entre les comptes clients et le Grand Livre",
      "Pour accélérer les batchs nocturnes",
      "Pour masquer le compte aux commissaires aux comptes"
    ],
    "correctIndex": 1,
    "explanation": "Seuls les sous-modules auxiliaires (AC, FT, CL) doivent alimenter les comptes GL collectifs de façon automatisée.",
    "referenceDoc": "FCUBS-DOC-AC-GL-SPEC-14"
  },
  {
    "id": "FCUBS-Q-055",
    "gradeLevel": 4,
    "module": "AC",
    "question": "Quelle est la conséquence d une rupture de balance (GL-POST-OOB) lors du job de déversement GL de l AEOD ?",
    "options": [
      "Le batch continue en ignorant l écart",
      "La clôture de journée est suspendue car le bilan de la banque ne peut pas être déséquilibré",
      "Tous les comptes de la banque sont débités de 1 centime",
      "La date système avance automatiquement à J+2"
    ],
    "correctIndex": 1,
    "explanation": "Une rupture d équilibre est une anomalie bloquante de sévérité maximale P1 nécessitant une écriture de réconciliation.",
    "referenceDoc": "FCUBS-DOC-AC-GL-SPEC-14"
  },
  {
    "id": "FCUBS-Q-056",
    "gradeLevel": 4,
    "module": "AC",
    "question": "Dans quel cas utilise-t-on le compte GL de 'Suspense' ou compte d attente sous FLEXCUBE ?",
    "options": [
      "Pour stocker les bénéfices annuels de la banque",
      "Pour isoler temporairement des fonds dont l imputation définitive est incertaine ou en attente d informations complémentaires",
      "Pour payer les primes des employés",
      "Pour rémunérer les actionnaires"
    ],
    "correctIndex": 1,
    "explanation": "Les comptes de suspense accueillent les écritures non réconciliées dans l attente de leur affectation finale.",
    "referenceDoc": "BANKING-AC-FUNDAMENTALS"
  },
  {
    "id": "FCUBS-Q-057",
    "gradeLevel": 4,
    "module": "AC",
    "question": "Quel composant d une échéance de prêt CL rembourse la dette en capital initiale accordée à l emprunteur ?",
    "options": [
      "Composant PRINCIPAL",
      "Composant MAIN_INT",
      "Composant PENALTY_INT",
      "Composant TAX_CHARGE"
    ],
    "correctIndex": 0,
    "explanation": "Le composant PRINCIPAL amortit le capital prêté, tandis que MAIN_INT rémunère la banque.",
    "referenceDoc": "FCUBS-DOC-CL-LENDING-14"
  },
  {
    "id": "FCUBS-Q-058",
    "gradeLevel": 4,
    "module": "AC",
    "question": "Quelle table stocke l historique des soldes arrêtés de fin de journée pour chaque compte client ?",
    "options": [
      "ACTB_ACCBAL_HISTORY",
      "GLTB_FIN_YEAR",
      "STTM_DORMANT_LOG",
      "CSTB_USER_ACTIVITY"
    ],
    "correctIndex": 0,
    "explanation": "ACTB_ACCBAL_HISTORY permet de restituer le solde officiel d un compte à n importe quelle date passée.",
    "referenceDoc": "FCUBS-DOC-AC-GL-SPEC-14"
  },
  {
    "id": "FCUBS-Q-059",
    "gradeLevel": 4,
    "module": "AC",
    "question": "Comment FLEXCUBE traite-t-il les écarts de conversion de devises (Rounding Differences) de quelques centimes lors d opérations FX ?",
    "options": [
      "L opération est systématiquement rejetée avec code d erreur 99",
      "L écart est automatiquement affecté à un compte GL de pertes/profits sur arrondis paramétré dans l agence",
      "Le montant est arrondi à l unité de million supérieure",
      "L opérateur doit payer la différence de sa poche"
    ],
    "correctIndex": 1,
    "explanation": "Un compte GL d écarts de conversion absorbe les inévitables micro-différences liées aux calculs arithmétiques de change.",
    "referenceDoc": "FCUBS-DOC-AC-GL-SPEC-14"
  },
  {
    "id": "FCUBS-Q-060",
    "gradeLevel": 4,
    "module": "AC",
    "question": "Quel est l impact sur la balance générale si un virement multidevise est passé sans renseigner le cours de change FX adéquat ?",
    "options": [
      "Aucun impact",
      "Une rupture d équilibre LCY immédiate car la contre-valeur débit ne correspondra pas à la contre-valeur crédit",
      "Le compte du client est automatiquement doublé",
      "Le virement est annulé 10 ans plus tard"
    ],
    "correctIndex": 1,
    "explanation": "La valorisation en devise locale (LCY) doit être strictement égale entre le compte débité et le compte crédité.",
    "referenceDoc": "FCUBS-DOC-AC-GL-SPEC-14"
  },
  {
    "id": "FCUBS-Q-061",
    "gradeLevel": 5,
    "module": "GW",
    "question": "Quel composant technique assure l interface sécurisée entre les systèmes périphériques (Switch, E-Banking) et le moteur FCUBS ?",
    "options": [
      "La Gateway Oracle FLEXCUBE (GW)",
      "L outil d export Excel",
      "Le serveur d impression PDF",
      "Le pare-feu matériel seul"
    ],
    "correctIndex": 0,
    "explanation": "La Gateway (GW) orchestre les flux entrants/sortants via EJB, JMS, Web Services SOAP et API REST.",
    "referenceDoc": "FCUBS-DOC-GATEWAY-ARCH-14"
  },
  {
    "id": "FCUBS-Q-062",
    "gradeLevel": 5,
    "module": "GW",
    "question": "Quel est le SLA de temps de réponse maximal toléré pour une demande d autorisation monétique (ISO 8583 0100) acheminée via la Gateway ?",
    "options": [
      "Moins de 800 millisecondes (pour tenir le timeout terminal GAB de 30 secondes)",
      "Environ 15 minutes",
      "24 heures ouvrées",
      "Le temps n a pas d importance pour les cartes bancaires"
    ],
    "correctIndex": 0,
    "explanation": "La chaîne monétique impose une réactivité en ligne sub-seconde pour éviter l abandon ou le timeout au niveau du porteur.",
    "referenceDoc": "SWITCH-FCUBS-ONLINE-INTEGRATION"
  },
  {
    "id": "FCUBS-Q-063",
    "gradeLevel": 5,
    "module": "GW",
    "question": "Que fait le Switch Monétique lorsque le Core Banking FLEXCUBE est arrêté pour maintenance ou lors du gel EOFI de l AEOD ?",
    "options": [
      "Il refuse systématiquement 100% des retraits dans tout le pays",
      "Il bascule en mode Stand-In (autorisation autonome sur plafonds sécurisés) et stocke les transactions dans un journal SAF",
      "Il supprime les comptes des clients",
      "Il force le redémarrage du serveur WebLogic sans préavis"
    ],
    "correctIndex": 1,
    "explanation": "Le mode Stand-In garantit la continuité de service des paiements par carte même lorsque le Core Banking est isolé.",
    "referenceDoc": "SWITCH-FCUBS-ONLINE-INTEGRATION"
  },
  {
    "id": "FCUBS-Q-064",
    "gradeLevel": 5,
    "module": "GW",
    "question": "Quelles tables de la Gateway enregistrent l audit complet des messages XML entrants et sortants ?",
    "options": [
      "GWTB_IN_LOG et GWTB_OUT_LOG",
      "CSTB_DEBUG_LOG uniquement",
      "ACTB_DAILY_LOG",
      "AUDIT_ORACLE_DB"
    ],
    "correctIndex": 0,
    "explanation": "GWTB_IN_LOG et GWTB_OUT_LOG tracent les identifiants de messages, payloads, horodatages et statuts de traitement.",
    "referenceDoc": "FCUBS-DOC-GATEWAY-ARCH-14"
  },
  {
    "id": "FCUBS-Q-065",
    "gradeLevel": 5,
    "module": "GW",
    "question": "Quelle technologie Oracle permet d exécuter le Core Banking sur plusieurs nœuds de serveurs simultanés sans interruption en cas de panne matérielle ?",
    "options": [
      "Oracle Real Application Clusters (RAC)",
      "Oracle VirtualBox",
      "Oracle Forms 6i",
      "Oracle Express Edition"
    ],
    "correctIndex": 0,
    "explanation": "Oracle RAC fournit la haute disponibilité active-active avec basculement transparent des connexions applicatives (TAF).",
    "referenceDoc": "ORACLE-RAC-FCUBS-MAX-AVAIL"
  },
  {
    "id": "FCUBS-Q-066",
    "gradeLevel": 5,
    "module": "GW",
    "question": "Lors de la réception d une demande d autorisation de retrait GAB (ISO 8583 0200), quelle action réalise FLEXCUBE sur le compte client ?",
    "options": [
      "Il débite immédiatement le Grand Livre de la banque",
      "Il vérifie le solde disponible et pose un montant bloqué (Hold / Indisponibilité) sur le compte sans passer d écriture définitive",
      "Il clôture le compte pour des raisons de sécurité",
      "Il attend la fin du mois pour vérifier le solde"
    ],
    "correctIndex": 1,
    "explanation": "L autorisation temps réel pose une indisponibilité (Hold) ; l écriture comptable définitive n intervient qu au clearing.",
    "referenceDoc": "SWITCH-FCUBS-ONLINE-INTEGRATION"
  },
  {
    "id": "FCUBS-Q-067",
    "gradeLevel": 5,
    "module": "GW",
    "question": "Quel mécanisme permet de rejouer les écritures accumulées en mode Stand-In dès que FLEXCUBE redevient opérationnel ?",
    "options": [
      "Le mécanisme Store and Forward (SAF)",
      "Une saisie manuelle au guichet par les employés",
      "Un script shell non sécurisé",
      "La fermeture définitive des comptes"
    ],
    "correctIndex": 0,
    "explanation": "Le protocole Store and Forward (SAF) déverse automatiquement les transactions autorisées localement dès le rétablissement de la liaison.",
    "referenceDoc": "SWITCH-FCUBS-ONLINE-INTEGRATION"
  },
  {
    "id": "FCUBS-Q-068",
    "gradeLevel": 5,
    "module": "GW",
    "question": "Quel type de partitionnement Oracle est recommandé pour la table des mouvements comptables volumineuse ACTB_DAILY_LOG ?",
    "options": [
      "Partitionnement par intervalle de dates (Range / Interval Partitioning) sur la colonne VALUE_DATE",
      "Partitionnement aléatoire",
      "Aucun partitionnement sous aucun prétexte",
      "Partitionnement par ordre alphabétique du nom du client"
    ],
    "correctIndex": 0,
    "explanation": "Le partitionnement temporel facilite le traitement des batchs du jour et permet de tronquer ou archiver les mois passés sans verrou global.",
    "referenceDoc": "ORACLE-RAC-FCUBS-MAX-AVAIL"
  },
  {
    "id": "FCUBS-Q-069",
    "gradeLevel": 5,
    "module": "GW",
    "question": "Pourquoi configure-t-on un Work Manager dédié avec thread pool réservé sous WebLogic pour la Gateway Monétique ?",
    "options": [
      "Pour empêcher qu une surcharge d utilisateurs d agences ou d extractions de rapports n épuise tous les threads nécessaires aux retraits GAB",
      "Pour changer la couleur de l écran de connexion",
      "Pour économiser l électricité du data center",
      "Pour supprimer le besoin d index Oracle"
    ],
    "correctIndex": 0,
    "explanation": "L isolation des ressources WebLogic garantit le respect des SLAs critiques du canal monétique face à la charge applicative courante.",
    "referenceDoc": "FCUBS-DOC-GATEWAY-ARCH-14"
  },
  {
    "id": "FCUBS-Q-070",
    "gradeLevel": 5,
    "module": "GW",
    "question": "Comment traite-t-on une transaction de reversal monétique (ISO 8583 0420) reçue suite à un bourrage de billets au GAB ?",
    "options": [
      "FLEXCUBE libère immédiatement le montant bloqué (Hold) sur le compte sans imputer de débit",
      "FLEXCUBE débite deux fois le compte",
      "FLEXCUBE signale le client à la police",
      "FLEXCUBE ignore le message de reversal"
    ],
    "correctIndex": 0,
    "explanation": "Le reversal 0400/0420 annule la pré-autorisation initiale et restitue la pleine disponibilité des fonds au titulaire de la carte.",
    "referenceDoc": "SWITCH-FCUBS-ONLINE-INTEGRATION"
  },
  {
    "id": "FCUBS-Q-071",
    "gradeLevel": 5,
    "module": "GW",
    "question": "Quel paramètre Oracle Active Data Guard permet de garantir qu aucune transaction validée n est perdue en cas de crash du site primaire (RPO = 0) ?",
    "options": [
      "Mode Maximum Protection (ou Maximum Availability avec transport synchrone SYNC)",
      "Mode NoArchiveLog",
      "Sauvegarde sur disquette hebdomadaire",
      "Mode Lazy Commit sans redo"
    ],
    "correctIndex": 0,
    "explanation": "Le transport synchrone des journaux de reprise (Redo Logs) vers le site de secours garantit l intégrité absolue des transactions bancaires.",
    "referenceDoc": "ORACLE-RAC-FCUBS-MAX-AVAIL"
  },
  {
    "id": "FCUBS-Q-072",
    "gradeLevel": 5,
    "module": "GW",
    "question": "Quelle est la cause d un blocage ORA-02049 (distributed transaction timeout) lors d un échange avec un système externe ?",
    "options": [
      "Une transaction distribuée via Database Link attend une ressource sur la base distante sans réponse dans le délai imparti",
      "La souris de l opérateur est débranchée",
      "Le mot de passe du compte d administration a expiré",
      "Le client a dépassé son découvert bancaire"
    ],
    "correctIndex": 0,
    "explanation": "Les transactions distribuées à travers des DB Links sont vulnérables aux coupures réseau et doivent être résolues via DBA_2PC_PENDING.",
    "referenceDoc": "RUNBOOK-ORACLE-LOCK-MGMT"
  },
  {
    "id": "FCUBS-Q-073",
    "gradeLevel": 5,
    "module": "GW",
    "question": "Pourquoi est-il préconisé d utiliser des files de messages JMS persistantes plutôt que des DB Links synchrones pour les échanges inter-applicatifs ?",
    "options": [
      "Pour découpler les systèmes et garantir la livraison des messages même en cas de panne temporaire du récepteur",
      "Pour éviter d avoir à créer des tables Oracle",
      "Pour réduire le nombre d agences de la banque",
      "Pour empêcher les clients de faire des virements"
    ],
    "correctIndex": 0,
    "explanation": "Le messaging asynchrone JMS garantit la résilience face aux pannes ponctuelles des systèmes distants sans bloquer le Core Banking.",
    "referenceDoc": "FCUBS-DOC-GATEWAY-ARCH-14"
  },
  {
    "id": "FCUBS-Q-074",
    "gradeLevel": 5,
    "module": "GW",
    "question": "Quelle procédure Oracle DBA permet d épingler en mémoire partagée les packages les plus sollicités pour éviter ORA-04031 ?",
    "options": [
      "DBMS_SHARED_POOL.KEEP('nom_du_package')",
      "ALTER SYSTEM PURGE ALL;",
      "DROP PACKAGE nom_du_package;",
      "SELECT * FROM v$sgastat;"
    ],
    "correctIndex": 0,
    "explanation": "DBMS_SHARED_POOL.KEEP force la rétention permanente des packages critiques dans la Shared Pool, prévenant leur ré-allocation coûteuse.",
    "referenceDoc": "ORACLE-PLSQL-HIGH-PERF"
  },
  {
    "id": "FCUBS-Q-075",
    "gradeLevel": 5,
    "module": "GW",
    "question": "En quoi consiste la réconciliation quotidienne entre le Switch Monétique et le Core Banking FLEXCUBE ?",
    "options": [
      "À comparer le total des opérations autorisées par le Switch avec les imputations de clearing enregistrées dans ACTB_DAILY_LOG pour régulariser les écarts",
      "À supprimer les transactions de la veille",
      "À modifier les codes secrets des cartes bancaires",
      "À fermer les comptes des commerçants déficitaires"
    ],
    "correctIndex": 0,
    "explanation": "La réconciliation vérifie l égalité parfaite entre les flux physiques constatés sur les automates et les soldes comptables dans le Core Banking.",
    "referenceDoc": "SWITCH-FCUBS-ONLINE-INTEGRATION"
  }
];
