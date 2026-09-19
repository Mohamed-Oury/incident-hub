import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import 'screens/cbs_home_screen.dart';
import 'screens/cbs_domains_screen.dart';
import 'screens/cbs_batch_eod_screen.dart';
import 'screens/cbs_database_screen.dart';
import 'screens/cbs_incidents_screen.dart';

class CbsNavigationScreen extends StatefulWidget {
  final VoidCallback? onSwitchUniverse;
  final VoidCallback? onLogout;

  const CbsNavigationScreen({
    super.key,
    this.onSwitchUniverse,
    this.onLogout,
  });

  @override
  State<CbsNavigationScreen> createState() => _CbsNavigationScreenState();
}

class _CbsNavigationScreenState extends State<CbsNavigationScreen> {
  int _currentIndex = 0;

  late final List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    _screens = [
      CbsHomeScreen(
        onSwitchUniverse: widget.onSwitchUniverse,
        onLogout: widget.onLogout,
      ),
      const CbsDomainsScreen(),
      const CbsBatchEodScreen(),
      const CbsDatabaseScreen(),
      const CbsIncidentsScreen(),
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
          selectedItemColor: Colors.blueAccent,
          unselectedItemColor: AppTheme.textSecondary,
          selectedFontSize: 11,
          unselectedFontSize: 11,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_outlined),
              activeIcon: Icon(Icons.dashboard),
              label: 'Accueil CBS',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.account_balance_outlined),
              activeIcon: Icon(Icons.account_balance),
              label: 'Domaines',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.timelapse_outlined),
              activeIcon: Icon(Icons.timelapse),
              label: 'EOD Batch',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.storage_outlined),
              activeIcon: Icon(Icons.storage),
              label: 'Oracle/DB',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.crisis_alert_outlined),
              activeIcon: Icon(Icons.crisis_alert),
              label: 'Incidents',
            ),
          ],
        ),
      ),
    );
  }
}
