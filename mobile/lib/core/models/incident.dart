class IncidentModel {
  final String reference;
  final String title;
  final String domain;
  final String component;
  final String analysisKeys;
  final String knowledgeStatus;
  final bool isCustom;

  IncidentModel({
    required this.reference,
    required this.title,
    required this.domain,
    required this.component,
    required this.analysisKeys,
    required this.knowledgeStatus,
    this.isCustom = false,
  });

  factory IncidentModel.fromJson(Map<String, dynamic> json) {
    return IncidentModel(
      reference: json['reference'] as String? ?? '',
      title: json['title'] as String? ?? '',
      domain: json['domain'] as String? ?? 'GAB',
      component: json['component'] as String? ?? 'Switch',
      analysisKeys: json['analysisKeys'] as String? ?? '',
      knowledgeStatus: json['knowledgeStatus'] as String? ?? 'REFERENCE_SCENARIO',
      isCustom: (json['is_custom'] == 1 || json['isCustom'] == true),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'reference': reference,
      'title': title,
      'domain': domain,
      'component': component,
      'analysis_keys': analysisKeys,
      'knowledge_status': knowledgeStatus,
      'is_custom': isCustom ? 1 : 0,
    };
  }

  factory IncidentModel.fromMap(Map<String, dynamic> map) {
    return IncidentModel(
      reference: map['reference'] as String? ?? '',
      title: map['title'] as String? ?? '',
      domain: map['domain'] as String? ?? 'GAB',
      component: map['component'] as String? ?? 'Switch',
      analysisKeys: map['analysis_keys'] as String? ?? '',
      knowledgeStatus: map['knowledge_status'] as String? ?? 'REFERENCE_SCENARIO',
      isCustom: (map['is_custom'] as int? ?? 0) == 1,
    );
  }
}
