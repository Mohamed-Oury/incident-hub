import 'package:flutter/material.dart';
import 'core/database/app_database.dart';
import 'core/database/auth_service.dart';
import 'core/theme/app_theme.dart';
import 'features/universe_selection_screen.dart';
import 'features/main_navigation_screen.dart';
import 'features/cbs/cbs_navigation_screen.dart';
import 'features/auth/login_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Database in background (seeds data if first start)
  AppDatabase.instance.database;

  runApp(const MOurIncidentHubApp());
}

enum AppUniverse {
  none,
  monetique,
  cbs,
}

class MOurIncidentHubApp extends StatefulWidget {
  const MOurIncidentHubApp({super.key});

  @override
  State<MOurIncidentHubApp> createState() => _MOurIncidentHubAppState();
}

class _MOurIncidentHubAppState extends State<MOurIncidentHubApp> {
  bool _isLoading = true;
  bool _isAuthenticated = false;
  AppUniverse _selectedUniverse = AppUniverse.none;

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
      _selectedUniverse = AppUniverse.none; // Afficher le choix d'univers après login
    });
  }

  void _onLogout() async {
    await AuthService.instance.logout();
    if (mounted) {
      setState(() {
        _isAuthenticated = false;
        _selectedUniverse = AppUniverse.none;
      });
    }
  }

  void _switchToUniverse(AppUniverse universe) {
    setState(() {
      _selectedUniverse = universe;
    });
  }

  void _backToUniverseSelection() {
    setState(() {
      _selectedUniverse = AppUniverse.none;
    });
  }

  @override
  Widget build(BuildContext context) {
    Widget currentScreen;

    if (_isLoading) {
      currentScreen = const Scaffold(
        body: Center(child: CircularProgressIndicator(color: AppTheme.sgRed)),
      );
    } else if (!_isAuthenticated) {
      currentScreen = LoginScreen(onLoginSuccess: _onLoginSuccess);
    } else {
      switch (_selectedUniverse) {
        case AppUniverse.monetique:
          currentScreen = MainNavigationScreen(
            onSwitchUniverse: _backToUniverseSelection,
            onLogout: _onLogout,
          );
          break;
        case AppUniverse.cbs:
          currentScreen = CbsNavigationScreen(
            onSwitchUniverse: _backToUniverseSelection,
            onLogout: _onLogout,
          );
          break;
        case AppUniverse.none:
          currentScreen = UniverseSelectionScreen(
            onSelectMonetique: () => _switchToUniverse(AppUniverse.monetique),
            onSelectCbs: () => _switchToUniverse(AppUniverse.cbs),
            onLogout: _onLogout,
          );
          break;
      }
    }

    return MaterialApp(
      title: 'M.OURY Incident Hub',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: currentScreen,
    );
  }
}
