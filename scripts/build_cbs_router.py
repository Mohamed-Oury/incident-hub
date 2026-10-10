router_ts = """// modules/cbs/router/cbs-router.ts
import { CbsType, CbsWorkMode, SUPPORTED_CBS_PLATFORMS } from "./cbs-context";
import { DevelopmentNeedInput, CopilotFullPlan } from "../copilot/types";
import { generateCopilotPlan } from "../copilot/engine";
import { FlexcubeNeedInput, FlexcubeFullPlan } from "../flexcube/types";
import { generateFlexcubePlan, analyzeFlexcubeIncident, reviewFlexcubePlSql } from "../flexcube/engine/flexcube-copilot-engine";
import { analyzeCbsFailure, review4GlCode } from "../copilot/engine";

export type CbsAnalysisRequest =
  | {
      cbsType: "AMPLITUDE";
      mode: "BUILD";
      amplitudeInput: DevelopmentNeedInput;
    }
  | {
      cbsType: "AMPLITUDE";
      mode: "RUN";
      errorOrLog: string;
    }
  | {
      cbsType: "FLEXCUBE";
      mode: "BUILD";
      flexcubeInput: FlexcubeNeedInput;
    }
  | {
      cbsType: "FLEXCUBE";
      mode: "RUN";
      errorOrLog: string;
    };

export type CbsAnalysisResponse =
  | {
      cbsType: "AMPLITUDE";
      mode: "BUILD";
      amplitudePlan: CopilotFullPlan;
    }
  | {
      cbsType: "AMPLITUDE";
      mode: "RUN";
      amplitudeDiagnosis: ReturnType<typeof analyzeCbsFailure>;
    }
  | {
      cbsType: "FLEXCUBE";
      mode: "BUILD";
      flexcubePlan: FlexcubeFullPlan;
    }
  | {
      cbsType: "FLEXCUBE";
      mode: "RUN";
      flexcubeDiagnosis: ReturnType<typeof analyzeFlexcubeIncident>;
    };

export class CBSRouter {
  /**
   * Routage déterministe garantissant une étanchéité complète entre Amplitude et FLEXCUBE
   */
  public static route(request: CbsAnalysisRequest): CbsAnalysisResponse {
    if (request.cbsType === "AMPLITUDE") {
      if (request.mode === "BUILD") {
        const plan = generateCopilotPlan(request.amplitudeInput);
        return {
          cbsType: "AMPLITUDE",
          mode: "BUILD",
          amplitudePlan: plan,
        };
      } else {
        const diagnosis = analyzeCbsFailure(request.errorOrLog);
        return {
          cbsType: "AMPLITUDE",
          mode: "RUN",
          amplitudeDiagnosis: diagnosis,
        };
      }
    } else if (request.cbsType === "FLEXCUBE") {
      if (request.mode === "BUILD") {
        const plan = generateFlexcubePlan(request.flexcubeInput);
        return {
          cbsType: "FLEXCUBE",
          mode: "BUILD",
          flexcubePlan: plan,
        };
      } else {
        const diagnosis = analyzeFlexcubeIncident(request.errorOrLog);
        return {
          cbsType: "FLEXCUBE",
          mode: "RUN",
          flexcubeDiagnosis: diagnosis,
        };
      }
    }

    throw new Error(`CBS non pris en charge`);
  }

  /**
   * Revue de code spécialisée par CBS
   */
  public static reviewCode(cbsType: CbsType, code: string) {
    if (cbsType === "AMPLITUDE") {
      return {
        cbsType,
        language: "Informix 4GL / Genero BDL",
        findings: review4GlCode(code),
      };
    } else {
      const result = reviewFlexcubePlSql(code);
      return {
        cbsType,
        language: "Oracle PL/SQL",
        findings: result.issues,
        score: result.score,
      };
    }
  }

  /**
   * Récupération des métadonnées de la plateforme
   */
  public static getPlatformInfo(cbsType: CbsType) {
    return SUPPORTED_CBS_PLATFORMS[cbsType];
  }
}
"""

with open("modules/cbs/router/cbs-router.ts", "w", encoding="utf-8") as f:
    f.write(router_ts)
print("Created cbs-router.ts")
