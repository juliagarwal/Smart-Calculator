import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Helper function goes OUTSIDE the class
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  private constructor() {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) {
      console.error("API Key missing! Check Netlify environment variables.");
    }
    this.genAI = new GoogleGenerativeAI(key || "");
  }

  public static getInstance(): GeminiService {
    return new GeminiService();
  }

  public async solveNaturalLanguage(prompt: string, retryCount = 0): Promise<any> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `Solve: "${prompt}". Return JSON with "result" and "explanation" keys.` }] }],
        generationConfig: { responseMimeType: "application/json" },
      });

      const response = await result.response;
      return JSON.parse(response.text());

    } catch (error: any) {
      // 2. Retry logic handles the 429 error automatically
      if (error?.status === 429 && retryCount < 3) {
        console.warn(`Rate limited. Retrying in ${1000 * (retryCount + 1)}ms...`);
        await delay(1000 * (retryCount + 1)); 
        return this.solveNaturalLanguage(prompt, retryCount + 1);
      }
      
      console.error("Gemini Error:", error);
      throw new Error("Could not understand that math problem.");
    }
  }
}
