import 'package:flutter_test/flutter_test.dart';
import 'package:payway_incident_hub/core/utils/emv_tlv_parser.dart';
import 'package:payway_incident_hub/core/database/gamification_service.dart';
import 'package:payway_incident_hub/features/academy/quiz_questions.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  sqfliteFfiInit();
  databaseFactory = databaseFactoryFfi;

  group('PayQuest - EMV TLV Parser Tests', () {
    test('Correctly parses standard EMV DE55 tags (9F26, 9F27, 95)', () {
      // 9F26 (8 bytes ARQC) + 9F27 (1 byte CID) + 95 (5 bytes TVR)
      const hexPayload = '9F260811223344556677889F27018095050000000000';
      final tags = EmvTlvParser.parse(hexPayload);

      expect(tags.length, 3);
      expect(tags[0].tag, '9F26');
      expect(tags[0].length, 8);
      expect(tags[0].valueHex, '1122334455667788');
      expect(tags[0].info.name, contains('Cryptogram'));

      expect(tags[1].tag, '9F27');
      expect(tags[1].length, 1);
      expect(tags[1].valueHex, '80');

      expect(tags[2].tag, '95');
      expect(tags[2].length, 5);
      expect(tags[2].valueHex, '0000000000');
    });

    test('Handles malformed or empty TLV gracefully', () {
      final emptyResult = EmvTlvParser.parse('');
      expect(emptyResult, isEmpty);

      final truncatedResult = EmvTlvParser.parse('9F');
      expect(truncatedResult, isEmpty);
    });
  });

  group('PayQuest - Gamification & Career Path Tests', () {
    test('Rank and XP progression calculates correctly', () {
      final p1 = UserProfile(xp: 50, streak: 1, energy: 100, badges: [], lastActive: '');
      expect(p1.rankTitle, 'Junior Switch Operator');
      expect(p1.level, 1);

      final p2 = UserProfile(xp: 1500, streak: 5, energy: 90, badges: [], lastActive: '');
      expect(p2.rankTitle, 'Senior Transaction Engineer');
      expect(p2.level, 16);

      final p3 = UserProfile(xp: 5000, streak: 20, energy: 100, badges: [], lastActive: '');
      expect(p3.rankTitle, 'Chief Payment Architect');
    });
  });

  group('PayQuest - Academy Questions Catalog', () {
    test('Contains questions across all required payment domains', () {
      final list = QuizQuestionsCatalog.allQuestions;
      expect(list.length, greaterThanOrEqualTo(8));
      final categories = list.map((q) => q.category).toSet();
      expect(categories.any((c) => c.contains('ISO 8583')), isTrue);
      expect(categories.any((c) => c.contains('EMV')), isTrue);
    });
  });
}
