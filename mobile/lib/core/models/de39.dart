class DE39Model {
  final String code;
  final String label;
  final String category;
  final String meaning;
  final String impactIncident;
  final String recommendedAction;

  DE39Model({
    required this.code,
    required this.label,
    required this.category,
    required this.meaning,
    required this.impactIncident,
    required this.recommendedAction,
  });

  factory DE39Model.fromJson(Map<String, dynamic> json) {
    return DE39Model(
      code: json['code'] as String? ?? '',
      label: json['label'] as String? ?? '',
      category: json['category'] as String? ?? 'METIER_PORTEUR',
      meaning: json['meaning'] as String? ?? '',
      impactIncident: json['impactIncident'] as String? ?? '',
      recommendedAction: json['recommendedAction'] as String? ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'code': code,
      'label': label,
      'category': category,
      'meaning': meaning,
      'impact_incident': impactIncident,
      'recommended_action': recommendedAction,
    };
  }

  factory DE39Model.fromMap(Map<String, dynamic> map) {
    return DE39Model(
      code: map['code'] as String? ?? '',
      label: map['label'] as String? ?? '',
      category: map['category'] as String? ?? 'METIER_PORTEUR',
      meaning: map['meaning'] as String? ?? '',
      impactIncident: map['impact_incident'] as String? ?? '',
      recommendedAction: map['recommended_action'] as String? ?? '',
    );
  }
}
