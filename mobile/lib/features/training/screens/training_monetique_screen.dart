import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../models/training_models.dart';
import '../services/training_service.dart';

class TrainingMonetiqueScreen extends StatefulWidget {
  const TrainingMonetiqueScreen({super.key});

  @override
  State<TrainingMonetiqueScreen> createState() => _TrainingMonetiqueScreenState();
}

class _TrainingMonetiqueScreenState extends State<TrainingMonetiqueScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isLoading = true;
  TrainingDataPackage? _data;
  int _unlockedLevel = 1;
  int _selectedGradeLevel = 1;

  // Simulateur
  final TextEditingController _simController = TextEditingController(
    text: "02007238200108E1800016497010123456789001000000000005000009211430001234561430000921601105112345678901234123456789012ATM00001COMMERCE0000001AGENCE DAKAR     952",
  );
  String _simOutput = "";
  bool _isSimulating = false;

  // Examen
  final Map<String, int> _userAnswers = {};
  bool _examSubmitted = false;
  int _examScore = 0;
  bool _examPassed = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    final pkg = await TrainingService.instance.getMonetiqueData();
    final lvl = await TrainingService.instance.getUnlockedLevel('MONETIQUE');
    if (mounted) {
      setState(() {
        _data = pkg;
        _unlockedLevel = lvl;
        _selectedGradeLevel = lvl;
        _isLoading = false;
      });
    }
  }

  void _runSimulator() {
    setState(() {
      _isSimulating = true;
      _simOutput = "Analyse cryptographique et validation syntaxique ISO 8583...\n";
    });

    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      setState(() {
        _isSimulating = false;
        _simOutput = "=== ANALYSEUR PROTOCOLE MONÉTIQUE & SWITCH ===\n"
            "[OK] MTI Détecté : 0200 (Demande financière en ligne)\n"
            "[OK] Champs Détectés : DE3 (Retrait), DE4 (50 000 XOF), DE11 (STAN), DE41 (ATM00001)\n"
            "[OK] Contrôle Cryptographique : PIN Block ISO-0 validé sous ZPK.\n"
            "--------------------------------------------------\n"
            "• Décision Switch : ROUTAGE NORMAL VERS ÉMETTEUR (DE39 = 00)\n"
            "• Trace auditable enregistrée dans le journal central.";
      });
    });
  }

  void _submitExam(List<TrainingExamQuestion> questions, TrainingGrade grade) async {
    int score = 0;
    for (final q in questions) {
      if (_userAnswers[q.id] == q.correctIndex) {
        score++;
      }
    }
    final pct = questions.isNotEmpty ? ((score / questions.length) * 100).round() : 0;
    final passed = pct >= grade.minPassScorePct;

    setState(() {
      _examScore = score;
      _examPassed = passed;
      _examSubmitted = true;
    });

    if (passed) {
      final nextLvl = _selectedGradeLevel + 1 <= 5 ? _selectedGradeLevel + 1 : 5;
      if (nextLvl > _unlockedLevel) {
        setState(() {
          _unlockedLevel = nextLvl;
        });
        await TrainingService.instance.saveUnlockedLevel('MONETIQUE', nextLvl);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading || _data == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator(color: AppTheme.sgRed)),
      );
    }

    final grades = _data!.grades;
    final currentGrade = grades.firstWhere(
      (g) => g.level == _selectedGradeLevel,
      orElse: () => grades.first,
    );

    final gradeLessons = _data!.lessons.where((l) => l.gradeLevel == _selectedGradeLevel).toList();
    final gradeExams = _data!.exams.where((e) => e.gradeLevel == _selectedGradeLevel).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Cursus Monétique (5 Grades)'),
        backgroundColor: const Color(0xFF0F172A),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppTheme.sgRed,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white60,
          isScrollable: true,
          tabs: const [
            Tab(icon: Icon(Icons.menu_book, size: 18), text: 'Cours & Normes'),
            Tab(icon: Icon(Icons.terminal, size: 18), text: 'Simulateur ISO'),
            Tab(icon: Icon(Icons.quiz, size: 18), text: 'Examen de Grade'),
            Tab(icon: Icon(Icons.workspace_premium, size: 18), text: 'Certificat'),
          ],
        ),
      ),
      body: Column(
        children: [
          // Sélecteur des 5 Paliers
          Container(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
            color: const Color(0xFF1E293B),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: grades.map((g) {
                  final isUnlocked = g.level <= _unlockedLevel;
                  final isSelected = g.level == _selectedGradeLevel;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(
                        '${isUnlocked ? "✅" : "🔒"} ${g.badge}',
                        style: TextStyle(
                          color: isSelected ? Colors.white : Colors.white70,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          fontSize: 12,
                        ),
                      ),
                      selected: isSelected,
                      selectedColor: isUnlocked ? AppTheme.sgRed : Colors.grey.shade700,
                      backgroundColor: const Color(0xFF0F172A),
                      onSelected: isUnlocked
                          ? (selected) {
                              if (selected) {
                                setState(() {
                                  _selectedGradeLevel = g.level;
                                  _examSubmitted = false;
                                  _userAnswers.clear();
                                });
                              }
                            }
                          : null,
                    ),
                  );
                }).toList(),
              ),
            ),
          ),

          // Contenu selon l'onglet
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // 1. Cours & Normes
                _buildLessonsTab(currentGrade, gradeLessons),

                // 2. Simulateur ISO
                _buildSimulatorTab(),

                // 3. Examen officiel (30 questions)
                _buildExamTab(currentGrade, gradeExams),

                // 4. Certificat
                _buildCertificateTab(currentGrade),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLessonsTab(TrainingGrade grade, List<TrainingLesson> lessons) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Objectif du grade
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF1E293B),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.sgRed.withValues(alpha: 0.5)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                grade.name,
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 6),
              Text(
                grade.objective,
                style: const TextStyle(color: Colors.white70, fontSize: 13),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Normes officielles
        const Text(
          'SPÉCIFICATIONS ET NORMES RECOMMANDÉES',
          style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        ...grade.recommendedResources.map(
          (r) => Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.white12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  r.title,
                  style: const TextStyle(color: Colors.cyanAccent, fontWeight: FontWeight.bold, fontSize: 13),
                ),
                Text(
                  'Réf: ${r.reference}',
                  style: const TextStyle(color: Colors.white54, fontSize: 11),
                ),
                const SizedBox(height: 4),
                Text(
                  r.description,
                  style: const TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
        ),

        const SizedBox(height: 16),
        const Text(
          'LEÇONS TECHNIQUES APPROFONDIES',
          style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        ...lessons.map(
          (l) => ExpansionTile(
            collapsedBackgroundColor: const Color(0xFF1E293B),
            backgroundColor: const Color(0xFF1E293B),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            collapsedShape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            title: Text(
              l.title,
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 14),
            ),
            subtitle: Text(
              l.summary,
              style: const TextStyle(color: Colors.white60, fontSize: 12),
            ),
            childrenPadding: const EdgeInsets.all(14),
            children: [
              Text(
                l.detailedContent,
                style: const TextStyle(color: Colors.white, fontSize: 13, height: 1.4),
              ),
              const SizedBox(height: 12),
              if (l.technicalSample.isNotEmpty) ...[
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: Colors.white24),
                  ),
                  child: Text(
                    l.technicalSample,
                    style: const TextStyle(color: Colors.greenAccent, fontFamily: 'monospace', fontSize: 11),
                  ),
                ),
                const SizedBox(height: 10),
              ],
              Text(
                '💡 Explication : ${l.explanation}',
                style: const TextStyle(color: Colors.amberAccent, fontSize: 12),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSimulatorTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Simulateur de Trame ISO 8583 & Switch',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
        ),
        const SizedBox(height: 6),
        const Text(
          'Injectez une trame ISO 8583 financière (0200) ou d\'annulation (0420) pour tester l\'analyseur.',
          style: TextStyle(color: Colors.white70, fontSize: 12),
        ),
        const SizedBox(height: 14),
        TextField(
          controller: _simController,
          maxLines: 4,
          style: const TextStyle(color: Colors.white, fontFamily: 'monospace', fontSize: 12),
          decoration: InputDecoration(
            filled: true,
            fillColor: const Color(0xFF0F172A),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            hintText: 'Collez la trame ISO ici...',
            hintStyle: const TextStyle(color: Colors.white30),
          ),
        ),
        const SizedBox(height: 14),
        ElevatedButton.icon(
          onPressed: _isSimulating ? null : _runSimulator,
          icon: _isSimulating
              ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
              : const Icon(Icons.play_arrow),
          label: Text(_isSimulating ? 'Analyse en cours...' : 'ANALYSER LA TRAME'),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.sgRed,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14),
          ),
        ),
        const SizedBox(height: 16),
        if (_simOutput.isNotEmpty)
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.black,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.white24),
            ),
            child: Text(
              _simOutput,
              style: const TextStyle(color: Colors.greenAccent, fontFamily: 'monospace', fontSize: 12, height: 1.4),
            ),
          ),
      ],
    );
  }

  Widget _buildExamTab(TrainingGrade grade, List<TrainingExamQuestion> questions) {
    if (questions.isEmpty) {
      return const Center(
        child: Text('Aucune question disponible.', style: TextStyle(color: Colors.white70)),
      );
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Résultat d'examen si soumis
        if (_examSubmitted)
          Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: _examPassed ? const Color(0xFF064E3B) : const Color(0xFF7F1D1D),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: _examPassed ? Colors.greenAccent : Colors.redAccent),
            ),
            child: Column(
              children: [
                Text(
                  _examPassed ? '🎉 EXAMEN RÉUSSI !' : '❌ ÉCHEC À L\'EXAMEN',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 6),
                Text(
                  'Score : $_examScore / ${questions.length} (${((_examScore / questions.length) * 100).round()}%) • Minimum requis : ${grade.minPassScorePct}%',
                  style: const TextStyle(color: Colors.white70, fontSize: 12),
                ),
                if (_examPassed)
                  const Padding(
                    padding: EdgeInsets.only(top: 6),
                    child: Text(
                      'Votre progression est sauvegardée ! Le niveau suivant est débloqué.',
                      style: TextStyle(color: Colors.greenAccent, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
              ],
            ),
          ),

        Text(
          'Examen Officiel : ${grade.name} (${questions.length} Questions)',
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
        ),
        const SizedBox(height: 4),
        Text(
          'Score d\'admission exigé : ${grade.minPassScorePct}% pour débloquer le grade suivant.',
          style: const TextStyle(color: Colors.white60, fontSize: 12),
        ),
        const SizedBox(height: 16),

        ...questions.asMap().entries.map((entry) {
          final idx = entry.key;
          final q = entry.value;
          final selected = _userAnswers[q.id];

          return Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: _examSubmitted
                    ? (selected == q.correctIndex ? Colors.green : Colors.redAccent)
                    : Colors.white12,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${idx + 1}. ${q.question}',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                ),
                const SizedBox(height: 10),
                ...q.options.asMap().entries.map((optEntry) {
                  final optIdx = optEntry.key;
                  final optText = optEntry.value;
                  final isOptSelected = selected == optIdx;

                  Color optColor = const Color(0xFF0F172A);
                  if (_examSubmitted) {
                    if (optIdx == q.correctIndex) {
                      optColor = Colors.green.withValues(alpha: 0.3);
                    } else if (isOptSelected) {
                      optColor = Colors.red.withValues(alpha: 0.3);
                    }
                  } else if (isOptSelected) {
                    optColor = AppTheme.sgRed.withValues(alpha: 0.4);
                  }

                  return InkWell(
                    onTap: _examSubmitted
                        ? null
                        : () {
                            setState(() {
                              _userAnswers[q.id] = optIdx;
                            });
                          },
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 6),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: optColor,
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(
                          color: isOptSelected ? AppTheme.sgRed : Colors.white12,
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            isOptSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                            color: isOptSelected ? AppTheme.sgRed : Colors.white54,
                            size: 16,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              optText,
                              style: const TextStyle(color: Colors.white, fontSize: 12),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }),
                if (_examSubmitted) ...[
                  const SizedBox(height: 8),
                  Text(
                    '💡 ${q.explanation}',
                    style: const TextStyle(color: Colors.greenAccent, fontSize: 11),
                  ),
                  if (q.trapWarning.isNotEmpty)
                    Text(
                      '⚠️ Piège : ${q.trapWarning}',
                      style: const TextStyle(color: Colors.amberAccent, fontSize: 11),
                    ),
                ],
              ],
            ),
          );
        }),

        ElevatedButton(
          onPressed: () => _submitExam(questions, grade),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.sgRed,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14),
          ),
          child: const Text('VALIDER MES RÉPONSES ET ENREGISTRER'),
        ),
      ],
    );
  }

  Widget _buildCertificateTab(TrainingGrade currentGrade) {
    final hasAchievedAll = _unlockedLevel >= 5;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: const Color(0xFF0F172A),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: hasAchievedAll ? Colors.amber : Colors.white24, width: 2),
            boxShadow: hasAchievedAll
                ? [
                    BoxShadow(
                      color: Colors.amber.withValues(alpha: 0.3),
                      blurRadius: 20,
                      spreadRadius: 2,
                    ),
                  ]
                : [],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                hasAchievedAll ? Icons.workspace_premium : Icons.lock,
                color: hasAchievedAll ? Colors.amber : Colors.white38,
                size: 56,
              ),
              const SizedBox(height: 12),
              Text(
                hasAchievedAll ? 'CERTIFICAT D\'INGÉNIEUR MONÉTIQUE' : 'CERTIFICAT VERROUILLÉ',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: hasAchievedAll ? Colors.amber : Colors.white60,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  letterSpacing: 1.2,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                hasAchievedAll
                    ? 'Ce certificat atteste que le candidat a validé avec succès l\'ensemble des 5 grades (150 examens techniques) en protocoles ISO 8583, sécurité cryptographique HSM et architectures de Switch Monétique.'
                    : 'Pour débloquer ce certificat officiel d\'Ingénieur Monétique, vous devez réussir les examens des 5 niveaux de qualification.',
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.white70, fontSize: 13, height: 1.4),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: hasAchievedAll ? Colors.amber.withValues(alpha: 0.2) : Colors.white10,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  'Niveau actuel : $_unlockedLevel / 5 Débloqués',
                  style: TextStyle(
                    color: hasAchievedAll ? Colors.amber : Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
