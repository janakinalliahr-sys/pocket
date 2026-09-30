import React from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ExpensesView } from './components/ExpensesView';
import { BudgetView } from './components/BudgetView';
import { GoalsView } from './components/GoalsView';
import { AIAssistantView } from './components/AIAssistantView';
import { ProfileView } from './components/ProfileView';
import { ExpenseModal } from './components/ExpenseModal';
import { GoalModal } from './components/GoalModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ShieldCheck, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab } = useFinance();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'home' && <DashboardView />}
        {activeTab === 'expenses' && <ExpensesView />}
        {activeTab === 'budget' && <BudgetView />}
        {activeTab === 'goals' && <GoalsView />}
        {activeTab === 'ai' && <AIAssistantView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Global Modals */}
      <ExpenseModal />
      <GoalModal />
      <NotificationsModal />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 py-6 text-xs text-slate-500 dark:border-slate-800/80 dark:bg-slate-900/60 mt-auto hidden md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              PocketSmart <span className="text-emerald-600 dark:text-emerald-400">AI</span>
            </span>
            <span>·</span>
            <span>Your Smart Budget & Recommendation Assistant</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
            <span>Deterministic financial math + Gemini 3.8 Flash AI reasoning</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Private & Local storage</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
