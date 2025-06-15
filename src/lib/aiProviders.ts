
/**
 * AI服务提供商配置和API调用
 */

export interface AiProvider {
  name: string;
  displayName: string;
  apiUrl: string;
  modelName: string;
}

export const AI_PROVIDERS: Record<string, AiProvider> = {
  openai: {
    name: 'openai',
    displayName: 'ChatGPT',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    modelName: 'gpt-4'
  },
  claude: {
    name: 'claude',
    displayName: 'Claude',
    apiUrl: 'https://api.anthropic.com/v1/messages',
    modelName: 'claude-3-sonnet-20240229'
  },
  gemini: {
    name: 'gemini',
    displayName: 'Gemini',
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    modelName: 'gemini-pro'
  },
  deepseek: {
    name: 'deepseek',
    displayName: 'DeepSeek',
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    modelName: 'deepseek-chat'
  },
  qwen: {
    name: 'qwen',
    displayName: 'Qwen',
    apiUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    modelName: 'qwen-turbo'
  }
};

export interface ApiCallOptions {
  provider: string;
  apiKey: string;
  prompt: string;
  patientData: any;
}

export async function callAiApi(options: ApiCallOptions): Promise<string> {
  const provider = AI_PROVIDERS[options.provider];
  if (!provider) {
    throw new Error(`不支持的AI提供商: ${options.provider}`);
  }

  const prompt = createDiagnosisPrompt(options.patientData);
  
  try {
    let response;
    
    switch (options.provider) {
      case 'openai':
      case 'deepseek':
        response = await callOpenAICompatible(provider, options.apiKey, prompt);
        break;
      case 'claude':
        response = await callClaude(provider, options.apiKey, prompt);
        break;
      case 'gemini':
        response = await callGemini(provider, options.apiKey, prompt);
        break;
      case 'qwen':
        response = await callQwen(provider, options.apiKey, prompt);
        break;
      default:
        throw new Error(`未实现的AI提供商: ${options.provider}`);
    }
    
    return response;
  } catch (error: any) {
    console.error(`AI API调用失败 (${provider.displayName}):`, error);
    throw new Error(`AI诊断服务暂时不可用: ${error.message || '未知错误'}`);
  }
}

function createDiagnosisPrompt(patientData: any): string {
  return `作为专业的医学AI诊断助手，请根据以下患者检验数据进行糖尿病风险评估：

患者数据：
- 糖化血红蛋白(HbA1c): ${patientData.hba1c}%
- 血糖: ${patientData.fbg} mmol/L
- 其他生化项目: ${patientData.biochem || '无'}
- 激素项目: ${patientData.hormones || '无'}

请以JSON格式返回诊断结果，包含以下字段：
{
  "possibility": "糖尿病风险等级（高风险/中等风险/低风险/无法判断）",
  "suggestion": "具体的医疗建议和后续检查建议",
  "reason": "详细的诊断依据和医学解释"
}

参考标准：
- HbA1c ≥6.5% 或 血糖 ≥7.0 mmol/L：高风险
- HbA1c 6.0-6.4% 或 血糖 6.1-6.9 mmol/L：中等风险
- 正常值以下：低风险

请确保返回的是标准JSON格式，不要包含其他文字。`;
}

async function callOpenAICompatible(provider: AiProvider, apiKey: string, prompt: string): Promise<string> {
  const response = await fetch(provider.apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: provider.modelName,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function callClaude(provider: AiProvider, apiKey: string, prompt: string): Promise<string> {
  const response = await fetch(provider.apiUrl, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: provider.modelName,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0]?.text || '';
}

async function callGemini(provider: AiProvider, apiKey: string, prompt: string): Promise<string> {
  const response = await fetch(`${provider.apiUrl}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1000
      }
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || '';
}

async function callQwen(provider: AiProvider, apiKey: string, prompt: string): Promise<string> {
  const response = await fetch(provider.apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: provider.modelName,
      input: {
        messages: [{ role: 'user', content: prompt }]
      },
      parameters: {
        temperature: 0.3,
        max_tokens: 1000
      }
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.output?.text || '';
}
