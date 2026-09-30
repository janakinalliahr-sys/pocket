import {
  CategoryBudget,
  Expense,
  ExpenseCategory,
  FixedExpenseItem,
  NotificationAlert,
  Recommendation,
  SavingsGoal,
  UserProfile,
} from '../types/finance';

export const CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Shopping',
  'Bills',
  'Education',
  'Healthcare',
  'Entertainment',
  'Other',
];

export const CATEGORY_COLORS: Record<ExpenseCategory, { bg: string; text: string; fill: string }> = {
  Food: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', fill: '#f59e0b' },
  Transportation: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', fill: '#3b82f6' },
  Shopping: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', fill: '#a855f7' },
  Bills: { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', fill: '#f43f5e' },
  Education: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', fill: '#10b981' },
  Healthcare: { bg: 'bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400', fill: '#14b8a6' },
  Entertainment: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', fill: '#6366f1' },
  Other: { bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', fill: '#64748b' },
};

export const INITIAL_USER: UserProfile = {
  id: 'usr_demo_01',
  name: 'Janaki Raman',
  email: 'janaki.pocket@example.com',
  phone: '+91 98765 43210',
  currency: '₹',
  monthlyIncome: 75000,
  preferredSavingsTargetPercent: 20, // 20% = ₹15,000
  priority: 'balanced',
  theme: 'light',
  fixedExpenses: [
    { id: 'fix_1', name: 'Apartment Rent', amount: 18000, category: 'Bills', dueDateDay: 5 },
    { id: 'fix_2', name: 'High-speed Internet & DTH', amount: 1500, category: 'Bills', dueDateDay: 10 },
    { id: 'fix_3', name: 'Family Health Insurance', amount: 2200, category: 'Healthcare', dueDateDay: 15 },
    { id: 'fix_4', name: 'Digital Subscriptions (OTT/Cloud)', amount: 999, category: 'Entertainment', dueDateDay: 20 },
  ],
  notificationSettings: {
    budgetAlertThreshold: 80,
    highExpenseAlert: true,
    weeklySummary: true,
    goalMilestones: true,
  },
};

export const INITIAL_BUDGETS: CategoryBudget[] = [
  { category: 'Food', limit: 12000 },
  { category: 'Transportation', limit: 5000 },
  { category: 'Shopping', limit: 7000 },
  { category: 'Bills', limit: 22000 },
  { category: 'Education', limit: 4000 },
  { category: 'Healthcare', limit: 4500 },
  { category: 'Entertainment', limit: 4000 },
  { category: 'Other', limit: 3000 },
];

export const INITIAL_GOALS: SavingsGoal[] = [
  {
    id: 'goal_1',
    name: '6-Month Emergency Fund',
    type: 'Emergency fund',
    targetAmount: 150000,
    currentAmount: 95000,
    targetDate: '2026-12-31',
    monthlyContributionSuggested: 13750,
    notes: 'Liquid safe deposit in high-interest savings account',
    contributions: [
      { id: 'c1', date: '2026-08-01', amount: 15000, type: 'deposit' },
      { id: 'c2', date: '2026-09-01', amount: 15000, type: 'deposit' },
    ],
  },
  {
    id: 'goal_2',
    name: 'Work Laptop Upgrade',
    type: 'Laptop',
    targetAmount: 85000,
    currentAmount: 52000,
    targetDate: '2026-11-30',
    monthlyContributionSuggested: 16500,
    notes: 'M3 Chip MacBook Air for freelance design & coding',
    contributions: [
      { id: 'c3', date: '2026-08-15', amount: 12000, type: 'deposit' },
      { id: 'c4', date: '2026-09-10', amount: 10000, type: 'deposit' },
    ],
  },
  {
    id: 'goal_3',
    name: 'Year-End Vacation',
    type: 'Vacation',
    targetAmount: 35000,
    currentAmount: 24000,
    targetDate: '2026-12-20',
    monthlyContributionSuggested: 3667,
    notes: 'Goa beach retreat with family',
    contributions: [
      { id: 'c5', date: '2026-09-05', amount: 8000, type: 'deposit' },
    ],
  },
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp_01',
    title: 'Gourmet Dinner & Swiggy orders',
    amount: 4850,
    category: 'Food',
    date: '2026-09-24',
    paymentMethod: 'UPI',
    notes: 'Weekend team dinner & food deliveries (22% higher than usual)',
  },
  {
    id: 'exp_02',
    title: 'Weekly Supermarket Groceries',
    amount: 3420,
    category: 'Food',
    date: '2026-09-21',
    paymentMethod: 'Debit Card',
    notes: 'Fresh veggies, dairy, and monthly pantry restock',
  },
  {
    id: 'exp_03',
    title: 'Coffee & Cafe work sessions',
    amount: 1450,
    category: 'Food',
    date: '2026-09-18',
    paymentMethod: 'UPI',
    notes: 'Blue Tokai cold brews while remote working',
  },
  {
    id: 'exp_04',
    title: 'Metro Pass Recharge',
    amount: 1200,
    category: 'Transportation',
    date: '2026-09-02',
    paymentMethod: 'UPI',
    isRecurring: true,
  },
  {
    id: 'exp_05',
    title: 'Cab rides (Uber/Ola)',
    amount: 2150,
    category: 'Transportation',
    date: '2026-09-19',
    paymentMethod: 'UPI',
    notes: 'Late night rides after client deadlines',
  },
  {
    id: 'exp_06',
    title: 'Vehicle Fuel Fill-up',
    amount: 1100,
    category: 'Transportation',
    date: '2026-09-12',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'exp_07',
    title: 'All-Weather Windcheater Jacket',
    amount: 3200,
    category: 'Shopping',
    date: '2026-09-14',
    paymentMethod: 'Credit Card',
    notes: 'Decathlon outdoor gear',
  },
  {
    id: 'exp_08',
    title: 'Books & Stationery Essentials',
    amount: 850,
    category: 'Shopping',
    date: '2026-09-08',
    paymentMethod: 'UPI',
  },
  {
    id: 'exp_09',
    title: 'Electricity & Water Utility Bill',
    amount: 1850,
    category: 'Bills',
    date: '2026-09-07',
    paymentMethod: 'Net Banking',
  },
  {
    id: 'exp_10',
    title: 'Quarterly Mobile Prepaid Plan',
    amount: 799,
    category: 'Bills',
    date: '2026-09-03',
    paymentMethod: 'UPI',
    isRecurring: true,
  },
  {
    id: 'exp_11',
    title: 'Full-Stack System Design Course',
    amount: 2499,
    category: 'Education',
    date: '2026-09-11',
    paymentMethod: 'Credit Card',
    notes: 'Advance architecture certification',
  },
  {
    id: 'exp_12',
    title: 'Prescription Eyewear & Medicines',
    amount: 1650,
    category: 'Healthcare',
    date: '2026-09-16',
    paymentMethod: 'UPI',
  },
  {
    id: 'exp_13',
    title: 'Weekend IMAX Movie & Snacks',
    amount: 1750,
    category: 'Entertainment',
    date: '2026-09-22',
    paymentMethod: 'Debit Card',
  },
  {
    id: 'exp_14',
    title: 'Home Plants & Garden Pots',
    amount: 950,
    category: 'Other',
    date: '2026-09-15',
    paymentMethod: 'Cash',
  },
];

export function formatCurrency(amount: number, symbol = '₹'): string {
  const rounded = Math.round(amount);
  if (symbol === '₹') {
    // Format Indian numbering standard: 1,50,000
    const str = Math.abs(rounded).toString();
    let lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return `${rounded < 0 ? '-' : ''}${symbol}${formatted}`;
  }
  return `${rounded < 0 ? '-' : ''}${symbol}${Math.abs(rounded).toLocaleString('en-US')}`;
}

export function calculateFinancialSummary(
  user: UserProfile,
  expenses: Expense[],
  budgets: CategoryBudget[],
  goals: SavingsGoal[]
) {
  const income = user.monthlyIncome;
  const fixedExpensesTotal = user.fixedExpenses.reduce((sum, item) => sum + item.amount, 0);

  // Group variable expenses by category
  const variableExpensesByCategory: Record<ExpenseCategory, number> = {
    Food: 0,
    Transportation: 0,
    Shopping: 0,
    Bills: 0,
    Education: 0,
    Healthcare: 0,
    Entertainment: 0,
    Other: 0,
  };

  expenses.forEach((e) => {
    if (variableExpensesByCategory[e.category] !== undefined) {
      variableExpensesByCategory[e.category] += e.amount;
    } else {
      variableExpensesByCategory.Other += e.amount;
    }
  });

  const variableExpensesTotal = Object.values(variableExpensesByCategory).reduce((sum, val) => sum + val, 0);
  const totalExpenses = fixedExpensesTotal + variableExpensesTotal;
  const currentBalance = income - totalExpenses;

  const targetSavingsAmount = (income * user.preferredSavingsTargetPercent) / 100;
  const actualSavingsRate = income > 0 ? (currentBalance / income) * 100 : 0;

  // Category budget utilization
  const categoryStatus = budgets.map((b) => {
    const fixedForCategory = user.fixedExpenses
      .filter((fe) => fe.category === b.category)
      .reduce((s, fe) => s + fe.amount, 0);
    const variableForCategory = variableExpensesByCategory[b.category] || 0;
    const totalCategorySpent = fixedForCategory + variableForCategory;
    const utilizationPercent = b.limit > 0 ? (totalCategorySpent / b.limit) * 100 : 0;
    const remaining = b.limit - totalCategorySpent;

    return {
      category: b.category,
      limit: b.limit,
      fixedSpent: fixedForCategory,
      variableSpent: variableForCategory,
      totalSpent: totalCategorySpent,
      utilizationPercent,
      remaining,
      isNearLimit: utilizationPercent >= (user.notificationSettings.budgetAlertThreshold || 80) && utilizationPercent < 100,
      isExceeded: totalCategorySpent > b.limit,
    };
  });

  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const overallBudgetUtilization = totalBudgetLimit > 0 ? (totalExpenses / totalBudgetLimit) * 100 : 0;

  // Goals progress
  const totalGoalsTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalGoalsSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalGoalsRemaining = Math.max(0, totalGoalsTarget - totalGoalsSaved);
  const overallGoalsProgress = totalGoalsTarget > 0 ? (totalGoalsSaved / totalGoalsTarget) * 100 : 0;

  return {
    income,
    fixedExpensesTotal,
    variableExpensesTotal,
    totalExpenses,
    currentBalance,
    targetSavingsAmount,
    actualSavingsRate,
    overallBudgetUtilization,
    variableExpensesByCategory,
    categoryStatus,
    totalGoalsTarget,
    totalGoalsSaved,
    totalGoalsRemaining,
    overallGoalsProgress,
  };
}

export function generateSmartRuleBudget(
  income: number,
  fixedExpenses: FixedExpenseItem[],
  priority: UserProfile['priority'] = 'balanced'
): CategoryBudget[] {
  const fixedTotal = fixedExpenses.reduce((s, f) => s + f.amount, 0);
  const availableAfterFixed = Math.max(0, income - fixedTotal);

  // Allocations based on priority modes
  let ratios: Record<ExpenseCategory, number>;

  switch (priority) {
    case 'aggressive_savings':
      // Minimize variable spending to save ~35-40% of income
      ratios = {
        Food: 0.32,
        Transportation: 0.15,
        Shopping: 0.10,
        Bills: 0.08, // variable bills
        Education: 0.12,
        Healthcare: 0.10,
        Entertainment: 0.08,
        Other: 0.05,
      };
      break;

    case 'debt_relief':
      ratios = {
        Food: 0.35,
        Transportation: 0.18,
        Shopping: 0.08,
        Bills: 0.10,
        Education: 0.08,
        Healthcare: 0.10,
        Entertainment: 0.06,
        Other: 0.05,
      };
      break;

    case 'lifestyle':
      ratios = {
        Food: 0.28,
        Transportation: 0.14,
        Shopping: 0.20,
        Bills: 0.06,
        Education: 0.08,
        Healthcare: 0.08,
        Entertainment: 0.12,
        Other: 0.04,
      };
      break;

    case 'balanced':
    default:
      // Balanced 50/30/20 style distribution
      ratios = {
        Food: 0.30,
        Transportation: 0.15,
        Shopping: 0.15,
        Bills: 0.08,
        Education: 0.10,
        Healthcare: 0.10,
        Entertainment: 0.08,
        Other: 0.04,
      };
      break;
  }

  // Allocate from variable disposable pool (60-70% of available, reserving remainder for savings)
  const savingsReserveFactor = priority === 'aggressive_savings' ? 0.55 : priority === 'lifestyle' ? 0.82 : 0.70;
  const variablePool = availableAfterFixed * savingsReserveFactor;

  return CATEGORIES.map((category) => {
    const fixedForCategory = fixedExpenses
      .filter((fe) => fe.category === category)
      .reduce((s, fe) => s + fe.amount, 0);

    const variableLimit = Math.round(variablePool * (ratios[category] || 0.1));
    // Final limit combines fixed obligations + allotted variable discretionary
    const finalLimit = fixedForCategory + Math.max(1000, variableLimit);

    return {
      category,
      limit: Math.ceil(finalLimit / 500) * 500, // round to neat 500s
    };
  });
}

export function generateDeterministicRecommendations(
  user: UserProfile,
  expenses: Expense[],
  budgets: CategoryBudget[],
  goals: SavingsGoal[]
): Recommendation[] {
  const summary = calculateFinancialSummary(user, expenses, budgets, goals);
  const recs: Recommendation[] = [];

  // 1. Food spike check
  const foodSpent = summary.variableExpensesByCategory.Food || 0;
  const foodBudget = budgets.find((b) => b.category === 'Food')?.limit || 12000;
  if (foodSpent >= foodBudget * 0.75) {
    const excess = Math.max(500, Math.round((foodSpent - foodBudget * 0.7) / 100) * 100);
    recs.push({
      id: 'rec_food_spike',
      title: 'Optimize weekend dining & food delivery',
      category: 'Food',
      reason: `You spent ${user.currency}${foodSpent.toLocaleString('en-IN')} on food this month, consuming ${(
        (foodSpent / foodBudget) *
        100
      ).toFixed(0)}% of your food budget.`,
      estimatedImpact: `Potential savings of ${user.currency}${excess.toLocaleString(
        'en-IN'
      )}/month by batching groceries and reducing midweek delivery.`,
      suggestedAction: `Set a weekly dining-out cap of ${user.currency}${Math.round(
        (foodBudget * 0.25) / 4
      )} and meal prep 2 lunches.`,
      urgency: foodSpent >= foodBudget ? 'high' : 'medium',
    });
  }

  // 2. Entertainment check
  const entSpent = (summary.variableExpensesByCategory.Entertainment || 0) +
    user.fixedExpenses.filter((f) => f.category === 'Entertainment').reduce((s, f) => s + f.amount, 0);
  const entBudget = budgets.find((b) => b.category === 'Entertainment')?.limit || 4000;
  if (entSpent >= entBudget * 0.65) {
    recs.push({
      id: 'rec_entertainment',
      title: 'Reduce entertainment spending by 15%',
      category: 'Entertainment',
      reason: `Entertainment spending is currently at ${user.currency}${entSpent.toLocaleString(
        'en-IN'
      )}, which is ${( (entSpent / entBudget) * 100 ).toFixed(0)}% utilized.`,
      estimatedImpact: `Saves ${user.currency}500 - ${user.currency}1,000 monthly without impacting core social time.`,
      suggestedAction: `Audit unused OTT streaming platforms and set a temporary entertainment limit of ${user.currency}${Math.max(
        2000,
        entBudget - 500
      )}.`,
      urgency: 'medium',
    });
  }

  // 3. Savings target check
  const targetSavings = summary.targetSavingsAmount;
  const currentSurplus = summary.currentBalance;
  if (currentSurplus < targetSavings) {
    const gap = targetSavings - currentSurplus;
    recs.push({
      id: 'rec_savings_gap',
      title: `Close the ${user.currency}${gap.toLocaleString('en-IN')} savings goal gap`,
      category: 'Savings',
      reason: `You are ${user.currency}${gap.toLocaleString('en-IN')} away from reaching your ${
        user.preferredSavingsTargetPercent
      }% monthly savings target (${user.currency}${targetSavings.toLocaleString('en-IN')}).`,
      estimatedImpact: `Preserves your ${user.preferredSavingsTargetPercent}% wealth-building compounding rate.`,
      suggestedAction: `Review Shopping and Other miscellaneous expenses for discretionary items that can be deferred to next month.`,
      urgency: 'high',
    });
  } else {
    recs.push({
      id: 'rec_savings_surplus',
      title: 'Allocate surplus to priority emergency fund',
      category: 'Savings',
      reason: `You have maintained a healthy ${summary.actualSavingsRate.toFixed(1)}% savings rate with ${
        user.currency
      }${currentSurplus.toLocaleString('en-IN')} remaining balance.`,
      estimatedImpact: `Accelerates your 6-Month Emergency Fund by 1.5 months.`,
      suggestedAction: `Transfer ${user.currency}${Math.min(
        5000,
        Math.round(currentSurplus * 0.4)
      )} into your emergency reserve goal.`,
      urgency: 'low',
    });
  }

  // 4. Transportation check
  const transportSpent = summary.variableExpensesByCategory.Transportation || 0;
  if (transportSpent > 3000) {
    recs.push({
      id: 'rec_transport',
      title: 'Consolidate ride-hailing trips',
      category: 'Transportation',
      reason: `Ride-hailing cabs and fuel totaled ${user.currency}${transportSpent.toLocaleString(
        'en-IN'
      )} this month.`,
      estimatedImpact: `Estimated savings of ${user.currency}800 - ${user.currency}1,200 monthly.`,
      suggestedAction: `Use rapid transit (Metro/train) for peak traffic commutes and schedule errands along common transit routes.`,
      urgency: 'medium',
    });
  }

  return recs;
}

export function generateDeterministicAlerts(
  user: UserProfile,
  expenses: Expense[],
  budgets: CategoryBudget[],
  goals: SavingsGoal[]
): NotificationAlert[] {
  const summary = calculateFinancialSummary(user, expenses, budgets, goals);
  const alerts: NotificationAlert[] = [];
  const threshold = user.notificationSettings.budgetAlertThreshold || 80;

  // Budget threshold alerts
  summary.categoryStatus.forEach((cat) => {
    if (cat.utilizationPercent >= 100) {
      alerts.push({
        id: `alert_exceed_${cat.category}`,
        title: `${cat.category} Budget Exceeded!`,
        message: `You have spent ${user.currency}${cat.totalSpent.toLocaleString('en-IN')} out of your ${
          user.currency
        }${cat.limit.toLocaleString('en-IN')} limit (${cat.utilizationPercent.toFixed(0)}%).`,
        type: 'budget_warning',
        severity: 'danger',
        timestamp: 'Just now',
        isRead: false,
        actionRoute: 'budget',
      });
    } else if (cat.utilizationPercent >= threshold) {
      alerts.push({
        id: `alert_near_${cat.category}`,
        title: `${cat.category} Budget Alert`,
        message: `You have used ${cat.utilizationPercent.toFixed(0)}% of your ${cat.category.toLowerCase()} budget. ${
          user.currency
        }${cat.remaining.toLocaleString('en-IN')} remaining.`,
        type: 'budget_warning',
        severity: 'warning',
        timestamp: '2 hours ago',
        isRead: false,
        actionRoute: 'budget',
      });
    }
  });

  // Savings gap alert
  const gap = summary.targetSavingsAmount - summary.currentBalance;
  if (gap > 0) {
    alerts.push({
      id: 'alert_savings_target',
      title: 'Savings Target Update',
      message: `You are ${user.currency}${gap.toLocaleString(
        'en-IN'
      )} away from your monthly savings target of ${user.currency}${summary.targetSavingsAmount.toLocaleString(
        'en-IN'
      )}.`,
      type: 'savings_target',
      severity: 'info',
      timestamp: 'Today',
      isRead: false,
      actionRoute: 'goals',
    });
  }

  // Transportation surge alert
  if (summary.variableExpensesByCategory.Transportation > 3000) {
    alerts.push({
      id: 'alert_transport_surge',
      title: 'Spending Pattern Shift',
      message: `Your transportation spending increased this month (+18% vs 3-month baseline).`,
      type: 'spending_surge',
      severity: 'warning',
      timestamp: 'Yesterday',
      isRead: false,
      actionRoute: 'expenses',
    });
  }

  return alerts;
}
