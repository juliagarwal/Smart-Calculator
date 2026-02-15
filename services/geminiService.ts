
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private static instance: GeminiService;
  private ai: GoogleGenAI;

  private constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public async solveNaturalLanguage(prompt: string): Promise<{ result: string, explanation: string }> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Solve the following math problem: "${prompt}". 
        Return a JSON object with the "result" (the numerical answer as a string) and "explanation" (a brief 1-sentence explanation).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              result: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["result", "explanation"]
          }
        }
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error("Failed to process natural language request.");
    }
  }
}
