export enum UserRole {
  USER = 'user',
  MODEL = 'model',
}

export enum ModelType {
  FLASH = 'gemini-2.5-flash',
  PRO = 'gemini-3-pro-preview',
  IMAGEN = 'gemini-2.5-flash-image',
}

export interface GroundingChunk {
    web?: {
        uri: string;
        title: string;
    };
}

export interface GroundingMetadata {
    groundingChunks?: GroundingChunk[];
}

export interface Message {
  id: string;
  role: UserRole;
  content: string;
  image?: string; // base64 string (user uploaded)
  generatedImage?: string; // base64 string (AI generated)
  timestamp: Date;
  isThinking?: boolean;
  groundingMetadata?: GroundingMetadata;
}

export type ResponseTone = 'professional' | 'casual' | 'witty' | 'formal' | 'empathetic';
export type ResponseLength = 'concise' | 'standard' | 'detailed';
export type ResponseComplexity = 'simple' | 'standard' | 'technical';

export interface ResponseConfig {
  tone: ResponseTone;
  length: ResponseLength;
  complexity: ResponseComplexity;
  historyLimit: number;
  textToSpeech: boolean;
  voiceURI: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}