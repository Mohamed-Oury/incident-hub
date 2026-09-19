import 'package:flutter/material.dart';
import '../../core/database/app_database.dart';
import '../../core/database/gamification_service.dart';
import '../../core/models/incident.dart';
import '../../core/theme/app_theme.dart';
import '../incidents/incident_list_screen.dart';
import '../incidents/incident_detail_screen.dart';
import '../de39/de39_screen.dart';
import '../bitmap/bitmap_screen.dart';
import '../academy/academy_screen.dart';
import '../sandbox/sandbox_screen.dart';
import '../boss_fight/boss_fight_screen.dart';
import '../tools/iso_raw_parser_screen.dart';
import '../tools/crypto_toolbox_screen.dart';
import '../tools/on_call_report_screen.dart';

class HomeScreen extends StatefulWidget {
  final VoidCallback? onLogout;

  const HomeScreen({super.key, this.onLogout});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Map<String, int> _stats = {'total': 0, 'validated': 0, 'de39': 0};
  List<IncidentModel> _topIncidents = [];
  bool _isLoading = true;
  UserProfile? _userProfile;

  @override
  void initState() {
    super.initState();
    _loadDashboard();
  }

  Future<void> _loadDashboard() async {
    setState(() => _isLoading = true);
    final stats = await AppDatabase.instance.getStats();
    final top = await AppDatabase.instance.searchIncidents(limit: 5);
    final profile = await GamificationService.instance.getProfile();

    if (mounted) {
      setState(() {
        _stats = stats;
        _topIncidents = top;
        _userProfile = profile;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            // Logo avec bordure rouge Société Générale identique au Web
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: AppTheme.sgRed, width: 2),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.sgRed.withValues(alpha: 0.4),
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
            const SizedBox(width: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'M.OURY',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.8,
                    color: Colors.white,
                  ),
                ),
                Text(
                  'Incident Hub • Astreinte Monétique',
                  style: TextStyle(fontSize: 11, color: AppTheme.textSecondary),
                ),
              ],
            ),
          ],
        ),
        actions: [
          if (widget.onLogout != null)
            IconButton(
              icon: const Icon(Icons.logout, color: Colors.white70, size: 20),
              tooltip: 'Déconnexion',
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    backgroundColor: AppTheme.darkCard,
                    title: const Text('Déconnexion', style: TextStyle(color: Colors.white)),
                    content: const Text('Voulez-vous fermer votre session d\'astreinte ?', style: TextStyle(color: AppTheme.textSecondary)),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(ctx),
                        child: const Text('Annuler', style: TextStyle(color: Colors.white70)),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: AppTheme.sgRed),
                        onPressed: () {
                          Navigator.pop(ctx);
                          widget.onLogout!();
                        },
                        child: const Text('Déconnexion', style: TextStyle(color: Colors.white)),
                      ),
                    ],
                  ),
                );
              },
            ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.sgRed))
          : RefreshIndicator(
              color: AppTheme.sgRed,
              onRefresh: _loadDashboard,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // PayQuest Profile / XP Banner
                    if (_userProfile != null) ...[
                      InkWell(
                        onTap: () async {
                          await Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const AcademyScreen()),
                          );
                          _loadDashboard();
                        },
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF1E2638), Color(0xFF111827)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppTheme.sgRed.withValues(alpha: 0.5)),
                          ),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: AppTheme.sgRed.withValues(alpha: 0.2),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(Icons.military_tech, color: AppTheme.sgRed, size: 28),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          _userProfile!.rankTitle,
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 13,
                                          ),
                                        ),
                                        Text(
                                          '${_userProfile!.xp} XP',
                                          style: const TextStyle(
                                            color: Colors.amber,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 13,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 6),
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(4),
                                      child: LinearProgressIndicator(
                                        value: _userProfile!.rankProgress,
                                        minHeight: 6,
                                        backgroundColor: const Color(0xFF374151),
                                        valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.sgRed),
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          'Niveau ${_userProfile!.level}',
                                          style: const TextStyle(color: Colors.white70, fontSize: 11),
                                        ),
                                        Text(
                                          '🔥 ${_userProfile!.streakDays}j • ⚡ ${_userProfile!.energy}/100',
                                          style: const TextStyle(color: Colors.white70, fontSize: 11),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Icon(Icons.chevron_right, color: Colors.white54, size: 18),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // PayQuest Modules Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Mode PayQuest (Cahier des Charges)',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppTheme.sgRed.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'NOUVEAU',
                            style: TextStyle(color: AppTheme.sgRed, fontSize: 9, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),

                    // PayQuest Action Grid
                    Row(
                      children: [
                        Expanded(
                          child: _buildPayQuestTile(
                            title: 'Academy',
                            subtitle: 'QCM & Quiz XP',
                            icon: Icons.school,
                            color: const Color(0xFF3B82F6),
                            onTap: () async {
                              await Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const AcademyScreen()),
                              );
                              _loadDashboard();
                            },
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: _buildPayQuestTile(
                            title: 'Sandbox',
                            subtitle: 'DE55 & CLI ISO',
                            icon: Icons.terminal,
                            color: const Color(0xFF10B981),
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const SandboxScreen()),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: _buildPayQuestTile(
                            title: 'Boss Fight',
                            subtitle: 'Crises P0/P1',
                            icon: Icons.flash_on,
                            color: AppTheme.sgRed,
                            onTap: () async {
                              await Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const BossFightScreen()),
                              );
                              _loadDashboard();
                            },
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 20),

                    // Stats Row - Société Générale Style (Noir & Rouge)
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF1F2937), Color(0xFF111827)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppTheme.borderDark),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildStatWidget('${_stats['total']}', 'Incidents BDD', Icons.storage, AppTheme.sgRed),
                          _buildStatWidget('${_stats['de39']}', 'Codes DE39', Icons.code, Colors.white),
                          _buildStatWidget('${_stats['validated']}', 'Cas Validés', Icons.verified, AppTheme.successGreen),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Quick Tool Modules Grid
                    const Text(
                      'Outils d\'Intervention Monétique',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    const SizedBox(height: 12),

                    GridView.count(
                      crossAxisCount: 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 1.25,
                      children: [
                        _buildNavCard(
                          title: '500 Incidents',
                          desc: 'Catalogue & Recherche hors-ligne',
                          icon: Icons.list_alt,
                          color: AppTheme.sgRed,
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const IncidentListScreen()),
                          ),
                        ),
                        _buildNavCard(
                          title: 'Codes DE39',
                          desc: 'Dictionnaire & Actions recommandées',
                          icon: Icons.error_outline,
                          color: AppTheme.warningOrange,
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const DE39Screen()),
                          ),
                        ),
                        _buildNavCard(
                          title: 'Bitmap ISO',
                          desc: 'Décodeur Binaire & Champs 1-128',
                          icon: Icons.memory,
                          color: Colors.white70,
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const BitmapScreen()),
                          ),
                        ),
                        _buildNavCard(
                          title: 'Sandbox DE55',
                          desc: 'Décodeur TLV EMV & Switch CLI',
                          icon: Icons.developer_mode,
                          color: AppTheme.sgRedDark,
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const SandboxScreen()),
                          ),
                        ),
                        _buildNavCard(
                          title: 'Trame ISO Brute',
                          desc: 'Découpage complet MTI, Bitmaps & DEs',
                          icon: Icons.data_object,
                          color: const Color(0xFF38BDF8),
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const IsoRawParserScreen()),
                          ),
                        ),
                        _buildNavCard(
                          title: 'Crypto Toolbox',
                          desc: 'KCV, Luhn, Service Code, PIN Block',
                          icon: Icons.enhanced_encryption,
                          color: const Color(0xFFA855F7),
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const CryptoToolboxScreen()),
                          ),
                        ),
                        _buildNavCard(
                          title: 'Flash Astreinte',
                          desc: 'Générateur de rapport incident P0/P1',
                          icon: Icons.notifications_active,
                          color: AppTheme.warningOrange,
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const OnCallReportScreen()),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Top Incidents Preview Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Incidents de Référence Récents',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                        TextButton(
                          onPressed: () => Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const IncidentListScreen()),
                          ),
                          child: const Text('Voir les 500 ->', style: TextStyle(color: AppTheme.sgRed, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _topIncidents.length,
                      itemBuilder: (context, index) {
                        final inc = _topIncidents[index];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 8),
                          child: ListTile(
                            dense: true,
                            leading: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                              decoration: BoxDecoration(
                                color: AppTheme.sgRed.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(4),
                                border: Border.all(color: AppTheme.sgRed.withValues(alpha: 0.3)),
                              ),
                              child: Text(
                                inc.reference,
                                style: const TextStyle(
                                  color: AppTheme.sgRed,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 11,
                                ),
                              ),
                            ),
                            title: Text(
                              inc.title,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                            ),
                            subtitle: Text(
                              '${inc.domain} • ${inc.component}',
                              style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                            ),
                            trailing: const Icon(Icons.chevron_right, size: 18, color: AppTheme.textMuted),
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => IncidentDetailScreen(incident: inc)),
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildPayQuestTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: AppTheme.darkCard,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: color.withValues(alpha: 0.4)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 6),
            Text(
              title,
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(color: AppTheme.textSecondary, fontSize: 9),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatWidget(String value, String label, IconData icon, Color color) {
    return Column(
      children: [
        Icon(icon, color: color, size: 22),
        const SizedBox(height: 6),
        Text(
          value,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
        ),
      ],
    );
  }

  Widget _buildNavCard({
    required String title,
    required String desc,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: color, size: 22),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    desc,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 10,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
