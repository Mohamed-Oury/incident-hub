import 'package:flutter_test/flutter_test.dart';
import 'package:payway_incident_hub/main.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

void main() {
  setUpAll(() {
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
  });

  testWidgets('Payway Incident Hub App Smoke Test', (WidgetTester tester) async {
    await tester.pumpWidget(const PaywayIncidentHubApp());
    expect(find.text('Payway Incident Hub'), findsOneWidget);
  });
}
