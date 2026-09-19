/// Modèle pour un domaine fonctionnel Core Banking (Client/KYC, Comptes, Dépôts, Crédits, etc.)
class CbsFunctionalDomain {
  final String id;
  final String name;
  final String code;
  final String icon;
  final String summary;
  final List<String> businessOperations;
  final List<String> batchProcesses;
  final List<String> tables;
  final List<String> keyRisks;

  const CbsFunctionalDomain({
    required this.id,
    required this.name,
    required this.code,
    required this.icon,
    required this.summary,
    required this.businessOperations,
    required this.batchProcesses,
    required this.tables,
    required this.keyRisks,
  });
}

/// Modèle pour une erreur Oracle / Informix avec diagnostic et procédure de résolution
class CbsDbError {
  final String code; // ex: ORA-00054
  final String name; // resource busy and acquire with NOWAIT
  final String engine; // Oracle ou Informix
  final String severity; // CRITICAL, HIGH, MEDIUM
  final String rootCause;
  final String symptom;
  final List<String> diagnosticQueries;
  final List<String> resolutionSteps;
  final String prevention;

  const CbsDbError({
    required this.code,
    required this.name,
    required this.engine,
    required this.severity,
    required this.rootCause,
    required this.symptom,
    required this.diagnosticQueries,
    required this.resolutionSteps,
    required this.prevention,
  });
}

/// Étape d'un Batch EOD/BOD (Fin de Journée / Début de Journée)
class CbsBatchStep {
  final int sequence;
  final String code;
  final String name;
  final String domain;
  final String description;
  final String expectedDuration;
  final bool isCritical;

  const CbsBatchStep({
    required this.sequence,
    required this.code,
    required this.name,
    required this.domain,
    required this.description,
    required this.expectedDuration,
    this.isCritical = true,
  });
}

/// Commande Unix / AIX pour l'exploitation bancaire
class CbsUnixCommand {
  final String command;
  final String description;
  final String category; // PROCESS, MEMORY, DISK, LOGS, NETWORK, ERROR
  final String usageExample;
  final String outputInterpretation;

  const CbsUnixCommand({
    required this.command,
    required this.description,
    required this.category,
    required this.usageExample,
    required this.outputInterpretation,
  });
}

/// Modèle d'Incident CBS avec la méthodologie RCA bancaire
class CbsIncidentModel {
  final String id;
  final String reference; // ex: CBS-INC-001
  final String title;
  final String domain; // EOD Batch, Oracle, Comptes, Crédits, Interfaces
  final String severity; // P1 - CRITICAL, P2 - MAJOR, P3 - MEDIUM
  final String symptom;
  final String context;
  final String businessImpact;
  final List<String> impactedComponents;
  final String logEvidence;
  final List<String> hypotheses;
  final String rootCause;
  final List<String> remediationSteps;
  final String rollbackOrFallback;
  final String preventionRule;

  const CbsIncidentModel({
    required this.id,
    required this.reference,
    required this.title,
    required this.domain,
    required this.severity,
    required this.symptom,
    required this.context,
    required this.businessImpact,
    required this.impactedComponents,
    required this.logEvidence,
    required this.hypotheses,
    required this.rootCause,
    required this.remediationSteps,
    required this.rollbackOrFallback,
    required this.preventionRule,
  });
}

/// Question de Quiz CBS
class CbsQuizQuestion {
  final String id;
  final String question;
  final List<String> options;
  final int correctIndex;
  final String explanation;
  final String category; // Architecture, Batch/EOD, Oracle/DB, 4GL/Java, AIX, Fonctionnel
  final int points;

  const CbsQuizQuestion({
    required this.id,
    required this.question,
    required this.options,
    required this.correctIndex,
    required this.explanation,
    required this.category,
    this.points = 20,
  });
}
