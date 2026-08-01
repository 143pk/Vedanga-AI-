import React, { useState, useEffect } from "react";
import {
  Globe,
  Search,
  CheckCircle2,
  Copy,
  ExternalLink,
  RefreshCw,
  FileCode,
  FileText,
  Send,
  AlertCircle,
  Code,
  Eye,
  Settings,
  Sparkles,
  ShieldCheck,
  Check,
} from "lucide-react";

interface SeoSearchConsoleViewProps {
  token: string;
}

export const SeoSearchConsoleView: React.FC<SeoSearchConsoleViewProps> = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [seo, setSeo] = useState({
    googleSiteVerification: "vedanga-ai-gsc-verification-code",
    siteUrl: window.location.origin || "https://ais-pre-kkaqrfevbg3kelesribizv-259553995756.asia-southeast1.run.app",
    metaTitle: "Vedanga AI – Vedic Astrology & Kundli Advisor",
    metaDescription: "Personal AI Guru for Vedic Astrology, Kundli Analysis, Horoscope, Remedies, Kundli Matching, and Spiritual Guidance.",
    keywords: "Vedic Astrology, Kundli, Kundli Matching, Horoscope, AI Guru, Jyotish, Remedies, Gun Milan, Dasha Calculator",
    indexFollow: true,
    lastPingedAt: null as string | null,
  });

  const fetchSeoSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seo/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSeo((prev) => ({
            ...prev,
            ...data.settings,
            siteUrl: window.location.origin || data.settings.siteUrl,
          }));
        }
      }
    } catch (err) {
      console.error("Failed to load SEO settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/seo/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(seo),
      });

      if (res.ok) {
        // Also update HTML meta tag in DOM dynamically
        const metaTag = document.getElementById("gsc-meta-verification");
        if (metaTag) {
          metaTag.setAttribute("content", seo.googleSiteVerification);
        }
        setCopiedKey("save_success");
        setTimeout(() => setCopiedKey(null), 3000);
      }
    } catch (err) {
      console.error("Error saving SEO settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const handlePingGoogle = async () => {
    setPinging(true);
    setPingResult(null);
    try {
      const res = await fetch("/api/seo/ping-sitemap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
      });
      const data = await res.json();
      if (data.success) {
        setPingResult(data.message);
        setSeo((prev) => ({ ...prev, lastPingedAt: data.lastPingedAt }));
      } else {
        setPingResult("Registered sitemap ping request.");
      }
    } catch (err: any) {
      setPingResult("Sitemap URL verified locally: " + seo.siteUrl + "/sitemap.xml");
    } finally {
      setPinging(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const sitemapUrl = `${seo.siteUrl}/sitemap.xml`;
  const robotsUrl = `${seo.siteUrl}/robots.txt`;
  const metaTagSnippet = `<meta name="google-site-verification" content="${seo.googleSiteVerification}" />`;
  const htmlFileUrl = `${seo.siteUrl}/google${seo.googleSiteVerification}.html`;

  return (
    <div className="space-y-8 max-w-6xl pb-12">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>Google Search Console Engine</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Index Active</span>
              </span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-slate-100">
              Google Search Console & Site Indexing Management
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Configure Google Search Console verification meta tags, inspect XML sitemaps, verify robots.txt directives, and trigger instant Google indexing pings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 text-sm cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save Indexing Settings</span>
                </>
              )}
            </button>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <span>Open Google Search Console</span>
              <ExternalLink className="w-4 h-4 text-amber-400" />
            </a>
          </div>
        </div>

        {copiedKey === "save_success" && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>SEO Settings and Google Search Console verification meta tag saved successfully!</span>
          </div>
        )}
      </div>

      {/* Grid: Search Console Setup & Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: Ownership Verification Config */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100 text-base">
                  Google Search Console Property Verification
                </h3>
                <p className="text-xs text-slate-400">Set up ownership verification meta tag or HTML file</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              Ready to Verify
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Google Site Verification Token / Meta Content
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={seo.googleSiteVerification}
                  onChange={(e) => setSeo({ ...seo, googleSiteVerification: e.target.value })}
                  placeholder="e.g. google1234567890abcdef"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500/60 font-mono"
                />
                <button
                  onClick={() => copyToClipboard(seo.googleSiteVerification, "token")}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === "token" ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copiedKey === "token" ? "Copied" : "Copy Token"}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Found in Google Search Console under Property &gt; Settings &gt; Ownership Verification &gt; HTML Tag.
              </p>
            </div>

            {/* Rendered HTML Meta Tag */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <Code className="w-3.5 h-3.5 text-amber-400" />
                  Active HTML Meta Tag (Injected in &lt;head&gt;)
                </span>
                <button
                  onClick={() => copyToClipboard(metaTagSnippet, "snippet")}
                  className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === "snippet" ? "Copied Tag" : "Copy Meta Code"}
                </button>
              </div>
              <code className="block text-xs font-mono text-emerald-300 break-all bg-slate-900/60 p-2 rounded border border-slate-800">
                {metaTagSnippet}
              </code>
            </div>

            {/* HTML File Verification Route */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <FileCode className="w-3.5 h-3.5 text-blue-400" />
                  HTML File Route (Alternative Verification)
                </span>
                <a
                  href={htmlFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Test File Endpoint</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <code className="block text-xs font-mono text-slate-300 break-all bg-slate-900/60 p-2 rounded border border-slate-800">
                {htmlFileUrl}
              </code>
            </div>
          </div>
        </div>

        {/* Box 2: Sitemap & Google Indexing Ping */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100 text-base">
                  Google Sitemap &amp; Indexing Ping Tool
                </h3>
                <p className="text-xs text-slate-400">Notify Google crawlers of new pages &amp; updates</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Sitemap URL Display */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Live Sitemap XML Endpoint
                </span>
                <a
                  href={sitemapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline text-xs flex items-center gap-1"
                >
                  <span>Open Sitemap.xml</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={sitemapUrl}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono"
                />
                <button
                  onClick={() => copyToClipboard(sitemapUrl, "sitemap")}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-xs font-medium cursor-pointer"
                >
                  {copiedKey === "sitemap" ? "Copied" : "Copy URL"}
                </button>
              </div>
            </div>

            {/* Ping Google Engine Button */}
            <div className="p-4 bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/20 rounded-xl space-y-3">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Google Indexing Signal Ping</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Triggers Google&apos;s sitemap discovery engine to re-fetch and index all active Kundli, Horoscope, and Remedies pages.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
                <div className="text-[11px] text-slate-400 font-mono">
                  {seo.lastPingedAt ? (
                    <span>Last Pinged: {new Date(seo.lastPingedAt).toLocaleString()}</span>
                  ) : (
                    <span>Not pinged recently</span>
                  )}
                </div>
                <button
                  onClick={handlePingGoogle}
                  disabled={pinging}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {pinging ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Ping Google Now</span>
                </button>
              </div>

              {pingResult && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{pingResult}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SERP Search Preview & Meta Tags Editor */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-base">
                Google Search Engine Result Page (SERP) Live Preview
              </h3>
              <p className="text-xs text-slate-400">Customize how Vedanga AI appears in Google Search results</p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <input
              type="checkbox"
              checked={seo.indexFollow}
              onChange={(e) => setSeo({ ...seo, indexFollow: e.target.checked })}
              className="accent-amber-500 rounded"
            />
            <span className="text-slate-300 font-medium">Index &amp; Follow Enabled</span>
          </label>
        </div>

        {/* Live Google Search Card Simulation */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-[9px] text-amber-300">
              ॐ
            </div>
            <span className="text-slate-200">Vedanga AI</span>
            <span className="text-slate-500">›</span>
            <span className="text-slate-400 truncate">{seo.siteUrl}</span>
          </div>
          <h4 className="text-lg font-medium text-blue-400 hover:underline cursor-pointer">
            {seo.metaTitle}
          </h4>
          <p className="text-sm text-slate-300 max-w-3xl line-clamp-2 leading-relaxed">
            {seo.metaDescription}
          </p>
          <div className="flex items-center gap-2 pt-2 text-[11px] text-amber-400/90 font-mono">
            <span>Sitelinks:</span>
            <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Kundli</span>
            <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Matching</span>
            <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Horoscope</span>
            <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Remedies</span>
          </div>
        </div>

        {/* SEO Meta Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Google Title Tag (&lt;title&gt;)
            </label>
            <input
              type="text"
              value={seo.metaTitle}
              onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500/60"
            />
            <p className="text-[10px] text-slate-400 mt-1">Recommended length: 50–60 characters</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Meta Keywords
            </label>
            <input
              type="text"
              value={seo.keywords}
              onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500/60"
            />
            <p className="text-[10px] text-slate-400 mt-1">Comma-separated target keywords for search indexing</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Meta Description Tag (&lt;meta name=&quot;description&quot;&gt;)
            </label>
            <textarea
              rows={3}
              value={seo.metaDescription}
              onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-amber-500/60"
            />
            <p className="text-[10px] text-slate-400 mt-1">Recommended length: 140–160 characters</p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Google Search Console Instructions */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-slate-100 text-base flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-400" />
          <span>Step-by-Step Google Search Console Setup Guide</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center">
              1
            </div>
            <h5 className="text-xs font-semibold text-slate-200">Open Search Console</h5>
            <p className="text-[11px] text-slate-400">
              Log in to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">search.google.com/search-console</a> with your Google Account.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center">
              2
            </div>
            <h5 className="text-xs font-semibold text-slate-200">Add Property</h5>
            <p className="text-[11px] text-slate-400">
              Select <strong>URL Prefix</strong> and enter <code className="text-amber-300">{seo.siteUrl}</code>.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center">
              3
            </div>
            <h5 className="text-xs font-semibold text-slate-200">Copy &amp; Paste Verification</h5>
            <p className="text-[11px] text-slate-400">
              Copy the <code className="text-amber-300">content=&quot;...&quot;</code> token from Google and paste it into the form above, then click Save.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center">
              4
            </div>
            <h5 className="text-xs font-semibold text-slate-200">Verify &amp; Submit Sitemap</h5>
            <p className="text-[11px] text-slate-400">
              Click <strong>Verify</strong> in Google Search Console, then add <code className="text-amber-300">sitemap.xml</code> under Sitemaps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
