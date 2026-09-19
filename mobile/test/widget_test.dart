import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:payway_incident_hub/features/auth/login_screen.dart';
import 'package:payway_incident_hub/features/auth/register_screen.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

void main() {
  setUpAll(() {
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
  });

  testWidgets('Rendu sans erreur de l\'écran de connexion LoginScreen', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: LoginScreen(onLoginSuccess: () {}),
      ),
    );

    expect(find.text('M.OURY'), findsOneWidget);
    expect(find.text('Connexion Sécurisée'), findsOneWidget);
    expect(find.text('SE CONNECTER'), findsOneWidget);
    expect(find.text('S\'inscrire ici'), findsOneWidget);
  });

  testWidgets('Rendu sans erreur de l\'écran d\'inscription RegisterScreen', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: RegisterScreen(),
      ),
    );

    expect(find.text('Créer un Compte'), findsOneWidget);
    expect(find.text('CRÉER MON COMPTE'), findsOneWidget);
  });
}
