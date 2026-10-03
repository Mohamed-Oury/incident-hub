import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_theme.dart';

class MonetiqueCheatItem {
  final int id;
  final String category;
  final String title;
  final String short;
  final String badge;
  final Color badgeColor;
  final String rawText;
  final List<String> keyPoints;

  const MonetiqueCheatItem({
    required this.id,
    required this.category,
    required this.title,
    required this.short,
    required this.badge,
    required this.badgeColor,
    required this.rawText,
    required this.keyPoints,
  });
}

class MonetiqueCheatSheetScreen extends StatefulWidget {
  const MonetiqueCheatSheetScreen({super.key});

  @override
  State<MonetiqueCheatSheetScreen> createState() => _MonetiqueCheatSheetScreenState();
}

class _MonetiqueCheatSheetScreenState extends State<MonetiqueCheatSheetScreen> {
  String _selectedCategory = "ALL";
  String _searchQuery = "";
  final TextEditingController _searchController = TextEditingController();

  static const List<Map<String, String>> categories = [
    {"id": "ALL", "label": "Toutes (18)"},
    {"id": "METHODE", "label": "🧩 Diagnostic RUN"},
    {"id": "ISO8583", "label": "📬 ISO 8583"},
    {"id": "FLUX", "label": "🔄 Flux & GAB"},
    {"id": "EMV", "label": "💳 EMV & DE55"},
    {"id": "CRYPTO", "label": "🔐 Clés & HSM"},
    {"id": "COMPENSATION", "label": "🏦 Compensation"},
  ];

