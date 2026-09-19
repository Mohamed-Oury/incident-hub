import 'package:flutter_test/flutter_test.dart';
import 'package:payway_incident_hub/features/cbs/data/cbs_data.dart';

void main() {
  group('CBS Amplitude & IT Banking Data Validation', () {
    test('Functional domains are complete and valid', () {
      expect(CbsData.domains.isNotEmpty, isTrue);
      expect(CbsData.domains.length, greaterThanOrEqualTo(8));

      for (final domain in CbsData.domains) {
        expect(domain.id.isNotEmpty, isTrue);
        expect(domain.name.isNotEmpty, isTrue);
        expect(domain.code.isNotEmpty, isTrue);
        expect(domain.tables.isNotEmpty, isTrue);
        expect(domain.businessOperations.isNotEmpty, isTrue);
        expect(domain.batchProcesses.isNotEmpty, isTrue);
        expect(domain.keyRisks.isNotEmpty, isTrue);
      }
    });

    test('Oracle and Informix error database has key banking errors', () {
      expect(CbsData.dbErrors.isNotEmpty, isTrue);

      final ora54 = CbsData.dbErrors.firstWhere((e) => e.code == 'ORA-00054');
      expect(ora54.engine, 'Oracle');
      expect(ora54.diagnosticQueries.isNotEmpty, isTrue);
      expect(ora54.resolutionSteps.isNotEmpty, isTrue);

      final ora60 = CbsData.dbErrors.firstWhere((e) => e.code == 'ORA-00060');
      expect(ora60.severity, 'CRITICAL');

      final informix244 = CbsData.dbErrors.firstWhere((e) => e.code == 'INFORMIX-244');
      expect(informix244.engine, 'Informix');
    });

    test('EOD batch workflow has 10 steps and critical steps marked', () {
      expect(CbsData.eodSteps.length, 10);
      expect(CbsData.eodSteps.first.sequence, 1);
      expect(CbsData.eodSteps.last.sequence, 10);

      // Check step 6 (Arrêtés de comptes) and step 8 (Équilibre GL)
      final step6 = CbsData.eodSteps[5];
      expect(step6.code, 'EOD_060_CPT_ARRETE');
      expect(step6.isCritical, isTrue);

      final step8 = CbsData.eodSteps[7];
      expect(step8.code, 'EOD_080_GL_EQUILIBRE');
      expect(step8.isCritical, isTrue);
    });

    test('AIX & Unix commands catalog contains essential troubleshooting tools (120 commands)', () {
      expect(CbsData.unixCommands.length, greaterThanOrEqualTo(120));
      final psCmd = CbsData.unixCommands.firstWhere((c) => c.command.contains('ps -ef'));
      expect(psCmd.category, 'PROCESS');

      final dfCmd = CbsData.unixCommands.firstWhere((c) => c.command.contains('df -g'));
      expect(dfCmd.category, 'DISK');

      final topasCmd = CbsData.unixCommands.firstWhere((c) => c.command.contains('topas'));
      expect(topasCmd.category, 'MEMORY');
    });

    test('CBS Incidents follow 6-step RCA banking methodology (200 incidents)', () {
      expect(CbsData.incidents.length, greaterThanOrEqualTo(200));
      for (final inc in CbsData.incidents) {
        expect(inc.reference.startsWith('CBS-INC-'), isTrue);
        expect(inc.symptom.isNotEmpty, isTrue);
        expect(inc.businessImpact.isNotEmpty, isTrue);
        expect(inc.logEvidence.isNotEmpty, isTrue);
        expect(inc.hypotheses.isNotEmpty, isTrue);
        expect(inc.rootCause.isNotEmpty, isTrue);
        expect(inc.remediationSteps.isNotEmpty, isTrue);
        expect(inc.preventionRule.isNotEmpty, isTrue);
      }
    });

    test('CBS Quiz has correct options and valid answer indices (240 questions)', () {
      expect(CbsData.quiz.length, greaterThanOrEqualTo(240));
      for (final q in CbsData.quiz) {
        expect(q.options.length, 4);
        expect(q.correctIndex, inInclusiveRange(0, 3));
        expect(q.explanation.isNotEmpty, isTrue);
      }
    });

    test('CBS Ranks span 10 levels from Junior to Grand Architect', () {
      expect(CbsData.cbsRanks.length, 10);
      expect(CbsData.cbsRanks.first['level'], 1);
      expect(CbsData.cbsRanks.first['name'], 'Junior IT Banking');
      expect(CbsData.cbsRanks.last['level'], 10);
      expect(CbsData.cbsRanks.last['name'], 'CBS Grand Architect');
    });
  });
}
