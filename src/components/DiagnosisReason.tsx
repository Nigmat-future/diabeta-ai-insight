
import React from "react";
import { Card } from "@/components/ui/card";
import { Brain, Info } from "lucide-react";

interface DiagnosisReasonProps {
  reason: string;
}

const DiagnosisReason: React.FC<DiagnosisReasonProps> = ({ reason }) => (
  <Card className="p-6 bg-gradient-to-br from-[#1c1fa3] via-[#7f1ae5] to-[#1b183b] border-[#473073] text-white shadow-2xl">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-md">
        <Brain className="text-primary" size={24} />
      </div>
      <div>
        <div className="font-bold text-lg text-primary">AI Diagnosis Reasoning</div>
        <div className="text-sm text-[#99cfff]">Deep analysis powered by a medical knowledge base</div>
      </div>
    </div>
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
      <div className="flex items-start gap-3">
        <Info className="text-[#6fc7ff] mt-1 flex-shrink-0" size={20} />
        <div className="text-sm text-gray-200 leading-relaxed break-all whitespace-pre-line">
          {reason}
        </div>
      </div>
    </div>
  </Card>
);

export default DiagnosisReason;
