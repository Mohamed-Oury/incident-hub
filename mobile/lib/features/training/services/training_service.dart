import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:sqflite/sqflite.dart';
import '../../../core/database/app_database.dart';
import '../models/training_models.dart';

class TrainingDataPackage {
  final List<TrainingGrade> grades;
  final List<TrainingLesson> lessons;
  final List<TrainingExamQuestion> exams;

  const TrainingDataPackage({
    required this.grades,
    required this.lessons,
    required this.exams,
  });
}

class TrainingService {
  static final TrainingService instance = TrainingService._init();
  TrainingService._init();

  TrainingDataPackage? _monetiqueCache;
  TrainingDataPackage? _cbsCache;

  Future<void> _ensureProgressTable(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS training_progress (
        id TEXT PRIMARY KEY,
        monetique_level INTEGER DEFAULT 1,
        cbs_level INTEGER DEFAULT 1,
        updated_at TEXT
      )
    ''');
  }

  Future<TrainingDataPackage> getMonetiqueData() async {
    if (_monetiqueCache != null) return _monetiqueCache!;
    try {
      final raw = await rootBundle.loadString('assets/data/training_monetique.json');
      final Map<String, dynamic> jsonMap = jsonDecode(raw);

      final grades = (jsonMap['grades'] as List<dynamic>? ?? [])
          .map((g) => TrainingGrade.fromJson(g as Map<String, dynamic>))
          .toList();

      final lessons = (jsonMap['lessons'] as List<dynamic>? ?? [])
          .map((l) => TrainingLesson.fromJson(l as Map<String, dynamic>))
          .toList();

      final exams = (jsonMap['exams'] as List<dynamic>? ?? [])
          .map((e) => TrainingExamQuestion.fromJson(e as Map<String, dynamic>))
          .toList();

      _monetiqueCache = TrainingDataPackage(grades: grades, lessons: lessons, exams: exams);
      return _monetiqueCache!;
    } catch (e) {
      return const TrainingDataPackage(grades: [], lessons: [], exams: []);
    }
  }

  Future<TrainingDataPackage> getCbsData() async {
    if (_cbsCache != null) return _cbsCache!;
    try {
      final raw = await rootBundle.loadString('assets/data/training_cbs_4gl.json');
      final Map<String, dynamic> jsonMap = jsonDecode(raw);

      final grades = (jsonMap['grades'] as List<dynamic>? ?? [])
          .map((g) => TrainingGrade.fromJson(g as Map<String, dynamic>))
          .toList();

      final lessons = (jsonMap['lessons'] as List<dynamic>? ?? [])
          .map((l) => TrainingLesson.fromJson(l as Map<String, dynamic>))
          .toList();

      final exams = (jsonMap['exams'] as List<dynamic>? ?? [])
          .map((e) => TrainingExamQuestion.fromJson(e as Map<String, dynamic>))
          .toList();

      _cbsCache = TrainingDataPackage(grades: grades, lessons: lessons, exams: exams);
      return _cbsCache!;
    } catch (e) {
      return const TrainingDataPackage(grades: [], lessons: [], exams: []);
    }
  }

  Future<int> getUnlockedLevel(String type) async {
    try {
      final db = await AppDatabase.instance.database;
      await _ensureProgressTable(db);
      final rows = await db.query('training_progress', where: 'id = ?', whereArgs: ['current_user']);
      if (rows.isNotEmpty) {
        final col = type == 'MONETIQUE' ? 'monetique_level' : 'cbs_level';
        return (rows.first[col] as num?)?.toInt() ?? 1;
      }
      return 1;
    } catch (e) {
      return 1;
    }
  }

  Future<void> saveUnlockedLevel(String type, int newLevel) async {
    try {
      final db = await AppDatabase.instance.database;
      await _ensureProgressTable(db);

      final existing = await db.query('training_progress', where: 'id = ?', whereArgs: ['current_user']);
      final now = DateTime.now().toIso8601String();

      if (existing.isEmpty) {
        await db.insert('training_progress', {
          'id': 'current_user',
          'monetique_level': type == 'MONETIQUE' ? newLevel : 1,
          'cbs_level': type == 'CBS' ? newLevel : 1,
          'updated_at': now,
        });
      } else {
        final col = type == 'MONETIQUE' ? 'monetique_level' : 'cbs_level';
        final currentLvl = (existing.first[col] as num?)?.toInt() ?? 1;
        if (newLevel > currentLvl) {
          await db.update(
            'training_progress',
            {
              col: newLevel,
              'updated_at': now,
            },
            where: 'id = ?',
            whereArgs: ['current_user'],
          );
        }
      }
    } catch (e) {
      // Ignore SQLite errors silently
    }
  }
}
