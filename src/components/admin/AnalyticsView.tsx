import React from "react";
import { BarChart3, TrendingUp, Users, Activity, Clock, Zap, DollarSign, Award } from "lucide-react";

interface AnalyticsViewProps {
  data: any;
  loading: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading Deep System Analytics...</span>
      </div>
    );
  }

  const { metrics, featureUsageSplit, apiTrends } = data;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-400" />
            <span>In-Depth System & Conversion Analytics</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Product engagement, daily vs monthly active metrics, feature consumption split, and MRR performance.
          </p>
        </div>
      </div>

      {/* Highlights Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Daily Active Users (DAU)</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100">{metrics.dau}</p>
          <span className="text-[10px] text-emerald-400 font-mono">+18% vs last week</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Monthly Active Users (MAU)</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100">{metrics.mau}</p>
          <span className="text-[10px] text-amber-300 font-mono">92% retention rate</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Avg Session Duration</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100">{metrics.avgSessionDuration}</p>
          <span className="text-[10px] text-cyan-300 font-mono">Deep engagement</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Premium Conversion Rate</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-400">{metrics.conversionRate}</p>
          <span className="text-[10px] text-purple-300 font-mono">High SaaS benchmark</span>
        </div>
      </div>

      {/* Feature Usage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Feature Consumption Distribution</span>
          </h3>

          <div className="space-y-4">
            {featureUsageSplit.map((item: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300 font-mono">
                  <span className="font-semibold text-slate-200">{item.feature}</span>
                  <span className="text-amber-300">{item.percentage}% ({item.requests.toLocaleString()} reqs)</span>
                </div>
                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%` }}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Latency & Trends */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>API Latency & Health Trends</span>
          </h3>

          <div className="space-y-3">
            {apiTrends.map((trend: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 font-semibold">{trend.date}</span>
                <span className="text-emerald-400">Latency: {trend.latencyMs}ms</span>
                <span className={trend.errorCount > 0 ? "text-amber-400" : "text-slate-500"}>
                  {trend.errorCount} Errors
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
