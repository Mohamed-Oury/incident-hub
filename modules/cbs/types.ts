export interface CbsFunctionalDomain {
  id: string;
  name: string;
  code: string;
  icon: string;
  summary: string;
  businessOperations: string[];
  batchProcesses: string[];
  tables: string[];
  keyRisks: string[];
}

export interface CbsDbError {
  code: string;
  name: string;
  engine: "Oracle" | "Informix";
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  rootCause: string;
  symptom: string;
  diagnosticQueries: string[];
  resolutionSteps: string[];
  prevention: string;
}

export interface CbsBatchStep {
  sequence: number;
  code: string;
  name: string;
  domain: string;
  description: string;
  expectedDuration: string;
  isCritical?: boolean;
}

export interface CbsUnixCommand {
  command: string;
  description: string;
  category: "PROCESS" | "DISK" | "MEMORY" | "LOGS" | "ERROR" | "NETWORK";
  usageExample: string;
  outputInterpretation: string;
}

export interface CbsIncidentModel {
  id: string;
  reference: string;
  title: string;
  domain: string;
  severity: string;
  symptom: string;
  context: string;
  businessImpact: string;
  impactedComponents: string[];
  logEvidence: string;
  hypotheses: string[];
  rootCause: string;
  remediationSteps: string[];
  rollbackOrFallback: string;
  preventionRule: string;
}

export interface CbsQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  points: number;
}

export interface CbsRank {
  level: number;
  name: string;
  minXp: number;
  color: string;
}
