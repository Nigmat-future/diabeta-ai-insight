
import React from "react";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

interface DiagnosisReasonProps {
  reason: string;
}

const DiagnosisReason: React.FC<DiagnosisReasonProps> = ({ reason }) => (
  <Card className="flex flex-row items-start gap-2 p-5 bg-blue-50 border-blue-700 border rounded-lg">
    <Info className="text-blue-700 mt-1" size={24} />
    <div>
      <div className="font-semibold">智能诊断依据</div>
      <div className="text-sm text-blue-900 mt-1">{reason}</div>
    </div>
  </Card>
);

export default DiagnosisReason;
