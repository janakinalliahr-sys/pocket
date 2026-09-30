import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  Sparkles,
  User,
  Bell,
  Sun,
  Moon,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { useFinance, NavTab } from '../context/FinanceContext';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    alerts,
    setIsNotificationsOpen,
    setIsExpenseModalOpen,
    setEditingExpense,
  } = useFinance();

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'budget', label: 'Budget', icon: PieChart },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left focus-visible:outline-none"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm shadow-emerald-600/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                    PocketSmart <span className="text-emerald-600 dark:text-emerald-400">AI</span>
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Smart Budget & Recommendations
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-100 text-emerald-700 font-semibold dark:bg-slate-800 dark:text-emerald-400'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Add Expense button */}
            <button
              onClick={() => {
                setEditingExpense(null);
                setIsExpenseModalOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Add Expense</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              title="Notifications & Alerts"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
              aria-label="Toggle color theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 backdrop-blur-md dark:border-slate-800/90 dark:bg-slate-900/95 pb-safe">
        <div className="grid grid-cols-6 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.id === 'home' && unreadAlertsCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-rose-500" />
                  )}
                </div>
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
