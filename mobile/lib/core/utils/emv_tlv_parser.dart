class EmvTagInfo {
  final String tag;
  final String name;
  final String format;
  final String description;

  const EmvTagInfo({
    required this.tag,
    required this.name,
    required this.format,
    required this.description,
  });
}

class EmvTlvNode {
  final String tag;
  final int length;
  final String valueHex;
  final String? valueAscii;
  final bool isConstructed;
  final EmvTagInfo info;
  final List<EmvTlvNode> children;

  EmvTlvNode({
    required this.tag,
    required this.length,
    required this.valueHex,
    this.valueAscii,
    required this.isConstructed,
    required this.info,
    this.children = const [],
  });
}

class EmvTlvParser {
  static final Map<String, EmvTagInfo> dictionary = {
    '9F26': const EmvTagInfo(
      tag: '9F26',
      name: 'Application Cryptogram (AC)',
      format: 'b 8',
      description: 'Cryptogramme généré par la puce (ARQC pour demande, TC pour validation, AAC pour rejet).',
    ),
    '9F27': const EmvTagInfo(
      tag: '9F27',
      name: 'Cryptogram Information Data (CID)',
      format: 'b 1',
      description: 'Type de cryptogramme retourné (0x80: ARQC, 0x40: TC, 0x00: AAC).',
    ),
    '95': const EmvTagInfo(
      tag: '95',
      name: 'Terminal Verification Results (TVR)',
      format: 'b 5',
      description: 'Résultats des contrôles de sécurité effectués par le terminal (hors-ligne, PIN, seuils).',
    ),
    '9B': const EmvTagInfo(
      tag: '9B',
      name: 'Transaction Status Information (TSI)',
      format: 'b 2',
      description: 'Indicateur des fonctions exécutées durant la transaction (authentification, gestion des risques).',
    ),
    '82': const EmvTagInfo(
      tag: '82',
      name: 'Application Interchange Profile (AIP)',
      format: 'b 2',
      description: 'Fonctions EMV supportées par la carte (SDA, DDA, CDA, gestion des risques par la carte).',
    ),
    '5F2A': const EmvTagInfo(
      tag: '5F2A',
      name: 'Transaction Currency Code',
      format: 'n 3',
      description: 'Code devise ISO 4217 de la transaction (ex: 0978 pour EUR, 0952 pour XAF).',
    ),
    '9A': const EmvTagInfo(
      tag: '9A',
      name: 'Transaction Date',
      format: 'n 6 (YYMMDD)',
      description: 'Date locale d\'initiation de la transaction EMV.',
    ),
    '9C': const EmvTagInfo(
      tag: '9C',
      name: 'Transaction Type',
      format: 'n 2',
      description: 'Nature de l\'opération (00: Achat, 01: Retrait, 20: Remboursement).',
    ),
    '9F02': const EmvTagInfo(
      tag: '9F02',
      name: 'Amount, Authorized (Numeric)',
      format: 'n 12',
      description: 'Montant de la transaction soumis à autorisation.',
    ),
    '9F03': const EmvTagInfo(
      tag: '9F03',
      name: 'Amount, Other (Numeric)',
      format: 'n 12',
      description: 'Montant secondaire (Cashback ou pourboire).',
    ),
    '9F1A': const EmvTagInfo(
      tag: '9F1A',
      name: 'Terminal Country Code',
      format: 'n 3',
      description: 'Code ISO pays du terminal bancaire.',
    ),
    '9F36': const EmvTagInfo(
      tag: '9F36',
      name: 'Application Transaction Counter (ATC)',
      format: 'b 2',
      description: 'Compteur incrémental de transactions de la puce, prévenant le rejeu.',
    ),
    '9F37': const EmvTagInfo(
      tag: '9F37',
      name: 'Unpredictable Number (UN)',
      format: 'b 4',
      description: 'Aléa cryptographique généré par le terminal pour garantir l\'unicité de l\'ARQC.',
    ),
    '84': const EmvTagInfo(
      tag: '84',
      name: 'Dedicated File (DF) Name / AID',
      format: 'b 5-16',
      description: 'Identifiant de l\'application sélectionnée sur la puce (ex: A0000000031010 pour Visa).',
    ),
    '4F': const EmvTagInfo(
      tag: '4F',
      name: 'Application Identifier (AID)',
      format: 'b 5-16',
      description: 'Identifiant d\'application bancaire.',
    ),
    '50': const EmvTagInfo(
      tag: '50',
      name: 'Application Label',
      format: 'ans 1-16',
      description: 'Libellé commercial de l\'application (ex: VISA DEBIT, MASTERCARD).',
    ),
    '5A': const EmvTagInfo(
      tag: '5A',
      name: 'Application PAN',
      format: 'cn ..19',
      description: 'Numéro de carte EMV.',
    ),
    '5F34': const EmvTagInfo(
      tag: '5F34',
      name: 'Application PAN Sequence Number (PSN)',
      format: 'n 2',
      description: 'Numéro de séquence de la carte (différencie les réémissions).',
    ),
    '8A': const EmvTagInfo(
      tag: '8A',
      name: 'Authorization Response Code (ARC)',
      format: 'an 2',
      description: 'Code de réponse renvoyé par l\'Issuer (ex: 00, Y1, Z1).',
    ),
    '9F34': const EmvTagInfo(
      tag: '9F34',
      name: 'Cardholder Verification Method (CVM) Results',
      format: 'b 3',
      description: 'Méthode de vérification utilisée et résultat (PIN en ligne, PIN hors ligne, Signature).',
    ),
    '9F10': const EmvTagInfo(
      tag: '9F10',
      name: 'Issuer Application Data (IAD)',
      format: 'b ..32',
      description: 'Données propriétaires de l\'émetteur transmises dans l\'ARQC (détection de fraude).',
    ),
    '9F33': const EmvTagInfo(
      tag: '9F33',
      name: 'Terminal Capabilities',
      format: 'b 3',
      description: 'Capacités du lecteur de carte (méthodes CVM supportées, saisie puce/sans contact).',
    ),
    '9F35': const EmvTagInfo(
      tag: '9F35',
      name: 'Terminal Type',
      format: 'n 2',
      description: 'Catégorie du terminal (ex: 21 pour TPE avec présence opérateur, 14 pour GAB).',
    ),
  };

