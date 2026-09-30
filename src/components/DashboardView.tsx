import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  TrendingUp,
  Sparkles,
  Target,
  Plus,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CATEGORY_COLORS, formatCurrency } from '../utils/financeEngine';
import { ExpenseCategory } from '../types/finance';

export const DashboardView: React.FC = () => {
  const {
    user,
    expenses,
    goals,
    recommendations,
    summary,
    setActiveTab,
    setIsExpenseModalOpen,
    setEditingExpense,
    applyRecommendation,
    dismissRecommendation,
  } = useFinance();

  const [activeDonutIndex, setActiveDonutIndex] = useState<number | null>(null);

  // Compute donut chart slices
  const categoryBreakdown = Object.entries(summary.variableExpensesByCategory)
    .filter(([_, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1]);

  const totalVariableSpent = summary.variableExpensesTotal || 1;

  let cumulativeAngle = 0;
  const donutSlices = categoryBreakdown.map(([cat, amount], idx) => {
    const percentage = (amount / totalVariableSpent) * 100;
    const angle = (amount / totalVariableSpent) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    return {
      category: cat as ExpenseCategory,
      amount,
      percentage,
      startAngle,
      angle,
      color: CATEGORY_COLORS[cat as ExpenseCategory]?.fill || '#94a3b8',
    };
  });

  // SVG Donut Path helper
  const getSlicePath = (startAngle: number, angle: number, radius: number, innerRadius: number) => {
    const endAngle = startAngle + angle;
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = 100 + radius * Math.cos(startRad);
    const y1 = 100 + radius * Math.sin(startRad);
    const x2 = 100 + radius * Math.cos(endRad);
    const y2 = 100 + radius * Math.sin(endRad);

    const x3 = 100 + innerRadius * Math.cos(endRad);
    const y3 = 100 + innerRadius * Math.sin(endRad);
    const x4 = 100 + innerRadius * Math.cos(startRad);
    const y4 = 100 + innerRadius * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  // Weekly spending breakdown (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const dailySpendData = last7Days.map((dayStr) => {
    const dayExpenses = expenses.filter((e) => e.date === dayStr);
    const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    const d = new Date(dayStr);
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    return { dayStr, label, total };
  });

  const maxDailySpend = Math.max(...dailySpendData.map((d) => d.total), 3000);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Financial Health Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Welcome back, {user.name} · Real-time budget tracking & AI optimizations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ai')}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors"
          >
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Ask PocketSmart AI</span>
          </button>
          <button
            onClick={() => {
              setEditingExpense(null);
              setIsExpenseModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Monthly Income</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(summary.income, user.currency)}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Fixed commitments: {formatCurrency(summary.fixedExpensesTotal, user.currency)}</span>
            </div>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Total Spent This Month</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(summary.totalExpenses, user.currency)}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Variable: {formatCurrency(summary.variableExpensesTotal, user.currency)}</span>
              <span>·</span>
              <span>Fixed: {formatCurrency(summary.fixedExpensesTotal, user.currency)}</span>
            </div>
          </div>
        </div>

        {/* Current Balance / Remaining Disposable */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Remaining Balance</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <PiggyBank className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div
              className={`text-2xl font-bold tracking-tight ${
                summary.currentBalance >= 0
                  ? 'text-slate-900 dark:text-white'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formatCurrency(summary.currentBalance, user.currency)}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span>Savings Rate: </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {summary.actualSavingsRate.toFixed(1)}%
              </span>
              <span>(Target: {user.preferredSavingsTargetPercent}%)</span>
            </div>
          </div>
        </div>

        {/* Overall Budget Utilization */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Budget Utilization</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {summary.overallBudgetUtilization.toFixed(0)}%
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {summary.overallBudgetUtilization > 90 ? 'Alert' : 'On Track'}
              </span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  summary.overallBudgetUtilization > 90
                    ? 'bg-rose-500'
                    : summary.overallBudgetUtilization > 75
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, summary.overallBudgetUtilization)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart: Expense by Category (2 cols on lg) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Spending by Category
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Interactive distribution of variable expenses this month
              </p>
            </div>
            <button
              onClick={() => setActiveTab('expenses')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>All Transactions</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* SVG Donut */}
            <div className="relative flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-52 h-52 transform -rotate-90">
                {donutSlices.map((slice, idx) => (
                  <path
                    key={slice.category}
                    d={getSlicePath(slice.startAngle, slice.angle, 85, 55)}
                    fill={slice.color}
                    className={`transition-all duration-200 cursor-pointer ${
                      activeDonutIndex === idx ? 'opacity-100 scale-105' : 'opacity-90 hover:opacity-100'
                    }`}
                    onMouseEnter={() => setActiveDonutIndex(idx)}
                    onMouseLeave={() => setActiveDonutIndex(null)}
                  />
                ))}
              </svg>
              {/* Donut Center Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {activeDonutIndex !== null ? donutSlices[activeDonutIndex]?.category : 'Variable'}
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeDonutIndex !== null
                    ? formatCurrency(donutSlices[activeDonutIndex]?.amount, user.currency)
                    : formatCurrency(summary.variableExpensesTotal, user.currency)}
                </span>
                <span className="text-[10px] text-slate-400">
                  {activeDonutIndex !== null
                    ? `${donutSlices[activeDonutIndex]?.percentage.toFixed(1)}%`
                    : `${expenses.length} records`}
                </span>
              </div>
            </div>

            {/* Category Legends & Values */}
            <div className="space-y-2.5">
              {donutSlices.map((slice, idx) => (
                <div
                  key={slice.category}
                  onMouseEnter={() => setActiveDonutIndex(idx)}
                  onMouseLeave={() => setActiveDonutIndex(null)}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                    activeDonutIndex === idx
                      ? 'bg-slate-100 dark:bg-slate-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {slice.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400 dark:text-slate-500">
                      {slice.percentage.toFixed(0)}%
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(slice.amount, user.currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Spending Bar Chart (1 col on lg) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Spending Velocity
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Daily spending across the last 7 days
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                7 Days
              </span>
            </div>

            {/* Interactive Bars */}
            <div className="mt-8 flex items-end justify-between gap-2 h-44 px-2">
              {dailySpendData.map((d) => {
                const heightPercent = maxDailySpend > 0 ? (d.total / maxDailySpend) * 100 : 0;
                return (
                  <div key={d.dayStr} className="group flex-1 flex flex-col items-center gap-1.5">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-700 dark:text-slate-300 pointer-events-none mb-1">
                      {formatCurrency(d.total, user.currency)}
                    </div>
                    {/* Bar */}
                    <div className="w-full max-w-[28px] h-32 bg-slate-100 dark:bg-slate-800 rounded-t-md flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          d.total > 3000
                            ? 'bg-amber-500'
                            : d.total > 0
                            ? 'bg-emerald-500'
                            : 'bg-transparent'
                        }`}
                        style={{ height: `${Math.max(4, heightPercent)}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Daily Average:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatCurrency(
                dailySpendData.reduce((s, d) => s + d.total, 0) / 7,
                user.currency
              )}
              /day
            </span>
          </div>
        </div>
      </div>

      {/* AI Recommendations Preview */}
      <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 p-6 dark:border-emerald-900/50 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-emerald-100/60 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                PocketSmart AI Recommendations
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Actionable tips with reasons & estimated savings impact
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('ai')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
          >
            <span>Run Deep Analysis</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 2).map((rec) => (
            <div
              key={rec.id}
              className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {rec.category}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      rec.urgency === 'high'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {rec.urgency} priority
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {rec.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Why: </span>
                  {rec.reason}
                </p>
                <div className="mt-2 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg">
                  <span className="font-semibold">Impact: </span>
                  {rec.estimatedImpact}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 italic truncate max-w-[200px]">
                  {rec.suggestedAction}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => dismissRecommendation(rec.id)}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => applyRecommendation(rec.id)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                      rec.isApplied
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {rec.isApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Savings Goals & Category Budgets 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Goals Widget */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Active Savings Goals
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatCurrency(summary.totalGoalsSaved, user.currency)} saved of{' '}
                {formatCurrency(summary.totalGoalsTarget, user.currency)}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('goals')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
            >
              <span>Manage Goals</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {goals.slice(0, 3).map((goal) => {
              const progress =
                goal.targetAmount > 0
                  ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
                  : 0;
              return (
                <div key={goal.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {goal.name}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {formatCurrency(goal.currentAmount, user.currency)} /{' '}
                      {formatCurrency(goal.targetAmount, user.currency)} ({progress.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Target Date: {goal.targetDate}</span>
                    <span>AI Contribution: {formatCurrency(goal.monthlyContributionSuggested || 0, user.currency)}/mo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget Health Monitor */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Category Budget Limits
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track limits before exceeding category budgets
              </p>
            </div>
            <button
              onClick={() => setActiveTab('budget')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
            >
              <span>Smart Generator</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3.5">
            {summary.categoryStatus.slice(0, 4).map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[cat.category]?.fill }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {cat.category}
                    </span>
                  </div>
                  <span
                    className={`font-semibold ${
                      cat.isExceeded
                        ? 'text-rose-600 dark:text-rose-400'
                        : cat.isNearLimit
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {formatCurrency(cat.totalSpent, user.currency)} / {formatCurrency(cat.limit, user.currency)}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
