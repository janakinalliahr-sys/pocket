import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CategoryBudget,
  ChatMessage,
  Expense,
  ExpenseCategory,
  FixedExpenseItem,
  NotificationAlert,
  Recommendation,
  SavingsGoal,
  UserProfile,
} from '../types/finance';
import {
  calculateFinancialSummary,
  generateDeterministicAlerts,
  generateDeterministicRecommendations,
  generateSmartRuleBudget,
  INITIAL_BUDGETS,
  INITIAL_EXPENSES,
  INITIAL_GOALS,
  INITIAL_USER,
} from '../utils/financeEngine';

export type NavTab = 'home' | 'expenses' | 'budget' | 'goals' | 'ai' | 'profile';

interface FinanceContextType {
  user: UserProfile;
  expenses: Expense[];
  budgets: CategoryBudget[];
  goals: SavingsGoal[];
  recommendations: Recommendation[];
  alerts: NotificationAlert[];
  chatMessages: ChatMessage[];
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isExpenseModalOpen: boolean;
  setIsExpenseModalOpen: (open: boolean) => void;
  editingExpense: Expense | null;
  setEditingExpense: (exp: Expense | null) => void;
  isGoalModalOpen: boolean;
  setIsGoalModalOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  aiLoading: boolean;

  // Actions
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addFixedExpense: (item: Omit<FixedExpenseItem, 'id'>) => void;
  deleteFixedExpense: (id: string) => void;

  updateBudgets: (newBudgets: CategoryBudget[]) => void;
  generateSmartBudget: (priority?: UserProfile['priority']) => void;

  addGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'contributions'>) => void;
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  contributeToGoal: (id: string, amount: number, type: 'deposit' | 'withdraw') => void;

  dismissRecommendation: (id: string) => void;
  applyRecommendation: (id: string) => void;

  markAlertAsRead: (id: string) => void;
  clearAllAlerts: () => void;

  sendChatMessage: (content: string) => Promise<void>;
  spendingAnalysis: any;
  runAiSpendingAnalysis: () => Promise<void>;
  fetchAiRecommendations: () => Promise<void>;

  exportDataJSON: () => void;
  exportDataCSV: () => void;
  resetToSampleData: () => void;
  clearAllData: () => void;

  // Computed summary
  summary: ReturnType<typeof calculateFinancialSummary>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'pocketsmart_user_v1',
  EXPENSES: 'pocketsmart_expenses_v1',
  BUDGETS: 'pocketsmart_budgets_v1',
  GOALS: 'pocketsmart_goals_v1',
  RECOMMENDATIONS: 'pocketsmart_recs_v1',
  ALERTS: 'pocketsmart_alerts_v1',
  CHAT: 'pocketsmart_chat_v1',
  THEME: 'pocketsmart_theme_v1',
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [budgets, setBudgets] = useState<CategoryBudget[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
    return saved
      ? JSON.parse(saved)
      : generateDeterministicRecommendations(INITIAL_USER, INITIAL_EXPENSES, INITIAL_BUDGETS, INITIAL_GOALS);
  });

  const [alerts, setAlerts] = useState<NotificationAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return saved
      ? JSON.parse(saved)
      : generateDeterministicAlerts(INITIAL_USER, INITIAL_EXPENSES, INITIAL_BUDGETS, INITIAL_GOALS);
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: `👋 Hello Janaki! I'm **PocketSmart AI**, your personal budget and recommendation assistant.
I've analyzed your financial profile:
- **Income:** ₹75,000/month
- **Discretionary Balance:** ₹18,400 remaining
- **Top Category:** Food (82% of budget used)

Ask me anything like *"Can I afford a ₹5,000 purchase this month?"* or *"Where am I spending the most?"*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [spendingAnalysis, setSpendingAnalysis] = useState<any>(null);

  // Sync theme with HTML class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    // refresh deterministic alerts & recommendations when expenses change
    const newAlerts = generateDeterministicAlerts(user, expenses, budgets, goals);
    setAlerts(newAlerts);
  }, [expenses, budgets, goals, user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(recommendations));
  }, [recommendations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
  }, [chatMessages]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const summary = calculateFinancialSummary(user, expenses, budgets, goals);

  // Actions
  const addExpense = (expData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expData,
      id: `exp_${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
  };

  const addFixedExpense = (item: Omit<FixedExpenseItem, 'id'>) => {
    const newItem: FixedExpenseItem = {
      ...item,
      id: `fix_${Date.now()}`,
    };
    setUser((prev) => ({
      ...prev,
      fixedExpenses: [...prev.fixedExpenses, newItem],
    }));
  };

  const deleteFixedExpense = (id: string) => {
    setUser((prev) => ({
      ...prev,
      fixedExpenses: prev.fixedExpenses.filter((f) => f.id !== id),
    }));
  };

  const updateBudgets = (newBudgets: CategoryBudget[]) => {
    setBudgets(newBudgets);
  };

  const generateSmartBudget = (priority?: UserProfile['priority']) => {
    const p = priority || user.priority;
    const newBudgets = generateSmartRuleBudget(user.monthlyIncome, user.fixedExpenses, p);
    setBudgets(newBudgets);
  };

  const addGoal = (goalData: Omit<SavingsGoal, 'id' | 'currentAmount' | 'contributions'>) => {
    // calculate suggested monthly contribution
    const today = new Date();
    const target = new Date(goalData.targetDate);
    const months = Math.max(1, (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth()));
    const suggested = Math.ceil(goalData.targetAmount / months);

    const newGoal: SavingsGoal = {
      ...goalData,
      id: `goal_${Date.now()}`,
      currentAmount: 0,
      monthlyContributionSuggested: suggested,
      contributions: [],
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const contributeToGoal = (id: string, amount: number, type: 'deposit' | 'withdraw') => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const newTotal = type === 'deposit' ? g.currentAmount + amount : Math.max(0, g.currentAmount - amount);
        const newContribution = {
          id: `contrib_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount,
          type,
        };
        return {
          ...g,
          currentAmount: newTotal,
          contributions: [newContribution, ...g.contributions],
        };
      })
    );
  };

  const dismissRecommendation = (id: string) => {
    setRecommendations((prev) => prev.filter((r) => r.id !== id));
  };

  const applyRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isApplied: true } : r))
    );
  };

  const markAlertAsRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const sendChatMessage = async (content: string) => {
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setAiLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          userContext: {
            name: user.name,
            currency: user.currency,
            income: user.monthlyIncome,
            fixedExpensesTotal: summary.fixedExpensesTotal,
            variableExpensesTotal: summary.variableExpensesTotal,
            totalExpenses: summary.totalExpenses,
            currentBalance: summary.currentBalance,
            targetSavingsAmount: summary.targetSavingsAmount,
            actualSavingsRate: summary.actualSavingsRate.toFixed(1) + '%',
            categories: summary.categoryStatus.map((c) => ({
              category: c.category,
              limit: c.limit,
              spent: c.totalSpent,
              utilization: c.utilizationPercent.toFixed(0) + '%',
            })),
            activeGoals: goals.map((g) => ({
              name: g.name,
              target: g.targetAmount,
              current: g.currentAmount,
              date: g.targetDate,
            })),
            recentExpenses: expenses.slice(0, 5).map((e) => ({
              title: e.title,
              amount: e.amount,
              category: e.category,
              date: e.date,
            })),
          },
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I've reviewed your question against your current budget.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback deterministic response
      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: `I've analyzed your financials: Your current disposable balance is ${user.currency}${summary.currentBalance.toLocaleString('en-IN')}. You've utilized ${summary.overallBudgetUtilization.toFixed(0)}% of your overall monthly budget limit.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setAiLoading(false);
    }
  };

  const runAiSpendingAnalysis = async () => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/analyze-spending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          financialData: {
            income: user.monthlyIncome,
            currency: user.currency,
            fixedExpenses: user.fixedExpenses,
            variableByCategory: summary.variableExpensesByCategory,
            categoryStatus: summary.categoryStatus,
            expenses: expenses.slice(0, 20),
          },
        }),
      });
      const data = await response.json();
      setSpendingAnalysis(data);
    } catch (err) {
      console.error('Spending analysis error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const fetchAiRecommendations = async () => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pipelineData: {
            income: user.monthlyIncome,
            currency: user.currency,
            fixedExpenses: user.fixedExpenses,
            variableByCategory: summary.variableExpensesByCategory,
            savingsGoals: goals,
            budgetUtilization: summary.overallBudgetUtilization,
          },
        }),
      });
      const data = await response.json();
      if (data.recommendations && data.recommendations.length > 0) {
        const mapped = data.recommendations.map((r: any, idx: number) => ({
          ...r,
          id: `ai_rec_${Date.now()}_${idx}`,
        }));
        setRecommendations(mapped);
      }
    } catch (err) {
      console.error('Fetch recs error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const exportDataJSON = () => {
    const data = {
      user,
      expenses,
      budgets,
      goals,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pocketsmart_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportDataCSV = () => {
    const headers = ['ID', 'Title', 'Amount', 'Category', 'Date', 'PaymentMethod', 'Recurring', 'Notes'];
    const rows = expenses.map((e) => [
      e.id,
      `"${e.title.replace(/"/g, '""')}"`,
      e.amount,
      e.category,
      e.date,
      e.paymentMethod,
      e.isRecurring ? 'Yes' : 'No',
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pocketsmart_expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetToSampleData = () => {
    setUser(INITIAL_USER);
    setExpenses(INITIAL_EXPENSES);
    setBudgets(INITIAL_BUDGETS);
    setGoals(INITIAL_GOALS);
    setRecommendations(generateDeterministicRecommendations(INITIAL_USER, INITIAL_EXPENSES, INITIAL_BUDGETS, INITIAL_GOALS));
    setAlerts(generateDeterministicAlerts(INITIAL_USER, INITIAL_EXPENSES, INITIAL_BUDGETS, INITIAL_GOALS));
  };

  const clearAllData = () => {
    setExpenses([]);
    setGoals([]);
    setUser((prev) => ({ ...prev, fixedExpenses: [] }));
    setRecommendations([]);
    setAlerts([]);
  };

  return (
    <FinanceContext.Provider
      value={{
        user,
        expenses,
        budgets,
        goals,
        recommendations,
        alerts,
        chatMessages,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        isExpenseModalOpen,
        setIsExpenseModalOpen,
        editingExpense,
        setEditingExpense,
        isGoalModalOpen,
        setIsGoalModalOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        aiLoading,
        addExpense,
        updateExpense,
        deleteExpense,
        updateUserProfile,
        addFixedExpense,
        deleteFixedExpense,
        updateBudgets,
        generateSmartBudget,
        addGoal,
        updateGoal,
        deleteGoal,
        contributeToGoal,
        dismissRecommendation,
        applyRecommendation,
        markAlertAsRead,
        clearAllAlerts,
        sendChatMessage,
        spendingAnalysis,
        runAiSpendingAnalysis,
        fetchAiRecommendations,
        exportDataJSON,
        exportDataCSV,
        resetToSampleData,
        clearAllData,
        summary,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
