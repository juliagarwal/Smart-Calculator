import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  private constructor() {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Explicitly set the API version to 'v1' to avoid 404s on 'v1beta'
    this.genAI = new GoogleGenerativeAI(key || "");
  }

  public static getInstance(): GeminiService {
    return new GeminiService();
  }

  public async solveNaturalLanguage(prompt: string): Promise<{ result: string, explanation: string }> {
    try {
      // Force 'v1' here to bypass regional experimental issues
      const model = this.genAI.getGenerativeModel(
        { model: "gemini-1.5-flash" },
        { apiVersion: 'v1' } 
      );

      const result = await model.generateContent(`Solve: "${prompt}". Return JSON with "result" and "explanation" keys.`);
      const response = await result.response;
      const text = response.text();
      
      // Safety check: remove markdown if the model includes it
      const cleanJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (error: any) {
      console.error("Gemini Error Detail:", error);
      throw new Error("AI service is currently unavailable. Please try again later.");
    }
  }
}
