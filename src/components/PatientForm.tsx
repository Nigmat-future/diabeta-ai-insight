
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface PatientFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, loading }) => {
  const [hba1c, setHba1c] = useState("");
  const [fbg, setFbg] = useState("");
  const [biochem, setBiochem] = useState(""); // 支持多检测项目用英文逗号分隔
  const [hormones, setHormones] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hba1c || !fbg) {
      toast({
        title: "必填项未填写",
        description: "请填写糖化血红蛋白和血糖。",
        variant: "destructive",
      });
      return;
    }
    onSubmit({ hba1c, fbg, biochem, hormones });
  }

  return (
    <Card className="p-6 rounded-lg shadow-md bg-white flex flex-col gap-4">
      <h2 className="font-bold text-lg mb-2">基础检验数据录入</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <Label htmlFor="hba1c">糖化血红蛋白（%）<span className="text-red-500 ml-1">*</span></Label>
          <Input
            id="hba1c"
            value={hba1c}
            onChange={e => setHba1c(e.target.value.replace(/[^0-9.]/g, ""))}
            className="mt-1"
            placeholder="如 6.8"
          />
        </div>
        <div>
          <Label htmlFor="fbg">血糖（mmol/L）<span className="text-red-500 ml-1">*</span></Label>
          <Input
            id="fbg"
            value={fbg}
            onChange={e => setFbg(e.target.value.replace(/[^0-9.]/g, ""))}
            className="mt-1"
            placeholder="如 7.2"
          />
        </div>
        <div>
          <Label htmlFor="biochem">其他生化项目（如ALT、AST，多个请用英文逗号分隔）</Label>
          <Input
            id="biochem"
            value={biochem}
            onChange={e => setBiochem(e.target.value)}
            className="mt-1"
            placeholder="ALT:23,AST:19,Cr:60"
          />
        </div>
        <div>
          <Label htmlFor="hormones">激素检测项目（如INS、C-P等）</Label>
          <Input
            id="hormones"
            value={hormones}
            onChange={e => setHormones(e.target.value)}
            className="mt-1"
            placeholder="INS:15,C-P:2.3"
          />
        </div>
        <Button
          type="submit"
          className="mt-4"
          disabled={loading}
        >
          {loading ? "AI分析中..." : "提交AI诊断"}
        </Button>
      </form>
    </Card>
  );
};

export default PatientForm;
