import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/atm_ej_analyzer.dart';

class AtmEjScreen extends StatefulWidget {
  const AtmEjScreen({super.key});

  @override
  State<AtmEjScreen> createState() => _AtmEjScreenState();
}

class _AtmEjScreenState extends State<AtmEjScreen> {
  final TextEditingController _logController = TextEditingController();
  EjAnalysisResult? _analysisResult;

  final Map<String, String> _samples = {
    'Bourrage Billets': '''14:32:01 ATM: GAB-AG-04 TID: 88776655
14:32:03 CARD INSERTED: PAN 4970101234567890
14:32:05 PIN ENTERED: PIN OK
14:32:08 HOST APPROVED: AUTH OK AMOUNT: 50000
14:32:10 DISPENSE REQ: 5 BILLETS
14:32:17 HARDWARE ERROR: STACKER JAMMED IN TRANSPORT MODULE
14:32:25 TRANSACTION ABORTED - SHUTTER NOT OPENED
14:32:28 CARD EJECTED''',
    'Rétractation (Oubli 30s)': '''11:15:00 ATM: GAB-PARIS-02 TID: 44332211
11:15:02 CARD INSERTED: PAN 5100001234567891
11:15:05 PIN ENTERED: PIN OK
11:15:08 HOST APPROVED: AUTH OK AMOUNT: 20000
11:15:10 DISPENSE REQ: 2 BILLETS
11:15:15 BILLS PRESENTED
11:15:45 PRESENT TIMEOUT: BILLS RETRACTED IN REJECT BIN
11:15:48 CARD EJECTED''',
    'Distribution Conforme': '''09:40:10 ATM: GAB-DAKAR-01 TID: 99887766
09:40:12 CARD INSERTED: PAN 4000123456789012
09:40:15 PIN ENTERED: PIN OK
09:40:18 HOST APPROVED: AUTH OK AMOUNT: 30000
09:40:20 DISPENSE REQ: 3 BILLETS
09:40:24 NOTES DELIVERED
09:40:26 EXIT SENSOR CLEARED - BILLS TAKEN
09:40:28 CARD TAKEN''',
    'Refus Solde (DE39=51)': '''16:02:10 ATM: GAB-AG-08 TID: 11223344
16:02:12 CARD INSERTED: PAN 4970109876543210
16:02:15 PIN ENTERED: PIN OK
16:02:18 HOST REJECT: RESPONSE: 51 DECLINED AMOUNT: 100000
16:02:20 CARD RETURNED''',
  };

  @override
  void initState() {
    super.initState();
    _loadSample('Bourrage Billets');
  }

  void _loadSample(String key) {
    final sample = _samples[key];
    if (sample != null) {
      _logController.text = sample;
      _analyze();
    }
  }

