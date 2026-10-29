export interface CalculationRecord {
  id: string;
  expression: string;
  result: string;
  pythonCode: string;
  timestamp: number;
  executionTimeMs: number;
  status: 'success' | 'error';
}

export interface TerminalLog {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
  timestamp: number;
  executionTimeMs?: number;
}

export type ThemeMode = 'dark' | 'light';

export type SoundType = 
  | 'digit' 
  | 'operator' 
  | 'special' 
  | 'equals' 
  | 'clear' 
  | 'delete' 
  | 'error';
