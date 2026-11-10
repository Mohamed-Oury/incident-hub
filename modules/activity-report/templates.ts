import { WeeklyActivityReport } from "./types";

// ============================================================================
// 1. MODÈLE ISSU DU POWERPOINT FOURNI EN PIÈCE JOINTE (PROJET ALPHA)
// ============================================================================
export const SAMPLE_PROJET_ALPHA: WeeklyActivityReport = {
  id: "CRA-ALPHA-S45-2026",
  subsidiary: "SGABS",
  projectName: "Projet Alpha",
  weekNumber: 45,
  year: 2026,
  startDate: "2 novembre 2026",
  endDate: "6 novembre 2026",
  authorName: "Mohamed Diallo",
  authorRole: "Lead Support & Exploitation Monétique",
  recipient: "Management & Direction des Systèmes d'Information",
  executiveSummary: "Semaine conforme au plan ; une tâche est reportée à la semaine prochaine.",
  deliveredTasksText: "9 / 10",
  deliveredTasksLabel: "tâches livrées",
  completionRateText: "90 %",
  completionRateLabel: "taux de réalisation",
  vigilancePointsText: "1",
  vigilancePointsLabel: "point de vigilance",
  activities: [
    {
      id: "act-1",
      name: "Refonte du module de facturation",
      owner: "Awa K.",
      status: "Terminé",
      progress: 100,
    },
    {
      id: "act-2",
      name: "Migration de la base de données",
      owner: "Yao T.",
      status: "Terminé",
      progress: 100,
    },
    {
      id: "act-3",
      name: "Recette utilisateur",
      owner: "Fatou S.",
      status: "En cours",
      progress: 70,
    },
    {
      id: "act-4",
      name: "Documentation technique",
      owner: "Ibrahim D.",
      status: "En cours",
      progress: 55,
    },
    {
      id: "act-5",
      name: "Déploiement en préproduction",
      owner: "Awa K.",
      status: "Reporté",
      progress: 20,
    },
  ],
  dailyProgress: [
    { dayName: "Lundi", planned: 2, completed: 2 },
    { dayName: "Mardi", planned: 2, completed: 2 },
    { dayName: "Mercredi", planned: 2, completed: 1 },
    { dayName: "Jeudi", planned: 2, completed: 2 },
    { dayName: "Vendredi", planned: 2, completed: 2 },
  ],
  dailyTakeaway: "Rythme tenu sur 4 jours sur 5. Une tâche glissée le mercredi, liée à l'indisponibilité des testeurs.",
  difficultiesAndActions: [
    {
      id: "diff-1",
      difficulty: "Disponibilité limitée des utilisateurs pour la recette",
      correctiveAction: "Planifier des créneaux de recette dédiés",
    },
    {
      id: "diff-2",
      difficulty: "Écarts de données lors de la migration",
      correctiveAction: "Ajouter un contrôle de cohérence automatique",
    },
    {
      id: "diff-3",
      difficulty: "Environnement de préproduction instable",
      correctiveAction: "Stabiliser l'environnement avec l'équipe infra",
    },
  ],
  nextWeekGoals: [
    {
      id: 1,
      title: "Finaliser la recette",
      deadline: "Clôture prévue mardi 10 novembre",
    },
    {
      id: 2,
      title: "Compléter la documentation",
      deadline: "Version finale jeudi 12 novembre",
    },
    {
      id: 3,
      title: "Déployer en préproduction",
      deadline: "Vendredi 13 novembre",
    },
    {
      id: 4,
      title: "Préparer la mise en production",
      deadline: "Point Go/No-Go la semaine du 16",
    },
  ],
};

