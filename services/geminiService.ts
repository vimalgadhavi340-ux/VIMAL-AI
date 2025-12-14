import { GoogleGenAI, Type } from "@google/genai";
import { Message, UserRole, ModelType, GroundingMetadata, ResponseConfig } from '../types';

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateSystemInstruction = (config: ResponseConfig) => {
    const base = "You are Lumina, a helpful, advanced, and intelligent AI assistant. Your interface is dark, sleek, and premium. Respond with clarity, using Markdown for formatting where appropriate.";
    
    const toneInstructions: Record<string, string> = {
        professional: "Maintain a professional, objective, and polite tone.",
        casual: "Use a casual, friendly, and conversational tone. You can use idioms and contractions.",
        witty: "Be witty, clever, and slightly humorous in your responses.",
        formal: "Use strict formal language, avoiding contractions and slang.",
        empathetic: "Be supportive, understanding, and empathetic."
    };

    const lengthInstructions: Record<string, string> = {
        concise: "Keep responses brief, to the point, and avoid unnecessary fluff.",
        standard: "Provide standard length responses, balancing detail with brevity.",
        detailed: "Provide comprehensive, in-depth, and detailed responses."
    };

    const complexityInstructions: Record<string, string> = {
        simple: "Explain concepts simply, suitable for a general audience or beginners. Avoid jargon.",
        standard: "Use standard complexity, suitable for an educated audience.",
        technical: "Use technical language and deep domain expertise. Assume the user is an expert."
    };

    return `${base}\n\nStyle Guide:\n- Tone: ${toneInstructions[config.tone]}\n- Length: ${lengthInstructions[config.length]}\n- Complexity: ${complexityInstructions[config.complexity]}`;
};

export const streamChatResponse = async (
  history: Message[],
  model: ModelType,
  enableSearch: boolean,
  responseConfig: ResponseConfig,
  onChunk: (text: string) => void,
  onMetadata?: (metadata: GroundingMetadata) => void,
  onImage?: (base64Image: string) => void
) => {
  
  // Prepare contents
  const contents = history.map(msg => {
    const parts: any[] = [];
    
    if (msg.image) {
       // Extract base64 data. Assumes format "data:image/png;base64,..."
       const base64Data = msg.image.split(',')[1];
       const mimeType = msg.image.split(';')[0].split(':')[1];
       parts.push({
         inlineData: {
           mimeType: mimeType,
           data: base64Data
         }
       });
    }

    if (msg.content) {
      parts.push({ text: msg.content });
    }

    return {
      role: msg.role,
      parts: parts
    };
  });

  // Handle Image Generation Model separately
  if (model === ModelType.IMAGEN) {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
                // Image generation does not support systemInstruction, tools (search), or responseSchema
                imageConfig: {
                    aspectRatio: "1:1", // Default to square
                }
            }
        });

        const candidates = response.candidates;
        if (candidates && candidates.length > 0) {
            const content = candidates[0].content;
            if (content && content.parts) {
                for (const part of content.parts) {
                    if (part.inlineData && part.inlineData.data && onImage) {
                         const base64Image = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                         onImage(base64Image);
                    } else if (part.text) {
                        onChunk(part.text);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Gemini Image Gen Error:", error);
        throw error;
    }
    return;
  }

  // Handle Text/Chat Models
  const tools: any[] = [];
  if (enableSearch) {
    tools.push({ googleSearch: {} });
  }

  try {
    const responseStream = await ai.models.generateContentStream({
      model: model,
      contents: contents,
      config: {
        tools: tools.length > 0 ? tools : undefined,
        systemInstruction: generateSystemInstruction(responseConfig),
      }
    });

    for await (const chunk of responseStream) {
      // Check for grounding metadata
      if (chunk.candidates?.[0]?.groundingMetadata && onMetadata) {
          onMetadata(chunk.candidates[0].groundingMetadata as GroundingMetadata);
      }
      
      const text = chunk.text;
      if (text) {
        onChunk(text);
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};