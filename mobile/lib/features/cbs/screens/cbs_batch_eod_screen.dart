import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../data/cbs_data.dart';

class CbsBatchEodScreen extends StatefulWidget {
  const CbsBatchEodScreen({super.key});

  @override
  State<CbsBatchEodScreen> createState() => _CbsBatchEodScreenState();
}

class _CbsBatchEodScreenState extends State<CbsBatchEodScreen> {
  int? _simulatedBlockedStep;
  bool _isSimulating = false;
  double _simulationProgress = 0.0;
  String _simulationLog = 'Système nominal. Prêt pour simulation de fin de journée.';

  void _runSimulation() async {
    setState(() {
      _isSimulating = true;
      _simulationProgress = 0.0;
      _simulatedBlockedStep = null;
      _simulationLog = 'Démarrage du Scheduler EOD Amplitude...';
    });

    for (int i = 0; i < CbsData.eodSteps.length; i++) {
      await Future.delayed(const Duration(milliseconds: 600));
      if (!mounted) return;

      final step = CbsData.eodSteps[i];
      if (i == 5) {
        // Bloqué à l'étape 6 (Arrêtés de comptes) ~ 73%
        setState(() {
          _simulationProgress = 0.73;
          _simulatedBlockedStep = 5;
          _isSimulating = false;
          _simulationLog = '''
[FATAL ERROR] Étape ${step.code} interrompue !
Symptôme: ORA-00054: resource busy and acquire with NOWAIT specified on BKCPT.
Processus B_CPT_ARRETE bloqué par une session externe (TX Row Lock Contention).
Progression figée à 73%. Basculement date J+1 IMPOSSIBLE.
''';
        });
        return;
      }

      setState(() {
        _simulationProgress = (i + 1) / CbsData.eodSteps.length;
        _simulationLog = 'Exécution ${step.code} (${step.name}) terminée avec succès (RC=0)...';
      });
    }

    setState(() {
      _isSimulating = false;
    });
  }

  void _resolveSimulation() {
    setState(() {
      _simulatedBlockedStep = null;
      _simulationProgress = 1.0;
      _simulationLog = '''
[REPRISE RÉUSSIE]
1. Session bloquante tuée (ALTER SYSTEM KILL SESSION '142,39281' IMMEDIATE).
2. Interface API coupée.
3. Relance du step B_CPT_ARRETE : succès (RC=0).
4. Centralisation GL et Balance Générale équilibrée (Débit = Crédit).
5. Date système basculée à J+1 (08:00 BOD OK).
''';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('RUN & Batch EOD/BOD'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // CARTE SIMULATEUR DE CRISE EOD
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.darkCard,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: _simulatedBlockedStep != null ? AppTheme.sgRed : Colors.amber.withValues(alpha: 0.5),
                  width: 1.5,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: const [
                          Icon(Icons.crisis_alert, color: Colors.amber, size: 22),
                          SizedBox(width: 8),
                          Text(
                            'Simulateur Incident EOD 73%',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                        ],
                      ),
                      Text(
                        '${(_simulationProgress * 100).toInt()}%',
                        style: TextStyle(
                          color: _simulatedBlockedStep != null ? AppTheme.sgRed : Colors.amber,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: LinearProgressIndicator(
                      value: _simulationProgress,
                      backgroundColor: Colors.white10,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        _simulatedBlockedStep != null ? AppTheme.sgRed : Colors.amber,
                      ),
                      minHeight: 8,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.white12),
                    ),
                    child: Text(
                      _simulationLog,
                      style: TextStyle(
                        color: _simulatedBlockedStep != null ? const Color(0xFFFF6B6B) : Colors.greenAccent,
                        fontSize: 11,
                        fontFamily: 'monospace',
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: _isSimulating ? null : _runSimulation,
                          icon: const Icon(Icons.play_arrow, size: 18),
                          label: const Text('Lancer Simulation EOD'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.amber.shade700,
                            foregroundColor: Colors.black,
                            padding: const EdgeInsets.symmetric(vertical: 10),
                          ),
                        ),
                      ),
                      if (_simulatedBlockedStep != null) ...[
                        const SizedBox(width: 10),
                        ElevatedButton.icon(
                          onPressed: _resolveSimulation,
                          icon: const Icon(Icons.build, size: 18),
                          label: const Text('Procédure de Reprise'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.greenAccent.shade700,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),
            const Text(
              'CHAÎNE DE TRAITEMENT EOD / BOD NOMINALE',
              style: TextStyle(
                color: Colors.white70,
                fontSize: 12,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.1,
              ),
            ),
            const SizedBox(height: 12),

            // LISTE DES ÉTAPES
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: CbsData.eodSteps.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final step = CbsData.eodSteps[index];
                final isBlocked = _simulatedBlockedStep == index;

                return Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppTheme.darkCard,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isBlocked ? AppTheme.sgRed : AppTheme.borderDark,
                      width: isBlocked ? 2 : 1,
                    ),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isBlocked
                              ? AppTheme.sgRed.withValues(alpha: 0.2)
                              : Colors.blueAccent.withValues(alpha: 0.15),
                          border: Border.all(
                            color: isBlocked ? AppTheme.sgRed : Colors.blueAccent,
                          ),
                        ),
                        child: Center(
                          child: Text(
                            '${step.sequence}',
                            style: TextStyle(
                              color: isBlocked ? AppTheme.sgRed : Colors.blueAccent,
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    step.name,
                                    style: TextStyle(
                                      color: isBlocked ? AppTheme.sgRed : Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                    ),
                                  ),
                                ),
                                if (step.isCritical)
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: AppTheme.sgRed.withValues(alpha: 0.15),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: const Text(
                                      'CRITIQUE',
                                      style: TextStyle(color: AppTheme.sgRed, fontSize: 9, fontWeight: FontWeight.bold),
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${step.code} • ${step.domain} • Durée moy: ${step.expectedDuration}',
                              style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              step.description,
                              style: TextStyle(color: Colors.white.withValues(alpha: 0.8), fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
