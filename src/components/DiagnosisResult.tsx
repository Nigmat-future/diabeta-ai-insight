
import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from "lucide-react";

export interface DiagnosisResultProps {
  possibility: string;
  suggestion: string;
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ possibility, suggestion }) => {
  const getRiskIcon = () => {
    if (possibility.includes("高风险")) return <XCircle className="text-red-400" size={28} />;
    if (possibility.includes("中等") || possibility.includes("中")) return <AlertTriangle className="text-yellow-400" size={28} />;
    if (possibility.includes("低风险") || possibility.includes("较低")) return <CheckCircle className="text-green-400" size={28} />;
    return <HelpCircle className="text-blue-400" size={28} />;
  };

  const getRiskColor = () => {
    if (possibility.includes("高风险")) return "from-red-900 to-red-800 border-red-700";
    if (possibility.includes("中等") || possibility.includes("中")) return "from-yellow-900 to-yellow-800 border-yellow-700";
    if (possibility.includes("低风险") || possibility.includes("较低")) return "from-green-900 to-green-800 border-green-700";
    return "from-blue-900 to-blue-800 border-blue-700";
  };

  const getTextColor = () => {
    if (possibility.includes("高风险")) return "text-red-300";
    if (possibility.includes("中等") || possibility.includes("中")) return "text-yellow-300";
    if (possibility.includes("低风险") || possibility.includes("较低")) return "text-green-300";
    return "text-blue-300";
  };

  return (
    <Card className={`p-6 bg-gradient-to-br ${getRiskColor()} text-white shadow-2xl border-2`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-full bg-black/20 backdrop-blur-sm">
          {getRiskIcon()}
        </div>
        <div>
          <div className="text-sm text-gray-300 mb-1">AI诊断结果</div>
          <div className={`text-2xl font-bold ${getTextColor()}`}>
            {possibility}
          </div>
        </div>
      </div>
      
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
        <div className="flex items-start gap-3">
          <div className="text-sm font-medium text-white opacity-90">
            AI建议：
          </div>
          <div className="text-sm text-gray-200 leading-relaxed">
            {suggestion}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DiagnosisResult;
