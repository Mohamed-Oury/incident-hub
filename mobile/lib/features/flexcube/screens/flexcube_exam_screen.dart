import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../data/flexcube_data.dart';
import '../models/flexcube_models.dart';

class FlexcubeExamScreen extends StatefulWidget {
  final int initialGradeLevel;

  const FlexcubeExamScreen({super.key, this.initialGradeLevel = 1});

  @override
  State<FlexcubeExamScreen> createState() => _FlexcubeExamScreenState();
}

class _FlexcubeExamScreenState extends State<FlexcubeExamScreen> {
  late int _selectedGradeLevel;
  int _currentQuestionIndex = 0;
  final Map<int, int> _userAnswers = {};
  bool _isSubmitted = false;

  static const Color flexcubeOrange = Color(0xFFEA580C);
  static const Color flexcubeOrangeLight = Color(0xFFFB923C);

  @override
  void initState() {
    super.initState();
    _selectedGradeLevel = widget.initialGradeLevel;
  }

  List<FlexcubeExamQuestion> get _currentQuestions {
    return FlexcubeData.examQuestions.where((q) => q.gradeLevel == _selectedGradeLevel).toList();
  }

  void _selectGrade(int grade) {
    setState(() {
      _selectedGradeLevel = grade;
      _currentQuestionIndex = 0;
      _userAnswers.clear();
      _isSubmitted = false;
    });
  }

  void _chooseOption(int index) {
    if (_isSubmitted) return;
    setState(() {
      _userAnswers[_currentQuestionIndex] = index;
    });
  }

  int get _score {
    int score = 0;
    final questions = _currentQuestions;
    for (int i = 0; i < questions.length; i++) {
      if (_userAnswers[i] == questions[i].correctIndex) {
        score++;
      }
    }
    return score;
  }

