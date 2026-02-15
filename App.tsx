
import React, { useState, useEffect, useCallback } from 'react';
import Calculator from './components/Calculator';
import History from './components/History';
import SmartAssistant from './components/SmartAssistant';
import { Calculation } from './types';

// Extend global namespace
declare global {
  // Define the AIStudio interface which is expected by the environment's Window declaration.
  // This allows us to use window.aistudio without redeclaring the property itself,
  // thus avoiding conflicts with existing modifiers like 'readonly'.
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}

const App: React.FC = () => {
  const [history, setHistory] = useState<Calculation[]>([]);
  const [activeTab, setActiveTab] = useState<'calc' | 'history' | 'ai'>('calc');
  const [reuseValue, setReuseValue] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(true);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true); // Assume success per race condition guidelines
    }
  };

  const addHistoryItem = useCallback((calc: Omit<Calculation, 'id' | 'timestamp'>) => {
    const newItem: Calculation = {
      ...calc,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
  }, []);

  const clearHistory = () => setHistory([]);

  const handleReuse = (value: string) => {
    setReuseValue(value);
    setActiveTab('calc');
    setTimeout(() => setReuseValue(null), 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-8">
      <header className="w-full max-w-md mb-8 flex flex-col items-center relative">
        <button 
          onClick={handleOpenKeySelector}
          className={`absolute right-0 top-0 p-2 rounded-full transition-all ${hasKey ? 'text-slate-400 hover:text-blue-500 hover:bg-blue-50' : 'text-amber-500 bg-amber-50 animate-pulse'}`}
          title="Manage API Key"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L7 17l-1 1H3v-3l.707-.707m1.414-1.414L5 11.586V13h1.414l.707-.707 1.414 1.414-1.414 1.414zm3.414-2.414l1.414 1.414L11.414 10l1.414-1.414L11.414 7.172 9.586 9z" clipRule="evenodd" />
          </svg>
        </button>

        <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
          Gemini Pro Calculator
        </h1>
        <p className="text-slate-500 text-sm">Precision tools meets artificial intelligence</p>
      </header>

      <main className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200 overflow-hidden border border-slate-100 transition-all">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-t-3xl border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('calc')}
            className={`flex-1 py-2 text-sm font-medium rounded-2xl transition-all ${activeTab === 'calc' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Standard
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-2 text-sm font-medium rounded-2xl transition-all ${activeTab === 'ai' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Smart AI
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-sm font-medium rounded-2xl transition-all ${activeTab === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            History
          </button>
        </div>

        <div className="p-4 sm:p-6 min-h-[480px] flex flex-col">
          {activeTab === 'calc' && (
            <Calculator onCalculate={addHistoryItem} reuseValue={reuseValue} />
          )}
          {activeTab === 'ai' && (
            <div className="flex flex-col h-full">
              {!hasKey && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800 text-sm">
                  <p className="font-semibold mb-1">API Key Required</p>
                  <p className="mb-3 text-xs opacity-80">To use the Smart AI assistant with Gemini 3 Pro, please select a paid billing project.</p>
                  <button 
                    onClick={handleOpenKeySelector}
                    className="w-full py-2 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors"
                  >
                    Select Key
                  </button>
                </div>
              )}
              <SmartAssistant onCalculate={addHistoryItem} />
            </div>
          )}
          {activeTab === 'history' && (
            <History 
              history={history} 
              onClear={clearHistory} 
              onReuse={handleReuse} 
            />
          )}
        </div>
      </main>

      <footer className="mt-12 text-slate-400 text-xs text-center flex items-center gap-2">
        <span>Powered by Gemini 3 Pro</span>
        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Billing Docs</a>
      </footer>
    </div>
  );
};

export default App;
