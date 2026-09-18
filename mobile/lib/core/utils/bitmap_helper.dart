class DataElementInfo {
  final int number;
  final String name;
  final String format;
  final String description;

  const DataElementInfo({
    required this.number,
    required this.name,
    required this.format,
    required this.description,
  });
}

class BitmapResult {
  final String hex;
  final String binary;
  final bool hasSecondary;
  final List<int> activeElements;
  final List<DataElementInfo> activeDetails;

  BitmapResult({
    required this.hex,
    required this.binary,
    required this.hasSecondary,
    required this.activeElements,
    required this.activeDetails,
  });
}

class BitmapHelper {
  static final Map<int, DataElementInfo> isoDictionary = {
    1: const DataElementInfo(number: 1, name: 'Secondary Bitmap', format: 'b 64', description: 'Indique la présence du bitmap secondaire (champs 65 à 128).'),
    2: const DataElementInfo(number: 2, name: 'Primary Account Number (PAN)', format: 'n ..19 (LLVAR)', description: 'Numéro de carte bancaire (masqué ou tokenisé).'),
    3: const DataElementInfo(number: 3, name: 'Processing Code', format: 'n 6', description: 'Type de transaction (ex: 000000 = Achat, 010000 = Retrait, 300000 = Solde).'),
    4: const DataElementInfo(number: 4, name: 'Amount, Transaction', format: 'n 12', description: 'Montant de la transaction dans la devise du terminal.'),
    5: const DataElementInfo(number: 5, name: 'Amount, Settlement', format: 'n 12', description: 'Montant de compensation.'),
    6: const DataElementInfo(number: 6, name: 'Amount, Cardholder Billing', format: 'n 12', description: 'Montant facturé au porteur.'),
    7: const DataElementInfo(number: 7, name: 'Transmission Date & Time', format: 'n 10 (MMDDhhmmss)', description: 'Date et heure GMT de transmission.'),
    9: const DataElementInfo(number: 9, name: 'Conversion Rate, Settlement', format: 'n 8', description: 'Taux de conversion pour la compensation.'),
    11: const DataElementInfo(number: 11, name: 'Systems Trace Audit Number (STAN)', format: 'n 6', description: 'Numéro d\'audit unique généré par l\'initiateur de la transaction.'),
    12: const DataElementInfo(number: 12, name: 'Time, Local Transaction', format: 'n 6 (hhmmss)', description: 'Heure locale de la transaction sur le terminal.'),
    13: const DataElementInfo(number: 13, name: 'Date, Local Transaction', format: 'n 4 (MMDD)', description: 'Date locale de la transaction.'),
    14: const DataElementInfo(number: 14, name: 'Date, Expiration', format: 'n 4 (YYMM)', description: 'Date d\'expiration de la carte.'),
    18: const DataElementInfo(number: 18, name: 'Merchant Type / MCC', format: 'n 4', description: 'Merchant Category Code définissant le secteur d\'activité du commerçant.'),
    19: const DataElementInfo(number: 19, name: 'Acquiring Institution Country Code', format: 'n 3', description: 'Code pays ISO numérique de la banque acquéreur.'),
    22: const DataElementInfo(number: 22, name: 'Point of Service (POS) Entry Mode', format: 'n 3', description: 'Mode de saisie carte (Puce EMV, Contactless, Piste magnétique, Manuel).'),
    23: const DataElementInfo(number: 23, name: 'Card Sequence Number (PAN Seq)', format: 'n 3', description: 'Numéro de séquence de la carte (ex: 001).'),
    24: const DataElementInfo(number: 24, name: 'Function Code / NII', format: 'n 3', description: 'Network International Identifier ou code fonction.'),
    25: const DataElementInfo(number: 25, name: 'Point of Service Condition Code', format: 'n 2', description: 'Conditions de présence du porteur et de la carte.'),
    32: const DataElementInfo(number: 32, name: 'Acquiring Institution Identification Code', format: 'n ..11 (LLVAR)', description: 'Identifiant bancaire de l\'acquéreur.'),
    35: const DataElementInfo(number: 35, name: 'Track 2 Data', format: 'z ..37 (LLVAR)', description: 'Données de la piste 2 magnétique.'),
    37: const DataElementInfo(number: 37, name: 'Retrieval Reference Number (RRN)', format: 'an 12', description: 'Référence unique de réconciliation de la transaction.'),
    38: const DataElementInfo(number: 38, name: 'Authorization Identification Response', format: 'an 6', description: 'Numéro d\'autorisation accordé par l\'Issuer.'),
    39: const DataElementInfo(number: 39, name: 'Response Code', format: 'an 2', description: 'Code de réponse ISO 8583 (00=Approuvé, 51=Fonds insuffisants, 91=Timeout...).'),
    41: const DataElementInfo(number: 41, name: 'Card Acceptor Terminal ID (TID)', format: 'ans 8', description: 'Identifiant physique du terminal (TPE ou GAB).'),
    42: const DataElementInfo(number: 42, name: 'Card Acceptor Identification Code (MID)', format: 'ans 15', description: 'Numéro commerçant (Merchant ID).'),
    43: const DataElementInfo(number: 43, name: 'Card Acceptor Name/Location', format: 'ans 40', description: 'Raison sociale et ville d\'implantation du terminal.'),
    48: const DataElementInfo(number: 48, name: 'Additional Data - Private', format: 'ans ...999 (LLLVAR)', description: 'Champs privés réseau (3DSecure, CVV2 results, sous-champs bancaires).'),
    49: const DataElementInfo(number: 49, name: 'Currency Code, Transaction', format: 'an 3', description: 'Code devise ISO 4217 (ex: 978 = EUR, 840 = USD, 952 = XOF).'),
    52: const DataElementInfo(number: 52, name: 'Personal Identification Number (PIN) Data', format: 'b 64', description: 'PIN Block chiffré sous clé de travail (TPK/ZPK).'),
    53: const DataElementInfo(number: 53, name: 'Security Related Control Information', format: 'n 16', description: 'Paramètres de sécurité cryptographique.'),
    54: const DataElementInfo(number: 54, name: 'Additional Amounts', format: 'an ...120 (LLLVAR)', description: 'Soldes disponibles et comptables après transaction.'),
    55: const DataElementInfo(number: 55, name: 'Integrated Circuit Card (ICC) / EMV Data', format: 'b ...999 (LLLVAR)', description: 'Données EMV en format TLV (Cryptogramme ARQC, TVR, TSI, CVR...).'),
    60: const DataElementInfo(number: 60, name: 'Private Use / Terminal Data', format: 'ans ...999 (LLLVAR)', description: 'Données constructeur ou profil terminal.'),
    62: const DataElementInfo(number: 62, name: 'Private Use / Custom Field', format: 'ans ...999 (LLLVAR)', description: 'Données de routage ou transaction interne.'),
    90: const DataElementInfo(number: 90, name: 'Original Data Elements', format: 'n 42', description: 'Pointeur vers la transaction d\'origine lors d\'un Reversal (0400/0420).'),
    102: const DataElementInfo(number: 102, name: 'Account Identification 1', format: 'ans ..28 (LLVAR)', description: 'Numéro de compte débité (RIB/IBAN).'),
    103: const DataElementInfo(number: 103, name: 'Account Identification 2', format: 'ans ..28 (LLVAR)', description: 'Numéro de compte crédité.'),
  };

