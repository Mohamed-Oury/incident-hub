import {
  OutgoingCommonStep,
  FilialeOutgoingRule,
  OutgoingDepositStep,
  CybersourceStep,
  OutgoingHypotheseItem,
  OutgoingRecommandationItem,
  OutgoingPointOuvertItem,
} from "./types";

export const OUTGOING_METADATA = {
  title: "Procédure de traitement OUTGOING : référentiel de terrain",
  documentType: "Référentiel monétique : procédure OUTGOING",
  version: "Version de travail du 03/11/2026",
  source: "Notes manuscrites de terrain. Document vivant, construit progressivement.",
  rule: "On distingue toujours ce qui est confirmé, ce qui est une hypothèse et ce qui est une recommandation. On n'invente pas le fonctionnement interne de DBS.",
  perimetre: [
    "Ce document couvre le process OUTGOING, qui se déroule sur Payway",
    "Pour toutes les filiales, on a 3 process : Dual, Couverture VISA, génération fichier",
    "Pour la CIV et le Mali, on a 2 process en plus (LIS)",
    "Le process CYBERSOURCE_OUTGOING (CS) ne concerne que la filiale du Cameroun : les autres filiales ne sont pas concernées",
    "Les Comores (KM) n'ont pas de fichier outgoing",
  ],
};

export const OUTGOING_GLOSSARY = [
  {
    term: "Dual",
    status: "CONFIRME",
    definition: "Process qui récupère toutes les transactions télécollectées.",
  },
  {
    term: "Couverture VISA",
    status: "CONFIRME",
    definition: "Process lancé après le Dual (rôle exact à préciser).",
  },
  {
    term: "LIS",
    status: "CONFIRME",
    definition:
      "Fichier traité par deux process supplémentaires pour la CIV et le Mali (voir la procédure INCOMING GIM pour le fichier LIS en entrée).",
  },
  {
    term: "CS",
    status: "CONFIRME",
    definition: "Abréviation de CYBERSOURCE_OUTGOING.",
  },
  {
    term: "KM",
    status: "CONFIRME",
    definition: "Code / abréviation désignant les Comores.",
  },
  {
    term: "CM",
    status: "CONFIRME",
    definition: "Code / abréviation désignant le Cameroun.",
  },
  {
    term: "IWO",
    status: "CONFIRME",
    definition:
      "Nom d'un commerçant particulier dont les transactions ne sont pas en euro (ce qui biaise souvent le calcul des montants).",
  },
];

export const OUTGOING_GENERIC_VARS = [
  { code: "<FILIALE>", description: "Filiale choisie dans Payway" },
  {
    code: "<INTITULE_FILIALE>",
    description:
      "Intitulé du nom de la filiale, qui remplace le « P » au début du nom du fichier",
  },
  { code: "<NOM_FICHIER_VISA>", description: "Nom du fichier VISA généré" },
  {
    code: "<NOM_FICHIER_LIS>",
    description: "Nom du fichier LIS généré (CIV et Mali)",
  },
  {
    code: "<NOM_FICHIER_CYBERSOURCE>",
    description: "Nom du fichier Cybersource généré",
  },
];

// =========================================================================
// PARTIE A : PROCESS OUTGOING, TOUTES FILIALES (ÉTAPES 1 À 5)
// =========================================================================
export const OUTGOING_COMMON_STEPS: OutgoingCommonStep[] = [
  {
    stepNumber: 1,
    title: "Connexion",
    action: "Se connecter sur Payway",
    status: "CONFIRME",
  },
  {
    stepNumber: 2,
    title: "Choix de la filiale",
    action: "Choisir une filiale <FILIALE>",
    status: "CONFIRME",
  },
  {
    stepNumber: 3,
    title: "Lancement du Process Dual",
    action:
      "Lancer le process du Dual : récupérer toutes les transactions télécollectées (Process Dual).",
    searchHint: "Saisir « Dual » dans la recherche Payway",
    status: "CONFIRME",
  },
  {
    stepNumber: 4,
    title: "Process Couverture VISA",
    action: "Process Couverture VISA.",
    searchHint: "Saisir « VISA » et aller sur le bon lien",
    status: "CONFIRME",
  },
  {
    stepNumber: 5,
    title: "Génération fichier VISA",
    action: "Process génération fichier VISA <NOM_FICHIER_VISA>",
    searchHint: "Aller sur le lien de génération du fichier",
    status: "CONFIRME",
  },
];

