import 'package:flutter/material.dart';
import '../core/theme/app_theme.dart';
import 'home/home_screen.dart';
import 'incidents/incident_list_screen.dart';
import 'academy/academy_screen.dart';
import 'sandbox/sandbox_screen.dart';
import 'boss_fight/boss_fight_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  final VoidCallback? onLogout;

  const MainNavigationScreen({super.key, this.onLogout});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  late final List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    _screens = [
      HomeScreen(onLogout: widget.onLogout),
      const IncidentListScreen(),
      const AcademyScreen(),
      const SandboxScreen(),
      const BossFightScreen(),
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
          selectedItemColor: AppTheme.sgRed,
          unselectedItemColor: AppTheme.textSecondary,
          selectedFontSize: 11,
          unselectedFontSize: 11,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_outlined),
              activeIcon: Icon(Icons.dashboard),
              label: 'Accueil',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.warning_amber_rounded),
              activeIcon: Icon(Icons.warning_rounded),
              label: 'Incidents',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.school_outlined),
              activeIcon: Icon(Icons.school),
              label: 'Academy',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.terminal_outlined),
              activeIcon: Icon(Icons.terminal),
              label: 'Sandbox',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.flash_on_outlined),
              activeIcon: Icon(Icons.flash_on),
              label: 'Boss Fight',
            ),
          ],
        ),
      ),
    );
  }
}
