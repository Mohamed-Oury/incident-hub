import 'package:flutter_test/flutter_test.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:payway_incident_hub/core/models/incident.dart';
import 'package:payway_incident_hub/core/models/de39.dart';

void main() {
  setUpAll(() {
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
  });

  group('SQLite In-Memory Unit Tests', () {
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
          is_custom INTEGER DEFAULT 0
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
    });

    tearDown(() async {
      await db.close();
    });

    test('Insertion et recherche filtrée des incidents', () async {
      final inc1 = IncidentModel(
        reference: 'INC-001',
        title: 'GAB - Retrait en échec suite à timeout CBS',
        domain: 'GAB',
        component: 'CBS/DB',
        analysisKeys: 'DE39, STAN, RRN',
        knowledgeStatus: 'VALIDATED',
      );

      final inc2 = IncidentModel(
        reference: 'INC-002',
        title: 'TPE - Rejet DE39=51 fonds insuffisants',
        domain: 'TPE',
        component: 'Host',
        analysisKeys: 'DE39=51, DE4',
        knowledgeStatus: 'VALIDATED',
      );

      await db.insert('incidents', inc1.toMap());
      await db.insert('incidents', inc2.toMap());

      // Recherche par texte
      final searchRes = await db.query(
        'incidents',
        where: 'reference LIKE ? OR title LIKE ? OR analysis_keys LIKE ?',
        whereArgs: ['%51%', '%51%', '%51%'],
      );
      expect(searchRes.length, equals(1));
      expect(searchRes.first['reference'], equals('INC-002'));

      // Recherche par domaine GAB
      final gabRes = await db.query(
        'incidents',
        where: 'domain = ?',
        whereArgs: ['GAB'],
      );
      expect(gabRes.length, equals(1));
      expect(gabRes.first['reference'], equals('INC-001'));
    });

    test('Insertion et recherche des codes DE39', () async {
      final code91 = DE39Model(
        code: '91',
        label: 'System Error or Issuer Timeout',
        category: 'TECHNIQUE_RESEAU',
        meaning: 'L\'émetteur ou le switch n\'a pas répondu dans le délai imparti.',
        impactIncident: 'Extourne automatique requise.',
        recommendedAction: 'Vérifier la connectivité réseau et les acquittements.',
      );

      await db.insert('de39', code91.toMap());

      final res = await db.query('de39', where: 'code = ?', whereArgs: ['91']);
      expect(res.isNotEmpty, isTrue);
      final model = DE39Model.fromMap(res.first);
      expect(model.code, equals('91'));
      expect(model.category, equals('TECHNIQUE_RESEAU'));
    });
  });
}
