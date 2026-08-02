import React from "react";
import { MessageSquare, Compass, Sun, HeartHandshake, BookOpen } from "lucide-react";
import { ActiveTab } from "../types";

interface BottomBarNavProps {
  activeTab: ActiveTab | "home";
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
      id: "matching" as ActiveTab,
      label: "Matching",
      icon: HeartHandshake,
    },
    {
      id: "learning" as ActiveTab,
      label: "Knowledge Hub",
      icon: BookOpen,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200/80 px-2 py-2 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-amber-100/90 text-amber-900 font-bold border border-amber-300 shadow-xs scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 ${isActive ? "text-amber-700" : "text-slate-500"}`} />
              <span className="text-[10px] sm:text-[11px] tracking-tight truncate leading-tight font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

