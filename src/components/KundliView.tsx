import React, { useState, useEffect } from "react";
import { Compass, Sparkles, RefreshCw, Star, ShieldCheck, Award, Layers, Calendar, Edit3, Clock, BarChart3, Activity, Flame, ShieldAlert, Zap, Cpu, Eye, Scale, CheckCircle2, HelpCircle, ListOrdered, Sun, Target, BookOpen } from "lucide-react";
import { KundliData, UserProfile } from "../types";
import { calculateVedicKundli } from "../lib/vedicCalculator";

interface KundliViewProps {
  user: UserProfile;
}

const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const RASHI_SANSKRIT = [
  "Mesha", "Vrishabha", "Mithuna", "Karka",
  "Simha", "Kanya", "Tula", "Vrishchika",
  "Dhanu", "Makara", "Kumbha", "Meena"
];

function getLagnaIndex(lagnaStr: string): number {
  if (!lagnaStr) return 0;
  const clean = lagnaStr.toLowerCase();
  for (let i = 0; i < RASHI_NAMES.length; i++) {
    if (clean.includes(RASHI_NAMES[i].toLowerCase()) || clean.includes(RASHI_SANSKRIT[i].toLowerCase())) {
      return i;
    }
  }
  return 0;
}

function getPlanetBadgeStyle(planetStr: string): { code: string; color: string } {
  if (!planetStr) return { code: "", color: "bg-amber-400/20 text-amber-200 border-amber-400/30" };
  if (planetStr.includes("Sun") || planetStr.includes("Surya")) {
    return { code: "Su", color: "bg-amber-500/25 text-amber-200 border-amber-500/50" };
  }
  if (planetStr.includes("Moon") || planetStr.includes("Chandra")) {
    return { code: "Mo", color: "bg-sky-500/25 text-sky-200 border-sky-500/50" };
  }
  if (planetStr.includes("Mars") || planetStr.includes("Mangal")) {
    return { code: "Ma", color: "bg-rose-500/25 text-rose-200 border-rose-500/50" };
  }
  if (planetStr.includes("Mercury") || planetStr.includes("Budh")) {
    return { code: "Me", color: "bg-emerald-500/25 text-emerald-200 border-emerald-500/50" };
  }
  if (planetStr.includes("Jupiter") || planetStr.includes("Guru")) {
    return { code: "Ju", color: "bg-yellow-500/25 text-yellow-200 border-yellow-500/50" };
  }
  if (planetStr.includes("Venus") || planetStr.includes("Shukra")) {
    return { code: "Ve", color: "bg-purple-500/25 text-purple-200 border-purple-500/50" };
  }
  if (planetStr.includes("Saturn") || planetStr.includes("Shani")) {
    return { code: "Sa", color: "bg-slate-700/60 text-slate-200 border-slate-600/60" };
  }
  if (planetStr.includes("Rahu")) {
    return { code: "Ra", color: "bg-fuchsia-500/25 text-fuchsia-200 border-fuchsia-500/50" };
  }
  if (planetStr.includes("Ketu")) {
    return { code: "Ke", color: "bg-indigo-500/25 text-indigo-200 border-indigo-500/50" };
  }
  return { code: planetStr.substring(0, 2), color: "bg-amber-400/20 text-amber-200 border-amber-400/30" };
}

const NORTH_HOUSE_POSITIONS: Record<number, { top: string; left: string }> = {
  1: { top: "25%", left: "50%" },
  2: { top: "14%", left: "25%" },
  3: { top: "25%", left: "14%" },
  4: { top: "50%", left: "25%" },
  5: { top: "75%", left: "14%" },
  6: { top: "86%", left: "25%" },
  7: { top: "75%", left: "50%" },
  8: { top: "86%", left: "75%" },
  9: { top: "75%", left: "86%" },
  10: { top: "50%", left: "75%" },
  11: { top: "25%", left: "86%" },
  12: { top: "14%", left: "75%" },
};

const SOUTH_GRID_MAP: { rashiIndex: number; row: number; col: number }[] = [
  { rashiIndex: 11, row: 0, col: 0 },
  { rashiIndex: 0, row: 0, col: 1 },
  { rashiIndex: 1, row: 0, col: 2 },
  { rashiIndex: 2, row: 0, col: 3 },
  { rashiIndex: 3, row: 1, col: 3 },
  { rashiIndex: 4, row: 2, col: 3 },
  { rashiIndex: 5, row: 3, col: 3 },
  { rashiIndex: 6, row: 3, col: 2 },
  { rashiIndex: 7, row: 3, col: 1 },
  { rashiIndex: 8, row: 3, col: 0 },
  { rashiIndex: 9, row: 2, col: 0 },
  { rashiIndex: 10, row: 1, col: 0 },
];

