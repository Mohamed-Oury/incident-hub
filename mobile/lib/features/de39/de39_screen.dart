import 'package:flutter/material.dart';
import '../../core/database/app_database.dart';
import '../../core/models/de39.dart';
import '../../core/theme/app_theme.dart';

class DE39Screen extends StatefulWidget {
  const DE39Screen({super.key});

  @override
  State<DE39Screen> createState() => _DE39ScreenState();
}

class _DE39ScreenState extends State<DE39Screen> {
  final TextEditingController _searchCtrl = TextEditingController();
  List<DE39Model> _items = [];
  String _selectedCategory = 'ALL';
  bool _isLoading = true;

  final Map<String, String> _categoryLabels = {
    'ALL': 'Tous les codes',
    'APPROBATION': 'Approbations',
    'METIER_PORTEUR': 'Métier & Porteur',
    'SECURITE_CRYPTO': 'Sécurité & Crypto',
    'TECHNIQUE_RESEAU': 'Technique & Réseau',
  };

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    final results = await AppDatabase.instance.searchDE39(
      query: _searchCtrl.text,
      category: _selectedCategory == 'ALL' ? null : _selectedCategory,
    );
    if (mounted) {
      setState(() {
        _items = results;
        _isLoading = false;
      });
    }
  }

  Color _getCategoryColor(String category) {
    switch (category) {
      case 'APPROBATION':
        return AppTheme.successGreen;
      case 'METIER_PORTEUR':
        return AppTheme.warningOrange;
      case 'SECURITE_CRYPTO':
        return const Color(0xFFA855F7);
      case 'TECHNIQUE_RESEAU':
        return AppTheme.sgRed;
      default:
        return AppTheme.sgRed;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Référentiel Codes DE39 (ISO 8583)'),
      ),
      body: Column(
        children: [
          // Search Input
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchCtrl,
              onChanged: (_) => _loadData(),
              decoration: InputDecoration(
                hintText: 'Rechercher un code (ex: 00, 51, 91, timeout...)',
                prefixIcon: const Icon(Icons.search, color: AppTheme.textMuted),
                suffixIcon: _searchCtrl.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, color: AppTheme.textMuted),
                        onPressed: () {
                          _searchCtrl.clear();
                          _loadData();
                        },
                      )
                    : null,
              ),
            ),
          ),

          // Categories horizontal chips
          SizedBox(
            height: 38,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _categoryLabels.keys.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final catKey = _categoryLabels.keys.elementAt(index);
                final isSelected = catKey == _selectedCategory;
                return ChoiceChip(
                  label: Text(_categoryLabels[catKey]!),
                  selected: isSelected,
                  onSelected: (val) {
                    if (val) {
                      setState(() => _selectedCategory = catKey);
                      _loadData();
                    }
                  },
                  selectedColor: AppTheme.sgRed,
                  backgroundColor: AppTheme.darkCard,
                  labelStyle: TextStyle(
                    color: isSelected ? Colors.white : AppTheme.textSecondary,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    fontSize: 12,
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 12),

          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: AppTheme.sgRed))
                : _items.isEmpty
                    ? Center(
                        child: Text(
                          'Aucun code DE39 trouvé',
                          style: const TextStyle(color: AppTheme.textSecondary),
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        itemCount: _items.length,
                        itemBuilder: (context, index) {
                          final item = _items[index];
                          final catColor = _getCategoryColor(item.category);

                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            child: ExpansionTile(
                              tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                              leading: Container(
                                width: 44,
                                height: 44,
                                alignment: Alignment.center,
                                decoration: BoxDecoration(
                                  color: catColor.withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: catColor.withValues(alpha: 0.4)),
                                ),
                                child: Text(
                                  item.code,
                                  style: TextStyle(
                                    color: catColor,
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    fontFamily: 'monospace',
                                  ),
                                ),
                              ),
                              title: Text(
                                item.label,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                  color: Colors.white,
                                ),
                              ),
                              subtitle: Padding(
                                padding: const EdgeInsets.only(top: 4),
                                child: Text(
                                  item.meaning,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    color: AppTheme.textSecondary,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                              children: [
                                Padding(
                                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Divider(color: AppTheme.borderDark),
                                      const SizedBox(height: 8),
                                      const Text(
                                        'Impact sur l\'Incident :',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 12,
                                          color: AppTheme.warningOrange,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        item.impactIncident,
                                        style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 13),
                                      ),
                                      const SizedBox(height: 12),
                                      const Text(
                                        'Action Recommandée :',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 12,
                                          color: AppTheme.successGreen,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        item.recommendedAction,
                                        style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 13),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
