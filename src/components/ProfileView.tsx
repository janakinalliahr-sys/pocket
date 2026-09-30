import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Download,
  Trash2,
  RefreshCw,
  Bell,
  Wallet,
  Plus,
  Check,
  Lock,
  FileSpreadsheet,
  AlertCircle,
  FileCode,
  DollarSign,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, CATEGORIES } from '../utils/financeEngine';
import { ExpenseCategory } from '../types/finance';

export const ProfileView: React.FC = () => {
  const {
    user,
    updateUserProfile,
    addFixedExpense,
    deleteFixedExpense,
    exportDataJSON,
    exportDataCSV,
    resetToSampleData,
    clearAllData,
    summary,
  } = useFinance();

  // Profile Form state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [currency, setCurrency] = useState(user.currency || '₹');
  const [income, setIncome] = useState(user.monthlyIncome.toString());
  const [savingsTarget, setSavingsTarget] = useState(user.preferredSavingsTargetPercent.toString());
  const [budgetThreshold, setBudgetThreshold] = useState(
    user.notificationSettings.budgetAlertThreshold.toString()
  );

  // New Fixed Expense Form
  const [fixedName, setFixedName] = useState('');
  const [fixedAmount, setFixedAmount] = useState('');
  const [fixedCategory, setFixedCategory] = useState<ExpenseCategory>('Bills');
  const [isAddingFixed, setIsAddingFixed] = useState(false);

  // Delete modal state
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [saveToast, setSaveToast] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedIncome = parseFloat(income);
    const parsedTarget = parseFloat(savingsTarget);
    const parsedThreshold = parseInt(budgetThreshold);

    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      currency,
      monthlyIncome: isNaN(parsedIncome) ? user.monthlyIncome : parsedIncome,
      preferredSavingsTargetPercent: isNaN(parsedTarget) ? 20 : parsedTarget,
      notificationSettings: {
        ...user.notificationSettings,
        budgetAlertThreshold: isNaN(parsedThreshold) ? 80 : parsedThreshold,
      },
    });

    setSaveToast('Profile settings updated successfully!');
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleAddFixedExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(fixedAmount);
    if (!fixedName.trim() || isNaN(parsed) || parsed <= 0) return;

    addFixedExpense({
      name: fixedName.trim(),
      amount: parsed,
      category: fixedCategory,
    });

    setFixedName('');
    setFixedAmount('');
    setIsAddingFixed(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            User Profile & Privacy Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your credentials, fixed commitments, notification triggers, and data privacy
          </p>
        </div>
      </div>

      {saveToast && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Main Profile Form & Income Settings */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <span>Profile & Financial Baselines</span>
        </h2>

        <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="₹">₹ INR (Indian Rupee)</option>
                <option value="$">$ USD (US Dollar)</option>
                <option value="€">€ EUR (Euro)</option>
                <option value="£">£ GBP (British Pound)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Monthly Net Income ({currency})
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Monthly Savings (%)
              </label>
              <input
                type="number"
                min="0"
                max="90"
                value={savingsTarget}
                onChange={(e) => setSavingsTarget(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Budget Alert Threshold (%)
              </label>
              <select
                value={budgetThreshold}
                onChange={(e) => setBudgetThreshold(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="70">70% of category budget</option>
                <option value="80">80% of category budget (Recommended)</option>
                <option value="90">90% of category budget</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>Save Profile Baselines</span>
            </button>
          </div>
        </form>
      </div>

      {/* Fixed Expenses Manager */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Fixed Monthly Commitments
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Non-negotiable recurring obligations (Rent, EMIs, Utilities, Subscriptions)
            </p>
          </div>
          <button
            onClick={() => setIsAddingFixed(!isAddingFixed)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Fixed Expense</span>
          </button>
        </div>

        {/* Add fixed expense form */}
        {isAddingFixed && (
          <form
            onSubmit={handleAddFixedExpense}
            className="mt-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/20 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Obligation Name
              </label>
              <input
                type="text"
                placeholder="e.g. Home Loan EMI, Rent"
                value={fixedName}
                onChange={(e) => setFixedName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount ({user.currency})
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={fixedAmount}
                onChange={(e) => setFixedAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={fixedCategory}
                onChange={(e: any) => setFixedCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 py-1.5 text-xs font-semibold text-white shadow-xs"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingFixed(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Fixed Expenses List */}
        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {user.fixedExpenses.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.name}
                </div>
                <div className="text-[11px] text-slate-400">
                  Category: {item.category} {item.dueDateDay ? `· Due day ${item.dueDateDay}` : ''}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {formatCurrency(item.amount, user.currency)}
                </span>
                <button
                  onClick={() => deleteFixedExpense(item.id)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-500">Total Fixed Monthly Outflow:</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {formatCurrency(summary.fixedExpensesTotal, user.currency)}
          </span>
        </div>
      </div>

      {/* Privacy, Security & Data Management */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <span>Data Privacy, Portability & Security</span>
        </h2>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4 space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            <span>How PocketSmart AI protects your financial data:</span>
          </div>
          <p>
            • <strong>Isolated Storage:</strong> Your entries and account settings are stored in your secure local session.
          </p>
          <p>
            • <strong>Zero Third-Party Data Selling:</strong> Your numbers are never harvested or sold to advertisers.
          </p>
          <p>
            • <strong>No Payment Credentials:</strong> We never request or store CVVs, OTPs, or bank account passwords.
          </p>
        </div>

        {/* Data Portability and Reset Actions */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={exportDataJSON}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <FileCode className="h-4 w-4 text-emerald-600" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={exportDataCSV}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={resetToSampleData}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-blue-600" />
            <span>Restore Demo Data</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 px-4 py-2.5 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300 transition-colors"
          >
            <Trash2 className="h-4 w-4 text-rose-600" />
            <span>Delete All Records</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Clearing Data */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 mb-3">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Delete All Financial Records?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              This will permanently delete all your logged expenses, custom budgets, savings goals, and alerts.
            </p>

            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllData();
                  setShowClearConfirm(false);
                }}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
