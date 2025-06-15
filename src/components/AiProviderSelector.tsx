
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AI_PROVIDERS } from "@/lib/aiProviders";
import { Bot, Key } from "lucide-react";

interface AiProviderSelectorProps {
  selectedProvider: string;
  apiKey: string;
  onProviderChange: (provider: string) => void;
  onApiKeyChange: (apiKey: string) => void;
}

const AiProviderSelector: React.FC<AiProviderSelectorProps> = ({
  selectedProvider,
  apiKey,
  onProviderChange,
  onApiKeyChange
}) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <Bot className="text-blue-400" size={20} />
        </div>
        <h3 className="font-semibold text-lg">AI诊断引擎配置</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="ai-provider" className="text-slate-300">选择AI提供商</Label>
          <Select value={selectedProvider} onValueChange={onProviderChange}>
            <SelectTrigger className="mt-1 bg-slate-800 border-slate-600 text-white">
              <SelectValue placeholder="选择AI提供商" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                  {provider.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="api-key" className="text-slate-300 flex items-center gap-2">
            <Key size={16} />
            API密钥
          </Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="输入API密钥"
            className="mt-1 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
          />
          <p className="text-xs text-slate-400 mt-1">
            请确保API密钥具有相应的调用权限
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AiProviderSelector;
