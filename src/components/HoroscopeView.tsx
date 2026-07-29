import React, { useState, useEffect } from "react";
import { Sun, Heart, Briefcase, Activity, Coins, Sparkles, RefreshCw, Star, Compass, Flame } from "lucide-react";
import { HoroscopeData, UserProfile } from "../types";

interface HoroscopeViewProps {
  user: UserProfile;
}

export const HoroscopeView: React.FC<HoroscopeViewProps> = ({ user }) => {
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"overall" | "love" | "career" | "health" | "finance">("overall");

  const fetchHoroscope = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/astrology/daily-horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rashi: user.rashi,
          name: user.name,
          dob: user.dob,
        }),
      });

      const data = await res.json();
      if (res.ok && data.horoscope) {
        setHoroscope(data.horoscope);
      }
    } catch (err) {
      console.error("Failed to fetch horoscope", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoroscope();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 font-sans pb-24 text-slate-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-3xl p-5 mb-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Sun className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-200">
                Daily Horoscope for {user.rashi}
              </h2>
              <p className="text-xs text-slate-400">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          <button
            onClick={fetchHoroscope}
            disabled={loading}
            className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Horoscope"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-amber-500/20">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
          <h3 className="text-sm font-bold text-amber-200">Reading Planetary Alignments...</h3>
          <p className="text-xs text-slate-400 mt-1">Calculating Sun & Moon transits for {user.rashi}</p>
        </div>
      )}

      {!loading && horoscope && (
        <div className="space-y-6">
          {/* Energy Rating Meter */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                Today's Cosmic Energy Rating
              </span>
              <span className="text-lg font-bold text-amber-300 font-mono">
                {horoscope.scores?.overall || 88}%
              </span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-700"
                style={{ width: `${horoscope.scores?.overall || 88}%` }}
              />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mt-3 font-serif">
              "{horoscope.overallSummary}"
            </p>
          </div>

          {/* Category Tabs */}
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { id: "overall", label: "Overview", icon: Sparkles },
              { id: "love", label: "Love", icon: Heart },
              { id: "career", label: "Career", icon: Briefcase },
              { id: "health", label: "Health", icon: Activity },
              { id: "finance", label: "Finance", icon: Coins },
            ].map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`p-2.5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    active
                      ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold shadow-md"
                      : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="text-[10px] truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Category Content Box */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-md">
            <h3 className="font-serif text-base font-bold text-amber-200 capitalize mb-2 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{activeCategory} Daily Guidance</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
              {activeCategory === "overall" && horoscope.overallSummary}
              {activeCategory === "love" && horoscope.sections?.love}
              {activeCategory === "career" && horoscope.sections?.career}
              {activeCategory === "health" && horoscope.sections?.health}
              {activeCategory === "finance" && horoscope.sections?.finance}
            </p>
          </div>

          {/* Lucky Factors Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lucky Number</span>
              <span className="text-base font-bold text-amber-300 font-mono mt-0.5 block">
                {horoscope.luckyFactors?.number}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lucky Color</span>
              <span className="text-xs font-bold text-amber-300 mt-0.5 block truncate">
                {horoscope.luckyFactors?.color}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Auspicious Hours</span>
              <span className="text-[11px] font-bold text-amber-300 mt-0.5 block truncate">
                {horoscope.luckyFactors?.time}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Favorable Direction</span>
              <span className="text-xs font-bold text-amber-300 mt-0.5 block truncate">
                {horoscope.luckyFactors?.direction}
              </span>
            </div>
          </div>

          {/* Daily Mantra & Guru Tip */}
          <div className="p-5 rounded-3xl bg-gradient-to-tr from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/30">
            <div className="mb-3">
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-widest block">
                Daily Vedic Mantra
              </span>
              <span className="text-base font-serif font-bold text-amber-200 mt-0.5 block">
                "{horoscope.dailyMantra}"
              </span>
            </div>
            <div className="pt-3 border-t border-amber-500/20 text-xs text-slate-300">
              <strong className="text-amber-300 font-serif">Guru's Advice: </strong>
              <span>{horoscope.guruTip}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
