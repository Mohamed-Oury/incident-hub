// modules/training-monetique/types.ts

export type MonetiqueGradeLevel = 1 | 2 | 3 | 4 | 5;

export interface MonetiqueResource {
  title: string;
  type: "STANDARD_ISO" | "SPEC_EMV" | "GUIDE_GIM" | "DOC_SCHEME" | "MANUEL_HSM";
  reference: string;
  description: string;
}

export interface MonetiqueGrade {
  level: MonetiqueGradeLevel;
  gradeCode: "APPRENTI" | "JUNIOR" | "CONFIRME" | "SENIOR" | "EXPERT";
  name: string;
  badge: string;
  color: string;
  minPassScorePct: number;
  objective: string;
  recommendedResources: MonetiqueResource[];
}

export interface MonetiqueLesson {
  id: string;
  gradeLevel: MonetiqueGradeLevel;
  category: "ISO8583" | "EMV_CARTE" | "ATM_POS" | "HSM_SECURITE" | "CLEARING_COMPENSATION";
  title: string;
  summary: string;
  keyConcepts: string[];
  detailedContent: string;
  technicalSample: string;
  explanation: string;
  goldenRules: string[];
  pitfallsToAvoid: string[];
}

export interface MonetiqueExamQuestion {
  id: string;
  gradeLevel: MonetiqueGradeLevel;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  trapWarning: string;
}
