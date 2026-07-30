import React, { useState } from "react";
import { Cpu, Sliders, Shield, Zap, Key, Save, AlertTriangle, Eye, EyeOff, CheckCircle } from "lucide-react";

interface AiConfigurationProps {
  config: any;
  token: string;
  onRefresh: () => void;
}

export const AiConfiguration: React.FC<AiConfigurationProps> = ({ config, token, onRefresh }) => {
  const [form, setForm] = useState({
    aiProvider: config?.aiProvider || "Google Gemini",
    aiModel: config?.aiModel || "gemini-2.5-flash",
    temperature: config?.temperature ?? 0.5,
    maxTokens: config?.maxTokens ?? 4096,
    dailyFreeLimit: config?.dailyUserLimits?.free ?? 10,
    dailyPremiumLimit: config?.dailyUserLimits?.premium ?? 1000,
    systemPrompt: config?.systemPrompt || "",
    safetyPrompt: config?.safetyPrompt || "",
    fallbackModel: config?.fallbackModel || "gemini-1.5-flash",
    apiKey: config?.apiKey || "",
    maintenanceMode: config?.maintenanceMode ?? false,
  });

  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg(false);

    try {
      const res = await fetch("/api/admin/ai-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({
          aiProvider: form.aiProvider,
          aiModel: form.aiModel,
          temperature: parseFloat(form.temperature as any),
          maxTokens: parseInt(form.maxTokens as any, 10),
          dailyUserLimits: {
            free: parseInt(form.dailyFreeLimit as any, 10),
            premium: parseInt(form.dailyPremiumLimit as any, 10),
          },
          systemPrompt: form.systemPrompt,
          safetyPrompt: form.safetyPrompt,
          fallbackModel: form.fallbackModel,
          ...(form.apiKey && !form.apiKey.includes("•••") && { apiKey: form.apiKey }),
          maintenanceMode: form.maintenanceMode,
        }),
      });

      if (res.ok) {
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to save AI config", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-purple-400" />
            <span>AI Engine & Model Configuration</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure Google Gemini models, temperature, system prompts, token limits, safety guardrails, and maintenance mode.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 text-sm self-start md:self-auto disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save AI Settings</span>
            </>
          )}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span>AI Engine Configuration updated successfully!</span>
        </div>
      )}

      {/* Maintenance Mode Alert Toggle */}
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <h3 className="font-bold text-slate-100">Global Maintenance Mode</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Temporarily pause public AI consultations with an administrative maintenance message.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setForm({ ...form, maintenanceMode: !form.maintenanceMode })}
          className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
            form.maintenanceMode ? "bg-amber-500" : "bg-slate-800"
          }`}
        >
          <div
            className={`bg-slate-950 w-6 h-6 rounded-full shadow-md transform transition-transform ${
              form.maintenanceMode ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Grid Settings Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model & Temperature */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Model & Generation Parameters</span>
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">AI Provider</label>
            <select
              value={form.aiProvider}
              onChange={(e) => setForm({ ...form, aiProvider: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
            >
              <option value="Google Gemini">Google Gemini Official SDK</option>
              <option value="Custom API Proxy">Custom Proxy Server</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Primary AI Model</label>
            <select
              value={form.aiModel}
              onChange={(e) => setForm({ ...form, aiModel: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
            >
              <option value="gemini-2.5-flash">gemini-2.5-flash (Recommended Default)</option>
              <option value="gemini-3.6-flash">gemini-3.6-flash (Advanced Reasoning)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Fast)</option>
              <option value="gemini-1.5-flash">gemini-1.5-flash (Legacy)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Fallback Model</label>
            <select
              value={form.fallbackModel}
              onChange={(e) => setForm({ ...form, fallbackModel: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
            >
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite</option>
              <option value="gemini-1.5-flash">gemini-1.5-flash</option>
              <option value="gemini-flash-latest">gemini-flash-latest</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Temperature (Creativity)</span>
              <span className="text-amber-400 font-mono font-bold">{form.temperature}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={form.temperature}
              onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 bg-slate-950 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-1">Lower = Precise & Traditional, Higher = Creative & Expressive</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Maximum Output Tokens</label>
            <input
              type="number"
              value={form.maxTokens}
              onChange={(e) => setForm({ ...form, maxTokens: parseInt(e.target.value, 10) || 2048 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono"
            />
          </div>
        </div>

        {/* Usage Limits & API Keys */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Usage Allocations & Credentials</span>
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Free Tier Daily Limit (queries/day)</label>
            <input
              type="number"
              value={form.dailyFreeLimit}
              onChange={(e) => setForm({ ...form, dailyFreeLimit: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Premium Tier Daily Limit (queries/day)</label>
            <input
              type="number"
              value={form.dailyPremiumLimit}
              onChange={(e) => setForm({ ...form, dailyPremiumLimit: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Server API Key Override</label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={form.apiKey}
                onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                placeholder="Leave as configured or enter GEMINI_API_KEY"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2 text-sm text-slate-100 font-mono placeholder-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Managed via server process.env.GEMINI_API_KEY</p>
          </div>
        </div>
      </div>

      {/* Prompts Configuration */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>System & Safety Prompts</span>
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">AstroGuru System Persona Prompt</label>
          <textarea
            value={form.systemPrompt}
            onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Safety & Ethical Guardrails Prompt</label>
          <textarea
            value={form.safetyPrompt}
            onChange={(e) => setForm({ ...form, safetyPrompt: e.target.value })}
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200"
          />
        </div>
      </div>
    </div>
  );
};
