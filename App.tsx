
import React, { useState, useEffect, useCallback } from 'react';
import Calculator from './components/Calculator';
import History from './components/History';
import SmartAssistant from './components/SmartAssistant';
import { Calculation } from './types';

const App: React.FC = () => {
  const [history, setHistory] = useState<Calculation[]>([]);
  const [activeTab, setActiveTab] = useState<'calc' | 'history' | 'ai'>('calc');
  const [reuseValue, setReuseValue] = useState<string | null>(null);

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
    // Clear reuse value after a tick to allow the calculator to react
    setTimeout(() => setReuseValue(null), 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-8">
      <header className="w-full max-w-md mb-8 text-center">
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
            <SmartAssistant onCalculate={addHistoryItem} />
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
        <span>Powered by Gemini 3</span>
        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
        <span>Advanced Precision Engine</span>
      </footer>
    </div>
  );
};

export default App;
