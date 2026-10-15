import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_theme.dart';
import '../data/flexcube_data.dart';

class FlexcubeAeodScreen extends StatefulWidget {
  const FlexcubeAeodScreen({super.key});

  @override
  State<FlexcubeAeodScreen> createState() => _FlexcubeAeodScreenState();
}

class _FlexcubeAeodScreenState extends State<FlexcubeAeodScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _searchQuery = '';

  static const Color flexcubeOrange = Color(0xFFEA580C);
  static const Color flexcubeOrangeLight = Color(0xFFFB923C);

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AEOD & Incidents RUN FCUBS'),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: flexcubeOrange,
          labelColor: flexcubeOrangeLight,
          unselectedLabelColor: AppTheme.textSecondary,
          labelStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
          tabs: const [
            Tab(text: 'Chaîne AEOD (10)'),
            Tab(text: 'Incidents RUN (20)'),
            Tab(text: 'Dépannage Urgence (5)'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildAeodStepsTab(),
          _buildIncidentsTab(),
          _buildScenariosTab(),
        ],
      ),
    );
  }

  Widget _buildAeodStepsTab() {
    final steps = FlexcubeData.aeodSteps;

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: steps.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final step = steps[index];
        Color badgeColor;
        switch (step.criticality) {
          case 'CRITIQUE':
            badgeColor = AppTheme.errorRed;
            break;
          case 'HAUTE':
            badgeColor = AppTheme.warningOrange;
            break;
          default:
            badgeColor = Colors.blueAccent;
        }

        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppTheme.darkCard,
            borderRadius: BorderRadius.circular(12),
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
                        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                        decoration: BoxDecoration(
                          color: flexcubeOrange.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: flexcubeOrange.withValues(alpha: 0.5)),
                        ),
                        child: Text(
                          'Étape ${step.stepNumber}',
                          style: const TextStyle(color: flexcubeOrangeLight, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                        decoration: BoxDecoration(
                          color: Colors.white10,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          '${step.phaseCode} (${step.phaseName})',
                          style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                    decoration: BoxDecoration(
                      color: badgeColor.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      step.criticality,
                      style: TextStyle(color: badgeColor, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                step.programName,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  fontFamily: 'monospace',
                ),
              ),
              const SizedBox(height: 4),
              Text(
                step.description,
                style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.timer_outlined, color: AppTheme.textMuted, size: 14),
                  const SizedBox(width: 4),
                  Text(
                    'Durée estimée : ${step.estimatedDuration}',
                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                  ),
                  const SizedBox(width: 14),
                  const Icon(Icons.category_outlined, color: AppTheme.textMuted, size: 14),
                  const SizedBox(width: 4),
                  Text(
                    'Module : ${step.module}',
                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                  ),
                ],
              ),
              if (step.commonErrors.isNotEmpty) ...[
                const SizedBox(height: 8),
                Wrap(
                  spacing: 6,
                  children: step.commonErrors.map((err) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppTheme.errorRed.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(4),
                      border: Border.all(color: AppTheme.errorRed.withValues(alpha: 0.3)),
                    ),
                    child: Text(
                      err,
                      style: const TextStyle(color: AppTheme.errorRed, fontSize: 10, fontFamily: 'monospace'),
                    ),
                  )).toList(),
                ),
              ],
            ],
          ),
        );
      },
    );
  }

  Widget _buildIncidentsTab() {
    final filtered = FlexcubeData.incidents.where((inc) {
      if (_searchQuery.isEmpty) return true;
      final q = _searchQuery.toLowerCase();
      return inc.errorCode.toLowerCase().contains(q) ||
          inc.title.toLowerCase().contains(q) ||
          inc.reference.toLowerCase().contains(q) ||
          inc.module.toLowerCase().contains(q);
    }).toList();

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: TextField(
            style: const TextStyle(fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Rechercher par code (ex: ORA-00054, AC-VAL-001)...',
              prefixIcon: const Icon(Icons.search, size: 20),
              isDense: true,
              suffixIcon: _searchQuery.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear, size: 18),
                      onPressed: () => setState(() => _searchQuery = ''),
                    )
                  : null,
            ),
            onChanged: (val) => setState(() => _searchQuery = val),
          ),
        ),
        Expanded(
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: filtered.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final inc = filtered[index];
              final isP1 = inc.severity == 'P1';

              return ExpansionTile(
                tilePadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                collapsedBackgroundColor: AppTheme.darkCard,
                backgroundColor: AppTheme.darkCard,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(color: isP1 ? AppTheme.errorRed.withValues(alpha: 0.4) : AppTheme.borderDark),
                ),
                collapsedShape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(color: isP1 ? AppTheme.errorRed.withValues(alpha: 0.4) : AppTheme.borderDark),
                ),
                leading: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                  decoration: BoxDecoration(
                    color: isP1 ? AppTheme.errorRed.withValues(alpha: 0.2) : AppTheme.warningOrange.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    inc.severity,
                    style: TextStyle(
                      color: isP1 ? AppTheme.errorRed : AppTheme.warningOrange,
                      fontWeight: FontWeight.bold,
                      fontSize: 11,
                    ),
                  ),
                ),
                title: Text(
                  '${inc.errorCode} • ${inc.title}',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                ),
                subtitle: Text(
                  '${inc.reference} • Module ${inc.module}',
                  style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                ),
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Divider(color: AppTheme.borderDark),
                        _buildIncidentSection('Symptôme :', inc.symptom),
                        const SizedBox(height: 6),
                        _buildIncidentSection('Cause Racine (RCA) :', inc.rootCause),
                        const SizedBox(height: 10),
                        const Text(
                          'Requête SQL d\'Investigation :',
                          style: TextStyle(color: flexcubeOrangeLight, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.black45,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.white12),
                          ),
                          child: Row(
                            children: [
                              Expanded(
                                child: Text(
                                  inc.investigationQuery,
                                  style: const TextStyle(
                                    color: Colors.greenAccent,
                                    fontFamily: 'monospace',
                                    fontSize: 11,
                                  ),
                                ),
                              ),
                              IconButton(
                                icon: const Icon(Icons.copy, size: 16, color: Colors.white70),
                                tooltip: 'Copier la requête',
                                onPressed: () {
                                  Clipboard.setData(ClipboardData(text: inc.investigationQuery));
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Requête SQL copiée dans le presse-papier')),
                                  );
                                },
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 10),
                        const Text(
                          'Procédure de Résolution :',
                          style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        ...inc.resolutionProcedure.asMap().entries.map((entry) => Padding(
                          padding: const EdgeInsets.only(bottom: 3),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('${entry.key + 1}. ', style: const TextStyle(color: flexcubeOrangeLight, fontSize: 11, fontWeight: FontWeight.bold)),
                              Expanded(child: Text(entry.value, style: const TextStyle(color: Colors.white70, fontSize: 11))),
                            ],
                          ),
                        )),
                      ],
                    ),
                  ),
                ],
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildScenariosTab() {
    final scenarios = FlexcubeData.aeodScenarios;

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: scenarios.length,
      separatorBuilder: (_, __) => const SizedBox(height: 14),
      itemBuilder: (context, index) {
        final sc = scenarios[index];

        return Container(
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
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: flexcubeOrange.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: flexcubeOrange.withValues(alpha: 0.5)),
                    ),
                    child: Text(
                      'Phase ${sc.phase}',
                      style: const TextStyle(color: flexcubeOrangeLight, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                  Text(sc.id, style: const TextStyle(color: AppTheme.textMuted, fontSize: 11, fontFamily: 'monospace')),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                sc.title,
                style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              _buildIncidentSection('Symptôme :', sc.symptom),
              const SizedBox(height: 4),
              _buildIncidentSection('Cause Racine :', sc.rootCause),
              const SizedBox(height: 4),
              _buildIncidentSection('Impact :', sc.impact),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.black45,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.white12),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        sc.sqlDiagnostic,
                        style: const TextStyle(color: Colors.greenAccent, fontSize: 11, fontFamily: 'monospace'),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.copy, size: 16, color: Colors.white70),
                      onPressed: () {
                        Clipboard.setData(ClipboardData(text: sc.sqlDiagnostic));
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Requête SQL copiée')),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              const Text('Résolution immédiate :', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              ...sc.resolutionSteps.map((s) => Padding(
                padding: const EdgeInsets.only(bottom: 2),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('• ', style: TextStyle(color: flexcubeOrangeLight, fontSize: 12)),
                    Expanded(child: Text(s, style: const TextStyle(color: Colors.white70, fontSize: 11))),
                  ],
                ),
              )),
            ],
          ),
        );
      },
    );
  }

  Widget _buildIncidentSection(String label, String text) {
    return RichText(
      text: TextSpan(
        children: [
          TextSpan(text: '$label ', style: const TextStyle(color: flexcubeOrangeLight, fontSize: 11, fontWeight: FontWeight.bold)),
          TextSpan(text: text, style: const TextStyle(color: Colors.white70, fontSize: 11)),
        ],
      ),
    );
  }
}
