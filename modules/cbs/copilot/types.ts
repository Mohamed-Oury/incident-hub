// modules/cbs/copilot/types.ts

export type AmplitudeVersion = "v10.x" | "v11.x" | "v12.x" | "v13.x" | "Custom";

export interface DevelopmentNeedInput {
  title: string;
  functionalDescription: string;
  bankingDomain: string;
  targetUsers: string;
  knownBusinessRules: string;
  inputData: string;
  expectedOutput: string;
  specialConstraints: string;
  amplitudeVersion: AmplitudeVersion;
  technicalEnvironment: "Informix / AIX" | "Oracle / Linux" | "WebLogic / Tuxedo";
  nominalExample: string;
  errorExample: string;
}

export interface FunctionalAnalysis {
  summary: string;
  businessObjective: string;
  actors: string[];
  preconditions: string[];
  postconditions: string[];
  businessRules: string[];
  requiredData: string[];
  cbsDependencies: string[];
  unresolvedQuestions: string[];
  technicalRisks: string[];
}

export interface CopilotSubTask {
  id: string;
  title: string;
  description: string;
  type: "FONCTIONNEL" | "4GL" | "SQL" | "IHM_PER" | "TEST" | "DOCUMENTATION";
  priority: "BLOQUANTE" | "HAUTE" | "MOYENNE" | "BASSE";
  dependencies: string[];
  estimation: string;
  inputs: string;
  outputs: string;
  acceptanceCriteria: string[];
  concernedFiles: string[];
  status: "A_FAIRE" | "EN_COURS" | "VALIDE";
}

export interface Generated4GlProposal {
  programObjective: string;
  programType: string;
  entryPoint: string;
  parameters: string[];
  variables: string[];
  dataStructures: string[];
  errorHandling: string;
  transactionControl: string;
  loggingStrategy: string;
  code4Gl: string;
  importantNotes: string[];
}

export interface GeneratedPerScreen {
  screenName: string;
  title: string;
  screenType: string;
  dimensions: string;
  inputFieldList: string[];
  readOnlyFieldList: string[];
  buttons: string[];
  messages: string[];
  perCodeSnippet: string;
  visualMockupAscii: string;
  amplitudeIntegrationNotes: string[];
}

export interface GeneratedSqlQuery {
  objective: string;
  targetTables: string[];
  joins: string;
  parameters: string[];
  filters: string;
  performanceRisks: string[];
  securityPrecautions: string[];
  sqlCode: string;
}

export interface CopilotTestCase {
  id: string;
  category: "NOMINAL" | "ERREUR" | "LIMITES" | "DROITS" | "CONCURRENCE" | "NON_REGRESSION";
  title: string;
  preconditions: string;
  testSteps: string[];
  expectedResult: string;
  actualStatus: "A_TESTER" | "PASSED" | "FAILED";
}

export interface DeliveryPackage {
  modifiedFiles: string[];
  parametersToDeclare: string[];
  installationScripts: string[];
  installationOrder: string[];
  preDeliveryChecklist: string[];
  postDeliveryChecklist: string[];
  rollbackPlan: string[];
}

export interface CodeReviewFinding {
  id: string;
  category: "SYNTAXE" | "SECURITE" | "TRANSACTION" | "PERFORMANCE" | "CONVENTIONS";
  severity: "BLOQUANTE" | "MAJEURE" | "MINEURE" | "AMELIORATION";
  location: string;
  description: string;
  explanation: string;
  proposedFix: string;
  validationTest: string;
}

export interface CopilotFullPlan {
  need: DevelopmentNeedInput;
  analysis: FunctionalAnalysis;
  subTasks: CopilotSubTask[];
  code4GlProposal: Generated4GlProposal;
  perScreen: GeneratedPerScreen | null;
  sqlProposal: GeneratedSqlQuery;
  testCases: CopilotTestCase[];
  deliveryPackage: DeliveryPackage;
  generatedDate: string;
}
