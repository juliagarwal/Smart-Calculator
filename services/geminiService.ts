import { GoogleGenerativeAI } from "@google/generative-ai";

/** * Helper to create a promise-based delay
 */
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private static instance: GeminiService;

  private constructor() {
    // Vite requires VITE_ prefix for environment variables to be visible in the browser
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!key) {
      console.error("Gemini API Key missing! Add VITE_GEMINI_API_KEY to your .env or Netlify settings.");
    }

    this.genAI = new GoogleGenerativeAI(key || "");
  }

  /**
   * Singleton pattern to ensure only one instance of the service exists
   */
  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  /**
   * Solves a natural language math prompt using Gemini AI.
   * Includes retry logic with exponential backoff and jitter to handle 429 errors.
   */
  public async solveNaturalLanguage(prompt: string, retryCount = 0): Promise<{ result: string, explanation: string }> {
    const MAX_RETRIES = 3;

    try {
      // Using 'gemini-2.5-flash-lite' for better free-tier rate limits in 2026
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

      const result = await model.generateContent({
        contents: [{ 
          role: "user", 
          parts: [{ text: `Solve this math problem: "${prompt}". 
          Response MUST be a valid JSON object with exactly two keys: 
          "result" (the final answer) and "explanation" (a brief step-by-step).` }] 
        }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1, // Low temperature for consistent math results
        },
      });

      const response = await result.response;
      const text = response.text();
      
      // Clean potential markdown wrapper if the model returns it
      const cleanJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);

    } catch (error: any) {
      // Check specifically for 429 (Rate Limit)
      if (error?.status === 429 && retryCount < MAX_RETRIES) {
        // Wait time = (2^retry * 2 seconds) + random jitter up to 1 second
        const waitTime = Math.pow(2, retryCount) * 2000 + Math.random() * 1000;
        
        console.warn(`Rate limit hit (429). Retrying in ${Math.round(waitTime)}ms... (Attempt ${retryCount + 1})`);
        await delay(waitTime);
        
        return this.solveNaturalLanguage(prompt, retryCount + 1);
      }

      console.error("Gemini Service Error:", error);
      
      // Provide user-friendly errors based on the failure
      if (error?.status === 429) {
        throw new Error("The AI is currently busy. Please wait 30 seconds and try again.");
      }
      throw new Error("I couldn't solve that problem. Please check your math and try again.");
    }
  }
}
