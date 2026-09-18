import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/bitmap_helper.dart';


class TerminalLine {
  final String text;
  final Color color;
  final bool isPrompt;

  TerminalLine(this.text, {this.color = Colors.white, this.isPrompt = false});
}

class CliTerminalView extends StatefulWidget {
  const CliTerminalView({super.key});

  @override
  State<CliTerminalView> createState() => _CliTerminalViewState();
}

class _CliTerminalViewState extends State<CliTerminalView> {
  final TextEditingController _cmdCtrl = TextEditingController();
  final ScrollController _scrollCtrl = ScrollController();
  final List<TerminalLine> _lines = [];

  @override
  void initState() {
    super.initState();
    _lines.addAll([
      TerminalLine('====================================================', color: AppTheme.sgRed),
      TerminalLine(' PAYQUEST SWITCH CLI v1.0 [SOCGEN-HOST-01]', color: Colors.white),
      TerminalLine(' Système d\'Inspection Monétique & Simulation Réseau', color: AppTheme.textSecondary),
      TerminalLine(' Tapez "help" pour afficher la liste des commandes.', color: AppTheme.successGreen),
      TerminalLine('====================================================', color: AppTheme.sgRed),
      TerminalLine(''),
    ]);
  }

  void _executeCommand(String raw) {
    final cmd = raw.trim();
    if (cmd.isEmpty) return;

    setState(() {
      _lines.add(TerminalLine('switch> $cmd', color: AppTheme.sgRed, isPrompt: true));
    });
    _cmdCtrl.clear();

    final parts = cmd.split(' ');
    final action = parts[0].toLowerCase();

    switch (action) {
      case 'help':
        _lines.addAll([
          TerminalLine('Commandes disponibles :'),
          TerminalLine('  help                      : Affiche cette aide'),
          TerminalLine('  mti <code 0200/0420>      : Décode le type de message ISO'),
          TerminalLine('  de39 <code>               : Consulte la signification du code DE39'),
          TerminalLine('  bitmap <hex>              : Analyse et extrait les DE actifs'),
          TerminalLine('  status                    : Affiche la télémétrie du switch'),
          TerminalLine('  clear                     : Efface la console'),
        ]);
        break;

      case 'mti':
        if (parts.length < 2) {
          _lines.add(TerminalLine('Usage: mti <0100|0200|0420|0800...>', color: AppTheme.warningOrange));
        } else {
          final code = parts[1];
          final desc = _getMtiDesc(code);
          _lines.add(TerminalLine('[MTI $code] $desc', color: AppTheme.successGreen));
        }
        break;

      case 'de39':
        if (parts.length < 2) {
          _lines.add(TerminalLine('Usage: de39 <00|51|91|55...>', color: AppTheme.warningOrange));
        } else {
          final code = parts[1];
          final desc = _getDe39Desc(code);
          _lines.add(TerminalLine('[DE39 $code] $desc', color: AppTheme.successGreen));
        }
        break;

      case 'bitmap':
        if (parts.length < 2) {
          _lines.add(TerminalLine('Usage: bitmap <16 ou 32 hex chars>', color: AppTheme.warningOrange));
        } else {
          final res = BitmapHelper.decodeHex(parts[1]);
          _lines.add(TerminalLine('Bitmap: ${res.hex} (${res.binary.length} bits)', color: AppTheme.successGreen));
          _lines.add(TerminalLine('Champs actifs: ${res.activeElements.join(", ")}'));
        }
        break;

      case 'status':
        _lines.addAll([
          TerminalLine('--- TÉLÉMÉTRIE SWITCH MONÉTIQUE ---', color: AppTheme.sgRed),
          TerminalLine('État Host          : CONNECTÉ (Liaison Primaire X.25 / IP)'),
          TerminalLine('Débit Transactionnel: 420 TPS (Transactions / Seconde)'),
          TerminalLine('Taux d\'Approbation  : 99.4 %'),
          TerminalLine('Temps de Réponse   : 240 ms'),
          TerminalLine('HSM Crypto Cluster : SYNCHRONISÉ (Clés ZPK OK)'),
        ]);
        break;

      case 'clear':
        setState(() => _lines.clear());
        return;

      default:
        _lines.add(TerminalLine('Commande inconnue: "$action". Tapez "help".', color: AppTheme.sgRed));
    }

    _lines.add(TerminalLine(''));

    // Scroll vers le bas
    Future.delayed(const Duration(milliseconds: 50), () {
      if (_scrollCtrl.hasClients) {
        _scrollCtrl.jumpTo(_scrollCtrl.position.maxScrollExtent);
      }
    });
  }

  String _getMtiDesc(String mti) {
    switch (mti) {
      case '0100':
        return 'Demande d\'autorisation préalable (Authorization Request)';
      case '0110':
        return 'Réponse d\'autorisation (Authorization Response)';
      case '0200':
        return 'Demande financière avec débit immédiat (Financial Transaction Request)';
      case '0210':
        return 'Réponse à la demande financière (Financial Transaction Response)';
      case '0400':
      case '0420':
        return 'Avis d\'extourne / annulation (Reversal Advice)';
      case '0800':
        return 'Gestion réseau / Test d\'écho télécom (Network Management)';
      default:
        return 'Message MTI personnalisé ou étendu.';
    }
  }

  String _getDe39Desc(String code) {
    switch (code) {
      case '00':
        return 'Approuvé / Honoré (Transaction validée avec succès)';
      case '51':
        return 'Fonds insuffisants / Provision dépassée';
      case '55':
        return 'Code PIN erroné';
      case '91':
        return 'Émetteur inaccessible / Timeout réseau switch';
      case '96':
        return 'Erreur système de traitement interne';
      default:
        return 'Code de réponse monétique ISO 8583.';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Console Output
        Expanded(
          child: Container(
            margin: const EdgeInsets.all(12),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF070B12),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF1F2937)),
            ),
            child: ListView.builder(
              controller: _scrollCtrl,
              itemCount: _lines.length,
              itemBuilder: (context, index) {
                final line = _lines[index];
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 1),
                  child: Text(
                    line.text,
                    style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 12,
                      color: line.color,
                      height: 1.3,
                    ),
                  ),
                );
              },
            ),
          ),
        ),

        // Console Input
        Container(
          padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
          child: Row(
            children: [
              const Text('switch> ', style: TextStyle(color: AppTheme.sgRed, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
              Expanded(
                child: TextField(
                  controller: _cmdCtrl,
                  onSubmitted: _executeCommand,
                  style: const TextStyle(color: Colors.white, fontFamily: 'monospace', fontSize: 13),
                  decoration: const InputDecoration(
                    hintText: 'Tapez une commande (ex: status, de39 91, mti 0200)...',
                    contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.send, color: AppTheme.sgRed, size: 20),
                onPressed: () => _executeCommand(_cmdCtrl.text),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