// ============================================================================
// 2. MODÈLE SGABS (SOCIÉTÉ GÉNÉRALE)
// ============================================================================
export const SAMPLE_SGABS_REPORT: WeeklyActivityReport = {
  id: "CRA-SGABS-S45-2026",
  subsidiary: "SGABS",
  projectName: "Monétique SGABS & Core Banking Amplitude",
  weekNumber: 45,
  year: 2026,
  startDate: "2 novembre 2026",
  endDate: "6 novembre 2026",
  authorName: "Mohamed Diallo",
  authorRole: "Lead Support & Exploitation Monétique (SGCI, SGSN, SGCAM, SGT, SGB, SGC)",
  recipient: "Potey Dohai (Resp. Monétique) · Gbide Andrienne (Resp. Adjoint)",
  executiveSummary: "Semaine conforme aux objectifs opérationnels. Forte réactivité sur les verrous base Amplitude et l'audit conformité HSM. Un report sur la recette Visa Base II en attente des retours réseau.",
  deliveredTasksText: "8 / 9",
  deliveredTasksLabel: "tâches livrées",
  completionRateText: "89 %",
  completionRateLabel: "taux de réalisation",
  vigilancePointsText: "1",
  vigilancePointsLabel: "point de vigilance",
  activities: [
    {
      id: "sg-1",
      name: "Résolution des verrous Amplitude ORA-00054 & script kill cnx",
      owner: "Mohamed D.",
      status: "Terminé",
      progress: 100,
    },
    {
      id: "sg-2",
      name: "Audit conformité clés LMK & rotation PayShield 10K",
      owner: "Mohamed D.",
      status: "Terminé",
      progress: 100,
    },
    {
      id: "sg-3",
      name: "Intégration Cybersource 3DSv2 (CAVV / ECI 05)",
      owner: "Yao T.",
      status: "En cours",
      progress: 75,
    },
    {
      id: "sg-4",
      name: "Supervision batch compensation Visa Base II & trailer 99",
      owner: "Awa K.",
      status: "Terminé",
      progress: 100,
    },
    {
      id: "sg-5",
      name: "Recette rapprochement bancaire interbancaire SGCI",
      owner: "Fatou S.",
      status: "Reporté",
      progress: 35,
    },
  ],
  dailyProgress: [
    { dayName: "Lundi", planned: 2, completed: 2 },
    { dayName: "Mardi", planned: 2, completed: 2 },
    { dayName: "Mercredi", planned: 2, completed: 1 },
    { dayName: "Jeudi", planned: 2, completed: 2 },
    { dayName: "Vendredi", planned: 1, completed: 1 },
  ],
  dailyTakeaway: "Rythme opérationnel tenu sur 4 jours sur 5. Décalage mercredi suite à une analyse d'urgence sur un verrou batch Amplitude.",
  difficultiesAndActions: [
    {
      id: "sg-diff-1",
      difficulty: "Délai de retour Visa International sur la validation du trailer Base II",
      correctiveAction: "Relance quotidienne auprès du Technical Account Manager Visa",
    },
    {
      id: "sg-diff-2",
      difficulty: "Verrous concurrents en batch de fin de journée sur Amplitude 4GL",
      correctiveAction: "Ajustement du runbook d'exploitation et surveillance des sessions bloquantes",
    },
    {
      id: "sg-diff-3",
      difficulty: "Indisponibilité temporaire du banc de test HSM PayShield",
      correctiveAction: "Planification des créneaux de tests crypto hors heures ouvrées",
    },
  ],
  nextWeekGoals: [
    {
      id: 1,
      title: "Finaliser la recette 3DSv2 Cybersource",
      deadline: "Clôture prévue mardi 10 novembre",
    },
    {
      id: 2,
      title: "Finaliser l'audit trimestriel LMK avec la Sécurité",
      deadline: "Validation jeudi 12 novembre",
    },
    {
      id: 3,
      title: "Déployer le patch de supervision clearing Visa",
      deadline: "Vendredi 13 novembre",
    },
    {
      id: 4,
      title: "Préparer le comité mensuel Monétique SGABS",
      deadline: "Point prévu la semaine du 16",
    },
  ],
};

