import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../data/cbs_data.dart';
import '../models/cbs_models.dart';

class CbsUnixScreen extends StatefulWidget {
  const CbsUnixScreen({super.key});

  @override
  State<CbsUnixScreen> createState() => _CbsUnixScreenState();
}

class _CbsUnixScreenState extends State<CbsUnixScreen> {
  String _selectedCategory = 'ALL';
  String _searchQuery = '';

  final List<String> _categories = [
    'ALL',
    'PROCESS',
    'DISK',
    'MEMORY',
    'LOGS',
    'ERROR',
    'NETWORK',
  ];

  @override
  Widget build(BuildContext context) {
    final filteredCommands = CbsData.unixCommands.where((c) {
      final matchesCat = _selectedCategory == 'ALL' || c.category == _selectedCategory;
      final q = _searchQuery.toLowerCase();
      final matchesSearch = c.command.toLowerCase().contains(q) ||
          c.description.toLowerCase().contains(q) ||
          c.usageExample.toLowerCase().contains(q) ||
          c.outputInterpretation.toLowerCase().contains(q);
      return matchesCat && matchesSearch;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text('AIX & Unix Banking (${filteredCommands.length})'),
      ),
      body: Column(
        children: [
          // BARRE DE RECHERCHE
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: TextField(
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Rechercher une commande (ps, df, errpt, topas, kill...)...',
                hintStyle: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                prefixIcon: const Icon(Icons.search, color: Colors.greenAccent),
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

          // FILTRES DE CATÉGORIE
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: _categories.map((cat) {
                final isSelected = _selectedCategory == cat;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(cat),
                    selected: isSelected,
                    onSelected: (val) => setState(() => _selectedCategory = cat),
                    backgroundColor: AppTheme.darkCard,
                    selectedColor: Colors.greenAccent.withValues(alpha: 0.25),
                    checkmarkColor: Colors.greenAccent,
                    labelStyle: TextStyle(
                      color: isSelected ? Colors.greenAccent : AppTheme.textSecondary,
                      fontSize: 12,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    ),
                    side: BorderSide(
                      color: isSelected ? Colors.greenAccent : AppTheme.borderDark,
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          // LISTE DES COMMANDES
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              itemCount: filteredCommands.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final cmd = filteredCommands[index];
                return _buildCommandCard(cmd);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCommandCard(CbsUnixCommand cmd) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderDark),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: Colors.greenAccent.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: Colors.greenAccent.withValues(alpha: 0.5)),
                ),
                child: Text(
                  cmd.category,
                  style: const TextStyle(
                    color: Colors.greenAccent,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const Icon(Icons.terminal, color: Colors.greenAccent, size: 20),
            ],
          ),
          const SizedBox(height: 10),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.white12),
            ),
            child: Text(
              cmd.command,
              style: const TextStyle(
                color: Colors.greenAccent,
                fontFamily: 'monospace',
                fontWeight: FontWeight.bold,
                fontSize: 13,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            cmd.description,
            style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 10),
          const Text(
            'EXEMPLE CONTEXTE AMPLITUDE :',
            style: TextStyle(color: AppTheme.textSecondary, fontSize: 10, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 4),
          Text(
            cmd.usageExample,
            style: const TextStyle(color: Colors.cyanAccent, fontFamily: 'monospace', fontSize: 11),
          ),
          const SizedBox(height: 8),
          const Text(
            'INTERPRÉTATION & IMPACT :',
            style: TextStyle(color: AppTheme.textSecondary, fontSize: 10, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 4),
          Text(
            cmd.outputInterpretation,
            style: const TextStyle(color: Colors.white70, fontSize: 12),
          ),
        ],
      ),
    );
  }
}
