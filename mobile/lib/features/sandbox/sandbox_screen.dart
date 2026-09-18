import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import 'emv_decoder_view.dart';
import 'cli_terminal_view.dart';

class SandboxScreen extends StatelessWidget {
  const SandboxScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('PayQuest Sandbox & CLI'),
          bottom: const TabBar(
            indicatorColor: AppTheme.sgRed,
            labelColor: Colors.white,
            unselectedLabelColor: AppTheme.textSecondary,
            tabs: [
              Tab(icon: Icon(Icons.credit_card, size: 18), text: 'Décodeur EMV (DE 55)'),
              Tab(icon: Icon(Icons.terminal, size: 18), text: 'Terminal CLI Switch'),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            EmvDecoderView(),
            CliTerminalView(),
          ],
        ),
      ),
    );
  }
}
