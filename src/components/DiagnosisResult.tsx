
import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from "lucide-react";

export interface DiagnosisResultProps {
  possibility: string;
  suggestion: string;
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ possibility, suggestion }) => {
  // Colors are updated for neon/futuristic effect
  const getRiskIcon = () => {
    if (possibility.toLowerCase().includes("high")) return <XCircle className="text-[#ff6b81]" size={28} />;
    if (possibility.toLowerCase().includes("medium")) return <AlertTriangle className="text-[#fad36c]" size={28} />;
    if (possibility.toLowerCase().includes("low")) return <CheckCircle className="text-[#65ffb1]" size={28} />;
    return <HelpCircle className="text-accent" size={28} />;
  };

  const getRiskColor = () => {
    if (possibility.toLowerCase().includes("high")) return "from-[#441b38] to-[#571a39] border-[#e9437a]";
    if (possibility.toLowerCase().includes("medium")) return "from-[#443c1b] to-[#87791f] border-[#ffd569]";
    if (possibility.toLowerCase().includes("low")) return "from-[#174237] to-[#249070] border-[#67ffc7]";
    return "from-[#23305a] to-[#362965] border-[#6fc7ff]";
  };

  const getTextColor = () => {
    if (possibility.toLowerCase().includes("high")) return "text-[#ffb3ca]";
    if (possibility.toLowerCase().includes("medium")) return "text-[#ffe18e]";
    if (possibility.toLowerCase().includes("low")) return "text-[#b0ffd0]";
    return "text-[#b4d6ff]";
  };

  return (
    <Card className={`p-6 bg-gradient-to-br ${getRiskColor()} text-white shadow-2xl border-2`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-full bg-black/20 backdrop-blur-sm">
          {getRiskIcon()}
        </div>
        <div>
          <div className="text-sm text-gray-300 mb-1">AI Diagnosis Result</div>
          <div className={`text-2xl font-bold ${getTextColor()}`}>
            {possibility}
          </div>
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
        <div className="flex items-start gap-3">
          <div className="text-sm font-medium text-white opacity-90">
            Suggestion:
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
