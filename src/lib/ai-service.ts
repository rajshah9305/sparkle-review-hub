import { AnalysisResult, AIConfig, DEFAULT_MODELS } from '@/types/ai';

export class AIService {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async analyzeCode(code: string): Promise<AnalysisResult[]> {
    const prompt = `Analyze the following code for best practices, potential issues, performance optimizations, and security concerns. Return your analysis as a JSON array of objects with the following structure:

{
  "id": "unique-id",
  "type": "success|warning|error|info",
  "category": "category-name",
  "title": "short-title",
  "description": "detailed-description",
  "line": optional-line-number,
  "suggestion": "improvement-suggestion"
}

Focus on:
- Code quality and best practices
- Performance optimizations
- Security vulnerabilities
- Error handling
- Maintainability
- Testing considerations

Code to analyze:
\`\`\`
${code}
\`\`\`

Return only the JSON array, no additional text.`;

    try {
      const response = await this.makeRequest(prompt);
      return this.parseAnalysisResponse(response);
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw new Error('Failed to analyze code. Please check your API configuration.');
    }
  }

  private async makeRequest(prompt: string): Promise<string> {
    switch (this.config.provider) {
      case 'openai':
        return this.makeOpenAIRequest(prompt);
      case 'gemini':
        return this.makeGeminiRequest(prompt);
      case 'claude':
        return this.makeClaudeRequest(prompt);
      case 'openai-compatible':
        return this.makeOpenAICompatibleRequest(prompt);
      default:
        throw new Error(`Unsupported provider: ${this.config.provider}`);
    }
  }

  private async makeOpenAIRequest(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model || DEFAULT_MODELS.openai,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async makeGeminiRequest(prompt: string): Promise<string> {
    const model = this.config.model || DEFAULT_MODELS.gemini;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.config.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 4000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  private async makeClaudeRequest(prompt: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model || DEFAULT_MODELS.claude,
        max_tokens: 4000,
        temperature: 0.1,
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || '';
  }

  private async makeOpenAICompatibleRequest(prompt: string): Promise<string> {
    const baseUrl = this.config.baseUrl || 'https://api.openai.com/v1';
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model || DEFAULT_MODELS['openai-compatible'],
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private parseAnalysisResponse(response: string): AnalysisResult[] {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      
      const results = JSON.parse(jsonString);
      
      if (!Array.isArray(results)) {
        throw new Error('Response is not an array');
      }

      return results.map((result, index) => ({
        id: result.id || `result-${index}`,
        type: result.type || 'info',
        category: result.category || 'General',
        title: result.title || 'Analysis Result',
        description: result.description || '',
        line: result.line,
        suggestion: result.suggestion,
      }));
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      // Return a fallback result
      return [{
        id: 'parse-error',
        type: 'error',
        category: 'AI Response',
        title: 'Failed to parse AI response',
        description: 'The AI response could not be parsed. The response format may be invalid.',
        suggestion: 'Try the analysis again or check your API configuration.',
      }];
    }
  }
}