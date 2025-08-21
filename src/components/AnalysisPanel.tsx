import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Lightbulb,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

interface AnalysisResult {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  category: string;
  title: string;
  description: string;
  line?: number;
  suggestion?: string;
}

interface AnalysisPanelProps {
  isLoading: boolean;
  results: AnalysisResult[] | null;
}

const mockResults: AnalysisResult[] = [
  {
    id: '1',
    type: 'success',
    category: 'Best Practices',
    title: 'Good use of React Hooks',
    description: 'Proper implementation of useState and useEffect hooks.',
    suggestion: 'Continue following React hooks guidelines for optimal performance.'
  },
  {
    id: '2',
    type: 'warning',
    category: 'Performance',
    title: 'Missing dependency in useEffect',
    description: 'The fetchData function should be included in the dependency array.',
    line: 8,
    suggestion: 'Add fetchData to the dependency array or wrap it with useCallback.'
  },
  {
    id: '3',
    type: 'error',
    category: 'Error Handling',
    title: 'Unhandled Promise Rejection',
    description: 'Error handling could be improved with user-friendly messages.',
    line: 15,
    suggestion: 'Consider showing error messages to users and implementing retry logic.'
  },
  {
    id: '4',
    type: 'info',
    category: 'Optimization',
    title: 'Consider adding loading states',
    description: 'Loading states improve user experience during data fetching.',
    suggestion: 'Add a loading spinner or skeleton while data is being fetched.'
  }
];

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return <Lightbulb className="h-4 w-4 text-primary" />;
  }
};

const getBadgeVariant = (type: string) => {
  switch (type) {
    case 'success':
      return 'default';
    case 'warning':
      return 'secondary';
    case 'error':
      return 'destructive';
    default:
      return 'outline';
  }
};

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <div className="p-4 rounded-full bg-primary/10 mb-4 pulse-glow">
      <FileText className="h-8 w-8 text-primary" />
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-2">
      Code Review Feedback
    </h3>
    <p className="text-foreground-secondary max-w-md">
      Your code analysis results will appear here. Paste your code on the left and click "Review Code" to start.
    </p>
  </div>
);

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <div className="p-4 rounded-full bg-primary/10 mb-4 pulse-glow">
      <Zap className="h-8 w-8 text-primary animate-pulse" />
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-2">
      Analyzing Your Code
    </h3>
    <p className="text-foreground-secondary max-w-md">
      Our AI is carefully reviewing your code for best practices, potential issues, and optimization opportunities.
    </p>
  </div>
);

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ isLoading, results }) => {
  const displayResults = results || mockResults;

  if (isLoading) {
    return (
      <Card className="glass-card h-full">
        <LoadingState />
      </Card>
    );
  }

  if (!results) {
    return (
      <Card className="glass-card h-full">
        <EmptyState />
      </Card>
    );
  }

  const successCount = displayResults.filter(r => r.type === 'success').length;
  const warningCount = displayResults.filter(r => r.type === 'warning').length;
  const errorCount = displayResults.filter(r => r.type === 'error').length;

  return (
    <Card className="glass-card h-full flex flex-col">
      <div className="p-6 border-b border-card-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Analysis Report</h3>
              <p className="text-sm text-foreground-secondary">
                AI-powered code review results
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Secure</span>
          </div>
        </div>
        
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <span className="text-sm text-foreground-secondary">{successCount} Good</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-sm text-foreground-secondary">{warningCount} Warnings</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-foreground-secondary">{errorCount} Issues</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {displayResults.map((result) => (
            <div
              key={result.id}
              className="fade-in p-4 rounded-lg bg-card-secondary/50 border border-card-border hover:bg-card-secondary transition-colors"
            >
              <div className="flex items-start gap-3">
                {getIcon(result.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-foreground">{result.title}</h4>
                    <Badge variant={getBadgeVariant(result.type)} className="text-xs">
                      {result.category}
                    </Badge>
                    {result.line && (
                      <Badge variant="outline" className="text-xs">
                        Line {result.line}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-foreground-secondary mb-2">
                    {result.description}
                  </p>
                  {result.suggestion && (
                    <div className="bg-muted/50 p-3 rounded border-l-2 border-primary">
                      <p className="text-sm text-foreground">
                        <strong>Suggestion:</strong> {result.suggestion}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AnalysisPanel;