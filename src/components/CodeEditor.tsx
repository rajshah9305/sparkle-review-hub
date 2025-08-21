import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Code2, Sparkles, Loader2 } from 'lucide-react';

interface CodeEditorProps {
  onReview: (code: string) => void;
  isLoading?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onReview, isLoading }) => {
  const [code, setCode] = useState(`import React, { useState, useEffect } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div className="container">
      {data ? (
        <div>{data.message}</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default MyComponent;`);

  const handleSubmit = () => {
    if (code.trim()) {
      onReview(code);
    }
  };

  return (
    <Card className="glass-card h-full flex flex-col">
      <div className="p-6 border-b border-card-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Code2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Your Code</h3>
            <p className="text-sm text-foreground-secondary">
              Paste your code here for AI-powered review
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-6 flex flex-col gap-4">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="code-editor flex-1 min-h-[400px] resize-none"
        />
        
        <Button
          onClick={handleSubmit}
          disabled={!code.trim() || isLoading}
          className="btn-premium w-full h-12 text-base font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Code...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Review Code
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default CodeEditor;