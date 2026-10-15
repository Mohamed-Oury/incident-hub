import '../data/flexcube_data.dart';
import '../models/flexcube_models.dart';

class FlexcubeIncidentAnalysis {
  final FlexcubeIncident? detectedIncident;
  final String rawQuery;
  final String sqlDiagnostic;
  final String rootCause;
  final List<String> resolutionSteps;

  const FlexcubeIncidentAnalysis({
    this.detectedIncident,
    required this.rawQuery,
    required this.sqlDiagnostic,
    required this.rootCause,
    required this.resolutionSteps,
  });
}

class FlexcubePlSqlProposal {
  final String packageName;
  final String packageSpec;
  final String packageBody;
  final List<String> entryPoints;
  final List<String> testCases;
  final String rollbackScript;

  const FlexcubePlSqlProposal({
    required this.packageName,
    required this.packageSpec,
    required this.packageBody,
    required this.entryPoints,
    required this.testCases,
    required this.rollbackScript,
  });
}

class FlexcubeCopilotService {
  /// Revue de code PL/SQL conforme aux standards Oracle FLEXCUBE
  static List<FlexcubePlSqlReviewIssue> reviewPlSql(String code) {
    final List<FlexcubePlSqlReviewIssue> issues = [];
    final upper = code.toUpperCase();

    // 1. Détection de COMMIT prématuré dans les packages custom
    if (RegExp(r'\bCOMMIT\b').hasMatch(upper)) {
      issues.add(const FlexcubePlSqlReviewIssue(
        severity: 'CRITICAL',
        rule: 'NO_PREMATURE_COMMIT',
        message: 'COMMIT prématuré détecté dans le code custom.',
        recommendation:
            'Dans Oracle FLEXCUBE, le COMMIT est orchestré exclusivement par le Kernel (Kernel Framework Transaction). '
            'Un COMMIT prématuré brise l\'atomicité de la transaction comptable et corrompt la table ACTB_DAILY_LOG.',
      ));
    }

    // 2. Détection de SELECT FOR UPDATE sans clause NOWAIT
    if (upper.contains('FOR UPDATE') && !upper.contains('NOWAIT')) {
      issues.add(const FlexcubePlSqlReviewIssue(
        severity: 'CRITICAL',
        rule: 'FOR_UPDATE_NOWAIT_MANDATORY',
        message: 'Clause SELECT FOR UPDATE utilisée sans NOWAIT.',
        recommendation:
            'Toujours spécifier NOWAIT (ou WAIT n) pour éviter les deadlocks blocants lors des fortes concurrences '
            'sur les tables STTM_CUST_ACCOUNT ou ACTB_DAILY_LOG.',
      ));
    }

    // 3. Détection de WHEN OTHERS silencieux
    if (upper.contains('WHEN OTHERS THEN') &&
        !upper.contains('RAISE') &&
        !upper.contains('GLOBAL.PR_LOG_ERROR') &&
        !upper.contains('RAISE_APPLICATION_ERROR')) {
      issues.add(const FlexcubePlSqlReviewIssue(
        severity: 'WARNING',
        rule: 'AVOID_SILENT_EXCEPTION',
        message: 'Bloc EXCEPTION WHEN OTHERS sans relance d\'erreur (RAISE) ni log d\'audit.',
        recommendation:
            'Capturer l\'exception avec appel à Pr_Log_Error ou RAISE pour ne pas masquer les erreurs SGBD Oracle aux couches clientes.',
      ));
    }

    // 4. Détection de curseurs non fermés
    if (upper.contains('OPEN ') && !upper.contains('CLOSE ') && !upper.contains('FOR ')) {
      issues.add(const FlexcubePlSqlReviewIssue(
        severity: 'WARNING',
        rule: 'CURSOR_LEAK',
        message: 'Curseur explicite ouvert (OPEN) sans instruction de fermeture (CLOSE) visible.',
        recommendation: 'Préférer les boucles FOR rec IN (SELECT...) ou s\'assurer de fermer le curseur dans tous les blocs d\'exception.',
      ));
    }

    return issues;
  }

