import React, { useState } from "react";
import {
  Sparkles,
  Compass,
  Moon,
  Sun,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  BookOpen,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Zap,
  Star,
  Award,
  Layers,
  Search,
} from "lucide-react";
import { ActiveTab } from "../types";

interface LandingPageProps {
  onStart: (tab?: ActiveTab, initialPrompt?: string) => void;
}

const ZODIAC_SIGNS = [
  { name: "Aries", vedicName: "Mesh", symbol: "♈", dates: "Mar 21 - Apr 19", element: "Fire", ruler: "Mars" },
  { name: "Taurus", vedicName: "Vrishabha", symbol: "♉", dates: "Apr 20 - May 20", element: "Earth", ruler: "Venus" },
  { name: "Gemini", vedicName: "Mithuna", symbol: "♊", dates: "May 21 - Jun 20", element: "Air", ruler: "Mercury" },
  { name: "Cancer", vedicName: "Karka", symbol: "♋", dates: "Jun 21 - Jul 22", element: "Water", ruler: "Moon" },
  { name: "Leo", vedicName: "Simha", symbol: "♌", dates: "Jul 23 - Aug 22", element: "Fire", ruler: "Sun" },
  { name: "Virgo", vedicName: "Kanya", symbol: "♍", dates: "Aug 23 - Sep 22", element: "Earth", ruler: "Mercury" },
  { name: "Libra", vedicName: "Tula", symbol: "♎", dates: "Sep 23 - Oct 22", element: "Air", ruler: "Venus" },
  { name: "Scorpio", vedicName: "Vrischika", symbol: "♏", dates: "Oct 23 - Nov 21", element: "Water", ruler: "Mars/Ketu" },
  { name: "Sagittarius", vedicName: "Dhanu", symbol: "♐", dates: "Nov 22 - Dec 21", element: "Fire", ruler: "Jupiter" },
  { name: "Capricorn", vedicName: "Makara", symbol: "♑", dates: "Dec 22 - Jan 19", element: "Earth", ruler: "Saturn" },
  { name: "Aquarius", vedicName: "Kumbha", symbol: "♒", dates: "Jan 20 - Feb 18", element: "Air", ruler: "Saturn/Rahu" },
  { name: "Pisces", vedicName: "Meena", symbol: "♓", dates: "Feb 19 - Mar 20", element: "Water", ruler: "Jupiter" },
];

const STARTER_PROMPTS = [
  {
    icon: "📈",
    title: "Career & Finances",
    prompt: "What do my planetary transits predict for my career and financial growth this month?",
  },
  {
    icon: "🪐",
    title: "Sade Sati & Dasha",
    prompt: "Am I going through Sade Sati or a major Vimshottari Mahadasha right now? What are the effects?",
  },
  {
    icon: "❤️",
    title: "Love & Marriage",
    prompt: "How are my love and relationship transits looking, and what does my 7th house indicate?",
  },
  {
    icon: "💎",
    title: "Lagna Gemstones",
    prompt: "Which planetary gemstone and daily Vedic mantra suit my Lagna and Rashi best?",
  },
];

