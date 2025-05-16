export interface Tip {
  amount: number;
  type: 'cash' | 'prepaid';
}

export interface Order {
  id: string;
  date: string; // ISO format string
  timestamp: number; // For sorting and time calculations
  tip?: Tip;
}

export interface DailySummary {
  date: string;
  orderCount: number;
  cashTips: number;
  prepaidTips: number;
}

export interface MonthlySummary {
  year: number;
  month: number;
  orderCount: number;
  cashTips: number;
  prepaidTips: number;
  averageTipPerOrder: number;
}

// Helper functions to work with dates
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const getTodayDate = (): string => {
  return formatDate(new Date());
};

export const getCurrentMonthKey = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
};

export const parseMonthKey = (key: string): { year: number; month: number } => {
  const [year, month] = key.split('-').map(Number);
  return { year, month };
};

export const getMonthName = (monthNumber: number): string => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString('default', { month: 'long' });
};

export const generateOrderId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 5);
};

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
};