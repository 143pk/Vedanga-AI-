import React, { useState } from "react";
import { Crown, Plus, Edit3, Trash2, Check, X, Shield, Sparkles } from "lucide-react";

interface SubscriptionManagementProps {
  plans: any[];
  token: string;
  onRefresh: () => void;
}

export const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ plans, token, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [form, setForm] = useState({
    name: "",
    price: 0,
    currency: "INR",
    interval: "monthly",
    kundliLimit: "",
    chatLimit: "",
    matchingLimit: "",
    features: "",
    enabled: true,
  });

  const handleOpenModal = (plan?: any) => {
    if (plan) {
      setEditingPlan(plan);
      setForm({
        name: plan.name,
        price: plan.price,
        currency: plan.currency || "INR",
        interval: plan.interval || "monthly",
        kundliLimit: plan.kundliLimit || "",
        chatLimit: plan.chatLimit || "",
        matchingLimit: plan.matchingLimit || "",
        features: Array.isArray(plan.features) ? plan.features.join("\n") : plan.features || "",
        enabled: plan.enabled ?? true,
      });
    } else {
      setEditingPlan(null);
      setForm({
        name: "",
        price: 499,
        currency: "INR",
        interval: "monthly",
        kundliLimit: "Unlimited Full Suite",
        chatLimit: "Unlimited AI Consultations",
        matchingLimit: "Unlimited Gun Milan",
        features: "Daily Horoscope\nFull Kundli Analysis\nUnlimited AI Chat\nPDF Report Export",
        enabled: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSavePlan = async () => {
    const payload = {
      id: editingPlan?.id,
      ...form,
      features: form.features.split("\n").filter((f) => f.trim().length > 0),
    };

    try {
      const res = await fetch("/api/admin/plans/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to save plan", err);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscription plan?")) return;

    try {
      await fetch("/api/admin/plans/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ id }),
      });
      onRefresh();
    } catch (err) {
      console.error("Failed to delete plan", err);
    }
  };

  const handleTogglePlanState = async (plan: any) => {
    try {
      await fetch("/api/admin/plans/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({
          ...plan,
          enabled: !plan.enabled,
        }),
      });
      onRefresh();
    } catch (err) {
      console.error("Failed to toggle plan state", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-100 flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            <span>Subscription Tier Management</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure subscription tiers, pricing, feature allocations, AI limits, and plan status.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 text-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Array.isArray(plans) ? plans : []).map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border p-6 flex flex-col justify-between transition-all relative overflow-hidden backdrop-blur-xl ${
              plan.enabled
                ? "bg-slate-900/80 border-slate-800 hover:border-amber-500/40"
                : "bg-slate-950/40 border-slate-900 opacity-60"
            }`}
          >
            {/* Enabled Badge */}
            <div className="flex items-center justify-between mb-4">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  plan.enabled
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-500 border border-slate-700"
                }`}
              >
                {plan.enabled ? "Active Plan" : "Disabled"}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleTogglePlanState(plan)}
                  title={plan.enabled ? "Disable Plan" : "Enable Plan"}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  {plan.enabled ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => handleOpenModal(plan)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-100">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-extrabold text-amber-400 font-mono">
                  {plan.price === 0 ? "Free" : `${plan.currency === "INR" ? "₹" : "$"}${plan.price}`}
                </span>
                {plan.price > 0 && <span className="text-xs text-slate-400 ml-1">/{plan.interval}</span>}
              </div>

              <div className="space-y-2 text-xs border-t border-slate-800 pt-4 mb-4">
                <p className="text-slate-300">
                  <strong className="text-amber-300">AI Limit:</strong> {plan.chatLimit}
                </p>
                <p className="text-slate-300">
                  <strong className="text-amber-300">Kundli Suite:</strong> {plan.kundliLimit}
                </p>
                <p className="text-slate-300">
                  <strong className="text-amber-300">Gun Milan:</strong> {plan.matchingLimit}
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Features Included:</p>
                {Array.isArray(plan.features) &&
                  plan.features.map((feat: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Builder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-100 mb-4">
              {editingPlan ? "Edit Subscription Tier" : "Create New Subscription Tier"}
            </h3>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                    placeholder="e.g. Mystic Pro"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Price</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Billing Interval</label>
                  <select
                    value={form.interval}
                    onChange={(e) => setForm({ ...form, interval: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">AI Daily Chat Allocation</label>
                <input
                  type="text"
                  value={form.chatLimit}
                  onChange={(e) => setForm({ ...form, chatLimit: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  placeholder="e.g. 10 queries/day or Unlimited"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Kundli Analysis Allocation</label>
                <input
                  type="text"
                  value={form.kundliLimit}
                  onChange={(e) => setForm({ ...form, kundliLimit: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  placeholder="e.g. Basic Chart or Unlimited D1-D60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Feature List (1 feature per line)</label>
                <textarea
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs font-mono"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePlan}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-semibold text-sm"
                >
                  Save Subscription Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
