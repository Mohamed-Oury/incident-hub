import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:payway_incident_hub/features/training/models/training_models.dart';
import 'package:payway_incident_hub/features/training/screens/training_monetique_screen.dart';
import 'package:payway_incident_hub/features/training/screens/training_cbs_screen.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

void main() {
  setUpAll(() {
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
  });

  group('Modèles et Décodage Training JSON', () {
    test('TrainingGrade instanciation correcte', () {
      final grade = TrainingGrade(
        level: 1,
        gradeCode: 'APPRENTI',
        name: 'Niveau 1',
        badge: '🟢 Apprenti',
        color: '#10b981',
        minPassScorePct: 80,
        objective: 'Objectif de test',
        recommendedResources: const [],
      );

      expect(grade.level, 1);
      expect(grade.gradeCode, 'APPRENTI');
      expect(grade.minPassScorePct, 80);
    });

    test('TrainingExamQuestion instanciation correcte', () {
      final q = TrainingExamQuestion(
        id: 'q1',
        gradeLevel: 1,
        question: 'Quel est le MTI d\'une demande financière ?',
        options: ['0200', '0210', '0420', '0800'],
        correctIndex: 0,
        explanation: '0200 = Acquirer Financial Request',
        trapWarning: '0210 est la réponse',
      );

      expect(q.id, 'q1');
      expect(q.correctIndex, 0);
      expect(q.options.length, 4);
    });
  });

  group('Widgets Rendu Écrans Cursus de Formation', () {
    testWidgets('Rendu sans crash de TrainingMonetiqueScreen', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: TrainingMonetiqueScreen(),
        ),
      );

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('Rendu sans crash de TrainingCbsScreen', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: TrainingCbsScreen(),
        ),
      );

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });
  });
}
