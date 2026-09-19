import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/crypto_toolbox.dart';

class CryptoToolboxScreen extends StatefulWidget {
  const CryptoToolboxScreen({super.key});

  @override
  State<CryptoToolboxScreen> createState() => _CryptoToolboxScreenState();
}

class _CryptoToolboxScreenState extends State<CryptoToolboxScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // 1. KCV
  final _kcvController = TextEditingController(text: '0123456789ABCDEFFEDCBA9876543210');
  String _kcvResult = '';

  // 2. Luhn & BIN
  final _panController = TextEditingController(text: '4970123456781201');
  LuhnResult? _luhnResult;

  // 3. Service Code
  final _serviceCodeController = TextEditingController(text: '201');
  ServiceCodeResult? _serviceCodeResult;

  // 4. PIN Block Format 0
  final _pinPanController = TextEditingController(text: '4970123456781201');
  final _pinValController = TextEditingController(text: '1234');
  PinBlockResult? _pinBlockResult;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _computeKcv();
    _computeLuhn();
    _computeServiceCode();
    _computePinBlock();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _kcvController.dispose();
    _panController.dispose();
    _serviceCodeController.dispose();
    _pinPanController.dispose();
    _pinValController.dispose();
    super.dispose();
  }

  void _computeKcv() {
    setState(() {
      _kcvResult = CryptoToolbox.calculateKcv(_kcvController.text);
    });
  }

  void _computeLuhn() {
    setState(() {
      _luhnResult = CryptoToolbox.validateLuhn(_panController.text);
    });
  }

  void _computeServiceCode() {
    setState(() {
      _serviceCodeResult = CryptoToolbox.decodeServiceCode(_serviceCodeController.text);
    });
  }

  void _computePinBlock() {
    setState(() {
      _pinBlockResult = CryptoToolbox.formatIso0PinBlock(_pinPanController.text, _pinValController.text);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Boîte à Outils Cryptographique'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          labelColor: AppTheme.sgRed,
          unselectedLabelColor: AppTheme.textSecondary,
          indicatorColor: AppTheme.sgRed,
          tabs: const [
            Tab(icon: Icon(Icons.vpn_key), text: 'KCV Clés'),
            Tab(icon: Icon(Icons.credit_card), text: 'Luhn & BIN'),
            Tab(icon: Icon(Icons.dialpad), text: 'Service Code'),
            Tab(icon: Icon(Icons.lock), text: 'PIN Block ISO-0'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildKcvTab(),
          _buildLuhnTab(),
          _buildServiceCodeTab(),
          _buildPinBlockTab(),
        ],
      ),
    );
  }

  Widget _buildKcvTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Calculateur de KCV (Key Check Value)',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 4),
          const Text(
            'Empreinte de 6 caractères hexadécimaux pour vérifier l\'intégrité des clés DES/3DES/AES échangées (cérémonies de clés).',
            style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _kcvController,
            style: const TextStyle(fontFamily: 'monospace', fontSize: 13, color: Colors.white),
            decoration: const InputDecoration(
              labelText: 'Clé Hexadécimale (16, 24 ou 32 octets)',
              prefixIcon: Icon(Icons.key, color: AppTheme.sgRed),
            ),
            onChanged: (_) => _computeKcv(),
          ),
          const SizedBox(height: 16),

          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkCard,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppTheme.borderDark),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Key Check Value (KCV) :', style: TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      _kcvResult,
                      style: const TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.successGreen,
                        letterSpacing: 2,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.copy, color: Colors.white70),
                      tooltip: 'Copier KCV',
                      onPressed: () {
                        Clipboard.setData(ClipboardData(text: _kcvResult));
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('KCV copié dans le presse-papiers !')),
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLuhnTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Contrôle Luhn (Mod 10) & Détecteur de Marque',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 4),
          const Text(
            'Validation mathématique de conformité du numéro de carte (PAN) et masquage PCI-DSS.',
            style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _panController,
            keyboardType: TextInputType.number,
            style: const TextStyle(fontFamily: 'monospace', fontSize: 14, color: Colors.white),
            decoration: const InputDecoration(
              labelText: 'Numéro de Carte (PAN)',
              prefixIcon: Icon(Icons.credit_card, color: AppTheme.sgRed),
            ),
            onChanged: (_) => _computeLuhn(),
          ),
          const SizedBox(height: 16),

          if (_luhnResult != null) ...[
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: _luhnResult!.isValid ? AppTheme.successGreen.withValues(alpha: 0.15) : AppTheme.sgRed.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: _luhnResult!.isValid ? AppTheme.successGreen : AppTheme.sgRed),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        _luhnResult!.isValid ? Icons.verified : Icons.error,
                        color: _luhnResult!.isValid ? AppTheme.successGreen : AppTheme.sgRed,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        _luhnResult!.isValid ? 'ALGORITHME DE LUHN VALIDE (MOD 10 OK)' : 'CLÉ DE CONTRÔLE LUHN INVALIDE',
                        style: TextStyle(
                          color: _luhnResult!.isValid ? AppTheme.successGreen : AppTheme.sgRed,
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                  const Divider(height: 20, color: AppTheme.borderDark),
                  _buildDetailRow('Marque / Réseau :', _luhnResult!.cardScheme),
                  _buildDetailRow('BIN / IIN :', _luhnResult!.bin ?? 'N/A'),
                  _buildDetailRow('Masquage PCI-DSS :', _luhnResult!.maskedPan),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildServiceCodeTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Décodeur de Service Code (DE 35 / Piste 2)',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 4),
          const Text(
            'Interprète les 3 chiffres définissant la technologie, les règles d\'autorisation et le profil CVM de la carte.',
            style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
          ),
          const SizedBox(height: 16),

          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _serviceCodeController,
                  keyboardType: TextInputType.number,
                  maxLength: 3,
                  style: const TextStyle(fontFamily: 'monospace', fontSize: 16, color: Colors.white, fontWeight: FontWeight.bold),
                  decoration: const InputDecoration(
                    labelText: 'Service Code (ex: 201, 221, 101)',
                    counterText: '',
                  ),
                  onChanged: (_) => _computeServiceCode(),
                ),
              ),
              const SizedBox(width: 12),
              ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: AppTheme.sgRed),
                onPressed: () {
                  _serviceCodeController.text = '221';
                  _computeServiceCode();
                },
                child: const Text('Ex: 221 (Online/PIN)', style: TextStyle(fontSize: 11)),
              ),
            ],
          ),
          const SizedBox(height: 16),

          if (_serviceCodeResult != null) ...[
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
                  _buildDetailRow('1er Chiffre (Technologie) :', _serviceCodeResult!.techRule),
                  const Divider(height: 16, color: AppTheme.borderDark),
                  _buildDetailRow('2ème Chiffre (Autorisation) :', _serviceCodeResult!.authRule),
                  const Divider(height: 16, color: AppTheme.borderDark),
                  _buildDetailRow('3ème Chiffre (Vérification / CVM) :', _serviceCodeResult!.cvmRule),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildPinBlockTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Simulateur PIN Block ISO 9564 Format 0',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 4),
          const Text(
            'Démontre le calcul mathématique du XOR entre le bloc PIN et les 12 chiffres du PAN avant chiffrement sous clé ZPK.',
            style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _pinPanController,
            keyboardType: TextInputType.number,
            style: const TextStyle(fontFamily: 'monospace', fontSize: 13, color: Colors.white),
            decoration: const InputDecoration(labelText: 'PAN de la Carte (16 chiffres)'),
            onChanged: (_) => _computePinBlock(),
          ),
          const SizedBox(height: 12),

          TextField(
            controller: _pinValController,
            keyboardType: TextInputType.number,
            maxLength: 6,
            style: const TextStyle(fontFamily: 'monospace', fontSize: 13, color: Colors.white),
            decoration: const InputDecoration(labelText: 'Code PIN (4 à 6 chiffres)', counterText: ''),
            onChanged: (_) => _computePinBlock(),
          ),
          const SizedBox(height: 16),

          if (_pinBlockResult != null) ...[
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
                  _buildDetailRow('Bloc PIN (en clair) :', _pinBlockResult!.pinBlockPlain),
                  const SizedBox(height: 8),
                  _buildDetailRow('Bloc PAN (12 digits) :', _pinBlockResult!.panBlockPlain),
                  const Divider(height: 20, color: AppTheme.borderDark),
                  const Text('PIN Block Format 0 (Résultat XOR) :', style: TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                  const SizedBox(height: 4),
                  SelectableText(
                    _pinBlockResult!.pinBlockIso0Hex,
                    style: const TextStyle(fontFamily: 'monospace', fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.sgRed),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11)),
          const SizedBox(height: 2),
          Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
        ],
      ),
    );
  }
}
