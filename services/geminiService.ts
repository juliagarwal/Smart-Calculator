
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private static instance: GeminiService;
  private ai: GoogleGenAI;

  private constructor() {
    // Strictly follow initialization guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  public static getInstance(): GeminiService {
    // We create a new instance to ensure we pick up the latest API key from the environment
    return new GeminiService();
  }

  public async solveNaturalLanguage(prompt: string): Promise<{ result: string, explanation: string }> {
    try {
      const response = await this.ai.models.generateContent({
        // Using Pro for complex math/STEM tasks as per guidelines
        model: 'gemini-3-pro-preview',
        contents: `Solve the following math problem: "${prompt}". 
        Return a JSON object with the "result" (the numerical answer as a string) and "explanation" (a brief 1-sentence explanation of the steps).`,
        config: {
          thinkingConfig: { thinkingBudget: 2000 },
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

      // Following guidelines for extracting text output
      const text = response.text?.trim();
      if (!text) {
        throw new Error("Empty response from AI");
      }
      return JSON.parse(text);
    } catch (error: any) {
      console.error("Gemini Error:", error);
      // Special handling for key selection issues per guidelines
      if (error?.message?.includes("Requested entity was not found")) {
        throw new Error("API Key configuration issue. Please re-select your key.");
      }
      throw new Error("Failed to process natural language request.");
    }
  }
}
