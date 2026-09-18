import 'package:flutter/material.dart';
import '../../core/database/app_database.dart';
import '../../core/models/incident.dart';
import '../../core/theme/app_theme.dart';
import 'incident_detail_screen.dart';

class IncidentListScreen extends StatefulWidget {
  const IncidentListScreen({super.key});

  @override
  State<IncidentListScreen> createState() => _IncidentListScreenState();
}

class _IncidentListScreenState extends State<IncidentListScreen> {
  final TextEditingController _searchCtrl = TextEditingController();
  List<IncidentModel> _incidents = [];
  List<String> _domains = ['ALL'];
  String _selectedDomain = 'ALL';
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    setState(() => _isLoading = true);
    final domains = await AppDatabase.instance.getDomains();
    final incidents = await AppDatabase.instance.searchIncidents(
      domain: _selectedDomain == 'ALL' ? null : _selectedDomain,
      limit: 200,
    );

    if (mounted) {
      setState(() {
        _domains = ['ALL', ...domains];
        _incidents = incidents;
        _isLoading = false;
      });
    }
  }

  Future<void> _performSearch() async {
    final results = await AppDatabase.instance.searchIncidents(
      query: _searchCtrl.text,
      domain: _selectedDomain == 'ALL' ? null : _selectedDomain,
      limit: 200,
    );
    if (mounted) {
      setState(() {
        _incidents = results;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Catalogue des 500 Incidents'),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchCtrl,
              onChanged: (_) => _performSearch(),
              decoration: InputDecoration(
                hintText: 'Rechercher un incident (ex: DE39=91, GAB, STAN...)',
                prefixIcon: const Icon(Icons.search, color: AppTheme.textMuted),
                suffixIcon: _searchCtrl.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, color: AppTheme.textMuted),
                        onPressed: () {
                          _searchCtrl.clear();
                          _performSearch();
                        },
                      )
                    : null,
              ),
            ),
          ),

          // Filter Domains horizontal list
          if (_domains.isNotEmpty)
            SizedBox(
              height: 38,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _domains.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final dom = _domains[index];
                  final isSelected = dom == _selectedDomain;
                  return ChoiceChip(
                    label: Text(dom == 'ALL' ? 'Tous' : dom),
                    selected: isSelected,
                    onSelected: (val) {
                      if (val) {
                        setState(() => _selectedDomain = dom);
                        _performSearch();
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

          // Incidents Count Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${_incidents.length} incident(s) trouvé(s)',
                  style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                ),
              ],
            ),
          ),

          const SizedBox(height: 8),

          // Incident List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: AppTheme.sgRed))
                : _incidents.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.search_off, size: 48, color: AppTheme.textMuted),
                            const SizedBox(height: 12),
                            Text(
                              'Aucun incident trouvé pour "${_searchCtrl.text}"',
                              style: const TextStyle(color: AppTheme.textSecondary),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        itemCount: _incidents.length,
                        itemBuilder: (context, index) {
                          final inc = _incidents[index];
                          final isValidated = inc.knowledgeStatus == 'VALIDATED';

                          return Card(
                            margin: const EdgeInsets.only(bottom: 10),
                            child: InkWell(
                              borderRadius: BorderRadius.circular(12),
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => IncidentDetailScreen(incident: inc),
                                  ),
                                );
                              },
                              child: Padding(
                                padding: const EdgeInsets.all(14),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.symmetric(
                                                  horizontal: 8, vertical: 3),
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
                                                  fontSize: 12,
                                                ),
                                              ),
                                            ),
                                            const SizedBox(width: 8),
                                            Container(
                                              padding: const EdgeInsets.symmetric(
                                                  horizontal: 8, vertical: 3),
                                              decoration: BoxDecoration(
                                                color: const Color(0xFF111827),
                                                borderRadius: BorderRadius.circular(4),
                                                border: Border.all(color: AppTheme.borderDark),
                                              ),
                                              child: Text(
                                                inc.domain,
                                                style: const TextStyle(
                                                  color: Colors.white70,
                                                  fontSize: 11,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        if (isValidated)
                                          const Icon(Icons.verified,
                                              size: 18, color: AppTheme.successGreen)
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      inc.title,
                                      style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600,
                                        color: Colors.white,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Row(
                                      children: [
                                        const Icon(Icons.vpn_key,
                                            size: 13, color: AppTheme.textMuted),
                                        const SizedBox(width: 4),
                                        Expanded(
                                          child: Text(
                                            inc.analysisKeys,
                                            style: const TextStyle(
                                              color: AppTheme.textSecondary,
                                              fontSize: 12,
                                              fontFamily: 'monospace',
                                            ),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        Text(
                                          inc.component,
                                          style: const TextStyle(
                                            color: AppTheme.textMuted,
                                            fontSize: 11,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
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