  static final List<MonetiqueCheatItem> cheatItems = [
    const MonetiqueCheatItem(
      id: 1,
      category: "METHODE",
      title: "1. 🧭 Diagnostiquer un incident monétique",
      short: "Diagnostic",
      badge: "Fondation RUN",
      badgeColor: Color(0xFF3B82F6),
      rawText: "Méthode de diagnostic incident monétique : Symptôme → Périmètre (canal GAB TPE e-commerce, BIN, réseau) → Trame (MTI, STAN, RRN, DE39) → Logs (switch, HSM, journal GAB) → Cause racine → Action / escalade → Post-mortem.",
      keyPoints: [
        "Identifier le canal impacté (GAB, TPE, Web 3DS)",
        "Isoler si 1 seul terminal ou tout le parc / BIN",
        "Vérifier si le rejet provient de l'émetteur, du switch ou du HSM",
        "Tracer la trame ISO (MTI, STAN, RRN, DE39)"
      ],
    ),
    const MonetiqueCheatItem(
      id: 2,
      category: "METHODE",
      title: "2. ✅ Checklist de qualification d'incident",
      short: "Checklist",
      badge: "Checklist interactive",
      badgeColor: Color(0xFF10B981),
      rawText: "Checklist qualification incident : heure de début, canal, BIN émetteur, réseau GIM-UEMOA Visa Mastercard UPI, MTI et DE39 relevés, exemple STAN RRN, taux d'échec, logs switch, statut HSM, sessions réseau 0800 echo, impact client.",
      keyPoints: [
        "Heure précise de début + fréquence des réjections",
        "BIN émetteur & Réseau cible (Visa/MC/GIM)",
        "Exemples de STAN, RRN & DE39 collectés",
        "Statut de la session réseau ISO 0800 Echo Test"
      ],
    ),
    const MonetiqueCheatItem(
      id: 3,
      category: "ISO8583",
      title: "3. 📬 MTI : lire les 4 chiffres",
      short: "MTI",
      badge: "Message Type Indicator",
      badgeColor: Color(0xFF8B5CF6),
      rawText: "MTI 4 chiffres : 1er=Version (0=1987, 1=1993, 2=2003), 2e=Classe (1 Auth, 2 Financier, 4 Reversal, 8 Réseau), 3e=Fonction (0 Requête, 1 Réponse, 2 Advice), 4e=Origine (0 Acquéreur, 2 Émetteur). Paires 0100/0110, 0200/0210, 0400/0410, 0420/0430, 0800/0810.",
      keyPoints: [
        "0100 / 0110 : Demande / Réponse d'autorisation",
        "0200 / 0210 : Transaction financière en ligne",
        "0400 / 0420 : Annulation (Reversal) automatique",
        "0800 / 0810 : Gestion de réseau & Echo test"
      ],
    ),
    const MonetiqueCheatItem(
      id: 4,
      category: "ISO8583",
      title: "4. 🧮 Bitmap : de l'hexa aux champs présents",
      short: "Bitmap",
      badge: "Décodage manuel",
      badgeColor: Color(0xFF8B5CF6),
      rawText: "Bitmap primaire 64 bits = 16 caractères hexa. Chaque hexa = 4 bits (poids 8 4 2 1). Hexa n couvre les champs 4n-3 à 4n. Bit 1 à 1 = bitmap secondaire présent (champs 65 à 128). Exemple 723804010A808000 = DE 2 3 4 7 11 12 13 22 32 37 39 41 49.",
      keyPoints: [
        "Bitmap Primaire : 16 caractères HEX (Bits 1 à 64)",
        "Bit 1 à 1 => Extension Bitmap Secondaire (Bits 65 à 128)",
        "72 en HEX = 0111 0010 (Champs 2, 3, 4 présents)",
        "Permet la compression binaire ultra-rapide"
      ],
    ),
    const MonetiqueCheatItem(
      id: 5,
      category: "ISO8583",
      title: "5. 🗂️ Les champs (DE) à connaître par cœur",
      short: "Champs DE",
      badge: "Data Elements",
      badgeColor: Color(0xFF8B5CF6),
      rawText: "DE2 PAN, DE3 Code traitement (00 Achat, 01 Retrait, 20 Remboursement, 30 Solde), DE4 Montant (XOF sans décimale), DE7 Date/Heure GMT, DE11 STAN, DE12/13 Heure/Date locales, DE22 Mode de saisie, DE37 RRN, DE38 Code Auth, DE39 Code Réponse, DE41 TID, DE42 MID, DE49 Devise (952 XOF), DE52 PIN Block, DE55 EMV, DE90 Données originales.",
      keyPoints: [
        "DE2 : PAN / Numéro de Carte",
        "DE3 : Processing Code (010000 = Retrait GAB)",
        "DE11 (STAN) & DE37 (RRN) : Identifiants uniques",
        "DE39 : Code Réponse & Décision",
        "DE55 : Container Données Puce EMV (TLV)"
      ],
    ),
    const MonetiqueCheatItem(
      id: 6,
      category: "ISO8583",
      title: "6. 🏷️ Codes réponse DE39 : sens & réflexe RUN",
      short: "DE39",
      badge: "Top codes réponse",
      badgeColor: Color(0xFFEF4444),
      rawText: "DE39 : 00 Approuvée, 05 Ne pas honorer, 14 Carte invalide, 51 Provision insuffisante, 54 Carte expirée, 55 PIN incorrect, 61 Plafond dépassé, 75 Essais PIN dépassés, 91 Émetteur indisponible, 96 Dysfonctionnement système. Code isolé = client, code en masse = incident système.",
      keyPoints: [
        "00 : Transac Approuvée avec succès",
        "51 : Solde Insuffisant (Client)",
        "55 / 75 : PIN Faux / Blocage Sécurité",
        "91 / 96 : Indisponibilité Hôte / Switch (P0/P1)"
      ],
    ),
    const MonetiqueCheatItem(
      id: 7,
      category: "FLUX",
      title: "7. 🔗 Chaîne des acteurs & stand-in",
      short: "Acteurs",
      badge: "Architecture",
      badgeColor: Color(0xFFF59E0B),
      rawText: "Chaîne : Porteur → Accepteur (GAB/TPE) → Acquéreur → Switch/Réseau (GIM, Visa, MC) → Émetteur. Stand-in STIP : le réseau répond à la place de l'émetteur indisponible puis transmet un advice 0120/0220.",
      keyPoints: [
        "Flux Autorisation Temps Réel (SLA < 2 sec)",
        "Flux Compensation Fichiers J+1 (Clearing)",
        "Règlement Net Interbancaire (Settlement)",
        "STIP (Stand-In Processing) par le Network"
      ],
    ),
    const MonetiqueCheatItem(
      id: 8,
      category: "FLUX",
      title: "8. 🏧 Retrait GAB (NDC/DDC) & journal électronique",
      short: "GAB",
      badge: "Cinématique ATM",
      badgeColor: Color(0xFFF59E0B),
      rawText: "Retrait GAB : insertion carte, lecture puce, saisie PIN chiffré EPP, 0200 DE3=01, 0210 DE39=00, distribution billets, Solicited Status (22). Échec distribution ou time-out → reversal 0420. Journal électronique : CARD INSERTED, NOTES PRESENTED, NOTES TAKEN, NOTES RETRACTED.",
      keyPoints: [
        "Communication GAB ↔ Switch (Protocoles NDC+ / DDC)",
        "EPP (Encrypting PIN Pad) chiffre sous TPK",
        "Audit Journal Électronique (EJ) en cas de réclamation",
        "Statut NOTES RETRACTED = Reversal requis"
      ],
    ),
    const MonetiqueCheatItem(
      id: 9,
      category: "FLUX",
      title: "9. ⏱️ Reversals 0400/0420 & time-outs",
      short: "Reversals",
      badge: "Anti double débit",
      badgeColor: Color(0xFFF59E0B),
      rawText: "Reversal : 0400 demande d'annulation (réponse 0410), 0420 advice d'annulation store & forward acquitté par 0430. Déclencheurs : time-out, réponse tardive, échec distribution billets. DE90 contient les données originales.",
      keyPoints: [
        "0420 : Reversal Advice automatique",
        "DE90 : Référence MTI, STAN, Date de la trame initiale",
        "DE95 : Montant réel délivré si annulation partielle",
        "Prévenance des débits indus côté porteur"
      ],
    ),
    const MonetiqueCheatItem(
      id: 10,
      category: "EMV",
      title: "10. 🧬 DE55 & BER-TLV : lire les tags EMV",
      short: "DE55 TLV",
      badge: "Tag-Length-Value",
      badgeColor: Color(0xFF06B6D4),
      rawText: "BER-TLV : Tag, Length, Value. Tags majeurs : 4F AID, 57 Piste 2, 82 AIP, 95 TVR, 9B TSI, 9F02 Montant, 9F10 IAD, 9F26 Cryptogramme (ARQC/TC), 9F27 CID, 9F36 ATC, 9F37 Unpredictable Number.",
      keyPoints: [
        "Tag 9F26 : Cryptogramme Applicatif (ARQC / TC)",
        "Tag 95 (TVR) : Terminal Verification Results (5 bytes)",
        "Tag 9B (TSI) : Transaction Status Information (2 bytes)",
        "Tag 9F36 : Application Transaction Counter (ATC)"
      ],
    ),
    const MonetiqueCheatItem(
      id: 11,
      category: "EMV",
      title: "11. 🔬 TVR (Tag 95) & TSI (Tag 9B) octet par octet",
      short: "TVR / TSI",
      badge: "Analyse forensique",
      badgeColor: Color(0xFF06B6D4),
      rawText: "TVR 5 octets : Octet 1 Auth offline (SDA/DDA/CDA), Octet 2 Restrictions d'usage, Octet 3 Vérification porteur (CVM PIN), Octet 4 Gestion des risques terminal (Floor limit), Octet 5 Auth émetteur. TSI 9B : Contrôles réalisés.",
      keyPoints: [
        "Octet 1 Bit 8 : Offline Auth not performed",
        "Octet 3 Bit 7 : PIN Try Limit Exceeded",
        "Octet 3 Bit 3 : Online PIN Entered",
        "Octet 4 Bit 8 : Transaction Exceeds Floor Limit"
      ],
    ),
    const MonetiqueCheatItem(
      id: 12,
      category: "EMV",
      title: "12. 🛡️ Cryptogrammes ARQC / ARPC / TC / AAC",
      short: "ARQC / ARPC",
      badge: "Authentification online",
      badgeColor: Color(0xFF06B6D4),
      rawText: "GENERATE AC : AAC (refus), TC (offline ok), ARQC (demande online). CID 9F27 : 00 AAC, 40 TC, 80 ARQC. ARQC calculé avec clé de session dérivée de MK-AC. HSM émetteur valide l'ARQC et génère l'ARPC (Tag 91).",
      keyPoints: [
        "ARQC (80) : Demande d'autorisation en ligne",
        "ARPC (Tag 91) : Réponse de validation du HSM Émetteur",
        "TC (40) : Transaction approuvée hors-ligne",
        "AAC (00) : Transaction refusée par la carte"
      ],
    ),
    const MonetiqueCheatItem(
      id: 13,
      category: "CRYPTO",
      title: "13. 🗝️ Hiérarchie des clés & KCV",
      short: "Clés",
      badge: "Key management",
      badgeColor: Color(0xFFEC4899),
      rawText: "LMK clé maître HSM. ZMK clé de zone inter-institutions. ZPK clé PIN de zone. TPK clé PIN terminal. PVK vérification PIN. CVK calcul CVV. IMK MK-AC clé puce. KCV = chiffrement d'un bloc de 0x00 pour vérifier l'intégrité.",
      keyPoints: [
        "LMK (Local Master Key) : Ne quitte JAMAIS le HSM",
        "ZPK / TPK : Chiffrement des mots de passe PIN",
        "KCV (Key Check Value) : 6 car HEX de contrôle",
        "PIN Faux en masse = KCV ZPK/TPK désynchronisé"
      ],
    ),
    const MonetiqueCheatItem(
      id: 14,
      category: "CRYPTO",
      title: "14. 🔢 PIN Block ISO-0 (ISO 9564 format 0)",
      short: "PIN Block",
      badge: "Calcul pas à pas",
      badgeColor: Color(0xFFEC4899),
      rawText: "PIN Block ISO-0 = (0 + Long + PIN + F...) XOR (0000 + 12 derniers chiffres PAN sans Luhn). Exemple PIN 1234, PAN 4970101234567890 => 041234FFFFFFFFFF XOR 0000010123456789 = 041235FEDCBA9876.",
      keyPoints: [
        "Calcul XOR entre le Bloc PIN et le Bloc PAN",
        "Protection absolue contre la réutilisation du PIN",
        "Format ISO-0 : Référence internationale bancaire",
        "Chiffré sous TPK puis translaté sous ZPK au Switch"
      ],
    ),
    const MonetiqueCheatItem(
      id: 15,
      category: "CRYPTO",
      title: "15. 🖥️ Commandes HSM Thales payShield courantes",
      short: "HSM",
      badge: "Exploitation HSM",
      badgeColor: Color(0xFFEC4899),
      rawText: "Commandes payShield : NC (diag), A0 (génération clé), A6 (import), BU (KCV), CA (translation PIN TPK->ZPK), CC (ZPK->ZPK), DA/DC (vérification PIN terminal), KQ (vérification ARQC / génération ARPC).",
      keyPoints: [
        "NC / ND : Diagnostic & Liveness HSM",
        "CA / CB : Translation PIN Block TPK -> ZPK",
        "KQ / KR : Validation ARQC EMV & Génération ARPC",
        "Code Erreur 00 = Succès Cryptographique"
      ],
    ),
    const MonetiqueCheatItem(
      id: 16,
      category: "COMPENSATION",
      title: "16. 🏦 Compensation Base II / IPM & règlement",
      short: "Compensation",
      badge: "Clearing & Settlement",
      badgeColor: Color(0xFFA855F7),
      rawText: "Autorisation temps réel ≠ compensation (présentation fichiers J+1) ≠ règlement (fonds nets). Visa Base II : TC05 achat, TC15 chargeback. Mastercard IPM : 1240 présentation, 1442 chargeback.",
      keyPoints: [
        "Compensation = Échange de fichiers batch financiers",
        "Règlement Net = Mouvement de fonds interbancaire",
        "Visa Base II TC05 / Mastercard IPM 1240",
        "Rapprochement obligatoire STAN + RRN + Montant"
      ],
    ),
    const MonetiqueCheatItem(
      id: 17,
      category: "COMPENSATION",
      title: "17. ⚖️ Litiges & chargebacks",
      short: "Chargebacks",
      badge: "Cycle de litige",
      badgeColor: Color(0xFFA855F7),
      rawText: "Cycle litige : Transaction -> Présentation -> Réclamation porteur -> First Chargeback -> Second Presentment -> Pré-arbitrage -> Arbitrage Scheme. Délais : ~120j pour chargeback.",
      keyPoints: [
        "First Chargeback : Émission de l'impayé par l'émetteur",
        "Second Presentment : Preuve d'acceptation par l'acquéreur",
        "Preuves GAB : Extrait Journal Électronique (EJ)",
        "Codes Motif Visa 10.4 (Fraude) / MC 4837"
      ],
    ),
    const MonetiqueCheatItem(
      id: 18,
      category: "METHODE",
      title: "18. ⚡ LA MÉTHODE À RETENIR",
      short: "Décalogue",
      badge: "Le Décalogue Monétique",
      badgeColor: Color(0xFFEAB308),
      rawText: "1 Trame (MTI, DE39, STAN, RRN), 2 Identifier l'auteur du rejet, 3 Isolés=Porteur / Masse=Système, 4 Rapprochement STAN/RRN, 5 Time-out=Reversal, 6 PIN massifs=Clés/KCV, 7 Décodage DE55 TVR, 8 Sessions 0800, 9 Auth ≠ Clearing ≠ Settlement, 10 Documenter.",
      keyPoints: [
        "1. Relever MTI, STAN, RRN et DE39",
        "2. Différencier Rejet Émetteur vs Rejet Switch",
        "3. Rejet unitaire = Porteur / Rejets de masse = Incident P0",
        "4. Toujours valider les KCV lors d'un changement de clé"
      ],
    ),
  ];

