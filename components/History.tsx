
import React from 'react';
import { Calculation } from '../types';

interface HistoryProps {
  history: Calculation[];
  onClear: () => void;
  onReuse: (value: string) => void;
}

const History: React.FC<HistoryProps> = ({ history, onClear, onReuse }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 py-20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-center font-medium">Your calculation history is empty</p>
        <p className="text-xs">Complete a calculation to see it here</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-700">Recent Activity</h3>
        <button 
          onClick={onClear}
          className="text-xs text-rose-500 hover:text-rose-600 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onReuse(item.result)}
            className="group p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-all animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs text-slate-400">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-wider text-blue-500 font-bold transition-opacity">
                Click to Reuse
              </span>
            </div>
            <div className="text-sm text-slate-600 truncate">{item.expression} =</div>
            <div className="text-lg font-bold text-slate-800 break-all">{item.result}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
