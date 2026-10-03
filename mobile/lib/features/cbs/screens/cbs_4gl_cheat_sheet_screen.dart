import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class Cbs4GlCheatCard {
  final String keyword;
  final String category;
  final String importance;
  final String summary;
  final String syntax;
  final String concreteExample;
  final String bankingContext;
  final String commonError;

  const Cbs4GlCheatCard({
    required this.keyword,
    required this.category,
    required this.importance,
    required this.summary,
    required this.syntax,
    required this.concreteExample,
    required this.bankingContext,
    required this.commonError,
  });
}

class Cbs4GlCheatSheetScreen extends StatefulWidget {
  const Cbs4GlCheatSheetScreen({super.key});

  @override
  State<Cbs4GlCheatSheetScreen> createState() => _Cbs4GlCheatSheetScreenState();
}

class _Cbs4GlCheatSheetScreenState extends State<Cbs4GlCheatSheetScreen> {
  String _searchQuery = "";
  final TextEditingController _searchController = TextEditingController();

  static const List<Cbs4GlCheatCard> cheatCards = [
    Cbs4GlCheatCard(
      keyword: "DATABASE",
      category: "VARIABLES",
      importance: "FONDAMENTAL",
      summary: "Spécifie le catalogue ou la base relationnelle cible (ex: amplitude). Doit figurer en première ligne du fichier .4gl.",
      syntax: "DATABASE amplitude",
      concreteExample: "DATABASE amplitude",
      bankingContext: "Établit le contexte pour la vérification du schéma de tables bancaires.",
      commonError: "Tenter d'appeler DATABASE dans une FUNCTION (interdit).",
    ),
    Cbs4GlCheatCard(
      keyword: "GLOBALS",
      category: "VARIABLES",
      importance: "FONDAMENTAL",
      summary: "Déclare des variables partagées entre tous les modules 4GL d'un même exécutable.",
      syntax: "GLOBALS ... END GLOBALS",
      concreteExample: "GLOBALS\n    DEFINE g_user CHAR(10),\n           g_dco DATE\nEND GLOBALS",
      bankingContext: "Partage le code utilisateur et la date comptable du jour (DCO).",
      commonError: "Modifier une globale sans verrouillage logique.",
    ),
    Cbs4GlCheatCard(
      keyword: "MAIN",
      category: "FLUX",
      importance: "FONDAMENTAL",
      summary: "Point d'entrée principal du programme. Un seul bloc MAIN par binaire.",
      syntax: "MAIN ... END MAIN",
      concreteExample: "MAIN\n    CALL init_contexte()\n    CALL executer()\n    EXIT PROGRAM (0)\nEND MAIN",
      bankingContext: "Ordonne le lancement séquentiel des étapes de traitement batch.",
      commonError: "Mettre du code exécutable hors de MAIN ou FUNCTION.",
    ),
    Cbs4GlCheatCard(
      keyword: "FUNCTION",
      category: "FLUX",
      importance: "FONDAMENTAL",
      summary: "Sous-programme modulaire acceptant des arguments et retournant des valeurs.",
      syntax: "FUNCTION nom(p1, p2) ... RETURN r1, r2 ... END FUNCTION",
      concreteExample: "FUNCTION calculer_tva(p_ht)\n    DEFINE p_ht, l_tva DECIMAL(19,4)\n    LET l_tva = p_ht * 0.18\n    RETURN l_tva\nEND FUNCTION",
      bankingContext: "Modularise les calculs financiers (agios, commissions, taxes).",
      commonError: "Oublier de déclarer le type des paramètres.",
    ),
    Cbs4GlCheatCard(
      keyword: "RECORD LIKE",
      category: "VARIABLES",
      importance: "CRITIQUE",
      summary: "Dimensionne une structure mémoire calquée sur toutes les colonnes d'une table SQL.",
      syntax: "DEFINE nom_record RECORD LIKE nom_table.*",
      concreteExample: "DEFINE l_compte RECORD LIKE bkcpt.*",
      bankingContext: "Synchronise automatiquement les structures C avec les tables (BKCPT, BKCOM, BKTRA).",
      commonError: "Oublier de recompiler après un ALTER TABLE en base.",
    ),
    Cbs4GlCheatCard(
      keyword: "DECIMAL(p,s)",
      category: "VARIABLES",
      importance: "CRITIQUE",
      summary: "Type numérique exact à virgule fixe. p=total chiffres, s=décimales.",
      syntax: "DEFINE solde DECIMAL(19,4)",
      concreteExample: "DEFINE l_montant DECIMAL(19,4)\nLET l_montant = 125000000.7500",
      bankingContext: "Standard obligatoire pour les soldes et montants : 0 centime d'écart.",
      commonError: "Utiliser FLOAT ou SMALLFLOAT pour des montants bancaires.",
    ),
    Cbs4GlCheatCard(
      keyword: "SELECT INTO",
      category: "SQL",
      importance: "FONDAMENTAL",
      summary: "Lecture SQL d'une ligne unique dans des variables 4GL.",
      syntax: "SELECT col INTO var FROM table WHERE ...",
      concreteExample: "SELECT sol INTO l_solde FROM bkcpt WHERE ncp = l_ncp",
      bankingContext: "Interrogation du solde comptable client.",
      commonError: "Erreur -284 si la requête renvoie plus d'une ligne.",
    ),
    Cbs4GlCheatCard(
      keyword: "BEGIN WORK / COMMIT WORK",
      category: "TRANSACTION",
      importance: "CRITIQUE",
      summary: "Encadre une transaction bancaire atomique. Annulation globale via ROLLBACK WORK.",
      syntax: "BEGIN WORK ... COMMIT WORK / ROLLBACK WORK",
      concreteExample: "BEGIN WORK\n    UPDATE bkcpt SET sol = sol - l_mnt WHERE ncp = l_ncp_deb\n    UPDATE bkcpt SET sol = sol + l_mnt WHERE ncp = l_ncp_cre\nCOMMIT WORK",
      bankingContext: "Empêche tout déséquilibre comptable ou écriture incomplète lors d'un crash.",
      commonError: "Oublier de fermer une transaction ou garder des verrous trop longtemps.",
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = cheatCards.where((item) {
      final q = _searchQuery.toLowerCase();
      return _searchQuery.isEmpty ||
          item.keyword.toLowerCase().contains(q) ||
          item.summary.toLowerCase().contains(q) ||
          item.bankingContext.toLowerCase().contains(q);
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Antisèche Moteur 4GL & Amplitude'),
        backgroundColor: const Color(0xFF0F172A),
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            color: const Color(0xFF1E293B),
            child: TextField(
              controller: _searchController,
              style: const TextStyle(color: Colors.white, fontSize: 14),
              decoration: InputDecoration(
                hintText: 'Rechercher un mot-clé (ex: RECORD LIKE, DECIMAL, SELECT)...',
                prefixIcon: const Icon(Icons.search, color: Colors.white54),
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
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: filtered.length,
              itemBuilder: (ctx, idx) {
                final item = filtered[idx];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.blueAccent.withValues(alpha: 0.3)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            item.keyword,
                            style: const TextStyle(
                              color: Colors.cyanAccent,
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              fontFamily: 'monospace',
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: item.importance == "CRITIQUE"
                                  ? AppTheme.sgRed.withValues(alpha: 0.2)
                                  : Colors.blueAccent.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              item.importance,
                              style: TextStyle(
                                color: item.importance == "CRITIQUE" ? AppTheme.sgRed : Colors.blueAccent,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        item.summary,
                        style: const TextStyle(color: Colors.white70, fontSize: 13),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0F172A),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: SelectableText(
                          item.concreteExample,
                          style: const TextStyle(color: Colors.greenAccent, fontFamily: 'monospace', fontSize: 12),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '💡 Contexte : ${item.bankingContext}',
                        style: const TextStyle(color: Colors.amberAccent, fontSize: 11),
                      ),
                    ],
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