  /// Diagnostic rapide d'un incident ou erreur SGBD Oracle / FLEXCUBE
  static FlexcubeIncidentAnalysis analyzeIncident(String errorText) {
    final upper = errorText.toUpperCase();

    // Recherche par code d'erreur (ex: ORA-00054, ORA-01555, AC-VAL-001, etc.)
    FlexcubeIncident? matched;
    for (final inc in FlexcubeData.incidents) {
      if (upper.contains(inc.errorCode.toUpperCase()) ||
          upper.contains(inc.reference.toUpperCase()) ||
          upper.contains(inc.id.toUpperCase())) {
        matched = inc;
        break;
      }
    }

    // Si pas de correspondance directe, recherche sémantique
    if (matched == null) {
      if (upper.contains('NOWAIT') || upper.contains('RESOURCE BUSY') || upper.contains('LOCK')) {
        matched = FlexcubeData.incidents.firstWhere((i) => i.errorCode == 'ORA-00054');
      } else if (upper.contains('SNAPSHOT') || upper.contains('ROLLBACK SEGMENT') || upper.contains('UNDO')) {
        matched = FlexcubeData.incidents.firstWhere((i) => i.errorCode == 'ORA-01555');
      } else if (upper.contains('UNIQUE CONSTRAINT') || upper.contains('DUPLICATE')) {
        matched = FlexcubeData.incidents.firstWhere((i) => i.errorCode == 'ORA-00001');
      }
    }

    if (matched != null) {
      return FlexcubeIncidentAnalysis(
        detectedIncident: matched,
        rawQuery: errorText,
        sqlDiagnostic: matched.investigationQuery,
        rootCause: matched.rootCause,
        resolutionSteps: matched.resolutionProcedure,
      );
    }

    // Fallback générique Oracle
    return FlexcubeIncidentAnalysis(
      detectedIncident: null,
      rawQuery: errorText,
      sqlDiagnostic:
          'SELECT sid, serial#, username, status, sql_id, event, seconds_in_wait '
          'FROM v\$session WHERE status = \'ACTIVE\' AND type != \'BACKGROUND\';',
      rootCause: 'Erreur Oracle non répertoriée dans le catalogue standard des 20 incidents RUN.',
      resolutionSteps: [
        'Consulter l\'alert log de l\'instance Oracle (alert_<SID>.log)',
        'Vérifier les verrous actifs via la vue v\$locked_object et v\$session',
        'Contrôler la table AETB_PROCESS_PROGRESS si l\'erreur survient en phase AEOD',
      ],
    );
  }

