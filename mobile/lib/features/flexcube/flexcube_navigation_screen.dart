import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import 'screens/flexcube_home_screen.dart';
import 'screens/flexcube_aeod_screen.dart';
import 'screens/flexcube_copilot_screen.dart';
import 'screens/flexcube_tables_screen.dart';
import 'screens/flexcube_training_screen.dart';

class FlexcubeNavigationScreen extends StatefulWidget {
  final VoidCallback? onSwitchUniverse;
  final VoidCallback? onLogout;

  const FlexcubeNavigationScreen({
    super.key,
    this.onSwitchUniverse,
    this.onLogout,
  });

  @override
  State<FlexcubeNavigationScreen> createState() => _FlexcubeNavigationScreenState();
}

class _FlexcubeNavigationScreenState extends State<FlexcubeNavigationScreen> {
  int _currentIndex = 0;

  late final List<Widget> _screens;

  static const Color flexcubeOrange = Color(0xFFEA580C);

  @override
  void initState() {
    super.initState();
    _screens = [
      FlexcubeHomeScreen(
        onSwitchUniverse: widget.onSwitchUniverse,
        onLogout: widget.onLogout,
      ),
      const FlexcubeAeodScreen(),
      const FlexcubeCopilotScreen(),
      const FlexcubeTablesScreen(),
      const FlexcubeTrainingScreen(),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(
            top: BorderSide(color: AppTheme.borderDark, width: 1),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          type: BottomNavigationBarType.fixed,
          backgroundColor: AppTheme.darkSurface,
          selectedItemColor: flexcubeOrange,
          unselectedItemColor: AppTheme.textSecondary,
          selectedFontSize: 11,
          unselectedFontSize: 11,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_outlined),
              activeIcon: Icon(Icons.dashboard),
              label: 'Accueil FCUBS',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.alt_route_outlined),
              activeIcon: Icon(Icons.alt_route),
              label: 'AEOD / RUN',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.code_outlined),
              activeIcon: Icon(Icons.code),
              label: 'Copilot PL/SQL',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.storage_outlined),
              activeIcon: Icon(Icons.storage),
              label: 'Tables (16)',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.school_outlined),
              activeIcon: Icon(Icons.school),
              label: 'Cursus (5)',
            ),
          ],
        ),
      ),
    );
  }
}
