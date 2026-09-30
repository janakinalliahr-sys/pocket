import React, { useState } from 'react';
import { X, Target, Calendar, DollarSign, Check, Info } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { SavingsGoal } from '../types/finance';

const GOAL_TYPES: SavingsGoal['type'][] = [
  'Emergency fund',
  'Laptop',
  'Phone',
  'Education',
  'Vacation',
  'Vehicle',
  'Custom',
];

export const GoalModal: React.FC = () => {
  const { isGoalModalOpen, setIsGoalModalOpen, addGoal, user } = useFinance();

  const [name, setName] = useState('');
  const [type, setType] = useState<SavingsGoal['type']>('Emergency fund');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isGoalModalOpen) return null;

  // Real-time calculation of suggested monthly contribution
  const parsedTarget = parseFloat(targetAmount) || 0;
  const today = new Date();
  const target = new Date(targetDate);
  const monthsRemaining = Math.max(
    1,
    (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth())
  );
  const suggestedMonthly = parsedTarget > 0 ? Math.ceil(parsedTarget / monthsRemaining) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a goal name');
      return;
    }
    if (parsedTarget <= 0) {
      setError('Target amount must be greater than zero');
      return;
    }

    addGoal({
      name: name.trim(),
      type,
      targetAmount: parsedTarget,
      targetDate,
      notes: notes.trim(),
    });

    setIsGoalModalOpen(false);
    setName('');
    setTargetAmount('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Savings Goal</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Set a target and let PocketSmart calculate your roadmap
            </p>
          </div>
          <button
            onClick={() => setIsGoalModalOpen(false)}
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

          {/* Goal Category Preset */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Goal Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {GOAL_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t);
                    if (!name || GOAL_TYPES.includes(name as any)) {
                      setName(t === 'Custom' ? '' : t);
                    }
                  }}
                  className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    type === t
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Goal Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Goal Name / Description
            </label>
            <input
              type="text"
              placeholder="e.g. 6-Month Emergency Reserve, MacBook Air M3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
          </div>

          {/* Target Amount & Target Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Amount ({user.currency})
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-bold text-slate-400">
                  {user.currency}
                </span>
                <input
                  type="number"
                  step="any"
                  placeholder="50,000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-2 text-sm font-bold text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          {/* AI Calculated Monthly Projection Callout */}
          {parsedTarget > 0 && (
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-3.5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <div className="flex items-start gap-2.5">
                <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-emerald-900 dark:text-emerald-200">
                    Suggested Monthly Contribution: {user.currency}
                    {suggestedMonthly.toLocaleString('en-IN')}/mo
                  </div>
                  <p className="text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Save across {monthsRemaining} {monthsRemaining === 1 ? 'month' : 'months'} to hit your goal on schedule.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Keep in high yield account, non-negotiable goal"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsGoalModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>Create Goal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
