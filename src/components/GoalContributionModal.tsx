import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Check } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { SavingsGoal } from '../types/finance';

interface GoalContributionModalProps {
  goal: SavingsGoal | null;
  onClose: () => void;
}

export const GoalContributionModal: React.FC<GoalContributionModalProps> = ({ goal, onClose }) => {
  const { contributeToGoal, user } = useFinance();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'deposit' | 'withdraw'>('deposit');
  const [error, setError] = useState('');

  if (!goal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please provide a valid amount');
      return;
    }
    if (type === 'withdraw' && parsed > goal.currentAmount) {
      setError(`Cannot withdraw more than current savings (${user.currency}${goal.currentAmount.toLocaleString('en-IN')})`);
      return;
    }

    contributeToGoal(goal.id, parsed, type);
    onClose();
  };

  const presets = [1000, 2500, 5000, 10000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {type === 'deposit' ? 'Add Funds to Goal' : 'Withdraw from Goal'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[240px]">
              {goal.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="rounded-lg bg-rose-50 p-2.5 text-xs font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              {error}
            </div>
          )}

          {/* Toggle Type */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg dark:bg-slate-800">
            <button
              type="button"
              onClick={() => {
                setType('deposit');
                setError('');
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                type === 'deposit'
                  ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-700 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <ArrowDownRight className="h-3.5 w-3.5 text-emerald-600" />
              <span>Deposit / Save</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('withdraw');
                setError('');
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                type === 'withdraw'
                  ? 'bg-white text-rose-700 shadow-sm dark:bg-slate-700 dark:text-rose-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <ArrowUpRight className="h-3.5 w-3.5 text-rose-600" />
              <span>Withdraw</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Amount ({user.currency})
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base font-bold text-slate-400">
                {user.currency}
              </span>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-2 text-lg font-bold text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                autoFocus
                required
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-4 gap-1.5">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAmount(p.toString())}
                className="px-2 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                +{user.currency}{p.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Current balance:{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {user.currency}{goal.currentAmount.toLocaleString('en-IN')}
            </span>{' '}
            of {user.currency}{goal.targetAmount.toLocaleString('en-IN')}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors ${
                type === 'deposit'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <Check className="h-3.5 w-3.5" />
              <span>Confirm {type === 'deposit' ? 'Deposit' : 'Withdrawal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
