import { FLEXCUBE_SCHEMA_TABLES } from "../modules/cbs/flexcube/data/flexcube-schema-tables";
import { FLEXCUBE_AEOD_STEPS, FLEXCUBE_AEOD_SCENARIOS } from "../modules/cbs/flexcube/data/flexcube-aeod-data";
import { FLEXCUBE_INCIDENTS } from "../modules/cbs/flexcube/data/flexcube-incidents-data";
import { FLEXCUBE_CHEAT_SHEET, FLEXCUBE_CHEAT_CATEGORIES } from "../modules/cbs/flexcube/data/flexcube-cheat-sheet-data";
import { FLEXCUBE_GRADES, FLEXCUBE_LESSONS, FLEXCUBE_EXAMS } from "../modules/cbs/flexcube/data/flexcube-training-data";
import { generateFlexcubePlan, analyzeFlexcubeIncident, reviewFlexcubePlSql, resolveFlexcubeTables } from "../modules/cbs/flexcube/engine/flexcube-copilot-engine";
import { CBSRouter } from "../modules/cbs/router/cbs-router";

function runQaFlexcube() {
  console.log("=================================================");
  console.log("🚀 QA TEST ORACLE FLEXCUBE & MULTI-CBS ROUTER");
  console.log("=================================================\\n");

  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`✅ ${name}${details ? ` : ${details}` : ""}`);
      passed++;
    } else {
      console.error(`❌ ${name} ÉCHOUÉ ${details ? ` : ${details}` : ""}`);
      failed++;
    }
  }

  // TEST 1 : Dictionnaire Tables FLEXCUBE (ST, AC, GL, CL, FT, AEOD, GW)
  const hasKeyTables = ["STTM_CUSTOMER", "STTM_CUST_ACCOUNT", "ACTB_DAILY_LOG", "GLTB_GL_BALANCES", "FTTB_CONTRACT_MASTER", "AETB_PROCESS_PROGRESS"].every(t =>
    FLEXCUBE_SCHEMA_TABLES.some(tbl => tbl.tableName === t)
  );
  assert("TEST 1 - Référentiel Schéma Tables Oracle FLEXCUBE",
    FLEXCUBE_SCHEMA_TABLES.length >= 15 && hasKeyTables,
    `${FLEXCUBE_SCHEMA_TABLES.length} tables centrales documentées (ST, AC, GL, FT, CL, AEOD, GW)`
  );

  // TEST 2 : Chaîne Batch AEOD (5 phases, 10 étapes)
  const hasAllPhases = ["PEOD", "EOTI", "EOFI", "EOD", "BOD"].every(p =>
    FLEXCUBE_AEOD_STEPS.some(s => s.phaseCode === p)
  );
  assert("TEST 2 - Chaîne de Clôture Batch AEOD",
    FLEXCUBE_AEOD_STEPS.length === 10 && hasAllPhases,
    `${FLEXCUBE_AEOD_STEPS.length} étapes réparties sur les 5 phases (PEOD, EOTI, EOFI, EOD, BOD)`
  );

  // TEST 3 : Scénarios de diagnostic de blocage AEOD
  assert("TEST 3 - Scénarios de Dépannage d Urgence AEOD",
    FLEXCUBE_AEOD_SCENARIOS.length >= 5 && FLEXCUBE_AEOD_SCENARIOS.every(s => s.sqlDiagnostic.length > 0),
    `${FLEXCUBE_AEOD_SCENARIOS.length} scénarios documentés avec requêtes SQL de diagnostic`
  );

  // TEST 4 : Base d incidents de production RUN (20 cas)
  const hasCriticalErrors = ["ORA-00054", "ORA-01555", "ORA-00001", "AC-VAL-001", "GW-RESP-01"].every(err =>
    FLEXCUBE_INCIDENTS.some(i => i.errorCode === err)
  );
  assert("TEST 4 - Catalogue Incidents & RCA Oracle FLEXCUBE RUN",
    FLEXCUBE_INCIDENTS.length >= 20 && hasCriticalErrors,
    `${FLEXCUBE_INCIDENTS.length} fiches incidents RUN avec RCA et requêtes d investigation`
  );

  // TEST 5 : Antisèche Oracle FLEXCUBE (20 fiches mémo sur 6 catégories)
  const allCheatCatsCovered = ["ARCHITECTURE", "SCHEMA", "PLSQL", "AEOD", "RUN_INCIDENTS", "GATEWAY"].every(cat =>
    FLEXCUBE_CHEAT_SHEET.some(c => c.category === cat)
  );
  assert("TEST 5 - Antisèche Officielle Oracle FLEXCUBE",
    FLEXCUBE_CHEAT_SHEET.length >= 18 && allCheatCatsCovered,
    `${FLEXCUBE_CHEAT_SHEET.length} fiches mémo pratiques couvrant les 6 axes d ingénierie`
  );

  // TEST 6 : Cursus Certifiant FLEXCUBE 5 Niveaux
  assert("TEST 6 - Cursus de Qualification FLEXCUBE 5 Niveaux",
    FLEXCUBE_GRADES.length === 5 && FLEXCUBE_GRADES.every(g => g.recommendedResources.length >= 3),
    `${FLEXCUBE_GRADES.length} grades de qualification hiérarchiques avec objectifs et documentations`
  );

  // TEST 7 : Leçons Techniques Approfondies FLEXCUBE
  assert("TEST 7 - Leçons Techniques Approfondies FLEXCUBE",
    FLEXCUBE_LESSONS.length >= 15 && [1, 2, 3, 4, 5].every(lvl => FLEXCUBE_LESSONS.some(l => l.gradeLevel === lvl)),
    `${FLEXCUBE_LESSONS.length} leçons techniques réparties du Grade 1 au Grade 5`
  );

  // TEST 8 : Banque d Examens Officiels de Certification (75 questions, 15/grade)
  const exact15PerGrade = [1, 2, 3, 4, 5].every(lvl =>
    FLEXCUBE_EXAMS.filter(q => q.gradeLevel === lvl).length === 15
  );
  assert("TEST 8 - Banque d Examens Officiels FLEXCUBE (75 Questions)",
    FLEXCUBE_EXAMS.length === 75 && exact15PerGrade,
    `${FLEXCUBE_EXAMS.length} questions d examen réparties en exactement 15 questions par grade (1 à 5)`
  );

  // TEST 9 : Moteur Copilot FLEXCUBE BUILD (Génération PL/SQL)
  const flexPlan = generateFlexcubePlan({
    title: "Virement inter-agences avec contrôle solde disponible",
    functionalDescription: "Débit d un compte client dans STTM_CUST_ACCOUNT et virement avec contrôle de provision et verrouillage NOWAIT.",
    module: "FT",
    targetUsers: "Gestionnaire Agence",
    knownBusinessRules: "Contrôle solde disponible > montant et absence de blocage",
    inputData: "Code agence, Compte donneur d ordre, Montant",
    specialConstraints: "Temps < 300ms, gestion ORA-00054",
    flexcubeVersion: "14.x",
    environmentType: "PLSQL_BACKEND"
  });
  assert("TEST 9 - Moteur FLEXCUBE Copilot BUILD (Plan, PL/SQL, SQL, Tests, Traçabilité)",
    flexPlan.subTasks.length >= 5 &&
    flexPlan.plsqlProposal.packageBody.includes("FOR UPDATE NOWAIT") &&
    flexPlan.plsqlProposal.packageBody.includes("RESOURCE_BUSY") &&
    flexPlan.testCases.length >= 4 &&
    flexPlan.traceability.versionCaveat.includes("14.x"),
    `${flexPlan.subTasks.length} sous-tâches, package PL/SQL ${flexPlan.plsqlProposal.packageName}, ${flexPlan.testCases.length} tests unitaires`
  );

  // TEST 10 : Moteur RUN Diagnostic d Incident FLEXCUBE
  const diagRes = analyzeFlexcubeIncident("ORA-00054 resource busy and acquire with NOWAIT specified on ACTB_DAILY_LOG");
  assert("TEST 10 - Diagnostic RUN & Analyse d Incident SGBD",
    diagRes.detectedIncident !== null &&
    diagRes.detectedIncident.errorCode === "ORA-00054" &&
    diagRes.sqlQuery.includes("v$locked_object"),
    `Incident détecté ${diagRes.detectedIncident?.reference}, requête d investigation: ${diagRes.sqlQuery.substring(0, 45)}...`
  );

  // TEST 11 : Audit & Revue de Code PL/SQL FLEXCUBE
  const reviewRes = reviewFlexcubePlSql("CREATE PROCEDURE test_p IS BEGIN SELECT * FROM STTM_CUST_ACCOUNT FOR UPDATE; COMMIT; END;");
  assert("TEST 11 - Revue de Qualité de Code PL/SQL",
    reviewRes.issues.length >= 2 &&
    reviewRes.issues.some(i => i.message.includes("COMMIT")) &&
    reviewRes.issues.some(i => i.message.includes("NOWAIT")),
    `Revue détecte ${reviewRes.issues.length} anomalies critiques (COMMIT prématuré et FOR UPDATE sans NOWAIT)`
  );

  // TEST 12 : Routeur Central CBSRouter (Routage Déterministe Multi-CBS)
  const routedAmp = CBSRouter.route({
    cbsType: "AMPLITUDE",
    mode: "BUILD",
    amplitudeInput: {
      title: "Consultation solde BKCPT",
      functionalDescription: "Consultation solde compte client",
      bankingDomain: "Comptes",
      targetUsers: "Gestionnaire",
      knownBusinessRules: "Contrôle BKCPT",
      inputData: "Compte",
      specialConstraints: "Aucune",
      amplitudeVersion: "v11.x",
      technicalEnvironment: "Informix / AIX"
    }
  });

  const routedFlex = CBSRouter.route({
    cbsType: "FLEXCUBE",
    mode: "BUILD",
    flexcubeInput: {
      title: "Ouverture compte STTM_CUST_ACCOUNT",
      functionalDescription: "Création d un compte client",
      module: "ST",
      targetUsers: "Agent",
      knownBusinessRules: "Contrôle KYC",
      inputData: "Client, Devise",
      specialConstraints: "Aucune",
      flexcubeVersion: "12.4"
    }
  });

  assert("TEST 12 - Routeur Centralisé CBSRouter & Isolation Multi-CBS",
    routedAmp.cbsType === "AMPLITUDE" &&
    routedAmp.mode === "BUILD" &&
    "amplitudePlan" in routedAmp &&
    routedAmp.amplitudePlan.code4GlProposal.code4Gl.includes("MAIN") &&
    routedFlex.cbsType === "FLEXCUBE" &&
    routedFlex.mode === "BUILD" &&
    "flexcubePlan" in routedFlex &&
    routedFlex.flexcubePlan.plsqlProposal.packageBody.includes("PACKAGE BODY"),
    `Routage déterministe validé : Amplitude produit du 4GL/MAIN, FLEXCUBE produit du PL/SQL/PACKAGE BODY sans mélange`
  );

  console.log("\\n=================================================");
  console.log(`📊 RÉSULTAT QA FLEXCUBE : ${passed} RÉUSSIS / ${failed} ÉCHECS`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runQaFlexcube();
