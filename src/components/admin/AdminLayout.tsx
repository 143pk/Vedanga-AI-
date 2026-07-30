import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Crown,
  Cpu,
  BookOpen,
  Bell,
  BarChart3,
  ShieldAlert,
  Palette,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

import { DashboardOverview } from "./DashboardOverview";
import { UserManagement } from "./UserManagement";
import { SubscriptionManagement } from "./SubscriptionManagement";
import { AiConfiguration } from "./AiConfiguration";
import { ContentManagement } from "./ContentManagement";
import { NotificationCenter } from "./NotificationCenter";
import { AnalyticsView } from "./AnalyticsView";
import { ErrorLogsView } from "./ErrorLogsView";
import { WhiteLabelView } from "./WhiteLabelView";
import { SystemSettingsView } from "./SystemSettingsView";

interface AdminLayoutProps {
  token: string;
  adminUser: any;
  onLogout: () => void;
  onExitAdmin: () => void;
}

export type AdminViewSection =
  | "overview"
  | "users"
  | "subscriptions"
  | "ai-config"
  | "cms"
  | "notifications"
  | "analytics"
  | "logs"
  | "white-label"
  | "settings";

export const AdminLayout: React.FC<AdminLayoutProps> = ({ token, adminUser, onLogout, onExitAdmin }) => {
  const [activeSection, setActiveSection] = useState<AdminViewSection>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Data states
  const [overviewData, setOverviewData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [aiConfig, setAiConfig] = useState<any>(null);
  const [cmsArticles, setCmsArticles] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [whiteLabelSettings, setWhiteLabelSettings] = useState<any>(null);
  const [systemSettings, setSystemSettings] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  // Fetch all admin data using token
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headers = { "x-admin-token": token };

      const [
        overviewRes,
        usersRes,
        plansRes,
        aiConfigRes,
        cmsRes,
        notifRes,
        analyticsRes,
        logsRes,
        whiteLabelRes,
        settingsRes,
      ] = await Promise.all([
        fetch("/api/admin/overview-stats", { headers }),
        fetch("/api/admin/users", { headers }),
        fetch("/api/admin/plans", { headers }),
        fetch("/api/admin/ai-config", { headers }),
        fetch("/api/admin/cms", { headers }),
        fetch("/api/admin/notifications", { headers }),
        fetch("/api/admin/analytics", { headers }),
        fetch("/api/admin/logs", { headers }),
        fetch("/api/admin/white-label", { headers }),
        fetch("/api/admin/settings", { headers }),
      ]);

      if (overviewRes.ok) setOverviewData(await overviewRes.json());
      if (usersRes.ok) {
        const u = await usersRes.json();
        setUsers(Array.isArray(u) ? u : u.users || []);
      }
      if (plansRes.ok) {
        const p = await plansRes.json();
        setPlans(Array.isArray(p) ? p : p.plans || []);
      }
      if (aiConfigRes.ok) {
        const ai = await aiConfigRes.json();
        setAiConfig(ai.config || ai);
      }
      if (cmsRes.ok) {
        const c = await cmsRes.json();
        setCmsArticles(Array.isArray(c) ? c : c.articles || []);
      }
      if (notifRes.ok) {
        const n = await notifRes.json();
        setNotifications(Array.isArray(n) ? n : n.notifications || []);
      }
      if (analyticsRes.ok) setAnalyticsData(await analyticsRes.json());
      if (logsRes.ok) {
        const l = await logsRes.json();
        setLogs(Array.isArray(l) ? l : l.logs || []);
      }
      if (whiteLabelRes.ok) {
        const wl = await whiteLabelRes.json();
        setWhiteLabelSettings(wl.settings || wl);
      }
      if (settingsRes.ok) {
        const st = await settingsRes.json();
        setSystemSettings(st.settings || st);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  const navItems = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "users", label: "User Management", icon: Users, count: users.length },
    { id: "subscriptions", label: "Subscriptions & Plans", icon: Crown },
    { id: "ai-config", label: "AI & Model Config", icon: Cpu },
    { id: "cms", label: "Content & CMS", icon: BookOpen },
    { id: "notifications", label: "Notification Center", icon: Bell },
    { id: "analytics", label: "Deep Analytics", icon: BarChart3 },
    { id: "logs", label: "Error Logs & Telemetry", icon: ShieldAlert, alert: logs.length > 0 },
    { id: "white-label", label: "White Label Settings", icon: Palette },
    { id: "settings", label: "System & Security", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans">
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 shadow-xl"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-slate-900/95 border-r border-slate-800/80 backdrop-blur-2xl flex flex-col justify-between transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6">
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-slate-100 text-base leading-tight">
                  Vedanga AI
                </h2>
                <span className="text-[10px] uppercase tracking-wider font-mono text-amber-400 font-semibold">
                  Admin Console v2.5
                </span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id as AdminViewSection);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
                      {item.count}
                    </span>
                  )}
                  {item.alert && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Footer & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-xs">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{adminUser?.name || "Acharya Admin"}</p>
              <p className="text-[10px] text-slate-500 font-mono truncate">{adminUser?.email || "admin@vedanga.ai"}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onExitAdmin}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Main App</span>
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs transition-colors"
              title="Logout Admin Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Breadcrumb Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60">
          <div className="flex items-center gap-2 font-mono">
            <span>Admin</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-amber-400 capitalize">{activeSection.replace("-", " ")}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              System Status: Operational
            </span>
          </div>
        </div>

        {/* View Component Rendering */}
        {activeSection === "overview" && (
          <DashboardOverview data={overviewData} loading={loading} onRefresh={fetchAdminData} />
        )}
        {activeSection === "users" && (
          <UserManagement users={users} token={token} onRefresh={fetchAdminData} />
        )}
        {activeSection === "subscriptions" && (
          <SubscriptionManagement plans={plans} token={token} onRefresh={fetchAdminData} />
        )}
        {activeSection === "ai-config" && (
          <AiConfiguration config={aiConfig} token={token} onRefresh={fetchAdminData} />
        )}
        {activeSection === "cms" && (
          <ContentManagement articles={cmsArticles} token={token} onRefresh={fetchAdminData} />
        )}
        {activeSection === "notifications" && (
          <NotificationCenter notifications={notifications} token={token} onRefresh={fetchAdminData} />
        )}
        {activeSection === "analytics" && (
          <AnalyticsView data={analyticsData} loading={loading} />
        )}
        {activeSection === "logs" && (
          <ErrorLogsView logs={logs} token={token} onRefresh={fetchAdminData} />
        )}
        {activeSection === "white-label" && (
          <WhiteLabelView settings={whiteLabelSettings} token={token} onRefresh={fetchAdminData} />
        )}
        {activeSection === "settings" && (
          <SystemSettingsView settings={systemSettings} token={token} onRefresh={fetchAdminData} />
        )}
      </main>
    </div>
  );
};
