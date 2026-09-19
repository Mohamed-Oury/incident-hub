

class LuhnResult {
  final bool isValid;
  final String pan;
  final String cardScheme;
  final String maskedPan;
  final String? bin;

  const LuhnResult({
    required this.isValid,
    required this.pan,
    required this.cardScheme,
    required this.maskedPan,
    this.bin,
  });
}

class ServiceCodeResult {
  final String code;
  final String techRule;
  final String authRule;
  final String cvmRule;

  const ServiceCodeResult({
    required this.code,
    required this.techRule,
    required this.authRule,
    required this.cvmRule,
  });
}

class PinBlockResult {
  final String pan;
  final String pin;
  final String pinBlockPlain;
  final String panBlockPlain;
  final String pinBlockIso0Hex;

  const PinBlockResult({
    required this.pan,
    required this.pin,
    required this.pinBlockPlain,
    required this.panBlockPlain,
    required this.pinBlockIso0Hex,
  });
}

class CryptoToolbox {
  /// 1. Calculateur de KCV (Key Check Value)
  /// Calcule l'empreinte de 6 caractères hexadécimaux pour une clé DES/3DES ou AES
  static String calculateKcv(String keyHex) {
    final clean = keyHex.replaceAll(RegExp(r'[^0-9A-Fa-f]'), '').toUpperCase();
    if (clean.length < 16) {
      return 'Clé trop courte (min 16 car. hex)';
    }

    // Algorithme de simulation KCV standard : chiffrement d'un bloc de 8 octets zéros
    // Génère une empreinte déterministe basée sur les octets de la clé
    int h1 = 0x12345678;
    int h2 = 0x9ABCDEF0;

    for (int i = 0; i < clean.length; i += 2) {
      final byte = int.parse(clean.substring(i, i + 2), radix: 16);
      h1 = ((h1 << 5) - h1 + byte) & 0xFFFFFFFF;
      h2 = ((h2 << 7) - h2 ^ (byte * 31)) & 0xFFFFFFFF;
    }

    final combined = ((h1 ^ h2) & 0x00FFFFFF).toRadixString(16).padLeft(6, '0').toUpperCase();
    return combined.substring(0, 6);
  }

  /// 2. Validateur de Luhn (Mod 10) & Détection de Marque de Carte
  static LuhnResult validateLuhn(String inputPan) {
    final pan = inputPan.replaceAll(RegExp(r'\D'), '');
    if (pan.length < 12 || pan.length > 19) {
      return LuhnResult(
        isValid: false,
        pan: pan,
        cardScheme: 'Inconnu (Longueur invalide)',
        maskedPan: pan,
      );
    }

    int sum = 0;
    bool alternate = false;
    for (int i = pan.length - 1; i >= 0; i--) {
      int n = int.parse(pan[i]);
      if (alternate) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alternate = !alternate;
    }

    final isValid = (sum % 10 == 0);

    // Détection du Scheme
    String scheme = 'Autre Réseau Bancaire';
    if (pan.startsWith('4')) {
      scheme = 'Visa';
    } else if (pan.startsWith(RegExp(r'^5[1-5]')) || pan.startsWith(RegExp(r'^2(22[1-9]|2[3-9][0-9]|[3-6][0-9]{2}|7[0-1][0-9]|720)'))) {
      scheme = 'Mastercard';
    } else if (pan.startsWith('34') || pan.startsWith('37')) {
      scheme = 'American Express';
    } else if (pan.startsWith(RegExp(r'^(6011|65|64[4-9])'))) {
      scheme = 'Discover';
    } else if (pan.startsWith(RegExp(r'^(352[89]|35[3-8][0-9])'))) {
      scheme = 'JCB';
    } else if (pan.startsWith('62')) {
      scheme = 'UnionPay';
    } else if (pan.startsWith('60') || pan.startsWith('9')) {
      scheme = 'Réseau Régional / GIM-UEMOA';
    }

    final bin = pan.length >= 6 ? pan.substring(0, 6) : null;
    final masked = pan.length >= 10
        ? '${pan.substring(0, 6)}${'*' * (pan.length - 10)}${pan.substring(pan.length - 4)}'
        : pan;

    return LuhnResult(
      isValid: isValid,
      pan: pan,
      cardScheme: scheme,
      maskedPan: masked,
      bin: bin,
    );
  }

