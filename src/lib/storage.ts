import { AIConfig } from '@/types/ai';

const STORAGE_KEY = 'code-reviewer-ai-config';

export const getAIConfig = (): AIConfig | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const saveAIConfig = (config: AIConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save AI config:', error);
  }
};

export const clearAIConfig = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear AI config:', error);
  }
};