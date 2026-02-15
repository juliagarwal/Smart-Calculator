
import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';

interface SmartAssistantProps {
  onCalculate: (calc: { expression: string; result: string }) => void;
}

const SmartAssistant: React.FC<SmartAssistantProps> = ({ onCalculate }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ result: string, explanation: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const gemini = GeminiService.getInstance();
      const res = await gemini.solveNaturalLanguage(query);
      setResponse(res);
      onCalculate({ expression: query, result: res.result });
    } catch (err) {
      setError('Could not understand that math problem. Please try again with simpler wording.');
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    "What is 15% of 1,240?",
    "Convert 45 miles to kilometers",
    "Square root of 841",
    "If I have 12 apples and eat 3, then buy 5 more, how many do I have?"
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-purple-700 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Math Assistant
        </h3>
        <p className="text-slate-500 text-xs">Ask questions in natural language and Gemini will solve them.</p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., What's the area of a circle with 5m radius?"
          className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-200 min-h-[120px] resize-none text-slate-700 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className={`absolute bottom-3 right-3 p-3 rounded-xl shadow-lg transition-all ${loading ? 'bg-slate-300' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </form>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs flex gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {response && (
        <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-2">Answer</div>
          <div className="text-3xl font-bold text-purple-900 mb-3">{response.result}</div>
          <div className="text-sm text-purple-700 leading-relaxed border-t border-purple-100 pt-3 italic">
             &ldquo;{response.explanation}&rdquo;
          </div>
        </div>
      )}

      {!response && !loading && !error && (
        <div className="space-y-3">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Try these examples</p>
          <div className="grid grid-cols-1 gap-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setQuery(ex)}
                className="text-left p-3 text-sm text-slate-600 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAssistant;