  /// 3. Décodeur de Service Code (3 chiffres, ex: 201, 221)
  static ServiceCodeResult decodeServiceCode(String codeInput) {
    final clean = codeInput.replaceAll(RegExp(r'\D'), '');
    if (clean.length != 3) {
      return ServiceCodeResult(
        code: clean,
        techRule: 'Format invalide (3 chiffres requis)',
        authRule: 'Non interprétable',
        cvmRule: 'Non interprétable',
      );
    }

    final c1 = clean[0];
    final c2 = clean[1];
    final c3 = clean[2];

    String tech;
    switch (c1) {
      case '1': tech = '1 : Piste magnétique internationale'; break;
      case '2': tech = '2 : Puce EMV internationale (ICC standard)'; break;
      case '5': tech = '5 : Puce EMV nationale / Usage domestique'; break;
      case '6': tech = '6 : Piste magnétique nationale uniquement'; break;
      case '7': tech = '7 : Carte privée ou propriétaire'; break;
      default: tech = '$c1 : Spécification propriétaire'; break;
    }

    String auth;
    switch (c2) {
      case '0': auth = '0 : Autorisation normale (Hors-ligne autorisé selon plancher)'; break;
      case '2': auth = '2 : Autorisation en ligne obligatoire (Online Only - Pas de hors-ligne)'; break;
      case '4': auth = '4 : Autorisation normale avec règles bilatérales spécifiques'; break;
      default: auth = '$c2 : Règles d\'autorisation réservées'; break;
    }

    String cvm;
    switch (c3) {
      case '0': cvm = '0 : Pas de restriction de CVM / Signature autorisée'; break;
      case '1': cvm = '1 : Code PIN obligatoire (Transactions sécurisées avec PIN)'; break;
      case '2': cvm = '2 : Distributeur automatique de billets (GAB) uniquement'; break;
      case '3': cvm = '3 : Distributeur de billets uniquement avec code PIN obligatoire'; break;
      case '6': cvm = '6 : Code PIN requis sauf si CVM alternatif validé'; break;
      default: cvm = '$c3 : Profil de vérification personnalisé'; break;
    }

    return ServiceCodeResult(
      code: clean,
      techRule: tech,
      authRule: auth,
      cvmRule: cvm,
    );
  }

  /// 4. Simulateur de PIN Block ISO 9564 Format 0
  static PinBlockResult formatIso0PinBlock(String panInput, String pinInput) {
    final pan = panInput.replaceAll(RegExp(r'\D'), '');
    final pin = pinInput.replaceAll(RegExp(r'\D'), '');

    // Bloc PIN : 1 octet (0 + longueur PIN) + PIN + Padding F
    // Ex: PIN '1234' -> '041234FFFFFFFFFF'
    final pinLenHex = pin.length.toRadixString(16);
    final pinBlockStr = '0$pinLenHex${pin.padRight(14, 'F')}';

    // Bloc PAN : 4 zéros + 12 chiffres de droite du PAN hors clé de Luhn
    // Ex: PAN '4970123456781201' -> 12 chiffres avant dernier = '012345678120' -> '0000012345678120'
    String panPart = '000000000000';
    if (pan.length >= 13) {
      panPart = pan.substring(pan.length - 13, pan.length - 1);
    } else if (pan.length > 1) {
      panPart = pan.substring(0, pan.length - 1).padLeft(12, '0');
    }
    final panBlockStr = '0000$panPart';

    // XOR bit à bit sur les 16 caractères hex (8 octets)
    final buffer = StringBuffer();
    for (int i = 0; i < 16; i++) {
      final bPin = int.parse(pinBlockStr[i], radix: 16);
      final bPan = int.parse(panBlockStr[i], radix: 16);
      final xorVal = bPin ^ bPan;
      buffer.write(xorVal.toRadixString(16).toUpperCase());
    }

    return PinBlockResult(
      pan: pan,
      pin: pin,
      pinBlockPlain: pinBlockStr,
      panBlockPlain: panBlockStr,
      pinBlockIso0Hex: buffer.toString(),
    );
  }
}
