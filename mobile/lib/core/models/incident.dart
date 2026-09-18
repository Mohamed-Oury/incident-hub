import 'dart:convert';

class ObservationModel {
  final String symptom;
  final String facts;
  final String? scope;
  final String? context;

  ObservationModel({
    required this.symptom,
    required this.facts,
    this.scope,
    this.context,
  });

  factory ObservationModel.fromJson(Map<String, dynamic> json) {
    return ObservationModel(
      symptom: json['symptom'] as String? ?? '',
      facts: json['facts'] as String? ?? '',
      scope: json['scope'] as String?,
      context: json['context'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'symptom': symptom,
    'facts': facts,
    if (scope != null) 'scope': scope,
    if (context != null) 'context': context,
  };
}

class FlowStepModel {
  final int position;
  final String source;
  final String destination;
  final String event;
  final String? status;

  FlowStepModel({
    required this.position,
    required this.source,
    required this.destination,
    required this.event,
    this.status,
  });

  factory FlowStepModel.fromJson(Map<String, dynamic> json) {
    return FlowStepModel(
      position: json['position'] as int? ?? 1,
      source: json['source'] as String? ?? '',
      destination: json['destination'] as String? ?? '',
      event: json['event'] as String? ?? '',
      status: json['status'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'position': position,
    'source': source,
    'destination': destination,
    'event': event,
    if (status != null) 'status': status,
  };
}

class IsoMessageModel {
  final String? mti;
  final String? bitmap;
  final String? stan;
  final String? rrn;
  final String? responseCode;
  final String? terminalId;
  final String? maskedRawMessage;
  final Map<String, dynamic>? fields;

  IsoMessageModel({
    this.mti,
    this.bitmap,
    this.stan,
    this.rrn,
    this.responseCode,
    this.terminalId,
    this.maskedRawMessage,
    this.fields,
  });

  factory IsoMessageModel.fromJson(Map<String, dynamic> json) {
    return IsoMessageModel(
      mti: json['mti'] as String?,
      bitmap: json['bitmap'] as String?,
      stan: json['stan'] as String?,
      rrn: json['rrn'] as String?,
      responseCode: json['responseCode'] as String?,
      terminalId: json['terminalId'] as String?,
      maskedRawMessage: json['maskedRawMessage'] as String?,
      fields: json['fields'] is Map ? Map<String, dynamic>.from(json['fields'] as Map) : null,
    );
  }

  Map<String, dynamic> toJson() => {
    if (mti != null) 'mti': mti,
    if (bitmap != null) 'bitmap': bitmap,
    if (stan != null) 'stan': stan,
    if (rrn != null) 'rrn': rrn,
    if (responseCode != null) 'responseCode': responseCode,
    if (terminalId != null) 'terminalId': terminalId,
    if (maskedRawMessage != null) 'maskedRawMessage': maskedRawMessage,
    if (fields != null) 'fields': fields,
  };
}

class HypothesisModel {
  final String description;
  final String status;
  final String? evidence;

  HypothesisModel({
    required this.description,
    required this.status,
    this.evidence,
  });

  factory HypothesisModel.fromJson(Map<String, dynamic> json) {
    return HypothesisModel(
      description: json['description'] as String? ?? '',
      status: json['status'] as String? ?? 'OPEN',
      evidence: json['evidence'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'description': description,
    'status': status,
    if (evidence != null) 'evidence': evidence,
  };
}

class EvidenceModel {
  final String type;
  final String content;
  final String? source;

  EvidenceModel({
    required this.type,
    required this.content,
    this.source,
  });

  factory EvidenceModel.fromJson(Map<String, dynamic> json) {
    return EvidenceModel(
      type: json['type'] as String? ?? '',
      content: json['content'] as String? ?? '',
      source: json['source'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'type': type,
    'content': content,
    if (source != null) 'source': source,
  };
}

class RootCauseModel {
  final String category;
  final String description;
  final String justification;
  final String? validatedBy;
  final String? validatedAt;

  RootCauseModel({
    required this.category,
    required this.description,
    required this.justification,
    this.validatedBy,
    this.validatedAt,
  });

  factory RootCauseModel.fromJson(Map<String, dynamic> json) {
    return RootCauseModel(
      category: json['category'] as String? ?? '',
      description: json['description'] as String? ?? '',
      justification: json['justification'] as String? ?? '',
      validatedBy: json['validatedBy'] as String?,
      validatedAt: json['validatedAt'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'category': category,
    'description': description,
    'justification': justification,
    if (validatedBy != null) 'validatedBy': validatedBy,
    if (validatedAt != null) 'validatedAt': validatedAt,
  };
}

class ResolutionModel {
  final String actions;
  final String? executor;
  final String? approver;
  final String? result;

  ResolutionModel({
    required this.actions,
    this.executor,
    this.approver,
    this.result,
  });

  factory ResolutionModel.fromJson(Map<String, dynamic> json) {
    return ResolutionModel(
      actions: json['actions'] as String? ?? '',
      executor: json['executor'] as String?,
      approver: json['approver'] as String?,
      result: json['result'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'actions': actions,
    if (executor != null) 'executor': executor,
    if (approver != null) 'approver': approver,
    if (result != null) 'result': result,
  };
}

class PreventionModel {
  final String action;
  final String? owner;
  final String? priority;
  final String? status;

  PreventionModel({
    required this.action,
    this.owner,
    this.priority,
    this.status,
  });

  factory PreventionModel.fromJson(Map<String, dynamic> json) {
    return PreventionModel(
      action: json['action'] as String? ?? '',
      owner: json['owner'] as String?,
      priority: json['priority'] as String?,
      status: json['status'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'action': action,
    if (owner != null) 'owner': owner,
    if (priority != null) 'priority': priority,
    if (status != null) 'status': status,
  };
}

class IncidentModel {
  final String reference;
  final String title;
  final String description;
  final String status;
  final String severity;
  final String knowledgeStatus;
  final String domain;
  final String channel;
  final String operation;
  final String network;
  final String environment;
  final String component;
  final String host;
  final String errorCode;
  final String analysisKeys;
  final String authorName;
  final bool isCustom;

  final List<ObservationModel> observations;
  final List<FlowStepModel> flowSteps;
  final List<IsoMessageModel> isoMessages;
  final List<HypothesisModel> hypotheses;
  final List<EvidenceModel> evidence;
  final RootCauseModel? rootCause;
  final ResolutionModel? resolution;
  final List<PreventionModel> prevention;

  IncidentModel({
    required this.reference,
    required this.title,
    this.description = '',
    this.status = 'RESOLVED',
    this.severity = 'MEDIUM',
    this.knowledgeStatus = 'VALIDATED',
    required this.domain,
    this.channel = 'GAB/ATM',
    this.operation = 'Transaction ISO 8583',
    this.network = 'VISA / GIMAC',
    this.environment = 'PRODUCTION',
    required this.component,
    this.host = 'HOST-01',
    this.errorCode = 'DE39=05',
    this.analysisKeys = '',
    this.authorName = 'Oury Kohkoun (Expert Monétique)',
    this.isCustom = false,
    this.observations = const [],
    this.flowSteps = const [],
    this.isoMessages = const [],
    this.hypotheses = const [],
    this.evidence = const [],
    this.rootCause,
    this.resolution,
    this.prevention = const [],
  });

  factory IncidentModel.fromJson(Map<String, dynamic> json) {
    final rawKeys = json['analysisKeys'] as String? ?? json['analysis_keys'] as String? ?? json['errorCode'] as String? ?? '';
    
    return IncidentModel(
      reference: json['reference'] as String? ?? '',
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      status: json['status'] as String? ?? 'RESOLVED',
      severity: json['severity'] as String? ?? 'MEDIUM',
      knowledgeStatus: json['knowledgeStatus'] as String? ?? 'VALIDATED',
      domain: json['domain'] as String? ?? 'GAB',
      channel: json['channel'] as String? ?? 'GAB/ATM',
      operation: json['operation'] as String? ?? 'Transaction Monétique ISO 8583',
      network: json['network'] as String? ?? 'VISA / GIMAC / Mastercard',
      environment: json['environment'] as String? ?? 'PRODUCTION',
      component: json['component'] as String? ?? 'Switch',
      host: json['host'] as String? ?? 'HOST-01',
      errorCode: json['errorCode'] as String? ?? json['error_code'] as String? ?? 'DE39=05',
      analysisKeys: rawKeys.isNotEmpty ? rawKeys : (json['errorCode'] as String? ?? 'DE39, STAN'),
      authorName: json['authorName'] as String? ?? json['author_name'] as String? ?? 'Oury Kohkoun (Expert Monétique)',
      isCustom: (json['is_custom'] == 1 || json['isCustom'] == true),
      observations: (json['observations'] as List<dynamic>? ?? [])
          .map((e) => ObservationModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      flowSteps: (json['flowSteps'] as List<dynamic>? ?? [])
          .map((e) => FlowStepModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      isoMessages: (json['isoMessages'] as List<dynamic>? ?? [])
          .map((e) => IsoMessageModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      hypotheses: (json['hypotheses'] as List<dynamic>? ?? [])
          .map((e) => HypothesisModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      evidence: (json['evidence'] as List<dynamic>? ?? [])
          .map((e) => EvidenceModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      rootCause: json['rootCause'] != null ? RootCauseModel.fromJson(json['rootCause'] as Map<String, dynamic>) : null,
      resolution: json['resolution'] != null ? ResolutionModel.fromJson(json['resolution'] as Map<String, dynamic>) : null,
      prevention: (json['prevention'] as List<dynamic>? ?? [])
          .map((e) => PreventionModel.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toMap() {
    final Map<String, dynamic> fullJson = {
      'reference': reference,
      'title': title,
      'description': description,
      'status': status,
      'severity': severity,
      'knowledgeStatus': knowledgeStatus,
      'domain': domain,
      'channel': channel,
      'operation': operation,
      'network': network,
      'environment': environment,
      'component': component,
      'host': host,
      'errorCode': errorCode,
      'analysisKeys': analysisKeys,
      'authorName': authorName,
      'isCustom': isCustom,
      'observations': observations.map((o) => o.toJson()).toList(),
      'flowSteps': flowSteps.map((f) => f.toJson()).toList(),
      'isoMessages': isoMessages.map((m) => m.toJson()).toList(),
      'hypotheses': hypotheses.map((h) => h.toJson()).toList(),
      'evidence': evidence.map((e) => e.toJson()).toList(),
      if (rootCause != null) 'rootCause': rootCause!.toJson(),
      if (resolution != null) 'resolution': resolution!.toJson(),
      'prevention': prevention.map((p) => p.toJson()).toList(),
    };

    return {
      'reference': reference,
      'title': title,
      'domain': domain,
      'component': component,
      'analysis_keys': analysisKeys,
      'knowledge_status': knowledgeStatus,
      'is_custom': isCustom ? 1 : 0,
      'raw_json': jsonEncode(fullJson),
    };
  }

  factory IncidentModel.fromMap(Map<String, dynamic> map) {
    final rawJson = map['raw_json'] as String?;
    if (rawJson != null && rawJson.isNotEmpty) {
      try {
        final decoded = jsonDecode(rawJson) as Map<String, dynamic>;
        return IncidentModel.fromJson(decoded);
      } catch (_) {}
    }

    return IncidentModel(
      reference: map['reference'] as String? ?? '',
      title: map['title'] as String? ?? '',
      domain: map['domain'] as String? ?? 'GAB',
      component: map['component'] as String? ?? 'Switch',
      analysisKeys: map['analysis_keys'] as String? ?? '',
      knowledgeStatus: map['knowledge_status'] as String? ?? 'VALIDATED',
      isCustom: (map['is_custom'] as int? ?? 0) == 1,
    );
  }
}