export const OUTGOING_COMMON_RAPPEL = {
  title: "Rappel [CONFIRMÉ] : Structure des 3 process",
  text: "Pour toutes les filiales, on a ces 3 process : 1. Process Dual (saisir Dual dans la recherche), 2. Process Couverture VISA (saisir VISA et aller sur le bon lien), 3. Process génération fichier. Sur la page des notes, l'indication « saisir VISA et aller sur le bon lien » est placée avec une accolade qui couvre les process 2 et 3.",
};

// =========================================================================
// PARTIE B : SPÉCIFICITÉS PAR FILIALE ET NOMMAGE DU FICHIER
// =========================================================================
export const OUTGOING_FILIALES_RULES: FilialeOutgoingRule[] = [
  {
    id: "rule_toutes_sauf_gabon",
    filialeName: "Toutes (sauf Gabon)",
    ruleTitle: "Remplacement du préfixe « P »",
    detail:
      "On remplace le « P » du début du fichier par l'intitulé du nom de la filiale <INTITULE_FILIALE>.",
    status: "CONFIRME",
    tagColor: "#3b82f6",
    hasOutgoing: true,
  },
  {
    id: "rule_civ_mali",
    filialeName: "CIV & Mali",
    filialeCode: "CIV / ML",
    ruleTitle: "Deux process LIS supplémentaires",
    detail:
      "Deux process en plus : ① Recouverture LIS ; ② Processus de génération fichier LIS <NOM_FICHIER_LIS>.",
    status: "CONFIRME",
    statusComment: "lecture de « Recouverture » à vérifier",
    tagColor: "#10b981",
    hasOutgoing: true,
    hasLisProcess: true,
  },
  {
    id: "rule_gabon",
    filialeName: "Gabon",
    filialeCode: "GA",
    ruleTitle: "Nom de fichier générique conservé",
    detail:
      "On ne modifie pas le nom du fichier généré, et il est générique (pas de renommage du « P »).",
    status: "CONFIRME",
    statusComment:
      "lecture de la phrase à vérifier, un mot est barré dans les notes",
    tagColor: "#f59e0b",
    hasOutgoing: true,
  },
  {
    id: "rule_comores",
    filialeName: "Comores (KM)",
    filialeCode: "KM",
    ruleTitle: "Aucun flux sortant",
    detail: "Pas de fichier outgoing pour les Comores.",
    status: "CONFIRME",
    tagColor: "#ef4444",
    hasOutgoing: false,
  },
  {
    id: "rule_cameroun",
    filialeName: "Cameroun (CM)",
    filialeCode: "CM",
    ruleTitle: "Périmètre exclusif Cybersource Outgoing",
    detail:
      "Seule filiale concernée par le process CYBERSOURCE_OUTGOING (partie D). Les autres filiales ne sont pas concernées.",
    status: "CONFIRME",
    tagColor: "#8b5cf6",
    hasOutgoing: true,
    hasCybersourceProcess: true,
  },
];

// =========================================================================
// PARTIE C : DÉPÔT DES FICHIERS ET CONTRÔLES AVANT TRANSMISSION
// =========================================================================
export const OUTGOING_DEPOSIT_STEPS: OutgoingDepositStep[] = [
  {
    code: "C1",
    label: "Connexion serveur GIM",
    action: "Pour GIM (CIV et Mali) : se connecter sur le serveur de GIM.",
    status: "CONFIRME",
    statusComment: "lecture de la ligne à vérifier, un symbole est barré",
  },
  {
    code: "C2",
    label: "Dépôt dans outgoing/current",
    action:
      "Pour chaque filiale, déposer les fichiers dans le répertoire outgoing → current.",
    status: "CONFIRME",
  },
  {
    code: "NB",
    label: "Récupération WinSCP",
    action: "Les fichiers doivent être récupérés via WinSCP.",
    status: "CONFIRME",
  },
];

export const OUTGOING_VISA_CONTROLS = {
  title: "Contrôles avant transmission des fichiers VISA [CONFIRMÉ]",
  items: [
    {
      title: "Vérification des fichiers de petite taille",
      detail:
        "Vérifier les fichiers de petite taille : voir s'ils contiennent des transactions. Sinon, on ne peut pas les transmettre (risque de transmission d'un fichier vide).",
    },
    {
      title: "Nombre exact de fichiers attendus",
      detail:
        "Le nombre de fichiers est 6, pour l'ensemble des filiales concernées.",
    },
    {
      title: "Mode de transmission",
      detail:
        "La transmission se fait par mail, pour les fichiers VISA comme pour le fichier Cybersource (destinataire à préciser).",
    },
  ],
};

