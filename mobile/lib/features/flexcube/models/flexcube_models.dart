// Modèles de données pour l'Univers Oracle FLEXCUBE

enum FlexcubeModule {
  st, // Static Maintenance (Clients, Agences, Devises)
  ac, // Accounts & Accounting Entries
  gl, // General Ledger
  cl, // Consumer Lending (Prêts)
  ft, // Funds Transfer (Virements)
  lc, // Letters of Credit
  de, // Data Entry
  gw, // Gateway / Switch Interfaces
  aeod, // Automated End of Day (Batch)
}

class FlexcubeTableColumn {
  final String name;
  final String type;
  final bool nullable;
  final String description;

  const FlexcubeTableColumn({
    required this.name,
    required this.type,
    required this.nullable,
    required this.description,
  });
}

class FlexcubeTableDefinition {
  final String tableName;
  final String module;
  final String description;
  final List<String> primaryKey;
  final List<FlexcubeTableColumn> keyColumns;
  final String businessRole;
  final String? indexingAdvice;

  const FlexcubeTableDefinition({
    required this.tableName,
    required this.module,
    required this.description,
    required this.primaryKey,
    required this.keyColumns,
    required this.businessRole,
    this.indexingAdvice,
  });
}

class FlexcubeAeodStep {
  final int stepNumber;
  final String phaseCode; // PEOD, EOTI, EOFI, EOD, BOD
  final String phaseName;
  final String programName;
  final String module;
  final String description;
  final String estimatedDuration;
  final String criticality; // CRITIQUE, HAUTE, MOYENNE
  final List<String> commonErrors;

  const FlexcubeAeodStep({
    required this.stepNumber,
    required this.phaseCode,
    required this.phaseName,
    required this.programName,
    required this.module,
    required this.description,
    required this.estimatedDuration,
    required this.criticality,
    required this.commonErrors,
  });
}

class FlexcubeAeodScenario {
  final String id;
  final String title;
  final String phase;
  final String symptom;
  final String rootCause;
  final String impact;
  final String sqlDiagnostic;
  final List<String> resolutionSteps;
  final String prevention;

  const FlexcubeAeodScenario({
    required this.id,
    required this.title,
    required this.phase,
    required this.symptom,
    required this.rootCause,
    required this.impact,
    required this.sqlDiagnostic,
    required this.resolutionSteps,
    required this.prevention,
  });
}

class FlexcubeIncident {
  final String id;
  final String reference;
  final String title;
  final String module;
  final String errorCode;
  final String severity; // P1, P2, P3
  final String symptom;
  final String typicalLog;
  final String rootCause;
  final String investigationQuery;
  final List<String> resolutionProcedure;
  final String preventionAdvice;

  const FlexcubeIncident({
    required this.id,
    required this.reference,
    required this.title,
    required this.module,
    required this.errorCode,
    required this.severity,
    required this.symptom,
    required this.typicalLog,
    required this.rootCause,
    required this.investigationQuery,
    required this.resolutionProcedure,
    required this.preventionAdvice,
  });
}

class FlexcubeCheatSection {
  final int id;
  final String category; // ARCHITECTURE, SCHEMA, PLSQL, AEOD, RUN_INCIDENTS, GATEWAY
  final String title;
  final String short;
  final String badge;
  final String badgeColor;
  final String rawText;
  final List<String> summaryPoints;
  final String? codeSample;
  final String? caveat;

  const FlexcubeCheatSection({
    required this.id,
    required this.category,
    required this.title,
    required this.short,
    required this.badge,
    required this.badgeColor,
    required this.rawText,
    required this.summaryPoints,
    this.codeSample,
    this.caveat,
  });
}

class FlexcubeGradeResource {
  final String title;
  final String type;
  final String reference;
  final String description;

  const FlexcubeGradeResource({
    required this.title,
    required this.type,
    required this.reference,
    required this.description,
  });
}

class FlexcubeGrade {
  final int level;
  final String gradeCode;
  final String name;
  final String badge;
  final String color;
  final int minPassScorePct;
  final String objective;
  final List<FlexcubeGradeResource> recommendedResources;

  const FlexcubeGrade({
    required this.level,
    required this.gradeCode,
    required this.name,
    required this.badge,
    required this.color,
    required this.minPassScorePct,
    required this.objective,
    required this.recommendedResources,
  });
}

class FlexcubeLesson {
  final String id;
  final int gradeLevel;
  final String title;
  final int durationMinutes;
  final String module;
  final String overview;
  final List<String> keyTakeaways;
  final String contentMarkdown;

  const FlexcubeLesson({
    required this.id,
    required this.gradeLevel,
    required this.title,
    required this.durationMinutes,
    required this.module,
    required this.overview,
    required this.keyTakeaways,
    required this.contentMarkdown,
  });
}

class FlexcubeExamQuestion {
  final String id;
  final int gradeLevel;
  final String module;
  final String question;
  final List<String> options;
  final int correctIndex;
  final String explanation;
  final String referenceDoc;

  const FlexcubeExamQuestion({
    required this.id,
    required this.gradeLevel,
    required this.module,
    required this.question,
    required this.options,
    required this.correctIndex,
    required this.explanation,
    required this.referenceDoc,
  });
}

class FlexcubePlSqlReviewIssue {
  final String severity; // CRITICAL, WARNING, INFO
  final String rule;
  final String message;
  final String recommendation;

  const FlexcubePlSqlReviewIssue({
    required this.severity,
    required this.rule,
    required this.message,
    required this.recommendation,
  });
}
