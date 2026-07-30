import React, { useState } from "react";
import { ShieldAlert, Search, Filter, Trash2, Download, RefreshCw, AlertTriangle, Info, Terminal } from "lucide-react";

interface ErrorLogsViewProps {
  logs: any[];
  token: string;
  onRefresh: () => void;
}

export const ErrorLogsView: React.FC<ErrorLogsViewProps> = ({ logs, token, onRefresh }) => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const logList = Array.isArray(logs) ? logs : [];
  const filteredLogs = logList.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || log.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleClearLogs = async () => {
    if (!confirm("Are you sure you want to clear system event logs?")) return;

    try {
      await fetch("/api/admin/logs/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
      });
      onRefresh();
    } catch (err) {
      console.error("Failed to clear logs", err);
    }
  };

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vedanga_admin_logs_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <span>System Monitoring & Exception Logs</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time telemetry stream for AI model exceptions, SMTP errors, failed authentication attempts, and API routes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleExportLogs}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleClearLogs}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-sm font-medium rounded-xl border border-rose-500/30 transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search error stack or log message..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50"
          >
            <option value="All">All Categories</option>
            <option value="AI">AI Errors</option>
            <option value="AUTH">Failed Logins / Auth</option>
            <option value="API">API & Server</option>
            <option value="SMTP">SMTP Email Errors</option>
            <option value="USER">User Operations</option>
          </select>
        </div>
      </div>

      {/* Console Style Log Viewer */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 text-slate-500">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-300">Live Telemetry Console ({filteredLogs.length} entries)</span>
          </div>
          <span>ISO UTC Stream</span>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {filteredLogs.length === 0 ? (
            <p className="text-slate-600 italic py-4 text-center">No matching log entries found.</p>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 hover:bg-slate-900 transition-colors"
              >
                <div className="mt-0.5">
                  {log.severity === "error" ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : log.severity === "warning" ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Info className="w-4 h-4 text-sky-400 shrink-0" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px]">
                        [{log.type}]
                      </span>
                      <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-slate-200 break-words">{log.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
