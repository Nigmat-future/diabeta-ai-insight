
import React, { useState } from "react";
import PatientForm from "@/components/PatientForm";
import DiagnosisResult from "@/components/DiagnosisResult";
import DiagnosisReason from "@/components/DiagnosisReason";
import AiProviderSelector from "@/components/AiProviderSelector";
import { aiDiagnosePatient, PatientData, AiDiagnosisResult } from "@/lib/diabetesAi";
import { toast } from "@/hooks/use-toast";
import { Brain, Database, Stethoscope, Zap } from "lucide-react";

const Index = () => {
  const [inputData, setInputData] = useState<PatientData | null>(null);
  const [aiRes, setAiRes] = useState<AiDiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");

  // 显示用户已录入的数据
  const renderDataTable = () => {
    if (!inputData) return null;
    const dataShow = [
      { label: "糖化血红蛋白", value: inputData.hba1c, unit: "%", icon: <Stethoscope size={16} /> },
      { label: "血糖", value: inputData.fbg, unit: "mmol/L", icon: <Zap size={16} /> },
      { label: "其他生化项目", value: inputData.biochem, icon: <Database size={16} /> },
      { label: "激素项目", value: inputData.hormones, icon: <Brain size={16} /> }
    ].filter(d => d.value && d.value !== "");
    
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-700 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Database className="text-cyan-400" size={20} />
          <div className="font-semibold text-white">数据总览</div>
        </div>
        <div className="space-y-3">
          {dataShow.map(d => (
            <div key={d.label} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
              <div className="flex items-center gap-3">
                <div className="text-cyan-400">{d.icon}</div>
                <span className="text-slate-300 text-sm">{d.label}</span>
              </div>
              <div className="text-white font-medium">
                {d.value} <span className="text-slate-400 text-xs">{d.unit || ""}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  async function handleFormSubmit(data: PatientData) {
    setInputData(data);
    setLoading(true);
    try {
      const diagnosisOptions = apiKey ? { provider: selectedProvider, apiKey } : undefined;
      const res = await aiDiagnosePatient(data, diagnosisOptions);
      setAiRes(res);
      
      toast({
        title: "AI诊断完成",
        description: `风险评估: ${res.possibility}`,
        variant: res.possibility.includes("高风险") ? "destructive" : "default",
      });
    } catch (err: any) {
      toast({
        title: "诊断服务异常",
        description: err?.message || "AI诊断失败，请检查配置或稍后重试。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* 科技感背景效果 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      {/* 顶部导航栏 */}
      <header className="relative backdrop-blur-md bg-slate-900/80 border-b border-slate-700 shadow-2xl">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <Brain className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  AI 智能糖尿病诊断系统
                </h1>
                <p className="text-slate-400 text-sm mt-1">基于深度学习的医学诊断辅助平台</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">系统在线</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="relative flex flex-col xl:flex-row gap-8 px-8 py-8 max-w-7xl mx-auto">
        {/* 左侧面板 */}
        <aside className="xl:w-96 space-y-6">
          <AiProviderSelector
            selectedProvider={selectedProvider}
            apiKey={apiKey}
            onProviderChange={setSelectedProvider}
            onApiKeyChange={setApiKey}
          />
          
          <PatientForm onSubmit={handleFormSubmit} loading={loading} />
          
          {inputData && (
            <div className="animate-fade-in">
              {renderDataTable()}
            </div>
          )}
        </aside>

        {/* 右侧诊断结果区域 */}
        <section className="flex-1 space-y-6">
          {aiRes ? (
            <div className="space-y-6 animate-fade-in">
              <DiagnosisResult possibility={aiRes.possibility} suggestion={aiRes.suggestion} />
              <DiagnosisReason reason={aiRes.reason} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
              <div className="p-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 mb-6">
                <Brain className="text-blue-400" size={64} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">AI诊断引擎待命中</h3>
              <p className="text-slate-400 max-w-md">
                请在左侧完成患者检验数据录入和AI配置，然后启动智能诊断分析
              </p>
              <div className="mt-6 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  <span>支持多种AI模型</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  <span>医学级精准分析</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  <span>实时诊断建议</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* 页脚 */}
      <footer className="relative backdrop-blur-md bg-slate-900/50 border-t border-slate-700 py-4 mt-auto">
        <div className="text-center text-xs text-slate-500">
          基于 AI 深度学习技术 · 医学研究与教学用途 · 请勿用于实际临床诊断
        </div>
      </footer>
    </div>
  );
};

export default Index;
