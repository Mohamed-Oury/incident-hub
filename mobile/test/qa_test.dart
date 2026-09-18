import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import "package:sqflite/sqflite.dart";
import "package:sqflite_common_ffi/sqflite_ffi.dart";
import 'package:payway_incident_hub/core/models/incident.dart';
import 'package:payway_incident_hub/core/utils/bitmap_helper.dart';
import 'package:payway_incident_hub/features/home/home_screen.dart';
import 'package:payway_incident_hub/features/bitmap/bitmap_screen.dart';

void main() {
  setUpAll(() {
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
  });

  group('QA SUITE 1 : Intégrité des Données & Fichiers Assets', () {
    test('QA-1.1 : Vérification du catalogue des 500 incidents de référence', () {
      final file = File('assets/data/reference_incidents.json');
      expect(file.existsSync(), isTrue, reason: 'Le fichier reference_incidents.json doit exister');

      final content = file.readAsStringSync();
      final List<dynamic> jsonList = jsonDecode(content);

      expect(jsonList.length, equals(500), reason: 'Le catalogue doit contenir exactement 500 incidents');

      // Vérifier chaque élément
      final Set<String> references = {};
      for (final item in jsonList) {
        expect(item['reference'], isNotNull);
        expect((item['reference'] as String).startsWith('INC-'), isTrue);
        expect(item['title'], isNotNull);
        expect((item['title'] as String).isNotEmpty, isTrue);
        expect(item['domain'], isNotNull);
        expect(item['component'], isNotNull);
        expect(item['analysisKeys'] ?? item['errorCode'], isNotNull);
        expect(item['observations'], isNotNull);
        expect(item['flowSteps'], isNotNull);
        expect(item['knowledgeStatus'], isIn(['VALIDATED', 'REFERENCE_SCENARIO']));

        // Unicité des références
        expect(references.contains(item['reference']), isFalse,
            reason: 'La référence ${item['reference']} est dupliquée');
        references.add(item['reference'] as String);
      }
    });

    test('QA-1.2 : Vérification du référentiel DE39 (ISO 8583)', () {
      final file = File('assets/data/de39_catalog.json');
      expect(file.existsSync(), isTrue, reason: 'Le fichier de39_catalog.json doit exister');

      final content = file.readAsStringSync();
      final List<dynamic> jsonList = jsonDecode(content);

      expect(jsonList.length, greaterThanOrEqualTo(40), reason: 'Au moins 40 codes DE39 doivent être documentés');

      for (final item in jsonList) {
        expect(item['code'], isNotNull);
        expect((item['code'] as String).length, equals(2));
        expect(item['label'], isNotNull);
        expect(item['category'], isIn([
          'APPROBATION',
          'METIER_PORTEUR',
          'SECURITE_CRYPTO',
          'TECHNIQUE_RESEAU',
          'GESTION_RESEAU',
        ]));
        expect(item['meaning'], isNotNull);
        expect(item['impactIncident'], isNotNull);
        expect(item['recommendedAction'], isNotNull);
      }
    });
  });

  group('QA SUITE 2 : Base Locale SQLite & Moteur de Recherche', () {
    late Database db;

    setUp(() async {
      db = await databaseFactory.openDatabase(inMemoryDatabasePath);
      await db.execute('''
        CREATE TABLE incidents (
          reference TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          domain TEXT,
          component TEXT,
          analysis_keys TEXT,
          knowledge_status TEXT,
          is_custom INTEGER DEFAULT 0,
          raw_json TEXT
        )
      ''');
      await db.execute('''
        CREATE TABLE de39 (
          code TEXT PRIMARY KEY,
          label TEXT NOT NULL,
          category TEXT,
          meaning TEXT,
          impact_incident TEXT,
          recommended_action TEXT
        )
      ''');

      // Bulk seeding
      final file = File('assets/data/reference_incidents.json');
      final List<dynamic> list = jsonDecode(file.readAsStringSync());
      final batch = db.batch();
      for (final item in list) {
        final inc = IncidentModel.fromJson(item as Map<String, dynamic>);
        batch.insert('incidents', inc.toMap());
      }
      await batch.commit(noResult: true);
    });

    tearDown(() async {
      await db.close();
    });

    test('QA-2.1 : Vérification de la volumétrie et indexation BDD', () async {
      final count = Sqflite.firstIntValue(await db.rawQuery('SELECT COUNT(*) FROM incidents'));
      expect(count, equals(500));
    });

    test('QA-2.2 : Requête de recherche complexe (DE39=91 & GAB)', () async {
      final results = await db.query(
        'incidents',
        where: 'domain = ? AND (title LIKE ? OR analysis_keys LIKE ?)',
        whereArgs: ['GAB', '%91%', '%91%'],
      );
      expect(results.isNotEmpty, isTrue);
      for (final r in results) {
        expect(r['domain'], equals('GAB'));
        final match = (r['title'] as String).contains('91') || (r['analysis_keys'] as String).contains('91');
        expect(match, isTrue);
      }
    });

    test('QA-2.3 : Pagination et performance de récupération', () async {
      final stopwatch = Stopwatch()..start();
      final page1 = await db.query('incidents', limit: 50, offset: 0, orderBy: 'reference ASC');
      final page2 = await db.query('incidents', limit: 50, offset: 50, orderBy: 'reference ASC');
      stopwatch.stop();

      expect(page1.length, equals(50));
      expect(page2.length, equals(50));
      expect(page1.first['reference'], isNot(equals(page2.first['reference'])));
      expect(stopwatch.elapsedMilliseconds, lessThan(200), reason: 'La requête doit s\'exécuter en moins de 200ms');
    });
  });

  group('QA SUITE 3 : Moteur Monétique Bitmap & ISO 8583', () {
    test('QA-3.1 : Décodage trame d\'autorisation 0200 classique', () {
      const hex = '7238248108C08000';
      final res = BitmapHelper.decodeHex(hex);

      expect(res.binary.length, equals(64));
      expect(res.hasSecondary, isFalse);

      // DE obligatoires 0200
      expect(res.activeElements, containsAll([2, 3, 4, 11, 41, 42]));
    });

    test('QA-3.2 : Décodage trame avec Bitmap étendu (128 bits)', () {
      const hex = 'F238248108C080000000000000000002';
      final res = BitmapHelper.decodeHex(hex);

      expect(res.binary.length, equals(128));
      expect(res.hasSecondary, isTrue);
      expect(res.activeElements, contains(1)); // Secondary bitmap bit
    });

    test('QA-3.3 : Propriété de symétrie (encode -> decode -> match)', () {
      final originalElements = [2, 3, 4, 11, 14, 22, 25, 35, 41, 42, 54];
      final hex = BitmapHelper.encodeElements(originalElements);
      final decoded = BitmapHelper.decodeHex(hex);

      expect(decoded.activeElements, containsAll(originalElements));
    });
  });

  group('QA SUITE 4 : Écrans & Widgets UI', () {
    testWidgets('QA-4.1 : Rendu sans erreur du HomeScreen', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: HomeScreen(),
        ),
      );
      expect(find.text('M.OURY'), findsOneWidget);
      expect(find.text('Incident Hub • Astreinte Monétique'), findsOneWidget);
    });

    testWidgets('QA-4.2 : Rendu sans erreur du Décodeur Bitmap', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: BitmapScreen(),
        ),
      );
      await tester.pump();

      expect(find.text('Décodeur Bitmap ISO 8583'), findsOneWidget);
      expect(find.text('Champs ISO 8583 Activés (Data Elements) :'), findsOneWidget);
      expect(find.byType(TextField), findsOneWidget);
    });
  });
}
