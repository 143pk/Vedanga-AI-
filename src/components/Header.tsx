import React from "react";
import { Sparkles, Compass, User, Home } from "lucide-react";
import { UserProfile } from "../types";

interface HeaderProps {
  user: UserProfile;
  onOpenProfile: () => void;
  onGoHome?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenProfile, onGoHome }) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-amber-500/20 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center space-x-2.5 text-left group cursor-pointer"
          title="Return to Home Landing Page"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-[1.5px] shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent group-hover:from-white group-hover:to-amber-300 transition-colors">
              Vedanga AI
            </span>
            <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Guru Online</span>
            </div>
          </div>
        </button>

        {/* User Badge & Controls */}
        <div className="flex items-center space-x-2">
          {/* Home Button */}
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-amber-500/20 text-slate-300 hover:text-amber-300 text-xs font-medium transition-all cursor-pointer"
              title="Home Page"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Home</span>
            </button>
          )}

          {/* Location / Profile Badge */}
          <button
            onClick={onOpenProfile}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-medium hover:bg-amber-500/20 transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="max-w-[120px] truncate">
              {user.pob ? user.pob.split("(")[0].trim() : "Birth Profile"}
            </span>
          </button>

          {/* User Name button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] text-amber-300">
              <User className="w-3 h-3" />
            </div>
            <span className="max-w-[100px] truncate">{user.name}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
