import 'bitmap_helper.dart';

enum IsoFieldFormat {
  fixed,
  llvar,
  lllvar,
}

class IsoFieldDef {
  final int de;
  final String name;
  final IsoFieldFormat format;
  final int length; // Longueur fixe en caractères ou max pour LLVAR/LLLVAR
  final String description;

  const IsoFieldDef({
    required this.de,
    required this.name,
    required this.format,
    required this.length,
    required this.description,
  });
}

class ParsedIsoField {
  final int de;
  final String name;
  final String rawValue;
  final String interpretedValue;
  final String description;

  const ParsedIsoField({
    required this.de,
    required this.name,
    required this.rawValue,
    required this.interpretedValue,
    required this.description,
  });
}

class ParsedIsoMessage {
  final String headerHex;
  final String mti;
  final String mtiDescription;
  final String bitmapPrimaryHex;
  final String? bitmapSecondaryHex;
  final List<int> activeElements;
  final List<ParsedIsoField> fields;
  final String? parsingError;

  const ParsedIsoMessage({
    required this.headerHex,
    required this.mti,
    required this.mtiDescription,
    required this.bitmapPrimaryHex,
    this.bitmapSecondaryHex,
    required this.activeElements,
    required this.fields,
    this.parsingError,
  });
}

class IsoRawParser {
  // Définitions des champs ISO 8583 les plus courants
  static final Map<int, IsoFieldDef> definitions = {
    2: const IsoFieldDef(de: 2, name: 'PAN', format: IsoFieldFormat.llvar, length: 19, description: 'Primary Account Number'),
    3: const IsoFieldDef(de: 3, name: 'Processing Code', format: IsoFieldFormat.fixed, length: 6, description: 'Type d\'opération et comptes'),
    4: const IsoFieldDef(de: 4, name: 'Amount, Transaction', format: IsoFieldFormat.fixed, length: 12, description: 'Montant transaction'),
    7: const IsoFieldDef(de: 7, name: 'Transmission Date/Time', format: IsoFieldFormat.fixed, length: 10, description: 'MMDDhhmmss UTC'),
    11: const IsoFieldDef(de: 11, name: 'STAN', format: IsoFieldFormat.fixed, length: 6, description: 'Systems Trace Audit Number'),
    12: const IsoFieldDef(de: 12, name: 'Local Time', format: IsoFieldFormat.fixed, length: 6, description: 'hhmmss local'),
    13: const IsoFieldDef(de: 13, name: 'Local Date', format: IsoFieldFormat.fixed, length: 4, description: 'MMDD local'),
    14: const IsoFieldDef(de: 14, name: 'Expiration Date', format: IsoFieldFormat.fixed, length: 4, description: 'YYMM'),
    18: const IsoFieldDef(de: 18, name: 'MCC', format: IsoFieldFormat.fixed, length: 4, description: 'Merchant Category Code'),
    22: const IsoFieldDef(de: 22, name: 'POS Entry Mode', format: IsoFieldFormat.fixed, length: 3, description: 'Mode de lecture carte'),
    23: const IsoFieldDef(de: 23, name: 'Card Sequence Number', format: IsoFieldFormat.fixed, length: 3, description: 'Numéro de séquence PAN (PSN)'),
    25: const IsoFieldDef(de: 25, name: 'POS Condition Code', format: IsoFieldFormat.fixed, length: 2, description: 'Condition d\'acceptation'),
    32: const IsoFieldDef(de: 32, name: 'Acquirer ID', format: IsoFieldFormat.llvar, length: 11, description: 'Identifiant banque acquéreur'),
    35: const IsoFieldDef(de: 35, name: 'Track 2 Data', format: IsoFieldFormat.llvar, length: 37, description: 'Piste 2 équivalente'),
    37: const IsoFieldDef(de: 37, name: 'RRN', format: IsoFieldFormat.fixed, length: 12, description: 'Retrieval Reference Number'),
    38: const IsoFieldDef(de: 38, name: 'Auth Identification Code', format: IsoFieldFormat.fixed, length: 6, description: 'Numéro d\'accord'),
    39: const IsoFieldDef(de: 39, name: 'Response Code', format: IsoFieldFormat.fixed, length: 2, description: 'Code réponse DE39'),
    41: const IsoFieldDef(de: 41, name: 'Terminal ID (TID)', format: IsoFieldFormat.fixed, length: 8, description: 'Identifiant terminal'),
    42: const IsoFieldDef(de: 42, name: 'Merchant ID (MID)', format: IsoFieldFormat.fixed, length: 15, description: 'Identifiant commerçant'),
    43: const IsoFieldDef(de: 43, name: 'Card Acceptor Name/Location', format: IsoFieldFormat.fixed, length: 40, description: 'Nom et ville commerçant'),
    48: const IsoFieldDef(de: 48, name: 'Private Additional Data', format: IsoFieldFormat.lllvar, length: 999, description: 'Données privées additionnelles'),
    49: const IsoFieldDef(de: 49, name: 'Currency Code', format: IsoFieldFormat.fixed, length: 3, description: 'Code devise ISO 4217'),
    52: const IsoFieldDef(de: 52, name: 'PIN Data Block', format: IsoFieldFormat.fixed, length: 16, description: 'PIN Block chiffré hex'),
    53: const IsoFieldDef(de: 53, name: 'Security Info', format: IsoFieldFormat.fixed, length: 16, description: 'Informations de sécurité'),
    54: const IsoFieldDef(de: 54, name: 'Additional Amounts', format: IsoFieldFormat.lllvar, length: 120, description: 'Montants additionnels'),
    55: const IsoFieldDef(de: 55, name: 'EMV DE55 Data', format: IsoFieldFormat.lllvar, length: 999, description: 'Données de la puce EMV (Tags TLV)'),
    62: const IsoFieldDef(de: 62, name: 'Private Field 62', format: IsoFieldFormat.lllvar, length: 999, description: 'Données privées réseau'),
    63: const IsoFieldDef(de: 63, name: 'Private Field 63', format: IsoFieldFormat.lllvar, length: 999, description: 'Données privées switch'),
    64: const IsoFieldDef(de: 64, name: 'Primary MAC', format: IsoFieldFormat.fixed, length: 16, description: 'Message Authentication Code (hex)'),
    90: const IsoFieldDef(de: 90, name: 'Original Data Elements', format: IsoFieldFormat.fixed, length: 42, description: 'Données d\'origine (Reversal)'),
    102: const IsoFieldDef(de: 102, name: 'Account ID 1', format: IsoFieldFormat.llvar, length: 28, description: 'Compte source'),
    103: const IsoFieldDef(de: 103, name: 'Account ID 2', format: IsoFieldFormat.llvar, length: 28, description: 'Compte destination'),
    128: const IsoFieldDef(de: 128, name: 'Secondary MAC', format: IsoFieldFormat.fixed, length: 16, description: 'Message Authentication Code secondaire'),
  };

