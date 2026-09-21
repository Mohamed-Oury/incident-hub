import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../data/cbs_data.dart';
import 'cbs_domains_screen.dart';
import 'cbs_database_screen.dart';
import 'cbs_batch_eod_screen.dart';
import 'cbs_unix_screen.dart';
import 'cbs_incidents_screen.dart';
import 'cbs_quiz_screen.dart';
import '../../training/screens/training_cbs_screen.dart';

class CbsHomeScreen extends StatefulWidget {
  final VoidCallback? onSwitchUniverse;
  final VoidCallback? onLogout;

  const CbsHomeScreen({
    super.key,
    this.onSwitchUniverse,
    this.onLogout,
  });

  @override
  State<CbsHomeScreen> createState() => _CbsHomeScreenState();
}

class _CbsHomeScreenState extends State<CbsHomeScreen> {
  int _xp = 350; // Mock progression CBS
  
  Map<String, dynamic> _getCurrentRank() {
    for (var i = CbsData.cbsRanks.length - 1; i >= 0; i--) {
      if (_xp >= (CbsData.cbsRanks[i]['minXp'] as int)) {
        return CbsData.cbsRanks[i];
      }
    }
    return CbsData.cbsRanks.first;
  }

  @override
  Widget build(BuildContext context) {
    final rank = _getCurrentRank();
    final nextRankIndex = CbsData.cbsRanks.indexOf(rank) + 1;
    final nextRank = nextRankIndex < CbsData.cbsRanks.length ? CbsData.cbsRanks[nextRankIndex] : null;
    final currentMin = rank['minXp'] as int;
    final nextMin = nextRank != null ? (nextRank['minXp'] as int) : currentMin + 500;
    final progress = ((_xp - currentMin) / (nextMin - currentMin)).clamp(0.0, 1.0);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: Colors.blueAccent, width: 2),
                boxShadow: [
                  BoxShadow(
                    color: Colors.blueAccent.withValues(alpha: 0.4),
                    blurRadius: 8,
                    spreadRadius: 1,
                  ),
                ],
              ),
              child: const ClipOval(
                child: Icon(Icons.account_balance, color: Colors.blueAccent, size: 20),
              ),
            ),
            const SizedBox(width: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'CBS AMPLITUDE',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.8,
                    color: Colors.white,
                  ),
                ),
                Text(
                  'Sopra Banking & IT Banking Hub',
                  style: TextStyle(fontSize: 11, color: AppTheme.textSecondary),
                ),
              ],
            ),
          ],
        ),
        actions: [
          if (widget.onSwitchUniverse != null)
            IconButton(
              icon: const Icon(Icons.swap_horiz_rounded, color: Colors.blueAccent),
              tooltip: 'Changer d\'univers',
              onPressed: widget.onSwitchUniverse,
            ),
          if (widget.onLogout != null)
            IconButton(
              icon: const Icon(Icons.logout, color: Colors.white70, size: 20),
              tooltip: 'Déconnexion',
              onPressed: widget.onLogout,
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // CARTE PROFIL & RANG CBS
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    const Color(0xFF1E293B),
                    const Color(0xFF0F172A),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.blueAccent.withValues(alpha: 0.4), width: 1.5),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: Color(rank['color'] as int).withValues(alpha: 0.2),
                              shape: BoxShape.circle,
                              border: Border.all(color: Color(rank['color'] as int), width: 1.5),
                            ),
                            child: Icon(Icons.verified, color: Color(rank['color'] as int), size: 24),
                          ),
                          const SizedBox(width: 14),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                rank['name'] as String,
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Color(rank['color'] as int),
                                ),
                              ),
                              Text(
                                'Niveau ${rank['level']} • $_xp XP',
                                style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.blueAccent.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.blueAccent.withValues(alpha: 0.5)),
                        ),
                        child: const Text(
                          'AMPLITUDE 11.X',
                          style: TextStyle(color: Colors.blueAccent, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: LinearProgressIndicator(
                      value: progress,
                      backgroundColor: Colors.white10,
                      valueColor: AlwaysStoppedAnimation<Color>(Color(rank['color'] as int)),
                      minHeight: 8,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Progression niveau',
                        style: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 11),
                      ),
                      Text(
                        nextRank != null ? '${nextRank['minXp'] - _xp} XP jusqu\'à ${nextRank['name']}' : 'Rang Maximum Atteint',
                        style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),
            const Text(
              'MODULES IT BANKING AMPLITUDE',
              style: TextStyle(
                color: Colors.white70,
                fontSize: 13,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 12),

            // GRILLE DES MODULES
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.15,
              children: [
                _buildModuleCard(
                  title: 'Domaines Métier',
                  subtitle: '${CbsData.domains.length} Domaines & Tables',
                  icon: Icons.account_balance,
                  accentColor: Colors.blueAccent,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const CbsDomainsScreen()),
                  ),
                ),
                _buildModuleCard(
                  title: 'RUN & EOD/BOD',
                  subtitle: '${CbsData.eodSteps.length} Étapes du Batch',
                  icon: Icons.timelapse,
                  accentColor: Colors.amber,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const CbsBatchEodScreen()),
                  ),
                ),
                _buildModuleCard(
                  title: 'Oracle & Informix',
                  subtitle: 'Erreurs ORA & Locks',
                  icon: Icons.storage_rounded,
                  accentColor: Colors.cyanAccent,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const CbsDatabaseScreen()),
                  ),
                ),
                _buildModuleCard(
                  title: 'AIX / Unix Banking',
                  subtitle: '${CbsData.unixCommands.length} Commandes & Procédures',
                  icon: Icons.terminal_rounded,
                  accentColor: Colors.greenAccent,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const CbsUnixScreen()),
                  ),
                ),
                _buildModuleCard(
                  title: 'Incidents & RCA',
                  subtitle: '${CbsData.incidents.length} Cas Critiques Décomposés',
                  icon: Icons.crisis_alert_rounded,
                  accentColor: AppTheme.sgRed,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const CbsIncidentsScreen()),
                  ),
                ),
                _buildModuleCard(
                  title: 'CBS Academy',
                  subtitle: '${CbsData.quiz.length} Questions IT Banking',
                  icon: Icons.quiz_rounded,
                  accentColor: Colors.purpleAccent,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => CbsQuizScreen(
                        onXpEarned: (earned) {
                          setState(() => _xp += earned);
                        },
                      ),
                    ),
                  ),
                ),
                _buildModuleCard(
                  title: 'Cursus 4GL & Certif',
                  subtitle: '5 Grades • 75 Examens • Certificat CBS',
                  icon: Icons.workspace_premium,
                  accentColor: Colors.cyanAccent,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const TrainingCbsScreen()),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),
            // CARTOUCHE D'INFORMATION AMPLITUDE ARCHITECTURE
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.darkCard,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.borderDark),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: const [
                      Icon(Icons.hub_outlined, color: Colors.blueAccent, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'Architecture Amplitude Core',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Canaux (Web/Mobile/ATM) -> API Gateway -> Noyau Amplitude (Informix 4GL & Java Services) -> SGBD Oracle/Informix sur OS AIX / Linux RedHat.',
                    style: TextStyle(color: AppTheme.textSecondary, fontSize: 12, height: 1.4),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    children: [
                      _buildBadge('Multi-Devises'),
                      _buildBadge('Temps Réel 24/7'),
                      _buildBadge('Batch EOD/BOD'),
                      _buildBadge('Norme ISO 20022'),
                      _buildBadge('Comptabilité GL'),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildModuleCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color accentColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppTheme.darkCard,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppTheme.borderDark),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: accentColor.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: accentColor, size: 24),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    color: AppTheme.textSecondary,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBadge(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: Colors.white12),
      ),
      child: Text(
        text,
        style: const TextStyle(color: Colors.white70, fontSize: 10),
      ),
    );
  }
}
