/**
 * Types & structures de données pour le module Monétique Log Analyzer.
 * Conforme au cahier des charges v1.0 (13 novembre 2026).
 */

export interface IsoFieldData {
  id: string;
  name?: string;
  value: string;
  isMasked?: boolean;
}

export interface IsoMessageParsed {
  direction?: "incoming" | "outgoing" | string;
  mti?: string;
  fields: Record<string, string>;
  nestedMessages?: Record<string, Record<string, string>>;
}

export interface ResponseCodeConversion {
  receivedCode: string;
  sendCode: string;
  rawText: string;
}

export interface HexDumpDecoded {
  rawHex: string;
  asciiText: string;
  detectedMti?: string;
  detectedRrn?: string;
  detectedStan?: string;
  detectedText?: string;
}

export type ParseStatus = "success" | "partial" | "error";

export interface LogEvent {
  eventId: string;
  fileId: string;
  timestampRaw: string;
  timestampIso?: string;
  epochMs?: number;
  realm: string;
  eventType: string;
  direction?: "incoming" | "outgoing" | "unknown";
  mti?: string;
  isoFields: Record<string, string>;
  nestedIsoFields?: Record<string, Record<string, string>>;
  responseCodeConversion?: ResponseCodeConversion;
  hexDump?: HexDumpDecoded;
  rawContent: string;
  sourceStart: number;
  sourceEnd: number;
  parseStatus: ParseStatus;
  parseErrorMessage?: string;
}

export type CorrelationLevel =
  | "DIRECT_RRN"
  | "STRONG_STAN_TID"
  | "PROBABLE"
  | "AMBIGUOUS"
  | "NOT_ASSOCIATED";

export interface TransactionEventAssociation {
  event: LogEvent;
  associationType: CorrelationLevel;
  confidenceScore: number; // 0.0 - 1.0
  reason: string;
  delayFromPreviousMs: number;
}

export interface AnomalyItem {
  id: string;
  ruleId: string;
  category: "COMMUNICATION" | "PROCESSING" | "ISO8583" | "TRANSACTIONAL";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  description: string;
  evidenceEventIds: string[];
  recommendation?: string;
}

export interface FieldComparison {
  fieldId: string;
  name: string;
  requestValue?: string;
  responseValue?: string;
  status: "IDENTICAL" | "MODIFIED" | "MISSING_IN_RESPONSE" | "NEW_IN_RESPONSE";
}

export interface RequestResponseComparison {
  requestEventId?: string;
  responseEventId?: string;
  requestMti?: string;
  responseMti?: string;
  fields: FieldComparison[];
  hasDiscrepancy: boolean;
  notes: string[];
}

export interface TransactionCandidate {
  id: string;
  fileId: string;
  rrn: string;
  stan?: string;
  terminalId?: string;
  mtiInitial?: string;
  mtiFinal?: string;
  amount?: string;
  currency?: string;
  cardAcceptor?: string;
  firstTimestamp?: string;
  lastTimestamp?: string;
  durationMs: number;
  eventsCount: number;
  correlationStatus: "CONFIRMED" | "AMBIGUOUS" | "PARTIAL";
  correlationScore: number;
  events: TransactionEventAssociation[];
  anomalies: AnomalyItem[];
  comparison?: RequestResponseComparison;
}

export interface LogFileMetadata {
  id: string;
  filename: string;
  fileHash: string;
  fileSizeBytes: number;
  importedAt: string;
  importedBy?: string;
  status: "PARSING" | "INDEXED" | "ERROR";
  parsedEventCount: number;
  parseErrorCount: number;
  distinctRrnCount: number;
  discoveredRrns: string[];
}

export interface AiDiagnosticReport {
  transactionId: string;
  summary: string;
  observedSymptom: string;
  architectureFlow: string[];
  facts: string[];
  hypotheses: Array<{
    id: string;
    title: string;
    confidence: "TRÈS ÉLEVÉE" | "ÉLEVÉE" | "MOYENNE" | "FAIBLE";
    supportingEvidence: string[];
    potentialCauses: string[];
  }>;
  probableRootCause: string;
  rootCauseConfidence: string;
  missingInformation: string[];
  recommendedVerifications: string[];
  correctiveActions: string[];
  preventiveActions: string[];
  sourceEventReferences: string[];
  generatedAt: string;
  validatedBy?: string;
  validationStatus: "PENDING" | "VALIDATED" | "REJECTED";
}

