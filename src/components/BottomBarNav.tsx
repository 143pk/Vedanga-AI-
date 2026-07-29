import React from "react";
import { MessageSquare, Compass, Sun, BookOpen } from "lucide-react";
import { ActiveTab } from "../types";

interface BottomBarNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const BottomBarNav: React.FC<BottomBarNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    {
      id: "chat" as ActiveTab,
      label: "Guru Chat",
      icon: MessageSquare,
    },
    {
      id: "kundli" as ActiveTab,
      label: "Kundli",
      icon: Compass,
    },
    {
      id: "horoscope" as ActiveTab,
      label: "Horoscope",
      icon: Sun,
    },
    {
      id: "learning" as ActiveTab,
      label: "Learning",
      icon: BookOpen,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-amber-500/20 px-2 py-2">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 sm:px-2 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-md shadow-amber-500/10 scale-[1.02]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-1 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
              <span className="text-[11px] sm:text-xs tracking-tight truncate leading-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
