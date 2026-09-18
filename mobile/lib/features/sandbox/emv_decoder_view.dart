import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/emv_tlv_parser.dart';

class EmvDecoderView extends StatefulWidget {
  const EmvDecoderView({super.key});

  @override
  State<EmvDecoderView> createState() => _EmvDecoderViewState();
}

class _EmvDecoderViewState extends State<EmvDecoderView> {
  // Preset standard EMV DE55
  final TextEditingController _hexCtrl = TextEditingController(
    text: '9F26084C6279E53164AC209F2701809F100706011103A000009F370438641982950500000080009A032609189C01009F02060000000500005F2A020952820238009F1A0209529F36020014',
  );

  List<EmvTlvNode> _nodes = [];

  @override
  void initState() {
    super.initState();
    _decode();
  }

  void _decode() {
    if (_hexCtrl.text.trim().isEmpty) {
      setState(() => _nodes = []);
      return;
    }
    setState(() {
      _nodes = EmvTlvParser.parse(_hexCtrl.text);
    });
  }

  void _applyPreset(String hex) {
    _hexCtrl.text = hex;
    _decode();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Saisie Hexadécimale
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkCard,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppTheme.borderDark),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Flux Hexadécimal EMV / DE 55 :',
                  style: TextStyle(color: AppTheme.textSecondary, fontWeight: FontWeight.bold, fontSize: 13),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _hexCtrl,
                  maxLines: 3,
                  onChanged: (_) => _decode(),
                  style: const TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 12,
                    color: Colors.white,
                    letterSpacing: 1.0,
                  ),
                  decoration: InputDecoration(
                    hintText: 'Collez les octets bruts EMV...',
                    suffixIcon: IconButton(
                      icon: const Icon(Icons.clear, color: AppTheme.textMuted),
                      onPressed: () {
                        _hexCtrl.clear();
                        _decode();
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                const Text('Exemples types :', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 8,
                  runSpacing: 6,
                  children: [
                    ActionChip(
                      label: const Text('ARQC Visa/GIMAC Standard'),
                      onPressed: () => _applyPreset(
                        '9F26084C6279E53164AC209F2701809F100706011103A000009F370438641982950500000080009A032609189C01009F02060000000500005F2A020952820238009F1A0209529F36020014',
                      ),
                    ),
                    ActionChip(
                      label: const Text('Sélection AID & Label'),
                      onPressed: () => _applyPreset('8407A0000000031010500A564953412044454249548A023030'),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // En-tête des résultats
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '${_nodes.length} Tag(s) EMV Détecté(s)',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppTheme.sgRed.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(5),
                ),
                child: const Text('Norme EMV 4.3', style: TextStyle(color: AppTheme.sgRed, fontSize: 11, fontWeight: FontWeight.bold)),
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Liste des Tags
          if (_nodes.isEmpty)
            Container(
              padding: const EdgeInsets.all(24),
              alignment: Alignment.center,
              child: const Text('Aucun tag EMV valide détecté.', style: TextStyle(color: AppTheme.textMuted)),
            )
          else
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _nodes.length,
              itemBuilder: (context, index) {
                final node = _nodes[index];
                return _buildTagCard(node);
              },
            ),
        ],
      ),
    );
  }

  Widget _buildTagCard(EmvTlvNode node) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.sgRed.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: AppTheme.sgRed.withValues(alpha: 0.4)),
                      ),
                      child: Text(
                        'Tag ${node.tag}',
                        style: const TextStyle(
                          color: AppTheme.sgRed,
                          fontWeight: FontWeight.bold,
                          fontFamily: 'monospace',
                          fontSize: 13,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFF111827),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        'L: ${node.length} octet(s)',
                        style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11, fontFamily: 'monospace'),
                      ),
                    ),
                  ],
                ),
                Text(
                  node.info.format,
                  style: const TextStyle(color: AppTheme.textMuted, fontSize: 11, fontFamily: 'monospace'),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              node.info.name,
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
            ),
            const SizedBox(height: 4),
            Text(
              node.info.description,
              style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
            ),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF0A0A0C),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: const Color(0xFF27272A)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    node.valueHex,
                    style: const TextStyle(
                      color: AppTheme.successGreen,
                      fontFamily: 'monospace',
                      fontSize: 12,
                      letterSpacing: 1.0,
                    ),
                  ),
                  if (node.valueAscii != null && node.valueAscii!.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      'ASCII : "${node.valueAscii!}"',
                      style: const TextStyle(color: Colors.white70, fontSize: 11, fontStyle: FontStyle.italic),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
