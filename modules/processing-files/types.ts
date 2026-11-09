export type ProcessingDirection = "INCOMING" | "OUTGOING";

export type NetworkId = "GIMAC" | "VISA" | "GIM";

export interface GimBranchDetails {
  id: string;
  number: number;
  title: string;
  subSteps?: string[];
  paywaySubProcesses?: string[];
  finalOutcome?: string;
}

export interface ExactBranchFlow {
  id: string;
  title: string;
  scope: string;
  badgeColor: string;
  steps: string[];
}

export interface VisaPaywayAction {
  title: string;
  detail: string;
}

export interface VisaBranchStream {
  id: string;
  title: string;
  filiales?: string;
  appType: string;
  detailProcess?: string;
  finalSteps: string[];
}

export interface VisaWorkflowDetails {
  prePaywaySteps: string[];
  paywayActions: VisaPaywayAction[];
  settlementGenerationTitle: string;
  cleanStepTitle: string;
  streams: VisaBranchStream[];
}

export interface NetworkWorkflowFlow {
  networkId: NetworkId;
  networkName: string;
  shortName: string;
  badge: string;
  zone: string;
  description: string;
  currency: string;
  isDetailedProvided: boolean;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    nodeBg: string;
    accent: string;
    badgeBg: string;
    glow: string;
  };
  rootNodeTitle: string;
  commonPreSteps: string[];
  exactBranches?: ExactBranchFlow[];
  gimBranches?: GimBranchDetails[];
  visaWorkflow?: VisaWorkflowDetails;
}

// =========================================================================
// TYPES PROCÉDURE OUTGOING (RÉFÉRENTIEL DE TERRAIN)
// =========================================================================

export type OutgoingItemStatus = "CONFIRME" | "HYPOTHESE" | "RECO";

export interface OutgoingCommonStep {
  stepNumber: number;
  title: string;
  action: string;
  searchHint?: string;
  status: OutgoingItemStatus;
  note?: string;
}

export interface FilialeOutgoingRule {
  id: string;
  filialeName: string;
  filialeCode?: string;
  ruleTitle: string;
  detail: string;
  status: OutgoingItemStatus;
  statusComment?: string;
  tagColor: string;
  hasOutgoing: boolean;
  hasLisProcess?: boolean;
  hasCybersourceProcess?: boolean;
}

export interface OutgoingDepositStep {
  code: string;
  label: string;
  action: string;
  status: OutgoingItemStatus;
  statusComment?: string;
}

export interface CybersourceStep {
  code: string;
  title: string;
  description: string;
  status: OutgoingItemStatus;
  subProcesses?: string[];
}

export interface OutgoingHypotheseItem {
  id: number;
  text: string;
  category?: string;
}

export interface OutgoingRecommandationItem {
  id: number;
  targetProcess: string;
  recommendation: string;
}

export interface OutgoingPointOuvertItem {
  id: number;
  question: string;
  context?: string;
}
