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

// Add this helper function at the top of your class or file
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Inside solveNaturalLanguage
public async solveNaturalLanguage(prompt: string, retryCount = 0): Promise<any> {
  try {
    const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(...);
    // ... rest of your code
  } catch (error: any) {
    // If we hit a 429 and haven't tried too many times, wait and try again
    if (error?.status === 429 && retryCount < 3) {
      console.warn(`Rate limited. Retrying in ${1000 * (retryCount + 1)}ms...`);
      await delay(1000 * (retryCount + 1)); 
      return this.solveNaturalLanguage(prompt, retryCount + 1);
    }
    throw error;
  }
}
}
