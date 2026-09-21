class TrainingResource {
  final String title;
  final String type;
  final String reference;
  final String description;

  const TrainingResource({
    required this.title,
    required this.type,
    required this.reference,
    required this.description,
  });

  factory TrainingResource.fromJson(Map<String, dynamic> json) {
    return TrainingResource(
      title: json['title'] as String? ?? '',
      type: json['type'] as String? ?? '',
      reference: (json['reference'] ?? json['urlOrRef']) as String? ?? '',
      description: json['description'] as String? ?? '',
    );
  }
}

class TrainingGrade {
  final int level;
  final String gradeCode;
  final String name;
  final String badge;
  final String color;
  final int minPassScorePct;
  final String objective;
  final List<TrainingResource> recommendedResources;

  const TrainingGrade({
    required this.level,
    required this.gradeCode,
    required this.name,
    required this.badge,
    required this.color,
    required this.minPassScorePct,
    required this.objective,
    required this.recommendedResources,
  });

  factory TrainingGrade.fromJson(Map<String, dynamic> json) {
    final rawRes = json['recommendedResources'] as List<dynamic>? ?? [];
    return TrainingGrade(
      level: (json['level'] as num?)?.toInt() ?? 1,
      gradeCode: json['gradeCode'] as String? ?? '',
      name: json['name'] as String? ?? '',
      badge: json['badge'] as String? ?? '',
      color: json['color'] as String? ?? '#3b82f6',
      minPassScorePct: (json['minPassScorePct'] as num?)?.toInt() ?? 80,
      objective: json['objective'] as String? ?? '',
      recommendedResources: rawRes
          .map((r) => TrainingResource.fromJson(r as Map<String, dynamic>))
          .toList(),
    );
  }
}

class TrainingLesson {
  final String id;
  final int gradeLevel;
  final String category;
  final String title;
  final String summary;
  final List<String> keyConcepts;
  final String detailedContent;
  final String technicalSample;
  final String explanation;
  final List<String> goldenRules;
  final List<String> pitfallsToAvoid;

  const TrainingLesson({
    required this.id,
    required this.gradeLevel,
    required this.category,
    required this.title,
    required this.summary,
    required this.keyConcepts,
    required this.detailedContent,
    required this.technicalSample,
    required this.explanation,
    required this.goldenRules,
    required this.pitfallsToAvoid,
  });

  factory TrainingLesson.fromJson(Map<String, dynamic> json) {
    return TrainingLesson(
      id: json['id'] as String? ?? '',
      gradeLevel: (json['gradeLevel'] as num?)?.toInt() ?? 1,
      category: json['category'] as String? ?? '',
      title: json['title'] as String? ?? '',
      summary: json['summary'] as String? ?? '',
      keyConcepts: (json['keyConcepts'] as List<dynamic>? ?? [])
          .map((e) => e.toString())
          .toList(),
      detailedContent: json['detailedContent'] as String? ?? '',
      technicalSample: (json['technicalSample'] ?? json['codeSample']) as String? ?? '',
      explanation: json['explanation'] as String? ?? '',
      goldenRules: (json['goldenRules'] as List<dynamic>? ?? [])
          .map((e) => e.toString())
          .toList(),
      pitfallsToAvoid: (json['pitfallsToAvoid'] as List<dynamic>? ?? [])
          .map((e) => e.toString())
          .toList(),
    );
  }
}

class TrainingExamQuestion {
  final String id;
  final int gradeLevel;
  final String question;
  final List<String> options;
  final int correctIndex;
  final String explanation;
  final String trapWarning;

  const TrainingExamQuestion({
    required this.id,
    required this.gradeLevel,
    required this.question,
    required this.options,
    required this.correctIndex,
    required this.explanation,
    required this.trapWarning,
  });

  factory TrainingExamQuestion.fromJson(Map<String, dynamic> json) {
    return TrainingExamQuestion(
      id: json['id'] as String? ?? '',
      gradeLevel: (json['gradeLevel'] as num?)?.toInt() ?? 1,
      question: json['question'] as String? ?? '',
      options: (json['options'] as List<dynamic>? ?? [])
          .map((e) => e.toString())
          .toList(),
      correctIndex: (json['correctIndex'] as num?)?.toInt() ?? 0,
      explanation: json['explanation'] as String? ?? '',
      trapWarning: json['trapWarning'] as String? ?? '',
    );
  }
}
