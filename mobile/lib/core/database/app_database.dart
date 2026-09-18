import 'dart:convert';
import "package:flutter/foundation.dart";
import "package:flutter/services.dart";
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import '../models/incident.dart';
import '../models/de39.dart';

class AppDatabase {
  static final AppDatabase instance = AppDatabase._internal();
  static Database? _database;

  AppDatabase._internal();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'payway_incident_hub.db');

    return await openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        await _createTables(db);
        await _seedInitialData(db);
      },
    );
  }

  Future<void> _createTables(Database db) async {
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

    await db.execute('CREATE INDEX idx_incidents_search ON incidents (domain, component, knowledge_status)');

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
  }

  Future<void> _seedInitialData(Database db) async {
    try {
      // Seed Reference Incidents
      final incidentsRaw = await rootBundle.loadString('assets/data/reference_incidents.json');
      final List<dynamic> incidentsJson = jsonDecode(incidentsRaw);
      
      final batchIncidents = db.batch();
      for (final item in incidentsJson) {
        final inc = IncidentModel.fromJson(item as Map<String, dynamic>);
        batchIncidents.insert(
          'incidents',
          inc.toMap(),
          conflictAlgorithm: ConflictAlgorithm.replace,
        );
      }
      await batchIncidents.commit(noResult: true);

      // Seed DE39 Catalog
      final de39Raw = await rootBundle.loadString('assets/data/de39_catalog.json');
      final List<dynamic> de39Json = jsonDecode(de39Raw);

      final batchDe39 = db.batch();
      for (final item in de39Json) {
        final def = DE39Model.fromJson(item as Map<String, dynamic>);
        batchDe39.insert(
          'de39',
          def.toMap(),
          conflictAlgorithm: ConflictAlgorithm.replace,
        );
      }
      await batchDe39.commit(noResult: true);
    } catch (e) {
      // Fallback if assets fail during tests or first start
      debugPrint('Erreur lors du seeding initial SQLite: $e');
    }
  }

  // --- Incidents API ---

  Future<List<IncidentModel>> searchIncidents({
    String? query,
    String? domain,
    String? component,
    String? status,
    int limit = 100,
    int offset = 0,
  }) async {
    final db = await database;
    List<String> whereClauses = [];
    List<dynamic> whereArgs = [];

    if (query != null && query.trim().isNotEmpty) {
      final clean = '%${query.trim()}%';
      whereClauses.add('(reference LIKE ? OR title LIKE ? OR analysis_keys LIKE ?)');
      whereArgs.addAll([clean, clean, clean]);
    }

    if (domain != null && domain.isNotEmpty && domain != 'ALL') {
      whereClauses.add('domain = ?');
      whereArgs.add(domain);
    }

    if (component != null && component.isNotEmpty && component != 'ALL') {
      whereClauses.add('component = ?');
      whereArgs.add(component);
    }

    if (status != null && status.isNotEmpty && status != 'ALL') {
      whereClauses.add('knowledge_status = ?');
      whereArgs.add(status);
    }

    final whereString = whereClauses.isNotEmpty ? whereClauses.join(' AND ') : null;

    final maps = await db.query(
      'incidents',
      where: whereString,
      whereArgs: whereArgs.isNotEmpty ? whereArgs : null,
      orderBy: 'reference ASC',
      limit: limit,
      offset: offset,
    );

    return maps.map((m) => IncidentModel.fromMap(m)).toList();
  }

  Future<IncidentModel?> getIncident(String reference) async {
    final db = await database;
    final maps = await db.query(
      'incidents',
      where: 'reference = ?',
      whereArgs: [reference],
      limit: 1,
    );
    if (maps.isNotEmpty) {
      return IncidentModel.fromMap(maps.first);
    }
    return null;
  }

  Future<void> saveCustomIncident(IncidentModel incident) async {
    final db = await database;
    await db.insert(
      'incidents',
      incident.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<Map<String, int>> getStats() async {
    final db = await database;
    final total = Sqflite.firstIntValue(await db.rawQuery('SELECT COUNT(*) FROM incidents')) ?? 0;
    final validated = Sqflite.firstIntValue(
      await db.rawQuery("SELECT COUNT(*) FROM incidents WHERE knowledge_status = 'VALIDATED'"),
    ) ?? 0;
    final de39Count = Sqflite.firstIntValue(await db.rawQuery('SELECT COUNT(*) FROM de39')) ?? 0;

    return {
      'total': total,
      'validated': validated,
      'de39': de39Count,
    };
  }

  Future<List<String>> getDomains() async {
    final db = await database;
    final res = await db.rawQuery('SELECT DISTINCT domain FROM incidents ORDER BY domain ASC');
    return res.map((r) => r['domain'] as String? ?? '').where((d) => d.isNotEmpty).toList();
  }

  // --- DE39 API ---

  Future<List<DE39Model>> searchDE39({String? query, String? category}) async {
    final db = await database;
    List<String> whereClauses = [];
    List<dynamic> whereArgs = [];

    if (query != null && query.trim().isNotEmpty) {
      final clean = '%${query.trim()}%';
      whereClauses.add('(code LIKE ? OR label LIKE ? OR meaning LIKE ?)');
      whereArgs.addAll([clean, clean, clean]);
    }

    if (category != null && category.isNotEmpty && category != 'ALL') {
      whereClauses.add('category = ?');
      whereArgs.add(category);
    }

    final whereString = whereClauses.isNotEmpty ? whereClauses.join(' AND ') : null;

    final maps = await db.query(
      'de39',
      where: whereString,
      whereArgs: whereArgs.isNotEmpty ? whereArgs : null,
      orderBy: 'code ASC',
    );

    return maps.map((m) => DE39Model.fromMap(m)).toList();
  }

  Future<DE39Model?> getDE39(String code) async {
    final db = await database;
    final maps = await db.query(
      'de39',
      where: 'code = ?',
      whereArgs: [code],
      limit: 1,
    );
    if (maps.isNotEmpty) {
      return DE39Model.fromMap(maps.first);
    }
    return null;
  }
}
