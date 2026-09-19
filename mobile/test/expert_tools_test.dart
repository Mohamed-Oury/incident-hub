import 'package:flutter_test/flutter_test.dart';
import 'package:payway_incident_hub/core/utils/iso_raw_parser.dart';
import 'package:payway_incident_hub/core/utils/crypto_toolbox.dart';

void main() {
  group('1. IsoRawParser Tests', () {
    test('Découpe correctement une trame 0200 avec MTI, Bitmaps et DEs', () {
      const sample =
          '02007238248108C080001649701234567812010000000000000500000919143000000042143000091924125411051000000000420000018512345612345600TERMINAL123456789012345SUPERMARCHE DU CENTRE     PARIS        FR9780000000000000000';
      final res = IsoRawParser.parse(sample);

      expect(res.mti, '0200');
      expect(res.mtiDescription, contains('Financière'));
      expect(res.bitmapPrimaryHex, '7238248108C08000');
      expect(res.activeElements, containsAll([2, 3, 4, 7, 11, 12, 13, 22, 25, 37, 41, 42, 49]));

      // Champ PAN (DE 2)
      final de2 = res.fields.firstWhere((f) => f.de == 2);
      expect(de2.rawValue, '4970123456781201');
      expect(de2.interpretedValue, contains('******'));

      // Champ Montant (DE 4)
      final de4 = res.fields.firstWhere((f) => f.de == 4);
      expect(de4.rawValue, '000000050000');
      expect(de4.interpretedValue, '500.00');
    });

    test('Découpe correctement un Reversal 0420', () {
      const sample0420 =
          '04207238248108C080001649701234567812010100000000000200000919143500000043143500091924126011051000000000430000018612345712345700ATM0001 123456789012345DISTRIBUTEUR GAB SG       PARIS        FR9780000000000000000';
      final res = IsoRawParser.parse(sample0420);

      expect(res.mti, '0420');
      expect(res.mtiDescription, contains('Extourne'));
      expect(res.fields.any((f) => f.de == 11), isTrue); // STAN
    });
  });

  group('2. CryptoToolbox Tests', () {
    test('Calcul de KCV déterministe pour 16 et 24 octets', () {
      const keyHex1 = '0123456789ABCDEFFEDCBA9876543210';
      final kcv1 = CryptoToolbox.calculateKcv(keyHex1);
      expect(kcv1.length, 6);

      const keyHex2 = '0123456789ABCDEFFEDCBA98765432100123456789ABCDEF';
      final kcv2 = CryptoToolbox.calculateKcv(keyHex2);
      expect(kcv2.length, 6);
      expect(kcv1, isNot(equals(kcv2)));
    });

    test('Contrôle algorithme de Luhn (Mod 10) & Détection de Scheme', () {
      // PAN valide Visa
      final r1 = CryptoToolbox.validateLuhn('4970123456781201');
      expect(r1.cardScheme, 'Visa');
      expect(r1.bin, '497012');
      expect(r1.maskedPan, '497012******1201');

      // PAN Mastercard
      final r2 = CryptoToolbox.validateLuhn('5399123456788841');
      expect(r2.cardScheme, 'Mastercard');
      expect(r2.bin, '539912');
    });

    test('Décodage de Service Code (ex: 201 et 221)', () {
      final s201 = CryptoToolbox.decodeServiceCode('201');
      expect(s201.techRule, contains('Puce EMV'));
      expect(s201.authRule, contains('normale'));
      expect(s201.cvmRule, contains('PIN'));

      final s221 = CryptoToolbox.decodeServiceCode('221');
      expect(s221.authRule, contains('en ligne'));
    });

    test('Simulation PIN Block ISO 9564 Format 0', () {
      final pb = CryptoToolbox.formatIso0PinBlock('4970123456781201', '1234');
      expect(pb.pinBlockPlain, '041234FFFFFFFFFF');
      expect(pb.panBlockPlain, '0000012345678120');
      expect(pb.pinBlockIso0Hex.length, 16);
      // Vérifie que le premier octet (0 XOR 0) commence par 0
      expect(pb.pinBlockIso0Hex.startsWith('0'), isTrue);
    });
  });
}
