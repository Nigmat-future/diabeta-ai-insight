
/**
 * diabetesAi.ts
 * AI糖尿病分析通信，支持多个AI提供商
 */

import { callAiApi } from './aiProviders';

export interface PatientData {
  hba1c: string;       // 糖化血红蛋白
  fbg: string;         // 灰管/黄管血糖
  biochem: string;     // 其他生化项目（如AST/ALT等，逗号分隔）
  hormones: string;    // 激素项目
  [key: string]: string;
}

export interface AiDiagnosisResult {
  possibility: string;      // "高风险"/"低风险"等
  suggestion: string;       // 进一步建议
  reason: string;           // 诊断依据
}

export interface DiagnosisOptions {
  provider: string;
  apiKey: string;
}

export async function aiDiagnosePatient(
  input: PatientData, 
  options?: DiagnosisOptions
): Promise<AiDiagnosisResult> {
  // 如果没有提供AI配置，使用模拟分析
  if (!options || !options.apiKey) {
    return await simulatedDiagnosis(input);
  }

  try {
    console.log('调用AI诊断服务:', options.provider);
    const aiResponse = await callAiApi({
      provider: options.provider,
      apiKey: options.apiKey,
      prompt: '', // 在aiProviders中构建
      patientData: input
    });

    // 尝试解析AI返回的JSON
    try {
      const parsedResult = JSON.parse(aiResponse);
      if (parsedResult.possibility && parsedResult.suggestion && parsedResult.reason) {
        return {
          possibility: String(parsedResult.possibility).replace(/^`+json\s*/i, '').replace(/`+$/g, '').trim(),
          suggestion: String(parsedResult.suggestion).replace(/^`+json\s*/i, '').replace(/`+$/g, '').trim(),
          reason: String(parsedResult.reason).replace(/^`+json\s*/i, '').replace(/`+$/g, '').trim(),
        };
      }
    } catch (parseError) {
      console.warn('AI返回结果解析失败，使用文本解析:', parseError);
    }

    // 如果JSON解析失败，尝试从文本中提取信息
    return parseAiTextResponse(aiResponse, input);
  } catch (error) {
    console.error('AI诊断失败，回退到模拟诊断:', error);
    // 回退到模拟诊断
    return await simulatedDiagnosis(input);
  }
}

function parseAiTextResponse(aiResponse: string, input: PatientData): AiDiagnosisResult {
  // 去除可能的 ```json、``` 等包裹
  let response = aiResponse.replace(/^[`]*json[\s\n]*/i, "").replace(/[`]*$/g, "").trim();

  // 简单的文本解析逻辑
  const hba1c = parseFloat(input.hba1c);
  const fbg = parseFloat(input.fbg);

  let possibility = "无法确定";
  if (hba1c >= 6.5 || fbg >= 7) {
    possibility = "糖尿病高风险";
  } else if (hba1c >= 6.0 || fbg >= 6.1) {
    possibility = "糖尿病风险中等";
  } else {
    possibility = "风险较低";
  }

  // **完整保留全部 reason/suggestion 内容**
  return {
    possibility,
    suggestion: response || "AI建议：请结合临床进一步确诊",
    reason: response || "基于AI分析，详见建议内容",  // 若无法区分就同样返回
  };
}

async function simulatedDiagnosis(input: PatientData): Promise<AiDiagnosisResult> {
  // 模拟网络延迟
  await new Promise(res => setTimeout(res, 1200));

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
    reason = `患者糖化血红蛋白 ${input.hba1c}%，血糖 ${input.fbg} mmol/L，均已超过糖尿病诊断阈值。根据WHO诊断标准，糖化血红蛋白≥6.5%或空腹血糖≥7.0mmol/L可诊断为糖尿病。该患者的检验结果显示存在明显的血糖代谢异常，提示胰岛β细胞功能受损，胰岛素分泌不足或胰岛素抵抗。`;
  } else if (hba1c >= 6.0 || fbg >= 6.1) {
    possibility = "糖尿病风险中等";
    suggestion = "建议定期复查，注意生活干预，控制饮食和加强运动";
    reason = `患者指标接近糖尿病临界值（HbA1c: 6.0~6.5%，血糖: 6.1~7.0mmol/L）。该范围通常被称为糖尿病前期或糖调节受损状态，表明患者存在一定程度的胰岛素抵抗或胰岛功能下降，但尚未达到糖尿病诊断标准。此阶段通过积极的生活方式干预仍有可能逆转或延缓糖尿病的发生。`;
  } else {
    possibility = "风险较低";
    suggestion = "建议日常健康管理，保持均衡饮食和适量运动";
    reason = `各项检测均未超过糖尿病判定标准。患者糖化血红蛋白${input.hba1c}%和血糖${input.fbg}mmol/L均在正常范围内，表明当前血糖代谢功能良好，胰岛功能正常。建议继续保持健康的生活方式，定期体检监测。`;
  }
  
  // 针对复杂情况的补检建议
  if ((input.biochem.includes("ALT") || input.biochem.includes("AST")) && !input.hormones) {
    suggestion += " 考虑到肝功能指标异常，建议补充胰岛素、C肽等激素项目检查，以全面评估胰岛功能状态。";
  }
  
  return { possibility, suggestion, reason };
}
