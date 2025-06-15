
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
    <Card className="p-6 bg-gradient-to-br from-[#23244b] to-[#2e1f4a] border-[#342f65] text-white shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/20">
          <Bot className="text-primary" size={20} />
        </div>
        <h3 className="font-semibold text-lg">AI Engine Configuration</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="ai-provider" className="text-[#aadbff]">Select AI Provider</Label>
          <Select value={selectedProvider} onValueChange={onProviderChange}>
            <SelectTrigger className="mt-1 bg-[#26295a] border-[#34365f] text-white">
              <SelectValue placeholder="Choose AI provider" />
            </SelectTrigger>
            <SelectContent className="bg-[#23244b] border-[#34365f] z-50">
              {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                <SelectItem key={key} value={key} className="text-white hover:bg-primary/20">
                  {provider.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="api-key" className="text-[#aadbff] flex items-center gap-2">
            <Key size={16} />
            API Key
          </Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="Enter your API key"
            className="mt-1 bg-[#23244b] border-[#34365f] text-white placeholder:text-[#87b4c7]"
          />
          <p className="text-xs text-[#7aaaeb] mt-1">
            Ensure your API key has sufficient permissions.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AiProviderSelector;
