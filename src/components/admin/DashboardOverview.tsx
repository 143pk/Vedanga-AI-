import React from "react";
import { Users, UserCheck, Crown, ShieldAlert, MessageSquare, Cpu, DollarSign, Mail, Activity, TrendingUp, Zap, BarChart2 } from "lucide-react";

interface DashboardOverviewProps {
  data: any;
  loading: boolean;
  onRefresh: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ data, loading, onRefresh }) => {
  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading Admin Overview Metrics...</span>
      </div>
    );
  }

  const { stats, charts } = data;

  const statCards = [
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30", badge: "+12.4% this mo" },
    { label: "Active Users Today", value: stats.activeToday.toLocaleString(), icon: UserCheck, color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30", badge: "Live Now" },
    { label: "Premium Subscribers", value: stats.premiumSubs.toLocaleString(), icon: Crown, color: "from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30", badge: "19.8% Conv" },
    { label: "Free Users", value: stats.freeUsers.toLocaleString(), icon: Users, color: "from-slate-500/20 to-slate-700/10 text-slate-400 border-slate-700/40", badge: "Standard Tier" },
    { label: "Total AI Conversations", value: stats.totalAiConversations.toLocaleString(), icon: MessageSquare, color: "from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30", badge: "All Time" },
    { label: "Today's AI Conversations", value: stats.todayAiConversations.toLocaleString(), icon: Zap, color: "from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30", badge: "Today" },
    { label: "Monthly AI Conversations", value: stats.monthlyAiConversations.toLocaleString(), icon: Activity, color: "from-violet-500/20 to-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30", badge: "July 2026" },
    { label: "Estimated Token Usage", value: stats.estimatedAiTokenUsage, icon: Cpu, color: "from-orange-500/20 to-amber-500/10 text-orange-400 border-orange-500/30", badge: "Gemini 2.5" },
    { label: "Estimated AI Cost", value: stats.estimatedAiCostUSD, icon: DollarSign, color: "from-green-500/20 to-emerald-500/10 text-emerald-400 border-emerald-500/30", badge: "USD / Mo" },
    { label: "Total Registered Emails", value: stats.totalRegisteredEmails.toLocaleString(), icon: Mail, color: "from-sky-500/20 to-blue-500/10 text-sky-400 border-sky-500/30", badge: "Verified" },
    { label: "Avg Daily Active Users", value: stats.averageDAU.toLocaleString(), icon: TrendingUp, color: "from-amber-500/20 to-orange-500/10 text-amber-300 border-amber-500/30", badge: "30-day Avg" },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-100 flex items-center gap-2">
            <span>Executive Dashboard Overview</span>
            <span className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full font-sans border border-amber-500/30">Live Analytics</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time platform metrics, Gemini AI token utilization, subscription metrics, and growth health.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Activity className="w-4 h-4 text-amber-400" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 11 Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} border bg-slate-900/70 backdrop-blur-md relative overflow-hidden group hover:border-amber-500/40 transition-all shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{card.label}</span>
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-slate-100">{card.value}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950/60 text-slate-300 font-sans border border-slate-800">
                  {card.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Users & Active Trend */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-amber-400" />
                <span>Daily Users & Activity Trend</span>
              </h3>
              <p className="text-xs text-slate-400">Total registered vs active daily engagement</p>
            </div>
            <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              +14% Engagement
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {charts.dailyUsersChart.map((item: any, i: number) => {
              const maxVal = 1500;
              const totalPct = Math.min(100, (item.total / maxVal) * 100);
              const activePct = Math.min(100, (item.active / maxVal) * 100);

              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300 font-mono">
                    <span className="font-semibold text-slate-200">{item.day}</span>
                    <span className="text-slate-400">{item.active} active / {item.total} total</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${activePct}%` }}
                      className="bg-amber-500 h-full rounded-full transition-all"
                    />
                    <div
                      style={{ width: `${totalPct - activePct}%` }}
                      className="bg-slate-700 h-full rounded-r-full transition-all opacity-40"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Usage & Token Trends */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span>Hourly AI Gemini Queries & Token Load</span>
              </h3>
              <p className="text-xs text-slate-400">24-hour distribution of AstroGuru consultations</p>
            </div>
            <span className="text-xs text-purple-300 font-mono bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
              Gemini 2.5 Flash
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {charts.aiUsageChart.map((item: any, i: number) => {
              const maxChats = 350;
              const pct = Math.min(100, (item.chats / maxChats) * 100);

              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300 font-mono">
                    <span className="text-slate-400">{item.hour}</span>
                    <span className="text-purple-300">{item.chats} chats ({item.tokens.toLocaleString()} tokens)</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subscription Breakdown & Growth */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <h3 className="text-base font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" />
          <span>Subscription Tier Distribution</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {charts.subscriptionDistribution.map((tier: any, i: number) => (
            <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">{tier.name}</p>
                <p className="text-xl font-bold text-slate-100 font-mono mt-1">{tier.count} <span className="text-xs font-normal text-slate-400">users</span></p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-amber-400 font-mono">{tier.percent}%</span>
                <p className="text-[10px] text-slate-500">of total userbase</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
