import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../data/cbs_data.dart';
import '../models/cbs_models.dart';

class CbsDatabaseScreen extends StatefulWidget {
  const CbsDatabaseScreen({super.key});

  @override
  State<CbsDatabaseScreen> createState() => _CbsDatabaseScreenState();
}

class _CbsDatabaseScreenState extends State<CbsDatabaseScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final filteredErrors = CbsData.dbErrors.where((e) {
      final q = _searchQuery.toLowerCase();
      return e.code.toLowerCase().contains(q) ||
          e.name.toLowerCase().contains(q) ||
          e.symptom.toLowerCase().contains(q);
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Bases de Données (Oracle & Informix)'),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.cyanAccent,
          labelColor: Colors.cyanAccent,
          unselectedLabelColor: AppTheme.textSecondary,
          tabs: const [
            Tab(text: 'Dictionnaire Erreurs ORA', icon: Icon(Icons.bug_report)),
            Tab(text: 'Comparatif Oracle vs Informix', icon: Icon(Icons.compare_arrows)),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // ONGLET 1: ERREURS ORA & INFORMIX
          Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: TextField(
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Rechercher une erreur (ORA-00054, ORA-00060, ORA-01555)...',
                    hintStyle: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                    prefixIcon: const Icon(Icons.search, color: Colors.cyanAccent),
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
                  itemCount: filteredErrors.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final err = filteredErrors[index];
                    return _buildDbErrorCard(err);
                  },
                ),
              ),
            ],
          ),

          // ONGLET 2: COMPARATIF ORACLE VS INFORMIX
          SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildComparisonCard(
                  title: 'Architecture & Instances',
                  oracle: 'SGA (Shared Pool, Buffer Cache, Redo Log Buffer) + PGA + Processus (SMON, PMON, DBWR, LGWR, CKPT).',
                  informix: 'Shared Memory (Resident, Virtual, Message) + threads vp (cpu, aio, lio, pio, mcs).',
                ),
                const SizedBox(height: 12),
                _buildComparisonCard(
                  title: 'Gestion des Espaces & Fichiers',
                  oracle: 'Tablespaces -> Datafiles (fichiers .dbf) -> Segments -> Extents -> Blocs Oracle.',
                  informix: 'Dbspaces -> Chunks (fichiers raw ou cooked) -> Tables -> Extents -> Pages Informix.',
                ),
                const SizedBox(height: 12),
                _buildComparisonCard(
                  title: 'Journaux de Transactions (Redo / Logs)',
                  oracle: 'Online Redo Logs cycliques archivés en ArchiveLogs par ARCH pour le point-in-time recovery.',
                  informix: 'Logical Logs gérés par onbar ou ontape avec sauvegarde continue en logs archivés.',
                ),
                const SizedBox(height: 12),
                _buildComparisonCard(
                  title: 'Mécanismes de Verrous (Locking)',
                  oracle: 'Verrouillage au niveau ligne natif (Row-level) sans escalation de verrous. Aucun lock en lecture simple (Multiversion Concurrency Control - MVCC).',
                  informix: 'Verrouillage par page ou par ligne (ALTER TABLE ... LOCK MODE ROW). Risque d\'escalade si mal paramétré. Isolation configurable (DIRTY READ, COMMITTED READ).',
                ),
                const SizedBox(height: 12),
                _buildComparisonCard(
                  title: 'Outils d\'Administration & Utilitaires',
                  oracle: 'SQL*Plus, SQL Developer, RMAN, Data Pump (expdp/impdp), Enterprise Manager.',
                  informix: 'dbaccess, onstat (monitoring mémoire), onmode (gestion instance), oncheck, onbar.',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDbErrorCard(CbsDbError err) {
    final isCritical = err.severity == 'CRITICAL';
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isCritical ? AppTheme.sgRed.withValues(alpha: 0.7) : AppTheme.borderDark,
        ),
      ),
      child: ExpansionTile(
        tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: isCritical
                ? AppTheme.sgRed.withValues(alpha: 0.2)
                : Colors.cyanAccent.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            Icons.warning_amber_rounded,
            color: isCritical ? AppTheme.sgRed : Colors.cyanAccent,
            size: 24,
          ),
        ),
        title: Row(
          children: [
            Text(
              err.code,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontFamily: 'monospace',
                fontSize: 15,
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: (isCritical ? AppTheme.sgRed : Colors.orangeAccent).withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                err.severity,
                style: TextStyle(
                  color: isCritical ? AppTheme.sgRed : Colors.orangeAccent,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Text(
            err.name,
            style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
          ),
        ),
        childrenPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        children: [
          _buildSubHeader('Symptôme & Cause Racine'),
          const SizedBox(height: 4),
          Text(
            err.symptom,
            style: const TextStyle(color: Colors.white70, fontSize: 12),
          ),
          const SizedBox(height: 6),
          Text(
            'Cause: ${err.rootCause}',
            style: const TextStyle(color: Colors.amberAccent, fontSize: 12),
          ),

          const SizedBox(height: 12),
          _buildSubHeader('Requêtes SQL de Diagnostic'),
          const SizedBox(height: 6),
          ...err.diagnosticQueries.map((q) => Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 6),
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.white12),
            ),
            child: Text(
              q,
              style: const TextStyle(
                color: Colors.cyanAccent,
                fontSize: 11,
                fontFamily: 'monospace',
              ),
            ),
          )),

          const SizedBox(height: 12),
          _buildSubHeader('Procédure de Résolution'),
          const SizedBox(height: 6),
          ...err.resolutionSteps.map((step) => Padding(
            padding: const EdgeInsets.symmetric(vertical: 2),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.arrow_right, color: Colors.greenAccent, size: 16),
                Expanded(
                  child: Text(
                    step,
                    style: const TextStyle(color: Colors.white, fontSize: 12),
                  ),
                ),
              ],
            ),
          )),

          const SizedBox(height: 12),
          _buildSubHeader('Règle de Prévention'),
          const SizedBox(height: 4),
          Text(
            err.prevention,
            style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12, fontStyle: FontStyle.italic),
          ),
        ],
      ),
    );
  }

  Widget _buildComparisonCard({
    required String title,
    required String oracle,
    required String informix,
  }) {
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
          Text(
            title,
            style: const TextStyle(color: Colors.cyanAccent, fontWeight: FontWeight.bold, fontSize: 15),
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 70,
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.redAccent.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Center(
                  child: Text(
                    'ORACLE',
                    style: TextStyle(color: Colors.redAccent, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  oracle,
                  style: const TextStyle(color: Colors.white70, fontSize: 12, height: 1.3),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 70,
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.blueAccent.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Center(
                  child: Text(
                    'INFORMIX',
                    style: TextStyle(color: Colors.blueAccent, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  informix,
                  style: const TextStyle(color: Colors.white70, fontSize: 12, height: 1.3),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSubHeader(String title) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(
        title.toUpperCase(),
        style: const TextStyle(
          color: Colors.white60,
          fontSize: 11,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.8,
        ),
      ),
    );
  }
}
