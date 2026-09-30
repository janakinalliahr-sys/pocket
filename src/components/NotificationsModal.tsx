import React from 'react';
import { X, Bell, AlertTriangle, AlertCircle, TrendingUp, CheckCircle2, ArrowRight, Trash2 } from 'lucide-react';
import { useFinance, NavTab } from '../context/FinanceContext';
import { NotificationAlert } from '../types/finance';

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    alerts,
    markAlertAsRead,
    clearAllAlerts,
    setActiveTab,
  } = useFinance();

  if (!isNotificationsOpen) return null;

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const getSeverityIcon = (type: NotificationAlert['type'], severity: NotificationAlert['severity']) => {
    if (type === 'spending_surge') {
      return <TrendingUp className="h-4 w-4 text-amber-500" />;
    }
    if (severity === 'danger') {
      return <AlertCircle className="h-4 w-4 text-rose-500" />;
    }
    if (severity === 'warning') {
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    }
    return <Bell className="h-4 w-4 text-emerald-500" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Alerts & Notifications</span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {unreadCount} new
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time financial alerts, budget warnings & savings milestones
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {alerts.length > 0 && (
              <button
                onClick={clearAllAlerts}
                title="Clear all alerts"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* List of Alerts */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                You're all caught up!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                No active budget warnings or high-spending spikes right now.
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => markAlertAsRead(alert.id)}
                className={`group relative rounded-xl border p-4 transition-all cursor-pointer ${
                  alert.isRead
                    ? 'border-slate-100 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-800/30'
                    : 'border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-xs dark:bg-slate-800">
                    {getSeverityIcon(alert.type, alert.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {alert.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {alert.message}
                    </p>

                    {alert.actionRoute && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAlertAsRead(alert.id);
                          setIsNotificationsOpen(false);
                          setActiveTab(alert.actionRoute as NavTab);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 mt-2.5 transition-colors"
                      >
                        <span>View in {alert.actionRoute}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-3 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Configurable in Profile Settings</span>
          <button
            onClick={() => {
              setIsNotificationsOpen(false);
              setActiveTab('profile');
            }}
            className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
