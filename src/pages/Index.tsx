import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CodeEditor from '@/components/CodeEditor';
import AnalysisPanel from '@/components/AnalysisPanel';
import AIConfigModal from '@/components/AIConfigModal';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { AnalysisResult, AIConfig } from '@/types/ai';
import { getAIConfig } from '@/lib/storage';
import { AIService } from '@/lib/ai-service';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[] | null>(null);
  const [aiConfig, setAiConfig] = useState<AIConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const config = getAIConfig();
    setAiConfig(config);
  }, []);

  const handleCodeReview = async (code: string) => {
    if (!aiConfig) {
      setShowConfigModal(true);
      toast({
        title: 'AI Configuration Required',
        description: 'Please configure your AI provider to analyze code.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const aiService = new AIService(aiConfig);
      const results = await aiService.analyzeCode(code);
      setAnalysisResults(results);
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Failed to analyze code.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfigSaved = (config: AIConfig) => {
    setAiConfig(config);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-6">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Code Reviewer</h1>
            <p className="text-foreground-secondary">
              {aiConfig ? `Using ${aiConfig.provider}` : 'No AI provider configured'}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Configure AI
          </Button>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
          {/* Code Editor Panel */}
          <div className="fade-in">
            <CodeEditor 
              onReview={handleCodeReview}
              isLoading={isAnalyzing}
            />
          </div>
          
          {/* Analysis Panel */}
          <div className="fade-in" style={{ animationDelay: '0.1s' }}>
            <AnalysisPanel 
              isLoading={isAnalyzing}
              results={analysisResults}
            />
          </div>
        </div>
      </main>

      <AIConfigModal
        open={showConfigModal}
        onOpenChange={setShowConfigModal}
        onConfigSaved={handleConfigSaved}
      />
    </div>
  );
};

export default Index;
