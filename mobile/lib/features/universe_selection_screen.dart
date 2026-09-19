import 'package:flutter/material.dart';
import '../core/theme/app_theme.dart';

class UniverseSelectionScreen extends StatelessWidget {
  final VoidCallback onSelectMonetique;
  final VoidCallback onSelectCbs;
  final VoidCallback? onLogout;

  const UniverseSelectionScreen({
    super.key,
    required this.onSelectMonetique,
    required this.onSelectCbs,
    this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: AppTheme.sgRed, width: 2),
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
                  'M.OURY',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, letterSpacing: 0.8),
                ),
                Text(
                  'Plateforme d\'Expertise Bancaire',
                  style: TextStyle(fontSize: 10, color: AppTheme.textSecondary),
                ),
              ],
            ),
          ],
        ),
        actions: [
          if (onLogout != null)
            IconButton(
              icon: const Icon(Icons.logout, color: Colors.white70, size: 20),
              tooltip: 'Déconnexion',
              onPressed: onLogout,
            ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'CHOISISSEZ VOTRE UNIVERS',
                style: TextStyle(
                  color: AppTheme.sgRed,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.5,
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Deux expertises pointues réunies dans une même application mobile.',
                style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 24),

              // CARTE 1 : UNIVERS MONÉTIQUE
              _buildUniverseCard(
                title: 'Univers Monétique & Systèmes de Paiement',
                subtitle: 'Switching, Cartes & Terminaux',
                description: '500 incidents de production, ISO 8583 Raw Parser, Décodeur DE39 & Bitmaps, Boîte à Outils Crypto (KCV, PIN Block, Luhn) et Simulateur DE55.',
                badge: 'PAYMENT SYSTEMS',
                accentColor: AppTheme.sgRed,
                gradientColors: [
                  const Color(0xFF2A080C),
                  const Color(0xFF140305),
                ],
                icon: Icons.credit_card_rounded,
                tags: ['ISO 8583', 'EMV DE55', 'GAB / TPE', 'VISA / GIMAC', 'Astreinte'],
                onTap: onSelectMonetique,
              ),

              const SizedBox(height: 20),

              // CARTE 2 : UNIVERS CBS AMPLITUDE
              _buildUniverseCard(
                title: 'Univers CBS & Core Banking',
                subtitle: 'Sopra Banking Amplitude & IT Banking',
                description: 'Domaines bancaires (Comptes, Crédits, DAT, GL), Enchaînement Batch EOD/BOD, Dictionnaire Erreurs Oracle (ORA) & Informix, AIX Unix et Méthodologie RCA.',
                badge: 'CORE BANKING SYSTEM',
                accentColor: Colors.blueAccent,
                gradientColors: [
                  const Color(0xFF0F1E36),
                  const Color(0xFF070E1A),
                ],
                icon: Icons.account_balance_rounded,
                tags: ['Amplitude 11', 'Batch EOD/BOD', 'Oracle / ORA', 'Informix 4GL', 'AIX Banking'],
                onTap: onSelectCbs,
              ),

              const SizedBox(height: 32),
              Center(
                child: Text(
                  'Expert Monétique & CBS • Oury Kohkoun',
                  style: TextStyle(color: Colors.white.withValues(alpha: 0.4), fontSize: 11),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildUniverseCard({
    required String title,
    required String subtitle,
    required String description,
    required String badge,
    required Color accentColor,
    required List<Color> gradientColors,
    required IconData icon,
    required List<String> tags,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: gradientColors,
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: accentColor.withValues(alpha: 0.6), width: 1.5),
          boxShadow: [
            BoxShadow(
              color: accentColor.withValues(alpha: 0.15),
              blurRadius: 16,
              spreadRadius: 2,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: accentColor.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: accentColor.withValues(alpha: 0.5)),
                  ),
                  child: Text(
                    badge,
                    style: TextStyle(color: accentColor, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: accentColor.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, color: accentColor, size: 24),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Text(
              title,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 18,
                height: 1.2,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: TextStyle(
                color: accentColor,
                fontWeight: FontWeight.w600,
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              description,
              style: const TextStyle(
                color: AppTheme.textSecondary,
                fontSize: 12,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: tags.map((t) => Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.black38,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: Colors.white12),
                ),
                child: Text(
                  t,
                  style: const TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.w500),
                ),
              )).toList(),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  'Entrer dans l\'univers',
                  style: TextStyle(color: accentColor, fontWeight: FontWeight.bold, fontSize: 13),
                ),
                const SizedBox(width: 6),
                Icon(Icons.arrow_forward_rounded, color: accentColor, size: 16),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
