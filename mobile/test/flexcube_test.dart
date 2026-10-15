import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:payway_incident_hub/features/flexcube/data/flexcube_data.dart';
import 'package:payway_incident_hub/features/flexcube/services/flexcube_copilot_service.dart';
import 'package:payway_incident_hub/features/flexcube/screens/flexcube_home_screen.dart';

void main() {
  group('QA SUITE ORACLE FLEXCUBE & MULTI-CBS MOBILE', () {
    // TEST 1 : 16 Tables centrales du schéma Oracle FLEXCUBE
    test('TEST 1 : Référentiel Schéma Tables Oracle FLEXCUBE (16 tables)', () {
      final tables = FlexcubeData.schemaTables;
      expect(tables.length, equals(16));

      const requiredTables = [
        'STTM_CUSTOMER',
        'STTM_CUST_ACCOUNT',
        'ACTB_DAILY_LOG',
        'GLTB_GL_BALANCES',
        'FTTB_CONTRACT_MASTER',
        'AETB_PROCESS_PROGRESS',
        'GWTM_GATEWAY_PARAM',
      ];

      for (final req in requiredTables) {
        expect(
          tables.any((t) => t.tableName == req),
          isTrue,
          reason: 'La table $req doit être présente dans le dictionnaire',
        );
      }
    });

    // TEST 2 : Chaîne Batch AEOD (5 phases, 10 étapes)
    test('TEST 2 : Chaîne de Clôture Batch AEOD (10 étapes, 5 phases)', () {
      final steps = FlexcubeData.aeodSteps;
      expect(steps.length, equals(10));

      const phases = ['PEOD', 'EOTI', 'EOFI', 'EOD', 'BOD'];
      for (final p in phases) {
        expect(
          steps.any((s) => s.phaseCode == p),
          isTrue,
          reason: 'La phase $p doit être présente dans la chaîne AEOD',
        );
      }
    });

    // TEST 3 : Scénarios de dépannage d'urgence AEOD
    test('TEST 3 : Scénarios de Dépannage d Urgence AEOD (5 scénarios)', () {
      final scenarios = FlexcubeData.aeodScenarios;
      expect(scenarios.length, greaterThanOrEqualTo(5));

      for (final sc in scenarios) {
        expect(sc.sqlDiagnostic.isNotEmpty, isTrue);
        expect(sc.resolutionSteps.isNotEmpty, isTrue);
      }
    });

    // TEST 4 : Catalogue des 20 Incidents RUN
    test('TEST 4 : Catalogue Incidents & RCA Oracle FLEXCUBE RUN (20 cas)', () {
      final incidents = FlexcubeData.incidents;
      expect(incidents.length, equals(20));

      const criticalErrors = ['ORA-00054', 'ORA-01555', 'ORA-00001', 'AC-VAL-001', 'GW-RESP-01'];
      for (final err in criticalErrors) {
        expect(
          incidents.any((i) => i.errorCode == err),
          isTrue,
          reason: 'L\'incident critique $err doit exister',
        );
      }
    });

    // TEST 5 : Antisèche Oracle FLEXCUBE (20 fiches mémo sur 6 catégories)
    test('TEST 5 : Antisèche Officielle Oracle FLEXCUBE (20 fiches)', () {
      final cheat = FlexcubeData.cheatSections;
      expect(cheat.length, equals(20));

      final categories = cheat.map((c) => c.category).toSet();
      expect(categories.length, equals(6));
      expect(categories, containsAll(['ARCHITECTURE', 'SCHEMA', 'PLSQL', 'AEOD', 'RUN_INCIDENTS', 'GATEWAY']));
    });

    // TEST 6 : Cursus Certifiant 5 Niveaux
    test('TEST 6 : Cursus de Qualification FLEXCUBE (5 Niveaux)', () {
      final grades = FlexcubeData.grades;
      expect(grades.length, equals(5));

      for (final g in grades) {
        expect(g.recommendedResources.isNotEmpty, isTrue);
        expect(g.minPassScorePct, greaterThanOrEqualTo(70));
      }
    });

    // TEST 7 : 15 Leçons Techniques Approfondies
    test('TEST 7 : Leçons Techniques Approfondies FLEXCUBE (15 leçons)', () {
      final lessons = FlexcubeData.lessons;
      expect(lessons.length, equals(15));

      for (final l in lessons) {
        expect(l.contentMarkdown.length, greaterThan(50));
        expect(l.keyTakeaways.isNotEmpty, isTrue);
      }
    });

    // TEST 8 : Examens Officiels FLEXCUBE Academy (75 Questions QCM, 15/grade)
    test('TEST 8 : Banque d Examens Officiels FLEXCUBE (75 Questions, 15/grade)', () {
      final exams = FlexcubeData.examQuestions;
      expect(exams.length, equals(75));

      for (int lvl = 1; lvl <= 5; lvl++) {
        final count = exams.where((q) => q.gradeLevel == lvl).length;
        expect(count, equals(15), reason: 'Le Grade $lvl doit comporter exactement 15 questions');
      }
    });

    // TEST 9 : Linter PL/SQL (NOWAIT et COMMIT prématuré)
    test('TEST 9 : Linter PL/SQL détecte COMMIT prématuré et FOR UPDATE sans NOWAIT', () {
      const badCode = '''
        CREATE OR REPLACE PROCEDURE Test_Proc IS
        BEGIN
          SELECT * FROM STTM_CUST_ACCOUNT FOR UPDATE;
          COMMIT;
        END;
      ''';

      final issues = FlexcubeCopilotService.reviewPlSql(badCode);
      expect(issues.length, greaterThanOrEqualTo(2));
      expect(issues.any((i) => i.rule == 'NO_PREMATURE_COMMIT'), isTrue);
      expect(issues.any((i) => i.rule == 'FOR_UPDATE_NOWAIT_MANDATORY'), isTrue);
    });

    // TEST 10 : Diagnostic d'Incidents SGBD
    test('TEST 10 : Diagnostic SGBD Oracle ORA-00054', () {
      final diag = FlexcubeCopilotService.analyzeIncident(
        'ORA-00054: resource busy and acquire with NOWAIT specified or timeout expired',
      );

      expect(diag.detectedIncident, isNotNull);
      expect(diag.detectedIncident!.errorCode, equals('ORA-00054'));
      expect(diag.sqlDiagnostic.contains('v\$session'), isTrue);
    });

    // TEST 11 : Générateur de Package Custom CUSPKS
    test('TEST 11 : Générateur de Package Custom CUSPKS avec gestion NOWAIT', () {
      final pkg = FlexcubeCopilotService.generatePlSqlPackage(
        title: 'Virement Interne',
        module: 'FT',
        description: 'Virement de compte à compte',
      );

      expect(pkg.packageName.startsWith('CUSPKS_FT_'), isTrue);
      expect(pkg.packageBody.contains('NOWAIT'), isTrue);
      expect(pkg.packageBody.contains('Pr_Process_Request'), isTrue);
      expect(pkg.testCases.length, greaterThanOrEqualTo(4));
    });

    // TEST 12 : Rendu des Widgets UI FLEXCUBE
    testWidgets('TEST 12 : Rendu sans erreur de FlexcubeHomeScreen', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: FlexcubeHomeScreen(),
        ),
      );
      await tester.pump();

      expect(find.text('ORACLE FLEXCUBE'), findsOneWidget);
      expect(find.text('Core Banking Universal • Hub PL/SQL'), findsOneWidget);
      expect(find.text('MODULES D\'EXPLOITATION ORACLE FLEXCUBE'), findsOneWidget);
    });
  });
}
