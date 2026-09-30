import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, CreditCard, FileText, Check } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CATEGORIES, CATEGORY_COLORS } from '../utils/financeEngine';
import { ExpenseCategory } from '../types/finance';

export const ExpenseModal: React.FC = () => {
  const {
    isExpenseModalOpen,
    setIsExpenseModalOpen,
    editingExpense,
    setEditingExpense,
    addExpense,
    updateExpense,
    user,
  } = useFinance();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<
    'UPI' | 'Credit Card' | 'Debit Card' | 'Cash' | 'Net Banking'
  >('UPI');
  const [isRecurring, setIsRecurring] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
      setPaymentMethod(editingExpense.paymentMethod);
      setIsRecurring(!!editingExpense.isRecurring);
      setNotes(editingExpense.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('UPI');
      setIsRecurring(false);
      setNotes('');
    }
    setError('');
  }, [editingExpense, isExpenseModalOpen]);

  if (!isExpenseModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title or description');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please provide a valid positive amount');
      return;
    }

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        title: title.trim(),
        amount: parsedAmount,
        category,
        date,
        paymentMethod,
        isRecurring,
        notes: notes.trim(),
      });
    } else {
      addExpense({
        title: title.trim(),
        amount: parsedAmount,
        category,
        date,
        paymentMethod,
        isRecurring,
        notes: notes.trim(),
      });
    }

    setIsExpenseModalOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Categorize your spending to keep budgets & AI models updated
            </p>
          </div>
          <button
            onClick={() => {
              setIsExpenseModalOpen(false);
              setEditingExpense(null);
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              {error}
            </div>
          )}

          {/* Amount & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount ({user.currency})
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-bold text-slate-400">
                  {user.currency}
                </span>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-2 text-base font-bold text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Expense Description
              </label>
              <input
                type="text"
                placeholder="e.g. Swiggy Dinner, Metro Pass, Grocery"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                const colors = CATEGORY_COLORS[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-500 ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full mb-1"
                      style={{ backgroundColor: colors.fill }}
                    />
                    <span className="truncate max-w-full">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Transaction Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e: any) => setPaymentMethod(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          {/* Notes & Recurring */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Split with Rahul, client lunch"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700"
            />
            <label htmlFor="recurring" className="text-xs text-slate-600 dark:text-slate-400">
              Recurring monthly expense
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsExpenseModalOpen(false);
                setEditingExpense(null);
              }}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>{editingExpense ? 'Save Changes' : 'Record Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
