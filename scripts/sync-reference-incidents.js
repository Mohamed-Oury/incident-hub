const fs = require("fs");
const path = require("path");

const all200 = JSON.parse(
  fs.readFileSync(path.join(__dirname, "all-200-incidents.json"), "utf-8")
);

const lines = [];
lines.push('export type ReferenceIncident = {');
lines.push('  reference: string;');
lines.push('  title: string;');
lines.push('  domain: string;');
lines.push('  component: string;');
lines.push('  analysisKeys: string;');
lines.push('  knowledgeStatus: "REFERENCE_SCENARIO" | "VALIDATED";');
lines.push('};');
lines.push('');
lines.push('export const referenceIncidents: ReferenceIncident[] = [');

all200.forEach((item, index) => {
  const num = parseInt(item.ref.replace("INC-", ""), 10);
  const status = num <= 195 ? "VALIDATED" : "REFERENCE_SCENARIO";
  const isLast = index === all200.length - 1;
  lines.push(`  {`);
  lines.push(`    reference: ${JSON.stringify(item.ref)},`);
  lines.push(`    title: ${JSON.stringify(item.title)},`);
  lines.push(`    domain: ${JSON.stringify(item.domain)},`);
  lines.push(`    component: ${JSON.stringify(item.component)},`);
  lines.push(`    analysisKeys: ${JSON.stringify(item.keys)},`);
  lines.push(`    knowledgeStatus: ${JSON.stringify(status)} as const,`);
  lines.push(`  }${isLast ? "" : ","}`);
});

lines.push('];');
lines.push('');

fs.writeFileSync(
  path.join(__dirname, "../app/reference-incidents.ts"),
  lines.join("\n"),
  "utf-8"
);

console.log("Fichier app/reference-incidents.ts mis à jour avec 200 incidents !");