  /// Génération d'une proposition de package PL/SQL custom
  static FlexcubePlSqlProposal generatePlSqlPackage({
    required String title,
    required String module,
    required String description,
  }) {
    final cleanModule = module.toUpperCase();
    final pkgName = 'CUSPKS_${cleanModule}_${title.replaceAll(RegExp(r'[^a-zA-Z0-9]'), '_').toUpperCase()}';

    final spec = '''CREATE OR REPLACE PACKAGE $pkgName AS
  /* =========================================================================
   * MODULE      : Oracle FLEXCUBE Universal Banking ($cleanModule)
   * OBJET       : $title
   * DESCRIPTION : $description
   * CONTRAT     : Aucun COMMIT dans le package custom. Gestion NOWAIT requise.
   * ========================================================================= */

  FUNCTION Fn_Validate_Request(
    p_Branch_Code IN VARCHAR2,
    p_Cust_Ac_No  IN VARCHAR2,
    p_Amount      IN NUMBER,
    p_Err_Code    OUT VARCHAR2,
    p_Err_Params  OUT VARCHAR2
  ) RETURN BOOLEAN;

  PROCEDURE Pr_Process_Request(
    p_Branch_Code IN VARCHAR2,
    p_Cust_Ac_No  IN VARCHAR2,
    p_Amount      IN NUMBER,
    p_Txn_Ref_No  IN VARCHAR2,
    p_Status      OUT VARCHAR2,
    p_Err_Code    OUT VARCHAR2
  );

END $pkgName;
/''';

    final body = '''CREATE OR REPLACE PACKAGE BODY $pkgName AS

  FUNCTION Fn_Validate_Request(
    p_Branch_Code IN VARCHAR2,
    p_Cust_Ac_No  IN VARCHAR2,
    p_Amount      IN NUMBER,
    p_Err_Code    OUT VARCHAR2,
    p_Err_Params  OUT VARCHAR2
  ) RETURN BOOLEAN IS
    l_Account_Stat STTM_CUST_ACCOUNT%ROWTYPE;
  BEGIN
    -- Verrouillage optimiste avec NOWAIT pour prévenir ORA-00054
    SELECT * INTO l_Account_Stat
    FROM STTM_CUST_ACCOUNT
    WHERE BRANCH_CODE = p_Branch_Code
      AND CUST_AC_NO  = p_Cust_Ac_No
    FOR UPDATE NOWAIT;

    IF l_Account_Stat.RECORD_STAT = 'C' THEN
      p_Err_Code := 'AC-ACC-001'; -- Compte clôturé
      RETURN FALSE;
    END IF;

    IF l_Account_Stat.AC_STAT_NO_DR = 'Y' THEN
      p_Err_Code := 'AC-DR-BLOCK'; -- Débit interdit
      RETURN FALSE;
    END IF;

    RETURN TRUE;
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_Err_Code := 'AC-NF-001';
      RETURN FALSE;
    WHEN OTHERS THEN
      IF SQLCODE = -54 THEN -- ORA-00054
        p_Err_Code := 'AC-LOCKED-01';
      ELSE
        p_Err_Code := 'SYS-ERR-999';
      END IF;
      RETURN FALSE;
  END Fn_Validate_Request;

  PROCEDURE Pr_Process_Request(
    p_Branch_Code IN VARCHAR2,
    p_Cust_Ac_No  IN VARCHAR2,
    p_Amount      IN NUMBER,
    p_Txn_Ref_No  IN VARCHAR2,
    p_Status      OUT VARCHAR2,
    p_Err_Code    OUT VARCHAR2
  ) IS
    l_Params VARCHAR2(255);
  BEGIN
    IF NOT Fn_Validate_Request(p_Branch_Code, p_Cust_Ac_No, p_Amount, p_Err_Code, l_Params) THEN
      p_Status := 'REJECTED';
      RETURN;
    END IF;

    -- Note d'ingénierie : Pas de COMMIT ici. La validation finale est portée
    -- par le framework transactionnel de l'adaptateur Gateway ou EOD.
    p_Status := 'ACCEPTED';
    p_Err_Code := NULL;
  EXCEPTION
    WHEN OTHERS THEN
      p_Status := 'FAILED';
      p_Err_Code := SQLERRM;
  END Pr_Process_Request;

END $pkgName;
/''';

    return FlexcubePlSqlProposal(
      packageName: pkgName,
      packageSpec: spec,
      packageBody: body,
      entryPoints: ['Fn_Validate_Request', 'Pr_Process_Request'],
      testCases: [
        'Test 1 : Vérification compte existant et ouvert (Statut nominal attendu)',
        'Test 2 : Tentative sur compte clôturé (Code erreur AC-ACC-001 attendu)',
        'Test 3 : Test de concurrence concurrente avec clause NOWAIT (ORA-00054 géré)',
        'Test 4 : Contrôle de non-émission de COMMIT prématuré dans la session',
      ],
      rollbackScript: 'DROP PACKAGE $pkgName;\nDROP PACKAGE BODY $pkgName;',
    );
  }
}