export const KundliView: React.FC<KundliViewProps> = ({ user }) => {
  const initialKundli = calculateVedicKundli(
    user.dob || "1995-05-15",
    user.tob || "08:30 AM",
    user.pob || "New Delhi, India",
    user.name || "Seeker"
  );

  const [kundli, setKundli] = useState<KundliData | null>(initialKundli);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<
    "chart" | "shodashvarga" | "planets" | "shadbala" | "ashtakavarga" | "dasha" | "transit" | "yogas" | "doshas" | "houses" | "remedies"
  >("chart");
  const [selectedRemedyCategory, setSelectedRemedyCategory] = useState<string>("all");

  const [chartStyle, setChartStyle] = useState<"north" | "south">("north");
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [selectedDivCode, setSelectedDivCode] = useState<string>("D9");
  const [expandedMahadasha, setExpandedMahadasha] = useState<string | null>(null);
  const [expandedAntardasha, setExpandedAntardasha] = useState<string | null>(null);

  const [showEditBirth, setShowEditBirth] = useState(false);
  const [editDob, setEditDob] = useState(user.dob || "1995-05-15");
  const [editTob, setEditTob] = useState(user.tob || "08:30 AM");
  const [editPob, setEditPob] = useState(user.pob || "New Delhi, India");

  const fetchKundli = async (dobOverride?: string, tobOverride?: string, pobOverride?: string) => {
    const curDob = dobOverride || editDob;
    const curTob = tobOverride || editTob;
    const curPob = pobOverride || editPob;

    // Immediately calculate locally for instant 0ms response
    const calculated = calculateVedicKundli(curDob, curTob, curPob, user.name);
    setKundli(calculated);

    try {
      const res = await fetch("/api/astrology/kundli-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          dob: curDob,
          tob: curTob,
          pob: curPob,
          gender: user.gender,
        }),
      });

      const data = await res.json();
      if (res.ok && data.kundli) {
        setKundli(data.kundli);
      }
    } catch (err) {
      console.error("Failed to fetch Kundli analysis", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const d = user.dob || "1995-05-15";
    const t = user.tob || "08:30 AM";
    const p = user.pob || "New Delhi, India";
    setEditDob(d);
    setEditTob(t);
    setEditPob(p);
    setKundli(calculateVedicKundli(d, t, p, user.name));
    fetchKundli(d, t, p);
  }, [user]);

  const handleApplyBirthEdit = () => {
    setShowEditBirth(false);
    fetchKundli(editDob, editTob, editPob);
  };

  const lagnaIndex = getLagnaIndex(kundli?.basics?.lagna || "");

  const activeDivisionalChart = kundli?.divisionalCharts?.find((c) => c.code === selectedDivCode) || kundli?.divisionalCharts?.[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 font-sans pb-24 text-slate-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/60 to-slate-900 border border-amber-500/30 rounded-3xl p-5 mb-6 backdrop-blur-md shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-200 flex items-center gap-2">
                <span>{user.name}'s Vedic Chart & Ephemeris</span>
                <button
                  onClick={() => setShowEditBirth(!showEditBirth)}
                  className="p-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs transition-all cursor-pointer"
                  title="Adjust Birth Details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Born: <strong className="text-slate-300">{editDob}</strong> • <strong className="text-slate-300">{editTob}</strong> • <strong className="text-slate-300">{editPob}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchKundli()}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Recalculate Chart</span>
          </button>
        </div>

        {/* Quick Edit Birth Details Panel */}
        {showEditBirth && (
          <div className="mt-4 pt-4 border-t border-slate-800 bg-slate-950/70 p-4 rounded-2xl border border-amber-500/30 animate-fade-in">
            <h4 className="text-xs font-bold text-amber-300 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Adjust Birth Parameters for Precision Ephemeris
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={editDob}
                  onChange={(e) => setEditDob(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Time of Birth</label>
                <input
                  type="text"
                  placeholder="e.g. 08:30 AM"
                  value={editTob}
                  onChange={(e) => setEditTob(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Place of Birth</label>
                <input
                  type="text"
                  placeholder="City, Country"
                  value={editPob}
                  onChange={(e) => setEditPob(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditBirth(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyBirthEdit}
                className="px-4 py-1.5 rounded-lg bg-amber-500/30 text-amber-200 border border-amber-500/50 hover:bg-amber-500/40 text-xs font-bold cursor-pointer"
              >
                Apply & Recalculate
              </button>
            </div>
          </div>
        )}

        {/* Strength Meter & Quick Basics Header */}
        {kundli && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
            {kundli.strengthMeter && (
              <div className="bg-slate-950/70 p-3 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-bold font-mono text-amber-300 text-sm">
                    {kundli.strengthMeter.overallScore}%
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-200 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Chart Overall Power: {kundli.strengthMeter.rating}
                    </h4>
                    <p className="text-[11px] text-slate-300 line-clamp-1">{kundli.strengthMeter.summary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>Shadbala: {kundli.strengthMeter.breakdown.shadbalaPower}%</span>
                  <span>•</span>
                  <span>Yogas: {kundli.strengthMeter.breakdown.yogaPower}%</span>
                  <span>•</span>
                  <span>SAV: {kundli.strengthMeter.breakdown.savPower}%</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Moon Sign (Rashi)</span>
                <span className="text-xs font-bold text-amber-300">{kundli.basics.rashi}</span>
              </div>
              <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Ascendant (Lagna)</span>
                <span className="text-xs font-bold text-amber-300">{kundli.basics.lagna}</span>
              </div>
              <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Nakshatra</span>
                <span className="text-xs font-bold text-amber-300">{kundli.basics.nakshatra}</span>
              </div>
              <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Current Dasha Hierarchy</span>
                <span className="text-xs font-bold text-amber-300 block truncate">
                  {kundli.dashaPeriod?.currentMahadasha}
                </span>
                {kundli.dashaPeriod?.currentAntardasha && (
                  <span className="text-[10px] text-amber-400/90 block font-mono">
                    AD: {kundli.dashaPeriod.currentAntardasha.replace(" Antardasha", "")}
                    {kundli.dashaPeriod.currentPratyantardasha && ` • PAD: ${kundli.dashaPeriod.currentPratyantardasha.replace(" Pratyantardasha", "")}`}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-amber-500/20">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
          <h3 className="text-sm font-bold text-amber-200">Computing Precision Sidereal Lahiri Ephemeris...</h3>
          <p className="text-xs text-slate-400 mt-1">Calculating Shodashvarga, Shadbala, Ashtakavarga, Transits & Vimshottari Timelines</p>
        </div>
      )}

      {!loading && kundli && (
        <>
          {/* Sub Navigation Bar */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
            {[
              { id: "chart", label: "Lagna Chart (D1)", icon: Compass },
              { id: "shodashvarga", label: "Shodashvarga (D1-D60)", icon: Layers },
              { id: "planets", label: "Planets, Combustion & Aspects", icon: Star },
              { id: "shadbala", label: "Planet Strength (Shadbala)", icon: Scale },
              { id: "ashtakavarga", label: "Ashtakavarga (BAV/SAV)", icon: BarChart3 },
              { id: "dasha", label: "Dasha Timelines", icon: Calendar },
              { id: "transit", label: "Transit (Gochar)", icon: Activity },
              { id: "yogas", label: "Yogas & Karakas", icon: Award },
              { id: "doshas", label: "Doshas List", icon: ShieldAlert },
              { id: "houses", label: "12 Houses Analysis", icon: Eye },
              { id: "remedies", label: "Spiritual Remedies & Sadhana (12)", icon: Flame },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-amber-500/20 border border-amber-500/40 text-amber-200 shadow-md"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Lagna Chart (D1) */}
          {activeSubTab === "chart" && (
            <div className="space-y-6">
              <div className="bg-slate-900/80 border border-amber-500/30 rounded-3xl p-6 text-center relative overflow-hidden backdrop-blur-md">
                
                {/* Header & Style Switcher */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
                  <div className="text-left">
                    <h3 className="font-serif text-lg font-bold text-amber-200">
                      {chartStyle === "north" ? "North Indian (Diamond) Lagna Chart" : "South Indian (Square Grid) Lagna Chart"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Lagna: <strong className="text-amber-300">{kundli.basics.lagna}</strong> • Click any house to view details
                    </p>
                  </div>

                  {/* North vs South Toggle */}
                  <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setChartStyle("north")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        chartStyle === "north"
                          ? "bg-amber-500/30 text-amber-200 border border-amber-500/40 shadow"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      North Indian
                    </button>
                    <button
                      onClick={() => setChartStyle("south")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        chartStyle === "south"
                          ? "bg-amber-500/30 text-amber-200 border border-amber-500/40 shadow"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      South Indian
                    </button>
                  </div>
                </div>

                {/* NORTH INDIAN DIAMOND CHART */}
                {chartStyle === "north" && (
                  <div className="max-w-md mx-auto aspect-square relative bg-slate-950/95 border-2 border-amber-500/50 rounded-2xl p-2 shadow-2xl overflow-hidden">
                    <svg className="w-full h-full text-amber-500/40 stroke-current absolute inset-0 pointer-events-none" viewBox="0 0 100 100">
                      <rect x="0" y="0" width="100" height="100" fill="none" strokeWidth="1.2" />
                      <polygon points="50,0 100,50 50,100 0,50" fill="none" strokeWidth="1.2" />
                      <line x1="0" y1="0" x2="100" y2="100" strokeWidth="0.8" />
                      <line x1="100" y1="0" x2="0" y2="100" strokeWidth="0.8" />
                    </svg>

                    <div className="absolute inset-0 pointer-events-auto">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
                        const pos = NORTH_HOUSE_POSITIONS[houseNum];
                        const houseRashiIndex = (lagnaIndex + houseNum - 1) % 12;
                        const rashiNumber = houseRashiIndex + 1;
                        const housePlanets = kundli.planetaryPositions?.filter(
                          (p) => Number(p.house) === houseNum
                        ) || [];
                        const isSelected = selectedHouse === houseNum;
                        const isLagnaHouse = houseNum === 1;

                        return (
                          <div
                            key={houseNum}
                            onClick={() => setSelectedHouse(isSelected ? null : houseNum)}
                            style={{ top: pos.top, left: pos.left }}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 p-1 rounded-lg text-center cursor-pointer transition-all ${
                              isSelected
                                ? "bg-amber-500/40 border border-amber-400 ring-2 ring-amber-400/50 scale-110 z-20"
                                : isLagnaHouse
                                ? "bg-amber-500/15 border border-amber-500/40 z-10"
                                : "hover:bg-amber-500/15 z-10"
                            }`}
                          >
                            <div className="flex items-center justify-center space-x-1">
                              <span className="text-[12px] font-mono font-extrabold text-amber-300">
                                {rashiNumber}
                              </span>
                              {isLagnaHouse ? (
                                <span className="text-[8px] font-extrabold px-1 rounded bg-amber-400 text-slate-950 uppercase">
                                  LAGNA
                                </span>
                              ) : (
                                <span className="text-[8px] text-slate-500 font-sans uppercase">
                                  H{houseNum}
                                </span>
                              )}
                            </div>

                            {housePlanets.length > 0 ? (
                              <div className="flex flex-wrap items-center justify-center gap-0.5 mt-0.5 max-w-[68px]">
                                {housePlanets.map((p) => {
                                  const badge = getPlanetBadgeStyle(p.planet);
                                  return (
                                    <span
                                      key={p.planet}
                                      className={`text-[9px] font-bold px-1 py-0.2 rounded border ${badge.color}`}
                                      title={`${p.planet} (${p.degree}) in ${p.sign}`}
                                    >
                                      {badge.code}
                                    </span>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-[8px] text-slate-600 block italic">Empty</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SOUTH INDIAN GRID CHART */}
                {chartStyle === "south" && (
                  <div className="max-w-md mx-auto aspect-square relative bg-slate-950/95 border-2 border-amber-500/50 rounded-2xl p-2 shadow-2xl overflow-hidden grid grid-cols-4 grid-rows-4 gap-1">
                    <div className="col-start-2 col-span-2 row-start-2 row-span-2 bg-slate-900/90 border border-amber-500/30 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-serif text-amber-300 font-bold uppercase tracking-wider block">
                        South Indian Grid
                      </span>
                      <span className="text-xs font-bold text-slate-200 mt-1">
                        {user.name}'s Chart
                      </span>
                      <span className="text-[10px] text-amber-400 mt-0.5">
                        Lagna: {kundli.basics.lagna}
                      </span>
                    </div>

                    {SOUTH_GRID_MAP.map((item) => {
                      const rashiIndex = item.rashiIndex;
                      const rashiName = RASHI_NAMES[rashiIndex];
                      const rashiSanskrit = RASHI_SANSKRIT[rashiIndex];
                      const houseNum = ((rashiIndex - lagnaIndex + 12) % 12) + 1;
                      const isLagna = rashiIndex === lagnaIndex;
                      const housePlanets = kundli.planetaryPositions?.filter(
                        (p) => Number(p.house) === houseNum
                      ) || [];
                      const isSelected = selectedHouse === houseNum;

                      return (
                        <div
                          key={rashiIndex}
                          onClick={() => setSelectedHouse(isSelected ? null : houseNum)}
                          style={{ gridRowStart: item.row + 1, gridColumnStart: item.col + 1 }}
                          className={`p-1.5 border rounded-lg flex flex-col justify-between text-left cursor-pointer transition-all ${
                            isLagna
                              ? "bg-amber-500/20 border-amber-400 ring-1 ring-amber-400/40"
                              : isSelected
                              ? "bg-amber-500/30 border-amber-400"
                              : "bg-slate-900/70 border-slate-800 hover:border-amber-500/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-amber-300 truncate">
                              {rashiName}
                            </span>
                            {isLagna ? (
                              <span className="text-[8px] font-extrabold px-1 rounded bg-amber-400 text-slate-950">
                                LAGNA
                              </span>
                            ) : (
                              <span className="text-[8px] text-slate-500 font-mono">
                                H{houseNum}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-0.5 my-1">
                            {housePlanets.map((p) => {
                              const badge = getPlanetBadgeStyle(p.planet);
                              return (
                                <span
                                  key={p.planet}
                                  className={`text-[9px] font-bold px-1 py-0.2 rounded border ${badge.color}`}
                                >
                                  {badge.code}
                                </span>
                              );
                            })}
                          </div>

                          <span className="text-[8px] text-slate-500 italic block truncate">
                            {rashiSanskrit}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Selected House Detail Popover */}
                {selectedHouse && (
                  <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-left text-xs text-amber-200 animate-fade-in">
                    <div className="font-bold mb-1 flex items-center justify-between border-b border-amber-500/20 pb-2">
                      <span className="font-serif text-sm">House {selectedHouse} — {RASHI_NAMES[(lagnaIndex + selectedHouse - 1) % 12]} ({RASHI_SANSKRIT[(lagnaIndex + selectedHouse - 1) % 12]})</span>
                      <button onClick={() => setSelectedHouse(null)} className="text-slate-400 hover:text-amber-300 cursor-pointer">✕</button>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">
                      {kundli.housesAnalysis?.find((h) => Number(h.house) === selectedHouse)?.summary || "Detailed house analysis available in 12 Houses tab."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Shodashvarga Charts (D1 to D60) */}
          {activeSubTab === "shodashvarga" && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/80 border border-amber-500/30 rounded-3xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-sm font-bold text-amber-200 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" /> Shodashvarga (16 Divisional Charts)
                  </h3>
                  <span className="text-[10px] text-slate-400">Select Divisional Chart</span>
                </div>

                {/* Divisional Chart Selector Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {kundli.divisionalCharts?.map((chart) => {
                    const isSelected = chart.code === selectedDivCode;
                    return (
                      <button
                        key={chart.code}
                        onClick={() => setSelectedDivCode(chart.code)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-500 text-slate-950 font-bold shadow-lg"
                            : "bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        {chart.code} ({chart.name})
                      </button>
                    );
                  })}
                </div>

                {/* Display Selected Divisional Chart Details */}
                {activeDivisionalChart && (
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                      <div>
                        <h4 className="font-serif text-base font-bold text-amber-300">
                          {activeDivisionalChart.title}
                        </h4>
                        <p className="text-xs text-slate-400">
                          Divisional Ascendant (Lagna): <strong className="text-amber-200">{activeDivisionalChart.lagnaSign}</strong>
                        </p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 w-fit">
                        {activeDivisionalChart.code} Division
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      {activeDivisionalChart.positions.map((pos) => {
                        const badge = getPlanetBadgeStyle(pos.planet);
                        return (
                          <div key={pos.planet} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badge.color}`}>
                                {badge.code}
                              </span>
                              <span className="font-semibold text-slate-200">{pos.planet}</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-amber-300 font-bold">{pos.sign}</span>
                              <span className="block text-[10px] text-slate-400">House {pos.house}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Planets & Degrees + Combustion & Aspects */}
          {activeSubTab === "planets" && (
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-serif text-sm font-bold text-amber-200">Planetary Geocentric Positions & Dignity</h3>
                  <span className="text-[10px] text-slate-400">Lahiri Ayanamsa</span>
                </div>

                <div className="divide-y divide-slate-800/80 text-xs">
                  {kundli.planetaryPositions?.map((p) => {
                    const badge = getPlanetBadgeStyle(p.planet);
                    const combust = kundli.combustion?.find((c) => c.planet === p.planet);
                    const retro = kundli.retrogrades?.find((r) => r.planet === p.planet);

                    return (
                      <div key={p.planet} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/40 px-2 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badge.color}`}>
                            {badge.code}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-200 block">{p.planet}</span>
                            <div className="flex gap-1.5 mt-0.5">
                              {retro?.isRetrograde && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                  RETROGRADE [R]
                                </span>
                              )}
                              {combust?.isCombust && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                  COMBUST
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-slate-400 text-xs">
                          <div>Sign: <strong className="text-slate-200">{p.sign}</strong></div>
                          <div>House: <strong className="text-amber-300">{p.house}</strong></div>
                          <div className="font-mono text-amber-300 font-bold">{p.degree}</div>
                          <div className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            {p.dignity}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Graha Aspects & Drishti Card */}
              {kundli.aspects && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-3">
                  <h3 className="font-serif text-sm font-bold text-amber-200 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-400" /> Planetary Aspects (Graha & Rasi Drishti)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {kundli.aspects.map((asp) => (
                      <div key={asp.planet} className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800">
                        <span className="font-bold text-amber-300 block mb-1">{asp.planet}</span>
                        <p className="text-slate-300 leading-relaxed">{asp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Shadbala (Planet Strength) */}
          {activeSubTab === "shadbala" && (
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-amber-500/30 rounded-3xl p-4">
                <h3 className="font-serif text-sm font-bold text-amber-200 mb-2 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400" /> Shadbala (Six-fold Planetary Strength Engine)
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Evaluates Sthanabala (Positional), Digbala (Directional), Kaalabala (Temporal), Cheshtabala (Motional), Naisargikabala (Natural), and Drikbala (Aspectual) virupas.
                </p>

                <div className="space-y-3">
                  {kundli.shadbala?.map((item) => (
                    <div key={item.planet} className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-200 text-sm">{item.planet}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-300 font-mono font-bold">{item.totalRupas} Rupas</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === "Strong"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : item.status === "Weak"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          }`}>
                            {item.status} (Req: {item.requiredRupas})
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-[10px] text-slate-400 font-mono text-center">
                        <div className="bg-slate-900 p-1.5 rounded-lg">Sthana: {item.sthanabala}</div>
                        <div className="bg-slate-900 p-1.5 rounded-lg">Dig: {item.digbala}</div>
                        <div className="bg-slate-900 p-1.5 rounded-lg">Kaala: {item.kaalabala}</div>
                        <div className="bg-slate-900 p-1.5 rounded-lg">Cheshta: {item.cheshtabala}</div>
                        <div className="bg-slate-900 p-1.5 rounded-lg">Nais: {item.naisargikabala}</div>
                        <div className="bg-slate-900 p-1.5 rounded-lg">Drik: {item.drikbala}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Ashtakavarga (BAV & SAV) */}
          {activeSubTab === "ashtakavarga" && kundli.ashtakavarga && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/80 border border-amber-500/30 rounded-3xl space-y-4">
                <h3 className="font-serif text-sm font-bold text-amber-200 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" /> Sarvashtakavarga (SAV Points per House)
                </h3>

                {/* SAV Summary Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                  {kundli.ashtakavarga.sav.map((pts, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border ${
                        pts >= 30
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200"
                          : pts < 28
                          ? "bg-rose-500/15 border-rose-500/40 text-rose-200"
                          : "bg-slate-950 border-slate-800 text-slate-300"
                      }`}
                    >
                      <span className="text-[10px] block text-slate-400 uppercase font-mono">{RASHI_NAMES[idx]}</span>
                      <span className="text-base font-extrabold font-mono block mt-0.5">{pts}</span>
                      <span className="text-[9px] text-slate-400 block">{pts >= 30 ? "Strong" : pts < 28 ? "Weak" : "Balanced"}</span>
                    </div>
                  ))}
                </div>

                {/* Bhinna Ashtakavarga Matrix Table */}
                <div className="mt-4 pt-4 border-t border-slate-800 overflow-x-auto">
                  <h4 className="text-xs font-bold text-amber-300 mb-2">Bhinna Ashtakavarga (BAV) Table</h4>
                  <table className="w-full text-left text-[11px] font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2 px-2">Planet</th>
                        {RASHI_NAMES.map((r) => (
                          <th key={r} className="py-2 px-1 text-center">{r.substring(0, 3)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {kundli.ashtakavarga.bav.map((row) => (
                        <tr key={row.planet} className="hover:bg-slate-800/40">
                          <td className="py-2 px-2 font-bold text-amber-300">{row.planet}</td>
                          {row.points.map((pt, i) => (
                            <td key={i} className="py-2 px-1 text-center font-bold text-slate-200">
                              {pt}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Vimshottari & Yogini Dasha Timelines */}
          {activeSubTab === "dasha" && (
            <div className="space-y-4">
              {/* Active Dasha Hierarchy Banner */}
              {kundli.dashaPeriod && (
                <div className="p-4 bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-900 border border-amber-500/40 rounded-3xl shadow-xl space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> Current Active Dasha Hierarchy (Real-Time Precision)
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-slate-800 font-mono">
                      Sidereal Lahiri Precision Ephemeris
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                    <div className="bg-slate-950/80 p-3 rounded-2xl border border-amber-500/30">
                      <span className="text-[10px] text-amber-400/80 uppercase tracking-wider block font-semibold">1. Mahadasha (Major Period)</span>
                      <span className="font-bold text-amber-200 text-sm block mt-0.5">{kundli.dashaPeriod.currentMahadasha}</span>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Active Until: <strong className="text-amber-300 font-mono">{kundli.dashaPeriod.endsOn}</strong>
                      </span>
                    </div>

                    <div className="bg-slate-950/80 p-3 rounded-2xl border border-amber-500/30">
                      <span className="text-[10px] text-amber-400/80 uppercase tracking-wider block font-semibold">2. Antardasha (Sub-period)</span>
                      <span className="font-bold text-amber-200 text-sm block mt-0.5">{kundli.dashaPeriod.currentAntardasha}</span>
                      {kundli.dashaPeriod.activeAntardashaEndsOn && (
                        <span className="text-[10px] text-slate-400 block mt-1">
                          Active Until: <strong className="text-amber-300 font-mono">{kundli.dashaPeriod.activeAntardashaEndsOn}</strong>
                        </span>
                      )}
                    </div>

                    {kundli.dashaPeriod.currentPratyantardasha && (
                      <div className="bg-slate-950/80 p-3 rounded-2xl border border-amber-500/30">
                        <span className="text-[10px] text-amber-400/80 uppercase tracking-wider block font-semibold">3. Pratyantardasha (Sub-sub)</span>
                        <span className="font-bold text-amber-200 text-sm block mt-0.5">{kundli.dashaPeriod.currentPratyantardasha}</span>
                        {kundli.dashaPeriod.activePratyantardashaEndsOn && (
                          <span className="text-[10px] text-slate-400 block mt-1">
                            Active Until: <strong className="text-amber-300 font-mono">{kundli.dashaPeriod.activePratyantardashaEndsOn}</strong>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 italic pt-1 border-t border-slate-800/60">
                    "{kundli.dashaPeriod.effectSummary}"
                  </p>
                </div>
              )}

              {/* Vimshottari Timeline with Expandable Antardashas & Pratyantardashas */}
              <div className="p-4 bg-slate-900/80 border border-amber-500/30 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-bold text-amber-200 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" /> Full 120-Year Vimshottari Cycle (Exact Date & Time)
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">120 Years Lifespan Model</span>
                </div>

                <div className="space-y-2 text-xs">
                  {kundli.vimshottariTimeline?.map((item) => {
                    const isExpanded = expandedMahadasha === item.planet;
                    return (
                      <div
                        key={item.planet}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          item.isCurrent
                            ? "bg-amber-500/15 border-amber-400 ring-1 ring-amber-400/40 shadow-lg"
                            : "bg-slate-950 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div
                          onClick={() => setExpandedMahadasha(isExpanded ? null : item.planet)}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-amber-300 text-sm">{item.planet} Mahadasha</span>
                              <span className="text-[10px] text-slate-400 font-mono">({item.durationYears} Years)</span>
                            </div>
                            <span className="text-[11px] text-slate-300 block mt-0.5 font-mono">
                              {item.startDate} ➔ {item.endDate}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {item.isCurrent && (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                                ACTIVE MAHADASHA
                              </span>
                            )}
                            <span className="text-slate-400 text-xs font-semibold hover:text-amber-300">
                              {isExpanded ? "▲ Hide Sub-periods" : "▼ View Antardashas"}
                            </span>
                          </div>
                        </div>

                        {/* Antardashas List */}
                        {isExpanded && item.antardashas && (
                          <div className="mt-3 pt-3 border-t border-slate-800 space-y-2.5 animate-fade-in">
                            <div className="text-[11px] font-bold text-amber-300/90 flex items-center justify-between">
                              <span>Sub-periods (Antardashas under {item.planet} Mahadasha)</span>
                              <span className="text-[10px] text-slate-400 font-normal italic">
                                Click any Antardasha to view Pratyantardashas (Sub-sub periods)
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {item.antardashas.map((ad) => {
                                const adKey = `${item.planet}-${ad.planet}`;
                                const isAdExpanded = expandedAntardasha === adKey;
                                return (
                                  <div
                                    key={ad.planet}
                                    className={`p-2.5 rounded-xl text-xs border transition-all ${
                                      ad.isCurrent
                                        ? "bg-amber-500/25 border-amber-400 text-amber-100 font-medium ring-1 ring-amber-400/50 shadow"
                                        : "bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700"
                                    }`}
                                  >
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedAntardasha(isAdExpanded ? null : adKey);
                                      }}
                                      className="cursor-pointer flex items-center justify-between"
                                    >
                                      <div>
                                        <div className="font-bold text-amber-300 flex items-center gap-1.5">
                                          <span>{item.planet} - {ad.planet}</span>
                                          {ad.isCurrent && (
                                            <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-bold uppercase">
                                              ACTIVE AD
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-[10px] text-slate-300 mt-1 font-mono">{ad.startDate} ➔ {ad.endDate}</div>
                                      </div>
                                      <span className="text-[10px] text-amber-400/90 font-bold ml-1 hover:underline">
                                        {isAdExpanded ? "▲" : "▼ Sub-sub"}
                                      </span>
                                    </div>

                                    {/* Pratyantardashas (Sub-sub periods) */}
                                    {isAdExpanded && ad.pratyantardashas && (
                                      <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1.5 animate-fade-in">
                                        <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                                          Pratyantardashas (Exact Timing):
                                        </div>
                                        <div className="space-y-1 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
                                          {ad.pratyantardashas.map((pad, pIdx) => (
                                            <div
                                              key={pIdx}
                                              className={`p-1.5 rounded-lg text-[10px] flex items-center justify-between border ${
                                                pad.isCurrent
                                                  ? "bg-amber-400/30 border-amber-400 text-amber-100 font-bold"
                                                  : "bg-slate-950/80 border-slate-800/60 text-slate-400"
                                              }`}
                                            >
                                              <span className="font-semibold text-slate-200">
                                                {item.planet}-{ad.planet}-{pad.planet}
                                              </span>
                                              <span className="font-mono text-[9px] text-slate-300">
                                                {pad.startDate} ➔ {pad.endDate}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Yogini Dasha 36-Year Timeline */}
              {kundli.yoginiTimeline && (
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-3">
                  <h3 className="font-serif text-sm font-bold text-amber-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" /> Yogini Dasha 36-Year Cycle
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {kundli.yoginiTimeline.map((y, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border ${
                          y.isCurrent
                            ? "bg-purple-500/20 border-purple-400 text-purple-200 font-bold"
                            : "bg-slate-950 border-slate-800 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-purple-300">{y.yogini} ({y.lord})</span>
                          <span className="text-[10px] font-mono">{y.startDate} to {y.endDate}</span>
                        </div>
                        <p className="text-[11px] text-slate-300">{y.effect}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: Transit (Gochar) & Sade Sati */}
          {activeSubTab === "transit" && kundli.transitGochar && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/80 border border-amber-500/30 rounded-3xl space-y-3">
                <h3 className="font-serif text-sm font-bold text-amber-200 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" /> Planetary Transits (Current Gochar)
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Real-time transit movement of planets relative to your Natal Chandra Rashi (Moon Sign) and Lagna.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {kundli.transitGochar.map((item) => (
                    <div key={item.planet} className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-amber-300 text-sm">{item.planet} Transit</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.effectType === "Favorable"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : item.effectType === "Unfavorable"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                            : "bg-slate-800 text-slate-300"
                        }`}>
                          {item.effectType}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs mb-2 leading-relaxed">{item.analysis}</p>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800/60 pt-2">
                        <span>Natal: {item.natalSign}</span>
                        <span>Transit: {item.transitSign}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: Yogas & Chara Karakas + Arudha Lagna */}
          {activeSubTab === "yogas" && (
            <div className="space-y-4">
              {/* Arudha Lagna Box */}
              {kundli.arudhaLagna && (
                <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                  <h4 className="font-serif text-sm font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-400" /> Arudha Lagna (AL) - Public Image Pada
                  </h4>
                  <p className="text-slate-300 leading-relaxed mb-2">{kundli.arudhaLagna.description}</p>
                  <div className="flex gap-4 font-mono font-bold text-amber-300">
                    <span>Arudha Sign: {kundli.arudhaLagna.arudhaLagnaSign}</span>
                    <span>•</span>
                    <span>Arudha House: {kundli.arudhaLagna.arudhaLagnaHouse}</span>
                  </div>
                </div>
              )}

              {/* Jaimini 7 Chara Karakas */}
              {kundli.charaKarakas && (
                <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h3 className="font-serif text-sm font-bold text-amber-200 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" /> Jaimini 7 Chara Karakas
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {kundli.charaKarakas.map((ck) => (
                      <div key={ck.code} className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-amber-300">{ck.karaka} ({ck.code})</span>
                          <span className="font-mono text-slate-400 text-[10px]">{ck.degreeInSign}</span>
                        </div>
                        <span className="block font-bold text-slate-200 text-xs mb-1">{ck.planet}</span>
                        <p className="text-[10px] text-slate-400 leading-relaxed">{ck.significatorOf}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Yogas List */}
              <div className="space-y-3">
                <h3 className="font-serif text-sm font-bold text-amber-200 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" /> Auspicious Yogas & Combination
                </h3>
                {kundli.yogas?.map((yoga, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h4 className="font-serif text-sm font-bold text-amber-200">{yoga.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {yoga.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{yoga.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: Doshas List */}
          {activeSubTab === "doshas" && kundli.doshas && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/80 border border-amber-500/30 rounded-3xl space-y-3">
                <h3 className="font-serif text-sm font-bold text-amber-200 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" /> Comprehensive Vedic Doshas & Affliction Audit
                </h3>

                <div className="space-y-3 text-xs">
                  {kundli.doshas.map((d) => (
                    <div
                      key={d.name}
                      className={`p-4 rounded-2xl border ${
                        d.isPresent
                          ? "bg-rose-500/10 border-rose-500/30 text-rose-100"
                          : "bg-slate-950 border-slate-800 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-serif text-sm font-bold text-amber-300">{d.name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          d.isPresent
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        }`}>
                          {d.isPresent ? `Present (${d.severity})` : "Absent / Clear"}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed mb-2">{d.explanation}</p>
                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-amber-200 text-[11px]">
                        <strong>Recommended Spiritual Remedy:</strong> {d.remedy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: 12 Houses Analysis */}
          {activeSubTab === "houses" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kundli.housesAnalysis?.map((item) => (
                <div
                  key={item.house}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif text-sm font-bold text-amber-200">
                      {item.title}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      {item.sign}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.summary}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 11: 12 Sacred Vedic Remedies & Sadhana */}
          {activeSubTab === "remedies" && (
            <div className="space-y-6">
              {/* Category Filter Pills */}
              <div className="p-4 bg-slate-900/90 border border-amber-500/30 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-bold text-amber-200 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" /> 12 Vedic Spiritual Remedies & Sadhana Sections
                  </h3>
                  <span className="text-[11px] text-amber-400/80 font-mono">
                    {kundli.structuredRemedies?.length || 12} Sacred Disciplines
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Authentic Vedic remediation tailored to your Lagna, Moon Sign, and active Dasha influences. Filter by discipline below to explore structured protocols:
                </p>

                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    "all",
                    "Mantra",
                    "Yantra",
                    "Temple",
                    "Puja",
                    "Havan",
                    "Charity",
                    "Fasting",
                    "Gemstone Guidance",
                    "Rudraksha Recommendation",
                    "Daily Sadhana",
                    "Meditation",
                    "Lifestyle Advice"
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedRemedyCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                        selectedRemedyCategory === cat
                          ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                          : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {cat === "all" ? "All 12 Remedies" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remedy Cards Grid */}
              <div className="space-y-5">
                {(kundli.structuredRemedies || [])
                  .filter((rem) => selectedRemedyCategory === "all" || rem.category === selectedRemedyCategory)
                  .map((rem, idx) => (
                    <div
                      key={rem.category + idx}
                      className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 shadow-xl"
                    >
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-xs font-bold font-mono">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {rem.category}
                            </span>
                            <h4 className="font-serif text-base font-bold text-amber-100 mt-0.5">
                              {rem.title}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                          <span className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                            <Clock className="w-3 h-3 text-amber-400" /> {rem.bestTime}
                          </span>
                        </div>
                      </div>

                      {/* 1. WHY */}
                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/20 space-y-1">
                        <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Why This Remedy is Prescribed:
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed pl-5">
                          {rem.why}
                        </p>
                      </div>

                      {/* 2. BENEFITS */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Benefits:
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {rem.benefits.map((b, bIdx) => (
                            <div key={bIdx} className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. PROCEDURE */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                          <ListOrdered className="w-3.5 h-3.5 text-sky-400" /> Step-By-Step Procedure:
                        </div>
                        <div className="space-y-2">
                          {rem.procedure.map((step, sIdx) => (
                            <div key={sIdx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-200">
                              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 border border-sky-500/30">
                                {sIdx + 1}
                              </span>
                              <span className="leading-relaxed">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4. BEST TIME & 5. DURATION */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                            <Sun className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Best Time / Muhurta</span>
                            <span className="text-xs font-semibold text-amber-200">{rem.bestTime}</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Required Duration / Cycle</span>
                            <span className="text-xs font-semibold text-indigo-200">{rem.duration}</span>
                          </div>
                        </div>
                      </div>

                      {/* 6. EXPECTED SPIRITUAL PURPOSE */}
                      <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 shrink-0 mt-0.5">
                          <Target className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-purple-300 block tracking-wider">
                            Expected Spiritual Purpose
                          </span>
                          <p className="text-xs text-purple-100 leading-relaxed font-medium mt-0.5">
                            {rem.expectedSpiritualPurpose}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

