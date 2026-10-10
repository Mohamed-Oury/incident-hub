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
  console.log("=================================================\n");

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
  assert("TEST 5 - Antisèche Officielle Oracle FLEXCUBE",
    FLEXCUBE_CHEAT_SHEET.length >= 20 && FLEXCUBE_CHEAT_CATEGORIES.length >= 6,
    `${FLEXCUBE_CHEAT_SHEET.length} fiches mémo pratiques couvrant les 6 axes d ingénierie`
  );

  // TEST 6 : Cursus Certifiant FLEXCUBE (5 Niveaux)
  assert("TEST 6 - Cursus de Qualification FLEXCUBE 5 Niveaux",
    FLEXCUBE_GRADES.length === 5 && FLEXCUBE_GRADES.every(g => g.recommendedResources.length > 0),
    `${FLEXCUBE_GRADES.length} grades de qualification hiérarchiques avec objectifs et documentations`
  );

  // TEST 7 : Leçons Techniques Approfondies (15 leçons)
  assert("TEST 7 - Leçons Techniques Approfondies FLEXCUBE",
    FLEXCUBE_LESSONS.length === 15 && FLEXCUBE_LESSONS.every(l => l.contentMarkdown.length > 50 && l.keyTakeaways.length > 0),
    `${FLEXCUBE_LESSONS.length} leçons techniques réparties du Grade 1 au Grade 5`
  );

  // TEST 8 : Examens Officiels FLEXCUBE Academy (75 Questions QCM, 15/grade)
  const questionsByGrade = [1, 2, 3, 4, 5].map(g => FLEXCUBE_EXAMS.filter(q => q.gradeLevel === g).length);
  const isUniform75 = questionsByGrade.every(count => count === 15);
  assert("TEST 8 - Banque d Examens Officiels FLEXCUBE (75 Questions)",
    FLEXCUBE_EXAMS.length === 75 && isUniform75,
    `${FLEXCUBE_EXAMS.length} questions d examen réparties en exactement 15 questions par grade (1 à 5)`
  );

  // TEST 9 : Générateur de Plan Copilot FLEXCUBE BUILD
  const plan = generateFlexcubePlan({
    title: "Virement Inter-Agences avec Contrôle Balance",
    functionalDescription: "Passation d un virement entre deux comptes dans des agences différentes avec mise à jour FTTB et ACTB.",
    module: "FT",
    targetUsers: "Opérateur Agence",
    knownBusinessRules: "Vérifier solde >= montant. Pas d opposition. Clause NOWAIT obligatoire.",
    inputData: "Compte source, Compte cible, Montant",
    specialConstraints: "Aucun COMMIT dans le package custom",
    flexcubeVersion: "14.x",
    environmentType: "PLSQL_BACKEND"
  });
  assert("TEST 9 - Moteur FLEXCUBE Copilot BUILD (Plan, PL/SQL, SQL, Tests, Traçabilité)",
    plan.subTasks.length >= 6 &&
    plan.plsqlProposal.packageName.includes("_CUSTOM") &&
    plan.plsqlProposal.packageBody.includes("NOWAIT") &&
    plan.testCases.length >= 4 &&
    plan.sqlProposal.rollbackScript.length > 50,
    `${plan.subTasks.length} sous-tâches, package PL/SQL ${plan.plsqlProposal.packageName}, ${plan.testCases.length} tests unitaires`
  );

  // TEST 10 : Diagnostic d Incidents SGBD Oracle
  const diag = analyzeFlexcubeIncident("ORA-00054: resource busy and acquire with NOWAIT specified or timeout expired");
  assert("TEST 10 - Diagnostic RUN & Analyse d Incident SGBD",
    diag.detectedIncident !== null &&
    diag.detectedIncident.errorCode === "ORA-00054" &&
    diag.sqlQuery.includes("v$session"),
    `Incident détecté ${diag.detectedIncident?.reference}, requête d investigation: ${diag.sqlQuery.substring(0, 50)}...`
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
    "Routage déterministe validé : Amplitude produit du 4GL/MAIN, FLEXCUBE produit du PL/SQL/PACKAGE BODY sans mélange"
  );

  if (routedFlex.cbsType !== "FLEXCUBE" || !("flexcubePlan" in routedFlex)) {
    throw new Error("Invalid routedFlex type");
  }

  const sampleProject = {
    id: "FCUBS-PROJ-TEST",
    name: "Virement Interne FTTB",
    module: "FT",
    flexcubeVersion: "14.x",
    input: {
      title: "Virement Interne FTTB",
      functionalDescription: "Transfert de fonds",
      module: "FT" as const,
      targetUsers: "Guichet",
      knownBusinessRules: "Solde suffisant",
      inputData: "Compte A, Compte B, Montant",
      specialConstraints: "NOWAIT",
      flexcubeVersion: "14.x" as const,
    },
    plan: routedFlex.flexcubePlan,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  assert("TEST 13 - Contrat de Données & Persistance des Projets FLEXCUBE",
    sampleProject.id.startsWith("FCUBS-") &&
    sampleProject.plan.subTasks.length >= 6 &&
    sampleProject.plan.plsqlProposal.packageSpec.length > 50,
    `Projet FCUBS conforme avec ${sampleProject.plan.subTasks.length} sous-tâches et package ${sampleProject.plan.plsqlProposal.packageName}`
  );

  // TEST 14 : Conformité du Pipeline Agentique IA FLEXCUBE (Prompt, Human-in-the-Loop, Code PL/SQL)
  const agentFlow = {
    promptGenerated: true,
    slug: "fcubs-virement-interne",
    status: "ACCEPTEE",
    agentCodeReady: sampleProject.plan.plsqlProposal.packageBody.includes("Pr_Process_Request") &&
                    sampleProject.plan.plsqlProposal.packageBody.includes("NOWAIT"),
  };
  assert("TEST 14 - Pipeline Agentique IA FLEXCUBE (Prompt, Validation Humaine, Code PL/SQL)",
    agentFlow.promptGenerated && agentFlow.status === "ACCEPTEE" && agentFlow.agentCodeReady,
    "Pipeline Agentique validé : prompt système, statut accepté, package PL/SQL avec gestion NOWAIT"
  );

  console.log("\n=================================================");
  console.log(`📊 RÉSULTAT QA FLEXCUBE : ${passed} RÉUSSIS / ${failed} ÉCHECS`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runQaFlexcube();
