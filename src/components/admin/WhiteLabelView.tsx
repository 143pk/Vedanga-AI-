import React, { useState } from "react";
import { Palette, Globe, Image, Save, CheckCircle } from "lucide-react";

interface WhiteLabelViewProps {
  settings: any;
  token: string;
  onRefresh: () => void;
}

export const WhiteLabelView: React.FC<WhiteLabelViewProps> = ({ settings, token, onRefresh }) => {
  const [form, setForm] = useState({
    appName: settings?.appName || "Vedanga AI",
    companyName: settings?.companyName || "Vedanga Technologies",
    logoUrl: settings?.logoUrl || "/icon.png",
    faviconUrl: settings?.faviconUrl || "/favicon.ico",
    primaryColor: settings?.primaryColor || "#f59e0b",
    footerText: settings?.footerText || "© 2026 Vedanga AI. Authentic Vedic Astrology & Cosmic Intelligence.",
    contactEmail: settings?.contactEmail || "support@vedanga.ai",
    supportLink: settings?.supportLink || "https://vedanga.ai/support",
    twitterUrl: settings?.twitterUrl || "https://twitter.com/vedanga_ai",
    instagramUrl: settings?.instagramUrl || "https://instagram.com/vedanga_ai",
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/white-label", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to save white label settings", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-100 flex items-center gap-2">
            <Palette className="w-6 h-6 text-amber-400" />
            <span>White-Label Branding Customization</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Customize platform app name, logo URLs, theme accent colors, footer disclosures, and social links.
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
              <span>Save White Label Branding</span>
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span>Branding & White-Label settings saved successfully!</span>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 backdrop-blur-xl text-sm">
        <h3 className="font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400" />
          <span>General Platform Identity</span>
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Application Name</label>
            <input
              type="text"
              value={form.appName}
              onChange={(e) => setForm({ ...form, appName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Company Entity Name</label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Logo URL Asset</label>
            <input
              type="text"
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Favicon Asset URL</label>
            <input
              type="text"
              value={form.faviconUrl}
              onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Primary Theme Accent Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.primaryColor}
              onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
              className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
            />
            <input
              type="text"
              value={form.primaryColor}
              onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs w-32"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Footer Copyright Text</label>
          <input
            type="text"
            value={form.footerText}
            onChange={(e) => setForm({ ...form, footerText: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Contact Support Email</label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Support Helpdesk URL</label>
            <input
              type="text"
              value={form.supportLink}
              onChange={(e) => setForm({ ...form, supportLink: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