  /// Parse une chaîne hexadécimale brute en liste de nœuds TLV
  static List<EmvTlvNode> parse(String rawHex) {
    final cleanHex = rawHex.replaceAll(RegExp(r'[^0-9A-Fa-f]'), '').toUpperCase();
    if (cleanHex.isEmpty || cleanHex.length % 2 != 0) return [];

    final List<int> bytes = [];
    for (int i = 0; i < cleanHex.length; i += 2) {
      bytes.add(int.parse(cleanHex.substring(i, i + 2), radix: 16));
    }

    return _parseBytes(bytes, 0, bytes.length);
  }

  static List<EmvTlvNode> _parseBytes(List<int> bytes, int start, int end) {
    final List<EmvTlvNode> nodes = [];
    int cursor = start;

    while (cursor < end) {
      if (cursor >= bytes.length) break;

      // Ignorer les octets de bourrage (0x00 ou 0xFF)
      if (bytes[cursor] == 0x00 || bytes[cursor] == 0xFF) {
        cursor++;
        continue;
      }

      // 1. Découpage du Tag
      final int tagStart = cursor;
      final int firstByte = bytes[cursor++];
      final bool isConstructed = (firstByte & 0x20) != 0;

      // Si les 5 bits de poids faible sont à 1 (0x1F), tag multi-octets
      if ((firstByte & 0x1F) == 0x1F) {
        while (cursor < end) {
          final int next = bytes[cursor++];
          if ((next & 0x80) == 0) break; // Dernier octet du tag
        }
      }

      final String tagHex = bytes
          .sublist(tagStart, cursor)
          .map((b) => b.toRadixString(16).padLeft(2, '0').toUpperCase())
          .join();

      if (cursor >= end) break;

      // 2. Découpage de la Longueur (Length)
      int length = 0;
      final int lenByte = bytes[cursor++];
      if ((lenByte & 0x80) == 0) {
        length = lenByte;
      } else {
        final int numLengthBytes = lenByte & 0x7F;
        for (int i = 0; i < numLengthBytes; i++) {
          if (cursor >= end) break;
          length = (length << 8) | bytes[cursor++];
        }
      }

      if (cursor + length > end) {
        // Longueur invalide ou tronquée, on prend le reste
        length = end - cursor;
      }

      // 3. Découpage de la Valeur (Value)
      final List<int> valBytes = bytes.sublist(cursor, cursor + length);
      cursor += length;

      final String valHex = valBytes
          .map((b) => b.toRadixString(16).padLeft(2, '0').toUpperCase())
          .join();

      // Tentative de décodage ASCII pour les tags texte
      String? valAscii;
      if (valBytes.every((b) => b >= 32 && b <= 126)) {
        valAscii = String.fromCharCodes(valBytes);
      }

      final info = dictionary[tagHex] ?? EmvTagInfo(
        tag: tagHex,
        name: 'Tag Inconnu / Propriétaire',
        format: 'b ${length * 8}',
        description: 'Élément de données EMV spécifique ou non répertorié.',
      );

      // Si tag construit, récursion sur les enfants
      List<EmvTlvNode> children = [];
      if (isConstructed && valBytes.isNotEmpty) {
        children = _parseBytes(valBytes, 0, valBytes.length);
      }

      nodes.add(EmvTlvNode(
        tag: tagHex,
        length: length,
        valueHex: valHex,
        valueAscii: valAscii,
        isConstructed: isConstructed,
        info: info,
        children: children,
      ));
    }

    return nodes;
  }
}
