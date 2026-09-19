import 'dart:async';
import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/database/gamification_service.dart';
import 'quiz_questions.dart';

class QuizScreen extends StatefulWidget {
  final String category;

  const QuizScreen({super.key, required this.category});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  late List<QuizQuestion> _questions;
  int _currentIndex = 0;
  int _selectedOption = -1;
  bool _answered = false;
  int _score = 0;
  int _earnedXp = 0;

  Timer? _timer;
  int _timeLeft = 20;

  @override
  void initState() {
    super.initState();
    final allAvailable = List<QuizQuestion>.from(
      QuizQuestionsCatalog.getQuestionsByCategory(widget.category),
    );
    allAvailable.shuffle();
    // Limite chaque session d'entraînement à 10 questions aléatoires pour un rythme de gaming dynamique
    _questions = allAvailable.take(10).toList();
    if (_questions.isEmpty) {
      _questions = QuizQuestionsCatalog.allQuestions.take(10).toList();
    }
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    setState(() {
      _timeLeft = 20;
    });
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_timeLeft > 0) {
        setState(() => _timeLeft--);
      } else {
        _timer?.cancel();
        if (!_answered) {
          _submitAnswer(-1); // Temps écoulé
        }
      }
    });
  }

  void _submitAnswer(int index) {
    if (_answered) return;
    _timer?.cancel();

    final q = _questions[_currentIndex];
    final bool isCorrect = index == q.correctIndex;

    setState(() {
      _answered = true;
      _selectedOption = index;
      if (isCorrect) {
        _score++;
        _earnedXp += q.xpReward;
      }
    });
  }

  void _nextQuestion() async {
    if (_currentIndex < _questions.length - 1) {
      setState(() {
        _currentIndex++;
        _selectedOption = -1;
        _answered = false;
      });
      _startTimer();
    } else {
      // Quiz terminé
      _timer?.cancel();
      if (_earnedXp > 0) {
        await GamificationService.instance.addXp(
          _earnedXp,
          newBadge: _score == _questions.length ? 'Expert Sans Faute' : null,
        );
      }
      _showResultDialog();
    }
  }

  void _showResultDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.darkCard,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: const BorderSide(color: AppTheme.borderDark)),
        title: const Text('Session Terminée ! 🎉', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Score : $_score / ${_questions.length}',
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.sgRed),
            ),
            const SizedBox(height: 10),
            Text(
              '+$_earnedXp XP engrangés pour votre progression !',
              style: const TextStyle(color: AppTheme.successGreen, fontWeight: FontWeight.w600, fontSize: 14),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.sgRed),
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.pop(context, true);
            },
            child: const Text('Retour à l\'Academy', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_questions.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('Quiz Monétique')),
        body: const Center(child: Text('Aucune question disponible.')),
      );
    }

    final q = _questions[_currentIndex];

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.category),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: _timeLeft <= 5 ? AppTheme.sgRed.withValues(alpha: 0.2) : Colors.white10,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: _timeLeft <= 5 ? AppTheme.sgRed : AppTheme.borderDark),
            ),
            child: Row(
              children: [
                Icon(Icons.timer_outlined, size: 16, color: _timeLeft <= 5 ? AppTheme.sgRed : Colors.white),
                const SizedBox(width: 4),
                Text(
                  '${_timeLeft}s',
                  style: TextStyle(
                    color: _timeLeft <= 5 ? AppTheme.sgRed : Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
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
            // Progression
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Question ${_currentIndex + 1} sur ${_questions.length}',
                  style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13, fontWeight: FontWeight.bold),
                ),
                Text(
                  'XP : +$_earnedXp',
                  style: const TextStyle(color: AppTheme.sgRed, fontWeight: FontWeight.bold, fontSize: 13),
                ),
              ],
            ),
            const SizedBox(height: 6),
            LinearProgressIndicator(
              value: (_currentIndex + 1) / _questions.length,
              backgroundColor: const Color(0xFF1F2937),
              color: AppTheme.sgRed,
              minHeight: 6,
              borderRadius: BorderRadius.circular(3),
            ),

            const SizedBox(height: 20),

            // Carte Question
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppTheme.darkCard,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppTheme.borderDark),
              ),
              child: Text(
                q.question,
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white, height: 1.4),
              ),
            ),

            const SizedBox(height: 16),

            // Options QCM
            Column(
              children: List.generate(q.options.length, (idx) {
                final optionText = q.options[idx];
                Color cardColor = const Color(0xFF1F2937);
                Color borderColor = AppTheme.borderDark;
                IconData? stateIcon;

                if (_answered) {
                  if (idx == q.correctIndex) {
                    cardColor = AppTheme.successGreen.withValues(alpha: 0.15);
                    borderColor = AppTheme.successGreen;
                    stateIcon = Icons.check_circle;
                  } else if (idx == _selectedOption) {
                    cardColor = AppTheme.sgRed.withValues(alpha: 0.15);
                    borderColor = AppTheme.sgRed;
                    stateIcon = Icons.cancel;
                  }
                }

                return Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: InkWell(
                    onTap: _answered ? null : () => _submitAnswer(idx),
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
                          CircleAvatar(
                            radius: 12,
                            backgroundColor: Colors.white10,
                            child: Text(
                              String.fromCharCode(65 + idx),
                              style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              optionText,
                              style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500),
                            ),
                          ),
                          if (stateIcon != null)
                            Icon(stateIcon, size: 18, color: borderColor),
                        ],
                      ),
                    ),
                  ),
                );
              }),
            ),

            if (_answered) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFF111827),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppTheme.borderDark),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Explication Technique :', style: TextStyle(color: AppTheme.sgRed, fontWeight: FontWeight.bold, fontSize: 12)),
                    const SizedBox(height: 4),
                    Text(q.explanation, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.sgRed,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  onPressed: _nextQuestion,
                  child: Text(
                    _currentIndex < _questions.length - 1 ? 'Question Suivante ➔' : 'Terminer le Quiz 🏆',
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
