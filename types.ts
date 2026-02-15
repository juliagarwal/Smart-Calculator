
export interface Calculation {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type Operator = '+' | '-' | '*' | '/' | null;

export interface CalculatorState {
  currentValue: string;
  previousValue: string;
  operator: Operator;
  waitingForOperand: boolean;
}
