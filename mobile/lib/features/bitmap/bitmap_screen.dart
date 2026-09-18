import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/bitmap_helper.dart';

class BitmapScreen extends StatefulWidget {
  const BitmapScreen({super.key});

  @override
  State<BitmapScreen> createState() => _BitmapScreenState();
}

class _BitmapScreenState extends State<BitmapScreen> {
  final TextEditingController _hexCtrl = TextEditingController(text: '7238248108C08000');
  BitmapResult? _result;

  @override
  void initState() {
    super.initState();
    _decode();
  }

  void _decode() {
    if (_hexCtrl.text.trim().isEmpty) {
      setState(() => _result = null);
      return;
    }
    setState(() {
      _result = BitmapHelper.decodeHex(_hexCtrl.text);
    });
  }

  void _applyPreset(String hex) {
    _hexCtrl.text = hex;
    _decode();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Décodeur Bitmap ISO 8583'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hex Input Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.darkCard,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.borderDark),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Bitmap Hexadécimal (16 ou 32 caractères) :',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                      color: Color(0xFF94A3B8),
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _hexCtrl,
                    onChanged: (_) => _decode(),
                    style: const TextStyle(
                      fontFamily: 'monospace',
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.5,
                      color: AppTheme.accentCyan,
                    ),
                    decoration: InputDecoration(
                      hintText: 'Ex: 7238248108C08000',
                      suffixIcon: IconButton(
                        icon: const Icon(Icons.clear, color: Color(0xFF64748B)),
                        onPressed: () {
                          _hexCtrl.clear();
                          _decode();
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Exemples types :',
                    style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                  ),
                  const SizedBox(height: 6),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      ActionChip(
                        label: const Text('0200 Standard (Achat)'),
                        onPressed: () => _applyPreset('7238248108C08000'),
                      ),
                      ActionChip(
                        label: const Text('0420 Reversal GAB'),
                        onPressed: () => _applyPreset('7238248108C08010'),
                      ),
                      ActionChip(
                        label: const Text('Avec Bitmap Secondaire'),
                        onPressed: () => _applyPreset('F238248108C080000000000000000002'),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            if (_result != null) ...[
              // Summary Result Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.darkCard,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.borderDark),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStatCol('Longueur Hex', '${_result!.hex.length} car.'),
                    _buildStatCol('Total Bits', '${_result!.binary.length} bits'),
                    _buildStatCol(
                      'Bitmap 2nd',
                      _result!.hasSecondary ? 'OUI (Actif)' : 'NON',
                      color: _result!.hasSecondary ? AppTheme.warningOrange : AppTheme.successGreen,
                    ),
                    _buildStatCol(
                      'Champs Actifs',
                      '${_result!.activeElements.length}',
                      color: AppTheme.primaryBlue,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Active Elements List
              const Text(
                'Champs ISO 8583 Activés (Data Elements) :',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 10),

              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _result!.activeDetails.length,
                itemBuilder: (context, index) {
                  final de = _result!.activeDetails[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppTheme.primaryBlue.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              'DE ${de.number}',
                              style: const TextStyle(
                                color: AppTheme.primaryBlue,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                                fontFamily: 'monospace',
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        de.name,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 13,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                    Text(
                                      de.format,
                                      style: const TextStyle(
                                        color: AppTheme.accentCyan,
                                        fontSize: 11,
                                        fontFamily: 'monospace',
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  de.description,
                                  style: const TextStyle(
                                    color: Color(0xFF94A3B8),
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
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

  Widget _buildStatCol(String label, String value, {Color color = Colors.white}) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            color: color,
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            color: Color(0xFF64748B),
            fontSize: 11,
          ),
        ),
      ],
    );
  }
}
