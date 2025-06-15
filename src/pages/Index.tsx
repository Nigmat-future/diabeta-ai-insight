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

  // Adjusted English titles, text, and color classes!
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#16182a] via-[#232452] to-[#251640]">
      {/* Futuristic effect overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(80,150,255,0.10),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      {/* Top Nav */}
      <header className="relative backdrop-blur-md bg-[#1b1f37]/90 border-b border-[#343677] shadow-2xl">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#4e75e6] to-[#59eaff] shadow-lg">
                <Brain className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#82afff] to-[#33ffe6] bg-clip-text text-transparent">
                  AI Diabetes Diagnosis System
                </h1>
                <p className="text-[#8fa8d4] text-sm mt-1">A deep learning powered medical diagnosis assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#97b9f8]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex flex-col xl:flex-row gap-8 px-8 py-8 max-w-7xl mx-auto">
        {/* Left Panel */}
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

        {/* Right Diagnosis Area */}
        <section className="flex-1 space-y-6">
          {aiRes ? (
            <div className="space-y-6 animate-fade-in">
              <DiagnosisResult possibility={aiRes.possibility} suggestion={aiRes.suggestion} />
              <DiagnosisReason reason={aiRes.reason} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
              <div className="p-8 rounded-full bg-gradient-to-br from-[#486fff]/10 to-[#c174ff]/10 backdrop-blur-sm border border-blue-500/30 mb-6">
                <Brain className="text-blue-400" size={64} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">AI Diagnosis Engine Standing By</h3>
              <p className="text-[#89b0c2] max-w-md">
                Please enter medical test data and AI config on the left, then start the smart diagnosis analysis.
              </p>
              <div className="mt-6 flex items-center gap-4 text-sm text-[#667aad]">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-accent rounded-full"></div>
                  <span>Multi-AI provider support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-accent rounded-full"></div>
                  <span>Medical-grade accurate analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-accent rounded-full"></div>
                  <span>Real-time suggestion</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative backdrop-blur-md bg-[#1b1f37]/80 border-t border-[#343677] py-4 mt-auto">
        <div className="text-center text-xs text-[#7c92b3]">
          Powered by AI and deep learning &middot; For research and educational purposes &middot; Not for clinical use
        </div>
      </footer>
    </div>
  );
};

export default Index;
