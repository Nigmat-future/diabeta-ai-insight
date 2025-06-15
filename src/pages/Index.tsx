
import React, { useState } from "react";
import PatientForm from "@/components/PatientForm";
import DiagnosisResult from "@/components/DiagnosisResult";
import DiagnosisReason from "@/components/DiagnosisReason";
import { aiDiagnosePatient, PatientData, AiDiagnosisResult } from "@/lib/diabetesAi";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [inputData, setInputData] = useState<PatientData | null>(null);
  const [aiRes, setAiRes] = useState<AiDiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);

  // 显示用户已录入的数据
  const renderDataTable = () => {
    if (!inputData) return null;
    const dataShow = [
      { label: "糖化血红蛋白", value: inputData.hba1c, unit: "%" },
      { label: "血糖", value: inputData.fbg, unit: "mmol/L" },
      { label: "其他生化项目", value: inputData.biochem },
      { label: "激素项目", value: inputData.hormones }
    ].filter(d => d.value && d.value !== "");
    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm mb-4">
        <div className="font-semibold mb-2 text-slate-700">录入数据总览</div>
        <table className="w-full text-left text-sm">
          <tbody>
            {dataShow.map(d => (
              <tr key={d.label} className="border-t">
                <td className="py-1 pr-3 text-stone-900 w-40">{d.label}</td>
                <td className="py-1">{d.value} <span className="text-slate-400">{d.unit ? d.unit : ""}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  async function handleFormSubmit(data: PatientData) {
    setInputData(data);
    setLoading(true);
    try {
      const res = await aiDiagnosePatient(data);
      setAiRes(res);
      toast({
        title: "AI诊断完成",
        description: res.possibility,
        variant: res.possibility.includes("高风险") ? "destructive" : "default",
      });
    } catch (err: any) {
      toast({
        title: "诊断出错",
        description: err?.message || "AI诊断失败，请检查输入或稍后重试。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      {/* 顶部栏 */}
      <header className="py-5 px-8 bg-white border-b border-slate-200 shadow flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-700 tracking-wide flex items-center gap-3">
          AI 糖尿病辅助诊断
        </div>
        <div className="flex gap-4">
          <a href="#help" className="text-slate-500 hover:text-blue-700">帮助</a>
        </div>
      </header>
      {/* 主内容区域 */}
      <main className="flex-1 flex flex-row gap-8 px-12 py-10 max-w-6xl mx-auto w-full">
        {/* 左侧: 数据录入 */}
        <section className="w-[380px] shrink-0">
          <PatientForm onSubmit={handleFormSubmit} loading={loading} />
          <div className="mt-4">{renderDataTable()}</div>
        </section>
        {/* 右侧: AI诊断与依据 */}
        <section className="flex-1 flex flex-col gap-5">
          {
            aiRes
              ? (
                <>
                  <DiagnosisResult possibility={aiRes.possibility} suggestion={aiRes.suggestion} />
                  <DiagnosisReason reason={aiRes.reason} />
                </>
              )
              : (
                <div className="border-dashed border-2 border-slate-200 rounded-xl min-h-[220px] flex flex-col items-center justify-center text-slate-400">
                  <div className="text-lg mb-2">请在左侧填写患者检验数据后启动AI诊断</div>
                  <span>（AI诊断结果与依据将在此区域显示）</span>
                </div>
              )
          }
        </section>
      </main>
      {/* 页脚 */}
      <footer className="py-3 bg-white border-t text-xs text-slate-400 text-center mt-auto">由 Lovable AI + 医学知识驱动 · 科研演示用途</footer>
    </div>
  );
};

export default Index;
