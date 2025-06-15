
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Activity, FlaskConical, Zap } from "lucide-react";

interface PatientFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, loading }) => {
  const [hba1c, setHba1c] = useState("");
  const [fbg, setFbg] = useState("");
  const [biochem, setBiochem] = useState("");
  const [hormones, setHormones] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hba1c || !fbg) {
      toast({
        title: "数据验证失败",
        description: "请填写糖化血红蛋白和血糖数据。",
        variant: "destructive",
      });
      return;
    }
    onSubmit({ hba1c, fbg, biochem, hormones });
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 border-blue-700 text-white shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-blue-500/20 backdrop-blur-sm">
          <FlaskConical className="text-blue-300" size={24} />
        </div>
        <div>
          <h2 className="font-bold text-xl text-blue-100">检验数据录入</h2>
          <p className="text-sm text-blue-300">输入患者检验指标数据</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hba1c" className="text-blue-200 flex items-center gap-2">
              <Activity size={16} />
              糖化血红蛋白 (%)
              <span className="text-red-400">*</span>
            </Label>
            <Input
              id="hba1c"
              value={hba1c}
              onChange={e => setHba1c(e.target.value.replace(/[^0-9.]/g, ""))}
              className="mt-2 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm"
              placeholder="如: 6.8"
            />
            <p className="text-xs text-slate-400 mt-1">正常值: &lt;6.0%</p>
          </div>
          
          <div>
            <Label htmlFor="fbg" className="text-blue-200 flex items-center gap-2">
              <Zap size={16} />
              血糖 (mmol/L)
              <span className="text-red-400">*</span>
            </Label>
            <Input
              id="fbg"
              value={fbg}
              onChange={e => setFbg(e.target.value.replace(/[^0-9.]/g, ""))}
              className="mt-2 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm"
              placeholder="如: 7.2"
            />
            <p className="text-xs text-slate-400 mt-1">正常值: 3.9-6.0 mmol/L</p>
          </div>
        </div>
        
        <div>
          <Label htmlFor="biochem" className="text-blue-200">
            其他生化项目 (可选)
          </Label>
          <Input
            id="biochem"
            value={biochem}
            onChange={e => setBiochem(e.target.value)}
            className="mt-2 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm"
            placeholder="如: ALT:23, AST:19, Cr:60"
          />
          <p className="text-xs text-slate-400 mt-1">多个项目请用英文逗号分隔</p>
        </div>
        
        <div>
          <Label htmlFor="hormones" className="text-blue-200">
            激素检测项目 (可选)
          </Label>
          <Input
            id="hormones"
            value={hormones}
            onChange={e => setHormones(e.target.value)}
            className="mt-2 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm"
            placeholder="如: INS:15, C-P:2.3"
          />
          <p className="text-xs text-slate-400 mt-1">胰岛素(INS)、C肽(C-P)等</p>
        </div>
        
        <Button
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:transform-none"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              AI智能分析中...
            </div>
          ) : (
            "启动AI诊断分析"
          )}
        </Button>
      </form>
    </Card>
  );
};

export default PatientForm;