  static String getMtiDescription(String mti) {
    switch (mti) {
      case '0100': return 'Demande d\'Autorisation (Authorization Request)';
      case '0110': return 'Réponse d\'Autorisation (Authorization Response)';
      case '0200': return 'Transaction Financière Directe (Financial Request)';
      case '0210': return 'Réponse Financière Directe (Financial Response)';
      case '0400': return 'Demande d\'Extourne (Reversal Request)';
      case '0420': return 'Avis d\'Extourne / Annulation (Reversal Advice)';
      case '0430': return 'Réponse d\'Extourne / Annulation (Reversal Response)';
      case '0800': return 'Gestion Réseau / Network Management (Logon, Echo, Keys)';
      case '0810': return 'Réponse Gestion Réseau (Network Management Response)';
      default: return 'Message ISO 8583 MTI $mti';
    }
  }

  static ParsedIsoMessage parse(String input) {
    // Nettoyer les espaces, sauts de ligne, crochets et tirets
    String clean = input.replaceAll(RegExp(r'[\s\[\]\-:,]'), '').toUpperCase();
    if (clean.isEmpty) {
      return const ParsedIsoMessage(
        headerHex: '',
        mti: '',
        mtiDescription: '',
        bitmapPrimaryHex: '',
        activeElements: [],
        fields: [],
        parsingError: 'La trame saisie est vide.',
      );
    }

    int cursor = 0;
    String header = '';

    // Détecter un éventuel header de télécom (ex: 2 octets = 4 hex char, ou 4 octets = 8 hex char)
    // Si les 4 premiers caractères ne ressemblent pas à un MTI standard (0100, 0200, etc.)
    bool startsWithMti = clean.startsWith(RegExp(r'0[1248][0-3]0'));
    if (!startsWithMti && clean.length > 8) {
      // Chercher le premier MTI dans les premiers 20 caractères
      final match = RegExp(r'0[1248][0-3]0').firstMatch(clean);
      if (match != null && match.start <= 16) {
        header = clean.substring(0, match.start);
        cursor = match.start;
      }
    }

    if (clean.length - cursor < 20) {
      return ParsedIsoMessage(
        headerHex: header,
        mti: '',
        mtiDescription: '',
        bitmapPrimaryHex: '',
        activeElements: const [],
        fields: const [],
        parsingError: 'Trame trop courte (MTI + Bitmap minimal non trouvé).',
      );
    }

    final mti = clean.substring(cursor, cursor + 4);
    cursor += 4;

    // Décodage du Bitmap primaire (16 hex chars = 64 bits)
    final bitmapPrimary = clean.substring(cursor, cursor + 16);
    cursor += 16;

    String? bitmapSecondary;
    String fullBitmap = bitmapPrimary;

    // Si le bit 1 est à 1, le bitmap secondaire est présent (+16 hex chars)
    final firstChar = int.tryParse(bitmapPrimary[0], radix: 16) ?? 0;
    final hasSecondary = (firstChar & 0x08) != 0;

    if (hasSecondary) {
      if (clean.length - cursor < 16) {
        return ParsedIsoMessage(
          headerHex: header,
          mti: mti,
          mtiDescription: getMtiDescription(mti),
          bitmapPrimaryHex: bitmapPrimary,
          activeElements: const [],
          fields: const [],
          parsingError: 'Trame tronquée : Bitmap secondaire manquant.',
        );
      }
      bitmapSecondary = clean.substring(cursor, cursor + 16);
      cursor += 16;
      fullBitmap += bitmapSecondary;
    }

    final bitmapResult = BitmapHelper.decodeHex(fullBitmap);
    final activeElements = List<int>.from(bitmapResult.activeElements)..remove(1); // Enlever le bit de liaison

    final List<ParsedIsoField> fields = [];
    String? parsingError;

    for (final de in activeElements) {
      final def = definitions[de];
      if (cursor >= clean.length) {
        parsingError = 'Fin prématurée de la trame lors de la lecture du DE $de';
        break;
      }

      int fieldLength = 0;
      String rawValue = '';

      if (def == null) {
        // Champ non répertorié : tenter de lire en fixe ou signaler
        fieldLength = 6;
        if (cursor + fieldLength <= clean.length) {
          rawValue = clean.substring(cursor, cursor + fieldLength);
          cursor += fieldLength;
        } else {
          rawValue = clean.substring(cursor);
          cursor = clean.length;
        }
        fields.add(ParsedIsoField(
          de: de,
          name: 'Champ DE $de',
          rawValue: rawValue,
          interpretedValue: rawValue,
          description: 'Élément de données générique',
        ));
        continue;
      }

      if (def.format == IsoFieldFormat.fixed) {
        fieldLength = def.length;
        if (cursor + fieldLength > clean.length) {
          fieldLength = clean.length - cursor;
          parsingError = 'Champ DE $de tronqué';
        }
        rawValue = clean.substring(cursor, cursor + fieldLength);
        cursor += fieldLength;
      } else if (def.format == IsoFieldFormat.llvar) {
        if (cursor + 2 > clean.length) {
          parsingError = 'Longueur LLVAR tronquée sur DE $de';
          break;
        }
        final lenStr = clean.substring(cursor, cursor + 2);
        cursor += 2;
        final lengthVal = int.tryParse(lenStr) ?? 0;
        fieldLength = lengthVal;
        if (cursor + fieldLength > clean.length) {
          fieldLength = clean.length - cursor;
          parsingError = 'Données LLVAR tronquées sur DE $de';
        }
        rawValue = clean.substring(cursor, cursor + fieldLength);
        cursor += fieldLength;
      } else if (def.format == IsoFieldFormat.lllvar) {
        if (cursor + 3 > clean.length) {
          parsingError = 'Longueur LLLVAR tronquée sur DE $de';
          break;
        }
        final lenStr = clean.substring(cursor, cursor + 3);
        cursor += 3;
        final lengthVal = int.tryParse(lenStr) ?? 0;
        fieldLength = lengthVal;
        if (cursor + fieldLength > clean.length) {
          fieldLength = clean.length - cursor;
          parsingError = 'Données LLLVAR tronquées sur DE $de';
        }
        rawValue = clean.substring(cursor, cursor + fieldLength);
        cursor += fieldLength;
      }

      String interpreted = rawValue;
      if (de == 4) {
        // Montant formaté
        final numVal = double.tryParse(rawValue) ?? 0.0;
        interpreted = (numVal / 100).toStringAsFixed(2);
      } else if (de == 2) {
        // Masquage PAN
        if (rawValue.length >= 10) {
          interpreted = '${rawValue.substring(0, 6)}******${rawValue.substring(rawValue.length - 4)}';
        }
      }

      fields.add(ParsedIsoField(
        de: de,
        name: def.name,
        rawValue: rawValue,
        interpretedValue: interpreted,
        description: def.description,
      ));
    }

    return ParsedIsoMessage(
      headerHex: header,
      mti: mti,
      mtiDescription: getMtiDescription(mti),
      bitmapPrimaryHex: bitmapPrimary,
      bitmapSecondaryHex: bitmapSecondary,
      activeElements: activeElements,
      fields: fields,
      parsingError: parsingError,
    );
  }
}
