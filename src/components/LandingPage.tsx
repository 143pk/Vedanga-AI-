import React from "react";
import { Sparkles, Compass, Moon, Sun, ArrowRight, ShieldCheck, HeartHandshake, Flame, Star } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
  onSelectFeature?: (tabName: string) => void;
}

const ZODIAC_SIGNS = [
  { name: "Aries", symbol: "♈", dates: "Mar 21 - Apr 19", element: "Fire" },
  { name: "Taurus", symbol: "♉", dates: "Apr 20 - May 20", element: "Earth" },
  { name: "Gemini", symbol: "♊", dates: "May 21 - Jun 20", element: "Air" },
  { name: "Cancer", symbol: "♋", dates: "Jun 21 - Jul 22", element: "Water" },
  { name: "Leo", symbol: "♌", dates: "Jul 23 - Aug 22", element: "Fire" },
  { name: "Virgo", symbol: "♍", dates: "Aug 23 - Sep 22", element: "Earth" },
  { name: "Libra", symbol: "♎", dates: "Sep 23 - Oct 22", element: "Air" },
  { name: "Scorpio", symbol: "♏", dates: "Oct 23 - Nov 21", element: "Water" },
  { name: "Sagittarius", symbol: "♐", dates: "Nov 22 - Dec 21", element: "Fire" },
  { name: "Capricorn", symbol: "♑", dates: "Dec 22 - Jan 19", element: "Earth" },
  { name: "Aquarius", symbol: "♒", dates: "Jan 20 - Feb 18", element: "Air" },
  { name: "Pisces", symbol: "♓", dates: "Feb 19 - Mar 20", element: "Water" },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/40 to-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Mystic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Navigation Header */}
      <header className="px-6 py-5 max-w-6xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-600 p-[2px] shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
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

        <button
          onClick={onStart}
          className="px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider text-amber-200 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all duration-300 shadow-md flex items-center space-x-2"
        >
          <span>Sign In / OTP</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
        </button>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-4xl mx-auto px-6 pt-6 pb-12 text-center z-10 flex-1 flex flex-col items-center justify-center">
        {/* Subtle Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium mb-6 backdrop-blur-sm animate-pulse">
          <Moon className="w-3.5 h-3.5 text-amber-400" />
          <span>Vedic Jyotish AI • 24/7 Spiritual Guidance</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-slate-100 tracking-tight leading-tight mb-6">
          Your Personal{" "}
          <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            AI Astrology Guru
          </span>{" "}
          & Natal Chart Oracle
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          Unlock cosmic secrets with instant Vedic AI consultations, deep Kundli birth chart analysis, and daily planetary horoscopes.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-12">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-bold text-sm tracking-wider shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>Consult Guru with OTP Email</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left mt-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-amber-500/20 backdrop-blur-md hover:border-amber-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-serif text-base font-bold text-amber-200 mb-1">
              AI Guru Consultation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask any question about career, love, Sade Sati, Dasha periods, or life decisions for compassionate Vedic guidance.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-amber-500/20 backdrop-blur-md hover:border-amber-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-3">
              <Compass className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-serif text-base font-bold text-amber-200 mb-1">
              Deep Kundli Birth Chart
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate 12-house Vedic natal chart, Lagna, Rashi, Nakshatras, Raj Yogas, Mahadasha timeline, and Manglik checks.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-amber-500/20 backdrop-blur-md hover:border-amber-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mb-3">
              <Sun className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="font-serif text-base font-bold text-amber-200 mb-1">
              Daily Rashi Horoscope
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get personalized daily astrological predictions for love, career, health, finances, and lucky factors.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center border-t border-slate-900 text-xs text-slate-500 z-10">
        <div className="flex items-center justify-center space-x-4 mb-1">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Privacy First • Vedic AI Calculation</span>
          </span>
        </div>
        <p>© {new Date().getFullYear()} Vedanga AI. Guided by Vedic Wisdom & Gemini GenAI.</p>
      </footer>
    </div>
  );
};
