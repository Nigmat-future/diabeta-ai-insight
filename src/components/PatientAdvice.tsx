
import React from "react";
import { Card } from "@/components/ui/card";
import { Heart, Info } from "lucide-react";

interface PatientAdviceProps {
  advice: string;
}

const PatientAdvice: React.FC<PatientAdviceProps> = ({ advice }) => (
  <Card className="p-6 bg-gradient-to-br from-[#1a2857] via-[#2d1b69] to-[#1b183b] border-[#4a5568] text-white shadow-2xl">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 rounded-xl bg-pink-500/20 backdrop-blur-md">
        <Heart className="text-pink-400" size={24} />
      </div>
      <div>
        <div className="font-bold text-lg text-pink-400">Patient Care Advice</div>
        <div className="text-sm text-pink-200">Personalized health guidance and lifestyle recommendations</div>
      </div>
    </div>
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
      <div className="flex items-start gap-3">
        <Info className="text-pink-300 mt-1 flex-shrink-0" size={20} />
        <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
          {advice}
        </div>
      </div>
    </div>
  </Card>
);

export default PatientAdvice;
