import 'package:flutter/material.dart';
import 'core/database/app_database.dart';
import 'core/theme/app_theme.dart';
import 'features/home/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Database in background (seeds data if first start)
  AppDatabase.instance.database;

  runApp(const PaywayIncidentHubApp());
}

class PaywayIncidentHubApp extends StatelessWidget {
  const PaywayIncidentHubApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Payway Incident Hub',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const HomeScreen(),
    );
  }
}
