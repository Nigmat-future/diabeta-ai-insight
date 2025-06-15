
import React from "react";
import { Card } from "@/components/ui/card";

export interface DiagnosisResultProps {
  possibility: string;
  suggestion: string;
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ possibility, suggestion }) => (
  <Card className="p-6 rounded-lg shadow-md bg-green-50 border-green-600 border">
    <div className="mb-3 text-lg font-semibold">
      ⏳ 推测结果：<span className="text-green-700">{possibility}</span>
    </div>
    <div className="text-base">
      <span className="font-medium">辅助建议：</span>
      <span>{suggestion}</span>
    </div>
  </Card>
);

export default DiagnosisResult;
