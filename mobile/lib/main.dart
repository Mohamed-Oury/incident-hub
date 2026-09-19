import 'package:flutter/material.dart';
import 'core/database/app_database.dart';
import 'core/database/auth_service.dart';
import 'core/theme/app_theme.dart';
import 'features/main_navigation_screen.dart';
import 'features/auth/login_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Database in background (seeds data if first start)
  AppDatabase.instance.database;

  runApp(const MOurIncidentHubApp());
}

class MOurIncidentHubApp extends StatefulWidget {
  const MOurIncidentHubApp({super.key});

  @override
  State<MOurIncidentHubApp> createState() => _MOurIncidentHubAppState();
}

class _MOurIncidentHubAppState extends State<MOurIncidentHubApp> {
  bool _isLoading = true;
  bool _isAuthenticated = false;

  @override
  void initState() {
    super.initState();
    _checkAuthSession();
  }

  Future<void> _checkAuthSession() async {
    final session = await AuthService.instance.getValidSession();
    if (mounted) {
      setState(() {
        _isAuthenticated = session != null && !session.isExpired;
        _isLoading = false;
      });
    }
  }

  void _onLoginSuccess() {
    setState(() {
      _isAuthenticated = true;
    });
  }

  void _onLogout() async {
    await AuthService.instance.logout();
    if (mounted) {
      setState(() {
        _isAuthenticated = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'M.OURY Incident Hub',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: _isLoading
          ? const Scaffold(
              body: Center(child: CircularProgressIndicator(color: AppTheme.sgRed)),
            )
          : _isAuthenticated
              ? MainNavigationScreen(onLogout: _onLogout)
              : LoginScreen(onLoginSuccess: _onLoginSuccess),
    );
  }
}
