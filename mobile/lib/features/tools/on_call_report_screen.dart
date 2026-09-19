import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_theme.dart';
import '../../core/database/auth_service.dart';

class OnCallReportScreen extends StatefulWidget {
  const OnCallReportScreen({super.key});

  @override
  State<OnCallReportScreen> createState() => _OnCallReportScreenState();
}

class _OnCallReportScreenState extends State<OnCallReportScreen> {
  String _severity = 'P1 - INCIDENT MAJEUR';
  String _component = 'Switch Frontal ISO 8583';
  String _dominantDe39 = 'DE39=91 (Issuer Inoperative)';
  final _impactController = TextEditingController(text: 'Chute de 45% du débit TPS, saturation des files d\'attente émetteur.');
  final _actionController = TextEditingController(text: 'Bascule dynamique sur lien de secours Télécom + activation Stand-In (STIP).');
  final _nextSyncController = TextEditingController(text: 'Dans 30 minutes (point téléphonique astreinte).');

  String _generatedReport = '';
  String _operatorName = 'Expert Astreinte';

  final List<String> _severities = [
    'P0 - BLOCAGE TOTAL',
    'P1 - INCIDENT MAJEUR',
    'P2 - SERVICE DÉGRADÉ',
    'INFO - FIN D\'INCIDENT / RÉSOLU',
  ];

  final List<String> _components = [
    'Switch Frontal ISO 8583',
    'Passerelle d\'Acquisition GAB / TPE',
    'Module de Sécurité Cryptographique (HSM)',
    'Liens Réseau Télécom / Interbancaire',
    'Base de Données / Moteur d\'Autorisation',
    'Flux de Compensation / Télécollecte',
  ];

  final List<String> _de39List = [
    'DE39=91 (Issuer Inoperative)',
    'DE39=63 (Security Violation / ARQC)',
    'DE39=68 (Response Received Too Late)',
    'DE39=96 (System Malfunction)',
    'DE39=51 (Fonds Insuffisants Burst)',
    'DE39=05 (Do Not Honor Rejets Multiples)',
  ];

  @override
  void initState() {
    super.initState();
    _loadUser();
    _generate();
  }

  void _loadUser() async {
    final session = await AuthService.instance.getValidSession();
    if (session != null && session.fullName.isNotEmpty) {
      setState(() {
        _operatorName = session.fullName;
        _generate();
      });
    }
  }

  void _generate() {
    final now = DateTime.now();
    final timeStr = '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}';
    final dateStr = '${now.day.toString().padLeft(2, '0')}/${now.month.toString().padLeft(2, '0')}/${now.year}';

    final text = '''🚨 [FLASH ASTREINTE MONÉTIQUE]
━━━━━━━━━━━━━━━━━━━━━━━━━━
Niveau : $_severity
Date/Heure : $dateStr à $timeStr
Opérateur : $_operatorName
Périmètre : $_component
Code Dominant : $_dominantDe39

📉 Impact Constaté :
${_impactController.text.trim()}

🛠 Action d'Urgence Engagée :
${_actionController.text.trim()}

⏱ Prochaine Synchronisation :
${_nextSyncController.text.trim()}
━━━━━━━━━━━━━━━━━━━━━━━━━━
Plateforme M.OURY Incident Hub''';

    setState(() {
      _generatedReport = text;
    });
  }

  @override
  void dispose() {
    _impactController.dispose();
    _actionController.dispose();
    _nextSyncController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Générateur Flash Astreinte'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'Régénérer',
            onPressed: _generate,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.sgRed.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppTheme.sgRed.withValues(alpha: 0.4)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.bolt, color: AppTheme.sgRed, size: 24),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Rédigez et diffusez en 1 clic un rapport d\'incident normé pour vos canaux WhatsApp, SMS, Slack ou Mail.',
                      style: TextStyle(color: Colors.white, fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Sévérité
            const Text('Niveau de Sévérité :', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            DropdownButtonFormField<String>(
              value: _severity,
              items: _severities.map((s) => DropdownMenuItem(value: s, child: Text(s, style: const TextStyle(fontSize: 13)))).toList(),
              onChanged: (val) {
                if (val != null) {
                  setState(() => _severity = val);
                  _generate();
                }
              },
            ),
            const SizedBox(height: 14),

            // Composant
            const Text('Composant Monétique Impacté :', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            DropdownButtonFormField<String>(
              value: _component,
              items: _components.map((c) => DropdownMenuItem(value: c, child: Text(c, style: const TextStyle(fontSize: 13)))).toList(),
              onChanged: (val) {
                if (val != null) {
                  setState(() => _component = val);
                  _generate();
                }
              },
            ),
            const SizedBox(height: 14),

            // DE39 dominant
            const Text('Code Rejet / DE39 Constaté :', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            DropdownButtonFormField<String>(
              value: _dominantDe39,
              items: _de39List.map((d) => DropdownMenuItem(value: d, child: Text(d, style: const TextStyle(fontSize: 13)))).toList(),
              onChanged: (val) {
                if (val != null) {
                  setState(() => _dominantDe39 = val);
                  _generate();
                }
              },
            ),
            const SizedBox(height: 14),

            // Impact
            const Text('Impact Opérationnel :', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            TextField(
              controller: _impactController,
              maxLines: 2,
              style: const TextStyle(fontSize: 13, color: Colors.white),
              onChanged: (_) => _generate(),
            ),
            const SizedBox(height: 14),

            // Action
            const Text('Action d\'Urgence Engagée :', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            TextField(
              controller: _actionController,
              maxLines: 2,
              style: const TextStyle(fontSize: 13, color: Colors.white),
              onChanged: (_) => _generate(),
            ),
            const SizedBox(height: 14),

            // Prochaine synchro
            const Text('Prochain Point de Situation :', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            TextField(
              controller: _nextSyncController,
              style: const TextStyle(fontSize: 13, color: Colors.white),
              onChanged: (_) => _generate(),
            ),

            const SizedBox(height: 22),

            // Aperçu du rapport
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Message Prêt à Diffuser :',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.sgRed,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                  icon: const Icon(Icons.copy, size: 16, color: Colors.white),
                  label: const Text('Copier le Rapport', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: _generatedReport));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Rapport d\'incident copié dans le presse-papiers !')),
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 10),

            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.borderDark),
              ),
              child: SelectableText(
                _generatedReport,
                style: const TextStyle(fontFamily: 'monospace', fontSize: 12, color: Colors.white, height: 1.4),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
