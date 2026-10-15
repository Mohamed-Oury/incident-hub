import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../data/flexcube_data.dart';

class FlexcubeTablesScreen extends StatefulWidget {
  const FlexcubeTablesScreen({super.key});

  @override
  State<FlexcubeTablesScreen> createState() => _FlexcubeTablesScreenState();
}

class _FlexcubeTablesScreenState extends State<FlexcubeTablesScreen> {
  String _searchQuery = '';
  String? _selectedModule;

  static const Color flexcubeOrange = Color(0xFFEA580C);
  static const Color flexcubeOrangeLight = Color(0xFFFB923C);

  final List<String> _modules = ['ST', 'AC', 'GL', 'CL', 'FT', 'AEOD', 'GW'];

  @override
  Widget build(BuildContext context) {
    final filtered = FlexcubeData.schemaTables.where((table) {
      if (_selectedModule != null && table.module != _selectedModule) return false;
      if (_searchQuery.isEmpty) return true;
      final q = _searchQuery.toLowerCase();
      return table.tableName.toLowerCase().contains(q) ||
          table.description.toLowerCase().contains(q) ||
          table.businessRole.toLowerCase().contains(q);
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dictionnaire Tables FCUBS (16)'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: TextField(
              style: const TextStyle(fontSize: 13),
              decoration: InputDecoration(
                hintText: 'Rechercher une table (ex: STTM_CUST_ACCOUNT, ACTB)...',
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
                  label: const Text('Tous', style: TextStyle(fontSize: 11)),
                  selected: _selectedModule == null,
                  onSelected: (sel) => setState(() => _selectedModule = null),
                ),
                const SizedBox(width: 6),
                ..._modules.map((m) => Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: ChoiceChip(
                    label: Text(m, style: const TextStyle(fontSize: 11)),
                    selected: _selectedModule == m,
                    onSelected: (sel) => setState(() => _selectedModule = sel ? m : null),
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
                final table = filtered[index];

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
                          Text(
                            table.tableName,
                            style: const TextStyle(
                              color: flexcubeOrangeLight,
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              fontFamily: 'monospace',
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: flexcubeOrange.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(4),
                              border: Border.all(color: flexcubeOrange.withValues(alpha: 0.5)),
                            ),
                            child: Text(
                              table.module,
                              style: const TextStyle(color: flexcubeOrangeLight, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        table.description,
                        style: const TextStyle(color: Colors.white, fontSize: 12),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.black26,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          table.businessRole,
                          style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Icon(Icons.key, color: Colors.amberAccent, size: 14),
                          const SizedBox(width: 4),
                          Text(
                            'Clé primaire : ${table.primaryKey.join(', ')}',
                            style: const TextStyle(color: Colors.amberAccent, fontSize: 11, fontFamily: 'monospace'),
                          ),
                        ],
                      ),
                      if (table.indexingAdvice != null) ...[
                        const SizedBox(height: 4),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(Icons.speed, color: Colors.cyanAccent, size: 14),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                table.indexingAdvice!,
                                style: const TextStyle(color: Colors.cyanAccent, fontSize: 10),
                              ),
                            ),
                          ],
                        ),
                      ],
                      const SizedBox(height: 10),
                      ExpansionTile(
                        tilePadding: EdgeInsets.zero,
                        childrenPadding: EdgeInsets.zero,
                        title: Text(
                          '${table.keyColumns.length} colonnes clés documentées',
                          style: const TextStyle(color: flexcubeOrange, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                        children: table.keyColumns.map((col) {
                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 4),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                SizedBox(
                                  width: 140,
                                  child: Text(
                                    col.name,
                                    style: const TextStyle(
                                      color: Colors.white70,
                                      fontSize: 11,
                                      fontFamily: 'monospace',
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                SizedBox(
                                  width: 90,
                                  child: Text(
                                    col.type,
                                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 10, fontFamily: 'monospace'),
                                  ),
                                ),
                                Expanded(
                                  child: Text(
                                    col.description,
                                    style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                                  ),
                                ),
                              ],
                            ),
                          );
                        }).toList(),
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
