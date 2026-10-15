import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../data/flexcube_data.dart';

class FlexcubeCheatSheetScreen extends StatefulWidget {
  const FlexcubeCheatSheetScreen({super.key});

  @override
  State<FlexcubeCheatSheetScreen> createState() => _FlexcubeCheatSheetScreenState();
}

class _FlexcubeCheatSheetScreenState extends State<FlexcubeCheatSheetScreen> {
  String _searchQuery = '';
  String? _selectedCategory;

  static const Color flexcubeOrange = Color(0xFFEA580C);
  static const Color flexcubeOrangeLight = Color(0xFFFB923C);

  final List<String> _categories = [
    'ARCHITECTURE',
    'SCHEMA',
    'PLSQL',
    'AEOD',
    'RUN_INCIDENTS',
    'GATEWAY',
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = FlexcubeData.cheatSections.where((item) {
      if (_selectedCategory != null && item.category != _selectedCategory) return false;
      if (_searchQuery.isEmpty) return true;
      final q = _searchQuery.toLowerCase();
      return item.title.toLowerCase().contains(q) ||
          item.short.toLowerCase().contains(q) ||
          item.rawText.toLowerCase().contains(q);
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Antisèche Oracle FLEXCUBE (20)'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: TextField(
              style: const TextStyle(fontSize: 13),
              decoration: InputDecoration(
                hintText: 'Rechercher une fiche mémo (ex: NOWAIT, ACTB, EOD)...',
                prefixIcon: const Icon(Icons.search, size: 20),
                isDense: true,
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, size: 18),
                        onPressed: () => setState(() => _searchQuery = ''),
                      )
                    : null,
              ),
              onChanged: (val) => setState(() => _searchQuery = val),
            ),
          ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                ChoiceChip(
                  label: const Text('Toutes (20)', style: TextStyle(fontSize: 11)),
                  selected: _selectedCategory == null,
                  onSelected: (_) => setState(() => _selectedCategory = null),
                ),
                const SizedBox(width: 6),
                ..._categories.map((cat) => Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: ChoiceChip(
                    label: Text(cat, style: const TextStyle(fontSize: 11)),
                    selected: _selectedCategory == cat,
                    onSelected: (sel) => setState(() => _selectedCategory = sel ? cat : null),
                  ),
                )),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: filtered.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final item = filtered[index];

                return Container(
                  padding: const EdgeInsets.all(14),
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
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: flexcubeOrange.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(4),
                              border: Border.all(color: flexcubeOrange.withValues(alpha: 0.5)),
                            ),
                            child: Text(
                              item.badge,
                              style: const TextStyle(color: flexcubeOrangeLight, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                          Text(
                            item.category,
                            style: const TextStyle(color: AppTheme.textMuted, fontSize: 10, fontFamily: 'monospace'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        item.title,
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item.short,
                        style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                      ),
                      const SizedBox(height: 10),
                      ...item.summaryPoints.map((pt) => Padding(
                        padding: const EdgeInsets.only(bottom: 3),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('• ', style: TextStyle(color: flexcubeOrangeLight, fontSize: 12)),
                            Expanded(child: Text(pt, style: const TextStyle(color: Colors.white70, fontSize: 11))),
                          ],
                        ),
                      )),
                      if (item.codeSample != null) ...[
                        const SizedBox(height: 8),
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.black45,
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: Colors.white12),
                          ),
                          child: Text(
                            item.codeSample!,
                            style: const TextStyle(color: Colors.lightGreenAccent, fontSize: 10, fontFamily: 'monospace'),
                          ),
                        ),
                      ],
                      if (item.caveat != null) ...[
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppTheme.errorRed.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: AppTheme.errorRed.withValues(alpha: 0.3)),
                          ),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(Icons.warning, color: AppTheme.errorRed, size: 14),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  item.caveat!,
                                  style: const TextStyle(color: AppTheme.errorRed, fontSize: 10),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
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
