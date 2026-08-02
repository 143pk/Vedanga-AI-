import React from "react";
import { Sparkles } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 selection:bg-amber-500/30 selection:text-amber-200">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-[2px] shadow-xl shadow-amber-500/10">
          <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-amber-300" />
          </div>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
          Vedanga AI
        </h1>
      </div>
    </div>
  );
}

