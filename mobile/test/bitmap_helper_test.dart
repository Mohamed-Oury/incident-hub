import 'package:flutter_test/flutter_test.dart';
import 'package:payway_incident_hub/core/utils/bitmap_helper.dart';

void main() {
  group('BitmapHelper Tests', () {
    test('Décodage Bitmap 64-bit standard', () {
      // Bitmap standard 0200
      const hex = '7238248108C08000';
      final result = BitmapHelper.decodeHex(hex);

      expect(result.hex, equals(hex));
      expect(result.binary.length, equals(64));
      expect(result.hasSecondary, isFalse);
      
      // Doit contenir les champs de base (PAN=2, ProcCode=3, Amount=4, STAN=11...)
      expect(result.activeElements, contains(2));
      expect(result.activeElements, contains(3));
      expect(result.activeElements, contains(4));
      expect(result.activeElements, contains(11));
      expect(result.activeElements, contains(41)); // TID
      expect(result.activeElements, contains(42)); // MID
    });

    test('Décodage Bitmap avec Bitmap Secondaire (128-bit)', () {
      const hex = 'F238248108C080000000000000000002'; // Premier bit = 1 (F = 1111)
      final result = BitmapHelper.decodeHex(hex);

      expect(result.binary.length, equals(128));
      expect(result.hasSecondary, isTrue);
      expect(result.activeElements, contains(1));
      expect(result.activeElements, contains(127)); // Dernier bit ou avant dernier
    });

    test('Encodage de champs vers Bitmap Hex', () {
      final elements = [2, 3, 4, 11];
      final hex = BitmapHelper.encodeElements(elements);
      
      final redecoded = BitmapHelper.decodeHex(hex);
      expect(redecoded.activeElements, containsAll([2, 3, 4, 11]));
    });
  });
}
