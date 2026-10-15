import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_theme.dart';
import '../models/flexcube_models.dart';
import '../services/flexcube_copilot_service.dart';

class FlexcubeCopilotScreen extends StatefulWidget {
  const FlexcubeCopilotScreen({super.key});

  @override
  State<FlexcubeCopilotScreen> createState() => _FlexcubeCopilotScreenState();
}

class _FlexcubeCopilotScreenState extends State<FlexcubeCopilotScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Tab 1 : Linter
  final TextEditingController _linterController = TextEditingController();
  List<FlexcubePlSqlReviewIssue> _linterIssues = [];
  bool _linterExecuted = false;

  // Tab 2 : Diagnostic
  final TextEditingController _diagController = TextEditingController();
  FlexcubeIncidentAnalysis? _diagAnalysis;

  // Tab 3 : Générateur
  final TextEditingController _titleController = TextEditingController(text: 'Virement Inter-Agences avec Contrôle Balance');
  String _selectedModule = 'FT';
  final TextEditingController _descController = TextEditingController(text: 'Passation d\'un virement entre deux comptes dans des agences différentes avec mise à jour FTTB et ACTB.');
  FlexcubePlSqlProposal? _generatedPackage;

  static const Color flexcubeOrange = Color(0xFFEA580C);
  static const Color flexcubeOrangeLight = Color(0xFFFB923C);

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _linterController.text = '''CREATE OR REPLACE PROCEDURE Pr_Debit_Account IS
BEGIN
  -- Mauvaise pratique détectée : Pas de clause NOWAIT
  SELECT * FROM STTM_CUST_ACCOUNT FOR UPDATE;

  UPDATE STTM_CUST_ACCOUNT SET AC_STAT_NO_DR = 'Y';

  -- Violation majeure : COMMIT dans une procédure custom
  COMMIT;
END;''';
  }

  @override
  void dispose() {
    _tabController.dispose();
    _linterController.dispose();
    _diagController.dispose();
    _titleController.dispose();
    _descController.dispose();
    super.dispose();
  }

  void _runLinter() {
    final issues = FlexcubeCopilotService.reviewPlSql(_linterController.text);
    setState(() {
      _linterIssues = issues;
      _linterExecuted = true;
    });
  }

  void _runDiagnostic() {
    final query = _diagController.text.trim();
    if (query.isEmpty) return;
    final res = FlexcubeCopilotService.analyzeIncident(query);
    setState(() => _diagAnalysis = res);
  }

  void _generatePackage() {
    final proposal = FlexcubeCopilotService.generatePlSqlPackage(
      title: _titleController.text.trim(),
      module: _selectedModule,
      description: _descController.text.trim(),
    );
    setState(() => _generatedPackage = proposal);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Studio Copilot PL/SQL FCUBS'),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: flexcubeOrange,
          labelColor: flexcubeOrangeLight,
          unselectedLabelColor: AppTheme.textSecondary,
          labelStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
          tabs: const [
            Tab(text: 'Linter PL/SQL'),
            Tab(text: 'Diagnostic SGBD'),
            Tab(text: 'Générateur CUSPKS'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildLinterTab(),
          _buildDiagnosticTab(),
          _buildGeneratorTab(),
        ],
      ),
    );
  }

  Widget _buildLinterTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.darkCard,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppTheme.borderDark),
            ),
            child: const Row(
              children: [
                Icon(Icons.rule, color: flexcubeOrangeLight, size: 22),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Analyseur statique de règles d\'architecture : Détection des COMMITs prématurés, '
                    'absence de NOWAIT sur FOR UPDATE et exceptions silencieuses.',
                    style: TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          const Text(
            'CODE PL/SQL À AUDITER',
            style: TextStyle(color: flexcubeOrange, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.2),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _linterController,
            maxLines: 8,
            style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
            decoration: const InputDecoration(hintText: 'Collez le code PL/SQL...'),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: flexcubeOrange,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: _runLinter,
              icon: const Icon(Icons.security, size: 18),
              label: const Text('Lancer la Revue de Conformité PL/SQL', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
          const SizedBox(height: 16),
          if (_linterExecuted) ...[
            if (_linterIssues.isEmpty)
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppTheme.successGreen.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppTheme.successGreen),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.check_circle, color: AppTheme.successGreen),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Conformité 100% : Aucune violation de règle Kernel FCUBS détectée.',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ),
                  ],
                ),
              )
            else
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${_linterIssues.length} ANOMALIE(S) DÉTECTÉE(S)',
                    style: const TextStyle(color: AppTheme.errorRed, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                  ),
                  const SizedBox(height: 8),
                  ..._linterIssues.map((issue) {
                    final isCrit = issue.severity == 'CRITICAL';
                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.darkCard,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: isCrit ? AppTheme.errorRed : AppTheme.warningOrange),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(isCrit ? Icons.error : Icons.warning, color: isCrit ? AppTheme.errorRed : AppTheme.warningOrange, size: 18),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  issue.message,
                                  style: TextStyle(color: isCrit ? AppTheme.errorRed : AppTheme.warningOrange, fontWeight: FontWeight.bold, fontSize: 12),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(issue.recommendation, style: const TextStyle(color: Colors.white70, fontSize: 11, height: 1.3)),
                        ],
                      ),
                    );
                  }),
                ],
              ),
          ],
        ],
      ),
    );
  }

  Widget _buildDiagnosticTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'DIAGNOSTIC D\'INCIDENT OU ERREUR SGBD',
            style: TextStyle(color: flexcubeOrange, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.2),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _diagController,
            style: const TextStyle(fontSize: 13),
            decoration: const InputDecoration(
              hintText: 'Collez l\'erreur (ex: ORA-00054: resource busy with NOWAIT)...',
            ),
          ),
          const SizedBox(height: 10),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildQuickErrorChip('ORA-00054 (Deadlock / NOWAIT)'),
                _buildQuickErrorChip('ORA-01555 (Snapshot too old)'),
                _buildQuickErrorChip('ORA-00001 (Unique constraint)'),
                _buildQuickErrorChip('AC-VAL-001 (Équilibre compta)'),
              ],
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: flexcubeOrange,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: _runDiagnostic,
              icon: const Icon(Icons.troubleshoot, size: 18),
              label: const Text('Analyser l\'Incident & Sortir le Playbook SQL', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
          const SizedBox(height: 16),
          if (_diagAnalysis != null) ...[
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.darkCard,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: flexcubeOrangeLight.withValues(alpha: 0.6)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.biotech, color: flexcubeOrangeLight, size: 22),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _diagAnalysis!.detectedIncident?.title ?? 'Incident SGBD Oracle Détecté',
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                      ),
                      if (_diagAnalysis!.detectedIncident != null)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: flexcubeOrange.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            _diagAnalysis!.detectedIncident!.errorCode,
                            style: const TextStyle(color: flexcubeOrangeLight, fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text('Cause Racine :', style: const TextStyle(color: flexcubeOrangeLight, fontSize: 11, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 2),
                  Text(_diagAnalysis!.rootCause, style: const TextStyle(color: Colors.white70, fontSize: 12)),
                  const SizedBox(height: 12),
                  const Text('Requête SQL d\'Investigation Immédiate :', style: TextStyle(color: flexcubeOrangeLight, fontSize: 11, fontWeight: FontWeight.bold)),
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
                            _diagAnalysis!.sqlDiagnostic,
                            style: const TextStyle(color: Colors.greenAccent, fontSize: 11, fontFamily: 'monospace'),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.copy, size: 16, color: Colors.white70),
                          onPressed: () {
                            Clipboard.setData(ClipboardData(text: _diagAnalysis!.sqlDiagnostic));
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Requête copiée')));
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text('Procédure de Dépannage :', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  ..._diagAnalysis!.resolutionSteps.map((s) => Padding(
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
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildQuickErrorChip(String text) {
    return Padding(
      padding: const EdgeInsets.only(right: 6),
      child: ActionChip(
        label: Text(text, style: const TextStyle(fontSize: 10)),
        backgroundColor: AppTheme.darkSurface,
        side: const BorderSide(color: AppTheme.borderDark),
        onPressed: () {
          _diagController.text = text;
          _runDiagnostic();
        },
      ),
    );
  }

  Widget _buildGeneratorTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('GÉNÉRATEUR DE PACKAGE PL/SQL CUSTOM (CUSPKS)',
              style: TextStyle(color: flexcubeOrange, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
          const SizedBox(height: 10),
          TextField(
            controller: _titleController,
            decoration: const InputDecoration(labelText: 'Titre du besoin métier', isDense: true),
          ),
          const SizedBox(height: 10),
          DropdownButtonFormField<String>(
            value: _selectedModule,
            decoration: const InputDecoration(labelText: 'Module FCUBS', isDense: true),
            items: const [
              DropdownMenuItem(value: 'FT', child: Text('FT — Funds Transfer')),
              DropdownMenuItem(value: 'ST', child: Text('ST — Static Maintenance')),
              DropdownMenuItem(value: 'AC', child: Text('AC — Accounts & Logs')),
              DropdownMenuItem(value: 'CL', child: Text('CL — Consumer Lending')),
              DropdownMenuItem(value: 'GL', child: Text('GL — General Ledger')),
            ],
            onChanged: (val) {
              if (val != null) setState(() => _selectedModule = val);
            },
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _descController,
            maxLines: 2,
            decoration: const InputDecoration(labelText: 'Description fonctionnelle', isDense: true),
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: flexcubeOrange,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: _generatePackage,
              icon: const Icon(Icons.auto_awesome, size: 18),
              label: const Text('Générer Package PL/SQL Conforme', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
          const SizedBox(height: 16),
          if (_generatedPackage != null) ...[
            Container(
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
                      Text(
                        _generatedPackage!.packageName,
                        style: const TextStyle(color: flexcubeOrangeLight, fontWeight: FontWeight.bold, fontSize: 12, fontFamily: 'monospace'),
                      ),
                      IconButton(
                        icon: const Icon(Icons.copy, size: 16, color: Colors.white70),
                        onPressed: () {
                          Clipboard.setData(ClipboardData(text: '${_generatedPackage!.packageSpec}\n\n${_generatedPackage!.packageBody}'));
                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Package PL/SQL copié')));
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text('Corps du Package (Extrait) :', style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Container(
                    height: 160,
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.black54,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.white12),
                    ),
                    child: SingleChildScrollView(
                      child: Text(
                        _generatedPackage!.packageBody,
                        style: const TextStyle(color: Colors.lightGreenAccent, fontSize: 10, fontFamily: 'monospace'),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text('Jeux de Tests Unitaires Associés :', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  ..._generatedPackage!.testCases.map((tc) => Padding(
                    padding: const EdgeInsets.only(bottom: 2),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.check_circle_outline, color: AppTheme.successGreen, size: 14),
                        const SizedBox(width: 6),
                        Expanded(child: Text(tc, style: const TextStyle(color: Colors.white70, fontSize: 11))),
                      ],
                    ),
                  )),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
