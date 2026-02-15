
import React, { useState, useEffect } from 'react';
import { CalculatorState, Operator } from '../types';

interface CalculatorProps {
  onCalculate: (calc: { expression: string; result: string }) => void;
  reuseValue: string | null;
}

const Calculator: React.FC<CalculatorProps> = ({ onCalculate, reuseValue }) => {
  const [state, setState] = useState<CalculatorState>({
    currentValue: '0',
    previousValue: '',
    operator: null,
    waitingForOperand: false,
  });

  useEffect(() => {
    if (reuseValue !== null) {
      setState(prev => ({
        ...prev,
        currentValue: reuseValue,
        waitingForOperand: false
      }));
    }
  }, [reuseValue]);

  const inputDigit = (digit: string) => {
    const { currentValue, waitingForOperand } = state;

    if (waitingForOperand) {
      setState({
        ...state,
        currentValue: digit,
        waitingForOperand: false,
      });
    } else {
      setState({
        ...state,
        currentValue: currentValue === '0' ? digit : currentValue + digit,
      });
    }
  };

  const inputDot = () => {
    const { currentValue, waitingForOperand } = state;

    if (waitingForOperand) {
      setState({
        ...state,
        currentValue: '0.',
        waitingForOperand: false,
      });
    } else if (currentValue.indexOf('.') === -1) {
      setState({
        ...state,
        currentValue: currentValue + '.',
      });
    }
  };

  const clearAll = () => {
    setState({
      currentValue: '0',
      previousValue: '',
      operator: null,
      waitingForOperand: false,
    });
  };

  const toggleSign = () => {
    const { currentValue } = state;
    const newValue = parseFloat(currentValue) * -1;

    setState({
      ...state,
      currentValue: String(newValue),
    });
  };

  const inputPercent = () => {
    const { currentValue } = state;
    const value = parseFloat(currentValue);

    if (value === 0) return;

    const newValue = String(value / 100);

    setState({
      ...state,
      currentValue: newValue,
    });
  };

  const performOperation = (nextOperator: Operator) => {
    const { currentValue, previousValue, operator } = state;
    const inputValue = parseFloat(currentValue);

    if (previousValue === '') {
      setState({
        ...state,
        previousValue: currentValue,
        operator: nextOperator,
        waitingForOperand: true,
      });
    } else if (operator) {
      const computedValue = calculate(parseFloat(previousValue), inputValue, operator);
      
      setState({
        currentValue: String(computedValue),
        previousValue: String(computedValue),
        operator: nextOperator,
        waitingForOperand: true,
      });
    } else {
      setState({
        ...state,
        operator: nextOperator,
        waitingForOperand: true,
      });
    }
  };

  const calculate = (prev: number, next: number, op: Operator): number => {
    switch (op) {
      case '+': return prev + next;
      case '-': return prev - next;
      case '*': return prev * next;
      case '/': return prev / next;
      default: return next;
    }
  };

  const handleEqual = () => {
    const { currentValue, previousValue, operator } = state;
    if (!operator || previousValue === '') return;

    const result = calculate(parseFloat(previousValue), parseFloat(currentValue), operator);
    const expression = `${previousValue} ${operator} ${currentValue}`;
    
    onCalculate({ expression, result: String(result) });

    setState({
      currentValue: String(result),
      previousValue: '',
      operator: null,
      waitingForOperand: true,
    });
  };

  const Button = ({ label, onClick, className = '' }: { label: string | React.ReactNode, onClick: () => void, className?: string }) => (
    <button
      onClick={onClick}
      className={`h-14 sm:h-16 flex items-center justify-center text-xl font-semibold rounded-2xl transition-all active:scale-95 ${className}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Display Area */}
      <div className="flex-1 flex flex-col justify-end items-end p-4 mb-4 bg-slate-50 rounded-2xl border border-slate-100 min-h-[100px]">
        <div className="text-slate-400 text-sm mb-1 h-6">
          {state.previousValue} {state.operator}
        </div>
        <div className="text-4xl sm:text-5xl font-bold text-slate-800 break-all overflow-hidden text-right">
          {state.currentValue}
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <Button label="AC" onClick={clearAll} className="bg-rose-50 text-rose-500 hover:bg-rose-100" />
        <Button label="±" onClick={toggleSign} className="bg-slate-100 text-slate-600 hover:bg-slate-200" />
        <Button label="%" onClick={inputPercent} className="bg-slate-100 text-slate-600 hover:bg-slate-200" />
        <Button label="÷" onClick={() => performOperation('/')} className="bg-blue-50 text-blue-600 hover:bg-blue-100" />

        {/* Row 2 */}
        <Button label="7" onClick={() => inputDigit('7')} className="bg-white border border-slate-100 text-slate-700 hover:border-slate-300" />
        <Button label="8" onClick={() => inputDigit('8')} className="bg-white border border-slate-100 text-slate-700 hover:border-slate-300" />
        <Button label="9" onClick={() => inputDigit('9')} className="bg-white border border-slate-100 text-slate-700 hover:border-slate-300" />
        <Button label="×" onClick={() => performOperation('*')} className="bg-blue-50 text-blue-600 hover:bg-blue-100" />

        {/* Row 3 */}
        <Button label="4" onClick={() => inputDigit('4')} className="bg-white border border-slate-100 text-slate-700 hover:border-slate-300" />
        <Button label="5" onClick={() => inputDigit('5')} className="bg-white border border-slate-100 text-slate-700 hover:border-slate-300" />
        <Button label="6" onClick={() => inputDigit('6')} className="bg-white border border-slate-100 text-slate-700 hover:border-slate-300" />
        <Button label="−" onClick={() => performOperation('-')} className="bg-blue-50 text-blue-600 hover:bg-blue-100" />

        {/* Row 4 */}
        <Button label="1" onClick={() => inputDigit('1')} className="bg-white border border-slate-100 text-slate-700 hover:border-slate-300" />
        <Button label="2" onClick={() => inputDigit('2')} className="bg-white border border-slate-100 text-slate-700 hover:border-slate-300" />
        <Button label="3" onClick={() => inputDigit('3')} className="bg-white border border-slate-100 text-slate-700 hover:border-slate-300" />
        <Button label="+" onClick={() => performOperation('+')} className="bg-blue-50 text-blue-600 hover:bg-blue-100" />

        {/* Row 5 */}
        <Button label="0" onClick={() => inputDigit('0')} className="bg-white border border-slate-100 text-slate-700 hover:border-slate-300 col-span-2" />
        <Button label="." onClick={inputDot} className="bg-white border border-slate-100 text-slate-700 hover:border-slate-300" />
        <Button label="=" onClick={handleEqual} className="bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100" />
      </div>
    </div>
  );
};

export default Calculator;
