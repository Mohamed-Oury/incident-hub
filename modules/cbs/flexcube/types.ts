// modules/cbs/flexcube/types.ts
import { CbsPromptTraceability } from "../router/cbs-context";

export type FlexcubeVersion = "12.4" | "14.x" | "UNCONFIRMED";

export type FlexcubeModule =
  | "ST"   // Static Maintenance (Clients, Agences, Devises)
  | "AC"   // Accounts & Accounting Entries
  | "GL"   // General Ledger
  | "CL"   // Consumer Lending (Prêts)
  | "FT"   // Funds Transfer (Virements)
  | "LC"   // Letters of Credit (Trade Finance)
  | "DE"   // Data Entry (Caisses, Saisie directe)
  | "GW"   // Gateway / Switch Interfaces
  | "AEOD"; // Automated End of Day (Batch)

export interface FlexcubeNeedInput {
  title: string;
  functionalDescription: string;
  module: FlexcubeModule;
  targetUsers: string;
  knownBusinessRules: string;
  inputData: string;
  specialConstraints: string;
  flexcubeVersion: FlexcubeVersion;
  oracleDbVersion?: string;
  environmentType?: "RAD_ODT" | "PLSQL_BACKEND" | "GATEWAY_INTERFACE" | "BATCH_AEOD";
}

export interface FlexcubeFunctionalAnalysis {
  summary: string;
  businessObjective: string;
  targetModule: FlexcubeModule;
  actors: string[];
  preconditions: string[];
  postconditions: string[];
  businessRules: string[];
  requiredData: string[];
  flexcubeDependencies: string[];
  accountingImpacts: string[];
  unresolvedQuestions: string[];
  technicalRisks: string[];
}

export interface FlexcubeSubTask {
  id: string;
  title: string;
  description: string;
  type: "FONCTIONNEL" | "PLSQL_PACKAGE" | "TRIGGER" | "ODT_RAD" | "SQL_DDL" | "TEST_UNITAIRE" | "DOCUMENTATION";
  priority: "BLOQUANTE" | "HAUTE" | "MOYENNE" | "BASSE";
  dependencies: string[];
  estimation: string;
  inputs: string;
  outputs: string;
  acceptanceCriteria: string[];
  concernedObjects: string[];
  status: "A_FAIRE" | "EN_COURS" | "VALIDE" | "A_VALIDER" | "REJETE";
}

export interface FlexcubePlSqlProposal {
  packageName: string;
  packageType: "CUSTOM" | "CLUSTER" | "STANDALONE_PROC";
  packageSpec: string;
  packageBody: string;
  entryPoints: string[];
  errorHandlingStrategy: string;
  autonomousTransactions: boolean;
  performanceConsiderations: string[];
  importantNotes: string[];
}

export interface FlexcubeSqlProposal {
  objective: string;
  targetTables: string[];
  sqlCode: string;
  indexRecommendations: string[];
  rollbackScript: string;
}

export interface FlexcubeTestCase {
  id: string;
  category: "NOMINAL" | "ERREUR_METIER" | "CONCURRENCE_VERROU" | "LIMITES" | "AEOD_COMPAT";
  title: string;
  preconditions: string;
  testSteps: string[];
  expectedResult: string;
  verificationQuery?: string;
  actualStatus: "A_TESTER" | "PASSED" | "FAILED";
}

export interface FlexcubeDeliveryPackage {
  modifiedObjects: string[];
  deploymentOrder: string[];
  grantStatements: string[];
  synonymCreation: string[];
  preDeliveryChecklist: string[];
  postDeliveryChecklist: string[];
  rollbackPlan: string[];
}

export interface FlexcubeFullPlan {
  need: FlexcubeNeedInput;
  analysis: FlexcubeFunctionalAnalysis;
  subTasks: FlexcubeSubTask[];
  plsqlProposal: FlexcubePlSqlProposal;
  sqlProposal: FlexcubeSqlProposal;
  testCases: FlexcubeTestCase[];
  deliveryPackage: FlexcubeDeliveryPackage;
  traceability: CbsPromptTraceability;
  generatedDate: string;
}

export interface FlexcubeTableColumn {
  name: string;
  type: string;
  nullable: boolean;
  description: string;
}

export interface FlexcubeTableDefinition {
  tableName: string;
  module: FlexcubeModule;
  description: string;
  primaryKey: string[];
  foreignKeys?: { column: string; referencesTable: string; referencesColumn: string }[];
  keyColumns: FlexcubeTableColumn[];
  businessRole: string;
  indexingAdvice?: string;
}

export interface FlexcubeAeodStep {
  stepNumber: number;
  phaseCode: "PEOD" | "EOTI" | "EOFI" | "EOD" | "BOD";
  phaseName: string;
  programName: string;
  module: FlexcubeModule;
  description: string;
  estimatedDuration: string;
  criticality: "CRITIQUE" | "HAUTE" | "MOYENNE";
  commonErrors: string[];
}

export interface FlexcubeAeodScenario {
  id: string;
  title: string;
  phase: "PEOD" | "EOTI" | "EOFI" | "EOD" | "BOD";
  symptom: string;
  rootCause: string;
  impact: string;
  sqlDiagnostic: string;
  resolutionSteps: string[];
  prevention: string;
}

export interface FlexcubeIncident {
  id: string;
  reference: string;
  title: string;
  module: FlexcubeModule;
  errorCode: string;
  severity: "P1" | "P2" | "P3";
  symptom: string;
  typicalLog: string;
  rootCause: string;
  investigationQuery: string;
  resolutionProcedure: string[];
  preventionAdvice: string;
}

// Types pour l Antisèche
export type FlexcubeCheatCategory =
  | "ARCHITECTURE"
  | "SCHEMA"
  | "PLSQL"
  | "AEOD"
  | "RUN_INCIDENTS"
  | "GATEWAY";

export interface FlexcubeCheatSection {
  id: number;
  category: FlexcubeCheatCategory;
  title: string;
  short: string;
  badge: string;
  badgeColor: string;
  rawText: string;
  summaryPoints: string[];
  codeSample?: string;
  caveat?: string;
}

// Types pour le Cursus Certifiant
export interface FlexcubeGradeResource {
  title: string;
  type: "ORACLE_DOC" | "GUIDE_ODT" | "BEST_PRACTICE" | "AEOD_RUNBOOK";
  reference: string;
  description: string;
}

export interface FlexcubeGrade {
  level: number;
  gradeCode: string;
  name: string;
  badge: string;
  color: string;
  minPassScorePct: number;
  objective: string;
  recommendedResources: FlexcubeGradeResource[];
}

export interface FlexcubeLesson {
  id: string;
  gradeLevel: number;
  title: string;
  durationMinutes: number;
  module: FlexcubeModule;
  overview: string;
  keyTakeaways: string[];
  contentMarkdown: string;
}

export interface FlexcubeExamQuestion {
  id: string;
  gradeLevel: number;
  module: FlexcubeModule;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  referenceDoc: string;
}
