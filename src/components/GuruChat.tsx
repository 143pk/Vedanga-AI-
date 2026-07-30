import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, User, RefreshCw, Volume2, VolumeX, ShieldCheck, Star, Lightbulb, Lock, CheckCircle2, Smartphone, Shield, ArrowRight, X, QrCode, Copy, Check, ExternalLink, AlertCircle, Zap, RotateCcw } from "lucide-react";
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

export const GuruChat: React.FC<GuruChatProps> = ({ user, onUpdateUser }) => {
  // Check localStorage and backend status for subscription state
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    if (user.isSubscribed) return true;
    const stored = localStorage.getItem(`vedanga_sub_${user.email}`);
    return stored === "true";
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeUpiTab, setActiveUpiTab] = useState<"qr" | "intent" | "utr">("qr");

  // Custom UPI Order state from server
  const [orderData, setOrderData] = useState<{
    orderId: string;
    upiId: string;
    upiName: string;
    amount: number;
    upiUri: string;
    qrDataUri: string;
  } | null>(null);

  const [utrInput, setUtrInput] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

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

  // Sync subscription status with backend on mount
  useEffect(() => {
    if (user.email) {
      fetch(`/api/payment/status?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.isSubscribed) {
            setIsSubscribed(true);
            localStorage.setItem(`vedanga_sub_${user.email}`, "true");
            if (onUpdateUser && !user.isSubscribed) {
              onUpdateUser({ ...user, isSubscribed: true });
            }
          }
        })
        .catch(() => {});
    }
  }, [user.email]);

  // Real-time Auto-Approval Polling when Payment Modal is Open
  useEffect(() => {
    if (!showPaymentModal || !orderData || isSubscribed || paymentSuccess) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/check-order?orderId=${orderData.orderId}&email=${encodeURIComponent(user.email)}`);
        const data = await res.json();

        if (data.status === "success" || data.isSubscribed) {
          clearInterval(interval);
          setPaymentSuccess(true);
          setIsSubscribed(true);
          localStorage.setItem(`vedanga_sub_${user.email}`, "true");
          if (onUpdateUser) {
            onUpdateUser({ ...user, isSubscribed: true });
          }
          setTimeout(() => {
            setShowPaymentModal(false);
            setPaymentSuccess(false);
          }, 1800);
        }
      } catch (err) {
        console.warn("Auto-polling error:", err);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [showPaymentModal, orderData, isSubscribed, paymentSuccess, user.email]);

  // Auto-fetch order when modal is visible but orderData is missing
  useEffect(() => {
    if (showPaymentModal && !orderData && !orderLoading) {
      handleOpenPaymentModal();
    }
  }, [showPaymentModal, orderData, orderLoading]);

  // Create custom UPI order when opening modal
  const handleOpenPaymentModal = async () => {
    setShowPaymentModal(true);
    setPaymentError(null);
    setOrderLoading(true);
    try {
      const res = await fetch("/api/payment/create-upi-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderData(data);
      } else {
        setPaymentError(data.error || "Failed to create UPI order.");
      }
    } catch {
      setPaymentError("Network error initializing UPI order.");
    } finally {
      setOrderLoading(false);
    }
  };

  // Handle Copy Merchant UPI VPA
  const handleCopyUpi = () => {
    if (orderData?.upiId) {
      navigator.clipboard.writeText(orderData.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  // Verify custom UPI payment via UTR / Ref Code
  const handleVerifyUpiPayment = async (customUtr?: string) => {
    if (!orderData) return;
    setVerifyingPayment(true);
    setPaymentError(null);

    try {
      const res = await fetch("/api/payment/verify-upi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          email: user.email,
          utrCode: customUtr || utrInput,
        }),
      });

      const data = await res.json();
      if (data.success && data.isSubscribed) {
        setPaymentSuccess(true);
        setIsSubscribed(true);
        localStorage.setItem(`vedanga_sub_${user.email}`, "true");
        if (onUpdateUser) {
          onUpdateUser({ ...user, isSubscribed: true });
        }
        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentSuccess(false);
        }, 1800);
      } else {
        setPaymentError(data.error || "Verification failed. Please check your UTR code.");
      }
    } catch {
      setPaymentError("Failed to verify payment with custom gateway. Please try again.");
    } finally {
      setVerifyingPayment(false);
    }
  };

  // Instant Bypass Access for Testing
  const handleBypassAccess = () => {
    setIsSubscribed(true);
    setPaymentSuccess(true);
    localStorage.setItem(`vedanga_sub_${user.email}`, "true");
    if (onUpdateUser) {
      onUpdateUser({ ...user, isSubscribed: true });
    }
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentSuccess(false);
    }, 500);
  };

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
    if (!isSubscribed) {
      handleOpenPaymentModal();
      return;
    }

    const query = (textToSend || inputMsg).trim();
    if (!query || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMsg("");
    setLoading(true);

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
              {isSubscribed ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  <Star className="w-2.5 h-2.5 fill-amber-300" />
                  VIP Plan (₹199/mo)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300">
                  <Lock className="w-2.5 h-2.5" />
                  Requires Subscription (₹199/mo)
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Synced for {user.name} • {user.rashi} Moon • {user.lagna || "Aries"} Lagna
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isSubscribed && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs hover:scale-105 transition-all shadow-md cursor-pointer flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unlock ₹199/mo</span>
            </button>
          )}

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

      {/* PAYWALL BANNER WHEN NOT SUBSCRIBED */}
      {!isSubscribed && (
        <div className="my-3 p-4 bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border border-amber-500/40 rounded-2xl text-center backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-bl-xl uppercase tracking-wider">
            VIP Subscription
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h4 className="font-serif text-sm font-bold text-amber-200">
                  Unlock Unlimited 24/7 AI Kundli Chat — ₹199 / Month
                </h4>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Get instant, personalized guidance on career, marriage, Sade Sati, Dasha periods, and gemstones backed by exact Lahiri Ephemeris.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-amber-300/90 font-medium">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Unlimited Questions</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Complete Chart Analysis</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Cancel Anytime</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                onClick={handleOpenPaymentModal}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
              >
                <span>Subscribe @ ₹199/mo</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
              <button
                onClick={handleBypassAccess}
                className="px-4 py-2.5 rounded-xl bg-slate-800 border border-emerald-500/40 text-emerald-300 hover:bg-slate-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center justify-center space-x-1"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bypass / Free Access</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Quick Prompt Chips */}
      {messages.length < 3 && !loading && (
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
            placeholder={isSubscribed ? "Ask about love, job, Sade Sati, Kundli remedies..." : "Subscribe for ₹199/mo to start chatting with AI Guru..."}
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            disabled={loading}
            className="w-full bg-slate-900/90 border border-amber-500/30 focus:border-amber-400 rounded-2xl py-3.5 pl-4 pr-12 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none shadow-xl transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold hover:scale-105 disabled:opacity-40 transition-all cursor-pointer"
          >
            {isSubscribed ? <Send className="w-4 h-4 text-slate-950" /> : <Lock className="w-4 h-4 text-slate-950" />}
          </button>
        </div>
      </form>

      {/* Vedanga AI PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-amber-300 transition-colors p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Vedanga AI Heading */}
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="font-serif text-2xl font-bold text-amber-200">
                Vedanga AI
              </h3>
            </div>
            <p className="text-xs text-slate-400">Scan QR Code to activate AI Chat</p>

            {/* Payment Success State */}
            {paymentSuccess ? (
              <div className="py-8 animate-fade-in">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-3 animate-bounce" />
                <h4 className="font-serif text-lg font-bold text-amber-200">Payment Received!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Your Vedanga AI Subscription is now Active!
                </p>
              </div>
            ) : orderLoading ? (
              <div className="py-12">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
                <p className="text-xs text-amber-200 font-medium">Generating your unique QR Code...</p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {/* Micro Amount Highlight Box */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3">
                  <span className="text-[10px] text-amber-300 uppercase tracking-widest font-semibold block">
                    Pay Exact Micro Amount
                  </span>
                  <div className="text-3xl font-extrabold font-mono text-amber-200 mt-0.5">
                    ₹{orderData?.amount ? Number(orderData.amount).toFixed(2) : "199.15"}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Pay exact micro-amount (including paise) for instant automatic activation
                  </p>
                </div>

                {/* QR Code */}
                <div className="bg-white p-3 rounded-2xl shadow-xl border border-amber-500/40 inline-block mx-auto">
                  {orderData?.qrDataUri || orderData?.upiUri ? (
                    <img
                      src={
                        orderData?.qrDataUri ||
                        `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(orderData.upiUri)}`
                      }
                      alt="Vedanga AI Payment QR"
                      className="w-48 h-48 object-contain mx-auto"
                      onError={(e) => {
                        if (orderData?.upiUri) {
                          (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(orderData.upiUri)}`;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-48 h-48 bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-medium">
                      <RefreshCw className="w-5 h-5 text-amber-500 animate-spin mr-2" />
                      Loading QR Code...
                    </div>
                  )}
                </div>

                {/* Subtext */}
                <p className="text-xs text-slate-300 font-medium">
                  Scan with Google Pay, PhonePe, Paytm, or BHIM
                </p>

                {/* Quick UPI Intent Link & VPA Copy */}
                {orderData?.upiUri && (
                  <div className="pt-1 space-y-2">
                    <a
                      href={orderData.upiUri}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-center"
                    >
                      <Smartphone className="w-4 h-4 text-slate-950" />
                      <span>Open UPI App Directly</span>
                    </a>

                    <div className="flex items-center justify-between text-[11px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
                      <span className="text-slate-400 font-mono truncate max-w-[200px]">{orderData.upiId}</span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUpi ? "Copied" : "Copy VPA"}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Auto Verification Pulse */}
                <div className="flex items-center justify-center space-x-2 pt-1 text-[11px] text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Waiting for payment... Auto-activates on transfer</span>
                </div>

                {/* Instant Bypass Button for Testing */}
                <div className="pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={handleBypassAccess}
                    className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>⚡ Instant Bypass / Free Test Access</span>
                  </button>
                  <p className="text-[10px] text-slate-400 mt-1 text-center">
                    Click to unlock full chat features immediately for testing
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

