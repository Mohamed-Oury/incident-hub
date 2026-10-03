import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class CbsCopilotScreen extends StatefulWidget {
  const CbsCopilotScreen({super.key});

  @override
  State<CbsCopilotScreen> createState() => _CbsCopilotScreenState();
}

class _CbsCopilotScreenState extends State<CbsCopilotScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descController = TextEditingController();
  final TextEditingController _domainController = TextEditingController(text: "Comptes & Virement");
  final TextEditingController _usersController = TextEditingController(text: "Chargé de clientèle agence");
  final TextEditingController _rulesController = TextEditingController();
  final TextEditingController _inputsController = TextEditingController();
  final TextEditingController _constraintsController = TextEditingController();

  // Champs optionnels pour fichiers 4GL et PER (camelCase)
  final TextEditingController _fourGlFileNameController = TextEditingController();
  final TextEditingController _fourGlContentController = TextEditingController();
  final TextEditingController _perFileNameController = TextEditingController();
  final TextEditingController _perContentController = TextEditingController();

  bool _show4GlUpload = false;
  bool _showPerUpload = false;

  final String _amplitudeVersion = "v11.x";
  final String _techEnv = "Informix / AIX";

  bool _isGenerating = false;
  Map<String, dynamic>? _generatedPlan;

  void _loadPreset(String title, String desc, String domain, String rules) {
    setState(() {
      _titleController.text = title;
      _descController.text = desc;
      _domainController.text = domain;
      _rulesController.text = rules;
    });
  }

  void _generatePlan() {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isGenerating = true;
    });

    // Construction de l'objet soumis au prompt
    final Map<String, dynamic> submittedPayload = {
      "title": _titleController.text.trim(),
      "functionalDescription": _descController.text.trim(),
      "bankingDomain": _domainController.text.trim(),
      "targetUsers": _usersController.text.trim(),
      "amplitudeVersion": _amplitudeVersion,
      "technicalEnvironment": _techEnv,
    };

    if (_rulesController.text.trim().isNotEmpty) {
      submittedPayload["knownBusinessRules"] = _rulesController.text.trim();
    }
    if (_inputsController.text.trim().isNotEmpty) {
      submittedPayload["inputData"] = _inputsController.text.trim();
    }
    if (_constraintsController.text.trim().isNotEmpty) {
      submittedPayload["specialConstraints"] = _constraintsController.text.trim();
    }

    // Ajout optionnel des fichiers 4GL et PER uniquement s'ils sont renseignés
    if (_fourGlContentController.text.trim().isNotEmpty) {
      submittedPayload["existing4GlFileName"] = _fourGlFileNameController.text.trim().isNotEmpty
          ? _fourGlFileNameController.text.trim()
          : "programme.4gl";
      submittedPayload["existing4GlContent"] = _fourGlContentController.text.trim();
    }

    if (_perContentController.text.trim().isNotEmpty) {
      submittedPayload["existingPerFileName"] = _perFileNameController.text.trim().isNotEmpty
          ? _perFileNameController.text.trim()
          : "ecran.per";
      submittedPayload["existingPerContent"] = _perContentController.text.trim();
    }

    Future.delayed(const Duration(milliseconds: 900), () {
      if (!mounted) return;

      final title = submittedPayload["title"];
      final has4gl = submittedPayload.containsKey("existing4GlContent");
      final hasPer = submittedPayload.containsKey("existingPerContent");

      setState(() {
        _isGenerating = false;
        _generatedPlan = {
          "payload": submittedPayload,
          "architecture": "Architecture Amplitude v11.x • Batch & Transactionnel 4GL / Informix SQL",
          "summary": "Plan technique généré pour : $title.\n"
              "${has4gl ? '• Fichier 4GL source inclus pour réécriture/patching.\n' : ''}"
              "${hasPer ? '• Fichier Formular .PER inclus pour ajustement IHM.\n' : ''}",
          "code4Gl": _generateSample4Gl(title, has4gl, hasPer),
          "codePer": hasPer ? _perContentController.text : _generateSamplePer(title),
          "sqlScript": "-- Table & Index Audit\n"
              "SELECT sol, sind FROM bkcpt WHERE ncp = p_ncp;\n"
              "INSERT INTO bktra (age, dco, ncp, mnt) VALUES (p_age, TODAY, p_ncp, p_mnt);",
        };
      });
    });
  }

  String _generateSample4Gl(String title, bool has4gl, bool hasPer) {
    if (has4gl && _fourGlContentController.text.trim().isNotEmpty) {
      return "DATABASE amplitude\n\n"
          "// [CO-PILOT 4GL MODIFICATION DU SOURCE EXISANT]\n"
          "// Module : ${_fourGlFileNameController.text.isEmpty ? 'programme.4gl' : _fourGlFileNameController.text}\n\n"
          "${_fourGlContentController.text.trim()}\n\n"
          "// === AJOUTS AUTOMATIQUES DU COPILOT ===\n"
          "FUNCTION copilot_validation_regle()\n"
          "    DEFINE l_statut CHAR(1)\n"
          "    LET l_statut = 'O'\n"
          "    RETURN l_statut\n"
          "END FUNCTION\n";
    }

    return "DATABASE amplitude\n\n"
        "GLOBALS\n"
        "    DEFINE g_user CHAR(10),\n"
        "           g_dco  DATE\n"
        "END GLOBALS\n\n"
        "MAIN\n"
        "    DEFINE l_statut INTEGER\n"
        "    CALL init_contexte()\n"
        "    CALL executer_$title()\n"
        "    EXIT PROGRAM (0)\n"
        "END MAIN\n\n"
        "FUNCTION executer_$title()\n"
        "    DEFINE l_compte RECORD LIKE bkcpt.*\n"
        "    BEGIN WORK\n"
        "        SELECT * INTO l_compte.* FROM bkcpt WHERE ncp = '00123456789'\n"
        "        IF STATUS = 0 THEN\n"
        "            DISPLAY \"COMPTE CLIENT TROUVE : \", l_compte.nom\n"
        "            COMMIT WORK\n"
        "        ELSE\n"
        "            ROLLBACK WORK\n"
        "        END IF\n"
        "END FUNCTION\n";
  }

  String _generateSamplePer(String title) {
    return "DATABASE amplitude\n"
        "SCREEN\n"
        "{\n"
        "----------------------------------------------------------\n"
        "           AMPLITUDE - ECOSYSTEME 4GL IHM                 \n"
        "----------------------------------------------------------\n"
        " Code Agence : [f000 ]   N° Compte : [f001       ]\n"
        " Client     : [f002                          ]\n"
        " Solde Dispo: [f003              ] XOF\n"
        "----------------------------------------------------------\n"
        "}\n"
        "TABLES\n"
        "bkcpt\n"
        "ATTRIBUTES\n"
        "f000 = bkcpt.age;\n"
        "f001 = bkcpt.ncp;\n"
        "f002 = bkcpt.nom;\n"
        "f003 = bkcpt.sol;\n"
        "END\n";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Copilot Développement 4GL'),
        backgroundColor: const Color(0xFF0F172A),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Banner
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
                  ),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.blueAccent.withValues(alpha: 0.4)),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.blueAccent.withValues(alpha: 0.2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.psychology, color: Colors.blueAccent, size: 28),
                    ),
                    const SizedBox(width: 14),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Générateur de Code & Spécifications 4GL',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          SizedBox(height: 2),
                          Text(
                            'Informix 4GL, Formulaires .PER, SQL Oracle/Informix & Scripts AIX',
                            style: TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),
              const Text(
                'PRESETS BANCAIRES RAPIDES',
                style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    ActionChip(
                      avatar: const Text('💳'),
                      label: const Text('Consultation Solde BKCPT'),
                      onPressed: () => _loadPreset(
                        "Consultation Solde & Tiers",
                        "Programme de consultation du solde dispo et nom du titulaire sur BKCPT avec contrôle des droits agence.",
                        "Comptes",
                        "Vérifier statut du compte (ETA != 'D' et ETA != 'F').",
                      ),
                    ),
                    const SizedBox(width: 8),
                    ActionChip(
                      avatar: const Text('💸'),
                      label: const Text('Virement Inter-Comptes'),
                      onPressed: () => _loadPreset(
                        "Virement Inter-Comptes avec Contrôle Provision",
                        "Passation d'un virement de compte à compte avec réservation solde et écriture BKTRA.",
                        "Virements",
                        "Transaction unique BEGIN WORK / COMMIT WORK avec ROLLBACK en cas d'erreur.",
                      ),
                    ),
                    const SizedBox(width: 8),
                    ActionChip(
                      avatar: const Text('🏧'),
                      label: const Text('Réservation Monétique SIND'),
                      onPressed: () => _loadPreset(
                        "Blocage Provision Monétique GAB",
                        "Mise à jour du champ BKCPT.SIND lors d'une autorisation ISO 8583 0100/0200.",
                        "Monétique",
                        "Latence < 150ms.",
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),
              const Text(
                'EXIGENCES DU BESOIN TECHNIQUE',
                style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),

              TextFormField(
                controller: _titleController,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Titre du développement *',
                  hintText: 'Ex: Module d\'extrait de compte client BKCPT',
                ),
                validator: (val) => val == null || val.isEmpty ? 'Titre requis' : null,
              ),
              const SizedBox(height: 12),

              TextFormField(
                controller: _descController,
                maxLines: 3,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Description fonctionnelle *',
                  hintText: 'Détaillez le traitement bancaire attendu...',
                ),
                validator: (val) => val == null || val.isEmpty ? 'Description requise' : null,
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _domainController,
                      style: const TextStyle(color: Colors.white),
                      decoration: const InputDecoration(labelText: 'Domaine'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextFormField(
                      controller: _usersController,
                      style: const TextStyle(color: Colors.white),
                      decoration: const InputDecoration(labelText: 'Cible Utilisateurs'),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // BOUTONS ET SECTIONS POUR UPLOAD / SAISIE DES FICHIERS 4GL ET PER
              const Text(
                'ATTACHEMENT CODE SOURCE & ECRAN (OPTIONNEL)',
                style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),

              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      icon: Icon(_show4GlUpload ? Icons.remove_circle_outline : Icons.add_circle_outline, size: 18),
                      label: Text(_show4GlUpload ? 'Masquer Fichier .4GL' : 'Joindre Fichier .4GL'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.cyanAccent,
                        side: const BorderSide(color: Colors.cyanAccent),
                      ),
                      onPressed: () {
                        setState(() {
                          _show4GlUpload = !_show4GlUpload;
                        });
                      },
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton.icon(
                      icon: Icon(_showPerUpload ? Icons.remove_circle_outline : Icons.add_circle_outline, size: 18),
                      label: Text(_showPerUpload ? 'Masquer Fichier .PER' : 'Joindre Fichier .PER'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.amberAccent,
                        side: const BorderSide(color: Colors.amberAccent),
                      ),
                      onPressed: () {
                        setState(() {
                          _showPerUpload = !_showPerUpload;
                        });
                      },
                    ),
                  ),
                ],
              ),

              if (_show4GlUpload) ...[
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Colors.cyanAccent.withValues(alpha: 0.5)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        '📄 Source 4GL existant à modifier (.4gl)',
                        style: TextStyle(color: Colors.cyanAccent, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _fourGlFileNameController,
                        style: const TextStyle(color: Colors.white),
                        decoration: const InputDecoration(
                          labelText: 'Nom du fichier (ex: bk_consultation.4gl)',
                          isDense: true,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _fourGlContentController,
                        maxLines: 5,
                        style: const TextStyle(color: Colors.cyanAccent, fontFamily: 'monospace', fontSize: 12),
                        decoration: const InputDecoration(
                          hintText: 'Collez le code source 4GL à modifier...',
                          isDense: true,
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              if (_showPerUpload) ...[
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Colors.amberAccent.withValues(alpha: 0.5)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        '🖥️ Masque Formulaire IHM existant (.per)',
                        style: TextStyle(color: Colors.amberAccent, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _perFileNameController,
                        style: const TextStyle(color: Colors.white),
                        decoration: const InputDecoration(
                          labelText: 'Nom du fichier (ex: bk_consultation.per)',
                          isDense: true,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _perContentController,
                        maxLines: 5,
                        style: const TextStyle(color: Colors.amberAccent, fontFamily: 'monospace', fontSize: 12),
                        decoration: const InputDecoration(
                          hintText: 'Collez le masque d\'écran Informix .per...',
                          isDense: true,
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  icon: _isGenerating
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                        )
                      : const Icon(Icons.rocket_launch),
                  label: Text(_isGenerating ? 'Génération du plan 4GL en cours...' : 'GÉNÉRER LES SPÉCIFICATIONS & CODE 4GL'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.sgRed,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    textStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                  ),
                  onPressed: _isGenerating ? null : _generatePlan,
                ),
              ),

              if (_generatedPlan != null) ...[
                const SizedBox(height: 24),
                const Divider(color: Colors.white24),
                const SizedBox(height: 12),
                Row(
                  children: const [
                    Icon(Icons.check_circle, color: AppTheme.successGreen),
                    SizedBox(width: 8),
                    Text(
                      'PLAN & CODE 4GL GÉNÉRÉS',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Output Tabs/Cards
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.successGreen.withValues(alpha: 0.5)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _generatedPlan!["architecture"],
                        style: const TextStyle(color: Colors.cyanAccent, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        _generatedPlan!["summary"],
                        style: const TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 14),
                const Text(
                  'SOURCE CODE 4GL GÉNÉRÉ :',
                  style: TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 6),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.white12),
                  ),
                  child: SelectableText(
                    _generatedPlan!["code4Gl"],
                    style: const TextStyle(color: Colors.greenAccent, fontFamily: 'monospace', fontSize: 12),
                  ),
                ),

                if (_generatedPlan!["codePer"] != null) ...[
                  const SizedBox(height: 14),
                  const Text(
                    'FORMULAIRE IHM (.PER) :',
                    style: TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.white12),
                    ),
                    child: SelectableText(
                      _generatedPlan!["codePer"],
                      style: const TextStyle(color: Colors.amberAccent, fontFamily: 'monospace', fontSize: 12),
                    ),
                  ),
                ],
              ],
            ],
          ),
        ),
      ),
    );
  }
}
