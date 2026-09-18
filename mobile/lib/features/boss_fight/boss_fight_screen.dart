import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import 'boss_battle_view.dart';

class BossFightScreen extends StatefulWidget {
  const BossFightScreen({super.key});

  @override
  State<BossFightScreen> createState() => _BossFightScreenState();
}

class _BossFightScreenState extends State<BossFightScreen> {
  final List<BossScenario> _scenarios = const [
    BossScenario(
      id: 'boss_1_timeout',
      title: 'Boss 1 - Panique sur l\'Issuer (Code 91)',
      threatLevel: 'CRITIQUE P1',
      initialTps: '185 TPS',
      description:
          'Plus de 45% des flux vers la banque émettrice partenaire s\'effondrent avec des timeouts socket et DE39=91. Les files d\'attente du Switch saturent à vue d\'œil.',
      incomingLogs: [
        '14:02:01 [SWITCH-IN] ISO 0100 PAN=4970********1201 AMT=50000 XAF',
        '14:02:04 [SWITCH-OUT] Socket timeout on link ISSUER_PARTNER:5000 (3000ms exceeded)',
        '14:02:05 [SWITCH-CORE] WARNING: Outgoing buffer queue at 87% capacity',
        '14:02:07 [SWITCH-OUT] DE39=91 (Issuer switch inoperative) returned to Acquirer',
        '14:02:10 [ALERT-CRITICAL] P1 SLA Breach: Failure rate > 40% over 60s',
      ],
      fixOptions: [
        'Augmenter le timeout socket à 15000ms pour attendre que l\'émetteur réponde',
        'Basculer dynamiquement le routage vers le lien secondaire et activer le Stand-In (STIP)',
        'Redémarrer le serveur frontal du switch pour vider la file d\'attente',
        'Rejeter tous les flux entrants avec le code DE39=05 pour soulager la base',
      ],
      correctFixIndex: 1,
      technicalRationale:
          'L\'augmentation du timeout aggraverait l\'engorgement. Le redémarrage créerait une panne totale. La solution normée est d\'orienter le trafic vers le canal redondant et d\'engager le STIP (Stand-In Processing) selon les limites de délégation convenues.',
      maxDuration: 45,
      baseXp: 150,
    ),
    BossScenario(
      id: 'boss_2_hsm',
      title: 'Boss 2 - Corruption Clés HSM & Échec ARQC (Code 63)',
      threatLevel: 'BLOCAGE SÉCURITÉ P0',
      initialTps: '90 TPS',
      description:
          'Toutes les transactions EMV avec validation en ligne échouent avec DE39=63 (Security Violation). L\'ARQC calculé ne correspond pas à celui de la carte.',
      incomingLogs: [
        '14:15:20 [EMV-VAL] ISO 0100 Card Cryptogram ARQC=A94BC128FE01... DE55 Tag 9F26 parsed',
        '14:15:21 [HSM-REQ] Command CC (Verify ARQC) sent to Thales payShield 10K',
        '14:15:21 [HSM-RESP] Return Code 15: MAC or Cryptogram Verification Failure',
        '14:15:22 [SWITCH-CORE] DE39=63 Sec Violation triggered for PAN 5399********8841',
        '14:15:24 [ALERT-HSM] LMK index mismatch detected on crypto worker thread #3',
      ],
      fixOptions: [
        'Désactiver la vérification ARQC et forcer toutes les transactions en Offline',
        'Réindexer le Key Table du HSM sur le bon jeu de clés LMK et forcer la synchro ZMK/MK_AC',
        'Changer la version du protocole ISO 8583 vers la version 1993',
        'Envoyer un DE39=00 par défaut sans passer par le module HSM',
      ],
      correctFixIndex: 1,
      technicalRationale:
          'Le rejet ARQC systématique après maintenance ou rotation découle d\'un décalage de slot LMK/ZMK. Réindexer la table de clés et resynchroniser les clés dérivées rétablit immédiatement la validité cryptographique sans violer les normes PCI-DSS.',
      maxDuration: 40,
      baseXp: 180,
    ),
    BossScenario(
      id: 'boss_3_reversals',
      title: 'Boss 3 - Avalanche d\'Annulations 0420 (Reversal Storm)',
      threatLevel: 'CRISE OPÉRATIONNELLE P1',
      initialTps: '320 TPS',
      description:
          'Une déconnexion intempestive d\'un parc de 300 GAB génère une vague massive de 0420 Reversals. Les verrous de base de données bloquent les autorisations 0100 légitimes.',
      incomingLogs: [
        '14:30:00 [SWITCH-IN] Burst of 420 ISO 0420 messages received from ATM_CLUSTER_B',
        '14:30:01 [DB-LOCK] Row lock contention on table ACC_BALANCES for STAN matching',
        '14:30:03 [PERF] DB query response time spiked from 4ms to 1250ms',
        '14:30:04 [CORE-SWITCH] Worker thread pool exhausted (500/500 active threads)',
        '14:30:06 [ALERT-P1] Critical latency spike: 0100 Auth requests dropped due to backpressure',
      ],
      fixOptions: [
        'Bloquer les adresses IP des 300 GAB via le firewall',
        'Prioriser les files 0100/0200 en temps réel et bufferiser les 0420 en traitement asynchrone sécurisé avec Store & Forward (SAF)',
        'Supprimer la vérification des soldes pour accélérer le traitement',
        'Couper la passerelle GAB pendant 30 minutes',
      ],
      correctFixIndex: 1,
      technicalRationale:
          'En monétique de flux élevé, le Store & Forward (SAF) découple le traitement des annulations 0420 (qui sont idempotentes et rejouables) pour réserver la bande passante et les connexions DB aux autorisations en direct 0100.',
      maxDuration: 45,
      baseXp: 200,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('PayQuest : Boss Fight'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF111827), Color(0xFF2C1016)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.sgRed.withValues(alpha: 0.6)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.sgRed.withValues(alpha: 0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.flash_on, color: AppTheme.sgRed, size: 30),
                  ),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Simulations de Crise Sous Stress',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Sauvez la plateforme monétique face à des incidents P0/P1 réels avant expiration du chrono.',
                          style: TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),
            const Text(
              'Incidents Majeurs Disponibles :',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 12),

            ..._scenarios.map((scenario) {
              return Container(
                margin: const EdgeInsets.only(bottom: 14),
                decoration: BoxDecoration(
                  color: AppTheme.darkCard,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.borderDark),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppTheme.sgRed.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              scenario.threatLevel,
                              style: const TextStyle(color: AppTheme.sgRed, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                          Row(
                            children: [
                              const Icon(Icons.timer_outlined, size: 14, color: Colors.white70),
                              const SizedBox(width: 4),
                              Text('${scenario.maxDuration}s', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                              const SizedBox(width: 10),
                              const Icon(Icons.stars, size: 14, color: Colors.amber),
                              const SizedBox(width: 4),
                              Text('+${scenario.baseXp} XP', style: const TextStyle(color: Colors.amber, fontSize: 12, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        scenario.title,
                        style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        scenario.description,
                        style: const TextStyle(color: Colors.white70, fontSize: 12, height: 1.3),
                      ),
                      const SizedBox(height: 14),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.sgRed,
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          icon: const Icon(Icons.play_arrow, color: Colors.white, size: 18),
                          label: const Text(
                            'ENGAGER LA CRISE',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                          ),
                          onPressed: () async {
                            final result = await Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => BossBattleView(scenario: scenario),
                              ),
                            );
                            if (result == true) {
                              setState(() {});
                            }
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
