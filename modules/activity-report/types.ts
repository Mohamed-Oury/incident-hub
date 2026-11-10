export type SubsidiaryEntity = "SGABS" | "AFG";

export type ActivityStatus = "Terminé" | "En cours" | "Reporté" | "Bloqué" | "Non commencé";

export interface ActivityItem {
  id: string;
  name: string;
  owner: string;
  status: ActivityStatus;
  progress: number; // 0 à 100%
  notes?: string;
}

export interface DayProgress {
  dayName: string; // "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"
  planned: number;
  completed: number;
}

export interface DifficultyActionPair {
  id: string;
  difficulty: string;
  correctiveAction: string;
}

export interface NextWeekGoal {
  id: number;
  title: string;
  deadline: string;
  owner?: string;
}

export interface WeeklyActivityReport {
  id: string;
  subsidiary: SubsidiaryEntity;
  projectName: string;
  weekNumber: number;
  year: number;
  startDate: string; // ex: "02/11/2026" ou "2 novembre 2026"
  endDate: string;   // ex: "06/11/2026" ou "6 novembre 2026"
  authorName: string;
  authorRole: string;
  recipient: string;

  // Slide 2 : Synthèse de la semaine
  executiveSummary: string; // "Semaine conforme au plan ; une tâche est reportée à la semaine prochaine."
  deliveredTasksText?: string; // ex: "9 / 10"
  deliveredTasksLabel?: string; // ex: "tâches livrées"
  completionRateText?: string; // ex: "90 %"
  completionRateLabel?: string; // ex: "taux de réalisation"
  vigilancePointsText?: string; // ex: "1"
  vigilancePointsLabel?: string; // ex: "point de vigilance"

  // Slide 3 : Activités réalisées (Tableau)
  activities: ActivityItem[];

  // Slide 4 : Suivi journalier (Planifié vs Réalisé)
  dailyProgress: DayProgress[];
  dailyTakeaway: string; // "Rythme tenu sur 4 jours sur 5. Une tâche glissée le mercredi, liée à l'indisponibilité des testeurs."

  // Slide 5 : Difficultés et actions correctives
  difficultiesAndActions: DifficultyActionPair[];

  // Slide 6 : Semaine prochaine (S+1)
  nextWeekGoals: NextWeekGoal[];

  createdAt?: string;
}