// =========================================================================
// PARTIE D : PROCESS CYBERSOURCE_OUTGOING (CS), CAMEROUN UNIQUEMENT
// =========================================================================
export const CYBERSOURCE_STEPS: CybersourceStep[] = [
  {
    code: "D1",
    title: "Réception quotidienne",
    description: "On reçoit par mail chaque matin un fichier zippé.",
    status: "CONFIRME",
  },
  {
    code: "D2",
    title: "Récupération locale",
    description: "On récupère le fichier zippé.",
    status: "CONFIRME",
  },
  {
    code: "D3",
    title: "Dépôt serveur CM",
    description:
      "Déposer sur le serveur du Cameroun (CM) pour traitement depuis Payway.",
    status: "CONFIRME",
  },
  {
    code: "D4",
    title: "Connexion Payway",
    description: "Se connecter sur Payway (filiale Cameroun).",
    status: "CONFIRME",
  },
  {
    code: "D5",
    title: "Exécution des 3 sous-process",
    description: "Suivre scrupuleusement les 3 process applicatifs :",
    subProcesses: [
      "a. Intégration fichier Cybersource",
      "b. Réconciliation fichier Cybersource",
      "c. Process génération Visa File Cybersource",
    ],
    status: "CONFIRME",
  },
  {
    code: "D6",
    title: "Définition date J-1",
    description:
      "Pour le nom du fichier, modifier la date, car les fichiers sont générés à la date J-1. On traite les transactions du jour J-1 à la date J : dans le traitement, on définit donc la date J-1.",
    status: "CONFIRME",
  },
  {
    code: "D7",
    title: "Transmission finale",
    description: "Transmettre le fichier par mail (destinataire à préciser).",
    status: "CONFIRME",
  },
];

export const CYBERSOURCE_IWO_ALGORITHM = {
  title: "Contrôle avant transmission du fichier Cybersource [CONFIRMÉ]",
  rule1: "Toujours vérifier le nombre de transactions et le montant.",
  rule2:
    "Lorsque les deux ne concordent pas, vérifier dans le fichier source si le commerçant « IWO » est présent.",
  casePositive: {
    condition: "① Commerçant « IWO » est présent dans le fichier",
    outcome: "AUCUNE ALERTE",
    action:
      "On peut transmettre le fichier en toute sécurité. Les transactions d'IWO ne sont pas en euro, ce qui biaise souvent le calcul des montants totaux.",
    badgeColor: "#10b981",
  },
  caseNegative: {
    condition:
      "② Commerçant « IWO » est ABSENT et les données source / sortie ne correspondent pas",
    outcome: "ANOMALIE BLOQUANTE",
    action: "C'est un problème avéré : voir avec Ulrich immédiatement.",
    badgeColor: "#ef4444",
  },
  nb: "NB [CONFIRMÉ] : Le Cybersource n'est traité que pour le Cameroun, jamais pour les autres filiales.",
};

// =========================================================================
// HYPOTHÈSES À VALIDER [HYPOTHÈSE]
// =========================================================================
export const OUTGOING_HYPOTHESES: OutgoingHypotheseItem[] = [
  {
    id: 1,
    text: "L'ordre d'exécution est strict : Dual (3), puis Couverture VISA (4), puis génération du fichier VISA (5). Pour la CIV et le Mali, les deux process LIS s'ajoutent ensuite.",
    category: "Ordonnancement",
  },
  {
    id: 2,
    text: "L'accolade de la page des notes signifie que « saisir VISA et aller sur le bon lien » vaut aussi pour la génération du fichier (process 3).",
    category: "Interface Payway",
  },
  {
    id: 3,
    text: "Le renommage du « P » concerne le fichier généré à l'étape 5, et le Gabon en est l'exception puisque son fichier garde son nom générique.",
    category: "Nommage",
  },
  {
    id: 4,
    text: "Les process LIS de la CIV et du Mali sont liés au circuit GIM (UEMOA), puisque le fichier LIS apparaît dans la procédure INCOMING GIM.",
    category: "Interconnexion GIM",
  },
  {
    id: 5,
    text: "« Recouverture LIS » désigne la couverture appliquée au fichier LIS, sur le modèle de la Couverture VISA.",
    category: "Sémantique process",
  },
  {
    id: 6,
    text: "Le Dual doit avoir terminé avant de lancer la Couverture VISA, puisqu'il récupère les transactions sur lesquelles elle s'appuie.",
    category: "Dépendance flux",
  },
  {
    id: 7,
    text: "La date J-1 définie dans le traitement est aussi celle qui doit figurer dans le nom du fichier, même si le fichier est généré le jour J. À confirmer.",
    category: "Horodatage",
  },
  {
    id: 8,
    text: "La règle « transactions du jour J-1 traitées à la date J » vaut pour tout le process OUTGOING, pas seulement pour le Cybersource. À confirmer.",
    category: "Règle globale J-1",
  },
  {
    id: 9,
    text: "« Voir avec Ulrich » désigne une personne ou une équipe à contacter, probablement la même que celle dont l'appli est citée dans la procédure INCOMING.",
    category: "Escalade support",
  },
];

