import React, { useState } from "react";
import {
  Heart,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Printer,
  ChevronDown,
  ChevronUp,
  Send,
  MessageSquare,
  BookOpen,
  Calendar,
  Star,
  Users,
  Compass,
  Zap,
  Gift,
  HelpCircle,
  Clock,
  Flame,
  Award
} from "lucide-react";
import { UserProfile } from "../types";
import {
  PartnerDetails,
  KundliMatchingResult,
  calculateKundliMatching,
  RASHIS,
  NAKSHATRAS
} from "../utils/kundliMatchingCalculator";

interface KundliMatchingViewProps {
  user: UserProfile;
}

export const KundliMatchingView: React.FC<KundliMatchingViewProps> = ({ user }) => {
  // Input state for Boy
  const [boy, setBoy] = useState<PartnerDetails>({
    name: "Arjun Sharma",
    dob: "1994-08-18",
    tob: "07:30",
    pob: "New Delhi, India",
    rashi: "",
    nakshatra: "",
    isManglik: false
  });

  // Input state for Girl
  const [girl, setGirl] = useState<PartnerDetails>({
    name: "Priya Patel",
    dob: "1996-11-22",
    tob: "10:15",
    pob: "Mumbai, India",
    rashi: "",
    nakshatra: "",
    isManglik: false
  });

  const [activeTabSection, setActiveTabSection] = useState<
    "overview" | "guna" | "relationship" | "marriage" | "planets" | "doshas" | "love" | "timing" | "remedies" | "guru"
  >("overview");

  // Calculated Match Result state
  const [matchResult, setMatchResult] = useState<KundliMatchingResult>(() =>
    calculateKundliMatching(
      {
        name: "Arjun Sharma",
        dob: "1994-08-18",
        tob: "07:30",
        pob: "New Delhi, India",
        rashi: "",
        nakshatra: "",
        isManglik: false
      },
      {
        name: "Priya Patel",
        dob: "1996-11-22",
        tob: "10:15",
        pob: "Mumbai, India",
        rashi: "",
        nakshatra: "",
        isManglik: false
      }
    )
  );

  const [calculating, setCalculating] = useState(false);
  const [expandedKoota, setExpandedKoota] = useState<string | null>("Nadi Koota");

  // AI Chat with Guru state
  const [guruChatMessages, setGuruChatMessages] = useState<
    { role: "guru" | "user"; text: string; time: string }[]
  >([
    {
      role: "guru",
      text: `Hari Om dear seeker! I have analyzed the horoscopes of ${matchResult.boy.name} and ${matchResult.girl.name}. Your Guna Milan score is ${matchResult.totalGunas}/36 (${matchResult.percentage}%). Feel free to ask me any questions about your compatibility, Bhakoot/Nadi remedies, or marriage timing!`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Recalculate match
  const handleCalculateMatch = () => {
    setCalculating(true);
    setTimeout(() => {
      const res = calculateKundliMatching(boy, girl);
      setMatchResult(res);
      setCalculating(false);
      setGuruChatMessages([
        {
          role: "guru",
          text: `Hari Om dear seeker! I have analyzed the horoscopes of ${boy.name} and ${girl.name}. Your Guna Milan score is ${res.totalGunas}/36 (${res.percentage}%). ${res.manglikStatus.explanation} Ask me anything about this match!`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 400);
  };

  // Quick preset loader
  const handleLoadUserAsBoy = () => {
    let formattedTob = "08:30";
    if (user.tob && user.tob.includes(":")) {
      const parts = user.tob.split(":");
      const h = parseInt(parts[0], 10) || 8;
      const m = parseInt(parts[1], 10) || 30;
      formattedTob = `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}`;
    }
    setBoy({
      name: user.name || "Seeker Boy",
      dob: user.dob || "1995-05-15",
      tob: formattedTob,
      pob: user.pob || "New Delhi, India",
      rashi: "",
      nakshatra: "",
      isManglik: false
    });
  };

  const handleLoadUserAsGirl = () => {
    let formattedTob = "11:00";
    if (user.tob && user.tob.includes(":")) {
      const parts = user.tob.split(":");
      const h = parseInt(parts[0], 10) || 11;
      const m = parseInt(parts[1], 10) || 0;
      formattedTob = `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}`;
    }
    setGirl({
      name: user.name || "Seeker Girl",
      dob: user.dob || "1996-07-20",
      tob: formattedTob,
      pob: user.pob || "Mumbai, India",
      rashi: "",
      nakshatra: "",
      isManglik: false
    });
  };

  // AI Chat send message
  const handleSendGuruMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || chatInput).trim();
    if (!textToSend || chatLoading) return;

    const userMsg = {
      role: "user" as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setGuruChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const prompt = `Act as Vedanga AI Guruji explaining Kundli Match compatibility between Boy (${matchResult.boy.name}, ${matchResult.boy.rashi} Moon, ${matchResult.boy.nakshatra}) and Girl (${matchResult.girl.name}, ${matchResult.girl.rashi} Moon, ${matchResult.girl.nakshatra}).
Guna Score: ${matchResult.totalGunas}/36 (${matchResult.percentage}%).
Manglik Status: ${matchResult.manglikStatus.compatibility}.
User Question: "${textToSend}"
Provide a warm, spiritual, reassuring response based on classical Vedic astrology principles. Keep it concise (150-250 words) with bullet points if helpful.`;

      const res = await fetch("/api/astrology/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          userProfile: user,
          history: []
        })
      });

      const data = await res.json();
      const replyText = data.reply || "Hari Om! The stars favour mutual trust and sincere devotion. Pray to Lord Shiva and Goddess Parvati for divine guidance.";

      setGuruChatMessages((prev) => [
        ...prev,
        {
          role: "guru",
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } catch {
      setGuruChatMessages((prev) => [
        ...prev,
        {
          role: "guru",
          text: "Hari Om! Planetary alignment encourages patience and mutual respect. Perform daily prayers to strengthen your bond.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle Printable Report
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 font-sans text-slate-100 pb-28">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-3xl p-4 sm:p-6 mb-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-700 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <Heart className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-amber-200 flex items-center gap-2">
                Ashtakoot Kundli Matching
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Gun Milan 36
                </span>
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Authentic Vedic Marriage Compatibility, Dosha Analysis, Planetary Axis & AI Guru Guidance
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handlePrintReport}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Couple Form Input Card */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-4 sm:p-6 mb-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            Enter Boy & Girl Birth Details
          </h2>
          <div className="flex gap-2 text-[11px]">
            <button
              onClick={handleLoadUserAsBoy}
              className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              Load Me as Boy
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={handleLoadUserAsGirl}
              className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              Load Me as Girl
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Boy Column */}
          <div className="bg-slate-950/70 border border-blue-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                Groom / Boy Details
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={boy.name}
                  onChange={(e) => setBoy({ ...boy, name: e.target.value })}
                  placeholder="e.g. Arjun Sharma"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={boy.dob}
                    onChange={(e) => setBoy({ ...boy, dob: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-slate-100 outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Time of Birth</label>
                  <input
                    type="time"
                    value={boy.tob}
                    onChange={(e) => setBoy({ ...boy, tob: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-slate-100 outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Place of Birth</label>
                <input
                  type="text"
                  value={boy.pob}
                  onChange={(e) => setBoy({ ...boy, pob: e.target.value })}
                  placeholder="e.g. New Delhi, India"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Girl Column */}
          <div className="bg-slate-950/70 border border-rose-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                Bride / Girl Details
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={girl.name}
                  onChange={(e) => setGirl({ ...girl, name: e.target.value })}
                  placeholder="e.g. Priya Patel"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={girl.dob}
                    onChange={(e) => setGirl({ ...girl, dob: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-slate-100 outline-none focus:border-rose-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Time of Birth</label>
                  <input
                    type="time"
                    value={girl.tob}
                    onChange={(e) => setGirl({ ...girl, tob: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-slate-100 outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Place of Birth</label>
                <input
                  type="text"
                  value={girl.pob}
                  onChange={(e) => setGirl({ ...girl, pob: e.target.value })}
                  placeholder="e.g. Mumbai, India"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-rose-400"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-center">
          <button
            onClick={handleCalculateMatch}
            disabled={calculating}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-bold text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center space-x-2"
          >
            {calculating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Calculating Ashtakoot Gunas...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Calculate Match Compatibility</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* OVERALL MATCH SCORE HERO SECTION */}
      <div className="bg-slate-900/90 border border-amber-500/40 rounded-3xl p-5 sm:p-6 mb-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Circular Score Display */}
          <div className="flex flex-col items-center justify-center text-center p-4 bg-slate-950/60 rounded-2xl border border-amber-500/20">
            <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold mb-1">
              Guna Milan Score
            </span>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-400"
                  strokeWidth="3.5"
                  strokeDasharray={`${matchResult.percentage}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold font-serif text-amber-200">
                  {matchResult.totalGunas}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">out of 36</span>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-300 mt-2">
              {matchResult.percentage}% Compatibility
            </span>
          </div>

          {/* Verdict & Recommendation Badge */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${matchResult.recommendationBadgeColor}`}
              >
                {matchResult.recommendation}
              </span>
              <span className="text-xs text-slate-400">
                • {matchResult.boy.name} & {matchResult.girl.name}
              </span>
            </div>

            <h3 className="font-serif text-lg font-bold text-slate-100">
              {matchResult.percentage >= 75
                ? "Excellent Marriage Alignment & Strong Karmic Harmony"
                : matchResult.percentage >= 60
                ? "Favorable Compatibility with Minor Traditional Remedies"
                : "Averages Compatibility; Traditional Remedies Advised"}
            </h3>

            {/* Manglik status indicator */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block mb-0.5">
                  Manglik Status: {matchResult.manglikStatus.compatibility}
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {matchResult.manglikStatus.explanation}
                </p>
              </div>
            </div>

            {/* Strengths bullet summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {matchResult.strengthsSummary.slice(0, 2).map((s, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 text-emerald-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SUB-SECTION TAB SELECTOR NAVIGATION */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {[
          { id: "overview", label: "Overview", icon: Compass },
          { id: "guna", label: "📊 Guna Milan (36)", icon: Award },
          { id: "relationship", label: "💑 Relationship", icon: Heart },
          { id: "marriage", label: "💍 Marriage Analysis", icon: Star },
          { id: "planets", label: "🪐 Planet Pairs", icon: Sparkles },
          { id: "doshas", label: "⚠️ Dosha Analysis", icon: AlertTriangle },
          { id: "love", label: "💖 Love & Life", icon: Flame },
          { id: "timing", label: "📅 Marriage Timing", icon: Calendar },
          { id: "remedies", label: "🕉 Remedies", icon: Gift },
          { id: "guru", label: "🤖 Guru Match Chat", icon: MessageSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTabSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabSection(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                isActive
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]"
                  : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-200 hover:bg-slate-800"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 1. OVERVIEW SECTION */}
      {/* ============================================================== */}
      {activeTabSection === "overview" && (
        <div className="space-y-6">
          {/* Key Strengths & Challenges Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Key Match Strengths
              </h3>
              <ul className="space-y-2 text-xs text-slate-200">
                {matchResult.strengthsSummary.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Areas for Mindfulness & Growth
              </h3>
              <ul className="space-y-2 text-xs text-slate-200">
                {matchResult.challengesSummary.map((ch, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{ch}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Relationship Meters Preview */}
          <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-amber-400" />
              Core Relationship Alignment Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matchResult.relationshipScores.slice(0, 4).map((item, idx) => (
                <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs mb-1 font-semibold text-slate-200">
                    <span>{item.title}</span>
                    <span className="text-amber-400 font-mono">{item.score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. GUNA MILAN BREAKDOWN SECTION */}
      {/* ============================================================== */}
      {activeTabSection === "guna" && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-base font-bold text-amber-200">
                Detailed Ashtakoot Guna Milan (36 Points)
              </h3>
              <span className="text-xs font-bold text-amber-400 font-mono">
                {matchResult.totalGunas} / 36 Gunas
              </span>
            </div>
            <p className="text-xs text-slate-300">
              The 8 classical Ashtakoot factors analyze spiritual ego, mutual control, destiny luck, intimacy, mental friendship, temperament, emotional wealth, and genetic lineage.
            </p>
          </div>

          {/* Kootas List Cards */}
          <div className="space-y-3">
            {matchResult.kootas.map((koota) => {
              const isExpanded = expandedKoota === koota.name;
              const isFullScore = koota.obtainedScore === koota.maxScore;

              return (
                <div
                  key={koota.name}
                  className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 transition-all"
                >
                  <div
                    onClick={() => setExpandedKoota(isExpanded ? null : koota.name)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                          isFullScore
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : koota.obtainedScore > 0
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        }`}
                      >
                        {koota.obtainedScore}/{koota.maxScore}
                      </div>

                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
                          {koota.name}
                          {isFullScore && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-sans">
                              Full Score
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-slate-400">{koota.meaning}</p>
                      </div>
                    </div>

                    <button className="p-1 text-slate-400 hover:text-amber-300">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Accordion detail */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs space-y-2 text-slate-300 animate-fade-in">
                      <div>
                        <span className="font-bold text-amber-300 block mb-0.5">Practical Impact:</span>
                        <p className="text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                          {koota.impact}
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-amber-300 block mb-0.5">
                          Traditional Scriptural Interpretation:
                        </span>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          {koota.traditionalInterpretation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. RELATIONSHIP ANALYSIS SECTION */}
      {/* ============================================================== */}
      {activeTabSection === "relationship" && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4">
            <h3 className="font-serif text-base font-bold text-amber-200 mb-1">
              💑 10-Dimension Relationship Compatibility
            </h3>
            <p className="text-xs text-slate-300">
              In-depth breakdown of emotional warmth, communication ease, trust, romantic chemistry, family integration, and spiritual alignment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchResult.relationshipScores.map((rel, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className="text-xs font-bold text-slate-100">{rel.title}</h4>
                    <span className="text-xs font-bold font-mono text-amber-400">{rel.score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 h-full rounded-full transition-all"
                      style={{ width: `${rel.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{rel.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. MARRIAGE ANALYSIS SECTION */}
      {/* ============================================================== */}
      {activeTabSection === "marriage" && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4">
            <h3 className="font-serif text-base font-bold text-amber-200 mb-1">
              💍 Marriage Success & Life Forecast
            </h3>
            <p className="text-xs text-slate-300">
              Evaluates long-term stability, probability of marital friction, commitment levels, in-laws alignment, offspring prospects, and financial growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchResult.marriageAnalysis.map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200">{m.title}</h4>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {m.status} ({m.score}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full"
                    style={{ width: `${m.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. PLANET PAIR COMPATIBILITY SECTION */}
      {/* ============================================================== */}
      {activeTabSection === "planets" && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4">
            <h3 className="font-serif text-base font-bold text-amber-200 mb-1">
              🪐 Planetary Pair Inter-Compatibility
            </h3>
            <p className="text-xs text-slate-300">
              Comparing Sun (Ego), Moon (Mind), Venus (Romance), Mars (Conflict), Jupiter (Wisdom), Saturn (Patience), and Rahu/Ketu (Karmic Bond) between both horoscopes.
            </p>
          </div>

          <div className="space-y-3">
            {matchResult.planetCompatibility.map((pair, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2 hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs sm:text-sm font-bold text-slate-100">{pair.pair}</h4>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    {pair.status} ({pair.score}%)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-blue-300 font-semibold">{matchResult.boy.name}:</span>{" "}
                    {pair.boyPlanetDetails}
                  </div>
                  <div>
                    <span className="text-rose-300 font-semibold">{matchResult.girl.name}:</span>{" "}
                    {pair.girlPlanetDetails}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{pair.effectOnRelationship}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. DOSHA ANALYSIS SECTION */}
      {/* ============================================================== */}
      {activeTabSection === "doshas" && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4">
            <h3 className="font-serif text-base font-bold text-amber-200 mb-1">
              ⚠️ Comprehensive Dosha & Yoga Audit
            </h3>
            <p className="text-xs text-slate-300">
              Evaluates Manglik, Nadi, Bhakoot, Shrapit, Pitra, Kaal Sarp, and Guru Chandal influences along with traditional cancellations and prescribed remedies.
            </p>
          </div>

          <div className="space-y-3">
            {matchResult.doshaAnalysis.map((dosha) => (
              <div
                key={dosha.id}
                className={`p-4 rounded-2xl border transition-all ${
                  dosha.isPresent
                    ? dosha.severity === "High"
                      ? "bg-rose-950/30 border-rose-500/40"
                      : "bg-amber-950/30 border-amber-500/40"
                    : "bg-slate-900/80 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {dosha.isPresent ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    )}
                    <h4 className="text-xs sm:text-sm font-bold text-slate-100">{dosha.title}</h4>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      dosha.isPresent
                        ? "text-rose-300 bg-rose-500/20 border-rose-500/40"
                        : "text-emerald-300 bg-emerald-500/20 border-emerald-500/40"
                    }`}
                  >
                    {dosha.isPresent ? `Present (${dosha.severity})` : "Absent (Safe)"}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-2 leading-relaxed">{dosha.description}</p>

                {dosha.cancellationRule && (
                  <div className="text-[11px] text-amber-300/90 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 mb-2">
                    <span className="font-bold block mb-0.5">Cancellation Rule:</span>
                    {dosha.cancellationRule}
                  </div>
                )}

                {dosha.isPresent && (
                  <div className="text-[11px] text-emerald-300 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/30">
                    <span className="font-bold block mb-0.5">Prescribed Traditional Remedy:</span>
                    {dosha.remedy}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. LOVE & MARRIED LIFE SECTION */}
      {/* ============================================================== */}
      {activeTabSection === "love" && (
        <div className="space-y-6">
          {/* Love Compatibility */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-bold text-amber-200">
              💖 Love, Attraction & Intimacy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matchResult.loveCompatibility.map((item, idx) => (
                <div key={idx} className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-200">
                    <span>{item.dimension}</span>
                    <span className="text-amber-400 font-mono">{item.score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{item.insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Married Life */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-bold text-amber-200">
              🏡 Daily Married Life & Domestic Harmony
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matchResult.marriedLife.map((item, idx) => (
                <div key={idx} className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-200">
                    <span>{item.aspect}</span>
                    <span className="text-amber-400 font-mono">{item.score}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. MARRIAGE TIMING SECTION */}
      {/* ============================================================== */}
      {activeTabSection === "timing" && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4">
            <h3 className="font-serif text-base font-bold text-amber-200 mb-1">
              📅 Favorable Marriage Periods & Muhurta
            </h3>
            <p className="text-xs text-slate-300">
              Analysis of Jupiter and Saturn house transits, active Mahadasha periods, and traditional wedding months.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
            <div>
              <span className="text-amber-300 font-bold uppercase tracking-wider text-[11px] block mb-1">
                Ideal Marriage Window:
              </span>
              <p className="text-slate-100 font-serif text-base font-bold">
                {matchResult.marriageTiming.bestPeriod}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div>
                <span className="text-amber-300 font-bold block mb-1">Favorable Planetary Transits:</span>
                <p className="text-slate-300 leading-relaxed">
                  {matchResult.marriageTiming.favorableTransits}
                </p>
              </div>

              <div>
                <span className="text-amber-300 font-bold block mb-1">Dasha Alignment:</span>
                <p className="text-slate-300 leading-relaxed">
                  {matchResult.marriageTiming.dashaAlignment}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-amber-300 font-bold block mb-1">Auspicious Wedding Months (Vedic Calendar):</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {matchResult.marriageTiming.auspiciousMuhurtaMonths.map((m, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-medium text-xs"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 9. REMEDIES SECTION */}
      {/* ============================================================== */}
      {activeTabSection === "remedies" && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4">
            <h3 className="font-serif text-base font-bold text-amber-200 mb-1">
              🕉 Prescribed Traditional Remedies (Graha Shanti)
            </h3>
            <p className="text-xs text-slate-300">
              Each remedy contains scriptural rationale, step-by-step procedures, timing, duration, and expected spiritual benefit.
            </p>
          </div>

          <div className="space-y-4">
            {matchResult.remedies.map((rem, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 p-5 rounded-2xl space-y-3 transition-all"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {rem.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100">{rem.title}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-bold text-amber-300 block mb-0.5">Why this Remedy?</span>
                    <p className="text-slate-300 text-[11px]">{rem.why}</p>
                  </div>

                  <div>
                    <span className="font-bold text-emerald-300 block mb-0.5">Expected Spiritual Benefits:</span>
                    <p className="text-slate-300 text-[11px]">{rem.benefits}</p>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 space-y-1">
                  <div>
                    <span className="font-bold text-amber-400">Step-by-step Procedure:</span> {rem.procedure}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 pt-1">
                    <span>
                      <strong className="text-slate-300">Best Time:</strong> {rem.bestTime}
                    </span>
                    <span>
                      <strong className="text-slate-300">Duration:</strong> {rem.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 10. AI GURU MATCH ANALYSIS & CHAT */}
      {/* ============================================================== */}
      {activeTabSection === "guru" && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4">
            <h3 className="font-serif text-base font-bold text-amber-200 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Vedanga AI Guru Match Analysis & Chat
            </h3>
            <p className="text-xs text-slate-300">
              Guruji interprets the chart synthesis in conversational prose. Ask any question about your match, remedies, or future marital peace!
            </p>
          </div>

          {/* Messages Scroll Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3.5 max-h-96 overflow-y-auto scrollbar-thin">
            {guruChatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-2.5 ${
                  msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "guru"
                      ? "bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 font-bold"
                      : "bg-purple-600/30 text-purple-200 border border-purple-500/30"
                  }`}
                >
                  {msg.role === "guru" ? <Sparkles className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-md ${
                    msg.role === "user"
                      ? "bg-purple-900/50 border border-purple-500/30 text-purple-100 rounded-tr-none"
                      : "bg-slate-900 border border-amber-500/30 text-slate-200 rounded-tl-none font-serif"
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <div className="text-[9px] text-amber-400/60 mt-1.5 text-right">{msg.time}</div>
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-center space-x-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Guruji is meditating on your compatibility charts...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              "Will we have a happy and lasting marriage?",
              "Why is our Bhakoot / Nadi score affected?",
              "What remedies can we do together for peace?",
              "Should we proceed despite Manglik alignment?",
              "When is the best month for our wedding?"
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendGuruMessage(prompt)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-200 text-xs whitespace-nowrap transition-all cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendGuruMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask Guruji any question about this Kundli match..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={chatLoading}
              className="flex-1 bg-slate-900 border border-amber-500/30 focus:border-amber-400 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 outline-none"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold hover:scale-105 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center"
            >
              <Send className="w-4 h-4 text-slate-950" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
