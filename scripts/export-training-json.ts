import fs from "fs";
import path from "path";
import { MONETIQUE_GRADES, MONETIQUE_LESSONS } from "../modules/training-monetique/data";
import { MONETIQUE_EXAMS } from "../modules/training-monetique/exams-data";
import { CBS_4GL_GRADES, CBS_4GL_LESSONS, CBS_4GL_EXAMS } from "../modules/cbs/cbs-4gl-data";

const outDir = path.join(process.cwd(), "mobile/assets/data");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outDir, "training_monetique.json"),
  JSON.stringify({
    grades: MONETIQUE_GRADES,
    lessons: MONETIQUE_LESSONS,
    exams: MONETIQUE_EXAMS,
  }, null, 2),
  "utf-8"
);

fs.writeFileSync(
  path.join(outDir, "training_cbs_4gl.json"),
  JSON.stringify({
    grades: CBS_4GL_GRADES,
    lessons: CBS_4GL_LESSONS,
    exams: CBS_4GL_EXAMS,
  }, null, 2),
  "utf-8"
);

console.log("JSON export successful!");
