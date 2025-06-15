
/**
 * diabetesAi.ts
 * 假想的AI糖尿病分析通信，模拟AI诊断
 */

export interface PatientData {
  hba1c: string;       // 糖化血红蛋白
  fbg: string;         // 灰管/黄管血糖
  biochem: string;     // 其他生化项目（如AST/ALT等，逗号分隔）
  hormones: string;    // 激素项目
  [key: string]: string;
}

export interface AiDiagnosisResult {
  possibility: string;      // “高风险”/“低风险”等
  suggestion: string;       // 进一步建议
  reason: string;           // 诊断依据
}

export async function aiDiagnosePatient(input: PatientData): Promise<AiDiagnosisResult> {
  // 模拟AI分析（真实场景下此处应发送至后端或AI服务）
  await new Promise(res => setTimeout(res, 1200)); // 模拟网络延迟

  // 简单规则：糖化血红蛋白 ≥6.5% 或 血糖 ≥7mmol/L 认为高风险
  const hba1c = parseFloat(input.hba1c);
  const fbg = parseFloat(input.fbg);
  let possibility = "";
  let suggestion = "";
  let reason = "";
  if (!input.hba1c || !input.fbg) {
    possibility = "无法判断";
    suggestion = "请完善所有必填项目（糖化血红蛋白、血糖）";
    reason = "缺少关键指标（糖化血红蛋白和/或血糖），无法准确评估糖尿病风险。";
  } else if (hba1c >= 6.5 || fbg >= 7) {
    possibility = "糖尿病高风险";
    suggestion = input.biochem === "" ? "建议补充生化全套检查" : "建议结合临床进一步确诊";
    reason = `患者糖化血红蛋白 ${input.hba1c}%，血糖 ${input.fbg} mmol/L，均已超过糖尿病诊断阈值。`;
  } else if (hba1c >= 6.0 || fbg >= 6.1) {
    possibility = "糖尿病风险中等";
    suggestion = "建议定期复查，注意生活干预";
    reason = `患者指标接近糖尿病临界值（HbA1c: 6.0~6.5%，血糖: 6.1~7.0mmol/L）。`;
  } else {
    possibility = "风险较低";
    suggestion = "建议日常健康管理";
    reason = `各项检测均未超过糖尿病判定标准。`;
  }
  // 针对复杂情况的补检建议
  if ((input.biochem.includes("ALT") || input.biochem.includes("AST")) && !input.hormones) {
    suggestion += " - 建议补充激素项目以排查其他代谢异常。";
  }
  return { possibility, suggestion, reason };
}