const FAQS = [
  {
    q: "How does Vedanga AI calculate my Sidereal Kundli chart?",
    a: "Vedanga AI utilizes precise astronomical ephemeris algorithms with standard Lahiri Ayanamsha (Chitra Paksha). It calculates your exact Lagna (Ascendant), Moon Rashi, 27 Nakshatras, Navamsha (D9) chart, Raj Yogas, and Vimshottari Mahadasha timeline based on your exact date, time, and birthplace.",
  },
  {
    q: "Can I ask the AI Guru specific personal questions?",
    a: "Yes! You can ask Vedanga AI Guru about career transitions, relationship compatibility, Sade Sati phases, house buying timing, or business decisions. The AI synthesizes traditional Parashari & Jaimini principles to provide tailored, empathetic advice.",
  },
  {
    q: "Is my personal birth data kept private?",
    a: "Absolutely. Your birth details and chat conversations are stored locally in your browser and synced securely to your private profile without being shared with third parties.",
  },
  {
    q: "How is Kundli Matching (Gun Milan) calculated?",
    a: "Our Kundli Matching system evaluates the traditional Ashtakoota 36-Guna parameters (Varna, Vashya, Tara, Yoni, Maitri, Gana, Bhakoot, and Nadi) along with Manglik Dosha analysis for comprehensive marital harmony checks.",
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-x-hidden font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-500/15 via-purple-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-[-100px] w-96 h-96 bg-amber-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-[-100px] w-96 h-96 bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-amber-500/10 px-4 sm:px-8 py-4 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onStart("chat")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-600 p-[1.5px] shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-wide bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Vedanga AI
            </span>
            <span className="block text-[10px] tracking-widest text-amber-400/80 uppercase font-semibold">
              Vedic AI Oracle
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-300">
          <button
            onClick={() => onStart("chat")}
            className="hover:text-amber-300 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Guru</span>
          </button>
          <button
            onClick={() => onStart("kundli")}
            className="hover:text-amber-300 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Free Kundli</span>
          </button>
          <button
            onClick={() => onStart("horoscope")}
            className="hover:text-amber-300 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Horoscope</span>
          </button>
          <button
            onClick={() => onStart("matching")}
            className="hover:text-amber-300 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
            <span>Matching</span>
          </button>
          <button
            onClick={() => onStart("learning")}
            className="hover:text-amber-300 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Vedic Hub</span>
          </button>
        </nav>

        {/* Action Button */}
        <button
          onClick={() => onStart("chat")}
          className="px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all duration-300 shadow-md shadow-amber-500/20 flex items-center space-x-2 cursor-pointer active:scale-95"
        >
          <span>Launch App</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-16 text-center flex flex-col items-center">
        {/* Mystic Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6 backdrop-blur-md shadow-inner">
          <Moon className="w-3.5 h-3.5 text-amber-400" />
          <span>Authentic Jyotish Ephemeris • Powered by GenAI</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-slate-100 tracking-tight leading-[1.15] mb-6">
          Ancient Vedic Wisdom, <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            Instant AI Guidance
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-sans">
          Explore your 12-house Sidereal Kundli birth chart, Vimshottari Mahadasha timeline, daily Rashi horoscopes, and 24/7 AI Guru consultations.
        </p>

        {/* Action Callouts */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto mb-14">
          <button
            onClick={() => onStart("chat")}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>Consult AI Guru Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onStart("kundli")}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/30 text-amber-200 font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Generate Free Kundli</span>
          </button>

          <button
            onClick={() => onStart("horoscope")}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/30 text-slate-200 font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            <Sun className="w-4 h-4 text-yellow-400" />
            <span>Daily Horoscope</span>
          </button>
        </div>

        {/* Quick Starter Prompts */}
        <div className="w-full max-w-4xl bg-slate-900/70 border border-amber-500/20 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400/90 flex items-center space-x-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Tap a question to ask AI Guru instantly</span>
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">24/7 Live Response</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {STARTER_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onStart("chat", item.prompt)}
                className="p-4 rounded-2xl bg-slate-950/80 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 transition-all duration-200 flex items-start space-x-3 cursor-pointer group"
              >
                <span className="text-xl leading-none mt-0.5">{item.icon}</span>
                <div className="flex-1">
                  <div className="text-xs font-bold text-amber-200 group-hover:text-amber-300 mb-1 flex items-center justify-between">
                    <span>{item.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400/60 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-slate-400 group-hover:text-slate-300 line-clamp-2 leading-relaxed">
                    "{item.prompt}"
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100 mb-3">
            Comprehensive Vedic Astrology Platform
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need to analyze your cosmic blueprint, align with daily planetary transits, and seek spiritual clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Guru */}
          <div
            onClick={() => onStart("chat")}
            className="p-6 rounded-3xl bg-slate-900/60 border border-amber-500/20 hover:border-amber-500/50 backdrop-blur-md transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-serif text-xl font-bold text-amber-200 mb-2">
                24/7 AI Guru Consultations
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Receive compassionate, personalized astrological guidance on Sade Sati, career decisions, love life, Raj Yogas, and Vimshottari Mahadashas.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400">
              <span>Start Consulting</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Kundli */}
          <div
            onClick={() => onStart("kundli")}
            className="p-6 rounded-3xl bg-slate-900/60 border border-amber-500/20 hover:border-amber-500/50 backdrop-blur-md transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-serif text-xl font-bold text-amber-200 mb-2">
                12-House Sidereal Kundli
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Generate complete natal birth charts with Lagna, Moon sign, Nakshatras, Navamsha (D9) divisionals, Manglik Dosha checks, and Dasha calculations.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-purple-400">
              <span>View Your Chart</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Horoscope */}
          <div
            onClick={() => onStart("horoscope")}
            className="p-6 rounded-3xl bg-slate-900/60 border border-amber-500/20 hover:border-amber-500/50 backdrop-blur-md transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sun className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="font-serif text-xl font-bold text-amber-200 mb-2">
                Daily Rashi Horoscope
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Stay updated with personalized daily predictions across Love, Career, Health, Finances, lucky numbers, direction, and daily Vedic mantras.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-yellow-400">
              <span>Check Horoscope</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Kundli Matching */}
          <div
            onClick={() => onStart("matching")}
            className="p-6 rounded-3xl bg-slate-900/60 border border-amber-500/20 hover:border-amber-500/50 backdrop-blur-md transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="font-serif text-xl font-bold text-amber-200 mb-2">
                Ashtakoota Gun Milan
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Compare marriage partner charts with traditional 36-Guna scoring, Bhakoot dosha, Nadi analysis, and Manglik compatibility reports.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-rose-400">
              <span>Match Kundlis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Vedic Articles */}
          <div
            onClick={() => onStart("learning")}
            className="p-6 rounded-3xl bg-slate-900/60 border border-amber-500/20 hover:border-amber-500/50 backdrop-blur-md transition-all duration-300 cursor-pointer group flex flex-col justify-between md:col-span-2"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="font-serif text-xl font-bold text-amber-200 mb-2">
                Vedic Wisdom & Planetary Knowledge Hub
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Read deep astrological articles covering Sade Sati remedies, Rahu-Ketu transit timelines, Ashtakavarga points, Raj Yogas, and practical spiritual rituals.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400">
              <span>Explore Knowledge Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 12 Rashis Zodiac Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2 block">
            Moon Signs & Solar Zodiacs
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100 mb-3">
            Select Your Rashi Sign
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Click on any Vedic Rashi sign to view tailored astrological guidance & daily horoscopes.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {ZODIAC_SIGNS.map((sign, idx) => (
            <button
              key={idx}
              onClick={() => onStart("horoscope")}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 hover:bg-amber-500/10 transition-all duration-200 text-center cursor-pointer group flex flex-col items-center"
            >
              <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">{sign.symbol}</span>
              <h4 className="font-serif font-bold text-xs text-amber-200 group-hover:text-amber-300">
                {sign.name}
              </h4>
              <span className="text-[10px] text-amber-400/80 font-medium">({sign.vedicName})</span>
              <span className="text-[9px] text-slate-500 mt-1">{sign.dates}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Why Trust Vedanga AI */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-gradient-to-b from-slate-900/90 to-purple-950/40 border border-amber-500/20 rounded-3xl p-8 sm:p-10 backdrop-blur-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-200 mb-2">
              Why Choose Vedanga AI?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              Combining centuries-old Vedic scriptures with modern high-precision astronomy calculations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-sm font-bold text-slate-100 mb-1">
                  Lahiri Sidereal Precision
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real planetary degrees calculated using Lahiri Ayanamsha instead of tropical approximations.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-sm font-bold text-slate-100 mb-1">
                  Tailored Vedic Remedies
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Practical remedies including mantra chanting, gemstone suggestions, and donation recommendations.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-sm font-bold text-slate-100 mb-1">
                  100% Private & Instant
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No queue, zero judgment, and complete privacy for all your personal questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400">Everything you need to know about Vedanga AI</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left font-serif text-sm font-semibold text-amber-200 flex items-center justify-between cursor-pointer hover:bg-slate-800/40"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-amber-400 transition-transform duration-200 shrink-0 ml-2 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-slate-300 border-t border-slate-800/60 leading-relaxed bg-slate-950/40">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-600/20 border border-amber-500/30 backdrop-blur-xl flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100 mb-4">
            Ready to Unfold Your Cosmic Blueprint?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-8">
            Get instant astrological clarity from Vedanga AI Guru and generate your complete birth Kundli today.
          </p>

          <button
            onClick={() => onStart("chat")}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center space-x-3 cursor-pointer"
          >
            <span>Consult Vedanga AI Guru Free</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 text-center border-t border-slate-900 text-xs text-slate-500">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-3 text-xs text-slate-400">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Privacy First • Vedic AI Ephemeris</span>
          </span>
          <span>•</span>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-amber-400 transition-colors"
          >
            Sitemap.xml
          </a>
          <span>•</span>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-amber-400 transition-colors"
          >
            Robots.txt
          </a>
        </div>
        <p>© {new Date().getFullYear()} Vedanga AI. Guided by Vedic Jyotish & Gemini AI.</p>
      </footer>
    </div>
  );
};
