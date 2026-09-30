import React, { useState } from 'react';
import {
  PieChart,
  Sparkles,
  Sliders,
  Check,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Edit2,
  DollarSign,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CATEGORIES, CATEGORY_COLORS, formatCurrency } from '../utils/financeEngine';
import { ExpenseCategory, UserProfile } from '../types/finance';

export const BudgetView: React.FC = () => {
  const {
    user,
    budgets,
    updateBudgets,
    generateSmartBudget,
    updateUserProfile,
    summary,
  } = useFinance();

  const [selectedPriority, setSelectedPriority] = useState<UserProfile['priority']>(user.priority);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [tempLimit, setTempLimit] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const priorityOptions: {
    id: UserProfile['priority'];
    title: string;
    description: string;
    savingsEstimate: string;
  }[] = [
    {
      id: 'balanced',
      title: 'Balanced (50 / 30 / 20)',
      description: '50% needs, 30% wants, 20% savings. Great for sustainable wealth building.',
      savingsEstimate: '20% - 25%',
    },
    {
      id: 'aggressive_savings',
      title: 'Aggressive Wealth Building',
      description: 'Tightens discretionary categories to maximize emergency buffer & investments.',
      savingsEstimate: '35% - 40%',
    },
    {
      id: 'lifestyle',
      title: 'Comfort & Lifestyle',
      description: 'Allocates more room for food, entertainment, and shopping without debt.',
      savingsEstimate: '10% - 15%',
    },
    {
      id: 'debt_relief',
      title: 'Debt & Essential Focus',
      description: 'Directs every excess rupee towards obligations and high-interest payoffs.',
      savingsEstimate: 'Max Payoff',
    },
  ];

  const handleGenerateBudget = (priority: UserProfile['priority']) => {
    setSelectedPriority(priority);
    updateUserProfile({ priority });
    generateSmartBudget(priority);
    setSuccessToast(`Smart Budget regenerated for ${priority.replace('_', ' ')} strategy!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleSaveCategoryLimit = (cat: ExpenseCategory) => {
    const val = parseFloat(tempLimit);
    if (!isNaN(val) && val >= 0) {
      const updated = budgets.map((b) => (b.category === cat ? { ...b, limit: val } : b));
      updateBudgets(updated);
      setEditingCategory(null);
      setTempLimit('');
    }
  };

  const totalBudgetCap = budgets.reduce((s, b) => s + b.limit, 0);
  const availableForSavings = Math.max(0, user.monthlyIncome - totalBudgetCap);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Smart Budget Generator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            AI-modeled spending ceilings tailored to your income, fixed commitments & goals
          </p>
        </div>
      </div>

      {successToast && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Priority Strategy Selection Panel */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Select Your Financial Priority Strategy</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The generator recalculates all category ceilings based on this principle
            </p>
          </div>
          <button
            onClick={() => handleGenerateBudget(selectedPriority)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Regenerate Ceilings</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {priorityOptions.map((opt) => {
            const isSelected = selectedPriority === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleGenerateBudget(opt.id)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 dark:border-emerald-500 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {opt.title}
                  </span>
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-900/50" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {opt.description}
                </p>
                <div className="mt-3 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  Target Savings: {opt.savingsEstimate}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget Summary Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Total Allocated Budget Cap
          </span>
          <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(totalBudgetCap, user.currency)}
          </div>
          <span className="text-[11px] text-slate-400">
            Across all 8 expenditure categories
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Projected Savings Buffer
          </span>
          <div className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(availableForSavings, user.currency)}
          </div>
          <span className="text-[11px] text-slate-400">
            {user.monthlyIncome > 0
              ? `${((availableForSavings / user.monthlyIncome) * 100).toFixed(0)}% of monthly income`
              : '0%'}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Discretionary Disposable Income
          </span>
          <div className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(
              Math.max(0, user.monthlyIncome - summary.fixedExpensesTotal),
              user.currency
            )}
          </div>
          <span className="text-[11px] text-slate-400">
            After {formatCurrency(summary.fixedExpensesTotal, user.currency)} fixed obligations
          </span>
        </div>
      </div>

      {/* Category Ceilings & Progress List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Category Spending Ceilings & Utilization
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any limit to customize it manually
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {summary.categoryStatus.map((cat) => {
            const isEditing = editingCategory === cat.category;
            const colors = CATEGORY_COLORS[cat.category];
            return (
              <div
                key={cat.category}
                className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-800/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: colors.fill }}
                    />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {cat.category}
                    </span>
                  </div>

                  {/* Limit control */}
                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={tempLimit}
                        onChange={(e) => setTempLimit(e.target.value)}
                        placeholder={cat.limit.toString()}
                        className="w-24 rounded border border-emerald-500 px-2 py-0.5 text-xs font-bold text-slate-900 dark:bg-slate-700 dark:text-white"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveCategoryLimit(cat.category)}
                        className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingCategory(cat.category);
                        setTempLimit(cat.limit.toString());
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors"
                      title="Edit spending ceiling"
                    >
                      <span>Cap: {formatCurrency(cat.limit, user.currency)}</span>
                      <Edit2 className="h-3 w-3 opacity-60" />
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.isExceeded
                          ? 'bg-rose-500'
                          : cat.isNearLimit
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, cat.utilizationPercent)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">
                      Spent: {formatCurrency(cat.totalSpent, user.currency)}
                    </span>
                    <span
                      className={`font-semibold ${
                        cat.isExceeded
                          ? 'text-rose-600 dark:text-rose-400'
                          : cat.isNearLimit
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {cat.isExceeded
                        ? `Over budget by ${formatCurrency(cat.totalSpent - cat.limit, user.currency)}`
                        : `${formatCurrency(cat.remaining, user.currency)} remaining (${cat.utilizationPercent.toFixed(0)}%)`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
