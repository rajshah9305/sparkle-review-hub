export interface AnalysisResult {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  category: string;
  title: string;
  description: string;
  line?: number;
  suggestion?: string;
}

export interface AIProvider {
  id: string;
  name: string;
  baseUrl?: string;
  requiresApiKey: boolean;
}

export interface AIConfig {
  provider: string;
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    requiresApiKey: true,
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    requiresApiKey: true,
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    requiresApiKey: true,
  },
  {
    id: 'openai-compatible',
    name: 'OpenAI Compatible',
    requiresApiKey: true,
  },
];

export const DEFAULT_MODELS = {
  openai: 'gpt-4',
  gemini: 'gemini-1.5-pro',
  claude: 'claude-3-5-sonnet-20241022',
  'openai-compatible': 'gpt-3.5-turbo',
};