import 'package:flutter/material.dart';
import '../../core/database/app_database.dart';
import '../../core/models/incident.dart';
import '../../core/theme/app_theme.dart';

class IncidentDetailScreen extends StatefulWidget {
  final IncidentModel incident;

  const IncidentDetailScreen({super.key, required this.incident});

  @override
  State<IncidentDetailScreen> createState() => _IncidentDetailScreenState();
}

class _IncidentDetailScreenState extends State<IncidentDetailScreen> {
  late IncidentModel _incident;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _incident = widget.incident;
    if (_incident.observations.isEmpty || _incident.flowSteps.isEmpty) {
      _loadFullIncident();
    }
  }

  Future<void> _loadFullIncident() async {
    setState(() => _isLoading = true);
    final full = await AppDatabase.instance.getIncident(widget.incident.reference);
    if (mounted && full != null) {
      setState(() {
        _incident = full;
        _isLoading = false;
      });
    } else if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isValidated = _incident.knowledgeStatus == 'VALIDATED';
    final isCritical = _incident.severity == 'CRITICAL';

    return Scaffold(
      appBar: AppBar(
        title: Text('${_incident.reference} — Détails'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.sgRed))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // EN-TÊTE : Badges techniques, statuts & criticité (Style SG)
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.darkCard,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppTheme.borderDark),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: AppTheme.sgRed.withValues(alpha: 0.15),
                                    borderRadius: BorderRadius.circular(6),
                                    border: Border.all(color: AppTheme.sgRed.withValues(alpha: 0.4)),
                                  ),
                                  child: Text(
                                    _incident.reference,
                                    style: const TextStyle(
                                      color: AppTheme.sgRed,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF111827),
                                    borderRadius: BorderRadius.circular(6),
                                    border: Border.all(color: AppTheme.borderDark),
                                  ),
                                  child: Text(
                                    'Canal: ${_incident.domain}',
                                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                                  ),
                                ),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: isCritical
                                    ? AppTheme.sgRed.withValues(alpha: 0.2)
                                    : AppTheme.warningOrange.withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(
                                  color: isCritical
                                      ? AppTheme.sgRed.withValues(alpha: 0.5)
                                      : AppTheme.warningOrange.withValues(alpha: 0.5),
                                ),
                              ),
                              child: Text(
                                'Criticité: ${_incident.severity}',
                                style: TextStyle(
                                  color: isCritical ? AppTheme.sgRed : AppTheme.warningOrange,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 11,
                                ),
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 12),

                        Text(
                          _incident.title,
                          style: const TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            height: 1.3,
                          ),
                        ),

                        if (_incident.description.isNotEmpty) ...[
                          const SizedBox(height: 8),
                          Text(
                            _incident.description,
                            style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13, height: 1.4),
                          ),
                        ],

                        const SizedBox(height: 12),
                        const Divider(color: AppTheme.borderDark),
                        const SizedBox(height: 10),

                        // Metadata badges
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            _buildChipMeta('Composant', _incident.component),
                            if (_incident.errorCode.isNotEmpty) _buildChipMeta('Erreur', _incident.errorCode, isCode: true),
                            if (_incident.host.isNotEmpty) _buildChipMeta('Hôte', _incident.host),
                            if (_incident.network.isNotEmpty) _buildChipMeta('Réseau', _incident.network),
                            _buildChipMeta('Statut', isValidated ? '✓ Validé' : 'Scénario', isSuccess: isValidated),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // ÉTAPE 1 : Symptômes & Faits Observés
                  _buildStepCard(
                    icon: '🔍',
                    title: '1. Symptômes & Faits Observés sur le Terrain',
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: _incident.observations.isNotEmpty
                          ? _incident.observations.map((obs) => Container(
                                margin: const EdgeInsets.only(bottom: 10),
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF111827),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: AppTheme.borderDark),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    _buildSubHeader('SYMPTÔME PERÇU', AppTheme.sgRed),
                                    Text(obs.symptom, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500)),
                                    const SizedBox(height: 8),
                                    _buildSubHeader('FAITS OBJECTIFS MESURÉS', AppTheme.textMuted),
                                    Text(obs.facts, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                                    if (obs.scope != null && obs.scope!.isNotEmpty) ...[
                                      const SizedBox(height: 8),
                                      _buildSubHeader('PÉRIMÈTRE TECHNIQUE', AppTheme.textMuted),
                                      Text(obs.scope!, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                                    ],
                                  ],
                                ),
                              )).toList()
                          : [const Text('Aucune observation terrain documentée.', style: TextStyle(color: AppTheme.textMuted))],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // ÉTAPE 2 : Flux Transactionnel & Visualisation du Point de Rupture
                  _buildStepCard(
                    icon: '⛓️',
                    title: '2. Flux Transactionnel & Point de Rupture',
                    subtitle: 'Ordre séquentiel et rupture d\'acheminement',
                    child: Column(
                      children: _incident.flowSteps.isNotEmpty
                          ? _incident.flowSteps.map((step) {
                              final isBroken = step.status == 'TIMEOUT_BLOCKED' ||
                                  step.status == 'ERROR' ||
                                  step.status == 'POINT_DE_RUPTURE';

                              return Container(
                                margin: const EdgeInsets.only(bottom: 8),
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: isBroken ? AppTheme.sgRed.withValues(alpha: 0.1) : const Color(0xFF111827),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: isBroken ? AppTheme.sgRed.withValues(alpha: 0.4) : AppTheme.borderDark,
                                  ),
                                ),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    CircleAvatar(
                                      radius: 11,
                                      backgroundColor: isBroken ? AppTheme.sgRed : AppTheme.successGreen,
                                      child: Text(
                                        '${step.position}',
                                        style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            children: [
                                              Text(step.source, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                                              const Text(' ➔ ', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                                              Text(step.destination, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                                            ],
                                          ),
                                          const SizedBox(height: 3),
                                          Text(
                                            step.event,
                                            style: TextStyle(
                                              color: isBroken ? const Color(0xFFFECDD3) : AppTheme.textSecondary,
                                              fontSize: 12,
                                              fontWeight: isBroken ? FontWeight.w600 : FontWeight.normal,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    if (step.status != null)
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: isBroken ? AppTheme.sgRed.withValues(alpha: 0.2) : Colors.white10,
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: Text(
                                          step.status!,
                                          style: TextStyle(
                                            color: isBroken ? AppTheme.sgRed : AppTheme.successGreen,
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                  ],
                                ),
                              );
                            }).toList()
                          : [const Text('Aucune étape de flux documentée.', style: TextStyle(color: AppTheme.textMuted))],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // ÉTAPE 3 : Trames ISO 8583 & Éléments de Données (DE)
                  _buildStepCard(
                    icon: '💳',
                    title: '3. Trames ISO 8583 & Éléments de Données',
                    subtitle: '🛡️ Filtrage PCI-DSS actif',
                    child: Column(
                      children: _incident.isoMessages.isNotEmpty
                          ? _incident.isoMessages.map((msg) => Container(
                                margin: const EdgeInsets.only(bottom: 10),
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF0A0A0C),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: const Color(0xFF27272A)),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text('MTI: ${msg.mti ?? "—"}', style: const TextStyle(color: AppTheme.successGreen, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
                                        Text('STAN: ${msg.stan ?? "—"}', style: const TextStyle(color: AppTheme.textSecondary, fontFamily: 'monospace', fontSize: 12)),
                                        Text('DE39: ${msg.responseCode ?? "—"}', style: const TextStyle(color: AppTheme.sgRed, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
                                      ],
                                    ),
                                    if (msg.maskedRawMessage != null && msg.maskedRawMessage!.isNotEmpty) ...[
                                      const SizedBox(height: 8),
                                      Text(
                                        msg.maskedRawMessage!,
                                        style: const TextStyle(color: Color(0xFFA1A1AA), fontSize: 11, fontFamily: 'monospace'),
                                      ),
                                    ],
                                    if (msg.fields != null && msg.fields!.isNotEmpty) ...[
                                      const SizedBox(height: 8),
                                      const Divider(color: Color(0xFF1F2937)),
                                      Wrap(
                                        spacing: 6,
                                        runSpacing: 4,
                                        children: msg.fields!.entries.map((e) => Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                                              decoration: BoxDecoration(
                                                color: const Color(0xFF1F2937),
                                                borderRadius: BorderRadius.circular(4),
                                              ),
                                              child: Text('${e.key}: ${e.value}', style: const TextStyle(color: AppTheme.successGreen, fontSize: 10, fontFamily: 'monospace')),
                                            )).toList(),
                                      ),
                                    ],
                                  ],
                                ),
                              )).toList()
                          : [const Text('Aucune trame ISO 8583 enregistrée.', style: TextStyle(color: AppTheme.textMuted))],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // ÉTAPE 4 : Hypothèses d'Analyse
                  _buildStepCard(
                    icon: '💡',
                    title: '4. Hypothèses d\'Analyse',
                    child: Column(
                      children: _incident.hypotheses.isNotEmpty
                          ? _incident.hypotheses.map((hypo) {
                              final isConfirmed = hypo.status == 'CONFIRMED';
                              return Container(
                                margin: const EdgeInsets.only(bottom: 8),
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF111827),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: isConfirmed ? AppTheme.successGreen.withValues(alpha: 0.4) : AppTheme.borderDark,
                                  ),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          'STATUT : ${hypo.status}',
                                          style: TextStyle(
                                            color: isConfirmed ? AppTheme.successGreen : AppTheme.sgRed,
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Text(hypo.description, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
                                    if (hypo.evidence != null && hypo.evidence!.isNotEmpty) ...[
                                      const SizedBox(height: 4),
                                      Text('Preuve : ${hypo.evidence!}', style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11)),
                                    ],
                                  ],
                                ),
                              );
                            }).toList()
                          : [const Text('Aucune hypothèse documentée.', style: TextStyle(color: AppTheme.textMuted))],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // ÉTAPE 5 : Preuves Techniques Concordantes
                  _buildStepCard(
                    icon: '🔬',
                    title: '5. Preuves Techniques Concordantes',
                    child: Column(
                      children: _incident.evidence.isNotEmpty
                          ? _incident.evidence.map((ev) => Container(
                                margin: const EdgeInsets.only(bottom: 8),
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF111827),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: AppTheme.borderDark),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      '${ev.type} • Source: ${ev.source ?? "Système"}',
                                      style: const TextStyle(color: AppTheme.sgRed, fontSize: 11, fontWeight: FontWeight.bold),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      ev.content,
                                      style: const TextStyle(color: Color(0xFFE2E8F0), fontSize: 11, fontFamily: 'monospace'),
                                    ),
                                  ],
                                ),
                              )).toList()
                          : [const Text('Aucune preuve enregistrée.', style: TextStyle(color: AppTheme.textMuted))],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // ÉTAPE 6 : Cause Racine (RCA Formelle) & Résolution Validée
                  _buildStepCard(
                    icon: '🎯',
                    title: '6. Cause Racine (RCA) & Solution Validée',
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (_incident.rootCause != null) ...[
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: AppTheme.sgRed.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: AppTheme.sgRed.withValues(alpha: 0.3)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildSubHeader('CATÉGORIE : ${_incident.rootCause!.category}', AppTheme.sgRed),
                                const SizedBox(height: 2),
                                Text(
                                  _incident.rootCause!.description,
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  'Justification : ${_incident.rootCause!.justification}',
                                  style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 12),
                                ),
                                if (_incident.rootCause!.validatedBy != null) ...[
                                  const SizedBox(height: 6),
                                  Text(
                                    '✓ Validé par : ${_incident.rootCause!.validatedBy}',
                                    style: const TextStyle(color: AppTheme.successGreen, fontSize: 11, fontWeight: FontWeight.w600),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ],
                        if (_incident.resolution != null) ...[
                          const SizedBox(height: 10),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: const Color(0xFF111827),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: AppTheme.borderDark),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildSubHeader('PLAN D\'ACTIONS DE CORRECTION DÉPLOYÉ', AppTheme.successGreen),
                                const SizedBox(height: 2),
                                Text(_incident.resolution!.actions, style: const TextStyle(color: Colors.white, fontSize: 12)),
                                if (_incident.resolution!.result != null) ...[
                                  const SizedBox(height: 6),
                                  Text('Résultat : ${_incident.resolution!.result!}', style: const TextStyle(color: AppTheme.successGreen, fontSize: 11)),
                                ],
                                if (_incident.resolution!.executor != null) ...[
                                  const SizedBox(height: 4),
                                  Text('Intervenant : ${_incident.resolution!.executor!}', style: const TextStyle(color: AppTheme.textMuted, fontSize: 10)),
                                ],
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // ÉTAPE 7 : Plan d'Actions Préventives
                  if (_incident.prevention.isNotEmpty) ...[
                    _buildStepCard(
                      icon: '🛡️',
                      title: '7. Plan d\'Actions Préventives',
                      child: Column(
                        children: _incident.prevention.map((prev) => Container(
                              margin: const EdgeInsets.only(bottom: 8),
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: const Color(0xFF111827),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: AppTheme.borderDark),
                              ),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Icon(Icons.shield_outlined, color: AppTheme.sgRed, size: 18),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(prev.action, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
                                        const SizedBox(height: 3),
                                        Row(
                                          children: [
                                            if (prev.owner != null) Text('Resp: ${prev.owner!} • ', style: const TextStyle(color: AppTheme.textMuted, fontSize: 10)),
                                            if (prev.priority != null) Text('Priorité: ${prev.priority!} • ', style: const TextStyle(color: AppTheme.warningOrange, fontSize: 10)),
                                            if (prev.status != null) Text('Statut: ${prev.status!}', style: const TextStyle(color: AppTheme.successGreen, fontSize: 10, fontWeight: FontWeight.bold)),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            )).toList(),
                      ),
                    ),
                  ],
                ],
              ),
            ),
    );
  }

  Widget _buildStepCard({required String icon, required String title, String? subtitle, required Widget child}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderDark),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(icon, style: const TextStyle(fontSize: 16)),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
            ],
          ),
          if (subtitle != null) ...[
            const SizedBox(height: 2),
            Text(subtitle, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11)),
          ],
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }

  Widget _buildSubHeader(String title, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 2),
      child: Text(
        title,
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.5,
        ),
      ),
    );
  }

  Widget _buildChipMeta(String label, String value, {bool isCode = false, bool isSuccess = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
        color: const Color(0xFF111827),
        borderRadius: BorderRadius.circular(5),
        border: Border.all(color: isSuccess ? AppTheme.successGreen : AppTheme.borderDark),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('$label: ', style: const TextStyle(color: AppTheme.textMuted, fontSize: 10)),
          Text(
            value,
            style: TextStyle(
              color: isSuccess ? AppTheme.successGreen : isCode ? AppTheme.sgRed : Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 11,
              fontFamily: isCode ? 'monospace' : null,
            ),
          ),
        ],
      ),
    );
  }
}
