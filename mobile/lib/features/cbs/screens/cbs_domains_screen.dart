import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../data/cbs_data.dart';
import '../models/cbs_models.dart';

class CbsDomainsScreen extends StatefulWidget {
  const CbsDomainsScreen({super.key});

  @override
  State<CbsDomainsScreen> createState() => _CbsDomainsScreenState();
}

class _CbsDomainsScreenState extends State<CbsDomainsScreen> {
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final filtered = CbsData.domains.where((d) {
      final q = _searchQuery.toLowerCase();
      return d.name.toLowerCase().contains(q) ||
          d.code.toLowerCase().contains(q) ||
          d.tables.any((t) => t.toLowerCase().contains(q)) ||
          d.summary.toLowerCase().contains(q);
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Domaines Amplitude'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Rechercher un domaine, table (BKCPT, BKEVE...)...',
                hintStyle: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                prefixIcon: const Icon(Icons.search, color: Colors.blueAccent),
                filled: true,
                fillColor: AppTheme.darkCard,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppTheme.borderDark),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
              onChanged: (val) => setState(() => _searchQuery = val),
            ),
          ),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              itemCount: filtered.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final domain = filtered[index];
                return _buildDomainCard(context, domain);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDomainCard(BuildContext context, CbsFunctionalDomain domain) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderDark),
      ),
      child: ExpansionTile(
        tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.blueAccent.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(8),
          ),
          child: const Icon(Icons.account_balance_outlined, color: Colors.blueAccent, size: 22),
        ),
        title: Row(
          children: [
            Text(
              domain.name,
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.blueAccent.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                domain.code,
                style: const TextStyle(color: Colors.blueAccent, fontSize: 10, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Text(
            domain.summary,
            style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ),
        childrenPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        children: [
          _buildSectionHeader('Opérations Métier Clés'),
          const SizedBox(height: 6),
          ...domain.businessOperations.map((op) => _buildBulletPoint(op)),

          const SizedBox(height: 12),
          _buildSectionHeader('Processus & Batchs Associés'),
          const SizedBox(height: 6),
          ...domain.batchProcesses.map((bp) => _buildBulletPoint(bp, color: Colors.amberAccent)),

          const SizedBox(height: 12),
          _buildSectionHeader('Tables Base de Données (Schéma BK)'),
          const SizedBox(height: 6),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: domain.tables.map((t) => Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: Colors.blueAccent.withValues(alpha: 0.4)),
              ),
              child: Text(
                t,
                style: const TextStyle(color: Colors.cyanAccent, fontSize: 11, fontFamily: 'monospace', fontWeight: FontWeight.bold),
              ),
            )).toList(),
          ),

          const SizedBox(height: 12),
          _buildSectionHeader('Risques Opérationnels & Points d\'Attention'),
          const SizedBox(height: 6),
          ...domain.keyRisks.map((risk) => _buildBulletPoint(risk, color: AppTheme.sgRed)),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(
        title.toUpperCase(),
        style: const TextStyle(
          color: Colors.white70,
          fontSize: 11,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.8,
        ),
      ),
    );
  }

  Widget _buildBulletPoint(String text, {Color color = Colors.white70}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('• ', style: TextStyle(color: color, fontSize: 13, fontWeight: FontWeight.bold)),
          Expanded(
            child: Text(
              text,
              style: TextStyle(color: color.withValues(alpha: 0.9), fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }
}
