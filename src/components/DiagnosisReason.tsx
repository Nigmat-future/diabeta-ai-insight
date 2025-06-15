
import React from "react";
import { Card } from "@/components/ui/card";
import { Brain, Info } from "lucide-react";

interface DiagnosisReasonProps {
  reason: string;
}

const DiagnosisReason: React.FC<DiagnosisReasonProps> = ({ reason }) => (
  <Card className="p-6 bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-700 text-white shadow-2xl">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 rounded-xl bg-indigo-500/20 backdrop-blur-sm">
        <Brain className="text-indigo-300" size={24} />
      </div>
      <div>
        <div className="font-bold text-lg text-indigo-100">AI智能诊断依据</div>
        <div className="text-sm text-indigo-300">基于医学知识库的深度分析</div>
      </div>
    </div>
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
      <div className="flex items-start gap-3">
        <Info className="text-indigo-400 mt-1 flex-shrink-0" size={20} />
        <div className="text-sm text-gray-200 leading-relaxed break-all whitespace-pre-line">
          {reason}
        </div>
      </div>
    </div>
  </Card>
);

export default DiagnosisReason;
