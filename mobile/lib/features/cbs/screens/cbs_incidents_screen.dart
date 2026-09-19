import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../data/cbs_data.dart';
import '../models/cbs_models.dart';

class CbsIncidentsScreen extends StatefulWidget {
  const CbsIncidentsScreen({super.key});

  @override
  State<CbsIncidentsScreen> createState() => _CbsIncidentsScreenState();
}

class _CbsIncidentsScreenState extends State<CbsIncidentsScreen> {
  String _searchQuery = '';
  String _selectedSeverity = 'ALL';

  final List<String> _severities = ['ALL', 'P1', 'P2', 'P3'];

  @override
  Widget build(BuildContext context) {
    final filtered = CbsData.incidents.where((inc) {
      final matchesSearch = inc.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          inc.reference.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          inc.domain.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          inc.symptom.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesSeverity = _selectedSeverity == 'ALL' || inc.severity.contains(_selectedSeverity);
      return matchesSearch && matchesSeverity;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text('Incidents CBS & RCA (${filtered.length})'),
      ),
      body: Column(
        children: [
          // BARRE DE RECHERCHE
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: TextField(
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Rechercher un incident (EOD, ORA, B_CPT, BKCPT...)...',
                hintStyle: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                prefixIcon: const Icon(Icons.search, color: AppTheme.sgRed),
                filled: true,
                fillColor: AppTheme.darkCard,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppTheme.borderDark),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
              onChanged: (val) => setState(() => _searchQuery = val),
            ),
          ),

          // FILTRES DE SÉVÉRITÉ
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Row(
              children: _severities.map((sev) {
                final isSelected = _selectedSeverity == sev;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(sev == 'ALL' ? 'Tous les incidents' : sev),
                    selected: isSelected,
                    onSelected: (val) => setState(() => _selectedSeverity = sev),
                    backgroundColor: AppTheme.darkCard,
                    selectedColor: sev == 'P1'
                        ? AppTheme.sgRed.withValues(alpha: 0.3)
                        : (sev == 'P2'
                            ? Colors.orangeAccent.withValues(alpha: 0.3)
                            : Colors.blueAccent.withValues(alpha: 0.3)),
                    checkmarkColor: Colors.white,
                    labelStyle: TextStyle(
                      color: isSelected ? Colors.white : AppTheme.textSecondary,
                      fontSize: 12,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    ),
                    side: BorderSide(
                      color: isSelected
                          ? (sev == 'P1' ? AppTheme.sgRed : Colors.white60)
                          : AppTheme.borderDark,
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          const SizedBox(height: 8),

          // LISTE DES INCIDENTS
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: filtered.length,
              separatorBuilder: (_, __) => const SizedBox(height: 14),
              itemBuilder: (context, index) {
                final inc = filtered[index];
                return _buildIncidentCard(inc);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIncidentCard(CbsIncidentModel inc) {
    final isCritical = inc.severity.contains('P1');
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isCritical ? AppTheme.sgRed.withValues(alpha: 0.6) : AppTheme.borderDark,
          width: isCritical ? 1.5 : 1,
        ),
      ),
      child: ExpansionTile(
        tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: isCritical ? AppTheme.sgRed.withValues(alpha: 0.2) : Colors.orangeAccent.withValues(alpha: 0.2),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            Icons.crisis_alert,
            color: isCritical ? AppTheme.sgRed : Colors.orangeAccent,
            size: 24,
          ),
        ),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: isCritical ? AppTheme.sgRed.withValues(alpha: 0.2) : Colors.orangeAccent.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                inc.severity,
                style: TextStyle(
                  color: isCritical ? AppTheme.sgRed : Colors.orangeAccent,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(width: 8),
            Text(
              inc.reference,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontFamily: 'monospace',
                fontSize: 14,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                inc.domain,
                style: const TextStyle(color: Colors.cyanAccent, fontSize: 11),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Text(
            inc.title,
            style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500),
          ),
        ),
        childrenPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        children: [
          // 1. SYMPTÔME & CONTEXTE
          _buildMethodologyStep('1. Symptôme & Contexte', [
            'Symptôme : ${inc.symptom}',
            'Contexte : ${inc.context}',
            'Impact Métier : ${inc.businessImpact}',
          ]),

          const SizedBox(height: 12),
          // 2. COMPOSANTS & LOGS
          _buildMethodologyStep('2. Preuves & Logs Techniques', [
            'Composants : ${inc.impactedComponents.join(', ')}',
          ]),
          const SizedBox(height: 6),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.white12),
            ),
            child: Text(
              inc.logEvidence.trim(),
              style: const TextStyle(
                color: Color(0xFFFF6B6B),
                fontSize: 11,
                fontFamily: 'monospace',
              ),
            ),
          ),

          const SizedBox(height: 12),
          // 3. HYPOTHÈSES INVESTIGUÉES
          _buildMethodologyStep('3. Hypothèses d\'Investigation', inc.hypotheses),

          const SizedBox(height: 12),
          // 4. CAUSE RACINE IDENTIFIÉE
          _buildMethodologyStep('4. Cause Racine (Root Cause Analysis)', [
            inc.rootCause,
          ], color: Colors.amberAccent),

          const SizedBox(height: 12),
          // 5. REMÉDIATION & ROLLBACK
          _buildMethodologyStep('5. Procédure de Correction & Reprise', inc.remediationSteps, color: Colors.greenAccent),

          const SizedBox(height: 12),
          // 6. PRÉVENTION
          _buildMethodologyStep('6. Règle de Prévention Bancaire', [
            inc.preventionRule,
          ], color: Colors.cyanAccent),
        ],
      ),
    );
  }

  Widget _buildMethodologyStep(String title, List<String> details, {Color color = Colors.white70}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title.toUpperCase(),
          style: TextStyle(
            color: color,
            fontSize: 11,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.8,
          ),
        ),
        const SizedBox(height: 4),
        ...details.map((d) => Padding(
          padding: const EdgeInsets.symmetric(vertical: 2),
          child: Text(
            d,
            style: const TextStyle(color: Colors.white, fontSize: 12, height: 1.3),
          ),
        )),
      ],
    );
  }
}
