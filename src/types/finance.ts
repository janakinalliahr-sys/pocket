export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Shopping'
  | 'Bills'
  | 'Education'
  | 'Healthcare'
  | 'Entertainment'
  | 'Other';

export interface FixedExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  dueDateDay?: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Cash' | 'Net Banking';
  isRecurring?: boolean;
  notes?: string;
}

export interface CategoryBudget {
  category: ExpenseCategory;
  limit: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  currency: string;
  monthlyIncome: number;
  fixedExpenses: FixedExpenseItem[];
  preferredSavingsTargetPercent: number; // e.g. 20 for 20%
  priority: 'balanced' | 'aggressive_savings' | 'debt_relief' | 'lifestyle';
  theme: 'light' | 'dark';
  notificationSettings: {
    budgetAlertThreshold: number; // e.g. 80
    highExpenseAlert: boolean;
    weeklySummary: boolean;
    goalMilestones: boolean;
  };
}

export interface SavingsGoal {
  id: string;
  name: string;
  type:
    | 'Emergency fund'
    | 'Laptop'
    | 'Phone'
    | 'Education'
    | 'Vacation'
    | 'Vehicle'
    | 'Custom';
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  monthlyContributionSuggested?: number;
  notes?: string;
  contributions: {
    id: string;
    date: string;
    amount: number;
    type: 'deposit' | 'withdraw';
  }[];
}

export interface Recommendation {
  id: string;
  title: string;
  category: string;
  reason: string;
  estimatedImpact: string;
  suggestedAction: string;
  urgency: 'high' | 'medium' | 'low';
  isApplied?: boolean;
  isDismissed?: boolean;
}

export interface NotificationAlert {
  id: string;
  title: string;
  message: string;
  type: 'budget_warning' | 'spending_surge' | 'savings_target' | 'info';
  severity: 'warning' | 'danger' | 'success' | 'info';
  timestamp: string;
  isRead: boolean;
  actionRoute?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  calculations?: {
    label: string;
    value: string;
  }[];
}
