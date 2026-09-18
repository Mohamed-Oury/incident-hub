import 'dart:async';
import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/database/gamification_service.dart';

class BossScenario {
  final String id;
  final String title;
  final String threatLevel;
  final String initialTps;
  final String description;
  final List<String> incomingLogs;
  final List<String> fixOptions;
  final int correctFixIndex;
  final String technicalRationale;
  final int maxDuration; // secondes
  final int baseXp;

  const BossScenario({
    required this.id,
    required this.title,
    required this.threatLevel,
    required this.initialTps,
    required this.description,
    required this.incomingLogs,
    required this.fixOptions,
    required this.correctFixIndex,
    required this.technicalRationale,
    this.maxDuration = 45,
    this.baseXp = 100,
  });
}

class BossBattleView extends StatefulWidget {
  final BossScenario scenario;

  const BossBattleView({super.key, required this.scenario});

  @override
  State<BossBattleView> createState() => _BossBattleViewState();
}

class _BossBattleViewState extends State<BossBattleView> {
  late int _timeLeft;
  Timer? _timer;
  int _selectedOption = -1;
  bool _resolved = false;
  bool _isSuccess = false;
  int _earnedXp = 0;
  final List<String> _activeLogs = [];

  @override
  void initState() {
    super.initState();
    _timeLeft = widget.scenario.maxDuration;
    _activeLogs.addAll(widget.scenario.incomingLogs.take(2));
    _startBattle();
  }

  void _startBattle() {
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_timeLeft > 0) {
        setState(() {
          _timeLeft--;
          if (_timeLeft % 3 == 0 && _activeLogs.length < widget.scenario.incomingLogs.length) {
            _activeLogs.add(widget.scenario.incomingLogs[_activeLogs.length]);
          }
        });
      } else {
        _timer?.cancel();
        if (!_resolved) {
          _handleFinish(isSuccess: false, timedOut: true);
        }
      }
    });
  }

  void _chooseFix(int index) {
    if (_resolved) return;
    _timer?.cancel();

    final isCorrect = index == widget.scenario.correctFixIndex;
    setState(() {
      _selectedOption = index;
    });

    _handleFinish(isSuccess: isCorrect, timedOut: false);
  }

  void _handleFinish({required bool isSuccess, required bool timedOut}) async {
    setState(() {
      _resolved = true;
      _isSuccess = isSuccess;
      if (isSuccess) {
        // Bonus chrono
        _earnedXp = widget.scenario.baseXp + (_timeLeft * 2);
      }
    });

    if (isSuccess && _earnedXp > 0) {
      await GamificationService.instance.addXp(
        _earnedXp,
        newBadge: 'Vainqueur de Boss : ${widget.scenario.title.split(" - ").last}',
      );
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.scenario.title),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: _timeLeft <= 10 ? AppTheme.sgRed : AppTheme.warningOrange.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                const Icon(Icons.alarm, size: 16, color: Colors.white),
                const SizedBox(width: 4),
                Text(
                  '${_timeLeft}s',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Alerte Situation d'Urgence
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppTheme.sgRed.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.sgRed.withValues(alpha: 0.5)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'ALERTE INCIDENT MAJEUR : ${widget.scenario.threatLevel}',
                        style: const TextStyle(color: AppTheme.sgRed, fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                      Text('Débit: ${widget.scenario.initialTps}', style: const TextStyle(color: Colors.white70, fontSize: 11)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    widget.scenario.description,
                    style: const TextStyle(color: Colors.white, fontSize: 13, height: 1.3),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Live Log Feed
            const Text(
              'Télémétrie & Logs de Production en Temps Réel :',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white),
            ),
            const SizedBox(height: 8),

            Container(
              height: 140,
              width: double.infinity,
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFF070B12),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFF1F2937)),
              ),
              child: ListView.builder(
                itemCount: _activeLogs.length,
                itemBuilder: (context, index) {
                  final log = _activeLogs[index];
                  final isErr = log.contains('ERROR') || log.contains('CRITICAL') || log.contains('timeout');
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: Text(
                      log,
                      style: TextStyle(
                        color: isErr ? AppTheme.sgRed : AppTheme.successGreen,
                        fontFamily: 'monospace',
                        fontSize: 11,
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 20),

            // Choix du Correctif
            const Text(
              'Appliquer le Correctif d\'Urgence Avant Expiration :',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white),
            ),
            const SizedBox(height: 10),

            Column(
              children: List.generate(widget.scenario.fixOptions.length, (idx) {
                final opt = widget.scenario.fixOptions[idx];
                Color cardColor = const Color(0xFF1F2937);
                Color borderColor = AppTheme.borderDark;

                if (_resolved) {
                  if (idx == widget.scenario.correctFixIndex) {
                    cardColor = AppTheme.successGreen.withValues(alpha: 0.2);
                    borderColor = AppTheme.successGreen;
                  } else if (idx == _selectedOption) {
                    cardColor = AppTheme.sgRed.withValues(alpha: 0.2);
                    borderColor = AppTheme.sgRed;
                  }
                }

                return Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: InkWell(
                    onTap: _resolved ? null : () => _chooseFix(idx),
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: cardColor,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: borderColor, width: 1.5),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            _resolved && idx == widget.scenario.correctFixIndex
                                ? Icons.check_circle
                                : Icons.play_arrow,
                            size: 18,
                            color: borderColor,
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              opt,
                              style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),
            ),

            if (_resolved) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: _isSuccess ? AppTheme.successGreen.withValues(alpha: 0.15) : AppTheme.sgRed.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: _isSuccess ? AppTheme.successGreen : AppTheme.sgRed),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(_isSuccess ? Icons.verified : Icons.error, color: _isSuccess ? AppTheme.successGreen : AppTheme.sgRed),
                        const SizedBox(width: 8),
                        Text(
                          _isSuccess ? 'SYSTÈME MONÉTIQUE RÉTABLI !' : 'RUPTURE DE SERVICE DU SWITCH !',
                          style: TextStyle(
                            color: _isSuccess ? AppTheme.successGreen : AppTheme.sgRed,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(widget.scenario.technicalRationale, style: const TextStyle(color: Colors.white, fontSize: 13)),
                    if (_isSuccess) ...[
                      const SizedBox(height: 8),
                      Text('+ $_earnedXp XP remportés avec bonus chrono !', style: const TextStyle(color: AppTheme.successGreen, fontWeight: FontWeight.bold, fontSize: 13)),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.sgRed, padding: const EdgeInsets.symmetric(vertical: 14)),
                  onPressed: () => Navigator.pop(context, true),
                  child: const Text('Retour aux Scénarios Boss', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
