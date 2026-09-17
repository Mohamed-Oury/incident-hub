export type IncidentStatus = "DRAFT" | "OPEN" | "UNDER_INVESTIGATION" | "RESOLVED" | "CLOSED";
export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type KnowledgeStatus = "REFERENCE_SCENARIO" | "VALIDATED";
export type HypothesisStatus = "OPEN" | "REJECTED" | "PROBABLE" | "CONFIRMED";

export interface FlowStepItem {
  id?: string;
  position: number;
  source: string;
  destination: string;
  event: string;
  status?: string;
  occurredAt?: string;
}

export interface IsoMessageItem {
  id?: string;
  mti?: string;
  bitmap?: string;
  stan?: string;
  rrn?: string;
  responseCode?: string; // DE39
  terminalId?: string; // DE41
  maskedRawMessage?: string;
  fields?: Record<string, any>;
}

export interface HypothesisItem {
  id?: string;
  description: string;
  status: HypothesisStatus;
  evidence?: string;
  createdAt?: string;
}

export interface EvidenceItem {
  id?: string;
  type: string;
  content: string;
  source?: string;
  occurredAt?: string;
  attachmentUrl?: string;
}

export interface RootCauseItem {
  id?: string;
  category: string;
  description: string;
  justification: string;
  validatedAt?: string;
  validatedBy?: string;
}

export interface ResolutionItem {
  id?: string;
  actions: string;
  executor?: string;
  approver?: string;
  result?: string;
}

export interface PreventionItem {
  id?: string;
  action: string;
  owner?: string;
  priority?: string;
  status?: string;
  dueDate?: string;
}

export interface IncidentRecord {
  id: string;
  reference: string;
  title: string;
  description?: string;
  status: IncidentStatus;
  severity: Severity;
  knowledgeStatus: KnowledgeStatus;
  domain?: string;
  channel?: string;
  operation?: string;
  network?: string;
  environment?: string;
  component?: string;
  host?: string;
  errorCode?: string; // e.g. DE39=91
  occurredAt?: string;
  resolvedAt?: string;
  authorId: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
  observations?: Array<{ symptom: string; facts: string; scope?: string; context?: string }>;
  flowSteps?: FlowStepItem[];
  isoMessages?: IsoMessageItem[];
  hypotheses?: HypothesisItem[];
  evidence?: EvidenceItem[];
  rootCause?: RootCauseItem | null;
  resolution?: ResolutionItem | null;
  prevention?: PreventionItem[];
}