  List<MonetiqueCheatItem> get _filteredItems {
    return cheatItems.where((item) {
      final matchesCategory = _selectedCategory == "ALL" || item.category == _selectedCategory;
      final query = _searchQuery.toLowerCase();
      final matchesSearch = _searchQuery.isEmpty ||
          item.title.toLowerCase().contains(query) ||
          item.rawText.toLowerCase().contains(query) ||
          item.badge.toLowerCase().contains(query);
      return matchesCategory && matchesSearch;
    }).toList();
  }

  void _showDetailModal(MonetiqueCheatItem item) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF1E293B),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        minChildSize: 0.4,
        maxChildSize: 0.95,
        expand: false,
        builder: (_, scrollController) => ListView(
          controller: scrollController,
          padding: const EdgeInsets.all(20),
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: item.badgeColor.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: item.badgeColor),
                  ),
                  child: Text(
                    item.badge,
                    style: TextStyle(color: item.badgeColor, fontWeight: FontWeight.bold, fontSize: 12),
                  ),
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.copy, color: Colors.cyanAccent, size: 20),
                  tooltip: 'Copier la fiche',
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: '${item.title}\n\n${item.rawText}'));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Fiche copiée dans le presse-papiers !'),
                        backgroundColor: AppTheme.successGreen,
                        duration: Duration(seconds: 2),
                      ),
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              item.title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.white12),
              ),
              child: Text(
                item.rawText,
                style: const TextStyle(color: Colors.white70, fontSize: 14, height: 1.5),
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'POINTS CLÉS & RÉFLEXES DE CONTRÔLE',
              style: TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 0.8),
            ),
            const SizedBox(height: 10),
            ...item.keyPoints.map(
              (kp) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.check_circle_outline, color: AppTheme.successGreen, size: 18),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        kp,
                        style: const TextStyle(color: Colors.white, fontSize: 13, height: 1.3),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredItems;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Antisèche Monétique Express'),
        backgroundColor: const Color(0xFF0F172A),
        actions: [
          IconButton(
            icon: const Icon(Icons.help_outline, color: Colors.white70),
            onPressed: () {
              showDialog(
                context: context,
                builder: (ctx) => AlertDialog(
                  backgroundColor: AppTheme.darkCard,
                  title: const Text('Antisèche Monétique', style: TextStyle(color: Colors.white)),
                  content: const Text(
                    'Retrouvez les 18 fiches de référence opérationnelle pour l\'astreinte et le diagnostic d\'incidents monétiques (ISO 8583, EMV, HSM, Compensation).',
                    style: TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(ctx),
                      child: const Text('Fermer', style: TextStyle(color: Colors.cyanAccent)),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Barres de recherche et filtres
          Container(
            padding: const EdgeInsets.all(12),
            color: const Color(0xFF1E293B),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    hintText: 'Rechercher (ex: ISO, DE39, ARQC, PIN, 0420)...',
                    prefixIcon: const Icon(Icons.search, color: Colors.white54),
                    suffixIcon: _searchQuery.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear, color: Colors.white54),
                            onPressed: () {
                              setState(() {
                                _searchController.clear();
                                _searchQuery = "";
                              });
                            },
                          )
                        : null,
                    filled: true,
                    fillColor: const Color(0xFF0F172A),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: Colors.white12),
                    ),
                  ),
                  onChanged: (val) {
                    setState(() {
                      _searchQuery = val;
                    });
                  },
                ),
                const SizedBox(height: 10),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: categories.map((cat) {
                      final isSelected = _selectedCategory == cat["id"];
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text(
                            cat["label"]!,
                            style: TextStyle(
                              color: isSelected ? Colors.white : Colors.white70,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                              fontSize: 12,
                            ),
                          ),
                          selected: isSelected,
                          selectedColor: AppTheme.sgRed,
                          backgroundColor: const Color(0xFF0F172A),
                          onSelected: (selected) {
                            if (selected) {
                              setState(() {
                                _selectedCategory = cat["id"]!;
                              });
                            }
                          },
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),

          // Liste des fiches
          Expanded(
            child: filtered.isEmpty
                ? const Center(
                    child: Text(
                      'Aucune fiche ne correspond à votre recherche.',
                      style: TextStyle(color: Colors.white54),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(12),
                    itemCount: filtered.length,
                    itemBuilder: (ctx, idx) {
                      final item = filtered[idx];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        decoration: BoxDecoration(
                          color: const Color(0xFF1E293B),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.white12),
                        ),
                        child: InkWell(
                          onTap: () => _showDetailModal(item),
                          borderRadius: BorderRadius.circular(12),
                          child: Padding(
                            padding: const EdgeInsets.all(14),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: item.badgeColor.withValues(alpha: 0.2),
                                        borderRadius: BorderRadius.circular(6),
                                        border: Border.all(color: item.badgeColor, width: 1),
                                      ),
                                      child: Text(
                                        item.badge,
                                        style: TextStyle(
                                          color: item.badgeColor,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 11,
                                        ),
                                      ),
                                    ),
                                    const Spacer(),
                                    const Icon(Icons.arrow_forward_ios, color: Colors.white38, size: 14),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  item.title,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 15,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  item.rawText,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(color: Colors.white70, fontSize: 12, height: 1.3),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