  void _analyze() {
    final text = _logController.text.trim();
    if (text.isEmpty) {
      setState(() => _analysisResult = null);
      return;
    }
    final result = AtmEjAnalyzer.parse(text);
    setState(() => _analysisResult = result);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Journal Électronique GAB (ATM EJ)'),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 12),
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: AppTheme.successGreen.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: AppTheme.successGreen.withValues(alpha: 0.4)),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.security, color: AppTheme.successGreen, size: 14),
                SizedBox(width: 4),
                Text(
                  'PCI-DSS Masqué',
                  style: TextStyle(color: AppTheme.successGreen, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Bandeau d'information
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.darkCard,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppTheme.borderDark),
              ),
              child: const Row(
                children: [
                  Icon(Icons.receipt_long, color: AppTheme.sgRed, size: 24),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Analyseur de logs horodatés GAB/ATM (NCR, Wincor, Diebold, Hyosung). Détection automatique des bourrages, rétractations et arbitrage litiges porteurs.',
                      style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Échantillons rapides
            const Text(
              'SCÉNARIOS DE PRODUCTION FRÉQUENTS',
              style: TextStyle(
                color: AppTheme.sgRed,
                fontSize: 11,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 8),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: _samples.keys.map((key) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ActionChip(
                      label: Text(key, style: const TextStyle(fontSize: 12)),
                      backgroundColor: AppTheme.darkSurface,
                      side: const BorderSide(color: AppTheme.borderDark),
                      onPressed: () => _loadSample(key),
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 16),

            // Zone de texte pour le log
            TextField(
              controller: _logController,
              maxLines: 7,
              style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
              decoration: InputDecoration(
                hintText: 'Collez ici les lignes du journal électronique GAB...',
                suffixIcon: IconButton(
                  icon: const Icon(Icons.clear, size: 18),
                  onPressed: () {
                    _logController.clear();
                    _analyze();
                  },
                ),
              ),
              onChanged: (_) => _analyze(),
            ),
            const SizedBox(height: 16),

            // Résultats d'analyse
            if (_analysisResult != null) ...[
              _buildSummaryCard(_analysisResult!.summary),
              const SizedBox(height: 16),
              _buildTimeline(_analysisResult!.events),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryCard(EjAnalysisSummary summary) {
    Color verdictColor;
    String adviceText;
    IconData adviceIcon;

    switch (summary.claimAdvice) {
      case EjClaimAdvice.favorableRecredit:
        verdictColor = AppTheme.successGreen;
        adviceText = 'FAVORABLE : RECRÉDIT CLIENT IMMÉDIAT';
        adviceIcon = Icons.check_circle_outline;
        break;
      case EjClaimAdvice.unfavorableRejectClaim:
        verdictColor = AppTheme.sgRed;
        adviceText = 'DÉFAVORABLE : REJET DE LA RÉCLAMATION';
        adviceIcon = Icons.cancel_outlined;
        break;
      case EjClaimAdvice.investigationRequired:
        verdictColor = AppTheme.warningOrange;
        adviceText = 'AUDIT REQUIS : ARRÊTÉ DU COFFRE NÉCESSAIRE';
        adviceIcon = Icons.warning_amber_rounded;
        break;
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: verdictColor.withValues(alpha: 0.6), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: verdictColor.withValues(alpha: 0.1),
            blurRadius: 12,
            spreadRadius: 1,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(adviceIcon, color: verdictColor, size: 22),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  adviceText,
                  style: TextStyle(
                    color: verdictColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            summary.verdictExplanation,
            style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.black26,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.white12),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.shield_outlined, color: Colors.blueAccent, size: 16),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    summary.recommendedOperatorAction,
                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 12,
            runSpacing: 8,
            children: [
              if (summary.atmId != null)
                _buildChip('GAB ID', summary.atmId!, Colors.tealAccent),
              if (summary.panDetected != null)
                _buildChip('PAN Masqué', summary.panDetected!, AppTheme.sgRed),
              if (summary.amountDetected != null)
                _buildChip('Montant', '${summary.amountDetected!} XOF', Colors.amberAccent),
              if (summary.stanDetected != null)
                _buildChip('STAN', summary.stanDetected!, Colors.cyanAccent),
              _buildChip('Constructeur', summary.vendor.name.toUpperCase(), Colors.purpleAccent),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildChip(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: RichText(
        text: TextSpan(
          children: [
            TextSpan(text: '$label : ', style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold)),
            TextSpan(text: value, style: const TextStyle(color: Colors.white, fontSize: 11)),
          ],
        ),
      ),
    );
  }

  Widget _buildTimeline(List<EjParsedEvent> events) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'CHRONOLOGIE DES ÉVÉNEMENTS DÉCODÉS',
          style: TextStyle(
            color: AppTheme.sgRed,
            fontSize: 11,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(height: 8),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: events.length,
          separatorBuilder: (_, __) => const SizedBox(height: 8),
          itemBuilder: (context, index) {
            final ev = events[index];
            Color iconColor;
            IconData iconData;

            switch (ev.severity) {
              case EjEventSeverity.success:
                iconColor = AppTheme.successGreen;
                iconData = Icons.check_circle;
                break;
              case EjEventSeverity.critical:
                iconColor = AppTheme.sgRed;
                iconData = Icons.error;
                break;
              case EjEventSeverity.warning:
                iconColor = AppTheme.warningOrange;
                iconData = Icons.warning;
                break;
              case EjEventSeverity.info:
                iconColor = Colors.blueAccent;
                iconData = Icons.info_outline;
                break;
            }

            return Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.darkSurface,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppTheme.borderDark),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(iconData, color: iconColor, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              ev.description,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                            if (ev.timestamp != null)
                              Text(
                                ev.timestamp!,
                                style: const TextStyle(
                                  color: AppTheme.textSecondary,
                                  fontSize: 10,
                                  fontFamily: 'monospace',
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          ev.rawLogLine,
                          style: const TextStyle(
                            color: AppTheme.textSecondary,
                            fontFamily: 'monospace',
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}
