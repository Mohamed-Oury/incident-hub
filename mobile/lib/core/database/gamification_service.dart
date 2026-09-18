import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:sqflite/sqflite.dart';
import 'app_database.dart';

class UserProfile {
  final int xp;
  final int streak;
  final String lastActive;
  final int energy;
  final List<String> badges;

  UserProfile({
    required this.xp,
    required this.streak,
    required this.lastActive,
    required this.energy,
    required this.badges,
  });

  String get rank {
    if (xp >= 3000) return 'Chief Payment Architect';
    if (xp >= 1500) return 'Senior Transaction Engineer';
    if (xp >= 500) return 'Payment Specialist';
    return 'Junior Switch Operator';
  }

  String get rankTitle => rank;

  int get level => (xp / 100).floor() + 1;

  int get streakDays => streak;

  double get rankProgress {
    if (xp >= 3000) return 1.0;
    if (xp >= 1500) return (xp - 1500) / 1500;
    if (xp >= 500) return (xp - 500) / 1000;
    return (xp / 500).clamp(0.0, 1.0);
  }

  int get nextLevelXp {
    if (xp >= 3000) return 3000;
    if (xp >= 1500) return 3000;
    if (xp >= 500) return 1500;
    return 500;
  }

  factory UserProfile.defaultProfile() {
    return UserProfile(
      xp: 120,
      streak: 3,
      lastActive: DateTime.now().toIso8601String(),
      energy: 5,
      badges: ['Initié Monétique'],
    );
  }

  Map<String, dynamic> toMap() => {
    'id': 'current_user',
    'xp': xp,
    'streak': streak,
    'last_active': lastActive,
    'energy': energy,
    'badges': jsonEncode(badges),
  };

  factory UserProfile.fromMap(Map<String, dynamic> map) {
    List<String> bList = [];
    if (map['badges'] != null) {
      try {
        final decoded = jsonDecode(map['badges'] as String);
        if (decoded is List) {
          bList = decoded.map((e) => e.toString()).toList();
        }
      } catch (_) {}
    }
    return UserProfile(
      xp: (map['xp'] as num?)?.toInt() ?? 0,
      streak: (map['streak'] as num?)?.toInt() ?? 1,
      lastActive: map['last_active'] as String? ?? DateTime.now().toIso8601String(),
      energy: (map['energy'] as num?)?.toInt() ?? 100,
      badges: bList,
    );
  }
}

class GamificationService {
  static final GamificationService instance = GamificationService._init();
  GamificationService._init();

  UserProfile? _cachedProfile;

  Future<void> _ensureTable(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS user_profile (
        id TEXT PRIMARY KEY,
        xp INTEGER,
        streak INTEGER,
        last_active TEXT,
        energy INTEGER,
        badges TEXT
      )
    ''');
  }

  Future<UserProfile> getProfile() async {
    if (_cachedProfile != null) return _cachedProfile!;

    try {
      final db = await AppDatabase.instance.database;
      await _ensureTable(db);
      final maps = await db.query('user_profile', where: 'id = ?', whereArgs: ['current_user']);

      if (maps.isNotEmpty) {
        _cachedProfile = UserProfile.fromMap(maps.first);
        return _cachedProfile!;
      } else {
        final def = UserProfile.defaultProfile();
        await db.insert('user_profile', def.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
        _cachedProfile = def;
        return def;
      }
    } catch (e) {
      debugPrint('GamificationService.getProfile error: $e');
      final fallback = UserProfile.defaultProfile();
      _cachedProfile = fallback;
      return fallback;
    }
  }

  Future<UserProfile> addXp(int points, {String? newBadge}) async {
    final current = await getProfile();
    final newBadges = List<String>.from(current.badges);
    if (newBadge != null && !newBadges.contains(newBadge)) {
      newBadges.add(newBadge);
    }

    final updated = UserProfile(
      xp: current.xp + points,
      streak: current.streak,
      lastActive: DateTime.now().toIso8601String(),
      energy: current.energy,
      badges: newBadges,
    );

    _cachedProfile = updated;

    try {
      final db = await AppDatabase.instance.database;
      await _ensureTable(db);
      await db.insert('user_profile', updated.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
    } catch (e) {
      debugPrint('Erreur sauvegarde profil: $e');
    }

    return updated;
  }
}
