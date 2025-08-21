import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Settings, Key, Globe, Shield } from 'lucide-react';
import { AI_PROVIDERS, AIConfig, DEFAULT_MODELS } from '@/types/ai';
import { getAIConfig, saveAIConfig } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface AIConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigSaved: (config: AIConfig) => void;
}

const AIConfigModal: React.FC<AIConfigModalProps> = ({ open, onOpenChange, onConfigSaved }) => {
  const [config, setConfig] = useState<AIConfig>({
    provider: 'openai',
    apiKey: '',
    baseUrl: '',
    model: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      const savedConfig = getAIConfig();
      if (savedConfig) {
        setConfig(savedConfig);
      }
    }
  }, [open]);

  const handleProviderChange = (provider: string) => {
    setConfig(prev => ({
      ...prev,
      provider,
      model: DEFAULT_MODELS[provider as keyof typeof DEFAULT_MODELS] || '',
      baseUrl: provider === 'openai-compatible' ? prev.baseUrl : '',
    }));
  };

  const handleSave = async () => {
    if (!config.apiKey.trim()) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your API key.',
        variant: 'destructive',
      });
      return;
    }

    if (config.provider === 'openai-compatible' && !config.baseUrl?.trim()) {
      toast({
        title: 'Base URL Required',
        description: 'Please enter the base URL for your OpenAI-compatible API.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      saveAIConfig(config);
      onConfigSaved(config);
      onOpenChange(false);
      toast({
        title: 'Configuration Saved',
        description: 'Your AI provider configuration has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Failed to save configuration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedProvider = AI_PROVIDERS.find(p => p.id === config.provider);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            AI Provider Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Secure Storage</p>
                <p className="text-xs text-foreground-secondary">
                  API keys are stored locally in your browser and never sent to our servers.
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div>
              <Label htmlFor="provider">AI Provider</Label>
              <Select value={config.provider} onValueChange={handleProviderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select AI provider" />
                </SelectTrigger>
                <SelectContent>
                  {AI_PROVIDERS.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="apiKey" className="flex items-center gap-2">
                <Key className="h-3 w-3" />
                API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={config.apiKey}
                onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
              />
            </div>

            {config.provider === 'openai-compatible' && (
              <div>
                <Label htmlFor="baseUrl" className="flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  Base URL
                </Label>
                <Input
                  id="baseUrl"
                  placeholder="https://api.example.com/v1"
                  value={config.baseUrl}
                  onChange={(e) => setConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                />
              </div>
            )}

            <div>
              <Label htmlFor="model">Model (Optional)</Label>
              <Input
                id="model"
                placeholder={`Default: ${DEFAULT_MODELS[config.provider as keyof typeof DEFAULT_MODELS] || 'auto'}`}
                value={config.model}
                onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIConfigModal;