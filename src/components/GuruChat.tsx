import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, User, RefreshCw, Volume2, VolumeX, Lightbulb, RotateCcw, Lock, ShieldCheck, Zap } from "lucide-react";
import { ChatMessage, UserProfile } from "../types";
import { saveChatMessageToFirestore, getChatHistoryFromFirestore } from "../lib/firebase";

interface GuruChatProps {
  user: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
}

const QUICK_PROMPTS = [
  "What do my stars predict for my career & money this month?",
  "Am I going through Sade Sati or a major planetary Dasha?",
  "What Vedic astrology advice can improve peace and health in my house?",
  "How are my love and relationship transits looking right now?",
  "Which planetary alignment aligns with my Moon sign?",
];

const DEFAULT_WELCOME_MSG: ChatMessage = {
  id: "welcome-1",
  role: "guru",
  content: "Namaste & warm cosmic blessings dear seeker! 🌸✨ I am Vedanga AI, your dedicated Vedic astrology companion. I have loaded your Sidereal Natal Kundli Chart with all 9 Graha placements, your active Vimshottari Mahadasha, and house alignments.\n\nWhether you wish to explore career milestones, love & relationship transits, health & inner peace, or key planetary influences ahead, I am here to illuminate your path with deep traditional Vedic wisdom. How are you feeling today, and what specific query or situation has been on your mind lately?",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

// Check if user is the admin/owner (optionvortex@gmail.com) for unlimited access
const isUnlimitedUser = (email?: string): boolean => {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  return (
    cleanEmail === "optionvortex@gmail.com" ||
    cleanEmail.includes("optionvortex") ||
    cleanEmail === "seeker@vedanga.ai" ||
    cleanEmail.endsWith("@vedanga.ai")
  );
};

// Daily Question Count Helper using localStorage
const getTodayDateStr = () => new Date().toISOString().split("T")[0];

const getDailyQuestionCount = (email?: string): number => {
  try {
    const key = `vedanga_daily_q_count_${email || "guest"}`;
    const stored = localStorage.getItem(key);
    if (!stored) return 0;
    const data = JSON.parse(stored);
    if (data.date === getTodayDateStr()) {
      return Number(data.count) || 0;
    }
    return 0; // Reset for a new day
  } catch (e) {
    return 0;
  }
};

const incrementDailyQuestionCount = (email?: string): number => {
  try {
    const key = `vedanga_daily_q_count_${email || "guest"}`;
    const today = getTodayDateStr();
    const current = getDailyQuestionCount(email);
    const updated = current + 1;
    localStorage.setItem(key, JSON.stringify({ date: today, count: updated }));
    return updated;
  } catch (e) {
    console.error("Failed to increment question count:", e);
    return 1;
  }
};

export const GuruChat: React.FC<GuruChatProps> = ({ user }) => {
  // Chat Memory Persistence in localStorage per user
  const chatStorageKey = `vedanga_chat_history_${user.email || "guest"}`;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(chatStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load chat history:", e);
    }
    return [DEFAULT_WELCOME_MSG];
  });

  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioActive, setAudioActive] = useState(false);

  // Check for prefilled prompt from SEO CTA buttons
  useEffect(() => {
    const prefill = localStorage.getItem("vedanga_chat_prefill");
    if (prefill) {
      setInputMsg(prefill);
      localStorage.removeItem("vedanga_chat_prefill");
    }
  }, []);

  // Daily Question Count State
  const isUnlimited = isUnlimitedUser(user.email);
  const [dailyCount, setDailyCount] = useState<number>(() => getDailyQuestionCount(user.email));
  const MAX_DAILY_QUESTIONS = 5;

  // Save messages to localStorage whenever chat history updates
  useEffect(() => {
    try {
      localStorage.setItem(chatStorageKey, JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat history:", e);
    }
  }, [messages, chatStorageKey]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Reset Chat Memory
  const handleResetChat = () => {
    const confirmReset = window.confirm("Are you sure you want to reset your chat history?");
    if (!confirmReset) return;

    const resetMsg: ChatMessage = {
      ...DEFAULT_WELCOME_MSG,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([resetMsg]);
    try {
      localStorage.removeItem(chatStorageKey);
    } catch (e) {
      console.error("Failed to clear chat history:", e);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMsg).trim();
    if (!query || loading) return;

    // Check Daily 5-Question Limit for non-unlimited users
    if (!isUnlimited && dailyCount >= MAX_DAILY_QUESTIONS) {
      const limitReachedMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "guru",
        content: "🌸 Hari Om dear seeker! You have reached your 5 free AI questions limit for today. You get 5 free questions every single day. Please come back tomorrow for fresh daily insights!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, limitReachedMsg]);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMsg("");
    setLoading(true);

    // Increment question count for standard users
    if (!isUnlimited) {
      const newCount = incrementDailyQuestionCount(user.email);
      setDailyCount(newCount);
    }

    if (user.email) {
      saveChatMessageToFirestore(user.email, "user", query).catch(() => {});
    }

    try {
      const res = await fetch("/api/astrology/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          userProfile: user,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Guru is meditating. Please ask again.");
      }

      const guruMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "guru",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, guruMessage]);

      if (user.email) {
        saveChatMessageToFirestore(user.email, "assistant", data.reply).catch(() => {});
      }

      if (audioActive && "speechSynthesis" in window) {
        const synth = window.speechSynthesis;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(data.reply.replace(/[*#]/g, ""));
        utterance.rate = 0.95;
        utterance.pitch = 0.9;
        synth.speak(utterance);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "guru",
          content: "Om Shanti. Planetary transits are aligning. Please repeat your query, dear seeker.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const remainingQuestions = Math.max(0, MAX_DAILY_QUESTIONS - dailyCount);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl mx-auto px-3 sm:px-4 py-2 font-sans relative">
      {/* Top Bar Banner */}
      <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-3 mb-3 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-amber-200">Vedanga AI Oracle</h3>
              {isUnlimited ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-sm">
                  <ShieldCheck className="w-2.5 h-2.5 text-amber-400" />
                  Admin VIP • Unlimited AI Access
                </span>
              ) : (
                <span
                  className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    remainingQuestions > 0
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                      : "bg-rose-500/20 border-rose-500/40 text-rose-300"
                  }`}
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  {remainingQuestions > 0
                    ? `${remainingQuestions} / ${MAX_DAILY_QUESTIONS} Free Qs Today`
                    : "0 / 5 Daily Free Qs Left"}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Synced for {user.name} • {user.rashi} Moon • {user.lagna || "Aries"} Lagna
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAudioActive(!audioActive)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1 transition-all cursor-pointer ${
              audioActive
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200"
            }`}
            title="Toggle Guru Voice Audio"
          >
            {audioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Voice ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Voice OFF</span>
              </>
            )}
          </button>

          <button
            onClick={handleResetChat}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800/90 text-slate-400 hover:text-rose-300 hover:bg-slate-800 hover:border-rose-500/40 border border-slate-700 transition-all cursor-pointer flex items-center space-x-1"
            title="Reset Chat Memory"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-slate-100 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${
              msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                msg.role === "guru"
                  ? "bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-700 text-slate-950"
                  : "bg-purple-600/30 border border-purple-500/40 text-purple-200"
              }`}
            >
              {msg.role === "guru" ? (
                <Sparkles className="w-4 h-4 text-slate-950" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-lg ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/30 text-purple-100 rounded-tr-none"
                  : "bg-slate-900/90 border border-amber-500/30 text-slate-200 rounded-tl-none backdrop-blur-md"
              }`}
            >
              <div className="whitespace-pre-line font-serif leading-relaxed">
                {msg.content}
              </div>
              <div
                className={`text-[9px] mt-2 opacity-60 text-right ${
                  msg.role === "user" ? "text-purple-200" : "text-amber-300"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-amber-300/80 bg-amber-500/10 border border-amber-500/20 p-3 rounded-2xl w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span>Guru is calculating planetary house transits...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Daily Limit Warning Banner for standard users when 5/5 reached */}
      {!isUnlimited && dailyCount >= MAX_DAILY_QUESTIONS && (
        <div className="my-2 p-3 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/40 rounded-2xl text-center backdrop-blur-md shadow-lg flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-semibold text-amber-200">
            You've asked 5/5 free questions today! Your 5 free questions reset tomorrow.
          </span>
        </div>
      )}

      {/* Suggested Quick Prompt Chips */}
      {messages.length < 3 && !loading && (isUnlimited || dailyCount < MAX_DAILY_QUESTIONS) && (
        <div className="py-2">
          <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider mb-1.5 flex items-center space-x-1">
            <Lightbulb className="w-3 h-3" />
            <span>Ask Guru Acharya</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-amber-200 text-xs whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="pt-2"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder={
              !isUnlimited && dailyCount >= MAX_DAILY_QUESTIONS
                ? "Daily limit reached (5/5). Resets tomorrow..."
                : "Ask about love, job, Sade Sati, Kundli remedies..."
            }
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            disabled={loading || (!isUnlimited && dailyCount >= MAX_DAILY_QUESTIONS)}
            className="w-full bg-slate-900/90 border border-amber-500/30 focus:border-amber-400 rounded-2xl py-3.5 pl-4 pr-12 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none shadow-xl transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || (!isUnlimited && dailyCount >= MAX_DAILY_QUESTIONS)}
            className="absolute right-2 p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold hover:scale-105 disabled:opacity-40 transition-all cursor-pointer"
          >
            {!isUnlimited && dailyCount >= MAX_DAILY_QUESTIONS ? (
              <Lock className="w-4 h-4 text-slate-950" />
            ) : (
              <Send className="w-4 h-4 text-slate-950" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};


