import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import 'flexcube_aeod_screen.dart';
import 'flexcube_copilot_screen.dart';
import 'flexcube_tables_screen.dart';
import 'flexcube_training_screen.dart';
import 'flexcube_cheat_sheet_screen.dart';

class FlexcubeHomeScreen extends StatelessWidget {
  final VoidCallback? onSwitchUniverse;
  final VoidCallback? onLogout;

  const FlexcubeHomeScreen({
    super.key,
    this.onSwitchUniverse,
    this.onLogout,
  });

  static const Color flexcubeOrange = Color(0xFFEA580C);
  static const Color flexcubeOrangeDark = Color(0xFFC2410C);
  static const Color flexcubeOrangeLight = Color(0xFFFB923C);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: flexcubeOrange, width: 2),
                boxShadow: [
                  BoxShadow(
                    color: flexcubeOrange.withValues(alpha: 0.4),
                    blurRadius: 8,
                    spreadRadius: 1,
                  ),
                ],
              ),
              child: ClipOval(
                child: Image.asset(
                  'assets/icon/app_icon_1024.png',
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'ORACLE FLEXCUBE',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.8,
                    color: Colors.white,
                  ),
                ),
                Text(
                  'Core Banking Universal • Hub PL/SQL',
                  style: TextStyle(
                    fontSize: 10,
                    color: flexcubeOrangeLight,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.symmetric(vertical: 10),
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: flexcubeOrange.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: flexcubeOrange.withValues(alpha: 0.6)),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.security, color: flexcubeOrangeLight, size: 13),
                SizedBox(width: 4),
                Text(
                  'PCI-DSS Actif',
                  style: TextStyle(color: flexcubeOrangeLight, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          if (onSwitchUniverse != null)
            IconButton(
              icon: const Icon(Icons.sync_alt, color: Colors.white70, size: 20),
              tooltip: 'Changer d\'Univers',
              onPressed: onSwitchUniverse,
            ),
          if (onLogout != null)
            IconButton(
              icon: const Icon(Icons.logout, color: Colors.white70, size: 20),
              tooltip: 'Déconnexion',
              onPressed: onLogout,
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Bandeau Univers Actif & Switcher 3 Univers
            _buildUniverseHeader(context),
            const SizedBox(height: 16),

            // Métriques Clés FCUBS
            _buildMetricsGrid(context),
            const SizedBox(height: 20),

            // Raccourcis Outils d'Ingénierie FCUBS
            const Text(
              'MODULES D\'EXPLOITATION ORACLE FLEXCUBE',
              style: TextStyle(
                color: flexcubeOrange,
                fontSize: 11,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 12),
            _buildFeatureCards(context),
            const SizedBox(height: 20),

            // Chaîne Batch AEOD Statut d'Arrêté
            _buildAeodStatusCard(context),
            const SizedBox(height: 20),

            // Règle d'or Informatique Bancaire
            _buildBestPracticesCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildUniverseHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF2E1005), Color(0xFF140802)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: flexcubeOrange.withValues(alpha: 0.5), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: flexcubeOrange.withValues(alpha: 0.15),
            blurRadius: 14,
            spreadRadius: 1,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: flexcubeOrange.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: flexcubeOrange),
                ),
                child: const Text(
                  'UNIVERS ACTIF : ORACLE FLEXCUBE',
                  style: TextStyle(color: flexcubeOrangeLight, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
              const Icon(Icons.account_balance, color: flexcubeOrangeLight, size: 22),
            ],
          ),
          const SizedBox(height: 10),
          const Text(
            'Ingénierie & Exploitation Core Banking Universal',
            style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 6),
          const Text(
            'Packages PL/SQL, tables centrales ST/AC/GL/FT, chaîne de clôture AEOD multi-phases, incidents de production RUN et cursus certifiant 5 niveaux.',
            style: TextStyle(color: AppTheme.textSecondary, fontSize: 12, height: 1.4),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricsGrid(BuildContext context) {
    return Row(
      children: [
        _buildMetricBox('16', 'Tables\nCentrales', Icons.table_chart_outlined, Colors.cyanAccent),
        const SizedBox(width: 8),
        _buildMetricBox('10', 'Étapes\nAEOD', Icons.sync, flexcubeOrangeLight),
        const SizedBox(width: 8),
        _buildMetricBox('20', 'Incidents\nRUN & RCA', Icons.bug_report_outlined, AppTheme.errorRed),
        const SizedBox(width: 8),
        _buildMetricBox('75', 'Questions\nCertification', Icons.school_outlined, AppTheme.successGreen),
      ],
    );
  }

  Widget _buildMetricBox(String value, String label, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: AppTheme.darkCard,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppTheme.borderDark),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(height: 6),
            Text(
              value,
              style: TextStyle(color: color, fontSize: 18, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppTheme.textSecondary, fontSize: 10, height: 1.1),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureCards(BuildContext context) {
    return Column(
      children: [
        _buildFeatureRow(
          context,
          title: 'Chaîne Batch AEOD & Scénarios',
          subtitle: '5 phases de clôture (PEOD, EOTI, EOFI, EOD, BOD) & 5 scénarios d\'urgence',
          icon: Icons.alt_route,
          accentColor: flexcubeOrange,
          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const FlexcubeAeodScreen())),
        ),
        const SizedBox(height: 10),
        _buildFeatureRow(
          context,
          title: 'Studio Copilot PL/SQL & Diagnostic SGBD',
          subtitle: 'Linter règle d\'or (NOWAIT, aucun COMMIT), RCA incidents Oracle ORA-00054',
          icon: Icons.code,
          accentColor: Colors.amberAccent,
          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const FlexcubeCopilotScreen())),
        ),
        const SizedBox(height: 10),
        _buildFeatureRow(
          context,
          title: 'Dictionnaire des Schémas de Données',
          subtitle: '16 tables maîtresses (STTM_CUSTOMER, ACTB_DAILY_LOG, GLTB_GL_BALANCES, etc.)',
          icon: Icons.storage_rounded,
          accentColor: Colors.cyanAccent,
          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const FlexcubeTablesScreen())),
        ),
        const SizedBox(height: 10),
        _buildFeatureRow(
          context,
          title: 'Cursus Certifiant & 75 Questions QCM',
          subtitle: '5 grades de qualification, 15 leçons techniques approfondies et examens',
          icon: Icons.military_tech_outlined,
          accentColor: AppTheme.successGreen,
          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const FlexcubeTrainingScreen())),
        ),
        const SizedBox(height: 10),
        _buildFeatureRow(
          context,
          title: 'Antisèche Officielle Oracle FLEXCUBE',
          subtitle: '20 fiches mémo couvrant Architecture, Schema, PL/SQL, AEOD, Incidents & Gateway',
          icon: Icons.menu_book,
          accentColor: Colors.purpleAccent,
          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const FlexcubeCheatSheetScreen())),
        ),
      ],
    );
  }

  Widget _buildFeatureRow(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color accentColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppTheme.darkCard,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppTheme.borderDark),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: accentColor.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: accentColor, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios, color: AppTheme.textMuted, size: 14),
          ],
        ),
      ),
    );
  }

  Widget _buildAeodStatusCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: flexcubeOrange.withValues(alpha: 0.4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'CINÉMATIQUE BATCH AEOD (5 PHASES)',
                style: TextStyle(
                  color: flexcubeOrangeLight,
                  fontWeight: FontWeight.bold,
                  fontSize: 11,
                  letterSpacing: 0.8,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AppTheme.successGreen.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text('Conforme', style: TextStyle(color: AppTheme.successGreen, fontSize: 10, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _buildPhaseStep('1', 'PEOD', 'Pré-EOD', true),
              _buildPhaseArrow(),
              _buildPhaseStep('2', 'EOTI', 'Fin Saisie', true),
              _buildPhaseArrow(),
              _buildPhaseStep('3', 'EOFI', 'Fin Intégr.', true),
              _buildPhaseArrow(),
              _buildPhaseStep('4', 'EOD', 'Clôture J', true),
              _buildPhaseArrow(),
              _buildPhaseStep('5', 'BOD', 'Nouveau J', true),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPhaseStep(String number, String code, String label, bool active) {
    return Expanded(
      child: Column(
        children: [
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(
              color: active ? flexcubeOrange : AppTheme.darkSurface,
              shape: BoxShape.circle,
              border: Border.all(color: active ? flexcubeOrangeLight : AppTheme.borderDark),
            ),
            child: Center(
              child: Text(
                number,
                style: TextStyle(
                  color: active ? Colors.white : AppTheme.textMuted,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const SizedBox(height: 4),
          Text(code, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
          Text(label, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 8), overflow: TextOverflow.ellipsis),
        ],
      ),
    );
  }

  Widget _buildPhaseArrow() {
    return const Icon(Icons.chevron_right, color: AppTheme.borderDark, size: 14);
  }

  Widget _buildBestPracticesCard() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.black38,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white12),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.shield_outlined, color: flexcubeOrangeLight, size: 20),
          SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Règle d\'or de l\'ingénierie Oracle FLEXCUBE',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                ),
                SizedBox(height: 4),
                Text(
                  '1. Aucun COMMIT dans les packages custom (orchestré par le Kernel Framework).\n'
                  '2. Toujours utiliser FOR UPDATE NOWAIT pour éviter ORA-00054.\n'
                  '3. Contrôler AETB_PROCESS_PROGRESS avant toute relance batch en erreur.',
                  style: TextStyle(color: AppTheme.textSecondary, fontSize: 11, height: 1.4),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