// ============================================================================
// 3. MODÈLE AFG BANK (ATLANTIC FINANCIAL GROUP)
// ============================================================================
export const SAMPLE_AFG_REPORT: WeeklyActivityReport = {
  id: "CRA-AFG-S45-2026",
  subsidiary: "AFG",
  projectName: "Monétique & Clearing AFG Bank (CEMAC & UEMOA)",
  weekNumber: 45,
  year: 2026,
  startDate: "2 novembre 2026",
  endDate: "6 novembre 2026",
  authorName: "Mohamed Diallo",
  authorRole: "Lead Support & Exploitation Monétique",
  recipient: "Direction Générale & Direction Monétique AFG Bank",
  executiveSummary: "Excellente progression sur les chantiers de clearing GIMAC (Gabon, Cameroun) et Visa. Une vigilance sur la livraison des cartes de test sans contact reportée à S+1.",
  deliveredTasksText: "7 / 8",
  deliveredTasksLabel: "tâches livrées",
  completionRateText: "88 %",
  completionRateLabel: "taux de réalisation",
  vigilancePointsText: "1",
  vigilancePointsLabel: "point de vigilance",
  activities: [
    {
      id: "afg-1",
      name: "Synchronisation key/salt Payway ama-gabon-core & redémarrage",
      owner: "Mohamed D.",
      status: "Terminé",
      progress: 100,
    },
    {
      id: "afg-2",
      name: "Contrôle des flux clearing GIMAC (CEMAC) et GIM (UEMOA)",
      owner: "Ibrahim D.",
      status: "Terminé",
      progress: 100,
    },
    {
      id: "afg-3",
      name: "Intégration e-commerce marchand IWO Cybersource Cameroun",
      owner: "Awa K.",
      status: "En cours",
      progress: 80,
    },
    {
      id: "afg-4",
      name: "Génération automatique des fichiers Outgoing Clearing Visa",
      owner: "Mohamed D.",
      status: "Terminé",
      progress: 100,
    },
    {
      id: "afg-5",
      name: "Recette homologation TPE sans contact Pax A920",
      owner: "Fatou S.",
      status: "Reporté",
      progress: 30,
    },
  ],
  dailyProgress: [
    { dayName: "Lundi", planned: 2, completed: 2 },
    { dayName: "Mardi", planned: 2, completed: 2 },
    { dayName: "Mercredi", planned: 1, completed: 1 },
    { dayName: "Jeudi", planned: 2, completed: 1 },
    { dayName: "Vendredi", planned: 1, completed: 1 },
  ],
  dailyTakeaway: "Rythme tenu sur 4 jours sur 5. Un report le jeudi sur l'homologation TPE causé par l'attente du profil carte constructeur.",
  difficultiesAndActions: [
    {
      id: "afg-diff-1",
      difficulty: "Rejets ponctuels de trames GIMAC 0200 en heure de pointe",
      correctiveAction: "Augmentation du timeout socket à 45s sur la passerelle frontale",
    },
    {
      id: "afg-diff-2",
      difficulty: "Retard d'acheminement des cartes de test bancaires constructeur",
      correctiveAction: "Escalade et suivi prioritaire auprès du fournisseur Pax",
    },
    {
      id: "afg-diff-3",
      difficulty: "Écarts de lettrage sur les règlements interbancaires GIM-UEMOA",
      correctiveAction: "Automatisation du script de rapprochement SQL quotidien",
    },
  ],
  nextWeekGoals: [
    {
      id: 1,
      title: "Finaliser la recette e-commerce IWO Cameroun",
      deadline: "Clôture prévue mardi 10 novembre",
    },
    {
      id: 2,
      title: "Mise en service du script Outgoing Clearing Visa",
      deadline: "Déploiement jeudi 12 novembre",
    },
    {
      id: 3,
      title: "Reprise des tests TPE sans contact avec profil validé",
      deadline: "Vendredi 13 novembre",
    },
    {
      id: 4,
      title: "Revue mensuelle des SLA de compensation GIMAC",
      deadline: "Point prévu la semaine du 16",
    },
  ],
};
