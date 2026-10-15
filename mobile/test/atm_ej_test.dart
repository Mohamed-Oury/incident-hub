import 'package:flutter_test/flutter_test.dart';
import 'package:payway_incident_hub/core/utils/atm_ej_analyzer.dart';

void main() {
  group('QA SUITE ANALYSEUR JOURNAL ÉLECTRONIQUE GAB (ATM EJ)', () {
    test('TEST 1 : Bourrage billets détecté avec décision de Recrédit Favorable', () {
      const sampleEj = '''14:32:01 ATM: GAB-AG-04 TID: 88776655
14:32:03 CARD INSERTED: PAN 4970101234567890
14:32:05 PIN ENTERED: PIN OK
14:32:08 HOST APPROVED: AUTH OK AMOUNT: 50000
14:32:10 DISPENSE REQ: 5 BILLETS
14:32:17 HARDWARE ERROR: STACKER JAMMED IN TRANSPORT MODULE
14:32:25 TRANSACTION ABORTED - SHUTTER NOT OPENED
14:32:28 CARD EJECTED''';

      final res = AtmEjAnalyzer.parse(sampleEj);

      expect(res.summary.hasBillJam, isTrue);
      expect(res.summary.finalVerdict, equals(EjFinalVerdict.dispenseFailedBillJam));
      expect(res.summary.claimAdvice, equals(EjClaimAdvice.favorableRecredit));
      expect(res.summary.atmId, equals('GAB-AG-04'));
      expect(res.summary.amountDetected, equals('50000'));
      expect(res.summary.panDetected, equals('497010******7890'));
      expect(res.events.length, greaterThanOrEqualTo(6));
    });

    test('TEST 2 : Oubli client / dépassement de délai (Rétractation)', () {
      const sampleEj = '''11:15:00 ATM: GAB-PARIS-02 TID: 44332211
11:15:02 CARD INSERTED: PAN 5100001234567891
11:15:05 PIN ENTERED: PIN OK
11:15:08 HOST APPROVED: AUTH OK AMOUNT: 20000
11:15:10 DISPENSE REQ: 2 BILLETS
11:15:15 BILLS PRESENTED
11:15:45 PRESENT TIMEOUT: BILLS RETRACTED IN REJECT BIN
11:15:48 CARD EJECTED''';

      final res = AtmEjAnalyzer.parse(sampleEj);

      expect(res.summary.hasRetract, isTrue);
      expect(res.summary.finalVerdict, equals(EjFinalVerdict.retractCustomerTimeout));
      expect(res.summary.claimAdvice, equals(EjClaimAdvice.favorableRecredit));
    });

    test('TEST 3 : Distribution conforme (Capteurs de sortie validés)', () {
      const sampleEj = '''09:40:10 ATM: GAB-DAKAR-01 TID: 99887766
09:40:12 CARD INSERTED: PAN 4000123456789012
09:40:15 PIN ENTERED: PIN OK
09:40:18 HOST APPROVED: AUTH OK AMOUNT: 30000
09:40:20 DISPENSE REQ: 3 BILLETS
09:40:24 NOTES DELIVERED
09:40:26 EXIT SENSOR CLEARED - BILLS TAKEN
09:40:28 CARD TAKEN''';

      final res = AtmEjAnalyzer.parse(sampleEj);

      expect(res.summary.finalVerdict, equals(EjFinalVerdict.dispenseSuccessful));
      expect(res.summary.claimAdvice, equals(EjClaimAdvice.unfavorableRejectClaim));
      expect(res.summary.hasBillJam, isFalse);
    });

    test('TEST 4 : Refus émetteur en amont (DE39=51)', () {
      const sampleEj = '''16:02:10 ATM: GAB-AG-08 TID: 11223344
16:02:12 CARD INSERTED: PAN 4970109876543210
16:02:15 PIN ENTERED: PIN OK
16:02:18 HOST REJECT: RESPONSE: 51 DECLINED AMOUNT: 100000
16:02:20 CARD RETURNED''';

      final res = AtmEjAnalyzer.parse(sampleEj);

      expect(res.summary.finalVerdict, equals(EjFinalVerdict.declinedByHost));
      expect(res.summary.claimAdvice, equals(EjClaimAdvice.unfavorableRejectClaim));
    });

    test('TEST 5 : Masquage systématique PCI-DSS du PAN', () {
      const sampleEj = '12:00:00 CARD INSERTED: PAN 4970101122334455';
      final res = AtmEjAnalyzer.parse(sampleEj);

      expect(res.summary.panDetected, equals('497010******4455'));
      expect(res.summary.panDetected!.contains('1122'), isFalse);
    });
  });
}
