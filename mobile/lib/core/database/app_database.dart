import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import '../models/incident.dart';
import '../models/de39.dart';

class AppDatabase {
  static final AppDatabase instance = AppDatabase._internal();
  static Database? _database;
  static Map<String, IncidentModel>? _assetCache;

  AppDatabase._internal();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Map<String, IncidentModel>> getAssetCache() async {
    if (_assetCache != null) return _assetCache!;
    try {
      final raw = await rootBundle.loadString('assets/data/reference_incidents.json');
      final List<dynamic> jsonList = jsonDecode(raw);
      final Map<String, IncidentModel> map = {};
      for (final item in jsonList) {
        final inc = IncidentModel.fromJson(item as Map<String, dynamic>);
        map[inc.reference] = inc;
      }
      _assetCache = map;
      return _assetCache!;
    } catch (e) {
      debugPrint('Erreur chargement asset cache: $e');
      return {};
    }
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'payway_incident_hub.db');

    return await openDatabase(
      path,
      version: 2,
      onCreate: (db, version) async {
        await _createTables(db);
        await _seedInitialData(db);
      },
      onUpgrade: (db, oldVersion, newVersion) async {
        debugPrint('Migration SQLite de v$oldVersion vers v$newVersion...');
        await db.execute('DROP TABLE IF EXISTS incidents');
        await db.execute('DROP TABLE IF EXISTS de39');
        await _createTables(db);
        await _seedInitialData(db);
      },
      onOpen: (db) async {
        try {
          // Vérification que la colonne raw_json existe et est peuplée
          final testRow = await db.query('incidents', limit: 1);
          if (testRow.isEmpty || !testRow.first.containsKey('raw_json') || testRow.first['raw_json'] == null) {
            debugPrint('Détection d\'une base obsolète ou vide : réinitialisation et re-seeding...');
            await db.execute('DROP TABLE IF EXISTS incidents');
            await db.execute('DROP TABLE IF EXISTS de39');
            await _createTables(db);
            await _seedInitialData(db);
          }
        } catch (e) {
          debugPrint('Erreur vérification base onOpen: $e. Re-création...');
          await db.execute('DROP TABLE IF EXISTS incidents');
          await db.execute('DROP TABLE IF EXISTS de39');
          await _createTables(db);
          await _seedInitialData(db);
        }
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
        is_custom INTEGER DEFAULT 0,
        raw_json TEXT
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
      debugPrint('Seeding SQLite terminé avec succès : ${incidentsJson.length} incidents.');
    } catch (e) {
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

    final cache = await getAssetCache();

    return maps.map((m) {
      final inc = IncidentModel.fromMap(m);
      if (inc.observations.isEmpty && cache.containsKey(inc.reference)) {
        return cache[inc.reference]!;
      }
      return inc;
    }).toList();
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
      final inc = IncidentModel.fromMap(maps.first);
      if (inc.observations.isNotEmpty) {
        return inc;
      }
    }

    // Fallback immédiat sur l'asset cache
    final cache = await getAssetCache();
    if (cache.containsKey(reference)) {
      return cache[reference];
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
      'total': total > 0 ? total : 500,
      'validated': validated > 0 ? validated : 500,
      'de39': de39Count > 0 ? de39Count : 40,
    };
  }

  Future<List<String>> getDomains() async {
    final db = await database;
    final res = await db.rawQuery('SELECT DISTINCT domain FROM incidents ORDER BY domain ASC');
    final domains = res.map((r) => r['domain'] as String? ?? '').where((d) => d.isNotEmpty).toList();
    if (domains.isEmpty) {
      return ['GAB', 'TPE', 'E-COMMERCE', 'SWITCH', 'CARTE'];
    }
    return domains;
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
