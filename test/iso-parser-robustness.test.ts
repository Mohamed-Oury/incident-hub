import { parseIso8583Message } from "../modules/knowledge-base/data/iso-message-parser";
import { decodeIsoBitmap } from "../modules/knowledge-base/data/iso-bitmap-decoder";

function runIsoParserTests() {
  console.log("=================================================");
  console.log("🧪 TESTS DE ROBUSTESSE ET PERFORMANCE PARSEUR ISO 8583");
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

  // 1. Trame nominale 0200 standard
  const standard0200 = "02007238200108E1800016497010123456789001000000000005000009171200001234561200000917601105112345678901234123456789012ATM00001COMMERCE0000001AGENCE PRINCIPALE DAKAR  952";
  const r1 = parseIso8583Message(standard0200);
  assert("TEST 1 - Trame 0200 Standard", r1.mti === "0200" && r1.criticalInsights.amount === "500.00" && r1.criticalInsights.pan === "497010******7890", `Champs: ${r1.fields.length}, PAN masqué`);

  // 2. Trame avec préfixe TPDU (10 hex chars)
  const tpduMessage = "600001000002007238200108E1800016497010123456789001000000000005000009171200001234561200000917601105112345678901234123456789012ATM00001COMMERCE0000001AGENCE PRINCIPALE DAKAR  952";
  const r2 = parseIso8583Message(tpduMessage);
  assert("TEST 2 - Détection En-tête TPDU", r2.tpduHeader === "6000010000" && r2.mti === "0200" && r2.criticalInsights.amount === "500.00", `TPDU ${r2.tpduHeader} extrait automatiquement`);

  // 3. Trame avec en-tête ISO (12 carats ISO015000050)
  const isoHeaderMessage = "ISO01500005002007238200108E1800016497010123456789001000000000005000009171200001234561200000917601105112345678901234123456789012ATM00001COMMERCE0000001AGENCE PRINCIPALE DAKAR  952";
  const r3 = parseIso8583Message(isoHeaderMessage);
  assert("TEST 3 - Détection En-tête ISO (ISO015000050)", r3.isoHeader === "ISO015000050" && r3.mti === "0200" && r3.criticalInsights.amount === "500.00", `En-tête ISO extrait sans corrompre le MTI`);

  // 4. Trame avec TCP Length (2 octets hex e.g. 008E)
  const tcpLenMessage = "008E02007238200108E1800016497010123456789001000000000005000009171200001234561200000917601105112345678901234123456789012ATM00001COMMERCE0000001AGENCE PRINCIPALE DAKAR  952";
  const r4 = parseIso8583Message(tcpLenMessage);
  assert("TEST 4 - Détection Préfixe TCP Length", r4.tcpLengthHeader === "008E" && r4.mti === "0200", `Longueur TCP ${r4.tcpLengthHeader} isolée`);

  // 5. Trame avec format Wireshark Hex Dump (multi-lignes)
  const wiresharkDump = `
0000   02 00 72 38 20 01 08 e1 80 00 16 49 70 10 12 34   ..r8 ...Ip.4
0010   56 78 90 01 00 00 00 00 00 05 00 00 09 17 12 00   Vx..............
0020   00 12 34 56 12 00 00 09 17 60 11 05 11 23 45 67   ..4V.....\`...#Eg
0030   89 01 23 41 23 45 67 89 01 24 15 44 41 4b 41 52   ..#A#Eg..$.DAKAR
  `;
  const r5 = parseIso8583Message(wiresharkDump);
  assert("TEST 5 - Décodage Dump Wireshark / TCPDump", r5.detectedFormat === "WIRESHARK_HEX_DUMP" && r5.mti === "0200" && r5.fields.length >= 8, `Octets extraits et décodés`);

  // 6. Trame avec PIN Block (DE52) : Vérifier que DE52 consomme exactement 16 hex chars (et non 64)
  const pinMessage = "02007020000000001000164970101234567890010000000000050000123456A1B2C3D4E5F60718";
  const r6 = parseIso8583Message(pinMessage);
  const de52Field = r6.fields.find(f => f.de === 52);
  assert("TEST 6 - Décodage Précis DE52 (PIN Block 16 hex chars & Masquage)", 
    de52Field !== undefined && 
    de52Field.length === 16 && 
    de52Field.isMasked && 
    r6.criticalInsights.hasPinBlock === true,
    `Taille DE52: ${de52Field?.length} car. (16 hex), statut: ${de52Field?.displayValue}`
  );

  // 7. Trame avec DE55 EMV TLV complet (Longueur 46 carats: 046)
  const emvIso = "020070200000000002001649701012345678900100000000000500001234560469F26084D5E12F9884511A2950500000480009F3602005A";
  const r7 = parseIso8583Message(emvIso);
  const de55Field = r7.fields.find(f => f.de === 55);
  assert("TEST 7 - Décomposition Automatique DE55 EMV TLV",
    de55Field !== undefined &&
    de55Field.emvTags !== undefined &&
    de55Field.emvTags.length >= 3 &&
    r7.criticalInsights.emvParsed !== undefined,
    `${de55Field?.emvTags?.length} tags EMV extraits automatiquement dans DE55`
  );

  // 8. Trame Réponse Rejet 51 (Fonds insuffisants) avec DE38 & DE39
  const rejMessage = "0210702000000600000016497010123456789001000000000005000012345698765451";
  const r8 = parseIso8583Message(rejMessage);
  assert("TEST 8 - Diagnostic Enrichi Rejet DE39 (51 Insufficient Funds)",
    r8.criticalInsights.responseCode === "51" &&
    r8.criticalInsights.responseDescription?.includes("51") &&
    Boolean(r8.criticalInsights.diagnosticAdvice),
    `Diagnostic: ${r8.criticalInsights.responseDescription}`
  );

  // 9. Trame Reversal / Extourne 0420 avec DE90 (Original Data Elements)
  // Bitmap 128 bits: Block 1 = 8000000000000000, Block 2 = 0000004000000000 (Bit 90 actif)
  const de90Data = "020012345609171200000000001234500000012345";
  const reversalIso = `042080000000000000000000004000000000${de90Data}`;
  const r9 = parseIso8583Message(reversalIso);
  const de90Field = r9.fields.find(f => f.de === 90);
  assert("TEST 9 - Décodage Extourne 0420 & DE90 Original Elements",
    r9.mti === "0420" &&
    de90Field !== undefined &&
    de90Field.length === 42 &&
    de90Field.interpretation?.includes("MTI=0200"),
    `DE90: ${de90Field?.interpretation}`
  );

  // 10. Trame avec espaces multiples et caractères parasites
  const messyIso = "  0200   7238200108E18000 \n 164970101234567890 | 010000 | 000000050000 | 0917120000 | 123456 | 120000 | 0917 | 6011 | 051 | 12345678901234 | 123456789012 | ATM00001 | COMMERCE0000001 | AGENCE PRINCIPALE DAKAR  | 952 ";
  const r10 = parseIso8583Message(messyIso);
  assert("TEST 10 - Résilience Trames Brutes (Espaces, Pipes, Retours Chariot)",
    r10.mti === "0200" &&
    r10.criticalInsights.amount === "500.00" &&
    r10.fields.length >= 10,
    `${r10.fields.length} champs extraits sans la moindre erreur`
  );

  console.log("\n=================================================");
  console.log(`📊 BILAN DU TEST DE ROBUSTESSE : ${passed} RÉUSSIS / ${failed} ÉCHECS`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runIsoParserTests();
