import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Calendar,
  CreditCard,
  Tag,
  ArrowUpDown,
  FileSpreadsheet,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CATEGORIES, CATEGORY_COLORS, formatCurrency } from '../utils/financeEngine';
import { Expense, ExpenseCategory } from '../types/finance';

export const ExpensesView: React.FC = () => {
  const {
    expenses,
    deleteExpense,
    setEditingExpense,
    setIsExpenseModalOpen,
    addExpense,
    user,
    summary,
    exportDataCSV,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [timeframe, setTimeframe] = useState<'all' | 'today' | 'week' | 'month'>('month');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  // Filter logic
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  const filteredExpenses = expenses
    .filter((e) => {
      // Search
      const matchSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category
      const matchCategory = selectedCategory === 'All' || e.category === selectedCategory;

      // Timeframe
      let matchTimeframe = true;
      if (timeframe === 'today') {
        matchTimeframe = e.date === todayStr;
      } else if (timeframe === 'week') {
        const expDate = new Date(e.date);
        matchTimeframe = expDate >= oneWeekAgo && expDate <= now;
      } else if (timeframe === 'month') {
        const [year, month] = e.date.split('-');
        matchTimeframe =
          Number(year) === now.getFullYear() && Number(month) === now.getMonth() + 1;
      }

      return matchSearch && matchCategory && matchTimeframe;
    })
    .sort((a, b) => {
      if (sortBy === 'date_desc') return b.date.localeCompare(a.date);
      if (sortBy === 'date_asc') return a.date.localeCompare(b.date);
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      if (sortBy === 'amount_asc') return a.amount - b.amount;
      return 0;
    });

  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Quick Preset Adders
  const handleQuickAdd = (title: string, amount: number, category: ExpenseCategory) => {
    addExpense({
      title,
      amount,
      category,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI',
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Expense Tracker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Record, categorize, and inspect all your daily, weekly, and monthly transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportDataCSV}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
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

      {/* Quick Add Presets Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
          Quick 1-Tap Expense Presets
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleQuickAdd('Coffee & Snack', 180, 'Food')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
          >
            <span>☕ Coffee / Snack ({user.currency}180)</span>
          </button>
          <button
            onClick={() => handleQuickAdd('Lunch Thali / Meal', 250, 'Food')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
          >
            <span>🍲 Lunch Meal ({user.currency}250)</span>
          </button>
          <button
            onClick={() => handleQuickAdd('Metro / Auto Transit', 90, 'Transportation')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
          >
            <span>🚇 Auto / Metro ({user.currency}90)</span>
          </button>
          <button
            onClick={() => handleQuickAdd('Supermarket Essentials', 650, 'Food')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
          >
            <span>🛒 Pantry Essentials ({user.currency}650)</span>
          </button>
        </div>
      </div>

      {/* Spending Aggregate Cards (Daily, Weekly, Monthly) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Filtered Subtotal
          </span>
          <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(totalFilteredAmount, user.currency)}
          </div>
          <span className="text-[11px] text-slate-400">
            Across {filteredExpenses.length} transactions
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            This Month's Variable Total
          </span>
          <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(summary.variableExpensesTotal, user.currency)}
          </div>
          <span className="text-[11px] text-slate-400">
            Avg: {formatCurrency(summary.variableExpensesTotal / Math.max(1, now.getDate()), user.currency)}/day
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Highest Spending Category
          </span>
          <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Food</span>
            <span className="text-xs font-normal text-slate-500">
              ({formatCurrency(summary.variableExpensesByCategory.Food || 0, user.currency)})
            </span>
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Spike detected: +22% vs baseline
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search expenses by title or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Timeframe Filter Buttons */}
          <div className="sm:col-span-4 flex items-center gap-1 p-1 bg-slate-100 rounded-xl dark:bg-slate-800">
            {(['month', 'week', 'today', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                  timeframe === tf
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="date_desc">Date: Newest First</option>
              <option value="date_asc">Date: Oldest First</option>
              <option value="amount_desc">Amount: High to Low</option>
              <option value="amount_asc">Amount: Low to High</option>
            </select>
          </div>
        </div>

        {/* Category Filter Horizontal Segment */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expense List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No expenses match your filters
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query, timeframe, or category filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredExpenses.map((exp) => {
              const catColor = CATEGORY_COLORS[exp.category];
              return (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs"
                      style={{
                        backgroundColor: `${catColor?.fill}15`,
                        color: catColor?.fill,
                      }}
                    >
                      {exp.category.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {exp.title}
                        </h4>
                        {exp.isRecurring && (
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
                            Recurring
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                          {exp.category}
                        </span>
                        <span>·</span>
                        <span>{exp.date}</span>
                        <span>·</span>
                        <span>{exp.paymentMethod}</span>
                        {exp.notes && (
                          <>
                            <span>·</span>
                            <span className="italic truncate max-w-[200px]">{exp.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      -{formatCurrency(exp.amount, user.currency)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingExpense(exp);
                          setIsExpenseModalOpen(true);
                        }}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        title="Edit expense"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                        title="Delete expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
