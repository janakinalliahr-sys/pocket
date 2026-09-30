import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/financeEngine';

export const AIAssistantView: React.FC = () => {
  const {
    chatMessages,
    sendChatMessage,
    aiLoading,
    spendingAnalysis,
    runAiSpendingAnalysis,
    recommendations,
    fetchAiRecommendations,
    applyRecommendation,
    dismissRecommendation,
    user,
    summary,
  } = useFinance();

  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'analysis' | 'pipeline'>('chat');
  const [inputPrompt, setInputPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Where am I spending the most?',
    `Can I afford a ${user.currency}5,000 purchase this month?`,
    'How much should I save every month?',
    'Why did my expenses increase?',
    'Give me tips to reduce my food expenses.',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, aiLoading]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || aiLoading) return;
    sendChatMessage(text.trim());
    setInputPrompt('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              PocketSmart AI Assistant
            </h1>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              Grounded in your data
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Personal finance intelligence, spending diagnostics, and tailored budgeting roadmaps
          </p>
        </div>

        {/* Sub-tab segmented control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'chat'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            AI Chatbot
          </button>
          <button
            onClick={() => {
              setActiveSubTab('analysis');
              if (!spendingAnalysis) runAiSpendingAnalysis();
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'analysis'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Spending Diagnostics
          </button>
          <button
            onClick={() => setActiveSubTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'pipeline'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Recommendation Engine
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Educational & Budgeting Assistance:</strong> Calculations are strictly deterministic based on your real records. PocketSmart does not provide licensed financial product endorsements.
          </span>
        </div>
      </div>

      {/* SUB-TAB 1: AI Chatbot */}
      {activeSubTab === 'chat' && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col h-[650px] overflow-hidden">
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {chatMessages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                      isUser
                        ? 'bg-slate-800 text-white dark:bg-slate-700'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {isUser ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                    <div
                      className={`mt-1 text-[10px] ${
                        isUser ? 'text-emerald-200 text-right' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {aiLoading && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white text-xs">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 text-xs text-slate-500">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                  <span>PocketSmart AI is computing your numbers...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="border-t border-slate-100 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>Suggested questions:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {samplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={aiLoading}
                  className="whitespace-nowrap rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask PocketSmart anything about your income, food spend, affordability..."
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                disabled={aiLoading}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || aiLoading}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-white font-semibold transition-colors disabled:opacity-50 shadow-sm"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: AI Spending Pattern Analysis */}
      {activeSubTab === 'analysis' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span>AI Spending Pattern Diagnostics</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Automated detection of irregular spikes, category frequency, and behavioral habits
                </p>
              </div>
              <button
                onClick={runAiSpendingAnalysis}
                disabled={aiLoading}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
                <span>Re-run Diagnostics</span>
              </button>
            </div>

            {/* Diagnostics content */}
            {spendingAnalysis ? (
              <div className="mt-6 space-y-6">
                {/* Executive Summary */}
                <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Executive Health Summary
                  </span>
                  <p className="text-sm font-medium text-slate-900 dark:text-white mt-1 leading-relaxed">
                    {spendingAnalysis.summary}
                  </p>
                </div>

                {/* Detected Spending Spikes */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Unusual or High Spending Outliers</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {spendingAnalysis.spendingSpikes?.map((spike: any, idx: number) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 dark:border-amber-950 dark:bg-amber-950/20"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-amber-900 dark:text-amber-200">
                            {spike.category}
                          </span>
                          <span className="font-bold text-rose-600 dark:text-rose-400">
                            {spike.percentageChange}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {spike.observation}
                        </p>
                        {spike.estimatedExcess && (
                          <div className="mt-2 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                            Excess Outflow: ~{formatCurrency(spike.estimatedExcess, user.currency)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Behavioral Trends & Reduction Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Frequently Used Categories */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800/40">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                      Top Spending Frequency Drivers
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {spendingAnalysis.frequentlyUsedCategories?.map((item: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800/40">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                      Immediate Cost Reduction Levers
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {spendingAnalysis.reductionOpportunities?.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Habit observation */}
                {spendingAnalysis.behavioralTrend && (
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Behavioral Pattern:
                    </span>{' '}
                    {spendingAnalysis.behavioralTrend}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <button
                  onClick={runAiSpendingAnalysis}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Generate AI Spending Diagnostics</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Recommendation Engine Pipeline */}
      {activeSubTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Visual Architecture Representation */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Recommendation Logic Pipeline
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
              Real-time multi-stage inference flowing from fixed obligations to personalized actions
            </p>

            {/* Pipeline Flow Visualization */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Income ({formatCurrency(user.monthlyIncome, user.currency)})
              </span>
              <ArrowRight className="h-3 w-3 text-slate-400" />
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Fixed ({formatCurrency(summary.fixedExpensesTotal, user.currency)})
              </span>
              <ArrowRight className="h-3 w-3 text-slate-400" />
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Variable ({formatCurrency(summary.variableExpensesTotal, user.currency)})
              </span>
              <ArrowRight className="h-3 w-3 text-slate-400" />
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Spending Patterns
              </span>
              <ArrowRight className="h-3 w-3 text-slate-400" />
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Savings Goals
              </span>
              <ArrowRight className="h-3 w-3 text-slate-400" />
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Budget ({summary.overallBudgetUtilization.toFixed(0)}%)
              </span>
              <ArrowRight className="h-3 w-3 text-emerald-500" />
              <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white">
                Personalized Recommendations
              </span>
            </div>
          </div>

          {/* Recommendations Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Active Personalized Recommendations ({recommendations.length})
              </h3>
              <button
                onClick={fetchAiRecommendations}
                disabled={aiLoading}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
                <span>Refresh AI Pipeline</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
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
                        {rec.urgency} urgency
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                      {rec.title}
                    </h4>

                    {/* Reason */}
                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Reason:{' '}
                      </span>
                      {rec.reason}
                    </div>

                    {/* Estimated Impact */}
                    <div className="mt-2 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/60">
                      <span className="font-semibold">Estimated Impact: </span>
                      {rec.estimatedImpact}
                    </div>

                    {/* Suggested Action */}
                    <div className="mt-2 text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">Suggested Action: </span>
                      {rec.suggestedAction}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => dismissRecommendation(rec.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => applyRecommendation(rec.id)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        rec.isApplied
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{rec.isApplied ? 'Applied to Plan' : 'Apply Action'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
