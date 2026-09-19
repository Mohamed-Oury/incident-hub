import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/iso_raw_parser.dart';
import '../sandbox/sandbox_screen.dart';

class IsoRawParserScreen extends StatefulWidget {
  const IsoRawParserScreen({super.key});

  @override
  State<IsoRawParserScreen> createState() => _IsoRawParserScreenState();
}

class _IsoRawParserScreenState extends State<IsoRawParserScreen> {
  final _controller = TextEditingController();
  ParsedIsoMessage? _parsed;

  static const _sample0200 =
      '02007238248108C080001649701234567812010000000000000500000919143000000042143000091924125411051000000000420000018512345612345600TERMINAL123456789012345SUPERMARCHE DU CENTRE     PARIS        FR9780000000000000000';

  static const _sample0420 =
      '04207238248108C080001649701234567812010100000000000200000919143500000043143500091924126011051000000000430000018612345712345700ATM0001 123456789012345DISTRIBUTEUR GAB SG       PARIS        FR9780000000000000000';

  @override
  void initState() {
    super.initState();
    _controller.text = _sample0200;
    _parseCurrent();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _parseCurrent() {
    setState(() {
      _parsed = IsoRawParser.parse(_controller.text);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Analyseur de Trame ISO 8583'),
        actions: [
          IconButton(
            icon: const Icon(Icons.clear_all),
            tooltip: 'Effacer',
            onPressed: () {
              _controller.clear();
              _parseCurrent();
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Sélecteur d'échantillons
            Row(
              children: [
                const Text('Exemples :', style: TextStyle(color: Colors.white70, fontSize: 12)),
                const SizedBox(width: 8),
                ChoiceChip(
                  label: const Text('0200 Achat', style: TextStyle(fontSize: 11)),
                  selected: _controller.text == _sample0200,
                  onSelected: (selected) {
                    if (selected) {
                      _controller.text = _sample0200;
                      _parseCurrent();
                    }
                  },
                ),
                const SizedBox(width: 8),
                ChoiceChip(
                  label: const Text('0420 Reversal GAB', style: TextStyle(fontSize: 11)),
                  selected: _controller.text == _sample0420,
                  onSelected: (selected) {
                    if (selected) {
                      _controller.text = _sample0420;
                      _parseCurrent();
                    }
                  },
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Champ de saisie
            TextField(
              controller: _controller,
              maxLines: 4,
              style: const TextStyle(fontFamily: 'monospace', fontSize: 12, color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Collez ici une trame ISO 8583 brute (Hexadécimal ou ASCII)...',
                suffixIcon: IconButton(
                  icon: const Icon(Icons.paste, color: AppTheme.sgRed, size: 20),
                  onPressed: () async {
                    final data = await Clipboard.getData('text/plain');
                    if (data?.text != null) {
                      _controller.text = data!.text!;
                      _parseCurrent();
                    }
                  },
                ),
              ),
              onChanged: (_) => _parseCurrent(),
            ),

            const SizedBox(height: 16),

            if (_parsed != null) ...[
              if (_parsed!.parsingError != null)
                Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.sgRed.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppTheme.sgRed.withValues(alpha: 0.5)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.warning_amber_rounded, color: AppTheme.sgRed, size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _parsed!.parsingError!,
                          style: const TextStyle(color: Colors.white, fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ),

              // Synthèse MTI & Bitmaps
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1F2937), Color(0xFF111827)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
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
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppTheme.sgRed,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            'MTI : ${_parsed!.mti}',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                        ),
                        Text(
                          '${_parsed!.fields.length} champs actifs',
                          style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      _parsed!.mtiDescription,
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13),
                    ),
                    const Divider(height: 20, color: AppTheme.borderDark),
                    Row(
                      children: [
                        const Text('Bitmap Primaire : ', style: TextStyle(color: AppTheme.textSecondary, fontSize: 11)),
                        SelectableText(
                          _parsed!.bitmapPrimaryHex,
                          style: const TextStyle(fontFamily: 'monospace', color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    if (_parsed!.bitmapSecondaryHex != null) ...[
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Text('Bitmap Secondaire : ', style: TextStyle(color: AppTheme.textSecondary, fontSize: 11)),
                          SelectableText(
                            _parsed!.bitmapSecondaryHex!,
                            style: const TextStyle(fontFamily: 'monospace', color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Liste détaillée des champs extraits
              const Text(
                'Éléments de Données Décortiqués (Data Elements) :',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
              ),
              const SizedBox(height: 10),

              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _parsed!.fields.length,
                itemBuilder: (context, index) {
                  final f = _parsed!.fields[index];
                  final isDe55 = (f.de == 55);

                  return Card(
                    margin: const EdgeInsets.only(bottom: 8),
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
                                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: isDe55 ? AppTheme.successGreen.withValues(alpha: 0.2) : AppTheme.sgRed.withValues(alpha: 0.15),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Text(
                                      'DE ${f.de}',
                                      style: TextStyle(
                                        color: isDe55 ? AppTheme.successGreen : AppTheme.sgRed,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 11,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    f.name,
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
                                  ),
                                ],
                              ),
                              if (isDe55)
                                TextButton.icon(
                                  style: TextButton.styleFrom(visualDensity: VisualDensity.compact),
                                  icon: const Icon(Icons.open_in_new, size: 14, color: AppTheme.successGreen),
                                  label: const Text('Ouvrir TLV', style: TextStyle(color: AppTheme.successGreen, fontSize: 11)),
                                  onPressed: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(builder: (_) => const SandboxScreen()),
                                    );
                                  },
                                ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0F172A),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: SelectableText(
                              f.interpretedValue,
                              style: const TextStyle(fontFamily: 'monospace', fontSize: 12, color: Colors.white),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            f.description,
                            style: const TextStyle(color: AppTheme.textSecondary, fontSize: 10),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          ],
        ),
      ),
    );
  }
}