// =========================================================================
// RECOMMANDATIONS D'AMÉLIORATION [RECO]
// =========================================================================
export const OUTGOING_RECOMMANDATIONS: OutgoingRecommandationItem[] = [
  {
    id: 1,
    targetProcess: "Tous les process",
    recommendation:
      "Pour chaque process (Dual, Couverture VISA, génération fichier, LIS, Cybersource) : définir l'heure de lancement, la sortie attendue et le contrôle de réussite.",
  },
  {
    id: 2,
    targetProcess: "Process Dual",
    recommendation:
      "Après le Dual : noter le nombre de transactions télécollectées récupérées, pour pouvoir le comparer aux étapes suivantes.",
  },
  {
    id: 3,
    targetProcess: "Nommage des fichiers",
    recommendation:
      "Après le renommage du fichier : vérifier que le « P » a bien été remplacé par le bon intitulé de filiale, et que le fichier du Gabon n'a pas été renommé.",
  },
  {
    id: 4,
    targetProcess: "Contrôle VISA",
    recommendation:
      "Contrôle VISA avant envoi : lister les fichiers (6 attendus) avec leur taille et leur nombre de transactions, pour repérer vite un fichier vide.",
  },
  {
    id: 5,
    targetProcess: "Cybersource traçabilité",
    recommendation:
      "Cybersource : consigner chaque jour le nombre de transactions et le montant du fichier source et du fichier généré, avec la présence ou non du commerçant « IWO ». Cela donne une trace en cas d'écart.",
  },
  {
    id: 6,
    targetProcess: "Cybersource vérification",
    recommendation:
      "Cybersource : comparer d'abord le nombre de transactions, qui n'est pas faussé par la devise, puis le montant en isolant les transactions d'IWO. Cela évite de classer à tort un écart de montant comme alerte.",
  },
  {
    id: 7,
    targetProcess: "Cybersource date",
    recommendation:
      "Cybersource : contrôler le nom du fichier (date modifiée) juste avant transmission, car l'erreur sur la date J-1 est facile à commettre.",
  },
  {
    id: 8,
    targetProcess: "Gouvernance",
    recommendation:
      "Vérifier le statut d'un process avant de le relancer, pour éviter un double traitement.",
  },
  {
    id: 9,
    targetProcess: "Journalisation",
    recommendation:
      "Tenir un journal par filiale et par jour : heure de lancement et statut de chaque process.",
  },
  {
    id: 10,
    targetProcess: "Arbres de diagnostic",
    recommendation:
      "Documenter les cas d'échec de chaque process : c'est la base des futurs arbres de diagnostic.",
  },
];

// =========================================================================
// POINTS OUVERTS (À CONFIRMER)
// =========================================================================
export const OUTGOING_POINTS_OUVERTS: OutgoingPointOuvertItem[] = [
  { id: 1, question: "Sens exact de « Recouverture LIS »" },
  { id: 2, question: "Ordre des 2 process LIS (CIV et Mali) et lien avec le circuit GIM" },
  {
    id: 3,
    question:
      "Liste des intitulés de filiales à utiliser à la place du « P », et fichier concerné par le renommage",
  },
  { id: 4, question: "À quel lien précis mène « saisir VISA et aller sur le bon lien »" },
  { id: 5, question: "Destinataire du mail et échéance de transmission des fichiers VISA générés" },
  { id: 6, question: "Heure de lancement du Dual et périmètre exact des transactions télécollectées" },
  { id: 7, question: "Rôle exact du process Couverture VISA" },
  { id: 8, question: "Dépôt des fichiers : que faire pour les filiales hors GIM (CIV, Mali) ?" },
  {
    id: 9,
    question:
      "Cybersource : le fichier zippé est-il décompressé avant dépôt sur le serveur du Cameroun ?",
  },
  {
    id: 10,
    question:
      "Cybersource : la date du nom du fichier est-elle J-1 (date des transactions) ou J (jour de traitement) ?",
  },
  {
    id: 11,
    question:
      "Cybersource : à qui envoie-t-on le mail avec le fichier ? Qui est Ulrich (personne, équipe) ?",
  },
];

