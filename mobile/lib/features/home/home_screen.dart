import 'package:flutter/material.dart';
import '../../core/database/app_database.dart';
import '../../core/models/incident.dart';
import '../../core/theme/app_theme.dart';
import '../incidents/incident_list_screen.dart';
import '../incidents/incident_detail_screen.dart';
import '../de39/de39_screen.dart';
import '../bitmap/bitmap_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Map<String, int> _stats = {'total': 0, 'validated': 0, 'de39': 0};
  List<IncidentModel> _topIncidents = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDashboard();
  }

  Future<void> _loadDashboard() async {
    setState(() => _isLoading = true);
    final stats = await AppDatabase.instance.getStats();
    final top = await AppDatabase.instance.searchIncidents(limit: 5);

    if (mounted) {
      setState(() {
        _stats = stats;
        _topIncidents = top;
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
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppTheme.primaryBlue.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.flash_on, color: AppTheme.accentCyan, size: 20),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Payway Incident Hub',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                Text(
                  'Astreinte & Diagnostic Hors-ligne',
                  style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                ),
              ],
            ),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadDashboard,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Stats Row
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppTheme.borderDark),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildStatWidget('${_stats['total']}', 'Incidents BDD', Icons.storage, AppTheme.primaryBlue),
                          _buildStatWidget('${_stats['de39']}', 'Codes DE39', Icons.code, AppTheme.accentCyan),
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
                          color: AppTheme.primaryBlue,
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
                          color: AppTheme.accentCyan,
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const BitmapScreen()),
                          ),
                        ),
                        _buildNavCard(
                          title: 'Urgences DE39',
                          desc: 'Recherche directe 91, 51, 55...',
                          icon: Icons.bolt,
                          color: const Color(0xFFA855F7),
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const DE39Screen()),
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
                          child: const Text('Voir les 500 ->', style: TextStyle(color: AppTheme.primaryBlue)),
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
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppTheme.primaryBlue.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                inc.reference,
                                style: const TextStyle(
                                  color: AppTheme.primaryBlue,
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
                              style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
                            ),
                            trailing: const Icon(Icons.chevron_right, size: 18, color: Color(0xFF64748B)),
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
          style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
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
                      color: Color(0xFF94A3B8),
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