  /// Décode un hex bitmap (16 ou 32 caractères)
  static BitmapResult decodeHex(String rawHex) {
    final cleanHex = rawHex.replaceAll(RegExp(r'[^0-9A-Fa-f]'), '').toUpperCase();
    
    // Conversion en chaîne binaire
    final StringBuffer binaryBuffer = StringBuffer();
    for (int i = 0; i < cleanHex.length; i++) {
      final int value = int.parse(cleanHex[i], radix: 16);
      binaryBuffer.write(value.toRadixString(2).padLeft(4, '0'));
    }

    final String binary = binaryBuffer.toString();
    final List<int> activeElements = [];
    final List<DataElementInfo> activeDetails = [];

    for (int i = 0; i < binary.length; i++) {
      if (binary[i] == '1') {
        final int deNumber = i + 1;
        activeElements.add(deNumber);
        
        final info = isoDictionary[deNumber] ?? DataElementInfo(
          number: deNumber,
          name: 'Data Element $deNumber',
          format: 'Custom/Private',
          description: 'Champ ISO 8583 standard ou privé.',
        );
        activeDetails.add(info);
      }
    }

    final bool hasSecondary = activeElements.contains(1);

    return BitmapResult(
      hex: cleanHex,
      binary: binary,
      hasSecondary: hasSecondary,
      activeElements: activeElements,
      activeDetails: activeDetails,
    );
  }

  /// Encode une liste de champs actifs en bitmap Hex
  static String encodeElements(List<int> elements) {
    if (elements.isEmpty) return '0000000000000000';

    final bool needsSecondary = elements.any((e) => e > 64);
    final int maxBit = needsSecondary ? 128 : 64;
    
    final List<int> bits = List.filled(maxBit, 0);
    if (needsSecondary) {
      bits[0] = 1; // Bit 1 = secondary present
    }

    for (final el in elements) {
      if (el >= 1 && el <= maxBit) {
        bits[el - 1] = 1;
      }
    }

    final StringBuffer hexBuffer = StringBuffer();
    for (int i = 0; i < maxBit; i += 4) {
      final sub = bits.sublist(i, i + 4).join();
      final val = int.parse(sub, radix: 2);
      hexBuffer.write(val.toRadixString(16).toUpperCase());
    }

    return hexBuffer.toString();
  }
}
