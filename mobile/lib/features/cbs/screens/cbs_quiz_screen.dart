import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../data/cbs_data.dart';

class CbsQuizScreen extends StatefulWidget {
  final Function(int earnedXp)? onXpEarned;

  const CbsQuizScreen({super.key, this.onXpEarned});

  @override
  State<CbsQuizScreen> createState() => _CbsQuizScreenState();
}

class _CbsQuizScreenState extends State<CbsQuizScreen> {
  int _currentIndex = 0;
  int? _selectedOptionIndex;
  bool _hasSubmitted = false;
  int _score = 0;
  int _earnedXp = 0;

  void _submitAnswer() {
    if (_selectedOptionIndex == null) return;
    setState(() {
      _hasSubmitted = true;
      final q = CbsData.quiz[_currentIndex];
      if (_selectedOptionIndex == q.correctIndex) {
        _score++;
        _earnedXp += q.points;
        widget.onXpEarned?.call(q.points);
      }
    });
  }

  void _nextQuestion() {
    setState(() {
      _currentIndex++;
      _selectedOptionIndex = null;
      _hasSubmitted = false;
    });
  }

  void _resetQuiz() {
    setState(() {
      _currentIndex = 0;
      _selectedOptionIndex = null;
      _hasSubmitted = false;
      _score = 0;
      _earnedXp = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_currentIndex >= CbsData.quiz.length) {
      return _buildResultsScreen();
    }

    final question = CbsData.quiz[_currentIndex];

    return Scaffold(
      appBar: AppBar(
        title: Text('CBS Academy (${_currentIndex + 1}/${CbsData.quiz.length})'),
        actions: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            margin: const EdgeInsets.only(right: 12),
            decoration: BoxDecoration(
              color: Colors.purpleAccent.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.purpleAccent.withValues(alpha: 0.4)),
            ),
            child: Row(
              children: [
                const Icon(Icons.bolt, color: Colors.purpleAccent, size: 16),
                const SizedBox(width: 4),
                Text(
                  '+$_earnedXp XP',
                  style: const TextStyle(color: Colors.purpleAccent, fontWeight: FontWeight.bold, fontSize: 12),
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
            // BARRE DE PROGRESSION
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: (_currentIndex + 1) / CbsData.quiz.length,
                backgroundColor: Colors.white10,
                valueColor: const AlwaysStoppedAnimation<Color>(Colors.purpleAccent),
                minHeight: 6,
              ),
            ),
            const SizedBox(height: 16),

            // BADGE CATÉGORIE
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.blueAccent.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: Colors.blueAccent.withValues(alpha: 0.4)),
                  ),
                  child: Text(
                    question.category,
                    style: const TextStyle(color: Colors.blueAccent, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ),
                Text(
                  '${question.points} XP',
                  style: const TextStyle(color: Colors.amberAccent, fontWeight: FontWeight.bold, fontSize: 12),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // QUESTION TEXT
            Text(
              question.question,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
                height: 1.3,
              ),
            ),
            const SizedBox(height: 20),

            // OPTIONS
            ...List.generate(question.options.length, (idx) {
              final option = question.options[idx];
              final isSelected = _selectedOptionIndex == idx;
              final isCorrect = idx == question.correctIndex;

              Color borderColor = AppTheme.borderDark;
              Color bgColor = AppTheme.darkCard;

              if (_hasSubmitted) {
                if (isCorrect) {
                  borderColor = Colors.greenAccent;
                  bgColor = Colors.greenAccent.withValues(alpha: 0.15);
                } else if (isSelected && !isCorrect) {
                  borderColor = AppTheme.sgRed;
                  bgColor = AppTheme.sgRed.withValues(alpha: 0.15);
                }
              } else if (isSelected) {
                borderColor = Colors.purpleAccent;
                bgColor = Colors.purpleAccent.withValues(alpha: 0.1);
              }

              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                decoration: BoxDecoration(
                  color: bgColor,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: borderColor, width: isSelected || (_hasSubmitted && isCorrect) ? 1.5 : 1),
                ),
                child: ListTile(
                  onTap: _hasSubmitted ? null : () => setState(() => _selectedOptionIndex = idx),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  leading: Container(
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: borderColor),
                      color: isSelected ? borderColor.withValues(alpha: 0.2) : Colors.transparent,
                    ),
                    child: Center(
                      child: Text(
                        String.fromCharCode(65 + idx),
                        style: TextStyle(
                          color: isSelected ? Colors.white : AppTheme.textSecondary,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ),
                  title: Text(
                    option,
                    style: const TextStyle(color: Colors.white, fontSize: 13),
                  ),
                ),
              );
            }),

            const SizedBox(height: 16),

            // EXPLICATION APRÈS SOUMISSION
            if (_hasSubmitted) ...[
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          _selectedOptionIndex == question.correctIndex ? Icons.check_circle : Icons.cancel,
                          color: _selectedOptionIndex == question.correctIndex ? Colors.greenAccent : AppTheme.sgRed,
                          size: 18,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          _selectedOptionIndex == question.correctIndex ? 'Bonne Réponse !' : 'Explication Technique :',
                          style: TextStyle(
                            color: _selectedOptionIndex == question.correctIndex ? Colors.greenAccent : AppTheme.sgRed,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      question.explanation,
                      style: const TextStyle(color: Colors.white70, fontSize: 12, height: 1.3),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
            ],

            // BOUTON VALIDER / SUIVANT
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: _selectedOptionIndex == null
                    ? null
                    : _hasSubmitted
                        ? _nextQuestion
                        : _submitAnswer,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.purpleAccent.shade700,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(
                  _hasSubmitted ? 'Question Suivante' : 'Valider la Réponse',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultsScreen() {
    final total = CbsData.quiz.length;
    final percentage = ((_score / total) * 100).toInt();

    return Scaffold(
      appBar: AppBar(title: const Text('Résultats CBS Academy')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.purpleAccent.withValues(alpha: 0.15),
                  border: Border.all(color: Colors.purpleAccent, width: 2),
                ),
                child: const Icon(Icons.workspace_premium, color: Colors.purpleAccent, size: 64),
              ),
              const SizedBox(height: 24),
              Text(
                'Score : $_score / $total ($percentage%)',
                style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                '+$_earnedXp XP engrangés sur le parcours CBS',
                style: const TextStyle(color: Colors.amberAccent, fontSize: 14, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _resetQuiz,
                  icon: const Icon(Icons.refresh),
                  label: const Text('Recommencer le Quiz'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.purpleAccent.shade700,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () => Navigator.pop(context),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: Colors.white30),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: const Text('Retour au Hub CBS'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
