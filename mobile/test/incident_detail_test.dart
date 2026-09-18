import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:payway_incident_hub/core/models/incident.dart';
import 'package:payway_incident_hub/features/incidents/incident_detail_screen.dart';

void main() {
  testWidgets('Vérification du rendu complet des 7 étapes dans IncidentDetailScreen', (WidgetTester tester) async {
    final file = File('assets/data/reference_incidents.json');
    final List<dynamic> jsonList = jsonDecode(file.readAsStringSync());
    final inc = IncidentModel.fromJson(jsonList.first as Map<String, dynamic>);

    expect(inc.reference, equals('INC-001'));
    expect(inc.observations.isNotEmpty, isTrue);
    expect(inc.flowSteps.length, equals(5));
    expect(inc.isoMessages.length, equals(2));
    expect(inc.hypotheses.length, equals(2));
    expect(inc.evidence.length, equals(2));
    expect(inc.rootCause, isNotNull);
    expect(inc.resolution, isNotNull);
    expect(inc.prevention.length, equals(2));

    await tester.pumpWidget(
      MaterialApp(
        home: IncidentDetailScreen(incident: inc),
      ),
    );
    await tester.pump();

    // Vérifier l'en-tête
    expect(find.text('INC-001'), findsOneWidget);
    expect(find.text('Canal: GAB'), findsOneWidget);

    // Étape 1 : Symptômes
    expect(find.text('1. Symptômes & Faits Observés sur le Terrain'), findsOneWidget);
    expect(find.text(inc.observations.first.symptom), findsOneWidget);

    // Étape 2 : Flux Transactionnel
    expect(find.text('2. Flux Transactionnel & Point de Rupture'), findsOneWidget);
    expect(find.text('ISO 0200 Demande d\'autorisation de retrait (DE4=50000 XAF)'), findsOneWidget);

    // Étape 3 : Trames ISO 8583
    expect(find.text('3. Trames ISO 8583 & Éléments de Données'), findsOneWidget);
    expect(find.text('MTI: 0200'), findsOneWidget);

    // Étape 4 : Hypothèses
    expect(find.text('4. Hypothèses d\'Analyse'), findsOneWidget);

    // Étape 5 : Preuves Techniques
    expect(find.text('5. Preuves Techniques Concordantes'), findsOneWidget);

    // Étape 6 : Cause Racine
    expect(find.text('6. Cause Racine (RCA) & Solution Validée'), findsOneWidget);
    expect(find.text(inc.rootCause!.description), findsOneWidget);

    // Étape 7 : Actions Préventives
    expect(find.text('7. Plan d\'Actions Préventives'), findsOneWidget);
  });
}
