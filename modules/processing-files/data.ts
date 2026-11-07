import { NetworkWorkflowFlow } from "./types";

/**
 * Données extraites fidèlement et mot pour mot des captures Mind Map transmises par l'utilisateur.
 * Ordre d'affichage :
 * 1. GIMAC (CEMAC)
 * 2. VISA (International)
 * 3. GIM (UEMOA)
 */

export const MINDMAP_INCOMING_FLOWS: NetworkWorkflowFlow[] = [
  // ---------------------------------------------------------------------------
  // 1. RÉSEAU GIMAC (Zone CEMAC)
  // ---------------------------------------------------------------------------
  {
    networkId: "GIMAC",
    networkName: "GIMAC (CEMAC)",
    shortName: "GIMAC",
    badge: "CEMAC • Gabon & Cameroun",
    zone: "Afrique Centrale (BEAC / CEMAC)",
    currency: "XAF",
    isDetailedProvided: true,
    description: "Parcours de traitement des fichiers entrants GIMAC (CEMAC) pour les filiales GABON et CAM.",
    themeColor: {
      bg: "#18140a",
      border: "#b45309",
      text: "#fde68a",
      nodeBg: "#78350f",
      accent: "#f59e0b",
      badgeBg: "rgba(245, 158, 11, 0.15)",
      glow: "rgba(245, 158, 11, 0.35)",
    },
    rootNodeTitle: "GIMAC (CEMAC)",
    commonPreSteps: [
      "GABON ET CAM",
      "RECUPERATION FICHIER SUR LA MACHINE DISTANTE",
      "SAUVEGARDE + DEPOT DANS LE REPERTOIRE DE TRAITEMENT",
    ],
    exactBranches: [
      {
        id: "gimac_branch_compta",
        title: "COMPTABILISATION & DASHBOARD MONÉTIQUE",
        scope: "GABON OU CAM",
        badgeColor: "#3b82f6",
        steps: [
          "GENERATION FICHIER DE",
          "DASHBOARD MONETIQUE",
          "COMPTABILISATION→FILIALE : GABON OU CAM → GENERER",
          "GENERATION FICHIER DE",
          "TELECHARGER FICHIER DE",
          "Supprimer l'heure et modifie la date a J-1",
          "Transmettre par mail à l'operation",
        ],
      },
      {
        id: "gimac_branch_onus",
        title: "FLUX ON-US",
        scope: "GABON UNIQUEMENT",
        badgeColor: "#10b981",
        steps: [
          "ON-US : GABON UNIQUEMENT",
          "GENRATION FICHIER ON-US : ONUS",
          "EXTRAIRE DONNEE",
          "TELECHARGER LE FICHIER DE",
          "Transmettre par mail à l'operation",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 2. RÉSEAU VISA (International) - POSITIONNÉ AVANT GIM
  // ---------------------------------------------------------------------------
  {
    networkId: "VISA",
    networkName: "VISA",
    shortName: "VISA",
    badge: "International • Multi-filiales",
    zone: "International (VisaNet)",
    currency: "USD / EUR / XAF / XOF",
    isDetailedProvided: true,
    description: "Parcours de traitement des fichiers VISA par filiales (CIV, Mali, Madagascar, Gabon, Guinée, Comores, Cameroun).",
    themeColor: {
      bg: "#062319",
      border: "#059669",
      text: "#6ee7b7",
      nodeBg: "#065f46",
      accent: "#10b981",
      badgeBg: "rgba(16, 185, 129, 0.15)",
      glow: "rgba(16, 185, 129, 0.35)",
    },
    rootNodeTitle: "VISA",
    commonPreSteps: [
      "RECUPERATION DU FICHIER PAR MAIL",
      "DEPOSER SUR WINSCP DE FACON INDIVIDUEL POUR CHAQUE FILIALE",
      "DONNER TOUS LES DROITS (777) AU FICHIER",
      "Copier le nom du fichier déposer",
      "SE CONNECTER SUR PAYWAY",
    ],
    visaWorkflow: {
      prePaywaySteps: [
        "RECUPERATION DU FICHIER PAR MAIL",
        "DEPOSER SUR WINSCP DE FACON INDIVIDUEL POUR CHAQUE FILIALE",
        "DONNER TOUS LES DROITS (777) AU FICHIER",
        "Copier le nom du fichier déposer",
        "SE CONNECTER SUR PAYWAY",
      ],
      paywayActions: [
        {
          title: "1-Process intégration fichier VISA",
          detail:
            "Saisir Visa dans la barre de recherche et cliquer sur : Processus d'intégration fichier VISA",
        },
        {
          title: "2-Faire la réconciliation",
          detail:
            "Saisir Visa dans la barre de recherche et cliquer sur : Processus de reconciliation fichier VISA",
        },
        {
          title: "3-Génération du fichier CRE",
          detail:
            "Saisir Visa dans la barre de recherche et cliquer sur : Processus de settlement en s'assurant de bien collé le nom du fichier copié précédemment on obtient le fichier CRE a la sortie",
        },
      ],
      settlementGenerationTitle:
        "4-Génération du fichier de règlement (DE) sur la base du fichier C precedemmentRE recuperer",
      cleanStepTitle:
        "1-Supprimer du fichier toutes les transactions décalées en bas du fichier",
      streams: [
        {
          id: "visa_dashboard",
          title: "Dashboard monétique (CIV, Mali, Madagascar, Gabon)",
          filiales: "CIV, Mali, Madagascar, Gabon",
          appType: "Dashboard Monétique",
          detailProcess:
            "Dashboard monétique : génération du fichier DE  pour CIV, Mali, Madagascar, Gabon : Comptabilisation ➔ Traitement VISA ➔ Choix Filiale ➔ Chargement Operation (a la date comptable) ➔ Generation des ecritures ➔ Telechargement du fichier DE",
          finalSteps: [
            "Retirer l'heure du nom du fichier",
            "Transmettre par mail à l'operation",
          ],
        },
        {
          id: "visa_ulrich",
          title: "Appli interne monétique (appli de Ulrich) - Guinée & Comores",
          filiales: "Guinée et Comores",
          appType: "Appli de Ulrich",
          detailProcess:
            "Appli interne monétique (appli de Ulrich) : traitement des filiales : Guinée et Comores",
          finalSteps: ["Transmettre par mail à l'operation"],
        },
        {
          id: "visa_cameroun",
          title: "Cameroun (Ancienne application)",
          filiales: "Cameroun",
          appType: "Ancienne Application",
          detailProcess:
            "3-Pour le Cameroun, sur la base du fichier LIS (initialement récupéré), utilisé l'ancienne application",
          finalSteps: [
            "4-Generer le DE",
            "Transmettre par mail à l'operation",
          ],
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // 3. RÉSEAU GIM (GIM-UEMOA) - POSITIONNÉ EN 3ÈME
  // ---------------------------------------------------------------------------
  {
    networkId: "GIM",
    networkName: "GIM (UEMOA)",
    shortName: "GIM",
    badge: "UEMOA • GIM-Net",
    zone: "Afrique de l'Ouest (BCEAO / UEMOA)",
    currency: "XOF",
    isDetailedProvided: true,
    description: "Parcours de traitement des fichiers LIS, PDF, CRE et DE pour le réseau GIM (UEMOA).",
    themeColor: {
      bg: "#07172b",
      border: "#1d4ed8",
      text: "#93c5fd",
      nodeBg: "#1e3a8a",
      accent: "#3b82f6",
      badgeBg: "rgba(59, 130, 246, 0.15)",
      glow: "rgba(59, 130, 246, 0.35)",
    },
    rootNodeTitle: "GIM (UEMOA)",
    commonPreSteps: [
      "Se connecter sur GIM",
      "Récupérer les fichiers (LIS + pdf) en double-cliquant sur le fichier",
      "Zipper les 3 fichiers pdf suivant la nomenclature",
      "Récupérer les fichiers zippés et le fichier LIS",
      "Déposer dans mon répertoire de traitement pour la filiale",
    ],
    gimBranches: [
      {
        id: "gim_b1_cre",
        number: 1,
        title: "1-Génération du CRE",
        subSteps: [
          "déposer le fichier sur WinSCP",
          "Se connecter à Payway",
          "Suivre le process de génération du fichier CRE GIM sur Payway,",
        ],
        paywaySubProcesses: [
          "1-Application ➔ Gestion LIS ➔ Processus ➔ Process intégration",
          "2-Application ➔ Gestion LIS ➔ Processus ➔ Process Réconciliation",
          "3-Application ➔ Gestion LIS ➔ Processus ➔ Settlement",
          "4-Application ➔ Customize management ➔ Process fichier settlement",
        ],
        finalOutcome:
          "À partir du CRE généré, aller sur l'appli Dashboard monétique et suivre le traitement comme pour VISA : on obtient le DE",
      },
      {
        id: "gim_b2_xls",
        number: 2,
        title: "2-Générer le fichier xls depuis l'appli d'Ulrich",
      },
      {
        id: "gim_b3_transmission",
        number: 3,
        title: "3-3 fichiers à transmettre : le DE, le xls, le dossier zippé",
      },
    ],
  },
];
