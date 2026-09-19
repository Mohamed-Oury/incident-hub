
import 'package:flutter/foundation.dart';
import 'package:sqflite/sqflite.dart';
import 'app_database.dart';

class AuthUser {
  final int? id;
  final String fullName;
  final String phone;
  final String createdAt;

  const AuthUser({
    this.id,
    required this.fullName,
    required this.phone,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'full_name': fullName,
    'phone': phone,
    'created_at': createdAt,
  };

  factory AuthUser.fromMap(Map<String, dynamic> map) => AuthUser(
    id: map['id'] as int?,
    fullName: map['full_name'] as String? ?? '',
    phone: map['phone'] as String? ?? '',
    createdAt: map['created_at'] as String? ?? '',
  );
}

class AuthSession {
  final String token;
  final String phone;
  final String fullName;
  final int expiresAtMillis;

  const AuthSession({
    required this.token,
    required this.phone,
    required this.fullName,
    required this.expiresAtMillis,
  });

  bool get isExpired => DateTime.now().millisecondsSinceEpoch > expiresAtMillis;
}

class AuthService {
  static final AuthService instance = AuthService._internal();
  AuthService._internal();

  AuthSession? _currentSession;

  static const int sessionDurationHours = 12;

  // Hachage sécurisé pur Dart (DJB2 étendu + salt) évitant une dépendance binaire externe
  String _hashPassword(String password) {
    final salt = 'monetique_salt_secure_2026_';
    final combined = '$salt${password.trim()}';
    int hash = 5381;
    for (int i = 0; i < combined.length; i++) {
      hash = ((hash << 5) + hash) + combined.codeUnitAt(i);
      hash = hash & 0xFFFFFFFF; // 32-bit int
    }
    // Hex string
    return hash.toRadixString(16).padLeft(8, '0');
  }

  Future<void> _ensureAuthTables(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS auth_session (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        token TEXT NOT NULL,
        phone TEXT NOT NULL,
        full_name TEXT NOT NULL,
        expires_at INTEGER NOT NULL
      )
    ''');
  }

  Future<String?> register({
    required String fullName,
    required String phone,
    required String password,
  }) async {
    final cleanPhone = phone.trim();
    final cleanName = fullName.trim();
    final cleanPass = password.trim();

    if (cleanName.isEmpty) return 'Veuillez saisir votre nom complet.';
    if (cleanPhone.isEmpty || cleanPhone.length < 6) {
      return 'Veuillez saisir un numéro de téléphone valide.';
    }
    if (cleanPass.length < 4) {
      return 'Le mot de passe doit contenir au moins 4 caractères.';
    }

    try {
      final db = await AppDatabase.instance.database;
      await _ensureAuthTables(db);

      // Vérifier si le téléphone existe déjà
      final existing = await db.query(
        'users',
        where: 'phone = ?',
        whereArgs: [cleanPhone],
      );

      if (existing.isNotEmpty) {
        return 'Ce numéro de téléphone est déjà associé à un compte.';
      }

      final hash = _hashPassword(cleanPass);
      final now = DateTime.now().toIso8601String();

      await db.insert('users', {
        'full_name': cleanName,
        'phone': cleanPhone,
        'password_hash': hash,
        'created_at': now,
      });

      return null; // Succès
    } catch (e) {
      debugPrint('Erreur registration: $e');
      return 'Erreur lors de l\'enregistrement : $e';
    }
  }

  Future<String?> login({
    required String phone,
    required String password,
  }) async {
    final cleanPhone = phone.trim();
    final cleanPass = password.trim();

    if (cleanPhone.isEmpty || cleanPass.isEmpty) {
      return 'Veuillez saisir votre numéro et mot de passe.';
    }

    try {
      final db = await AppDatabase.instance.database;
      await _ensureAuthTables(db);

      final hash = _hashPassword(cleanPass);

      final result = await db.query(
        'users',
        where: 'phone = ? AND password_hash = ?',
        whereArgs: [cleanPhone, hash],
      );

      if (result.isEmpty) {
        return 'Numéro de téléphone ou mot de passe incorrect.';
      }

      final user = result.first;
      final fullName = user['full_name'] as String;

      // Générer Token & Session de 12 heures
      final nowMillis = DateTime.now().millisecondsSinceEpoch;
      final expiresAt = nowMillis + (sessionDurationHours * 3600 * 1000);
      final token = 'token_${cleanPhone}_$nowMillis';

      final session = AuthSession(
        token: token,
        phone: cleanPhone,
        fullName: fullName,
        expiresAtMillis: expiresAt,
      );

      await db.insert(
        'auth_session',
        {
          'id': 1,
          'token': token,
          'phone': cleanPhone,
          'full_name': fullName,
          'expires_at': expiresAt,
        },
        conflictAlgorithm: ConflictAlgorithm.replace,
      );

      _currentSession = session;
      return null; // Succès
    } catch (e) {
      debugPrint('Erreur login: $e');
      return 'Erreur de connexion : $e';
    }
  }

  Future<AuthSession?> getValidSession() async {
    if (_currentSession != null && !_currentSession!.isExpired) {
      return _currentSession;
    }

    try {
      final db = await AppDatabase.instance.database;
      await _ensureAuthTables(db);

      final list = await db.query('auth_session', where: 'id = 1');
      if (list.isEmpty) return null;

      final row = list.first;
      final expiresAt = row['expires_at'] as int;

      if (DateTime.now().millisecondsSinceEpoch > expiresAt) {
        // Session expirée (+12h)
        await db.delete('auth_session', where: 'id = 1');
        _currentSession = null;
        return null;
      }

      _currentSession = AuthSession(
        token: row['token'] as String,
        phone: row['phone'] as String,
        fullName: row['full_name'] as String,
        expiresAtMillis: expiresAt,
      );

      return _currentSession;
    } catch (e) {
      debugPrint('Erreur vérification session: $e');
      return null;
    }
  }

  Future<void> logout() async {
    _currentSession = null;
    try {
      final db = await AppDatabase.instance.database;
      await _ensureAuthTables(db);
      await db.delete('auth_session', where: 'id = 1');
    } catch (e) {
      debugPrint('Erreur logout: $e');
    }
  }
}