  @override
  Widget build(BuildContext context) {
    final questions = _currentQuestions;
    final q = questions.isNotEmpty && _currentQuestionIndex < questions.length
        ? questions[_currentQuestionIndex]
        : null;

    final grade = FlexcubeData.grades.firstWhere((g) => g.level == _selectedGradeLevel);

    return Scaffold(
      appBar: AppBar(
        title: Text('Examen Officiel FCUBS — Grade $_selectedGradeLevel'),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 14),
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: flexcubeOrange.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: flexcubeOrange),
            ),
            child: Text(
              '${_userAnswers.length}/${questions.length} répondus',
              style: const TextStyle(color: flexcubeOrangeLight, fontSize: 11, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Sélecteur de grade (1 à 5)
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [1, 2, 3, 4, 5].map((lvl) {
                  final isSel = _selectedGradeLevel == lvl;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text('Grade $lvl (15 QCM)'),
                      selected: isSel,
                      selectedColor: flexcubeOrange,
                      onSelected: (_) => _selectGrade(lvl),
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 12),

            // En-tête de l'examen
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.darkCard,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppTheme.borderDark),
              ),
              child: Row(
                children: [
                  Text(grade.badge, style: const TextStyle(fontSize: 24)),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          grade.name,
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        Text(
                          'Score de passage requis : ${grade.minPassScorePct}% • 15 questions officielles',
                          style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            if (q != null && !_isSubmitted) ...[
              // Question active
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'QUESTION ${_currentQuestionIndex + 1} / ${questions.length}',
                    style: const TextStyle(color: flexcubeOrange, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                  ),
                  Text(
                    'Module ${q.module}',
                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 11, fontFamily: 'monospace'),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.borderDark),
                ),
                child: Text(
                  q.question,
                  style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold, height: 1.3),
                ),
              ),
              const SizedBox(height: 14),

              // Options
              ...q.options.asMap().entries.map((entry) {
                final idx = entry.key;
                final opt = entry.value;
                final isSelected = _userAnswers[_currentQuestionIndex] == idx;

                return Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: InkWell(
                    onTap: () => _chooseOption(idx),
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isSelected ? flexcubeOrange.withValues(alpha: 0.15) : AppTheme.darkCard,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: isSelected ? flexcubeOrange : AppTheme.borderDark,
                          width: isSelected ? 1.5 : 1,
                        ),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 24,
                            height: 24,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: isSelected ? flexcubeOrange : Colors.transparent,
                              border: Border.all(color: isSelected ? flexcubeOrange : AppTheme.borderDark),
                            ),
                            child: Center(
                              child: Text(
                                String.fromCharCode(65 + idx),
                                style: TextStyle(
                                  color: isSelected ? Colors.white : AppTheme.textSecondary,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 11,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              opt,
                              style: TextStyle(
                                color: isSelected ? Colors.white : Colors.white70,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),
              const SizedBox(height: 14),

              // Navigation entre questions
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.darkSurface,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: _currentQuestionIndex > 0
                        ? () => setState(() => _currentQuestionIndex--)
                        : null,
                    child: const Text('Précédent'),
                  ),
                  if (_currentQuestionIndex < questions.length - 1)
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: flexcubeOrange,
                        foregroundColor: Colors.white,
                      ),
                      onPressed: () => setState(() => _currentQuestionIndex++),
                      child: const Text('Suivant'),
                    )
                  else
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.successGreen,
                        foregroundColor: Colors.white,
                      ),
                      onPressed: () => setState(() => _isSubmitted = true),
                      child: const Text('Valider l\'Examen'),
                    ),
                ],
              ),
            ] else if (_isSubmitted) ...[
              // Résultats
              _buildResultsCard(questions, grade),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildResultsCard(List<FlexcubeExamQuestion> questions, FlexcubeGrade grade) {
    final score = _score;
    final total = questions.length;
    final pct = ((score / total) * 100).round();
    final isPassed = pct >= grade.minPassScorePct;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.darkCard,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isPassed ? AppTheme.successGreen : AppTheme.errorRed,
              width: 2,
            ),
          ),
          child: Column(
            children: [
              Icon(
                isPassed ? Icons.verified : Icons.cancel,
                color: isPassed ? AppTheme.successGreen : AppTheme.errorRed,
                size: 48,
              ),
              const SizedBox(height: 10),
              Text(
                isPassed ? 'CERTIFICATION VALIDE !' : 'SCORE INSUFFISANT',
                style: TextStyle(
                  color: isPassed ? AppTheme.successGreen : AppTheme.errorRed,
                  fontWeight: FontWeight.w900,
                  fontSize: 18,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '$score / $total ($pct%) • Requis : ${grade.minPassScorePct}%',
                style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                isPassed
                    ? 'Félicitations ! Vous avez acquis les compétences du Grade ${grade.level} : ${grade.name}.'
                    : 'Révisez les 3 leçons du Grade ${grade.level} avant de retenter l\'examen.',
                textAlign: TextAlign.center,
                style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
              ),
              const SizedBox(height: 14),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(backgroundColor: flexcubeOrange),
                onPressed: () => _selectGrade(_selectedGradeLevel),
                icon: const Icon(Icons.refresh, size: 16),
                label: const Text('Recommencer l\'Examen'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),
        const Text(
          'CORRECTION DÉTAILLÉE DES 15 QUESTIONS',
          style: TextStyle(color: flexcubeOrange, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
        const SizedBox(height: 10),
        ...questions.asMap().entries.map((entry) {
          final idx = entry.key;
          final item = entry.value;
          final userChoice = _userAnswers[idx];
          final isCorrect = userChoice == item.correctIndex;

          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.darkCard,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: isCorrect ? AppTheme.successGreen.withValues(alpha: 0.5) : AppTheme.errorRed.withValues(alpha: 0.5)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(isCorrect ? Icons.check_circle : Icons.cancel, color: isCorrect ? AppTheme.successGreen : AppTheme.errorRed, size: 16),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Q${idx + 1}. ${item.question}',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'Bonne réponse : ${item.options[item.correctIndex]}',
                  style: const TextStyle(color: AppTheme.successGreen, fontSize: 11, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 4),
                Text(
                  item.explanation,
                  style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                ),
                const SizedBox(height: 4),
                Text(
                  'Réf : ${item.referenceDoc}',
                  style: const TextStyle(color: AppTheme.textMuted, fontSize: 10, fontFamily: 'monospace'),
                ),
              ],
            ),
          );
        }),
      ],
    );
  }
}
