import React from "react";
import { Sparkles, Compass, User, Home, BookOpen, MessageSquare, Sun, HeartHandshake } from "lucide-react";
import { UserProfile, ActiveTab } from "../types";

interface HeaderProps {
  user: UserProfile;
  activeTab?: ActiveTab | "home";
  onSelectTab?: (tab: ActiveTab | "home") => void;
  onOpenProfile: () => void;
  onGoHome?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeTab = "home",
  onSelectTab,
  onOpenProfile,
  onGoHome,
}) => {
  const handleNavClick = (tab: ActiveTab | "home") => {
    if (tab === "home" && onGoHome) {
      onGoHome();
    } else if (onSelectTab) {
      onSelectTab(tab);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-amber-200/60 px-4 py-3 shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => handleNavClick("home")}
          className="flex items-center space-x-2.5 text-left group cursor-pointer"
          title="Return to Vedanga AI Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-500 p-[1.5px] shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-slate-900 group-hover:text-amber-800 transition-colors block leading-tight">
              Vedanga AI
            </span>
            <div className="flex items-center space-x-1.5 text-[10px] text-emerald-700 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Vedic Engine Online</span>
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => handleNavClick("home")}
            className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === "home"
                ? "bg-white text-amber-900 font-bold shadow-xs border border-amber-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Home className="w-3.5 h-3.5 text-amber-600" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNavClick("kundli")}
            className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === "kundli"
                ? "bg-white text-amber-900 font-bold shadow-xs border border-amber-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Kundli</span>
          </button>

          <button
            onClick={() => handleNavClick("horoscope")}
            className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === "horoscope"
                ? "bg-white text-amber-900 font-bold shadow-xs border border-amber-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            <span>Horoscope</span>
          </button>

          <button
            onClick={() => handleNavClick("matching")}
            className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === "matching"
                ? "bg-white text-amber-900 font-bold shadow-xs border border-amber-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
            <span>Matching</span>
          </button>

          <button
            onClick={() => handleNavClick("learning")}
            className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === "learning"
                ? "bg-white text-amber-900 font-bold shadow-xs border border-amber-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Knowledge Hub</span>
          </button>

          <button
            onClick={() => handleNavClick("chat")}
            className={`px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === "chat"
                ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold shadow-xs"
                : "text-amber-800 bg-amber-50 hover:bg-amber-100"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Guru Chat</span>
          </button>
        </nav>

        {/* User Badge & Controls */}
        <div className="flex items-center space-x-2">
          {/* Birth Profile Location */}
          <button
            onClick={onOpenProfile}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-medium hover:bg-amber-100 transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span className="max-w-[120px] truncate">
              {user.pob ? user.pob.split("(")[0].trim() : "Birth Profile"}
            </span>
          </button>

          {/* User Profile Trigger */}
          <button
            onClick={onOpenProfile}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:border-amber-300 text-slate-900 text-xs font-semibold transition-all cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold">
              <User className="w-3 h-3" />
            </div>
            <span className="max-w-[100px] truncate">{user.name}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

