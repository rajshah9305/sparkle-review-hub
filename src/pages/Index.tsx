import React, { useState } from 'react';
import Header from '@/components/Header';
import CodeEditor from '@/components/CodeEditor';
import AnalysisPanel from '@/components/AnalysisPanel';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleCodeReview = async (code: string) => {
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      setAnalysisResults([
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
        }
      ]);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
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
    </div>
  );
};

export default Index;
