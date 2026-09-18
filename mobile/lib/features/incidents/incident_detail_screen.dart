import 'package:flutter/material.dart';
import '../../core/models/incident.dart';
import '../../core/theme/app_theme.dart';

class IncidentDetailScreen extends StatelessWidget {
  final IncidentModel incident;

  const IncidentDetailScreen({super.key, required this.incident});

  @override
  Widget build(BuildContext context) {
    final isValidated = incident.knowledgeStatus == 'VALIDATED';

    return Scaffold(
      appBar: AppBar(
        title: Text(incident.reference),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Badge & Reference Card
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
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryBlue.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: AppTheme.primaryBlue.withValues(alpha: 0.4)),
                        ),
                        child: Text(
                          incident.reference,
                          style: const TextStyle(
                            color: AppTheme.primaryBlue,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: isValidated
                              ? AppTheme.successGreen.withValues(alpha: 0.15)
                              : AppTheme.warningOrange.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(
                            color: isValidated
                                ? AppTheme.successGreen.withValues(alpha: 0.4)
                                : AppTheme.warningOrange.withValues(alpha: 0.4),
                          ),
                        ),
                        child: Text(
                          isValidated ? 'CAS VALIDÉ' : 'SCÉNARIO DE RÉFÉRENCE',
                          style: TextStyle(
                            color: isValidated ? AppTheme.successGreen : AppTheme.warningOrange,
                            fontWeight: FontWeight.w700,
                            fontSize: 11,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    incident.title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Divider(color: AppTheme.borderDark),
                  const SizedBox(height: 12),
                  _buildMetaRow('Domaine Monétique', incident.domain, Icons.account_balance),
                  const SizedBox(height: 8),
                  _buildMetaRow('Composant Défaillant', incident.component, Icons.memory),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Diagnostic & Keys
            _buildSection(
              title: 'Clés d\'Analyse & Détection',
              icon: Icons.vpn_key,
              content: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Éléments d\'identification de la trace dans les logs ou les messages ISO 8583 :',
                    style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: incident.analysisKeys
                        .split(',')
                        .map((k) => k.trim())
                        .where((k) => k.isNotEmpty)
                        .map((key) => Chip(
                              backgroundColor: const Color(0xFF0F172A),
                              side: const BorderSide(color: Color(0xFF334155)),
                              label: Text(
                                key,
                                style: const TextStyle(
                                  color: AppTheme.accentCyan,
                                  fontFamily: 'monospace',
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ))
                        .toList(),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Investigation Guide
            _buildSection(
              title: 'Protocole d\'Intervention d\'Astreinte',
              icon: Icons.checklist,
              content: Column(
                children: [
                  _buildStepItem(
                    step: '1',
                    title: 'Isolation de la trace transactionnelle',
                    desc: 'Extraire le flux ISO avec les clés (${incident.analysisKeys}) sur le Switch et l\'Electronic Journal.',
                  ),
                  const SizedBox(height: 12),
                  _buildStepItem(
                    step: '2',
                    title: 'Vérification du retour DE39 & MTI',
                    desc: 'Contrôler si la requête (0200) a reçu une réponse (0210) ou si un Reversal (0420/0430) a été émis.',
                  ),
                  const SizedBox(height: 12),
                  _buildStepItem(
                    step: '3',
                    title: 'Vérification de l\'état porteur / CBS',
                    desc: 'Vérifier dans le Core Banking si une écriture d\'autorisation provisoire a été passée ou compensée.',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetaRow(String label, String value, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 16, color: const Color(0xFF94A3B8)),
        const SizedBox(width: 8),
        Text(
          '$label : ',
          style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13),
          ),
        ),
      ],
    );
  }

  Widget _buildSection({required String title, required IconData icon, required Widget content}) {
    return Container(
      width: double.infinity,
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
            children: [
              Icon(icon, size: 18, color: AppTheme.primaryBlue),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ],
          ),
          const SizedBox(height: 12),
          content,
        ],
      ),
    );
  }

  Widget _buildStepItem({required String step, required String title, required String desc}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CircleAvatar(
          radius: 12,
          backgroundColor: AppTheme.primaryBlue.withValues(alpha: 0.2),
          child: Text(
            step,
            style: const TextStyle(color: AppTheme.primaryBlue, fontSize: 12, fontWeight: FontWeight.bold),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13),
              ),
              const SizedBox(height: 2),
              Text(
                desc,
                style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
