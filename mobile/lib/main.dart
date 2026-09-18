import 'package:flutter/material.dart';
import 'core/database/app_database.dart';
import 'core/theme/app_theme.dart';
import 'features/main_navigation_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Database in background (seeds data if first start)
  AppDatabase.instance.database;

  runApp(const MOurIncidentHubApp());
}

class MOurIncidentHubApp extends StatelessWidget {
  const MOurIncidentHubApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'M.OURY Incident Hub',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const MainNavigationScreen(),
    );
  }
}
