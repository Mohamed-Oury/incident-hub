import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/database/gamification_service.dart';
import 'quiz_questions.dart';
import 'quiz_screen.dart';

class AcademyScreen extends StatefulWidget {
  const AcademyScreen({super.key});

  @override
  State<AcademyScreen> createState() => _AcademyScreenState();
}

class _AcademyScreenState extends State<AcademyScreen> {
  UserProfile? _profile;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    final p = await GamificationService.instance.getProfile();
    if (mounted) {
      setState(() {
        _profile = p;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('PayQuest Academy'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.sgRed))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Carte Profil & Palier Professionnel (Charte SG)
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF1F2937), Color(0xFF111827)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.borderDark),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                const CircleAvatar(
                                  radius: 20,
                                  backgroundColor: AppTheme.sgRed,
                                  child: Icon(Icons.school, color: Colors.white, size: 22),
                                ),
                                const SizedBox(width: 12),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      _profile!.rank,
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
                                    ),
                                    Text(
                                      '${_profile!.xp} XP accumulés • Niveau ${_profile!.level}',
                                      style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.white10,
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Row(
                                    children: [
                                      const Text('🔥 ', style: TextStyle(fontSize: 12)),
                                      Text('${_profile!.streak} j', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.white10,
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Row(
                                    children: [
                                      const Icon(Icons.bolt, color: AppTheme.warningOrange, size: 14),
                                      Text('${_profile!.energy}/100', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Progression vers palier supérieur', style: TextStyle(color: AppTheme.textSecondary, fontSize: 11)),
                            Text('${(_profile!.rankProgress * 100).toInt()}%', style: const TextStyle(color: AppTheme.sgRed, fontWeight: FontWeight.bold, fontSize: 11)),
                          ],
                        ),
                        const SizedBox(height: 6),
                        LinearProgressIndicator(
                          value: _profile!.rankProgress,
                          backgroundColor: const Color(0xFF111827),
                          color: AppTheme.sgRed,
                          minHeight: 7,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Header Statistiques Questions
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Parcours Thématiques (160 Questions)',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppTheme.sgRed.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: AppTheme.sgRed.withValues(alpha: 0.4)),
                        ),
                        child: Text(
                          '${QuizQuestionsCatalog.allQuestions.length} QCM',
                          style: const TextStyle(color: AppTheme.sgRed, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  _buildModuleTile(
                    title: '1. ISO 8583 & Messages MTI',
                    subtitle: '35 QCM : Requêtes 0200, Reversals 0420, STAN, RRN & Bitmaps',
                    icon: Icons.sync_alt,
                    color: AppTheme.sgRed,
                    xp: '30 XP / rep.',
                    onTap: () => _openQuiz('ISO 8583 & MTI'),
                  ),
                  const SizedBox(height: 10),
                  _buildModuleTile(
                    title: '2. Référentiel des Codes DE39',
                    subtitle: '35 QCM : Diagnostics réflexes rejets 51, 91, 55, 63, 75, 96...',
                    icon: Icons.error_outline,
                    color: AppTheme.warningOrange,
                    xp: '30 XP / rep.',
                    onTap: () => _openQuiz('Codes DE39'),
                  ),
                  const SizedBox(height: 10),
                  _buildModuleTile(
                    title: '3. Cryptographie EMV & Tags DE55',
                    subtitle: '35 QCM : Cryptogrammes ARQC/TC, CID, TVR 95, TSI 9B, CDA',
                    icon: Icons.credit_card,
                    color: AppTheme.successGreen,
                    xp: '40 XP / rep.',
                    onTap: () => _openQuiz('Cryptographie EMV'),
                  ),
                  const SizedBox(height: 10),
                  _buildModuleTile(
                    title: '4. Sécurité HSM & Gestion des Clés',
                    subtitle: '30 QCM : LMK, ZMK, ZPK, DUKPT, KSN, PIN Blocks Format 0/1',
                    icon: Icons.security,
                    color: const Color(0xFFA855F7),
                    xp: '40 XP / rep.',
                    onTap: () => _openQuiz('Sécurité HSM & Clés'),
                  ),
                  const SizedBox(height: 10),
                  _buildModuleTile(
                    title: '5. Compensation & Normes Bancaires',
                    subtitle: '25 QCM : Clearing, Settlement RTGS, MIF, Chargebacks, STIP',
                    icon: Icons.account_balance,
                    color: const Color(0xFF38BDF8),
                    xp: '35 XP / rep.',
                    onTap: () => _openQuiz('Compensation & Normes'),
                  ),
                  const SizedBox(height: 10),
                  _buildModuleTile(
                    title: '6. Grand Examen Monétique (Multi-Domaines)',
                    subtitle: 'Session panachée aléatoire sur l\'ensemble des 160 questions',
                    icon: Icons.emoji_events,
                    color: Colors.amber,
                    xp: '50 XP / rep.',
                    onTap: () => _openQuiz('TOUS'),
                  ),

                  const SizedBox(height: 24),

                  // Badges obtenus
                  const Text(
                    'Distinctions & Badges Obtenus',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 10),

                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _profile!.badges.map((b) => Chip(
                          backgroundColor: const Color(0xFF1F2937),
                          side: const BorderSide(color: AppTheme.borderDark),
                          avatar: const Icon(Icons.verified, size: 16, color: AppTheme.sgRed),
                          label: Text(b, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                        )).toList(),
                  ),
                ],
              ),
            ),
    );
  }

  void _openQuiz(String category) async {
    final res = await Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => QuizScreen(category: category)),
    );
    if (res == true) {
      _loadProfile();
    }
  }

  Widget _buildModuleTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required String xp,
    required VoidCallback onTap,
  }) {
    return Card(
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: color, size: 22),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white)),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 3),
          child: Text(subtitle, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11)),
        ),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: AppTheme.sgRed.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(6),
          ),
          child: Text(xp, style: const TextStyle(color: AppTheme.sgRed, fontSize: 10, fontWeight: FontWeight.bold)),
        ),
      ),
    );
  }
}
