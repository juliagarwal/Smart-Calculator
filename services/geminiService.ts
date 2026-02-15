import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  private constructor() {
    // 1. Vite requires 'VITE_' prefix to see variables in the browser
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!key) {
      console.error("API Key missing! Add VITE_GEMINI_API_KEY to Netlify settings.");
    }

    // 2. Official SDK initialization
    this.genAI = new GoogleGenerativeAI(key || "");
  }

  public static getInstance(): GeminiService {
    return new GeminiService();
  }

  public async solveNaturalLanguage(prompt: string): Promise<{ result: string, explanation: string }> {
    try {
      // 3. Get the correct model
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // 4. Request structured JSON
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `Solve: "${prompt}". Return JSON with "result" and "explanation" keys.` }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error: any) {
      console.error("Detailed Gemini Error:", error);
      throw new Error("Could not understand that math problem.");
    }
  }
}
