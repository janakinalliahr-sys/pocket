import React, { useState } from 'react';
import {
  Target,
  Plus,
  Calendar,
  PiggyBank,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/financeEngine';
import { SavingsGoal } from '../types/finance';
import { GoalContributionModal } from './GoalContributionModal';

export const GoalsView: React.FC = () => {
  const { goals, deleteGoal, setIsGoalModalOpen, user, summary } = useFinance();
  const [selectedGoalForAction, setSelectedGoalForAction] = useState<SavingsGoal | null>(null);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Savings Goals
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Set ambitious targets, track milestones, and view AI-suggested monthly allocations
          </p>
        </div>
        <button
          onClick={() => setIsGoalModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Overview Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Total Accumulated Savings
          </span>
          <div className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(summary.totalGoalsSaved, user.currency)}
          </div>
          <span className="text-[11px] text-slate-400">
            {summary.overallGoalsProgress.toFixed(0)}% of combined {formatCurrency(summary.totalGoalsTarget, user.currency)} target
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Remaining to Targets
          </span>
          <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(summary.totalGoalsRemaining, user.currency)}
          </div>
          <span className="text-[11px] text-slate-400">
            Across {goals.length} active financial goals
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Monthly Surplus Capacity
          </span>
          <div className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(summary.currentBalance, user.currency)}
          </div>
          <span className="text-[11px] text-slate-400">
            Available to fund milestones this month
          </span>
        </div>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 mx-auto mb-3">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No savings goals created yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Create goals like an Emergency fund, Laptop, Phone, Education, Vacation, or Vehicle.
          </p>
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Create First Goal</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal) => {
            const progress =
              goal.targetAmount > 0
                ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
                : 0;
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

            // Compute months left
            const today = new Date();
            const target = new Date(goal.targetDate);
            const monthsLeft = Math.max(
              1,
              (target.getFullYear() - today.getFullYear()) * 12 +
                (target.getMonth() - today.getMonth())
            );

            return (
              <div
                key={goal.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {goal.type}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {goal.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                      title="Delete goal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Financial figures */}
                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(goal.currentAmount, user.currency)}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Saved of {formatCurrency(goal.targetAmount, user.currency)}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {progress.toFixed(0)}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* AI Projection Box */}
                  <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 dark:border-emerald-950 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Suggested Monthly Contribution</span>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between text-xs">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatCurrency(goal.monthlyContributionSuggested || 0, user.currency)}
                        <span className="text-[11px] font-normal text-slate-500"> / month</span>
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {monthsLeft} {monthsLeft === 1 ? 'month' : 'months'} remaining
                      </span>
                    </div>
                  </div>

                  {/* Target Date */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Deadline: {goal.targetDate}</span>
                    </span>
                    <span>Remaining: {formatCurrency(remaining, user.currency)}</span>
                  </div>
                </div>

                {/* Contribution Action Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedGoalForAction(goal)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
                  >
                    <ArrowDownRight className="h-3.5 w-3.5" />
                    <span>Deposit Funds</span>
                  </button>
                  <button
                    onClick={() => setSelectedGoalForAction(goal)}
                    className="inline-flex items-center justify-center px-3 rounded-xl border border-slate-200 hover:bg-slate-50 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span>Manage</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Deposit / Withdraw Modal */}
      <GoalContributionModal
        goal={selectedGoalForAction}
        onClose={() => setSelectedGoalForAction(null)}
      />
    </div>
  );
};
