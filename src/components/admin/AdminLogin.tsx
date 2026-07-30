import React, { useState } from "react";
import { ShieldCheck, Lock, Mail, Key, Sparkles, ArrowRight, ShieldAlert } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: (token: string, adminUser: any) => void;
  onBackToApp: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToApp }) => {
  const [email, setEmail] = useState("admin@vedanga.ai");
  const [password, setPassword] = useState("admin123");
  const [pin, setPin] = useState("108108");
  const [usePinMode, setUsePinMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, pin }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess(data.token, data.user);
      } else {
        setError(data.error || "Invalid administrator credentials");
      }
    } catch (err) {
      setError("Failed to authenticate with server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 shadow-lg shadow-amber-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-100 flex items-center justify-center gap-2">
            Vedanga AI <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-sans">Admin Console</span>
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Authorized System Administrators Only
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Admin Email / Account
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                placeholder="admin@vedanga.ai"
              />
            </div>
          </div>

          {!usePinMode ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setUsePinMode(true)}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Use Master Security PIN
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                  placeholder="••••••••"
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  Master Security PIN Code
                </label>
                <button
                  type="button"
                  onClick={() => setUsePinMode(false)}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Use Password
                </button>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-amber-300 font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                  placeholder="Enter 6-digit PIN"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={onBackToApp}
            className="hover:text-slate-300 transition-colors"
          >
            ← Back to Vedanga AI App
          </button>
          <span>v2.5.0 Secure Admin</span>
        </div>
      </div>
    </div>
  );
};
