class QuizQuestion {
  final String id;
  final String category;
  final String question;
  final List<String> options;
  final int correctIndex;
  final String explanation;
  final int xpReward;

  const QuizQuestion({
    required this.id,
    required this.category,
    required this.question,
    required this.options,
    required this.correctIndex,
    required this.explanation,
    this.xpReward = 30,
  });
}

class QuizQuestionsCatalog {
  static const List<QuizQuestion> allQuestions = [
    // Catégorie 1 : ISO 8583 & MTI
    QuizQuestion(
      id: 'Q-001',
      category: 'ISO 8583 & MTI',
      question: 'Quel est le MTI standard d\'une demande d\'autorisation financière initiée par un terminal ?',
      options: ['0100', '0200', '0420', '0800'],
      correctIndex: 1,
      explanation: 'Le MTI 0200 correspond à une requête financière (Financial Transaction Request) avec engagement de débit immédiat.',
    ),
    QuizQuestion(
      id: 'Q-002',
      category: 'ISO 8583 & MTI',
      question: 'À quoi sert le message ISO 8583 avec MTI 0420 ?',
      options: [
        'Demande de solde de compte',
        'Avis d\'extourne ou d\'annulation (Reversal Advice)',
        'Test d\'écho de liaison télécom',
        'Télécollecte de fin de journée'
      ],
      correctIndex: 1,
      explanation: 'Le MTI 0420 est un Reversal Advice permettant d\'annuler une transaction lorsque le cash n\'a pas été distribué ou en cas de timeout.',
    ),
    QuizQuestion(
      id: 'Q-003',
      category: 'ISO 8583 & MTI',
      question: 'Quel Data Element (DE) contient le numéro d\'audit unique de transaction STAN ?',
      options: ['DE 3', 'DE 4', 'DE 11', 'DE 37'],
      correctIndex: 2,
      explanation: 'Le DE 11 est le Systems Trace Audit Number (STAN), un identifiant séquentiel à 6 chiffres généré par l\'initiateur.',
    ),
    QuizQuestion(
      id: 'Q-004',
      category: 'ISO 8583 & MTI',
      question: 'Dans le bitmap ISO 8583, comment est signalée la présence des champs secondaires (DE 65 à 128) ?',
      options: [
        'Par le bit 64 activé',
        'Par le bit 1 du bitmap primaire mis à 1',
        'Par la présence du DE 39',
        'Par un MTI étendu à 5 chiffres'
      ],
      correctIndex: 1,
      explanation: 'Le premier bit du bitmap primaire (Bit 1) indique la présence du bitmap secondaire lorsqu\'il est égal à 1.',
    ),

    // Catégorie 2 : Codes de Réponse DE39
    QuizQuestion(
      id: 'Q-005',
      category: 'Codes DE39',
      question: 'Que signifie formellement le code de rejet DE39 = "51" ?',
      options: [
        'Carte expirée',
        'Fonds insuffisants / Dépassement de découvert autorisé',
        'Émetteur inaccessible / Timeout',
        'PIN erroné'
      ],
      correctIndex: 1,
      explanation: 'DE39=51 (Insufficient funds) est retourné par l\'émetteur lorsque le solde disponible ou le plafond est insuffisant.',
    ),
    QuizQuestion(
      id: 'Q-006',
      category: 'Codes DE39',
      question: 'Quel code DE39 est retourné en cas de timeout de réponse de l\'Émetteur ou coupure switch ?',
      options: ['00', '05', '55', '91'],
      correctIndex: 3,
      explanation: 'DE39=91 (Issuer or Switch inoperative) signale l\'expiration du délai d\'attente ou l\'indisponibilité du centre d\'autorisation émetteur.',
    ),
    QuizQuestion(
      id: 'Q-007',
      category: 'Codes DE39',
      question: 'Lorsqu\'un porteur saisit un code PIN erroné, quel code DE39 standard est renvoyé ?',
      options: ['51', '55', '68', '96'],
      correctIndex: 1,
      explanation: 'DE39=55 (Incorrect PIN) indique une non-concordance du PIN calculé sous HSM ou par la puce.',
    ),

    // Catégorie 3 : Cryptographie EMV & Sécurité HSM
    QuizQuestion(
      id: 'Q-008',
      category: 'Cryptographie EMV',
      question: 'Quel tag EMV TLV contient le cryptogramme de transaction ARQC généré par la puce ?',
      options: ['Tag 82', 'Tag 95', 'Tag 9F26', 'Tag 5F2A'],
      correctIndex: 2,
      explanation: 'Le Tag 9F26 contient l\'Application Cryptogram (ARQC - Authorization Request Cryptogram) sur 8 octets.',
    ),
    QuizQuestion(
      id: 'Q-009',
      category: 'Cryptographie EMV',
      question: 'Que contient le tag EMV 95 (Terminal Verification Results - TVR) ?',
      options: [
        'Le montant autorisé en devise locale',
        'Les indicateurs de contrôle de sécurité (hors-ligne, échec PIN, carte expirée)',
        'Le nom complet du porteur',
        'La clé de travail ZPK de l\'acquéreur'
      ],
      correctIndex: 1,
      explanation: 'Le TVR (Tag 95) est un masque de 5 octets où chaque bit documente une anomalie constatée durant la transaction.',
    ),
    QuizQuestion(
      id: 'Q-010',
      category: 'Sécurité HSM & Clés',
      question: 'Quelle clé cryptographique est utilisée pour chiffrer le PIN Block entre le terminal et le serveur d\'autorisation ?',
      options: ['LMK (Local Master Key)', 'TPK / ZPK (Terminal / Zone PIN Key)', 'CVK (Card Verification Key)', 'BDK DUKPT'],
      correctIndex: 1,
      explanation: 'La ZPK (Zone PIN Key) ou TPK (Terminal PIN Key) assure le chiffrement symétrique 3DES/AES des PIN blocks en transit.',
    ),
  ];

  static List<QuizQuestion> getQuestionsByCategory(String category) {
    if (category == 'TOUS') return allQuestions;
    return allQuestions.where((q) => q.category == category).toList();
  }
}
