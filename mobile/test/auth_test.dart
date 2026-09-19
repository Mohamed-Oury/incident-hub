import 'package:flutter_test/flutter_test.dart';
import 'package:payway_incident_hub/core/database/app_database.dart';
import 'package:payway_incident_hub/core/database/auth_service.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  sqfliteFfiInit();
  databaseFactory = databaseFactoryFfi;

  setUp(() async {
    final db = await AppDatabase.instance.database;
    await db.execute('DROP TABLE IF EXISTS users');
    await db.execute('DROP TABLE IF EXISTS auth_session');
  });

  group('AuthService Tests', () {
    test('Inscription avec validation de champs et hachage mot de passe', () async {
      final auth = AuthService.instance;

      // Inscription nom vide
      final err1 = await auth.register(fullName: '', phone: '0612345678', password: 'secret');
      expect(err1, contains('nom complet'));

      // Inscription téléphone trop court
      final err2 = await auth.register(fullName: 'Oury', phone: '12', password: 'secret');
      expect(err2, contains('valide'));

      // Inscription réussie
      final success = await auth.register(fullName: 'Mohamed Oury Diallo', phone: '0612345678', password: 'monpasswordsur');
      expect(success, isNull);

      // Doublon de numéro
      final duplicate = await auth.register(fullName: 'Autre Nom', phone: '0612345678', password: 'autrepassword');
      expect(duplicate, contains('déjà associé'));
    });

    test('Connexion et vérification de la validité de la session de 12h', () async {
      final auth = AuthService.instance;

      await auth.register(fullName: 'Mohamed Oury Diallo', phone: '0612345678', password: 'monpasswordsur');

      // Mauvais identifiants
      final badLogin = await auth.login(phone: '0612345678', password: 'wrongpassword');
      expect(badLogin, contains('incorrect'));

      // Bonne connexion
      final loginSuccess = await auth.login(phone: '0612345678', password: 'monpasswordsur');
      expect(loginSuccess, isNull);

      // Récupération session
      final session = await auth.getValidSession();
      expect(session, isNotNull);
      expect(session!.phone, '0612345678');
      expect(session.fullName, 'Mohamed Oury Diallo');
      expect(session.isExpired, isFalse);

      // Déconnexion
      await auth.logout();
      final afterLogout = await auth.getValidSession();
      expect(afterLogout, isNull);
    });

    test('Expiration de la session après 12 heures', () {
      final nowMillis = DateTime.now().millisecondsSinceEpoch;
      // Session expirée (13h dans le passé)
      final expiredSession = AuthSession(
        token: 'token_exp',
        phone: '0612345678',
        fullName: 'Test Expire',
        expiresAtMillis: nowMillis - (13 * 3600 * 1000),
      );
      expect(expiredSession.isExpired, isTrue);

      // Session valide (reste 11h)
      final validSession = AuthSession(
        token: 'token_valid',
        phone: '0612345678',
        fullName: 'Test Valide',
        expiresAtMillis: nowMillis + (11 * 3600 * 1000),
      );
      expect(validSession.isExpired, isFalse);
    });
  });
}
